var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["is"] = async function ()
{
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
}
toExport["is"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2lzLmtvZGUiXSwibWFwcGluZ3MiOiI7T0FRTSxZQUFBO0lBQVE7SUFBRzs7Ozs7O2dCQVlULEdBQUcsaUJBQWlDO2dCQUNwQyxHQUFHLG9CQUFpQztnQkFDcEMsR0FBRyxzQkFBaUM7Z0JBQ3BDLEdBQUcsc0JBQWlDO2dCQUNwQyxHQUFHLGtCQUFpQztnQkFDcEMsR0FBRyxlQUFpQztnQkFDcEMsR0FBRyxrQkFBaUM7Z0JBQ3BDLEdBQUcsNkJBQWlDO2dCQUNwQyxHQUFHLDRCQUFpQztnQkFFcEMsR0FBSTs7O3NDQUtNO2dCQUVWLEdBQUcsZ0JBQWlDO2dCQUNwQyxHQUFHLGVBQWlDO2dCQUVwQyxHQUFHLG9CQUErQjtnQkFFbEMsR0FBSSxpQ0FDQTs7O2dCQU1KLEdBQUksMkNBQ0E7Ozs7OztnQkFjSixHQUFJOztzQkFLQTs7Ozs7Ozs7Z0JBV0osR0FBSTs7OztZQU9BOzs7Ozs7Ozs7OztnQkFtQkosR0FBSSxpQkFBMEM7Z0JBQzlDLEdBQUksb0JBQTBDO2dCQUM5QyxHQUFJLDJCQUEwQztnQkFDOUMsR0FBSSw2QkFBMEM7Z0JBQzlDLEdBQUksZ0NBQTBDO2dCQUM5QyxHQUFJLHlEQUEwRDtnQkFDOUQsR0FBSSxnQkFBMEM7Z0JBQzlDLEdBQUksaUJBQTBDO2dCQUM5QyxHQUFJLGlCQUEwQztnQkFDOUMsR0FBSSxtQkFBMEM7Z0JBQzlDLEdBQUksd0JBQTBDOzs7O2dCQVU5QyxHQUFJLGlCQUEwQztnQkFDOUMsR0FBSSxvQkFBMEM7Z0JBQzlDLEdBQUksMkJBQTBDO2dCQUM5QyxHQUFJLDZCQUEwQztnQkFDOUMsR0FBSSxnQ0FBMEM7Z0JBQzlDLEdBQUkscUNBQXNDO2dCQUMxQyxHQUFJLGdEQUFpRDtnQkFDckQsR0FBSSxnQkFBMEM7Z0JBQzlDLEdBQUksaUJBQTBDO2dCQUM5QyxHQUFJLGtCQUEwQztnQkFDOUMsR0FBSSxtQkFBMEM7Z0JBQzlDLEdBQUksd0JBQTBDO2dCQUM5QyxHQUFJLDJCQUEwQztnQkFDOUMsR0FBSSwwQkFBMEM7Z0JBQzlDLEdBQUksd0JBQTBDO2dCQUM5QyxHQUFJLHdCQUEwQzs7OztnQkFVOUMsR0FBSSxpQkFBMEM7Z0JBQzlDLEdBQUksb0JBQTBDO2dCQUM5QyxHQUFJLDBCQUEwQztnQkFDOUMsR0FBSSw0QkFBMEM7Z0JBQzlDLEdBQUksNkJBQTBDO2dCQUM5QyxHQUFJLG9DQUEwQztnQkFDOUMsR0FBSSxnREFBaUQ7Z0JBQ3JELEdBQUksZ0JBQTBDO2dCQUM5QyxHQUFJLGlCQUEwQztnQkFDOUMsR0FBSSxrQkFBMEM7Z0JBQzlDLEdBQUksbUJBQTBDO2dCQUM5QyxHQUFJLHdCQUEwQztnQkFDOUMsR0FBSSwyQkFBMEM7Z0JBQzlDLEdBQUksMkJBQTBDO2dCQUM5QyxHQUFJLHdCQUEwQztnQkFDOUMsR0FBSSx3QkFBMEM7Ozs7Z0JBVTlDLEdBQUkscUJBQTBDO2dCQUM5QyxHQUFJLHVCQUEwQztnQkFDOUMsR0FBSSxpQkFBMEM7Z0JBQzlDLEdBQUksa0JBQTBDO2dCQUM5QyxHQUFJLG1CQUEwQztnQkFDOUMsR0FBSSxvQkFBMEM7Z0JBQzlDLEdBQUkseUJBQTBDO2dCQUM5QyxHQUFJLDRCQUEwQztnQkFDOUMsR0FBSSw0QkFBMEM7Z0JBQzlDLEdBQUksMkJBQTBDO2dCQUM5QyxHQUFJLHlCQUEwQzs7OztnQkFZOUMsR0FBSSxvQkFBMEM7Z0JBQzlDLEdBQUksa0JBQTBDO2dCQUM5QyxHQUFJLGtCQUEwQztnQkFDOUMsR0FBSSxrQkFBMEM7Z0JBQzlDLEdBQUksZ0JBQTBDO2dCQUM5QyxHQUFJLGlCQUEwQztnQkFDOUMsR0FBSSxvQkFBMEM7Z0JBQzlDLEdBQUksbUJBQTBDO2dCQUM5QyxHQUFJLHFCQUEwQztnQkFDOUMsR0FBSSxvQkFBMEM7Z0JBQzlDLEdBQUkscUJBQTBDO2dCQUM5QyxHQUFJLHNCQUEwQztnQkFDOUMsR0FBSSxtQkFBMEM7Z0JBQzlDLEdBQUkscUJBQTBDO2dCQUM5QyxHQUFJLGtCQUEwQztnQkFDOUMsR0FBSSx1QkFBMEM7Z0JBQzlDLEdBQUksdUJBQTBDO2dCQUM5QyxHQUFJLHdCQUEwQztnQkFDOUMsR0FBSSx1Q0FBMEM7Z0JBQzlDLEdBQUksdUNBQTBDO2dCQUM5QyxHQUFHLG1EQUFvRDtnQkFDdkQsR0FBSSxpQkFBMEM7Z0JBQzlDLEdBQUkseUJBQTBDO2dCQUM5QyxHQUFJLHFCQUEwQztnQkFDOUMsR0FBSSx3Q0FBMEM7Z0JBQzlDLEdBQUkseUJBQTBDO2dCQUM5QyxHQUFJLG1CQUEwQztnQkFDOUMsR0FBSSxvQkFBMEM7Z0JBQzlDLEdBQUkseUJBQTBDO2dCQUM5QyxHQUFJLHlCQUEwQztnQkFDOUMsR0FBSSx3QkFBMEM7Z0JBQzlDLEdBQUksbUJBQTBDO2dCQUM5QyxHQUFJLGtCQUEwQztnQkFDOUMsR0FBSSxxQ0FBMEM7Z0JBQzlDLEdBQUksNkJBQTBDO2dCQUM5QyxHQUFJLG1CQUEwQyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/is.kode
