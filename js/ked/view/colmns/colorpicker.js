var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var colorpicker

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let kutil = kxk.kutil
let clip = kxk.clip

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

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
        this["submit"] = this["submit"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["hexAtCursor"] = this["hexAtCursor"].bind(this)
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
        var _84_37_

        return ((_84_37_=this.voided[idx]) != null ? _84_37_ : false)
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
        var found, syntax, _261_49_, _262_49_

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
                this.setHex((((_261_49_=this.colorAtSelection('fg')) != null ? _261_49_ : '#ff0000')),0)
                this.setHex((((_262_49_=this.colorAtSelection('bg')) != null ? _262_49_ : '#000000')),1)
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
        var bg, fg, hex, ranges, voided, _330_24_, _333_30_

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
        return colorpicker.__super__.draw.call(this)
    }

    return colorpicker
})()

export default colorpicker;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFLO0lBQU07O09BQ2hCLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksV0FBUDs7T0FDTyxXQUFmO09BQW9CLGtCQUFwQjtPQUFnQyxlQUFoQztPQUF5QyxZQUF6QztPQUErQyxjQUEvQzs7O0FBQ04sZUFBRDs7NEJBQWE7YUFJVCxhQUFJLFFBQVEsUUFBUTs7UUFBakI7UUFBUTtRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29EQUVULEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxTQUFTO1FBRVYsS0FBQyxlQUFnQjtRQUNqQixLQUFDLGdCQUFnQjtRQUNqQixLQUFDLFlBQWdCO1FBQ2pCLEtBQUMsVUFBaUIsTUFBTTtRQUN4QixLQUFDO1FBRUQsS0FBQztRQUNELEtBQUMsYUFBYTtRQUVkLEtBQUMsVUFBYSxZQUFZLFVBQVUsS0FBQyxXQUFXLGVBQUs7O21CQUFNLE1BQU0sVUFBVSxFQUFFLElBQUk7O1FBQ2pGLEtBQUMsVUFBYSxZQUFZLFVBQVUsS0FBQyxXQUFXLGVBQUs7O21CQUFNLE1BQU0sVUFBVSxLQUFDLElBQUksRUFBRSxLQUFDOztRQUNuRixLQUFDLFVBQWEsWUFBWSxVQUFVLEtBQUMsV0FBVyxlQUFLOzttQkFBTSxNQUFNLFVBQVUsS0FBQyxJQUFJLEtBQUMsSUFBSTs7UUFFckYsS0FBQyxVQUFhLFNBQVMsVUFBVSxLQUFDO1FBQ2xDLEtBQUMsWUFBYSxTQUFTLFVBQVUsS0FBQztRQUNsQyxLQUFDLFdBQWEsU0FBUyxVQUFVLEtBQUM7UUFFbEMsS0FBQyxZQUFhLE1BQU0sVUFBVSxLQUFDO1FBRS9CLEtBQUMsa0JBQWtCLFFBQVEsVUFBVSxLQUFDO1FBRXRDLEtBQUMsV0FBYSxLQUFDLElBQUks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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
