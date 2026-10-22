var toExport = {}
var blank, calls, ch, classes, clss, exp, hole, lim, lines, origGetClass, s, x, y

import syntax from "../util/syntax.js"

toExport["syntax"] = async function ()
{
    await section("getClass argument", async function ()
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
    await section("getClasses", async function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGF4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L3N5bnRheC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFrQlEsUUFBUSxPQUFPO1FBQ2YsRUFBRSxPQUFPO1FBQ1QsRUFBRSxVQUFVO1FBRVosSUFBSTtRQUNKLElBQUk7UUFDSixPQUFPLEVBQUUsU0FBUyxFQUFFO1FBQ3BCLEtBQU87Z0JBRVAsRUFBRSxTQUFTLEVBQUUsRUFBRSxNQUFRLEVBQUUsU0FBUyxFQUFFO2dCQUNwQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEdBQUcsTUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFO1FBRXZDLGVBQWUsRUFBRTtRQUNqQixRQUFRO1FBQ1IsRUFBRSxxQkFBWSxJQUFHOztZQUNiLFNBQVM7bUJBQ1QsYUFBYSxHQUFHOztRQUVwQixFQUFFLFNBQVMsRUFBRSxFQUFFO1FBQ2YsRUFBRSxRQUFRLEVBQUUsRUFBRSxHQUFHO2dCQUNqQixNQUFRO1FBRVIsRUFBRSxTQUFTLEVBQUU7UUFDYixFQUFFLFFBQVEsRUFBRSxFQUFFO2dCQUNkLE1BQVE7Ozs7UUFhUixRQUFRLE9BQU87UUFDZixFQUFFLE9BQU87UUFDVCxTQUFTLFdBQVcsbUJBQW1CLGNBQWMsV0FBVztRQUNoRSxFQUFFLFNBQVM7UUFFWCxNQUFNO3VCQUVGLElBQUssU0FBSSxNQUFNLDBCQUFOLE1BQU0sYUFBTixNQUFNOztZQUNmLFVBQVUsRUFBRSxXQUFXOzJCQUNuQixJQUFLLFNBQUksdUJBQUEsVUFBQTs7Z0JBQ1QsT0FBTyxRQUFRO2dCQUNmLFFBQUEsZUFBQSxPQUFRO2dCQUNSLE1BQU0sRUFBRSxTQUFTLEVBQUU7d0JBQ25CLEtBQU87OztnQkFFZixFQUFFLFdBQVcsR0FBRyxPQUFTO1FBS3pCLEVBQUUsS0FBSyxPQUFNLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSztRQUVuQyxRQUFRLEVBQUUsV0FBVyxHQUFHO2dCQUN4QixNQUFRO1FBRVIsT0FBTyxFQUFFLFdBQVcsR0FBRztRQUN2QixRQUFBLGVBQUEsT0FBUTtnQkFDUixLQUFPIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/syntax.kode
