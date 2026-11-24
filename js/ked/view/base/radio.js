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
            this.emit('selected',this.selectedIndex)
        }
        return true
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
        var candidate, capLeft, capRight, ch, ends, fg, hex, i, idx, label, n, pad, segw, starts, used, w, x, _89_46_

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
        hex = ((_89_46_=this.options[this.selectedIndex].label) != null ? _89_46_ : '')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9yYWRpby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2tCLFlBQVI7T0FBYyxZQUFkOztPQUNRLFdBQUE7OztBQUNqQixTQUFEOztzQkFBTzthQUNILE9BQUcsUUFBTzs7Ozs7Ozs7OzhDQUVBLE9BQU87UUFFYixLQUFDLFNBQVMsS0FBSyxNQUFNLFlBQVk7UUFDakMsS0FBQyxTQUFTLEtBQUssTUFBTSxZQUFZO1FBRWpDLEtBQUM7UUFDRCxLQUFDLGdCQUFnQjtRQUNqQixLQUFDLGNBQWM7UUFFZixLQUFDOzs7cUJBRUwseUJBQWE7O1FBQUQ7O2VBRVIsS0FBQyxpQkFBaUIsS0FBQzs7O3FCQUV2QiwrQkFBa0I7OzJGQUVOLEtBQUMsc0JBQUQsS0FBQztlQUNULEtBQUMsMEJBQXNCLEdBQUcsS0FBQyxRQUFRLFNBQU8sWUFBTzs7O3FCQUVyRCxxQkFBUTs7WUFFRCxRQUFPLEtBQUM7O1lBQ1AsS0FBQyxpQkFBaUI7WUFDbEIsS0FBQyxLQUFLLFdBQVcsS0FBQzs7ZUFDdEI7OztxQkFFSix1QkFBVTs7OztzQkFFTyxLQUFDOzttQkFBWjs7UUFFRixZQUFRLEVBQUUsS0FBQyxNQUFNO1FBQ2pCLGVBQVUsSUFBSSxLQUFDLFFBQVEsU0FBUzt5QkFFMUIsRUFBRSxLQUFDLFFBQVEsU0FBTyxFQUFFOzs7cUJBRTlCLHNCQUFTOztZQUVBLEtBQUMsWUFBWSxLQUFDOzs7OzBDQUViO1lBRUgsTUFBTSxTQUFRLFdBQVksS0FBQyxTQUFVLEtBQUM7O1lBRXJDLEtBQUMsT0FBTyxLQUFDLFNBQVMsS0FBQyxTQUFTLE9BQU87b0JBQ2pDLE9BQU87O2VBRWIsS0FBQzs7O3FCQUVMLG9CQUFPLEtBQUk7O2FBRVEsS0FBQzs7bUJBQWQ7O1lBQ1MsS0FBQyxZQUFZLEtBQUM7O21CQUF2Qjs7Z0JBRUssTUFBTTs7aUJBQ1Q7dUJBQVksS0FBQyxPQUFPLEtBQUssSUFBSSxLQUFDLGdCQUFjLEVBQUc7O2lCQUMvQzt1QkFBWSxLQUFDLE9BQU8sS0FBSyxJQUFJLEtBQUMsZ0JBQWMsRUFBRyxLQUFDLFFBQVEsU0FBTzs7OztlQUVuRTs7O3FCQUVKOzs7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsSUFBSSxLQUFDLE1BQU07WUFDTixJQUFJOzs7O1FBRVQsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssS0FBQyxNQUFNO1FBRTNDLElBQUksS0FBQyxRQUFRO1lBQ1IsSUFBSTs7OztRQUVUO1FBQ0E7YUFFSSxNQUFPLFNBQUk7O1lBQ1gsT0FBTyxjQUFTLE1BQUksSUFBRTtZQUN0QixLQUFLLGVBQVksTUFBSSxLQUFHLElBQUU7aUJBQ3RCLElBQUssT0FBTyxVQUFPLEtBQUs7O2dCQUN4QixLQUFDLE1BQU0sT0FBTyxFQUFFLEVBQUUsS0FBQyxRQUFRLEtBQUs7OztRQUV4QztRQUNBLGdCQUFPLEtBQUMsUUFBUSxLQUFDLGVBQWUsMkJBQVE7UUFDeEMsT0FBTyxLQUFLLEtBQUMsaUJBQWUsT0FBTyxLQUFDO1FBRXBDLFFBQVE7WUFFTCxLQUFDOzt3QkFDa0IsT0FBSyxNQUFJLEtBQUssTUFBSSxNQUFJOzs7Z0JBQXBDO29CQUNHLFVBQVUsVUFBVTs7b0JBQ25CLFFBQVE7b0JBQ1I7Ozs7UUFFWixRQUFRLFlBQU0sa0JBQVEsS0FBSyxNQUFNLCtCQUFYLEtBQUssTUFBTTtRQUVqQyxjQUFVLFlBQU8sT0FBTyxNQUFNLFVBQVE7UUFDdEMsSUFBSSxPQUFPLEtBQUMsaUJBQWlCO1FBQzdCLEtBQUssTUFBTSxvQkFBb0IsS0FBQyxNQUFNLEdBQUcsS0FBQyxRQUFRLEtBQUMsZUFBZTs2QkFFckQ7YUFBTDs7WUFBSjtZQUNBLEtBQUMsTUFBTSxJQUFJLElBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxLQUFDLFFBQVEsS0FBQyxlQUFlO1lBQ2hELEtBQUssSUFBRSxLQUFLOztZQUViLElBQUk7O1lBRUgsV0FBZSxLQUFLO1lBQ3BCLFlBQWUsS0FBSyxJQUFFO2dCQUVuQixXQUFZOztnQkFDWCxLQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUUsSUFBSSxLQUFDLFFBQVEsR0FBRyxNQUFNLEtBQUMsTUFBTTt1QkFDNUMsS0FBQyxNQUFNLElBQUksSUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFDLHFCQUFZLE1BQU0sS0FBQyxNQUFNOzs7OztXQWpIOUQ7OztlQW1ITSJ9
//# sourceURL=../../../../kode/ked/view/base/radio.kode
