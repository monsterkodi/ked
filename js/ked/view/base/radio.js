var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["optionAt"] = this["optionAt"].bind(this)
        this["getActive"] = this["getActive"].bind(this)
        this["select"] = this["select"].bind(this)
        this["setSelectedIndex"] = this["setSelectedIndex"].bind(this)
        this["setOptions"] = this["setOptions"].bind(this)
        radio.__super__.constructor.call(this,screen,name)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('fg',theme.colorpicker.fg)
        this.options = []
        this.selectedIndex = 0
        this.pointerType = 'pointer'
        this.setFocusable()
    }

    radio.prototype["setOptions"] = function (options)
    {
        this.options = options
    
        return this.setSelectedIndex(this.selectedIndex)
    }

    radio.prototype["setSelectedIndex"] = function (idx)
    {
        _k_.assert("kode/ked/view/base/radio.kode", 24, 8, "assert failed!" + " !_k_.empty(this.options)", !_k_.empty(this.options))
        return this.selectedIndex = _k_.clamp(0,(this.options.length - 1),parseInt(idx))
    }

    radio.prototype["select"] = function (idx)
    {
        if (idx !== this.selectedIndex)
        {
            this.setSelectedIndex(idx)
            this.emit('activeChange',this.selectedIndex)
        }
        return true
    }

    radio.prototype["getActive"] = function ()
    {
        return this.selectedIndex
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
            this.select(this.optionAt(this.eventPos(event)[0]))
            return {redraw:true}
        }
        return this.hover
    }

    radio.prototype["onKey"] = function (key, event)
    {
        if (!this.hasFocus())
        {
            return false
        }
        if (this.hidden() || this.collapsed())
        {
            return false
        }
        switch (event.combo)
        {
            case 'left':
                return this.select(Math.max(this.selectedIndex - 1,0))

            case 'right':
                return this.select(Math.min(this.selectedIndex + 1,this.options.length - 1))

        }

        return false
    }

    radio.prototype["draw"] = function ()
    {
        var candidate, capLeft, capRight, ch, ends, fg, hex, i, idx, label, n, pad, segw, starts, used, w, x, _91_46_

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
        for (idx = 0; idx < n; idx++)
        {
            starts.push(parseInt(idx * w / n))
            ends.push(parseInt((idx + 1) * w / n))
            for (x = starts[idx]; x < ends[idx]; x++)
            {
                this.cells.set_bg(x,0,this.options[idx].color)
            }
        }
        used = []
        hex = ((_91_46_=this.options[this.selectedIndex].label) != null ? _91_46_ : '')
        segw = ends[this.selectedIndex] - starts[this.selectedIndex]
        label = hex
        if (this.focused)
        {
            var list = ['● ' + hex + ' ●','●' + hex + '●']
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                candidate = list[_a_]
                if (candidate.length <= segw)
                {
                    label = candidate
                    break
                }
            }
        }
        label = label.slice(0, typeof _k_.min(segw,label.length) === 'number' ? _k_.min(segw,label.length) : -1)
        pad = _k_.max(0,parseInt((segw - label.length) / 2))
        x = starts[this.selectedIndex] + pad
        fg = color.adjustForBackground(this.color.fg,this.options[this.selectedIndex].color)
        var list1 = _k_.list(label)
        for (i = 0; i < list1.length; i++)
        {
            ch = list1[i]
            this.cells.set(x + i,0,ch,fg,this.options[this.selectedIndex].color)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9yYWRpby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2tCLFlBQVI7T0FBYyxZQUFkOztPQUNRLFdBQUE7OztBQUNqQixTQUFEOztzQkFBTzthQUNILE9BQUcsUUFBTzs7Ozs7Ozs7Ozs4Q0FFQSxPQUFPO1FBRWIsS0FBQyxTQUFTLEtBQUssTUFBTSxZQUFZO1FBQ2pDLEtBQUMsU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUVqQyxLQUFDO1FBQ0QsS0FBQyxnQkFBZ0I7UUFDakIsS0FBQyxjQUFjO1FBRWYsS0FBQzs7O3FCQUVMLHlCQUFhOztRQUFEOztlQUVSLEtBQUMsaUJBQWlCLEtBQUM7OztxQkFFdkIsK0JBQWtCOzsyRkFFTixLQUFDLHNCQUFELEtBQUM7ZUFDVCxLQUFDLDBCQUFzQixHQUFHLEtBQUMsUUFBUSxTQUFPLFlBQU87OztxQkFFckQscUJBQVE7O1lBRUQsUUFBTyxLQUFDOztZQUNQLEtBQUMsaUJBQWlCO1lBQ2xCLEtBQUMsS0FBSyxlQUFlLEtBQUM7O2VBQzFCOzs7cUJBRUo7O2VBQWMsS0FBQzs7O3FCQUVmLHVCQUFVOzs7O3NCQUVPLEtBQUM7O21CQUFaOztRQUVGLFlBQVEsRUFBRSxLQUFDLE1BQU07UUFDakIsZUFBVSxJQUFJLEtBQUMsUUFBUSxTQUFTO3lCQUUxQixFQUFFLEtBQUMsUUFBUSxTQUFPLEVBQUU7OztxQkFFOUIsc0JBQVM7O1lBRUEsS0FBQyxZQUFZLEtBQUM7Ozs7MENBRWI7WUFFSCxNQUFNLFNBQVEsV0FBWSxLQUFDLFNBQVUsS0FBQzs7WUFFckMsS0FBQyxPQUFPLEtBQUMsU0FBUyxLQUFDLFNBQVMsT0FBTztvQkFDakMsT0FBTzs7ZUFFYixLQUFDOzs7cUJBRUwsb0JBQU8sS0FBSTs7YUFFUSxLQUFDOzttQkFBZDs7WUFDUyxLQUFDLFlBQVksS0FBQzs7bUJBQXZCOztnQkFFSyxNQUFNOztpQkFDVDt1QkFBWSxLQUFDLE9BQU8sS0FBSyxJQUFJLEtBQUMsZ0JBQWMsRUFBRzs7aUJBQy9DO3VCQUFZLEtBQUMsT0FBTyxLQUFLLElBQUksS0FBQyxnQkFBYyxFQUFHLEtBQUMsUUFBUSxTQUFPOzs7O2VBRW5FOzs7cUJBRUo7Ozs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixJQUFJLEtBQUMsTUFBTTtZQUNOLElBQUk7Ozs7UUFFVCxLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxLQUFDLE1BQU07UUFFM0MsSUFBSSxLQUFDLFFBQVE7WUFDUixJQUFJOzs7O1FBRVQ7UUFDQTthQUVJLE1BQU8sU0FBSTs7WUFDWCxPQUFPLGNBQVMsTUFBSSxJQUFFO1lBQ3RCLEtBQUssZUFBWSxNQUFJLEtBQUcsSUFBRTtpQkFDdEIsSUFBSyxPQUFPLFVBQU8sS0FBSzs7Z0JBQ3hCLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRSxLQUFDLFFBQVEsS0FBSzs7O1FBRXhDO1FBQ0EsZ0JBQU8sS0FBQyxRQUFRLEtBQUMsZUFBZSwyQkFBUTtRQUN4QyxPQUFPLEtBQUssS0FBQyxpQkFBZSxPQUFPLEtBQUM7UUFFcEMsUUFBUTtZQUVMLEtBQUM7O3dCQUNrQixPQUFLLE1BQUksS0FBSyxNQUFJLE1BQUk7OztnQkFBcEM7b0JBQ0csVUFBVSxVQUFVOztvQkFDbkIsUUFBUTtvQkFDUjs7OztRQUVaLFFBQVEsWUFBTSxrQkFBUSxLQUFLLE1BQU0sK0JBQVgsS0FBSyxNQUFNO1FBRWpDLGNBQVUsWUFBTyxPQUFPLE1BQU0sVUFBUTtRQUN0QyxJQUFJLE9BQU8sS0FBQyxpQkFBaUI7UUFDN0IsS0FBSyxNQUFNLG9CQUFvQixLQUFDLE1BQU0sR0FBRyxLQUFDLFFBQVEsS0FBQyxlQUFlOzZCQUVyRDthQUFMOztZQUFKO1lBQ0EsS0FBQyxNQUFNLElBQUksSUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLEtBQUMsUUFBUSxLQUFDLGVBQWU7WUFDaEQsS0FBSyxJQUFFLEtBQUs7O1lBRWIsSUFBSTs7WUFFSCxXQUFlLEtBQUs7WUFDcEIsWUFBZSxLQUFLLElBQUU7Z0JBRW5CLFdBQVk7O2dCQUNYLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxJQUFJLEtBQUMsUUFBUSxHQUFHLE1BQU0sS0FBQyxNQUFNO3VCQUM1QyxLQUFDLE1BQU0sSUFBSSxJQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUMscUJBQVksTUFBTSxLQUFDLE1BQU07Ozs7O1dBbkg5RDs7O2VBcUhNIn0=
//# sourceURL=../../../../kode/ked/view/base/radio.kode
