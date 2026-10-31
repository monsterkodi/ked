var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var colorpicker, RADIO_FOCUS

import kxk from "../../../kxk.js"
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import colorslider from "../base/colorslider.js"
import rgbinput from "../base/rgbinput.js"
import radio from "../base/radio.js"

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
        this.height = 9
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
        var _118_37_

        return ((_118_37_=this.voided[idx]) != null ? _118_37_ : false)
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
        post.emit('redraw')
        return true
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
        post.emit('redraw')
        return true
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
                this.focusTo(0)
                break
            case 2:
                this.focusTo(1)
                break
            case 3:
                this.focusTo(2)
                break
            case 4:
                this.focusTo(2)
                break
            case 5:
                this.focusTo(2)
                break
            case 6:
                this.focusTo(5)
                break
        }

        return true
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
                return this.focusNext(1)

            case 'shift+tab':
                return this.focusNext(-1)

            case 'down':
                return this.focusNext(1)

            case 'esc':
                return this.cancel()

            case 'return':
                return this.submit()

        }

        if ((this.focusIndex < 3 || this.focusIndex === RADIO_FOCUS) && this.twoColors && _k_.in(event.combo,['delete','backspace']))
        {
            this.voidActiveColor()
            return true
        }
        if (this.focusIndex === RADIO_FOCUS && this.twoColors)
        {
            switch (event.combo)
            {
                case 'left':
                    return this.cycleColor(-1)

                case 'right':
                    return this.cycleColor(1)

                case 'up':
                    return this.focusUp()

                default:
                    return false
            }

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
                    return this.focusUp()

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
                return this.focusTo(2)

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
    
        var aw, iw

        this.radio.layout(x + 1,y + 1,w - 2,1)
        this.hue.layout(x + 1,y + 3,w - 2,1)
        this.bright.layout(x + 1,y + 4,w - 2,1)
        this.sat.layout(x + 1,y + 5,w - 2,1)
        aw = _k_.max(1,w - 2)
        iw = 4
        this.red.layout(x + 1,y + 7,iw,1)
        this.green.layout(x + 1 + parseInt((aw - iw) / 2),y + 7,iw,1)
        return this.blue.layout(x + 1 + aw - iw,y + 7,iw,1)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRYSxVQUFBO0lBQU07O09BQ0EsWUFBVDtPQUFlLFlBQWY7O09BQ1MsV0FBWjtPQUFpQixrQkFBakI7T0FBNkIsZUFBN0I7T0FBc0MsWUFBdEM7O0FBRVAsY0FBYzs7QUFFTCxlQUFUOzs0QkFBNkI7YUFFekIsYUFBRyxRQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0RBRUEsT0FBTztRQUViLEtBQUMsU0FBYTtRQUNkLEtBQUMsVUFBYTtRQUNkLEtBQUMsYUFBYTtRQUVkLEtBQUMsSUFBSTtRQUNMLEtBQUMsSUFBSTtRQUNMLEtBQUMsSUFBSTtRQUVMLEtBQUMsWUFBYztRQUNmLEtBQUMsY0FBYztRQUNmLEtBQUMsWUFBYztRQUNmLEtBQUMsVUFBZSxNQUFNO1FBQ3RCLEtBQUMsZ0JBQWdCLEVBQUcsRUFBRSxFQUFHLElBQUksRUFBRyxNQUFNLEVBQUcsRUFBRSxFQUFHLElBQUksRUFBRztRQUVyRCxLQUFDLFVBQWEsWUFBWSxVQUFVLEtBQUM7UUFDckMsS0FBQyxhQUFhLFlBQVksVUFBVSxLQUFDO1FBQ3JDLEtBQUMsVUFBYSxZQUFZLFVBQVUsS0FBQztRQUVyQyxLQUFDLFVBQWEsU0FBUyxVQUFVLEtBQUM7UUFDbEMsS0FBQyxZQUFhLFNBQVMsVUFBVSxLQUFDO1FBQ2xDLEtBQUMsV0FBYSxTQUFTLFVBQVUsS0FBQztRQUVsQyxLQUFDLFlBQWEsTUFBTSxVQUFVLEtBQUM7UUFFL0IsS0FBQyxXQUFXLEtBQUMsSUFBSSxLQUFDLE9BQU8sS0FBQztRQUMxQixLQUFDLFVBQVcsS0FBQyxJQUFJLEtBQUMsTUFBTSxLQUFDO1FBRXpCLEtBQUMsSUFBSSxZQUFjLE1BQU0sWUFBWTtRQUNyQyxLQUFDLE1BQU0sWUFBWSxNQUFNLFlBQVk7UUFDckMsS0FBQyxL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
