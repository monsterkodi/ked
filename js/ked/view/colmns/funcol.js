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
import sheeditor from "./sheeditor.js"
import colorpicker from "./colorpicker.js"
import uniko from "./uniko.js"


funcol = (function ()
{
    _k_.extend(funcol, view)
    function funcol (screen, editor, features)
    {
        this.screen = screen
        this.editor = editor
    
        this["onKey"] = this["onKey"].bind(this)
        this["onFuncolShow"] = this["onFuncolShow"].bind(this)
        this["onFuncolToggle"] = this["onFuncolToggle"].bind(this)
        this["onFuncolResize"] = this["onFuncolResize"].bind(this)
        this["focusTree"] = this["focusTree"].bind(this)
        this["onContext"] = this["onContext"].bind(this)
        this["colorpickerVisible"] = this["colorpickerVisible"].bind(this)
        this["onUnikoShow"] = this["onUnikoShow"].bind(this)
        this["onColorPickerShow"] = this["onColorPickerShow"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        funcol.__super__.constructor.call(this,this.screen,'funcol',features)
        this.isVisible = false
        this.active = false
        this.colorReplace = null
        this.colorDecorate = null
        this.pointerType = 'pointer'
        this.knob = new knob(this.screen,`${this.name}_knob`)
        this.funtree = new funtree(this.editor,`${this.name}_funtree`,['scrllr'])
        this.sheeditor = new sheeditor(this.screen,this.editor,`${this.name}_sheeditor`)
        this.colorpicker = new colorpicker(this.screen,this.editor,`${this.name}_colorpicker`)
        this.uniko = new uniko(this.screen,this.editor,`${this.name}_uniko`)
        this.mouseItems = [this.knob,this.uniko,this.colorpicker,this.funtree,this.sheeditor]
        this.wheelItems = [this.uniko,this.colorpicker,this.funtree,this.sheeditor]
        this.knob.frameSide = 'left'
        this.funtree.setColor('bg',theme.funtree.bg)
        this.funtree.setColor('empty',this.funtree.color.bg)
        this.funtree.setColor('cursor_main',this.funtree.color.bg)
        this.funtree.setColor('cursor_empty',this.funtree.color.bg)
        this.funtree.scroll.setColor('bg',this.funtree.color.bg)
        this.knob.setColor('bg',this.funtree.color.bg)
        post.on('session.merge',this.onSessionMerge)
        post.on('funcol.resize',this.onFuncolResize)
        post.on('funcol.toggle',this.onFuncolToggle)
        post.on('funcol.show',this.onFuncolShow)
        post.on('funcol.focus',this.focusTree)
        post.on('colorpicker.show',this.onColorPickerShow)
        post.on('uniko.show',this.onUnikoShow)
        post.on('file.loaded',this.onFileLoaded)
    }

    funcol.prototype["onFileLoaded"] = function (path)
    {
        if (slash.ext(path) === 'sheet')
        {
            this.sheeditor.show()
            return this.funtree.hide()
        }
        else
        {
            this.sheeditor.hide()
            return this.funtree.show()
        }
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

    funcol.prototype["onColorPickerShow"] = function (hexl, opt = {focus:true})
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
        this.colorpicker.show(hexl,opt)
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
        this.sheeditor.layout(x,y,w,h - ph - uh)
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
        this.sheeditor.draw()
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

    funcol.prototype["focusTree"] = function ()
    {
        if (this.sheeditor.visible())
        {
            return this.sheeditor.grabFocus()
        }
        else
        {
            return this.funtree.grabFocus()
        }
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
            return this.focusTree()
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
            return this.focusTree()
        }
    }

    funcol.prototype["onKey"] = function (key, event)
    {
        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        switch (key)
        {
            case 'shift+alt+cmd+[':
                return post.emit('view.size',this.name,'left',1)

            case 'shift+alt+cmd+]':
                return post.emit('view.size',this.name,'left',-1)

        }

        if (this.uniko.onKey(key,event))
        {
            return true
        }
        if (this.colorpicker.onKey(key,event))
        {
            return true
        }
        if (this.funtree.hasFocus())
        {
            return this.funtree.onKey(key,event)
        }
        if (this.sheeditor.hasFocus())
        {
            return this.sheeditor.onKey(key,event)
        }
    }

    return funcol
})()

export default funcol;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSzs7T0FDaEIsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWY7T0FBb0IsV0FBcEI7O09BQ2UsY0FBQTtPQUFRLGdCQUFBO09BQVUsa0JBQUE7T0FBWSxZQUFBOzs7QUFDbkQsVUFBRDs7dUJBQVE7YUFDSixRQUFJLFFBQVEsUUFBTzs7UUFBaEI7UUFBUTs7Ozs7Ozs7Ozs7OzsrQ0FFRCxLQUFDLE9BQU8sU0FBUztRQUV2QixLQUFDLFlBQWdCO1FBQ2pCLEtBQUMsU0FBZ0I7UUFDakIsS0FBQyxlQUFnQjtRQUNqQixLQUFDLGdCQUFnQjtRQUVqQixLQUFDLGNBQWM7UUFFZixLQUFDLFdBQWtCLEtBQVksS0FBQyxVQUFrQixLQUFDO1FBQ25ELEtBQUMsY0FBa0IsUUFBb0IsS0FBQyxVQUFVLEtBQUMsZ0JBQWdCO1FBQ25FLEtBQUMsZ0JBQWtCLFVBQVksS0FBQyxPQUFPLEtBQUMsVUFBVSxLQUFDO1FBQ25ELEtBQUMsa0JBQWtCLFlBQVksS0FBQyxPQUFPLEtBQUMsVUFBVSxLQUFDO1FBQ25ELEtBQUMsWUFBa0IsTUFBWSxLQUFDLE9BQU8sS0FBQyxVQUFVLEtBQUM7UUFFbkQsS0FBQyxjQUFlLEtBQUMsS0FBSyxLQUFDLE1BQU0sS0FBQyxZQUFZLEtBQUMsUUFBUSxLQUFDO1FBQ3BELEtBQUMsY0FBcUIsS0FBQyxNQUFNLEtBQUMsWUFBWSxLQUFDLFFBQVEsS0FBQztRQUVwRCxLQUFDLEtBQUssWUFBWTtRQUVsQixLQUFDLFFBQVEsU0FBUyxLQUFnQixNQUFNLFFBQVE7UUFDaEQsS0FBQyxRQUFRLFNBQVMsUUFBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLFNBQVMsY0FBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxR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
//# sourceURL=../../../../kode/ked/view/colmns/funcol.kode
