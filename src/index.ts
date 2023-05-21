import { isString,isDate,isNumber,isObject,isBoolean,isFunction,isUndefined,isRegExp, isNull, isNaN, each, startsWith, map, flatMap } from "@holyhigh/func.js";

/**
 * 提供基于localStorage/sessionStorage/cookie/indexedDB的统一存储API，
 * 并提供扩展特性以方便使用
 * @author holyhigh
 */
type StoreType = 'store'|'cookie'|'indexed'
const DEFAULT_PREFFIX = "_ms_";

interface IStore{
  /**
   * 将任意类型值保存在指定key中，保存位置取决于storeType
   * @param key 字符串key
   * @param value 支持任意类型序列化
   * @param expires 过期时间，单位（秒）。为空时仅存在会话期间，小于0时永远不过期，为0时忽略设置
   * @param options 可选设置项，当storeType为cookie时，{path:'/',domain,secure:false}
   * @returns 设置成功返回true
   */
  set(key:string,value:any,expires?:number,options?:{path:string,domain?:string,secure:boolean}):boolean|Promise<boolean>

  /**
   * 通过指定key获取存储值
   * @param key 字符串key
   * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
   */
  get(key:string):any|Promise<any>

  /**
   * 通过指定key获取存储值字符串
   * @param key 字符串key
   * @returns 字符串值；如果key不存在或已过期返回null
   */
  getString(key:string):string|null|Promise<string|null>

  /**
   * 删除指定缓存
   * @param key 字符串key
   * @returns 删除成功返回true
   */
  remove(key:string):boolean|Promise<boolean>

  /**
   * 查询指定key是否存在缓存数据
   * @param key 字符串key
   */
  has(key:string):boolean|Promise<boolean>

  /**
   * 清除所有缓存（仅mystore）
   */
  clear():void

  /**
   * store中所有缓存的key数组（仅mystore）
   * @returns
   */
  keys():string[] | Promise<string[]>
}

const Options: {
  storeType: StoreType;
  serializer:(v:object)=>string
} = {
  storeType: 'store',
  serializer: JSON.stringify
}

function serializer(v:unknown):[string,string]{
  if(isString(v))return [v,'string'];
  if(isDate(v))return [v.getTime()+'','date']
  if(isNumber(v))return [v+'','number']
  if(isBoolean(v))return [v+'','boolean']
  if(isUndefined(v))return ['','undefined']
  if(isNull(v))return ['','null']
  if(isNaN(v))return ['','nan']
  if(isRegExp(v)){
    let str = v.toString()
    return [str.substring(1,str.length-1),'exp']
  }
  if(isFunction(v))return [v.toString(),'function']
  if(isObject(v))return [Options.serializer(v),'json']
  return ['$','string']
}

function unserializer(dataStr:string,dataType:string):any{
  switch(dataType){
    case 'string': return dataStr
    case 'date': return new Date(parseInt(dataStr))
    case 'number': return Number(dataStr)
    case 'boolean': return dataStr=='true'?true:false
    case 'undefined': return undefined
    case 'null': return null
    case 'nan': return NaN
    case 'exp': return new RegExp(dataStr)
    case 'function': return new Function(dataStr)
    case 'json': return JSON.parse(dataStr)
  }
}

function getKey(key:string):string{
  return DEFAULT_PREFFIX + encodeURIComponent(key)
}

//local & session
class Store implements IStore{
  keys(): string[] {
    return flatMap(Object.keys(localStorage),key=>startsWith(key,DEFAULT_PREFFIX)?key:[])
  }
  clear(): void {
    each(this.keys(),key=>{
      if(startsWith(key,DEFAULT_PREFFIX)){
        localStorage.removeItem(key)
      }
    })
  }
  has(key: string): boolean {
    const k = getKey(key)
    return !!(localStorage.getItem(getKey(k)) || sessionStorage.getItem(getKey(k)))
  }
  set(key:string,value:any,expires?:number):boolean{
    if(expires == 0)return false
    const k = getKey(key)
    const [dataStr,dataType] = serializer(value)
    if(!expires){
      const myVal = [-1,dataStr,dataType]
      sessionStorage.setItem(k,JSON.stringify(myVal))
      return true
    }
    let exp = expires || -1
    
    const myVal = [exp<0?expires:Date.now() + exp*1000,dataStr,dataType]
    localStorage.setItem(k,JSON.stringify(myVal))
    return true
  }

