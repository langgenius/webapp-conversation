import type { ThoughtItem } from '@/app/components/chat/type'
import type { VisionFile } from '@/types/app'
import { SECRET_KEY } from '@/config'
import { subtle, getRandomValues  } from "uncrypto";

export type userSession = {
  mobile: string,
  channel: string,
}

function arrayBufferToHex(buffer: ArrayBuffer) {
  let byteArray = new Uint8Array(buffer);
  let hexParts = [];

  for(let i = 0; i < byteArray.length; i++) {
    let hex = byteArray[i].toString(16);
    let paddedHex = ('00' + hex).slice(-2);
    hexParts.push(paddedHex);
  }

  return hexParts.join('');
}

export async function generateHash(value: string, algorithm = 'SHA-256'): Promise<string> {
  const msgBuffer = new TextEncoder().encode(value);
  const hashBuffer = await subtle.digest(algorithm, msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const encrypt = async (value: Record<string, string>) => {
  const plainText = JSON.stringify(value);
  const ptUtf8 = new TextEncoder().encode(plainText);
  const pwUtf8 = new TextEncoder().encode(SECRET_KEY);
  const pwHash = await subtle.digest('SHA-256', pwUtf8);

  const iv = getRandomValues(new Uint8Array(12));
  const alg = { name: 'AES-GCM', iv: iv };
  const key = await subtle.importKey('raw', pwHash, alg, false, ['encrypt']);

  const encData = await subtle.encrypt(alg, key, ptUtf8);

  const encryptedDataArray = new Uint8Array(encData);
  const encryptedData = [...iv].map(b => ('00' + b.toString(16)).slice(-2)).join('') + Array.from(encryptedDataArray, byte => String.fromCharCode(byte)).join('');
  return btoa(encryptedData);
}

export const decrypt = async (encryptedData: string): Promise<Record<string, string>>  => {
  const ctStr = atob(encryptedData);
  const ctBytes = new Uint8Array(ctStr.split('').map(c => c.charCodeAt(0)));

  // Parse hexadecimal (base 16) iv and ciphertext from ctBytes array
  const iv = ctBytes.slice(0, 24).reduce<number[]>((result, v, i) => {
    if (i % 2 === 0) {
      result.push(parseInt(ctStr.substr(i, 2), 16));
    }
    return result;
  }, []);
  const ctNum = ctBytes.slice(24);

  const pwUtf8 = new TextEncoder().encode(SECRET_KEY);
  const pwHash = await subtle.digest('SHA-256', pwUtf8);

  const alg = { name: 'AES-GCM', iv: new Uint8Array(iv) };
  const key = await subtle.importKey('raw', pwHash, alg, false, ['decrypt']);

  const decBuffer = await subtle.decrypt(alg, key, ctNum);
  const decryptedData = new TextDecoder().decode(decBuffer);

  return JSON.parse(decryptedData);
}


export const sortAgentSorts = (list: ThoughtItem[]) => {
  if (!list)
    return list
  if (list.some(item => item.position === undefined))
    return list
  const temp = [...list]
  temp.sort((a, b) => a.position - b.position)
  return temp
}

export const addFileInfos = (list: ThoughtItem[], messageFiles: VisionFile[]) => {
  if (!list || !messageFiles)
    return list
  return list.map((item) => {
    if (item.files && item.files?.length > 0) {
      return {
        ...item,
        message_files: item.files.map(fileId => messageFiles.find(file => file.id === fileId)) as VisionFile[],
      }
    }
    return item
  })
}
