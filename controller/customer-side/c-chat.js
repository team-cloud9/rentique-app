/*
  @ By: Carlos
 */
import { auth } from "../../../services/business-side/firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { ChatService } from "../../../services/customer-side/ChatService.js";
import { profileService } from "../../../services/business-side/ProfileService.js";
import { getBusinessByProfileId } from "../../../services/customer-side/BusinessService.js";


let currentUserId = null;
let activeChatId = null;
let unsubscribeChatList = null;
let unsubscribeMessages = null;


const chatContainer = document.querySelector('.chat-container');
const chatListEl = document.getElementById('chatList');
const messagesContainerEl = document.getElementById('messagesContainer');
const messagesAreaEl = document.getElementById('messagesArea');
const chatTitleEl = document.getElementById('chatTitle');
const messageInputEl = document.getElementById('messageInput');
const sendButtonEl = document.getElementById('sendButton');
const backToChatListBtn = document.getElementById('backToChatListBtn');


onAuthStateChanged(auth, user => {
    if (user) {
        currentUserId = user.uid;
        initializeApp(user);
    } else {
        window.location.href = './auth-login-customer.html';
    }
});

async function initializeApp(user) {
    sendButtonEl.addEventListener('click', handleSendMessage);
    messageInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    backToChatListBtn.addEventListener('click', () => {
        chatContainer.classList.remove('chat-view-active');
        if (unsubscribeMessages) unsubscribeMessages();
        activeChatId = null;
    });

    listenForChats();
    const headerElement = document.querySelector("#header-placeholder header");
    if (headerElement) {
        //revised to match design
        // headerElement.style.padding = "1.3rem 0 0 0";
        console.log("[b-chat.js] Header padding adjusted for compact view.");
    }
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedChatId = urlParams.get('id');

    if (preselectedChatId) {
        console.log(`[b-chat.js] Pre-selecting chat from URL: ${preselectedChatId}`);

        try {
            const enrichedChat = await ChatService.getChatDataById(preselectedChatId, currentUserId);

            if (enrichedChat) {
                chatContainer.classList.add('chat-view-active');
                selectChat(enrichedChat.id, enrichedChat.chatPartner.name);
            } else {
                console.error(`[b-chat.js] Chat with ID ${preselectedChatId} from URL not found or invalid.`);
            }
        } catch (error) {
            console.error("Error pre-selecting chat:", error);
        }
    }
}

function listenForChats() {
    if (unsubscribeChatList) unsubscribeChatList();

    unsubscribeChatList = ChatService.listenForChatList(currentUserId, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added" || change.type === "modified") {
                renderChatItem(change.doc);
            }
            if (change.type === "removed") {
                const chatItem = document.querySelector(`.chat-item[data-chat-id="${change.doc.id}"]`);
                if (chatItem) chatItem.remove();
            }
        });
    });
}


async function renderChatItem(chatDoc) {
    const chatData = chatDoc.data();
    const otherParticipantId = chatData.participantIDs.find(id => id !== currentUserId);

    if (!otherParticipantId) return;
    const businessProfile = await getBusinessByProfileId(otherParticipantId);

    let chatName = 'Unknown Business';
    let avatarUrl = 'https://via.placeholder.com/48';

    if (businessProfile) {
        chatName = businessProfile.businessName;
        avatarUrl = businessProfile.brandImageUrl || avatarUrl;
    } else {
        const ownerProfile = await profileService.getProfileByUID(otherParticipantId);
        if (ownerProfile) {
            chatName = ownerProfile.displayName || 'Unnamed User';
        }
    }

    let chatItem = document.querySelector(`.chat-item[data-chat-id="${chatDoc.id}"]`);
    if (!chatItem) {
        chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.dataset.chatId = chatDoc.id;
    }

    let timeString = '';
    if (chatData.lastMessageTimestamp) {
        timeString = new Date(chatData.lastMessageTimestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    chatItem.innerHTML = `
      <div class="chat-avatar" style="background-image: url(${avatarUrl})"></div>
      <div class="chat-info">
        <div class="chat-info-header">
          <span class="chat-name">${chatName}</span>
          <span class="chat-time">${timeString}</span>
        </div>
        <p class="chat-preview">${chatData.lastMessageText || 'No messages yet'}</p>
      </div>
      <svg class="chat-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
    `;
    chatItem.addEventListener('click', () => {
        chatContainer.classList.add('chat-view-active');
        selectChat(chatDoc.id, chatName);
    });

    chatListEl.prepend(chatItem);
}


function selectChat(chatId, otherUserName) {
    if (activeChatId === chatId) return;

    activeChatId = chatId;
    chatTitleEl.textContent = otherUserName ? otherUserName.toUpperCase() : "CHAT";
    messagesContainerEl.innerHTML = '';
    if (unsubscribeMessages) unsubscribeMessages();
    unsubscribeMessages = ChatService.listenForMessages(chatId, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                renderMessage(change.doc);
            }
        });
        scrollToBottom();
    });
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.toggle('active', item.dataset.chatId === chatId);
    });
}

function renderMessage(messageDoc) {
    const msg = messageDoc.data();
    const isSent = msg.senderID === currentUserId;

    const row = document.createElement('div');
    row.className = `message-row ${isSent ? 'right' : 'left'}`;

    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isSent ? 'sent' : 'received'}`;
    bubble.textContent = msg.text;

    row.appendChild(bubble);
    messagesContainerEl.appendChild(row);
}

async function handleSendMessage() {
    const text = messageInputEl.value.trim();
    if (text === '' || !activeChatId) return;

    const messageText = text;
    messageInputEl.value = '';

    try {
        await ChatService.sendMessage(activeChatId, currentUserId, messageText);
    } catch (error) {
        console.error("Error sending message:", error);
        messageInputEl.value = messageText;
    }
}

function scrollToBottom() {
    messagesAreaEl.scrollTop = messagesAreaEl.scrollHeight;
}