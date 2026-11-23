var toExport = {}
import utils from "./utils.js"
let kc = utils.kc

toExport["basics"] = async function ()
{
    await section("literals", async function ()
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
    await section("prop", async function ()
    {
        compare(kc('a.a'),'a.a')
        compare(kc('{a:b}.a'),'{a:b}.a')
        compare(kc('a.b.c d'),'a.b.c(d)')
        compare(kc('a.b.c[d]'),'a.b.c[d]')
        compare(kc('[a.b*c[d]]'),';[a.b * c[d]]')
    })
    await section("regex", async function ()
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
    await section("op", async function ()
    {
        await section("eql", async function ()
        {
            compare(kc('a == b'),'a === b')
            compare(kc('a != b'),'a !== b')
        })
        await section("brackets", async function ()
        {
            compare(kc('(1/7)'),';(1 / 7)')
            compare(kc('n/7'),'n / 7')
            compare(kc('n/2/7'),'n / 2 / 7')
            compare(kc('n/(3/7)'),'n / (3 / 7)')
            compare(kc('f n/(4/7)'),'f(n / (4 / 7))')
        })
        await section("logigal", async function ()
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
        await section("compchain", async function ()
        {
            compare(kc(`b = 1 <= a < c`),`b = (1 <= a && a < c)`)
            compare(kc(`x = y > z >= 1`),`x = (y > z && z >= 1)`)
            compare(kc(`a = b == c == d`),`a = (b === c && c === d)`)
            compare(kc(`a = b != c != d`),`a = (b !== c && c !== d)`)
            compare(kc(`if 1 and (opt.text is str or 2)`),`if (1 && (_k_.isStr(opt.text) || 2))
{
}`)
        })
        await section("binary", async function ()
        {
            compare(kc("f a|b, x | y, c|d | e| f"),'f(a | b,x | y,c | d | e | f)')
            compare(kc("f a|b x | y c|d | e| f"),'f(a | b,x | y,c | d | e | f)')
            compare(kc("f a&b, x & y, c&d & e& f"),'f(a & b,x & y,c & d & e & f)')
            compare(kc("f a&b x & y c&d & e& f"),'f(a & b,x & y,c & d & e & f)')
            kc('a ^= b','a ^= b')
        })
        await section("not", async function ()
        {
            compare(kc('not true'),'!true')
            compare(kc('not c1 or c2'),'!c1 || c2')
            compare(kc('not (x > 0)'),'!(x > 0)')
            compare(kc('not x == 0'),'!x === 0')
            compare(kc('if not m = t'),'if (!(m = t))\n{\n}')
        })
    })
    await section("assign", async function ()
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
    await section("math", async function ()
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
    await section("increment", async function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tvZGUvdGVzdC9iYXNpY3Mua29kZSJdLCJtYXBwaW5ncyI6IjtPQUNNLFlBQUE7SUFBUTs7Ozs7O1FBTWdCLFFBQXRCLEdBQUksSUFBb0I7UUFDRixRQUF0QixHQUFJLEtBQW9CO1FBQ0YsUUFBdEIsR0FBSSxLQUFvQjtRQUNGLFFBQXRCLEdBQUksS0FBb0I7UUFDRixRQUF0QixHQUFJLE9BQW9CO1FBQ0YsUUFBdEIsR0FBSSxTQUFvQjtRQUNGLFFBQXRCLEdBQUksU0FBb0I7UUFDRixRQUF0QixHQUFJLE1BQW9CO1FBQ0YsUUFBdEIsR0FBSSxNQUFvQjtRQUNGLFFBQXRCLEdBQUksTUFBb0I7UUFDRixRQUF0QixHQUFJLE1BQW9CO1FBQ0YsUUFBdEIsR0FBSSxNQUFvQjtRQUNGLFFBQXRCLEdBQUksUUFBb0I7UUFDRixRQUF0QixHQUFJLFNBQW9CO1FBQ0YsUUFBdEIsR0FBSSxPQUFvQjtRQUNGLFFBQXRCLEdBQUksTUFBb0I7UUFDRixRQUF0QixHQUFJLFlBQW9CO1FBQ0YsUUFBdEIsR0FBSSxPQUFvQjtRQUNGLFFBQXRCLEdBQUksUUFBb0I7UUFDRixRQUF0QixHQUFJLGFBQW9COzs7O1FBSUYsUUFBdEIsR0FBSSxPQUFvQjtRQUNGLFFBQXRCLEdBQUksV0FBb0I7UUFDRixRQUF0QixHQUFJLFdBQW9CO1FBQ0YsUUFBdEIsR0FBSSxZQUFvQjtRQUNGLFFBQXRCLEdBQUksY0FBb0I7Ozs7UUFJSSxRQUE1QixHQUFJLE9BQTBCO1FBQ0YsUUFBNUIsR0FBSSxTQUEwQjtRQUNGLFFBQTVCLEdBQUksV0FBMEI7UUFDRixRQUE1QixHQUFJLFlBQTBCO1FBQ0YsUUFBNUIsR0FBSSxlQUEwQjtRQUNrQixRQUFoRCxHQUFJLDZDQUE4QztRQUNTLFFBQTNELEdBQUksd0RBQXlEO1FBSWhDLFFBQTdCLEdBQUksMEJBQTJCOzs7Ozs7WUFNSCxRQUF4QixHQUFJLFVBQXNCO1lBQ0YsUUFBeEIsR0FBSSxVQUFz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
//# sourceURL=../../../kode/kode/test/basics.kode
