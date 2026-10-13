var toExport = {}
import utils from "./utils.js"
let kc = utils.kc

toExport["basics"] = function ()
{
    section("literals", function ()
    {
        compare(kc(''),'')
        compare(kc(' '),'')
        compare(kc('a'),'a')
        compare(kc('1'),'1')
        compare(kc('2.2'),'2.2')
        compare(kc('0xfff'),'0xfff')
        compare(kc('0o666'),'0o666')
        compare(kc('""'),'""')
        compare(kc("''"),"''")
        compare(kc('[]'),';[]')
        compare(kc('()'),';()')
        compare(kc('{}'),'{}')
        compare(kc('true'),'true')
        compare(kc('false'),'false')
        compare(kc('yes'),'true')
        compare(kc('no'),'false')
        compare(kc('Infinity'),'Infinity')
        compare(kc('NaN'),'NaN')
        compare(kc('null'),'null')
        compare(kc('undefined'),'undefined')
    })
    section("prop", function ()
    {
        compare(kc('a.a'),'a.a')
        compare(kc('{a:b}.a'),'{a:b}.a')
        compare(kc('a.b.c d'),'a.b.c(d)')
        compare(kc('a.b.c[d]'),'a.b.c[d]')
        compare(kc('[a.b*c[d]]'),';[a.b * c[d]]')
    })
    section("regex", function ()
    {
        compare(kc('/a/'),'/a/')
        compare(kc('/a|b/'),'/a|b/')
        compare(kc('/(a|b)/'),'/(a|b)/')
        compare(kc('/(a|b)/g'),'/(a|b)/g')
        compare(kc('/\\//gimsuy'),'/\\//gimsuy')
        compare(kc('ESCAPEREGEXP = /[-\\^$*+?.()|[\\]{}\\/]/g'),'ESCAPEREGEXP = /[-\\^$*+?.()|[\\]{}\\/]/g')
        compare(kc('ESCAPEREGEXP = /[\-\\\^\$\*\+\?\.\(\)\|\[\]\{\}\/]/g'),'ESCAPEREGEXP = /[\-\\\^\$\*\+\?\.\(\)\|\[\]\{\}\/]/g')
        compare(kc('f c(@x/v)*v, d(@y/v)*v'),'f(c(this.x / v) * v,d(this.y / v) * v)')
    })
    section("op", function ()
    {
        section("eql", function ()
        {
            compare(kc('a == b'),'a === b')
            compare(kc('a != b'),'a !== b')
        })
        section("brackets", function ()
        {
            compare(kc('(1/7)'),';(1 / 7)')
            compare(kc('n/7'),'n / 7')
            compare(kc('n/2/7'),'n / 2 / 7')
            compare(kc('n/(3/7)'),'n / (3 / 7)')
            compare(kc('f n/(4/7)'),'f(n / (4 / 7))')
        })
        section("logigal", function ()
        {
            compare(kc('a and b'),'a && b')
            compare(kc('1 and 2 and 3'),'1 && 2 && 3')
            compare(kc('e and (f or g)'),'e && (f || g)')
            compare(kc('(e and f) or g'),';(e && f) || g')
            compare(kc(`a and \
b or \
c`),`a && b || c`)
            compare(kc(`d and
    e or f and
        g or h`),`d && e || f && g || h`)
            compare(kc(`d and
e or f and
g or h`),`d && e || f && g || h`)
            compare(kc(`a = d and
    e or f and
    g or h`),`a = d && e || f && g || h`)
        })
        section("compchain", function ()
        {
            compare(kc(`b = 1 <= a < c`),`b = (1 <= a && a < c)`)
            compare(kc(`x = y > z >= 1`),`x = (y > z && z >= 1)`)
            compare(kc(`a = b == c == d`),`a = (b === c && c === d)`)
            compare(kc(`a = b != c != d`),`a = (b !== c && c !== d)`)
            compare(kc(`if 1 and (opt.text is str or 2)`),`if (1 && (_k_.isStr(opt.text) || 2))
{
}`)
        })
        section("binary", function ()
        {
            compare(kc("f a|b, x | y, c|d | e| f"),'f(a | b,x | y,c | d | e | f)')
            compare(kc("f a|b x | y c|d | e| f"),'f(a | b,x | y,c | d | e | f)')
            compare(kc("f a&b, x & y, c&d & e& f"),'f(a & b,x & y,c & d & e & f)')
            compare(kc("f a&b x & y c&d & e& f"),'f(a & b,x & y,c & d & e & f)')
            kc('a ^= b','a ^= b')
        })
        section("not", function ()
        {
            compare(kc('not true'),'!true')
            compare(kc('not c1 or c2'),'!c1 || c2')
            compare(kc('not (x > 0)'),'!(x > 0)')
            compare(kc('not x == 0'),'!x === 0')
            compare(kc('if not m = t'),'if (!(m = t))\n{\n}')
        })
    })
    section("assign", function ()
    {
        compare(kc('a = b'),'a = b')
        compare(kc('a = b = c = 1'),'a = b = c = 1')
        compare(kc(`module.exports = sthg
log 'ok'`),`module.exports = sthg
console.log('ok')`)
        compare(kc(`a = b = c = sthg == othr
log 'ok'`),`a = b = c = sthg === othr
console.log('ok')`)
        compare(kc(`d = a and
b or
    c`),`d = a && b || c`)
        compare(kc(`d = a and
    b or
        c`),`d = a && b || c`)
        compare(kc(`d = a and
    b or
    c`),`d = a && b || c`)
        compare(kc(`r = 1 + p = 2 + 3`),`r = 1 + (p = 2 + 3)`)
        compare(kc(`q = ((r) +
     (x))`),`q = ((r) + (x))`)
    })
    section("math", function ()
    {
        compare(kc('a + b'),'a + b')
        compare(kc('a - b + c - 1'),'a - b + c - 1')
        compare(kc('-a+-b'),'-a + -b')
        compare(kc('+a+-b'),'+a + -b')
        compare(kc('a + -b'),'a + -b')
        compare(kc('a+ -b'),'a + -b')
        compare(kc('a + -(b-c)'),'a + -(b - c)')
        compare(kc('b --c'),'b(--c)')
    })
    section("increment", function ()
    {
        compare(kc('a++'),'a++')
        compare(kc('a--'),'a--')
        compare(kc('++a'),'++a')
        compare(kc('--a'),'--a')
        compare(kc('--a,++b'),'--a\n++b')
        compare(kc('a[1]++'),'a[1]++')
        compare(kc('a[1]--'),'a[1]--')
        compare(kc('--a[1]'),'--a[1]')
        compare(kc('++a[1]'),'++a[1]')
        compare(kc('a.b.c++'),'a.b.c++')
        compare(kc('a.b.c--'),'a.b.c--')
        compare(kc('a(b).c++'),'a(b).c++')
        compare(kc('a(b).c--'),'a(b).c--')
        compare(kc('(--b)'),';(--b)')
        compare(kc('(++b)'),';(++b)')
        compare(kc('(b--)'),';(b--)')
        compare(kc('(b++)'),';(b++)')
        compare(kc('log(++b)'),'console.log(++b)')
        compare(kc('log(++{b:1}.b)'),'console.log(++{b:1}.b)')
        if (false)
        {
            compare(kc(('--a++')),'')
            compare(kc(('--a--')),'')
            compare(kc(('++a++')),'')
            compare(kc(('++a--')),'')
            compare(kc(('++--')),'')
            compare(kc(('++1')),'')
            compare(kc(('1--')),'')
            compare(kc(('""++')),'')
        }
    })
}
toExport["basics"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9iYXNpY3Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Z0JBb0JRLEdBQUksSUFBb0I7Z0JBQ3hCLEdBQUksS0FBb0I7Z0JBQ3hCLEdBQUksS0FBb0I7Z0JBQ3hCLEdBQUksS0FBb0I7Z0JBQ3hCLEdBQUksT0FBb0I7Z0JBQ3hCLEdBQUksU0FBb0I7Z0JBQ3hCLEdBQUksU0FBb0I7Z0JBQ3hCLEdBQUksTUFBb0I7Z0JBQ3hCLEdBQUksTUFBb0I7Z0JBQ3hCLEdBQUksTUFBb0I7Z0JBQ3hCLEdBQUksTUFBb0I7Z0JBQ3hCLEdBQUksTUFBb0I7Z0JBQ3hCLEdBQUksUUFBb0I7Z0JBQ3hCLEdBQUksU0FBb0I7Z0JBQ3hCLEdBQUksT0FBb0I7Z0JBQ3hCLEdBQUksTUFBb0I7Z0JBQ3hCLEdBQUksWUFBb0I7Z0JBQ3hCLEdBQUksT0FBb0I7Z0JBQ3hCLEdBQUksUUFBb0I7Z0JBQ3hCLEdBQUksYUFBb0I7Ozs7Z0JBVXhCLEdBQUksT0FBb0I7Z0JBQ3hCLEdBQUksV0FBb0I7Z0JBQ3hCLEdBQUksV0FBb0I7Z0JBQ3hCLEdBQUksWUFBb0I7Z0JBQ3hCLEdBQUksY0FBb0I7Ozs7Z0JBVXhCLEdBQUksT0FBMEI7Z0JBQzlCLEdBQUksU0FBMEI7Z0JBQzlCLEdBQUksV0FBMEI7Z0JBQzlCLEdBQUksWUFBMEI7Z0JBQzlCLEdBQUksZUFBMEI7Z0JBQzlCLEdBQUksNkNBQThDO2dCQUNsRCxHQUFJLHdEQUF5RDtnQkFJN0QsR0FBSSwwQkFBMkI7Ozs7OztvQkFZM0IsR0FBSSxVQUFzQjtvQkFDMUIsR0FBSSxVQUFzQjs7OztvQkFJMUIsR0FBSSxTQUFzQjtvQkFDMUIsR0FBSSxPQUFzQjtvQkFDMUIsR0FBSSxTQUFzQjtvQkFDMUIsR0FBSSxXQUFzQjtvQkFDMUIsR0FBSSxhQUFzQjs7OztvQkFJMUIsR0FBSSxXQUFzQjtvQkFDMUIsR0FBSSxpQkFBc0I7b0JBQzFCLEdBQUksa0JBQXNCO29CQUMxQixHQUFJLGtCQUFzQjtvQkFFMUIsR0FBSTs7SUFLQTtvQkFJSixHQUFJOztpQkFLQTtvQkFJSixHQUFJOztTQUtBO29CQUlKLEdBQUk7O2FBS0E7Ozs7b0JBTUosR0FBSSxrQkFHQTtvQkFJSixHQUFJLGtCQUdBO29CQUlKLEdBQUksbUJBR0E7b0JBSUosR0FBSSxtQkFHQTtvQkFJSixHQUFJLG1DQUdBOzs7Ozs7b0JBUUosR0FBRyw0QkFBNkI7b0JBQ2hDLEdBQUcsMEJBQTZCO29CQUNoQyxHQUFHLDRCQUE2QjtvQkFDaEMsR0FBRywwQkFBNkI7WUFFaEMsR0FBRyxTQUFTOzs7O29CQVVaLEdBQUksWUFBb0I7b0JBQ3hCLEdBQUksZ0JBQW9CO29CQUN4QixHQUFJLGVBQW9CO29CQUN4QixHQUFJLGNBQW9CO29CQUN4QixHQUFJLGdCQUFvQjs7Ozs7Z0JBVTVCLEdBQUksU0FBd0I7Z0JBQzVCLEdBQUksaUJBQXdCO2dCQUU1QixHQUFJO1dBSUE7O2dCQUtKLEdBQUk7V0FJQTs7Z0JBS0osR0FBSTs7UUFLQTtnQkFJSixHQUFJOztZQUtBO2dCQUlKLEdBQUk7O1FBS0E7Z0JBSUosR0FBSSxxQkFHQTtnQkFJSixHQUFJO1lBSUE7Ozs7Z0JBWUosR0FBSSxTQUF3QjtnQkFDNUIsR0FBSSxpQkFBd0I7Z0JBQzVCLEdBQUksU0FBd0I7Z0JBQzVCLEdBQUksU0FBd0I7Z0JBQzVCLEdBQUksVUFBd0I7Z0JBQzVCLEdBQUksU0FBd0I7Z0JBQzVCLEdBQUksY0FBd0I7Z0JBQzVCLEdBQUksU0FBd0I7Ozs7Z0JBZTVCLEdBQUksT0FBd0I7Z0JBQzVCLEdBQUksT0FBd0I7Z0JBQzVCLEdBQUksT0FBd0I7Z0JBQzVCLEdBQUksT0FBd0I7Z0JBQzVCLEdBQUksV0FBd0I7Z0JBRTVCLEdBQUksVUFBd0I7Z0JBQzVCLEdBQUksVUFBd0I7Z0JBQzVCLEdBQUksVUFBd0I7Z0JBQzVCLEdBQUksVUFBd0I7Z0JBRTVCLEdBQUksV0FBd0I7Z0JBQzVCLEdBQUksV0FBd0I7Z0JBRTVCLEdBQUksWUFBd0I7Z0JBQzVCLEdBQUksWUFBd0I7Z0JBRTVCLEdBQUksU0FBd0I7Z0JBQzVCLEdBQUksU0FBd0I7Z0JBQzVCLEdBQUksU0FBd0I7Z0JBQzVCLEdBQUksU0FBd0I7Z0JBQzVCLEdBQUksWUFBd0I7Z0JBQzVCLEdBQUksa0JBQXdCO1lBRXpCOztvQkFDQyxJQUFLLFVBQWtCO29CQUN2QixJQUFLLFVBQWtCO29CQUN2QixJQUFLLFVBQWtCO29CQUN2QixJQUFLLFVBQWtCO29CQUN2QixJQUFLLFNBQWtCO29CQUN2QixJQUFLLFFBQWtCO29CQUN2QixJQUFLLFFBQWtCO29CQUN2QixJQUFLLFNBQWtCIn0=
//# sourceURL=kode/kode/test/basics.kode
