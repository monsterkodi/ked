var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
import uniko from "./uniko.js"


funcol = (function ()
{
    _k_.extend(funcol, view)
    function funcol (screen, editor, features)
    {
        this.editor = editor
    
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onFuncolShow"] = this["onFuncolShow"].bind(this)
        this["onFuncolToggle"] = this["onFuncolToggle"].bind(this)
        this["onFuncolResize"] = this["onFuncolResize"].bind(this)
        this["onContext"] = this["onContext"].bind(this)
        this["onUnikoShow"] = this["onUnikoShow"].bind(this)
        this["onColorPickerShow"] = this["onColorPickerShow"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        funcol.__super__.constructor.call(this,screen,'funcol',features)
        this.isVisible = false
        this.active = false
        this.colorReplace = null
        this.colorDecorate = null
        this.pointerType = 'pointer'
        this.knob = new knob(screen,`${this.name}_knob`)
        this.funtree = new funtree(this.editor,`${this.name}_funtree`,['scrllr'])
        this.colorpicker = new colorpicker(screen,this.editor,`${this.name}_colorpicker`)
        this.uniko = new uniko(screen,this.editor,`${this.name}_uniko`)
        this.knob.frameSide = 'left'
        this.funtree.setColor('bg',theme.funtree.bg)
        this.funtree.setColor('empty',this.funtree.color.bg)
        this.funtree.setColor('cursor_main',this.funtree.color.bg)
        this.funtree.setColor('cursor_empty',this.funtree.color.bg)
        this.funtree.scroll.setColor('bg',this.funtree.color.bg)
        this.knob.setColor('bg',this.funtree.color.bg)
        post.on('funcol.resize',this.onFuncolResize)
        post.on('funcol.toggle',this.onFuncolToggle)
        post.on('funcol.show',this.onFuncolShow)
        post.on('session.merge',this.onSessionMerge)
        post.on('funcol.focus',(function ()
        {
            return this.funtree.grabFocus()
        }).bind(this))
        post.on('colorpicker.show',this.onColorPickerShow)
        post.on('uniko.show',this.onUnikoShow)
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
        this.active = true
        if (this.cells.cols < 16)
        {
            this.cells.cols = _k_.max(16,parseInt(this.cells.screen.cols / 6))
        }
        if (this.hidden())
        {
            this.show()
        }
        this.colorpicker.show()
        ked_session.set('funcol▸active',this.active)
        return post.emit('redraw')
    }

    funcol.prototype["onUnikoShow"] = function ()
    {
        this.active = true
        if (this.hidden())
        {
            this.show()
        }
        this.uniko.show()
        ked_session.set('funcol▸active',this.active)
        return post.emit('redraw')
    }

    funcol.prototype["layout"] = function (x, y, w, h)
    {
        var ph, uh

        ph = (this.colorpicker.visible() ? _k_.min(this.colorpicker.height,h - 1) : 0)
        if (ph < 1)
        {
            ph = 0
        }
        uh = (this.uniko.visible() ? _k_.min(this.uniko.height,h - ph - 1) : 0)
        if (uh < 1)
        {
            uh = 0
        }
        this.funtree.layout(x,y,w,h - ph - uh)
        if (uh)
        {
            this.uniko.layout(x,y + h - ph - uh,w,uh)
        }
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
        if (this.uniko.visible())
        {
            this.uniko.draw()
        }
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

        this.toggle()
        this.active = this.visible()
        ked_session.set('funcol▸active',this.active)
        cols = _k_.max(16,parseInt(this.cells.screen.cols / 6))
        post.emit('view.size',this.name,'left',((this.hidden() ? -this.cells.cols : cols - this.cells.cols)))
        if (this.hidden())
        {
            return post.emit('focus','editor')
        }
        else
        {
            return this.funtree.grabFocus()
        }
    }

    funcol.prototype["onFuncolShow"] = function ()
    {
        if (this.hidden())
        {
            return this.onFuncolToggle()
        }
        else
        {
            return this.funtree.grabFocus()
        }
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
        ret = this.uniko.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.colorpicker.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
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
        if (this.uniko.visible())
        {
            if (ret = this.uniko.onWheel(event))
            {
                return ret
            }
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
        if (this.uniko.onKey(key,event))
        {
            return true
        }
        if (this.colorpicker.onKey(key,event))
        {
            return true
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSzs7T0FDaEIsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWY7T0FBb0IsV0FBcEI7O09BQ2UsY0FBQTtPQUFRLGtCQUFBO09BQVksWUFBQTs7O0FBQ3pDLFVBQUQ7O3VCQUFRO2FBQ0osUUFBRyxRQUFRLFFBQU87O1FBQVI7Ozs7Ozs7Ozs7OzsrQ0FFQSxPQUFPLFNBQVM7UUFFdEIsS0FBQyxZQUFnQjtRQUNqQixLQUFDLFNBQWdCO1FBQ2pCLEtBQUMsZUFBZ0I7UUFDakIsS0FBQyxnQkFBZ0I7UUFFakIsS0FBQyxjQUFjO1FBRWYsS0FBQyxXQUFrQixLQUFZLFVBQWtCLEtBQUM7UUFDbEQsS0FBQyxjQUFrQixRQUFtQixLQUFDLFVBQVUsS0FBQyxnQkFBZ0I7UUFDbEUsS0FBQyxrQkFBa0IsWUFBWSxPQUFPLEtBQUMsVUFBVSxLQUFDO1FBQ2xELEtBQUMsWUFBa0IsTUFBWSxPQUFPLEtBQUMsVUFBVSxLQUFDO1FBRWxELEtBQUMsS0FBSyxZQUFZO1FBRWxCLEtBQUMsUUFBUSxTQUFTLEtBQWdCLE1BQU0sUUFBUTtRQUNoRCxLQUFDLFFBQVEsU0FBUyxRQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsU0FBUyxjQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsU0FBUyxlQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsT0FBTyxTQUFTLEtBQVMsS0FBQyxRQUFRLE1BQU07UUFFakQsS0FBQyxLQUFRLFNBQVMsS0FBZ0IsS0FBQyxRQUFRLE1BQU07UUFFakQsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funcol.kode
