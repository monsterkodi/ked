var toExport = {}
var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }}

var doc, dss, md, rgs

import fs from "fs"
import path from "path"

import util from "./util.js"
let inc = util.inc
let ranges = util.ranges
let dissect = util.dissect
let lang = util.lang

import kulur from "../kulur.js"

toExport["unicode"] = async function ()
{
    await section("doc                                   # node js/kolor/kulur.js writes this to kode/kolor/kulur.md", async function ()
    {
        doc = kulur.unicodeDoc()
        compare(doc.includes('0x2de0 - 0x2dff  ■ 32 combining marks\n\nа аⷠ  о оⷡ'),true)
        compare(doc.includes('combining marks  ■ 7\n\nа а҃  о о҄'),true)
        compare(doc.includes('holds only combining marks'),false)
        md = fs.readFileSync(path.join(_k_.dir(),'../../../kode/kolor/kulur.md'),'utf8')
        compare(doc,md)
    })
    await section("md", async function ()
    {
        lang('md')
        rgs = ranges('α я © – ↔ ∑ ─ ◇ ✔ ¬')
        compare(inc(rgs,0,'α'),'text unicode greek')
        compare(inc(rgs,2,'я'),'text unicode cyrillic')
        compare(inc(rgs,4,'©'),'text unicode symbol')
        compare(inc(rgs,6,'–'),'text unicode punct')
        compare(inc(rgs,8,'↔'),'text unicode arrow')
        compare(inc(rgs,10,'∑'),'text unicode math')
        compare(inc(rgs,12,'─'),'text unicode box')
        compare(inc(rgs,14,'◇'),'text unicode geometric')
        compare(inc(rgs,16,'✔'),'text unicode')
        compare(inc(rgs,18,'¬'),'text unicode symbol')
        rgs = ranges('Å ß ħ Œ ƀ ạ åæ Straße naïve x×y')
        compare(inc(rgs,0,'Å'),'text unicode latin')
        compare(inc(rgs,2,'ß'),'text unicode latin')
        compare(inc(rgs,4,'ħ'),'text unicode latin')
        compare(inc(rgs,6,'Œ'),'text unicode latin')
        compare(inc(rgs,8,'ƀ'),'text unicode latin')
        compare(inc(rgs,10,'ạ'),'text unicode latin')
        compare(inc(rgs,12,'åæ'),'text unicode latin')
        compare(inc(rgs,15,'Straße'),'text')
        compare(inc(rgs,22,'naïve'),'text')
        compare(inc(rgs,29,'×'),'text unicode symbol')
        rgs = ranges('中 x')
        compare(inc(rgs,0,'中'),'text unicode cjk')
        compare(inc(rgs,3,'x'),'text')
        rgs = ranges('■ ▸ ➜ ⮐ … ◆')
        compare(inc(rgs,0,'■'),'text unicode kode')
        compare(inc(rgs,2,'▸'),'text unicode kode')
        compare(inc(rgs,4,'➜'),'text unicode kode')
        compare(inc(rgs,6,'⮐'),'text unicode kode')
        compare(inc(rgs,8,'…'),'text unicode kode')
        compare(inc(rgs,10,'◆'),'text unicode kode')
        rgs = ranges('**a ↔ b** `α`')
        compare(inc(rgs,4,'↔'),'text unicode arrow bold')
        compare(inc(rgs,11,'α'),'text unicode greek code')
        rgs = ranges('a, b')
        compare(inc(rgs,1,','),'punct minor')
    })
    await section("txt", async function ()
    {
        lang('txt')
        rgs = ranges('▸ α ↔')
        compare(inc(rgs,0,'▸'),'text unicode kode')
        compare(inc(rgs,2,'α'),'text unicode greek')
        compare(inc(rgs,4,'↔'),'text unicode arrow')
    })
    await section("kode keeps its symbols as punct", async function ()
    {
        lang('kode')
        rgs = ranges('a ➜ b')
        compare(inc(rgs,2,'➜'),'punct keyword')
        rgs = ranges('x = a ↔ b')
        compare(inc(rgs,6,'↔'),'text unicode arrow')
        lang('md')
        dss = dissect("```kode\n⮐ a\n```")
        compare(inc(dss[1],0,'⮐'),'punct keyword return')
    })
}
toExport["unicode"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pY29kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2xvci90ZXN0L3VuaWNvZGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FDSSxTQUFBO09BQUcsV0FBQTs7T0FDRCxXQUFBO0lBQU87SUFBSTtJQUFPO0lBQVE7O09BQ25CLFlBQUE7Ozs7OztRQU1MLE1BQU0sTUFBTTtRQUUyRCxRQUF2RSxJQUFJLFNBQVMsdURBQTREO1FBQ0YsUUFBdkUsSUFBSSxTQUFTLHNDQUE0RDtRQUNELFFBQXhFLElBQUksU0FBUyw4QkFBNkQ7UUFFMUUsS0FBSyxHQUFHLGFBQWEsS0FBSyxLQUFNLFVBQUssZ0NBQWlDO1FBQ2xFLFFBQUosSUFBTTs7OztRQUlOLEtBQUs7UUFFTCxNQUFNLE9BQU87UUFDVyxRQUF4QixJQUFJLElBQUssRUFBRyxLQUFjO1FBQ0YsUUFBeEIsSUFBSSxJQUFLLEVBQUcsS0FBYztRQUNGLFFBQXhCLElBQUksSUFBSyxFQUFHLEtBQWM7UUFDRixRQUF4QixJQUFJLElBQUssRUFBRyxLQUFjO1FBQ0YsUUFBeEIsSUFBSSxJQUFLLEVBQUcsS0FBYztRQUNGLFFBQXhCLElBQUksSUFBSyxHQUFHLEtBQWM7UUFDRixRQUF4QixJQUFJLElBQUssR0FBRyxLQUFjO1FBQ0YsUUFBeEIsSUFBSSxJQUFLLEdBQUcsS0FBYztRQUNGLFFBQXhCLElBQUksSUFBSyxHQUFHLEtBQWM7UUFDRixRQUF4QixJQUFJLElBQUssR0FBRyxLQUFjO1FBRTFCLE1BQU0sT0FBTztRQUNXLFFBQXhCLElBQUksSUFBSyxFQUFHLEtBQWM7UUFDRixRQUF4QixJQUFJLElBQUssRUFBRyxLQUFjO1FBQ0YsUUFBeEIsSUFBSSxJQUFLLEVBQUcsS0FBYztRQUNGLFFBQXhCLElBQUksSUFBSyxFQUFHLEtBQWM7UUFDRixRQUF4QixJQUFJLElBQUssRUFBRyxLQUFjO1FBQ0YsUUFBeEIsSUFBSSxJQUFLLEdBQUcsS0FBYztRQUNGLFFBQXhCLElBQUksSUFBSyxHQUFHLE1BQWM7UUFDRixRQUF4QixJQUFJLElBQUssR0FBRyxVQUFjO1FBQ0YsUUFBeEIsSUFBSSxJQUFLLEdBQUcsU0FBYztRQUNGLFFBQXhCLElBQUksSUFBSyxHQUFHLEtBQWM7UUFFMUIsTUFBTSxPQUFPO1FBQ1UsUUFBdkIsSUFBSSxJQUFLLEVBQUcsS0FBYTtRQUNELFFBQXhCLElBQUksSUFBSyxFQUFHLEtBQWM7UUFFMUIsTUFBTSxPQUFPO1FBQ1csUUFBeEIsSUFBSSxJQUFLLEVBQUcsS0FBYztRQUNGLFFBQXhCLElBQUksSUFBSyxFQUFHLEtBQWM7UUFDRixRQUF4QixJQUFJLElBQUssRUFBRyxLQUFjO1FBQ0YsUUFBeEIsSUFBSSxJQUFLLEVBQUcsS0FBYztRQUNGLFFBQXhCLElBQUksSUFBSyxFQUFHLEtBQWM7UUFDRixRQUF4QixJQUFJLElBQUssR0FBRyxLQUFjO1FBRTFCLE1BQU0sT0FBTztRQUNXLFFBQXhCLElBQUksSUFBSyxFQUFHLEtBQWM7UUFDRixRQUF4QixJQUFJLElBQUssR0FBRyxLQUFjO1FBRTFCLE1BQU0sT0FBTztRQUNXLFFBQXhCLElBQUksSUFBSyxFQUFHLEtBQWM7Ozs7UUFJMUIsS0FBSztRQUVMLE1BQU0sT0FBTztRQUNXLFFBQXhCLElBQUksSUFBSyxFQUFHLEtBQWM7UUFDRixRQUF4QixJQUFJLElBQUssRUFBRyxLQUFjO1FBQ0YsUUFBeEIsSUFBSSxJQUFLLEVBQUcsS0FBYzs7OztRQUkxQixLQUFLO1FBRUwsTUFBTSxPQUFPO1FBQ1csUUFBeEIsSUFBSSxJQUFLLEVBQUcsS0FBYztRQUUxQixNQUFNLE9BQU87UUFDVyxRQUF4QixJQUFJLElBQUssRUFBRyxLQUFjO1FBRTFCLEtBQUs7UUFDTCxNQUFNLFFBQVE7UUFDVSxRQUF4QixJQUFJLElBQUksR0FBSSxFQUFFLEtBQVkifQ==
//# sourceURL=../../../kode/kolor/test/unicode.kode
