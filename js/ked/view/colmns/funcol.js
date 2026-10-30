var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var funcol

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

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
        this["onColorPickerShow"] = this["onColorPickerShow"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        funcol.__super__.constructor.call(this,screen,'funcol',features)
        this.isVisible = false
        this.active = false
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
        if (this.hidden())
        {
            this.show()
        }
        this.colorpicker.show(hex)
        ked_session.set('funcol▸active',this.active)
        return post.emit('redraw')
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
        ret = this.funtree.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
    }

    funcol.prototype["onWheel"] = function (event)
    {
        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTtJQUFLOztPQUNMLFlBQVQ7T0FBZSxZQUFmOztPQUNTLFdBQVo7T0FBaUIsV0FBakI7O09BQ1ksY0FBQTtPQUFRLGtCQUFBOzs7QUFFbEIsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUcsUUFBUSxRQUFPOztRQUFSOzs7Ozs7Ozs7OytDQUVBLE9BQU8sU0FBUztRQUV0QixLQUFDLFlBQVk7UUFDYixLQUFDLFNBQVk7UUFFYixLQUFDLGNBQWM7UUFFZixLQUFDLFdBQWMsS0FBUSxVQUFXLEtBQUM7UUFDbkMsS0FBQyxjQUFjLFFBQVEsS0FBQyxVQUFVLEtBQUMsZ0JBQWdCO1FBQ25ELEtBQUMsa0JBQWtCLFlBQVksVUFBVSxLQUFDO1FBRTFDLEtBQUMsS0FBSyxZQUFZO1FBRWxCLEtBQUMsUUFBUSxTQUFTLEtBQWdCLE1BQU0sUUFBUTtRQUNoRCxLQUFDLFFBQVEsU0FBUyxRQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsU0FBUyxjQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsU0FBUyxlQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsT0FBTyxTQUFTLEtBQVMsS0FBQyxRQUFRLE1BQU07UUFFakQsS0FBQyxLQUFRLFNBQVMsS0FBZ0IsS0FBQyxRQUFRLE1BQU07UUFFakQsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHOzttQkFBbUIsS0FBQyxRQUFROztRQUNwQyxLQUFLLEdBQUcsbUJBQW1CLEtBQUM7OztzQkFFaEMsNkJBQWdCOztzQkFFQSxPQUFPOzs7O1lBRWhCLE9BQU8sT0FBTzs7WUFDYixLQUFDLFNBQVM7WUFDVixLQUFDOztlQUVMLFlBQVksSUFBSSxTQUFTLE9BQU87OztzQkFFcEMsZ0NBQW1COztRQUVmLEtBQUMsU0FBUztZQUNDLEtBQUM7O1lBQVosS0FBQzs7UUFFRCxLQUFDLFlBQVksS0FBSztRQUVsQixZQUFZLElBQUksZ0JBQWdCLEtBQUM7ZUFDakMsS0FBSyxLQUFLOzs7c0JBUWQscUJBQVEsR0FBRSxHQUFFLEdBQUU7Ozs7UUFFVixNQUFLLEtBQUMsWUFBWSxvQkFBZ0IsS0FBQyxZQUFZLE9BQU8sSUFBRSxLQUFLO1lBQ25ELEtBQUs7O1lBQWYsS0FBSzs7UUFFTCxLQUFDLFFBQVEsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFFO1lBQ2E7O1lBQXJDLEtBQUMsWUFBWSxPQUFPLEVBQUUsSUFBRSxJQUFFLEdBQUcsRUFBRTs7UUFDL0IsS0FBQyxLQUFLLE9BQVUsRUFBRSxFQUFFLEVBQUU7aURBRWhCLEVBQUUsRUFBRSxFQUFFOzs7c0JBUWhCOztZQUVVLEtBQUMsWUFBWSxLQUFDLGdCQUFtQixLQUFDOzs7O1FBRXhDLEtBQUMsTUFBTSxVQUFVLEVBQUUsRUFBRSxHQUFHLEdBQUcsSUFBSSxLQUFLLE1BQU0sUUFBUTtRQUNsRCxLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBSSxFQUFFLElBQUksS0FBSyxNQUFNLE9BQU87UUFFakQsS0FBQyxRQUFRO1lBQ2MsS0FBQyxZQUFZOztZQUFwQyxLQUFDLFlBQVk7O1FBQ2IsS0FBQyxLQUFLOzs7O3NCQVVWLHdCQUFXOzthQUVHLEtBQUM7Ozs7UUFFWCxpQ0FBeUIsS0FBQyxRQUFROzs7c0JBUXRDOztlQUFtQixLQUFDLEtBQUssU0FBUzs7O3NCQUNsQzs7OztjQUVzQixLQUFDLGFBQWMsS0FBQzs7WUFBbEMsS0FBQzs7UUFDRCxLQUFDLFNBQVMsS0FBQztRQUNYLFlBQVksSUFBSSxnQkFBZ0IsS0FBQztRQUNqQyxlQUFXLFlBQU8sS0FBQyxNQUFNLE9BQU8sT0FBTztlQUN2QyxLQUFLLEtBQUssWUFBWSxLQUFDLEtBQUssU0FBUSxLQUFDLFlBQVksS0FBQyxNQUFNLE9BQU8sT0FBSyxLQUFDLE1BQU07OztzQkFRL0Usc0JBQVM7Ozs7WUFFQyxLQUFDLFlBQVksS0FBQyxnQkFBbUIsS0FBQzs7OztRQUV4Qyx5Q0FBWTthQUE2QixjQUFBLElBQUs7O21CQUFaOztRQUNsQyxNQUFNLEtBQUMsS0FBSyxRQUFRO2FBQXFCLGNBQUEsSUFBSzs7bUJBQVo7O1FBQ2xDLE1BQU0sS0FBQyxRQUFRLFFBQVE7YUFBa0IsY0FBQSxJQUFLOzttQkFBWjs7OztzQkFRdEMsc0JBQVM7O1lBRUMsS0FBQyxZQUFZLEtBQUMsZ0JBQW1CLEtBQUM7Ozs7ZUFDeEMsS0FBQyxRQUFRLFFBQVE7OztzQkFRckIsb0JBQU8sS0FBSTs7WUFFRCxLQUFDLFlBQVksS0FBQyxnQkFBbUIsS0FBQzs7OztZQUVyQyxLQUFDLFlBQVksYUFBYyxLQUFDLFlBQVk7O21CQUNwQyxLQUFDLFlBQVksTUFBTSxJQUFJOzthQUVwQixLQUFDLFFBQVE7Ozs7ZUFFbkIsS0FBQyxRQUFRLE1BQU0sSUFBSTs7O1dBMUpsQjs7O2VBNEpGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funcol.kode
