/**
 * @jest-environment jsdom
 */
import "fake-indexeddb/auto";
import MyStore from '../src/index'

MyStore.set('a',{a:1})
MyStore.set('b',/123/)
MyStore.set('c',new Date())
MyStore.set('d',-123)
MyStore.set('e',null)
MyStore.set('f',Infinity)

///////////////////////////////////////////// local store
test('local store',()=>{
    expect(MyStore.get('a')).toBeInstanceOf(Object);
    expect(MyStore.get('b')).toBeInstanceOf(RegExp);
    expect(MyStore.get('c')).toBeInstanceOf(Date);
    expect(MyStore.get('d')).toBe(-123);
    expect(MyStore.get('e')).toBeNull();
    expect(MyStore.get('f')).toBe(Infinity);

    console.log(MyStore.keys(),'local')
})

///////////////////////////////////////////// cookie store
test('cookie store',()=>{
    MyStore.type = 'cookie'
    MyStore.set('a',{a:1})
    MyStore.set('b',/123/)
    MyStore.set('c',new Date())
    MyStore.set('d',-123)
    MyStore.set('e',null)
    MyStore.set('f',Infinity)


    expect(MyStore.get('a')).toBeInstanceOf(Object);
    expect(MyStore.get('b')).toBeInstanceOf(RegExp);
    expect(MyStore.get('c')).toBeInstanceOf(Date);
    expect(MyStore.get('d')).toBe(-123);
    expect(MyStore.get('e')).toBeNull();
    expect(MyStore.get('f')).toBe(Infinity);

    console.log(MyStore.keys(),'cookie')
})

///////////////////////////////////////////// Indexed store
test('indexed store',async ()=>{
    MyStore.type = 'indexed'
    
    MyStore.set('a',{a:1})
    MyStore.set('b',/123/)
    MyStore.set('c',new Date())
    MyStore.set('d',-123)
    MyStore.set('e',null)
    MyStore.set('f',Infinity)

    expect(await MyStore.get('a')).toBeInstanceOf(Object);
    expect(await MyStore.get('b')).toBeInstanceOf(RegExp);
    expect(await MyStore.get('c')).toBeInstanceOf(Date);
    expect(await MyStore.get('d')).toBe(-123);
    expect(await MyStore.get('e')).toBeNull();
    expect(await MyStore.get('f')).toBe(Infinity);

    console.log(await MyStore.keys(),'indexed')
})

///////////////////////////////////////////// Multi instance
test('Multi instance',async ()=>{
    const Cookie = MyStore.getStore('cookie')
    const Store = MyStore.getStore('indexed')
    
    Cookie.set('a',{a:1})
    Cookie.set('b',/123/)
    Cookie.set('c',new Date())
    Store.set('d',-123)
    Store.set('e',null)
    Store.set('f',Infinity)

    expect(Cookie.get('a')).toBeInstanceOf(Object);
    expect(Cookie.get('b')).toBeInstanceOf(RegExp);
    expect(Cookie.get('c')).toBeInstanceOf(Date);
    expect(await Store.get('d')).toBe(-123);
    expect(await Store.get('e')).toBeNull();
    expect(await Store.get('f')).toBe(Infinity);

    console.log(Cookie.keys(),await Store.keys())
})