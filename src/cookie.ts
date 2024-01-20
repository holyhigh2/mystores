import { each, flatMap, startsWith } from "myfx";
import { BaseStore, IStore } from "./types";

export class Cookie extends BaseStore implements IStore {
  keys(): string[] {
    const keys = document.cookie.match(/(?:^|;)\s*([^=]*)=/gm);
    return flatMap(keys!, (key) =>
      startsWith(key.replace(/^;\s*/, ""), this.opts.prefix)
        ? key.replace(/^;\s*/, "").replace("=", "")
        : []
    );
  }
  clear(): void {
    each(this.keys(), (k) => {
      k = k.replace(/^;\s*/, "");
      if (startsWith(k, this.opts.prefix)) {
        this.remove(k.replace(this.opts.prefix, ""));
      }
    });
  }
  has(key: string): boolean {
    const k = this.getKey(key);
    const storeStr = document.cookie.replace(
      new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`),
      "$1"
    );

    return !!storeStr;
  }
  set(
    key: string,
    value: any,
    expires?: number,
    options?: { path: string; domain?: string; secure: boolean }
  ): boolean {
    if (expires == 0) return false;
    if (!key) return false;
    const k = this.getKey(key);

    const [dataStr, dataType] = this.opts.serializer(value);
    const myVal = [dataStr, dataType];
    if (options?.path) {
      myVal.push(options.path);
    }
    if (options?.domain) {
      myVal.push(options.domain);
    }

    let val = k + "=" + JSON.stringify(myVal);
    if (expires) {
      const doomsday = new Date(0x7fffffff * 1e3).getTime();
      expires = Date.now() + (expires < 0 ? doomsday : expires * 1000);
      val += ";expires=" + expires;
    }
    if (options?.path) {
      val += ";path=" + options.path;
    }
    if (options?.domain) {
      val += ";domain=" + options.path;
    }
    if (options?.secure) {
      val += ";secure";
    }
    document.cookie = val;
    return true;
  }

  /**
   * 通过指定key获取存储值
   * @param key
   * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
   */
  get(key: string): any {
    const k = this.getKey(key);
    const storeStr = document.cookie.replace(
      new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`),
      "$1"
    );
    if (storeStr) {
      const [dataStr, dataType] = JSON.parse(storeStr);
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
    const storeStr = document.cookie.replace(
      new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`),
      "$1"
    );
    if (storeStr) {
      const [dataStr, dataType] = JSON.parse(storeStr);
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
    const storeStr = document.cookie.replace(
      new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`),
      "$1"
    );
    if (!storeStr) return false;

    const [dataStr, dataType, path, domain] = JSON.parse(storeStr);
    let str = k + "=;expires=" + new Date(-1).toUTCString();
    if (path) {
      str += ";path=" + path;
    }
    if (domain) {
      str += ";domain=" + domain;
    }
    document.cookie = str;
    return true;
  }
}
