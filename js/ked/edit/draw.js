var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var draw

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let kstr = kxk.kstr

import prof from "../util/prof.js"

import rounded from "../util/img/rounded.js"

import color from "../theme/color.js"
import theme from "../theme/theme.js"

import view from "../view/base/view.js"

import belt from "./tool/belt.js"
import colorspans from "./tool/colorspans.js"
import sue from "./tool/sue.js"

import mode from "./mode.js"


draw = (function ()
{
    _k_.extend(draw, view)
    function draw (screen, name, features)
    {
        this.screen = screen
        this.name = name
    
        this["isCursorInAnyRect"] = this["isCursorInAnyRect"].bind(this)
        this["showCursorsOutsideRects"] = this["showCursorsOutsideRects"].bind(this)
        this["cellsForLine"] = this["cellsForLine"].bind(this)
        this["runsForLine"] = this["runsForLine"].bind(this)
        this["draw"] = this["draw"].bind(this)
        draw.__super__.constructor.call(this,this.screen,this.name,features)
        this.setColor('bg',theme.editor.bg)
        this.setColor('empty',theme.editor.empty)
        this.setColor('cursor',theme.cursor)
        this.setColor('selection',theme.selection)
        this.setColor('highlight',theme.highlight)
        this.setColor('yank',theme.novim.yank)
    }

    draw.prototype["draw"] = function ()
    {
        var blankRows, lines, r, row, scale, view, y, _32_58_, _55_14_, _61_17_, _63_17_, _65_15_, _66_15_, _67_15_

        if (this.hidden())
        {
            return
        }
        view = this.state.s.view
        lines = this.state.s.lines
        if ((this.complete != null))
        {
            lines = this.complete.preDrawLines(lines)
        }
        y = view[1]
        row = -this.state.s.scrollOffset
        while (y < lines.length && row < this.cells.rows)
        {
            scale = this.state.lineHeight(y)
            if (row < 0)
            {
                blankRows = _k_.min(this.cells.rows,(row + scale))
                for (r = 0; r < blankRows; r++)
                {
                    this.cells.bg_fill(0,r,-1,r,this.color.empty)
                }
            }
            if (row >= 0)
            {
                if (row + scale > this.cells.rows)
                {
                    break
                }
                this.drawLine(lines[y],y,row,scale)
            }
            row += scale
            y += 1
        }
        this.drawTrailingRows(row)
        ;(this.susan != null ? this.susan.draw() : undefined)
        this.drawHighlights()
        this.drawSelections()
        this.drawYank()
        ;(this.complete != null ? this.complete.drawCompletion() : undefined)
        this.drawCursors()
        ;(this.complete != null ? this.complete.drawPopup() : undefined)
        ;(this.gutter != null ? this.gutter.draw() : undefined)
        ;(this.mapscr != null ? this.mapscr.draw() : undefined)
        ;(this.scroll != null ? this.scroll.draw() : undefined)
        mode.postDraw(this.state)
        return draw.__super__.draw.call(this)
    }

    draw.prototype["runsForLine"] = function (y)
    {
        if (!this.cells.screen.t.textSizing)
        {
            return []
        }
        if (this.state.lineHeight(y) !== 1)
        {
            return []
        }
        return this.state.scaleRunsForLine(y)
    }

    draw.prototype["selectionBackgroundFor"] = function (x, y)
    {
        var bg, rng

        if (_k_.empty(this.state.s.selections))
        {
            return
        }
        var list = _k_.list(this.state.s.selections)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (y < rng[1] || y > rng[3])
            {
                continue
            }
            if (y === rng[1] && x < rng[0])
            {
                continue
            }
            if (y === rng[3] && x >= rng[2])
            {
                continue
            }
            bg = this.color.selection.line
            if (belt.isSpanLineRange(this.state.s.lines,rng))
            {
                bg = this.color.selection.span
            }
            if (!this.cells.screen.t.hasFocus)
            {
                bg = color.darken(bg)
            }
            return color.values(bg)
        }
    }

    draw.prototype["cellsForLine"] = function (y)
    {
        var lines, runs

        lines = this.state.s.lines
        runs = this.runsForLine(y)
        return sue.cellPositionsForLine(lines,y,runs)
    }

    draw.prototype["drawLine"] = function (line, y, row, scale = 1, classes = null)
    {
        var bg, bgSpans, ch, checkColor, ci, clss, cw, fg, fgSpans, gi, headerClass, linel, px, ri, rs, run, runs, selbg, si, span, stop, sw, syntax, top, view, x1, x2, _128_26_, _129_68_, _131_68_

        row = (row != null ? row : this.state.rowOfLine(y))
        scale = (scale != null ? scale : this.state.lineHeight(y))
        bg = this.color.bg
        checkColor = false
        headerClass = null
        syntax = this.state.syntax
        view = this.state.s.view
        fgSpans = []
        bgSpans = []
        if ((this.state.s.colors != null))
        {
            var list = _k_.list(colorspans.spansForLine((((_129_68_=this.state.s.colors.fg) != null ? _129_68_ : [])),y))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                span = list[_a_]
                fgSpans.push([span[0],span[1],color.values(span[2])])
            }
            var list1 = _k_.list(colorspans.spansForLine((((_131_68_=this.state.s.colors.bg) != null ? _131_68_ : [])),y))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                bgSpans.push([span[0],span[1],color.values(span[2])])
            }
        }
        classes = (classes != null ? classes : syntax.getClasses(y))
        runs = []
        if (scale === 1 && this.cells.screen.t.textSizing)
        {
            runs = this.state.scaleRunsForLine(y)
        }
        linel = kseg.width(line) * scale - view[0]
        var list2 = _k_.list(runs)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            run = list2[_c_]
            x2 = _k_.min(run[1],line.length)
            linel += kseg.width(line.slice(run[0], typeof x2 === 'number' ? x2 : -1)) * (run[2] - 1)
        }
        si = 0
        sw = 0
        ri = 0
        while (si < line.length)
        {
            if (ri < runs.length && si >= runs[ri][0])
            {
                ;[x1,x2,rs] = runs[ri]
                ri += 1
                top = row - (rs - 1)
                stop = _k_.min(x2,line.length)
                for (gi = si; gi < stop; gi++)
                {
                    cw = kseg.segWidth(line[gi])
                    cw = _k_.max(1,cw)
                    px = sw - view[0]
                    if (top >= 0 && px >= 0 && px < this.cells.cols)
                    {
                        clss = classes[gi]
                        clss = (clss != null ? clss : 'text')
                        fg = syntax.getColor(gi,y,clss)
                        var list3 = _k_.list(fgSpans)
                        for (var _d_ = 0; _d_ < list3.length; _d_++)
                        {
                            span = list3[_d_]
                            if ((span[0] <= gi && gi < span[1]))
                            {
                                fg = span[2]
                                break
                            }
                        }
                        ch = syntax.getChar(gi,y,line[gi],clss)
                        selbg = this.selectionBackgroundFor(gi,y)
                        this.cells.add_scaled(px,top,ch,fg,((selbg != null ? selbg : bg)),rs,y)
                    }
                    sw += cw * rs
                }
                si = stop
                continue
            }
            cw = kseg.segWidth(line[si])
            cw = _k_.max(1,cw)
            px = sw * scale - view[0]
            if (px >= this.cells.cols)
            {
                break
            }
            if (px >= 0 && px + cw * scale <= this.cells.cols)
            {
                ci = si
                clss = classes[ci]
                clss = (clss != null ? clss : 'text')
                fg = syntax.getColor(ci,y,clss)
                var list4 = _k_.list(fgSpans)
                for (var _e_ = 0; _e_ < list4.length; _e_++)
                {
                    span = list4[_e_]
                    if ((span[0] <= ci && ci < span[1]))
                    {
                        fg = span[2]
                        break
                    }
                }
                ch = syntax.getChar(ci,y,line[si],clss)
                if (ch === "#")
                {
                    checkColor = true
                }
                else if (_k_.in(ch,'0█'))
                {
                    if (clss.endsWith('header'))
                    {
                        headerClass = clss
                    }
                }
                this.cells.add_scaled(px,row,ch,fg,bg,scale,y)
                if (clss === 'invert_bg')
                {
                    bg = this.color.bg
                }
            }
            sw += cw
            si += 1
        }
        this.drawRowBackground(y,row,linel,scale)
        if (checkColor)
        {
            this.drawColorPills(line,row,linel,scale)
        }
        if (headerClass)
        {
            this.drawAsciiHeader(line,row,headerClass,y,scale)
        }
        return this.drawColorBackgrounds(y,row,bgSpans,scale)
    }

    draw.prototype["drawColorBackgrounds"] = function (y, row, spans, scale = 1)
    {
        var cells, lastIndex, r, span, view, x1, x2

        view = this.state.s.view
        cells = this.cellsForLine(y)
        lastIndex = cells.length - 1
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            x1 = _k_.max(0,(cells[_k_.min(span[0],lastIndex)] * scale - view[0]))
            x2 = _k_.min(this.cells.cols,(cells[_k_.min(span[1],lastIndex)] * scale - view[0]))
            if (x1 >= x2)
            {
                continue
            }
            for (r = row; r < row + scale; r++)
            {
                this.cells.bg_rect(x1,r,(x2 - 1),r,span[2])
            }
        }
    }

    draw.prototype["drawRowBackground"] = function (y, row, linel, scale = 1)
    {
        var r

        for (r = row; r < _k_.min(this.cells.rows,row + scale); r++)
        {
            if (linel > 0)
            {
                this.cells.bg_rect(0,r,linel,r,this.color.bg)
            }
            this.cells.bg_fill(_k_.max(0,linel),r,-1,r,this.color.empty)
        }
    }

    draw.prototype["drawTrailingRows"] = function (row = 0)
    {
        var r

        for (r = row; r < this.cells.rows; r++)
        {
            this.cells.bg_fill(0,r,-1,r,this.color.empty)
        }
    }

    draw.prototype["drawHighlights"] = function ()
    {
        var bg, bgc, cells, cx, highlight, hlc, i, lastIndex, li, r, row, scale, ul, ulc, vx, vy, x, xe, xs, _278_44_

        bg = this.color.highlight.bg
        ul = this.color.highlight.ul
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        ;[vx,vy] = this.state.s.view
        var list = _k_.list(this.state.s.highlights)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            highlight = list[_a_]
            li = highlight[1]
            row = this.state.rowOfLine(li)
            scale = this.state.lineHeight(li)
            if (row >= this.cells.rows)
            {
                break
            }
            if (row < 0)
            {
                continue
            }
            if (row + scale > this.cells.rows)
            {
                continue
            }
            xs = _k_.max(highlight[0],parseInt(vx / scale))
            xe = _k_.min(highlight[2],(parseInt((vx + this.cells.cols - 1) / scale) + 1))
            xe = _k_.min(xe,(((_278_44_=this.state.s.lines[li]) != null ? _278_44_ : [])).length)
            if (xs >= xe)
            {
                continue
            }
            cells = this.cellsForLine(li)
            lastIndex = cells.length - 1
            for (x = xs; x < xe; x++)
            {
                cx = cells[_k_.min(x,lastIndex)] * scale - vx
                if (cx < 0)
                {
                    continue
                }
                if (cx + scale > this.cells.cols)
                {
                    continue
                }
                hlc = this.cells.get_char(cx,row)
                if (this.cells.isScaled(cx,row))
                {
                    continue
                }
                switch (hlc)
                {
                    case '{':
                    case '[':
                    case '(':
                    case ')':
                    case ']':
                    case '}':
                        ulc = this.color.highlight.bracket_ul
                        bgc = this.color.highlight.bracket
                        break
                    case "'":
                    case '"':
                        ulc = this.color.highlight.string_ul
                        bgc = this.color.highlight.string
                        break
                    default:
                        ulc = ul
                        bgc = bg
                }

                for (r = row; r < _k_.min(this.cells.rows,row + scale); r++)
                {
                    for (i = 0; i < scale; i++)
                    {
                        this.cells.set_bg(cx + i,r,bgc)
                    }
                }
                this.cells.set_char(cx,row,color.ul_rgb(ulc) + '\x1b[4:1m' + hlc + '\x1b[4:0m')
                this.cells.set_mark(cx,row,'highlight')
                this.cells.adjustContrastForHighlight(cx,row,bgc)
            }
        }
    }

    draw.prototype["drawSelections"] = function ()
    {
        var bg, block, cells, cx, i, lastIndex, li, linebg, r, row, scale, selection, spanbg, start, vx, x, xe, xs, _350_45_

        spanbg = this.color.selection.span
        linebg = this.color.selection.line
        if (!this.cells.screen.t.hasFocus)
        {
            spanbg = color.darken(spanbg)
            linebg = color.darken(linebg)
        }
        var list = _k_.list(this.state.s.selections)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            selection = list[_a_]
            bg = (belt.isSpanLineRange(this.state.s.lines,selection) ? spanbg : linebg)
            start = _k_.max(selection[1],this.state.s.view[1])
            row = this.state.rowOfLine(start)
            if (start > selection[3])
            {
                continue
            }
            for (li = start; li <= selection[3]; li++)
            {
                scale = this.state.lineHeight(li)
                vx = this.state.s.view[0]
                if (row < 0)
                {
                    row += scale
                    continue
                }
                if (row >= this.cells.rows)
                {
                    break
                }
                if (row + scale > this.cells.rows)
                {
                    break
                }
                if (li === selection[1])
                {
                    xs = selection[0]
                }
                else
                {
                    xs = 0
                }
                if (li === selection[3])
                {
                    xe = selection[2]
                }
                else
                {
                    xe = (((_350_45_=this.state.s.lines[li]) != null ? _350_45_ : [])).length
                }
                xs = _k_.max(xs,parseInt(vx / scale))
                xe = _k_.min(xe,(parseInt((vx + this.cells.cols - 1) / scale) + 1))
                if (xs >= xe)
                {
                    row += scale
                    continue
                }
                cells = this.cellsForLine(li)
                lastIndex = cells.length - 1
                for (x = xs; x < xe; x++)
                {
                    cx = cells[_k_.min(x,lastIndex)] * scale - vx
                    if (cx < 0)
                    {
                        continue
                    }
                    if (cx + scale > this.cells.cols)
                    {
                        continue
                    }
                    block = this.cells.blockAt(cx,row)
                    if ((block != null))
                    {
                        if (block[4] !== li)
                        {
                            continue
                        }
                        this.cells.bg_block(block,bg)
                        this.cells.adjustContrastForHighlight(block[0],block[1],bg)
                        this.cells.set_mark(block[0],block[1],'selection')
                        continue
                    }
                    for (r = row; r < _k_.min(this.cells.rows,row + scale); r++)
                    {
                        for (i = 0; i < scale; i++)
                        {
                            this.cells.set_bg(cx + i,r,bg)
                            this.cells.adjustContrastForHighlight(cx + i,r,bg)
                        }
                    }
                    this.cells.set_mark(cx,row,'selection')
                }
                row += scale
            }
        }
    }

    draw.prototype["drawYank"] = function ()
    {
        var bg, block, cells, cx, i, lastIndex, li, r, rng, row, scale, start, vx, vy, x, xe, xs, _420_45_

        if (_k_.empty(this.state.novim.yankFlash))
        {
            return
        }
        bg = this.color.yank
        ;[vx,vy] = this.state.s.view
        var list = _k_.list(this.state.novim.yankFlash)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            start = _k_.max(rng[1],vy)
            row = this.state.rowOfLine(start)
            if (start > rng[3])
            {
                continue
            }
            for (li = start; li <= rng[3]; li++)
            {
                scale = this.state.lineHeight(li)
                if (row < 0)
                {
                    row += scale
                    continue
                }
                if (row >= this.cells.rows)
                {
                    break
                }
                if (row + scale > this.cells.rows)
                {
                    break
                }
                if (li === rng[1])
                {
                    xs = rng[0]
                }
                else
                {
                    xs = 0
                }
                if (li === rng[3])
                {
                    xe = rng[2]
                }
                else
                {
                    xe = (((_420_45_=this.state.s.lines[li]) != null ? _420_45_ : [])).length
                }
                xs = _k_.max(xs,parseInt(vx / scale))
                xe = _k_.min(xe,(parseInt((vx + this.cells.cols - 1) / scale) + 1))
                if (xs >= xe)
                {
                    row += scale
                    continue
                }
                cells = this.cellsForLine(li)
                lastIndex = cells.length - 1
                for (x = xs; x < xe; x++)
                {
                    cx = cells[_k_.min(x,lastIndex)] * scale - vx
                    if (cx < 0)
                    {
                        continue
                    }
                    if (cx + scale > this.cells.cols)
                    {
                        continue
                    }
                    block = this.cells.blockAt(cx,row)
                    if ((block != null))
                    {
                        if (block[4] !== li)
                        {
                            continue
                        }
                        this.cells.bg_block(block,bg)
                        this.cells.adjustContrastForHighlight(block[0],block[1],bg)
                        continue
                    }
                    for (r = row; r < _k_.min(this.cells.rows,row + scale); r++)
                    {
                        for (i = 0; i < scale; i++)
                        {
                            this.cells.set_bg(cx + i,r,bg)
                            this.cells.adjustContrastForHighlight(cx + i,r,bg)
                        }
                    }
                }
                row += scale
            }
        }
    }

    draw.prototype["cursorRunScale"] = function (pos)
    {
        var run, x, y

        ;[x,y] = pos
        var list = _k_.list(this.runsForLine(y))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            run = list[_a_]
            if (run[0] <= x && x <= run[1])
            {
                return run[2]
            }
        }
        return 1
    }

    draw.prototype["cursorRowAndScale"] = function (pos)
    {
        var linescale, runscale

        linescale = this.state.lineHeight(pos[1])
        runscale = this.cursorRunScale(pos)
        if (runscale > 1 && linescale === 1)
        {
            return [this.state.rowOfLine(pos[1]) - (runscale - 1),runscale]
        }
        else
        {
            return [this.state.rowOfLine(pos[1]),linescale]
        }
    }

    draw.prototype["cursorCellX"] = function (x, y)
    {
        var cells, lastIndex, scale

        cells = this.cellsForLine(y)
        scale = this.state.lineHeight(y)
        lastIndex = cells.length - 1
        if (x <= lastIndex)
        {
            return (cells[x] * scale)
        }
        return (cells[lastIndex] + (x - lastIndex)) * scale
    }

    draw.prototype["drawCursors"] = function ()
    {
        var bg, cursor, cx, fg, idx, mainCursor, row, s, scale, x, y

        s = this.state.s
        mainCursor = this.state.mainCursor()
        this.cells.screen.t.hideStaleImgs(666)
        fg = this.color.cursor.fg
        bg = mode.themeColor(this.state,'cursor.multi',this.color.cursor.multi)
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        this.cursorIds = {}
        var list = _k_.list(s.cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            cursor = list[idx]
            if (_k_.eql(cursor, mainCursor))
            {
                continue
            }
            if (this.isCursorVisible(cursor))
            {
                ;[row,scale] = this.cursorRowAndScale(cursor)
                cx = this.cursorCellX(cursor[0],cursor[1]) - s.view[0]
                this.cursorIds[idx] = this.cells.draw_rounded_multi_cursor(cx,row,bg,scale)
            }
        }
        if (this.isCursorVisible(mainCursor))
        {
            fg = this.color.cursor.fg
            bg = mode.themeColor(this.state,'cursor.main',this.color.cursor.main)
            if (!this.hasFocus())
            {
                bg = color.darken(bg)
            }
            ;[y,scale] = this.cursorRowAndScale(mainCursor)
            x = this.cursorCellX(mainCursor[0],mainCursor[1]) - s.view[0]
            if (s.cursors.length <= 1)
            {
                if (this.isCursorInEmpty())
                {
                    bg = color.darken(bg,0.5)
                }
                else if (' ' === this.cells.get_char(x,y))
                {
                    bg = color.darken(bg,0.8)
                }
            }
            if (!this.cells.screen.t.hasFocus)
            {
                bg = color.darken(bg)
            }
            return this.cursorIds[s.main] = this.cells.draw_rounded_cursor(x,y,bg,scale)
        }
    }

    draw.prototype["showCursorsOutsideRects"] = function (rects)
    {
        var cursor, idx, imgId

        rects = rects.map((function (rect)
        {
            return this.cells.rectForScreen(rect)
        }).bind(this))
        var list = _k_.list(this.state.s.cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            cursor = list[idx]
            if (imgId = this.cursorIds[idx])
            {
                if (this.isCursorVisible(cursor) && !this.isCursorInAnyRect(cursor,rects))
                {
                    global.ked_ttio.showImg(imgId[0],imgId[1])
                }
            }
        }
    }

    draw.prototype["isCursorInAnyRect"] = function (cursor, rects)
    {
        var rect

        var list = _k_.list(rects)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rect = list[_a_]
            if (this.isCursorInRect(cursor,rect))
            {
                return true
            }
        }
        return false
    }

    draw.prototype["drawColorPills"] = function (line, row, linel, scale = 1)
    {
        var cx, dta, idx, rng, rngs

        if (rngs = kstr.colorRanges(kseg.str(line)))
        {
            cx = _k_.max(0,linel) + 1
            var list = _k_.list(rngs)
            for (idx = 0; idx < list.length; idx++)
            {
                rng = list[idx]
                dta = 4
                if (idx === 0)
                {
                    this.cells.set(cx,row,'',rng.color,this.color.empty)
                    cx += 1
                    dta--
                }
                if (idx === rngs.length - 1)
                {
                    dta--
                }
                this.cells.bg_rect(cx,row,cx + dta,row,rng.color)
                cx += dta
                if (idx === rngs.length - 1)
                {
                    this.cells.set(cx,row,'',rng.color,this.color.empty)
                }
            }
        }
    }

    draw.prototype["drawAsciiHeader"] = function (line, row, clss, y = null, scale = 1)
    {
        var bgSpans, chunk, chunks, custom, fgSpans, ix0, ix1, x, _581_26_, _582_66_, _583_66_

        y = (y != null ? y : row + this.state.s.view[1])
        fgSpans = []
        bgSpans = []
        if ((this.state.s.colors != null))
        {
            fgSpans = colorspans.spansForLine((((_582_66_=this.state.s.colors.fg) != null ? _582_66_ : [])),y)
            bgSpans = colorspans.spansForLine((((_583_66_=this.state.s.colors.bg) != null ? _583_66_ : [])),y)
        }
        custom = function (x)
        {
            var span

            var list = _k_.list(fgSpans)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                span = list[_a_]
                if ((span[0] <= x && x < span[1]))
                {
                    return true
                }
            }
            var list1 = _k_.list(bgSpans)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                if ((span[0] <= x && x < span[1]))
                {
                    return true
                }
            }
            return false
        }
        chunks = kseg.chunks(line)
        var list = _k_.list(chunks)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            chunk = list[_c_]
            if (!(_k_.in(chunk.segl[0],'0█')))
            {
                continue
            }
            ix0 = chunk.index
            if (!custom(ix0))
            {
                x = ix0 * scale - this.state.s.view[0]
                this.cells.set(x,row,'▎',theme.syntax[clss + ' highlight'],theme.syntax[clss])
            }
            if (chunk.segl.length <= 1)
            {
                continue
            }
            ix1 = chunk.index + chunk.segl.length - 1
            if (!custom(ix1))
            {
                x = ix1 * scale - this.state.s.view[0]
                this.cells.set(x,row,'▋',theme.syntax[clss],theme.syntax[clss + ' shadow'])
            }
        }
    }

    return draw
})()

