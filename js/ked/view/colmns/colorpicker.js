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
        this.paletteFits = false
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
        this.setColor('separator',theme.colorpicker.separator)
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
        var _86_37_

        return ((_86_37_=this.voided[idx]) != null ? _86_37_ : false)
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
        this.focusRing = [this.radio,this.hue,this.sat,this.val,this.red,this.green,this.blue]
        if (this.palette.length && this.paletteFits)
        {
            return this.focusRing.push(this.paletteView)
        }
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
        var found, syntax, _266_49_, _267_49_

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
                this.setHex((((_266_49_=this.colorAtSelection('fg')) != null ? _266_49_ : '#ff0000')),0)
                this.setHex((((_267_49_=this.colorAtSelection('bg')) != null ? _267_49_ : '#000000')),1)
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
        var bg, fg, hex, ranges, voided, _335_24_, _338_30_

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
    
        var aw, iw

        this.radio.layout(x + 1,y + 1,w - 2,1)
        this.hue.layout(x + 1,y + 3,w - 2,1)
        this.sat.layout(x + 1,y + 4,w - 2,1)
        this.val.layout(x + 1,y + 5,w - 2,1)
        aw = _k_.max(1,w - 2)
        iw = 4
        this.red.layout(x + 1,y + 7,iw,1)
        this.green.layout(x + 1 + parseInt((aw - iw) / 2),y + 7,iw,1)
        this.blue.layout(x + 1 + aw - iw,y + 7,iw,1)
        this.paletteFits = this.palette.length > 0 && h > 9
        if (this.paletteFits)
        {
            return this.paletteView.layout(x,y + 9,w,1)
        }
        else
        {
            return this.paletteView.layout(x,y,0,0)
        }
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
        if (this.paletteFits)
        {
            this.cells.fill_row(8,0,this.cells.cols - 1,'─',this.color.separator,this.color.bg)
        }
        var list = _k_.list(this.focusRing)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            child.draw()
        }
        return colorpicker.__super__.draw.call(this)
    }

    return colorpicker
})()

