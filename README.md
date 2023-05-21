
# MyStores
![npm](https://img.shields.io/npm/v/mystores)
![NPM](https://img.shields.io/npm/l/mystores)

A unified key-value web storage interface for localStorage/sessionStorage/cookie/indexedDB/...

## features
- Unified store APIs
- Multi-storage
- any type of value (un)serialize support
- expires setting support

## install

```
npm i mystores
```

## usage
```js
//1. write store
MyStore.set('a',{a:1})
MyStore.set('b',/123/)
MyStore.set('c',new Date())
MyStore.set('d',-123)
MyStore.set('e',null)
MyStore.set('f',Infinity)

//2. read store
MyStore.get('a')//get Object
MyStore.set('b',/123/)//get RegExp
MyStore.set('c',new Date())//get Date

//3. get all keys
MyStore.keys()
```

## API
```ts
import Store from 'mystores'

//Set store type. Default 'store'
Store.type = 'store'|'cookie'|'indexed';

//The 'options' is only supported when storeType is set to 'cookie'
Store.set(key:string,value:any,expires?:number,options?:{path:string,domain?:string,secure:boolean}):boolean|Promise<boolean>

//get store
Store.get(key: string):any|Promise<any>

//The return value will always be 'null' when storeType is set to 'indexed' 
Store.getString(key: string):string|null

Store.remove(key:string):boolean|Promise<boolean>

Store.has(key:string):boolean|Promise<boolean>

//get all keys
Store.keys():string[] | Promise<string[]>

//clear all
Store.clear()
```
*** That all return value of functions will be changed to Promise when storeType is set to 'indexed' ***

## demo
见test/index.spec.ts