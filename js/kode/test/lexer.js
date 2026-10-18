var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var lx, pair

import utils from "./utils.js"
let kc = utils.kc

import kode from "../kode.js"
import lexer from "../lexer.js"

toExport["lexer"] = function ()
{
    section("anchored", function ()
    {
        lx = new lexer(new kode({header:false}))
        var list = _k_.list(lx.regs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pair = list[_a_]
            compare(pair[1].sticky,true)
        }
    })
    section("lookarounds", function ()
    {
        compare(kc('7/7'),'7 / 7')
        compare(kc('n/2/7'),'n / 2 / 7')
        compare(kc('a = /re/ b'),'a = /re/\nb')
        compare(kc('[1..2]'),';[1,2]')
        compare(kc('[1...2]'),';[1]')
        compare(kc('●▸ foo\nbar'),"_k_.profile('foo')\nbar")
    })
}
toExport["lexer"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2xleGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztRQWlDUSxTQUFTLFVBQVUsTUFBSyxPQUFPOzRCQUVuQixHQUFHOzs7O29CQUVYLEtBQUssR0FBRyxPQUFTOzs7OztnQkFVckIsR0FBRyxPQUFpQjtnQkFDcEIsR0FBRyxTQUFpQjtnQkFDcEIsR0FBRyxjQUFpQjtnQkFJcEIsR0FBRyxVQUFpQjtnQkFDcEIsR0FBRyxXQUFpQjtnQkFJcEIsR0FBRyxlQUFpQiJ9
//# sourceURL=file://kode/kode/test/lexer.kode
