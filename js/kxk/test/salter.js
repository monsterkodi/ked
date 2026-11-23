var toExport = {}
var text

import salter from "../salter.js"

toExport["salter"] = async function ()
{
    await section("text without a glyph is empty", async function ()
    {
        compare(salter(''),'')
        compare(salter('◆'),'')
    })
    await section("desalt reverses salted text", async function ()
    {
        compare(salter.desalt(salter('hello')),'hello')
        compare(salter.desalt(salter('test header')),'test header')
        compare(salter.desalt(salter('a b c')),'a b c')
        compare(salter.desalt(salter('1234567890')),'1234567890')
        compare(salter.desalt(salter('foo-bar_baz')),'foo-bar_baz')
    })
    await section("desalt accepts lines", async function ()
    {
        text = salter('hello')
        compare(salter.desalt(text.split('\n')),'hello')
    })
}
toExport["salter"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FsdGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2t4ay90ZXN0L3NhbHRlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBUyxhQUFBOzs7Ozs7UUFNWSxRQUFiLE9BQU8sSUFBUTtRQUNGLFFBQWIsT0FBTyxLQUFROzs7O1FBSXlCLFFBQXhDLE9BQU8sT0FBTyxPQUFPLFVBQXFCO1FBQ0YsUUFBeEMsT0FBTyxPQUFPLE9BQU8sZ0JBQXFCO1FBQ0YsUUFBeEMsT0FBTyxPQUFPLE9BQU8sVUFBcUI7UUFDRixRQUF4QyxPQUFPLE9BQU8sT0FBTyxlQUFxQjtRQUNGLFFBQXhDLE9BQU8sT0FBTyxPQUFPLGdCQUFxQjs7OztRQUkxQyxPQUFPLE9BQU87UUFDa0IsUUFBaEMsT0FBTyxPQUFPLEtBQUssTUFBTSxPQUFTIn0=
//# sourceURL=../../../kode/kxk/test/salter.kode
