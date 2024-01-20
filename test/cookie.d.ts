import { BaseStore, IStore } from "./types";
export declare class Cookie extends BaseStore implements IStore {
    keys(): string[];
    clear(): void;
    has(key: string): boolean;
    set(key: string, value: any, expires?: number, options?: {
        path: string;
        domain?: string;
        secure: boolean;
    }): boolean;
    /**
     * 通过指定key获取存储值
     * @param key
     * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
     */
    get(key: string): any;
    /**
     * 通过指定key获取存储值字符串
     * @param key
     * @returns 字符串值；如果key不存在或已过期返回null
     */
    getString(key: string): string | null;
    /**
     * 删除指定缓存
     * @param key
     */
    remove(key: string): boolean;
}
