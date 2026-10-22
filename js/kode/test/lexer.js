var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var lx, pair

import utils from "./utils.js"
let kc = utils.kc

import kode from "../kode.js"
import lexer from "../lexer.js"

toExport["lexer"] = async function ()
{
    await section("anchored", async function ()
    {
        lx = new lexer(new kode({header:false}))
        var list = _k_.list(lx.regs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pair = list[_a_]
            compare(pair[1].sticky,true)
        }
    })
    await section("lookarounds", async function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29kZS90ZXN0L2xleGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztRQWlDUSxTQUFTLFVBQVUsTUFBSyxPQUFPOzRCQUVuQixHQUFHOzs7WUFBWDtvQkFFQSxLQUFLLEdBQUcsT0FBUzs7Ozs7Z0JBVXJCLEdBQUcsT0FBaUI7Z0JBQ3BCLEdBQUcsU0FBaUI7Z0JBQ3BCLEdBQUcsY0FBaUI7Z0JBSXBCLEdBQUcsVUFBaUI7Z0JBQ3BCLEdBQUcsV0FBaUI7Z0JBSXBCLEdBQUcsZUFBaUIifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/lexer.kode
