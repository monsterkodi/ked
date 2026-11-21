var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var before, bg, blockArea, bx, by, c, cells, csz, cx, data, e, first, h, hed, i, id, id0, id2, ink, j, lines, m, old, out, plain, rect, removals, remove, s, saved, sc, scale, scr, second, send, small, t, tstt, uploads, w, x, xx, y, yy

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post

import state from "../edit/state.js"
import editor from "../edit/editor.js"

import theme from "../theme/theme.js"

import harness from "../util/harness.js"
import config from "../util/config.js"

import choices from "../view/menu/choices.js"
import context from "../view/menu/context.js"

import mapscr from "../view/editor/mapscr.js"
import mapview from "../view/editor/mapview.js"

import screen from "../view/screen/screen.js"
import ttio from "../view/screen/ttio.js"

import scroll from "../view/base/scroll.js"

import squares from "../util/img/squares.js"

cells = {cols:40,rows:20}

tstt = function (ext = 'md')
{
    var s

    s = new state(cells,'test_scale')
    s.syntax.setExt(ext)
    s.applyScales({enable:true,md:{h1:3,h2:2}})
    return s
}

hed = function (cols, rows, ext = 'md', feats = [])
{
    var e, h

    h = new harness
    e = new editor(h.screen,'test_scale',feats)
    e.layout(0,0,cols,rows)
    e.state.syntax.setExt(ext)
    e.state.applyScales({enable:true,md:{h1:3,h2:2}})
    return [h,e]
}

