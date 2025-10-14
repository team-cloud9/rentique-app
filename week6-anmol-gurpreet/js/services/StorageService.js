/*
    SERVICE: StorageService
    DEVELOPER: Anmol
*/
import { storage } from "../services/firebase-init.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

function createUniqueStorageReference(path, fileName) {
  const uniqueName = `${Date.now()}-${fileName}`;
  return ref(storage, `${path}/${uniqueName}`);
}

async function uploadFileBytes(storageRef, file) {
  if (!file) {
    throw new Error("Upload failed: No file provided.");
  }
  await uploadBytes(storageRef, file);
}

// Uploads a single file and returns its public URL.
async function uploadFile(file, path) {
  console.log(`[StorageService] Uploading file '${file.name}' to path '${path}'.`);
  const storageRef = createUniqueStorageReference(path, file.name);
  await uploadFileBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  console.log(`[StorageService] File uploaded successfully. URL: ${downloadURL}`);
  return downloadURL;
}

// Uploads multiple files concurrently and returns their public URLs.
async function uploadMultipleFiles(files, path) {
  console.log(`[StorageService] Starting bulk upload of ${files.length} files to path '${path}'.`);
  const uploadPromises = files.map(file => uploadFile(file, path));
  const urls = await Promise.all(uploadPromises);
  console.log("[StorageService] Bulk upload complete.");
  return urls;
}

export const StorageService = {
  uploadFile: uploadFile,
  uploadMultipleFiles: uploadMultipleFiles,
};