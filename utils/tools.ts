import type { ThoughtItem } from '@/app/components/chat/type'
import type { VisionFile } from '@/types/app'
import {Cache, createCache, memoryStore} from "cache-manager";

const getCacheKey = (user_id: string):string => {
  return `store-${user_id}`;
}

const memoryCache = createCache(memoryStore(), {
  ttl: 86400 * 1000 /*milliseconds*/,
}) as Cache;

export function pushCache<T>(key: string, value: T) {
  return memoryCache.set(key, value);
}

export function removeCache(key: string) {
  return memoryCache.del(key);
}

export function pullCache<T>(key: string, defaultValue: T|any = null) {
  return memoryCache.get<T>(key)
      .then((data:T|any) => {
        return data ? data : defaultValue;
      }, (error) => {
        Promise.resolve(defaultValue);
      });
}

export type userSession = {
  mobile: string,
  channel: string,
}

export const createSessionStore = (session_id: string) => {
  const sessionKey = getCacheKey(session_id);
  return {
    set(opt: userSession) {
      return pushCache<userSession>(sessionKey, opt);
    },
    get(): Promise<userSession> {
      return pullCache<userSession>(sessionKey);
    },
    flush() {
      return removeCache(sessionKey);
    }
  }
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
