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
        var height, item, o, padding, spacing, _168_30_, _169_30_, _170_30_

        padding = ((_168_30_=opt.padding) != null ? _168_30_ : 1)
        spacing = ((_169_30_=opt.spacing) != null ? _169_30_ : 1)
        height = ((_170_30_=opt.height) != null ? _170_30_ : 1)
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
        var as, gap, item, maxsize, padding, spacing, wi, xi, xs, _180_30_, _181_30_, _182_30_

        padding = ((_180_30_=opt.padding) != null ? _180_30_ : 1)
        spacing = ((_181_30_=opt.spacing) != null ? _181_30_ : 1)
        maxsize = ((_182_30_=opt.maxsize) != null ? _182_30_ : Infinity)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9iYXNlL3ZpZXcua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTtJQUFPOztPQUNQLFlBQVQ7O09BQ1MsWUFBWjs7O0FBQ04sUUFBRDs7cUJBQU07SUFZRixNQUFDLGlCQUFjO2FBRWYsTUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVQLEtBQUMsWUFBWSxNQUFNLEtBQUM7UUFDcEIsS0FBQztRQUNELEtBQUM7NEJBQ3lCOzs7WUFBTDtZQUFyQixLQUFDLE1BQU0sS0FBSzs7UUFFWixLQUFDLFlBQVk7UUFDYixLQUFDLFlBQVk7UUFDYixLQUFDLFVBQVk7Ozs7b0JBRWpCLHVCQUFVLEtBQUk7O2VBQU8sS0FBQyxNQUFNLE9BQU8sTUFBTSxPQUFPOzs7b0JBRWhEOzs7O1FBRUksS0FBQyxZQUFZO1lBRVYsS0FBQzs7Z0JBQ0csS0FBSyxnQkFBaUIsS0FBSyxpQkFBZ0I7O2dCQUMxQyxRQUFRLEtBQUs7Z0JBQ2IsS0FBSyxlQUFlO2dCQUNwQixNQUFNOztZQUNWLEtBQUssZUFBZTtZQUVwQixLQUFLLEtBQUssYUFBYSxLQUFDOztRQUU1QixLQUFDO2dCQUNELE9BQU87OztvQkFFWDs7UUFFSSxLQUFDLFlBQVk7WUFFVixLQUFDOztnQkFDRyxTQUFLLEtBQUs7O2dCQUNULEtBQUssZUFBZTtnQkFFcEIsS0FBSyxLQUFLLGFBQWEsS0FBQzs7O2dCQUVoQyxPQUFPOzs7b0JBRVg7OztvQkFDQTs7Z0JBQWdCLEtBQUM7OztvQkFDakI7O2VBQVksS0FBQzs7O29CQUNiOztZQUFlLEtBQUM7O21CQUFjLEtBQUM7Ozs7bUJBQVksS0FBQzs7OztvQkFFNUM7O2VBQWMsS0FBQyxNQUFNLFFBQVEsS0FBSyxLQUFDLE1BQU0sUUFBUTs7O29CQUVqRCx1QkFBVTs7ZUFBUyxLQUFDLE1BQU0sWUFBWTs7O29CQUV0QyxzQkFBUzs7OztZQUVBLEtBQUMsWUFBWSxLQUFDOzs7O3VCQUVWLEtBQUM7O2dDQUNNLEtBQUM7OztnQkFBVDs4QkFDa0I7O29CQUFsQjs7Z0JBQ0EsTUFBTSxLQUFLLFFBQVE7cUJBQ1YsY0FBQSxJQUFLOzsyQkFBWjs7OztlQUVWLEtBQUMsWUFBWTs7O29CQUVqQixzQkFBUzs7O29CQUVULDJCQUFjOztlQUFTLEtBQUssS0FBSzs7O29CQUNqQywyQkFBYzs7WUFDUCxLQUFDOztZQUNBLEtBQUM7O1lBRUYsS0FBQzs7WUFDQSxLQUFLLEtBQUssVUFBVSxLQUFDO21CQUNyQixLQUFLLEtBQUs7Ozs7b0JBRWxCLDBCQUFhOzs7O1FBSVQsVUFBYSxNQUFNLFdBQVksS0FBQyxNQUFNLGNBQWM7WUFDakQsS0FBQyxVQUFjOztZQUNkLEtBQUMsUUFBUTtZQUNULEtBQUMsYUFBYTs7aUJBQ1YsV0FBZSxLQUFDOztZQUNwQixLQUFDLFFBQVE7WUFDVCxLQUFDLGFBQWE7O2VBQ2xCLEtBQUM7OztvQkFFTCwyQkFBYyxJQUFFOztZQUVULE1BQVUsS0FBQzs7WUFDVixLQUFDLFlBQVk7bUJBQ2IsS0FBSyxHQUFHLFFBQVEsS0FBQzs7aUJBQ2IsS0FBQyxjQUFrQjs7WUFDdkIsS0FBQyxZQUFZO21CQUNiLEtBQUssZUFBZSxRQUFRLEtBQUM7Ozs7b0JBRXJDLHNCQUFTOztlQUVMLEtBQUMsV0FBVyxLQUFDLFNBQVE7OztvQkFFekI7Ozs7NEJBRWdCLEtBQUM7OztZQUFUO2dCQUNHLEtBQUs7O3VCQUFlOzs7ZUFDM0IsS0FBQzs7O29CQUVMLHlCQUFZOzs7OzRCQUVVLEtBQUM7YUFBVjs7WUFBTDtnQkFDRyxLQUFLOztnQkFDSixNQUFNLEtBQUMsVUFBVTtxQkFDZCxLQUFLLFFBQU0sU0FBTixRQUFNLFFBQVE7O3dCQUNmLEtBQUMsVUFBVSxRQUFNLE9BQU87O3dCQUN2QixLQUFDLFVBQVUsUUFBTSxPQUFPOytCQUN0Qjs7O3VCQUNSOzs7ZUFDVjs7O29CQUVKOztlQUFjLEtBQUMsV0FBVzs7O29CQUMxQjs7ZUFBYyxLQUFDLFdBQVc7OztvQkFFMUI7O1lBRWUsS0FBQzs7bUJBQVY7O3VCQUVPLEtBQUM7O21CQUNKLEtBQUMsVUFBVSxHQUFHOztRQUVwQixLQUFLLEtBQUssUUFBUSxLQUFDO2VBQ25CLEtBQUssS0FBSzs7O29CQUVkLG9CQUFPLEtBQUk7Ozs7WUFFSSxLQUFDOzttQkFBVjs7dUJBRU8sS0FBQzs7b0JBRUMsTUFBTTs7cUJBQ1Q7cUJBQU07MkJBQWUsS0FBQzs7cUJBQ3RCO3FCQUFJOzJCQUFpQixLQUFDOzs7O2dDQUVkLEtBQUM7OztnQkFBVDtvQkFDRyxLQUFLOzsyQkFBZSxLQUFLLE1BQU0sSUFBSTs7OztlQUU5Qzs7O29CQUVKLHFCQUFRLEdBQUUsR0FBRSxHQUFFOztlQUFLLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRSxFQUFFOzs7b0JBRXZDLDBCQUFhLEdBQUUsR0FBRSxHQUFFLEdBQUUsT0FBTTs7OztRQUV2QixxQkFBVSxJQUFJLDhCQUFVO1FBQ3hCLHFCQUFVLElBQUksOEJBQVU7UUFDeEIsb0JBQVUsSUFBSSw2QkFBVTtRQUV4QixJQUFJOzRCQUNROzs7WUFBUjtZQUNBLEtBQUssT0FBTyxFQUFFLElBQUUsRUFBRSxFQUFFO1lBQ3BCLEtBQUs7WUFDTCxLQUFLOzs7O29CQUViLDBCQUFhLEdBQUUsR0FBRSxHQUFFLEdBQUUsT0FBTTs7OztRQUV2QixxQkFBVSxJQUFJLDhCQUFVO1FBQ3hCLHFCQUFVLElBQUksOEJBQVU7UUFDeEIscUJBQVUsSUFBSSw4QkFBVTtRQUN4QixLQUFNLElBQUksSUFBRSxXQUFXLE1BQU0sU0FBTyxLQUFHO1FBQ3ZDLGNBQVUsS0FBSyxNQUFNO1FBQ3JCLGFBQVUsR0FBRztRQUNiLGdCQUFXLEtBQUssTUFBTSxTQUFPLE9BQU8sTUFBTSxTQUFPO1FBQ2pELEtBQUs7NEJBQ087OztZQUFSO1lBQ0EsS0FBSyxPQUFPLElBQUUsR0FBRyxFQUFFLEdBQUc7WUFDdEIsTUFBTSxLQUFLLFVBQVU7Ozs7b0JBRTdCOztlQUFVLEtBQUMsTUFBTSxhQUFhLEVBQUUsRUFBRSxHQUFHOzs7b0JBRXJDOzs7V0E3TEg7OztlQStMTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/view.kode
