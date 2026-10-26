var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var editor

import kxk from "../../kxk.js"
let post = kxk.post

import scroll from "../view/base/scroll.js"
import view from "../view/base/view.js"

import gutter from "../view/editor/gutter.js"
import mapview from "../view/editor/mapview.js"

import config from "../util/config.js"

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
        var g, m, mw, s, sl, sr, _84_17_

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
    
        var ret, _100_21_, _101_23_, _98_21_, _99_21_

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
        var inside, res, speedUp, steps, _116_25_, _117_25_, _118_25_, _122_20_, _126_49_, _127_46_

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
        speedUp = ((_126_49_=config.data.mouse.wheelSpeedup) != null ? _126_49_ : 2)
        steps = ((_127_46_=config.data.mouse.wheelSteps) != null ? _127_46_ : 1)
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
        var _195_20_, _199_21_, _204_21_

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
            if (!(_k_.in(key.split('+').slice(-1)[0],['shift','ctrl','alt','cmd','esc'])))
            {
                console.log(`editor.onKey? |${key}|`,event)
            }
        }
    }

    return editor
})()

export default editor;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2VkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BYVUsVUFBQTtJQUFXOztPQUNBLGFBQVQ7T0FBZ0IsV0FBaEI7O09BQ1MsYUFBVDtPQUFnQixjQUFoQjs7T0FDUyxhQUFkOztPQUNjLFdBQWY7O09BQ2UsWUFBQTtPQUFNLFdBQUE7T0FBSyxlQUFBO09BQVMsV0FBQTs7O0FBRWhDLFVBQVQ7O3VCQUF3QjthQUVwQixRQUFHLFFBQU8sTUFBSzs7Ozs7Ozs7Ozs7OzsrQ0FFTCxPQUFPLEtBQUs7UUFFbEIsS0FBQyxZQUFZO1FBRWIsS0FBQyxZQUFZLE1BQU0sS0FBQyxNQUFNLEtBQUM7UUFFM0IsS0FBSyxHQUFHLFFBQVEsS0FBQztZQUVkLEtBQUMsTUFBTTs7WUFBVyxLQUFDLGFBQWUsT0FBUyxLQUFDLE9BQU8sS0FBQyxNQUFNOztZQUMxRCxLQUFDLE1BQU07O1lBQVcsS0FBQyxhQUFlLE9BQVMsS0FBQyxPQUFPLEtBQUMsTUFBTTs7WUFDMUQsS0FBQyxNQUFNOztZQUFXLEtBQUMsYUFBZSxRQUFTLEtBQUMsT0FBTyxLQUFDOztZQUNwRCxLQUFDLE1BQU07O1lBQVcsS0FBQyxhQUFlLE9BQVM7O1lBQzNDLEtBQUMsTUFBTTs7WUFBVyxLQUFDLGVBQWUsU0FBUzs7UUFFOUMsS0FBSyxtQkFBbUI7UUFFeEIsS0FBSyxHQUFHLGVBQWUsS0FBQztRQUN4QixLQUFDOzs7c0JBRUw7Ozs7NEJBRWEsS0FBSzs7O1lBQVY7Z0JBQ0csS0FBQyxNQUFNOztnQkFBSyxLQUFDLE1BQU0sYUFBYSxLQUFLOzs7OztzQkFRaEQscUJBQVEsR0FBRSxHQUFFLEdBQUU7Ozs7UUFFVixJQUFJLElBQUksSUFBSTtRQUNaLEtBQUssS0FBSztZQUVQLEtBQUM7O1lBQ0EsSUFBSTtnQkFDRCxLQUFDLE1BQU07O2dCQUNOLEtBQUs7Z0JBQ0wsS0FBQyxPQUFPLE9BQU8sSUFBRSxJQUFFLEdBQUcsRUFBSSxF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/editor.kode
