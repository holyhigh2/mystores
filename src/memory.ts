import { get, set } from "myfx";
import { BaseStore, IStore } from "./types";
/**
 * globalThis
 */
export class Memory extends BaseStore implements IStore {
  constructor(){
    super()
    set(globalThis,this.opts.prefix,{})
  }
  keys(): string[] {
    return Object.keys(get(globalThis,this.opts.prefix))
  }
  clear(): void {
    set(globalThis,this.opts.prefix,{})
  }
  has(key: string): boolean {
    let k = encodeURIComponent(key)
    const mem = get<Record<string,unknown>>(globalThis,this.opts.prefix)
    return !!mem[k]
  }
  set(key: string, value: any): boolean {
    let k = encodeURIComponent(key)
    const mem = get<Record<string,unknown>>(globalThis,this.opts.prefix)
    mem[k] = value
    return true;
  }

  /**
   * 通过指定key获取存储值
   * @param key
   * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
   */
  get(key: string): any {
    const mem = get<Record<string,unknown>>(globalThis,this.opts.prefix)
    let k = encodeURIComponent(key)
    return mem[k];
  }

  /**
   * 通过指定key获取存储值字符串
   * @param key
   * @returns 字符串值；如果key不存在或已过期返回null
   */
  getString(key: string): string | null {
    let rs = this.get(key)
    return this.opts.serializer(rs)[0];
  }

  /**
   * 删除指定缓存
   * @param key
   */
  remove(key: string): boolean {
    if (!this.has(key)) return false;
    const mem = get<Record<string,unknown>>(globalThis,this.opts.prefix)
    let k = encodeURIComponent(key)
    mem[k] = null
    delete mem[k]
    return true;
  }
}
