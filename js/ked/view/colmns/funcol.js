var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var funcol

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let kseg = kxk.kseg
let kutil = kxk.kutil

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import belt from "../../edit/tool/belt.js"

import view from "../base/view.js"
import knob from "../base/knob.js"

import funtree from "./funtree.js"
import colorpicker from "./colorpicker.js"


funcol = (function ()
{
    _k_.extend(funcol, view)
    function funcol (screen, editor, features)
    {
        this.editor = editor
    
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onFuncolToggle"] = this["onFuncolToggle"].bind(this)
        this["onFuncolResize"] = this["onFuncolResize"].bind(this)
        this["onContext"] = this["onContext"].bind(this)
        this["replaceColor"] = this["replaceColor"].bind(this)
        this["colorAtCursor"] = this["colorAtCursor"].bind(this)
        this["onColorPickerSubmit"] = this["onColorPickerSubmit"].bind(this)
        this["onColorPickerShow"] = this["onColorPickerShow"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        funcol.__super__.constructor.call(this,screen,'funcol',features)
        this.isVisible = false
        this.active = false
        this.colorReplace = null
        this.pointerType = 'pointer'
        this.knob = new knob(screen,`${this.name}_knob`)
        this.funtree = new funtree(this.editor,`${this.name}_funtree`,['scrllr'])
        this.colorpicker = new colorpicker(screen,`${this.name}_colorpicker`)
        this.knob.frameSide = 'left'
        this.funtree.setColor('bg',theme.funtree.bg)
        this.funtree.setColor('empty',this.funtree.color.bg)
        this.funtree.setColor('cursor_main',this.funtree.color.bg)
        this.funtree.setColor('cursor_empty',this.funtree.color.bg)
        this.funtree.scroll.setColor('bg',this.funtree.color.bg)
        this.knob.setColor('bg',this.funtree.color.bg)
        post.on('funcol.resize',this.onFuncolResize)
        post.on('funcol.toggle',this.onFuncolToggle)
        post.on('session.merge',this.onSessionMerge)
        post.on('funcol.focus',(function ()
        {
            return this.funtree.grabFocus()
        }).bind(this))
        post.on('colorpicker.show',this.onColorPickerShow)
        post.on('colorpicker.submit',this.onColorPickerSubmit)
    }

    funcol.prototype["onSessionMerge"] = function (recent)
    {
        if (_k_.empty(recent.funcol))
        {
            return
        }
        if (recent.funcol.active)
        {
            this.active = true
            this.show()
        }
        return ked_session.set('funcol',recent.funcol)
    }

    funcol.prototype["onColorPickerShow"] = function (hex)
    {
        var found

        this.active = true
        if (this.hidden())
        {
            this.show()
        }
        this.colorReplace = null
        if (_k_.empty(hex))
        {
            if (found = this.colorAtCursor())
            {
                hex = found.text
                this.colorReplace = found
            }
        }
        this.colorpicker.show(hex)
        ked_session.set('funcol▸active',this.active)
        return post.emit('redraw')
    }

    funcol.prototype["onColorPickerSubmit"] = function (hex)
    {
        var _77_42_

        if ((this.colorReplace != null))
        {
            return this.replaceColor(hex)
        }
    }

    funcol.prototype["colorAtCursor"] = function ()
    {
        var line, lines, mc, rng, state, text, word, x, y

        state = this.editor.state
        mc = state.mainCursor()
        lines = state.s.lines
        var _a_ = mc; x = _a_[0]; y = _a_[1]

        if (y < 0 || y >= lines.length)
        {
            return
        }
        line = lines[y]
        if (_k_.empty(line))
        {
            return
        }
        word = state.wordAtCursor()
        rng = belt.rangeOfClosestWordToPos(lines,mc)
        if (_k_.empty(word) || _k_.empty(rng))
        {
            if (x < line.length && kseg.str(line.slice(x, x + 1)) === '#')
            {
                word = belt.wordAtPos(lines,[x + 1,y])
                rng = belt.rangeOfClosestWordToPos(lines,[x + 1,y])
            }
        }
        if (_k_.empty(word) || _k_.empty(rng))
        {
            return
        }
        if (_k_.empty(color.values(word)))
        {
            return
        }
        text = word
        if (rng[0] > 0 && kseg.str(line.slice(rng[0] - 1, typeof rng[0] === 'number' ? rng[0] : -1)) === '#')
        {
            text = '#' + text
            rng = [rng[0] - 1,rng[1],rng[2],rng[3]]
        }
        return {text:text,range:rng}
    }

    funcol.prototype["replaceColor"] = function (hex)
    {
        var lines, state, text, x1, x2, y

        if (_k_.empty(hex))
        {
            return
        }
        if (_k_.empty(this.colorReplace))
        {
            return
        }
        var _a_ = this.colorReplace.range; x1 = _a_[0]; y = _a_[1]; x2 = _a_[2]

        state = this.editor.state
        lines = state.s.lines.asMutable()
        if (y < 0 || y >= lines.length)
        {
            return
        }
        text = hex
        if (this.colorReplace.text[0] !== '#' && text[0] === '#')
        {
            text = text.slice(1)
        }
        kutil.replace(lines[y],x1,(x2 - x1),kseg(text))
        state.setLines(lines)
        return this.colorReplace = null
    }

    funcol.prototype["layout"] = function (x, y, w, h)
    {
        var ph

        ph = (this.colorpicker.visible() ? _k_.min(this.colorpicker.height,h - 1) : 0)
        if (ph < 1)
        {
            ph = 0
        }
        this.funtree.layout(x,y,w,h - ph)
        if (ph)
        {
            this.colorpicker.layout(x,y + h - ph,w,ph)
        }
        this.knob.layout(x,y,1,h)
        return funcol.__super__.layout.call(this,x,y,w,h)
    }

    funcol.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        this.cells.fill_rect(0,1,-1,-1,' ',null,theme.funtree.bg)
        this.cells.fill_rect(0,0,-1,0,' ',null,theme.gutter.bg)
        this.funtree.draw()
        if (this.colorpicker.visible())
        {
            this.colorpicker.draw()
        }
        this.knob.draw()
        return funcol.__super__.draw.call(this)
    }

    funcol.prototype["onContext"] = function (event)
    {
        if (!this.hover)
        {
            return
        }
        console.log(`funcol.onContext: ${this.hover}`,event)
    }

    funcol.prototype["onFuncolResize"] = function ()
    {
        return this.knob.doDrag = true
    }

    funcol.prototype["onFuncolToggle"] = function ()
    {
        var cols

        if (!(this.visible() && this.collapsed()))
        {
            this.toggle()
        }
        this.active = this.visible()
        ked_session.set('funcol▸active',this.active)
        cols = _k_.max(16,parseInt(this.cells.screen.cols / 6))
        return post.emit('view.size',this.name,'left',((this.hidden() ? -this.cells.cols : cols - this.cells.cols)))
    }

    funcol.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        ret = funcol.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.knob.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        if (this.colorpicker.visible())
        {
            ret = this.colorpicker.onMouse(event)
            if ((ret != null ? ret.redraw : undefined))
            {
                return ret
            }
        }
        ret = this.funtree.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
    }

    funcol.prototype["onWheel"] = function (event)
    {
        var ret

        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        if (this.colorpicker.visible())
        {
            if (ret = this.colorpicker.onWheel(event))
            {
                return ret
            }
        }
        return this.funtree.onWheel(event)
    }

    funcol.prototype["onKey"] = function (key, event)
    {
        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        if (this.colorpicker.visible() && this.colorpicker.hasFocus())
        {
            return this.colorpicker.onKey(key,event)
        }
        if (!this.funtree.hasFocus())
        {
            return
        }
        return this.funtree.onKey(key,event)
    }

    return funcol
})()

