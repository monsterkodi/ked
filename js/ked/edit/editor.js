var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var editor

import kxk from "../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg

import scroll from "../view/base/scroll.js"
import view from "../view/base/view.js"

import gutter from "../view/editor/gutter.js"
import mapview from "../view/editor/mapview.js"

import config from "../util/config.js"

import color from "../theme/color.js"

import belt from "./tool/belt.js"

import state from "./state.js"
import draw from "./draw.js"
import complete from "./complete.js"
import mode from "./mode.js"
import susan from "./susan.js"


editor = (function ()
{
    _k_.extend(editor, draw)
    function editor (screen, name, features)
    {
        this["onKey"] = this["onKey"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["onFocus"] = this["onFocus"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["syntaxClassAtMainCursor"] = this["syntaxClassAtMainCursor"].bind(this)
        this["syntaxColorAtMainCursor"] = this["syntaxColorAtMainCursor"].bind(this)
        this["isCursorInRect"] = this["isCursorInRect"].bind(this)
        this["isCursorVisible"] = this["isCursorVisible"].bind(this)
        this["isCursorInEmpty"] = this["isCursorInEmpty"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["onModesLoaded"] = this["onModesLoaded"].bind(this)
        editor.__super__.constructor.call(this,screen,name,features)
        this.focusable = true
        this.state = new state(this.cells,this.name)
        this.susan = new susan(this.cells,this.state)
        post.on('focus',this.onFocus)
        if (this.feats.scrllr)
        {
            this.scroll = new scroll(this.screen,this.state,'right')
        }
        if (this.feats.scroll)
        {
            this.scroll = new scroll(this.screen,this.state,'left')
        }
        if (this.feats.mapview)
        {
            this.mapscr = new mapview(this.screen,this.state)
        }
        if (this.feats.gutter)
        {
            this.gutter = new gutter(this)
        }
        if (this.feats.complete)
        {
            this.complete = new complete(this)
        }
        mode.autoStartForEditor(this)
        post.on('modes.loaded',this.onModesLoaded)
        this.onModesLoaded()
    }

    editor.prototype["onModesLoaded"] = function ()
    {
        var m

        var list = _k_.list(mode.names())
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (this.feats[m])
            {
                this.state.allowedModes[m] = true
            }
        }
    }

    editor.prototype["layout"] = function (x, y, w, h)
    {
        var g, m, mw, s, sl, sr, _74_17_

        g = m = s = 0
        sl = sr = 0
        if (this.scroll)
        {
            s = 1
            if (this.feats.scrllr)
            {
                sr = s
                this.scroll.layout(x + w - sr,y,s,h)
            }
            else
            {
                sl = s
                this.scroll.layout(x,y,s,h)
            }
        }
        if (this.gutter && this.gutter.visible())
        {
            g = this.state.gutterWidth()
            this.gutter.layout(x + sl,y,g,h)
        }
        if (this.mapscr)
        {
            if (this.name === 'editor')
            {
                mw = _k_.min(12,parseInt(Math.floor(w / 10)))
            }
            else
            {
                mw = 12
            }
            m = (this.mapscr.visible() ? mw : 0)
            this.mapscr.layout(x + w - sr - m,y,mw,h)
        }
        this.cells.layout(x + sl + g,y,w - s - g - m,h)
        ;(this.complete != null ? this.complete.onEditorLayout() : undefined)
        return this.state.initView()
    }

    editor.prototype["onMouse"] = function (event)
    {
        editor.__super__.onMouse.call(this,event)
    
        var ret, _82_21_, _83_21_, _84_21_, _85_23_

        ret = (this.gutter != null ? this.gutter.onMouse(event) : undefined)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = (this.mapscr != null ? this.mapscr.onMouse(event) : undefined)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = (this.scroll != null ? this.scroll.onMouse(event) : undefined)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = (this.complete != null ? this.complete.onMouse(event) : undefined)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return false
    }

    editor.prototype["onWheel"] = function (event)
    {
        var inside, res, speedUp, steps, _100_20_, _104_49_, _105_46_, _94_25_, _95_25_, _96_25_

        if (event.cell[1] >= this.cells.y + this.cells.rows)
        {
            return
        }
        inside = this.cells.isInsideEvent(event)
        inside |= (this.scroll != null ? this.scroll.cells.isInsideEvent(event) : undefined)
        inside |= (this.gutter != null ? this.gutter.cells.isInsideEvent(event) : undefined)
        inside |= (this.mapscr != null ? this.mapscr.cells.isInsideEvent(event) : undefined)
        if (!inside)
        {
            return
        }
        if ((this.complete != null))
        {
            if (res = this.complete.onWheel(event))
            {
                return res
            }
        }
        speedUp = ((_104_49_=config.data.mouse.wheelSpeedup) != null ? _104_49_ : 2)
        steps = ((_105_46_=config.data.mouse.wheelSteps) != null ? _105_46_ : 1)
        if (event.shift)
        {
            steps *= speedUp
        }
        if (event.ctrl)
        {
            steps *= speedUp
        }
        if (event.alt)
        {
            steps *= speedUp
        }
        switch (event.dir)
        {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.state.scrollView(event.dir,steps)
                break
        }

        return {redraw:true}
    }

    editor.prototype["isCursorInEmpty"] = function (cursor)
    {
        cursor = (cursor != null ? cursor : this.state.mainCursor())
        return belt.isLinesPosOutside(this.state.s.lines,cursor)
    }

    editor.prototype["isCursorVisible"] = function (cursor)
    {
        cursor = (cursor != null ? cursor : this.state.mainCursor())
        return this.isCursorInRect(cursor,[0,0,this.cells.cols,this.cells.rows])
    }

    editor.prototype["isCursorInRect"] = function (cursor, rect)
    {
        var row, scale, v, x

        v = this.state.s.view
        scale = this.state.lineHeight(cursor[1])
        row = this.state.rowOfLine(cursor[1])
        x = this.cursorCellX(cursor[0],cursor[1]) - v[0]
        return rect[0] <= x && x + scale <= rect[2] && rect[1] <= row && row + scale <= rect[3]
    }

    editor.prototype["syntaxColorAtMainCursor"] = function ()
    {
        var cx, line, lines, rgb, state, width, x, y

        state = this.state
        var _a_ = state.mainCursor(); x = _a_[0]; y = _a_[1]

        lines = state.s.lines
        if (y < 0 || y >= lines.length)
        {
            return
        }
        line = lines[y]
        width = kseg.width(line)
        var list = [x - 1,x]
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            cx = list[_b_]
            if ((0 <= cx && cx < width))
            {
                rgb = state.syntax.getColor(cx,y)
                return color.hex(rgb)
            }
        }
        return null
    }

    editor.prototype["syntaxClassAtMainCursor"] = function ()
    {
        var cx, line, lines, state, width, x, y

        state = this.state
        var _a_ = state.mainCursor(); x = _a_[0]; y = _a_[1]

        lines = state.s.lines
        if (y < 0 || y >= lines.length)
        {
            return
        }
        line = lines[y]
        width = kseg.width(line)
        var list = [x - 1,x]
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            cx = list[_b_]
            if ((0 <= cx && cx < width))
            {
                return state.syntax.getClass(cx,y)
            }
        }
        return null
    }

    editor.prototype["grabFocus"] = function ()
    {
        if (this.hidden())
        {
            this.show()
        }
        post.emit('focus',this.name)
        return this.redraw()
    }

    editor.prototype["hasFocus"] = function ()
    {
        return this.state.hasFocus
    }

    editor.prototype["onFocus"] = function (name)
    {
        return this.state.hasFocus = (name === this.name)
    }

    editor.prototype["redraw"] = function ()
    {
        return post.emit('redraw')
    }

    editor.prototype["onKey"] = function (key, event)
    {
        var result, _190_37_, _192_25_, _195_20_, _201_21_, _205_21_

        if (!this.hasFocus())
        {
            return
        }
        if (key === 'alt+g' && (this.gutter != null))
        {
            if (this.gutter.toggleAtLine(this.state.mainCursor()[1]))
            {
                ;(this.complete != null ? this.complete.hide() : undefined)
                return true
            }
        }
        if ((this.complete != null))
        {
            if (this.complete.handleKey(key,event) !== 'unhandled')
            {
                return true
            }
        }
        result = this.state.feedKey(key,event)
        if (result === 'handled')
        {
            ;(this.complete != null ? this.complete.hide() : undefined)
            return true
        }
        if (result === 'inserted')
        {
            ;(this.complete != null ? this.complete.complete() : undefined)
            return true
        }
        if (!(_k_.in(key.split('+').slice(-1)[0],['shift','ctrl','alt','cmd','esc'])))
        {
            return false
        }
    }

    return editor
})()

