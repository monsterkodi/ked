var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["is"] = function ()
{
    section("misc", function ()
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
    section("in if block", function ()
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
    section("str", function ()
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
    section("obj", function ()
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
    section("arr", function ()
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
    section("func", function ()
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
    section("num", function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2lzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztnQkFvQlEsR0FBRyxpQkFBaUM7Z0JBQ3BDLEdBQUcsb0JBQWlDO2dCQUNwQyxHQUFHLHNCQUFpQztnQkFDcEMsR0FBRyxzQkFBaUM7Z0JBQ3BDLEdBQUcsa0JBQWlDO2dCQUNwQyxHQUFHLGVBQWlDO2dCQUNwQyxHQUFHLGtCQUFpQztnQkFDcEMsR0FBRyw2QkFBaUM7Z0JBQ3BDLEdBQUcsNEJBQWlDO2dCQUVwQyxHQUFJOzs7c0NBS007Z0JBRVYsR0FBRyxnQkFBaUM7Z0JBQ3BDLEdBQUcsZUFBaUM7Z0JBRXBDLEdBQUcsb0JBQStCO2dCQUVsQyxHQUFJLGlDQUNBOzs7Z0JBTUosR0FBSSwyQ0FDQTs7Ozs7O2dCQWNKLEdBQUk7O3NCQUtBOzs7Ozs7OztnQkFXSixHQUFJOzs7O1lBT0E7Ozs7Ozs7Ozs7O2dCQW1CSixHQUFJLGlCQUEwQztnQkFDOUMsR0FBSSxvQkFBMEM7Z0JBQzlDLEdBQUksMkJBQTBDO2dCQUM5QyxHQUFJLDZCQUEwQztnQkFDOUMsR0FBSSxnQ0FBMEM7Z0JBQzlDLEdBQUkseURBQTBEO2dCQUM5RCxHQUFJLGdCQUEwQztnQkFDOUMsR0FBSSxpQkFBMEM7Z0JBQzlDLEdBQUksaUJBQTBDO2dCQUM5QyxHQUFJLG1CQUEwQztnQkFDOUMsR0FBSSx3QkFBMEM7Ozs7Z0JBVTlDLEdBQUksaUJBQTBDO2dCQUM5QyxHQUFJLG9CQUEwQztnQkFDOUMsR0FBSSwyQkFBMEM7Z0JBQzlDLEdBQUksNkJBQTBDO2dCQUM5QyxHQUFJLGdDQUEwQztnQkFDOUMsR0FBSSxxQ0FBc0M7Z0JBQzFDLEdBQUksZ0RBQWlEO2dCQUNyRCxHQUFJLGdCQUEwQztnQkFDOUMsR0FBSSxpQkFBMEM7Z0JBQzlDLEdBQUksa0JBQTBDO2dCQUM5QyxHQUFJLG1CQUEwQztnQkFDOUMsR0FBSSx3QkFBMEM7Z0JBQzlDLEdBQUksMkJBQTBDO2dCQUM5QyxHQUFJLDBCQUEwQztnQkFDOUMsR0FBSSx3QkFBMEM7Z0JBQzlDLEdBQUksd0JBQTBDOzs7O2dCQVU5QyxHQUFJLGlCQUEwQztnQkFDOUMsR0FBSSxvQkFBMEM7Z0JBQzlDLEdBQUksMEJBQTBDO2dCQUM5QyxHQUFJLDRCQUEwQztnQkFDOUMsR0FBSSw2QkFBMEM7Z0JBQzlDLEdBQUksb0NBQTBDO2dCQUM5QyxHQUFJLGdEQUFpRDtnQkFDckQsR0FBSSxnQkFBMEM7Z0JBQzlDLEdBQUksaUJBQTBDO2dCQUM5QyxHQUFJLGtCQUEwQztnQkFDOUMsR0FBSSxtQkFBMEM7Z0JBQzlDLEdBQUksd0JBQTBDO2dCQUM5QyxHQUFJLDJCQUEwQztnQkFDOUMsR0FBSSwyQkFBMEM7Z0JBQzlDLEdBQUksd0JBQTBDO2dCQUM5QyxHQUFJLHdCQUEwQzs7OztnQkFVOUMsR0FBSSxxQkFBMEM7Z0JBQzlDLEdBQUksdUJBQTBDO2dCQUM5QyxHQUFJLGlCQUEwQztnQkFDOUMsR0FBSSxrQkFBMEM7Z0JBQzlDLEdBQUksbUJBQTBDO2dCQUM5QyxHQUFJLG9CQUEwQztnQkFDOUMsR0FBSSx5QkFBMEM7Z0JBQzlDLEdBQUksNEJBQTBDO2dCQUM5QyxHQUFJLDRCQUEwQztnQkFDOUMsR0FBSSwyQkFBMEM7Z0JBQzlDLEdBQUkseUJBQTBDOzs7O2dCQVk5QyxHQUFJLG9CQUEwQztnQkFDOUMsR0FBSSxrQkFBMEM7Z0JBQzlDLEdBQUksa0JBQTBDO2dCQUM5QyxHQUFJLGtCQUEwQztnQkFDOUMsR0FBSSxnQkFBMEM7Z0JBQzlDLEdBQUksaUJBQTBDO2dCQUM5QyxHQUFJLG9CQUEwQztnQkFDOUMsR0FBSSxtQkFBMEM7Z0JBQzlDLEdBQUkscUJBQTBDO2dCQUM5QyxHQUFJLG9CQUEwQztnQkFDOUMsR0FBSSxxQkFBMEM7Z0JBQzlDLEdBQUksc0JBQTBDO2dCQUM5QyxHQUFJLG1CQUEwQztnQkFDOUMsR0FBSSxxQkFBMEM7Z0JBQzlDLEdBQUksa0JBQTBDO2dCQUM5QyxHQUFJLHVCQUEwQztnQkFDOUMsR0FBSSx1QkFBMEM7Z0JBQzlDLEdBQUksd0JBQTBDO2dCQUM5QyxHQUFJLHVDQUEwQztnQkFDOUMsR0FBSSx1Q0FBMEM7Z0JBQzlDLEdBQUcsbURBQW9EO2dCQUN2RCxHQUFJLGlCQUEwQztnQkFDOUMsR0FBSSx5QkFBMEM7Z0JBQzlDLEdBQUkscUJBQTBDO2dCQUM5QyxHQUFJLHdDQUEwQztnQkFDOUMsR0FBSSx5QkFBMEM7Z0JBQzlDLEdBQUksbUJBQTBDO2dCQUM5QyxHQUFJLG9CQUEwQztnQkFDOUMsR0FBSSx5QkFBMEM7Z0JBQzlDLEdBQUkseUJBQTBDO2dCQUM5QyxHQUFJLHdCQUEwQztnQkFDOUMsR0FBSSxtQkFBMEM7Z0JBQzlDLEdBQUksa0JBQTBDO2dCQUM5QyxHQUFJLHFDQUEwQztnQkFDOUMsR0FBSSw2QkFBMEM7Z0JBQzlDLEdBQUksbUJBQTBDIn0=
//# sourceURL=kode/kode/test/is.kode
