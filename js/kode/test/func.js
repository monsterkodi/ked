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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuYy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvZnVuYy5rb2RlIl0sIm1hcHBpbmdzIjoiO09BUU0sWUFBQTtJQUFRO0lBQUc7Ozs7OztnQkFNVCxHQUFJLE9BQXdCO2dCQUM1QixHQUFJLE9BQXdCOzs7O2dCQUk1QixHQUFJLE1BQXdCO2dCQUM1QixHQUFJLFVBQXdCO2dCQUM1QixHQUFJLGNBQXdCO2dCQUM1QixHQUFJLGdCQUF3Qjs7O29CQUl4QixHQUFJLGVBR0E7Ozs7b0JBT0osR0FBSTs7UUFLQTs7Ozs7b0JBUUosR0FBSTs7UUFLQTs7Ozs7b0JBUUosR0FBSTs7ZUFLQTs7Ozs7b0JBUUosR0FBSSxvQkFHQTs7Ozs7b0JBUUosR0FBSSxvQkFHQTs7Ozs7b0JBUUosR0FBSTthQUlBOzs7Ozs7OztvQkFXSixHQUFJOztRQUtBOzs7Ozs7Ozs7b0JBWUosR0FBSTtzQkFJQTs7Ozs7Ozs7b0JBV0osR0FBSTtrQkFJQTs7Ozs7Ozs7b0JBV0osR0FBSTtlQUlBOzs7Ozs7OztvQkFXSixHQUFJOzs7R0FNQTs7Ozs7O1lBU0osR0FBSSx3QkFBMEI7b0JBRTlCLEdBQUksb0JBR0E7Ozs7b0JBT0osR0FBSTtJQUlBOzs7Ozs7OztvQkFVSixHQUFJOzs7O2NBT0E7Ozs7Ozs7Ozs7Ozs7b0JBZUosR0FBSSxTQUNBOzs7O29CQU9KLEdBQUksY0FDQTs7Ozs7O29CQVNKLEdBQUksb0JBQ0E7Ozs7OztvQkFTSixHQUFJLG9CQUNBOzs7Ozs7Ozs7O2dCQWlCUixHQUFJLDBCQUdBOzs7OztnQkFRSixHQUFJLHlCQUdBOzs7OztnQkFRSixHQUFJLHVCQUdBOzs7Ozs7OztnQkFnQkosR0FBSTt5QkFJQTs7Ozs7Ozs7Z0JBV0osR0FBSTs7bUJBS0E7Ozs7Ozs7O2dCQVdKLEdBQUk7O2VBS0E7Ozs7Ozs7O2dCQVdKLEdBQUk7Ozs7YUFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkF5QkosR0FBSSwwQkFHQTs7OztnQkFPSixHQUFJLHFCQUdBOzs7O2dCQU9KLEdBQUk7Ozs7a0JBT0EifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/func.kode
