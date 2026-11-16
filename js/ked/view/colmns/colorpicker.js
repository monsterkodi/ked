var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var colorpicker

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let kutil = kxk.kutil
let clip = kxk.clip

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import susan from "../../edit/susan.js"

import belt from "../../edit/tool/belt.js"

import view from "../base/view.js"
import colorslider from "../base/colorslider.js"
import rgbinput from "../base/rgbinput.js"
import radio from "../base/radio.js"
import palette from "../base/palette.js"


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
        this["onDelete"] = this["onDelete"].bind(this)
        this["onReturn"] = this["onReturn"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["cancel"] = this["cancel"].bind(this)
        this["replaceColor"] = this["replaceColor"].bind(this)
        this["toggleMethod"] = this["toggleMethod"].bind(this)
        this["submitSue"] = this["submitSue"].bind(this)
        this["submit"] = this["submit"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["hexAtCursor"] = this["hexAtCursor"].bind(this)
        this["sueColorAtSelection"] = this["sueColorAtSelection"].bind(this)
        this["colorAtSelection"] = this["colorAtSelection"].bind(this)
        this["show"] = this["show"].bind(this)
        this["emitChanged"] = this["emitChanged"].bind(this)
        this["rgbChanged"] = this["rgbChanged"].bind(this)
        this["sliderChanged"] = this["sliderChanged"].bind(this)
        this["setActiveColor"] = this["setActiveColor"].bind(this)
        this["setHex"] = this["setHex"].bind(this)
        this["syncInputs"] = this["syncInputs"].bind(this)
        this["syncSliders"] = this["syncSliders"].bind(this)
        this["syncRadio"] = this["syncRadio"].bind(this)
        this["syncAll"] = this["syncAll"].bind(this)
        this["swapColors"] = this["swapColors"].bind(this)
        this["backgroundHex"] = this["backgroundHex"].bind(this)
        this["foregroundHex"] = this["foregroundHex"].bind(this)
        this["colorHex"] = this["colorHex"].bind(this)
        this["v"] = this["v"].bind(this)
        this["s"] = this["s"].bind(this)
        this["h"] = this["h"].bind(this)
        this["hsv"] = this["hsv"].bind(this)
        this["hex"] = this["hex"].bind(this)
        this["rgb"] = this["rgb"].bind(this)
        this["applyPaletteColor"] = this["applyPaletteColor"].bind(this)
        this["removePaletteColor"] = this["removePaletteColor"].bind(this)
        this["addCurrentColor"] = this["addCurrentColor"].bind(this)
        this["syncPalette"] = this["syncPalette"].bind(this)
        this["pickerHeight"] = this["pickerHeight"].bind(this)
        this["paletteFocused"] = this["paletteFocused"].bind(this)
        this["voidActiveColor"] = this["voidActiveColor"].bind(this)
        this["colorVoided"] = this["colorVoided"].bind(this)
        this["backgroundChanged"] = this["backgroundChanged"].bind(this)
        this["onRadioActiveChanged"] = this["onRadioActiveChanged"].bind(this)
        this["activeIndex"] = this["activeIndex"].bind(this)
        this["focusPrev"] = this["focusPrev"].bind(this)
        this["focusNext"] = this["focusNext"].bind(this)
        this["focusDelta"] = this["focusDelta"].bind(this)
        colorpicker.__super__.constructor.call(this,this.screen,this.name)
        this.height = 9
        this.colorReplace = null
        this.colorDecorate = null
        this.bgChanged = false
        this.voided = [false,false]
        this.colorStates = []
        this.palette = []
        this.paletteMax = 8
        this.hue = new colorslider(screen,`${this.name}_hue`,360,(function (v)
        {
            return color.hsvToRgb([v,100,100])
        }).bind(this))
        this.sat = new colorslider(screen,`${this.name}_sat`,100,(function (v)
        {
            return color.hsvToRgb([this.h(),v,this.v()])
        }).bind(this))
        this.val = new colorslider(screen,`${this.name}_val`,100,(function (v)
        {
            return color.hsvToRgb([this.h(),this.s(),v])
        }).bind(this))
        this.red = new rgbinput(screen,`${this.name}_red`)
        this.green = new rgbinput(screen,`${this.name}_green`)
        this.blue = new rgbinput(screen,`${this.name}_blue`)
        this.radio = new radio(screen,`${this.name}_radio`)
        this.paletteView = new palette(screen,`${this.name}_palette`)
        this.sliders = [this.hue,this.sat,this.val]
        this.inputs = [this.red,this.green,this.blue]
        this.focusRing = [this.radio,this.hue,this.sat,this.val,this.red,this.green,this.blue]
        this.red.textColor = theme.colorpicker.red
        this.green.textColor = theme.colorpicker.green
        this.blue.textColor = theme.colorpicker.blue
        this.radio.setColor('bg',theme.colorpicker.bg)
        this.radio.setColor('fg',theme.colorpicker.fg)
        this.hue.on('valueChange',this.sliderChanged)
        this.val.on('valueChange',this.sliderChanged)
        this.sat.on('valueChange',this.sliderChanged)
        this.red.on('valueChange',this.rgbChanged)
        this.green.on('valueChange',this.rgbChanged)
        this.blue.on('valueChange',this.rgbChanged)
        this.radio.on('activeChange',this.onRadioActiveChanged)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('fg',theme.colorpicker.fg)
        this.isVisible = false
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

    colorpicker.prototype["activeIndex"] = function ()
    {
        return this.radio.active
    }

    colorpicker.prototype["onRadioActiveChanged"] = function ()
    {
        return this.syncAll()
    }

    colorpicker.prototype["backgroundChanged"] = function ()
    {
        return this.bgChanged
    }

    colorpicker.prototype["colorVoided"] = function (idx)
    {
        var _85_37_

        return ((_85_37_=this.voided[idx]) != null ? _85_37_ : false)
    }

    colorpicker.prototype["voidActiveColor"] = function ()
    {
        this.voided[this.activeIndex()] = true
        this.syncRadio()
        return post.emit('redraw')
    }

    colorpicker.prototype["paletteFocused"] = function ()
    {
        return this.paletteView.hasFocus()
    }

    colorpicker.prototype["pickerHeight"] = function ()
    {
        return this.height + ((this.palette.length ? 2 : 0))
    }

    colorpicker.prototype["syncPalette"] = function ()
    {
        this.paletteView.setColors(this.palette)
        this.paletteView.setFocusable(this.palette.length > 0)
        this.focusRing = [this.radio,this.hue,this.sat,this.val]
        if (this.palette.length)
        {
            this.focusRing.push(this.paletteView)
        }
        return this.focusRing = this.focusRing.concat([this.red,this.green,this.blue])
    }

    colorpicker.prototype["addCurrentColor"] = function ()
    {
        var hex

        hex = this.hex()
        if (_k_.empty(hex))
        {
            return
        }
        if (this.palette.includes(hex))
        {
            return
        }
        this.palette.push(hex)
        if (this.palette.length > this.paletteMax)
        {
            this.palette.shift()
        }
        this.syncPalette()
        post.emit('redraw')
        return true
    }

    colorpicker.prototype["removePaletteColor"] = function ()
    {
        var idx

        idx = this.paletteView.active
        if (idx < 0 || idx >= this.palette.length)
        {
            return
        }
        this.palette.splice(idx,1)
        this.syncPalette()
        if (this.palette.length)
        {
            this.paletteView.setActive(_k_.clamp(0,this.palette.length - 1,idx))
        }
        if (_k_.empty(this.palette))
        {
            this.blue.grabFocus()
        }
        post.emit('redraw')
        return true
    }

    colorpicker.prototype["applyPaletteColor"] = function ()
    {
        var opt

        opt = this.paletteView.options[this.paletteView.active]
        if (_k_.empty(opt))
        {
            return
        }
        this.setHex(opt.label)
        this.syncAll()
        post.emit('colorpicker.change',this.hex())
        post.emit('redraw')
        return true
    }

    colorpicker.prototype["rgb"] = function ()
    {
        return this.colorStates[this.activeIndex()]
    }

    colorpicker.prototype["hex"] = function ()
    {
        return color.hex(this.rgb())
    }

    colorpicker.prototype["hsv"] = function ()
    {
        return color.rgbToHsv(this.rgb())
    }

    colorpicker.prototype["h"] = function ()
    {
        return this.hsv()[0]
    }

    colorpicker.prototype["s"] = function ()
    {
        return this.hsv()[1]
    }

    colorpicker.prototype["v"] = function ()
    {
        return this.hsv()[2]
    }

    colorpicker.prototype["colorHex"] = function (idx)
    {
        return color.hex(this.colorStates[idx])
    }

    colorpicker.prototype["foregroundHex"] = function ()
    {
        return this.colorHex(0)
    }

    colorpicker.prototype["backgroundHex"] = function ()
    {
        return this.colorHex(1)
    }

    colorpicker.prototype["swapColors"] = function ()
    {
        if (this.colorStates.length > 1)
        {
            this.colorStates.push(this.colorStates.shift())
            return this.syncAll()
        }
    }

    colorpicker.prototype["syncAll"] = function ()
    {
        this.syncRadio()
        this.syncSliders()
        return this.syncInputs()
    }

    colorpicker.prototype["syncRadio"] = function ()
    {
        var col, idx, opts

        opts = []
        for (var _a_ = idx = 0, _b_ = this.colorStates.length; (_a_ <= _b_ ? idx < this.colorStates.length : idx > this.colorStates.length); (_a_ <= _b_ ? ++idx : --idx))
        {
            col = this.colorHex(idx)
            if ((col != null))
            {
                opts.push({color:color.values(col),label:((this.voided[0] ? 'none' : col))})
            }
        }
        this.radio.setOptions(opts)
        this.radio.setActive(this.activeIndex())
        return this.radio.setFocusable(opts.length > 1)
    }

    colorpicker.prototype["syncSliders"] = function ()
    {
        this.hue.setValue(this.h())
        this.sat.setValue(this.s())
        return this.val.setValue(this.v())
    }

    colorpicker.prototype["syncInputs"] = function ()
    {
        var i, rgb

        rgb = this.rgb()
        for (i = 0; i <= 2; i++)
        {
            this.inputs[i].setValue(rgb[i])
        }
    }

    colorpicker.prototype["setHex"] = function (hex, idx)
    {
        var rgb

        if (_k_.empty(hex))
        {
            return
        }
        rgb = color.values(hex)
        if (_k_.empty(rgb))
        {
            return
        }
        idx = (idx != null ? idx : this.activeIndex())
        this.colorStates[idx] = rgb
        this.voided[idx] = false
        if (idx === 1)
        {
            this.bgChanged = true
        }
        return true
    }

    colorpicker.prototype["setActiveColor"] = function (idx)
    {
        return this.radio.changeActive(_k_.clamp(0,1,parseInt(idx)))
    }

    colorpicker.prototype["sliderChanged"] = function ()
    {
        this.colorStates[this.activeIndex()] = color.hsvToRgb([this.hue.getValue(),this.sat.getValue(),this.val.getValue()])
        this.syncRadio()
        this.syncInputs()
        return this.emitChanged()
    }

    colorpicker.prototype["rgbChanged"] = function ()
    {
        this.colorStates[this.activeIndex()] = [this.red.getValue(),this.green.getValue(),this.blue.getValue()]
        this.syncRadio()
        this.syncSliders()
        return this.emitChanged()
    }

    colorpicker.prototype["emitChanged"] = function ()
    {
        this.voided[this.activeIndex()] = false
        if (this.activeIndex() === 1)
        {
            this.bgChanged = true
        }
        post.emit('colorpicker.change',this.hex())
        return post.emit('redraw')
    }

    colorpicker.prototype["show"] = function (hex)
    {
        var found, syntax, _262_49_, _263_49_

        this.bgChanged = false
        this.voided = [false,false]
        this.colorStates = []
        this.radio.active = 0
        if ((hex != null))
        {
            this.setHex(hex)
        }
        else
        {
            if (found = this.hexAtCursor())
            {
                hex = found.text
                this.colorReplace = found
                this.setHex(hex)
                this.colorReplace.from = this.hex()
            }
            else if (!_k_.empty(this.editor.state.s.selections))
            {
                this.colorDecorate = {ranges:_k_.clone((this.editor.state.s.selections))}
                this.setHex((((_262_49_=this.colorAtSelection('fg')) != null ? _262_49_ : '#ff0000')),0)
                this.setHex((((_263_49_=this.colorAtSelection('bg')) != null ? _263_49_ : '#000000')),1)
            }
            else if (syntax = this.editor.syntaxColorAtMainCursor())
            {
                this.setHex(syntax)
            }
            else
            {
                this.setHex("#ffffff")
            }
        }
        this.syncAll()
        this.syncPalette()
        colorpicker.__super__.show.call(this)
        return this.hue.grabFocus()
    }

    colorpicker.prototype["colorAtSelection"] = function (layer)
    {
        var c, rng

        if (this.editor.state.colorMethod === 'sue')
        {
            if (c = this.sueColorAtSelection(layer))
            {
                return c
            }
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

    colorpicker.prototype["sueColorAtSelection"] = function (layer)
    {
        var area, code, data, fg, rng

        fg = layer === 'fg'
        var list = _k_.list(this.editor.state.s.selections)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (area = this.editor.state.sueAt([rng[0],rng[1]]))
            {
                var _b_ = area.value; code = _b_[0]; data = _b_[1]

                data = (data != null ? data : [])
                if (code === susan.FG_BG_COLOR)
                {
                    return data[(fg ? 0 : 1)]
                }
                if (fg && code === susan.FG_COLOR)
                {
                    return data[0]
                }
                if (!fg && code === susan.BG_COLOR)
                {
                    return data[0]
                }
            }
        }
        return null
    }

    colorpicker.prototype["hexAtCursor"] = function ()
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
        var bg, fg, hex, ranges, voided, _352_24_, _355_30_

        hex = this.hex()
        if ((this.colorReplace != null) && hex !== this.colorReplace.from)
        {
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
            if (this.editor.state.colorMethod === 'sue')
            {
                this.submitSue(ranges,fg,bg,voided)
            }
            else
            {
                this.editor.state.setColorsForRanges(ranges,fg,bg,voided)
            }
        }
        return this.hide()
    }

    colorpicker.prototype["submitSue"] = function (ranges, fg, bg, voided)
    {
        var h, rng, value, w

        if (!_k_.empty(voided))
        {
            this.editor.state.clearSueForRanges(ranges)
        }
        if (_k_.in('fg',voided))
        {
            fg = null
            bg = (bg != null ? bg : this.backgroundHex())
        }
        if (_k_.in('bg',voided))
        {
            bg = null
            fg = (fg != null ? fg : this.foregroundHex())
        }
        var list = _k_.list(ranges)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            w = rng[2] - rng[0]
            h = rng[3] - rng[1] + 1
            value = null
            if ((fg != null) && (bg != null))
            {
                value = [susan.FG_BG_COLOR,[fg,bg,w,h]]
            }
            else if ((fg != null))
            {
                value = [susan.FG_COLOR,[fg,w,h]]
            }
            else if ((bg != null))
            {
                value = [susan.BG_COLOR,[bg,w,h]]
            }
            if ((value != null))
            {
                this.editor.state.setSue(rng[0],rng[1],value)
            }
        }
    }

    colorpicker.prototype["toggleMethod"] = function ()
    {
        this.editor.state.colorMethod = (this.editor.state.colorMethod === 'sue' ? 'trailer' : 'sue')
        post.emit('redraw')
        return true
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
        ret = this.paletteView.onMouse(event)
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
        if (this.sat.onKey(key,event))
        {
            return true
        }
        if (this.val.onKey(key,event))
        {
            return true
        }
        if (this.radio.onKey(key,event))
        {
            return true
        }
        if (this.paletteView.onKey(key,event))
        {
            return true
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
                return this.onReturn()

            case 'delete':
            case 'backspace':
                return this.onDelete()

            case 'cmd+left':
            case 'cmd+right':
                return this.swapColors()

            case 'ctrl+c':
            case 'cmd+c':
                clip.copy(this.hex())
                return true

            case 'ctrl+v':
            case 'cmd+v':
                this.setHex(clip.paste())
                this.syncAll()
                return true

            case 'ctrl+s':
            case 'cmd+s':
                return this.addCurrentColor()

            case 'alt+m':
                return this.toggleMethod()

        }

        return false
    }

    colorpicker.prototype["onReturn"] = function ()
    {
        if (this.paletteFocused())
        {
            return this.applyPaletteColor()
        }
        return this.submit()
    }

    colorpicker.prototype["onDelete"] = function ()
    {
        if (this.paletteFocused())
        {
            return this.removePaletteColor()
        }
        return this.voidActiveColor()
    }

    colorpicker.prototype["layout"] = function (x, y, w, h)
    {
        colorpicker.__super__.layout.call(this,x,y,w,h)
    
        var aw, iw, p

        this.radio.layout(x + 1,y + 1,w - 2,1)
        this.hue.layout(x + 1,y + 3,w - 2,1)
        this.sat.layout(x + 1,y + 4,w - 2,1)
        this.val.layout(x + 1,y + 5,w - 2,1)
        aw = _k_.max(1,w - 2)
        iw = 4
        if (this.palette.length > 0)
        {
            this.paletteView.layout(x + 1,y + 7,w - 2,1)
            p = 2
        }
        else
        {
            this.paletteView.layout(x,y,0,0)
            p = 0
        }
        this.red.layout(x + 1,y + 7 + p,iw,1)
        this.green.layout(x + 1 + parseInt((aw - iw) / 2),y + 7 + p,iw,1)
        return this.blue.layout(x + 1 + aw - iw,y + 7 + p,iw,1)
    }

    colorpicker.prototype["draw"] = function ()
    {
        var child

        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.syncPalette()
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        if (this.cells.cols >= 11)
        {
            var list = _k_.list(this.focusRing)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                child = list[_a_]
                child.draw()
            }
        }
        colorpicker.__super__.draw.call(this)
        return this.cells.set(-1,0,((this.editor.state.colorMethod === 'sue' ? 's' : 't')),this.color.fg,this.color.bg)
    }

    return colorpicker
})()

