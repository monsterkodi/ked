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
        this["onMouse"] = this["onMouse"].bind(this)
        this["optionAt"] = this["optionAt"].bind(this)
        this["getActive"] = this["getActive"].bind(this)
        this["changeActive"] = this["changeActive"].bind(this)
        this["setActive"] = this["setActive"].bind(this)
        this["setOptions"] = this["setOptions"].bind(this)
        radio.__super__.constructor.call(this,screen,name)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('fg',theme.colorpicker.fg)
        this.options = []
        this.active = 0
        this.pointerType = 'pointer'
        this.setFocusable()
    }

    radio.prototype["setOptions"] = function (options)
    {
        this.options = options
    
        return this.setActive(this.active)
    }

    radio.prototype["setActive"] = function (idx)
    {
        _k_.assert("/home/kodi/s/ked/kode/ked/view/base/radio.kode", 33, 8, "assert failed!" + " !_k_.empty(this.options)", !_k_.empty(this.options))
        return this.active = _k_.clamp(0,(this.options.length - 1),parseInt(idx))
    }

    radio.prototype["changeActive"] = function (idx)
    {
        this.setActive(idx)
        return this.emit('activeChange',this.active)
    }

    radio.prototype["getActive"] = function ()
    {
        return this.active
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
            this.changeActive(this.optionAt(this.eventPos(event)[0]))
            return {redraw:true}
        }
        return this.hover
    }

    radio.prototype["draw"] = function ()
    {
        var candidate, capLeft, capRight, ch, ends, fg, hex, i, idx, label, n, pad, segw, starts, used, w, x, _87_39_

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
        hex = ((_87_39_=this.options[this.active].label) != null ? _87_39_ : '')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9yYWRpby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUWtCLFlBQVI7T0FBYyxZQUFkOztPQUNRLFdBQUE7OztBQUVULFNBQVQ7O3NCQUF1QjthQUVuQixPQUFHLFFBQU87Ozs7Ozs7Ozs4Q0FFQSxPQUFPO1FBRWIsS0FBQyxTQUFTLEtBQUssTUFBTSxZQUFZO1FBQ2pDLEtBQUMsU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUVqQyxLQUFDO1FBQ0QsS0FBQyxTQUFVO1FBQ1gsS0FBQyxjQUFjO1FBRWYsS0FBQzs7O3FCQUVMLHlCQUFhOztRQUFEOztlQUVSLEtBQUMsVUFBVSxLQUFDOzs7cUJBRWhCLHdCQUFXOzs0R0FFQyxLQUFDLHNCQUFELEtBQUM7ZUFDVCxLQUFDLG1CQUFlLEdBQUcsS0FBQyxRQUFRLFNBQU8sWUFBTzs7O3FCQUU5QywyQkFBYzs7UUFFVixLQUFDLFVBQVU7ZUFDWCxLQUFDLEtBQUssZUFBZSxLQUFDOzs7cUJBRTFCOztlQUFjLEtBQUM7OztxQkFFZix1QkFBVTs7OztzQkFFTyxLQUFDOzttQkFBWjs7UUFFRixZQUFRLEVBQUUsS0FBQyxNQUFNO1FBQ2pCLGVBQVUsSUFBSSxLQUFDLFFBQVEsU0FBUzt5QkFFMUIsRUFBRSxLQUFDLFFBQVEsU0FBTyxFQUFFOzs7cUJBRTlCLHNCQUFTOztZQUVBLEtBQUMsWUFBWSxLQUFDOzs7OzBDQUViO1lBRUgsTUFBTSxTQUFRLFdBQVksS0FBQyxTQUFVLEtBQUM7O1lBRXJDLEtBQUMsYUFBYSxLQUFDLFNBQVMsS0FBQyxTQUFTLE9BQU87b0JBQ3ZDLE9BQU87O2VBRWIsS0FBQzs7O3FCQUVMOzs7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsSUFBSSxLQUFDLE1BQU07WUFDTixJQUFJOzs7O1FBRVQsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssS0FBQyxNQUFNO1FBRTNDLElBQUksS0FBQyxRQUFRO1lBQ1IsSUFBSTs7OztRQUVUO1FBQ0E7dUJBRUksTUFBTyxTQUFJLHVCQUFBLFVBQUE7O1lBQ1gsT0FBTyxjQUFTLE1BQUksSUFBRTtZQUN0QixLQUFLLGVBQVksTUFBSSxLQUFHLElBQUU7MkJBQ3RCLElBQUssT0FBTyxZQUFPLEtBQUssd0JBQUwsS0FBSyxXQUFMLEtBQUs7O2dCQUN4QixLQUFDLE1BQU0sT0FBTyxFQUFFLEVBQUUsS0FBQyxRQUFRLEtBQUs7OztRQUV4QztRQUNBLGdCQUFPLEtBQUMsUUFBUSxLQUFDLFFBQVEsMkJBQVE7UUFDakMsT0FBTyxLQUFLLEtBQUMsVUFBUSxPQUFPLEtBQUM7UUFFN0IsUUFBUTtZQUVMLEtBQUM7O3dCQUNrQixPQUFPLE1BQU0sS0FBSyxNQUFNLE1BQU07OztnQkFBNUM7b0JBQ0csVUFBVSxVQUFVOztvQkFDbkIsUUFBUTtvQkFDUjs7OztRQUVaLFFBQVEsWUFBTSxrQkFBUSxLQUFLLE1BQU0sK0JBQVgsS0FBSyxNQUFNO1FBRWpDLGNBQVUsWUFBTyxPQUFPLE1BQU0sVUFBUTtRQUN0QyxJQUFJLE9BQU8sS0FBQyxVQUFVO1FBQ3RCLEtBQUssTUFBTSxvQkFBb0IsS0FBQyxNQUFNLEdBQUcsS0FBQyxRQUFRLEtBQUMsUUFBUTs2QkFFOUM7YUFBTDs7WUFBSjtZQUNBLEtBQUMsTUFBTSxJQUFJLElBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxLQUFDLFFBQVEsS0FBQyxRQUFRO1lBQ3pDLEtBQUssSUFBRSxLQUFLOztZQUViLElBQUk7O1lBRUgsV0FBZSxLQUFLO1lBQ3BCLFlBQWUsS0FBSyxJQUFFO2dCQUVuQixXQUFZOztnQkFDWCxLQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUUsSUFBSSxLQUFDLFFBQVEsR0FBRyxNQUFNLEtBQUMsTUFBTTt1QkFDNUMsS0FBQyxNQUFNLElBQUksSUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFDLHFCQUFZLE1BQU0sS0FBQyxNQUFNOzs7OztXQXZHdEQ7OztlQXlHRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/radio.kode
