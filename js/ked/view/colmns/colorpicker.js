var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var colorpicker

import kxk from "../../../kxk.js"
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import colorslider from "../base/colorslider.js"
import rgbinput from "../base/rgbinput.js"
import radio from "../base/radio.js"


colorpicker = (function ()
{
    _k_.extend(colorpicker, view)
    function colorpicker (screen, name, editor)
    {
        this.screen = screen
        this.name = name
        this.editor = editor
    
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
        this["voidActiveColor"] = this["voidActiveColor"].bind(this)
        this["colorVoided"] = this["colorVoided"].bind(this)
        this["backgroundChanged"] = this["backgroundChanged"].bind(this)
        this["selectionMode"] = this["selectionMode"].bind(this)
        colorpicker.__super__.constructor.call(this,this.screen,this.name)
        this.height = 9
        this.h = 0
        this.s = 100
        this.v = 100
        this.colorReplace = null
        this.colorDecorate = null
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
        this.radio.onSelect = (function (idx)
        {
            return this.setActiveColor(idx)
        }).bind(this)
        this.hue.min = 0
        this.hue.max = 360
        this.bright.min = 0
        this.bright.max = 100
        this.sat.min = 0
        this.sat.max = 100
        this.hue.gradient = (function (v)
        {
            return color.hsvToRgb([v,100,100])
        }).bind(this)
        this.bright.gradient = (function (v)
        {
            return color.hsvToRgb([this.h,this.s,v])
        }).bind(this)
        this.sat.gradient = (function (v)
        {
            return color.hsvToRgb([this.h,v,this.v])
        }).bind(this)
        this.hue.on('valueChange',this.sliderChanged)
        this.bright.on('valueChange',this.sliderChanged)
        this.sat.on('valueChange',this.sliderChanged)
        this.red.on('valueChange',this.rgbChanged)
        this.green.on('valueChange',this.rgbChanged)
        this.blue.on('valueChange',this.rgbChanged)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('fg',theme.colorpicker.fg)
        this.isVisible = false
        this.syncAll()
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
        var _86_37_

        return ((_86_37_=this.voided[idx]) != null ? _86_37_ : false)
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
        return this.radio.setFocusable(this.twoColors)
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
        return this.hue.grabFocus()
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
        return this.isVisible = true
    }

    colorpicker.prototype["hide"] = function ()
    {
        var input

        if (this.hidden())
        {
            return
        }
        colorpicker.__super__.hide.call(this)
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
        var before

        if (this.hidden())
        {
            return false
        }
        switch (event.combo)
        {
            case 'esc':
                return this.cancel()

            case 'return':
                return this.submit()

        }

        if (this.red.onKey(key,event))
        {
            return true
        }
        if (this.green.onKey(key,event))
        {
            return true
        }
        if (this.blue.onKey(key,event))
        {
            return true
        }
        if (this.radio.hasFocus() && this.twoColors)
        {
            switch (event.combo)
            {
                case 'left':
                    return this.cycleColor(-1)

                case 'right':
                    return this.cycleColor(1)

                case 'down':
                    return this.hue.grabFocus()

                default:
                    return false
            }

        }
        before = this.hex()
        return false
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRYSxVQUFBO0lBQU07O09BQ0EsWUFBVDtPQUFlLFlBQWY7O09BQ1MsV0FBWjtPQUFpQixrQkFBakI7T0FBNkIsZUFBN0I7T0FBc0MsWUFBdEM7OztBQUVFLGVBQVQ7OzRCQUE2QjthQUV6QixhQUFJLFFBQVEsTUFBTTs7UUFBZjtRQUFRO1FBQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvREFFUCxLQUFDLE9BQU8sS0FBQztRQUVmLEtBQUMsU0FBUztRQUVWLEtBQUMsSUFBSTtRQUNMLEtBQUMsSUFBSTtRQUNMLEtBQUMsSUFBSTtRQUVMLEtBQUMsZUFBZ0I7UUFDakIsS0FBQyxnQkFBZ0I7UUFDakIsS0FBQyxZQUFnQjtRQUNqQixLQUFDLGNBQWdCO1FBQ2pCLEtBQUMsWUFBZ0I7UUFDakIsS0FBQyxVQUFpQixNQUFNO1FBQ3hCLEtBQUMsZ0JBQWtCLEVBQUcsRUFBRSxFQUFHLElBQUksRUFBRyxNQUFNLEVBQUcsRUFBRSxFQUFHLElBQUksRUFBRztRQUV2RCxLQUFDLFVBQWEsWUFBWSxVQUFVLEtBQUM7UUFDckMsS0FBQyxhQUFhLFlBQVksVUFBVSxLQUFDO1FBQ3JDLEtBQUMsVUFBYSxZQUFZLFVBQVUsS0FBQztRQUVyQyxLQUFDLFVBQWEsU0FBUyxVQUFVLEtBQUM7UUFDbEMsS0FBQyxZQUFhLFNBQVMsVUFBVSxLQUFDO1FBQ2xDLEtBQUMsV0FBYSxTQUFTLFVBQVUsS0FBQztRQUVsQyxLQUFDLFlBQWEsTUFBTSxVQUFVLEtBQUM7UUFFL0IsS0FBQyxXQUFXLEtBQUMsSUFBSSxLQUFDLE9BQU8sS0FBQztRQUMxQixLQUFDLFVBQVcsS0FBQyxJQUFJLEtBQUMsTUFBTSxLQUFDO1FBRXpCLEtBQUMsSUFBSSxZQUFjLE1BQU0sWUFBWTtRQUNyQyxLQUFDLE1BQU0s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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