export default colorpicker;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFLO0lBQU07O09BQ2hCLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksWUFBWjs7T0FDWSxXQUFQOztPQUNPLFdBQWY7T0FBb0Isa0JBQXBCO09BQWdDLGVBQWhDO09BQXlDLFlBQXpDO09BQStDLGNBQS9DOzs7QUFDTixlQUFEOzs0QkFBYTthQUlULGFBQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0RBRVQsS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFNBQVM7UUFFVixLQUFDLGVBQWdCO1FBQ2pCLEtBQUMsZ0JBQWdCO1FBQ2pCLEtBQUMsWUFBZ0I7UUFDakIsS0FBQyxVQUFpQixNQUFNO1FBQ3hCLEtBQUM7UUFFRCxLQUFDO1FBQ0QsS0FBQyxhQUFhO1FBRWQsS0FBQyxVQUFhLFlBQVksVUFBVSxLQUFDLFdBQVcsZUFBSzs7bUJBQU0sTUFBTSxVQUFVLEVBQUUsSUFBSTs7UUFDakYsS0FBQyxVQUFhLFlBQVksVUFBVSxLQUFDLFdBQVcsZUFBSzs7bUJBQU0sTUFBTSxVQUFVLEtBQUMsSUFBSSxFQUFFLEtBQUM7O1FBQ25GLEtBQUMsVUFBYSxZQUFZLFVBQVUsS0FBQyxXQUFXLGVBQUs7O21CQUFNLE1BQU0sVUFBVSxLQUFDLElBQUksS0FBQyxJQUFJOztRQUVyRixLQUFDLFVBQWEsU0FBUyxVQUFVLEtBQUM7UUFDbEMsS0FBQyxZQUFhLFNBQVMsVUFBVSxLQUFDO1FBQ2xDLEtBQUMsV0FBYSxTQUFTLFVBQVUsS0FBQztRQUVsQyxLQUFDLFlBQWEsTUFBTSxVQUFVLEtBQUM7UUFFL0IsS0FBQyxrQkFBa0IsUUFBUSxVQUFVLEtBQUM7UUFFdEMsS0FBQyxX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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
