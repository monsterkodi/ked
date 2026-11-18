var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        this["erase"] = this["erase"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        this["onFocus"] = this["onFocus"].bind(this)
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
        this.focused = false
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
    {}

    view.prototype["onMouseLeave"] = function (event)
    {
        return post.emit('redraw')
    }

    view.prototype["onMouseEnter"] = function (event)
    {
        if (this.focusable)
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

    view.prototype["setFocusable"] = function (f = true)
    {
        if (f && !this.focusable)
        {
            this.focusable = true
            return post.on('focus',this.onFocus)
        }
        else if (this.focusable && !f)
        {
            this.focusable = false
            return post.removeListener('focus',this.onFocus)
        }
    }

    view.prototype["onFocus"] = function (name)
    {
        return this.focused = (this.name === name)
    }

    view.prototype["hasFocus"] = function ()
    {
        return this.focused
    }

    view.prototype["grabFocus"] = function ()
    {
        post.emit('focus',this.name)
        return post.emit('redraw')
    }

    view.prototype["onKey"] = function (key, event)
    {
        console.log(`view.onKey ${this.name}`)
    }

    view.prototype["layout"] = function (x, y, w, h)
    {
        return this.cells.layout(x,y,w,h)
    }

    view.prototype["erase"] = function ()
    {
        return this.cells.erase_scaled(0,0,-1,-1)
    }

    view.prototype["draw"] = function ()
    {}

    return view
})()

export default view;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9iYXNlL3ZpZXcua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTtJQUFPOztPQUNQLFlBQVQ7O09BQ1MsWUFBWjs7O0FBQ04sUUFBRDs7cUJBQU07SUFZRixNQUFDLGlCQUFjO2FBRWYsTUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7OztRQUVQLEtBQUMsWUFBWSxNQUFNLEtBQUM7UUFDcEIsS0FBQztRQUNELEtBQUM7NEJBQ3lCOzs7WUFBTDtZQUFyQixLQUFDLE1BQU0sS0FBSzs7UUFFWixLQUFDLFlBQVk7UUFDYixLQUFDLFlBQVk7UUFDYixLQUFDLFVBQVk7Ozs7b0JBRWpCLHVCQUFVLEtBQUk7O2VBQU8sS0FBQyxNQUFNLE9BQU8sTUFBTSxPQUFPOzs7b0JBRWhEOzs7O1FBRUksS0FBQyxZQUFZO1lBRVYsS0FBQzs7Z0JBQ0csS0FBSyxnQkFBaUIsS0FBSyxpQkFBZ0I7O2dCQUMxQyxRQUFRLEtBQUs7Z0JBQ2IsS0FBSyxlQUFlO2dCQUNwQixNQUFNOztZQUNWLEtBQUssZUFBZTtZQUVwQixLQUFLLEtBQUssYUFBYSxLQUFDOztRQUU1QixLQUFDO2dCQUNELE9BQU87OztvQkFFWDs7UUFFSSxLQUFDLFlBQVk7WUFFVixLQUFDOztnQkFDRyxTQUFLLEtBQUs7O2dCQUNULEtBQUssZUFBZTtnQkFFcEIsS0FBSyxLQUFLLGFBQWEsS0FBQzs7O2dCQUVoQyxPQUFPOzs7b0JBRVg7OztvQkFDQTs7Z0JBQWdCLEtBQUM7OztvQkFDakI7O2VBQVksS0FBQzs7O29CQUNiOztZQUFlLEtBQUM7O21CQUFjLEtBQUM7Ozs7bUJBQVksS0FBQzs7OztvQkFFNUM7O2VBQWMsS0FBQyxNQUFNLFFBQVEsS0FBSyxLQUFDLE1BQU0sUUFBUTs7O29CQUVqRCx1QkFBVTs7ZUFBUyxLQUFDLE1BQU0sWUFBWTs7O29CQUV0QyxzQkFBUzs7ZUFBUyxLQUFDLFlBQVk7OztvQkFDL0Isc0JBQVM7OztvQkFFVCwyQkFBYzs7ZUFBUyxLQUFLLEtBQUs7OztvQkFDakMsMkJBQWM7O1lBQ1AsS0FBQzs7WUFDQSxLQUFDOztZQUVGLEtBQUM7O1lBQ0EsS0FBSyxLQUFLLFVBQVUsS0FBQzttQkFDckIsS0FBSyxLQUFLOzs7O29CQUVsQiwwQkFBYTs7OztRQUlULFVBQWEsTUFBTSxXQUFZLEtBQUMsTUFBTSxjQUFjO1lBQ2pELEtBQUMsVUFBYzs7WUFDZCxLQUFDLFFBQVE7WUFDVCxLQUFDLGFBQWE7O2lCQUNWLFdBQWUsS0FBQzs7WUFDcEIsS0FBQyxRQUFRO1lBQ1QsS0FBQyxhQUFhOztlQUNsQixLQUFDOzs7b0JBRUwsMkJBQWMsSUFBRTs7WUFFVCxNQUFVLEtBQUM7O1lBQ1YsS0FBQyxZQUFZO21CQUNiLEtBQUssR0FBRyxRQUFRLEtBQUM7O2lCQUNiLEtBQUMsY0FBa0I7O1lBQ3ZCLEtBQUMsWUFBWTttQkFDYixLQUFLLGVBQWUsUUFBUSxLQUFDOzs7O29CQUVyQyxzQkFBUzs7ZUFFTCxLQUFDLFdBQVcsS0FBQyxTQUFROzs7b0JBQ3pCOztlQUFjLEtBQUM7OztvQkFDZjs7UUFFSSxLQUFLLEtBQUssUUFBUSxLQUFDO2VBQ25CLEtBQUssS0FBSzs7O29CQUVkLG9CQUFPLEtBQUk7O1FBQVMsMEJBQWtCLEtBQUM7OztvQkFFdkMscUJBQVEsR0FBRSxHQUFFLEdBQUU7O2VBQUssS0FBQyxNQUFNLE9BQU8sRUFBRSxFQUFFLEVBQUU7OztvQkFFdkM7O2VBQVUsS0FBQyxNQUFNLGFBQWEsRUFBRSxFQUFFLEdBQUc7OztvQkFFckM7OztXQWpISDs7O2VBbUhNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/view.kode
