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
        _k_.assert("/home/kodi/s/ked/kode/ked/view/base/radio.kode", 24, 8, "assert failed!" + " !_k_.empty(this.options)", !_k_.empty(this.options))
        return this.active = _k_.clamp(0,(this.options.length - 1),parseInt(idx))
    }

    radio.prototype["changeActive"] = function (idx)
    {
        if (idx !== this.active)
        {
            this.setActive(idx)
            this.emit('activeChange',this.active)
        }
        return true
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
                return this.changeActive(Math.max(this.active - 1,0))

            case 'right':
                return this.changeActive(Math.min(this.active + 1,this.options.length - 1))

        }

        return false
    }

    radio.prototype["draw"] = function ()
    {
        var candidate, capLeft, capRight, ch, ends, fg, hex, i, idx, label, n, pad, segw, starts, used, w, x, _91_39_

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
        hex = ((_91_39_=this.options[this.active].label) != null ? _91_39_ : '')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9yYWRpby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2tCLFlBQVI7T0FBYyxZQUFkOztPQUNRLFdBQUE7OztBQUNqQixTQUFEOztzQkFBZTthQUNYLE9BQUcsUUFBTzs7Ozs7Ozs7Ozs4Q0FFQSxPQUFPO1FBRWIsS0FBQyxTQUFTLEtBQUssTUFBTSxZQUFZO1FBQ2pDLEtBQUMsU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUVqQyxLQUFDO1FBQ0QsS0FBQyxTQUFVO1FBQ1gsS0FBQyxjQUFjO1FBRWYsS0FBQzs7O3FCQUVMLHlCQUFhOztRQUFEOztlQUVSLEtBQUMsVUFBVSxLQUFDOzs7cUJBRWhCLHdCQUFXOzs0R0FFQyxLQUFDLHNCQUFELEtBQUM7ZUFDVCxLQUFDLG1CQUFlLEdBQUcsS0FBQyxRQUFRLFNBQU8sWUFBTzs7O3FCQUU5QywyQkFBYzs7WUFFUCxRQUFPLEtBQUM7O1lBQ1AsS0FBQyxVQUFVO1lBQ1gsS0FBQyxLQUFLLGVBQWUsS0FBQzs7ZUFDMUI7OztxQkFFSjs7ZUFBYyxLQUFDOzs7cUJBRWYsdUJBQVU7Ozs7c0JBRU8sS0FBQzs7bUJBQVo7O1FBRUYsWUFBUSxFQUFFLEtBQUMsTUFBTTtRQUNqQixlQUFVLElBQUksS0FBQyxRQUFRLFNBQVM7eUJBRTFCLEVBQUUsS0FBQyxRQUFRLFNBQU8sRUFBRTs7O3FCQUU5QixzQkFBUzs7WUFFQSxLQUFDLFlBQVksS0FBQzs7OzswQ0FFYjtZQUVILE1BQU0sU0FBUSxXQUFZLEtBQUMsU0FBVSxLQUFDOztZQUVyQyxLQUFDLGFBQWEsS0FBQyxTQUFTLEtBQUMsU0FBUyxPQUFPO29CQUN2QyxPQUFPOztlQUViLEtBQUM7OztxQkFFTCxvQkFBTyxLQUFJOzthQUVRLEtBQUM7O21CQUFkOztZQUNTLEtBQUMsWUFBWSxLQUFDOzttQkFBdkI7O2dCQUVLLE1BQU07O2lCQUNUO3VCQUFZLEtBQUMsYUFBYSxLQUFLLElBQUksS0FBQyxTQUFPLEVBQUc7O2lCQUM5Qzt1QkFBWSxLQUFDLGFBQWEsS0FBSyxJQUFJLEtBQUMsU0FBTyxFQUFHLEtBQUMsUUFBUSxTQUFPOzs7O2VBRWxFOzs7cUJBRUo7Ozs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixJQUFJLEtBQUMsTUFBTTtZQUNOLElBQUk7Ozs7UUFFVCxLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxLQUFDLE1BQU07UUFFM0MsSUFBSSxLQUFDLFFBQVE7WUFDUixJQUFJOzs7O1FBRVQ7UUFDQTt1QkFFSSxNQUFPLFNBQUksdUJBQUEsVUFBQTs7WUFDWCxPQUFPLGNBQVMsTUFBSSxJQUFFO1lBQ3RCLEtBQUssZUFBWSxNQUFJLEtBQUcsSUFBRTsyQkFDdEIsSUFBSyxPQUFPLFlBQU8sS0FBSyx3QkFBTCxLQUFLLFdBQUwsS0FBSzs7Z0JBQ3hCLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRSxLQUFDLFFBQVEsS0FBSzs7O1FBRXhDO1FBQ0EsZ0JBQU8sS0FBQyxRQUFRLEtBQUMsUUFBUSwyQkFBUTtRQUNqQyxPQUFPLEtBQUssS0FBQyxVQUFRLE9BQU8sS0FBQztRQUU3QixRQUFRO1lBRUwsS0FBQzs7d0JBQ2tCLE9BQUssTUFBSSxLQUFLLE1BQUksTUFBSTs7O2dCQUFwQztvQkFDRyxVQUFVLFVBQVU7O29CQUNuQixRQUFRO29CQUNSOzs7O1FBRVosUUFBUSxZQUFNLGtCQUFRLEtBQUssTUFBTSwrQkFBWCxLQUFLLE1BQU07UUFFakMsY0FBVSxZQUFPLE9BQU8sTUFBTSxVQUFRO1FBQ3RDLElBQUksT0FBTyxLQUFDLFVBQVU7UUFDdEIsS0FBSyxNQUFNLG9CQUFvQixLQUFDLE1BQU0sR0FBRyxLQUFDLFFBQVEsS0FBQyxRQUFROzZCQUU5QzthQUFMOztZQUFKO1lBQ0EsS0FBQyxNQUFNLElBQUksSUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLEtBQUMsUUFBUSxLQUFDLFFBQVE7WUFDekMsS0FBSyxJQUFFLEtBQUs7O1lBRWIsSUFBSTs7WUFFSCxXQUFlLEtBQUs7WUFDcEIsWUFBZSxLQUFLLElBQUU7Z0JBRW5CLFdBQVk7O2dCQUNYLEtBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxJQUFJLEtBQUMsUUFBUSxHQUFHLE1BQU0sS0FBQyxNQUFNO3VCQUM1QyxLQUFDLE1BQU0sSUFBSSxJQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUMscUJBQVksTUFBTSxLQUFDLE1BQU07Ozs7O1dBbkg5RDs7O2VBcUhNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/radio.kode
