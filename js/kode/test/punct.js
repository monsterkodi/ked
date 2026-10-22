var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["punctuation"] = async function ()
{
    await section("parens", async function ()
    {
        compare(kc('(b)'),';(b)')
        compare(kc('(b(c))'),';(b(c))')
        compare(kc('(b(--c))'),';(b(--c))')
        compare(kc('a + (b(--c))'),'a + (b(--c))')
    })
    await section("close", async function ()
    {
        compare(kc(`if
    (   true and 
        yes   )
        7`),`if ((true && true))
{
    7
}`)
        compare(kc(`if  (   true and 
        yes   )
        8`),`if ((true && true))
{
    8
}`)
        compare(kc(`if  (   true and 
        yes   
    )
        9`),`if ((true && true))
{
    9
}`)
        compare(kc(`if  
    true ➜ 10
    (   true and 
        yes )
        11`),`if (true)
{
    10
}
else if ((true && true))
{
    11
}`)
        compare(kc(`if true  ➜ 12.1
   false ➜ 13.1`),`if (true)
{
    12.1
}
else if (false)
{
    13.1
}`)
        compare(kc(`(   
    1 +
    2
    
)`),`;(1 + 2)`)
        compare(kc(`a = (   
    3 +
    4
    )`),`a = (3 + 4)`)
        compare(kc(`b = (   
    5 +
    6
)`),`b = (5 + 6)`)
        compare(kc(`if  
    true ➜ 12
    (   true and 
        yes 
    )
        13`),`if (true)
{
    12
}
else if ((true && true))
{
    13
}`)
        compare(kc(`if  true ➜ 14
    (   true and 
        yes 
    )
        15`),`if (true)
{
    14
}
else if ((true && true))
{
    15
}`)
    })
    await section("optional commata", async function ()
    {
        compare(kc("a = -1"),"a = -1")
        compare(kc("a = [ 1 2 3 ]"),"a = [1,2,3]")
        compare(kc("a = [-1 2 3 ]"),"a = [-1,2,3]")
        compare(kc("a = [ 1 -2 3 ]"),"a = [1,-2,3]")
        compare(kc("a = [-1 -2 -3]"),"a = [-1,-2,-3]")
        compare(kc("a = [ 1 +2 -3]"),"a = [1,2,-3]")
        compare(kc("a = [+1 -2 +3]"),"a = [1,-2,3]")
        compare(kc("a = [1 a]"),"a = [1,a]")
        compare(kc("a = [1 -b]"),"a = [1,-b]")
        compare(kc("a = ['0' -2 'c' -3]"),"a = ['0',-2,'c',-3]")
        compare(kc("a = [-1 - 2 - 3]"),"a = [-1 - 2 - 3]")
        compare(kc("a = [-1-2-3]"),"a = [-1 - 2 - 3]")
        compare(kc("a = { a:1 b:2 }"),"a = {a:1,b:2}")
        compare(kc("a = a:1 b:2"),"a = {a:1,b:2}")
        compare(kc("a = ['a' 'b' 'c']"),"a = ['a','b','c']")
        compare(kc("a = ['a''b''c']"),"a = ['a','b','c']")
        compare(kc("a = { a:{a:1}, b:{b:2} }"),"a = {a:{a:1},b:{b:2}}")
        compare(kc("a = { a:{a:3} b:{b:4} }"),"a = {a:{a:3},b:{b:4}}")
        compare(kc("a = [ {a:5} {b:6} ]"),"a = [{a:5},{b:6}]")
        compare(kc("a = [ {a:1 b:2} ]"),"a = [{a:1,b:2}]")
        compare(kc("a = [ [] [] ]"),"a = [[],[]]")
        compare(kc("a = [[] []]"),"a = [[],[]]")
        compare(kc("a = [[[[[] []] [[] []]]]]"),"a = [[[[[],[]],[[],[]]]]]")
        compare(kc("a = [ [1 2] [3 '4'] ]"),"a = [[1,2],[3,'4']]")
        compare(kc("a = [ [-1 -2] [-3 '4' -5] ]"),"a = [[-1,-2],[-3,'4',-5]]")
        compare(kc("a.on 'b' c"),"a.on('b',c)")
        compare(kc("describe 'test' ->"),"describe('test',function ()\n{})")
        compare(kc('log "hello" 1 "world"'),'console.log("hello",1,"world")')
        compare(kc('log 1 2 3'),'console.log(1,2,3)')
        compare(kc("a = ['a' 1 2.3 null undefined true false yes no]"),"a = ['a',1,2.3,null,undefined,true,false,true,false]")
        compare(kc("a = [ [a:2] [b:'4'] [c:[]] ]"),"a = [[{a:2}],[{b:'4'}],[{c:[]}]]")
        compare(kc("f 'a' ->"),"f('a',function ()\n{})")
        compare(kc("f 'a' (b) ->"),"f('a',function (b)\n{})")
        compare(kc("f 'b' not a"),"f('b',!a)")
        compare(kc("f 'b' {a:1}"),"f('b',{a:1})")
        compare(kc("f 'b' ++a"),"f('b',++a)")
        compare(kc("f 'b' []"),"f('b',[])")
        compare(kc("f 'b' 1 2"),"f('b',1,2)")
        compare(kc("g 2 ->"),"g(2,function ()\n{})")
        compare(kc("g 2 (b) ->"),"g(2,function (b)\n{})")
        compare(kc("g 2 not a"),"g(2,!a)")
        compare(kc("g 2 {a:1}"),"g(2,{a:1})")
        compare(kc("g 2 ++a"),"g(2,++a)")
        compare(kc("g 2 []"),"g(2,[])")
        compare(kc("g 2 1 2"),"g(2,1,2)")
    })
}
toExport["punctuation"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVuY3QuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L3B1bmN0LmtvZGUiXSwibWFwcGluZ3MiOiI7T0FRTSxZQUFBO0lBQVE7SUFBRzs7Ozs7O2dCQVlULEdBQUksT0FBZ0M7Z0JBQ3BDLEdBQUksVUFBaUM7Z0JBQ3JDLEdBQUksWUFBaUM7Z0JBQ3JDLEdBQUksZ0JBQWlDOzs7O2dCQUlyQyxHQUFJOzs7WUFNQTs7OztnQkFPSixHQUFJOztZQUtBOzs7O2dCQU9KLEdBQUk7OztZQU1BOzs7O2dCQU9KLEdBQUk7Ozs7YUFPQTs7Ozs7Ozs7Z0JBV0osR0FBSTtrQkFJQTs7Ozs7Ozs7Z0JBV0osR0FBSTs7OztJQU9BO2dCQUlKLEdBQUk7OztRQU1BO2dCQUlKLEdBQUk7OztJQU1BO2dCQUlKLEdBQUk7Ozs7O2FBUUE7Ozs7Ozs7O2dCQVdKLEdBQUk7Ozs7YUFPQTs7Ozs7Ozs7Ozs7Z0JBbUJKLEdBQUksVUFBZ0M7Z0JBQ3BDLEdBQUksaUJBQWdDO2dCQUNwQyxHQUFJLGlCQUFnQztnQkFDcEMsR0FBSSxrQkFBZ0M7Z0JBQ3BDLEdBQUksa0JBQWdDO2dCQUNwQyxHQUFJLGtCQUFnQztnQkFDcEMsR0FBSSxrQkFBZ0M7Z0JBQ3BDLEdBQUksYUFBZ0M7Z0JBQ3BDLEdBQUksY0FBZ0M7Z0JBQ3BDLEdBQUksdUJBQWdDO2dCQUNwQyxHQUFJLG9CQUFnQztnQkFDcEMsR0FBSSxnQkFBZ0M7Z0JBQ3BDLEdBQUksbUJBQWdDO2dCQUNwQyxHQUFJLGVBQWdDO2dCQUNwQyxHQUFJLHFCQUFnQztnQkFDcEMsR0FBSSxtQkFBZ0M7Z0JBQ3BDLEdBQUksNEJBQWdDO2dCQUNwQyxHQUFJLDJCQUFnQztnQkFDcEMsR0FBSSx1QkFBZ0M7Z0JBQ3BDLEdBQUkscUJBQWdDO2dCQUNwQyxHQUFJLGlCQUFnQztnQkFDcEMsR0FBSSxlQUFnQztnQkFDcEMsR0FBSSw2QkFBZ0M7Z0JBQ3BDLEdBQUkseUJBQWdDO2dCQUNwQyxHQUFJLCtCQUFnQztnQkFDcEMsR0FBSSxjQUFnQztnQkFDcEMsR0FBSSxzQkFBZ0M7Z0JBQ3BDLEdBQUkseUJBQWdDO2dCQUNwQyxHQUFJLGFBQWdDO2dCQUVwQyxHQUFJLG9EQUNBO2dCQUVKLEdBQUksZ0NBQWtDO2dCQUV0QyxHQUFJLFlBQXdCO2dCQUM1QixHQUFJLGdCQUF3QjtnQkFDNUIsR0FBSSxlQUF3QjtnQkFDNUIsR0FBSSxlQUF3QjtnQkFDNUIsR0FBSSxhQUF3QjtnQkFDNUIsR0FBSSxZQUF3QjtnQkFDNUIsR0FBSSxhQUF3QjtnQkFFNUIsR0FBSSxVQUF3QjtnQkFDNUIsR0FBSSxjQUF3QjtnQkFDNUIsR0FBSSxhQUF3QjtnQkFDNUIsR0FBSSxhQUF3QjtnQkFDNUIsR0FBSSxXQUF3QjtnQkFDNUIsR0FBSSxVQUF3QjtnQkFDNUIsR0FBSSxXQUF3QiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/punct.kode
