import {
  isBoolean,
  isDate,
  isFunction,
  isNaN,
  isNull,
  isNumber,
  isObject,
  isRegExp,
  isString,
  isUndefined,
  merge,
} from "myfx";

export interface IStore {
  /**
   * 将任意类型值保存在指定key中，保存位置取决于storeType
   * @param key 字符串key
   * @param value 支持任意类型序列化
   * @param expires 过期时间，单位（秒）。为空时仅存在会话期间，小于0时永远不过期，为0时忽略设置
   * @param options 可选设置项，当storeType为cookie时，{path:'/',domain,secure:false}
   * @returns 设置成功返回true
   */
  set(
    key: string,
    value: any,
    expires?: number,
    options?: { path: string; domain?: string; secure: boolean }
  ): boolean | Promise<boolean>;

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

export class BaseStore {
  protected opts: {
    type: StoreType;
    prefix: string;
    serializer: (v: unknown) => [string, SerializeType];
    unserializer: (dataStr: string, dataType: SerializeType) => unknown;
  } = {
    prefix: "_myss_",
    type: StoreType.LOCAL,
    serializer: (v: unknown) => {
      if (isString(v)) return [v, SerializeType.STR];
      if (isDate(v)) return [v.getTime() + "", SerializeType.DATE];
      if (isNumber(v)) return [v + "", SerializeType.NUM];
      if (isBoolean(v)) return [v + "", SerializeType.BOOL];
      if (isUndefined(v)) return ["", SerializeType.UNDEF];
      if (isNull(v)) return ["", SerializeType.NULL];
      if (isNaN(v)) return ["", SerializeType.NAN];
      if (isRegExp(v)) {
        let str = v.toString();
        return [str.substring(1, str.length - 1), SerializeType.EXP];
      }
      if (isFunction(v)) return [v.toString(), SerializeType.FUNC];
      if (isObject(v)) return [JSON.stringify(v), SerializeType.JSON];
      return ["$", SerializeType.STR];
    },
    unserializer: (dataStr: string, dataType: SerializeType) => {
      switch (dataType) {
        case SerializeType.DATE:
          return new Date(parseInt(dataStr));
        case SerializeType.NUM:
          return Number(dataStr);
        case SerializeType.BOOL:
          return dataStr == "true" ? true : false;
        case SerializeType.UNDEF:
          return undefined;
        case SerializeType.NULL:
          return null;
        case SerializeType.NAN:
          return NaN;
        case SerializeType.EXP:
          return new RegExp(dataStr);
        case SerializeType.FUNC:
          return new Function(dataStr);
        case SerializeType.JSON:
          return JSON.parse(dataStr);
        case SerializeType.STR:
        default:
          return dataStr;
      }
    },
  };
  protected getKey(key: string): string {
    return this.opts.prefix + encodeURIComponent(key);
  }
  options(): Options;
  options(opts: Options): void;
  options(opts?: Options): void | Options {
    if (opts) merge(this.opts, opts);
    else {
      return this.opts;
    }
  }
}

export interface Options {
  type?: StoreType;
  prefix?: string;
  serializer?: (v: unknown) => [string, SerializeType];
  unserializer?: (dataStr: string, dataType: SerializeType) => unknown;
}

/**
 * 存储类型
 */
export enum StoreType{
    LOCAL = 'local',
    SESSION = 'session',
    COOKIE = 'cookie',
    INDEXED = 'indexed',
    MEMORY = 'mem'
}

/**
 * 序列化类型
 */
export enum SerializeType {
  STR = "string",
  DATE = "date",
  NUM = "number",
  BOOL = "boolean",
  UNDEF = "undefined",
  NULL = "null",
  NAN = "nan",
  EXP = "exp",
  FUNC = "function",
  JSON = "json",
}
