var toExport = {}
var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var codemsg, errmsg, m, plain

import utils from "./utils.js"
let kf = utils.kf
let kc = utils.kc

import ansi from "../../kxk/ansi.js"


errmsg = function (c)
{
    try
    {
        kc(c,'err.kode')
        return ''
    }
    catch (err)
    {
        return String(err)
    }
}

codemsg = function (code, msg)
{
    var m

    m = errmsg(code)
    return compare(_k_.in(msg,m),true)
}

plain = function (c)
{
    var m

    m = errmsg(c)
    return ansi.strip(m.replace(/\x1b\]8;;[^\x07\x1b]*(\x07|\x1b\\)/g,''))
}
toExport["error"] = function ()
{
    section("missing close", function ()
    {
        codemsg('x = (1 + 2\n','missing closing )')
        codemsg('x = [1, 2\n','missing closing ]')
    })
    section("names the file", function ()
    {
        codemsg('x = (1\n','err.kode')
    })
    section("closers name themselves", function ()
    {
        codemsg('((((','parens is missing closing )')
        codemsg('[[','array is missing closing ]')
        codemsg('{{','curly is missing closing }')
        codemsg('a[0','index is missing closing ]')
        codemsg('a(1,','explicit call is missing closing bracket )')
    })
    section("brackets", function ()
    {
        codemsg(')','unmatched closing bracket')
        codemsg('))))','unmatched closing bracket')
    })
    section("assignment without operand", function ()
    {
        codemsg('a =','assignment without operand')
        codemsg('a.b =','assignment without operand')
    })
    section("property", function ()
    {
        codemsg('a.','property access is missing property name')
        codemsg('a.b.','property access is missing property name')
        codemsg('@.','property access is missing property name')
    })
    section("keywords want their operands", function ()
    {
        codemsg('if','if is missing a condition')
        codemsg('class','class is missing a name')
        codemsg('function','function is missing a name')
        codemsg('import','import is missing what to import')
        codemsg('export','export is missing what to export')
        codemsg('1 is',"'is' is missing what to test against")
    })
    section("for wants all three parts", function ()
    {
        codemsg('for','for is missing the variable to iterate')
        codemsg('for x in','for is missing the list to iterate')
    })
    section("stray characters come from the lexer", function ()
    {
        codemsg('a = "','stray character')
        codemsg("a = '",'stray character')
    })
    section("unreachable code", function ()
    {
        codemsg('return 1 2','unreachable code after return statement?')
    })
    section("fail", function ()
    {
        compare(kf("✘"),true)
        compare(kf("r = some.call((some args)"),true)
        compare(kf("r = some.call(some args))"),true)
        compare(kf('log "▪▪#{id"'),true)
        compare(kf(`f = ->
    r = some.call(some args))
    log 'r' r
    r`),true)
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2Vycm9yLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVdBOzs7O1FBR1EsR0FBRyxFQUFFO2VBQ0w7O1dBQ0U7O2VBQ0YsT0FBTzs7OztBQUVmOzs7O0lBRUcsSUFBSSxPQUFPOzBCQUNYLElBQU8sR0FBSTs7O0FBRWQ7Ozs7SUFFSSxJQUFJLE9BQU87V0FDWCxLQUFLLE1BQU0sRUFBRSxRQUFRLHNDQUF1Qzs7Ozs7O1FBTXhELFFBQVEsZUFBb0I7UUFDNUIsUUFBUSxjQUFvQjs7OztRQUk1QixRQUFRLFdBQW9COzs7O1FBSTVCLFFBQVEsT0FBb0I7UUFDNUIsUUFBUSxLQUFvQjtRQUM1QixRQUFRLEtBQW9CO1FBQzVCLFFBQVEsTUFBb0I7UUFDNUIsUUFBUSxPQUFvQjs7OztRQUk1QixRQUFRLElBQW9CO1FBQzVCLFFBQVEsT0FBb0I7Ozs7UUFJNUIsUUFBUSxNQUFvQjtRQUM1QixRQUFRLFFBQW9COzs7O1FBSTVCLFFBQVEsS0FBb0I7UUFDNUIsUUFBUSxPQUFvQjtRQUM1QixRQUFRLEtBQW9COzs7O1FBSTVCLFFBQVEsS0FBb0I7UUFDNUIsUUFBUSxRQUFvQjtRQUM1QixRQUFRLFdBQW9CO1FBQzVCLFFBQVEsU0FBb0I7UUFDNUIsUUFBUSxTQUFvQjtRQUM1QixRQUFRLE9BQW9COzs7O1FBSTVCLFFBQVEsTUFBb0I7UUFDNUIsUUFBUSxXQUFvQjs7OztRQUk1QixRQUFRLFFBQW9CO1FBQzVCLFFBQVEsUUFBb0I7Ozs7UUFJNUIsUUFBUSxhQUFvQjs7OztnQkFJNUIsR0FBSSxLQUFNO2dCQUVWLEdBQUksNkJBQThCO2dCQUNsQyxHQUFJLDZCQUE4QjtnQkFDbEMsR0FBSSxnQkFBaUI7Z0JBRXJCLEdBQUk7OztRQUtPOzs7O1FBSVgsSUFBSSxNQUFNO1FBRVYsRUFBRSxXQUFXO2VBRWIsV0FBYzt1QkFDZCxPQUFVLEdBQUs7ZUFFZixVQUFhOzs7O2VBSWIsU0FBWSxNQUFNOzs7O2dCQUlsQixNQUFNLFdBQVcsTUFBTSxNQUFNLElBQU8sSUFBSSxPQUFPLE9BQU87Ozs7UUFJdEQsSUFBSSxNQUFNO2dCQUNWLEVBQUUsV0FBVyxzQkFBdUI7Ozs7Z0JBSXBDLE1BQU0sYUFBYSxNQUFNLG1CQUFhIn0=
//# sourceURL=file://kode/kode/test/error.kode
