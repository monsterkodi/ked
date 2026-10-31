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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSzs7T0FDaEIsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWY7T0FBb0IsV0FBcEI7O09BQ2UsY0FBQTtPQUFRLGtCQUFBO09BQVksWUFBQTs7O0FBRWpDLFVBQVQ7O3VCQUF3QjthQUVwQixRQUFHLFFBQVEsUUFBTzs7UUFBUjs7Ozs7Ozs7Ozs7K0NBRUEsT0FBTyxTQUFTO1FBRXRCLEtBQUMsWUFBZ0I7UUFDakIsS0FBQyxTQUFnQjtRQUNqQixLQUFDLGVBQWdCO1FBQ2pCLEtBQUMsZ0JBQWdCO1FBRWpCLEtBQUMsY0FBYztRQUVmLEtBQUMsV0FBa0IsS0FBWSxVQUFrQixLQUFDO1FBQ2xELEtBQUMsY0FBa0IsUUFBbUIsS0FBQyxVQUFVLEtBQUMsZ0JBQWdCO1FBQ2xFLEtBQUMsa0JBQWtCLFlBQVksT0FBTyxLQUFDLFVBQVUsS0FBQztRQUNsRCxLQUFDLFlBQWtCLE1BQVksT0FBTyxLQUFDLFVBQVUsS0FBQztRQUVsRCxLQUFDLEtBQUssWUFBWTtRQUVsQixLQUFDLFFBQVEsU0FBUyxLQUFnQixNQUFNLFFBQVE7UUFDaEQsS0FBQyxRQUFRLFNBQVMsUUFBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLFNBQVMsY0FBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLFNBQVMsZUFBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFTLEtBQUMsUUFBUSxNQUFNO1FBRWpELEtBQUMsS0FBUSxTQUFTLEtBQWdCLEtBQUMsUUFBUSxNQUFNO1FBRWpELEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRzs7bUJBQW1CLEtBQUMsUUFBUTs7UUFDcEMsS0FBSyxHQUFHLG1CQUFvQixLQUFDO1FBRTdCLEtBQUssR0FBRyxhQUFvQixLQUFDOzs7c0JBRWpDLDZCQUFnQjs7c0JBRUQsT0FBTzs7OztZQUVmLE9BQU8sT0FBTzs7WUFDYixLQUFDLFNBQVM7WUFDVixLQUFDOztlQUVMLFlBQVksSUFBSSxTQUFTLE9BQU87OztzQkFFcEMsZ0NBQW1COztRQUVmLEtBQUMsU0FBUztZQUNDLEtBQUM7O1lBQVosS0FBQzs7UUFFRCxLQUFDLFlBQVk7UUFFYixZQUFZLElBQUksZ0JBQWdCLEtBQUM7ZUFDakMsS0FBSyxLQUFLOzs7c0JBRWQ7O1FBRUksS0FBQyxTQUFTO1lBQ0MsS0FBQzs7WUFBWixLQUFDOztRQUVELEtBQUMsTUFBTTtRQUVQLFlBQVksSUFBSSxnQkFBZ0IsS0FBQztlQUNqQyxLQUFLLEtBQUs7OztzQkFrR2QscUJBQVEsR0FBRSxHQUFFLEdBQUU7Ozs7UUFFVixNQUFLLEtBQUMsWUFBWSxvQkFBZ0IsS0FBQyxZQUFZLE9BQU8sSUFBRSxLQUFLO1lBQ25ELEtBQUs7O1lBQWYsS0FBSzs7UUFFTCxNQUFLLEtBQUMsTUFBTSxvQkFBZ0IsS0FBQyxNQUFNLE9BQU8sSUFBRSxLQUFHLEtBQUs7WUFDMUMsS0FBSzs7WUFBZixLQUFLOztRQUVMLEtBQUMsUUFBUSxPQUFXLEVBQUUsRUFBRSxFQUFFLElBQUUsS0FBRztZQUNTOztZQUF4QyxLQUFDLE1BQU0sT0FBYSxFQUFFLElBQUUsSUFBRSxLQUFHLEdBQUcsRUFBRTs7WUFDRzs7WUFBckMsS0FBQyxZQUFZLE9BQU8sRUFBRSxJQUFFLElBQUUsR0FBRyxFQUFFOztRQUMvQixLQUFDLEtBQUssT0FBYyxFQUFFLEVBQUUsRUFBRTtpREFFcEIsRUFBRSxFQUFFLEVBQUU7OztzQkFRaEI7O1lBRVMsS0FBQyxZQUFZLEtBQUMsZ0JBQW1CLEtBQUM7Ozs7UUFFdkMsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssTUFBTSxRQUFRO1FBQ2xELEtBQUMsTUFBTSxVQUFVLEVBQUUsRUFBRSxHQUFJLEVBQUUsSUFBSSxLQUFLLE1BQU0sT0FBTztRQUVqRCxLQUFDLFFBQVE7WUFDUSxLQUFDLE1BQU07O1lBQXhCLEtBQUMsTUFBTTs7WUFDZ0IsS0FBQyxZQUFZOztZQUFwQyxLQUFDLFlBQVk7O1FBQ2IsS0FBQyxLQUFLOzs7O3NCQVVWLHdCQUFXOzthQUVFLEtBQUM7Ozs7UUFFVixpQ0FBeUIsS0FBQyxRQUFROzs7c0JBUXRDOztlQUFtQixLQUFDLEtBQUssU0FBUzs7O3NCQUNsQzs7OztjQUVzQixLQUFDLGFBQWMsS0FBQzs7WUFBbEMsS0FBQzs7UUFDRCxLQUFDLFNBQVMsS0FBQztRQUNYLFlBQVksSUFBSSxnQkFBZ0IsS0FBQztRQUNqQyxlQUFXLFlBQU8sS0FBQyxNQUFNLE9BQU8sT0FBTztlQUN2QyxLQUFLLEtBQUssWUFBWSxLQUFDLEtBQUssU0FBUSxLQUFDLFlBQVksS0FBQyxNQUFNLE9BQU8sT0FBSyxLQUFDLE1BQU07OztzQkFRL0Usc0JBQVM7Ozs7WUFFQSxLQUFDLFlBQVksS0FBQyxnQkFBbUIsS0FBQzs7OztRQUV2Qyx5Q0FBWTthQUFnQyxjQUFBLElBQUs7O21CQUFaOztRQUNyQyxNQUFNLEtBQUMsS0FBSyxRQUFRO2FBQXdCLGNBQUEsSUFBSzs7bUJBQVo7O1FBQ3JDLE1BQU0sS0FBQyxNQUFNLFFBQVE7YUFBdUIsY0FBQSxJQUFLOzttQkFBWjs7UUFDckMsTUFBTSxLQUFDLFlBQVksUUFBUTthQUFpQixjQUFBLElBQUs7O21CQUFaOztRQUNyQyxNQUFNLEtBQUMsUUFBUSxRQUFRO2FBQXFCLGNBQUEsSUFBSzs7bUJBQVo7Ozs7c0JBUXpDLHNCQUFTOzs7O1lBRUEsS0FBQyxZQUFZLEtBQUMsZ0JBQW1CLEtBQUM7Ozs7WUFFcEMsS0FBQyxNQUFNOztnQkFDSCxNQUFNLEtBQUMsTUFBTSxRQUFROzt1QkFDbEI7OztZQUVQLEtBQUMsWUFBWTs7Z0JBQ1QsTUFBTSxLQUFDLFlBQVksUUFBUTs7dUJBQ3hCOzs7ZUFFVixLQUFDLFFBQVEsUUFBUTs7O3NCQVFyQixvQkFBTyxLQUFJOztZQUVGLEtBQUMsWUFBWSxLQUFDLGdCQUFtQixLQUFDOzs7O1lBSzdCLEtBQUMsTUFBTSxNQUFNLElBQUk7O21CQUF6Qjs7WUFFUSxLQUFDLFlBQVksTUFBTSxJQUFJOzttQkFBL0I7O2FBRU8sS0FBQyxRQUFROzs7O2VBRWxCLEtBQUMsUUFBUSxNQUFNLElBQUk7OztXQXZSbEI7OztlQXlSRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funcol.kode
