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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJncy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvYXJncy5rb2RlIl0sIm1hcHBpbmdzIjoiO09BQ00sWUFBQTtJQUFRO0lBQUc7SUFBRzs7Ozs7O2dCQU1aLEdBQUksY0FHQTs7Ozs7Z0JBUUosR0FBSSxvQkFHQTs7Ozs7Z0JBUUosR0FBSSxzQkFHQTs7Ozs7Z0JBUUosR0FBSSxpQkFHQTs7Z0JBS0osR0FBSSxlQUdBOzs7OztnQkFPSixHQUFJO3NCQUlBOzs7Ozs7Ozs7Ozs7Ozs7OztnQkFtQkosR0FBSTtzQkFJQTs7Ozs7Ozs7Ozs7Z0JBYUosR0FBSTt3QkFJQTs7OztnQkFPSixHQUFJO3NCQUlBOzs7Ozs7O2dCQVNKLEdBQUk7d0JBSUE7O2dCQUtKLEdBQUk7c0JBSUE7O2dCQUtKLEdBQUk7dUJBSUE7Ozs7O2dCQU9KLEdBQUk7aURBSUE7O2dCQUtKLEdBQUk7NkNBSUE7O2dCQUtKLEdBQUk7K0JBSUE7O2dCQUtKLEdBQUk7OEJBSUE7Ozs7O2dCQU9KLEdBQUk7c0JBSUE7Ozs7Ozs7Ozs7O2dCQWNKLEdBQUk7c0JBSUE7Ozs7Ozs7Ozs7O2dCQWFKLEdBQUk7ZUFJQTs7Ozs7Ozs7Z0JBV0osR0FBSTswQkFJQTs7Ozs7Ozs7Ozs7Ozs7Z0JBZ0JKLEdBQUk7a0JBSUE7Ozs7Ozs7O2dCQVdKLEdBQUk7b0JBSUE7Ozs7Ozs7O2dCQVdKLEdBQUk7MEJBSUE7Ozs7Ozs7O2dCQVdKLEdBQUk7bUJBSUE7Ozs7Ozs7O2dCQVdKLEdBQUk7bUJBSUE7Ozs7Ozs7O2dCQVdKLEdBQUk7bUJBSUEifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/args.kode