export default colorpicker;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFLO0lBQU07O09BQ2hCLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksV0FBUDs7T0FDTyxXQUFmO09BQW9CLGtCQUFwQjtPQUFnQyxlQUFoQztPQUF5QyxZQUF6QztPQUErQyxjQUEvQzs7O0FBQ04sZUFBRDs7NEJBQWE7YUFJVCxhQUFJLFFBQVEsUUFBUTs7UUFBakI7UUFBUTtRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29EQUVULEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxTQUFTO1FBRVYsS0FBQyxlQUFnQjtRQUNqQixLQUFDLGdCQUFnQjtRQUNqQixLQUFDLFlBQWdCO1FBQ2pCLEtBQUMsVUFBaUIsTUFBTTtRQUN4QixLQUFDO1FBRUQsS0FBQztRQUNELEtBQUMsYUFBYTtRQUNkLEtBQUMsY0FBYztRQUVmLEtBQUMsVUFBYSxZQUFZLFVBQVUsS0FBQyxXQUFXLGVBQUs7O21CQUFNLE1BQU0sVUFBVSxFQUFFLElBQUk7O1FBQ2pGLEtBQUMsVUFBYSxZQUFZLFVBQVUsS0FBQyxXQUFXLGVBQUs7O21CQUFNLE1BQU0sVUFBVSxLQUFDLElBQUksRUFBRSxLQUFDOztRQUNuRixLQUFDLFVBQWEsWUFBWSxVQUFVLEtBQUMsV0FBVyxlQUFLOzttQkFBTSxNQUFNLFVBQVUsS0FBQyxJQUFJLEtBQUMsSUFBSTs7UUFFckYsS0FBQyxVQUFhLFNBQVMsVUFBVSxLQUFDO1FBQ2xDLEtBQUMsWUFBYSxTQUFTLFVBQVUsS0FBQztRQUNsQyxLQUFDLFdBQWEsU0FBUyxVQUFVLEtBQUM7UUFFbEMsS0FBQyxZQUFhLE1BQU0sVUFBVSxLQUFDO1FBRS9CLEtBQUMsa0JBQWtCLFFBQVEsVUFBVSxLQUFDO1FBRXRDLEtBQUMsV0FBYSxLQUFDLElBQUksS0FBQyxJQUFJLEtBQUM7UUFDekIsS0FBQyxVQUFhLEtBQUMsSUFBSSxLQUFDLE1BQU0sS0FBQztRQUMzQixLQUFDLGFBQWEsS0FBQyxNQUFNLEtBQUMsSUFBSSxLQUFDLElBQUksS0FBQyxJQUFJLEtBQUMsSUFBSSxLQUFDLE1BQU0sS0FBQztRQUVqRCxLQUFDLElBQUksWUFBYyxNQUFNLFlBQVk7UUFDckMsS0FBQyxNQUFNLFlBQVksTUFBTSxZQUFZO1FBQ3JDLEtBQUMsS0FBSyxZQUFhLE1BQU0sWUFBWTtRQUVyQyxLQUFDLE1BQU0sU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUN2QyxLQUFDLE1BQU0sU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUV2QyxLQUFDLElBQUksR0FBTSxjQUFjLEtBQUM7UUFDMUIsS0FBQyxJQUFJLEdBQU0sY0FBYyxLQUFDO1FBQzFCLEtBQUMsSUFBSSxHQUFNLGNBQWMsS0FBQztRQUUxQixLQUFDLElBQUksR0FBTSxjQUFjLEtBQUM7UUFDMUIsS0FBQyxNQUFNLEdBQUksY0FBYyxLQUFDO1FBQzFCLEtBQUMsS0FBSyxHQUFLLGNBQWMsS0FBQztRQUUxQixLQUFDLE1BQU0sR0FBRyxlQUFlLEtBQUM7UUFFMUIsS0FBQyxTQUFTLEtBQUssTUFBTSxZQUFZO1FBQ2pDLEtBQUMsU0FBUyxLQUFLLE1BQU0sWUFBWTtRQUNqQyxLQUFDLFNBQVMsWUFBWSxNQUFNLFlBQVk7UUFFeEMsS0FBQyxZQUFZOzs7MkJBRWpCLHlCQUFZOzs7OzRCQUVVLEtBQUM7YUFBVjs7WUFBTDtnQkFDRyxLQUFLOztnQkFDSixNQUFNLEtBQUMsVUFBVTtxQkFDZCxLQUFLLFFBQU0sU0FBTixRQUFNLFFBQVE7O3dCQUNmLEtBQUMsVUFBVSxRQUFNLE9BQU87O3dCQUN2QixLQUFDLFVBQVUsUUFBTSxPQUFPOytCQUN0Qjs7O3VCQUNSOzs7ZUFDVjs7OzJCQUVKOztlQUFjLEtBQUMsV0FBVzs7OzJCQUMxQjs7ZUFBYyxLQUFDLFdBQVc7OzsyQkFFMUI7O2VBQWdCLEtBQUMsTUFBTTs7OzJCQUV2Qjs7ZUFBeUIsS0FBQzs7OzJCQUUxQjs7ZUFBc0IsS0FBQzs7OzJCQUV2QiwwQkFBYTs7Ozt5QkFBTyxLQUFDLE9BQU8sMEJBQU87OzsyQkFFbkM7O1FBRUksS0FBQyxPQUFPLEtBQUMsaUJBQWlCO1FBRTFCLEtBQUM7ZUFFRCxLQUFLLEtBQUs7OzsyQkFNZDs7ZUFBbUIsS0FBQyxZQUFZOzs7MkJBRWhDOztlQUFpQixLQUFDLFdBQVUsS0FBQyxRQUFRLFNBQVMsSUFBSTs7OzJCQUVsRDs7UUFFSSxLQUFDLFlBQVksVUFBVSxLQUFDO1FBRXhCLEtBQUMsWUFBWSxhQUFhLEtBQUMsUUFBUSxTQUFTO1FBRTVDLEtBQUMsYUFBYSxLQUFDLE1BQU0sS0FBQyxJQUFJLEtBQUMsSUFBSSxLQUFDLElBQUksS0FBQyxJQUFJLEtBQUMsTUFBTSxLQUFDO1lBQ2pCLEtBQUMsUUFBUSxVQUFXLEtBQUM7O21CQUFyRCxLQUFDLFVBQVUsS0FBSyxLQUFDOzs7OzJCQUVyQjs7OztRQUVJLE1BQU0sS0FBQztzQkFDSTs7OztZQUNOLEtBQUMsUUFBUSxTQUFTOzs7O1FBRXZCLEtBQUMsUUFBUSxLQUFLO1lBRU0sS0FBQyxRQUFRLFNBQVMsS0FBQzs7WUFBdkMsS0FBQyxRQUFROztRQUVULEtBQUM7UUFFRCxLQUFLLEtBQUs7ZUFFVjs7OzJCQUVKOzs7O1FBRUksTUFBTSxLQUFDLFlBQVk7WUFDZCxNQUFNLEtBQUssT0FBTyxLQUFDLFFBQVE7Ozs7UUFFaEMsS0FBQyxRQUFRLE9BQU8sSUFBSTtRQUVwQixLQUFDO1lBRXdELEtBQUMsUUFBUTs7WUFBbEUsS0FBQyxZQUFZLG9CQUFnQixFQUFFLEtBQUMsUUFBUSxTQUFPLEVBQUU7O3NCQUV0QixLQUFDOztZQUE1QixLQUFDLEtBQUs7O1FBRU4sS0FBSyxLQUFLO2VBRVY7OzsyQkFFSjs7OztRQUVJLE1BQU0sS0FBQyxZQUFZLFFBQVEsS0FBQyxZQUFZO3NCQUM3Qjs7OztRQUVYLEtBQUMsT0FBTyxJQUFJO1FBRVosS0FBQztRQUVELEtBQUssS0FBSyxxQkFBcUIsS0FBQztRQUNoQyxLQUFLLEtBQUs7ZUFFVjs7OzJCQUVKOztlQUFRLEtBQUMsWUFBWSxLQUFDOzs7MkJBQ3RCOztlQUFRLE1BQU0sSUFBSSxLQUFDOzs7MkJBQ25COztlQUFRLE1BQU0sU0FBUyxLQUFDOzs7MkJBQ3hCOztlQUFNLEtBQUMsTUFBTTs7OzJCQUNiOztlQUFNLEtBQUMsTUFBTTs7OzJCQUNiOztlQUFNLEtBQUMsTUFBTTs7OzJCQUViLHVCQUFVOztlQUFRLE1BQU0sSUFBSSxLQUFDLFlBQVk7OzsyQkFDekM7O2VBQWtCLEtBQUMsU0FBUzs7OzJCQUM1Qjs7ZUFBa0IsS0FBQyxTQUFTOzs7MkJBRTVCOztZQUNPLEtBQUMsWUFBWSxTQUFTOztZQUNyQixLQUFDLFlBQVksS0FBSyxLQUFDLFlBQVk7bUJBQy9CLEtBQUM7Ozs7MkJBRVQ7O1FBRUksS0FBQztRQUNELEtBQUM7ZUFDRCxLQUFDOzs7MkJBRUw7Ozs7UUFFSTt1QkFFSSxNQUFPLFNBQUksS0FBQyxZQUFZLDRCQUFiLEtBQUMsWUFBWSxlQUFiLEtBQUMsWUFBWTs7WUFDeEIsTUFBTSxLQUFDLFNBQVM7aUJBQzREOztnQkFBNUUsS0FBSyxNQUFNLE1BQU8sTUFBTSxPQUFPLEtBQU0sUUFBUSxLQUFDLE9BQU8sS0FBSyxTQUFTOzs7UUFFdkUsS0FBQyxNQUFNLFdBQVc7UUFDbEIsS0FBQyxNQUFNLFVBQVUsS0FBQztlQUNsQixLQUFDLE1BQU0sYUFBYSxLQUFLLFNBQVM7OzsyQkFFdEM7O1FBRUksS0FBQyxJQUFJLFNBQVMsS0FBQztRQUNmLEtBQUMsSUFBSSxTQUFTLEtBQUM7ZUFDZixLQUFDLElBQUksU0FBUyxLQUFDOzs7MkJBRW5COzs7O1FBQ0ksTUFBTSxLQUFDO2FBQ0gsSUFBSyxRQUFHOztZQUNSLEtBQUMsT0FBTyxHQUFHLFNBQVMsSUFBSTs7OzsyQkFFaEMscUJBQVEsS0FBSTs7OztzQkFFRzs7OztRQUNYLE1BQU0sTUFBTSxPQUFPO3NCQUNSOzs7O1FBQ1gsT0FBQSxjQUFBLE1BQU8sS0FBQztRQUVSLEtBQUMsWUFBWSxPQUFPO1FBRXBCLEtBQUMsT0FBTyxPQUFPO1lBQ00sUUFBTzs7WUFBNUIsS0FBQyxZQUFZOztlQUNiOzs7MkJBRUosNkJBQWdCOztlQUVaLEtBQUMsTUFBTSx1QkFBbUIsRUFBRSxXQUFNOzs7MkJBRXRDOztRQUVJLEtBQUMsWUFBWSxLQUFDLGlCQUFpQixNQUFNLFVBQVUsS0FBQyxJQUFJLFdBQVcsS0FBQyxJQUFJLFdBQVcsS0FBQyxJQUFJO1FBRXBGLEtBQUM7UUFDRCxLQUFDO2VBQ0QsS0FBQzs7OzJCQUVMOztRQUVJLEtBQUMsWUFBWSxLQUFDLGtCQUFrQixLQUFDLElBQUksV0FBVyxLQUFDLE1BQU0sV0FBVyxLQUFDLEtBQUs7UUFFeEUsS0FBQztRQUNELEtBQUM7ZUFDRCxLQUFDOzs7MkJBRUw7O1FBRUksS0FBQyxPQUFPLEtBQUMsaUJBQWlCO1lBQ0wsS0FBQyxrQkFBaUI7O1lBQXZDLEtBQUMsWUFBWTs7UUFFYixLQUFLLEtBQUsscUJBQXFCLEtBQUM7ZUFDaEMsS0FBSyxLQUFLOzs7MkJBRWQsbUJBQU07Ozs7UUFFRixLQUFDLFlBQWU7UUFDaEIsS0FBQyxVQUFnQixNQUFNO1FBQ3ZCLEtBQUM7UUFDRCxLQUFDLE1BQU0sU0FBUzthQUViOztZQUNDLEtBQUMsT0FBTzs7OztnQkFFTCxRQUFRLEtBQUM7O2dCQUNSLE1BQU0sTUFBTTtnQkFDWixLQUFDLGVBQWU7Z0JBQ2hCLEtBQUMsT0FBTztnQkFDUixLQUFDLGFBQWEsT0FBTyxLQUFDOztnQ0FFUixLQUFDLE9BQU8sTUFBTSxFQUFFOztnQkFFOUIsS0FBQyxpQkFBZ0Isa0JBQWEsS0FBQyxPQUFPLE1BQU0sRUFBRTtnQkFFOUMsS0FBQyxtQkFBUSxLQUFDLGlCQUFpQiw0QkFBUSxZQUFXO2dCQUM5QyxLQUFDLG1CQUFRLEtBQUMsaUJBQWlCLDRCQUFRLFlBQVc7O3FCQUUxQyxTQUFTLEtBQUMsT0FBTzs7Z0JBQ3JCLEtBQUMsT0FBTzs7OztnQkFHUixLQUFDLE9BQU87OztRQUVoQixLQUFDO1FBQ0QsS0FBQzs7ZUFHRCxLQUFDLElBQUk7OzsyQkFFVCwrQkFBa0I7Ozs7NEJBRUgsS0FBQyxPQUFPLE1BQU0sRUFBRTs7O1lBQXZCO2dCQUNHLElBQUksS0FBQyxPQUFPLE1BQU0sWUFBWSxJQUFJLEdBQUcsSUFBSSxJQUFJOzt1QkFDMUM7OztlQUNWOzs7MkJBRUo7Ozs7UUFFSSxRQUFRLEtBQUMsT0FBTztRQUNoQixLQUFRLE1BQU07UUFDZCxRQUFRLE1BQU0sRUFBRTtrQkFDUixJQUFQLFlBQUU7O1lBRUUsSUFBSSxLQUFLLEtBQUssTUFBTTs7OztRQUV6QixPQUFPLE1BQU07c0JBQ0Y7Ozs7UUFFWCxPQUFPLE1BQU07UUFDYixNQUFPLEtBQUssd0JBQXdCLE1BQU07c0JBRWpDLG1CQUFjOztnQkFDaEIsSUFBSSxLQUFLLFVBQVcsS0FBSyxJQUFJLFdBQUssR0FBSSxJQUFFLFFBQU87O2dCQUM5QyxPQUFPLEtBQUssVUFBVSxPQUFPLElBQUUsRUFBRTtnQkFDakMsTUFBTyxLQUFLLHdCQUF3QixPQUFPLElBQUUsRUFBRTs7O3NCQUU1QyxtQkFBYzs7OztzQkFDZCxNQUFNLE9BQU87Ozs7UUFFeEIsT0FBTztZQUVKLElBQUksS0FBSyxLQUFNLEtBQUssSUFBSSxXQUFLLElBQUksS0FBRyxVQUFJLElBQUksa0JBQUosSUFBSSxjQUFROztZQUNuRCxPQUFPLE1BQU07WUFDYixPQUFRLElBQUksS0FBRyxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSTs7Z0JBRXZDLEtBQU0sS0FDTixNQUFPOzs7MkJBRVg7Ozs7WUFFUyxLQUFDOzs7Ozs0QkFJTyxLQUFDOzs7WUFBVjtZQUNBLE1BQU0sTUFBTTs7UUFFaEIsS0FBSyxLQUFLLFFBQVE7ZUFDbEIsS0FBSyxLQUFLOzs7MkJBRWQ7Ozs7UUFFSSxNQUFNLEtBQUM7YUFDSixLQUFDLHlCQUFrQixRQUFPLEtBQUMsYUFBYTs7WUFDdkMsS0FBQyxhQUFhOztrQkFFVixLQUFDOztZQUVMLFNBQVMsS0FBQyxjQUFjO1lBRXhCLEtBQUMsZ0JBQWdCO1lBRWpCLEtBQUssS0FBQztZQUNOLEtBQUs7Z0JBRW9CLEtBQUM7O2dCQUExQixLQUFLLEtBQUM7O1lBRU47Z0JBQ29CLEtBQUMsWUFBWTs7Z0JBQWpDLE9BQU8sS0FBSzs7Z0JBQ1EsS0FBQyxZQUFZOztnQkFBakMsT0FBTyxLQUFLOztZQUVaLEtBQUMsT0FBTyxNQUFNLG1CQUFtQixPQUFPLEdBQUcsR0FBRzs7ZUFFbEQsS0FBQzs7OzJCQUVMLDJCQUFjOzs7O3NCQUVDOzs7O3NCQUNBLEtBQUM7Ozs7a0JBRUEsS0FBQyxhQUFhLE9BQXpCLGFBQUcsWUFBRTs7UUFFTixRQUFRLEtBQUMsT0FBTztRQUNoQixRQUFRLE1BQU0sRUFBRSxNQUFNO1lBRWpCLElBQUksS0FBSyxLQUFLLE1BQU07Ozs7UUFFekIsT0FBTztZQUNhLEtBQUMsYUFBYSxLQUFLLE9BQU0sT0FBUSxLQUFLLE9BQU07O1lBQWhFLE9BQU8sV0FBSzs7UUFFWixNQUFNLFFBQVEsTUFBTSxHQUFHLElBQUksS0FBRyxJQUFJLEtBQUs7UUFDdkMsTUFBTSxTQUFTO2VBRWYsS0FBQyxlQUFlOzs7MkJBRXBCOztRQUVJLEtBQUssS0FBSztlQUNWLEtBQUM7OzsyQkFFTCxzQkFBUzs7OztZQUVBLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLE1BQU0sS0FBQyxNQUFNLFFBQVE7YUFBcUIsY0FBQSxJQUFLOzttQkFBWjs7UUFFbkMsTUFBTSxLQUFDLFlBQVksUUFBUTthQUFpQixjQUFBLElBQUs7O21CQUFaOzs0QkFFdkIsS0FBQzs7O1lBQVg7WUFDQSxNQUFNLE9BQU8sUUFBUTtpQkFBaUIsY0FBQSxJQUFLOzt1QkFBWjs7OzZCQUV0QixLQUFDOzs7WUFBVjtZQUNBLE1BQU0sTUFBTSxRQUFRO2lCQUFrQixjQUFBLElBQUs7O3VCQUFaOzs7dURBRTdCOzs7MkJBRVYsc0JBQVM7Ozs7WUFFQSxLQUFDLFlBQVksS0FBQzs7Ozs0QkFFTCxLQUFDOzs7WUFBWDtZQUNBLE1BQU0sT0FBTyxRQUFRO2lCQUFpQixjQUFBLElBQUs7O3VCQUFaOzs7NkJBRXRCLEtBQUM7OztZQUFWO1lBQ0EsTUFBTSxNQUFNLFFBQVE7aUJBQWtCLGNBQUEsSUFBSzs7dUJBQVo7OztZQUVoQyxLQUFDLE1BQU0sY0FBYzs7b0JBQ2xCLE9BQU87Ozs7MkJBRWpCLG9CQUFPLEtBQUk7O1lBRUksS0FBQzs7bUJBQVY7O1lBR1EsS0FBQyxJQUFPLE1BQU0sSUFBSTs7bUJBQTFCOztZQUNRLEtBQUMsTUFBTyxNQUFNLElBQUk7O21CQUExQjs7WUFDUSxLQUFDLEtBQU8sTUFBTSxJQUFJOzttQkFBMUI7O1lBRVEsS0FBQyxJQUFPLE1BQU0sSUFBSTs7bUJBQTFCOztZQUNRLEtBQUMsSUFBTyxNQUFNLElBQUk7O21CQUExQjs7WUFDUSxLQUFDLElBQU8sTUFBTSxJQUFJOzttQkFBMUI7O1lBRVEsS0FBQyxNQUFPLE1BQU0sSUFBSTs7bUJBQTFCOztZQUNRLEtBQUMsWUFBWSxNQUFNLElBQUk7O21CQUEvQjs7Z0JBRUssTUFBTTs7aUJBQ1Q7aUJBQU07dUJBQWUsS0FBQzs7aUJBQ3RCO2lCQUFJO3VCQUFpQixLQUFDOztpQkFDdEI7dUJBQXFCLEtBQUM7O2lCQUN0Qjt1QkFBcUIsS0FBQzs7aUJBQ3RCO2lCQUNBO3VCQUFxQixLQUFDOztpQkFDdEI7aUJBQ0E7dUJBQXFCLEtBQUM7O2lCQUN0QjtpQkFBUztnQkFBWSxLQUFLLEtBQUssS0FBQzt1QkFBVTs7aUJBQzFDO2lCQUFTO2dCQUFZLEtBQUMsT0FBTyxLQUFLO2dCQUFXLEtBQUM7dUJBQWM7Ozs7ZUFFaEU7OzsyQkFFSjs7WUFFOEIsS0FBQzs7bUJBQXpCLEtBQUM7O2VBRUgsS0FBQzs7OzJCQUVMOztZQUUrQixLQUFDOzttQkFBMUIsS0FBQzs7ZUFFSCxLQUFDOzs7MkJBRUwscUJBQVEsR0FBRSxHQUFFLEdBQUU7OytDQUVKLEVBQUUsRUFBRSxFQUFFOzs7O1FBRVosS0FBQyxNQUFNLE9BQVEsSUFBRSxFQUFFLElBQUUsRUFBRSxJQUFFLEVBQUU7UUFFM0IsS0FBQyxJQUFJLE9BQVUsSUFBRSxFQUFFLElBQUUsRUFBRSxJQUFFLEVBQUU7UUFDM0IsS0FBQyxJQUFJLE9BQVUsSUFBRSxFQUFFLElBQUUsRUFBRSxJQUFFLEVBQUU7UUFDM0IsS0FBQyxJQUFJLE9BQVUsSUFBRSxFQUFFLElBQUUsRUFBRSxJQUFFLEVBQUU7UUFFM0IsYUFBUyxFQUFFLElBQUU7UUFDYixLQUFLO1FBRUwsS0FBQyxJQUFJLE9BQVMsSUFBRSxFQUFpQixJQUFFLEVBQUUsR0FBRztRQUN4QyxLQUFDLE1BQU0sT0FBTyxJQUFFLGNBQU8sS0FBRyxNQUFJLEdBQUcsSUFBRSxFQUFFLEdBQUc7UUFDeEMsS0FBQyxLQUFLLE9BQVEsSUFBRSxJQUFFLEtBQUcsR0FBWSxJQUFFLEVBQUUsR0FBRztRQUV4QyxLQUFDLGNBQWMsS0FBQyxRQUFRLFNBQVMsS0FBTSxJQUFJO1lBRXhDLEtBQUM7O21CQUNBLEtBQUMsWUFBWSxPQUFPLEVBQUUsSUFBRSxFQUFFLEVBQUU7Ozs7bUJBRTVCLEtBQUMsWUFBWSxPQUFPLEVBQUUsRUFBRSxFQUFFOzs7OzJCQUVsQzs7OztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLEtBQUM7UUFFRCxLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxLQUFDLE1BQU07WUFFeEMsS0FBQzs7WUFDQSxLQUFDLE1BQU0sU0FBUyxFQUFFLEVBQUUsS0FBQyxNQUFNLE9BQUssRUFBRSxJQUFJLEtBQUMsTUFBTSxVQUFVLEtBQUMsTUFBTTs7NEJBRXJELEtBQUM7OztZQUFWO1lBQ0EsTUFBTTs7Ozs7V0FuZWpCOzs7ZUF1ZU0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
