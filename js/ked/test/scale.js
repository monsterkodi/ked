var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var before, bg, blockArea, bx, by, c, cells, csz, cx, data, e, first, h, hed, i, ink, j, lines, m, out, plain, rect, s, saved, sc, scale, scr, second, small, t, tstt, w, x, xx, y, yy

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
    await section("the completion frame fits at the edges of the editor", async function ()
    {
        var _14_ = hed(30,12,'kode',['complete']); h = _14_[0]; e = _14_[1]

        e.state.loadLines(['funky1 = 1','funky2 = 2','f'])
        e.state.setMainCursor(1,2)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.row(3).startsWith('╭'),true)
        compare(h.row(6).startsWith('╰'),true)
        var _15_ = hed(20,12,'kode',['complete']); h = _15_[0]; e = _15_[1]

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
        var _16_ = hed(40,14,'md',['complete']); h = _16_[0]; e = _16_[1]

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
        var _17_ = hed(40,12,'md',['complete']); h = _17_[0]; e = _17_[1]

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
        var _18_ = hed(40,12); h = _18_[0]; e = _18_[1]

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
        var _19_ = hed(40,12,'md',['complete']); h = _19_[0]; e = _19_[1]

        h.t.textSizing = true
        e.state.loadLines(['fu  fu  fu  fu  fu','# funky1','# funky2'])
        var list = [2,6,10,14,18]
        for (var _1a_ = 0; _1a_ < list.length; _1a_++)
        {
            cx = list[_1a_]
            e.state.setMainCursor(cx,0)
            e.complete.complete()
            h.screen.init()
            e.draw()
            rect = h.screen.eraseRects[0]
            var list1 = _k_.list(h.screen.frameBlocks)
            for (var _1b_ = 0; _1b_ < list1.length; _1b_++)
            {
                bx = list1[_1b_][0]
                by = list1[_1b_][1]
                scale = list1[_1b_][2]
                w = list1[_1b_][3]
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
                for (var _1c_ = xx = bx, _1d_ = bx + scale * w - 1; (_1c_ <= _1d_ ? xx <= bx + scale * w - 1 : xx >= bx + scale * w - 1); (_1c_ <= _1d_ ? ++xx : --xx))
                {
                    for (var _1e_ = yy = by, _1f_ = by + scale - 1; (_1e_ <= _1f_ ? yy <= by + scale - 1 : yy >= by + scale - 1); (_1e_ <= _1f_ ? ++yy : --yy))
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
        var _20_ = hed(20,6); h = _20_[0]; e = _20_[1]

        e.state.loadLines(['a','b','c','d','e','f','# h1'])
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],3)
    })
    await section("a scaled line needs a larger horizontal offset", async function ()
    {
        var _21_ = hed(20,8); h = _21_[0]; e = _21_[1]

        e.state.loadLines(['# a long heading line'])
        e.state.setMainCursor(20,0)
        compare(e.state.s.view[0],44)
    })
    await section("a short file with a tall line can scroll to its last line", async function ()
    {
        var _22_ = hed(20,6); h = _22_[0]; e = _22_[1]

        e.state.loadLines(['# h1','a','b','c','d'])
        compare(e.state.maxViewLine(),1)
        e.state.scrollView('down',3)
        compare(e.state.s.view[1],1)
    })
    await section("the last line stays reachable at the end of a tall file", async function ()
    {
        var _23_ = hed(20,6); h = _23_[0]; e = _23_[1]

        e.state.loadLines(['# h1','a','b','c','d','e','f'])
        compare(e.state.maxViewLine(),1)
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],1)
    })
    await section("the gutter numbers a scaled line only on its first row", async function ()
    {
        var _24_ = hed(30,10,'md',['gutter']); h = _24_[0]; e = _24_[1]

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
        var _25_ = hed({cols:40,rows:10}); h = _25_[0]; e = _25_[1]

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
        var _26_ = hed({cols:40,rows:10}); h = _26_[0]; e = _26_[1]

        e.state.loadLines(['aaa','bbb','ccc'])
        e.state.setLines(['aaa','XXX','bbb','ccc'])
        e.state.undo()
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.reload()
        compare(m.images.length,3)
        compare(kseg.str(m.getSegls()[1]),'bbb')
    })
    await section("a reload after inserting lines clears the old map images", async function ()
    {
        var _27_ = hed({cols:40,rows:10}); h = _27_[0]; e = _27_[1]

        e.state.loadLines(['aaa','bbb','ccc'])
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.reload()
        e.state.setLines(['aaa','bbb','foo','bar','ccc'])
        compare(m.images.length,5)
        h.screen.t.out = []
        e.state.loadLines(['aaa','bbb','ccc'])
        out = h.screen.t.written()
        compare(m.images.length,3)
        compare(out.includes(`a=d,d=R,x=${m.imgId},y=${m.imgId + 4}`),true)
        e.state.setLines(['aaa','bbb','NEW','NEW','ccc'])
        compare(m.images.length,5)
    })
    await section("a suspended map waits for the restored view", async function ()
    {
        var _28_ = hed({cols:40,rows:20}); h = _28_[0]; e = _28_[1]

        m = new mapscr(e)
        m.cells.layout(30,0,12,20)
        h.screen.t.pixels = [400,400]
        h.screen.t.cellsz = [10,20]
        e.state.loadLines((function () { var r_29_ = []; for (i = 0; i < 1000; i++)  { r_29_.push((`old ${i}`))  } return r_29_ }).bind(this)())
        m.reload()
        h.screen.t.out = []
        m.suspend()
        e.state.loadSegls(kseg.segls((function () { var r_2a_ = []; for (i = 0; i < 2000; i++)  { r_2a_.push((`new ${i}`))  } return r_2a_ }).bind(this)()))
        e.state.loadColors({fg:[],bg:[]})
        e.state.setView([0,1200])
        m.resume()
        compare(h.screen.t.written(),'')
        compare(m.redraw,true)
        m.layout(30,0,12,20)
        out = h.screen.t.written()
        compare(m.images.length,2000)
        compare((m.topLine > 0),true)
        compare(out.includes(`a=p,i=${m.imgId},`),false)
        compare(out.includes(`a=p,i=${m.imgId + m.topLine},`),true)
    })
    await section("a scaled line gets a taller stripe in the map", async function ()
    {
        var _2b_ = hed(40,10); h = _2b_[0]; e = _2b_[1]

        e.state.loadLines(['a','b','# h1','c','d'])
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        m.images = [100,101,102,103,104]
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        h.screen.t.out = []
        e.state.setView([0,0])
        m.drawImages()
        out = h.screen.t.written()
        compare((out.split('i=100,').length - 1),4)
    })
    await section("a scaled line is also wider in the map", async function ()
    {
        var _2c_ = hed({cols:40,rows:10}); h = _2c_[0]; e = _2c_[1]

        e.state.loadLines(['#'])
        e.state.applyScales({enable:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        bg = m.color.bg
        data = Buffer.alloc((m.cells.cols * m.csz[0] * m.imageHeight(0) * 3))
        m.imageForLine(data,e.state.s.lines[0],0)
        ink = false
        for (var _2d_ = y = 0, _2e_ = m.imageHeight(0); (_2d_ <= _2e_ ? y < m.imageHeight(0) : y > m.imageHeight(0)); (_2d_ <= _2e_ ? ++y : --y))
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
        var _2f_ = hed({cols:40,rows:10}); h = _2f_[0]; e = _2f_[1]

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
        var _30_ = hed({cols:40,rows:10}); h = _30_[0]; e = _30_[1]

        e.state.loadLines(['# h1','text'])
        m = new mapview(h.screen,e.state)
        m.setSyntaxSegls('md',e.state.s.lines)
        m.setScales({enable:true,md:{h1:7}})
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        m.images = [100,101]
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        h.screen.t.out = []
        m.drawImages()
        out = h.screen.t.written()
        compare((out.split('i=100,').length - 1),1)
        compare(out.includes('w=120,h=28'),true)
    })
    await section("the browse map does not place lines below its last row", async function ()
    {
        var _31_ = hed({cols:40,rows:10}); h = _31_[0]; e = _31_[1]

        e.state.loadLines((function () { var r_32_ = []; for (i = 0; i < 100; i++)  { r_32_.push((`line ${i}`))  } return r_32_ }).bind(this)())
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
        compare(m.images.length,45)
        compare(out.includes('\x1b[11;'),false)
    })
    await section("the browse map cuts a scaled line at its bottom edge", async function ()
    {
        var _33_ = hed({cols:40,rows:10}); h = _33_[0]; e = _33_[1]

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
        var _34_ = hed(40,10); h = _34_[0]; e = _34_[1]

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
        var _35_ = hed(40,10); h = _35_[0]; e = _35_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        m.images = []
        for (i = 0; i < 20; i++)
        {
            m.images.push(100 + i)
        }
        e.state.setView([0,10])
        m.calcView()
        compare(m.topRow,48)
        compare(m.topLine,6)
        compare(m.lineOffset(6),-24)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        h.screen.t.out = []
        m.drawImages()
        out = h.screen.t.written()
        compare((out.split('i=106,').length - 1),1)
        compare(out.includes('y=24,w=120,h=4'),true)
    })
    await section("the map cuts a line at its bottom edge", async function ()
    {
        var _36_ = hed(40,10); h = _36_[0]; e = _36_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        m.images = []
        for (i = 0; i < 20; i++)
        {
            m.images.push(100 + i)
        }
        e.state.setView([0,0])
        m.calcView()
        compare(m.lineOffset(7),196)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        h.screen.t.out = []
        m.drawImages()
        out = h.screen.t.written()
        compare((out.split('i=107,').length - 1),1)
        compare(out.includes('y=0,w=120,h=4'),true)
    })
    await section("the map cursors scale vertically with their line", async function ()
    {
        var _37_ = hed(40,10); h = _37_[0]; e = _37_[1]

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
        var _38_ = hed(40,10); h = _38_[0]; e = _38_[1]

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
        var _39_ = hed(40,10); h = _39_[0]; e = _39_[1]

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
        var _3a_ = hed(40,10); h = _3a_[0]; e = _3a_[1]

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
        var _3b_ = hed(40,10); h = _3b_[0]; e = _3b_[1]

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
        var _3c_ = hed(40,10); h = _3c_[0]; e = _3c_[1]

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
        var _3d_ = hed(40,10); h = _3d_[0]; e = _3d_[1]

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
        var _3e_ = hed(40,10); h = _3e_[0]; e = _3e_[1]

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
        var _3f_ = hed(20,8); h = _3f_[0]; e = _3f_[1]

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
        var _40_ = hed(20,8); h = _40_[0]; e = _40_[1]

        e.state.loadLines(['# abc','a','b','c','d','e','f','g','h','i','j'])
        e.state.setScrollTop(1)
        e.layout(0,0,20,8)
        compare(e.state.viewTopRow(),1)
        compare(e.state.s.scrollOffset,1)
    })
    await section("moving the cursor into view clears the scroll offset", async function ()
    {
        var _41_ = hed(20,8); h = _41_[0]; e = _41_[1]

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
        var _42_ = hed(20,20); h = _42_[0]; e = _42_[1]

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
        var _43_ = hed(20,10); h = _43_[0]; e = _43_[1]

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
        var _44_ = hed({cols:40,rows:10}); h = _44_[0]; e = _44_[1]

        e.state.loadLines(['aaa','bbb','ccc'])
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        h.screen.t.pixels = [400,200]
        h.screen.t.cellsz = [10,20]
        m.reload()
        compare(m.textLine(0),false)
        compare(m.imageHeight(0),1)
        h.screen.t.out = []
        e.state.stepScales(4)
        compare(m.textLine(0),true)
        compare(m.imageHeight(0),20)
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
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2NhbGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVc7O09BQ0EsWUFBZDtPQUFvQixhQUFwQjs7T0FDYyxZQUFkOztPQUNjLGNBQWQ7T0FBc0IsYUFBdEI7O09BQ2MsY0FBUjtPQUFnQixjQUFoQjs7T0FDUSxhQUFUO09BQWdCLGNBQWhCOztPQUNTLGFBQVI7T0FBZSxXQUFmOztPQUNRLGFBQVQ7O09BQ1MsY0FBQTs7QUFFckIsU0FBUSxLQUFLLEdBQUcsS0FBSzs7QUFDckIsaUJBQU8sTUFBSTs7OztJQUNQLFFBQVEsTUFBTSxNQUFNO0lBQ3BCLEVBQUUsT0FBTyxPQUFPO0lBQ2hCLEVBQUUsYUFBYSxPQUFPLEtBQUssSUFBSSxHQUFHLEVBQUUsR0FBRztXQUN2Qzs7O0FBRUosZ0JBQU0sTUFBSyxNQUFLLE1BQUksTUFBSzs7OztJQUNqQixRQUFRO0lBQ1IsUUFBUSxPQUFPLEVBQUUsT0FBTyxhQUFhO0lBQ3JDLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSztJQUNsQixFQUFFLE1BQU0sT0FBTyxPQUFPO0lBQ3RCLEVBQUUsTUFBTSxhQUFhLE9BQU8sS0FBSyxJQUFJLEdBQUcsRUFBRSxHQUFHO1lBQzVDLEVBQUU7OztBQUtYLHNCQUFZOzs7O0lBQ1I7U0FDSSxJQUFLLE9BQUk7O1FBQ1Q7YUFDSSxJQUFLLE9BQUk7O1lBQ1QsSUFBSSxNQUFNLElBQUksU0FBUyxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRTs7UUFDN0QsS0FBSyxLQUFLOztXQUNkOzs7Ozs7UUFNSSxJQUFJO1FBQ0osRUFBRSxXQUFXLFFBQVEsU0FBUyxZQUFZLFlBQVk7Z0JBRXRELEVBQUUsV0FBVyxHQUFJO2dCQUNqQixFQUFFLFdBQVcsR0FBSTtnQkFDakIsRUFBRSxXQUFXLEdBQUk7Z0JBQ2pCLEVBQUUsV0FBVyxHQUFJO2dCQUNqQixFQUFFLFdBQVcs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T0FBTyxFQUFFLElBQU0sRUFBRSxJQUFJO2dCQUN6QixJQUFJLE9BQU8sRUFBRSxJQUFNLEVBQUUsSUFBSTtnQkFDekIsSUFBSSxPQUFPLEVBQUUsSUFBTSxFQUFFLElBQUk7Z0JBQ3pCLElBQUksT0FBTyxFQUFFLElBQU0sRUFBRSxJQUFJO2dCQUN6QixJQUFJLE9BQU8sRUFBRSxJQUFNLEVBQUUsSUFBSTs7OztRQUl6QixRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU0sTUFBTSxXQUFXLEtBQUssS0FBSyxHQUFHLEtBQUs7UUFDcEUsVUFBVSxPQUFPO1FBQ2pCLFFBQVEsT0FBTyxJQUFJO1FBQ25CLEVBQUUsTUFBTSxXQUFXLE9BQU87UUFDMUIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsTUFBTSxhQUFhLEVBQUU7UUFDdkIsRUFBRSxNQUFNLFdBQVc7UUFDbkIsRUFBRSxNQUFNLGFBQWEsRUFBRTtRQUN2QixFQUFFLE1BQU0sY0FBYyxFQUFFLEVBQUUsRUFBRTtRQUU1QixJQUFJO1FBQ0osRUFBRTtnQkFFRixJQUFJLE9BQU8sRUFBRSxHQUFLLEVBQUUsTUFBTTtnQkFDMUIsSUFBSSxPQUFPLEVBQUUsR0FBSyxFQUFFLE1BQU07Z0JBQzFCLElBQUksT0FBTyxFQUFFLEdBQUssRUFBRSxNQUFNOzs7O1FBSTFCLFFBQVEsTUFBSyxTQUFTLEtBQUssTUFBTSxNQUFNLFdBQVcsS0FBSyxLQUFLLEdBQUcsS0FBSztRQUNwRSxVQUFVLE9BQU87UUFDakIsUUFBUSxPQUFPLElBQUk7UUFDbkIsRUFBRSxNQUFNLFdBQVcsSUFBSSxJQUFJLElBQUk7UUFDL0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsTUFBTSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUU7UUFDOUIsRUFBRSxNQUFNLFdBQVc7UUFDbkIsRUFBRSxNQUFNLFdBQVc7UUFDbkIsRUFBRSxNQUFNO1FBQ1IsRUFBRSxNQUFNLGFBQWEsRUFBRTtRQUN2QixFQUFFLE1BQU0sY0FBYyxFQUFFLEVBQUUsRUFBRTtRQUU1QixJQUFJO1FBQ0osRUFBRTtnQkFFRixJQUFJLE9BQU8sRUFBRSxHQUFLLEVBQUUsTUFBTTtnQkFDMUIsSUFBSSxPQUFPLEVBQUUsR0FBSyxFQUFFLE1BQU07Z0JBQzFCLElBQUksT0FBTyxFQUFFLEdBQUssRUFBRSxNQUFNO2dCQUMxQixJQUFJLE9BQU8sRUFBRSxHQUFLLEVBQUUsTUFBTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/scale.kode
