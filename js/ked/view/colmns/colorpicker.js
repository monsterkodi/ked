var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var colorpicker, PICKER_HEIGHT

import kxk from "../../../kxk.js"
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import colorslider from "../base/colorslider.js"
import rgbinput from "../base/rgbinput.js"

PICKER_HEIGHT = 9

colorpicker = (function ()
{
    _k_.extend(colorpicker, view)
    function colorpicker (screen, name)
    {
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["cancel"] = this["cancel"].bind(this)
        this["submit"] = this["submit"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["focusUp"] = this["focusUp"].bind(this)
        this["focusNext"] = this["focusNext"].bind(this)
        this["focusTo"] = this["focusTo"].bind(this)
        this["emitChanged"] = this["emitChanged"].bind(this)
        this["rgbChanged"] = this["rgbChanged"].bind(this)
        this["sliderChanged"] = this["sliderChanged"].bind(this)
        this["syncFromRgb"] = this["syncFromRgb"].bind(this)
        this["syncFromSliders"] = this["syncFromSliders"].bind(this)
        this["setHex"] = this["setHex"].bind(this)
        this["syncAll"] = this["syncAll"].bind(this)
        this["syncInputs"] = this["syncInputs"].bind(this)
        this["syncSliders"] = this["syncSliders"].bind(this)
        this["hex"] = this["hex"].bind(this)
        this["rgb"] = this["rgb"].bind(this)
        this["onFocus"] = this["onFocus"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        colorpicker.__super__.constructor.call(this,screen,name)
        this.height = PICKER_HEIGHT
        this.focused = false
        this.focusIndex = 0
        this.h = 0
        this.s = 100
        this.v = 100
        this.hue = new colorslider(screen,`${this.name}_hue`)
        this.bright = new colorslider(screen,`${this.name}_bright`)
        this.sat = new colorslider(screen,`${this.name}_sat`)
        this.red = new rgbinput(screen,`${this.name}_red`)
        this.green = new rgbinput(screen,`${this.name}_green`)
        this.blue = new rgbinput(screen,`${this.name}_blue`)
        this.sliders = [this.hue,this.bright,this.sat]
        this.inputs = [this.red,this.green,this.blue]
        this.red.textColor = theme.colorpicker.red
        this.green.textColor = theme.colorpicker.green
        this.blue.textColor = theme.colorpicker.blue
        this.childNames = [this.name,this.red.name,this.green.name,this.blue.name]
        this.hue.min = 0
        this.hue.max = 360
        this.bright.min = 0
        this.bright.max = 100
        this.sat.min = 0
        this.sat.max = 100
        this.hue.gradient = function (v)
        {
            return color.hsvToRgb([v,100,100])
        }
        this.bright.gradient = (function (v)
        {
            return color.hsvToRgb([this.h,this.s,v])
        }).bind(this)
        this.sat.gradient = (function (v)
        {
            return color.hsvToRgb([this.h,v,this.v])
        }).bind(this)
        this.hue.onFocusRequest = (function ()
        {
            return this.focusTo(0)
        }).bind(this)
        this.bright.onFocusRequest = (function ()
        {
            return this.focusTo(1)
        }).bind(this)
        this.sat.onFocusRequest = (function ()
        {
            return this.focusTo(2)
        }).bind(this)
        this.red.onFocusRequest = (function ()
        {
            return this.focusTo(3)
        }).bind(this)
        this.green.onFocusRequest = (function ()
        {
            return this.focusTo(4)
        }).bind(this)
        this.blue.onFocusRequest = (function ()
        {
            return this.focusTo(5)
        }).bind(this)
        this.hue.onInput = (function ()
        {
            return this.sliderChanged()
        }).bind(this)
        this.bright.onInput = (function ()
        {
            return this.sliderChanged()
        }).bind(this)
        this.sat.onInput = (function ()
        {
            return this.sliderChanged()
        }).bind(this)
        this.red.onInput = (function ()
        {
            return this.rgbChanged()
        }).bind(this)
        this.green.onInput = (function ()
        {
            return this.rgbChanged()
        }).bind(this)
        this.blue.onInput = (function ()
        {
            return this.rgbChanged()
        }).bind(this)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('fg',theme.colorpicker.fg)
        this.isVisible = false
        post.on('focus',this.onFocus)
        this.syncAll()
    }

    colorpicker.prototype["hasFocus"] = function ()
    {
        return this.focused
    }

    colorpicker.prototype["onFocus"] = function (name)
    {
        var i, input, j, slider

        this.focused = _k_.in(name,this.childNames)
        var list = _k_.list(this.inputs)
        for (i = 0; i < list.length; i++)
        {
            input = list[i]
            if (name === input.name)
            {
                this.focusIndex = i + 3
            }
        }
        var list1 = _k_.list(this.sliders)
        for (j = 0; j < list1.length; j++)
        {
            slider = list1[j]
            slider.focused = this.focused && j === this.focusIndex
        }
        if (this.focused)
        {
            return post.emit('redraw')
        }
    }

    colorpicker.prototype["rgb"] = function ()
    {
        return color.hsvToRgb([this.h,this.s,this.v])
    }

    colorpicker.prototype["hex"] = function ()
    {
        return color.hex(this.rgb())
    }

    colorpicker.prototype["syncSliders"] = function ()
    {
        this.hue.setValue(this.h)
        this.bright.setValue(this.v)
        return this.sat.setValue(this.s)
    }

    colorpicker.prototype["syncInputs"] = function ()
    {
        var i, rgb

        rgb = this.rgb()
        for (i = 0; i < 3; i++)
        {
            this.inputs[i].setValue(rgb[i])
        }
    }

    colorpicker.prototype["syncAll"] = function ()
    {
        this.syncSliders()
        return this.syncInputs()
    }

    colorpicker.prototype["setHex"] = function (hex)
    {
        var h, rgb, s, v

        if (_k_.empty(hex))
        {
            return
        }
        rgb = color.values(hex)
        if (_k_.empty(rgb))
        {
            return
        }
        var _a_ = color.rgbToHsv(rgb); h = _a_[0]; s = _a_[1]; v = _a_[2]

        this.h = h
        this.s = s
        this.v = v
        return this.syncAll()
    }

    colorpicker.prototype["syncFromSliders"] = function ()
    {
        this.h = this.hue.getValue()
        this.v = this.bright.getValue()
        this.s = this.sat.getValue()
        return this.syncInputs()
    }

    colorpicker.prototype["syncFromRgb"] = function ()
    {
        var h, rgb, s, v

        rgb = [this.red.getValue(),this.green.getValue(),this.blue.getValue()]
        var _a_ = color.rgbToHsv(rgb); h = _a_[0]; s = _a_[1]; v = _a_[2]

        if (s === 0)
        {
            h = this.h
        }
        if (v === 0)
        {
            h = this.h
        }
        if (v === 0)
        {
            s = this.s
        }
        this.h = h
        this.s = s
        this.v = v
        return this.syncSliders()
    }

    colorpicker.prototype["sliderChanged"] = function ()
    {
        var before

        before = this.hex()
        this.syncFromSliders()
        return this.emitChanged(before)
    }

    colorpicker.prototype["rgbChanged"] = function ()
    {
        var before

        before = this.hex()
        this.syncFromRgb()
        return this.emitChanged(before)
    }

    colorpicker.prototype["emitChanged"] = function (before)
    {
        var after

        after = this.hex()
        if (after === before)
        {
            return
        }
        post.emit('colorpicker.change',after)
        return post.emit('redraw')
    }

    colorpicker.prototype["focusTo"] = function (i)
    {
        var input, j

        this.focusIndex = _k_.clamp(0,5,parseInt(i))
        var list = _k_.list(this.inputs)
        for (j = 0; j < list.length; j++)
        {
            input = list[j]
            if (j + 3 !== this.focusIndex)
            {
                input.state.deselect()
            }
        }
        if (this.focusIndex < 3)
        {
            post.emit('focus',this.name)
        }
        else
        {
            input = this.inputs[this.focusIndex - 3]
            input.grabFocus()
            input.selectAll()
        }
        return post.emit('redraw')
    }

    colorpicker.prototype["focusNext"] = function (dir)
    {
        return this.focusTo((this.focusIndex + dir + 6) % 6)
    }

    colorpicker.prototype["focusUp"] = function ()
    {
        switch (this.focusIndex)
        {
            case 1:
                return this.focusTo(0)

            case 2:
                return this.focusTo(1)

            case 3:
                return this.focusTo(2)

            case 4:
                return this.focusTo(2)

            case 5:
                return this.focusTo(2)

        }

    }

    colorpicker.prototype["show"] = function (hex)
    {
        if ((hex != null))
        {
            this.setHex(hex)
        }
        colorpicker.__super__.show.call(this)
        return this.focusTo(0)
    }

    colorpicker.prototype["hide"] = function ()
    {
        var input

        if (this.hidden())
        {
            return
        }
        colorpicker.__super__.hide.call(this)
        this.focused = false
        this.focusIndex = 0
        var list = _k_.list(this.inputs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            input = list[_a_]
            input.state.deselect()
        }
        post.emit('focus','editor')
        return post.emit('redraw')
    }

    colorpicker.prototype["submit"] = function ()
    {
        post.emit('colorpicker.submit',this.hex())
        return this.hide()
    }

    colorpicker.prototype["cancel"] = function ()
    {
        post.emit('colorpicker.hide')
        return this.hide()
    }

    colorpicker.prototype["onMouse"] = function (event)
    {
        var input, ret, slider

        if (this.hidden() || this.collapsed())
        {
            return
        }
        var list = _k_.list(this.sliders)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            slider = list[_a_]
            ret = slider.onMouse(event)
            if ((ret != null ? ret.redraw : undefined))
            {
                return ret
            }
        }
        var list1 = _k_.list(this.inputs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            input = list1[_b_]
            ret = input.onMouse(event)
            if ((ret != null ? ret.redraw : undefined))
            {
                return ret
            }
        }
        return colorpicker.__super__.onMouse.call(this,event)
    }

    colorpicker.prototype["onWheel"] = function (event)
    {
        var input, ret, slider

        if (this.hidden() || this.collapsed())
        {
            return
        }
        var list = _k_.list(this.sliders)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            slider = list[_a_]
            ret = slider.onWheel(event)
            if ((ret != null ? ret.redraw : undefined))
            {
                return ret
            }
        }
        var list1 = _k_.list(this.inputs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            input = list1[_b_]
            ret = input.onWheel(event)
            if ((ret != null ? ret.redraw : undefined))
            {
                return ret
            }
        }
        if (this.cells.isInsideEvent(event))
        {
            return {redraw:false}
        }
    }

    colorpicker.prototype["onKey"] = function (key, event)
    {
        var before, handled, input, slider

        if (this.hidden() || !this.focused)
        {
            return false
        }
        switch (event.combo)
        {
            case 'tab':
                this.focusNext(1)
                return true

            case 'shift+tab':
                this.focusNext(-1)
                return true

            case 'down':
                this.focusNext(1)
                return true

            case 'esc':
                this.cancel()
                return true

            case 'return':
                this.submit()
                return true

        }

        before = this.hex()
        if (this.focusIndex < 3)
        {
            slider = this.sliders[this.focusIndex]
            switch (event.combo)
            {
                case 'left':
                    slider.setValue(slider.value - 1)
                    break
                case 'right':
                    slider.setValue(slider.value + 1)
                    break
                case 'shift+left':
                    slider.setValue(slider.value - 10)
                    break
                case 'shift+right':
                    slider.setValue(slider.value + 10)
                    break
                case 'cmd+left':
                case 'ctrl+left':
                    slider.setValue(slider.min)
                    break
                case 'cmd+right':
                case 'ctrl+right':
                    slider.setValue(slider.max)
                    break
                case 'up':
                    this.focusUp()
                    return true

                default:
                    return false
            }

            this.syncFromSliders()
            this.emitChanged(before)
            return true
        }
        input = this.inputs[this.focusIndex - 3]
        switch (event.combo)
        {
            case 'up':
                this.focusTo(2)
                return true

        }

        handled = input.onKey(key,event)
        if (handled)
        {
            this.syncFromRgb()
            this.emitChanged(before)
        }
        return handled
    }

    colorpicker.prototype["layout"] = function (x, y, w, h)
    {
        colorpicker.__super__.layout.call(this,x,y,w,h)
    
        var aw, gap, iw, start

        this.hue.layout(x + 1,y + 1,w - 2,1)
        this.bright.layout(x + 1,y + 2,w - 2,1)
        this.sat.layout(x + 1,y + 3,w - 2,1)
        aw = _k_.max(1,w - 2)
        iw = _k_.max(3,_k_.min(5,parseInt(aw / 3)))
        gap = _k_.max(0,parseInt((aw - 3 * iw) / 2))
        start = _k_.max(0,parseInt((aw - (3 * iw + 2 * gap)) / 2))
        this.red.layout(x + 1 + start,y + 5,iw,1)
        this.green.layout(x + 1 + start + iw + gap,y + 5,iw,1)
        return this.blue.layout(x + 1 + start + 2 * (iw + gap),y + 5,iw,1)
    }

    colorpicker.prototype["draw"] = function ()
    {
        var ch, fg, hex, i, rgb, x

        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        this.hue.draw()
        this.bright.draw()
        this.sat.draw()
        this.red.draw()
        this.green.draw()
        this.blue.draw()
        rgb = this.rgb()
        this.cells.fill_rect(1,7,-2,7,' ',null,rgb)
        hex = this.hex()
        fg = color.adjustForBackground(this.color.fg,rgb)
        x = _k_.max(1,parseInt((this.cells.cols - hex.length) / 2))
        var list = _k_.list(hex)
        for (i = 0; i < list.length; i++)
        {
            ch = list[i]
            this.cells.set(x + i,7,ch,fg,rgb)
        }
        return colorpicker.__super__.draw.call(this)
    }

    return colorpicker
})()

