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
            this.setActive(true)
            this.show()
        }
        return ked_session.set('funcol',recent.funcol)
    }

    funcol.prototype["onColorPickerShow"] = function (hexl, opt = {focus:true})
    {
        this.setActive(true)
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
        this.setActive(true)
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
        this.setActive(this.visible())
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSzs7T0FDaEIsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWY7T0FBb0IsV0FBcEI7O09BQ2UsY0FBQTtPQUFRLGdCQUFBO09BQVUsa0JBQUE7T0FBWSxZQUFBOzs7QUFDbkQsVUFBRDs7dUJBQVE7YUFDSixRQUFJLFFBQVEsUUFBTzs7UUFBaEI7UUFBUTs7Ozs7Ozs7Ozs7OzsrQ0FFRCxLQUFDLE9BQU8sU0FBUztRQUV2QixLQUFDLFlBQWdCO1FBQ2pCLEtBQUMsZUFBZ0I7UUFDakIsS0FBQyxnQkFBZ0I7UUFFakIsS0FBQyxjQUFjO1FBRWYsS0FBQyxXQUFrQixLQUFZLEtBQUMsVUFBa0IsS0FBQztRQUNuRCxLQUFDLGNBQWtCLFFBQW9CLEtBQUMsVUFBVSxLQUFDLGdCQUFnQjtRQUNuRSxLQUFDLGdCQUFrQixVQUFZLEtBQUMsT0FBTyxLQUFDLFVBQVUsS0FBQyxpQkFBaUI7UUFDcEUsS0FBQyxrQkFBa0IsWUFBWSxLQUFDLE9BQU8sS0FBQyxVQUFVLEtBQUM7UUFDbkQsS0FBQyxZQUFrQixNQUFZLEtBQUMsT0FBTyxLQUFDLFVBQVUsS0FBQztRQUVuRCxLQUFDLGNBQWUsS0FBQyxLQUFLLEtBQUMsTUFBTSxLQUFDLFlBQVksS0FBQyxRQUFRLEtBQUM7UUFDcEQsS0FBQyxjQUFxQixLQUFDLE1BQU0sS0FBQyxZQUFZLEtBQUMsUUFBUSxLQUFDO1FBRXBELEtBQUMsS0FBSyxZQUFZO1FBRWxCLEtBQUMsUUFBUSxTQUFTLEtBQWdCLE1BQU0sUUFBUTtRQUNoRCxLQUFDLFFBQVEsU0FBUyxRQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsU0FBUyxjQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsU0FBUyxl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
//# sourceURL=../../../../kode/ked/view/colmns/funcol.kode
