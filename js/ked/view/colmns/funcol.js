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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTtJQUFLOztPQUNMLFlBQVQ7T0FBZSxZQUFmOztPQUNTLFdBQVo7T0FBaUIsV0FBakI7O09BQ1ksY0FBQTs7O0FBRVYsVUFBVDs7dUJBQXdCO2FBRXBCLFFBQUcsUUFBUSxRQUFPOztRQUFSOzs7Ozs7Ozs7K0NBRUEsT0FBTyxTQUFTO1FBRXRCLEtBQUMsWUFBWTtRQUNiLEtBQUMsU0FBWTtRQUViLEtBQUMsY0FBYztRQUVmLEtBQUMsV0FBYyxLQUFRLFVBQVcsS0FBQztRQUNuQyxLQUFDLGNBQWMsUUFBUSxLQUFDLFVBQVUsS0FBQyxnQkFBZ0I7UUFFbkQsS0FBQyxLQUFLLFlBQVk7UUFFbEIsS0FBQyxRQUFRLFNBQVMsS0FBZ0IsTUFBTSxRQUFRO1FBQ2hELEtBQUMsUUFBUSxTQUFTLFFBQWdCLEtBQUMsUUFBUSxNQUFNO1FBQ2pELEtBQUMsUUFBUSxTQUFTLGNBQWdCLEtBQUMsUUFBUSxNQUFNO1FBQ2pELEtBQUMsUUFBUSxTQUFTLGVBQWdCLEtBQUMsUUFBUSxNQUFNO1FBQ2pELEtBQUMsUUFBUSxPQUFPLFNBQVMsS0FBUyxLQUFDLFFBQVEsTUFBTTtRQUVqRCxLQUFDLEtBQVEsU0FBUyxLQUFnQixLQUFDLFFBQVEsTUFBTTtRQUVqRCxLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUc7O21CQUFtQixLQUFDLFFBQVE7Ozs7c0JBRXhDLDZCQUFnQjs7c0JBRUEsT0FBTzs7OztZQUVoQixPQUFPLE9BQU87O1lBQ2IsS0FBQyxTQUFTO1lBQ1YsS0FBQzs7ZUFFTCxZQUFZLElBQUksU0FBUyxPQUFPOzs7c0JBUXBDLHFCQUFRLEdBQUUsR0FBRSxHQUFFOztRQUVWLEtBQUMsUUFBUSxPQUFPLEVBQUUsRUFBRSxFQUFFO1FBQ3RCLEtBQUMsS0FBSyxPQUFVLEVBQUUsRUFBRSxFQUFFO2lEQUVoQixFQUFFLEVBQUUsRUFBRTs7O3NCQVFoQjs7WUFFVSxLQUFDLFlBQVksS0FBQyxnQkFBbUIsS0FBQzs7OztRQUV4QyxLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxNQUFNLFFBQVE7UUFDbEQsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUksRUFBRSxJQUFJLEtBQUssTUFBTSxPQUFPO1FBRWpELEtBQUMsUUFBUTtRQUNULEtBQUMsS0FBSzs7OztzQkFVVix3QkFBVzs7YUFFRyxLQUFDOzs7O1FBRVgsaUNBQXlCLEtBQUMsUUFBUTs7O3NCQVF0Qzs7ZUFBbUIsS0FBQyxLQUFLLFNBQVM7OztzQkFDbEM7Ozs7Y0FFc0IsS0FBQyxhQUFjLEtBQUM7O1lBQWxDLEtBQUM7O1FBQ0QsS0FBQyxTQUFTLEtBQUM7UUFDWCxZQUFZLElBQUksZ0JBQWdCLEtBQUM7UUFDakMsZUFBVyxZQUFPLEtBQUMsTUFBTSxPQUFPLE9BQU87ZUFDdkMsS0FBSyxLQUFLLFlBQVksS0FBQyxLQUFLLFNBQVEsS0FBQyxZQUFZLEtBQUMsTUFBTSxPQUFPLE9BQUssS0FBQyxNQUFNOzs7c0JBUS9FLHNCQUFTOzs7O1lBRUMsS0FBQyxZQUFZLEtBQUMsZ0JBQW1CLEtBQUM7Ozs7UUFFeEMseUNBQVk7YUFBNkIsY0FBQSxJQUFLOzttQkFBWjs7UUFDbEMsTUFBTSxLQUFDLEtBQUssUUFBUTthQUFxQixjQUFBLElBQUs7O21CQUFaOztRQUNsQyxNQUFNLEtBQUMsUUFBUSxRQUFRO2FBQWtCLGNBQUEsSUFBSzs7bUJBQVo7Ozs7c0JBUXRDLHNCQUFTOztZQUVDLEtBQUMsWUFBWSxLQUFDLGdCQUFtQixLQUFDOzs7O2VBQ3hDLEtBQUMsUUFBUSxRQUFROzs7c0JBUXJCLG9CQUFPLEtBQUk7O2FBRUcsS0FBQyxRQUFROzs7O2VBRW5CLEtBQUMsUUFBUSxNQUFNLElBQUk7OztXQXBJbEI7OztlQXNJRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funcol.kode
