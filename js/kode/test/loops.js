var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["loops"] = async function ()
{
    await section("for", async function ()
    {
        await section("in", async function ()
        {
            await section("range", async function ()
            {
                compare(kc("for x in [3...4]"),`for (x = 3; x < 4; x++)
{
}`)
                compare(kc("for x in [3..4]"),`for (x = 3; x <= 4; x++)
{
}`)
                compare(kc("for x in 5..6"),`for (x = 5; x <= 6; x++)
{
}`)
                compare(kc("for x in 5..6"),`for (x = 5; x <= 6; x++)
{
}`)
                compare(kc("for x in 15..4"),`for (x = 15; x >= 4; x--)
{
}`)
                compare(kc(`for i in a..b
    log i`),`for (var _a_ = i = a, _b_ = b; (_a_ <= _b_ ? i <= b : i >= b); (_a_ <= _b_ ? ++i : --i))
{
    console.log(i)
}`)
                compare(kc(`for a in [1..2] then for b in [1..3] then c = 1; d = 1`),`for (a = 1; a <= 2; a++)
{
    for (b = 1; b <= 3; b++)
    {
        c = 1
        d = 1
    }
}`)
                compare(kc(`for a in [1..9] then for b in [1..9]
    c = 3
    d:
        e: 1`),`for (a = 1; a <= 9; a++)
{
    for (b = 1; b <= 9; b++)
    {
        c = 3
        {d:{e:1}}
    }
}`)
            })
        })
        await section("in", async function ()
        {
            await section("list", async function ()
            {
                compare(kc(`for t in l
    t`),`var list = _k_.list(l)
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    t = list[_a_]
    t
}`)
                compare(kc(`for a in [1,2,3] then log a`),`var list = [1,2,3]
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    a = list[_a_]
    console.log(a)
}`)
                compare(kc(`for a in [1,2,3] then log a
log a`),`var list = [1,2,3]
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    a = list[_a_]
    console.log(a)
}
console.log(a)`)
                compare(kc(`for a in [1,2,3]
    log '1' a
    log '2' a
log '3' a`),`var list = [1,2,3]
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    a = list[_a_]
    console.log('1',a)
    console.log('2',a)
}
console.log('3',a)`)
                compare(kc(`for v,i in @regs
    log i,v`),`var list = _k_.list(this.regs)
for (i = 0; i < list.length; i++)
{
    v = list[i]
    console.log(i,v)
}`)
                compare(kc(`for [a,b] in @regs
    log a,b`),`var list = _k_.list(this.regs)
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    a = list[_a_][0]
    b = list[_a_][1]
    console.log(a,b)
}`)
                compare(kc(`empty = (a) -> a in ['' null undefined] or b`),`
empty = function (a)
{
    return _k_.in(a,['',null,undefined]) || b
}`)
                compare(kc(`@exp body.exps,k,e for e,k in body.exps`),`var list = _k_.list(body.exps)
for (k = 0; k < list.length; k++)
{
    e = list[k]
    this.exp(body.exps,k,e)
}`)
            })
        })
        await section("of", async function ()
        {
            compare(kc(`for key,val of @patts
    log key, val`),`for (key in this.patts)
{
    val = this.patts[key]
    console.log(key,val)
}`)
            compare(kc(`matches = ([k, r.exec(t)] for k,r of rgs)`),`matches = (function () { var r_a_ = []; for (var k in rgs)  { var r = rgs[k];r_a_.push([k,r.exec(t)])  } return r_a_ }).bind(this)()`)
        })
        await section("tail", async function ()
        {
            compare(kc(`f e for e in l ? []`),`var list = (l != null ? l : [])
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    e = list[_a_]
    f(e)
}`)
        })
    })
    await section("list comprehension", async function ()
    {
        compare(kc("m = ([k, r.exec(t)] for k,r of rgs)"),`m = (function () { var r_a_ = []; for (var k in rgs)  { var r = rgs[k];r_a_.push([k,r.exec(t)])  } return r_a_ }).bind(this)()`)
        compare(kc("m = ([i, k] for k,i in rgs)"),`m = (function () { var r_a_ = []; var list = _k_.list(rgs); for (i = 0; i < list.length; i++)  { var k = list[i];r_a_.push([i,k])  } return r_a_ }).bind(this)()`)
        compare(ke("1"),1)
        compare(ke("'abc'"),'abc')
        compare(ke("[1,2,3]"),[1,2,3])
        compare(ke("[i for i in [1,2,3]]"),[1,2,3])
        compare(ke("(i for i in [1,2,3])"),[1,2,3])
        compare(ke("[i*2 for i in [1,2,3]]"),[2,4,6])
        compare(ke("(i+3 for i in [1,2,3])"),[4,5,6])
        compare(ke("(k for k of {a:1,b:2,c:3})"),['a','b','c'])
        compare(ke("(v*v for k,v of {a:1,b:2,c:3})"),[1,4,9])
        compare(ke("(''+i+' '+v for i,v of [5,4,3])"),['0 5','1 4','2 3'])
        compare(ke('((-> (a={})[v]=k; a)() for k,v of {a:1,b:2,c:3})'),[{'1':'a'},{'2':'b'},{'3':'c'}])
    })
    await section("each", async function ()
    {
        compare(ke("a = {a:1,b:2}"),{a:1,b:2})
        compare(ke("a = {a:1,b:2} each (k,v) -> [k, v*3]"),{a:3,b:6})
        compare(ke("a = {a:1,b:2} each (k,v) -> ['▸'+k, v]"),{'▸a':1,'▸b':2})
        compare(ke("a = [1,2,3] each (i,v) -> [i, v]"),[1,2,3])
        compare(ke("a = [1,2,3] each (i,v) -> [2-i, v]"),[3,2,1])
        compare(ke("a = [1,3]   each (i,v) -> [1-i,v*v]"),[9,1])
        compare(ke("a = ['3''2''1'] each (i,v) -> [i, v+'▸'+i]"),['3▸0','2▸1','1▸2'])
        compare(ke("a = 'hello' each (i,c) -> [i,c+c]"),"hheelllloo")
        compare(ke("a = 'hello world' each (i,c) -> [i,i%2 and c.toUpperCase() or c]"),"hElLo wOrLd")
        compare(ke("a = 'hello again' each (i,c) -> [i,((i%2) ? c.toUpperCase() : c)]"),"hElLo aGaIn")
        await section("single", async function ()
        {
            compare(ke("a = '' each ->"),'')
            compare(ke("a = {} each ->"),{})
            compare(ke("a = [] each ->"),[])
            compare(ke("a = [1,2] each -> 'a'"),['a','a'])
            compare(ke("a = [1,2] each ->"),[])
            compare(ke("a = [1,2,3] each (v) -> v"),[1,2,3])
            compare(ke("a = {a:1,b:2} each (v) -> v*3"),{a:3,b:6})
            compare(ke("[0,1,2] each (v) -> v"),[0,1,2])
            compare(ke("f = (a) -> a\nr = f [0,1,2] each (v) -> 2*v"),[0,2,4])
        })
    })
    await section("while", async function ()
    {
        compare(kc(`while true
    log 4`),`while (true)
{
    console.log(4)
}`)
        compare(kc(`while true then log 5`),`while (true)
{
    console.log(5)
}`)
        compare(kc(`while a == b then log c; log d
log e`),`while (a === b)
{
    console.log(c)
    console.log(d)
}
console.log(e)`)
    })
}
toExport["loops"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9vcHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2xvb3BzLmtvZGUiXSwibWFwcGluZ3MiOiI7T0FRTSxZQUFBO0lBQVE7SUFBRzs7Ozs7Ozs7Ozt3QkFjRCxHQUFJLG9CQUNBOzs7d0JBTUosR0FBSSxtQkFDQTs7O3dCQU1KLEdBQUksaUJBQ0E7Ozt3QkFNSixHQUFJLGlCQUNBOzs7d0JBTUosR0FBSSxrQkFDQTs7O3dCQU1KLEdBQUk7WUFJQTs7Ozt3QkFPSixHQUFJLDBEQUVNOzs7Ozs7Ozt3QkFXVixHQUFJOzs7ZUFLTTs7Ozs7Ozs7Ozs7Ozs7d0JBY1YsR0FBSTtRQUdNOzs7Ozs7d0JBU1YsR0FBSSwrQkFFTTs7Ozs7O3dCQVNWLEdBQUk7UUFHTTs7Ozs7Ozt3QkFVVixHQUFJOzs7WUFLTTs7Ozs7Ozs7d0JBV1YsR0FBSTtjQUdNOzs7Ozs7d0JBU1YsR0FBSTtjQUdNOzs7Ozs7O3dCQVVWLEdBQUksZ0RBRU07Ozs7O3dCQVFWLEdBQUksMkNBRU07Ozs7Ozs7Ozs7b0JBZ0JkLEdBQUk7bUJBR007Ozs7O29CQVFWLEdBQUksNkNBRU07Ozs7b0JBWVYsR0FBSSx1QkFFTTs7Ozs7Ozs7OztnQkFpQmQsR0FBSSx1Q0FDQTtnQkFJSixHQUFJLCtCQUNBO2dCQUlKLEdBQUksS0FBc0M7Z0JBQzFDLEdBQUksU0FBc0M7Z0JBQzFDLEdBQUksWUFBdUMsRUFBRSxFQUFFO2dCQUMvQyxHQUFJLHlCQUF3QyxFQUFHLEVBQUc7Z0JBQ2xELEdBQUkseUJBQXdDLEVBQUcsRUFBRztnQkFDbEQsR0FBSSwyQkFBd0MsRUFBRyxFQUFHO2dCQUNsRCxHQUFJLDJCQUF3QyxFQUFHLEVBQUc7Z0JBQ2xELEdBQUksK0JBQXdDLElBQUksSUFBSTtnQkFDcEQsR0FBSSxtQ0FBd0MsRUFBRSxFQUFFO2dCQUNoRCxHQUFJLG9DQUF3QyxNQUFNLE1BQU07Z0JBQ3hELEdBQUksc0RBQXlELElBQUksTUFBTSxJQUFJLE1BQU0sSUFBSTs7OztnQkFVckYsR0FBSSxrQkFBcUQsRUFBRSxFQUFFLEVBQUU7Z0JBQy9ELEdBQUkseUNBQXFELEVBQUUsRUFBRSxFQUFFO2dCQUMvRCxHQUFJLDJDQUFxRCxLQUFLLEVBQUUsS0FBSztnQkFFckUsR0FBSSxxQ0FBcUQsRUFBRSxFQUFFO2dCQUM3RCxHQUFJLHVDQUFxRCxFQUFFLEVBQUU7Z0JBQzdELEdBQUksd0NBQXFELEVBQUU7Z0JBQzNELEdBQUksK0NBQXFELE1BQU0sTUFBTTtnQkFDckUsR0FBSSxxQ0FBb0Q7Z0JBQ3hELEdBQUksb0VBQXdFO2dCQUM1RSxHQUFJLHFFQUF3RTs7O29CQUl4RSxHQUFJLGtCQUFvRDtvQkFDeEQsR0FBSTtvQkFDSixHQUFJO29CQUNKLEdBQUksMEJBQXFELElBQUc7b0JBQzVELEdBQUk7b0JBQ0osR0FBSSw4QkFBcUQsRUFBRSxFQUFFO29CQUM3RCxHQUFJLGtDQUFxRCxFQUFFLEVBQUUsRUFBRTtvQkFFL0QsR0FBSSwwQkFBcUQsRUFBRSxFQUFFO29CQUM3RCxHQUFJLGdEQUFxRCxFQUFFLEVBQUU7Ozs7O2dCQVVqRSxHQUFJO1lBR007Ozs7Z0JBT1YsR0FBSSx5QkFFTTs7OztnQkFPVixHQUFJO1FBR00ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/loops.kode
