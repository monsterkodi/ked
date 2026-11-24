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
        this.sheeditor = new sheeditor(this.screen,this.editor,`${this.name}_sheeditor`,this)
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
            this.funtree.show()
            return this.colorpicker.hide()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSzs7T0FDaEIsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWY7T0FBb0IsV0FBcEI7O09BQ2UsY0FBQTtPQUFRLGdCQUFBO09BQVUsa0JBQUE7T0FBWSxZQUFBOzs7QUFDbkQsVUFBRDs7dUJBQVE7YUFDSixRQUFJLFFBQVEsUUFBTzs7UUFBaEI7UUFBUTs7Ozs7Ozs7Ozs7OzsrQ0FFRCxLQUFDLE9BQU8sU0FBUztRQUV2QixLQUFDLFlBQWdCO1FBQ2pCLEtBQUMsU0FBZ0I7UUFDakIsS0FBQyxlQUFnQjtRQUNqQixLQUFDLGdCQUFnQjtRQUVqQixLQUFDLGNBQWM7UUFFZixLQUFDLFdBQWtCLEtBQVksS0FBQyxVQUFrQixLQUFDO1FBQ25ELEtBQUMsY0FBa0IsUUFBb0IsS0FBQyxVQUFVLEtBQUMsZ0JBQWdCO1FBQ25FLEtBQUMsZ0JBQWtCLFVBQVksS0FBQyxPQUFPLEtBQUMsVUFBVSxLQUFDLGlCQUFpQjtRQUNwRSxLQUFDLGtCQUFrQixZQUFZLEtBQUMsT0FBTyxLQUFDLFVBQVUsS0FBQztRQUNuRCxLQUFDLFlBQWtCLE1BQVksS0FBQyxPQUFPLEtBQUMsVUFBVSxLQUFDO1FBRW5ELEtBQUMsY0FBZSxLQUFDLEtBQUssS0FBQyxNQUFNLEtBQUMsWUFBWSxLQUFDLFFBQVEsS0FBQztRQUNwRCxLQUFDLGNBQXFCLEtBQUMsTUFBTSxLQUFDLFlBQVksS0FBQyxRQUFRLEtBQUM7UUFFcEQsS0FBQyxLQUFLLFlBQVk7UUFFbEIsS0FBQyxRQUFRLFNBQVMsS0FBZ0IsTUFBTSxRQUFRO1FBQ2hELEtBQUMsUUFBUSxTQUFTLFFBQWdCLEtBQUMsUUFBUSxNQUFNO1FBQ2pELEtBQUMsUUFBUSxTQUFTLGNBQWdCLEtBQUMsUUFBUSxNQUFNO1FBQ2pE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
//# sourceURL=../../../../kode/ked/view/colmns/funcol.kode
