var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["is"] = async function ()
{
    await section("in if block", async function ()
    {
        compare(kc(`if
    a is Object ➜ 1
    a is Array  ➜ 2`),`if (a instanceof Object)
{
    1
}
else if (a instanceof Array)
{
    2
}`)
        compare(kc(`if
    a is Object 
        1
    a is Array  
        2`),`if (a instanceof Object)
{
    1
}
else if (a instanceof Array)
{
    2
}`)
    })
    await section("str", async function ()
    {
        compare(ke('a = "" is str'),true)
        compare(ke('a = "abc" is str'),true)
        compare(ke('a = new String() is str'),true)
        compare(ke('a = new String("") is str'),true)
        compare(ke('a = new String("abc") is str'),true)
        compare(ke('"" is str and "a" is str and new String("abc") is str'),true)
        compare(ke('a = 1 is str'),false)
        compare(ke('a = [] is str'),false)
        compare(ke('a = {} is str'),false)
        compare(ke('a = null is str'),false)
        compare(ke('a = undefined is str'),false)
    })
    await section("obj", async function ()
    {
        compare(ke('a = {} is obj'),true)
        compare(ke('a = {a:1} is obj'),true)
        compare(ke('a = new Object() is obj'),true)
        compare(ke('a = new Object({}) is obj'),true)
        compare(ke('a = new Object({a:1}) is obj'),true)
        compare(ke('{} is obj and new Object() is obj'),true)
        compare(ke('null is obj or new Map() is obj or [] is obj'),false)
        compare(ke('a = 1 is obj'),false)
        compare(ke('a = [] is obj'),false)
        compare(ke('a = "x" is obj'),false)
        compare(ke('a = null is obj'),false)
        compare(ke('a = undefined is obj'),false)
        compare(ke('a = new String() is obj'),false)
        compare(ke('a = new Array() is obj'),false)
        compare(ke('a = new Map() is obj'),false)
        compare(ke('a = new Set() is obj'),false)
    })
    await section("arr", async function ()
    {
        compare(ke('a = [] is arr'),true)
        compare(ke('a = [1 2] is arr'),true)
        compare(ke('a = new Array() is arr'),true)
        compare(ke('a = new Array([]) is arr'),true)
        compare(ke('a = new Array([1]) is arr'),true)
        compare(ke('[] is arr and new Array() is arr'),true)
        compare(ke('null is arr or new Set() is arr or {} is arr'),false)
        compare(ke('a = 1 is arr'),false)
        compare(ke('a = {} is arr'),false)
        compare(ke('a = "x" is arr'),false)
        compare(ke('a = null is arr'),false)
        compare(ke('a = undefined is arr'),false)
        compare(ke('a = new String() is arr'),false)
        compare(ke('a = new Object() is arr'),false)
        compare(ke('a = new Map() is arr'),false)
        compare(ke('a = new Set() is arr'),false)
    })
    await section("func", async function ()
    {
        compare(ke('a = ->\na is func'),true)
        compare(ke('a = ()->\na is func'),true)
        compare(ke('a = 1 is func'),false)
        compare(ke('a = {} is func'),false)
        compare(ke('a = "x" is func'),false)
        compare(ke('a = null is func'),false)
        compare(ke('a = undefined is func'),false)
        compare(ke('a = new String() is func'),false)
        compare(ke('a = new Object() is func'),false)
        compare(ke('a = new Array() is func'),false)
        compare(ke('a = new Set() is func'),false)
    })
    await section("num", async function ()
    {
        compare(ke('a = "-10" is num'),true)
        compare(ke('a = "0" is num'),true)
        compare(ke('a = "5" is num'),true)
        compare(ke('a = -16 is num'),true)
        compare(ke('a = 0 is num'),true)
        compare(ke('a = 32 is num'),true)
        compare(ke('a = "040" is num'),true)
        compare(ke('a = 0144 is num'),true)
        compare(ke('a = "0xFF" is num'),true)
        compare(ke('a = 0xFFF is num'),true)
        compare(ke('a = "-1.6" is num'),true)
        compare(ke('a = "4.536" is num'),true)
        compare(ke('a = -2.6 is num'),true)
        compare(ke('a = 3.1415 is num'),true)
        compare(ke('a = 8e5 is num'),true)
        compare(ke('a = "123e-2" is num'),true)
        compare(ke('a = Infinity is num'),true)
        compare(ke('a = -Infinity is num'),true)
        compare(ke('a = Number.POSITIVE_INFINITY is num'),true)
        compare(ke('a = Number.NEGATIVE_INFINITY is num'),true)
        compare(ke('"0xFF" is num and "-4.536" is num and 42 is num'),true)
        compare(ke('a = "" is num'),false)
        compare(ke('a = "        " is num'),false)
        compare(ke('a = "\t\t" is num'),false)
        compare(ke('a = "abcdefghijklm1234567890" is num'),false)
        compare(ke('a = "xabcdefx" is num'),false)
        compare(ke('a = true is num'),false)
        compare(ke('a = false is num'),false)
        compare(ke('a = "bcfed5.2" is num'),false)
        compare(ke('a = "7.2acdgs" is num'),false)
        compare(ke('a = undefined is num'),false)
        compare(ke('a = null is num'),false)
        compare(ke('a = NaN is num'),false)
        compare(ke('a = (new Date(2009, 1, 1)) is num'),false)
        compare(ke('a = (new Object()) is num'),false)
        compare(ke('a = (->) is num'),false)
    })
    await section("misc", async function ()
    {
        compare(ke('1 is "number"'),true)
        compare(ke('a = {} is Object'),true)
        compare(ke('a = {} is "object"'),true)
        compare(ke('(->) is "function"'),true)
        compare(ke('[] is "object"'),true)
        compare(ke('[] is Array'),true)
        compare(ke('"" is "string"'),true)
        compare(ke('(new String "") is String'),true)
        compare(ke('(new Number 0) is Number'),true)
        compare(ke(`class A
class B extends A
a = new B
a is B and a is A and a is 'object'`),true)
        compare(ke('"" is String'),false)
        compare(ke('1 is Number'),false)
        compare(kc('log new Object()'),'console.log(new Object())')
        compare(kc("if d is 'function' and not o?"),`if (typeof(d) === 'function' && !(o != null))
{
}`)
        compare(kc("if not a is Array and not a is 'object'"),`if (!(a instanceof Array) && !(typeof(a) === 'object'))
{
}`)
    })
}
toExport["is"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2lzLmtvZGUiXSwibWFwcGluZ3MiOiI7T0FDTSxZQUFBO0lBQVE7SUFBRzs7Ozs7O1FBVUQsUUFKUixHQUFJOztzQkFLQTs7Ozs7Ozs7UUFpQkksUUFOUixHQUFJOzs7O1lBT0E7Ozs7Ozs7Ozs7O1FBYXdDLFFBQTVDLEdBQUksaUJBQTBDO1FBQ0YsUUFBNUMsR0FBSSxvQkFBMEM7UUFDRixRQUE1QyxHQUFJLDJCQUEwQztRQUNGLFFBQTVDLEdBQUksNkJBQTBDO1FBQ0YsUUFBNUMsR0FBSSxnQ0FBMEM7UUFDYyxRQUE1RCxHQUFJLHlEQUEwRDtRQUNsQixRQUE1QyxHQUFJLGdCQUEwQztRQUNGLFFBQTVDLEdBQUksaUJBQTBDO1FBQ0YsUUFBNUMsR0FBSSxpQkFBMEM7UUFDRixRQUE1QyxHQUFJLG1CQUEwQztRQUNGLFFBQTVDLEdBQUksd0JBQTBDOzs7O1FBSUYsUUFBNUMsR0FBSSxpQkFBMEM7UUFDRixRQUE1QyxHQUFJLG9CQUEwQztRQUNGLFFBQTVDLEdBQUksMkJBQTBDO1FBQ0YsUUFBNUMsR0FBSSw2QkFBMEM7UUFDRixRQUE1QyxHQUFJLGdDQUEwQztRQUNOLFFBQXhDLEdBQUkscUNBQXNDO1FBQ1MsUUFBbkQsR0FBSSxnREFBaUQ7UUFDVCxRQUE1QyxHQUFJLGdCQUEwQztRQUNGLFFBQTVDLEdBQUksaUJBQTBDO1FBQ0YsUUFBNUMsR0FBSSxrQkFBMEM7UUFDRixRQUE1QyxHQUFJLG1CQUEwQztRQUNGLFFBQTVDLEdBQUksd0JBQTBDO1FBQ0YsUUFBNUMsR0FBSSwyQkFBMEM7UUFDRixRQUE1QyxHQUFJLDBCQUEwQztRQUNGLFFBQTVDLEdBQUksd0JBQTBDO1FBQ0YsUUFBNUMsR0FBSSx3QkFBMEM7Ozs7UUFJRixRQUE1QyxHQUFJLGlCQUEwQztRQUNGLFFBQTVDLEdBQUksb0JBQTBDO1FBQ0YsUUFBNUMsR0FBSSwwQkFBMEM7UUFDRixRQUE1QyxHQUFJLDRCQUEwQztRQUNG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
//# sourceURL=../../../kode/kode/test/is.kode