  /**
   * 通过指定key获取存储值
   * @param key 
   * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
   */
  get(key:string):any{
    const k = getKey(key)
    let storeStr = sessionStorage.getItem(k)
    if(storeStr){
      const [expires,dataStr,dataType] = JSON.parse(storeStr)
      return unserializer(dataStr,dataType)
    }
    storeStr = localStorage.getItem(k)
    if(storeStr){
      const [expires,dataStr,dataType] = JSON.parse(storeStr)
      if(parseInt(expires) < Date.now()){
        localStorage.removeItem(k)
        return null
      }
      return unserializer(dataStr,dataType)
    }
    return null
  }

  /**
   * 通过指定key获取存储值字符串
   * @param key 
   * @returns 字符串值；如果key不存在或已过期返回null
   */
  getString(key:string):string|null{
    const k = getKey(key)
    let storeStr = sessionStorage.getItem(k)
    if(storeStr){
      const [expires,dataStr] = JSON.parse(storeStr)
      return dataStr
    }
    storeStr = localStorage.getItem(k)
    if(storeStr){
      const [expires,dataStr] = JSON.parse(storeStr)
      if(parseInt(expires) < Date.now()){
        localStorage.removeItem(k)
        return null
      }
      return dataStr
    }
    return null
  }

  /**
   * 删除指定缓存
   * @param key 
   */
  remove(key:string):boolean{
    const k = getKey(key)
    if(!this.has(key))return false
    localStorage.removeItem(k)
    sessionStorage.removeItem(k)
    return true
  }

}
//cookie
class Cookie implements IStore{
  keys(): string[] {
    const keys = document.cookie.match(/(?:^|;)\s*([^=]*)=/mg)
    return flatMap(keys!,key=>startsWith(key.replace(/^;\s*/,''),DEFAULT_PREFFIX)?key.replace(/^;\s*/,'').replace('=',''):[])
  }
  clear(): void {
    each(this.keys(),k=>{
      k = k.replace(/^;\s*/,'')
      if(startsWith(k,DEFAULT_PREFFIX)){
        this.remove(k.replace(DEFAULT_PREFFIX,''))
      }
    })
  }
  has(key: string): boolean {
    const k = getKey(key)
    const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`),'$1')

    return !!storeStr
  }
  set(key:string,value:any,expires?:number,options?:{path:string,domain?:string,secure:boolean}):boolean{
    if(expires == 0)return false
    if (!key) return false
    const k = getKey(key)

    const [dataStr,dataType] = serializer(value)
    const myVal = [dataStr,dataType]
    if(options?.path){
      myVal.push(options.path)
    }
    if(options?.domain){
      myVal.push(options.domain)
    }

    let val = k + '=' + JSON.stringify(myVal)
    if(expires){
      const doomsday = new Date(0x7fffffff * 1e3).getTime()
      expires = Date.now() +(expires<0?doomsday :expires*1000)
      val += ';expires=' + expires
    }
    if(options?.path){
      val += ';path=' + options.path
    }
    if(options?.domain){
      val += ';domain=' + options.path
    }
    if(options?.secure){
      val += ';secure'
    }
    document.cookie = val
    return true
  }

  /**
   * 通过指定key获取存储值
   * @param key 
   * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
   */
  get(key:string):any{
    const k = getKey(key)
    const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`),'$1')
    if(storeStr){
      const [dataStr,dataType] = JSON.parse(storeStr)
      return unserializer(dataStr,dataType)
    }
    return null
  }

  /**
   * 通过指定key获取存储值字符串
   * @param key 
   * @returns 字符串值；如果key不存在或已过期返回null
   */
  getString(key:string):string|null{
    const k = getKey(key)
    const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`),'$1')
    if(storeStr){
      const [dataStr,dataType] = JSON.parse(storeStr)
      return dataStr
    }
    return null
  }

  /**
   * 删除指定缓存
   * @param key 
   */
  remove(key:string):boolean{
    const k = getKey(key)
    const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`),'$1')
    if(!storeStr)return false

    const [dataStr,dataType,path,domain] = JSON.parse(storeStr)
    let str = k+'=;expires='+new Date(-1).toUTCString()
    if(path){
      str += ';path='+path
    }if(domain){
      str += ';domain='+domain
    }
    document.cookie = str
    return true
  }

}
//inddexed
const KEY_PATH = '_mystore_'
let GlobalDB:any = null
class Indexed implements IStore{
  #db:any
  #listeners:any[] = []
  constructor(){
    const that = this
    if(GlobalDB)return

    const request = indexedDB.open('MyStore',1)
    request.onupgradeneeded = function(e){
      const db = GlobalDB = that.#db = this.result;
      db.createObjectStore("storage", {keyPath: KEY_PATH});
      console.log('xxx')
    }
    request.onsuccess = function(e) {
      GlobalDB = that.#db = this.result;

      //exec queue
      each(that.#listeners,({cmd,res,args})=>{
        let promise = cmd.call(that,...args)
        if(promise.then){
          promise.then((rs:any)=>res(rs))
        }
      })
    };
    request.onerror = function(e){
      console.error(e)
    }
  }
  #on(cmd:Function,res:Function,...args:any[]){
    let list = this.#listeners
    if(!list){
      list = []
    }
    list.push({cmd,res,args:args})
  }
  keys(): Promise<string[]> {
    const db = this.#db || GlobalDB
    if(!db){
      const that = this
      const promise = new Promise<string[]>((res,rej)=>{
        that.#on(that.keys,res)
      })
      return promise
    }

    return new Promise((res,rej)=>{
      const objectStore = db.transaction('storage', 'readwrite').objectStore("storage");
      const req = objectStore.getAllKeys()
      req.onsuccess = function(ev:any) {
        res(req.result);
      };
      req.onerror = function(ev:any) {
        rej(ev);
      };
    })
  }
  clear(): void {
    const objectStore = (this.#db || GlobalDB).transaction('storage', 'readwrite').objectStore("storage");
    objectStore.clear()
  }
  set(key: string, value: any, expires?: number): Promise<boolean> {
    const k = getKey(key)
    const db = this.#db || GlobalDB
    if(!db){
      const that = this
      const promise = new Promise<boolean>((res,rej)=>{
        that.#on(that.set,res,key,value,expires)
      })
      return promise
    }
    return new Promise((res,rej)=>{
      const objectStore = db.transaction('storage', 'readwrite').objectStore("storage");
      const req = objectStore.put({[KEY_PATH]:k,value,expires})
      req.onsuccess = function(ev:any) {
        res(req.result.value);
      };
      req.onerror = function(ev:any) {
        rej(ev);
      };
    })
  }
  get(key: string):Promise<any> {
    const k = getKey(key)
    const db = this.#db || GlobalDB
    if(!db){
      const that = this
      const promise = new Promise<any>((res,rej)=>{
        that.#on(that.get,res,key)
      })
      return promise
    }

    return new Promise((res,rej)=>{
      const objectStore = db.transaction('storage', 'readwrite').objectStore("storage");
      const req = objectStore.get(k)
      req.onsuccess = function(ev:any) {
        res(req.result.value);
      };
      req.onerror = function(ev:any) {
        rej(ev);
      };
    })
    
  }
  getString(key: string): null {
    return null
  }
  remove(key: string): Promise<boolean> {
    const k = getKey(key)
    const db = this.#db || GlobalDB
    if(!db){
      const that = this
      const promise = new Promise<boolean>((res,rej)=>{
        that.#on(that.remove,res,key)
      })
      return promise
    }

    return new Promise((res,rej)=>{
      const objectStore = db.transaction('storage', 'readwrite').objectStore("storage");
      const req = objectStore.delete(k)
      req.onsuccess = function(ev:any) {
        res(req.result.value);
      };
      req.onerror = function(ev:any) {
        rej(ev);
      };
    })
  }
  has(key: string): Promise<boolean> {
    const k = getKey(key)
    const db = this.#db || GlobalDB
    if(!db){
      const that = this
      const promise = new Promise<boolean>((res,rej)=>{
        that.#on(that.has,res,key)
      })
      return promise
    }

    return new Promise((res,rej)=>{
      const objectStore = db.transaction('storage', 'readwrite').objectStore("storage");
      const req = objectStore.get(k)
      req.onsuccess = function(ev:any) {
        res(!!req.result);
      };
      req.onerror = function(ev:any) {
        rej(ev);
      };
    })
  }
  
}

/**
 * 获取一个store并使用
 * @param type 
 */
function getStore(type:StoreType){
  switch(type){
    case 'store':return new Store()
    case 'cookie':return new Cookie()
    case 'indexed':return new Indexed()
  }
  return new Store() 
}

let InnerStore:Store|Cookie|Indexed = new Store()

export default {
  set:(key:string,value:any,expires?:number,options?:{path:string,domain?:string,secure:boolean})=>{
    return InnerStore.set.call(InnerStore,key,value,expires,options)
  },
  get:(key:string)=>{    
    return InnerStore.get.call(InnerStore,key)
  },
  getString:(key:string)=>{
    return InnerStore.getString.call(InnerStore,key)
  },
  remove:(key:string)=>{
    return InnerStore.remove.call(InnerStore,key)
  },
  keys:()=>{
    return InnerStore.keys.call(InnerStore)
  },
  has:(key:string)=>{
    return InnerStore.has.call(InnerStore,key)
  },
  clear:()=>{
    return InnerStore.clear.call(InnerStore)
  },
  getStore,
  set type(v: StoreType) {
    Options.storeType = v;
    InnerStore = getStore(v)
  },
  get type() {
    return Options.storeType;
  },
}