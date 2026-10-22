var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke
let kd = utils.kd

toExport["function"] = async function ()
{
    await section("basics", async function ()
    {
        compare(kc(`function A`),`
A = (function ()
{
    return A
})()
`)
        compare(kc(`function B
    @a: []
    @b: {}`),`
B = (function ()
{
    function B ()
    {}

    B["a"] = []
    B["b"] = {}
    return B
})()
`)
        compare(kc(`function C
    @a: ->
    b: ->`),`
C = (function ()
{
    function C ()
    {}

    C["a"] = function ()
    {}

    C.prototype["b"] = function ()
    {}

    return C
})()
`)
        compare(kc(`function D
    @: (@a=1,@b=2) ->`),`
D = (function ()
{
    function D (a = 1, b = 2)
    {
        this.a = a
        this.b = b
    }

    return D
})()
`)
    })
    await section("async", async function ()
    {
        compare(kc(`function C
    @a: ○->
    b: ○->
    c: ○=>`),`
C = (function ()
{
    function C ()
    {
        this["c"] = this["c"].bind(this)
    }

    C["a"] = async function ()
    {}

    C.prototype["b"] = async function ()
    {}

    C.prototype["c"] = async function ()
    {}

    return C
})()
`)
    })
    await section("super", async function ()
    {
        compare(kc(`function S
    @: -> super()`),`
S = (function ()
{
    function S ()
    {
        S.__super__.constructor.call(this)
    }

    return S
})()
`)
        compare(kc(`function S extends Q
    @: (a) -> 
        a = 1
        super a
        a = 2`),`
S = (function ()
{
    _k_.extend(S, Q)
    function S (a)
    {
        a = 1
        S.__super__.constructor.call(this,a)
        a = 2
    }

    return S
})()
`)
    })
    await section("extends", async function ()
    {
        compare(kc(`function A extends B.C
    @: -> `),`
A = (function ()
{
    _k_.extend(A, B.C)
    function A ()
    {
        return A.__super__.constructor.apply(this, arguments)
    }

    return A
})()
`)
    })
    await section("old school", async function ()
    {
        compare(ke(`function T1
    @: ->
    f: (a) -> 1 + a

function T2 extends T1
    @: ->
    f: (a) -> super(a) + 30
    
(new T2).f 1`),32)
        compare(ke(`function T3
     
    f: (a) -> 1 + a
 
function T4 extends T3
 
    f: (a) -> super(a) + 40
     
(new T4).f 1`),42)
    })
}
toExport["function"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2Z1bmN0aW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7T0FRTSxZQUFBO0lBQVE7SUFBRztJQUFHOzs7Ozs7Z0JBWVosR0FBSSxjQUdBOzs7Ozs7Z0JBU0osR0FBSTs7YUFLQTs7Ozs7Ozs7Ozs7Z0JBY0osR0FBSTs7WUFLQTs7Ozs7Ozs7Ozs7Ozs7O2dCQWtCSixHQUFJO3dCQUlBOzs7Ozs7Ozs7Ozs7Ozs7Z0JBaUJKLEdBQUk7OzthQU1BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkFnQ0osR0FBSTtvQkFJQTs7Ozs7Ozs7Ozs7Z0JBY0osR0FBSTs7OztnQkFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JBeUJKLEdBQUk7YUFJQTs7Ozs7Ozs7Ozs7Ozs7O2dCQXVCSixHQUFJOzs7Ozs7OztlQVVNO2dCQUVWLEdBQUk7Ozs7Ozs7O2VBVU0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/function.kode
