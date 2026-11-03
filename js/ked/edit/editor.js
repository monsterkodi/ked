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
        var g, m, mw, s, sl, sr, _78_17_

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
    
        var ret, _92_21_, _93_21_, _94_21_, _95_23_

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
        var inside, res, speedUp, steps, _110_25_, _111_25_, _112_25_, _116_20_, _120_49_, _121_46_

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
        speedUp = ((_120_49_=config.data.mouse.wheelSpeedup) != null ? _120_49_ : 2)
        steps = ((_121_46_=config.data.mouse.wheelSteps) != null ? _121_46_ : 1)
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
        var row, scale, v, x

        cursor = (cursor != null ? cursor : this.state.mainCursor())
        v = this.state.s.view
        scale = this.state.scaleOfLine(cursor[1])
        row = this.state.rowOfLine(cursor[1])
        x = cursor[0] * scale - v[0]
        return 0 <= x && x + scale <= this.cells.cols && 0 <= row && row + scale <= this.cells.rows
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
        var _181_20_, _185_21_, _190_21_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2VkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFXOztPQUNBLGFBQVQ7T0FBZ0IsV0FBaEI7O09BQ1MsYUFBVDtPQUFnQixjQUFoQjs7T0FDUyxhQUFkOztPQUNjLFdBQWY7O09BQ2UsWUFBQTtPQUFNLFdBQUE7T0FBSyxlQUFBO09BQVMsV0FBQTs7O0FBRXhDLFVBQUQ7O3VCQUFnQjthQVFaLFFBQUcsUUFBTyxNQUFLOzs7Ozs7Ozs7Ozs7OytDQUVMLE9BQU8sS0FBSztRQUVsQixLQUFDLFlBQVk7UUFFYixLQUFDLFlBQVksTUFBTSxLQUFDLE1BQU0sS0FBQztRQUUzQixLQUFLLEdBQUcsUUFBUSxLQUFDO1lBRWQsS0FBQyxNQUFNOztZQUFXLEtBQUMsYUFBZSxPQUFTLEtBQUMsT0FBTyxLQUFDLE1BQU07O1lBQzFELEtBQUMsTUFBTTs7WUFBVyxLQUFDLGFBQWUsT0FBUyxLQUFDLE9BQU8sS0FBQyxNQUFNOztZQUMxRCxLQUFDLE1BQU07O1lBQVcsS0FBQyxhQUFlLFFBQVMsS0FBQyxPQUFPLEtBQUM7O1lBQ3BELEtBQUMsTUFBTTs7WUFBVyxLQUFDLGFBQWUsT0FBUzs7WUFDM0MsS0FBQyxNQUFNOztZQUFXLEtBQUMsZUFBZSxTQUFTOztRQUU5QyxLQUFLLG1CQUFtQjtRQUV4QixLQUFLLEdBQUcsZUFBZSxLQUFDO1FBQ3hCLEtBQUM7OztzQkFFTDs7Ozs0QkFFYSxLQUFLOzs7WUFBVjtnQkFDRyxLQUFDLE1BQU07O2dCQUFLLEtBQUMsTUFBTSxhQUFhLEtBQUs7Ozs7O3NCQVFoRCxxQkFBUSxHQUFFLEdBQUUsR0FBRTs7OztRQUVWLElBQUksSUFBSSxJQUFJO1FBQ1osS0FBSyxLQUFLO1lBRVAsS0FBQzs7WUFDQSxJQUFJO2dCQUNELEtBQUMsTUFBTTs7Z0JBQ04sS0FBSztnQkFDTCxLQUFDLE9BQU8sT0FBTyxJQUFFLElBQUUsR0FBRyxFQUFJLEVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/editor.kode
