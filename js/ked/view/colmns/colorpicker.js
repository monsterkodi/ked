var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var colorpicker, PICKER_HEIGHT, RADIO_FOCUS

import kxk from "../../../kxk.js"
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import colorslider from "../base/colorslider.js"
import rgbinput from "../base/rgbinput.js"
import radio from "../base/radio.js"

PICKER_HEIGHT = 9
RADIO_FOCUS = 6

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
        this["showSelection"] = this["showSelection"].bind(this)
        this["show"] = this["show"].bind(this)
        this["focusUp"] = this["focusUp"].bind(this)
        this["focusNext"] = this["focusNext"].bind(this)
        this["focusTo"] = this["focusTo"].bind(this)
        this["emitChanged"] = this["emitChanged"].bind(this)
        this["rgbChanged"] = this["rgbChanged"].bind(this)
        this["sliderChanged"] = this["sliderChanged"].bind(this)
        this["syncFromRgb"] = this["syncFromRgb"].bind(this)
        this["syncFromSliders"] = this["syncFromSliders"].bind(this)
        this["cycleColor"] = this["cycleColor"].bind(this)
        this["setActiveColor"] = this["setActiveColor"].bind(this)
        this["loadActiveColor"] = this["loadActiveColor"].bind(this)
        this["setHex"] = this["setHex"].bind(this)
        this["setColorStateFromHex"] = this["setColorStateFromHex"].bind(this)
        this["syncAll"] = this["syncAll"].bind(this)
        this["syncRadio"] = this["syncRadio"].bind(this)
        this["syncInputs"] = this["syncInputs"].bind(this)
        this["syncSliders"] = this["syncSliders"].bind(this)
        this["saveColorState"] = this["saveColorState"].bind(this)
        this["backgroundHex"] = this["backgroundHex"].bind(this)
        this["foregroundHex"] = this["foregroundHex"].bind(this)
        this["colorHex"] = this["colorHex"].bind(this)
        this["hex"] = this["hex"].bind(this)
        this["rgb"] = this["rgb"].bind(this)
        this["maxFocus"] = this["maxFocus"].bind(this)
        this["voidActiveColor"] = this["voidActiveColor"].bind(this)
        this["colorVoided"] = this["colorVoided"].bind(this)
        this["backgroundChanged"] = this["backgroundChanged"].bind(this)
        this["selectionMode"] = this["selectionMode"].bind(this)
        this["onFocus"] = this["onFocus"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        colorpicker.__super__.constructor.call(this,screen,name)
        this.height = PICKER_HEIGHT
        this.focused = false
        this.focusIndex = 0
        this.h = 0
        this.s = 100
        this.v = 100
        this.twoColors = false
        this.activeColor = 0
        this.bgChanged = false
        this.voided = [false,false]
        this.colorStates = [{h:0,s:100,v:100},{h:0,s:100,v:100}]
        this.hue = new colorslider(screen,`${this.name}_hue`)
        this.bright = new colorslider(screen,`${this.name}_bright`)
        this.sat = new colorslider(screen,`${this.name}_sat`)
        this.red = new rgbinput(screen,`${this.name}_red`)
        this.green = new rgbinput(screen,`${this.name}_green`)
        this.blue = new rgbinput(screen,`${this.name}_blue`)
        this.radio = new radio(screen,`${this.name}_radio`)
        this.sliders = [this.hue,this.bright,this.sat]
        this.inputs = [this.red,this.green,this.blue]
        this.red.textColor = theme.colorpicker.red
        this.green.textColor = theme.colorpicker.green
        this.blue.textColor = theme.colorpicker.blue
        this.radio.setColor('bg',theme.colorpicker.bg)
        this.radio.setColor('fg',theme.colorpicker.fg)
        this.radio.onFocusRequest = (function ()
        {
            if (this.twoColors)
            {
                return this.focusTo(RADIO_FOCUS)
            }
        }).bind(this)
        this.radio.onSelect = (function (idx)
        {
            return this.setActiveColor(idx)
        }).bind(this)
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
        this.radio.setFocused(this.focused && this.focusIndex === RADIO_FOCUS && this.twoColors)
        if (this.focused)
        {
            return post.emit('redraw')
        }
    }

    colorpicker.prototype["selectionMode"] = function ()
    {
        return this.twoColors
    }

    colorpicker.prototype["backgroundChanged"] = function ()
    {
        return this.bgChanged
    }

    colorpicker.prototype["colorVoided"] = function (idx)
    {
        var _124_37_

        return ((_124_37_=this.voided[idx]) != null ? _124_37_ : false)
    }

    colorpicker.prototype["voidActiveColor"] = function ()
    {
        if (!this.twoColors)
        {
            return
        }
        this.voided[this.activeColor] = true
        this.syncRadio()
        return post.emit('redraw')
    }

    colorpicker.prototype["maxFocus"] = function ()
    {
        return (this.twoColors ? RADIO_FOCUS : 5)
    }

    colorpicker.prototype["rgb"] = function ()
    {
        return color.hsvToRgb([this.h,this.s,this.v])
    }

    colorpicker.prototype["hex"] = function ()
    {
        return color.hex(this.rgb())
    }

    colorpicker.prototype["colorHex"] = function (idx)
    {
        var st

        st = this.colorStates[idx]
        if (!(st != null))
        {
            return null
        }
        return color.hex(color.hsvToRgb([st.h,st.s,st.v]))
    }

    colorpicker.prototype["foregroundHex"] = function ()
    {
        return this.colorHex(0)
    }

    colorpicker.prototype["backgroundHex"] = function ()
    {
        if (this.twoColors)
        {
            return this.colorHex(1)
        }
        else
        {
            return null
        }
    }

    colorpicker.prototype["saveColorState"] = function ()
    {
        return this.colorStates[this.activeColor] = {h:this.h,s:this.s,v:this.v}
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

    colorpicker.prototype["syncRadio"] = function ()
    {
        var bg, fg, opts

        opts = []
        fg = this.colorHex(0)
        if ((fg != null))
        {
            opts.push({color:color.values(fg),label:((this.voided[0] ? 'none' : fg))})
        }
        if (this.twoColors)
        {
            bg = this.colorHex(1)
            if ((bg != null))
            {
                opts.push({color:color.values(bg),label:((this.voided[1] ? 'none' : bg))})
            }
        }
        this.radio.setOptions(opts)
        this.radio.setActive(this.activeColor)
        this.radio.setFocusable(this.twoColors)
        return this.radio.setFocused(this.focused && this.focusIndex === RADIO_FOCUS && this.twoColors)
    }

    colorpicker.prototype["syncAll"] = function ()
    {
        this.syncSliders()
        this.syncInputs()
        return this.syncRadio()
    }

    colorpicker.prototype["setColorStateFromHex"] = function (idx, hex)
    {
        var h, rgb, s, v

        rgb = color.values(hex)
        if (_k_.empty(rgb))
        {
            return false
        }
        var _a_ = color.rgbToHsv(rgb); h = _a_[0]; s = _a_[1]; v = _a_[2]

        this.colorStates[idx] = {h:h,s:s,v:v}
        if (idx === this.activeColor)
        {
            this.h = h
            this.s = s
            this.v = v
            this.syncAll()
        }
        return true
    }

    colorpicker.prototype["setHex"] = function (hex)
    {
        if (_k_.empty(hex))
        {
            return
        }
        if (!this.setColorStateFromHex(this.activeColor,hex))
        {
            return
        }
        this.voided[this.activeColor] = false
        if (this.activeColor === 1)
        {
            return this.bgChanged = true
        }
    }

    colorpicker.prototype["loadActiveColor"] = function ()
    {
        var st

        st = this.colorStates[this.activeColor]
        this.h = st.h
        this.s = st.s
        this.v = st.v
        return this.syncAll()
    }

    colorpicker.prototype["setActiveColor"] = function (idx)
    {
        if (!this.twoColors)
        {
            return
        }
        this.saveColorState()
        this.activeColor = _k_.clamp(0,1,parseInt(idx))
        this.loadActiveColor()
        return post.emit('redraw')
    }

    colorpicker.prototype["cycleColor"] = function (dir)
    {
        return this.setActiveColor((this.activeColor + dir + 2) % 2)
    }

    colorpicker.prototype["syncFromSliders"] = function ()
    {
        this.h = this.hue.getValue()
        this.v = this.bright.getValue()
        this.s = this.sat.getValue()
        this.saveColorState()
        this.syncInputs()
        this.syncRadio()
        this.voided[this.activeColor] = false
        if (this.activeColor === 1)
        {
            return this.bgChanged = true
        }
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
        this.saveColorState()
        this.syncSliders()
        this.syncRadio()
        this.voided[this.activeColor] = false
        if (this.activeColor === 1)
        {
            return this.bgChanged = true
        }
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

        this.focusIndex = _k_.clamp(0,this.maxFocus(),parseInt(i))
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
        else if (this.focusIndex < RADIO_FOCUS)
        {
            input = this.inputs[this.focusIndex - 3]
            input.grabFocus()
            input.selectAll()
        }
        else
        {
            post.emit('focus',this.name)
        }
        return post.emit('redraw')
    }

    colorpicker.prototype["focusNext"] = function (dir)
    {
        var n

        n = this.maxFocus() + 1
        return this.focusTo((this.focusIndex + dir + n) % n)
    }

    colorpicker.prototype["focusUp"] = function ()
    {
        if (this.focusIndex === 0)
        {
            if (this.twoColors)
            {
                this.focusTo(RADIO_FOCUS)
            }
            return
        }
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

            case 6:
                return this.focusTo(5)

        }

    }

    colorpicker.prototype["show"] = function (hex)
    {
        this.twoColors = false
        this.bgChanged = false
        this.activeColor = 0
        this.voided = [false,false]
        if ((hex != null))
        {
            this.setHex(hex)
        }
        else
        {
            this.loadActiveColor()
        }
        this.radio.setFocusable(false)
        colorpicker.__super__.show.call(this)
        return this.focusTo(0)
    }

    colorpicker.prototype["showSelection"] = function (fg, bg)
    {
        this.twoColors = true
        this.bgChanged = false
        this.activeColor = 0
        this.voided = [false,false]
        this.colorStates = [{h:0,s:100,v:100},{h:0,s:100,v:100}]
        fg = (fg != null ? fg : '#ff0000')
        bg = (bg != null ? bg : '#000000')
        this.setColorStateFromHex(0,fg)
        this.setColorStateFromHex(1,bg)
        this.loadActiveColor()
        this.radio.setFocusable(true)
        this.isVisible = true
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
        this.radio.setFocused(false)
        this.radio.setFocusable(false)
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
        ret = this.radio.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
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

        if (this.focusIndex === RADIO_FOCUS && this.twoColors)
        {
            switch (event.combo)
            {
                case 'left':
                    this.cycleColor(-1)
                    return true

                case 'right':
                    this.cycleColor(1)
                    return true

                case 'up':
                    this.focusUp()
                    return true

                default:
                    return false
            }

        }
        if (this.focusIndex < 3 && this.twoColors && _k_.in(event.combo,['delete','backspace']))
        {
            this.voidActiveColor()
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

        this.radio.layout(x + 1,y + 1,w - 2,1)
        this.hue.layout(x + 1,y + 3,w - 2,1)
        this.bright.layout(x + 1,y + 4,w - 2,1)
        this.sat.layout(x + 1,y + 5,w - 2,1)
        aw = _k_.max(1,w - 2)
        iw = _k_.max(3,_k_.min(5,parseInt(aw / 3)))
        gap = _k_.max(0,parseInt((aw - 3 * iw) / 2))
        start = _k_.max(0,parseInt((aw - (3 * iw + 2 * gap)) / 2))
        this.red.layout(x + 1 + start,y + 7,iw,1)
        this.green.layout(x + 1 + start + iw + gap,y + 7,iw,1)
        return this.blue.layout(x + 1 + start + 2 * (iw + gap),y + 7,iw,1)
    }

    colorpicker.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        this.radio.draw()
        this.hue.draw()
        this.bright.draw()
        this.sat.draw()
        this.red.draw()
        this.green.draw()
        this.blue.draw()
        return colorpicker.__super__.draw.call(this)
    }

    return colorpicker
})()

