var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var before, bg, blockArea, bx, by, c, cells, csz, cx, data, e, frame, h, hed, i, id, id0, id2, ink, j, lines, m, mapCursors, mapImages, mapScr, old, out, pixels, plain, quickMap, rect, removals, remove, runEd, runName, runScale, s, saved, sc, scale, scr, second, send, small, t, tstt, tsttLines, uploads, w, x, xx, y, yy

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
    for (i = 0; i < steps; i++)
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
        ;[h,e] = hed(40,10)
        e.state.loadLines((function () { var r_a_ = []; for (i = 0; i < 20; i++)  { r_a_.push((`line ${i}`))  } return r_a_ }).bind(this)())
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(15,6)
        e.state.loadLines(['# abc'])
        e.draw()
        compare(h.screen.get_char(12,0),'c')
        ;[h,e] = hed(14,6)
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
        ;[h,e] = hed(40,10)
        e.state.loadLines(['# One','## Two','text'])
        e.state.setMainCursor(0,1)
        e.draw()
        compare(h.screen.c[3][0].mark,'main')
    })
    await section("horizontal scrolling moves scaled and normal lines together", async function ()
    {
        ;[h,e] = hed(20,8)
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
        ;[h,e] = hed(20,8)
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
        ;[h,e] = hed(20,8)
        h.t.textSizing = true
        e.state.loadLines(['# big','a','b','c','d','e','f','g','h'])
        h.screen.init()
        e.draw()
        frame = h.screen.renderString()
        compare(frame.startsWith('\x1b[H'),true)
        e.state.scrollView('down')
        h.screen.init()
        e.draw()
        second = h.screen.renderString()
        compare(second.startsWith("\x1b[1;1H\x1b[15X\x1b[2;1H\x1b[15X\x1b[3;1H\x1b[15X\x1b[H"),true)
    })
    await section("completion is placed and highlighted on normal lines", async function ()
    {
        ;[h,e] = hed(40,12,'kode',['complete'])
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
        ;[h,e] = hed(40,12,'kode',['complete'])
        e.state.loadLines(['funky1 = 1','funky2 = 2','fun'])
        compare(e.complete.chunksForLines(e.state.s.lines),['funky1','=','1','funky2','=','2','fun'])
        e.state.setMainCursor(10,0)
        e.state.insert(' funky3')
        compare(kseg.str(e.state.s.lines[0]),'funky1 = 1 funky3')
        compare(e.complete.chunksForLines(e.state.s.lines),['funky1','=','1','funky3','funky2','=','2','fun'])
    })
    await section("completion follows edits in the document", async function ()
    {
        ;[h,e] = hed(40,12,'kode',['complete'])
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
        ;[h,e] = hed(30,12,'kode',['complete'])
        e.state.loadLines(['funky1 = 1','funky2 = 2','f'])
        e.state.setMainCursor(1,2)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.placedAt(0,3),true)
        compare(h.placedAt(0,6),true)
        ;[h,e] = hed(20,12,'kode',['complete'])
        e.state.loadLines(['funky1 = 1','funky2 = 2','...........funky'])
        e.state.setMainCursor(16,2)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(h.placedAt(9,3),true)
        compare(h.placedAt(8,3),false)
        compare(h.placedAt(19,3),true)
    })
    await section("the completion frame moves below a scaled line", async function ()
    {
        ;[h,e] = hed(40,14,'md',['complete'])
        e.state.loadLines(['# fu','','funky1 = 1','funky2 = 2'])
        e.state.setMainCursor(4,0)
        e.complete.complete()
        h.screen.init()
        e.draw()
        compare(e.state.lineHeight(0),3)
        compare(h.placements().filter(function (img)
        {
            return _k_.in(img.y,[1,2])
        }).length,0)
        compare(h.placedAt(8,3),true)
        compare(h.placedAt(8,6),true)
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
        ;[h,e] = hed(40,12,'md',['complete'])
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
        ;[h,e] = hed(40,12)
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
        ;[h,e] = hed(40,12,'md',['complete'])
        h.t.textSizing = true
        e.state.loadLines(['fu  fu  fu  fu  fu','# funky1','# funky2'])
        var list = [2,6,10,14,18]
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            cx = list[_b_]
            e.state.setMainCursor(cx,0)
            e.complete.complete()
            h.screen.init()
            e.draw()
            rect = h.screen.eraseRects[0]
            var list1 = _k_.list(h.screen.frameBlocks)
            for (var _c_ = 0; _c_ < list1.length; _c_++)
            {
                bx = list1[_c_][0]
                by = list1[_c_][1]
                scale = list1[_c_][2]
                w = list1[_c_][3]
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
                for (xx = bx; xx <= bx + scale * w - 1; xx++)
                {
                    for (yy = by; yy <= by + scale - 1; yy++)
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
        ;[h,e] = hed(20,6)
        e.state.loadLines(['a','b','c','d','e','f','# h1'])
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],3)
    })
    await section("a scaled line needs a larger horizontal offset", async function ()
    {
        ;[h,e] = hed(20,8)
        e.state.loadLines(['# a long heading line'])
        e.state.setMainCursor(20,0)
        compare(e.state.s.view[0],44)
    })
    await section("a short file with a tall line can scroll to its last line", async function ()
    {
        ;[h,e] = hed(20,6)
        e.state.loadLines(['# h1','a','b','c','d'])
        compare(e.state.maxViewLine(),1)
        e.state.scrollView('down',3)
        compare(e.state.s.view[1],1)
    })
    await section("the last line stays reachable at the end of a tall file", async function ()
    {
        ;[h,e] = hed(20,6)
        e.state.loadLines(['# h1','a','b','c','d','e','f'])
        compare(e.state.maxViewLine(),1)
        e.state.setMainCursor(0,6)
        compare(e.state.s.view[1],1)
    })
    await section("the gutter numbers a scaled line only on its first row", async function ()
    {
        ;[h,e] = hed(30,10,'md',['gutter'])
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
        ;[h,e] = hed({cols:40,rows:10})
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
        ;[h,e] = hed({cols:40,rows:10})
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
        ;[h,e] = hed({cols:40,rows:10})
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
        ;[h,e] = hed({cols:40,rows:20})
        m = mapScr(e,12,20)
        m.show()
        pixels(h)
        e.state.loadLines((function () { var r_d_ = []; for (i = 0; i < 1000; i++)  { r_d_.push((`old ${i}`))  } return r_d_ }).bind(this)())
        m.reload()
        h.screen.t.out = []
        m.suspend()
        e.state.loadSegls(kseg.segls((function () { var r_e_ = []; for (i = 0; i < 2000; i++)  { r_e_.push((`new ${i}`))  } return r_e_ }).bind(this)()))
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
        ;[h,e] = hed({cols:40,rows:10})
        e.state.loadLines((function () { var r_f_ = []; for (i = 0; i < 2000; i++)  { r_f_.push((`line ${i}`))  } return r_f_ }).bind(this)())
        m = mapImages(h,e)
        m.show()
        e.state.setView([0,0])
        m.calcView()
        m.drawImages()
        compare((m.imageCache.size < 60),true)
    })
    await section("inserting and undoing a line does not blank or re-upload the map", async function ()
    {
        ;[h,e] = hed({cols:40,rows:10})
        e.state.loadLines((function () { var r_10_ = []; for (i = 0; i < 20; i++)  { r_10_.push((`line ${i}`))  } return r_10_ }).bind(this)())
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed({cols:40,rows:10})
        e.state.loadLines(['#'])
        e.state.applyScales({enable:true,md:{h1:7}})
        m = mapScr(e)
        m.csz = [10,20]
        bg = m.color.bg
        data = Buffer.alloc((m.cells.cols * m.csz[0] * m.imageHeight(0) * 3))
        m.imageForLine(data,e.state.s.lines[0],0)
        ink = false
        for (y = 0; y < m.imageHeight(0); y++)
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
        ;[h,e] = hed({cols:40,rows:10})
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
        ;[h,e] = hed({cols:40,rows:10})
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
        ;[h,e] = hed({cols:40,rows:10})
        e.state.loadLines((function () { var r_11_ = []; for (i = 0; i < 100; i++)  { r_11_.push((`line ${i}`))  } return r_11_ }).bind(this)())
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
        ;[h,e] = hed({cols:40,rows:10})
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(40,10)
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
        ;[h,e] = hed(20,8)
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
        ;[h,e] = hed(20,8)
        e.state.loadLines(['# abc','a','b','c','d','e','f','g','h','i','j'])
        e.state.setScrollTop(1)
        e.layout(0,0,20,8)
        compare(e.state.viewTopRow(),1)
        compare(e.state.s.scrollOffset,1)
    })
    await section("moving the cursor into view clears the scroll offset", async function ()
    {
        ;[h,e] = hed(20,8)
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
        ;[h,e] = hed(20,20)
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
        ;[h,e] = hed(20,10)
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
        ;[h,e] = hed({cols:40,rows:10})
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
        ;[scr,e] = runEd(['aaa','bbb','xx BIG yy'],{},function (e)
        {
            return runScale(e,[[3,2,6,2]])
        })
        compare(scr.get_char(3,0).includes(']66;s=3'),true)
        compare(scr.get_char(4,0),null)
        compare(scr.get_char(9,0).includes(']66;s=3'),true)
        compare(scr.get_char(3,2),"\x1b[3C")
        compare(scr.get_char(12,2),' ')
    })
    await section("a run does not shift the syntax after it", async function ()
    {
        ;[scr,e] = runEd(["x = 'hi' # note"],({cols:60,rows:10}),function (e)
        {
            e.state.syntax.setExt('kode')
            return e.state.setMainCursor(0,8)
        })
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
        ;[scr,e] = runEd(['aa FOO bb'],({feats:['susan']}),function (e)
        {
            e.state.setMainCursor(0,8)
            runScale(e,[[3,0,6,0]],1)
            return e.state.setSue(7,0,[31,2,1,'#ff0000'])
        })
        compare(scr.get_fg(9,0),[255,255,255])
        compare(scr.get_fg(10,0),[255,0,0])
        compare(scr.get_fg(11,0),[255,0,0])
    })
    await section("a cursor in a run grows with it, at both ends", async function ()
    {
        ;[scr,e] = runEd(['aaa','bbb','xx BIG yy'],{},function (e)
        {
            return runScale(e,[[3,2,6,2]])
        })
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
        ;[scr,e] = runEd(['aaa','bbb','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,2,6,2]])
            e.state.setMainCursor(3,2)
            return e.state.insert('X')
        })
        compare(scr.get_char(3,0).includes(']66;s=3'),true)
        compare(scr.get_char(6,0).includes(']66;s=3'),true)
    })
    await section("cursors past the end of a line are drawn there", async function ()
    {
        ;[scr,e] = runEd(['abcdef','ab','abcd'],({rows:8,textSizing:false}),function (e)
        {
            return e.state.setCursors([[5,0],[5,1],[5,2]],{main:0})
        })
        compare(scr.c[0][5].mark,'main')
        compare(scr.c[1][5].mark,'multi')
        compare(scr.c[2][5].mark,'multi')
        compare((!_k_.empty(scr.c[1][2].mark)),false)
        compare((!_k_.empty(scr.c[2][4].mark)),false)
    })
    await section("a selection over a run shows on the scaled text", async function ()
    {
        ;[scr,e] = runEd(['aaa','bbb','xx BIG yy'],{},function (e)
        {
            return runScale(e,[[3,2,6,2]],2,false)
        })
        compare(scr.get_bg(3,0),e.color.selection.span)
        compare(scr.get_bg(9,0),e.color.selection.span)
    })
    await section("a selection on a covered line does not paint the block", async function ()
    {
        ;[scr,e] = runEd(['aaaaaaaa','bbb','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,2,6,2]])
            return e.state.setCursors([[0,2]])
        })
        before = blockArea(scr)
        e.state.setSelections([[0,0,8,0]])
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("every cell of a block belongs to the block", async function ()
    {
        ;[scr,e] = runEd(['aaaaaaaa','bbb','xx BIG yy'],{},function (e)
        {
            return runScale(e,[[3,2,6,2]])
        })
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
        ;[scr,e] = runEd(['aa FOO bb'],({feats:['complete']}),function (e)
        {
            return runScale(e,[[3,0,6,0]],1)
        })
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
        ;[scr,e] = runEd(['aaaaaaaa','bbb','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,2,6,2]])
            return e.state.setCursors([[0,2]])
        })
        before = blockArea(scr)
        e.state.setSue(3,0,[32,6,1,'#00ff00'])
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("a highlight on a covered line does not paint the block", async function ()
    {
        ;[scr,e] = runEd(['aaaaaaaa','bbb','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,2,6,2]])
            return e.state.setCursors([[0,2]])
        })
        before = blockArea(scr)
        e.state.setHighlights([[0,0,8,0]])
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("a yank flash on a covered line does not paint the block", async function ()
    {
        ;[scr,e] = runEd(['aaaaaaaa','bbb','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,2,6,2]])
            return e.state.setCursors([[0,2]])
        })
        before = blockArea(scr)
        e.state.novim.yankFlash = [[0,0,8,0]]
        scr.init()
        e.draw()
        compare(blockArea(scr),before)
    })
    await section("a selection reaches the blocks of a scaled line", async function ()
    {
        ;[scr,e] = runEd(['aaaa','bbbb'],{},function (e)
        {
            e.state.setCursors([[0,0]])
            e.state.stepScales(2)
            e.state.setSelections([[0,0,2,0]])
            return e.state.setCursors([[0,1]])
        })
        compare(scr.get_bg(0,0),e.color.selection.span)
        compare(scr.get_bg(1,0),e.color.selection.span)
        compare(scr.get_bg(3,0),e.color.selection.span)
        compare(scr.get_bg(6,0),e.color.bg)
    })
    await section("a selection reaches the blocks of a run", async function ()
    {
        ;[scr,e] = runEd(['a','b','c','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,3,6,3]],2,false)
            return e.state.setCursors([[0,2]])
        })
        compare(scr.get_bg(3,1),e.color.selection.span)
        compare(scr.get_bg(4,1),e.color.selection.span)
        compare(scr.get_bg(6,1),e.color.selection.span)
    })
    await section("a background colour fills the blocks of a scaled line", async function ()
    {
        ;[scr,e] = runEd(['aaaa','bbbb'],({feats:['susan']}),function (e)
        {
            e.state.setCursors([[0,0]])
            e.state.stepScales(2)
            e.state.setSue(0,0,[32,2,1,'#00ff00'])
            return e.state.setCursors([[0,1]])
        })
        compare(scr.get_bg(0,0),[0,255,0])
        compare(scr.get_bg(1,0),[0,255,0])
        compare(scr.get_bg(3,0),[0,255,0])
        compare(scr.get_bg(6,0),e.color.bg)
    })
    await section("a colour reaches the blocks of a scaled line", async function ()
    {
        ;[scr,e] = runEd(['aaaa','bbbb'],({feats:['susan']}),function (e)
        {
            e.state.setCursors([[0,0]])
            e.state.stepScales(2)
            e.state.setSue(0,0,[31,4,1,'#ff0000'])
            return e.state.setCursors([[0,1]])
        })
        compare(scr.get_fg(0,0),[255,0,0])
        compare(scr.get_fg(3,0),[255,0,0])
        compare(scr.get_fg(6,0),[255,0,0])
        compare(scr.get_fg(9,0),[255,0,0])
    })
    await section("a colour reaches the blocks of a run", async function ()
    {
        ;[scr,e] = runEd(['a','b','c','xx BIG yy'],({feats:['susan']}),function (e)
        {
            runScale(e,[[3,3,6,3]])
            e.state.setCursors([[0,2]])
            return e.state.setSue(3,3,[32,3,1,'#00ff00'])
        })
        compare(scr.get_bg(3,1),[0,255,0])
        compare(scr.get_bg(4,1),[0,255,0])
        compare(scr.get_bg(6,1),[0,255,0])
        compare(scr.get_bg(7,1),[0,255,0])
        compare(scr.get_bg(9,1),[0,255,0])
    })
    await section("a yank flash reaches the blocks of a scaled line", async function ()
    {
        ;[scr,e] = runEd(['aaaa','bbbb'],{},function (e)
        {
            e.state.setCursors([[0,0]])
            e.state.stepScales(2)
            e.state.setCursors([[0,1]])
            return e.state.novim.yankFlash = [[0,0,4,0]]
        })
        compare(scr.get_bg(0,0),e.color.yank)
        compare(scr.get_bg(3,0),e.color.yank)
        compare(scr.get_bg(6,0),e.color.yank)
    })
    await section("a yank flash reaches the blocks of a run", async function ()
    {
        ;[scr,e] = runEd(['a','b','c','xx BIG yy'],{},function (e)
        {
            runScale(e,[[3,3,6,3]])
            e.state.setCursors([[0,2]])
            return e.state.novim.yankFlash = [[3,3,6,3]]
        })
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
        ;[h,e] = hed({cols:40,rows:10})
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
//# sourceURL=../../../kode/ked/test/scale.kode