export default funcol;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTtJQUFLO0lBQU07SUFBSzs7T0FDaEIsWUFBVDtPQUFlLFlBQWY7O09BQ1ksV0FBUDs7T0FDSSxXQUFaO09BQWlCLFdBQWpCOztPQUNZLGNBQUE7T0FBUSxrQkFBQTs7O0FBRWxCLFVBQVQ7O3VCQUF3QjthQUVwQixRQUFHLFFBQVEsUUFBTzs7UUFBUjs7Ozs7Ozs7Ozs7OzsrQ0FFQSxPQUFPLFNBQVM7UUFFdEIsS0FBQyxZQUFZO1FBQ2IsS0FBQyxTQUFZO1FBQ2IsS0FBQyxlQUFlO1FBRWhCLEtBQUMsY0FBYztRQUVmLEtBQUMsV0FBYyxLQUFRLFVBQVcsS0FBQztRQUNuQyxLQUFDLGNBQWMsUUFBUSxLQUFDLFVBQVUsS0FBQyxnQkFBZ0I7UUFDbkQsS0FBQyxrQkFBa0IsWUFBWSxVQUFVLEtBQUM7UUFFMUMsS0FBQyxLQUFLLFlBQVk7UUFFbEIsS0FBQyxRQUFRLFNBQVMsS0FBZ0IsTUFBTSxRQUFRO1FBQ2hELEtBQUMsUUFBUSxTQUFTLFFBQWdCLEtBQUMsUUFBUSxNQUFNO1FBQ2pELEtBQUMsUUFBUSxTQUFTLGNBQWdCLEtBQUMsUUFBUSxNQUFNO1FBQ2pELEtBQUMsUUFBUSxTQUFTLGVBQWdCLEtBQUMsUUFBUSxNQUFNO1FBQ2pELEtBQUMsUUFBUSxPQUFPLFNBQVMsS0FBUyxLQUFDLFFBQVEsTUFBTTtRQUVqRCxLQUFDLEtBQVEsU0FBUyxLQUFnQixLQUFDLFFBQVEsTUFBTTtRQUVqRCxLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUc7O21CQUFtQixLQUFDLFFBQVE7O1FBQ3BDLEtBQUssR0FBRyxtQkFBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcscUJBQXFC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funcol.kode
