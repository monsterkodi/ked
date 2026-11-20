var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        this["cancel"] = this["cancel"].bind(this)
        this["replaceColor"] = this["replaceColor"].bind(this)
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
        colorpicker.__super__.constructor.call(this,this.screen,this.name)
        this.height = 9
        this.colorReplace = null
        this.colorDecorate = null
        this.bgChanged = false
        this.voided = [false,false]
        this.colorStates = []
        this.palette = []
        this.paletteMax = 8
        this.hue = new colorslider(this.screen,`${this.name}_hue`,360,(function (v)
        {
            return color.hsvToRgb([v,100,100])
        }).bind(this))
        this.sat = new colorslider(this.screen,`${this.name}_sat`,100,(function (v)
        {
            return color.hsvToRgb([this.h(),v,this.v()])
        }).bind(this))
        this.val = new colorslider(this.screen,`${this.name}_val`,100,(function (v)
        {
            return color.hsvToRgb([this.h(),this.s(),v])
        }).bind(this))
        this.red = new rgbinput(this.screen,`${this.name}_red`)
        this.green = new rgbinput(this.screen,`${this.name}_green`)
        this.blue = new rgbinput(this.screen,`${this.name}_blue`)
        this.radio = new radio(this.screen,`${this.name}_radio`)
        this.paletteView = new palette(this.screen,`${this.name}_palette`)
        this.sliders = [this.hue,this.sat,this.val]
        this.inputs = [this.red,this.green,this.blue]
        this.focusRing = [this.radio,this.hue,this.sat,this.val,this.red,this.green,this.blue]
        this.mouseItems = [this.radio,this.paletteView].concat(this.sliders).concat(this.inputs)
        this.wheelItems = this.sliders.concat(this.inputs)
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
        var _72_37_

        return ((_72_37_=this.voided[idx]) != null ? _72_37_ : false)
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

        hex = (hex != null ? hex : "#000")
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

    colorpicker.prototype["show"] = function (hexl, opt = {focus:true})
    {
        var found, hex, idx, syntax, _234_35_, _250_49_, _251_49_

        this.bgChanged = false
        this.voided = [false,false]
        this.colorStates = []
        this.radio.active = ((_234_35_=opt.select) != null ? _234_35_ : 0)
        if (!_k_.empty(hexl))
        {
            var list = _k_.list(hexl)
            for (idx = 0; idx < list.length; idx++)
            {
                hex = list[idx]
                this.setHex(hex,idx)
            }
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
                this.setHex((((_250_49_=this.colorAtSelection('fg')) != null ? _250_49_ : '#ff0000')),0)
                this.setHex((((_251_49_=this.colorAtSelection('bg')) != null ? _251_49_ : '#000000')),1)
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
        if (opt.focus)
        {
            return this.hue.grabFocus()
        }
    }

    colorpicker.prototype["colorAtSelection"] = function (layer)
    {
        var c, rng

        if (c = this.sueColorAtSelection(layer))
        {
            return c
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
        var area, code, fg, rng

        fg = layer === 'fg'
        var list = _k_.list(this.editor.state.s.selections)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (area = this.editor.state.sueAt([rng[0],rng[1]]))
            {
                var _b_ = area.value; code = _b_[0]

                if (code === susan.FG_BG_COLOR)
                {
                    return area.value[(fg ? 3 : 4)]
                }
                if (fg && code === susan.FG_COLOR)
                {
                    return area.value[3]
                }
                if (!fg && code === susan.BG_COLOR)
                {
                    return area.value[3]
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
        var bg, fg, hex, ranges, voided, _339_24_, _342_30_

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
            this.submitSue(ranges,fg,bg,voided)
        }
        return this.hide()
    }

    colorpicker.prototype["submitSue"] = function (ranges, fg, bg, voided)
    {
        var h, rng, value, w

        ranges = belt.splitLineRanges(this.editor.state.s.lines,ranges,false)
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
                value = [susan.FG_BG_COLOR,w,h,fg,bg]
            }
            else if ((fg != null))
            {
                value = [susan.FG_COLOR,w,h,fg]
            }
            else if ((bg != null))
            {
                value = [susan.BG_COLOR,w,h,bg]
            }
            if ((value != null))
            {
                this.editor.state.setSue(rng[0],rng[1],value)
            }
        }
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

    colorpicker.prototype["onKey"] = function (key, event)
    {
        if (this.hidden() || this.collapsed())
        {
            return false
        }
        if (!this.hasFocus())
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
                return this.onReturn()

            case 'cmd+delete':
            case 'cmd+backspace':
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

        return colorpicker.__super__.onKey.call(this,key,event)
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
        return this.cells.set(-1,0,'s',this.color.fg,this.color.bg)
    }

    return colorpicker
})()

export default colorpicker;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFLO0lBQU07O09BQ2hCLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksWUFBWjs7T0FDWSxXQUFQOztPQUNPLFdBQWY7T0FBb0Isa0JBQXBCO09BQWdDLGVBQWhDO09BQXlDLFlBQXpDO09BQStDLGNBQS9DOzs7QUFDTixlQUFEOzs0QkFBYTthQUlULGFBQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0RBRVQsS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFNBQVM7UUFFVixLQUFDLGVBQWdCO1FBQ2pCLEtBQUMsZ0JBQWdCO1FBQ2pCLEtBQUMsWUFBZ0I7UUFDakIsS0FBQyxVQUFpQixNQUFNO1FBQ3hCLEtBQUM7UUFFRCxLQUFDO1FBQ0QsS0FBQyxhQUFhO1FBRWQsS0FBQyxVQUFhLFlBQVksS0FBQyxVQUFVLEtBQUMsV0FBVyxlQUFLOzttQkFBTSxNQUFNLFVBQVUsRUFBRSxJQUFJOztRQUNsRixLQUFDLFVBQWEsWUFBWSxLQUFDLFVBQVUsS0FBQyxXQUFXLGVBQUs7O21CQUFNLE1BQU0sVUFBVSxLQUFDLElBQUksRUFBRSxLQUFDOztRQUNwRixLQUFDLFVBQWEsWUFBWSxLQUFDLFVBQVUsS0FBQyxXQUFXLGVBQUs7O21CQUFNLE1BQU0sVUFBVSxLQUFDLElBQUksS0FBQyxJQUFJOztRQUV0RixLQUFDLFVBQWEsU0FBUyxLQUFDLFVBQVUsS0FBQztRQUNuQyxLQUFDLFlBQWEsU0FBUyxLQUFDLFVBQVUsS0FBQztRQUNuQyxLQUFDLFdBQWEsU0FBUyxLQUFDLFVBQVUsS0FBQztRQUVuQyxLQUFDLFlBQWEsTUFBTSxLQUFDLFVBQVUsS0FBQztRQUVoQyxLQUFDLGtCQUFr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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