export default colorpicker;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FhYSxVQUFBO0lBQU07O09BQ0EsWUFBVDtPQUFlLFlBQWY7O09BQ1MsV0FBWjtPQUFpQixrQkFBakI7T0FBNkIsZUFBN0I7T0FBc0MsWUFBdEM7O0FBRVAsZ0JBQWdCO0FBQ2hCLGNBQWdCOztBQUVQLGVBQVQ7OzRCQUE2QjthQUV6QixhQUFHLFFBQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvREFFQSxPQUFPO1FBRWIsS0FBQyxTQUFhO1FBQ2QsS0FBQyxVQUFhO1FBQ2QsS0FBQyxhQUFhO1FBRWQsS0FBQyxJQUFJO1FBQ0wsS0FBQyxJQUFJO1FBQ0wsS0FBQyxJQUFJO1FBRUwsS0FBQyxZQUFjO1FBQ2YsS0FBQyxjQUFjO1FBQ2YsS0FBQyxZQUFjO1FBQ2YsS0FBQyxVQUFlLE1BQU07UUFDdEIsS0FBQyxnQkFBZ0IsRUFBRyxFQUFFLEVBQUcsSUFBSSxFQUFHLE1BQU0sRUFBRyxFQUFFLEVBQUcsSUFBSSxFQUFHO1FBRXJELEtBQUMsVUFBYSxZQUFZLFVBQVUsS0FBQztRQUNyQyxLQUFDLGFBQWEsWUFBWSxVQUFVLEtBQUM7UUFDckMsS0FBQyxVQUFhLFlBQVksVUFBVSxLQUFDO1FBRXJDLEtBQUMsVUFBWSxTQUFTLFVBQVUsS0FBQztRQUNqQyxLQUFDLFlBQVksU0FBUyxVQUFVLEtBQUM7UUFDakMsS0FBQyxXQUFZLFNBQVMsVUFBVSxLQUFDO1FBRWpDLEtBQUMsWUFBWSxNQUFNLFVBQVUsS0FBQztRQUU5QixLQUFDLFdBQVcsS0FBQyxJQUFJLEtBQUMsT0FBTyxLQUFDO1FBQzFCLEtBQUMsVUFBVyxLQUFDLElBQUksS0FBQyxNQUFNLEtBQUM7UUFFekIsS0FBQyxJQUFJLFlBQWMsTUFBTSxZQUFZO1FBQ3JDLEtBQUMsTUFBTSxZQUFZLE1BQU0sWUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
