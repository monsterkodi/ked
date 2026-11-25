var toExport = {}
var _k_ = {eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var cell, cellsWhere, e, h, indent, key, marked, mc, pos, rows, wed, withBg, wrap, wrapped, wraps

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import sue from "../edit/tool/sue.js"

import editor from "../edit/editor.js"

import harness from "../util/harness.js"
import dumpstate from "../util/dumpstate.js"

h = e = null

wed = function (lines, cols = 10, rows = 6, feats = ['susan'], ext = null)
{
    h = new harness({cols:cols,rows:rows})
    e = new editor(h.screen,'test_wrap',feats)
    e.layout(0,0,cols,rows)
    if (ext)
    {
        e.state.syntax.setExt(ext)
    }
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

wrap = function (s, c, w, i)
{
    return sue.wrapStarts(kseg(s),c,w,i)
}

indent = function (s, c)
{
    return sue.wrapIndent(kseg(s),c)
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

wrapped = function (line, ext, cols = 10)
{
    wed([line,'next'],cols,6,['susan'],ext)
    key('alt+w')
    return rows().slice(0, 2)
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
        compare(wrap('abcdefgh',4,false,2),[0,4,6])
        compare(wrap('  ab cd ef',6,true,2),[0,5,8])
    })
    await section("indent", async function ()
    {
        compare(indent('abc',10),0)
        compare(indent('    abc',10),4)
        compare(indent('\t\tabc',10),2)
        compare(indent('        abc',10),5)
        compare(indent('    ',10),4)
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
        }),['1 0123456789','⮐ abcdefghij','⮐ k','2 next','',''])
        e.layout(0,0,14,2)
        e.state.setMainCursor(20,0)
        compare(rows().map(function (r)
        {
            return r.trim()
        }).slice(0, 2),['⮐ abcdefghij','⮐ k'])
    })
    await section("indented", async function ()
    {
        wed(['  aaaaaaaaaaaaa','next'])
        key('ctrl+w')
        compare(e.state.wrapStarts(0),[0,10])
        compare(rows(),['  aaaaaaaa','  aaaaa','next','','',''])
        compare(cell(9,0),[9,0])
        compare(cell(10,0),[2,1])
        compare(cell(14,0),[6,1])
        compare(pos(0,1),[10,0])
        compare(pos(2,1),[10,0])
        compare(pos(6,1),[14,0])
        compare(pos(9,1),[17,0])
        e.state.setSelections([[8,0,12,0]])
        compare(marked('selection').slice(0, 2),['        aa','  aa'])
        wed(['  aaa bbb ccc ddd','next'])
        key('alt+w')
        key('ctrl+alt+w')
        compare(rows(),['  aaa bbb','  ccc ddd','next','','',''])
    })
    await section("syntax", async function ()
    {
        compare(wrapped('- aaaaaaaaaaa','md'),['- aaaaaaaa','  aaa'])
        compare(wrapped('  * aaaaaaaaaa','md'),['  * aaaaaa','    aaaa'])
        compare(wrapped('12. aaaaaaaaaa','md'),['12. aaaaaa','    aaaa'])
        compare(wrapped('1) aaaaaaaaaaa','md'),['1) aaaaaaa','   aaaa'])
        compare(wrapped('### aaaaaaaaaa','md'),['### aaaaaa','    aaaa'])
        compare(wrapped('> aaaaaaaaaaaa','md'),['> aaaaaaaa','  aaaa'])
        compare(wrapped('> - aaaaaaaaaa','md'),['> - aaaaaa','    aaaa'])
        compare(wrapped('- [ ] aaaaaaaaaaaa','md',12),['- [ ] aaaaaa','      aaaaaa'])
        compare(wrapped('aaaa aaaaaaaa','md'),['aaaa aaaaa','aaa'])
        compare(wrapped('# aaaaaaaaaaa','kode'),['# aaaaaaaa','  aaa'])
        compare(wrapped('    # aaaaaaaaaaaaaaaaaaaa','kode',20),['    # aaaaaaaaaaaaaa','      aaaaaa'])
        compare(wrapped('x = aaaaaaaaaaa','kode'),['x = aaaaaa','aaaaa'])
        compare(wrapped('// aaaaaaaaaaa','js'),['// aaaaaaa','   aaaa'])
        compare(wrapped('# aaaaaaaaaaa','sh'),['# aaaaaaaa','  aaa'])
    })
    await section("block comment", async function ()
    {
        wed(['/*',' * aaaaaaaaaa',' */'],10,6,['susan'],'js')
        key('alt+w')
        compare(rows().slice(0, 3),['/*',' * aaaaaaa','   aaa'])
    })
    await section("tall", async function ()
    {
        wed(['0123456789abcdefghijABCDEFGHIJklmnopqrstKLMNO','next'],10,3)
        key('ctrl+w')
        compare(e.state.lineHeight(0),5)
        compare(rows(),['0123456789','abcdefghij','ABCDEFGHIJ'])
        e.state.setMainCursor(32,0)
        compare(rows(),['abcdefghij','ABCDEFGHIJ','klmnopqrst'])
        e.state.setMainCursor(2,1)
        compare(rows(),['klmnopqrst','KLMNO','next'])
        e.state.setSelections([[25,0,42,0]])
        compare(marked('selection'),['klmnopqrst','KL',''])
        e.state.setMainCursor(0,0)
        compare(rows(),['0123456789','abcdefghij','ABCDEFGHIJ'])
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
    await section("edits", async function ()
    {
        wraps = function ()
        {
            return (dumpstate.tags(e.state).split('[wrap: ')[1] != null ? dumpstate.tags(e.state).split('[wrap: ')[1].split(']')[0] : undefined)
        }
        wed(['aaaa bbbb cccc','dddd','eeee'])
        key('ctrl+w')
        e.state.setMainCursor(4,0)
        e.state.insert('\n')
        compare(e.state.s.lines.length,4)
        compare(wraps(),'0')
        e.state.delete('back')
        compare(e.state.s.lines.length,3)
        compare(wraps(),'0')
        e.state.setMainCursor(0,0)
        e.state.insert('x')
        compare(wraps(),'0')
        e.state.setMainCursor(0,1)
        key('ctrl+w')
        compare(wraps(),'0 1')
        e.state.delete('back')
        compare(wraps(),'0')
        e.state.setMainCursor(0,1)
        key('ctrl+w')
        e.state.setMainCursor(0,0)
        key('ctrl+w')
        compare(wraps(),'1')
        e.state.setMainCursor(0,1)
        e.state.delete('back')
        compare(wraps(),undefined)
        e.state.undo()
        compare(wraps(),'1')
        e.state.setMainCursor(2,1)
        e.state.insert('one\ntwo\nthree')
        compare(e.state.s.lines.length,4)
        compare(wraps(),'1')
        e.state.setMainCursor(0,1)
        e.state.insert('\n')
        compare(wraps(),'2')
        e.state.setMainCursor(2,2)
        e.state.joinLines()
        compare(wraps(),'2')
    })
}
toExport["wrap"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC93cmFwLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQVUsVUFBQTtJQUFTOztPQUNBLFVBQVA7O09BQ08sYUFBWjs7T0FDWSxjQUFaO09BQW9CLGdCQUFwQjs7QUFFUCxJQUFJLElBQUk7O0FBRVIsZ0JBQU0sT0FBTSxPQUFLLElBQUcsT0FBSyxHQUFFLFNBQU8sVUFBUyxNQUFJOztJQUMzQyxRQUFRLFNBQVEsS0FBSyxLQUFLLEtBQUs7SUFDL0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxZQUFZO0lBQ3BDLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSztRQUNXOztRQUE3QixFQUFFLE1BQU0sT0FBTyxPQUFPOztJQUN0QixFQUFFLE1BQU0sVUFBVTtXQUNsQixFQUFFOzs7QUFFTixnQkFBUTs7V0FBUyxFQUFFLElBQUksRUFBRTs7O0FBQ3pCOztXQUFXLEVBQUUsTUFBTTs7O0FBQ25COztJQUFXLEVBQUUsT0FBTztJQUFTLEVBQUU7V0FBUyxFQUFFLE9BQU8sY0FBSzs7ZUFBTSxFQUFFOzs7O0FBQzlELGlCQUFRLEdBQUU7O1dBQUssRUFBRSxRQUFRLEVBQUU7OztBQUMzQixnQkFBUSxHQUFFOztXQUFPLEVBQUUsTUFBTSxXQUFXLEVBQUU7OztBQUN0QyxpQkFBUyxHQUFFLEdBQUUsR0FBRTs7V0FBTSxJQUFJLFdBQVcsS0FBSyxHQUFHLEVBQUUsRUFBRTs7O0FBQ2hELG1CQUFVLEdBQUU7O1dBQU0sSUFBSSxXQUFXLEtBQUssR0FBRzs7O0FBRXpDLHVCQUFhOzs7O0lBQ1QsRUFBRSxPQUFPO0lBQVMsRUFBRTtJQUNwQjtTQUNJLElBQUssT0FBSSxFQUFFOztRQUNYLE9BQU87YUFDSCxJQUFLLE9BQUksRUFBRTs7WUFDWCxTQUFRLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsUUFBUSxnQkFBZ0IsTUFBTTs7UUFDaEUsSUFBSSxLQUFLLEtBQUs7O1dBQ2xCOzs7QUFFSixvQkFBVSxNQUFLLEtBQUksT0FBSzs7SUFDcEIsS0FBSyxLQUFLLFFBQVEsS0FBSyxHQUFHLFNBQVM7SUFDbkMsSUFBSTtXQUNKLGFBQU87OztBQUVYLG1CQUFTOztXQUFRLHFCQUFZLEdBQUU7O2VBQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLFNBQVE7Ozs7QUFDOUQsbUJBQVM7O1dBQVEscUJBQVksR0FBRTs7dUJBQU0sRUFBRSxPQUFPLE9BQU8sRUFBRSxJQUFPOzs7Ozs7O1FBTTVCLFFBQTFCLEtBQUssV0FBVyxFQUFFLFFBQVcsRUFBRSxFQUFFO1FBQ1AsUUFBMUIsS0FBSyxTQUFTLEVBQUUsUUFBYSxFQUFFO1FBQ0wsUUFBMUIsS0FBSyxHQUFHLEVBQUUsUUFBbUI7UUFDSixRQUF6QixLQUFLLE9BQU8sRUFBRSxRQUFjLEVBQUU7UUFDSixRQUExQixLQUFLLFdBQVcsRUFBRSxRQUFXLEVBQUU7UUFDTCxRQUExQixLQUFLLFdBQVcsRUFBRSxPQUFXLEVBQUUsRUFBRTtRQUNQLFFBQTFCLEtBQUssY0FBYyxFQUFFLE9BQVEsRUFBRSxFQUFFO1FBQ1AsUUFBMUIsS0FBSyxZQUFZLEVBQUUsT0FBVSxFQUFFLEVBQUU7UUFDUCxRQUExQixLQUFLLFdBQVcsRUFBRSxNQUFNLElBQUssRUFBRSxFQUFFO1FBQ04sUUFBM0IsS0FBSyxhQUFhLEVBQUUsS0FBSyxJQUFLLEVBQUUsRUFBRTs7OztRQUlWLFFBQXhCLE9BQU8sTUFBTSxJQUFhO1FBQ0YsUUFBeEIsT0FBTyxVQUFVLElBQVM7UUFDRixRQUF4QixPQUFPLFVBQVUsSUFBUztRQUNGLFFBQXhCLE9BQU8sY0FBYyxJQUFLO1FBQ0YsUUFBeEIsT0FBTyxPQUFPLElBQVk7Ozs7UUFJMUIsS0FBSyx3QkFBd0I7UUFDUixRQUFyQixFQUFFLE1BQU0sV0FBVyxHQUFJO1FBQ3ZCLElBQUk7UUFDaUIsUUFBckIsRUFBRSxNQUFNLFdBQVcsR0FBSTtRQUNGLFFBQXJCLEVBQUUsTUFBTSxXQUFXLEdBQUk7UUFDSCxRQUFwQixFQUFFLE1BQU0sVUFBVSxHQUFJO1FBQ0YsUUFBcEIsRUFBRSxNQUFNLFlBQWM7UUFDdEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFO1FBQ00sUUFBckIsRUFBRSxNQUFNLFdBQVcsR0FBSTtRQUN2QixFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUU7UUFDTSxRQUFyQixFQUFFLE1BQU0sV0FBVyxHQUFJO1FBQ3ZCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFLE1BQU0sT0FBTyxFQUFFLEdBQUcsSUFBSSxXQUFXLEdBQUcsRUFBRTtRQUNwQixRQUFwQixFQUFFLE1BQU0sVUFBVSxHQUFJO1FBQ0QsUUFBckIsRUFBRSxNQUFNLFdBQVcsR0FBSTs7OztRQUl2QixLQUFLLGVBQWUsZUFBZTtRQUNuQyxJQUFJO1FBQ29CLFFBQXhCLFVBQVUsS0FBSyxFQUFFLE9BQVM7UUFDMUIsRUFBRSxNQUFNLGFBQWEsRUFBRSxJQUFJLEVBQUU7UUFDN0IsSUFBSTtRQUNvQixRQUF4QixVQUFVLEtBQUssRUFBRSxPQUFTO1FBQzFCLElBQUk7UUFDNEMsUUFBaEQsVUFBVSxLQUFLLEVBQUUsT0FBTyxTQUFTLGVBQWlCO1FBQ2xELEVBQUUsTUFBTSxhQUFhLEVBQUUsSUFBSSxFQUFFLEtBQUksS0FBSztRQUN0QyxJQUFJO1FBQzhDLFFBQWxELFVBQVUsS0FBSyxFQUFFLE9BQU8sU0FBUyxpQkFBbUI7UUFDcEQsRUFBRSxNQUFNO1FBQ3dDLFFBQWhELFVBQVUsS0FBSyxFQUFFLE9BQU8sU0FBUyxlQUFpQjtRQUNsRCxJQUFJO1FBQzRDLFFBQWhELFVBQVUsS0FBSyxFQUFFLE9BQU8sU0FBUyxlQUFpQjtRQUNsRCxJQUFJO1FBQ0osSUFBSTtRQUM0QyxRQUFoRCxVQUFVLEtBQUssRUFBRSxPQUFPLFNBQVMsZUFBaUI7UUFDbEQsSUFBSTtRQUNpRCxRQUFyRCxVQUFVLEtBQUssRUFBRSxPQUFPLFNBQVMsb0JBQXNCOzs7O1FBSXZELEtBQUssd0JBQXdCO1FBQzdCLElBQUk7UUFDRyxRQUFQLFFBQVUsYUFBYSxhQUFhLElBQUksT0FBTyxHQUFHO1FBQ2xELElBQUk7UUFDRyxRQUFQLFFBQVUsYUFBYSxPQUFPLEdBQUcsR0FBRyxHQUFHO1FBQ3ZDLEtBQUssa0JBQWtCO1FBQ3ZCLElBQUk7UUFDRyxRQUFQLFFBQVUsYUFBYSxRQUFRLE9BQU8sR0FBRyxHQUFHO1FBQzVDLElBQUk7UUFDRyxRQUFQLFFBQVUsVUFBVSxVQUFVLE9BQU8sR0FBRyxHQUFHOzs7O1FBSTNDLEtBQUssbUJBQW1CO1FBQ3hCLEVBQUUsTUFBTSxjQUFjLEdBQUc7UUFDUCxRQUFsQixFQUFFLE1BQU0sRUFBRSxLQUFLLEdBQUs7UUFDYixRQUFQLFFBQVUsYUFBYSxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQ25DLEVBQUUsTUFBTSxjQUFjLEdBQUc7UUFDekIsSUFBSTtRQUNjLFFBQWxCLEVBQUUsTUFBTSxFQUFFLEtBQUssR0FBSztRQUNiLFFBQVAsUUFBVSxhQUFhLFNBQVMsUUFBUSxHQUFHLEdBQUc7Ozs7UUFJOUMsS0FBSyx3QkFBd0I7UUFDN0IsSUFBSTtRQUNNLFFBQVYsS0FBSyxFQUFFLElBQU0sRUFBRTtRQUNMLFFBQVYsS0FBSyxFQUFFLElBQU0sRUFBRTtRQUNMLFFBQVYsS0FBSyxHQUFHLElBQUssRUFBRTtRQUNMLFFBQVYsS0FBSyxHQUFHLElBQUssRUFBRTtRQUNMLFFBQVYsS0FBSyxHQUFHLElBQUssRUFBRTtRQUNMLFFBQVYsS0FBSyxHQUFHLElBQUssRUFBRTtRQUNMLFFBQVYsS0FBSyxFQUFFLElBQU0sRUFBRTtRQUNMLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sRUFBRTs7OztRQUlmLEtBQUssd0JBQXdCO1FBQzdCLElBQUk7UUFDSixFQUFFLE1BQU0sY0FBYyxHQUFHO1FBQ3pCO1FBQ2dCLFFBQWhCLEVBQUUsU0FBUyxFQUFFLEdBQUs7UUFDbEIsRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUN4QjtRQUNnQixRQUFoQixFQUFFLFNBQVMsRUFBRSxHQUFLO1FBQ0UsUUFBcEIsRUFBRSxrQkFBb0I7Ozs7UUFJdEIsS0FBSyxXQUFXLFFBQVEsR0FBRztRQUMzQixFQUFFLE1BQU0sT0FBTyxFQUFFLEdBQUcsSUFBSSxXQUFXLEdBQUcsRUFBRTtRQUN4QyxJQUFJO1FBQ2lCLFFBQXJCLEVBQUUsTUFBTSxXQUFXLElBQUssRUFBRTtRQUNMLFFBQXJCLEVBQUUsTUFBTSxXQUFXLEdBQUk7UUFDZCxRQUFULEtBQUssRUFBRSxJQUFLLEVBQUU7UUFDTixRQUFSLElBQUksRUFBRSxJQUFLLEVBQUU7UUFDTyxRQUFwQixFQUFFLE1BQU0sVUFBVSxHQUFJOzs7O1FBSXRCLEtBQUssd0JBQXdCLFFBQVEsR0FBRyxHQUFHLFFBQVE7UUFDdEMsUUFBYixFQUFFLE1BQU0sS0FBTztRQUNmLElBQUk7UUFDd0IsUUFBNUIsT0FBTyxjQUFLOzttQkFBTSxFQUFFO1lBQVcsZUFBZSxlQUFlLE1BQU0sU0FBUyxHQUFHO1FBQy9FLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFLE1BQU0sY0FBYyxHQUFHO1FBQ1UsUUFBbkMsT0FBTyxjQUFLOzttQkFBTSxFQUFFO2lCQUFRLE9BQVUsZUFBZTs7OztRQUlyRCxLQUFLLGtCQUFrQjtRQUN2QixJQUFJO1FBQ2lCLFFBQXJCLEVBQUUsTUFBTSxXQUFXLElBQUssRUFBRTtRQUNuQixRQUFQLFFBQVUsYUFBYSxVQUFVLE9BQU8sR0FBRyxHQUFHO1FBQ3BDLFFBQVYsS0FBSyxFQUFFLElBQU0sRUFBRTtRQUNMLFFBQVYsS0FBSyxHQUFHLElBQUssRUFBRTtRQUNMLFFBQVYsS0FBSyxHQUFHLElBQUssRUFBRTtRQUNMLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNoQixFQUFFLE1BQU0sZ0JBQWdCLEVBQUUsRUFBRSxHQUFHO1FBQ0osUUFBM0IsT0FBTyxtQkFBYSxPQUFVLGFBQWE7UUFDM0MsS0FBSyxvQkFBb0I7UUFDekIsSUFBSTtRQUNKLElBQUk7UUFDRyxRQUFQLFFBQVUsWUFBWSxZQUFZLE9BQU8sR0FBRyxHQUFHOzs7O1FBSUgsUUFBNUMsUUFBUSxnQkFBZ0IsT0FBdUIsYUFBYTtRQUNoQixRQUE1QyxRQUFRLGlCQUFpQixPQUFzQixhQUFhO1FBQ2hCLFFBQTVDLFFBQVEsaUJBQWlCLE9BQXNCLGFBQWE7UUFDaEIsUUFBNUMsUUFBUSxpQkFBaUIsT0FBc0IsYUFBYTtRQUNoQixRQUE1QyxRQUFRLGlCQUFpQixPQUFzQixhQUFhO1FBQ2hCLFFBQTVDLFFBQVEsaUJBQWlCLE9BQXNCLGFBQWE7UUFDaEIsUUFBNUMsUUFBUSxpQkFBaUIsT0FBc0IsYUFBYTtRQUNoQixRQUE1QyxRQUFRLHFCQUFxQixLQUFLLEtBQWEsZUFBZTtRQUNsQixRQUE1QyxRQUFRLGdCQUFnQixPQUF1QixhQUFhO1FBQ2hCLFFBQTVDLFFBQVEsZ0JBQWdCLFNBQXVCLGFBQWE7UUFDYixRQUEvQyxRQUFRLDZCQUE2QixPQUFPLEtBQU0sdUJBQXVCO1FBQzdCLFFBQTVDLFFBQVEsa0JBQWtCLFNBQXFCLGFBQWE7UUFDaEIsUUFBNUMsUUFBUSxpQkFBaUIsT0FBc0IsYUFBYTtRQUNoQixRQUE1QyxRQUFRLGdCQUFnQixPQUF1QixhQUFhOzs7O1FBSTVELEtBQUssS0FBSyxnQkFBZ0IsT0FBTyxHQUFHLEdBQUcsU0FBUztRQUNoRCxJQUFJO1FBQ1UsUUFBZCxhQUFPLE9BQVUsS0FBSyxhQUFhOzs7O1FBSW5DLEtBQUssZ0RBQWdELFFBQVEsR0FBRztRQUNoRSxJQUFJO1FBQ2lCLFFBQXJCLEVBQUUsTUFBTSxXQUFXLEdBQUk7UUFDaEIsUUFBUCxRQUFVLGFBQWEsYUFBYTtRQUNwQyxFQUFFLE1BQU0sY0FBYyxHQUFHO1FBQ2xCLFFBQVAsUUFBVSxhQUFhLGFBQWE7UUFDcEMsRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUNqQixRQUFQLFFBQVUsYUFBYSxRQUFRO1FBQy9CLEVBQUUsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLEdBQUc7UUFDWixRQUFwQixPQUFPLGNBQWdCLGFBQWEsS0FBSztRQUN6QyxFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ2pCLFFBQVAsUUFBVSxhQUFhLGFBQWE7Ozs7UUFJcEMsS0FBSyx3QkFBd0I7UUFDN0IsSUFBSTtRQUNKLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsRUFBRSxNQUFNLGdCQUFnQixFQUFFLEVBQUUsR0FBRztRQUNYLFFBQXBCLE9BQU8sY0FBZ0IsYUFBYSxLQUFLLEdBQUcsR0FBRyxHQUFHO1FBQ2xELEVBQUUsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLEVBQUU7UUFDWCxRQUFwQixPQUFPLGNBQWdCLEdBQUcsYUFBYSxJQUFJLEtBQUssR0FBRztRQUNuRCxFQUFFLE1BQU0sZ0JBQWdCLEVBQUUsRUFBRSxFQUFFO1FBQ0gsUUFBM0IsT0FBTyxtQkFBYSxPQUFVLGFBQWEsYUFBYTs7OztRQUl4RCxLQUFLLHdCQUF3QjtRQUM3QixJQUFJO1FBQ0osRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUN4QixFQUFFLE1BQU0sZ0JBQWdCLEVBQUUsRUFBRSxHQUFHO1FBQ0osUUFBM0IsT0FBTyxtQkFBYSxPQUFVLGFBQWE7Ozs7UUFJM0MsS0FBSyx3QkFBd0I7UUFDN0IsSUFBSTtRQUNKLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsRUFBRSxNQUFNLE1BQU0sY0FBYyxHQUFHLEVBQUUsR0FBRztRQUNSLFFBQTVCLE9BQU8sRUFBRSxNQUFNLFlBQU0sT0FBVSxHQUFHLGFBQWE7Ozs7UUFJL0MsS0FBSyx3QkFBd0IsUUFBUSxHQUFHLEdBQUc7UUFDM0MsRUFBRSxNQUFNLE9BQU8sRUFBRSxHQUFHLElBQUksU0FBUyxFQUFFLEVBQUU7UUFDckMsSUFBSTtRQUNKLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDQyxRQUF6QixRQUFRLElBQUksRUFBRSxVQUFJLE9BQVUsYUFBYTs7OztRQUl6Qzs7b0JBQVcsVUFBVSxLQUFLLEVBQUUsT0FBTyxNQUFNLFdBQVcsYUFBekMsVUFBVSxLQUFLLEVBQUUsT0FBTyxNQUFNLFdBQVcsR0FBSSxNQUFNLEtBQUs7O1FBQ25FLEtBQUssaUJBQWlCLE9BQU87UUFDN0IsSUFBSTtRQUNKLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsRUFBRSxNQUFNLE9BQU87UUFDUSxRQUF2QixFQUFFLE1BQU0sRUFBRSxNQUFNLE9BQVM7UUFDakIsUUFBUixRQUFVO1FBQ1YsRUFBRSxNQUFNLE9BQU87UUFDUSxRQUF2QixFQUFFLE1BQU0sRUFBRSxNQUFNLE9BQVM7UUFDakIsUUFBUixRQUFVO1FBQ1YsRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUN4QixFQUFFLE1BQU0sT0FBTztRQUNQLFFBQVIsUUFBVTtRQUNWLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsSUFBSTtRQUNJLFFBQVIsUUFBVTtRQUNWLEVBQUUsTUFBTSxPQUFPO1FBQ1AsUUFBUixRQUFVO1FBQ1YsRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUN4QixJQUFJO1FBQ0osRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUN4QixJQUFJO1FBQ0ksUUFBUixRQUFVO1FBQ1YsRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUN4QixFQUFFLE1BQU0sT0FBTztRQUNQLFFBQVIsUUFBVTtRQUNWLEVBQUUsTUFBTTtRQUNBLFFBQVIsUUFBVTtRQUNWLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsRUFBRSxNQUFNLE9BQU87UUFDUSxRQUF2QixFQUFFLE1BQU0sRUFBRSxNQUFNLE9BQVM7UUFDakIsUUFBUixRQUFVO1FBQ1YsRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUN4QixFQUFFLE1BQU0sT0FBTztRQUNQLFFBQVIsUUFBVTtRQUNWLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsRUFBRSxNQUFNO1FBQ0EsUUFBUixRQUFVIn0=
//# sourceURL=../../../kode/ked/test/wrap.kode
