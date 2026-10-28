var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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
        var lines, row, view, y, _46_58_, _62_17_, _64_17_, _66_15_, _67_15_, _68_15_

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
        for (var _a_ = row = 0, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            y = row + view[1]
            if (y >= lines.length)
            {
                break
            }
            this.drawLine(lines[y],y,row)
        }
        this.drawTrailingRows()
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

    draw.prototype["drawLine"] = function (line, y, row)
    {
        var bg, c, ch, checkColor, ci, classes, clss, cw, fg, firstIndex, firstSegi, headerClass, linel, si, sw, syntax, view, x

        row = (row != null ? row : y - this.state.s.view[1])
        bg = this.color.bg
        checkColor = false
        headerClass = null
        syntax = this.state.syntax
        view = this.state.s.view
        classes = syntax.getClasses(y)
        linel = kseg.width(line) - view[0]
        c = 0
        firstIndex = kseg.indexAtWidth(line,view[0])
        firstSegi = kseg.segiAtWidth(line,view[0])
        if (firstIndex !== firstSegi)
        {
            c = 1
        }
        x = 0
        si = 0
        sw = 0
        while (x < this.cells.cols)
        {
            ci = x + view[0]
            while (sw < ci && si < line.length)
            {
                sw += kseg.segWidth(line[si])
                si += 1
            }
            if (si >= line.length)
            {
                break
            }
            clss = classes[ci]
            clss = (clss != null ? clss : 'text')
            fg = syntax.getColor(ci,y,clss)
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
            cw = kseg.segWidth(line[si])
            cw = _k_.max(1,cw)
            x += cw
            if (x < this.cells.cols)
            {
                c += this.cells.add(c,row,ch,fg,bg)
            }
            if (clss === 'invert_bg')
            {
                bg = this.color.bg
            }
        }
        this.drawRowBackground(row,linel)
        if (checkColor)
        {
            this.drawColorPills(line,row,linel)
        }
        if (headerClass)
        {
            return this.drawAsciiHeader(line,row,headerClass)
        }
    }

    draw.prototype["drawRowBackground"] = function (row, linel)
    {
        if (row + view[1] === this.state.mainCursor()[1])
        {
            if (linel > 0)
            {
                this.cells.bg_rect(0,row,linel,row,this.color.cursor.main)
            }
            if (linel < this.cells.cols)
            {
                return this.cells.bg_fill(_k_.max(0,linel),row,-1,row,this.color.cursor.empty)
            }
        }
        else
        {
            if (linel > 0)
            {
                this.cells.bg_rect(0,row,linel,row,this.color.bg)
            }
            return this.cells.bg_fill(_k_.max(0,linel),row,-1,row,this.color.empty)
        }
    }

    draw.prototype["drawTrailingRows"] = function ()
    {
        var row, vl

        vl = this.state.s.lines.length - this.state.s.view[1]
        if (vl >= this.cells.rows)
        {
            return
        }
        for (var _a_ = row = vl, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            this.cells.bg_fill(0,row,-1,row,this.color.empty)
        }
    }

    draw.prototype["drawHighlights"] = function ()
    {
        var bg, bgc, highlight, hlc, ul, ulc, vx, vy, x, xe, xs, y

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
            y = highlight[1] - vy
            if (y >= this.cells.rows)
            {
                break
            }
            xs = _k_.max(highlight[0],vx)
            xe = _k_.min(highlight[2],vx + this.cells.cols)
            for (var _c_ = x = xs, _d_ = xe; (_c_ <= _d_ ? x < xe : x > xe); (_c_ <= _d_ ? ++x : --x))
            {
                hlc = this.cells.get_char(x - vx,y)
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

                this.cells.set_bg(x - vx,y,bgc)
                this.cells.set_char(x - vx,y,color.ul_rgb(ulc) + '\x1b[4:1m' + hlc + '\x1b[4:0m')
                this.cells.adjustContrastForHighlight(x - vx,y,bgc)
            }
        }
    }

    draw.prototype["drawSelections"] = function ()
    {
        var bg, li, linebg, selection, spanbg, x, xe, xs, y

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
            for (var _b_ = li = selection[1], _c_ = selection[3]; (_b_ <= _c_ ? li <= selection[3] : li >= selection[3]); (_b_ <= _c_ ? ++li : --li))
            {
                y = li - this.state.s.view[1]
                if (y >= this.cells.rows)
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
                for (var _d_ = x = xs, _e_ = xe; (_d_ <= _e_ ? x < xe : x > xe); (_d_ <= _e_ ? ++x : --x))
                {
                    this.cells.set_bg(x - this.state.s.view[0],y,bg)
                    this.cells.adjustContrastForHighlight(x,y,bg)
                }
            }
        }
    }

    draw.prototype["drawYank"] = function ()
    {
        var bg, li, rng, vx, vy, x, xe, xs, y

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
            for (var _c_ = li = rng[1], _d_ = rng[3]; (_c_ <= _d_ ? li <= rng[3] : li >= rng[3]); (_c_ <= _d_ ? ++li : --li))
            {
                y = li - vy
                if (y >= this.cells.rows)
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
                xs = _k_.max(xs,vx)
                xe = _k_.min(xe,vx + this.cells.cols)
                for (var _e_ = x = xs, _f_ = xe; (_e_ <= _f_ ? x < xe : x > xe); (_e_ <= _f_ ? ++x : --x))
                {
                    this.cells.set_bg(x - vx,y,bg)
                    this.cells.adjustContrastForHighlight(x - vx,y,bg)
                }
            }
        }
    }

    draw.prototype["drawCursors"] = function ()
    {
        var bg, cursor, fg, mainCursor, s, x, y

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
                this.cells.draw_rounded_multi_cursor(cursor[0] - s.view[0],cursor[1] - s.view[1],bg)
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
            var _b_ = [mainCursor[0] - s.view[0],mainCursor[1] - s.view[1]]; x = _b_[0]; y = _b_[1]

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
            return this.cells.draw_rounded_cursor(x,y,bg)
        }
    }

    draw.prototype["drawColorPills"] = function (line, row, linel)
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

    draw.prototype["drawAsciiHeader"] = function (line, row, clss)
    {
        var bg, ch, chunk, chunks, fg, x

        chunks = kseg.chunks(line)
        var list = _k_.list(chunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            chunk = list[_a_]
            if (!(_k_.in(chunk.segl[0],'0█')))
            {
                continue
            }
            x = chunk.index - this.state.s.view[0]
            ch = '▎'
            fg = theme.syntax[clss + ' highlight']
            bg = theme.syntax[clss]
            this.cells.set(x,row,ch,fg,bg)
            if (chunk.segl.length <= 1)
            {
                continue
            }
            x += chunk.segl.length - 1
            ch = '▋'
            fg = theme.syntax[clss]
            bg = theme.syntax[clss + ' shadow']
            this.cells.set(x,row,ch,fg,bg)
        }
    }

    return draw
})()

