import { auth, firestore as db } from "../../c-js/services/firebase-init.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// import { auth } from "../../c-js/services/firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { ChatService } from "../services/ChatService.js";
import { profileService } from "../services/ProfileService.js";

let currentUserId = null;
let activeChatId = null;
let unsubscribeChatList = null;
let unsubscribeMessages = null;

const chatContainer = document.querySelector(".chat-container");
const chatListEl = document.getElementById("chatList");
const messagesContainerEl = document.getElementById("messagesContainer");
const messageInputEl = document.getElementById("messageInput");
const sendButtonEl = document.getElementById("sendButton");
const chatTitleEl = document.getElementById("chatTitle");
const chatProductImgEl = document.getElementById("chatProductImg");
const chatProductNameEl = document.getElementById("chatProductName");
const backToChatListBtn = document.getElementById("backToChatListBtn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in as:", user.uid);

    currentUserId = user.uid;
    initializeChat();
  } else {
    window.location.href = "./sign-in.html";
  }
});

function initializeChat() {
  sendButtonEl.addEventListener("click", handleSendMessage);
  messageInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
  backToChatListBtn.addEventListener("click", () => {
    chatContainer.classList.remove("chat-view-active");
    if (unsubscribeMessages) unsubscribeMessages();
  });

  listenForChats();

  const urlParams = new URLSearchParams(window.location.search);
  const chatIdFromURL = urlParams.get("chatId");

  if (chatIdFromURL) {
    console.log("Auto-opening chat:", chatIdFromURL);
    openChatById(chatIdFromURL);
  }
}

function listenForChats() {
  if (unsubscribeChatList) unsubscribeChatList();

  console.log("Listening for chats for:", currentUserId);

  // Keep the generated list only once
  const renderedChats = new Set();

  unsubscribeChatList = ChatService.listenForChatList(
    currentUserId,
    async (snapshot) => {
      console.log("Chat snapshot size:", snapshot.size);

      snapshot.docChanges().forEach(async (change) => {
        const chatDoc = change.doc;
        const chatId = chatDoc.id;

        if (change.type === "added" && !renderedChats.has(chatId)) {
          await renderChatItem(chatDoc);
          renderedChats.add(chatId);
        }

        if (change.type === "modified") {
          // update previews
          const existingItem = chatListEl.querySelector(
            `[data-chat-id="${chatId}"]`
          );
          if (existingItem) {
            const chatData = chatDoc.data();
            const previewEl = existingItem.querySelector(".chat-preview");
            previewEl.textContent =
              chatData.lastMessageText || "No messages yet";

            const timeEl = existingItem.querySelector(".chat-time");
            const timeString = chatData.lastMessageTimestamp
              ? new Date(
                  chatData.lastMessageTimestamp.seconds * 1000
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";
            timeEl.textContent = timeString;
          }
        }
      });
    }
  );
}

async function renderChatItem(chatDoc) {
  const chatData = chatDoc.data();
  const otherUserId = chatData.participantIDs.find(
    (id) => id !== currentUserId
  );
  if (!otherUserId) return;

  let otherUser = await profileService.getProfileByUID(otherUserId);

  // take the data from businesses
  if (!otherUser) {
    const businessRef = doc(db, "businesses", otherUserId);
    const businessSnap = await getDoc(businessRef);
    if (businessSnap.exists()) {
      const data = businessSnap.data();
      otherUser = {
        displayName: data.businessName || "Business User",
        profileImageUrl: data.brandImageUrl || "",
      };
    }
  }

  if (!otherUser) return;

  const item = document.createElement("div");
  item.className = "chat-item";
  item.dataset.chatId = chatDoc.id;

  const productImg = chatData.productContext?.imageUrl || "";
  const timeString = chatData.lastMessageTimestamp
    ? new Date(chatData.lastMessageTimestamp.seconds * 1000).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : "";

  item.innerHTML = `
    <div class="chat-avatar" style="background-image:url(${
      otherUser.profileImageUrl || "https://via.placeholder.com/48"
    })"></div>
    <div class="chat-info">
      <div class="chat-info-header">
        <span class="chat-name">${otherUser.displayName || "Business"}</span>
        <span class="chat-time">${timeString}</span>
      </div>
      <p class="chat-preview">${
        chatData.lastMessageText || "No messages yet"
      }</p>
    </div>
  `;

  // open chat
  item.addEventListener("click", () => {
    selectChat(chatDoc.id, otherUser.displayName, chatData.productContext);
  });

  chatListEl.appendChild(item);
}

function selectChat(chatId, otherUserName, productContext) {
  if (activeChatId === chatId) return;
  activeChatId = chatId;
  chatContainer.classList.add("chat-view-active");

  chatTitleEl.textContent = otherUserName?.toUpperCase() || "CHAT";
  chatProductImgEl.src = productContext?.imageUrl || "";
  chatProductNameEl.textContent = productContext?.itemName || "";

  messagesContainerEl.innerHTML = "";
  if (unsubscribeMessages) unsubscribeMessages();

  unsubscribeMessages = ChatService.listenForMessages(chatId, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") renderMessage(change.doc);
    });
    scrollToBottom();
  });
}

function renderMessage(messageDoc) {
  const msg = messageDoc.data();
  const isSent = msg.senderID === currentUserId;

  const row = document.createElement("div");
  row.className = `message-row ${isSent ? "right" : "left"}`;

  const bubble = document.createElement("div");
  bubble.className = `message-bubble ${isSent ? "sent" : "received"}`;
  bubble.textContent = msg.text;

  row.appendChild(bubble);
  messagesContainerEl.appendChild(row);
}

async function handleSendMessage() {
  const text = messageInputEl.value.trim();
  if (!text || !activeChatId) return;

  messageInputEl.value = "";
  try {
    await ChatService.sendMessage(activeChatId, currentUserId, text);
  } catch (error) {
    console.error("Failed to send message:", error);
    messageInputEl.value = text;
  }
}

function scrollToBottom() {
  const area = document.getElementById("messagesArea");
  area.scrollTop = area.scrollHeight;
}

async function openChatById(chatId) {
  try {
    const chatData = await ChatService.getChatDataById(chatId, currentUserId);
    if (!chatData) {
      console.warn("⚠️ No chat data found for this ID");
      return;
    }

    const otherUser = chatData.otherUserProfile;
    const productContext = chatData.productContext;

    // refrect in the UI
    chatContainer.classList.add("chat-view-active");
    chatTitleEl.textContent = otherUser.displayName || "Business";
    chatProductImgEl.src = productContext?.imageUrl || "";
    chatProductNameEl.textContent = productContext?.itemName || "";

    // Load message
    messagesContainerEl.innerHTML = "";
    if (unsubscribeMessages) unsubscribeMessages();

    unsubscribeMessages = ChatService.listenForMessages(chatId, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") renderMessage(change.doc);
      });
      scrollToBottom();
    });

    activeChatId = chatId;
    console.log("Chat opened and listening for messages:", chatId);
  } catch (error) {
    console.error("Failed to open chat by ID:", error);
  }
}
