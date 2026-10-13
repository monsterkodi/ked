var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var editor

import kxk from "../../kxk.js"
let post = kxk.post

import scroll from "../view/base/scroll.js"
import view from "../view/base/view.js"

import gutter from "../view/editor/gutter.js"
import mapview from "../view/editor/mapview.js"

import belt from "./tool/belt.js"

import state from "./state.js"
import draw from "./draw.js"
import complete from "./complete.js"
import mode from "./mode.js"


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
        this["isCursorVisible"] = this["isCursorVisible"].bind(this)
        this["isCursorInEmpty"] = this["isCursorInEmpty"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["onModesLoaded"] = this["onModesLoaded"].bind(this)
        editor.__super__.constructor.call(this,screen,name,features)
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
        var g, m, mw, s, sl, sr, _83_17_

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
        if (this.gutter)
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
    
        var ret, _100_23_, _97_21_, _98_21_, _99_21_

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
        var inside, res, steps, _115_25_, _116_25_, _117_25_, _121_20_

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
        steps = 1
        if (event.shift)
        {
            steps *= 2
        }
        if (event.ctrl)
        {
            steps *= 2
        }
        if (event.alt)
        {
            steps *= 2
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
        var v

        cursor = (cursor != null ? cursor : this.state.mainCursor())
        v = this.state.s.view
        return (v[0] <= cursor[0] && cursor[0] < v[0] + this.cells.cols) && (v[1] <= cursor[1] && cursor[1] < v[1] + this.cells.rows)
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
        var _193_20_, _197_21_, _202_21_

        if (!this.hasFocus())
        {
            return
        }
        if ((this.complete != null))
        {
            if (this.complete.handleKey(key,event) !== 'unhandled')
            {
                return true
            }
        }
        if (this.state.handleKey(key,event) !== 'unhandled')
        {
            ;(this.complete != null ? this.complete.hide() : undefined)
            return true
        }
        if (!_k_.empty(event.char))
        {
            this.state.insert(event.char)
            ;(this.complete != null ? this.complete.complete() : undefined)
            return true
        }
        else
        {
            if (!(_k_.in(key.split('+').slice(-1)[0],['shift','ctrl','alt','cmd'])))
            {
                console.log(`editor.onKey? |${key}|`,event)
            }
        }
    }

    return editor
})()

export default editor;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2VkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFtQndCOzs7Ozs7Ozs7Ozs7OzsrQ0FJVixPQUFPLEtBQUs7UUFFbEIsS0FBQyxZQUFZO1FBRWIsS0FBQyxZQUFZLE1BQU0sS0FBQyxNQUFNLEtBQUM7UUFFM0IsS0FBSyxHQUFHLFFBQVEsS0FBQztZQUVkLEtBQUMsTUFBTTs7WUFBVyxLQUFDLGFBQWUsT0FBUyxLQUFDLE9BQU8sS0FBQyxNQUFNOztZQUMxRCxLQUFDLE1BQU07O1lBQVcsS0FBQyxhQUFlLE9BQVMsS0FBQyxPQUFPLEtBQUMsTUFBTTs7WUFDMUQsS0FBQyxNQUFNOztZQUFXLEtBQUMsYUFBZSxRQUFTLEtBQUMsT0FBTyxLQUFDOztZQUNwRCxLQUFDLE1BQU07O1lBQVcsS0FBQyxhQUFlLE9BQVM7O1lBQzNDLEtBQUMsTUFBTTs7WUFBVyxLQUFDLGVBQWUsU0FBUzs7UUFFOUMsS0FBSyxtQkFBbUI7UUFFeEIsS0FBSyxHQUFHLGVBQWUsS0FBQztRQUN4QixLQUFDOzs7Ozs7OzRCQUlRLEtBQUs7Ozs7Z0JBQ1AsS0FBQyxNQUFNOztnQkFBSyxLQUFDLE1BQU0sYUFBYSxLQUFLOzs7Ozs7Ozs7UUFVNUMsSUFBSSxJQUFJLElBQUk7UUFDWixLQUFLLEtBQUs7WUFFUCxLQUFDOztZQUNBLElBQUk7Z0JBQ0QsS0FBQyxNQUFNOztnQkFDTixLQUFLO2dCQUNMLEtBQUMsT0FBTyxPQUFPLElBQUUsSUFBRSxHQUFHLEVBQUksRUFBSTs7OztnQkFFOUIsS0FBSztnQkFDTCxLQUFDLE9BQU8sT0FBTyxFQUFPLEVBQUksRUFBSTs7O1lBRW5DLEtBQUM7O1lBRUEsSUFBSSxLQUFDLE1BQU07WUFDWCxLQUFDLE9BQU8sT0FBVSxJQUFFLEdBQU0sRUFBSSxFQUFJOztZQUVuQyxLQUFDOztnQkFDRyxLQUFDLFNBQVE7O2dCQUNSLGFBQVMsdUJB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
//# sourceURL=kode/ked/edit/editor.kode