export default draw;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhdy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9kcmF3LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRVSxVQUFBO0lBQVM7SUFBSzs7T0FDTCxXQUFaOztPQUNZLGNBQUE7O09BQ0EsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWI7O09BQ2EsV0FBQTs7O0FBRVYsUUFBVDs7cUJBQXNCO2FBRWxCLE1BQUcsUUFBTyxNQUFLOzs7NkNBRUwsT0FBTyxLQUFLO1FBRWxCLEtBQUMsU0FBUyxLQUFZLE1BQU0sT0FBTztRQUNuQyxLQUFDLFNBQVMsUUFBWSxNQUFNLE9BQU87UUFFbkMsS0FBQyxTQUFTLFNBQVksTUFBTTtRQUM1QixLQUFDLFNBQVMsWUFBWSxNQUFNO1FBQzVCLEtBQUMsU0FBUyxZQUFZLE1BQU07UUFDNUIsS0FBQyxTQUFTLE9BQVksTUFBTSxNQUFNOzs7b0JBUXRDOzs7O1lBRVUsS0FBQzs7OztRQUtQLE9BQVMsS0FBQyxNQUFNLEVBQUU7UUFDbEIsUUFBUyxLQUFDLE1BQU0sRUFBRTthQUN1QixLQUFDOztZQUExQyxRQUFTLEtBQUMsU0FBUyxhQUFhOzt1QkFHNUIsTUFBTyxTQUFJLEtBQUMsTUFBTSwwQkFBUCxLQUFDLE1BQU0sYUFBUCxLQUFDLE1BQU07O1lBRWxCLElBQUksTUFBSSxLQUFLO2dCQUVKLEtBQUssTUFBTTs7Z0JBQXBCOztZQUVBLEtBQUMsU0FBUyxNQUFNLEdBQUcsRUFBRTs7UUFFekIsS0FBQztRQUNELEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQztVQUVELEtBQUMsbUJBQUQsS0FBQyxTQUFVO1FBQ1gsS0FBQztVQUNELEtBQUMsbUJBQUQsS0FBQyxTQUFVO1VBRVgsS0FBQyxpQkFBRCxLQUFDLE9BQVE7VUFDVCxLQUFDLGlCQUFELEtBQUMsT0FBUTtVQUNULEtBQUMsaUJBQUQsS0FBQyxPQUFRO1FBSVQsS0FBSyxTQUFTLEtBQUM7Ozs7b0JBVW5CLHVCQUFVLE1BQUssR0FBRTs7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/draw.kode
