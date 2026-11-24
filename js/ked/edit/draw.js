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
        var blankRows, height, lines, r, row, view, wrapped, y, _32_58_, _56_14_, _62_17_, _64_17_, _66_15_, _67_15_, _68_15_

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
            height = this.state.lineHeight(y)
            wrapped = this.state.isWrapped(y)
            if (row < 0)
            {
                blankRows = _k_.min(this.cells.rows,(row + height))
                for (r = 0; r < blankRows; r++)
                {
                    this.cells.bg_fill(0,r,-1,r,this.color.empty)
                }
            }
            if (row >= 0 || wrapped)
            {
                if (row + height > this.cells.rows && !wrapped)
                {
                    break
                }
                this.drawLine(lines[y],y,row,this.state.lineScale(y))
            }
            row += height
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
        if (this.state.lineScale(y) !== 1 || this.state.isWrapped(y))
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
        var bg, bgSpans, ch, checkColor, ci, clss, cw, fg, fgSpans, gi, headerClass, k, linel, pr, px, ri, rs, run, runs, selbg, si, span, starts, stop, sw, syntax, top, view, vx, width, widths, wk, wrapped, ws, x1, x2, _129_26_, _130_68_, _132_68_

        row = (row != null ? row : this.state.rowOfLine(y))
        scale = (scale != null ? scale : this.state.lineScale(y))
        bg = this.color.bg
        checkColor = false
        headerClass = null
        syntax = this.state.syntax
        view = this.state.s.view
        fgSpans = []
        bgSpans = []
        if ((this.state.s.colors != null))
        {
            var list = _k_.list(colorspans.spansForLine((((_130_68_=this.state.s.colors.fg) != null ? _130_68_ : [])),y))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                span = list[_a_]
                fgSpans.push([span[0],span[1],color.values(span[2])])
            }
            var list1 = _k_.list(colorspans.spansForLine((((_132_68_=this.state.s.colors.bg) != null ? _132_68_ : [])),y))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                bgSpans.push([span[0],span[1],color.values(span[2])])
            }
        }
        classes = (classes != null ? classes : syntax.getClasses(y))
        wrapped = this.state.isWrapped(y)
        starts = this.state.wrapStarts(y)
        vx = this.state.viewX(y)
        runs = []
        if (scale === 1 && !wrapped && this.cells.screen.t.textSizing)
        {
            runs = this.state.scaleRunsForLine(y)
        }
        linel = kseg.width(line) * scale - vx
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
        wk = 0
        ws = 0
        widths = []
        while (si < line.length)
        {
            if (wk + 1 < starts.length && si === starts[wk + 1])
            {
                widths.push(sw - ws)
                wk += 1
                ws = sw
            }
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
            px = (sw - ws) * scale - vx
            pr = row + wk * scale
            if (px >= this.cells.cols && !wrapped)
            {
                break
            }
            if (px >= 0 && px + cw * scale <= this.cells.cols && this.rowFits(pr,scale))
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
                this.cells.add_scaled(px,pr,ch,fg,bg,scale,y)
                if (clss === 'invert_bg')
                {
                    bg = this.color.bg
                }
            }
            sw += cw
            si += 1
        }
        if (wrapped)
        {
            widths.push(sw - ws)
            var list5 = _k_.list(widths)
            for (k = 0; k < list5.length; k++)
            {
                width = list5[k]
                if (this.rowFits(row + k * scale,scale))
                {
                    this.drawRowBackground(y,row + k * scale,width * scale,scale)
                }
            }
            this.drawColorBackgrounds(y,row,bgSpans,scale)
            return
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
        var cells, cr, cx, lastIndex, r, span, view, x, x1, x2

        view = this.state.s.view
        cells = this.cellsForLine(y)
        lastIndex = cells.length - 1
        if (this.state.isWrapped(y))
        {
            var list = _k_.list(spans)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                span = list[_a_]
                for (x = span[0]; x < _k_.min(span[1],lastIndex); x++)
                {
                    ;[cx,cr] = this.posCell(x,y,cells)
                    if (cx + scale > this.cells.cols || !this.rowFits(cr,scale))
                    {
                        continue
                    }
                    for (r = cr; r < cr + scale; r++)
                    {
                        this.cells.bg_rect(cx,r,cx + scale - 1,r,span[2])
                    }
                }
            }
            return
        }
        var list1 = _k_.list(spans)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
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

    draw.prototype["rowFits"] = function (row, scale)
    {
        return row >= 0 && row + scale <= this.cells.rows
    }

    draw.prototype["lineFits"] = function (li)
    {
        var height, row

        row = this.state.rowOfLine(li)
        height = this.state.lineHeight(li)
        if (this.state.isWrapped(li))
        {
            return row < this.cells.rows && row + height > 0
        }
        return row >= 0 && row + height <= this.cells.rows
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
        var bg, bgc, cells, cr, cx, highlight, hlc, i, lastIndex, li, r, row, scale, ul, ulc, x, xe, xs, _315_87_

        bg = this.color.highlight.bg
        ul = this.color.highlight.ul
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var list = _k_.list(this.state.s.highlights)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            highlight = list[_a_]
            li = highlight[1]
            row = this.state.rowOfLine(li)
            scale = this.state.lineScale(li)
            if (row >= this.cells.rows)
            {
                break
            }
            if (!this.lineFits(li))
            {
                continue
            }
            ;[xs,xe] = this.clipToView(li,highlight[0],_k_.min(highlight[2],(((_315_87_=this.state.s.lines[li]) != null ? _315_87_ : [])).length))
            if (xs >= xe)
            {
                continue
            }
            cells = this.cellsForLine(li)
            lastIndex = cells.length - 1
            for (x = xs; x < xe; x++)
            {
                ;[cx,cr] = this.posCell(_k_.min(x,lastIndex),li,cells)
                if (cx < 0)
                {
                    continue
                }
                if (cx + scale > this.cells.cols)
                {
                    continue
                }
                if (!this.rowFits(cr,scale))
                {
                    continue
                }
                hlc = this.cells.get_char(cx,cr)
                if (this.cells.isScaled(cx,cr))
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

                for (r = cr; r < _k_.min(this.cells.rows,cr + scale); r++)
                {
                    for (i = 0; i < scale; i++)
                    {
                        this.cells.set_bg(cx + i,r,bgc)
                    }
                }
                this.cells.set_char(cx,cr,color.ul_rgb(ulc) + '\x1b[4:1m' + hlc + '\x1b[4:0m')
                this.cells.set_mark(cx,cr,'highlight')
                this.cells.adjustContrastForHighlight(cx,cr,bgc)
            }
        }
    }

    draw.prototype["drawSelections"] = function ()
    {
        var bg, linebg, selection, spanbg

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
            this.drawRange(selection,bg,'selection')
        }
    }

    draw.prototype["drawYank"] = function ()
    {
        var rng

        if (_k_.empty(this.state.novim.yankFlash))
        {
            return
        }
        var list = _k_.list(this.state.novim.yankFlash)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            this.drawRange(rng,this.color.yank)
        }
    }

    draw.prototype["drawRange"] = function (rng, bg, mark)
    {
        var block, cells, cr, cx, i, lastIndex, li, r, scale, start, x, xe, xs, _390_37_

        start = _k_.max(rng[1],this.state.s.view[1])
        if (start > rng[3])
        {
            return
        }
        for (li = start; li <= rng[3]; li++)
        {
            if (this.state.rowOfLine(li) >= this.cells.rows)
            {
                break
            }
            if (!this.lineFits(li))
            {
                continue
            }
            xs = 0
            if (li === rng[1])
            {
                xs = rng[0]
            }
            xe = (((_390_37_=this.state.s.lines[li]) != null ? _390_37_ : [])).length
            if (li === rng[3])
            {
                xe = rng[2]
            }
            ;[xs,xe] = this.clipToView(li,xs,xe)
            if (xs >= xe)
            {
                continue
            }
            scale = this.state.lineScale(li)
            cells = this.cellsForLine(li)
            lastIndex = cells.length - 1
            for (x = xs; x < xe; x++)
            {
                ;[cx,cr] = this.posCell(_k_.min(x,lastIndex),li,cells)
                if (cx < 0)
                {
                    continue
                }
                if (cx + scale > this.cells.cols)
                {
                    continue
                }
                if (!this.rowFits(cr,scale))
                {
                    continue
                }
                block = this.cells.blockAt(cx,cr)
                if ((block != null))
                {
                    if (block[4] !== li)
                    {
                        continue
                    }
                    this.cells.bg_block(block,bg)
                    this.cells.adjustContrastForHighlight(block[0],block[1],bg)
                    if (mark)
                    {
                        this.cells.set_mark(block[0],block[1],mark)
                    }
                    continue
                }
                for (r = cr; r < _k_.min(this.cells.rows,cr + scale); r++)
                {
                    for (i = 0; i < scale; i++)
                    {
                        this.cells.set_bg(cx + i,r,bg)
                        this.cells.adjustContrastForHighlight(cx + i,r,bg)
                    }
                }
                if (mark)
                {
                    this.cells.set_mark(cx,cr,mark)
                }
            }
        }
    }

    draw.prototype["clipToView"] = function (y, xs, xe)
    {
        var scale, vx

        if (this.state.isWrapped(y))
        {
            return [xs,xe]
        }
        vx = this.state.s.view[0]
        scale = this.state.lineScale(y)
        return [_k_.max(xs,parseInt(vx / scale)),_k_.min(xe,parseInt((vx + this.cells.cols - 1) / scale) + 1)]
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
        var linescale, row, runscale

        linescale = this.state.lineScale(pos[1])
        runscale = this.cursorRunScale(pos)
        row = this.posCell(pos[0],pos[1])[1]
        if (runscale > 1 && linescale === 1)
        {
            return [row - (runscale - 1),runscale]
        }
        else
        {
            return [row,linescale]
        }
    }

    draw.prototype["posCell"] = function (x, y, cells)
    {
        var cx, dr

        cells = (cells != null ? cells : this.cellsForLine(y))
        ;[cx,dr] = this.state.lineCell(x,y,cells)
        return [cx - this.state.viewX(y),this.state.rowOfLine(y) + dr]
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
                cx = this.posCell(cursor[0],cursor[1])[0]
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
            x = this.posCell(mainCursor[0],mainCursor[1])[0]
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
        var bgSpans, chunk, chunks, custom, fgSpans, ix0, ix1, x, _563_26_, _564_66_, _565_66_

        y = (y != null ? y : row + this.state.s.view[1])
        fgSpans = []
        bgSpans = []
        if ((this.state.s.colors != null))
        {
            fgSpans = colorspans.spansForLine((((_564_66_=this.state.s.colors.fg) != null ? _564_66_ : [])),y)
            bgSpans = colorspans.spansForLine((((_565_66_=this.state.s.colors.bg) != null ? _565_66_ : [])),y)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhdy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9kcmF3LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQVM7SUFBSzs7T0FDTCxXQUFaOztPQUNZLGNBQUE7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWI7T0FBa0IsaUJBQWxCO09BQTZCLFVBQTdCOztPQUNhLFdBQUE7OztBQUNsQixRQUFEOztxQkFBTTthQUVGLE1BQUksUUFBUSxNQUFLOztRQUFkO1FBQVE7Ozs7Ozs7NkNBRUQsS0FBQyxPQUFPLEtBQUMsS0FBSztRQUVwQixLQUFDLFNBQVMsS0FBWSxNQUFNLE9BQU87UUFDbkMsS0FBQyxTQUFTLFFBQVksTUFBTSxPQUFPO1FBRW5DLEtBQUMsU0FBUyxTQUFZLE1BQU07UUFDNUIsS0FBQyxTQUFTLFlBQVksTUFBTTtRQUM1QixLQUFDLFNBQVMsWUFBWSxNQUFNO1FBQzVCLEtBQUMsU0FBUyxPQUFZLE1BQU0sTUFBTTs7O29CQUV0Qzs7OztZQUVTLEtBQUM7Ozs7UUFLTixPQUFTLEtBQUMsTUFBTSxFQUFFO1FBQ2xCLFFBQVMsS0FBQyxNQUFNLEVBQUU7YUFDdUIsS0FBQzs7WUFBMUMsUUFBUyxLQUFDLFNBQVMsYUFBYTs7UUFFaEMsSUFBTSxLQUFLO1FBQ1gsT0FBTyxLQUFDLE1BQU0sRUFBRTtlQUVWLElBQUksTUFBTSxVQUFXLE1BQU0sS0FBQyxNQUFNOztZQUVwQyxTQUFVLEtBQUMsTUFBTSxXQUFXO1lBQzVCLFVBQVUsS0FBQyxNQUFNLFVBQVU7Z0JBRXhCLE1BQU07O2dCQUNMLG9CQUFnQixLQUFDLE1BQU0sTUFBTSxNQUFJO3FCQUM3QixJQUFLLE9BQUk7O29CQUNULEtBQUMsTUFBTSxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBQyxNQUFNOzs7Z0JBRXBDLE9BQU8sS0FBSzs7b0JBQ0YsTUFBTSxTQUFTLEtBQUMsTUFBTSxTQUFhOztvQkFBNUM7O2dCQUNBLEtBQUMs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
//# sourceURL=../../../kode/ked/edit/draw.kode
