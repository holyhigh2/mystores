/**
 * @jest-environment jsdom
 */
import "fake-indexeddb/auto";
import myss,{ StoreType } from './index'

myss.set('a',{a:1})
myss.set('b',/123/)
myss.set('c',new Date())
myss.set('d',-123)
myss.set('e',null)
myss.set('f',Infinity)

///////////////////////////////////////////// local store
test('local store',()=>{
    expect(myss.get('a')).toBeInstanceOf(Object);
    expect(myss.get('b')).toBeInstanceOf(RegExp);
    expect(myss.get('c')).toBeInstanceOf(Date);
    expect(myss.get('d')).toBe(-123);
    expect(myss.get('e')).toBeNull();
    expect(myss.get('f')).toBe(Infinity);

    console.log(myss.keys(),'local')
})

///////////////////////////////////////////// cookie store
test('cookie store',()=>{
    myss.options({
        type:StoreType.COOKIE
    })
    myss.set('a',{a:1})
    myss.set('b',/123/)
    myss.set('c',new Date())
    myss.set('d',-123)
    myss.set('e',null)
    myss.set('f',Infinity)


    expect(myss.get('a')).toBeInstanceOf(Object);
    expect(myss.get('b')).toBeInstanceOf(RegExp);
    expect(myss.get('c')).toBeInstanceOf(Date);
    expect(myss.get('d')).toBe(-123);
    expect(myss.get('e')).toBeNull();
    expect(myss.get('f')).toBe(Infinity);

    console.log(myss.keys(),'cookie')
})

///////////////////////////////////////////// Indexed store
test('indexed store',async ()=>{
    myss.options({
        type:StoreType.INDEXED
    })
    
    myss.set('a',{a:1})
    myss.set('b',/123/)
    myss.set('c',new Date())
    myss.set('d',-123)
    myss.set('e',null)
    myss.set('f',Infinity)

    expect(await myss.get('a')).toBeInstanceOf(Object);
    expect(await myss.get('b')).toBeInstanceOf(RegExp);
    expect(await myss.get('c')).toBeInstanceOf(Date);
    expect(await myss.get('d')).toBe(-123);
    expect(await myss.get('e')).toBeNull();
    expect(await myss.get('f')).toBe(Infinity);

    console.log(await myss.keys(),'indexed')
})

///////////////////////////////////////////// Multi instance
test('Multi instance',async ()=>{
    const Cookie = myss.getStore(StoreType.COOKIE)
    const Indexed = myss.getStore(StoreType.INDEXED)
    
    Cookie.set('a',{a:1})
    Cookie.set('b',/123/)
    Cookie.set('c',new Date())
    Indexed.set('d',-123)
    Indexed.set('e',null)
    Indexed.set('f',Infinity)

    expect(Cookie.get('a')).toBeInstanceOf(Object);
    expect(Cookie.get('b')).toBeInstanceOf(RegExp);
    expect(Cookie.get('c')).toBeInstanceOf(Date);
    expect(await Indexed.get('d')).toBe(-123);
    expect(await Indexed.get('e')).toBeNull();
    expect(await Indexed.get('f')).toBe(Infinity);

    console.log(Cookie.keys(),await Indexed.keys())
})