blockArea = function (scr)
{
    var r, row, rows, x

    rows = []
    for (r = 0; r < 3; r++)
    {
        row = []
        for (x = 3; x < 12; x++)
        {
            row.push([scr.get_char(x,r),scr.get_fg(x,r),scr.get_bg(x,r)])
        }
        rows.push(row)
    }
    return rows
}
toExport["scale"] = async function ()
{
    await section("markdown headings scale by level", async function ()
    {
        s = tstt()
        s.loadLines(['# One','## Two','### Three','#### Four','text'])
        compare(s.lineHeight(0),3)
        compare(s.lineHeight(1),2)
        compare(s.lineHeight(2),1)
        compare(s.lineHeight(3),1)
        compare(s.lineHeight(4),1)
    })
    await section("headings in other files keep their size", async function ()
    {
        s = tstt('kode')
        s.loadLines(['# One','## Two'])
        compare(s.lineHeight(0),1)
        compare(s.lineHeight(1),1)
    })
    await section("the configured scales change or disable the scaling", async function ()
    {
        s = tstt()
        s.loadLines(['# one','## two','### three','#### four','##### five'])
        s.applyScales({enable:true,md:{h1:6,h2:5,h3:4,h4:3,h5:2}})
        compare(s.lineHeight(0),6)
        compare(s.lineHeight(1),5)
        compare(s.lineHeight(2),4)
        compare(s.lineHeight(3),3)
        compare(s.lineHeight(4),2)
        s.applyScales({enable:false})
        compare(s.lineHeight(0),1)
        compare(s.lineHeight(1),1)
        s.applyScales({})
        compare(s.lineHeight(0),1)
        compare(s.lineHeight(1),1)
        s.applyScales({enable:true,md:{h1:9}})
        compare(s.lineHeight(0),7)
    })
    await section("the row map counts the scaled row of every line", async function ()
    {
        s = tstt()
        s.loadLines(['# One','a','## Two','b'])
        compare(s.rowOfLine(0),0)
        compare(s.rowOfLine(1),3)
        compare(s.rowOfLine(2),4)
        compare(s.rowOfLine(3),6)
    })
    await section("the row map finds the line at a row", async function ()
    {
        s = tstt()
        s.loadLines(['# One','a','## Two','b'])
        compare(s.lineAtRow(0),0)
        compare(s.lineAtRow(2),0)
        compare(s.lineAtRow(3),1)
        compare(s.lineAtRow(4),2)
        compare(s.lineAtRow(5),2)
        compare(s.lineAtRow(6),3)
        compare(s.lineAtRow(7),3)
    })
    await section("lines above the view have negative rows", async function ()
    {
        s = tstt()
        s.loadLines(['a','b','c','d','e','f'])
        s.setView([0,4])
        compare(s.rowOfLine(4),0)
        compare(s.rowOfLine(3),-1)
        compare(s.rowOfLine(1),-3)
    })
    await section("highlights and cursors above the view are not drawn", async function ()
    {
        var _a_ = hed(40,10); h = _a_[0]; e = _a_[1]

        e.state.loadLines((function () { var r_b_ = []; for (i = 0; i < 20; i++)  { r_b_.push((`line ${i}`))  } return r_b_ }).bind(this)())
        e.state.setView([0,8])
        e.state.setHighlights([[0,4,4,4],[0,10,4,10]])
        h.screen.init()
        e.draw()
        compare(h.screen.get_bg(0,2),theme.highlight.bg)
        compare(h.screen.get_bg(0,4),theme.editor.bg)
        e.state.setCursors([[0,10],[0,4]])
        e.state.setView([0,8])
        compare(e.isCursorVisible([0,4]),false)
        compare(e.isCursorVisible([0,10]),true)
        h.screen.init()
        e.draw()
        compare((!_k_.empty(h.screen.c[4][0].mark)),false)
        compare(h.screen.c[2][0].mark,'multi')
    })
    await section("a cell position maps to a logical position", async function ()
    {
        s = tstt()
        s.loadLines(['# One','a','## Two'])
        compare(s.posForCell(0,0),[0,0])
        compare(s.posForCell(2,0),[0,0])
        compare(s.posForCell(3,0),[1,0])
        compare(s.posForCell(5,0),[1,0])
        compare(s.posForCell(6,0),[2,0])
        compare(s.posForCell(0,3),[0,1])
        compare(s.posForCell(3,3),[3,1])
        compare(s.posForCell(0,4),[0,2])
        compare(s.posForCell(1,4),[0,2])
        compare(s.posForCell(3,4),[1,2])
        compare(s.posForCell(6,4),[3,2])
    })
    await section("a heading is drawn in a block of cells", async function ()
    {
        var _c_ = hed(40,10); h = _c_[0]; e = _c_[1]

        e.state.loadLines(['# One','a','## Two','b'])
        e.draw()
        compare(h.screen.get_char(0,0),'#')
        compare(h.screen.get_char(3,0),' ')
        compare(h.screen.get_char(6,0),'O')
        compare(h.screen.get_char(12,0),'e')
        compare(h.screen.get_char(0,3),'a')
        compare(h.screen.get_char(0,4),'#')
        compare(h.screen.get_char(2,4),'#')
        compare(h.screen.get_char(6,4),'T')
        compare(h.screen.get_char(0,6),'b')
    })
    await section("a scaled character that ends exactly at the right edge is drawn", async function ()
    {
        var _d_ = hed(15,6); h = _d_[0]; e = _d_[1]

        e.state.loadLines(['# abc'])
        e.draw()
        compare(h.screen.get_char(12,0),'c')
        var _e_ = hed(14,6); h = _e_[0]; e = _e_[1]

        e.state.loadLines(['# abc'])
        e.draw()
        compare(h.screen.get_char(12,0),' ')
    })
    await section("a scaled character carries the text sizing escape", async function ()
    {
        h = new harness({cols:10,rows:5})
        compare(h.screen.scaled_char('x',2,1),'\x1b]66;s=2:w=1;x\x07')
        compare(h.screen.scaled_char('🌈',3,2),'\x1b]66;s=3:w=2;🌈\x07')
    })
    await section("a scaled block fills its cells with placeholders", async function ()
    {
        h = new harness({cols:20,rows:5})
        h.t.textSizing = true
        compare(h.screen.add_scaled(0,0,'x',null,null,2),2)
        compare(h.screen.get_char(0,0),'\x1b]66;s=2:w=1;x\x07')
        compare(h.screen.get_char(1,0),null)
        compare(h.screen.get_char(0,1),'\x1b[2C')
        compare(h.screen.get_char(1,1),null)
        compare(h.screen.add_scaled(5,0,'🌈',null,null,2),4)
        compare(h.screen.get_char(5,0),'\x1b]66;s=2:w=2;🌈\x07')
        compare(h.screen.get_char(6,0),null)
        compare(h.screen.get_char(5,1),'\x1b[4C')
        compare(h.screen.get_char(8,1),null)
    })
    await section("the cursor sits on the scaled line", async function ()
    {
        var _f_ = hed(40,10); h = _f_[0]; e = _f_[1]

        e.state.loadLines(['# One','## Two','text'])
        e.state.setMainCursor(0,1)
        e.draw()
        compare(h.screen.c[3][0].mark,'main')
    })
    await section("horizontal scrolling moves scaled and normal lines together", async function ()
    {
        var _10_ = hed(20,8); h = _10_[0]; e = _10_[1]

        e.state.loadLines(['# abc','abc'])
        e.state.setView([0,0])
        e.draw()
        compare(h.screen.get_char(6,0),'a')
        compare(h.screen.get_char(1,3),'b')
        h.screen.init()
        e.state.setView([1,0])
        e.draw()
        compare(h.screen.get_char(5,0),'a')
        compare(h.screen.get_char(0,3),'b')
    })
    await section("horizontal positions use display columns", async function ()
    {
        var _11_ = hed(20,8); h = _11_[0]; e = _11_[1]

        e.state.loadLines(['# abc','abc'])
        e.state.setView([1,0])
        compare(e.state.posForCell(0,0),[0,0])
        compare(e.state.posForCell(5,0),[2,0])
        e.state.setCursors([[2,0]],{main:0,adjust:false})
        e.state.setView([1,0])
        h.screen.init()
        e.draw()
        compare(h.screen.c[0][5].mark,'main')
        compare(e.isCursorVisible([2,0]),true)
        e.state.setView([0,0])
        e.state.setMainCursor(10,0)
        e.state.adjustViewForMainCursor()
        compare(e.state.s.view[0],14)
    })
    await section("the block rectangle of the previous frame is erased", async function ()
    {
        var _12_ = hed(20,8); h = _12_[0]; e = _12_[1]

        h.t.textSizing = true
        e.state.loadLines(['# big','a','b','c','d','e','f','g','h'])
        h.screen.init()
        e.draw()
        first = h.screen.renderString()
        compare(first.startsWith('\x1b[H'),true)
        e.state.scrollView('down')
        h.screen.init()
        e.draw()
        second = h.screen.renderString()
        compare(second.startsWith("\x1b[1;1H\x1b[15X\x1b[2;1H\x1b[15X\x1b[3;1H\x1b[15X\x1b[H"),true)
    })
    await section("completion is placed and highlighted on normal lines", async function ()
    {
        var _13_ = hed(40,12,'kode',['complete']); h = _13_[0]; e = _13_[1]

        e.state.loadLines(['funky1 = 1','funky2 = 2','fun'])
        compare(e.complete.posForCursor([3,2]),[3,2])
        e.state.setMainCursor(3,2)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.row(2),'funky1')
        compare(h.row(4).includes('funky1'),true)
        compare(h.row(5).includes('funky2'),true)
        compare(h.screen.get_bg(4,2),theme.selection.span)
        compare(h.screen.get_bg(5,2),theme.selection.span)
    })
    await section("completion chunks are rebuilt for edited lines only", async function ()
    {
        var _14_ = hed(40,12,'kode',['complete']); h = _14_[0]; e = _14_[1]

        e.state.loadLines(['funky1 = 1','funky2 = 2','fun'])
        compare(e.complete.chunksForLines(e.state.s.lines),['funky1','=','1','funky2','=','2','fun'])
        e.state.setMainCursor(10,0)
        e.state.insert(' funky3')
        compare(kseg.str(e.state.s.lines[0]),'funky1 = 1 funky3')
        compare(e.complete.chunksForLines(e.state.s.lines),['funky1','=','1','funky3','funky2','=','2','fun'])
    })
    await section("completion follows edits in the document", async function ()
    {
        var _15_ = hed(40,12,'kode',['complete']); h = _15_[0]; e = _15_[1]

        e.state.loadLines(['funky1 = 1','funky2 = 2','fun'])
        e.state.setMainCursor(3,2)
        e.complete.complete()
        compare(e.complete.words,['funky1','funky2'])
        e.state.setMainCursor(10,0)
        e.state.insert(' funky3')
        e.state.setMainCursor(3,2)
        e.complete.complete()
        compare(e.complete.words,['funky1','funky2','funky3'])
    })
    await section("the completion frame fits at the edges of the editor", async function ()
    {
        var _16_ = hed(30,12,'kode',['complete']); h = _16_[0]; e = _16_[1]

        e.state.loadLines(['funky1 = 1','funky2 = 2','f'])
        e.state.setMainCursor(1,2)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.row(3).startsWith('╭'),true)
        compare(h.row(6).startsWith('╰'),true)
        var _17_ = hed(20,12,'kode',['complete']); h = _17_[0]; e = _17_[1]

        e.state.loadLines(['funky1 = 1','funky2 = 2','...........funky'])
        e.state.setMainCursor(16,2)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.row(3).startsWith('         ╭'),true)
        compare(h.row(3).endsWith('╮'),true)
        compare(h.row(3).length,20)
    })
    await section("the completion frame moves below a scaled line", async function ()
    {
        var _18_ = hed(40,14,'md',['complete']); h = _18_[0]; e = _18_[1]

        e.state.loadLines(['# fu','','funky1 = 1','funky2 = 2'])
        e.state.setMainCursor(4,0)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(e.state.lineHeight(0),3)
        compare(h.row(1),'')
        compare(h.row(2),'')
        compare(h.row(3).startsWith('        ╭'),true)
        compare(h.row(6).startsWith('        ╰'),true)
    })
    await section("an erased area is cleared in the cells and on the screen", async function ()
    {
        h = new harness({cols:20,rows:8})
        h.screen.set(2,3,'X',null,null)
        h.screen.set_bg(2,3,[7,8,9])
        h.screen.erase_scaled(2,3,5,3)
        compare(h.screen.get_char(2,3),' ')
        compare(h.screen.get_bg(2,3),[7,8,9])
        compare(h.screen.renderString().startsWith("\x1b[4;3H\x1b[4X"),true)
    })
    await section("a popup over a scaled line erases the block under it", async function ()
    {
        var _19_ = hed(40,12,'md',['complete']); h = _19_[0]; e = _19_[1]

        h.t.textSizing = true
        e.state.loadLines(['fu','# funky1','# funky2'])
        e.state.setMainCursor(2,0)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.screen.renderString().startsWith("\x1b[2;1H\x1b[11X"),true)
        compare(h.screen.get_char(11,1),' ')
    })
    await section("a context menu erases the block under it", async function ()
    {
        var _1a_ = hed(40,12); h = _1a_[0]; e = _1a_[1]

        c = new context(h.screen)
        c.show([5,2],(function ()
        {}),['one','two'])
        h.screen.init()
        c.draw()
        compare(h.screen.renderString().startsWith("\x1b[2;6H\x1b[7X"),true)
    })
    await section("a context menu near the bottom moves up to stay on screen", async function ()
    {
        h = new harness({rows:12,cols:40})
        c = new context(h.screen)
        c.show([5,10],(function ()
        {}),['one','two'])
        h.screen.init()
        c.draw()
        compare(c.cells.y,8)
        compare(c.cells.y + c.cells.rows,12)
    })
    await section("the cleared rectangle never leaves a block half drawn", async function ()
    {
        var _1b_ = hed(40,12,'md',['complete']); h = _1b_[0]; e = _1b_[1]

        h.t.textSizing = true
        e.state.loadLines(['fu  fu  fu  fu  fu','# funky1','# funky2'])
        var list = [2,6,10,14,18]
        for (var _1c_ = 0; _1c_ < list.length; _1c_++)
        {
            cx = list[_1c_]
            e.state.setMainCursor(cx,0)
            e.complete.complete()
            h.screen.init()
            e.draw()
            rect = h.screen.eraseRects[0]
            var list1 = _k_.list(h.screen.frameBlocks)
            for (var _1d_ = 0; _1d_ < list1.length; _1d_++)
            {
                bx = list1[_1d_][0]
                by = list1[_1d_][1]
                scale = list1[_1d_][2]
                w = list1[_1d_][3]
                if (bx > rect[2])
                {
                    continue
                }
                if (bx + scale * w - 1 < rect[0])
                {
                    continue
                }
                if (by > rect[3])
                {
                    continue
                }
                if (by + scale - 1 < rect[1])
                {
                    continue
                }
                for (var _1e_ = xx = bx, _1f_ = bx + scale * w - 1; (_1e_ <= _1f_ ? xx <= bx + scale * w - 1 : xx >= bx + scale * w - 1); (_1e_ <= _1f_ ? ++xx : --xx))
                {
                    for (var _20_ = yy = by, _21_ = by + scale - 1; (_20_ <= _21_ ? yy <= by + scale - 1 : yy >= by + scale - 1); (_20_ <= _21_ ? ++yy : --yy))
                    {
                        compare((!_k_.empty(h.screen.get_char(xx,yy))),true)
                    }
                }
            }
        }
    })
    await section("an erased block is no longer a block", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        scr.init()
        scr.add_scaled(3,0,'B',null,null,3)
        compare(scr.isBlock(3,0),true)
        compare(scr.isBlock(5,2),true)
        scr.erase_scaled(3,2,5,2)
        compare(scr.isBlock(3,0),false)
        compare(scr.isBlock(5,2),false)
        compare(scr.get_char(3,0),' ')
    })
    await section("the view scrolls so a tall line fits above the bottom", async function ()
    {
        var _22_ = hed(20,6); h = _22_[0]; e = _22_[1]

        e.state.loadLines(['a','b','c','d','e','f','# h1'])
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],3)
    })
    await section("a scaled line needs a larger horizontal offset", async function ()
    {
        var _23_ = hed(20,8); h = _23_[0]; e = _23_[1]

        e.state.loadLines(['# a long heading line'])
        e.state.setMainCursor(20,0)
        compare(e.state.s.view[0],44)
    })
    await section("a short file with a tall line can scroll to its last line", async function ()
    {
        var _24_ = hed(20,6); h = _24_[0]; e = _24_[1]

        e.state.loadLines(['# h1','a','b','c','d'])
        compare(e.state.maxViewLine(),1)
        e.state.scrollView('down',3)
        compare(e.state.s.view[1],1)
    })
    await section("the last line stays reachable at the end of a tall file", async function ()
    {
        var _25_ = hed(20,6); h = _25_[0]; e = _25_[1]

        e.state.loadLines(['# h1','a','b','c','d','e','f'])
        compare(e.state.maxViewLine(),1)
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],1)
    })
    await section("the gutter numbers a scaled line only on its first row", async function ()
    {
        var _26_ = hed(30,10,'md',['gutter']); h = _26_[0]; e = _26_[1]

        e.state.loadLines(['# One','a','b'])
        e.draw()
        compare(h.row(0).startsWith('  1 '),true)
        compare(h.row(1),'')
        compare(h.row(2),'')
        compare(h.row(3).startsWith('  2 '),true)
        compare(h.row(4).startsWith('  3 '),true)
    })
    await section("the buffer height is measured in display rows", async function ()
    {
        s = tstt()
        s.loadLines(['# a','b','## c','d'])
        compare(s.totalRows(),7)
        compare(s.rowsBeforeLine(0),0)
        compare(s.rowsBeforeLine(1),3)
        compare(s.rowsBeforeLine(2),4)
        compare(s.rowsBeforeLine(3),6)
        compare(s.rowsBeforeLine(4),7)
        compare(s.lineAtAbsoluteRow(0),0)
        compare(s.lineAtAbsoluteRow(2),0)
        compare(s.lineAtAbsoluteRow(3),1)
        compare(s.lineAtAbsoluteRow(4),2)
        compare(s.lineAtAbsoluteRow(5),2)
        compare(s.lineAtAbsoluteRow(6),3)
        compare(s.lineAtAbsoluteRow(99),3)
        s.setView([0,2])
        compare(s.viewTopRow(),4)
        compare(s.rowOfLine(3),2)
        compare(s.rowOfLine(0),-4)
        s.syntax.setExt('txt')
        compare(s.totalRows(),4)
        s.syntax.setExt('md')
        compare(s.totalRows(),7)
    })
    await section("the map shows scaled lines with their real height", async function ()
    {
        var _27_ = hed({cols:40,rows:10}); h = _27_[0]; e = _27_[1]

        e.state.loadLines(['a','b','c','d','e','# h1','f','g','h','i','j'])
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        e.state.setView([0,0])
        m.calcView()
        compare(m.topLine,0)
        compare(m.botLine,10)
        compare(m.lineOffset(5),20)
        compare(m.lineOffset(6),32)
        compare((m.lineOffset(6) - m.lineOffset(5)),12)
    })
    await section("the map reloads lines restored by undo", async function ()
    {
        var _28_ = hed({cols:40,rows:10}); h = _28_[0]; e = _28_[1]

        e.state.loadLines(['aaa','bbb','ccc'])
        e.state.setLines(['aaa','XXX','bbb','ccc'])
        e.state.undo()
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.show()
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.createImages()
        m.reload()
        m.calcView()
        m.drawImages()
        compare(m.imageCache.size,3)
        compare(kseg.str(m.getSegls()[1]),'bbb')
    })
    await section("the map follows inserted and removed lines", async function ()
    {
        var _29_ = hed({cols:40,rows:10}); h = _29_[0]; e = _29_[1]

        e.state.loadLines(['aaa','bbb','ccc'])
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.show()
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.createImages()
        m.calcView()
        m.drawImages()
        compare(m.imageCache.size,3)
        e.state.setLines(['aaa','bbb','foo','bar','ccc'])
        m.calcView()
        m.drawImages()
        compare(m.imageCache.size,5)
        compare(kseg.str(m.getSegls()[4]),'ccc')
        e.state.loadLines(['aaa','bbb','ccc'])
        m.calcView()
        m.drawImages()
        compare(m.imageCache.size,3)
    })
    await section("a suspended map waits for the restored view", async function ()
    {
        var _2a_ = hed({cols:40,rows:20}); h = _2a_[0]; e = _2a_[1]

        m = new mapscr(e)
        m.cells.layout(30,0,12,20)
        m.show()
        h.screen.t.pixels = [400,400]
        h.screen.t.cellsz = [10,20]
        e.state.loadLines((function () { var r_2b_ = []; for (i = 0; i < 1000; i++)  { r_2b_.push((`old ${i}`))  } return r_2b_ }).bind(this)())
        m.reload()
        h.screen.t.out = []
        m.suspend()
        e.state.loadSegls(kseg.segls((function () { var r_2c_ = []; for (i = 0; i < 2000; i++)  { r_2c_.push((`new ${i}`))  } return r_2c_ }).bind(this)()))
        e.state.setView([0,1200])
        m.resume()
        compare(h.screen.t.written(),'')
        compare(m.redraw,true)
        m.layout(30,0,12,20)
        out = h.screen.t.written()
        compare((m.topLine > 0),true)
        compare((m.imageCache.size <= 100),true)
        compare(out.includes('a=p,'),true)
    })
    await section("the map only renders the lines it can show", async function ()
    {
        var _2d_ = hed({cols:40,rows:10}); h = _2d_[0]; e = _2d_[1]

        e.state.loadLines((function () { var r_2e_ = []; for (i = 0; i < 2000; i++)  { r_2e_.push((`line ${i}`))  } return r_2e_ }).bind(this)())
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.show()
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.createImages()
        e.state.setView([0,0])
        m.calcView()
        m.drawImages()
        compare((m.imageCache.size < 60),true)
    })
    await section("inserting and undoing a line does not blank or re-upload the map", async function ()
    {
        var _2f_ = hed({cols:40,rows:10}); h = _2f_[0]; e = _2f_[1]

        e.state.loadLines((function () { var r_30_ = []; for (i = 0; i < 20; i++)  { r_30_.push((`line ${i}`))  } return r_30_ }).bind(this)())
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.show()
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.createImages()
        m.calcView()
        m.drawImages()
        compare(m.imageCache.size,20)
        uploads = 0
        removals = 0
        send = h.screen.t.sendImageData
        remove = h.screen.t.deleteImagesInRange
        h.screen.t.sendImageData = function (...args)
        {
            uploads += 1
            return send.apply(h.screen.t,args)
        }
        h.screen.t.deleteImagesInRange = function (...args)
        {
            removals += 1
            return remove.apply(h.screen.t,args)
        }
        e.state.setMainCursor(0,10)
        e.state.insert('\n')
        m.calcView()
        m.drawImages()
        compare(removals,0)
        compare((uploads < 5),true)
        compare((m.imageCache.size <= 22),true)
        uploads = 0
        e.state.undo()
        m.calcView()
        m.drawImages()
        compare(removals,0)
        compare((uploads < 4),true)
        compare(m.imageCache.size,20)
    })
    await section("a scaled line gets a taller stripe in the map", async function ()
    {
        var _31_ = hed(40,10); h = _31_[0]; e = _31_[1]

        e.state.loadLines(['a','b','# h1','c','d'])
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.createImages()
        id0 = m.ensureImage(0)
        id2 = m.ensureImage(2)
        h.screen.t.out = []
        e.state.setView([0,0])
        m.drawImages()
        out = h.screen.t.written()
        compare((out.split(`i=${id0},`).length - 1),4)
        compare((out.split(`i=${id2},`).length - 1),12)
    })
    await section("a scaled line is also wider in the map", async function ()
    {
        var _32_ = hed({cols:40,rows:10}); h = _32_[0]; e = _32_[1]

        e.state.loadLines(['#'])
        e.state.applyScales({enable:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        bg = m.color.bg
        data = Buffer.alloc((m.cells.cols * m.csz[0] * m.imageHeight(0) * 3))
        m.imageForLine(data,e.state.s.lines[0],0)
        ink = false
        for (var _33_ = y = 0, _34_ = m.imageHeight(0); (_33_ <= _34_ ? y < m.imageHeight(0) : y > m.imageHeight(0)); (_33_ <= _34_ ? ++y : --y))
        {
            for (x = 0; x < 14; x++)
            {
                i = (y * m.cells.cols * m.csz[0] + x) * 3
                if (data[i] !== bg[0] || data[i + 1] !== bg[1] || data[i + 2] !== bg[2])
                {
                    ink = true
                }
            }
        }
        compare(ink,true)
        m.calcView()
        compare((m.pixelPos([1,0])[0] - m.mapX),14)
        compare(m.pixelPos([1,0])[1],m.mapY)
        e.state.syntax.setExt('txt')
        data = Buffer.alloc((m.cells.cols * m.csz[0] * 3))
        m.imageForLine(data,e.state.s.lines[0],0)
        compare(data[18],bg[0])
        compare(data[19],bg[1])
        compare(data[20],bg[2])
    })
    await section("the quicky map shows scaled lines with their real height", async function ()
    {
        var _35_ = hed({cols:40,rows:10}); h = _35_[0]; e = _35_[1]

        e.state.loadLines(['a','b','c','d','e','# h1','f','g'])
        m = new mapview(h.screen,e.state)
        m.setSyntaxSegls('md',e.state.s.lines)
        m.setScales({enable:true,md:{h1:3}})
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        compare(m.lineRows(5),3)
        compare(m.lineOffsetPixels(5),20)
        compare(m.lineOffsetPixels(6),32)
        compare(m.lineOffsetPixels(7),36)
        m.setScales({enable:false,md:{h1:3}})
        compare(m.lineRows(5),1)
        compare(m.lineOffsetPixels(6),24)
    })
    await section("the quicky map draws a scaled line with the font map", async function ()
    {
        var _36_ = hed({cols:40,rows:10}); h = _36_[0]; e = _36_[1]

        e.state.loadLines(['# h1','text'])
        m = new mapview(h.screen,e.state)
        m.setSyntaxSegls('md',e.state.s.lines)
        m.setScales({enable:true,md:{h1:7}})
        m.cells.layout(30,0,12,10)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.createImages()
        id = m.ensureImage(0)
        h.screen.t.out = []
        m.drawImages()
        out = h.screen.t.written()
        compare((out.split(`i=${id},`).length - 1),1)
        compare(out.includes('w=120,h=28'),true)
    })
    await section("the browse map does not place lines below its last row", async function ()
    {
        var _37_ = hed({cols:40,rows:10}); h = _37_[0]; e = _37_[1]

        e.state.loadLines((function () { var r_38_ = []; for (i = 0; i < 100; i++)  { r_38_.push((`line ${i}`))  } return r_38_ }).bind(this)())
        m = new mapview(h.screen,e.state)
        m.setSyntaxSegls('txt',e.state.s.lines)
        m.rowOffset = 1
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        h.screen.t.out = []
        m.createImages()
        m.drawImages()
        out = h.screen.t.written()
        compare(m.imageCache.size,45)
        compare(out.includes('\x1b[11;'),false)
    })
    await section("the browse map cuts a scaled line at its bottom edge", async function ()
    {
        var _39_ = hed({cols:40,rows:10}); h = _39_[0]; e = _39_[1]

        lines = []
        for (i = 0; i < 44; i++)
        {
            lines.push('text')
        }
        lines.push('# h1')
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:7}})
        m = new mapview(h.screen,e.state)
        m.setSyntaxSegls('md',e.state.s.lines)
        m.setScales({enable:true,md:{h1:7}})
        m.rowOffset = 1
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        h.screen.t.out = []
        m.createImages()
        m.drawImages()
        out = h.screen.t.written()
        compare(out.includes('y=0,w=120,h=4'),true)
    })
    await section("clicking a cut line in the map keeps the row offset", async function ()
    {
        var _3a_ = hed(40,10); h = _3a_[0]; e = _3a_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
            for (j = 0; j < 9; j++)
            {
                lines.push('text')
            }
        }
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,8,10)
        m.csz = [10,20]
        e.state.setView([0,0])
        m.calcView()
        m.scrollToPixel([0,(m.mapY + m.lineOffset(0) + 12)])
        compare(e.state.s.view[1],0)
        compare(e.state.s.scrollOffset,3)
        h.screen.init()
        e.draw()
        compare(h.screen.get_char(0,0),' ')
        compare(h.screen.get_char(0,3),' ')
        compare(h.screen.get_char(0,4),'t')
    })
    await section("the map cuts a line at its top edge", async function ()
    {
        var _3b_ = hed(40,10); h = _3b_[0]; e = _3b_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.createImages()
        e.state.setView([0,10])
        m.calcView()
        compare(m.topRow,48)
        compare(m.topLine,6)
        compare(m.lineOffset(6),-24)
        id = m.ensureImage(6)
        h.screen.t.out = []
        m.drawImages()
        out = h.screen.t.written()
        compare((out.split(`i=${id},`).length - 1),1)
        compare(out.includes('y=24,w=120,h=4'),true)
    })
    await section("the map cuts a line at its bottom edge", async function ()
    {
        var _3c_ = hed(40,10); h = _3c_[0]; e = _3c_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.createImages()
        e.state.setView([0,0])
        m.calcView()
        compare(m.lineOffset(7),196)
        id = m.ensureImage(7)
        h.screen.t.out = []
        m.drawImages()
        out = h.screen.t.written()
        compare((out.split(`i=${id},`).length - 1),1)
        compare(out.includes('y=0,w=120,h=4'),true)
    })
    await section("the map cursors scale vertically with their line", async function ()
    {
        var _3d_ = hed(40,10); h = _3d_[0]; e = _3d_[1]

        e.state.loadLines(['a','b','c','# h1','d'])
        e.state.applyScales({enable:true,md:{h1:3}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,40]
        squares.onResize(40,10,null,[10,40])
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,40]
        e.state.setCursors([[1,3],[1,1]],{main:[1,3],adjust:false})
        e.state.setView([0,0])
        m.calcView()
        h.screen.t.out = []
        m.drawCursors()
        out = h.screen.t.written()
        compare(out.includes('w=4,h=12'),true)
        compare(out.includes('w=2,h=4'),true)
        compare(out.includes('w=8,h=12'),true)
    })
    await section("a normal map cursor keeps the height of one row", async function ()
    {
        var _3e_ = hed(40,10); h = _3e_[0]; e = _3e_[1]

        e.state.loadLines(['a','# h1','b'])
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        squares.onResize(40,10,null,[10,20])
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        e.state.setCursors([[1,0],[0,2]],{main:0,adjust:false})
        e.state.setView([0,0])
        m.calcView()
        h.screen.t.out = []
        m.drawCursors()
        out = h.screen.t.written()
        compare((out.split('w=4,h=4').length - 1),1)
        compare((out.split('w=2,h=4').length - 1),1)
    })
    await section("the map cuts a tall cursor at its bottom edge", async function ()
    {
        var _3f_ = hed(40,10); h = _3f_[0]; e = _3f_[1]

        lines = []
        for (i = 0; i < 110; i++)
        {
            lines.push(((i === 104) ? '# h1' : 'x'))
        }
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:3}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,40]
        squares.onResize(40,10,null,[10,40])
        h.screen.t.pixels = [400,400]
        h.screen.t.cellsz = [10,40]
        e.state.setView([0,55])
        m.calcView()
        compare(m.lineOffset(104),392)
        compare(m.mapHeight,400)
        e.state.setCursors([[1,104]],{main:0,adjust:false})
        h.screen.t.out = []
        m.drawCursors()
        out = h.screen.t.written()
        compare(out.includes('w=4,h=8'),true)
        compare(out.includes('w=8,h=8'),true)
    })
    await section("the map selection and highlights scale with their line", async function ()
    {
        var _40_ = hed(40,10); h = _40_[0]; e = _40_[1]

        e.state.loadLines(['a','b','# h1','## h2'])
        e.state.applyScales({enable:true,md:{h1:3,h2:2}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,40]
        squares.onResize(40,10,null,[10,40])
        h.screen.t.pixels = [400,400]
        h.screen.t.cellsz = [10,40]
        e.state.setSelections([[0,2,4,2]])
        e.state.setHighlights([[0,3,4,3]])
        e.state.setView([0,0])
        m.calcView()
        h.screen.t.out = []
        m.drawHighlights()
        out = h.screen.t.written()
        compare(out.includes('w=10,h=12'),true)
        compare(out.includes('w=10,h=8'),true)
    })
    await section("the main cursor marker stays when the cursor is off the map", async function ()
    {
        var _41_ = hed(40,10); h = _41_[0]; e = _41_[1]

        e.state.loadLines(['a','b','c'])
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        squares.onResize(40,10,null,[10,20])
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        e.state.setCursors([[100,0],[0,2]],{main:[100,0],adjust:false})
        e.state.setView([0,0])
        m.calcView()
        h.screen.t.out = []
        m.drawCursors()
        out = h.screen.t.written()
        compare(out.includes('w=8,h=4'),true)
        compare((out.includes('w=4,h=4')),false)
    })
    await section("the map follows the display rows near the end of a long file", async function ()
    {
        var _42_ = hed(40,10); h = _42_[0]; e = _42_[1]

        lines = []
        for (i = 0; i < 200; i++)
        {
            lines.push(((i % 10 === 0) ? '# h1' : 'text'))
        }
        e.state.loadLines(lines)
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        e.state.setView([0,100])
        m.calcView()
        compare(m.topLine,81)
        compare(m.lineOffset(100),84)
        compare((m.lineOffset(100) < m.cells.rows * 20),true)
    })
    await section("the scrollbar reflects the display rows", async function ()
    {
        var _43_ = hed(40,10); h = _43_[0]; e = _43_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('text')
        }
        lines[5] = '# h1'
        e.state.loadLines(lines)
        sc = new scroll(h.screen,e.state,'left')
        sc.layout(0,0,1,10)
        csz = [10,20]
        compare(sc.isActive(),true)
        compare(sc.knobHeight(csz),90)
        compare(sc.knobOffset(csz),0)
        e.state.setView([0,e.state.maxViewLine()])
        compare(sc.knobOffset(csz),110)
        compare((sc.knobOffset(csz) + sc.knobHeight(csz)),200)
        e.state.loadLines(['a','b','c'])
        compare(sc.isActive(),false)
        compare(sc.knobHeight(csz),0)
        compare(sc.knobOffset(csz),0)
    })
    await section("clicking the scrollbar reaches the last display rows", async function ()
    {
        var _44_ = hed(40,10); h = _44_[0]; e = _44_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('text')
        }
        lines.push('# h1')
        e.state.loadLines(lines)
        sc = new scroll(h.screen,e.state,'left')
        sc.layout(0,0,1,10)
        h.screen.t.cellsz = [10,20]
        e.state.setView([0,0])
        sc.scrollToPixel([0,180])
        compare(e.state.s.view[1],e.state.maxViewLine())
        compare(e.state.s.view[1],13)
    })
    await section("the scroll offset moves the top of the view inside a line", async function ()
    {
        small = {cols:20,rows:3}
        s = new state(small,'test_scale_scroll_offset')
        s.syntax.setExt('md')
        s.applyScales({enable:true,md:{h1:3,h2:2}})
        s.loadLines(['# a','b','## c','d'])
        s.setScrollTop(2)
        compare(s.viewTopRow(),2)
        compare(s.rowOfLine(0),-2)
        compare(s.rowOfLine(1),1)
        compare(s.rowOfLine(2),2)
        s.setScrollTop(4)
        compare(s.s.view[1],2)
        compare(s.s.scrollOffset,0)
    })
    await section("the wheel scrolls a scaled line one row at a time", async function ()
    {
        small = {cols:20,rows:3}
        s = new state(small,'test_scale_wheel_rows')
        s.syntax.setExt('md')
        s.applyScales({enable:true,md:{h1:3,h2:2}})
        s.loadLines(['# abc','a','b','c'])
        s.scrollView('down')
        compare(s.viewTopRow(),1)
        compare(s.s.view[1],0)
        compare(s.rowOfLine(1),2)
        s.scrollView('down')
        compare(s.viewTopRow(),2)
        compare(s.rowOfLine(1),1)
        s.scrollView('down')
        compare(s.viewTopRow(),3)
        compare(s.s.view[1],1)
        compare(s.rowOfLine(1),0)
    })
    await section("a cut top line is blanked while the rest moves row by row", async function ()
    {
        var _45_ = hed(20,8); h = _45_[0]; e = _45_[1]

        e.state.loadLines(['# abc','a','b','c','d','e','f','g','h','i','j'])
        e.draw()
        compare(h.screen.get_char(0,0),'#')
        compare(h.screen.get_char(0,3),'a')
        h.screen.init()
        e.state.setScrollTop(1)
        e.draw()
        compare(h.screen.get_char(0,0),' ')
        compare(h.screen.get_char(0,1),' ')
        compare(h.screen.get_char(0,2),'a')
        compare(h.screen.get_char(0,3),'b')
        h.screen.init()
        e.state.setScrollTop(2)
        e.draw()
        compare(h.screen.get_char(0,0),' ')
        compare(h.screen.get_char(0,1),'a')
        compare(h.screen.get_char(0,2),'b')
        h.screen.init()
        e.state.setScrollTop(3)
        e.draw()
        compare(h.screen.get_char(0,0),'a')
        compare(h.screen.get_char(0,1),'b')
    })
    await section("layout keeps the row offset", async function ()
    {
        var _46_ = hed(20,8); h = _46_[0]; e = _46_[1]

        e.state.loadLines(['# abc','a','b','c','d','e','f','g','h','i','j'])
        e.state.setScrollTop(1)
        e.layout(0,0,20,8)
        compare(e.state.viewTopRow(),1)
        compare(e.state.s.scrollOffset,1)
    })
    await section("moving the cursor into view clears the scroll offset", async function ()
    {
        var _47_ = hed(20,8); h = _47_[0]; e = _47_[1]

        e.state.loadLines(['# abc','a','b','c','d','e','f','g','h','i','j'])
        e.state.setScrollTop(1)
        e.state.setMainCursor(0,0)
        compare(e.state.viewTopRow(),0)
        compare(e.isCursorVisible([0,0]),true)
    })
    await section("cursor margins take rows or screen percentages", async function ()
    {
        s = tstt()
        compare(s.marginValue(7,3),7)
        compare(s.marginValue(0,3),0)
        compare(s.marginValue('25%',3),5)
        compare(s.marginValue('50%',3),10)
        compare(s.marginValue(null,3),3)
        saved = config.data
        config.data = {cursor:{topOffset:3,bottomOffset:'25%'}}
        compare(s.viewMargin('topOffset',7),3)
        compare(s.viewMargin('bottomOffset',7),5)
        config.data = saved
    })
    await section("entering a scaled line at the margin scrolls one row", async function ()
    {
        saved = config.data
        config.data = {cursor:{topOffset:2,bottomOffset:10}}
        var _48_ = hed(20,20); h = _48_[0]; e = _48_[1]

        lines = []
        for (i = 0; i < 9; i++)
        {
            lines.push('text')
        }
        lines.push('# h')
        for (i = 0; i < 10; i++)
        {
            lines.push('text')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:7}})
        e.state.setView([0,0])
        e.state.setCursors([[0,9]],{main:0,adjust:'topBotDeltaGrow',mc:[0,8]})
        compare(e.state.viewTopRow(),1)
        compare(e.state.s.view[1],1)
        compare(e.state.s.scrollOffset,0)
        compare(e.state.rowOfLine(9),8)
        compare(e.isCursorVisible([0,9]),true)
        config.data = saved
    })
    await section("a cursor scroll uses the row offset instead of jumping a line", async function ()
    {
        saved = config.data
        config.data = {cursor:{topOffset:2,bottomOffset:2}}
        var _49_ = hed(20,10); h = _49_[0]; e = _49_[1]

        e.state.loadLines(['# h','a','b','c','d','e','f','g','h','i','j'])
        e.state.setView([0,0])
        e.state.setCursors([[0,7]],{main:0,adjust:'topBotDeltaGrow',mc:[0,6]})
        compare(e.state.s.view[1],0)
        compare(e.state.s.scrollOffset,1)
        compare(e.state.viewTopRow(),1)
        h.screen.init()
        e.draw()
        compare(h.screen.get_char(0,0),' ')
        compare(h.screen.get_char(0,1),' ')
        compare(h.screen.get_char(0,2),'a')
        config.data = saved
    })
    await section("a sue line scale rebuilds the map with font images", async function ()
    {
        var _4a_ = hed({cols:40,rows:10}); h = _4a_[0]; e = _4a_[1]

        e.state.loadLines(['aaa','bbb','ccc'])
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.createImages()
        compare(m.textLine(0),false)
        compare(m.imageHeight(0),1)
        e.state.stepScales(4)
        compare(m.textLine(0),true)
        compare(m.imageHeight(0),20)
        h.screen.t.out = []
        m.calcView()
        m.drawImages()
        compare(h.screen.t.written().includes('v=20'),true)
    })
    await section("a sue scale run grows upwards from its line", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_run',[])
        e.state.loadLines(['aaa','bbb','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,2,6,2]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        e.state.setSelections([])
        scr.init()
        e.draw()
        compare(scr.get_char(3,0).includes(']66;s=3'),true)
        compare(scr.get_char(4,0),null)
        compare(scr.get_char(9,0).includes(']66;s=3'),true)
        compare(scr.get_char(3,2),"\x1b[3C")
        compare(scr.get_char(12,2),' ')
    })
    await section("a run does not shift the syntax after it", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:60,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_run_syntax',[])
        e.state.syntax.setExt('kode')
        e.state.loadLines(["x = 'hi' # note"])
        e.layout(0,0,60,10)
        e.state.setMainCursor(0,8)
        scr.init()
        e.draw()
        plain = scr.get_fg(14,0)
        e.state.setSelections([[0,0,1,0]])
        e.state.stepScales(1)
        e.state.setSelections([])
        scr.init()
        e.draw()
        compare(scr.get_fg(15,0),plain)
    })
    await section("a colour after a run lands on its grapheme", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_run_colour',[])
        e.state.loadLines(['aa FOO bb'])
        e.layout(0,0,40,10)
        e.state.setMainCursor(0,8)
        e.state.setSelections([[3,0,6,0]])
        e.state.stepScales(1)
        e.state.setSelections([])
        e.state.setSue(7,0,[31,2,1,'#ff0000'])
        scr.init()
        e.draw()
        compare(scr.get_fg(9,0),[255,255,255])
        compare(scr.get_fg(10,0),[255,0,0])
        compare(scr.get_fg(11,0),[255,0,0])
    })
    await section("a cursor in a run grows with it, at both ends", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_run_cursor',[])
        e.state.loadLines(['aaa','bbb','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,2,6,2]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        e.state.setSelections([])
        compare(e.cursorRunScale([2,2]),1)
        compare(e.cursorRunScale([3,2]),3)
        compare(e.cursorRunScale([4,2]),3)
        compare(e.cursorRunScale([6,2]),3)
        compare(e.cursorRunScale([7,2]),1)
        compare(e.cursorRowAndScale([3,2]),[0,3])
        compare(e.cursorRowAndScale([5,2]),[0,3])
        e.state.setCursors([[5,2]])
        scr.init()
        e.draw()
        compare(scr.c[0][9].mark,'main')
        e.state.setCursors([[3,2]])
        scr.init()
        e.draw()
        compare(scr.c[0][3].mark,'main')
    })
    await section("typing at the start of a run is drawn in the run", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_run_type_start',[])
        e.state.loadLines(['aaa','bbb','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,2,6,2]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        e.state.setSelections([])
        e.state.setMainCursor(3,2)
        e.state.insert('X')
        scr.init()
        e.draw()
        compare(scr.get_char(3,0).includes(']66;s=3'),true)
        compare(scr.get_char(6,0).includes(']66;s=3'),true)
    })
    await section("cursors past the end of a line are drawn there", async function ()
    {
        t = new ttio({headless:true,input:false,cols:40,rows:8})
        scr = new screen(t)
        e = new editor(scr,'test_cursor_past_end',[])
        e.state.loadLines(['abcdef','ab','abcd'])
        e.layout(0,0,40,8)
        e.state.setCursors([[5,0],[5,1],[5,2]],{main:0})
        scr.init()
        e.draw()
        compare(scr.c[0][5].mark,'main')
        compare(scr.c[1][5].mark,'multi')
        compare(scr.c[2][5].mark,'multi')
        compare((!_k_.empty(scr.c[1][2].mark)),false)
        compare((!_k_.empty(scr.c[2][4].mark)),false)
    })
    await section("a selection over a run shows on the scaled text", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_run_selection',[])
        e.state.loadLines(['aaa','bbb','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,2,6,2]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        scr.init()
        e.draw()
        compare(scr.get_bg(3,0),e.color.selection.span)
        compare(scr.get_bg(9,0),e.color.selection.span)
    })
    await section("a selection on a covered line does not paint the block", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_run_covered',[])
        e.state.loadLines(['aaaaaaaa','bbb','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,2,6,2]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        e.state.setSelections([])
        e.state.setCursors([[0,2]])
        scr.init()
        e.draw()
        before = blockArea(scr)
        e.state.setSelections([[0,0,8,0]])
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("every cell of a block belongs to the block", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_block_area',[])
        e.state.loadLines(['aaaaaaaa','bbb','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,2,6,2]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        e.state.setSelections([])
        scr.init()
        e.draw()
        compare(e.cells.isScaled(3,0),true)
        compare(e.cells.isScaled(4,0),true)
        compare(e.cells.isScaled(5,0),true)
        compare(e.cells.isScaled(6,0),true)
        compare(e.cells.isScaled(8,0),true)
        compare(e.cells.isScaled(3,1),true)
        compare(e.cells.isScaled(12,0),false)
        compare(e.cells.isScaled(3,3),false)
    })
    await section("completion is skipped when a run follows the cursor", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_run_complete',['complete'])
        e.state.loadLines(['aa FOO bb'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,0,6,0]])
        e.state.stepScales(1)
        e.state.setSelections([])
        e.state.setCursors([[6,0]])
        compare(e.complete.hasScaledTextAfterCursor(),false)
        e.state.setCursors([[5,0]])
        compare(e.complete.hasScaledTextAfterCursor(),true)
        e.state.setCursors([[2,0]])
        compare(e.complete.hasScaledTextAfterCursor(),true)
        e.state.setCursors([[7,0]])
        compare(e.complete.hasScaledTextAfterCursor(),false)
    })
    await section("a colour on a covered line does not paint the block", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_run_tint',[])
        e.state.loadLines(['aaaaaaaa','bbb','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,2,6,2]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        e.state.setSelections([])
        e.state.setCursors([[0,2]])
        scr.init()
        e.draw()
        before = blockArea(scr)
        e.state.setSue(3,0,[32,6,1,'#00ff00'])
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("a highlight on a covered line does not paint the block", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_run_highlight',[])
        e.state.loadLines(['aaaaaaaa','bbb','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,2,6,2]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        e.state.setSelections([])
        e.state.setCursors([[0,2]])
        scr.init()
        e.draw()
        before = blockArea(scr)
        e.state.setHighlights([[0,0,8,0]])
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("a yank flash on a covered line does not paint the block", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_run_yank',[])
        e.state.loadLines(['aaaaaaaa','bbb','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,2,6,2]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        e.state.setSelections([])
        e.state.setCursors([[0,2]])
        scr.init()
        e.draw()
        before = blockArea(scr)
        e.state.yankFlash = [[0,0,8,0]]
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("a selection reaches the blocks of a scaled line", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_selection_line_scale',[])
        e.state.loadLines(['aaaa','bbbb'])
        e.layout(0,0,40,10)
        e.state.setCursors([[0,0]])
        e.state.stepScales(2)
        e.state.setSelections([[0,0,2,0]])
        e.state.setCursors([[0,1]])
        scr.init()
        e.draw()
        compare(scr.get_bg(0,0),e.color.selection.span)
        compare(scr.get_bg(1,0),e.color.selection.span)
        compare(scr.get_bg(3,0),e.color.selection.span)
        compare(scr.get_bg(6,0),e.color.bg)
    })
    await section("a selection reaches the blocks of a run", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_selection_run_blocks',[])
        e.state.loadLines(['a','b','c','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,3,6,3]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        e.state.setCursors([[0,2]])
        scr.init()
        e.draw()
        compare(scr.get_bg(3,1),e.color.selection.span)
        compare(scr.get_bg(4,1),e.color.selection.span)
        compare(scr.get_bg(6,1),e.color.selection.span)
    })
    await section("a background colour fills the blocks of a scaled line", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_bg_line_scale',[])
        e.state.loadLines(['aaaa','bbbb'])
        e.layout(0,0,40,10)
        e.state.setCursors([[0,0]])
        e.state.stepScales(2)
        e.state.setSue(0,0,[32,2,1,'#00ff00'])
        e.state.setCursors([[0,1]])
        scr.init()
        e.draw()
        compare(scr.get_bg(0,0),[0,255,0])
        compare(scr.get_bg(1,0),[0,255,0])
        compare(scr.get_bg(3,0),[0,255,0])
        compare(scr.get_bg(6,0),e.color.bg)
    })
    await section("a colour reaches the blocks of a scaled line", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_colour_line_scale',[])
        e.state.loadLines(['aaaa','bbbb'])
        e.layout(0,0,40,10)
        e.state.setCursors([[0,0]])
        e.state.stepScales(2)
        e.state.setSue(0,0,[31,4,1,'#ff0000'])
        e.state.setCursors([[0,1]])
        scr.init()
        e.draw()
        compare(scr.get_fg(0,0),[255,0,0])
        compare(scr.get_fg(3,0),[255,0,0])
        compare(scr.get_fg(6,0),[255,0,0])
        compare(scr.get_fg(9,0),[255,0,0])
    })
    await section("a colour reaches the blocks of a run", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_colour_run_blocks',[])
        e.state.loadLines(['a','b','c','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,3,6,3]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        e.state.setSelections([])
        e.state.setCursors([[0,2]])
        e.state.setSue(3,3,[32,3,1,'#00ff00'])
        scr.init()
        e.draw()
        compare(scr.get_bg(3,1),[0,255,0])
        compare(scr.get_bg(4,1),[0,255,0])
        compare(scr.get_bg(6,1),[0,255,0])
        compare(scr.get_bg(7,1),[0,255,0])
        compare(scr.get_bg(9,1),[0,255,0])
    })
    await section("a yank flash reaches the blocks of a scaled line", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_yank_line_scale',[])
        e.state.loadLines(['aaaa','bbbb'])
        e.layout(0,0,40,10)
        e.state.setCursors([[0,0]])
        e.state.stepScales(2)
        e.state.setCursors([[0,1]])
        e.state.yankFlash = [[0,0,4,0]]
        scr.init()
        e.draw()
        compare(scr.get_bg(0,0),e.color.yank)
        compare(scr.get_bg(3,0),e.color.yank)
        compare(scr.get_bg(6,0),e.color.yank)
    })
    await section("a yank flash reaches the blocks of a run", async function ()
    {
        t = new ttio({headless:true,input:false,textSizing:true,cols:40,rows:10})
        scr = new screen(t)
        e = new editor(scr,'test_yank_run_blocks',[])
        e.state.loadLines(['a','b','c','xx BIG yy'])
        e.layout(0,0,40,10)
        e.state.setSelections([[3,3,6,3]])
        e.state.stepScales(1)
        e.state.stepScales(1)
        e.state.setSelections([])
        e.state.setCursors([[0,2]])
        e.state.yankFlash = [[3,3,6,3]]
        scr.init()
        e.draw()
        compare(scr.get_bg(3,1),e.color.yank)
        compare(scr.get_bg(4,1),e.color.yank)
        compare(scr.get_bg(6,1),e.color.yank)
        compare(scr.get_bg(9,1),e.color.yank)
    })
}
toExport["scale"]._section_ = true
toExport["map"] = async function ()
{
    await section("the map follows the mapScroll setting", async function ()
    {
        var _4b_ = hed({cols:40,rows:10}); h = _4b_[0]; e = _4b_[1]

        old = config.data
        m = new mapscr(e)
        config.data = {mapScroll:{enable:true}}
        post.emit('config.loaded',config.data)
        compare(m.visible(),true)
        config.data = {mapScroll:{enable:false}}
        post.emit('config.loaded',config.data)
        compare(m.hidden(),true)
        post.emit('popup.hide','macro')
        compare(m.hidden(),true)
        post.emit('popup.show','finder')
        compare(m.hidden(),true)
        post.emit('greet.hide')
        compare(m.hidden(),true)
        config.data = {mapScroll:{enable:true}}
        post.emit('config.loaded',config.data)
        compare(m.visible(),true)
        post.emit('popup.show','differ')
        compare(m.hidden(),true)
        post.emit('popup.hide','differ')
        compare(m.visible(),true)
        config.data = old
    })
}
toExport["map"]._section_ = true
toExport["squares"] = async function ()
{
    await section("tilesInRect", async function ()
    {
        squares.csz = [10,20]
        compare(squares.tilesInRect(0,0,10,10),[[0,0,0,0,10,10]])
        compare(squares.tilesInRect(5,5,5,5),[[0,0,5,5,5,5]])
        compare(squares.tilesInRect(15,15,5,10),[[1,0,5,15,5,5],[1,1,5,0,5,5]])
        compare(squares.tilesInRect(10,15,10,30),[[1,0,0,15,10,5],[1,1,0,0,10,20],[1,2,0,0,10,5]])
        compare(squares.tilesInRect(5,0,15,10),[[0,0,5,0,5,10],[1,0,0,0,10,10]])
        compare(squares.tilesInRect(15,0,15,10),[[1,0,5,0,5,10],[2,0,0,0,10,10]])
        compare(squares.tilesInRect(5,5,25,15),[[0,0,5,5,5,15],[1,0,0,5,10,15],[2,0,0,5,10,15]])
        compare(squares.tilesInRect(15,25,15,15),[[1,1,5,5,5,15],[2,1,0,5,10,15]])
        compare(squares.tilesInRect(0,0,25,25),[[0,0,0,0,10,20],[1,0,0,0,10,20],[2,0,0,0,5,20],[0,1,0,0,10,5],[1,1,0,0,10,5],[2,1,0,0,5,5]])
    })
}
toExport["squares"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2NhbGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVc7SUFBSzs7T0FDTCxZQUFkO09BQW9CLGFBQXBCOztPQUNjLFlBQWQ7O09BQ2MsY0FBZDtPQUFzQixhQUF0Qjs7T0FDYyxjQUFSO09BQWdCLGNBQWhCOztPQUNRLGFBQVQ7T0FBZ0IsY0FBaEI7O09BQ1MsYUFBUjtPQUFlLFdBQWY7O09BQ1EsYUFBVDs7T0FDUyxjQUFBOztBQUVyQixTQUFRLEtBQUssR0FBRyxLQUFLOztBQUNyQixpQkFBTyxNQUFJOzs7O0lBQ1AsUUFBUSxNQUFNLE1BQU07SUFDcEIsRUFBRSxPQUFPLE9BQU87SUFDaEIsRUFBRSxhQUFhLE9BQU8sS0FBSyxJQUFJLEdBQUcsRUFBRSxHQUFHO1dBQ3ZDOzs7QUFFSixnQkFBTSxNQUFLLE1BQUssTUFBSSxNQUFLOzs7O0lBQ2pCLFFBQVE7SUFDUixRQUFRLE9BQU8sRUFBRSxPQUFPLGFBQWE7SUFDckMsRUFBRSxPQUFPLEVBQUUsRUFBRSxLQUFLO0lBQ2xCLEVBQUUsTUFBTSxPQUFPLE9BQU87SUFDdEIsRUFBRSxNQUFNLGFBQWEsT0FBTyxLQUFLLElBQUksR0FBRyxFQUFFLEdBQUc7WUFDNUMsRUFBRTs7O0FBS1gsc0JBQVk7Ozs7SUFDUjtTQUNJLElBQUssT0FBSTs7UUFDVDthQUNJLElBQUssT0FBSTs7WUFDVCxJQUFJLE1BQU0sSUFBSSxTQUFTLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRSxHQUFHLElBQUksT0FBTyxFQUFFOztRQUM3RCxLQUFLLEtBQUs7O1dBQ2Q7Ozs7OztRQU1JLElBQUk7UUFDSixFQUFFLFdBQVcsUUFBUSxTQUFTLFlBQVksWUFBWTtnQkFFdEQsRUFBRSxXQUFXLEdBQUk7Z0JBQ2pCLEVBQUUsV0FBVyxHQUFJO2dCQUNqQixFQUFFLFdBQVcsR0FBSTtnQkFDakIsRUFBRSxXQUFXLEdBQUk7Z0JBQ2pCLEVBQUUs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/scale.kode