export default editor;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2VkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFXO0lBQUs7O09BQ0wsYUFBVDtPQUFnQixXQUFoQjs7T0FDUyxhQUFUO09BQWdCLGNBQWhCOztPQUNTLGFBQWQ7O09BQ2MsWUFBZDs7T0FDYyxXQUFmOztPQUNlLFlBQUE7T0FBTSxXQUFBO09BQUssZUFBQTtPQUFTLFdBQUE7T0FBSyxZQUFBOzs7QUFFN0MsVUFBRDs7dUJBQVE7YUFRSixRQUFHLFFBQU8sTUFBSzs7Ozs7Ozs7Ozs7Ozs7OzsrQ0FFTCxPQUFPLEtBQUs7UUFFbEIsS0FBQyxZQUFZO1FBRWIsS0FBQyxZQUFhLE1BQU0sS0FBQyxNQUFNLEtBQUM7UUFDNUIsS0FBQyxZQUFhLE1BQU0sS0FBQyxNQUFNLEtBQUM7UUFFNUIsS0FBSyxHQUFHLFFBQVEsS0FBQztZQUVkLEtBQUMsTUFBTTs7WUFBVyxLQUFDLGFBQWUsT0FBUyxLQUFDLE9BQU8sS0FBQyxNQUFNOztZQUMxRCxLQUFDLE1BQU07O1lBQVcsS0FBQyxhQUFlLE9BQVMsS0FBQyxPQUFPLEtBQUMsTUFBTTs7WUFDMUQsS0FBQyxNQUFNOztZQUFXLEtBQUMsYUFBZSxRQUFTLEtBQUMsT0FBTyxLQUFDOztZQUNwRCxLQUFDLE1BQU07O1lBQVcsS0FBQyxhQUFlLE9BQVM7O1lBQzNDLEtBQUMsTUFBTTs7WUFBVyxLQUFDLGVBQWUsU0FBUzs7UUFFOUMsS0FBSyxtQkFBbUI7UUFFeEIsS0FBSyxHQUFHLGVBQWUsS0FBQztRQUN4QixLQUFDOzs7c0JBRUw7Ozs7NEJBRWEsS0FBSzs7O1lBQVY7Z0JBQ0csS0FBQyxNQUFNOztnQkFBSyxLQUFDLE1BQU0sYUFBYSxLQUFLOzs7OztzQkFFaEQscUJBQVEsR0FBRSxHQUFFLEdBQUU7Ozs7UUFFVixJQUFJLElBQUksSUFBSTtRQUNaLEtBQUssS0FBSztZQUVQLEtBQUM7O1lBQ0EsSUFBSTtnQkFDRCxL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/editor.kode
