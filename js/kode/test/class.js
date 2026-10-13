var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["class"] = function ()
{
    section("empty", function ()
    {
        compare(kc(`class A`),`class A
{}
`)
    })
    section("constructor", function ()
    {
        compare(kc(`class B
    @: ->`),`class B
{
    constructor ()
    {}
}
`)
    })
    section("async", function ()
    {
        compare(kc(`class C
    @a: ○->
    b: ○->`),`class C
{
    static async a ()
    {}

    async b ()
    {}
}
`)
    })
    section("static", function ()
    {
        compare(kc(`class C
    @a: ->
    b: ->`),`class C
{
    static a ()
    {}

    b ()
    {}
}
`)
        compare(kc(`class E
    @f: ->
    @g: ->`),`class E
{
    static f ()
    {}

    static g ()
    {}
}
`)
        compare(kc(`class F
    @f: ->
    @g: ->
    @h: ->`),`class F
{
    static f ()
    {}

    static g ()
    {}

    static h ()
    {}
}
`)
        compare(kc(`class X
    @: ->
        '@'

    m: -> 'm'`),`class X
{
    constructor ()
    {
        '@'
    }

    m ()
    {
        return 'm'
    }
}
`)
        compare(kc(`class Y
    @: -> '@'

    m: ->
        'm'`),`class Y
{
    constructor ()
    {
        '@'
    }

    m ()
    {
        return 'm'
    }
}
`)
        compare(kc(`class C
    m: ->
        w = new W
            p: true`),`class C
{
    m ()
    {
        var w

        return w = new W({p:true})
    }
}
`)
        section("var", function ()
        {
            compare(kc(`class SV
    @x: 1`),`class SV
{
    static x = 1
}
`)
        })
    })
    section("new", function ()
    {
        compare(kc(`a = new app
    dir: __dirname`),`a = new app({dir:__dirname})`)
    })
    section("bind", function ()
    {
        compare(kc(`class D
    a: =>`),`class D
{
    constructor ()
    {
        this.a = this.a.bind(this)
    }

    a ()
    {}
}
`)
        compare(kc(`class A
    @: -> @f()
    b: => log 'hello'
    f: ->
        g = => @b()
        g()`),`class A
{
    constructor ()
    {
        this.b = this.b.bind(this)
        this.f()
    }

    b ()
    {
        console.log('hello')
    }

    f ()
    {
        var g

        g = (function ()
        {
            return this.b()
        }).bind(this)
        return g()
    }
}
`)
        compare(kc(`class E extends e

    @: (@e) ->

        super()
        @v = -1
        
    start: =>`),`class E extends e
{
    constructor (e)
    {
        this.e = e
    
        super()
    
        this.start = this.start.bind(this)
        this.v = -1
    }

    start ()
    {}
}
`)
        compare(kc(`class E extends e

    @: ->

    asyncBound: ○=>`),`class E extends e
{
    constructor ()
    {
        this.asyncBound = this.asyncBound.bind(this)
    }

    async asyncBound ()
    {}
}
`)
    })
    section("extends", function ()
    {
        compare(kc(`class A extends B.C
    @: -> `),`class A extends B.C
{
    constructor ()
    {}
}
`)
    })
}
toExport["class"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2NsYXNzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztnQkFvQlEsR0FBSSxXQUdBOzs7Ozs7Z0JBY0osR0FBSTtZQUlBOzs7Ozs7Ozs7Z0JBaUJKLEdBQUk7O2FBS0E7Ozs7Ozs7Ozs7OztnQkFjSixHQUFJOztZQUtBOzs7Ozs7Ozs7Z0JBWUosR0FBSTs7YUFLQTs7Ozs7Ozs7O2dCQVlKLEdBQUk7OzthQU1BOzs7Ozs7Ozs7Ozs7Z0JBZUosR0FBSTs7OztnQkFPQTs7Ozs7Ozs7Ozs7OztnQkFnQkosR0FBSTs7OztjQU9BOzs7Ozs7Ozs7Ozs7O2dCQWdCSixHQUFJOzs7c0JBTUE7Ozs7Ozs7Ozs7OztvQkFlQSxHQUFJO1lBSUE7Ozs7Ozs7OztnQkFnQlIsR0FBSTtxQkFJQTs7OztnQkFZSixHQUFJO1lBSUE7Ozs7Ozs7Ozs7O2dCQWNKLEdBQUk7Ozs7O2NBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JBNEJKLEdBQUk7Ozs7Ozs7Z0JBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JBbUJKLEdBQUk7Ozs7c0JBT0E7Ozs7Ozs7Ozs7Ozs7O2dCQXNCSixHQUFJO2FBSUEifQ==
//# sourceURL=kode/kode/test/class.kode
