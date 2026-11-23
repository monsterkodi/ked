var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["if"] = async function ()
{
    await section("then", async function ()
    {
        compare(kc(`if n
    b `),`if (n)
{
    b
}`)
        compare(kc(`if undefined == null
    no`),`if (undefined === null)
{
    false
}`)
        compare(kc(`if 2
    c = 0
    1`),`if (2)
{
    c = 0
    1
}`)
        compare(kc('if false then true'),`if (false)
{
    true
}`)
        compare(kc(`if false
    true`),`if (false)
{
    true
}`)
        compare(kc(`if false
    true
a = 1`),`if (false)
{
    true
}
a = 1`)
        compare(kc(`if false
    log 2.1
log 2`),`if (false)
{
    console.log(2.1)
}
console.log(2)`)
        compare(kc(`if 2
    a.b c`),`if (2)
{
    a.b(c)
}`)
        compare(kc(`if 3
    a.b c
    a.b c`),`if (3)
{
    a.b(c)
    a.b(c)
}`)
        compare(kc(`if not op in ['--''++']
    decr`),`if (!(_k_.in(op,['--','++'])))
{
    decr
}`)
        compare(kc(`if op not in ['--''++']
    incr`),`if (!(_k_.in(op,['--','++'])))
{
    incr
}`)
        compare(kc(`if 1
    if 2
        a
    if 3
        if 4
            b
        else 
            c
    log 'yes1'`),`if (1)
{
    if (2)
    {
        a
    }
    if (3)
    {
        if (4)
        {
            b
        }
        else
        {
            c
        }
    }
    console.log('yes1')
}`)
        compare(kc(`if e then 1
if 2 then f`),`if (e)
{
    1
}
if (2)
{
    f
}`)
        compare(kc(`->
    if not e then return
        
    if 1
        if 2 in a
            3
        return`),`(function ()
{
    if (!e)
    {
        return
    }
    if (1)
    {
        if (_k_.in(2,a))
        {
            3
        }
        return
    }
})`)
        compare(kc(`if a.clone
    1`),`if (a.clone)
{
    1
}`)
        compare(kc(`if not regexes is Array`),`if (!(regexes instanceof Array))
{
}`)
    })
    await section("block", async function ()
    {
        compare(kc(`if
    1 then 2`),`if (1)
{
    2
}`)
        compare(kc(`if
    10
        20`),`if (10)
{
    20
}`)
        compare(kc(`if
    100
        200
    300
        400
    500
        600
    else
        700`),`if (100)
{
    200
}
else if (300)
{
    400
}
else if (500)
{
    600
}
else
{
    700
}`)
    })
    await section("call arg", async function ()
    {
        compare(kc(`t.push if
    1 ➜ 2
    2 ➜ 3`),`t.push(1 ? 2 : 2 ? 3 : undefined)`)
        compare(kc(`t.push if 2 ➜ 3`),`t.push(2 ? 3 : undefined)`)
        compare(kc(`t.push if 2 then 3 else 4`),`t.push(2 ? 3 : 4)`)
        compare(kc(`t.push if 5 ➜ 6
          7 ➜ 8
            ➜ 9`),`t.push(5 ? 6 : 7 ? 8 : 9)`)
        compare(kc(`t.push if 5 ➜ 6
  7 ➜ 8
    ➜ 9`),`t.push(5 ? 6 : 7 ? 8 : 9)`)
        compare(kc(`t.push if
    1 and 2
        item = clone undefined
        item
    else
        null`),`t.push(((function ()
{
    var item

    if (1 && 2)
    {
        item = _k_.clone(undefined)
        return item
    }
    else
    {
        return null
    }
}).bind(this))())`)
    })
    await section("inline", async function ()
    {
        compare(kc("v = if k == 1 then 2 else 3"),"v = k === 1 ? 2 : 3")
        compare(kc("i = 1 if i == 0"),`if (i === 0)
{
    i = 1
}`)
        compare(kc("if a then i = 10 if i == 10"),`if (a)
{
    if (i === 10)
    {
        i = 10
    }
}`)
        compare(kc(`if false then true else no
a = 1`),`false ? true : false
a = 1`)
        compare(kc(`if false then log 1.1
log 1`),`if (false)
{
    console.log(1.1)
}
console.log(1)`)
        compare(kc(`if false then true else log 3.3
log 3`),`false ? true : console.log(3.3)
console.log(3)`)
        compare(kc(`if 1 then a.b c`),`if (1)
{
    a.b(c)
}`)
        compare(kc(`j = ->
    for m in ms then if bla then blub
    nextline`),`
j = function ()
{
    var m

    var list = _k_.list(ms)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        m = list[_a_]
        if (bla)
        {
            blub
        }
    }
    return nextline
}`)
        compare(kc(`if c then return f a
nextline`),`if (c)
{
    return f(a)
}
nextline`)
        compare(kc(`s = if 1
        2
    else if 3
        4
    else
        5`),`s = 1 ? 2 : 3 ? 4 : 5`)
        compare(kc(`s = if 1
        2
    else if 3
        4`),`s = 1 ? 2 : 3 ? 4 : undefined`)
        compare(kc("h = if w then f g else '0'"),"h = w ? f(g) : '0'")
        compare(kc("a = if 1 then 2 else if 3 then 4 else if 5 then 6 else 7"),"a = 1 ? 2 : 3 ? 4 : 5 ? 6 : 7")
        compare(kc(`a = if 0 then if 1 then if 2 then 3 else if 4 then 5 else 6 else if 7 then 8 else 9 else if 10 then 11 else 12`),`a = 0 ? 1 ? 2 ? 3 : 4 ? 5 : 6 : 7 ? 8 : 9 : 10 ? 11 : 12`)
    })
    await section("else if", async function ()
    {
        compare(kc(`if 1
    log 'yes2'
else if no
    false
else
    log 'no2'
log 'end'`),`if (1)
{
    console.log('yes2')
}
else if (false)
{
    false
}
else
{
    console.log('no2')
}
console.log('end')`)
        compare(kc(`if a in l
    log 'yes3'
else
    log 'no3'
log 'END'`),`if (_k_.in(a,l))
{
    console.log('yes3')
}
else
{
    console.log('no3')
}
console.log('END')`)
    })
    await section("returns", async function ()
    {
        compare(kc(`-> if false then true`),`(function ()
{
    if (false)
    {
        return true
    }
})`)
        compare(kc(`-> if 1 then 2 else 3`),`(function ()
{
    if (1)
    {
        return 2
    }
    else
    {
        return 3
    }
})`)
        compare(kc(`->    
    if a
        e.push
            key:
                key: val`),`(function ()
{
    if (a)
    {
        return e.push({key:{key:val}})
    }
})`)
    })
    await section("tail", async function ()
    {
        compare(kc(`a if b`),`if (b)
{
    a
}`)
        compare(kc(`a if b if c`),`if (c)
{
    if (b)
    {
        a
    }
}`)
        compare(kc(`log 'msg' if dbg`),`if (dbg)
{
    console.log('msg')
}`)
        compare(kc("if 1 then 2"),"if (1)\n{\n    2\n}")
        compare(kc("if 1 then 2"),kc("if 1 then 2"))
        compare(kc("if 1 ➜ 2 else 3"),kc("if 1 then 2 else 3"))
    })
    await section("nicer", async function ()
    {
        compare(kc(`if
    x       ➜ 1
    a == 5  ➜ 2
    'hello' ➜ 3
            ➜ fark`),`if (x)
{
    1
}
else if (a === 5)
{
    2
}
else if ('hello')
{
    3
}
else
{
    fark
}`)
        compare(kc(`if
    x       ➜ 1
    a == 5  ➜ 2
    'hello' ➜ 3
    else
        fark`),`if (x)
{
    1
}
else if (a === 5)
{
    2
}
else if ('hello')
{
    3
}
else
{
    fark
}`)
        compare(kc(`if  
    x       ➜ 1
    a == 5  ➜ 2
    'hello' ➜ 3
    else   fark`),`if (x)
{
    1
}
else if (a === 5)
{
    2
}
else if ('hello')
{
    3
}
else
{
    fark
}`)
        compare(kc(`if  x  ➜ 1
    y  ➜ 2`),`if (x)
{
    1
}
else if (y)
{
    2
}`)
        compare(kc(`if  a 'x' ➜ X
    b 'y' ➜ Y
    else    Z`),`if (a('x'))
{
    X
}
else if (b('y'))
{
    Y
}
else
{
    Z
}`)
        compare(kc(`if  a 'x' ➜ X
    b 'y' ➜ Y
          ➜ Z`),`if (a('x'))
{
    X
}
else if (b('y'))
{
    Y
}
else
{
    Z
}`)
        compare(kc(`if  b   ➜ R
        ➜ S`),`if (b)
{
    R
}
else
{
    S
}`)
        compare(kc(`if  a ➜ P
    ➜ Q`),`if (a)
{
    P
}
else
{
    Q
}`)
    })
}
toExport["if"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2lmLmtvZGUiXSwibWFwcGluZ3MiOiI7T0FDTSxZQUFBO0lBQVE7SUFBRzs7Ozs7O1FBU0QsUUFIUixHQUFJO1NBSUE7Ozs7UUFVSSxRQUhSLEdBQUk7U0FJQTs7OztRQVdJLFFBSlIsR0FBSTs7UUFLQTs7Ozs7UUFRcUIsUUFBekIsR0FBSSxzQkFDQTs7OztRQVVJLFFBSFIsR0FBSTtXQUlBOzs7O1FBVUksUUFKUixHQUFJOztRQUtBOzs7OztRQVlJLFFBSlIsR0FBSTs7UUFLQTs7Ozs7UUFXSSxRQUhSLEdBQUk7WUFJQTs7OztRQVdJLFFBSlIsR0FBSTs7WUFLQTs7Ozs7UUFXSSxRQUhSLEdBQUk7V0FJQTs7OztRQVVJLFFBSFIsR0FBSTtXQUlBOzs7O1FBaUJJLFFBVlIsR0FBSTs7Ozs7Ozs7aUJBV0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUF5QkksUUFIUixHQUFJO2NBSUE7Ozs7Ozs7O1FBbUJJLFFBUlIsR0FBSTs7Ozs7O2lCQVNBOzs7Ozs7Ozs7Ozs7Ozs7UUFxQkksUUFIUixHQUFJO1FBSUE7Ozs7UUFTSSxRQUZSLEdBQUksMkJBR0E7Ozs7OztRQVdJLFFBSFIsR0FBSTtlQUlBOzs7O1FBV0ksUUFKUixHQUFJOzthQUtBOzs7O1FBaUJJLFFBVlIsR0FBSTs7Ozs7Ozs7Y0FXQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXlCSSxRQUpSLEdBQUk7O1lBS0E7UUFNSSxRQUZSLEdBQUksbUJBR0E7UUFNSSxRQUZSLEdBQUksNkJBR0E7UUFRSSxRQUpSLEdBQUk7O2tCQUtBO1FBUUksUUFKUixHQUFJOztVQUtBO1FBV0ksUUFQUixHQUFJOzs7OztlQVFBOzs7Ozs7Ozs7Ozs7Ozs7OztRQW1COEIsUUFBbEMsR0FBSSwrQkFBZ0M7UUFFZCxRQUF0QixHQUFJLG1CQUNBOzs7O1FBTzhCLFFBQWxDLEdBQUksK0JBQ0E7Ozs7Ozs7UUFhSSxRQUhSLEdBQUk7UUFJQTs7UUFRSSxRQUhSLEdBQUk7UUFJQTs7Ozs7UUFXSSxRQUhSLEdBQUk7UUFJQTs7UUFPSSxRQUZSLEdBQUksbUJBR0E7Ozs7UUFXSSxRQUpSLEdBQUk7O2VBS0E7Ozs7Ozs7Ozs7Ozs7Ozs7UUFzQkksUUFIUixHQUFJO1dBSUE7Ozs7O1FBZUksUUFQUixHQUFJOzs7OztZQVFBO1FBU0ksUUFMUixHQUFJOzs7WUFNQTtRQUk2QixRQUFqQyxHQUFJLDhCQUErQjtRQUU0QixRQUEvRCxHQUFJLDREQUE2RDtRQUl6RCxRQUZSLEdBQUksa0hBR0E7Ozs7UUFrREksUUFSUixHQUFJOzs7Ozs7WUFTQTs7Ozs7Ozs7Ozs7OztRQXNCSSxRQU5SLEdBQUk7Ozs7WUFPQTs7Ozs7Ozs7Ozs7O1FBZ0JJLFFBRlIsR0FBSSx5QkFHQTs7Ozs7OztRQVlJLFFBRlIsR0FBSSx5QkFHQTs7Ozs7Ozs7Ozs7UUFvQkksUUFOUixHQUFJOzs7OzJCQU9BOzs7Ozs7Ozs7O1FBY0ksUUFGUixHQUFJLFVBR0E7Ozs7UUFTSSxRQUZSLEdBQUksZUFHQTs7Ozs7OztRQVlJLFFBRlIsR0FBSSxvQkFHQTs7OztRQU9vQixRQUF4QixHQUFJLGVBQXdCO1FBRUosUUFBeEIsR0FBSSxlQUF3QixHQUFJO1FBQ1IsUUFBeEIsR0FBSSxtQkFBd0IsR0FBSTs7OztRQVV4QixRQU5SLEdBQUk7Ozs7cUJBT0E7Ozs7Ozs7Ozs7Ozs7Ozs7UUEwQkksUUFQUixHQUFJOzs7OztlQVFBOzs7Ozs7Ozs7Ozs7Ozs7O1FBeUJJLFFBTlIsR0FBSTs7OztrQkFPQTs7Ozs7Ozs7Ozs7Ozs7OztRQXNCSSxRQUhSLEdBQUk7YUFJQTs7Ozs7Ozs7UUFlSSxRQUpSLEdBQUk7O2dCQUtBOzs7Ozs7Ozs7Ozs7UUFtQkksUUFKUixHQUFJOztnQkFLQTs7Ozs7Ozs7Ozs7O1FBa0JJLFFBSFIsR0FBSTtjQUlBOzs7Ozs7OztRQWNJLFFBSFIsR0FBSTtVQUlBIn0=
//# sourceURL=../../../kode/kode/test/if.kode
