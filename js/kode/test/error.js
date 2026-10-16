var toExport = {}
var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var m, plain

import utils from "./utils.js"
let kf = utils.kf
let kc = utils.kc
let errmsg = utils.errmsg
let codemsg = utils.codemsg

import ansi from "../../kxk/ansi.js"


plain = function (c)
{
    var m

    m = errmsg(c)
    return ansi.strip(m.replace(/\x1b\]8;;[^\x07\x1b]*(\x07|\x1b\\)/g,''))
}
toExport["error"] = function ()
{
    section("names the file", function ()
    {
        codemsg('x = (1\n','err.kode')
    })
    section("missing closing brackets", function ()
    {
        codemsg('x = (1 + 2\n','parens is missing closing )')
        codemsg('x = [1, 2\n','array is missing closing ]')
        codemsg('((((','parens is missing closing )')
        codemsg('[[','array is missing closing ]')
        codemsg('{{','curly is missing closing }')
        codemsg('a[0','index is missing closing ]')
        codemsg('a(1,','explicit call is missing closing bracket )')
        codemsg('r = a.b((rg)','explicit call is missing closing bracket )')
        codemsg('f(','explicit call is missing closing bracket )')
        codemsg('f(a','explicit call is missing closing bracket )')
        codemsg('f(a,','explicit call is missing closing bracket )')
        codemsg('[a](','explicit call is missing closing bracket )')
        codemsg('{a:1}(','explicit call is missing closing bracket )')
        codemsg('a.b(','explicit call is missing closing bracket )')
        codemsg('a?.b(','explicit call is missing closing bracket )')
    })
    section("unmatched closing bracket", function ()
    {
        codemsg(')','unmatched closing bracket')
        codemsg('))))','unmatched closing bracket')
        codemsg('r = a.b(args))','unmatched closing bracket')
        codemsg(`f = ->
    r = some.call(some args))
    log 'r' r
    r`,'unmatched closing bracket')
        codemsg('}','unmatched closing bracket')
        codemsg(']','unmatched closing bracket')
        codemsg('{in: 1}','unmatched closing bracket')
    })
    section("assignment without operand", function ()
    {
        codemsg('a =','assignment without operand')
        codemsg('a.b =','assignment without operand')
    })
    section("an operator the lexer does not have", function ()
    {
        codemsg('===','assignment without operand')
        codemsg('!==','assignment without operand')
        codemsg('<<=','assignment without operand')
        codemsg('>>=','assignment without operand')
        codemsg('>>>=','assignment without operand')
        codemsg('**=','assignment without operand')
    })
    section("a binary operator with no right operand", function ()
    {
        codemsg('&&','& is missing a right operand')
        codemsg('&&=','&= is missing a right operand')
        codemsg('||','| is missing a right operand')
        codemsg('||=','|= is missing a right operand')
        codemsg('&^','^ is missing a right operand')
        codemsg('+++','++ is missing a right operand')
        codemsg('a +++ b','++ is missing a right operand')
    })
    section("property access is missing", function ()
    {
        codemsg('a.','property access is missing property name')
        codemsg('a.b.','property access is missing property name')
        codemsg('@.','property access is missing property name')
        codemsg('?.','property access is missing property name')
    })
    section("keywords missing operands", function ()
    {
        codemsg('if','if is missing a condition')
        codemsg('class','class is missing a name')
        codemsg('function','function is missing a name')
        codemsg('import','import is missing what to import')
        codemsg('export','export is missing what to export')
        codemsg('1 is',"'is' is missing what to test against")
        codemsg('a class','class is missing a name')
        codemsg('a function','function is missing a name')
        codemsg('a import','import is missing what to import')
        codemsg('a export','export is missing what to export')
    })
    section("a keyword with no operand", function ()
    {
        codemsg('await','await is missing an operand')
        codemsg('catch','catch is missing an operand')
        codemsg('else','else is missing an operand')
        codemsg('extends','extends is missing an operand')
        codemsg('finally','finally is missing an operand')
        codemsg('in','in is missing an operand')
        codemsg('super','super is missing an operand')
        codemsg('throw','throw is missing an operand')
        codemsg('typeof','typeof is missing an operand')
        codemsg('when','when is missing an operand')
    })
    section("switch needs a block", function ()
    {
        codemsg('switch x','block expected!')
        codemsg('a switch','block expected!')
    })
    section("a block where an expression belongs", function ()
    {
        codemsg('await\n    a','unexpected block token in exp!')
    })
    section("for is missing", function ()
    {
        codemsg('for','for is missing the variable to iterate')
        codemsg('for x in','for is missing the list to iterate')
        codemsg('a for','for is missing the variable to iterate')
    })
    section("stray character", function ()
    {
        codemsg('a = "','stray character')
        codemsg("a = '",'stray character')
        codemsg('✘','stray character')
    })
    section("postfix needs something assignable", function ()
    {
        codemsg('1++','++ is missing a variable to increment')
        codemsg('1--','-- is missing a variable to increment')
        codemsg('"s"++','++ is missing a variable to increment')
        codemsg('"s"--','-- is missing a variable to increment')
    })
    section("use has one module and one list", function ()
    {
        codemsg('use','use is missing what to use')
        codemsg('use a ◆ b ▪ c','use has a dangling token')
        codemsg('use a ▪ b ▪ c ◆ d','use has a dangling token')
        codemsg('use a ◆ b ◆ c','use has a dangling token')
    })
    section("use with nothing after it", function ()
    {
        codemsg('a use','use is missing what to use')
        codemsg('if use','use is missing what to use')
        codemsg('d use\n','use is missing what to use')
        codemsg('t use\n','use is missing what to use')
        codemsg('t use \n','use is missing what to use')
        codemsg('t use  \n','use is missing what to use')
        codemsg('@\n use\n','use is missing what to use')
        codemsg('b\n use\n','use is missing what to use')
        codemsg('g  use\n','use is missing what to use')
        codemsg('m\n use\n','use is missing what to use')
    })
    section("unreachable code", function ()
    {
        codemsg('return 1 2','unreachable code after return statement?')
    })
    section("misc fails", function ()
    {
        codemsg('log "▪▪#{id"','unterminated string interpolation')
        codemsg('a,',"missing expression after ','")
        codemsg('a...','slice is missing the end')
        codemsg('1...','slice is missing the end')
        codemsg('a:','key is missing a value')
        codemsg('a++-','- is missing a right operand')
        codemsg('a+-+','- is missing a right operand')
        codemsg('a/-^','- is missing a right operand')
    })
    section("the report shows where", function ()
    {
        m = plain('a = 1\nb = foo(')
        m.startsWith('~/s/ked/err.kode:2')
        _k_.in('b = foo(',m)
        compare(_k_.in('2: b',m),false)
        _k_.in('\n    ^',m)
    })
    section("the marker follows the column", function ()
    {
        _k_.in('\n   ^',plain('log "x'))
    })
    section("a tab ahead of the column counts for what it prints as", function ()
    {
        compare(plain('a\t= [1').split('\n')[2],(' '.repeat(12)) + '^')
    })
    section("every report carries a location", function ()
    {
        m = plain('a = 1\nb = (1 + 2')
        compare(m.startsWith('~/s/ked/err.kode:2'),true)
    })
    section("the message is the last line", function ()
    {
        compare(plain('a = [1, 2').split('\n').slice(-1)[0],'array is missing closing ]')
    })
}
toExport["error"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2Vycm9yLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBV0E7Ozs7SUFFSSxJQUFJLE9BQU87V0FDWCxLQUFLLE1BQU0sRUFBRSxRQUFRLHNDQUF1Qzs7Ozs7O1FBTXhELFFBQVEsV0FBb0I7Ozs7UUFJNUIsUUFBUSxlQUFvQjtRQUM1QixRQUFRLGNBQW9CO1FBQzVCLFFBQVEsT0FBb0I7UUFDNUIsUUFBUSxLQUFvQjtRQUM1QixRQUFRLEtBQW9CO1FBQzVCLFFBQVEsTUFBb0I7UUFDNUIsUUFBUSxPQUFvQjtRQUM1QixRQUFRLGVBQW9CO1FBRTVCLFFBQVEsS0FBb0I7UUFDNUIsUUFBUSxNQUFvQjtRQUM1QixRQUFRLE9BQW9CO1FBQzVCLFFBQVEsT0FBb0I7UUFDNUIsUUFBUSxTQUFvQjtRQUM1QixRQUFRLE9BQW9CO1FBQzVCLFFBQVEsUUFBb0I7Ozs7UUFJNUIsUUFBUSxJQUFvQjtRQUM1QixRQUFRLE9BQW9CO1FBQzVCLFFBQVEsaUJBQW9CO1FBQzVCLFFBQVE7OztPQUtvQjtRQUU1QixRQUFRLElBQW9CO1FBQzVCLFFBQVEsSUFBb0I7UUFDNUIsUUFBUSxVQUFvQjs7OztRQUk1QixRQUFRLE1BQW9CO1FBQzVCLFFBQVEsUUFBb0I7Ozs7UUFVNUIsUUFBUSxNQUFvQjtRQUM1QixRQUFRLE1BQW9CO1FBQzVCLFFBQVEsTUFBb0I7UUFDNUIsUUFBUSxNQUFvQjtRQUM1QixRQUFRLE9BQW9CO1FBQzVCLFFBQVEsTUFBb0I7Ozs7UUFJNUIsUUFBUSxLQUFvQjtRQUM1QixRQUFRLE1BQW9CO1FBQzVCLFFBQVEsS0FBb0I7UUFDNUIsUUFBUSxNQUFvQjtRQUM1QixRQUFRLEtBQW9CO1FBQzVCLFFBQVEsTUFBb0I7UUFDNUIsUUFBUSxVQUFvQjs7OztRQUk1QixRQUFRLEtBQW9CO1FBQzVCLFFBQVEsT0FBb0I7UUFDNUIsUUFBUSxLQUFvQjtRQUM1QixRQUFRLEtBQW9COzs7O1FBSTVCLFFBQVEsS0FBb0I7UUFDNUIsUUFBUSxRQUFvQjtRQUM1QixRQUFRLFdBQW9CO1FBQzVCLFFBQVEsU0FBb0I7UUFDNUIsUUFBUSxTQUFvQjtRQUM1QixRQUFRLE9BQW9CO1FBRTVCLFFBQVEsVUFBb0I7UUFDNUIsUUFBUSxhQUFvQjtRQUM1QixRQUFRLFdBQW9CO1FBQzVCLFFBQVEsV0FBb0I7Ozs7UUFZNUIsUUFBUSxRQUFvQjtRQUM1QixRQUFRLFFBQW9CO1FBQzVCLFFBQVEsT0FBb0I7UUFDNUIsUUFBUSxVQUFvQjtRQUM1QixRQUFRLFVBQW9CO1FBQzVCLFFBQVEsS0FBb0I7UUFDNUIsUUFBUSxRQUFvQjtRQUM1QixRQUFRLFFBQW9CO1FBQzVCLFFBQVEsU0FBb0I7UUFDNUIsUUFBUSxPQUFvQjs7OztRQUk1QixRQUFRLFdBQW9CO1FBQzVCLFFBQVEsV0FBb0I7Ozs7UUFJNUIsUUFBUSxlQUFvQjs7OztRQUk1QixRQUFRLE1BQW9CO1FBQzVCLFFBQVEsV0FBb0I7UUFDNUIsUUFBUSxRQUFvQjs7OztRQUk1QixRQUFRLFFBQW9CO1FBQzVCLFFBQVEsUUFBb0I7UUFDNUIsUUFBUSxJQUFvQjs7OztRQUk1QixRQUFRLE1BQVM7UUFDakIsUUFBUSxNQUFTO1FBQ2pCLFFBQVEsUUFBUztRQUNqQixRQUFRLFFBQVM7Ozs7UUFJakIsUUFBUSxNQUE2QjtRQUNyQyxRQUFRLGdCQUE2QjtRQUNyQyxRQUFRLG9CQUE2QjtRQUNyQyxRQUFRLGdCQUE2Qjs7OztRQUlyQyxRQUFRLFFBQTZCO1FBQ3JDLFFBQVEsU0FBNkI7UUFDckMsUUFBUSxVQUE2QjtRQUNyQyxRQUFRLFVBQTZCO1FBQ3JDLFFBQVEsV0FBNkI7UUFDckMsUUFBUSxZQUE2QjtRQUNyQyxRQUFRLFlBQTZCO1FBQ3JDLFFBQVEsWUFBNkI7UUFDckMsUUFBUSxXQUE2QjtRQUNyQyxRQUFRLFlBQTZCOzs7O1FBSXJDLFFBQVEsYUFBb0I7Ozs7UUFJNUIsUUFBUSxlQUFvQjtRQUM1QixRQUFRLEtBQW9CO1FBQzVCLFFBQVEsT0FBb0I7UUFDNUIsUUFBUSxPQUFvQjtRQUM1QixRQUFRLEtBQW9CO1FBQzVCLFFBQVEsT0FBb0I7UUFDNUIsUUFBUSxPQUFvQjtRQUM1QixRQUFRLE9BQW9COzs7O1FBSTVCLElBQUksTUFBTTtRQUVWLEVBQUUsV0FBVztlQUViLFdBQWM7dUJBQ2QsT0FBVSxHQUFLO2VBRWYsVUFBYTs7OztlQUliLFNBQVksTUFBTTs7OztnQkFJbEIsTUFBTSxXQUFXLE1BQU0sTUFBTSxJQUFPLElBQUksT0FBTyxPQUFPOzs7O1FBSXRELElBQUksTUFBTTtnQkFDVixFQUFFLFdBQVcsc0JBQXVCOzs7O2dCQUlwQyxNQUFNLGFBQWEsTUFBTSxtQkFBYSJ9
//# sourceURL=file://kode/kode/test/error.kode
