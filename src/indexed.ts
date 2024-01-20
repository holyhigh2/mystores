import { each } from "myfx";
import { BaseStore, IStore } from "./types";

let GlobalDB: any = null;
export class Indexed extends BaseStore implements IStore {
  #db: any;
  #listeners: any[] = [];
  constructor() {
    super();
    const that = this;
    if (GlobalDB) return;

    let prefix = this.opts.prefix;
    const request = indexedDB.open("MyStore", 1);
    request.onupgradeneeded = function (e) {
      const db = (GlobalDB = that.#db = this.result);
      db.createObjectStore("storage", { keyPath: prefix });
    };
    request.onsuccess = function (e) {
      GlobalDB = that.#db = this.result;

      //exec queue
      each(that.#listeners, ({ cmd, res, args }) => {
        let promise = cmd.call(that, ...args);
        if (promise.then) {
          promise.then((rs: any) => res(rs));
        }
      });
    };
    request.onerror = function (e) {
      console.error(e);
    };
  }
  #on(cmd: Function, res: Function, ...args: any[]) {
    let list = this.#listeners;
    if (!list) {
      list = [];
    }
    list.push({ cmd, res, args: args });
  }
  keys(): Promise<string[]> {
    const db = this.#db || GlobalDB;
    if (!db) {
      const that = this;
      const promise = new Promise<string[]>((res, rej) => {
        that.#on(that.keys, res);
      });
      return promise;
    }

    return new Promise((res, rej) => {
      const objectStore = db
        .transaction("storage", "readwrite")
        .objectStore("storage");
      const req = objectStore.getAllKeys();
      req.onsuccess = function (ev: any) {
        res(req.result);
      };
      req.onerror = function (ev: any) {
        rej(ev);
      };
    });
  }
  clear(): void {
    const objectStore = (this.#db || GlobalDB)
      .transaction("storage", "readwrite")
      .objectStore("storage");
    objectStore.clear();
  }
  set(key: string, value: any, expires?: number): Promise<boolean> {
    const k = this.getKey(key);
    const db = this.#db || GlobalDB;
    if (!db) {
      const that = this;
      const promise = new Promise<boolean>((res, rej) => {
        that.#on(that.set, res, key, value, expires);
      });
      return promise;
    }
    return new Promise((res, rej) => {
      const objectStore = db
        .transaction("storage", "readwrite")
        .objectStore("storage");
      const req = objectStore.put({ [this.opts.prefix]: k, value, expires });
      req.onsuccess = function (ev: any) {
        res(req.result.value);
      };
      req.onerror = function (ev: any) {
        rej(ev);
      };
    });
  }
  get(key: string): Promise<any> {
    const k = this.getKey(key);
    const db = this.#db || GlobalDB;
    if (!db) {
      const that = this;
      const promise = new Promise<any>((res, rej) => {
        that.#on(that.get, res, key);
      });
      return promise;
    }

    return new Promise((res, rej) => {
      const objectStore = db
        .transaction("storage", "readwrite")
        .objectStore("storage");
      const req = objectStore.get(k);
      req.onsuccess = function (ev: any) {
        res(req.result.value);
      };
      req.onerror = function (ev: any) {
        rej(ev);
      };
    });
  }
  getString(key: string): null {
    return null;
  }
  remove(key: string): Promise<boolean> {
    const k = this.getKey(key);
    const db = this.#db || GlobalDB;
    if (!db) {
      const that = this;
      const promise = new Promise<boolean>((res, rej) => {
        that.#on(that.remove, res, key);
      });
      return promise;
    }

    return new Promise((res, rej) => {
      const objectStore = db
        .transaction("storage", "readwrite")
        .objectStore("storage");
      const req = objectStore.delete(k);
      req.onsuccess = function (ev: any) {
        res(req.result.value);
      };
      req.onerror = function (ev: any) {
        rej(ev);
      };
    });
  }
  has(key: string): Promise<boolean> {
    const k = this.getKey(key);
    const db = this.#db || GlobalDB;
    if (!db) {
      const that = this;
      const promise = new Promise<boolean>((res, rej) => {
        that.#on(that.has, res, key);
      });
      return promise;
    }

    return new Promise((res, rej) => {
      const objectStore = db
        .transaction("storage", "readwrite")
        .objectStore("storage");
      const req = objectStore.get(k);
      req.onsuccess = function (ev: any) {
        res(!!req.result);
      };
      req.onerror = function (ev: any) {
        rej(ev);
      };
    });
  }
}
