var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["call"] = async function ()
{
    await section("calls", async function ()
    {
        compare(kc('a(b)'),'a(b)')
        compare(kc('a(b,c)'),'a(b,c)')
        compare(kc('a(b c)'),'a(b,c)')
        compare(kc('a b c'),'a(b,c)')
        compare(kc('a(1,null,"2")'),'a(1,null,"2")')
        compare(kc('a(1 null "2")'),'a(1,null,"2")')
        compare(kc('a 1 null "2"'),'a(1,null,"2")')
        compare(kc('a[1](b)'),'a[1](b)')
        compare(kc("f 'b', (a) ->"),"f('b',function (a)\n{})")
        compare(kc("f 'b' (a) ->"),"f('b',function (a)\n{})")
        compare(kc("a('1' 2 3.4 true false null undefined NaN Infinity)"),"a('1',2,3.4,true,false,null,undefined,NaN,Infinity)")
        compare(kc("a '1' 2 3.4 true false null undefined NaN Infinity"),"a('1',2,3.4,true,false,null,undefined,NaN,Infinity)")
        compare(kc("cb not err"),"cb(!err)")
        compare(kc(`a b:c[1], d:2`),`a({b:c[1],d:2})`)
        compare(kc(`a b:c[1] d:2`),`a({b:c[1],d:2})`)
        compare(kc(`a b:c[2], d:3
4`),`a({b:c[2],d:3})
4`)
        compare(kc(`a b:c[2] d:3
4`),`a({b:c[2],d:3})
4`)
        compare(kc(`a '1'
b  2
c  3.4
d  true`),`a('1')
b(2)
c(3.4)
d(true)`)
        compare(kc(`a b 1
c d 2`),`a(b,1)
c(d,2)`)
        compare(kc("a 'b' -> c"),`a('b',function ()
{
    return c
})`)
        compare(kc('l = pat.map ->'),'l = pat.map(function ()\n{})')
        compare(kc(`((a) -> 1)`),`;(function (a)
{
    return 1
})`)
        compare(kc(`l = a (i) -> 0`),`l = a(function (i)
{
    return 0
})`)
        compare(kc(`l = timer ((i) -> 1)`),`l = timer((function (i)
{
    return 1
}))`)
        compare(kc(`l = timer ((i) -> i), y`),`l = timer((function (i)
{
    return i
}),y)`)
        compare(kc(`a.b c:2
x = y`),`a.b({c:2})
x = y`)
        compare(kc(`func c/d w*k`),`func(c / d,w * k)`)
        compare(kc(`func w*k c/d `),`func(w * k,c / d)`)
        compare(kc(`func i++ j--`),`func(i++,j--)`)
        compare(kc(`func a+b c-d`),`func(a + b,c - d)`)
        compare(kc(`func c-d a+b `),`func(c - d,a + b)`)
    })
    await section("positional", async function ()
    {
        compare(kc('a b'),'a(b)')
        compare(kc('a (b)'),'a((b))')
        compare(kc('a (b + 1)'),'a((b + 1))')
        compare(kc('a (b) + 1'),'a((b) + 1)')
        compare(kc('a b {x:1}'),'a(b,{x:1})')
        compare(kc('(a (b))'),';(a,(b))')
        compare(kc('[a (b)]'),';[a,(b)]')
        compare(kc('c a (b)'),'c(a,(b))')
    })
    await section("obj, func", async function ()
    {
        compare(kc(`g h:1, -> 2`),`g({h:1},function ()
{
    return 2
})`)
        compare(kc(`j k:1, (l) -> 3`),`j({k:1},function (l)
{
    return 3
})`)
        compare(kc(`g h:1 -> 2`),`g({h:1},function ()
{
    return 2
})`)
        compare(kc(`j k:1 (l) -> 3`),`j({k:1},function (l)
{
    return 3
})`)
    })
    await section("if", async function ()
    {
        compare(kc(`a if 1 ➜ 2
     2 ➜ 3
       ➜ 4`),`a(1 ? 2 : 2 ? 3 : 4)`)
        compare(kc(`a if 1 ➜ 2
     2 ➜ 1+1;3
       ➜ 4`),`a(((function ()
{
    if (1)
    {
        return 2
    }
    else if (2)
    {
        1 + 1
        return 3
    }
    else
    {
        return 4
    }
}).bind(this))())`)
    })
    await section("switch", async function ()
    {
        compare(kc(`a switch x
     2 ➜ 3
       ➜ 4`),`a(((function ()
{
    switch (x)
    {
        case 2:
            return 3

        default:
            return 4
    }

}).bind(this))())`)
    })
    await section("lambda", async function ()
    {
        compare(kc("a = (-> 1)()"),`a = (function ()
{
    return 1
})()`)
        compare(kc(`a = (->
    1)()`),`a = (function ()
{
    return 1
})()`)
    })
    await section("parens", async function ()
    {
        compare(kc(`a(
    '1'
    2
    3.4
    true
    [
        null
        undefined
    ]
)`),`a('1',2,3.4,true,[null,undefined])`)
    })
    await section("block", async function ()
    {
        compare(kc(`a
    b
        3
c
    d
        4`),`a(b(3))
c(d(4))`)
        compare(kc(`a
    b
    1
c
    d
    2`),`a(b,1)
c(d,2)`)
        compare(kc(`a = x
    c:1
    d:2`),`a = x({c:1,d:2})`)
        compare(kc(`if false
    a = x
        c:1
        d:2`),`if (false)
{
    a = x({c:1,d:2})
}`)
        compare(kc(`f = ->
    a = x
        c:1
        d:2`),`
f = function ()
{
    var a

    return a = x({c:1,d:2})
}`)
        compare(kc(`d = k:1
    v: x
        c:1
        d:2`),`d = {k:1,v:x({c:1,d:2})}`)
        compare(kc(`d = v: x
        c:1
        d:2
    k:1`),`d = {v:x({c:1,d:2}),k:1}`)
        compare(kc(`switch y
    'z'
        x
            c:1
            d:2
    'zz'
        xx
            e:3`),`switch (y)
{
    case 'z':
        x({c:1,d:2})
        break
    case 'zz':
        xx({e:3})
        break
}
`)
        compare(kc(`for y in [1..10]
    x
        c:1
        d:2`),`for (y = 1; y <= 10; y++)
{
    x({c:1,d:2})
}`)
        compare(kc(`for y in [1..10]
    x   c:3
        d:4`),`for (y = 1; y <= 10; y++)
{
    x({c:3,d:4})
}`)
        compare(kc(`for y in [1..10]
    x   c:a
        d:2`),`for (y = 1; y <= 10; y++)
{
    x({c:a,d:2})
}`)
        compare(kc(`for y in [1..10]
    x   c:a
            d:2`),`for (y = 1; y <= 10; y++)
{
    x({c:a({d:2})})
}`)
        compare(ke(`f = (a) -> a

f 
    1 ? 2 : 3`),2)
        compare(ke(`f = (a) -> a

f 1 ? 2 : 3`),2)
        compare(ke(`f = (a) -> a

f if 1 then 2 else 3`),2)
        compare(ke(`f = (a) -> a

f 
    if 1 then 2 else 3`),2)
    })
    await section("comma", async function ()
    {
        compare(kc(`c 1,
  2`),`c(1,2)`)
    })
    await section("the arguments of a call", async function ()
    {
        compare(kc('f a b'),'f(a,b)')
        compare(kc('f a and b'),'f(a && b)')
        compare(kc('f a and b and c'),'f(a && b && c)')
        compare(kc('f a, b and c'),'f(a,b && c)')
        compare(kc("f('op') and b != 'op='"),"f('op') && b !== 'op='")
        compare(kc("f 'op' and b != 'op='"),"f('op' && b !== 'op=')")
        compare(kc("@f box.w node.x"),"this.f(box.w,node.x)")
    })
    await section("chain", async function ()
    {
        compare(kc(`c = []
    .map (t) -> t
    .length > 0`),`c = [].map(function (t)
{
    return t
}).length > 0`)
    })
}
toExport["call"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvY2FsbC5rb2RlIl0sIm1hcHBpbmdzIjoiO09BQ00sWUFBQTtJQUFRO0lBQUc7Ozs7OztRQU1lLFFBQXhCLEdBQUksUUFBc0I7UUFDRixRQUF4QixHQUFJLFVBQXNCO1FBQ0YsUUFBeEIsR0FBSSxVQUFzQjtRQUNGLFFBQXhCLEdBQUksU0FBc0I7UUFDRixRQUF4QixHQUFJLGlCQUFzQjtRQUNGLFFBQXhCLEdBQUksaUJBQXNCO1FBQ0YsUUFBeEIsR0FBSSxnQkFBc0I7UUFDRixRQUF4QixHQUFJLFdBQXNCO1FBQ0YsUUFBeEIsR0FBSSxpQkFBc0I7UUFDRixRQUF4QixHQUFJLGdCQUFzQjtRQUNnQyxRQUExRCxHQUFJLHVEQUNBO1FBRXFELFFBQXpELEdBQUksc0RBQ0E7UUFFb0IsUUFBeEIsR0FBSSxjQUFzQjtRQUlsQixRQUZSLEdBQUksaUJBR0E7UUFNSSxRQUZSLEdBQUksZ0JBR0E7UUFPSSxRQUhSLEdBQUk7SUFJQTs7UUFRSSxRQUhSLEdBQUk7SUFJQTs7UUFVSSxRQUxSLEdBQUk7OztVQU1BOzs7O1FBVUksUUFIUixHQUFJO1FBSUE7O1FBS2EsUUFBakIsR0FBSSxjQUNBOzs7O1FBT29CLFFBQXhCLEdBQUksa0JBQXdCO1FBSXBCLFFBRlIsR0FBSSxjQUdBOzs7O1FBU0ksUUFGUixHQUFJLGtCQUdBOzs7O1FBU0ksUUFGUixHQUFJLHdCQUdBOzs7O1FBU0ksUUFGUixHQUFJLDJCQUdBOzs7O1FBVUksUUFIUixHQUFJO1FBSUE7O1FBT0ksUUFGUixHQUFJLGdCQUdBO1FBTUksUUFGUixHQUFJLGlCQUdBO1FBTUksUUFGUixHQUFJLGdCQUdBO1FBTUksUUFGUixHQUFJLGdCQUdBO1FBTUksUUFGUixHQUFJLGlCQUdBOzs7O1FBTWUsUUFBbkIsR0FBSSxPQUFpQjtRQUNGLFFBQW5CLEdBQUksU0FBaUI7UUFDRixRQUFuQixHQUFJLGFBQWlCO1FBQ0YsUUFBbkIsR0FBSSxhQUFpQjtRQUNGLFFBQW5CLEdBQUksYUFBaUI7UUFFRixRQUFuQixHQUFJLFdBQWlCO1FBQ0YsUUFBbkIsR0FBSSxXQUFpQjtRQUNGLFFBQW5CLEdBQUksV0FBaUI7Ozs7UUFNYixRQUZSLEdBQUksZUFHQTs7OztRQVNJLFFBRlIsR0FBSSxtQkFHQTs7OztRQVNJLFFBRlIsR0FBSSxjQUdBOzs7O1FBU0ksUUFGUixHQUFJLGtCQUdBOzs7Ozs7O1FBYUksUUFKUixHQUFJOzthQUtBO1FBUUksUUFKUixHQUFJOzthQUtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBeUJJLFFBSlIsR0FBSTs7YUFLQTs7Ozs7Ozs7Ozs7Ozs7O1FBaUJlLFFBQW5CLEdBQUksZ0JBQ0E7Ozs7UUFVSSxRQUhSLEdBQUk7V0FJQTs7Ozs7OztRQW9CSSxRQVhSLEdBQUk7Ozs7Ozs7OztJQVlBOzs7O1FBYUksUUFQUixHQUFJOzs7OztZQVFBOztRQVlJLFFBUFIsR0FBSTs7Ozs7UUFRQTs7UUFTSSxRQUpSLEdBQUk7O1VBS0E7UUFTSSxRQUxSLEdBQUk7OztjQU1BOzs7O1FBWUksUUFMUixHQUFJOzs7Y0FNQTs7Ozs7OztRQWVJLFFBTFIsR0FBSTs7O2NBTUE7UUFTSSxRQUxSLEdBQUk7OztVQU1BO1FBYUksUUFUUixHQUFJOzs7Ozs7O2tCQVVBOzs7Ozs7Ozs7O1FBa0JJLFFBTFIsR0FBSTs7O2NBTUE7Ozs7UUFXSSxRQUpSLEdBQUk7O2NBS0E7Ozs7UUFXSSxRQUpSLEdBQUk7O2NBS0E7Ozs7UUFXSSxRQUpSLEdBQUk7O2tCQUtBOzs7O1FBWUksUUFMUixHQUFJOzs7Z0JBS007UUFNRixRQUpSLEdBQUk7O2NBSU07UUFNRixRQUpSLEdBQUk7O3VCQUlNO1FBT0YsUUFMUixHQUFJOzs7eUJBS007Ozs7UUFPRSxRQUhSLEdBQUk7TUFJQTs7OztRQVdlLFFBQXZCLEdBQUksU0FBcUI7UUFDRixRQUF2QixHQUFJLGFBQXFCO1FBQ0YsUUFBdkIsR0FBSSxtQkFBcUI7UUFDRixRQUF2QixHQUFJLGdCQUFxQjtRQUtJLFFBQTdCLEdBQUksMEJBQTJCO1FBQ0YsUUFBN0IsR0FBSSx5QkFBMkI7UUFFRixRQUE3QixHQUFJLG1CQUEyQjs7OztRQVF2QixRQUpSLEdBQUk7O2tCQUtBIn0=
//# sourceURL=../../../kode/kode/test/call.kode
