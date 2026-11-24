var toExport = {}
var _k_ = {eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var cell, cellsWhere, e, h, key, marked, mc, pos, rows, wed, withBg, wrap

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

cellsWhere = function (test)
{
    var line, out, x, y

    h.screen.init()
    e.draw()
    out = []
    for (y = 0; y < h.rows; y++)
    {
        line = ''
        for (x = 0; x < h.cols; x++)
        {
            line += (test(x,y) ? h.at(x,y).replace(/\x1b\[[^m]*m/g,'') : ' ')
        }
        out.push(line.trimEnd())
    }
    return out
}

marked = function (kind)
{
    return cellsWhere(function (x, y)
    {
        return h.screen.c[y][x].mark === kind
    })
}

withBg = function (bg)
{
    return cellsWhere(function (x, y)
    {
        return _k_.eql(h.screen.get_bg(x,y), bg)
    })
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
    await section("selection", async function ()
    {
        wed(['0123456789abcdefghijk','next'])
        key('ctrl+w')
        e.state.setMainCursor(0,1)
        e.state.setSelections([[8,0,12,0]])
        compare(marked('selection'),['        89','ab','','','',''])
        e.state.setSelections([[19,0,2,1]])
        compare(marked('selection'),['','         j','k',' e','',''])
        e.state.setSelections([[0,0,4,1]])
        compare(marked('selection').slice(0, 3),['0123456789','abcdefghij','k'])
    })
    await section("highlight", async function ()
    {
        wed(['0123456789abcdefghijk','next'])
        key('ctrl+w')
        e.state.setMainCursor(0,1)
        e.state.setHighlights([[9,0,11,0]])
        compare(marked('highlight').slice(0, 2),['         9','a'])
    })
    await section("yank", async function ()
    {
        wed(['0123456789abcdefghijk','next'])
        key('ctrl+w')
        e.state.setMainCursor(0,1)
        e.state.novim.yankFlash = [[18,0,21,0]]
        compare(withBg(e.color.yank).slice(0, 3),['','        ij','k'])
    })
    await section("sue", async function ()
    {
        wed(['0123456789abcdefghijk','next'],10,6,['susan'])
        e.state.setSue(8,0,[sue.BG_COLOR,4,1,'#ff0000'])
        key('ctrl+w')
        e.state.setMainCursor(0,1)
        compare(withBg([255,0,0]).slice(0, 2),['        89','ab'])
    })
}
toExport["wrap"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC93cmFwLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQVUsVUFBQTtJQUFTOztPQUNBLFVBQVA7O09BQ08sYUFBWjs7T0FDWSxjQUFaO09BQW9CLGdCQUFwQjs7QUFFUCxJQUFJLElBQUk7O0FBRVIsZ0JBQU0sT0FBTSxPQUFLLElBQUcsT0FBSyxHQUFFLFNBQU87O0lBQzlCLFFBQVEsU0FBUSxLQUFLLEtBQUssS0FBSztJQUMvQixRQUFRLE9BQU8sRUFBRSxPQUFPLFlBQVk7SUFDcEMsRUFBRSxPQUFPLEVBQUUsRUFBRSxLQUFLO0lBQ2xCLEVBQUUsTUFBTSxVQUFVO1dBQ2xCLEVBQUU7OztBQUVOLGdCQUFROztXQUFTLEVBQUUsSUFBSSxFQUFFOzs7QUFDekI7O1dBQVcsRUFBRSxNQUFNOzs7QUFDbkI7O0lBQVcsRUFBRSxPQUFPO0lBQVMsRUFBRTtXQUFTLEVBQUUsT0FBTyxjQUFLOztlQUFNLEVBQUU7Ozs7QUFDOUQsaUJBQVEsR0FBRTs7V0FBSyxFQUFFLFFBQVEsRUFBRTs7O0FBQzNCLGdCQUFRLEdBQUU7O1dBQU8sRUFBRSxNQUFNLFdBQVcsRUFBRTs7O0FBQ3RDLGlCQUFTLEdBQUUsR0FBRTs7V0FBTSxJQUFJLFdBQVcsS0FBSyxHQUFHLEVBQUU7OztBQUU1Qyx1QkFBYTs7OztJQUNULEVBQUUsT0FBTztJQUFTLEVBQUU7SUFDcEI7U0FDSSxJQUFLLE9BQUksRUFBRTs7UUFDWCxPQUFPO2FBQ0gsSUFBSyxPQUFJLEVBQUU7O1lBQ1gsU0FBUSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLFFBQVEsZ0JBQWdCLE1BQU07O1FBQ2hFLElBQUksS0FBSyxLQUFLOztXQUNsQjs7O0FBRUosbUJBQVM7O1dBQVEscUJBQVksR0FBRTs7ZUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUcsU0FBUTs7OztBQUM5RCxtQkFBUzs7V0FBUSxxQkFBWSxHQUFFOzt1QkFBTSxF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
//# sourceURL=../../../kode/ked/test/wrap.kode
