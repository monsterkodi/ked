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
        this["scaleSheetNode"] = this["scaleSheetNode"].bind(this)
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

    editor.prototype["scaleSheetNode"] = function (delta)
    {
        this.state.scaleSheetNode(delta)
        this.redraw()
        return true
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
        var dir, result, _211_37_, _213_25_, _216_20_, _219_25_, _236_25_, _260_21_, _264_21_

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
        if ((this.state.rectree != null))
        {
            switch (key)
            {
                case 'shift+alt+=':
                    return this.scaleSheetNode(1)

                case 'shift+alt+-':
                    return this.scaleSheetNode(-1)

                case 'shift+alt+0':
                    return this.scaleSheetNode(0)

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2VkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFXO0lBQUs7O09BQ0wsYUFBVDtPQUFnQixXQUFoQjs7T0FDUyxhQUFUO09BQWdCLGNBQWhCOztPQUNTLGFBQWQ7O09BQ2MsWUFBZDs7T0FDYyxXQUFmOztPQUNlLFlBQUE7T0FBTSxXQUFBO09BQUssZUFBQTtPQUFTLFdBQUE7T0FBSyxZQUFBO09BQU0sV0FBQTs7O0FBRW5ELFVBQUQ7O3VCQUFRO2FBUUosUUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0NBRUQsS0FBQyxPQUFPLEtBQUMsS0FBSztRQUVwQixLQUFDLFlBQVk7UUFFYixLQUFDLFlBQWEsTUFBTSxLQUFDLE1BQU0sS0FBQztRQUU1QixLQUFLLEdBQUcsUUFBUSxLQUFDO1lBRWQsS0FBQyxNQUFNOztZQUFXLEtBQUMsYUFBZSxPQUFTLEtBQUMsT0FBTyxLQUFDLE1BQU07O1lBQzFELEtBQUMsTUFBTTs7WUFBVyxLQUFDLGFBQWUsT0FBUyxLQUFDLE9BQU8sS0FBQyxNQUFNOztZQUMxRCxLQUFDLE1BQU07O1lBQVcsS0FBQyxhQUFlLFFBQVMsS0FBQyxPQUFPLEtBQUM7O1lBQ3BELEtBQUMsTUFBTTs7WUFBVyxLQUFDLGFBQWUsT0FBUzs7WUFDM0MsS0FBQyxNQUFNOztZQUFXLEtBQUMsZUFBZSxTQUFTOztZQUMzQyxLQUFDLE1BQU07O1lBQVcsS0FBQyxZQUFlLE1BQVM7O1FBRTlDLEtBQUMsY0FBYyxLQUFDLE9BQU8sS0FBQyxPQUFPLEtBQUMsT0FBTyxLQUFDO1FBRXhDLEtBQUssbUJBQW1CO1FBRXhCLEtBQUssR0FBRyxlQUFlLEtBQUM7UUFDeEIsS0FBQzs7O3NCQUVMOzs7OzRCQUVhLEtBQUs7OztZQUFWO2dCQUNHLEtBQUMsTUFBTTs7Z0JBQUssS0FBQyxNQUFNLGFBQWEsS0FBSzs7Ozs7c0JBRWhE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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/editor.kode
