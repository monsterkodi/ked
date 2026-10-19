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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVuY3QuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L3B1bmN0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztnQkFvQlEsR0FBSSxPQUFnQztnQkFDcEMsR0FBSSxVQUFpQztnQkFDckMsR0FBSSxZQUFpQztnQkFDckMsR0FBSSxnQkFBaUM7Ozs7Z0JBSXJDLEdBQUk7OztZQU1BOzs7O2dCQU9KLEdBQUk7O1lBS0E7Ozs7Z0JBT0osR0FBSTs7O1lBTUE7Ozs7Z0JBT0osR0FBSTs7OzthQU9BOzs7Ozs7OztnQkFXSixHQUFJO2tCQUlBOzs7Ozs7OztnQkFXSixHQUFJOzs7O0lBT0E7Z0JBSUosR0FBSTs7O1FBTUE7Z0JBSUosR0FBSTs7O0lBTUE7Z0JBSUosR0FBSTs7Ozs7YUFRQTs7Ozs7Ozs7Z0JBV0osR0FBSTs7OzthQU9BOzs7Ozs7Ozs7OztnQkFtQkosR0FBSSxVQUFnQztnQkFDcEMsR0FBSSxpQkFBZ0M7Z0JBQ3BDLEdBQUksaUJBQWdDO2dCQUNwQyxHQUFJLGtCQUFnQztnQkFDcEMsR0FBSSxrQkFBZ0M7Z0JBQ3BDLEdBQUksa0JBQWdDO2dCQUNwQyxHQUFJLGtCQUFnQztnQkFDcEMsR0FBSSxhQUFnQztnQkFDcEMsR0FBSSxjQUFnQztnQkFDcEMsR0FBSSx1QkFBZ0M7Z0JBQ3BDLEdBQUksb0JBQWdDO2dCQUNwQyxHQUFJLGdCQUFnQztnQkFDcEMsR0FBSSxtQkFBZ0M7Z0JBQ3BDLEdBQUksZUFBZ0M7Z0JBQ3BDLEdBQUkscUJBQWdDO2dCQUNwQyxHQUFJLG1CQUFnQztnQkFDcEMsR0FBSSw0QkFBZ0M7Z0JBQ3BDLEdBQUksMkJBQWdDO2dCQUNwQyxHQUFJLHVCQUFnQztnQkFDcEMsR0FBSSxxQkFBZ0M7Z0JBQ3BDLEdBQUksaUJBQWdDO2dCQUNwQyxHQUFJLGVBQWdDO2dCQUNwQyxHQUFJLDZCQUFnQztnQkFDcEMsR0FBSSx5QkFBZ0M7Z0JBQ3BDLEdBQUksK0JBQWdDO2dCQUNwQyxHQUFJLGNBQWdDO2dCQUNwQyxHQUFJLHNCQUFnQztnQkFDcEMsR0FBSSx5QkFBZ0M7Z0JBQ3BDLEdBQUksYUFBZ0M7Z0JBRXBDLEdBQUksb0RBQ0E7Z0JBRUosR0FBSSxnQ0FBa0M7Z0JBRXRDLEdBQUksWUFBd0I7Z0JBQzVCLEdBQUksZ0JBQXdCO2dCQUM1QixHQUFJLGVBQXdCO2dCQUM1QixHQUFJLGVBQXdCO2dCQUM1QixHQUFJLGFBQXdCO2dCQUM1QixHQUFJLFlBQXdCO2dCQUM1QixHQUFJLGFBQXdCO2dCQUU1QixHQUFJLFVBQXdCO2dCQUM1QixHQUFJLGNBQXdCO2dCQUM1QixHQUFJLGFBQXdCO2dCQUM1QixHQUFJLGFBQXdCO2dCQUM1QixHQUFJLFdBQXdCO2dCQUM1QixHQUFJLFVBQXdCO2dCQUM1QixHQUFJLFdBQXdCIn0=
//# sourceURL=file://kode/kode/test/punct.kode
