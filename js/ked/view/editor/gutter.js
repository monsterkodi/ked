var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var gutter

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg

import kulur from "../../../kolor/kulur.js"

import squares from "../../util/img/squares.js"

import prof from "../../util/prof.js"
import syntax from "../../util/syntax.js"

import mode from "../../edit/mode.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"


gutter = (function ()
{
    _k_.extend(gutter, view)
    function gutter (editor)
    {
        this.editor = editor
    
        this["clearChanges"] = this["clearChanges"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onModeStop"] = this["onModeStop"].bind(this)
        this["onModeStart"] = this["onModeStart"].bind(this)
        this.state = this.editor.state
        gutter.__super__.constructor.call(this,this.editor.screen,this.state.owner() + '.gutter')
        this.setColor('fg',theme.gutter.fg)
        this.setColor('bg',theme.gutter.bg)
        this.setColor('bg_selected',theme.gutter.bg_selected)
        this.setColor('bg_fully_selected',theme.gutter.bg_fully_selected)
        this.setColor('bg_git_mod',theme.gutter.bg_git_mod)
        this.setColor('bg_git_add',theme.gutter.bg_git_add)
        this.setColor('bg_git_del',theme.gutter.bg_git_del)
        this.setColor('cursor_main',theme.cursor.main)
        this.setColor('cursor_multi',theme.cursor.multi)
        this.setColor('selection',theme.selection.span)
        this.setColor('selection_line',theme.selection.line)
        this.setColor('highlight',theme.highlight.bg)
        this.gitChanges = {}
        post.on('mode.start',this.onModeStart)
        post.on('mode.stop',this.onModeStop)
    }

    gutter.prototype["onModeStart"] = function (state, name)
    {
        if (state !== this.state)
        {
            return
        }
        if (name === 'novim')
        {
            this.setColor('cursor_main',theme.novim.cursor.main)
            return this.setColor('cursor_multi',theme.novim.cursor.multi)
        }
    }

    gutter.prototype["onModeStop"] = function (state, name)
    {
        if (state !== this.state)
        {
            return
        }
        if (name === 'novim')
        {
            this.setColor('cursor_main',theme.cursor.main)
            return this.setColor('cursor_multi',theme.cursor.multi)
        }
    }

    gutter.prototype["onMouse"] = function (event)
    {
        var idx, pos

        if (this.cells.isOutsideEvent(event))
        {
            if (!_k_.empty(this.preview))
            {
                this.preview = []
                post.emit('redraw')
            }
            return
        }
        if (!_k_.empty(this.gitChanges) && (event.cmd || event.ctrl || event.alt))
        {
            pos = this.eventPos(event)
            idx = this.state.lineAtRow(pos[1])
            if (this.gitChanges[idx])
            {
                if (event.type === 'press')
                {
                    console.log('todo: press on git change!',idx,this.gitChanges)
                }
                else if (event.type === 'move')
                {
                    if (this.gitChanges[idx].old)
                    {
                        this.preview = [idx]
                        return {redraw:true}
                    }
                }
            }
        }
        if (!_k_.empty(this.preview))
        {
            this.preview = []
            return post.emit('redraw')
        }
    }

    gutter.prototype["drawPreviews"] = function ()
    {
        var idx, oldDiss, segl, syntax, _83_45_

        if (_k_.empty(this.preview) || _k_.empty(this.gitChanges))
        {
            return
        }
        var list = _k_.list(this.preview)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            idx = list[_a_]
            segl = kseg(((_83_45_=this.gitChanges[idx].old) != null ? _83_45_ : ''))
            syntax = this.editor.state.syntax
            oldDiss = syntax.diss[idx]
            syntax.diss[idx] = kulur.dissect([segl],syntax.ext)
            this.editor.drawLine(segl,idx)
            syntax.diss[idx] = oldDiss
        }
    }

    gutter.prototype["lineno"] = function (y)
    {
        var lineno, mcy

        mcy = this.state.mainCursor()[1]
        if (mode.isActive(this.state,'novim') && y !== mcy)
        {
            y -= mcy + 1
        }
        lineno = _k_.lpad(this.cells.cols - 1,y + 1)
        lineno += ' '
        return lineno
    }

    gutter.prototype["fgcolor"] = function (x, y)
    {}

    gutter.prototype["clearChanges"] = function ()
    {
        this.gitChanges = {}
        return this.gitBlocks = []
    }

    gutter.prototype["onGitDiff"] = function (diff)
    {
        var add, change, del, firstLine, mod, modi, mods, numLines, off, _115_29_, _116_29_, _117_29_, _124_36_

        this.clearChanges()
        var list = _k_.list(diff.changes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            firstLine = change.line
            mod = ((_115_29_=change.mod) != null ? _115_29_ : [])
            add = ((_116_29_=change.add) != null ? _116_29_ : [])
            del = ((_117_29_=change.del) != null ? _117_29_ : [])
            mods = mod.concat(add)
            numLines = mods.length
            mods = mods.concat(del)
            for (var _b_ = modi = 0, _c_ = numLines; (_b_ <= _c_ ? modi < numLines : modi > numLines); (_b_ <= _c_ ? ++modi : --modi))
            {
                off = ((mods[modi].new != null) ? -1 : 0)
                this.gitChanges[firstLine + modi + off] = mods[modi]
            }
            this.gitBlocks.push([change.line - 1,numLines,mod.length])
        }
        if (!_k_.empty(this.gitChanges))
        {
            return post.emit('redraw')
        }
    }

    gutter.prototype["drawGitScroll"] = function ()
    {
        var ah, csz, fg, gb, mh, oy, pixelsPerRow, sh, sw, sx, sy

        if (_k_.empty(this.gitBlocks))
        {
            return
        }
        csz = this.screen.t.cellsz
        if (_k_.empty(csz))
        {
            return
        }
        sw = parseInt(csz[0] / 2)
        sx = (this.cells.x - 1) * csz[0]
        oy = this.cells.y * csz[1]
        pixelsPerRow = _k_.clamp(0,csz[1],csz[1] * this.cells.rows / this.state.s.lines.length)
        var list = _k_.list(this.gitBlocks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            gb = list[_a_]
            sy = parseInt(gb[0] * pixelsPerRow + oy)
            if (gb[1] <= 0)
            {
                fg = this.color.bg_git_del
                sh = parseInt(pixelsPerRow)
            }
            else
            {
                fg = (gb[2] ? this.color.bg_git_mod : this.color.bg_git_add)
                sh = parseInt(gb[1] * pixelsPerRow)
            }
            if (gb[2] && gb[2] < gb[1])
            {
                mh = parseInt(gb[2] * pixelsPerRow)
                squares.place(sx,sy,sw,mh,this.color.bg_git_mod)
                sy += mh
                ah = sh - mh
                squares.place(sx,sy,sw,ah,this.color.bg_git_add)
            }
            else
            {
                squares.place(sx,sy,sw,sh,fg)
            }
        }
    }

    gutter.prototype["draw"] = function ()
    {
        var bg, c, col, fg, hasCursor, highlighted, i, li, lineno, mainCursor, row, s, sc, scale, selected, spansel, y, _199_96_

        mainCursor = this.state.mainCursor()
        li = this.state.s.view[1]
        row = -this.state.s.scrollOffset
        while (row < this.cells.rows && li < this.state.s.lines.length)
        {
            scale = this.state.lineHeight(li)
            if (row < 0)
            {
                row += scale
                li += 1
                continue
            }
            if (row + scale > this.cells.rows)
            {
                break
            }
            y = li
            lineno = this.lineno(y)
            hasCursor = this.state.isAnyCursorInLine(y)
            selected = this.state.isSelectedLine(y)
            highlighted = this.state.isHighlightedLine(y)
            spansel = this.state.isSpanSelectedLine(y)
            var list = _k_.list(lineno)
            for (i = 0; i < list.length; i++)
            {
                c = list[i]
                col = i
                if (col < this.cells.cols)
                {
                    if (sc = this.fgcolor(i,y,c))
                    {
                        fg = sc
                    }
                    else
                    {
                        fg = y === mainCursor[1] ? color.darken(this.color.cursor_main,(this.state.hasFocus != null),{1:0.5}) : hasCursor ? this.color.cursor_multi : spansel ? this.color.selection : selected ? this.color.selection_line : highlighted ? this.color.highlight : this.color.fg
                        if ((selected || hasCursor || highlighted) && !this.cells.screen.t.hasFocus)
                        {
                            fg = color.darken(fg)
                        }
                    }
                    bg = (this.gitChanges[y] != null ? this.gitChanges[y].old : undefined) && this.gitChanges[y].new ? this.color.bg_git_mod : (this.gitChanges[y] != null ? this.gitChanges[y].old : undefined) ? this.color.bg_git_del : (this.gitChanges[y] != null) ? this.color.bg_git_add : spansel ? this.color.bg_selected : selected ? this.color.bg_fully_selected : this.color.bg
                    if (selected && !this.cells.screen.t.hasFocus)
                    {
                        bg = color.darken(bg)
                    }
                    this.cells.set(col,row,((y < this.state.s.lines.length) ? c : ' '),fg,bg)
                }
            }
            for (var _b_ = s = 1, _c_ = scale; (_b_ <= _c_ ? s < scale : s > scale); (_b_ <= _c_ ? ++s : --s))
            {
                row += 1
                var list1 = _k_.list(lineno)
                for (i = 0; i < list1.length; i++)
                {
                    c = list1[i]
                    this.cells.set(i,row,' ',fg,bg)
                }
            }
            row += 1
            li += 1
        }
        this.drawPreviews()
        return this.drawGitScroll()
    }

    return gutter
})()

