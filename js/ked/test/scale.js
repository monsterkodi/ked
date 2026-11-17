var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var before, bg, blockArea, bx, by, c, cells, csz, cx, data, e, first, h, hed, i, id, id0, id2, ink, j, lines, m, out, plain, rect, removals, remove, s, saved, sc, scale, scr, second, send, small, t, tstt, uploads, w, x, xx, y, yy

import kxk from "../../kxk.js"
let kseg = kxk.kseg

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
    await section("a cursor in a run grows with it, only inside the markers", async function ()
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
        compare(e.cursorRunScale([3,2]),1)
        compare(e.cursorRunScale([4,2]),3)
        compare(e.cursorRunScale([6,2]),3)
        compare(e.cursorRunScale([7,2]),1)
        compare(e.cursorRowAndScale([3,2]),[2,1])
        compare(e.cursorRowAndScale([5,2]),[0,3])
        e.state.setCursors([[5,2]])
        scr.init()
        e.draw()
        compare(scr.c[0][9].mark,'main')
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2NhbGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVc7O09BQ0EsWUFBZDtPQUFvQixhQUFwQjs7T0FDYyxZQUFkOztPQUNjLGNBQWQ7T0FBc0IsYUFBdEI7O09BQ2MsY0FBUjtPQUFnQixjQUFoQjs7T0FDUSxhQUFUO09BQWdCLGNBQWhCOztPQUNTLGFBQVI7T0FBZSxXQUFmOztPQUNRLGFBQVQ7O09BQ1MsY0FBQTs7QUFFckIsU0FBUSxLQUFLLEdBQUcsS0FBSzs7QUFDckIsaUJBQU8sTUFBSTs7OztJQUNQLFFBQVEsTUFBTSxNQUFNO0lBQ3BCLEVBQUUsT0FBTyxPQUFPO0lBQ2hCLEVBQUUsYUFBYSxPQUFPLEtBQUssSUFBSSxHQUFHLEVBQUUsR0FBRztXQUN2Qzs7O0FBRUosZ0JBQU0sTUFBSyxNQUFLLE1BQUksTUFBSzs7OztJQUNqQixRQUFRO0lBQ1IsUUFBUSxPQUFPLEVBQUUsT0FBTyxhQUFhO0lBQ3JDLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSztJQUNsQixFQUFFLE1BQU0sT0FBTyxPQUFPO0lBQ3RCLEVBQUUsTUFBTSxhQUFhLE9BQU8sS0FBSyxJQUFJLEdBQUcsRUFBRSxHQUFHO1lBQzVDLEVBQUU7OztBQUtYLHNCQUFZOzs7O0lBQ1I7U0FDSSxJQUFLLE9BQUk7O1FBQ1Q7YUFDSSxJQUFLLE9BQUk7O1lBQ1QsSUFBSSxNQUFNLElBQUksU0FBUyxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRTs7UUFDN0QsS0FBSyxLQUFLOztXQUNkOzs7Ozs7UUFNSSxJQUFJO1FBQ0osRUFBRSxXQUFXLFFBQVEsU0FBUyxZQUFZLFlBQVk7Z0JBRXRELEVBQUUsV0FBVyxHQUFJO2dCQUNqQixFQUFFLFdBQVcsR0FBSTtnQkFDakIsRUFBRSxXQUFXLEdBQUk7Z0JBQ2pCLEVBQUUsV0FBVyxHQUFJO2dCQUNqQixFQUFFLFdBQVcs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/scale.kode
