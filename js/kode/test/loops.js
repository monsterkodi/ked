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
    log i`),`for (i = a; i <= b; i++)
{
    console.log(i)
}`)
                compare(kc('for i in 3...0 ➜ log i'),'for (i = 3; i > 0; i--)\n{\n    console.log(i)\n}')
                compare(kc('for i in 0...n ➜ log i'),'for (i = 0; i < n; i++)\n{\n    console.log(i)\n}')
                compare(kc('for i in 10...2*n ➜ log i'),'for (i = 10; i < 2 * n; i++)\n{\n    console.log(i)\n}')
                compare(kc('for y in by..by+2 ➜ log y'),'for (y = by; y <= by + 2; y++)\n{\n    console.log(y)\n}')
                compare(ke('r = []; a = 3; b = 0; for i in a...b ➜ r.push i\nr'),[])
                compare(ke('r = []; a = 3; b = 0; for i in a..b ➜ r.push i\nr'),[])
                compare(ke('r = []; a = 1; b = 3; for i in a..b ➜ r.push i\nr'),[1,2,3])
                compare(ke('r = []; for i in 3...0 ➜ r.push i\nr'),[3,2,1])
            })
            await section("by", async function ()
            {
                compare(kc('for i in a...b by -1 ➜ log i'),'for (i = a; i > b; i--)\n{\n    console.log(i)\n}')
                compare(kc('for i in a..b by 2 ➜ log i'),'for (i = a; i <= b; i += 2)\n{\n    console.log(i)\n}')
                compare(kc('for i in 10..0 by -3 ➜ log i'),'for (i = 10; i >= 0; i -= 3)\n{\n    console.log(i)\n}')
                compare(kc('for i in a..b by s ➜ log i'),'for (var _a_ = s, i = a; (_a_ > 0 ? i <= b : i >= b); i += _a_)\n{\n    console.log(i)\n}')
                compare(kc('for i in xs.length-1..0 by -1 ➜ log i'),'for (i = xs.length - 1; i >= 0; i--)\n{\n    console.log(i)\n}')
                compare(kc('for i in a..f(x) by -1 ➜ log i'),'for (i = a; i >= f(x); i--)\n{\n    console.log(i)\n}')
                compare(kc('for i in [a...b] by -1 ➜ log i'),'for (i = a; i > b; i--)\n{\n    console.log(i)\n}')
                compare(kc('log i for i in a...b by -2'),'for (i = a; i > b; i -= 2)\n{\n    console.log(i)\n}')
                compare(ke('r = []; a = 3; b = 0; for i in a...b by -1 ➜ r.push i\nr'),[3,2,1])
                compare(ke('r = []; a = 3; b = 0; for i in a..b by -1 ➜ r.push i\nr'),[3,2,1,0])
                compare(ke('r = []; a = 0; b = 7; for i in a..b by 3 ➜ r.push i\nr'),[0,3,6])
                compare(ke('r = []; a = 7; b = 0; for i in a..b by -3 ➜ r.push i\nr'),[7,4,1])
                compare(ke('r = []; s = -2; for i in 5...0 by s ➜ r.push i\nr'),[5,3,1])
                compare(ke('r = []; s = 2; for i in 0...5 by s ➜ r.push i\nr'),[0,2,4])
                compare(ke('r = []; for i in 0..3 by -1 ➜ r.push i\nr'),[])
                compare(ke('r = (i for i in 4...0 by -2); r'),[4,2])
            })
            await section("list", async function ()
            {
                compare(kc('x = [3..0]'),'x = [3,2,1,0]')
                compare(kc('x = [3...0]'),'x = [3,2,1]')
                compare(kc('x = [0...3]'),'x = [0,1,2]')
                compare(kc('x = [5...5]'),'x = []')
                compare(kc('x = [-2..2]'),'x = [-2,-1,0,1,2]')
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9vcHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2xvb3BzLmtvZGUiXSwibWFwcGluZ3MiOiI7T0FDTSxZQUFBO0lBQVE7SUFBRzs7Ozs7Ozs7OztnQkFRc0IsUUFBdkIsR0FBSSxvQkFDQTs7O2dCQU1rQixRQUF0QixHQUFJLG1CQUNBOzs7Z0JBTWdCLFFBQXBCLEdBQUksaUJBQ0E7OztnQkFNZ0IsUUFBcEIsR0FBSSxpQkFDQTs7O2dCQU1pQixRQUFyQixHQUFJLGtCQUNBOzs7Z0JBU0ksUUFIUixHQUFJO1lBSUE7Ozs7Z0JBT29DLFFBQXhDLEdBQUcsMEJBQXVDO2dCQUNGLFFBQXhDLEdBQUcsMEJBQXVDO2dCQUNGLFFBQXhDLEdBQUcsNkJBQXVDO2dCQUNGLFFBQXhDLEdBQUcsNkJBQXVDO2dCQUVrQixRQUE1RCxHQUFHO2dCQUN5RCxRQUE1RCxHQUFHO2dCQUN5RCxRQUE1RCxHQUFHLHNEQUE0RCxFQUFFLEVBQUU7Z0JBQ1AsUUFBNUQsR0FBRyx5Q0FBNEQsRUFBRSxFQUFFOzs7O2dCQUkzQixRQUF4QyxHQUFHLGdDQUF1QztnQkFDRixRQUF4QyxHQUFHLDhCQUF1QztnQkFDRixRQUF4QyxHQUFHLGdDQUF1QztnQkFDRixRQUF4QyxHQUFHLDhCQUF1QztnQkFDQyxRQUEzQyxHQUFHLHlDQUEwQztnQkFDTCxRQUF4QyxHQUFHLGtDQUF1QztnQkFDRixRQUF4QyxHQUFHLGtDQUF1QztnQkFDRixRQUF4QyxHQUFHLDhCQUF1QztnQkFFc0IsUUFBaEUsR0FBRyw2REFBZ0UsRUFBRSxFQUFFO2dCQUNQLFFBQWhFLEdBQUcsNERBQWdFLEVBQUUsRUFBRSxFQUFFO2dCQUNULFFBQWhFLEdBQUcsMkRBQWdFLEVBQUUsRUFBRTtnQkFDUCxRQUFoRSxHQUFHLDREQUFnRSxFQUFFLEVBQUU7Z0JBQ1AsUUFBaEUsR0FBRyxzREFBZ0UsRUFBRSxFQUFFO2dCQUNQLFFBQWhFLEdBQUcscURBQWdFLEVBQUUsRUFBRTtnQkFDUCxRQUFoRSxHQUFH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
//# sourceURL=../../../kode/kode/test/loops.kode
