var toExport = {}
var blank, calls, ch, classes, clss, exp, hole, lim, lines, origGetClass, s, x, y

import syntax from "../util/syntax.js"

toExport["syntax"] = function ()
{
    section("getClass argument", function ()
    {
        s = new syntax('test')
        s.setExt('kode')
        s.setLines(['class Foo'])
        x = 0
        y = 0
        clss = s.getClass(x,y)
        ch = 'F'
        compare(s.getColor(x,y,clss),s.getColor(x,y))
        compare(s.getChar(x,y,ch,clss),s.getChar(x,y,ch))
        origGetClass = s.getClass
        calls = 0
        s.getClass = function (cx, cy)
        {
            calls += 1
            return origGetClass(cx,cy)
        }
        s.getColor(x,y,clss)
        s.getChar(x,y,ch,clss)
        compare(calls,0)
        s.getColor(x,y)
        s.getChar(x,y,ch)
        compare(calls,2)
    })
    section("getClasses", function ()
    {
        s = new syntax('test')
        s.setExt('kode')
        lines = ['# header','f = (a) -> a + 1','   indented',"u = '🌈'",'']
        s.setLines(lines)
        lim = 40
        for (var _a_ = y = 0, _b_ = lines.length; (_a_ <= _b_ ? y < lines.length : y > lines.length); (_a_ <= _b_ ? ++y : --y))
        {
            classes = s.getClasses(y)
            for (var _c_ = x = 0, _d_ = lim; (_c_ <= _d_ ? x < lim : x > lim); (_c_ <= _d_ ? ++x : --x))
            {
                clss = classes[x]
                clss = (clss != null ? clss : 'text')
                exp = s.getClass(x,y)
                compare(clss,exp)
            }
        }
        compare(s.getClasses(4).length,0)
        s.diss[0] = [{start:0,length:1,clss:''}]
        blank = s.getClasses(0)[0]
        compare(blank,'')
        hole = s.getClasses(0)[1]
        hole = (hole != null ? hole : 'text')
        compare(hole,'text')
    })
}
toExport["syntax"]._section_ = true
toExport._test_ = true
export default toExport
