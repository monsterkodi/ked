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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFhd0I7Ozs7Ozs7Ozs7OzsrQ0FJVixPQUFPLFNBQVM7UUFFdEIsS0FBQyxZQUFZO1FBQ2IsS0FBQyxTQUFZO1FBRWIsS0FBQyxjQUFjO1FBRWYsS0FBQyxXQUFjLEtBQVEsVUFBVyxLQUFDO1FBQ25DLEtBQUMsY0FBYyxRQUFRLEtBQUMsVUFBVSxLQUFDLGdCQUFnQjtRQUVuRCxLQUFDLEtBQUssWUFBWTtRQUVsQixLQUFDLFFBQVEsU0FBUyxLQUFnQixNQUFNLFFBQVE7UUFDaEQsS0FBQyxRQUFRLFNBQVMsUUFBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLFNBQVMsY0FBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLFNBQVMsZUFBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFTLEtBQUMsUUFBUSxNQUFNO1FBRWpELEtBQUMsS0FBUSxTQUFTLEtBQWdCLEtBQUMsUUFBUSxNQUFNO1FBRWpELEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDOzs7OztzQkFJYixPQUFPOzs7O1lBRWhCLE9BQU8sT0FBTzs7WUFDYixLQUFDLFNBQVM7WUFDVixLQUFDOztlQUVMLFlBQVksSUFBSSxTQUFTLE9BQU87Ozs7O1FBVWhDLEtBQUMsUUFBUSxPQUFPLEVBQUUsRUFBRSxFQUFFO1FBQ3RCLEtBQUMsS0FBSyxPQUFVLEVBQUUsRUFBRSxFQUFFO2lEQUVoQixFQUFFLEVBQUUsRUFBRTs7Ozs7WUFVTixLQUFDLFlBQVksS0FBQyxnQkFBbUIsS0FBQzs7OztRQUV4QyxLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxNQUFNLFFBQVE7UUFDbEQsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUksRUFBRSxJQUFJLEtBQUssTUFBTSxPQUFPO1FBRWpELEtBQUMsUUFBUTtRQUNULEtBQUMsS0FBSzs7Ozs7O2FBWUksS0FBQzs7OztRQUVYLGlDQUF5QixLQUFDLFFBQVE7Ozs7O2VBUW5CLEtBQUMsS0FBSyxTQUFTOzs7Ozs7O2NBR1osS0FBQyxhQUFjLEtBQUM7O1lBQWxDLEtBQUM7O1FBQ0QsS0FBQyxTQUFTLEtBQUM7UUFDWCxZQUFZLElBQUksZ0JBQWdCLEtBQUM7UUFDakMsZUFBVyxZQUFPLEtBQUMsTUFBTSxPQUFPLE9BQU87ZUFDdkMsS0FBSyxLQUFLLFlBQVksS0FBQyxLQUFLLFNBQVEsS0FBQyxZQUFZLEtBQUMsTUFBTSxPQUFPLE9BQUssS0FBQyxNQUFNOzs7Ozs7O1lBVXJFLEtBQUMsWUFBWSxLQUFDLGdCQUFtQixLQUFDOzs7O1FBRXhDLHlDQUFZO2FBQTZCLGNBQUEsSUFBSzs7bUJBQVo7O1FBQ2xDLE1BQU0sS0FBQyxLQUFLLFFBQVE7YUFBcUIsY0FBQSxJQUFLOzttQkFBWjs7UUFDbEMsTUFBTSxLQUFDLFFBQVEsUUFBUTthQUFrQixjQUFBLElBQUs7O21CQUFaOzs7Ozs7WUFVNUIsS0FBQyxZQUFZLEtBQUMsZ0JBQW1CLEtBQUM7Ozs7ZUFDeEMsS0FBQyxRQUFRLFFBQVE7Ozs7O2FBVVAsS0FBQyxRQUFROzs7O2VBRW5CLEtBQUMsUUFBUSxNQUFNLElBQUk7Ozs7OztlQUVwQiJ9
//# sourceURL=file://kode/ked/view/colmns/funcol.kode