export default draw;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhdy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9kcmF3LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQVM7SUFBSzs7T0FDTCxXQUFaOztPQUNZLGNBQUE7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWI7T0FBa0IsaUJBQWxCO09BQTZCLFVBQTdCOztPQUNhLFdBQUE7OztBQUNsQixRQUFEOztxQkFBTTthQUVGLE1BQUksUUFBUSxNQUFLOztRQUFkO1FBQVE7Ozs7Ozs7NkNBRUQsS0FBQyxPQUFPLEtBQUMsS0FBSztRQUVwQixLQUFDLFNBQVMsS0FBWSxNQUFNLE9BQU87UUFDbkMsS0FBQyxTQUFTLFFBQVksTUFBTSxPQUFPO1FBRW5DLEtBQUMsU0FBUyxTQUFZLE1BQU07UUFDNUIsS0FBQyxTQUFTLFlBQVksTUFBTTtRQUM1QixLQUFDLFNBQVMsWUFBWSxNQUFNO1FBQzVCLEtBQUMsU0FBUyxPQUFZLE1BQU0sTUFBTTs7O29CQUV0Qzs7OztZQUVTLEtBQUM7Ozs7UUFLTixPQUFTLEtBQUMsTUFBTSxFQUFFO1FBQ2xCLFFBQVMsS0FBQyxNQUFNLEVBQUU7YUFDdUIsS0FBQzs7WUFBMUMsUUFBUyxLQUFDLFNBQVMsYUFBYTs7UUFFaEMsSUFBTSxLQUFLO1FBQ1gsT0FBTyxLQUFDLE1BQU0sRUFBRTtlQUVWLElBQUksTUFBTSxVQUFXLE1BQU0sS0FBQyxNQUFNOztZQUVwQyxRQUFRLEtBQUMsTUFBTSxXQUFXO2dCQUV2QixNQUFNOztnQkFDTCxvQkFBZ0IsS0FBQyxNQUFNLE1BQU0sTUFBSTtxQkFDN0IsSUFBSyxPQUFJOztvQkFDVCxLQUFDLE1BQU0sUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUMsTUFBTTs7O2dCQUVwQyxPQUFPOztvQkFDRyxNQUFNLFFBQVEsS0FBQyxNQUFNOztvQkFBOUI7O2dCQUNBLEtBQUMsU0FBUyxNQUFNLEdBQUcsRUFBRSxJQUFJOztZQUU3QixPQUFP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
//# sourceURL=../../../kode/ked/edit/draw.kode
