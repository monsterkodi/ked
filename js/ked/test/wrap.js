var toExport = {}
var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var cell, cellsWhere, e, h, indent, key, marked, mc, pos, rows, rw, wed, withBg, wrap, wrapped, wraps

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

rw = function (a)
{
    return function (k)
    {
        return a[_k_.min(k,a.length - 1)]
    }
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
        compare(wrap('- abcdefghijk',10,true,2),[0,10])
        compare(wrap('    abcdefghijk',10,true,4),[0,10])
        compare(wrap('abcdefgh',rw([3,2,4]),false),[0,3,5])
        compare(wrap('abcdefgh',rw([3]),false),[0,3,6])
        compare(wrap('ab cd efgh',rw([3,5]),true),[0,3,6])
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
        compare(e.state.wrap.word,true)
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
        compare(dumpstate.tags(e.state).endsWith('[wrap: 0 1 char]'),true)
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
        compare(rows(),['aaa bbb','ccc ddd','next','','',''])
        key('ctrl+alt+w')
        compare(rows(),['aaa bbb cc','c ddd','next','','',''])
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
        e.state.setMainCursor(40,0)
        compare(mc(),[29,0])
        e.state.setMainCursor(27,0)
        key('right')
        key('right')
        key('right')
        compare(mc(),[29,0])
        key('left')
        compare(mc(),[28,0])
        e.state.setMainCursor(40,1)
        compare(mc(),[40,1])
        e.state.setCursors([[40,0],[35,0],[5,1]])
        compare(e.state.s.cursors,[[29,0],[5,1]])
        wed(['  aaaaaaaaaaaaa','next'])
        key('ctrl+w')
        e.state.setMainCursor(40,0)
        compare(mc(),[17,0])
        wed(['0123456789abcdefghij','next'])
        key('ctrl+w')
        e.state.setMainCursor(25,0)
        compare(mc(),[20,0])
        key('ctrl+w')
        e.state.setMainCursor(25,0)
        compare(mc(),[25,0])
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
        compare(wrapped('aaaa aaaaaaaa','md'),['aaaa','aaaaaaaa'])
        compare(wrapped('# aaaaaaaaaaa','kode'),['# aaaaaaaa','  aaa'])
        compare(wrapped('    # aaaaaaaaaaaaaaaaaaaa','kode',20),['    # aaaaaaaaaaaaaa','      aaaaaa'])
        compare(wrapped('x=aaaaaaaaaaaaa','kode'),['x=aaaaaaaa','aaaaa'])
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
    await section("flow", async function ()
    {
        wed(['abcdefgh','xyz'])
        key('alt+w')
        e.state.setRowWidths([3,2,4,5])
        compare(e.state.wrapStarts(0),[0,3,5])
        compare(e.state.wrapStarts(1),[0])
        compare(e.state.rowCols(0,2),4)
        compare(e.state.rowCols(1,0),5)
        compare(e.state.totalRows(),4)
        compare(e.state.lineCell(4,0),[1,1])
        compare(e.state.lineCell(7,0),[2,2])
        compare(e.state.wrapMaxX(0),8)
        compare(e.state.wrapMaxX(1),4)
        e.state.setRowWidths([3])
        compare(e.state.wrapStarts(0),[0,3,6])
        compare(e.state.rowCols(1,0),3)
        compare(e.state.rowOfLine(1),3)
        e.state.setRowWidths(null)
        compare(e.state.wrapStarts(0),[0])
        wed(['  abcdefghij'])
        key('alt+w')
        e.state.setRowWidths([6,3,10])
        compare(e.state.wrapStarts(0),[0,6,8])
        compare(e.state.wrapIndent(0,1),1)
        compare(e.state.wrapIndent(0,2),2)
        compare(e.state.lineCell(6,0),[1,1])
    })
    await section("rows", async function ()
    {
        wed(['0123456789abcdefghijk','next'])
        key('ctrl+w')
        e.state.setMainCursor(2,0)
        key('down')
        compare(mc(),[12,0])
        key('down')
        compare(mc(),[22,0])
        key('down')
        compare(mc(),[2,1])
        key('up')
        compare(mc(),[22,0])
        key('up')
        compare(mc(),[12,0])
        key('up')
        compare(mc(),[2,0])
        key('cmd+down')
        compare(e.state.s.cursors,[[2,0],[12,0]])
        key('cmd+down')
        compare(e.state.s.cursors,[[2,0],[12,0],[22,0]])
        e.state.setMainCursor(2,0)
        key('shift+down')
        compare(mc(),[12,0])
        compare(e.state.s.selections,[[2,0,12,0]])
        key('shift+down')
        compare(mc(),[22,0])
        compare(e.state.s.selections,[[2,0,21,0]])
        key('shift+up')
        compare(mc(),[12,0])
        compare(e.state.s.selections,[[2,0,12,0]])
        key('shift+down')
        key('shift+down')
        compare(mc(),[2,1])
        compare(e.state.s.selections,[[2,0,2,1]])
        wed(['abcdefghi jk lmnopqrstu','next'])
        key('ctrl+w')
        compare(e.state.wrapStarts(0),[0,10,13])
        e.state.setMainCursor(8,0)
        key('down')
        compare(mc(),[12,0])
        key('down')
        compare(mc(),[21,0])
        key('up')
        compare(mc(),[12,0])
        key('up')
        compare(mc(),[8,0])
        key('down')
        key('left')
        key('down')
        compare(mc(),[14,0])
    })
}
toExport["wrap"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC93cmFwLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQVUsVUFBQTtJQUFTOztPQUNBLFVBQVA7O09BQ08sYUFBWjs7T0FDWSxjQUFaO09BQW9CLGdCQUFwQjs7QUFFUCxJQUFJLElBQUk7O0FBRVIsZ0JBQU0sT0FBTSxPQUFLLElBQUcsT0FBSyxHQUFFLFNBQU8sVUFBUyxNQUFJOztJQUMzQyxRQUFRLFNBQVEsS0FBSyxLQUFLLEtBQUs7SUFDL0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxZQUFZO0lBQ3BDLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSztRQUNXOztRQUE3QixFQUFFLE1BQU0sT0FBTyxPQUFPOztJQUN0QixFQUFFLE1BQU0sVUFBVTtXQUNsQixFQUFFOzs7QUFFTixnQkFBUTs7V0FBUyxFQUFFLElBQUksRUFBRTs7O0FBQ3pCOztXQUFXLEVBQUUsTUFBTTs7O0FBQ25COztJQUFXLEVBQUUsT0FBTztJQUFTLEVBQUU7V0FBUyxFQUFFLE9BQU8sY0FBSzs7ZUFBTSxFQUFFOzs7O0FBQzlELGlCQUFRLEdBQUU7O1dBQUssRUFBRSxRQUFRLEVBQUU7OztBQUMzQixnQkFBUSxHQUFFOztXQUFPLEVBQUUsTUFBTSxXQUFXLEVBQUU7OztBQUN0QyxpQkFBUyxHQUFFLEdBQUUsR0FBRTs7V0FBTSxJQUFJLFdBQVcsS0FBSyxHQUFHLEVBQUUsRUFBRTs7O0FBQ2hELGVBQVE7O3FCQUFNOztlQUFNLFVBQU0sRUFBRSxFQUFFLFNBQU87Ozs7QUFDckMsbUJBQVUsR0FBRTs7V0FBTSxJQUFJLFdBQVcsS0FBSyxHQUFHOzs7QUFFekMsdUJBQWE7Ozs7SUFDVCxFQUFFLE9BQU87SUFBUyxFQUFFO0lBQ3BCO1NBQ0ksSUFBSyxPQUFJLEVBQUU7O1FBQ1gsT0FBTzthQUNILElBQUssT0FBSSxFQUFFOztZQUNYLFNBQVEsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxRQUFRLGdCQUFnQixNQUFNOztRQUNoRSxJQUFJLEtBQUssS0FBSzs7V0FDbEI7OztBQUVKLG9CQUFVLE1BQUssS0FBSSxPQUFLOztJQUNwQixLQUFLLEtBQUssUUFBUSxLQUFLLEdBQUcsU0FBUztJQUNuQyxJQUFJO1dBQ0osYUFBTzs7O0FBRVgsbUJBQVM7O1dBQVEscUJBQVksR0FBRTs7ZUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUcsU0FBUTs7OztBQUM5RCxtQkFBUzs7V0FBUSxxQkFBWSxHQUFFOzt1QkFBTSxFQUFFLE9BQU8sT0FBTyxFQUFFLElBQU87Ozs7Ozs7UUFNNUIsUUFBMUIsS0FBSyxXQUFXLEVBQUUsUUFBVyxFQUFFLEVBQUU7UUFDUCxRQUExQixLQUFLLFNBQVMsRUFBRSxRQUFhLEVBQUU7UUFDTCxRQUExQixLQUFLLEdBQUcsRUFBRSxRQUFtQjtRQUNKLFFBQXpCLEtBQUssT0FBTyxFQUFFLFFBQWMsRUFBRTtRQUNKLFFBQTFCLEtBQUssV0FBVyxFQUFFLFFBQVcsRUFBRTtRQUNMLFFBQTFCLEtBQUssV0FBVyxFQUFFLE9BQVcsRUFBRSxFQUFFO1FBQ1AsUUFBMUIsS0FBSyxjQUFjLEVBQUUsT0FBUSxFQUFFLEVBQUU7UUFDUCxRQUExQixLQUFLLFlBQVksRUFBRSxPQUFVLEVBQUUsRUFBRTtRQUNQLFFBQTFCLEtBQUssV0FBVyxFQUFFLE1BQU0sSUFBSyxFQUFFLEVBQUU7UUFDTixRQUEzQixLQUFLLGFBQWEsRUFBRSxLQUFLLElBQUssRUFBRSxFQUFFO1FBQ0YsUUFBaEMsS0FBSyxnQkFBZ0IsR0FBRyxLQUFLLElBQU0sRUFBRTtRQUNKLFFBQWpDLEtBQUssa0JBQWtCLEdBQUcsS0FBSyxJQUFLLEVBQUU7UUFDSCxRQUFuQyxLQUFLLFdBQVcsSUFBSSxFQUFFLEVBQUUsSUFBSSxRQUFVLEVBQUUsRUFBRTtRQUNQLFFBQW5DLEtBQUssV0FBVyxJQUFJLElBQUksUUFBYyxFQUFFLEVBQUU7UUFDUCxRQUFuQyxLQUFLLGFBQWEsSUFBSSxFQUFFLElBQUksT0FBVSxFQUFFLEVBQUU7Ozs7UUFJbEIsUUFBeEIsT0FBTyxNQUFNLElBQWE7UUFDRixRQUF4QixPQUFPLFVBQVUsSUFBUztRQUNGLFFBQXhCLE9BQU8sVUFBVSxJQUFTO1FBQ0YsUUFBeEIsT0FBTyxjQUFjLElBQUs7UUFDRixRQUF4QixPQUFPLE9BQU8sSUFBWTs7OztRQUkxQixLQUFLLHdCQUF3QjtRQUNSLFFBQXJCLEVBQUUsTUFBTSxXQUFXLEdBQUk7UUFDdkIsSUFBSTtRQUNpQixRQUFyQixFQUFFLE1BQU0sV0FBVyxHQUFJO1FBQ0YsUUFBckIsRUFBRSxNQUFNLFdBQVcsR0FBSTtRQUNILFFBQXBCLEVBQUUsTUFBTSxVQUFVLEdBQUk7UUFDRixRQUFwQixFQUFFLE1BQU0sWUFBYztRQUN0QixFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUU7UUFDTSxRQUFyQixFQUFFLE1BQU0sV0FBVyxHQUFJO1FBQ3ZCLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRTtRQUNNLFFBQXJCLEVBQUUsTUFBTSxXQUFXLEdBQUk7UUFDdkIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsTUFBTSxPQUFPLEVBQUUsR0FBRyxJQUFJLFdBQVcsR0FBRyxFQUFFO1FBQ3BCLFFBQXBCLEVBQUUsTUFBTSxVQUFVLEdBQUk7UUFDRCxRQUFyQixFQUFFLE1BQU0sV0FBVyxHQUFJOzs7O1FBSXZCLEtBQUssZUFBZSxlQUFlO1FBQ2pCLFFBQWxCLEVBQUUsTUFBTSxLQUFLLEtBQU87UUFDcEIsSUFBSTtRQUNvQixRQUF4QixVQUFVLEtBQUssRUFBRSxPQUFTO1FBQzFCLEVBQUUsTUFBTSxhQUFhLEVBQUUsSUFBSSxFQUFFO1FBQzdCLElBQUk7UUFDb0IsUUFBeEIsVUFBVSxLQUFLLEVBQUUsT0FBUztRQUMxQixJQUFJO1FBQzRDLFFBQWhELFVBQVUsS0FBSyxFQUFFLE9BQU8sU0FBUyxlQUFpQjtRQUNsRCxFQUFFLE1BQU0sYUFBYSxFQUFFLElBQUksRUFBRSxLQUFJLEtBQUs7UUFDdEMsSUFBSTtRQUM4QyxRQUFsRCxVQUFVLEtBQUssRUFBRSxPQUFPLFNBQVMsaUJBQW1CO1FBQ3BELEVBQUUsTUFBTTtRQUN3QyxRQUFoRCxVQUFVLEtBQUssRUFBRSxPQUFPLFNBQVMsZUFBaUI7UUFDbEQsSUFBSTtRQUM0QyxRQUFoRCxVQUFVLEtBQUssRUFBRSxPQUFPLFNBQVMsZUFBaUI7UUFDbEQsSUFBSTtRQUNKLElBQUk7UUFDNEMsUUFBaEQsVUFBVSxLQUFLLEVBQUUsT0FBTyxTQUFTLGVBQWlCO1FBQ2xELElBQUk7UUFDaUQsUUFBckQsVUFBVSxLQUFLLEVBQUUsT0FBTyxTQUFTLG9CQUFzQjs7OztRQUl2RCxLQUFLLHdCQUF3QjtRQUM3QixJQUFJO1FBQ0csUUFBUCxRQUFVLGFBQWEsYUFBYSxJQUFJLE9BQU8sR0FBRztRQUNsRCxJQUFJO1FBQ0csUUFBUCxRQUFVLGFBQWEsT0FBTyxHQUFHLEdBQUcsR0FBRztRQUN2QyxLQUFLLGtCQUFrQjtRQUN2QixJQUFJO1FBQ0csUUFBUCxRQUFVLFVBQVUsVUFBVSxPQUFPLEdBQUcsR0FBRztRQUMzQyxJQUFJO1FBQ0csUUFBUCxRQUFVLGFBQWEsUUFBUSxPQUFPLEdBQUcsR0FBRzs7OztRQUk1QyxLQUFLLG1CQUFtQjtRQUN4QixFQUFFLE1BQU0sY0FBYyxHQUFHO1FBQ1AsUUFBbEIsRUFBRSxNQUFNLEVBQUUsS0FBSyxHQUFLO1FBQ2IsUUFBUCxRQUFVLGFBQWEsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUNuQyxFQUFFLE1BQU0sY0FBYyxHQUFHO1FBQ3pCLElBQUk7UUFDYyxRQUFsQixFQUFFLE1BQU0sRUFBRSxLQUFLLEdBQUs7UUFDYixRQUFQLFFBQVUsYUFBYSxTQUFTLFFBQVEsR0FBRyxHQUFHOzs7O1FBSTlDLEtBQUssd0JBQXdCO1FBQzdCLElBQUk7UUFDTSxRQUFWLEtBQUssRUFBRSxJQUFNLEVBQUU7UUFDTCxRQUFWLEtBQUssRUFBRSxJQUFNLEVBQUU7UUFDTCxRQUFWLEtBQUssR0FBRyxJQUFLLEVBQUU7UUFDTCxRQUFWLEtBQUssR0FBRyxJQUFLLEVBQUU7UUFDTCxRQUFWLEtBQUssR0FBRyxJQUFLLEVBQUU7UUFDTCxRQUFWLEtBQUssR0FBRyxJQUFLLEVBQUU7UUFDTCxRQUFWLEtBQUssRUFBRSxJQUFNLEVBQUU7UUFDTCxRQUFWLElBQUksRUFBRSxJQUFPLEdBQUc7UUFDTixRQUFWLElBQUksRUFBRSxJQUFPLEdBQUc7UUFDTixRQUFWLElBQUksRUFBRSxJQUFPLEdBQUc7UUFDTixRQUFWLElBQUksRUFBRSxJQUFPLEdBQUc7UUFDTixRQUFWLElBQUksRUFBRSxJQUFPLEdBQUc7UUFDTixRQUFWLElBQUksRUFBRSxJQUFPLEdBQUc7UUFDTixRQUFWLElBQUksRUFBRSxJQUFPLEVBQUU7Ozs7UUFJZixLQUFLLHdCQUF3QjtRQUM3QixJQUFJO1FBQ0osRUFBRSxNQUFNLGNBQWMsR0FBRztRQUN6QjtRQUNnQixRQUFoQixFQUFFLFNBQVMsRUFBRSxHQUFLO1FBQ2xCLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEI7UUFDZ0IsUUFBaEIsRUFBRSxTQUFTLEVBQUUsR0FBSztRQUNFLFFBQXBCLEVBQUUsa0JBQW9CO1FBQ3RCLEVBQUUsTUFBTSxjQUFjLEdBQUc7UUFBUyxRQUFMLE1BQVEsR0FBRztRQUN4QyxFQUFFLE1BQU0sY0FBYyxHQUFHO1FBQ3pCLElBQUk7UUFBVSxJQUFJO1FBQVUsSUFBSTtRQUFlLFFBQUwsTUFBUSxHQUFHO1FBQ3JELElBQUk7UUFBYyxRQUFMLE1BQVEsR0FBRztRQUN4QixFQUFFLE1BQU0sY0FBYyxHQUFHO1FBQVMsUUFBTCxNQUFRLEdBQUc7UUFDeEMsRUFBRSxNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsSUFBSSxFQUFFO1FBQ25CLFFBQWxCLEVBQUUsTUFBTSxFQUFFLFVBQVksR0FBRyxJQUFJLEVBQUU7UUFDL0IsS0FBSyxrQkFBa0I7UUFDdkIsSUFBSTtRQUNKLEVBQUUsTUFBTSxjQUFjLEdBQUc7UUFBUyxRQUFMLE1BQVEsR0FBRztRQUN4QyxLQUFLLHVCQUF1QjtRQUM1QixJQUFJO1FBQ0osRUFBRSxNQUFNLGNBQWMsR0FBRztRQUFTLFFBQUwsTUFBUSxHQUFHO1FBQ3hDLElBQUk7UUFDSixFQUFFLE1BQU0sY0FBYyxHQUFHO1FBQVMsUUFBTCxNQUFRLEdBQUc7Ozs7UUFJeEMsS0FBSyxXQUFXLFFBQVEsR0FBRztRQUMzQixFQUFFLE1BQU0sT0FBTyxFQUFFLEdBQUcsSUFBSSxXQUFXLEdBQUcsRUFBRTtRQUN4QyxJQUFJO1FBQ2lCLFFBQXJCLEVBQUUsTUFBTSxXQUFXLElBQUssRUFBRTtRQUNMLFFBQXJCLEVBQUUsTUFBTSxXQUFXLEdBQUk7UUFDZCxRQUFULEtBQUssRUFBRSxJQUFLLEVBQUU7UUFDTixRQUFSLElBQUksRUFBRSxJQUFLLEVBQUU7UUFDTyxRQUFwQixFQUFFLE1BQU0sVUFBVSxHQUFJOzs7O1FBSXRCLEtBQUssd0JBQXdCLFFBQVEsR0FBRyxHQUFHLFFBQVE7UUFDdEMsUUFBYixFQUFFLE1BQU0sS0FBTztRQUNmLElBQUk7UUFDd0IsUUFBNUIsT0FBTyxjQUFLOzttQkFBTSxFQUFFO1lBQVcsZUFBZSxlQUFlLE1BQU0sU0FBUyxHQUFHO1FBQy9FLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFLE1BQU0sY0FBYyxHQUFHO1FBQ1UsUUFBbkMsT0FBTyxjQUFLOzttQkFBTSxFQUFFO2lCQUFRLE9BQVUsZUFBZTs7OztRQUlyRCxLQUFLLGtCQUFrQjtRQUN2QixJQUFJO1FBQ2lCLFFBQXJCLEVBQUUsTUFBTSxXQUFXLElBQUssRUFBRTtRQUNuQixRQUFQLFFBQVUsYUFBYSxVQUFVLE9BQU8sR0FBRyxHQUFHO1FBQ3BDLFFBQVYsS0FBSyxFQUFFLElBQU0sRUFBRTtRQUNMLFFBQVYsS0FBSyxHQUFHLElBQUssRUFBRTtRQUNMLFFBQVYsS0FBSyxHQUFHLElBQUssRUFBRTtRQUNMLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNOLFFBQVYsSUFBSSxFQUFFLElBQU8sR0FBRztRQUNoQixFQUFFLE1BQU0sZ0JBQWdCLEVBQUUsRUFBRSxHQUFHO1FBQ0osUUFBM0IsT0FBTyxtQkFBYSxPQUFVLGFBQWE7UUFDM0MsS0FBSyxvQkFBb0I7UUFDekIsSUFBSTtRQUNHLFFBQVAsUUFBVSxZQUFZLFlBQVksT0FBTyxHQUFHLEdBQUc7Ozs7UUFJSCxRQUE1QyxRQUFRLGdCQUFnQixPQUF1QixhQUFhO1FBQ2hCLFFBQTVDLFFBQVEsaUJBQWlCLE9BQXNCLGFBQWE7UUFDaEIsUUFBNUMsUUFBUSxpQkFBaUIsT0FBc0IsYUFBYTtRQUNoQixRQUE1QyxRQUFRLGlCQUFpQixPQUFzQixhQUFhO1FBQ2hCLFFBQTVDLFFBQVEsaUJBQWlCLE9BQXNCLGFBQWE7UUFDaEIsUUFBNUMsUUFBUSxpQkFBaUIsT0FBc0IsYUFBYTtRQUNoQixRQUE1QyxRQUFRLGlCQUFpQixPQUFzQixhQUFhO1FBQ2hCLFFBQTVDLFFBQVEscUJBQXFCLEtBQUssS0FBYSxlQUFlO1FBQ2xCLFFBQTVDLFFBQVEsZ0JBQWdCLE9BQXVCLE9BQU87UUFDVixRQUE1QyxRQUFRLGdCQUFnQixTQUF1QixhQUFhO1FBQ2IsUUFBL0MsUUFBUSw2QkFBNkIsT0FBTyxLQUFNLHVCQUF1QjtRQUM3QixRQUE1QyxRQUFRLGtCQUFrQixTQUFxQixhQUFhO1FBQ2hCLFFBQTVDLFFBQVEsaUJBQWlCLE9BQXNCLGFBQWE7UUFDaEIsUUFBNUMsUUFBUSxnQkFBZ0IsT0FBdUIsYUFBYTs7OztRQUk1RCxLQUFLLEtBQUssZ0JBQWdCLE9BQU8sR0FBRyxHQUFHLFNBQVM7UUFDaEQsSUFBSTtRQUNVLFFBQWQsYUFBTyxPQUFVLEtBQUssYUFBYTs7OztRQUluQyxLQUFLLGdEQUFnRCxRQUFRLEdBQUc7UUFDaEUsSUFBSTtRQUNpQixRQUFyQixFQUFFLE1BQU0sV0FBVyxHQUFJO1FBQ2hCLFFBQVAsUUFBVSxhQUFhLGFBQWE7UUFDcEMsRUFBRSxNQUFNLGNBQWMsR0FBRztRQUNsQixRQUFQLFFBQVUsYUFBYSxhQUFhO1FBQ3BDLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDakIsUUFBUCxRQUFVLGFBQWEsUUFBUTtRQUMvQixFQUFFLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxHQUFHO1FBQ1osUUFBcEIsT0FBTyxjQUFnQixhQUFhLEtBQUs7UUFDekMsRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUNqQixRQUFQLFFBQVUsYUFBYSxhQUFhOzs7O1FBSXBDLEtBQUssd0JBQXdCO1FBQzdCLElBQUk7UUFDSixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLEVBQUUsTUFBTSxnQkFBZ0IsRUFBRSxFQUFFLEdBQUc7UUFDWCxRQUFwQixPQUFPLGNBQWdCLGFBQWEsS0FBSyxHQUFHLEdBQUcsR0FBRztRQUNsRCxFQUFFLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxFQUFFO1FBQ1gsUUFBcEIsT0FBTyxjQUFnQixHQUFHLGFBQWEsSUFBSSxLQUFLLEdBQUc7UUFDbkQsRUFBRSxNQUFNLGdCQUFnQixFQUFFLEVBQUUsRUFBRTtRQUNILFFBQTNCLE9BQU8sbUJBQWEsT0FBVSxhQUFhLGFBQWE7Ozs7UUFJeEQsS0FBSyx3QkFBd0I7UUFDN0IsSUFBSTtRQUNKLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsRUFBRSxNQUFNLGdCQUFnQixFQUFFLEVBQUUsR0FBRztRQUNKLFFBQTNCLE9BQU8sbUJBQWEsT0FBVSxhQUFhOzs7O1FBSTNDLEtBQUssd0JBQXdCO1FBQzdCLElBQUk7UUFDSixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLEVBQUUsTUFBTSxNQUFNLGNBQWMsR0FBRyxFQUFFLEdBQUc7UUFDUixRQUE1QixPQUFPLEVBQUUsTUFBTSxZQUFNLE9BQVUsR0FBRyxhQUFhOzs7O1FBSS9DLEtBQUssd0JBQXdCLFFBQVEsR0FBRyxHQUFHO1FBQzNDLEVBQUUsTUFBTSxPQUFPLEVBQUUsR0FBRyxJQUFJLFNBQVMsRUFBRSxFQUFFO1FBQ3JDLElBQUk7UUFDSixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ0MsUUFBekIsUUFBUSxJQUFJLEVBQUUsVUFBSSxPQUFVLGFBQWE7Ozs7UUFJekM7O29CQUFXLFVBQVUsS0FBSyxFQUFFLE9BQU8sTUFBTSxXQUFXLGFBQXpDLFVBQVUsS0FBSyxFQUFFLE9BQU8sTUFBTSxXQUFXLEdBQUksTUFBTSxLQUFLOztRQUNuRSxLQUFLLGlCQUFpQixPQUFPO1FBQzdCLElBQUk7UUFDSixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLEVBQUUsTUFBTSxPQUFPO1FBQ1EsUUFBdkIsRUFBRSxNQUFNLEVBQUUsTUFBTSxPQUFTO1FBQ2pCLFFBQVIsUUFBVTtRQUNWLEVBQUUsTUFBTSxPQUFPO1FBQ1EsUUFBdkIsRUFBRSxNQUFNLEVBQUUsTUFBTSxPQUFTO1FBQ2pCLFFBQVIsUUFBVTtRQUNWLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsRUFBRSxNQUFNLE9BQU87UUFDUCxRQUFSLFFBQVU7UUFDVixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLElBQUk7UUFDSSxRQUFSLFFBQVU7UUFDVixFQUFFLE1BQU0sT0FBTztRQUNQLFFBQVIsUUFBVTtRQUNWLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsSUFBSTtRQUNKLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsSUFBSTtRQUNJLFFBQVIsUUFBVTtRQUNWLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsRUFBRSxNQUFNLE9BQU87UUFDUCxRQUFSLFFBQVU7UUFDVixFQUFFLE1BQU07UUFDQSxRQUFSLFFBQVU7UUFDVixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLEVBQUUsTUFBTSxPQUFPO1FBQ1EsUUFBdkIsRUFBRSxNQUFNLEVBQUUsTUFBTSxPQUFTO1FBQ2pCLFFBQVIsUUFBVTtRQUNWLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsRUFBRSxNQUFNLE9BQU87UUFDUCxRQUFSLFFBQVU7UUFDVixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLEVBQUUsTUFBTTtRQUNBLFFBQVIsUUFBVTs7OztRQUlWLEtBQUssV0FBVztRQUNoQixJQUFJO1FBQ0osRUFBRSxNQUFNLGNBQWMsRUFBRSxFQUFFLEVBQUU7UUFDUCxRQUFyQixFQUFFLE1BQU0sV0FBVyxJQUFLLEVBQUUsRUFBRTtRQUNQLFFBQXJCLEVBQUUsTUFBTSxXQUFXLElBQUs7UUFDSixRQUFwQixFQUFFLE1BQU0sUUFBUSxFQUFFLEdBQUk7UUFDRixRQUFwQixFQUFFLE1BQU0sUUFBUSxFQUFFLEdBQUk7UUFDRixRQUFwQixFQUFFLE1BQU0sWUFBYztRQUNELFFBQXJCLEVBQUUsTUFBTSxTQUFTLEVBQUUsSUFBSyxFQUFFO1FBQ0wsUUFBckIsRUFBRSxNQUFNLFNBQVMsRUFBRSxJQUFLLEVBQUU7UUFDUCxRQUFuQixFQUFFLE1BQU0sU0FBUyxHQUFJO1FBQ0YsUUFBbkIsRUFBRSxNQUFNLFNBQVMsR0FBSTtRQUNyQixFQUFFLE1BQU0sY0FBYztRQUNELFFBQXJCLEVBQUUsTUFBTSxXQUFXLElBQUssRUFBRSxFQUFFO1FBQ1IsUUFBcEIsRUFBRSxNQUFNLFFBQVEsRUFBRSxHQUFJO1FBQ0YsUUFBcEIsRUFBRSxNQUFNLFVBQVUsR0FBSTtRQUN0QixFQUFFLE1BQU0sYUFBYTtRQUNBLFFBQXJCLEVBQUUsTUFBTSxXQUFXLElBQUs7UUFDeEIsS0FBSztRQUNMLElBQUk7UUFDSixFQUFFLE1BQU0sY0FBYyxFQUFFLEVBQUU7UUFDTCxRQUFyQixFQUFFLE1BQU0sV0FBVyxJQUFLLEVBQUUsRUFBRTtRQUNMLFFBQXZCLEVBQUUsTUFBTSxXQUFXLEVBQUUsR0FBSTtRQUNGLFFBQXZCLEVBQUUsTUFBTSxXQUFXLEVBQUUsR0FBSTtRQUNKLFFBQXJCLEVBQUUsTUFBTSxTQUFTLEVBQUUsSUFBSyxFQUFFOzs7O1FBSTFCLEtBQUssd0JBQXdCO1FBQzdCLElBQUk7UUFDSixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLElBQUk7UUFBYyxRQUFMLE1BQVEsR0FBRztRQUN4QixJQUFJO1FBQWMsUUFBTCxNQUFRLEdBQUc7UUFDeEIsSUFBSTtRQUFjLFFBQUwsTUFBUSxFQUFFO1FBQ3ZCLElBQUk7UUFBYyxRQUFMLE1BQVEsR0FBRztRQUN4QixJQUFJO1FBQWMsUUFBTCxNQUFRLEdBQUc7UUFDeEIsSUFBSTtRQUFjLFFBQUwsTUFBUSxFQUFFO1FBQ3ZCLElBQUk7UUFDYyxRQUFsQixFQUFFLE1BQU0sRUFBRSxVQUFZLEVBQUUsSUFBSSxHQUFHO1FBQy9CLElBQUk7UUFDYyxRQUFsQixFQUFFLE1BQU0sRUFBRSxVQUFZLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRztRQUN0QyxFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLElBQUk7UUFBb0IsUUFBTCxNQUFRLEdBQUc7UUFDVCxRQUFyQixFQUFFLE1BQU0sRUFBRSxhQUFlLEVBQUUsRUFBRSxHQUFHO1FBQ2hDLElBQUk7UUFBb0IsUUFBTCxNQUFRLEdBQUc7UUFDVCxRQUFyQixFQUFFLE1BQU0sRUFBRSxhQUFlLEVBQUUsRUFBRSxHQUFHO1FBQ2hDLElBQUk7UUFBa0IsUUFBTCxNQUFRLEdBQUc7UUFDUCxRQUFyQixFQUFFLE1BQU0sRUFBRSxhQUFlLEVBQUUsRUFBRSxHQUFHO1FBQ2hDLElBQUk7UUFBZSxJQUFJO1FBQW9CLFFBQUwsTUFBUSxFQUFFO1FBQzNCLFFBQXJCLEVBQUUsTUFBTSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7UUFDL0IsS0FBSywwQkFBMEI7UUFDL0IsSUFBSTtRQUNpQixRQUFyQixFQUFFLE1BQU0sV0FBVyxJQUFLLEVBQUUsR0FBRztRQUM3QixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLElBQUk7UUFBYyxRQUFMLE1BQVEsR0FBRztRQUN4QixJQUFJO1FBQWMsUUFBTCxNQUFRLEdBQUc7UUFDeEIsSUFBSTtRQUFjLFFBQUwsTUFBUSxHQUFHO1FBQ3hCLElBQUk7UUFBYyxRQUFMLE1BQVEsRUFBRTtRQUN2QixJQUFJO1FBQVMsSUFBSTtRQUFTLElBQUk7UUFBYyxRQUFMLE1BQVEsR0FBRyJ9
//# sourceURL=../../../kode/ked/test/wrap.kode
