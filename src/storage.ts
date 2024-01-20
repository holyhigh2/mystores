import { each, flatMap, startsWith } from "myfx";
import { BaseStore, IStore, StoreType } from "./types";

/**
 * local & session
 */
export class Storage extends BaseStore implements IStore {
  #storage: globalThis.Storage;
  constructor(type: StoreType) {
    super();
    this.#storage = type === StoreType.LOCAL ? localStorage : sessionStorage;
  }
  keys(): string[] {
    return flatMap(Object.keys(this.#storage), (key) =>
      startsWith(key, this.opts.prefix) ? key : []
    );
  }
  clear(): void {
    each(this.keys(), (key) => {
      if (startsWith(key, this.opts.prefix)) {
        this.#storage.removeItem(key);
      }
    });
  }
  has(key: string): boolean {
    const k = this.getKey(key);
    return !!this.#storage.getItem(this.getKey(k));
  }
  set(key: string, value: any, expires?: number): boolean {
    if (expires == 0) return false;
    const k = this.getKey(key);
    const [dataStr, dataType] = this.opts.serializer(value);
    let exp = expires || -1;

    const myVal = [
      exp < 0 ? expires : Date.now() + exp * 1000,
      dataStr,
      dataType,
    ];
    this.#storage.setItem(k, JSON.stringify(myVal));
    return true;
  }

  /**
   * 通过指定key获取存储值
   * @param key
   * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
   */
  get(key: string): any {
    const k = this.getKey(key);
    let storeStr = this.#storage.getItem(k);
    if (storeStr) {
      const [expires, dataStr, dataType] = JSON.parse(storeStr);
      if (parseInt(expires) < Date.now()) {
        this.#storage.removeItem(k);
        return null;
      }
      return this.opts.unserializer(dataStr, dataType);
    }
    return null;
  }

  /**
   * 通过指定key获取存储值字符串
   * @param key
   * @returns 字符串值；如果key不存在或已过期返回null
   */
  getString(key: string): string | null {
    const k = this.getKey(key);
    let storeStr = this.#storage.getItem(k);
    if (storeStr) {
      const [expires, dataStr] = JSON.parse(storeStr);
      if (parseInt(expires) < Date.now()) {
        this.#storage.removeItem(k);
        return null;
      }
      return dataStr;
    }
    return null;
  }

  /**
   * 删除指定缓存
   * @param key
   */
  remove(key: string): boolean {
    const k = this.getKey(key);
    if (!this.has(key)) return false;
    this.#storage.removeItem(k);
    return true;
  }
}
