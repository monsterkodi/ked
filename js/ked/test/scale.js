var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var bg, bx, by, c, cells, csz, cx, data, e, first, h, hed, i, ink, j, lines, m, out, rect, s, saved, sc, scale, second, small, tstt, w, x, xx, y, yy

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

import scroll from "../view/base/scroll.js"

import squares from "../util/img/squares.js"

cells = {cols:40,rows:20}

tstt = function (ext = 'md')
{
    var s

    s = new state(cells,'test_scale')
    s.syntax.setExt(ext)
    s.applyScales({enabled:true,md:{h1:3,h2:2}})
    return s
}

hed = function (cols, rows, ext = 'md', feats = [])
{
    var e, h

    h = new harness
    e = new editor(h.screen,'test_scale',feats)
    e.layout(0,0,cols,rows)
    e.state.syntax.setExt(ext)
    e.state.applyScales({enabled:true,md:{h1:3,h2:2}})
    return [h,e]
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
        s.applyScales({enabled:true,md:{h1:6,h2:5,h3:4,h4:3,h5:2}})
        compare(s.lineHeight(0),6)
        compare(s.lineHeight(1),5)
        compare(s.lineHeight(2),4)
        compare(s.lineHeight(3),3)
        compare(s.lineHeight(4),2)
        s.applyScales({enabled:false})
        compare(s.lineHeight(0),1)
        compare(s.lineHeight(1),1)
        s.applyScales({})
        compare(s.lineHeight(0),1)
        compare(s.lineHeight(1),1)
        s.applyScales({enabled:true,md:{h1:9}})
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
    await section("a scaled line gets a taller stripe in the map", async function ()
    {
        var _28_ = hed(40,10); h = _28_[0]; e = _28_[1]

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
        var _29_ = hed({cols:40,rows:10}); h = _29_[0]; e = _29_[1]

        e.state.loadLines(['#'])
        e.state.applyScales({enabled:true,md:{h1:7}})
        m = new mapscr(e)
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        bg = m.color.bg
        data = Buffer.alloc((m.cells.cols * m.csz[0] * m.imageHeight(0) * 3))
        m.imageForLine(data,e.state.s.lines[0],0)
        ink = false
        for (var _2a_ = y = 0, _2b_ = m.imageHeight(0); (_2a_ <= _2b_ ? y < m.imageHeight(0) : y > m.imageHeight(0)); (_2a_ <= _2b_ ? ++y : --y))
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
        var _2c_ = hed({cols:40,rows:10}); h = _2c_[0]; e = _2c_[1]

        e.state.loadLines(['a','b','c','d','e','# h1','f','g'])
        m = new mapview(h.screen,e.state)
        m.setSyntaxSegls('md',e.state.s.lines)
        m.setScales({enabled:true,md:{h1:3}})
        m.cells.layout(30,0,12,10)
        m.csz = [10,20]
        compare(m.lineRows(5),3)
        compare(m.lineOffsetPixels(5),20)
        compare(m.lineOffsetPixels(6),32)
        compare(m.lineOffsetPixels(7),36)
        m.setScales({enabled:false,md:{h1:3}})
        compare(m.lineRows(5),1)
        compare(m.lineOffsetPixels(6),24)
    })
    await section("the quicky map draws a scaled line with the font map", async function ()
    {
        var _2d_ = hed({cols:40,rows:10}); h = _2d_[0]; e = _2d_[1]

        e.state.loadLines(['# h1','text'])
        m = new mapview(h.screen,e.state)
        m.setSyntaxSegls('md',e.state.s.lines)
        m.setScales({enabled:true,md:{h1:7}})
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
    await section("clicking a cut line in the map keeps the row offset", async function ()
    {
        var _2e_ = hed(40,10); h = _2e_[0]; e = _2e_[1]

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
        e.state.applyScales({enabled:true,md:{h1:7}})
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
        var _2f_ = hed(40,10); h = _2f_[0]; e = _2f_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enabled:true,md:{h1:7}})
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
        var _30_ = hed(40,10); h = _30_[0]; e = _30_[1]

        lines = []
        for (i = 0; i < 20; i++)
        {
            lines.push('# h1')
        }
        e.state.loadLines(lines)
        e.state.applyScales({enabled:true,md:{h1:7}})
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
        var _31_ = hed(40,10); h = _31_[0]; e = _31_[1]

        e.state.loadLines(['a','b','c','# h1','d'])
        e.state.applyScales({enabled:true,md:{h1:3}})
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
        var _32_ = hed(40,10); h = _32_[0]; e = _32_[1]

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
        var _33_ = hed(40,10); h = _33_[0]; e = _33_[1]

        lines = []
        for (i = 0; i < 110; i++)
        {
            lines.push(((i === 104) ? '# h1' : 'x'))
        }
        e.state.loadLines(lines)
        e.state.applyScales({enabled:true,md:{h1:3}})
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
    await section("the map follows the display rows near the end of a long file", async function ()
    {
        var _34_ = hed(40,10); h = _34_[0]; e = _34_[1]

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
        var _35_ = hed(40,10); h = _35_[0]; e = _35_[1]

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
        var _36_ = hed(40,10); h = _36_[0]; e = _36_[1]

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
        s.applyScales({enabled:true,md:{h1:3,h2:2}})
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
        s.applyScales({enabled:true,md:{h1:3,h2:2}})
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
        var _37_ = hed(20,8); h = _37_[0]; e = _37_[1]

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
        var _38_ = hed(20,8); h = _38_[0]; e = _38_[1]

        e.state.loadLines(['# abc','a','b','c','d','e','f','g','h','i','j'])
        e.state.setScrollTop(1)
        e.layout(0,0,20,8)
        compare(e.state.viewTopRow(),1)
        compare(e.state.s.scrollOffset,1)
    })
    await section("moving the cursor into view clears the scroll offset", async function ()
    {
        var _39_ = hed(20,8); h = _39_[0]; e = _39_[1]

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
        var _3a_ = hed(20,20); h = _3a_[0]; e = _3a_[1]

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
        e.state.applyScales({enabled:true,md:{h1:7}})
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
        var _3b_ = hed(20,10); h = _3b_[0]; e = _3b_[1]

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
}
toExport["scale"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2NhbGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBVSxVQUFBO0lBQVc7O09BQ0EsWUFBZDtPQUFvQixhQUFwQjs7T0FDYyxZQUFkOztPQUNjLGNBQWQ7T0FBc0IsYUFBdEI7O09BQ2MsY0FBUjtPQUFnQixjQUFoQjs7T0FDUSxhQUFUO09BQWdCLGNBQWhCOztPQUNTLGFBQVQ7O09BQ1MsY0FBQTs7QUFFckIsU0FBUSxLQUFLLEdBQUcsS0FBSzs7QUFDckIsaUJBQU8sTUFBSTs7OztJQUNQLFFBQVEsTUFBTSxNQUFNO0lBQ3BCLEVBQUUsT0FBTyxPQUFPO0lBQ2hCLEVBQUUsYUFBYSxRQUFRLEtBQUssSUFBSSxHQUFHLEVBQUUsR0FBRztXQUN4Qzs7O0FBRUosZ0JBQU0sTUFBSyxNQUFLLE1BQUksTUFBSzs7OztJQUNqQixRQUFRO0lBQ1IsUUFBUSxPQUFPLEVBQUUsT0FBTyxhQUFhO0lBQ3JDLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSztJQUNsQixFQUFFLE1BQU0sT0FBTyxPQUFPO0lBQ3RCLEVBQUUsTUFBTSxhQUFhLFFBQVEsS0FBSyxJQUFJLEdBQUcsRUFBRSxHQUFHO1lBQzdDLEVBQUU7Ozs7OztRQU1ILElBQUk7UUFDSixFQUFFLFdBQVcsUUFBUSxTQUFTLFlBQVksWUFBWTtnQkFFdEQsRUFBRSxXQUFXLEdBQUk7Z0JBQ2pCLEVBQUUsV0FBVyxHQUFJO2dCQUNqQixFQUFFLFdBQVcsR0FBSTtnQkFDakIsRUFBRSxXQUFXLEdBQUk7Z0JBQ2pCLEVBQUUsV0FBVyxHQUFJOzs7O1FBSWpCLElBQUksS0FBSztRQUNULEVBQUUsV0FBVyxRQUFRO2dCQUVyQixFQUFFLFdBQVcsR0FBSTtnQkFDakIsRUFBRSxXQUFXLEdBQUk7Ozs7UUFJakIsSUFBSTtRQUNKLEVBQUUsV0FBVyxRQUFRLFNBQVMsWUFBWSxZQUFZO1FBRXRELEVBQUUsYUFBYSxRQUFRLEtBQUssSUFBSSxHQUFH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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/scale.kode
