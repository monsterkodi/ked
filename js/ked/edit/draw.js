var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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

import mode from "./mode.js"


draw = (function ()
{
    _k_.extend(draw, view)
    function draw (screen, name, features)
    {
        this["draw"] = this["draw"].bind(this)
        draw.__super__.constructor.call(this,screen,name,features)
        this.setColor('bg',theme.editor.bg)
        this.setColor('empty',theme.editor.empty)
        this.setColor('cursor',theme.cursor)
        this.setColor('selection',theme.selection)
        this.setColor('highlight',theme.highlight)
        this.setColor('yank',theme.novim.yank)
    }

    draw.prototype["draw"] = function ()
    {
        var blankRows, lines, r, row, scale, view, y, _32_58_, _58_17_, _60_17_, _62_15_, _63_15_, _64_15_

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
                for (var _a_ = r = 0, _b_ = blankRows; (_a_ <= _b_ ? r < blankRows : r > blankRows); (_a_ <= _b_ ? ++r : --r))
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

    draw.prototype["drawLine"] = function (line, y, row, scale = 1, classes = null)
    {
        var bg, bgSpans, ch, checkColor, ci, clss, cw, fg, fgSpans, headerClass, linel, px, si, span, sw, syntax, view, _89_26_, _90_68_, _92_68_

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
            var list = _k_.list(colorspans.spansForLine((((_90_68_=this.state.s.colors.fg) != null ? _90_68_ : [])),y))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                span = list[_a_]
                fgSpans.push([span[0],span[1],color.values(span[2])])
            }
            var list1 = _k_.list(colorspans.spansForLine((((_92_68_=this.state.s.colors.bg) != null ? _92_68_ : [])),y))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                bgSpans.push([span[0],span[1],color.values(span[2])])
            }
        }
        classes = (classes != null ? classes : syntax.getClasses(y))
        linel = kseg.width(line) * scale - view[0]
        si = 0
        sw = 0
        while (si < line.length)
        {
            cw = kseg.segWidth(line[si])
            cw = _k_.max(1,cw)
            px = sw * scale - view[0]
            if (px >= this.cells.cols)
            {
                break
            }
            if (px >= 0 && px + cw * scale <= this.cells.cols)
            {
                ci = sw
                clss = classes[ci]
                clss = (clss != null ? clss : 'text')
                fg = syntax.getColor(ci,y,clss)
                var list2 = _k_.list(fgSpans)
                for (var _c_ = 0; _c_ < list2.length; _c_++)
                {
                    span = list2[_c_]
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
                this.cells.add_scaled(px,row,ch,fg,bg,scale)
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
        return this.drawColorBackgrounds(row,bgSpans,scale)
    }

    draw.prototype["drawColorBackgrounds"] = function (row, spans, scale = 1)
    {
        var r, span, view, x1, x2

        view = this.state.s.view
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            x1 = _k_.max(0,(span[0] * scale - view[0]))
            x2 = _k_.min(this.cells.cols,(span[1] * scale - view[0]))
            if (x1 >= x2)
            {
                continue
            }
            for (var _b_ = r = row, _c_ = row + scale; (_b_ <= _c_ ? r < row + scale : r > row + scale); (_b_ <= _c_ ? ++r : --r))
            {
                this.cells.bg_rect(x1,r,(x2 - 1),r,span[2])
            }
        }
    }

    draw.prototype["drawRowBackground"] = function (y, row, linel, scale = 1)
    {
        var r

        for (var _a_ = r = row, _b_ = _k_.min(this.cells.rows,row + scale); (_a_ <= _b_ ? r < _k_.min(this.cells.rows,row + scale) : r > _k_.min(this.cells.rows,row + scale)); (_a_ <= _b_ ? ++r : --r))
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

        for (var _a_ = r = row, _b_ = this.cells.rows; (_a_ <= _b_ ? r < this.cells.rows : r > this.cells.rows); (_a_ <= _b_ ? ++r : --r))
        {
            this.cells.bg_fill(0,r,-1,r,this.color.empty)
        }
    }

    draw.prototype["drawHighlights"] = function ()
    {
        var bg, bgc, cx, highlight, hlc, i, li, r, row, scale, ul, ulc, vx, vy, x, xe, xs

        bg = this.color.highlight.bg
        ul = this.color.highlight.ul
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var _a_ = this.state.s.view; vx = _a_[0]; vy = _a_[1]

        var list = _k_.list(this.state.s.highlights)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            highlight = list[_b_]
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
            if (xs >= xe)
            {
                continue
            }
            for (var _c_ = x = xs, _d_ = xe; (_c_ <= _d_ ? x < xe : x > xe); (_c_ <= _d_ ? ++x : --x))
            {
                cx = x * scale - vx
                if (cx < 0)
                {
                    continue
                }
                if (cx + scale > this.cells.cols)
                {
                    continue
                }
                hlc = this.cells.get_char(cx,row)
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

                for (var _e_ = r = row, _f_ = _k_.min(this.cells.rows,row + scale); (_e_ <= _f_ ? r < _k_.min(this.cells.rows,row + scale) : r > _k_.min(this.cells.rows,row + scale)); (_e_ <= _f_ ? ++r : --r))
                {
                    for (var _10_ = i = 0, _11_ = scale; (_10_ <= _11_ ? i < scale : i > scale); (_10_ <= _11_ ? ++i : --i))
                    {
                        this.cells.set_bg(cx + i,r,bgc)
                    }
                }
                if (this.cells.screen.t.headless)
                {
                    this.cells.set_char(cx,row,hlc)
                }
                else
                {
                    this.cells.set_char(cx,row,color.ul_rgb(ulc) + '\x1b[4:1m' + hlc + '\x1b[4:0m')
                }
                this.cells.set_mark(cx,row,'highlight')
                this.cells.adjustContrastForHighlight(cx,row,bgc)
            }
        }
    }

    draw.prototype["drawSelections"] = function ()
    {
        var bg, cx, i, li, linebg, r, row, scale, selection, spanbg, start, vx, x, xe, xs

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
            for (var _b_ = li = start, _c_ = selection[3]; (_b_ <= _c_ ? li <= selection[3] : li >= selection[3]); (_b_ <= _c_ ? ++li : --li))
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
                    xe = kseg.width(this.state.s.lines[li])
                }
                xs = _k_.max(xs,parseInt(vx / scale))
                xe = _k_.min(xe,(parseInt((vx + this.cells.cols - 1) / scale) + 1))
                if (xs >= xe)
                {
                    row += scale
                    continue
                }
                for (var _d_ = x = xs, _e_ = xe; (_d_ <= _e_ ? x < xe : x > xe); (_d_ <= _e_ ? ++x : --x))
                {
                    cx = x * scale - vx
                    if (cx < 0)
                    {
                        continue
                    }
                    if (cx + scale > this.cells.cols)
                    {
                        continue
                    }
                    for (var _f_ = r = row, _10_ = _k_.min(this.cells.rows,row + scale); (_f_ <= _10_ ? r < _k_.min(this.cells.rows,row + scale) : r > _k_.min(this.cells.rows,row + scale)); (_f_ <= _10_ ? ++r : --r))
                    {
                        for (var _11_ = i = 0, _12_ = scale; (_11_ <= _12_ ? i < scale : i > scale); (_11_ <= _12_ ? ++i : --i))
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
        var bg, cx, i, li, r, rng, row, scale, start, vx, vy, x, xe, xs

        if (_k_.empty(this.state.yankFlash))
        {
            return
        }
        bg = this.color.yank
        var _a_ = this.state.s.view; vx = _a_[0]; vy = _a_[1]

        var list = _k_.list(this.state.yankFlash)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            rng = list[_b_]
            start = _k_.max(rng[1],vy)
            row = this.state.rowOfLine(start)
            if (start > rng[3])
            {
                continue
            }
            for (var _c_ = li = start, _d_ = rng[3]; (_c_ <= _d_ ? li <= rng[3] : li >= rng[3]); (_c_ <= _d_ ? ++li : --li))
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
                    xe = kseg.width(this.state.s.lines[li])
                }
                xs = _k_.max(xs,parseInt(vx / scale))
                xe = _k_.min(xe,(parseInt((vx + this.cells.cols - 1) / scale) + 1))
                if (xs >= xe)
                {
                    row += scale
                    continue
                }
                for (var _e_ = x = xs, _f_ = xe; (_e_ <= _f_ ? x < xe : x > xe); (_e_ <= _f_ ? ++x : --x))
                {
                    cx = x * scale - vx
                    if (cx < 0)
                    {
                        continue
                    }
                    if (cx + scale > this.cells.cols)
                    {
                        continue
                    }
                    for (var _10_ = r = row, _11_ = _k_.min(this.cells.rows,row + scale); (_10_ <= _11_ ? r < _k_.min(this.cells.rows,row + scale) : r > _k_.min(this.cells.rows,row + scale)); (_10_ <= _11_ ? ++r : --r))
                    {
                        for (var _12_ = i = 0, _13_ = scale; (_12_ <= _13_ ? i < scale : i > scale); (_12_ <= _13_ ? ++i : --i))
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

    draw.prototype["drawCursors"] = function ()
    {
        var bg, cursor, cx, fg, mainCursor, s, scale, x, y

        s = this.state.s
        mainCursor = this.state.mainCursor()
        fg = this.color.cursor.fg
        bg = mode.themeColor(this.state,'cursor.multi',this.color.cursor.multi)
        if (!this.cells.screen.t.hasFocus)
        {
            bg = color.darken(bg)
        }
        var list = _k_.list(s.cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cursor = list[_a_]
            if (_k_.eql(cursor, mainCursor))
            {
                continue
            }
            if (this.isCursorVisible(cursor))
            {
                scale = this.state.lineHeight(cursor[1])
                cx = cursor[0] * scale - s.view[0]
                this.cells.draw_rounded_multi_cursor(cx,this.state.rowOfLine(cursor[1]),bg,scale)
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
            scale = this.state.lineHeight(mainCursor[1])
            var _b_ = [mainCursor[0] * scale - s.view[0],this.state.rowOfLine(mainCursor[1])]; x = _b_[0]; y = _b_[1]

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
            return this.cells.draw_rounded_cursor(x,y,bg,scale)
        }
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
        var bgSpans, chunk, chunks, custom, fgSpans, ix0, ix1, x, _406_26_, _407_66_, _408_66_

        y = (y != null ? y : row + this.state.s.view[1])
        fgSpans = []
        bgSpans = []
        if ((this.state.s.colors != null))
        {
            fgSpans = colorspans.spansForLine((((_407_66_=this.state.s.colors.fg) != null ? _407_66_ : [])),y)
            bgSpans = colorspans.spansForLine((((_408_66_=this.state.s.colors.bg) != null ? _408_66_ : [])),y)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhdy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9kcmF3LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQVM7SUFBSzs7T0FDTCxXQUFaOztPQUNZLGNBQUE7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWI7T0FBa0IsaUJBQWxCOztPQUNhLFdBQUE7OztBQUNsQixRQUFEOztxQkFBTTthQUVGLE1BQUcsUUFBTyxNQUFLOzs7NkNBRUwsT0FBTyxLQUFLO1FBRWxCLEtBQUMsU0FBUyxLQUFZLE1BQU0sT0FBTztRQUNuQyxLQUFDLFNBQVMsUUFBWSxNQUFNLE9BQU87UUFFbkMsS0FBQyxTQUFTLFNBQVksTUFBTTtRQUM1QixLQUFDLFNBQVMsWUFBWSxNQUFNO1FBQzVCLEtBQUMsU0FBUyxZQUFZLE1BQU07UUFDNUIsS0FBQyxTQUFTLE9BQVksTUFBTSxNQUFNOzs7b0JBRXRDOzs7O1lBRVUsS0FBQzs7OztRQUtQLE9BQVMsS0FBQyxNQUFNLEVBQUU7UUFDbEIsUUFBUyxLQUFDLE1BQU0sRUFBRTthQUN1QixLQUFDOztZQUExQyxRQUFTLEtBQUMsU0FBUyxhQUFhOztRQUVoQyxJQUFNLEtBQUs7UUFDWCxPQUFPLEtBQUMsTUFBTSxFQUFFO2VBRVYsSUFBSSxNQUFNLFVBQVcsTUFBTSxLQUFDLE1BQU07O1lBRXBDLFFBQVEsS0FBQyxNQUFNLFdBQVc7Z0JBRXZCLE1BQU07O2dCQUNMLG9CQUFnQixLQUFDLE1BQU0sTUFBTSxNQUFJOytCQUM3QixJQUFLLFNBQUksNkJBQUEsZ0JBQUE7O29CQUNULEtBQUMsTUFBTSxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBQyxNQUFNOzs7Z0JBRXBDLE9BQU87O29CQUNHLE1BQU0sUUFBUSxLQUFDLE1BQU07O29CQUE5Qjs7Z0JBQ0EsS0FBQyxTQUFTLE1BQU0sR0FBRyxFQUFFLElBQUk7O1lBRTdCLE9BQU87WUFDUCxLQUFPOztRQUVYLEtBQUMsaUJB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/draw.kode
