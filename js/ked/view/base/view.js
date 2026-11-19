var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
        this["focusPrev"] = this["focusPrev"].bind(this)
        this["focusNext"] = this["focusNext"].bind(this)
        this["focusDelta"] = this["focusDelta"].bind(this)
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
        var item

        var list = _k_.list(this.focusRing)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            if (item.hasFocus())
            {
                return true
            }
        }
        return this.focused
    }

    view.prototype["focusDelta"] = function (delta)
    {
        var index, item, num

        var list = _k_.list(this.focusRing)
        for (index = 0; index < list.length; index++)
        {
            item = list[index]
            if (item.hasFocus())
            {
                num = this.focusRing.length
                if ((0 <= index + delta && index + delta < num))
                {
                    if (this.focusRing[index + delta].focusable)
                    {
                        this.focusRing[index + delta].grabFocus()
                        return true
                    }
                }
                return false
            }
        }
        return false
    }

    view.prototype["focusNext"] = function ()
    {
        return this.focusDelta(1)
    }

    view.prototype["focusPrev"] = function ()
    {
        return this.focusDelta(-1)
    }

    view.prototype["grabFocus"] = function ()
    {
        if (this.hidden())
        {
            return false
        }
        if (!_k_.empty(this.focusRing))
        {
            return this.focusRing[0].grabFocus()
        }
        post.emit('focus',this.name)
        return post.emit('redraw')
    }

    view.prototype["onKey"] = function (key, event)
    {
        var item

        if (this.hidden())
        {
            return false
        }
        if (!_k_.empty(this.focusRing))
        {
            switch (event.combo)
            {
                case 'down':
                case 'tab':
                    return this.focusNext()

                case 'up':
                case 'shift+tab':
                    return this.focusPrev()

            }

            var list = _k_.list(this.focusRing)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                item = list[_a_]
                if (item.hasFocus())
                {
                    return item.onKey(key,event)
                }
            }
        }
        return false
    }

    view.prototype["layout"] = function (x, y, w, h)
    {
        return this.cells.layout(x,y,w,h)
    }

    view.prototype["layout_vbox"] = function (x, y, w, h, items, opt = {})
    {
        var height, item, o, padding, spacing, _157_30_, _158_30_, _159_30_

        padding = ((_157_30_=opt.padding) != null ? _157_30_ : 1)
        spacing = ((_158_30_=opt.spacing) != null ? _158_30_ : 1)
        height = ((_159_30_=opt.height) != null ? _159_30_ : 1)
        o = padding
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.layout(x,y + o,w,height)
            o += height
            o += spacing
        }
    }

    view.prototype["layout_hbox"] = function (x, y, w, h, items, opt = {})
    {
        var as, gap, item, maxsize, padding, spacing, wi, xi, xs, _169_30_, _170_30_, _171_30_

        padding = ((_169_30_=opt.padding) != null ? _169_30_ : 1)
        spacing = ((_170_30_=opt.spacing) != null ? _170_30_ : 1)
        maxsize = ((_171_30_=opt.maxsize) != null ? _171_30_ : Infinity)
        as = w - 2 * padding - (items.length - 1) * spacing
        xs = parseInt(as / items.length)
        wi = _k_.min(xs,maxsize)
        gap = parseInt((as - items.length * wi) / (items.length - 1))
        xi = padding
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.layout(x + xi,y,wi,1)
            xi += wi + spacing + gap
        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9iYXNlL3ZpZXcua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTtJQUFPOztPQUNQLFlBQVQ7O09BQ1MsWUFBWjs7O0FBQ04sUUFBRDs7cUJBQU07SUFZRixNQUFDLGlCQUFjO2FBRWYsTUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVQLEtBQUMsWUFBWSxNQUFNLEtBQUM7UUFDcEIsS0FBQztRQUNELEtBQUM7NEJBQ3lCOzs7WUFBTDtZQUFyQixLQUFDLE1BQU0sS0FBSzs7UUFFWixLQUFDLFlBQVk7UUFDYixLQUFDLFlBQVk7UUFDYixLQUFDLFVBQVk7Ozs7b0JBRWpCLHVCQUFVLEtBQUk7O2VBQU8sS0FBQyxNQUFNLE9BQU8sTUFBTSxPQUFPOzs7b0JBRWhEOzs7O1FBRUksS0FBQyxZQUFZO1lBRVYsS0FBQzs7Z0JBQ0csS0FBSyxnQkFBaUIsS0FBSyxpQkFBZ0I7O2dCQUMxQyxRQUFRLEtBQUs7Z0JBQ2IsS0FBSyxlQUFlO2dCQUNwQixNQUFNOztZQUNWLEtBQUssZUFBZTtZQUVwQixLQUFLLEtBQUssYUFBYSxLQUFDOztRQUU1QixLQUFDO2dCQUNELE9BQU87OztvQkFFWDs7UUFFSSxLQUFDLFlBQVk7WUFFVixLQUFDOztnQkFDRyxTQUFLLEtBQUs7O2dCQUNULEtBQUssZUFBZTtnQkFFcEIsS0FBSyxLQUFLLGFBQWEsS0FBQzs7O2dCQUVoQyxPQUFPOzs7b0JBRVg7OztvQkFDQTs7Z0JBQWdCLEtBQUM7OztvQkFDakI7O2VBQVksS0FBQzs7O29CQUNiOztZQUFlLEtBQUM7O21CQUFjLEtBQUM7Ozs7bUJBQVksS0FBQzs7OztvQkFFNUM7O2VBQWMsS0FBQyxNQUFNLFFBQVEsS0FBSyxLQUFDLE1BQU0sUUFBUTs7O29CQUVqRCx1QkFBVTs7ZUFBUyxLQUFDLE1BQU0sWUFBWTs7O29CQUV0QyxzQkFBUzs7ZUFBUyxLQUFD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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/view.kode
