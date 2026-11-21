var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var before, bg, blockArea, bx, by, c, cells, csz, cx, data, e, first, h, hed, i, id, id0, id2, ink, j, lines, m, mapCursors, mapImages, mapScr, old, out, pixels, plain, quickMap, rect, removals, remove, runEd, runName, runScale, s, saved, sc, scale, scr, second, send, small, t, tstt, tsttLines, uploads, w, x, xx, y, yy

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
small = {cols:20,rows:3}

tstt = function (ext = 'md', win = cells, name = 'test_scale')
{
    var s

    s = new state(win,name)
    s.syntax.setExt(ext)
    s.applyScales({enable:true,md:{h1:3,h2:2}})
    return s
}

tsttLines = function (lines, ext = 'md')
{
    var s

    s = tstt(ext)
    s.loadLines(lines)
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
runName = 'test_run'

runEd = function (lines, opt = {}, setup = null)
{
    var e, scr, t, _39_13_, _40_13_, _41_14_, _42_19_

    opt = (opt != null ? opt : {})
    opt.cols = ((_39_13_=opt.cols) != null ? _39_13_ : 40)
    opt.rows = ((_40_13_=opt.rows) != null ? _40_13_ : 10)
    opt.feats = ((_41_14_=opt.feats) != null ? _41_14_ : [])
    opt.textSizing = ((_42_19_=opt.textSizing) != null ? _42_19_ : true)
    t = new ttio({headless:true,input:false,textSizing:opt.textSizing,cols:opt.cols,rows:opt.rows})
    scr = new screen(t)
    e = new editor(scr,runName,opt.feats)
    e.state.loadLines(lines)
    e.layout(0,0,opt.cols,opt.rows)
    if ((setup != null))
    {
        setup(e)
    }
    scr.init()
    e.draw()
    return [scr,e]
}

runScale = function (e, sel, steps = 2, clear = true)
{
    var i

    e.state.setSelections(sel)
    for (var _a_ = i = 0, _b_ = steps; (_a_ <= _b_ ? i < steps : i > steps); (_a_ <= _b_ ? ++i : --i))
    {
        e.state.stepScales(1)
    }
    if (clear)
    {
        e.state.setSelections([])
    }
    return e
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

mapScr = function (e, cols = 12, rows = 10)
{
    var m

    m = new mapscr(e)
    m.cells.layout(30,0,cols,rows)
    return m
}

pixels = function (h, csz = [10,20])
{
    h.screen.t.pixels = [h.cols * csz[0],h.rows * csz[1]]
    return h.screen.t.cellsz = csz
}

mapImages = function (h, e, cols = 12, rows = 10, csz = [10,20])
{
    var m

    m = mapScr(e,cols,rows)
    pixels(h,csz)
    m.createImages()
    return m
}

mapCursors = function (h, e, csz = [10,20])
{
    var m

    m = mapScr(e)
    m.csz = csz
    squares.onResize(h.cols,h.rows,null,csz)
    pixels(h,csz)
    return m
}

quickMap = function (h, e, syntax, cols = 12, rows = 10, csz = [10,20])
{
    var m

    m = new mapview(h.screen,e.state)
    m.setSyntaxSegls(syntax,e.state.s.lines)
    m.cells.layout(30,0,cols,rows)
    m.csz = csz
    return m
}
toExport["scale"] = async function ()
{
    await section("markdown headings scale by level", async function ()
    {
        s = tsttLines(['# One','## Two','### Three','#### Four','text'])
        compare(s.lineHeight(0),3)
        compare(s.lineHeight(1),2)
        compare(s.lineHeight(2),1)
        compare(s.lineHeight(3),1)
        compare(s.lineHeight(4),1)
    })
    await section("headings in other files keep their size", async function ()
    {
        s = tsttLines(['# One','## Two'],'kode')
        compare(s.lineHeight(0),1)
        compare(s.lineHeight(1),1)
    })
    await section("the configured scales change or disable the scaling", async function ()
    {
        s = tsttLines(['# one','## two','### three','#### four','##### five'])
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
        s = tsttLines(['# One','a','## Two','b'])
        compare(s.rowOfLine(0),0)
        compare(s.rowOfLine(1),3)
        compare(s.rowOfLine(2),4)
        compare(s.rowOfLine(3),6)
    })
    await section("the row map finds the line at a row", async function ()
    {
        s = tsttLines(['# One','a','## Two','b'])
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
        s = tsttLines(['a','b','c','d','e','f'])
        s.setView([0,4])
        compare(s.rowOfLine(4),0)
        compare(s.rowOfLine(3),-1)
        compare(s.rowOfLine(1),-3)
    })
    await section("highlights and cursors above the view are not drawn", async function ()
    {
        var _c_ = hed(40,10); h = _c_[0]; e = _c_[1]

        e.state.loadLines((function () { var r_d_ = []; for (i = 0; i < 20; i++)  { r_d_.push((`line ${i}`))  } return r_d_ }).bind(this)())
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
        s = tsttLines(['# One','a','## Two'])
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
        var _e_ = hed(40,10); h = _e_[0]; e = _e_[1]

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
        var _f_ = hed(15,6); h = _f_[0]; e = _f_[1]

        e.state.loadLines(['# abc'])
        e.draw()
        compare(h.screen.get_char(12,0),'c')
        var _10_ = hed(14,6); h = _10_[0]; e = _10_[1]

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
        var _11_ = hed(40,10); h = _11_[0]; e = _11_[1]

        e.state.loadLines(['# One','## Two','text'])
        e.state.setMainCursor(0,1)
        e.draw()
        compare(h.screen.c[3][0].mark,'main')
    })
    await section("horizontal scrolling moves scaled and normal lines together", async function ()
    {
        var _12_ = hed(20,8); h = _12_[0]; e = _12_[1]

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
        var _13_ = hed(20,8); h = _13_[0]; e = _13_[1]

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
        var _14_ = hed(20,8); h = _14_[0]; e = _14_[1]

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
        var _15_ = hed(40,12,'kode',['complete']); h = _15_[0]; e = _15_[1]

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
        var _16_ = hed(40,12,'kode',['complete']); h = _16_[0]; e = _16_[1]

        e.state.loadLines(['funky1 = 1','funky2 = 2','fun'])
        compare(e.complete.chunksForLines(e.state.s.lines),['funky1','=','1','funky2','=','2','fun'])
        e.state.setMainCursor(10,0)
        e.state.insert(' funky3')
        compare(kseg.str(e.state.s.lines[0]),'funky1 = 1 funky3')
        compare(e.complete.chunksForLines(e.state.s.lines),['funky1','=','1','funky3','funky2','=','2','fun'])
    })
    await section("completion follows edits in the document", async function ()
    {
        var _17_ = hed(40,12,'kode',['complete']); h = _17_[0]; e = _17_[1]

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
        var _18_ = hed(30,12,'kode',['complete']); h = _18_[0]; e = _18_[1]

        e.state.loadLines(['funky1 = 1','funky2 = 2','f'])
        e.state.setMainCursor(1,2)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.row(3).startsWith('╭'),true)
        compare(h.row(6).startsWith('╰'),true)
        var _19_ = hed(20,12,'kode',['complete']); h = _19_[0]; e = _19_[1]

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
        var _1a_ = hed(40,14,'md',['complete']); h = _1a_[0]; e = _1a_[1]

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
        var _1b_ = hed(40,12,'md',['complete']); h = _1b_[0]; e = _1b_[1]

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
        var _1c_ = hed(40,12); h = _1c_[0]; e = _1c_[1]

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
        var _1d_ = hed(40,12,'md',['complete']); h = _1d_[0]; e = _1d_[1]

        h.t.textSizing = true
        e.state.loadLines(['fu  fu  fu  fu  fu','# funky1','# funky2'])
        var list = [2,6,10,14,18]
        for (var _1e_ = 0; _1e_ < list.length; _1e_++)
        {
            cx = list[_1e_]
            e.state.setMainCursor(cx,0)
            e.complete.complete()
            h.screen.init()
            e.draw()
            rect = h.screen.eraseRects[0]
            var list1 = _k_.list(h.screen.frameBlocks)
            for (var _1f_ = 0; _1f_ < list1.length; _1f_++)
            {
                bx = list1[_1f_][0]
                by = list1[_1f_][1]
                scale = list1[_1f_][2]
                w = list1[_1f_][3]
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
                for (var _20_ = xx = bx, _21_ = bx + scale * w - 1; (_20_ <= _21_ ? xx <= bx + scale * w - 1 : xx >= bx + scale * w - 1); (_20_ <= _21_ ? ++xx : --xx))
                {
                    for (var _22_ = yy = by, _23_ = by + scale - 1; (_22_ <= _23_ ? yy <= by + scale - 1 : yy >= by + scale - 1); (_22_ <= _23_ ? ++yy : --yy))
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
        var _24_ = hed(20,6); h = _24_[0]; e = _24_[1]

        e.state.loadLines(['a','b','c','d','e','f','# h1'])
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],3)
    })
    await section("a scaled line needs a larger horizontal offset", async function ()
    {
        var _25_ = hed(20,8); h = _25_[0]; e = _25_[1]

        e.state.loadLines(['# a long heading line'])
        e.state.setMainCursor(20,0)
        compare(e.state.s.view[0],44)
    })
    await section("a short file with a tall line can scroll to its last line", async function ()
    {
        var _26_ = hed(20,6); h = _26_[0]; e = _26_[1]

        e.state.loadLines(['# h1','a','b','c','d'])
        compare(e.state.maxViewLine(),1)
        e.state.scrollView('down',3)
        compare(e.state.s.view[1],1)
    })
    await section("the last line stays reachable at the end of a tall file", async function ()
    {
        var _27_ = hed(20,6); h = _27_[0]; e = _27_[1]

        e.state.loadLines(['# h1','a','b','c','d','e','f'])
        compare(e.state.maxViewLine(),1)
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],1)
    })
    await section("the gutter numbers a scaled line only on its first row", async function ()
    {
        var _28_ = hed(30,10,'md',['gutter']); h = _28_[0]; e = _28_[1]

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
        s = tsttLines(['# a','b','## c','d'])
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
        var _29_ = hed({cols:40,rows:10}); h = _29_[0]; e = _29_[1]

        e.state.loadLines(['a','b','c','d','e','# h1','f','g','h','i','j'])
        m = mapScr(e)
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
        var _2a_ = hed({cols:40,rows:10}); h = _2a_[0]; e = _2a_[1]

        e.state.loadLines(['aaa','bbb','ccc'])
        e.state.setLines(['aaa','XXX','bbb','ccc'])
        e.state.undo()
        m = mapImages(h,e)
        m.show()
        m.reload()
        m.calcView()
        m.drawImages()
        compare(m.imageCache.size,3)
        compare(kseg.str(m.getSegls()[1]),'bbb')
    })
    await section("the map follows inserted and removed lines", async function ()
    {
        var _2b_ = hed({cols:40,rows:10}); h = _2b_[0]; e = _2b_[1]

        e.state.loadLines(['aaa','bbb','ccc'])
        m = mapImages(h,e)
        m.show()
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
        var _2c_ = hed({cols:40,rows:20}); h = _2c_[0]; e = _2c_[1]

        m = mapScr(e,12,20)
        m.show()
        pixels(h)
        e.state.loadLines((function () { var r_2d_ = []; for (i = 0; i < 1000; i++)  { r_2d_.push((`old ${i}`))  } return r_2d_ }).bind(this)())
        m.reload()
        h.screen.t.out = []
        m.suspend()
        e.state.loadSegls(kseg.segls((function () { var r_2e_ = []; for (i = 0; i < 2000; i++)  { r_2e_.push((`new ${i}`))  } return r_2e_ }).bind(this)()))
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
        var _2f_ = hed({cols:40,rows:10}); h = _2f_[0]; e = _2f_[1]

        e.state.loadLines((function () { var r_30_ = []; for (i = 0; i < 2000; i++)  { r_30_.push((`line ${i}`))  } return r_30_ }).bind(this)())
        m = mapImages(h,e)
        m.show()
        e.state.setView([0,0])
        m.calcView()
        m.drawImages()
        compare((m.imageCache.size < 60),true)
    })
    await section("inserting and undoing a line does not blank or re-upload the map", async function ()
    {
        var _31_ = hed({cols:40,rows:10}); h = _31_[0]; e = _31_[1]

        e.state.loadLines((function () { var r_32_ = []; for (i = 0; i < 20; i++)  { r_32_.push((`line ${i}`))  } return r_32_ }).bind(this)())
        m = mapImages(h,e)
        m.show()
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
        var _33_ = hed(40,10); h = _33_[0]; e = _33_[1]

        e.state.loadLines(['a','b','# h1','c','d'])
        m = mapImages(h,e)
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
        var _34_ = hed({cols:40,rows:10}); h = _34_[0]; e = _34_[1]

        e.state.loadLines(['#'])
        e.state.applyScales({enable:true,md:{h1:7}})
        m = mapScr(e)
        m.csz = [10,20]
        bg = m.color.bg
        data = Buffer.alloc((m.cells.cols * m.csz[0] * m.imageHeight(0) * 3))
        m.imageForLine(data,e.state.s.lines[0],0)
        ink = false
        for (var _35_ = y = 0, _36_ = m.imageHeight(0); (_35_ <= _36_ ? y < m.imageHeight(0) : y > m.imageHeight(0)); (_35_ <= _36_ ? ++y : --y))
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
        var _37_ = hed({cols:40,rows:10}); h = _37_[0]; e = _37_[1]

        e.state.loadLines(['a','b','c','d','e','# h1','f','g'])
        m = quickMap(h,e,'md')
        m.setScales({enable:true,md:{h1:3}})
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
        var _38_ = hed({cols:40,rows:10}); h = _38_[0]; e = _38_[1]

        e.state.loadLines(['# h1','text'])
        m = quickMap(h,e,'md')
        m.setScales({enable:true,md:{h1:7}})
        pixels(h)
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
        var _39_ = hed({cols:40,rows:10}); h = _39_[0]; e = _39_[1]

        e.state.loadLines((function () { var r_3a_ = []; for (i = 0; i < 100; i++)  { r_3a_.push((`line ${i}`))  } return r_3a_ }).bind(this)())
        m = quickMap(h,e,'txt')
        m.rowOffset = 1
        pixels(h)
        h.screen.t.out = []
        m.createImages()
        m.drawImages()
        out = h.screen.t.written()
        compare(m.imageCache.size,45)
        compare(out.includes('\x1b[11;'),false)
    })
    await section("the browse map cuts a scaled line at its bottom edge", async function ()
    {
        var _3b_ = hed({cols:40,rows:10}); h = _3b_[0]; e = _3b_[1]

        lines = []
        for (i = 0; i < 44; i++)
        {
            lines.push('text')
        }
        lines.push('# h1')
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:7}})
        m = quickMap(h,e,'md')
        m.setScales({enable:true,md:{h1:7}})
        m.rowOffset = 1
        pixels(h)
        h.screen.t.out = []
        m.createImages()
        m.drawImages()
        out = h.screen.t.written()
        compare(out.includes('y=0,w=120,h=4'),true)
    })
    await section("clicking a cut line in the map keeps the row offset", async function ()
    {
        var _3c_ = hed(40,10); h = _3c_[0]; e = _3c_[1]

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
        m = mapScr(e,8,10)
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
        var _3d_ = hed(40,10); h = _3d_[0]; e = _3d_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:7}})
        m = mapImages(h,e)
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
        var _3e_ = hed(40,10); h = _3e_[0]; e = _3e_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:7}})
        m = mapImages(h,e)
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
        var _3f_ = hed(40,10); h = _3f_[0]; e = _3f_[1]

        e.state.loadLines(['a','b','c','# h1','d'])
        e.state.applyScales({enable:true,md:{h1:3}})
        m = mapCursors(h,e,[10,40])
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
        var _40_ = hed(40,10); h = _40_[0]; e = _40_[1]

        e.state.loadLines(['a','# h1','b'])
        m = mapCursors(h,e,[10,20])
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
        var _41_ = hed(40,10); h = _41_[0]; e = _41_[1]

        lines = []
        for (i = 0; i < 110; i++)
        {
            lines.push(((i === 104) ? '# h1' : 'x'))
        }
        e.state.loadLines(lines)
        e.state.applyScales({enable:true,md:{h1:3}})
        m = mapCursors(h,e,[10,40])
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
        var _42_ = hed(40,10); h = _42_[0]; e = _42_[1]

        e.state.loadLines(['a','b','# h1','## h2'])
        e.state.applyScales({enable:true,md:{h1:3,h2:2}})
        m = mapCursors(h,e,[10,40])
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
        var _43_ = hed(40,10); h = _43_[0]; e = _43_[1]

        e.state.loadLines(['a','b','c'])
        m = mapCursors(h,e,[10,20])
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
        var _44_ = hed(40,10); h = _44_[0]; e = _44_[1]

        lines = []
        for (i = 0; i < 200; i++)
        {
            lines.push(((i % 10 === 0) ? '# h1' : 'text'))
        }
        e.state.loadLines(lines)
        m = mapScr(e)
        m.csz = [10,20]
        e.state.setView([0,100])
        m.calcView()
        compare(m.topLine,81)
        compare(m.lineOffset(100),84)
        compare((m.lineOffset(100) < m.cells.rows * 20),true)
    })
    await section("the scrollbar reflects the display rows", async function ()
    {
        var _45_ = hed(40,10); h = _45_[0]; e = _45_[1]

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
        var _46_ = hed(40,10); h = _46_[0]; e = _46_[1]

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
        s = tstt('md',small,'test_scale_scroll_offset')
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
        s = tstt('md',small,'test_scale_wheel_rows')
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
        var _47_ = hed(20,8); h = _47_[0]; e = _47_[1]

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
        var _48_ = hed(20,8); h = _48_[0]; e = _48_[1]

        e.state.loadLines(['# abc','a','b','c','d','e','f','g','h','i','j'])
        e.state.setScrollTop(1)
        e.layout(0,0,20,8)
        compare(e.state.viewTopRow(),1)
        compare(e.state.s.scrollOffset,1)
    })
    await section("moving the cursor into view clears the scroll offset", async function ()
    {
        var _49_ = hed(20,8); h = _49_[0]; e = _49_[1]

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
        var _4a_ = hed(20,20); h = _4a_[0]; e = _4a_[1]

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
        var _4b_ = hed(20,10); h = _4b_[0]; e = _4b_[1]

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
        var _4c_ = hed({cols:40,rows:10}); h = _4c_[0]; e = _4c_[1]

        e.state.loadLines(['aaa','bbb','ccc'])
        m = mapImages(h,e)
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
        var _4d_ = runEd(['aaa','bbb','xx BIG yy'],{},function (e)
        {
            return runScale(e,[[3,2,6,2]])
        }); scr = _4d_[0]; e = _4d_[1]

        compare(scr.get_char(3,0).includes(']66;s=3'),true)
        compare(scr.get_char(4,0),null)
        compare(scr.get_char(9,0).includes(']66;s=3'),true)
        compare(scr.get_char(3,2),"\x1b[3C")
        compare(scr.get_char(12,2),' ')
    })
    await section("a run does not shift the syntax after it", async function ()
    {
        var _4e_ = runEd(["x = 'hi' # note"],({cols:60,rows:10}),function (e)
        {
            e.state.syntax.setExt('kode')
            return e.state.setMainCursor(0,8)
        }); scr = _4e_[0]; e = _4e_[1]

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
        var _4f_ = runEd(['aa FOO bb'],({feats:['susan']}),function (e)
        {
            e.state.setMainCursor(0,8)
            runScale(e,[[3,0,6,0]],1)
            return e.state.setSue(7,0,[31,2,1,'#ff0000'])
        }); scr = _4f_[0]; e = _4f_[1]

        compare(scr.get_fg(9,0),[255,255,255])
        compare(scr.get_fg(10,0),[255,0,0])
        compare(scr.get_fg(11,0),[255,0,0])
    })
    await section("a cursor in a run grows with it, at both ends", async function ()
    {
        var _50_ = runEd(['aaa','bbb','xx BIG yy'],{},function (e)
        {
            return runScale(e,[[3,2,6,2]])
        }); scr = _50_[0]; e = _50_[1]

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
        var _51_ = runEd(['aaa','bbb','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,2,6,2]])
            e.state.setMainCursor(3,2)
            return e.state.insert('X')
        }); scr = _51_[0]; e = _51_[1]

        compare(scr.get_char(3,0).includes(']66;s=3'),true)
        compare(scr.get_char(6,0).includes(']66;s=3'),true)
    })
    await section("cursors past the end of a line are drawn there", async function ()
    {
        var _52_ = runEd(['abcdef','ab','abcd'],({rows:8,textSizing:false}),function (e)
        {
            return e.state.setCursors([[5,0],[5,1],[5,2]],{main:0})
        }); scr = _52_[0]; e = _52_[1]

        compare(scr.c[0][5].mark,'main')
        compare(scr.c[1][5].mark,'multi')
        compare(scr.c[2][5].mark,'multi')
        compare((!_k_.empty(scr.c[1][2].mark)),false)
        compare((!_k_.empty(scr.c[2][4].mark)),false)
    })
    await section("a selection over a run shows on the scaled text", async function ()
    {
        var _53_ = runEd(['aaa','bbb','xx BIG yy'],{},function (e)
        {
            return runScale(e,[[3,2,6,2]],2,false)
        }); scr = _53_[0]; e = _53_[1]

        compare(scr.get_bg(3,0),e.color.selection.span)
        compare(scr.get_bg(9,0),e.color.selection.span)
    })
    await section("a selection on a covered line does not paint the block", async function ()
    {
        var _54_ = runEd(['aaaaaaaa','bbb','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,2,6,2]])
            return e.state.setCursors([[0,2]])
        }); scr = _54_[0]; e = _54_[1]

        before = blockArea(scr)
        e.state.setSelections([[0,0,8,0]])
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("every cell of a block belongs to the block", async function ()
    {
        var _55_ = runEd(['aaaaaaaa','bbb','xx BIG yy'],{},function (e)
        {
            return runScale(e,[[3,2,6,2]])
        }); scr = _55_[0]; e = _55_[1]

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
        var _56_ = runEd(['aa FOO bb'],({feats:['complete']}),function (e)
        {
            return runScale(e,[[3,0,6,0]],1)
        }); scr = _56_[0]; e = _56_[1]

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
        var _57_ = runEd(['aaaaaaaa','bbb','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,2,6,2]])
            return e.state.setCursors([[0,2]])
        }); scr = _57_[0]; e = _57_[1]

        before = blockArea(scr)
        e.state.setSue(3,0,[32,6,1,'#00ff00'])
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("a highlight on a covered line does not paint the block", async function ()
    {
        var _58_ = runEd(['aaaaaaaa','bbb','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,2,6,2]])
            return e.state.setCursors([[0,2]])
        }); scr = _58_[0]; e = _58_[1]

        before = blockArea(scr)
        e.state.setHighlights([[0,0,8,0]])
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("a yank flash on a covered line does not paint the block", async function ()
    {
        var _59_ = runEd(['aaaaaaaa','bbb','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,2,6,2]])
            return e.state.setCursors([[0,2]])
        }); scr = _59_[0]; e = _59_[1]

        before = blockArea(scr)
        e.state.novim.yankFlash = [[0,0,8,0]]
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("a selection reaches the blocks of a scaled line", async function ()
    {
        var _5a_ = runEd(['aaaa','bbbb'],{},function (e)
        {
            e.state.setCursors([[0,0]])
            e.state.stepScales(2)
            e.state.setSelections([[0,0,2,0]])
            return e.state.setCursors([[0,1]])
        }); scr = _5a_[0]; e = _5a_[1]

        compare(scr.get_bg(0,0),e.color.selection.span)
        compare(scr.get_bg(1,0),e.color.selection.span)
        compare(scr.get_bg(3,0),e.color.selection.span)
        compare(scr.get_bg(6,0),e.color.bg)
    })
    await section("a selection reaches the blocks of a run", async function ()
    {
        var _5b_ = runEd(['a','b','c','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,3,6,3]],2,false)
            return e.state.setCursors([[0,2]])
        }); scr = _5b_[0]; e = _5b_[1]

        compare(scr.get_bg(3,1),e.color.selection.span)
        compare(scr.get_bg(4,1),e.color.selection.span)
        compare(scr.get_bg(6,1),e.color.selection.span)
    })
    await section("a background colour fills the blocks of a scaled line", async function ()
    {
        var _5c_ = runEd(['aaaa','bbbb'],({feats:['susan']}),function (e)
        {
            e.state.setCursors([[0,0]])
            e.state.stepScales(2)
            e.state.setSue(0,0,[32,2,1,'#00ff00'])
            return e.state.setCursors([[0,1]])
        }); scr = _5c_[0]; e = _5c_[1]

        compare(scr.get_bg(0,0),[0,255,0])
        compare(scr.get_bg(1,0),[0,255,0])
        compare(scr.get_bg(3,0),[0,255,0])
        compare(scr.get_bg(6,0),e.color.bg)
    })
    await section("a colour reaches the blocks of a scaled line", async function ()
    {
        var _5d_ = runEd(['aaaa','bbbb'],({feats:['susan']}),function (e)
        {
            e.state.setCursors([[0,0]])
            e.state.stepScales(2)
            e.state.setSue(0,0,[31,4,1,'#ff0000'])
            return e.state.setCursors([[0,1]])
        }); scr = _5d_[0]; e = _5d_[1]

        compare(scr.get_fg(0,0),[255,0,0])
        compare(scr.get_fg(3,0),[255,0,0])
        compare(scr.get_fg(6,0),[255,0,0])
        compare(scr.get_fg(9,0),[255,0,0])
    })
    await section("a colour reaches the blocks of a run", async function ()
    {
        var _5e_ = runEd(['a','b','c','xx BIG yy'],({feats:['susan']}),function (e)
        {
            runScale(e,[[3,3,6,3]])
            e.state.setCursors([[0,2]])
            return e.state.setSue(3,3,[32,3,1,'#00ff00'])
        }); scr = _5e_[0]; e = _5e_[1]

        compare(scr.get_bg(3,1),[0,255,0])
        compare(scr.get_bg(4,1),[0,255,0])
        compare(scr.get_bg(6,1),[0,255,0])
        compare(scr.get_bg(7,1),[0,255,0])
        compare(scr.get_bg(9,1),[0,255,0])
    })
    await section("a yank flash reaches the blocks of a scaled line", async function ()
    {
        var _5f_ = runEd(['aaaa','bbbb'],{},function (e)
        {
            e.state.setCursors([[0,0]])
            e.state.stepScales(2)
            e.state.setCursors([[0,1]])
            return e.state.novim.yankFlash = [[0,0,4,0]]
        }); scr = _5f_[0]; e = _5f_[1]

        compare(scr.get_bg(0,0),e.color.yank)
        compare(scr.get_bg(3,0),e.color.yank)
        compare(scr.get_bg(6,0),e.color.yank)
    })
    await section("a yank flash reaches the blocks of a run", async function ()
    {
        var _60_ = runEd(['a','b','c','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,3,6,3]])
            e.state.setCursors([[0,2]])
            return e.state.novim.yankFlash = [[3,3,6,3]]
        }); scr = _60_[0]; e = _60_[1]

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
        var _61_ = hed({cols:40,rows:10}); h = _61_[0]; e = _61_[1]

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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2NhbGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVc7SUFBSzs7T0FDTCxZQUFkO09BQW9CLGFBQXBCOztPQUNjLFlBQWQ7O09BQ2MsY0FBZDtPQUFzQixhQUF0Qjs7T0FDYyxjQUFSO09BQWdCLGNBQWhCOztPQUNRLGFBQVQ7T0FBZ0IsY0FBaEI7O09BQ1MsYUFBUjtPQUFlLFdBQWY7O09BQ1EsYUFBVDs7T0FDUyxjQUFBOztBQUVyQixTQUFRLEtBQUssR0FBRyxLQUFLO0FBQ3JCLFNBQVEsS0FBSyxHQUFHLEtBQUs7O0FBRXJCLGlCQUFPLE1BQUksTUFBSyxNQUFJLE9BQU0sT0FBSzs7OztJQUMzQixRQUFRLE1BQU0sSUFBSTtJQUNsQixFQUFFLE9BQU8sT0FBTztJQUNoQixFQUFFLGFBQWEsT0FBTyxLQUFLLElBQUksR0FBRyxFQUFFLEdBQUc7V0FDdkM7OztBQUVKLHNCQUFZLE9BQU0sTUFBSTs7OztJQUNsQixJQUFJLEtBQUs7SUFDVCxFQUFFLFVBQVU7V0FDWjs7O0FBRUosZ0JBQU0sTUFBSyxNQUFLLE1BQUksTUFBSzs7OztJQUNqQixRQUFRO0lBQ1IsUUFBUSxPQUFPLEVBQUUsT0FBTyxhQUFhO0lBQ3JDLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSztJQUNsQixFQUFFLE1BQU0sT0FBTyxPQUFPO0lBQ3RCLEVBQUUsTUFBTSxhQUFhLE9BQU8sS0FBSyxJQUFJLEdBQUcsRUFBRSxHQUFHO1lBQzVDLEVBQUU7O0FBSVgsVUFBVTs7QUFFVixrQkFBUSxPQUFNLFVBQU8sUUFBTTs7OztJQUN2QixPQUFBLGNBQUE7SUFDQSxJQUFJLGlCQUFKLElBQUksMEJBQVE7SUFDWixJQUFJLGlCQUFKLElBQUksMEJBQVE7SUFDWixJQUFJLGtCQUFKLElBQUk7SUFDSixJQUFJLHVCQUFKLElBQUksZ0NBQWM7SUFDbEIsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNLE1B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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/scale.kode
