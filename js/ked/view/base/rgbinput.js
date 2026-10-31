var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var rgbinput

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import input from "./input.js"


rgbinput = (function ()
{
    _k_.extend(rgbinput, input)
    function rgbinput (screen, name)
    {
        this["onKey"] = this["onKey"].bind(this)
        this["drawCursors"] = this["drawCursors"].bind(this)
        this["setValue"] = this["setValue"].bind(this)
        this["changeValue"] = this["changeValue"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        rgbinput.__super__.constructor.call(this,screen,name)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('bg_blur',theme.colorpicker.bg)
        this.setColor('bg_focus',theme.selection.line)
        this.setColor('empty',theme.colorpicker.bg)
        this.textColor = theme.colorpicker.fg
        this.value = 0
        this.set('0')
        this.state.skipAdjustViewForMainCursor = true
        this.pointerType = 'text'
    }

    rgbinput.prototype["getValue"] = function ()
    {
        return this.value
    }

    rgbinput.prototype["onWheel"] = function (event)
    {
        var dir, step

        if (this.hidden() || this.collapsed())
        {
            return
        }
        if (!this.cells.isInsideEvent(event))
        {
            return
        }
        dir = ((function ()
        {
            switch (event.dir)
            {
                case 'up':
                    return 1

                case 'right':
                    return 1

                case 'down':
                    return -1

                case 'left':
                    return -1

                default:
                    return
            }

        }).bind(this))()
        step = 1
        if (event.shift)
        {
            step = 10
        }
        this.changeValue(this.value + dir * step)
        this.state.moveCursors(((dir > 0 ? 'eol' : 'bol')))
        return {redraw:true}
    }

    rgbinput.prototype["changeValue"] = function (v)
    {
        v = _k_.clamp(0,255,parseInt(v))
        if (v !== this.value)
        {
            this.setValue(v)
            return this.emit('valueChange',this.value)
        }
    }

    rgbinput.prototype["setValue"] = function (v)
    {
        this.value = _k_.clamp(0,255,parseInt(v))
        if (`${this.value}` !== this.current())
        {
            this.set(`${this.value}`)
            return this.state.moveCursors('eol')
        }
    }

    rgbinput.prototype["draw"] = function ()
    {
        rgbinput.__super__.draw.call(this)
    
        var ch, x

        if (this.hidden() || this.collapsed())
        {
            return
        }
        var list = _k_.list(this.current())
        for (x = 0; x < list.length; x++)
        {
            ch = list[x]
            this.cells.set_fg(x,0,this.textColor)
        }
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
            case 'cmd+a':
            case 'cmd+left':
            case 'cmd+right':
            case 'shift+left':
            case 'shift+right':
            case 'left':
            case 'right':
            case 'delete':
            case 'backspace':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                rgbinput.__super__.onKey.call(this,key,event)
                this.changeValue(parseInt(this.current()))
                return true

        }

        return false
    }

    return rgbinput
})()

export default rgbinput;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmdiaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9yZ2JpbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BVWEsVUFBQTtJQUFNOztPQUNBLFlBQVQ7O09BQ1MsWUFBQTs7O0FBRVYsWUFBVDs7eUJBQTBCO2FBRXRCLFVBQUcsUUFBTzs7Ozs7OztpREFFQSxPQUFPO1FBRWIsS0FBQyxTQUFTLEtBQVcsTUFBTSxZQUFZO1FBQ3ZDLEtBQUMsU0FBUyxVQUFXLE1BQU0sWUFBWTtRQUN2QyxLQUFDLFNBQVMsV0FBVyxNQUFNLFVBQVU7UUFDckMsS0FBQyxTQUFTLFFBQVcsTUFBTSxZQUFZO1FBRXZDLEtBQUMsWUFBWSxNQUFNLFlBQVk7UUFDL0IsS0FBQyxRQUFZO1FBQ2IsS0FBQyxJQUFJO1FBRUwsS0FBQyxNQUFNLDhCQUE4QjtRQUVyQyxLQUFDLGNBQWlCOzs7d0JBRXRCOztlQUFhLEtBQUM7Ozt3QkFFZCxzQkFBUzs7OztZQUVBLEtBQUMsWUFBWSxLQUFDOzs7O2FBQ1YsS0FBQyxNQUFNLGNBQWM7Ozs7UUFFOUI7O29CQUFhLE1BQU07O3FCQUNmOzJCQUFXOztxQkFDWDsyQkFBVzs7cUJBQ1g7MkJBQVU7O3FCQUNWOzJCQUFVOzs7Ozs7O1FBR2QsT0FBTztZQUNNLE1BQU07O1lBQW5CLE9BQU87O1FBRVAsS0FBQyxZQUFZLEtBQUMsUUFBUSxNQUFJO1FBRTFCLEtBQUMsTUFBTSxjQUFhLE1BQU0sSUFBSSxRQUFRO2dCQUV0QyxPQUFPOzs7d0JBRVgsMEJBQWE7O1FBRVQsY0FBVSxFQUFFLGFBQVE7WUFDakIsTUFBSyxLQUFDOztZQUNMLEtBQUMsU0FBUzttQkFDVixLQUFDLEtBQUssY0FBYyxLQUFDOzs7O3dCQUU3Qix1QkFBVTs7UUFFTixLQUFDLGtCQUFjLEVBQUUsYUFBUTtlQUNuQixLQUFDLFlBQVcsS0FBQzs7WUFDZixLQUFDLE9BQU8sS0FBQzttQkFDVCxLQUFDLE1BQU0sWUFBWTs7Ozt3QkFFM0I7Ozs7OztZQUlTLEtBQUMsWUFBWSxLQUFDOzs7OzRCQUVOLEtBQUM7YUFBTjs7WUFBSjtZQUNBLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRSxLQUFDOzs7O3dCQUUzQjs7YUFFYSxLQUFDOzs7Ozs7O3dCQUdkLG9CQUFPLEtBQUk7O2FBRVEsS0FBQzs7bUJBQWQ7O1lBQ1MsS0FBQyxZQUFZLEtBQUM7O21CQUF2Qjs7Z0JBRUssTUFBTTs7aUJBQ1Q7aUJBQVE7aUJBQVc7aUJBQVk7aUJBQWE7aUJBQzVDO2lCQUFPO2lCQUFRO2lCQUFTO2lCQUN4QjtpQkFBRztpQkFBRztpQkFBRztpQkFBRztpQkFBRztpQkFBRztpQkFBRztpQkFBRztpQkFBRzttREFDakIsSUFBSTtnQkFDVixLQUFDLFlBQVksU0FBUyxLQUFDO3VCQUNyQjs7OztlQUNWOzs7V0FsRkM7OztlQW9GRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/rgbinput.kode
