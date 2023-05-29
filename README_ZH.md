# MyStores
![npm](https://img.shields.io/npm/v/mystores)
![NPM](https://img.shields.io/npm/l/mystores)

一个基于localStorage/sessionStorage/cookie/indexedDB的webstore统一键值操作API

## 特性
- 统一存储API
- 多类型store支持
- 支持任意数据序列化/反序列化
- 支持过期时间设置

## 安装

```
npm i mystores
```

## 用法
```js
//1. 写入缓存
myss.set('a',{a:1})
myss.set('b',/123/)
myss.set('c',new Date())
myss.set('d',-123)
myss.set('e',null)
myss.set('f',Infinity)
myss.set('blob',new window.Blob(...))// for indexed only

//2. 读取缓存
myss.get('a')//获取到对象
myss.get('b')//获取到正则对象
myss.get('c')//获取到date对象
myss.get('blob')///获取到blob对象

//3. 获取所有key
myss.keys()
```

## API
```ts
import myss from 'mystores'

//支持的store类型
myss.type = 'store'|'cookie'|'indexed';

//设置缓存。options参数仅在type为cookie时支持
myss.set(key:string,value:any,expires?:number,options?:{path:string,domain?:string,secure:boolean}):boolean|Promise<boolean>

//获取缓存值
myss.get(key: string):any|Promise<any>

//获取缓存值的字符串，当type为indexed时，永远返回null
myss.getString(key: string):string|null

//删除指定key缓存数据
myss.remove(key:string):boolean|Promise<boolean>

//检测指定key缓存是否存在
myss.has(key:string):boolean|Promise<boolean>

//获取所有缓存key
myss.keys():string[] | Promise<string[]>

//清除所有缓存
myss.clear()
```
***当type为indexed时，所有返回值非空API都变为Promise对象***

## demo
见test/index.spec.ts