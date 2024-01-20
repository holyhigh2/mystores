import { Options, StoreType } from "./types";
import { Storage } from "./storage";
import { Cookie } from "./cookie";
import { Indexed } from "./indexed";
import { Memory } from "./memory";

/**
 * 提供基于localStorage/sessionStorage/cookie/indexedDB的统一存储API，
 * 并提供扩展特性以方便使用
 * @author holyhigh
 */

/**
 * 获取一个store并使用
 * @param type
 */
function getStore(type: StoreType) {
  switch (type) {
    case StoreType.COOKIE:
      return new Cookie();
    case StoreType.INDEXED:
      return new Indexed();
    case StoreType.MEMORY:
      return new Memory();
    case StoreType.SESSION:
      return new Storage(StoreType.SESSION);
    case StoreType.LOCAL:
    default:
      return new Storage(StoreType.LOCAL);
  }
}

let InnerStore: Storage | Cookie | Indexed | Memory = new Storage(
  StoreType.LOCAL
);

export default {
  set: (
    key: string,
    value: any,
    expires?: number,
    options?: { path: string; domain?: string; secure: boolean }
  ) => {
    return InnerStore.set.call(InnerStore, key, value, expires, options);
  },
  get: (key: string) => {
    return InnerStore.get.call(InnerStore, key);
  },
  getString: (key: string) => {
    return InnerStore.getString.call(InnerStore, key);
  },
  remove: (key: string) => {
    return InnerStore.remove.call(InnerStore, key);
  },
  keys: () => {
    return InnerStore.keys.call(InnerStore);
  },
  has: (key: string) => {
    return InnerStore.has.call(InnerStore, key);
  },
  clear: () => {
    return InnerStore.clear.call(InnerStore);
  },
  getStore,
  options: (opts?: Options) => {
    if (opts) {
      InnerStore.options(opts);

      if (opts.type) {
        InnerStore = getStore(opts.type);
      }
    } else {
      return InnerStore.options();
    }
  },
};

export { Options, StoreType } from "./types";
