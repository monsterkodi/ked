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
        this["onViewActive"] = this["onViewActive"].bind(this)
        this["setActive"] = this["setActive"].bind(this)
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
        this.active = false
        return view.__super__.constructor.apply(this, arguments)
    }

    view.prototype["setColor"] = function (key, clr)
    {
        return this.color[key] = color.values(clr)
    }

    view.prototype["setActive"] = function (active)
    {
        if (this.active === active)
        {
            return
        }
        this.active = active
        return this.onViewActive()
    }

    view.prototype["onViewActive"] = function ()
    {
        return post.emit('view.active',this.name,this.active)
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
        var item, ret

        if (this.hidden() || this.collapsed())
        {
            return
        }
        if (!_k_.empty(this.mouseItems))
        {
            var list = _k_.list(this.mouseItems)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                item = list[_a_]
                if (_k_.empty(item))
                {
                    continue
                }
                ret = item.onMouse(event)
                if ((ret != null ? ret.redraw : undefined))
                {
                    return ret
                }
            }
        }
        return this.handleHover(event)
    }

    view.prototype["onWheel"] = function (event)
    {
        var item

        if (this.hidden() || this.collapsed())
        {
            return
        }
        if (!this.cells.isInsideEvent(event))
        {
            return
        }
        var list = _k_.list(this.wheelItems)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            if (item.hasFocus())
            {
                return item.onWheel(event)
            }
        }
    }

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
        this.focused = (this.name === name)
        return this.focused
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
        var height, item, o, padding, spacing, _196_30_, _197_30_, _198_30_

        padding = ((_196_30_=opt.padding) != null ? _196_30_ : 1)
        spacing = ((_197_30_=opt.spacing) != null ? _197_30_ : 1)
        height = ((_198_30_=opt.height) != null ? _198_30_ : 1)
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
        var as, gap, item, maxsize, padding, spacing, wi, xi, xs, _208_30_, _209_30_, _210_30_

        padding = ((_208_30_=opt.padding) != null ? _208_30_ : 1)
        spacing = ((_209_30_=opt.spacing) != null ? _209_30_ : 1)
        maxsize = ((_210_30_=opt.maxsize) != null ? _210_30_ : Infinity)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9iYXNlL3ZpZXcua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTtJQUFPOztPQUNQLFlBQVQ7O09BQ1MsWUFBWjs7O0FBQ04sUUFBRDs7cUJBQU07SUFZRixNQUFDLGlCQUFjO2FBRWYsTUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRVAsS0FBQyxZQUFZLE1BQU0sS0FBQztRQUNwQixLQUFDO1FBQ0QsS0FBQzs0QkFDeUI7OztZQUFMO1lBQXJCLEtBQUMsTUFBTSxLQUFLOztRQUVaLEtBQUMsWUFBWTtRQUNiLEtBQUMsWUFBWTtRQUNiLEtBQUMsVUFBWTtRQU1iLEtBQUMsU0FBWTs7OztvQkFFakIsdUJBQVUsS0FBSTs7ZUFBTyxLQUFDLE1BQU0sT0FBTyxNQUFNLE9BQU87OztvQkFFaEQsd0JBQVc7O1lBRUYsS0FBQyxXQUFVOzs7O1FBQ2hCLEtBQUMsU0FBUztlQUNWLEtBQUM7OztvQkFFTDs7ZUFBaUIsS0FBSyxLQUFLLGNBQWMsS0FBQyxLQUFLLEtBQUM7OztvQkFFaEQ7Ozs7UUFFSSxLQUFDLFlBQVk7WUFFVixLQUFDOztnQkFDRyxLQUFLLGdCQUFpQixLQUFLLGlCQUFnQjs7Z0JBQzFDLFFBQVEsS0FBSztnQkFDYixLQUFLLGVBQWU7Z0JBQ3BCLE1BQU07O1lBQ1YsS0FBSyxlQUFlO1lBRXBCLEtBQUssS0FBSyxhQUFhLEtBQUM7O1FBRTVCLEtBQUM7Z0JBQ0QsT0FBTzs7O29CQUVYOztRQUVJLEtBQUMsWUFBWTtZQUVWLEtBQUM7O2dCQUNHLFNBQUssS0FBSzs7Z0JBQ1QsS0FBSyxlQUFlO2dCQUVwQixLQUFLLEtBQUssYUFBYSxLQUFDOzs7Z0JBRWhDLE9BQU87OztvQkFFWDs7O29CQUNBOztnQkFBZ0IsS0FBQzs7O29CQUNqQjs7ZUFBWSxLQUFDOzs7b0JBQ2I7O1lBQWUsS0FBQzs7bUJBQWMsS0FBQzs7Oztt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
//# sourceURL=../../../../kode/ked/view/base/view.kode
