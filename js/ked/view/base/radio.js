var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isFunc: function (o) {return typeof o === 'function'}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var radio

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "./view.js"


radio = (function ()
{
    _k_.extend(radio, view)
    function radio (screen, name)
    {
        this["draw"] = this["draw"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["optionAt"] = this["optionAt"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["setFocusable"] = this["setFocusable"].bind(this)
        this["setFocused"] = this["setFocused"].bind(this)
        this["setActive"] = this["setActive"].bind(this)
        this["setOptions"] = this["setOptions"].bind(this)
        radio.__super__.constructor.call(this,screen,name)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('fg',theme.colorpicker.fg)
        this.options = []
        this.active = 0
        this.focused = false
        this.focusable = false
        this.pointerType = null
        this.onFocusRequest = null
        this.onSelect = null
    }

    radio.prototype["setOptions"] = function (options)
    {
        this.options = (options != null ? options : [])
        if (_k_.empty(this.options))
        {
            return this.active = 0
        }
        else
        {
            return this.active = _k_.clamp(0,(this.options.length - 1),this.active)
        }
    }

    radio.prototype["setActive"] = function (idx)
    {
        if (_k_.empty(this.options))
        {
            return
        }
        return this.active = _k_.clamp(0,(this.options.length - 1),parseInt(idx))
    }

    radio.prototype["getActive"] = function ()
    {
        return this.active
    }

    radio.prototype["setFocused"] = function (focused)
    {
        return this.focused = focused
    }

    radio.prototype["setFocusable"] = function (focusable)
    {
        this.focusable = focusable
        return this.pointerType = (focusable ? 'pointer' : null)
    }

    radio.prototype["grabFocus"] = function ()
    {
        if (_k_.isFunc(this.onFocusRequest))
        {
            return this.onFocusRequest()
        }
    }

    radio.prototype["optionAt"] = function (x)
    {
        var idx, w

        if (_k_.empty(this.options))
        {
            return 0
        }
        w = _k_.max(1,this.cells.cols)
        idx = parseInt(x * this.options.length / w)
        return _k_.clamp(0,this.options.length - 1,idx)
    }

    radio.prototype["onMouse"] = function (event)
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        radio.__super__.onMouse.call(this,event)
        if (event.type === 'press' && this.hover && this.focusable)
        {
            this.setActive(this.optionAt(this.eventPos(event)[0]))
            this.grabFocus()
            if (_k_.isFunc(this.onSelect))
            {
                this.onSelect(this.active)
            }
            return {redraw:true}
        }
        return this.hover
    }

    radio.prototype["draw"] = function ()
    {
        var candidate, capLeft, capRight, ch, ends, fg, hex, i, idx, label, n, pad, segw, starts, used, w, x, _101_39_

        if (this.hidden() || this.collapsed())
        {
            return
        }
        w = this.cells.cols
        if (w < 1)
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        n = this.options.length
        if (n < 1)
        {
            return
        }
        starts = []
        ends = []
        for (var _a_ = idx = 0, _b_ = n; (_a_ <= _b_ ? idx < n : idx > n); (_a_ <= _b_ ? ++idx : --idx))
        {
            starts.push(parseInt(idx * w / n))
            ends.push(parseInt((idx + 1) * w / n))
            for (var _c_ = x = starts[idx], _d_ = ends[idx]; (_c_ <= _d_ ? x < ends[idx] : x > ends[idx]); (_c_ <= _d_ ? ++x : --x))
            {
                this.cells.set_bg(x,0,this.options[idx].color)
            }
        }
        used = []
        hex = ((_101_39_=this.options[this.active].label) != null ? _101_39_ : '')
        segw = ends[this.active] - starts[this.active]
        label = hex
        if (this.focused)
        {
            var list = ['● ' + hex + ' ●','●' + hex + '●']
            for (var _e_ = 0; _e_ < list.length; _e_++)
            {
                candidate = list[_e_]
                if (candidate.length <= segw)
                {
                    label = candidate
                    break
                }
            }
        }
        label = label.slice(0, typeof _k_.min(segw,label.length) === 'number' ? _k_.min(segw,label.length) : -1)
        pad = _k_.max(0,parseInt((segw - label.length) / 2))
        x = starts[this.active] + pad
        fg = color.adjustForBackground(this.color.fg,this.options[this.active].color)
        var list1 = _k_.list(label)
        for (i = 0; i < list1.length; i++)
        {
            ch = list1[i]
            this.cells.set(x + i,0,ch,fg,this.options[this.active].color)
            used[x + i] = true
        }
        if (w > 1)
        {
            capLeft = !used[0]
            capRight = !used[w - 1]
            if (capLeft && capRight)
            {
                this.cells.set(0,0,'◖',this.options[0].color,this.color.bg)
                return this.cells.set(w - 1,0,'◗',this.options.slice(-1)[0].color,this.color.bg)
            }
        }
    }

    return radio
})()

export default radio;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9yYWRpby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUWtCLFlBQVI7T0FBYyxZQUFkOztPQUNRLFdBQUE7OztBQUVULFNBQVQ7O3NCQUF1QjthQUVuQixPQUFHLFFBQU87Ozs7Ozs7Ozs7OENBRUEsT0FBTztRQUViLEtBQUMsU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUNqQyxLQUFDLFNBQVMsS0FBSyxNQUFNLFlBQVk7UUFFakMsS0FBQztRQUNELEtBQUMsU0FBZTtRQUNoQixLQUFDLFVBQWU7UUFDaEIsS0FBQyxZQUFlO1FBQ2hCLEtBQUMsY0FBZTtRQUNoQixLQUFDLGlCQUFpQjtRQUNsQixLQUFDLFdBQWlCOzs7cUJBRXRCLHlCQUFZOztRQUVSLEtBQUMsV0FBVSxrQkFBQTtzQkFFRixLQUFDOzttQkFDTixLQUFDLFNBQVM7Ozs7bUJBRVYsS0FBQyxtQkFBZSxHQUFHLEtBQUMsUUFBUSxTQUFPLEdBQUcsS0FBQzs7OztxQkFFL0Msd0JBQVc7O3NCQUVLLEtBQUM7Ozs7ZUFDYixLQUFDLG1CQUFlLEdBQUcsS0FBQyxRQUFRLFNBQU8sWUFBTzs7O3FCQUU5Qzs7ZUFBYyxLQUFDOzs7cUJBRWYseUJBQVk7O2VBQVcsS0FBQyxVQUFVOzs7cUJBRWxDLDJCQUFjOztRQUVWLEtBQUMsWUFBYztlQUNmLEtBQUMsZUFBYyxZQUFZLFlBQVk7OztxQkFFM0M7O1lBQXNELFdBQW5CLEtBQUM7O21CQUF0QixLQUFDOzs7O3FCQUVmLHVCQUFVOzs7O3NCQUVRLEtBQUM7O21CQUFaOztRQUVILFlBQVEsRUFBRSxLQUFDLE1BQU07UUFDakIsZUFBVSxJQUFJLEtBQUMsUUFBUSxTQUFTO3lCQUUxQixFQUFFLEtBQUMsUUFBUSxTQUFPLEVBQUU7OztxQkFFOUIsc0JBQVM7O1lBRUMsS0FBQyxZQUFZLEtBQUM7Ozs7MENBRWQ7WUFFSCxNQUFNLFNBQVEsV0FBWSxLQUFDLFNBQVUsS0FBQzs7WUFFckMsS0FBQyxVQUFVLEtBQUMsU0FBUyxLQUFDLFNBQVMsT0FBTztZQUN0QyxLQUFDO2dCQUNpQyxXQUFiLEtBQUM7O2dCQUF0QixLQUFDLFNBQVMsS0FBQzs7b0JBRVQsT0FBTzs7ZUFFYixLQUFDOzs7cUJBRUw7Ozs7WUFFVSxLQUFDLFlBQVksS0FBQzs7OztRQUVwQixJQUFJLEtBQUMsTUFBTTtZQUNMLElBQUk7Ozs7UUFFVixLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxLQUFDLE1BQU07UUFFM0MsSUFBSSxLQUFDLFFBQVE7WUFDUCxJQUFJOzs7O1FBRVY7UUFDQTt1QkFFSSxNQUFPLFNBQUksdUJBQUEsVUFBQTs7WUFDWCxPQUFPLGNBQVMsTUFBSSxJQUFFO1lBQ3RCLEtBQUssZUFBWSxNQUFJLEtBQUcsSUFBRTsyQkFDdEIsSUFBSyxPQUFPLFlBQU8sS0FBSyx3QkFBTCxLQUFLLFdBQUwsS0FBSzs7Z0JBQ3hCLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRSxLQUFDLFFBQVEsS0FBSzs7O1FBRXhDO1FBQ0EsaUJBQU8sS0FBQyxRQUFRLEtBQUMsUUFBUSw0QkFBUTtRQUNqQyxPQUFPLEtBQUssS0FBQyxVQUFRLE9BQU8sS0FBQztRQUU3QixRQUFRO1lBRUwsS0FBQzs7d0JBQ2tCLE9BQU8sTUFBTSxLQUFLLE1BQU0sTUFBTTs7O2dCQUE1QztvQkFDRyxVQUFVLFVBQVU7O29CQUNuQixRQUFRO29CQUNSOzs7O1FBRVosUUFBUSxZQUFNLGtCQUFRLEtBQUssTUFBTSwrQkFBWCxLQUFLLE1BQU07UUFFakMsY0FBVSxZQUFPLE9BQU8sTUFBTSxVQUFRO1FBQ3RDLElBQUksT0FBTyxLQUFDLFVBQVU7UUFDdEIsS0FBSyxNQUFNLG9CQUFvQixLQUFDLE1BQU0sR0FBRyxLQUFDLFFBQVEsS0FBQyxRQUFROzZCQUU5QzthQUFMOztZQUFKO1lBQ0EsS0FBQyxNQUFNLElBQUksSUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLEtBQUMsUUFBUSxLQUFDLFFBQVE7WUFDekMsS0FBSyxJQUFFLEtBQUs7O1lBRWIsSUFBSTs7WUFFSCxXQUFlLEtBQUs7WUFDcEIsWUFBZSxLQUFLLElBQUU7Z0JBRW5CLFdBQVk7O2dCQUNYLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxJQUFJLEtBQUMsUUFBUSxHQUFHLE1BQU0sS0FBQyxNQUFNO3VCQUM1QyxLQUFDLE1BQU0sSUFBSSxJQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUMscUJBQVksTUFBTSxLQUFDLE1BQU07Ozs7O1dBckh0RDs7O2VBdUhGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/radio.kode