export default colorpicker;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FhYSxVQUFBO0lBQU07O09BQ0EsWUFBVDtPQUFlLFlBQWY7O09BQ1MsV0FBWjtPQUFpQixrQkFBakI7T0FBNkIsZUFBN0I7O0FBRVAsZ0JBQWdCOztBQUVQLGVBQVQ7OzRCQUE2QjthQUV6QixhQUFHLFFBQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvREFFQSxPQUFPO1FBRWIsS0FBQyxTQUFhO1FBQ2QsS0FBQyxVQUFhO1FBQ2QsS0FBQyxhQUFhO1FBRWQsS0FBQyxJQUFJO1FBQ0wsS0FBQyxJQUFJO1FBQ0wsS0FBQyxJQUFJO1FBRUwsS0FBQyxVQUFhLFlBQVksVUFBVSxLQUFDO1FBQ3JDLEtBQUMsYUFBYSxZQUFZLFVBQVUsS0FBQztRQUNyQyxLQUFDLFVBQWEsWUFBWSxVQUFVLEtBQUM7UUFFckMsS0FBQyxVQUFZLFNBQVMsVUFBVSxLQUFDO1FBQ2pDLEtBQUMsWUFBWSxTQUFTLFVBQVUsS0FBQztRQUNqQyxLQUFDLFdBQVksU0FBUyxVQUFVLEtBQUM7UUFFakMsS0FBQyxXQUFXLEtBQUMsSUFBSSxLQUFDLE9BQU8sS0FBQztRQUMxQixLQUFDLFVBQVcsS0FBQyxJQUFJLEtBQUMsTUFBTSxLQUFDO1FBRXpCLEtBQUMsSUFBSSxZQUFjLE1BQU0sWUFBWTtRQUNyQyxLQUFDLE1BQU0sWUFBWSxNQUFNLFlBQVk7UUFDckMsS0FBQyxLQUFLLFlBQWEsTUFBTSxZQUFZO1FBRXJDLEtBQUMsY0FBYyxLQUFDLEtBQUssS0FBQyxJQUFJLEtBQUssS0FBQyxNQUFNLEtBQUssS0FBQyxLQUFLO1FBRWpELEtBQUMsSUFBSSxNQUFNO1FBQ1gsS0FBQyxJQUFJLE1BQU07UUFFWCxLQUFDLE9BQU8sTUFBTTtRQUNkLEtBQUMsT0FBTyxNQUFNO1FBRWQsS0FBQyxJQUFJLE1BQU07UUFDWCxLQUFD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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
