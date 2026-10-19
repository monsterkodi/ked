var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["func"] = async function ()
{
    await section("async", async function ()
    {
        compare(kc('○->'),'async function ()\n{}')
        compare(kc('○=>'),'async function ()\n{}')
    })
    await section("func", async function ()
    {
        compare(kc('->'),'(function ()\n{})')
        compare(kc('(a) ->'),'(function (a)\n{})')
        compare(kc('(a,b,c) ->'),'(function (a, b, c)\n{})')
        compare(kc('a = (a,b) ->'),'\na = function (a, b)\n{}')
        await section("return", async function ()
        {
            compare(kc(`-> return 1`),`(function ()
{
    return 1
})`)
            compare(kc(`->
    1
    2`),`(function ()
{
    1
    return 2
})`)
            compare(kc(`->
    return 1
    2`),`(function ()
{
    return 1
    return 2
})`)
            compare(kc(`->
    1
    return 2`),`(function ()
{
    1
    return 2
})`)
            compare(kc(`a = (a,b,c) -> d`),`
a = function (a, b, c)
{
    return d
}`)
            compare(kc(`a.x = (y,z) -> q`),`
a.x = function (y, z)
{
    return q
}`)
            compare(kc(`a = ->
    b = ->`),`
a = function ()
{
    var b

    return b = function ()
    {}
}`)
            compare(kc(`a = (b,c) ->
    b = (e, f) -> g
    b`),`
a = function (b, c)
{
    b = function (e, f)
    {
        return g
    }
    return b
}`)
            compare(kc(`a = (b,c) ->
    b = (e, f) -> h`),`
a = function (b, c)
{
    return b = function (e, f)
    {
        return h
    }
}`)
            compare(kc(`a = (b,c) ->
    (e, f) -> j`),`
a = function (b, c)
{
    return function (e, f)
    {
        return j
    }
}`)
            compare(kc(`f = ->
    (a) -> 1`),`
f = function ()
{
    return function (a)
    {
        return 1
    }
}`)
            compare(kc(`a = ->
    'a'
1
`),`
a = function ()
{
    return 'a'
}
1`)
            kc("a = ( a, b=1 c=2 ) ->","\na = function (a, b = 1, c = 2)\n{}")
            compare(kc(`if 1 then return`),`if (1)
{
    return
}`)
            compare(kc(`if x then return
a`),`if (x)
{
    return
}
a`)
        })
        await section("log", async function ()
        {
            compare(kc(`a = ->
    log 'a'

b = ->
    log 'b'`),`
a = function ()
{
    console.log('a')
}

b = function ()
{
    console.log('b')
}`)
        })
        await section("this", async function ()
        {
            compare(kc("-> @a"),`(function ()
{
    return this.a
})`)
            compare(kc("(@a) -> @a"),`(function (a)
{
    this.a = a

    return this.a
})`)
            compare(kc("(@a,a) -> log @a"),`(function (a1, a)
{
    this.a = a1

    console.log(this.a)
})`)
            compare(kc("(@a a) -> log @a"),`(function (a1, a)
{
    this.a = a1

    console.log(this.a)
})`)
        })
    })
    await section("ellipsis", async function ()
    {
        compare(kc(`f = (a1, args...) -> 2`),`
f = function (a1, ...args)
{
    return 2
}`)
        compare(kc(`f = (a2 args...) -> 2`),`
f = function (a2, ...args)
{
    return 2
}`)
        compare(kc(`f = a3 args... -> 2`),`
f = function (a3, ...args)
{
    return 2
}`)
    })
    await section("return", async function ()
    {
        compare(kc(`ff = ->
    if 232 then return`),`
ff = function ()
{
    if (232)
    {
        return
    }
}`)
        compare(kc(`fff = ->
    if 3
        log '42'`),`
fff = function ()
{
    if (3)
    {
        console.log('42')
    }
}`)
        compare(kc(`ffff = ->
    if 4
        '42'`),`
ffff = function ()
{
    if (4)
    {
        return '42'
    }
}`)
        compare(kc(`->
    if 1 then h
    else if 2
        if 3 then j else k
    else l`),`(function ()
{
    if (1)
    {
        return h
    }
    else if (2)
    {
        if (3)
        {
            return j
        }
        else
        {
            return k
        }
    }
    else
    {
        return l
    }
})`)
        compare(kc(`return 'Q' if t == 'W'`),`if (t === 'W')
{
    return 'Q'
}`)
        compare(kc(`return if not XXX`),`if (!XXX)
{
    return
}`)
        compare(kc(`fffff = ->
    try
        'return me!'
    catch e
        error e`),`
fffff = function ()
{
    try
    {
        return 'return me!'
    }
    catch (e)
    {
        console.error(e)
    }
}`)
    })
}
toExport["func"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuYy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvZnVuYy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Z0JBY1EsR0FBSSxPQUF3QjtnQkFDNUIsR0FBSSxPQUF3Qjs7OztnQkFJNUIsR0FBSSxNQUF3QjtnQkFDNUIsR0FBSSxVQUF3QjtnQkFDNUIsR0FBSSxjQUF3QjtnQkFDNUIsR0FBSSxnQkFBd0I7OztvQkFJeEIsR0FBSSxlQUdBOzs7O29CQU9KLEdBQUk7O1FBS0E7Ozs7O29CQVFKLEdBQUk7O1FBS0E7Ozs7O29CQVFKLEdBQUk7O2VBS0E7Ozs7O29CQVFKLEdBQUksb0JBR0E7Ozs7O29CQVFKLEdBQUksb0JBR0E7Ozs7O29CQVFKLEdBQUk7YUFJQTs7Ozs7Ozs7b0JBV0osR0FBSTs7UUFLQTs7Ozs7Ozs7O29CQVlKLEdBQUk7c0JBSUE7Ozs7Ozs7O29CQVdKLEdBQUk7a0JBSUE7Ozs7Ozs7O29CQVdKLEdBQUk7ZUFJQTs7Ozs7Ozs7b0JBV0osR0FBSTs7O0dBTUE7Ozs7OztZQVNKLEdBQUksd0JBQTBCO29CQUU5QixHQUFJLG9CQUdBOzs7O29CQU9KLEdBQUk7SUFJQTs7Ozs7Ozs7b0JBVUosR0FBSTs7OztjQU9BOzs7Ozs7Ozs7Ozs7O29CQWVKLEdBQUksU0FDQTs7OztvQkFPSixHQUFJLGNBQ0E7Ozs7OztvQkFTSixHQUFJLG9CQUNBOzs7Ozs7b0JBU0osR0FBSSxvQkFDQTs7Ozs7Ozs7OztnQkFpQlIsR0FBSSwwQkFHQTs7Ozs7Z0JBUUosR0FBSSx5QkFHQTs7Ozs7Z0JBUUosR0FBSSx1QkFHQTs7Ozs7Ozs7Z0JBZ0JKLEdBQUk7eUJBSUE7Ozs7Ozs7O2dCQVdKLEdBQUk7O21CQUtBOzs7Ozs7OztnQkFXSixHQUFJOztlQUtBOzs7Ozs7OztnQkFXSixHQUFJOzs7O2FBT0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JBeUJKLEdBQUksMEJBR0E7Ozs7Z0JBT0osR0FBSSxxQkFHQTs7OztnQkFPSixHQUFJOzs7O2tCQU9BIn0=
//# sourceURL=file://kode/kode/test/func.kode
