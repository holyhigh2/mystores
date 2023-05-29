# MyStores
![npm](https://img.shields.io/npm/v/mystores)
![NPM](https://img.shields.io/npm/l/mystores)

A unified key-value web storage interface for localStorage/sessionStorage/cookie/indexedDB/...

## Features
- Unified store APIs
- Multi-storage
- Value (un)serialize support
- Expires setting support

## Install

```
npm i mystores
```

## Usage
```js
//1. Write store
myss.set('a',{a:1})
myss.set('b',/123/)
myss.set('c',new Date())
myss.set('d',-123)
myss.set('e',null)
myss.set('f',Infinity)
myss.set('blob',new window.Blob(...))// for indexed only

//2. Read store
myss.get('a')//get Object
myss.get('b')//get RegExp
myss.get('c')//get Date
myss.get('blob')//get blob

//3. Get all keys
myss.keys()

//4. Multi instance
const Cookie = myss.getStore('cookie')
const InDB = myss.getStore('indexed')

Cookie.set('a',{a:1})
Cookie.set('b',/123/)
Cookie.set('c',new Date())
InDB.set('d',-123)
InDB.set('e',null)
InDB.set('f',Infinity)
```

## API
```ts
import myss from 'mystores'

//Set store type. Default 'store'
myss.type = 'store'|'cookie'|'indexed'

//The 'options' is only supported when storeType is set to 'cookie'
myss.set(key:string,value:any,expires?:number,options?:{path:string,domain?:string,secure:boolean}):boolean | Promise<boolean>

//Get store
myss.get(key: string):any|Promise<any>

//The return value will always be 'null' when storeType is set to 'indexed' 
myss.getString(key: string):string | null

myss.remove(key:string):boolean | Promise<boolean>

myss.has(key:string):boolean | Promise<boolean>

//Get all keys
myss.keys():string[] | Promise<string[]>

//Clear all
myss.clear()
```
*** All return values of functions will be changed to Promise when storeType is set to 'indexed' ***

## Demo
见test/index.spec.ts