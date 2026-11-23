var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["class"] = async function ()
{
    await section("empty", async function ()
    {
        compare(kc(`class A`),`class A
{}
`)
    })
    await section("constructor", async function ()
    {
        compare(kc(`class B
    @: ->`),`class B
{
    constructor ()
    {}
}
`)
    })
    await section("async", async function ()
    {
        compare(kc(`class C
    @a: ◯->
    b: ◯->`),`class C
{
    static async a ()
    {}

    async b ()
    {}
}
`)
    })
    await section("static", async function ()
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
        await section("var", async function ()
        {
            compare(kc(`class SV
    @x: 1`),`class SV
{
    static x = 1
}
`)
        })
    })
    await section("new", async function ()
    {
        compare(kc(`a = new app
    dir: __dirname`),`a = new app({dir:__dirname})`)
    })
    await section("bind", async function ()
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

    asyncBound: ◯=>`),`class E extends e
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
    await section("extends", async function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2NsYXNzLmtvZGUiXSwibWFwcGluZ3MiOiI7T0FDTSxZQUFBO0lBQVE7SUFBRzs7Ozs7O1FBUUQsUUFGUixHQUFJLFdBR0E7Ozs7OztRQVdJLFFBSFIsR0FBSTtZQUlBOzs7Ozs7Ozs7UUFlSSxRQUpSLEdBQUk7O2FBS0E7Ozs7Ozs7Ozs7OztRQWtCSSxRQUpSLEdBQUk7O1lBS0E7Ozs7Ozs7OztRQWdCSSxRQUpSLEdBQUk7O2FBS0E7Ozs7Ozs7OztRQWlCSSxRQUxSLEdBQUk7OzthQU1BOzs7Ozs7Ozs7Ozs7UUFxQkksUUFOUixHQUFJOzs7O2dCQU9BOzs7Ozs7Ozs7Ozs7O1FBc0JJLFFBTlIsR0FBSTs7OztjQU9BOzs7Ozs7Ozs7Ozs7O1FBcUJJLFFBTFIsR0FBSTs7O3NCQU1BOzs7Ozs7Ozs7Ozs7WUFrQlEsUUFIUixHQUFJO1lBSUE7Ozs7Ozs7OztRQWFBLFFBSFIsR0FBSTtxQkFJQTs7OztRQVNJLFFBSFIsR0FBSTtZQUlBOzs7Ozs7Ozs7OztRQXFCSSxRQVBSLEdBQUk7Ozs7O2NBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFxQ0ksUUFUUixHQUFJOzs7Ozs7O2dCQVVBOzs7Ozs7Ozs7Ozs7Ozs7O1FBeUJJLFFBTlIsR0FBSTs7OztzQkFPQTs7Ozs7Ozs7Ozs7Ozs7UUFtQkksUUFIUixHQUFJO2FBSUEifQ==
//# sourceURL=../../../kode/kode/test/class.kode
