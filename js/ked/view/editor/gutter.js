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
        var idx, oldDiss, segl, syntax, _95_45_

        if (_k_.empty(this.preview) || _k_.empty(this.gitChanges))
        {
            return
        }
        var list = _k_.list(this.preview)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            idx = list[_a_]
            segl = kseg(((_95_45_=this.gitChanges[idx].old) != null ? _95_45_ : ''))
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
        var add, change, del, firstLine, mod, modi, mods, numLines, off, _133_29_, _134_29_, _135_29_, _142_36_

        this.clearChanges()
        var list = _k_.list(diff.changes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            firstLine = change.line
            mod = ((_133_29_=change.mod) != null ? _133_29_ : [])
            add = ((_134_29_=change.add) != null ? _134_29_ : [])
            del = ((_135_29_=change.del) != null ? _135_29_ : [])
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
        var bg, c, col, fg, hasCursor, highlighted, i, li, lineno, mainCursor, row, sc, scale, selected, spansel, y, _224_96_

        mainCursor = this.state.mainCursor()
        li = this.state.s.view[1]
        row = 0
        while (row < this.cells.rows && li < this.state.s.lines.length)
        {
            scale = this.state.scaleOfLine(li)
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
                if (col < this.cells.rows)
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
            row += scale
            li += 1
        }
        this.drawPreviews()
        return this.drawGitScroll()
    }

    return gutter
})()

export default gutter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3V0dGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2VkaXRvci9ndXR0ZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVlhLFVBQUE7SUFBUTtJQUFLOztPQUNMLFlBQVI7O09BQ1EsY0FBQTs7T0FDQSxXQUFWO09BQWUsYUFBZjs7T0FDVSxXQUFYOztPQUNXLFlBQVg7T0FBaUIsWUFBakI7O09BQ1csV0FBZDs7O0FBRUUsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUk7O1FBQUQ7Ozs7OztRQUVDLEtBQUMsUUFBUSxLQUFDLE9BQU87K0NBRVgsS0FBQyxPQUFPLE9BQU8sS0FBQyxNQUFNLFVBQVU7UUFFdEMsS0FBQyxTQUFTLEtBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsS0FBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxjQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLG9CQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLGFBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsYUFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxhQUFvQixNQUFNLE9BQU87UUFDM0MsS0FBQyxTQUFTLGNBQW9CLE1BQU0sT0FBTztRQUMzQyxLQUFDLFNBQVMsZUFBb0IsTUFBTSxPQUFPO1FBQzNDLEtBQUMsU0FBUyxZQUFvQixNQUFNLFVBQVU7UUFDOUMsS0FBQyxTQUFTLGlCQUFvQixNQUFNLFVBQVU7UUFDOUMsS0FBQyxTQUFTLFlBQW9CLE1BQU0sVUFBVTtRQUU5QyxLQUFDO1FBRUQsS0FBSyxHQUFHLGFBQWEsS0FBQztRQUN0QixLQUFLLEdBQUcsWUFBYSxLQUFDOzs7c0JBRTFCLDBCQUFhLE9BQU07O1lBRVYsVUFBUyxLQUFDOzs7O1lBQ1osU0FBUTs7WUFDUCxLQUFDLFNBQVMsY0FBa0IsTUFBTSxNQUFNLE9BQU87bUJBQy9DLEtBQUMsU0FBUyxlQUFrQixNQUFNLE1BQU0sT0FBTzs7OztzQkFFdkQs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/gutter.kode