export default gutter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3V0dGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2VkaXRvci9ndXR0ZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUTtJQUFLOztPQUNMLFlBQVI7O09BQ1EsY0FBQTs7T0FDQSxXQUFWO09BQWUsYUFBZjs7T0FDVSxXQUFYOztPQUNXLFlBQVg7T0FBaUIsWUFBakI7O09BQ1csV0FBZDs7O0FBRU4sVUFBRDs7dUJBQVE7YUFPSixRQUFJOztRQUFEOzs7Ozs7UUFFQyxLQUFDLFFBQVEsS0FBQyxPQUFPOytDQUVYLEtBQUMsT0FBTyxPQUFPLEtBQUMsTUFBTSxVQUFVO1FBRXRDLEtBQUMsU0FBUyxLQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLEtBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsY0FBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxvQkFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxhQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLGFBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsYUFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxjQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLGVBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsWUFBb0IsTUFBTSxVQUFVO1FBQzlDLEtBQUMsU0FBUyxpQkFBb0IsTUFBTSxVQUFVO1FBQzlDLEtBQUMsU0FBUyxZQUFvQixNQUFNLFVBQVU7UUFFOUMsS0FBQztRQUVELEtBQUssR0FBRyxhQUFhLEtBQUM7UUFDdEIsS0FBSyxHQUFHLFlBQWEsS0FBQzs7O3NCQUUxQiwwQkFBYSxPQUFNOztZQUVWLFVBQVMsS0FBQzs7OztZQUNaLFNBQVE7O1lBQ1AsS0FBQyxTQUFTLGNBQWtCLE1BQU0sTUFBTSxPQUFPO21CQUMvQyxLQUFDLFNBQVMsZUFBa0IsTUFBTSxNQUFNLE9BQU87Ozs7c0JBRXZELHlC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/gutter.kode
