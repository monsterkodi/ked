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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1tdXRhYmxlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L2ltbXV0YWJsZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FRUyxnQkFBQTs7OztJQUlMLE1BQU07OztRQVVGLE1BQU0sV0FDRSxPQUNBLE9BQ0EsSUFBSyxFQUNMLElBQUs7Z0JBRWIsSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUksSUFBTTtnQkFDVixJQUFJLElBQU07Z0JBQ1YsVUFBVSxZQUFZLEtBQU07UUFFNUIsTUFBTSxJQUFJLElBQUksT0FBTyxFQUFFO2dCQUN2QixVQUFVLFlBQVksS0FBTTtnQkFFNUIsSUFBSTtnQkFFSixJQUFJLEtBQU8sRUFBRTtnQkFDYixJQUFJO2dCQUNKLElBQUksSUFBTTtnQkFDVixJQUFJLElBQU07UUFFVixLQUFLLElBQUksSUFBSSxXQUFVLEtBQUs7Z0JBQzVCLFVBQVUsWUFBWSxJQUFLO1FBRTNCLEdBQUcsS0FBSztRQUVSLE1BQU0sSUFBSSxJQUFJLE1BQU07Z0JBQ3BCLElBQUksS0FBTyxFQUFFLEVBQUU7Ozs7OztZQVdYLElBQUksVUFBVTtvQkFDZCxLQUFPOztlQUNMOzt1QkFDQyxNQUFNLFFBQVEseURBQXlELEVBQUk7Ozs7WUFHOUUsSUFBSSxJQUFJLEtBQUs7b0JBQ2IsS0FBTzs7ZUFDTDs7dUJBQ0MsTUFBTSxRQUFRLHdFQUF3RSxFQUFJOzs7O1lBRzdGLElBQUksT0FBTztvQkFDWCxLQUFPOztlQUNMOzt1QkFDQyxNQUFNLFFBQVEsMERBQTBELEVBQUkifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/immutable.kode
