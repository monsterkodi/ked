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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGF4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L3N5bnRheC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFrQlEsUUFBUSxPQUFPO1FBQ2YsRUFBRSxPQUFPO1FBQ1QsRUFBRSxVQUFVO1FBRVosSUFBSTtRQUNKLElBQUk7UUFDSixPQUFPLEVBQUUsU0FBUyxFQUFFO1FBQ3BCLEtBQU87Z0JBRVAsRUFBRSxTQUFTLEVBQUUsRUFBRSxNQUFRLEVBQUUsU0FBUyxFQUFFO2dCQUNwQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEdBQUcsTUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFO1FBRXZDLGVBQWUsRUFBRTtRQUNqQixRQUFRO1FBQ1IsRUFBRTs7WUFDRSxTQUFTO21CQUNULGFBQWEsR0FBRzs7UUFFcEIsRUFBRSxTQUFTLEVBQUUsRUFBRTtRQUNmLEVBQUUsUUFBUSxFQUFFLEVBQUUsR0FBRztnQkFDakIsTUFBUTtRQUVSLEVBQUUsU0FBUyxFQUFFO1FBQ2IsRUFBRSxRQUFRLEVBQUUsRUFBRTtnQkFDZCxNQUFROzs7O1FBYVIsUUFBUSxPQUFPO1FBQ2YsRUFBRSxPQUFPO1FBQ1QsU0FBUyxXQUFXLG1CQUFtQixjQUFjLFdBQVc7UUFDaEUsRUFBRSxTQUFTO1FBRVgsTUFBTTsyQkFFRyxTQUFJLE1BQU0sMEJBQU4sTUFBTSxhQUFOLE1BQU07O1lBQ2YsVUFBVSxFQUFFLFdBQVc7K0JBQ2QsU0FBSSx1QkFBQSxVQUFBOztnQkFDVCxPQUFPLFFBQVE7Z0JBQ2YsUUFBQSxlQUFBLE9BQVE7Z0JBQ1IsTUFBTSxFQUFFLFNBQVMsRUFBRTt3QkFDbkIsS0FBTzs7O2dCQUVmLEVBQUUsV0FBVyxHQUFHLE9BQVM7UUFLekIsRUFBRSxLQUFLLE9BQU0sTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLO1FBRW5DLFFBQVEsRUFBRSxXQUFXLEdBQUc7Z0JBQ3hCLE1BQVE7UUFFUixPQUFPLEVBQUUsV0FBVyxHQUFHO1FBQ3ZCLFFBQUEsZUFBQSxPQUFRO2dCQUNSLEtBQU8ifQ==
//# sourceURL=kode/ked/test/syntax.kode
