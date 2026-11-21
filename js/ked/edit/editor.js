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
import keys from "./keys.js"


editor = (function ()
{
    _k_.extend(editor, draw)
    function editor (screen, name, features)
    {
        this.screen = screen
        this.name = name
    
        this["onKey"] = this["onKey"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["onFocus"] = this["onFocus"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["clearDecoration"] = this["clearDecoration"].bind(this)
        this["unscaleLine"] = this["unscaleLine"].bind(this)
        this["scaleLine"] = this["scaleLine"].bind(this)
        this["toggleStyle"] = this["toggleStyle"].bind(this)
        this["syntaxClassAtMainCursor"] = this["syntaxClassAtMainCursor"].bind(this)
        this["syntaxColorAtMainCursor"] = this["syntaxColorAtMainCursor"].bind(this)
        this["isCursorInRect"] = this["isCursorInRect"].bind(this)
        this["isCursorVisible"] = this["isCursorVisible"].bind(this)
        this["isCursorInEmpty"] = this["isCursorInEmpty"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["onModesLoaded"] = this["onModesLoaded"].bind(this)
        editor.__super__.constructor.call(this,this.screen,this.name,features)
        this.focusable = true
        this.state = new state(this.cells,this.name)
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
        if (this.feats.susan)
        {
            this.susan = new susan(this)
        }
        this.mouseItems = [this.gutter,this.mapscr,this.scroll,this.complete]
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
        var g, m, mw, s, sl, sr, _76_17_

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

    editor.prototype["onWheel"] = function (event)
    {
        var inside, res, speedUp, steps, _85_25_, _86_25_, _87_25_, _91_20_, _95_49_, _96_46_

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
        speedUp = ((_95_49_=config.data.mouse.wheelSpeedup) != null ? _95_49_ : 2)
        steps = ((_96_46_=config.data.mouse.wheelSteps) != null ? _96_46_ : 1)
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

    editor.prototype["toggleStyle"] = function (flag)
    {
        this.state.toggleSueFlag(flag)
        return this.redraw()
    }

    editor.prototype["scaleLine"] = function (delta)
    {
        this.state.stepScales(delta)
        return this.redraw()
    }

    editor.prototype["unscaleLine"] = function ()
    {
        this.state.clearScales()
        return this.redraw()
    }

    editor.prototype["clearDecoration"] = function ()
    {
        return this.state.clearSueAtCursorOrSelection()
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
        var dir, result, _203_37_, _205_25_, _208_20_, _222_25_, _246_21_, _250_21_

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
        if (this.feats['susan'])
        {
            switch (key)
            {
                case 'shift+alt+c':
                    return this.clearDecoration()

                case 'shift+alt+u':
                    return this.toggleStyle('u')

                case 'shift+alt+s':
                    return this.toggleStyle('s')

                case 'shift+alt+b':
                    return this.toggleStyle('b')

                case 'shift+alt+i':
                    return this.toggleStyle('i')

                case 'shift+alt+=':
                    return this.scaleLine(1)

                case 'shift+alt+-':
                    return this.scaleLine(-1)

                case 'shift+alt+0':
                    return this.unscaleLine()

            }

        }
        if ((this.state.rectree != null))
        {
            dir = ((function ()
            {
                switch (key)
                {
                    case 'shift+alt+h':
                    case 'ctrl+alt+left':
                        return 'left'

                    case 'shift+alt+j':
                    case 'ctrl+alt+down':
                        return 'down'

                    case 'shift+alt+k':
                    case 'ctrl+alt+up':
                        return 'up'

                    case 'shift+alt+l':
                    case 'ctrl+alt+right':
                        return 'right'

                }

            }).bind(this))()
            if ((dir != null))
            {
                this.state.moveSheetNode(dir)
                return true
            }
            dir = ((function ()
            {
                switch (key)
                {
                    case 'ctrl+alt+.':
                        return 'more cols'

                    case 'ctrl+alt+,':
                        return 'less cols'

                    case "ctrl+alt+'":
                        return 'more rows'

                    case 'ctrl+alt+/':
                        return 'less rows'

                }

            }).bind(this))()
            if ((dir != null))
            {
                this.state.resizeSheetNode(dir)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2VkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFXO0lBQUs7O09BQ0wsYUFBVDtPQUFnQixXQUFoQjs7T0FDUyxhQUFUO09BQWdCLGNBQWhCOztPQUNTLGFBQWQ7O09BQ2MsWUFBZDs7T0FDYyxXQUFmOztPQUNlLFlBQUE7T0FBTSxXQUFBO09BQUssZUFBQTtPQUFTLFdBQUE7T0FBSyxZQUFBO09BQU0sV0FBQTs7O0FBRW5ELFVBQUQ7O3VCQUFRO2FBUUosUUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQ0FFRCxLQUFDLE9BQU8sS0FBQyxLQUFLO1FBRXBCLEtBQUMsWUFBWTtRQUViLEtBQUMsWUFBYSxNQUFNLEtBQUMsTUFBTSxLQUFDO1FBRTVCLEtBQUssR0FBRyxRQUFRLEtBQUM7WUFFZCxLQUFDLE1BQU07O1lBQVcsS0FBQyxhQUFlLE9BQVMsS0FBQyxPQUFPLEtBQUMsTUFBTTs7WUFDMUQsS0FBQyxNQUFNOztZQUFXLEtBQUMsYUFBZSxPQUFTLEtBQUMsT0FBTyxLQUFDLE1BQU07O1lBQzFELEtBQUMsTUFBTTs7WUFBVyxLQUFDLGFBQWUsUUFBUyxLQUFDLE9BQU8sS0FBQzs7WUFDcEQsS0FBQyxNQUFNOztZQUFXLEtBQUMsYUFBZSxPQUFTOztZQUMzQyxLQUFDLE1BQU07O1lBQVcsS0FBQyxlQUFlLFNBQVM7O1lBQzNDLEtBQUMsTUFBTTs7WUFBVyxLQUFDLFlBQWUsTUFBUzs7UUFFOUMsS0FBQyxjQUFjLEtBQUMsT0FBTyxLQUFDLE9BQU8sS0FBQyxPQUFPLEtBQUM7UUFFeEMsS0FBSyxtQkFBbUI7UUFFeEIsS0FBSyxHQUFHLGVBQWUsS0FBQztRQUN4QixLQUFDOzs7c0JBRUw7Ozs7NEJBRWEsS0FBSzs7O1lBQVY7Z0JBQ0csS0FBQyxNQUFNOztnQkFBSyxLQUFDLE1BQU0sYUFBYSxLQUFLOzs7OztzQkFFaEQs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/editor.kode
