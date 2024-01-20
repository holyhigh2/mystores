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
declare function getStore(type: StoreType): Cookie | Indexed | Memory | Storage;
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
    options: (opts?: Options) => Options | undefined;
};
export default _default;
export { Options, StoreType } from "./types";
