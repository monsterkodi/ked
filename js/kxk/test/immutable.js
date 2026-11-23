var toExport = {}
var imm, ma, nx2, nxt

import immutable from "../immutable.js"

toExport["immutable"] = async function ()
{
    imm = null
    await section("simple", async function ()
    {
        imm = immutable({arr:[],obj:{},int:0,str:'hello'})
        compare(imm.arr,[])
        compare(imm.obj,{})
        compare(imm.int,0)
        compare(imm.str,'hello')
        compare(immutable.isImmutable(imm),true)
        nxt = imm.set('arr',[1,2])
        compare(immutable.isImmutable(nxt),true)
        compare(imm.arr,[])
        compare(nxt.arr,[1,2])
        compare(nxt.obj,{})
        compare(nxt.int,0)
        compare(nxt.str,'hello')
        ma = nxt.arr.asMutable({deep:true})
        compare(immutable.isImmutable(ma),false)
        ma.push(3)
        nx2 = nxt.set('arr',ma)
        compare(nx2.arr,[1,2,3])
    })
    await section("throws", async function ()
    {
        try
        {
            imm['blah'] = 1
            compare(true,false)
        }
        catch (err)
        {
            compare(`${err}`.indexOf('Cannot add property blah, object is not extensible') >= 0,true)
        }
        try
        {
            imm.arr.push('world')
            compare(true,false)
        }
        catch (err)
        {
            compare(`${err}`.indexOf('The push method cannot be invoked on an Immutable data structure.') >= 0,true)
        }
        try
        {
            imm.int += 1
            compare(true,false)
        }
        catch (err)
        {
            compare(`${err}`.indexOf("Cannot assign to read only property 'int' of object") >= 0,true)
        }
    })
}
toExport["immutable"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1tdXRhYmxlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L2ltbXV0YWJsZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDUyxnQkFBQTs7OztJQUlMLE1BQU07OztRQVVGLE1BQU0sV0FDRSxPQUNBLE9BQ0EsSUFBSyxFQUNMLElBQUs7UUFFTCxRQUFSLElBQUk7UUFDSSxRQUFSLElBQUk7UUFDSSxRQUFSLElBQUksSUFBTTtRQUNGLFFBQVIsSUFBSSxJQUFNO1FBQ2dCLFFBQTFCLFVBQVUsWUFBWSxLQUFNO1FBRTVCLE1BQU0sSUFBSSxJQUFJLE9BQU8sRUFBRTtRQUNHLFFBQTFCLFVBQVUsWUFBWSxLQUFNO1FBRXBCLFFBQVIsSUFBSTtRQUVJLFFBQVIsSUFBSSxLQUFPLEVBQUU7UUFDTCxRQUFSLElBQUk7UUFDSSxRQUFSLElBQUksSUFBTTtRQUNGLFFBQVIsSUFBSSxJQUFNO1FBRVYsS0FBSyxJQUFJLElBQUksV0FBVSxLQUFLO1FBQ0gsUUFBekIsVUFBVSxZQUFZLElBQUs7UUFFM0IsR0FBRyxLQUFLO1FBRVIsTUFBTSxJQUFJLElBQUksTUFBTTtRQUNaLFFBQVIsSUFBSSxLQUFPLEVBQUUsRUFBRTs7Ozs7O1lBV1gsSUFBSSxVQUFVO1lBQ1QsUUFBTCxLQUFPOztlQUNMOztZQUMwRSxXQUF6RSxNQUFNLFFBQVEseURBQXlELEVBQUk7Ozs7WUFHOUUsSUFBSSxJQUFJLEtBQUs7WUFDUixRQUFMLEtBQU87O2VBQ0w7O1lBQ3lGLFdBQXhGLE1BQU0sUUFBUSx3RUFBd0UsRUFBSTs7OztZQUc3RixJQUFJLE9BQU87WUFDTixRQUFMLEtBQU87O2VBQ0w7O1lBQzJFLFdBQTFFLE1BQU0sUUFBUSwwREFBMEQsRUFBSSJ9
//# sourceURL=../../../kode/kxk/test/immutable.kode
