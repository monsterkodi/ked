var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isFunc: function (o) {return typeof o === 'function'}}

var view

import kxk from "../../../kxk.js"
let events = kxk.events
let post = kxk.post

import color from "../../theme/color.js"

import cells from "../screen/cells.js"


view = (function ()
{
    _k_.extend(view, events)
    view["currentPopup"] = null
    function view (screen, name, features)
    {
        this.screen = screen
        this.name = name
    
        var f

        this["draw"] = this["draw"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["handleHover"] = this["handleHover"].bind(this)
        this["onMouseEnter"] = this["onMouseEnter"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["setColor"] = this["setColor"].bind(this)
        this.cells = new cells(this.screen)
        this.color = {}
        this.feats = {}
        var list = _k_.list(features)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            f = list[_a_]
            this.feats[f] = true
        }
        this.isVisible = true
        this.focusable = false
        return view.__super__.constructor.apply(this, arguments)
    }

    view.prototype["setColor"] = function (key, clr)
    {
        return this.color[key] = color.values(clr)
    }

    view.prototype["show"] = function ()
    {
        var popup

        this.isVisible = true
        if (this.isPopup)
        {
            if (view.currentPopup && view.currentPopup !== this)
            {
                popup = view.currentPopup
                view.currentPopup = null
                popup.hide()
            }
            view.currentPopup = this
            post.emit('popup.show',this.name)
        }
        this.arrange()
        return {redraw:true}
    }

    view.prototype["hide"] = function ()
    {
        this.isVisible = false
        if (this.isPopup)
        {
            if (this === view.currentPopup)
            {
                view.currentPopup = null
                post.emit('popup.hide',this.name)
            }
        }
        return {redraw:true}
    }

    view.prototype["arrange"] = function ()
    {}

    view.prototype["hidden"] = function ()
    {
        return !this.visible()
    }

    view.prototype["visible"] = function ()
    {
        return this.isVisible
    }

    view.prototype["toggle"] = function ()
    {
        if (this.hidden())
        {
            return this.show()
        }
        else
        {
            return this.hide()
        }
    }

    view.prototype["collapsed"] = function ()
    {
        return this.cells.rows <= 0 || this.cells.cols <= 0
    }

    view.prototype["eventPos"] = function (event)
    {
        return this.cells.posForEvent(event)
    }

    view.prototype["onMouse"] = function (event)
    {
        return this.handleHover(event)
    }

    view.prototype["onWheel"] = function (event)
    {
        console.log(`view.onWheel ${this.name}`)
    }

    view.prototype["onMouseLeave"] = function (event)
    {
        return post.emit('redraw')
    }

    view.prototype["onMouseEnter"] = function (event)
    {
        if (this.focusable && _k_.isFunc(this.grabFocus))
        {
            this.grabFocus()
        }
        if (this.pointerType)
        {
            post.emit('pointer',this.pointerType)
            return post.emit('redraw')
        }
    }

    view.prototype["handleHover"] = function (event)
    {
        var inside

        inside = !event.handled && this.cells.isInsideEvent(event)
        if (this.hover && !inside)
        {
            this.hover = false
            this.onMouseLeave(event)
        }
        else if (inside && !this.hover)
        {
            this.hover = true
            this.onMouseEnter(event)
        }
        return this.hover
    }

    view.prototype["onKey"] = function (key, event)
    {
        console.log(`view.onKey ${this.name}`)
    }

    view.prototype["layout"] = function (x, y, w, h)
    {
        return this.cells.layout(x,y,w,h)
    }

    view.prototype["draw"] = function ()
    {}

    return view
})()

export default view;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9iYXNlL3ZpZXcua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQWdCYSxVQUFBO0lBQU07SUFBTzs7T0FDUCxZQUFUOztPQUNTLFlBQVo7OztBQUVFLFFBQVQ7O3FCQUFzQjtJQUVsQixNQUFDLGlCQUFjO2FBRWYsTUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7O1FBRVAsS0FBQyxZQUFZLE1BQU0sS0FBQztRQUNwQixLQUFDO1FBQ0QsS0FBQzs0QkFDeUI7OztZQUFMO1lBQXJCLEtBQUMsTUFBTSxLQUFLOztRQUVaLEtBQUMsWUFBWTtRQUNiLEtBQUMsWUFBWTs7OztvQkFFakIsdUJBQVUsS0FBSTs7ZUFBTyxLQUFDLE1BQU0sT0FBTyxNQUFNLE9BQU87OztvQkFRaEQ7Ozs7UUFFSSxLQUFDLFlBQVk7WUFFVixLQUFDOztnQkFDRyxLQUFLLGdCQUFpQixLQUFLLGlCQUFnQjs7Z0JBQzFDLFFBQVEsS0FBSztnQkFDYixLQUFLLGVBQWU7Z0JBQ3BCLE1BQU07O1lBQ1YsS0FBSyxlQUFlO1lBRXBCLEtBQUssS0FBSyxhQUFhLEtBQUM7O1FBRTVCLEtBQUM7Z0JBQ0QsT0FBTzs7O29CQUVYOztRQUVJLEtBQUMsWUFBWTtZQUVWLEtBQUM7O2dCQUNHLFNBQUssS0FBSzs7Z0JBQ1QsS0FBSyxlQUFlO2dCQUVwQixLQUFLLEtBQUssYUFBYSxLQUFDOzs7Z0JBRWhDLE9BQU87OztvQkFFWDs7O29CQUNBOztnQkFBZ0IsS0FBQzs7O29CQUNqQjs7ZUFBWSxLQUFDOzs7b0JBQ2I7O1lBQWUsS0FBQzs7bUJBQWMsS0FBQzs7OzttQkFBWSxLQUFDOzs7O29CQUU1Qzs7ZUFBYyxLQUFDLE1BQU0sUUFBUSxLQUFLLEtBQUMsTUFBTSxRQUFROzs7b0JBRWpELHVCQUFVOztlQUFTLEtBQUMsTUFBTSxZQUFZOzs7b0JBUXRDLHNCQUFTOztlQUFTLEtBQUMsWUFBWTs7O29CQUMvQixzQkFBUzs7UUFBUyw0QkFBb0IsS0FBQzs7O29CQUV2QywyQkFBYzs7ZUFBUyxLQUFLLEtBQUs7OztvQkFDakMsMkJBQWM7O1lBRVAsS0FBQyxhQUE0QixXQUFkLEtBQUM7O1lBQ2YsS0FBQzs7WUFFRixLQUFDOztZQUNBLEtBQUssS0FBSyxVQUFVLEtBQUM7bUJBQ3JCLEtBQUssS0FBSzs7OztvQkFFbEIsMEJBQWE7Ozs7UUFFVCxVQUFhLE1BQU0sV0FBWSxLQUFDLE1BQU0sY0FBYztZQUNqRCxLQUFDLFVBQWM7O1lBQ2QsS0FBQyxRQUFRO1lBQ1QsS0FBQyxhQUFhOztpQkFDVixXQUFlLEtBQUM7O1lBQ3BCLEtBQUMsUUFBUTtZQUNULEtBQUMsYUFBYTs7ZUFDbEIsS0FBQzs7O29CQUVMLG9CQUFPLEtBQUk7O1FBQVMsMEJBQWtCLEtBQUM7OztvQkFRdkMscUJBQVEsR0FBRSxHQUFFLEdBQUU7O2VBQUssS0FBQyxNQUFNLE9BQU8sRUFBRSxFQUFFLEVBQUU7OztvQkFFdkM7OztXQW5HSzs7O2VBcUdGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/view.kode
