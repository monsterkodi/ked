var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var funcol

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import knob from "../base/knob.js"

import funtree from "./funtree.js"


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
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        funcol.__super__.constructor.call(this,screen,'funcol',features)
        this.isVisible = false
        this.active = false
        this.pointerType = 'pointer'
        this.knob = new knob(screen,`${this.name}_knob`)
        this.funtree = new funtree(this.editor,`${this.name}_funtree`,['scrllr'])
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

    funcol.prototype["layout"] = function (x, y, w, h)
    {
        this.funtree.layout(x,y,w,h)
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
        if (!this.funtree.hasFocus())
        {
            return
        }
        return this.funtree.onKey(key,event)
    }

    return funcol
})()

export default funcol;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhUyxVQUFUOzt1QkFBd0I7YUFFcEIsUUFBRyxRQUFPLFFBQVE7Ozs7Ozs7Ozs7OytDQUVSLE9BQU8sU0FBUztRQUV0QixLQUFDLFlBQVk7UUFDYixLQUFDLFNBQVk7UUFFYixLQUFDLGNBQWM7UUFFZixLQUFDLFdBQWMsS0FBUSxVQUFXLEtBQUM7UUFDbkMsS0FBQyxjQUFjLFFBQVEsS0FBQyxVQUFVLEtBQUMsZ0JBQWdCO1FBRW5ELEtBQUMsS0FBSyxZQUFZO1FBRWxCLEtBQUMsUUFBUSxTQUFTLEtBQWdCLE1BQU0sUUFBUTtRQUNoRCxLQUFDLFFBQVEsU0FBUyxRQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsU0FBUyxjQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsU0FBUyxlQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsT0FBTyxTQUFTLEtBQVMsS0FBQyxRQUFRLE1BQU07UUFFakQsS0FBQyxLQUFRLFNBQVMsS0FBZ0IsS0FBQyxRQUFRLE1BQU07UUFFakQsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHOzttQkFBbUIsS0FBQyxRQUFROzs7O3NCQUV4Qyw2QkFBZ0I7O3NCQUVBLE9BQU87Ozs7WUFFaEIsT0FBTyxPQUFPOztZQUNiLEtBQUMsU0FBUztZQUNWLEtBQUM7O2VBRUwsWUFBWSxJQUFJLFNBQVMsT0FBTzs7O3NCQVFwQyxxQkFBUSxHQUFFLEdBQUUsR0FBRTs7UUFFVixLQUFDLFFBQVEsT0FBTyxFQUFFLEVBQUUsRUFBRTtRQUN0QixLQUFDLEtBQUssT0FBVSxFQUFFLEVBQUUsRUFBRTtpREFFaEIsRUFBRSxFQUFFLEVBQUU7OztzQkFRaEI7O1lBRVUsS0FBQyxZQUFZLEtBQUMsZ0JBQW1CLEtBQUM7Ozs7UUFFeEMsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssTUFBTSxRQUFRO1FBQ2xELEtBQUMsTUFBTSxVQUFVLEVBQUUsRUFBRSxHQUFJLEVBQUUsSUFBSSxLQUFLLE1BQU0sT0FBTztRQUVqRCxLQUFDLFFBQVE7UUFDVCxLQUFDLEtBQUs7Ozs7c0JBVVYsd0JBQVc7O2FBRUcsS0FBQzs7OztRQUVYLGlDQUF5QixLQUFDLFFBQVE7OztzQkFRdEM7O2VBQW1CLEtBQUMsS0FBSyxTQUFTOzs7c0JBQ2xDOzs7O2NBRXNCLEtBQUMsYUFBYyxLQUFDOztZQUFsQyxLQUFDOztRQUNELEtBQUMsU0FBUyxLQUFDO1FBQ1gsWUFBWSxJQUFJLGdCQUFnQixLQUFDO1FBQ2pDLGVBQVcsWUFBTyxLQUFDLE1BQU0sT0FBTyxPQUFPO2VBQ3ZDLEtBQUssS0FBSyxZQUFZLEtBQUMsS0FBSyxTQUFRLEtBQUMsWUFBWSxLQUFDLE1BQU0sT0FBTyxPQUFLLEtBQUMsTUFBTTs7O3NCQVEvRSxzQkFBUzs7OztZQUVDLEtBQUMsWUFBWSxLQUFDLGdCQUFtQixLQUFDOzs7O1FBRXhDLHlDQUFZO2FBQTZCLGNBQUEsSUFBSzs7bUJBQVo7O1FBQ2xDLE1BQU0sS0FBQyxLQUFLLFFBQVE7YUFBcUIsY0FBQSxJQUFLOzttQkFBWjs7UUFDbEMsTUFBTSxLQUFDLFFBQVEsUUFBUTthQUFrQixjQUFBLElBQUs7O21CQUFaOzs7O3NCQVF0QyxzQkFBUzs7WUFFQyxLQUFDLFlBQVksS0FBQyxnQkFBbUIsS0FBQzs7OztlQUN4QyxLQUFDLFFBQVEsUUFBUTs7O3NCQVFyQixvQkFBTyxLQUFJOzthQUVHLEtBQUMsUUFBUTs7OztlQUVuQixLQUFDLFFBQVEsTUFBTSxJQUFJOzs7V0FwSWxCOzs7ZUFzSUYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funcol.kode
