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
        this["colorpickerVisible"] = this["colorpickerVisible"].bind(this)
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

    funcol.prototype["colorpickerVisible"] = function ()
    {
        return this.visible() && this.active && this.colorpicker.visible()
    }

    funcol.prototype["layout"] = function (x, y, w, h)
    {
        var ph, uh

        ph = (this.colorpicker.visible() ? _k_.min(this.colorpicker.pickerHeight(),h - 1) : 0)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSzs7T0FDaEIsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWY7T0FBb0IsV0FBcEI7O09BQ2UsY0FBQTtPQUFRLGtCQUFBO09BQVksWUFBQTs7O0FBQ3pDLFVBQUQ7O3VCQUFRO2FBQ0osUUFBRyxRQUFRLFFBQU87O1FBQVI7Ozs7Ozs7Ozs7Ozs7K0NBRUEsT0FBTyxTQUFTO1FBRXRCLEtBQUMsWUFBZ0I7UUFDakIsS0FBQyxTQUFnQjtRQUNqQixLQUFDLGVBQWdCO1FBQ2pCLEtBQUMsZ0JBQWdCO1FBRWpCLEtBQUMsY0FBYztRQUVmLEtBQUMsV0FBa0IsS0FBWSxVQUFrQixLQUFDO1FBQ2xELEtBQUMsY0FBa0IsUUFBbUIsS0FBQyxVQUFVLEtBQUMsZ0JBQWdCO1FBQ2xFLEtBQUMsa0JBQWtCLFlBQVksT0FBTyxLQUFDLFVBQVUsS0FBQztRQUNsRCxLQUFDLFlBQWtCLE1BQVksT0FBTyxLQUFDLFVBQVUsS0FBQztRQUVsRCxLQUFDLEtBQUssWUFBWTtRQUVsQixLQUFDLFFBQVEsU0FBUyxLQUFnQixNQUFNLFFBQVE7UUFDaEQsS0FBQyxRQUFRLFNBQVMsUUFBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLFNBQVMsY0FBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLFNBQVMsZUFBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFTLEtBQUMsUUFBUSxNQUFNO1FBRWpELEtBQUMsS0FBUSxTQUFTLEtBQWdCLEtBQUMsUUFBUSxNQUFNO1FBRWpELEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGNBQWdCLEtB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funcol.kode
