/*
    SERVICE: StorageService
    DEVELOPER: Anmol
*/
import { storage } from "./firebase-init.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

async function uploadFile(file, path) {
  if (!file) return null;
  console.log(`[StorageService] Uploading file '${file.name}' to path '${path}'.`);
  const uniqueName = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `${path}/${uniqueName}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  console.log(`[StorageService] File uploaded successfully. URL: ${downloadURL}`);
  return downloadURL;
}

async function uploadMultipleFiles(files, path) {
  console.log(`[StorageService] Starting bulk upload of ${files.length} files to path '${path}'.`);
  const uploadPromises = files.map(file => uploadFile(file, path));
  return await Promise.all(uploadPromises);
}

async function deleteFileByUrl(url) {
  if (!url) return;
  try {
    console.log(`[StorageService] Deleting file from URL: ${url}`);
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
    console.log(`[StorageService] File deleted successfully.`);
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      console.warn(`[StorageService] File not found for deletion (might have been already deleted): ${url}`);
    } else {
      console.error(`[StorageService] Error deleting file: ${url}`, error);
    }
  }
}

export const StorageService = {
  uploadFile,
  uploadMultipleFiles,
  deleteFileByUrl,
};