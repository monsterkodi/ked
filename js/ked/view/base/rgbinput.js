var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var rgbinput

import theme from "../../theme/theme.js"

import input from "./input.js"


rgbinput = (function ()
{
    _k_.extend(rgbinput, input)
    function rgbinput (screen, name)
    {
        this["onKey"] = this["onKey"].bind(this)
        this["drawCursors"] = this["drawCursors"].bind(this)
        this["clampText"] = this["clampText"].bind(this)
        this["setValue"] = this["setValue"].bind(this)
        rgbinput.__super__.constructor.call(this,screen,name)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('bg_blur',theme.colorpicker.bg)
        this.setColor('bg_focus',theme.selection.line)
        this.setColor('empty',theme.colorpicker.bg)
        this.value = 0
        this.set('0')
    }

    rgbinput.prototype["getValue"] = function ()
    {
        return this.value
    }

    rgbinput.prototype["setValue"] = function (v)
    {
        var text

        v = _k_.clamp(0,255,parseInt(v))
        this.value = v
        text = `${v}`
        if (this.current() !== text)
        {
            return this.set(text)
        }
    }

    rgbinput.prototype["clampText"] = function ()
    {
        var ch, digits, text, v

        text = this.current()
        digits = ''
        var list = _k_.list(text)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            ch = list[_a_]
            if (_k_.in(ch,'0123456789'))
            {
                digits += ch
            }
        }
        v = _k_.clamp(0,255,((digits.length ? parseInt(digits) : 0)))
        text = `${v}`
        if (this.current() !== text)
        {
            this.set(text)
            this.state.moveCursors('eol')
        }
        this.value = v
        return v
    }

    rgbinput.prototype["drawCursors"] = function ()
    {
        if (!this.hasFocus())
        {
            return
        }
        return rgbinput.__super__.drawCursors.call(this)
    }

    rgbinput.prototype["onKey"] = function (key, event)
    {
        var handled

        if (!this.hasFocus())
        {
            return false
        }
        switch (event.combo)
        {
            case 'up':
            case 'down':
            case 'tab':
            case 'shift+tab':
            case 'return':
            case 'esc':
                return false

        }

        if (!_k_.empty(event.char) && !(_k_.in(event.char,'0123456789')))
        {
            return true
        }
        handled = rgbinput.__super__.onKey.call(this,key,event)
        if (handled)
        {
            this.clampText()
        }
        return handled
    }

    return rgbinput
})()

export default rgbinput;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmdiaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9yZ2JpbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BT2tCLFlBQVI7O09BQ1MsWUFBQTs7O0FBRVYsWUFBVDs7eUJBQTBCO2FBRXRCLFVBQUcsUUFBTzs7Ozs7O2lEQUVBLE9BQU87UUFFYixLQUFDLFNBQVMsS0FBVyxNQUFNLFlBQVk7UUFDdkMsS0FBQyxTQUFTLFVBQVcsTUFBTSxZQUFZO1FBQ3ZDLEtBQUMsU0FBUyxXQUFXLE1BQU0sVUFBVTtRQUNyQyxLQUFDLFNBQVMsUUFBVyxNQUFNLFlBQVk7UUFFdkMsS0FBQyxRQUFRO1FBQ1QsS0FBQyxJQUFJOzs7d0JBRVQ7O2VBQWEsS0FBQzs7O3dCQUVkLHVCQUFVOzs7O1FBRU4sY0FBVSxFQUFFLGFBQVE7UUFDcEIsS0FBQyxRQUFRO1FBRVQsVUFBVTtZQUNQLEtBQUMsY0FBYTs7bUJBQ2IsS0FBQyxJQUFJOzs7O3dCQUViOzs7O1FBRUksT0FBUyxLQUFDO1FBQ1YsU0FBUzs0QkFFQzs7O1lBQU47dUJBQ2dCLEdBQU07O2dCQUF0QixVQUFVOzs7UUFFZCxjQUFVLEVBQUUsTUFBSyxPQUFPLFNBQVMsU0FBUyxVQUFVO1FBQ3BELFVBQVU7WUFFUCxLQUFDLGNBQWE7O1lBQ2IsS0FBQyxJQUFJO1lBQ0wsS0FBQyxNQUFNLFlBQVk7O1FBRXZCLEtBQUMsUUFBUTtlQUNUOzs7d0JBRUo7O2FBRWMsS0FBQzs7Ozs7Ozt3QkFHZixvQkFBTyxLQUFJOzs7O2FBRVMsS0FBQzs7bUJBQWQ7O2dCQUVJLE1BQU07O2lCQUNUO2lCQUFLO2lCQUFPO2lCQUFNO2lCQUFZO2lCQUFTO3VCQUFXOzs7O3VCQUU3QyxNQUFNLGtCQUFjLE1BQU0sS0FBUTs7bUJBQ3BDOztRQUVQLDZDQUFnQixJQUFJO1lBRUo7O1lBQWhCLEtBQUM7O2VBRUQ7OztXQTlEQzs7O2VBZ0VGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/rgbinput.kode
