/**
 * 提供基于localStorage/sessionStorage/cookie/indexedDB的统一存储API，
 * 并提供扩展特性以方便使用
 * @author holyhigh
 */
type StoreType = 'store' | 'cookie' | 'indexed';
interface IStore {
    /**
     * 将任意类型值保存在指定key中，保存位置取决于storeType
     * @param key 字符串key
     * @param value 支持任意类型序列化
     * @param expires 过期时间，单位（秒）。为空时仅存在会话期间，小于0时永远不过期，为0时忽略设置
     * @param options 可选设置项，当storeType为cookie时，{path:'/',domain,secure:false}
     * @returns 设置成功返回true
     */
    set(key: string, value: any, expires?: number, options?: {
        path: string;
        domain?: string;
        secure: boolean;
    }): boolean | Promise<boolean>;
    /**
     * 通过指定key获取存储值
     * @param key 字符串key
     * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
     */
    get(key: string): any | Promise<any>;
    /**
     * 通过指定key获取存储值字符串
     * @param key 字符串key
     * @returns 字符串值；如果key不存在或已过期返回null
     */
    getString(key: string): string | null | Promise<string | null>;
    /**
     * 删除指定缓存
     * @param key 字符串key
     * @returns 删除成功返回true
     */
    remove(key: string): boolean | Promise<boolean>;
    /**
     * 查询指定key是否存在缓存数据
     * @param key 字符串key
     */
    has(key: string): boolean | Promise<boolean>;
    /**
     * 清除所有缓存（仅mystore）
     */
    clear(): void;
    /**
     * store中所有缓存的key数组（仅mystore）
     * @returns
     */
    keys(): string[] | Promise<string[]>;
}
declare class Store implements IStore {
    keys(): string[];
    clear(): void;
    has(key: string): boolean;
    set(key: string, value: any, expires?: number): boolean;
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
declare class Cookie implements IStore {
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
declare class Indexed implements IStore {
    #private;
    constructor();
    keys(): Promise<string[]>;
    clear(): void;
    set(key: string, value: any, expires?: number): Promise<boolean>;
    get(key: string): Promise<any>;
    getString(key: string): null;
    remove(key: string): Promise<boolean>;
    has(key: string): Promise<boolean>;
}
/**
 * 获取一个store并使用
 * @param type
 */
declare function getStore(type: StoreType): Store | Cookie | Indexed;
declare const _default: {
    set: (key: string, value: any, expires?: number, options?: {
        path: string;
        domain?: string;
        secure: boolean;
    }) => any;
    get: (key: string) => any;
    getString: (key: string) => any;
    remove: (key: string) => any;
    keys: () => any;
    has: (key: string) => any;
    clear: () => any;
    getStore: typeof getStore;
    type: StoreType;
};
export default _default;
