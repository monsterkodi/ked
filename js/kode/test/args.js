var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke
let kd = utils.kd

toExport["args"] = async function ()
{
    await section("func", async function ()
    {
        compare(kc(`f = a -> a`),`
f = function (a)
{
    return a
}`)
        compare(kc(`f = a b -> a + b`),`
f = function (a, b)
{
    return a + b
}`)
        compare(kc(`f = a b=0 -> a + b`),`
f = function (a, b = 0)
{
    return a + b
}`)
        compare(kc(`f = a.map -> `),`f = a.map(function ()
{})`)
        compare(kc(`f = a() -> `),`f = a()(function ()
{})`)
    })
    await section("function", async function ()
    {
        compare(kc(`function D
    f: a b -> a + b`),`
D = (function ()
{
    function D ()
    {}

    D.prototype["f"] = function (a, b)
    {
        return a + b
    }

    return D
})()
`)
    })
    await section("class", async function ()
    {
        compare(kc(`class D
    f: a b -> a + b`),`class D
{
    f (a, b)
    {
        return a + b
    }
}
`)
    })
    await section("object", async function ()
    {
        compare(kc(`obj =
    f: (a,b) -> a + b`),`obj = {f:function (a, b)
{
    return a + b
}}`)
        compare(kc(`obj =
    f: a b -> a + b`),`obj = {f:function (a, b)
{
    return a + b
}}`)
    })
    await section("varargs", async function ()
    {
        compare(kc(`obj = 
    zip: (args...) ->`),`obj = {zip:function (...args)
{}}`)
        compare(kc(`obj = 
    zip: args... ->`),`obj = {zip:function (...args)
{}}`)
        compare(kc(`obj = 
    zip: a b c... ->`),`obj = {zip:function (a, b, ...c)
{}}`)
    })
    await section("propargs", async function ()
    {
        compare(kc(`obj = 
    pullAll: (arr, items, cmp=util.isEqual) ->`),`obj = {pullAll:function (arr, items, cmp = util.isEqual)
{}}`)
        compare(kc(`obj = 
    pullAll: arr items cmp=util.isEqual ->`),`obj = {pullAll:function (arr, items, cmp = util.isEqual)
{}}`)
        compare(kc(`obj = 
    fnc: cmp=util.isEqual ->`),`obj = {fnc:function (cmp = util.isEqual)
{}}`)
        compare(kc(`obj = 
    fnc: a b=d.c c=x.y.z ->`),`obj = {fnc:function (a, b = d.c, c = x.y.z)
{}}`)
    })
    await section("constructor", async function ()
    {
        compare(kc(`function D
    @: a b -> a + b`),`
D = (function ()
{
    function D (a, b)
    {
        a + b
    }

    return D
})()
`)
        compare(kc(`class D
    @: a b -> a + b`),`class D
{
    constructor (a, b)
    {
        a + b
    }
}
`)
    })
    await section("this", async function ()
    {
        compare(kc(`class D
    t: @a ->`),`class D
{
    t (a)
    {
        this.a = a
    }
}
`)
        compare(kc(`class D
    t: @a @b -> @a + @b`),`class D
{
    t (a, b)
    {
        this.a = a
        this.b = b
    
        return this.a + this.b
    }
}
`)
    })
    await section("default", async function ()
    {
        compare(kc(`class D
    d: a=1 -> a`),`class D
{
    d (a = 1)
    {
        return a
    }
}
`)
        compare(kc(`class D
    d: a='2' -> a`),`class D
{
    d (a = '2')
    {
        return a
    }
}
`)
        compare(kc(`class D
    d: a b=2 d='3' -> a`),`class D
{
    d (a, b = 2, d = '3')
    {
        return a
    }
}
`)
        compare(kc(`class D
    d: a=@b -> a`),`class D
{
    d (a = this.b)
    {
        return a
    }
}
`)
        compare(kc(`class D
    d: a={} -> a`),`class D
{
    d (a = {})
    {
        return a
    }
}
`)
        compare(kc(`class D
    d: a=[] -> a`),`class D
{
    d (a = [])
    {
        return a
    }
}
`)
    })
}
toExport["args"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJncy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvYXJncy5rb2RlIl0sIm1hcHBpbmdzIjoiO09BUU0sWUFBQTtJQUFRO0lBQUc7SUFBRzs7Ozs7O2dCQVlaLEdBQUksY0FHQTs7Ozs7Z0JBUUosR0FBSSxvQkFHQTs7Ozs7Z0JBUUosR0FBSSxzQkFHQTs7Ozs7Z0JBUUosR0FBSSxpQkFHQTs7Z0JBS0osR0FBSSxlQUdBOzs7OztnQkFhSixHQUFJO3NCQUlBOzs7Ozs7Ozs7Ozs7Ozs7OztnQkF5QkosR0FBSTtzQkFJQTs7Ozs7Ozs7Ozs7Z0JBbUJKLEdBQUk7d0JBSUE7Ozs7Z0JBT0osR0FBSTtzQkFJQTs7Ozs7OztnQkFlSixHQUFJO3dCQUlBOztnQkFLSixHQUFJO3NCQUlBOztnQkFLSixHQUFJO3VCQUlBOzs7OztnQkFhSixHQUFJO2lEQUlBOztnQkFLSixHQUFJOzZDQUlBOztnQkFLSixHQUFJOytCQUlBOztnQkFLSixHQUFJOzhCQUlBOzs7OztnQkFhSixHQUFJO3NCQUlBOzs7Ozs7Ozs7OztnQkFjSixHQUFJO3NCQUlBOzs7Ozs7Ozs7OztnQkFtQkosR0FBSTtlQUlBOzs7Ozs7OztnQkFXSixHQUFJOzBCQUlBOzs7Ozs7Ozs7Ozs7OztnQkFzQkosR0FBSTtrQkFJQTs7Ozs7Ozs7Z0JBV0osR0FBSTtvQkFJQTs7Ozs7Ozs7Z0JBV0osR0FBSTswQkFJQTs7Ozs7Ozs7Z0JBV0osR0FBSTttQkFJQTs7Ozs7Ozs7Z0JBV0osR0FBSTttQkFJQTs7Ozs7Ozs7Z0JBV0osR0FBSTttQkFJQSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/args.kode
