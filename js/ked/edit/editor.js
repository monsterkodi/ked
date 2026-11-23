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
        this["deleteSheetNode"] = this["deleteSheetNode"].bind(this)
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
        this.state.initView()
        return this.state.fitSheet()
    }

    editor.prototype["onWheel"] = function (event)
    {
        var inside, res, speedUp, steps, _86_25_, _87_25_, _88_25_, _92_20_, _96_49_, _97_46_

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
        speedUp = ((_96_49_=config.data.mouse.wheelSpeedup) != null ? _96_49_ : 2)
        steps = ((_97_46_=config.data.mouse.wheelSteps) != null ? _97_46_ : 1)
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
        ;[x,y] = state.mainCursor()
        lines = state.s.lines
        if (y < 0 || y >= lines.length)
        {
            return
        }
        line = lines[y]
        width = kseg.width(line)
        var list = [x - 1,x]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cx = list[_a_]
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
        ;[x,y] = state.mainCursor()
        lines = state.s.lines
        if (y < 0 || y >= lines.length)
        {
            return
        }
        line = lines[y]
        width = kseg.width(line)
        var list = [x - 1,x]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cx = list[_a_]
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

    editor.prototype["deleteSheetNode"] = function (node)
    {
        this.state.deleteSheetNode(node)
        this.redraw()
        return true
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
        var dir, result, _220_37_, _222_25_, _225_20_, _228_25_, _246_25_, _270_21_, _274_21_

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
                case 'ctrl+alt+delete':
                case 'ctrl+alt+entf':
                    return this.deleteSheetNode()

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2VkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFXO0lBQUs7O09BQ0wsYUFBVDtPQUFnQixXQUFoQjs7T0FDUyxhQUFUO09BQWdCLGNBQWhCOztPQUNTLGFBQWQ7O09BQ2MsWUFBZDs7T0FDYyxXQUFmOztPQUNlLFlBQUE7T0FBTSxXQUFBO09BQUssZUFBQTtPQUFTLFdBQUE7T0FBSyxZQUFBO09BQU0sV0FBQTs7O0FBRW5ELFVBQUQ7O3VCQUFRO2FBUUosUUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytDQUVELEtBQUMsT0FBTyxLQUFDLEtBQUs7UUFFcEIsS0FBQyxZQUFZO1FBRWIsS0FBQyxZQUFhLE1BQU0sS0FBQyxNQUFNLEtBQUM7UUFFNUIsS0FBSyxHQUFHLFFBQVEsS0FBQztZQUVkLEtBQUMsTUFBTTs7WUFBVyxLQUFDLGFBQWUsT0FBUyxLQUFDLE9BQU8sS0FBQyxNQUFNOztZQUMxRCxLQUFDLE1BQU07O1lBQVcsS0FBQyxhQUFlLE9BQVMsS0FBQyxPQUFPLEtBQUMsTUFBTTs7WUFDMUQsS0FBQyxNQUFNOztZQUFXLEtBQUMsYUFBZSxRQUFTLEtBQUMsT0FBTyxLQUFDOztZQUNwRCxLQUFDLE1BQU07O1lBQVcsS0FBQyxhQUFlLE9BQVM7O1lBQzNDLEtBQUMsTUFBTTs7WUFBVyxLQUFDLGVBQWUsU0FBUzs7WUFDM0MsS0FBQyxNQUFNOztZQUFXLEtBQUMsWUFBZSxNQUFTOztRQUU5QyxLQUFDLGNBQWMsS0FBQyxPQUFPLEtBQUMsT0FBTyxLQUFDLE9BQU8sS0FBQztRQUV4QyxLQUFLLG1CQUFtQjtRQUV4QixLQUFLLEdBQUcsZUFBZSxLQUFDO1FBQ3hCLEtBQUM7OztzQkFFTDs7Ozs0QkFFYSxLQUFLOzs7WUFBVjtnQkFDRyxLQUFDLE1BQU07O2dCQUFLLEtBQUMsTUFBTSxhQUFhLEtBQUs7Ozs7O3NCQUVo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
//# sourceURL=../../../kode/ked/edit/editor.kode
