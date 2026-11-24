var toExport = {}
var cell, e, h, key, mc, pos, rows, wed, wrap

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import sue from "../edit/tool/sue.js"

import editor from "../edit/editor.js"

import harness from "../util/harness.js"
import dumpstate from "../util/dumpstate.js"

h = e = null

wed = function (lines, cols = 10, rows = 6, feats = ['susan'])
{
    h = new harness({cols:cols,rows:rows})
    e = new editor(h.screen,'test_wrap',feats)
    e.layout(0,0,cols,rows)
    e.state.loadLines(lines)
    return e.grabFocus()
}

key = function (combo)
{
    return h.key(e,combo)
}

mc = function ()
{
    return e.state.mainCursor()
}

rows = function ()
{
    h.screen.init()
    e.draw()
    return h.text().map(function (r)
    {
        return r.trimEnd()
    })
}

cell = function (x, y)
{
    return e.posCell(x,y)
}

pos = function (x, row)
{
    return e.state.posForCell(x,row)
}

wrap = function (s, c, w)
{
    return sue.wrapStarts(kseg(s),c,w)
}
toExport["wrap"] = async function ()
{
    await section("starts", async function ()
    {
        compare(wrap('abcdefgh',3,false),[0,3,6])
        compare(wrap('abcdef',3,false),[0,3])
        compare(wrap('',3,false),[0])
        compare(wrap('ab漢x',3,false),[0,2])
        compare(wrap('ab cd ef',4,false),[0,4])
        compare(wrap('ab cd ef',4,true),[0,3,6])
        compare(wrap('abcdefgh ij',4,true),[0,4,8])
        compare(wrap('a bcdefgh',4,true),[0,2,6])
    })
    await section("height", async function ()
    {
        wed(['0123456789abcdefghijk','next'])
        compare(e.state.lineHeight(0),1)
        key('ctrl+w')
        compare(e.state.lineHeight(0),3)
        compare(e.state.lineHeight(1),1)
        compare(e.state.rowOfLine(1),3)
        compare(e.state.totalRows(),4)
        e.layout(0,0,7,6)
        compare(e.state.lineHeight(0),3)
        e.layout(0,0,5,6)
        compare(e.state.lineHeight(0),5)
        e.layout(0,0,10,6)
        e.state.setSue(0,0,[sue.LINE_SCALE,-1,1,2])
        compare(e.state.lineScale(0),2)
        compare(e.state.lineHeight(0),10)
    })
    await section("toggle", async function ()
    {
        wed(['aaaaaaaaaaaa','bbbbbbbbbbbb','cccccccccccc'])
        key('ctrl+w')
        compare(dumpstate.tags(e.state),'[dirty] [undo 1] [wrap: 0]')
        e.state.setCursors([[0,0],[0,1]])
        key('ctrl+w')
        compare(dumpstate.tags(e.state),'[dirty] [undo 2]')
        key('ctrl+w')
        compare(dumpstate.tags(e.state).endsWith('[wrap: 0 1]'),true)
        e.state.setCursors([[0,2],[0,1]],{main:0})
        key('ctrl+w')
        compare(dumpstate.tags(e.state).endsWith('[wrap: 0 1 2]'),true)
        e.state.undo()
        compare(dumpstate.tags(e.state).endsWith('[wrap: 0 1]'),true)
        key('alt+w')
        compare(dumpstate.tags(e.state).endsWith('[wrap: all]'),true)
        key('ctrl+w')
        key('alt+w')
        compare(dumpstate.tags(e.state).endsWith('[wrap: 0 1]'),true)
        key('ctrl+alt+w')
        compare(dumpstate.tags(e.state).endsWith('[wrap: 0 1 word]'),true)
    })
    await section("draw", async function ()
    {
        wed(['0123456789abcdefghijk','next'])
        key('ctrl+w')
        compare(rows(),['0123456789','abcdefghij','k','next','',''])
        key('ctrl+w')
        compare(rows(),['0123456789','next','','','',''])
        wed(['aaa bbb ccc ddd','next'])
        key('alt+w')
        compare(rows(),['aaa bbb cc','c ddd','next','','',''])
        key('ctrl+alt+w')
        compare(rows(),['aaa bbb','ccc ddd','next','','',''])
    })
    await section("scroll", async function ()
    {
        wed(['0123456789abcdef','short'])
        e.state.setMainCursor(14,1)
        compare(e.state.s.view[0],6)
        compare(rows(),['6789abcdef','','','','',''])
        e.state.setMainCursor(14,0)
        key('ctrl+w')
        compare(e.state.s.view[0],0)
        compare(rows(),['0123456789','abcdef','short','','',''])
    })
    await section("cell", async function ()
    {
        wed(['0123456789abcdefghijk','next'])
        key('ctrl+w')
        compare(cell(0,0),[0,0])
        compare(cell(9,0),[9,0])
        compare(cell(10,0),[0,1])
        compare(cell(20,0),[0,2])
        compare(cell(21,0),[1,2])
        compare(cell(30,0),[9,2])
        compare(cell(2,1),[2,3])
        compare(pos(0,1),[10,0])
        compare(pos(4,2),[24,0])
        compare(pos(0,2),[20,0])
        compare(pos(1,2),[21,0])
        compare(pos(3,2),[23,0])
        compare(pos(9,1),[19,0])
        compare(pos(2,3),[2,1])
    })
    await section("cursor", async function ()
    {
        wed(['0123456789abcdefghijk','next'])
        key('ctrl+w')
        e.state.setMainCursor(12,0)
        rows()
        compare(h.placedAt(1,1),true)
        e.state.setMainCursor(2,1)
        rows()
        compare(h.placedAt(1,3),true)
        compare(e.isCursorVisible(),true)
    })
    await section("scaled", async function ()
    {
        wed(['abcdefgh','next'],10,12)
        e.state.setSue(0,0,[sue.LINE_SCALE,-1,1,2])
        key('ctrl+w')
        compare(e.state.wrapStarts(0),[0,5])
        compare(e.state.lineHeight(0),4)
        compare(cell(6,0),[2,2])
        compare(pos(3,3),[6,0])
        compare(e.state.rowOfLine(1),4)
    })
    await section("gutter", async function ()
    {
        wed(['0123456789abcdefghijk','next'],14,6,['susan','gutter'])
        compare(e.cells.cols,10)
        key('ctrl+w')
        compare(rows().map(function (r)
        {
            return r.trim()
        }),['1 0123456789','abcdefghij','k','2 next','',''])
    })
}
toExport["wrap"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC93cmFwLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUFVLFVBQUE7SUFBUzs7T0FDQSxVQUFQOztPQUNPLGFBQVo7O09BQ1ksY0FBWjtPQUFvQixnQkFBcEI7O0FBRVAsSUFBSSxJQUFJOztBQUVSLGdCQUFNLE9BQU0sT0FBSyxJQUFHLE9BQUssR0FBRSxTQUFPOztJQUM5QixRQUFRLFNBQVEsS0FBSyxLQUFLLEtBQUs7SUFDL0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxZQUFZO0lBQ3BDLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSztJQUNsQixFQUFFLE1BQU0sVUFBVTtXQUNsQixFQUFFOzs7QUFFTixnQkFBUTs7V0FBUyxFQUFFLElBQUksRUFBRTs7O0FBQ3pCOztXQUFXLEVBQUUsTUFBTTs7O0FBQ25COztJQUFXLEVBQUUsT0FBTztJQUFTLEVBQUU7V0FBUyxFQUFFLE9BQU8sY0FBSzs7ZUFBTSxFQUFFOzs7O0FBQzlELGlCQUFRLEdBQUU7O1dBQUssRUFBRSxRQUFRLEVBQUU7OztBQUMzQixnQkFBUSxHQUFFOztXQUFPLEVBQUUsTUFBTSxXQUFXLEVBQUU7OztBQUN0QyxpQkFBUyxHQUFFLEdBQUU7O1dBQU0sSUFBSSxXQUFXLEtBQUssR0FBRyxFQUFFOzs7Ozs7UUFNVixRQUExQixLQUFLLFdBQVcsRUFBRSxRQUFXLEVBQUUsRUFBRTtRQUNQLFFBQTFCLEtBQUssU0FBUyxFQUFFLFFBQWEsRUFBRTtRQUNMLFFBQTFCLEtBQUssR0FBRyxFQUFFLFFBQW1CO1FBQ0osUUFBekIsS0FBSyxPQUFPLEVBQUUsUUFBYyxFQUFFO1FBQ0osUUFBMUIsS0FBSyxXQUFXLEVBQUUsUUFBVyxFQUFFO1FBQ0wsUUFBMUIsS0FBSyxXQUFXLEVBQUUsT0FBVyxFQUFFLEVBQUU7UUFDUCxRQUExQixLQUFLLGNBQWMsRUFBRSxPQUFRLEVBQUUsRUFBRTtRQUNQLFFBQTFCLEtBQUssWUFBWSxFQUFFLE9BQVUs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
//# sourceURL=../../../kode/ked/test/wrap.kode
