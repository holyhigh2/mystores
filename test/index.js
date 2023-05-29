/**
   * mystores v0.1.2
   * A unified web storage interface for localStorage/sessionStorage/cookie/indexDB/...
   * @holyhigh2
   * https://github.com/holyhigh2/mystores
   */
  (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.myss = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */


    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }

    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    function isUndefined(v) {
        return v === undefined;
    }

    function isFunction(v) {
        return typeof v == 'function' || v instanceof Function;
    }

    function isString(v) {
        return typeof v === 'string' || v instanceof String;
    }

    function isArray(v) {
        return Array.isArray(v);
    }

    const PRIMITIVE_TYPES = [
        'string',
        'number',
        'bigint',
        'boolean',
        'undefined',
        'symbol',
    ];
    function isObject(v) {
        return null !== v && PRIMITIVE_TYPES.indexOf(typeof v) < 0;
    }

    function identity(v) {
        return v;
    }

    function toPath$1(path) {
        let chain = path;
        if (isArray(chain)) {
            chain = chain.join('.');
        }
        else {
            chain += '';
        }
        const rs = (chain + '')
            .replace(/\[([^\]]+)\]/gm, '.$1')
            .replace(/^\./g, '')
            .split('.');
        return rs;
    }

    function get(obj, path, defaultValue) {
        if (!isObject(obj))
            return defaultValue;
        const chain = toPath$1(path);
        let target = obj;
        for (let i = 0; i < chain.length; i++) {
            const seg = chain[i];
            target = target[seg];
            if (!target)
                break;
        }
        if (target === undefined)
            target = defaultValue;
        return target;
    }

    function prop(path) {
        return (obj) => {
            return get(obj, path);
        };
    }

    function toPath(path) {
        return toPath$1(path);
    }

    function isNil(v) {
        return v === null || v === undefined;
    }

    function eq(a, b) {
        if (Number.isNaN(a) && Number.isNaN(b))
            return true;
        return a === b;
    }

    function isMatchWith(target, props, comparator = eq) {
        if (isNil(props))
            return true;
        const ks = Object.keys(props);
        if (!isObject(target))
            return false;
        let rs = true;
        for (let i = ks.length; i--;) {
            const k = ks[i];
            const v1 = target[k];
            const v2 = props[k];
            if (isObject(v1) && isObject(v2)) {
                if (!isMatchWith(v1, v2, comparator)) {
                    rs = false;
                    break;
                }
            }
            else {
                if (!comparator(v1, v2, k, target, props)) {
                    rs = false;
                    break;
                }
            }
        }
        return rs;
    }

    function isMatch(object, props) {
        return isMatchWith(object, props, eq);
    }

    function matcher(props) {
        return (obj) => {
            return isMatch(obj, props);
        };
    }

    function iteratee(value) {
        if (isUndefined(value)) {
            return identity;
        }
        else if (isFunction(value)) {
            return value;
        }
        else if (isString(value)) {
            return prop(value);
        }
        else if (isArray(value)) {
            return prop(toPath(value));
        }
        else if (isObject(value)) {
            return matcher(value);
        }
        return () => false;
    }

    function isArrayLike(v) {
        if (isString(v) && v.length > 0)
            return true;
        if (!isObject(v))
            return false;
        const list = v;
        if (list.length !== undefined) {
            const proto = list.constructor.prototype;
            if (isFunction(proto.item))
                return true;
            if (isFunction(list[Symbol.iterator]))
                return true;
        }
        return false;
    }

    function isSet(v) {
        return v instanceof Set;
    }

    function isMap(v) {
        return v instanceof Map;
    }

    function _eachIterator(collection, callback, forRight) {
        let values;
        let keys;
        if (isString(collection) || isArrayLike(collection)) {
            let size = collection.length;
            if (forRight) {
                while (size--) {
                    const r = callback(collection[size], size, collection);
                    if (r === false)
                        return;
                }
            }
            else {
                for (let i = 0; i < size; i++) {
                    const r = callback(collection[i], i, collection);
                    if (r === false)
                        return;
                }
            }
        }
        else if (isSet(collection)) {
            let size = collection.size;
            if (forRight) {
                values = Array.from(collection);
                while (size--) {
                    const r = callback(values[size], size, collection);
                    if (r === false)
                        return;
                }
            }
            else {
                values = collection.values();
                for (let i = 0; i < size; i++) {
                    const r = callback(values.next().value, i, collection);
                    if (r === false)
                        return;
                }
            }
        }
        else if (isMap(collection)) {
            let size = collection.size;
            keys = collection.keys();
            values = collection.values();
            if (forRight) {
                keys = Array.from(keys);
                values = Array.from(values);
                while (size--) {
                    const r = callback(values[size], keys[size], collection);
                    if (r === false)
                        return;
                }
            }
            else {
                for (let i = 0; i < size; i++) {
                    const r = callback(values.next().value, keys.next().value, collection);
                    if (r === false)
                        return;
                }
            }
        }
        else if (isObject(collection)) {
            keys = Object.keys(collection);
            let size = keys.length;
            if (forRight) {
                while (size--) {
                    const k = keys[size];
                    const r = callback(collection[k], k, collection);
                    if (r === false)
                        return;
                }
            }
            else {
                for (let i = 0; i < size; i++) {
                    const k = keys[i];
                    const r = callback(collection[k], k, collection);
                    if (r === false)
                        return;
                }
            }
        }
    }

    function each(collection, callback) {
        _eachIterator(collection, callback, false);
    }

    function map(collection, itee) {
        const rs = [];
        const cb = iteratee(itee);
        each(collection, (v, k, c) => {
            const r = cb(v, k, c);
            rs.push(r);
        });
        return rs;
    }

    function keys(obj) {
        if (obj === null || obj === undefined)
            return [];
        return Object.keys(obj);
    }

    function values(obj) {
        return keys(obj).map((k) => obj[k]);
    }

    function toArray(collection) {
        if (isArray(collection))
            return collection.concat();
        if (isFunction(collection))
            return [collection];
        if (isSet(collection)) {
            return Array.from(collection);
        }
        else if (isString(collection)) {
            return collection.split('');
        }
        else if (isArrayLike(collection)) {
            return Array.from(collection);
        }
        else if (isMap(collection)) {
            return Array.from(collection.values());
        }
        else if (isObject(collection)) {
            return values(collection);
        }
        return [collection];
    }

    function flat(array, depth = 1) {
        if (depth < 1)
            return array.concat();
        const rs = toArray(array).reduce((acc, val) => {
            return acc.concat(Array.isArray(val) && depth > 0 ? flat(val, depth - 1) : val);
        }, []);
        return rs;
    }

    function flatMap(collection, itee, depth) {
        return flat(map(collection, itee), depth || 1);
    }

    function isNumber(v) {
        return typeof v === 'number' || v instanceof Number;
    }

    function isDate(v) {
        return v instanceof Date;
    }

    function toString(v) {
        if (isNil(v))
            return '';
        if (v === 0 && 1 / v < 0)
            return '-0';
        return v.toString();
    }

    function isRegExp(v) {
        return typeof v === 'object' && v instanceof RegExp;
    }

    function startsWith(str, searchStr, position) {
        return toString(str).startsWith(searchStr, position);
    }

    function isBoolean(v) {
        return typeof v === 'boolean' || v instanceof Boolean;
    }

    function isNaN(v) {
        return Number.isNaN(v);
    }

    function isNull(v) {
        return null === v;
    }

    var _Indexed_instances, _Indexed_db, _Indexed_listeners, _Indexed_on;
    const DEFAULT_PREFFIX = "_ms_";
    const Options = {
        storeType: 'store',
        serializer: JSON.stringify
    };
    function serializer(v) {
        if (isString(v))
            return [v, 'string'];
        if (isDate(v))
            return [v.getTime() + '', 'date'];
        if (isNumber(v))
            return [v + '', 'number'];
        if (isBoolean(v))
            return [v + '', 'boolean'];
        if (isUndefined(v))
            return ['', 'undefined'];
        if (isNull(v))
            return ['', 'null'];
        if (isNaN(v))
            return ['', 'nan'];
        if (isRegExp(v)) {
            let str = v.toString();
            return [str.substring(1, str.length - 1), 'exp'];
        }
        if (isFunction(v))
            return [v.toString(), 'function'];
        if (isObject(v))
            return [Options.serializer(v), 'json'];
        return ['$', 'string'];
    }
    function unserializer(dataStr, dataType) {
        switch (dataType) {
            case 'string': return dataStr;
            case 'date': return new Date(parseInt(dataStr));
            case 'number': return Number(dataStr);
            case 'boolean': return dataStr == 'true' ? true : false;
            case 'undefined': return undefined;
            case 'null': return null;
            case 'nan': return NaN;
            case 'exp': return new RegExp(dataStr);
            case 'function': return new Function(dataStr);
            case 'json': return JSON.parse(dataStr);
        }
    }
    function getKey(key) {
        return DEFAULT_PREFFIX + encodeURIComponent(key);
    }
    //local & session
    class Store {
        keys() {
            return flatMap(Object.keys(localStorage), key => startsWith(key, DEFAULT_PREFFIX) ? key : []);
        }
        clear() {
            each(this.keys(), key => {
                if (startsWith(key, DEFAULT_PREFFIX)) {
                    localStorage.removeItem(key);
                }
            });
        }
        has(key) {
            const k = getKey(key);
            return !!(localStorage.getItem(getKey(k)) || sessionStorage.getItem(getKey(k)));
        }
        set(key, value, expires) {
            if (expires == 0)
                return false;
            const k = getKey(key);
            const [dataStr, dataType] = serializer(value);
            if (!expires) {
                const myVal = [-1, dataStr, dataType];
                sessionStorage.setItem(k, JSON.stringify(myVal));
                return true;
            }
            let exp = expires || -1;
            const myVal = [exp < 0 ? expires : Date.now() + exp * 1000, dataStr, dataType];
            localStorage.setItem(k, JSON.stringify(myVal));
            return true;
        }
        /**
         * 通过指定key获取存储值
         * @param key
         * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
         */
        get(key) {
            const k = getKey(key);
            let storeStr = sessionStorage.getItem(k);
            if (storeStr) {
                const [expires, dataStr, dataType] = JSON.parse(storeStr);
                return unserializer(dataStr, dataType);
            }
            storeStr = localStorage.getItem(k);
            if (storeStr) {
                const [expires, dataStr, dataType] = JSON.parse(storeStr);
                if (parseInt(expires) < Date.now()) {
                    localStorage.removeItem(k);
                    return null;
                }
                return unserializer(dataStr, dataType);
            }
            return null;
        }
        /**
         * 通过指定key获取存储值字符串
         * @param key
         * @returns 字符串值；如果key不存在或已过期返回null
         */
        getString(key) {
            const k = getKey(key);
            let storeStr = sessionStorage.getItem(k);
            if (storeStr) {
                const [expires, dataStr] = JSON.parse(storeStr);
                return dataStr;
            }
            storeStr = localStorage.getItem(k);
            if (storeStr) {
                const [expires, dataStr] = JSON.parse(storeStr);
                if (parseInt(expires) < Date.now()) {
                    localStorage.removeItem(k);
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
        remove(key) {
            const k = getKey(key);
            if (!this.has(key))
                return false;
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
            return true;
        }
    }
    //cookie
    class Cookie {
        keys() {
            const keys = document.cookie.match(/(?:^|;)\s*([^=]*)=/mg);
            return flatMap(keys, key => startsWith(key.replace(/^;\s*/, ''), DEFAULT_PREFFIX) ? key.replace(/^;\s*/, '').replace('=', '') : []);
        }
        clear() {
            each(this.keys(), k => {
                k = k.replace(/^;\s*/, '');
                if (startsWith(k, DEFAULT_PREFFIX)) {
                    this.remove(k.replace(DEFAULT_PREFFIX, ''));
                }
            });
        }
        has(key) {
            const k = getKey(key);
            const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`), '$1');
            return !!storeStr;
        }
        set(key, value, expires, options) {
            if (expires == 0)
                return false;
            if (!key)
                return false;
            const k = getKey(key);
            const [dataStr, dataType] = serializer(value);
            const myVal = [dataStr, dataType];
            if (options === null || options === void 0 ? void 0 : options.path) {
                myVal.push(options.path);
            }
            if (options === null || options === void 0 ? void 0 : options.domain) {
                myVal.push(options.domain);
            }
            let val = k + '=' + JSON.stringify(myVal);
            if (expires) {
                const doomsday = new Date(0x7fffffff * 1e3).getTime();
                expires = Date.now() + (expires < 0 ? doomsday : expires * 1000);
                val += ';expires=' + expires;
            }
            if (options === null || options === void 0 ? void 0 : options.path) {
                val += ';path=' + options.path;
            }
            if (options === null || options === void 0 ? void 0 : options.domain) {
                val += ';domain=' + options.path;
            }
            if (options === null || options === void 0 ? void 0 : options.secure) {
                val += ';secure';
            }
            document.cookie = val;
            return true;
        }
        /**
         * 通过指定key获取存储值
         * @param key
         * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
         */
        get(key) {
            const k = getKey(key);
            const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`), '$1');
            if (storeStr) {
                const [dataStr, dataType] = JSON.parse(storeStr);
                return unserializer(dataStr, dataType);
            }
            return null;
        }
        /**
         * 通过指定key获取存储值字符串
         * @param key
         * @returns 字符串值；如果key不存在或已过期返回null
         */
        getString(key) {
            const k = getKey(key);
            const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`), '$1');
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
        remove(key) {
            const k = getKey(key);
            const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`), '$1');
            if (!storeStr)
                return false;
            const [dataStr, dataType, path, domain] = JSON.parse(storeStr);
            let str = k + '=;expires=' + new Date(-1).toUTCString();
            if (path) {
                str += ';path=' + path;
            }
            if (domain) {
                str += ';domain=' + domain;
            }
            document.cookie = str;
            return true;
        }
    }
    //inddexed
    const KEY_PATH = '_mystore_';
    let GlobalDB = null;
    class Indexed {
        constructor() {
            _Indexed_instances.add(this);
            _Indexed_db.set(this, void 0);
            _Indexed_listeners.set(this, []);
            const that = this;
            if (GlobalDB)
                return;
            const request = indexedDB.open('MyStore', 1);
            request.onupgradeneeded = function (e) {
                const db = GlobalDB = __classPrivateFieldSet(that, _Indexed_db, this.result, "f");
                db.createObjectStore("storage", { keyPath: KEY_PATH });
            };
            request.onsuccess = function (e) {
                GlobalDB = __classPrivateFieldSet(that, _Indexed_db, this.result, "f");
                //exec queue
                each(__classPrivateFieldGet(that, _Indexed_listeners, "f"), ({ cmd, res, args }) => {
                    let promise = cmd.call(that, ...args);
                    if (promise.then) {
                        promise.then((rs) => res(rs));
                    }
                });
            };
            request.onerror = function (e) {
                console.error(e);
            };
        }
        keys() {
            const db = __classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB;
            if (!db) {
                const that = this;
                const promise = new Promise((res, rej) => {
                    __classPrivateFieldGet(that, _Indexed_instances, "m", _Indexed_on).call(that, that.keys, res);
                });
                return promise;
            }
            return new Promise((res, rej) => {
                const objectStore = db.transaction('storage', 'readwrite').objectStore("storage");
                const req = objectStore.getAllKeys();
                req.onsuccess = function (ev) {
                    res(req.result);
                };
                req.onerror = function (ev) {
                    rej(ev);
                };
            });
        }
        clear() {
            const objectStore = (__classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB).transaction('storage', 'readwrite').objectStore("storage");
            objectStore.clear();
        }
        set(key, value, expires) {
            const k = getKey(key);
            const db = __classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB;
            if (!db) {
                const that = this;
                const promise = new Promise((res, rej) => {
                    __classPrivateFieldGet(that, _Indexed_instances, "m", _Indexed_on).call(that, that.set, res, key, value, expires);
                });
                return promise;
            }
            return new Promise((res, rej) => {
                const objectStore = db.transaction('storage', 'readwrite').objectStore("storage");
                const req = objectStore.put({ [KEY_PATH]: k, value, expires });
                req.onsuccess = function (ev) {
                    res(req.result.value);
                };
                req.onerror = function (ev) {
                    rej(ev);
                };
            });
        }
        get(key) {
            const k = getKey(key);
            const db = __classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB;
            if (!db) {
                const that = this;
                const promise = new Promise((res, rej) => {
                    __classPrivateFieldGet(that, _Indexed_instances, "m", _Indexed_on).call(that, that.get, res, key);
                });
                return promise;
            }
            return new Promise((res, rej) => {
                const objectStore = db.transaction('storage', 'readwrite').objectStore("storage");
                const req = objectStore.get(k);
                req.onsuccess = function (ev) {
                    res(req.result.value);
                };
                req.onerror = function (ev) {
                    rej(ev);
                };
            });
        }
        getString(key) {
            return null;
        }
        remove(key) {
            const k = getKey(key);
            const db = __classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB;
            if (!db) {
                const that = this;
                const promise = new Promise((res, rej) => {
                    __classPrivateFieldGet(that, _Indexed_instances, "m", _Indexed_on).call(that, that.remove, res, key);
                });
                return promise;
            }
            return new Promise((res, rej) => {
                const objectStore = db.transaction('storage', 'readwrite').objectStore("storage");
                const req = objectStore.delete(k);
                req.onsuccess = function (ev) {
                    res(req.result.value);
                };
                req.onerror = function (ev) {
                    rej(ev);
                };
            });
        }
        has(key) {
            const k = getKey(key);
            const db = __classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB;
            if (!db) {
                const that = this;
                const promise = new Promise((res, rej) => {
                    __classPrivateFieldGet(that, _Indexed_instances, "m", _Indexed_on).call(that, that.has, res, key);
                });
                return promise;
            }
            return new Promise((res, rej) => {
                const objectStore = db.transaction('storage', 'readwrite').objectStore("storage");
                const req = objectStore.get(k);
                req.onsuccess = function (ev) {
                    res(!!req.result);
                };
                req.onerror = function (ev) {
                    rej(ev);
                };
            });
        }
    }
    _Indexed_db = new WeakMap(), _Indexed_listeners = new WeakMap(), _Indexed_instances = new WeakSet(), _Indexed_on = function _Indexed_on(cmd, res, ...args) {
        let list = __classPrivateFieldGet(this, _Indexed_listeners, "f");
        if (!list) {
            list = [];
        }
        list.push({ cmd, res, args: args });
    };
    /**
     * 获取一个store并使用
     * @param type
     */
    function getStore(type) {
        switch (type) {
            case 'store': return new Store();
            case 'cookie': return new Cookie();
            case 'indexed': return new Indexed();
        }
        return new Store();
    }
    let InnerStore = new Store();
    var index = {
        set: (key, value, expires, options) => {
            return InnerStore.set.call(InnerStore, key, value, expires, options);
        },
        get: (key) => {
            return InnerStore.get.call(InnerStore, key);
        },
        getString: (key) => {
            return InnerStore.getString.call(InnerStore, key);
        },
        remove: (key) => {
            return InnerStore.remove.call(InnerStore, key);
        },
        keys: () => {
            return InnerStore.keys.call(InnerStore);
        },
        has: (key) => {
            return InnerStore.has.call(InnerStore, key);
        },
        clear: () => {
            return InnerStore.clear.call(InnerStore);
        },
        getStore,
        set type(v) {
            Options.storeType = v;
            InnerStore = getStore(v);
        },
        get type() {
            return Options.storeType;
        },
    };

    return index;

}));
