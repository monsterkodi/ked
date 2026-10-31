var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var colorpicker

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let kutil = kxk.kutil

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import belt from "../../edit/tool/belt.js"

import view from "../base/view.js"
import colorslider from "../base/colorslider.js"
import rgbinput from "../base/rgbinput.js"
import radio from "../base/radio.js"


colorpicker = (function ()
{
    _k_.extend(colorpicker, view)
    function colorpicker (screen, editor, name)
    {
        this.screen = screen
        this.editor = editor
        this.name = name
    
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["cancel"] = this["cancel"].bind(this)
        this["replaceColor"] = this["replaceColor"].bind(this)
        this["submit"] = this["submit"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["colorAtCursor"] = this["colorAtCursor"].bind(this)
        this["colorAtSelection"] = this["colorAtSelection"].bind(this)
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
        this["focusPrev"] = this["focusPrev"].bind(this)
        this["focusNext"] = this["focusNext"].bind(this)
        this["focusDelta"] = this["focusDelta"].bind(this)
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
        this.focusRing = [this.radio,this.hue,this.bright,this.sat,this.red,this.green,this.blue]
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

    colorpicker.prototype["focusDelta"] = function (delta)
    {
        var index, item, num

        var list = _k_.list(this.focusRing)
        for (index = 0; index < list.length; index++)
        {
            item = list[index]
            if (item.hasFocus())
            {
                num = this.focusRing.length
                if ((0 <= index + delta && index + delta < num))
                {
                    if (this.focusRing[index + delta].focusable)
                    {
                        this.focusRing[index + delta].grabFocus()
                        return true
                    }
                }
                return false
            }
        }
        return false
    }

    colorpicker.prototype["focusNext"] = function ()
    {
        return this.focusDelta(1)
    }

    colorpicker.prototype["focusPrev"] = function ()
    {
        return this.focusDelta(-1)
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
        var _105_37_

        return ((_105_37_=this.voided[idx]) != null ? _105_37_ : false)
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
        var bg, fg, found, _295_45_, _296_45_

        this.twoColors = false
        this.bgChanged = false
        this.activeColor = 0
        this.voided = [false,false]
        this.radio.setFocusable(false)
        if ((hex != null))
        {
            this.setHex(hex)
        }
        else
        {
            if (found = this.colorAtCursor())
            {
                hex = found.text
                this.colorReplace = found
                this.setHex(hex)
                this.colorReplace.from = this.hex()
            }
            else if (!_k_.empty(this.editor.state.s.selections))
            {
                this.twoColors = true
                this.colorDecorate = {ranges:_k_.clone((this.editor.state.s.selections))}
                this.colorStates = [{h:0,s:100,v:100},{h:0,s:100,v:100}]
                fg = ((_295_45_=this.colorAtSelection('fg')) != null ? _295_45_ : '#ff0000')
                bg = ((_296_45_=this.colorAtSelection('bg')) != null ? _296_45_ : '#000000')
                this.setColorStateFromHex(0,fg)
                this.setColorStateFromHex(1,bg)
                this.loadActiveColor()
                this.radio.setFocusable(true)
            }
        }
        colorpicker.__super__.show.call(this)
        return this.hue.grabFocus()
    }

    colorpicker.prototype["colorAtSelection"] = function (layer)
    {
        var c, color, rng

        color = this.editor.state.colorAtPos(this.editor.state.mainCursor(),layer)
        if ((color != null))
        {
            return color
        }
        var list = _k_.list(this.editor.state.s.selections)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (c = this.editor.state.colorAtPos([rng[0],rng[1]],layer))
            {
                return c
            }
        }
        return null
    }

    colorpicker.prototype["colorAtCursor"] = function ()
    {
        var line, lines, mc, rng, state, text, word, x, y

        state = this.editor.state
        mc = state.mainCursor()
        lines = state.s.lines
        var _a_ = mc; x = _a_[0]; y = _a_[1]

        if (y < 0 || y >= lines.length)
        {
            return
        }
        line = lines[y]
        if (_k_.empty(line))
        {
            return
        }
        word = state.wordAtCursor()
        rng = belt.rangeOfClosestWordToPos(lines,mc)
        if (_k_.empty(word) || _k_.empty(rng))
        {
            if (x < line.length && kseg.str(line.slice(x, x + 1)) === '#')
            {
                word = belt.wordAtPos(lines,[x + 1,y])
                rng = belt.rangeOfClosestWordToPos(lines,[x + 1,y])
            }
        }
        if (_k_.empty(word) || _k_.empty(rng))
        {
            return
        }
        if (_k_.empty(color.values(word)))
        {
            return
        }
        text = word
        if (rng[0] > 0 && kseg.str(line.slice(rng[0] - 1, typeof rng[0] === 'number' ? rng[0] : -1)) === '#')
        {
            text = '#' + text
            rng = [rng[0] - 1,rng[1],rng[2],rng[3]]
        }
        return {text:text,range:rng}
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
        var bg, fg, hex, ranges, voided, _367_24_, _373_30_

        hex = this.hex()
        if ((this.colorReplace != null))
        {
            if (hex === this.colorReplace.from)
            {
                this.colorReplace = null
                return
            }
            this.replaceColor(hex)
        }
        else if ((this.colorDecorate != null))
        {
            ranges = this.colorDecorate.ranges
            this.colorDecorate = null
            fg = this.foregroundHex()
            bg = null
            if (this.backgroundChanged())
            {
                bg = this.backgroundHex()
            }
            voided = []
            if (this.colorVoided(0))
            {
                voided.push('fg')
            }
            if (this.colorVoided(1))
            {
                voided.push('bg')
            }
            this.editor.state.setColorsForRanges(ranges,fg,bg,voided)
        }
        return this.hide()
    }

    colorpicker.prototype["replaceColor"] = function (hex)
    {
        var lines, state, text, x1, x2, y

        if (_k_.empty(hex))
        {
            return
        }
        if (_k_.empty(this.colorReplace))
        {
            return
        }
        var _a_ = this.colorReplace.range; x1 = _a_[0]; y = _a_[1]; x2 = _a_[2]

        state = this.editor.state
        lines = state.s.lines.asMutable()
        if (y < 0 || y >= lines.length)
        {
            return
        }
        text = hex
        if (this.colorReplace.text[0] !== '#' && text[0] === '#')
        {
            text = text.slice(1)
        }
        kutil.replace(lines[y],x1,(x2 - x1),kseg(text))
        state.setLines(lines)
        return this.colorReplace = null
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
        if (this.hidden())
        {
            return false
        }
        switch (event.combo)
        {
            case 'down':
            case 'tab':
                return this.focusNext()

            case 'up':
            case 'shift+tab':
                return this.focusPrev()

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
        if (this.hue.onKey(key,event))
        {
            return true
        }
        if (this.bright.onKey(key,event))
        {
            return true
        }
        if (this.sat.onKey(key,event))
        {
            return true
        }
        if (this.radio.hasFocus() && this.twoColors)
        {
            switch (event.combo)
            {
                case 'delete':
                case 'backspace':
                    return this.voidActiveColor()

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRYSxVQUFBO0lBQVM7SUFBSztJQUFLOztPQUNWLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksV0FBUDs7T0FDTyxXQUFmO09BQW9CLGtCQUFwQjtPQUFnQyxlQUFoQztPQUF5QyxZQUF6Qzs7O0FBSUUsZUFBVDs7NEJBQTZCO2FBRXpCLGFBQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29EQUVULEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxTQUFTO1FBRVYsS0FBQyxJQUFJO1FBQ0wsS0FBQyxJQUFJO1FBQ0wsS0FBQyxJQUFJO1FBRUwsS0FBQyxlQUFnQjtRQUNqQixLQUFDLGdCQUFnQjtRQUNqQixLQUFDLFlBQWdCO1FBQ2pCLEtBQUMsY0FBZ0I7UUFDakIsS0FBQyxZQUFnQjtRQUNqQixLQUFDLFVBQWlCLE1BQU07UUFDeEIsS0FBQyxnQkFBa0IsRUFBRyxFQUFFLEVBQUcsSUFBSSxFQUFHLE1BQU0sRUFBRyxFQUFFLEVBQUcsSUFBSSxFQUFHO1FBRXZELEtBQUMsVUFBYSxZQUFZLFVBQVUsS0FBQztRQUNyQyxLQUFDLGFBQWEsWUFBWSxVQUFVLEtBQUM7UUFDckMsS0FBQyxVQUFhLFlBQVksVUFBVSxLQUFDO1FBRXJDLEtBQUMsVUFBYSxTQUFTLFVBQVUsS0FBQztRQUNsQyxLQUFDLFlBQWEsU0FBUyxVQUFVLEtBQUM7UUFDbEMsS0FBQyxXQUFhLFNBQVMsVUFBVSxLQUFDO1FBRWxDLEtBQUMsWUFBYSxNQUFNLFVBQVUsS0FBQztRQUUvQixLQUFDLFdBQWEsS0FBQyxJQUFJLEtBQUMsT0FBTyxLQUFDO1FBQzVCLEtBQUMsVUFBYSxLQUFDLElBQUksS0FBQyxNQUFNLEtBQUM7UUFDM0IsS0FBQyxhQUFhLEtB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
