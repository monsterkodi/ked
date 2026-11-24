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
        this["onEsc"] = this["onEsc"].bind(this)
        this["cancel"] = this["cancel"].bind(this)
        this["replaceColor"] = this["replaceColor"].bind(this)
        this["submitSue"] = this["submitSue"].bind(this)
        this["submit"] = this["submit"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["hexAtCursor"] = this["hexAtCursor"].bind(this)
        this["colorAtSelection"] = this["colorAtSelection"].bind(this)
        this["setSheetColors"] = this["setSheetColors"].bind(this)
        this["show"] = this["show"].bind(this)
        this["renderSheet"] = this["renderSheet"].bind(this)
        this["updateSheet"] = this["updateSheet"].bind(this)
        this["emitChanged"] = this["emitChanged"].bind(this)
        this["rgbChanged"] = this["rgbChanged"].bind(this)
        this["sliderChanged"] = this["sliderChanged"].bind(this)
        this["setSelectedColor"] = this["setSelectedColor"].bind(this)
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
        this["voidSelectedColor"] = this["voidSelectedColor"].bind(this)
        this["colorVoided"] = this["colorVoided"].bind(this)
        this["backgroundChanged"] = this["backgroundChanged"].bind(this)
        this["onRadioSelectedChanged"] = this["onRadioSelectedChanged"].bind(this)
        this["selectedIndex"] = this["selectedIndex"].bind(this)
        colorpicker.__super__.constructor.call(this,this.screen,this.name)
        this.height = 9
        this.colorReplace = null
        this.colorDecorate = null
        this.sheetNode = null
        this.sheetEdit = false
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
        this.radio.on('selectedChange',this.onRadioSelectedChanged)
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('fg',theme.colorpicker.fg)
        this.isVisible = false
    }

    colorpicker.prototype["selectedIndex"] = function ()
    {
        return this.radio.selectedIndex
    }

    colorpicker.prototype["onRadioSelectedChanged"] = function ()
    {
        return this.syncAll()
    }

    colorpicker.prototype["backgroundChanged"] = function ()
    {
        return this.bgChanged
    }

    colorpicker.prototype["colorVoided"] = function (idx)
    {
        var _74_37_

        return ((_74_37_=this.voided[idx]) != null ? _74_37_ : false)
    }

    colorpicker.prototype["voidSelectedColor"] = function ()
    {
        this.voided[this.selectedIndex()] = true
        this.syncRadio()
        this.updateSheet()
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

        idx = this.paletteView.selectedIndex
        if (idx < 0 || idx >= this.palette.length)
        {
            return
        }
        this.palette.splice(idx,1)
        this.syncPalette()
        if (this.palette.length)
        {
            this.paletteView.setSelectedIndex(_k_.clamp(0,this.palette.length - 1,idx))
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

        opt = this.paletteView.options[this.paletteView.selectedIndex]
        if (_k_.empty(opt))
        {
            return
        }
        this.setHex(opt.label)
        this.syncAll()
        this.updateSheet()
        post.emit('colorpicker.change',this.hex())
        post.emit('redraw')
        return true
    }

    colorpicker.prototype["rgb"] = function ()
    {
        return this.colorStates[this.selectedIndex()]
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
        for (idx = 0; idx < this.colorStates.length; idx++)
        {
            col = this.colorHex(idx)
            if ((col != null))
            {
                opts.push({color:color.values(col),label:((this.voided[idx] ? 'none' : col))})
            }
        }
        this.radio.setOptions(opts)
        this.radio.setSelectedIndex(this.selectedIndex())
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
        idx = (idx != null ? idx : this.selectedIndex())
        this.colorStates[idx] = rgb
        this.voided[idx] = false
        if (idx === 1)
        {
            this.bgChanged = true
        }
        return true
    }

    colorpicker.prototype["setSelectedColor"] = function (idx)
    {
        return this.radio.select(_k_.clamp(0,1,parseInt(idx)))
    }

    colorpicker.prototype["sliderChanged"] = function ()
    {
        this.colorStates[this.selectedIndex()] = color.hsvToRgb([this.hue.getValue(),this.sat.getValue(),this.val.getValue()])
        this.syncRadio()
        this.syncInputs()
        return this.emitChanged()
    }

    colorpicker.prototype["rgbChanged"] = function ()
    {
        this.colorStates[this.selectedIndex()] = [this.red.int(),this.green.int(),this.blue.int()]
        this.syncRadio()
        this.syncSliders()
        return this.emitChanged()
    }

    colorpicker.prototype["emitChanged"] = function ()
    {
        this.voided[this.selectedIndex()] = false
        if (this.selectedIndex() === 1)
        {
            this.bgChanged = true
        }
        this.updateSheet()
        post.emit('colorpicker.change',this.hex())
        return post.emit('redraw')
    }

    colorpicker.prototype["updateSheet"] = function ()
    {
        var channel, hex, idx, _239_27_

        if (!(this.sheetNode != null))
        {
            return
        }
        if (!this.sheetEdit)
        {
            this.editor.state.begin()
            this.sheetEdit = true
        }
        var list = [[0,'fg'],[1,'bg']]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            idx = list[_a_][0]
            channel = list[_a_][1]
            if (this.colorVoided(idx))
            {
                delete this.sheetNode[channel]
            }
            else if (hex = this.colorHex(idx))
            {
                this.sheetNode[channel] = hex
            }
        }
        return this.renderSheet()
    }

    colorpicker.prototype["renderSheet"] = function ()
    {
        var state, _256_30_

        state = this.editor.state
        if (!(state.rectree != null))
        {
            return
        }
        return state.commitSheet()
    }

    colorpicker.prototype["show"] = function (hexl, opt = {focus:true})
    {
        var found, hex, idx, syntax, _265_33_, _266_42_, _269_25_, _276_29_, _289_49_, _290_49_

        this.bgChanged = false
        this.voided = [false,false]
        this.colorStates = []
        this.sheetNode = ((_265_33_=opt.node) != null ? _265_33_ : null)
        this.radio.selectedIndex = ((_266_42_=opt.select) != null ? _266_42_ : 0)
        if (!_k_.empty(hexl))
        {
            if ((this.sheetNode != null))
            {
                this.setSheetColors(hexl)
            }
            else
            {
                var list = _k_.list(hexl)
                for (idx = 0; idx < list.length; idx++)
                {
                    hex = list[idx]
                    this.setHex(hex,idx)
                }
            }
        }
        else
        {
            if (found = this.hexAtCursor())
            {
                if ((found.node != null))
                {
                    this.sheetNode = found.node
                    this.setSheetColors(found.colors)
                }
                else
                {
                    hex = found.text
                    this.colorReplace = found
                    this.setHex(hex)
                    this.colorReplace.from = this.hex()
                }
            }
            else if (!_k_.empty(this.editor.state.s.selections))
            {
                this.colorDecorate = {ranges:_k_.clone((this.editor.state.s.selections))}
                this.setHex((((_289_49_=this.colorAtSelection('fg')) != null ? _289_49_ : '#ff0000')),0)
                this.setHex((((_290_49_=this.colorAtSelection('bg')) != null ? _290_49_ : '#000000')),1)
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

    colorpicker.prototype["setSheetColors"] = function (hexl)
    {
        var hex, idx

        var list = _k_.list(hexl)
        for (idx = 0; idx < list.length; idx++)
        {
            hex = list[idx]
            if (_k_.empty(hex))
            {
                this.voided[idx] = true
                this.setHex(((idx === 0 ? '#ffffff' : '#000000')),idx)
                this.voided[idx] = true
            }
            else
            {
                this.setHex(hex,idx)
            }
        }
        if (this.colorVoided(0 && !this.colorVoided(1)))
        {
            return this.radio.selectedIndex = 1
        }
    }

    colorpicker.prototype["colorAtSelection"] = function (layer)
    {
        var c, rng

        if (c = this.editor.state.sueColorAtSelection(layer))
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

    colorpicker.prototype["hexAtCursor"] = function ()
    {
        var line, lines, mc, node, rng, state, text, word, x, y, _333_24_

        state = this.editor.state
        if ((state.rectree != null) && _k_.empty(state.s.selections))
        {
            if (node = state.sheetNodeAtCursor())
            {
                return {node:node,colors:[node.fg,node.bg]}
            }
        }
        mc = state.mainCursor()
        lines = state.s.lines
        ;[x,y] = mc
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
        if (this.sheetEdit)
        {
            this.editor.state.end()
            this.sheetEdit = false
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
        var bg, fg, hex, ranges, voided, _384_21_, _388_28_, _391_34_, _408_44_

        if ((this.sheetNode != null))
        {
            this.updateSheet()
        }
        else
        {
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
        }
        if (!(this.editor.state.rectree != null))
        {
            return this.hide()
        }
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
        ;[x1,y,x2] = this.colorReplace.range
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

    colorpicker.prototype["onEsc"] = function ()
    {
        var _470_32_

        if ((this.editor.state.rectree != null))
        {
            post.emit('focus','editor')
            post.emit('redraw')
            return true
        }
        return this.cancel()
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
                return this.onEsc()

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
        return this.voidSelectedColor()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFLO0lBQU07O09BQ2hCLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksWUFBWjs7T0FDWSxXQUFQOztPQUNPLFdBQWY7T0FBb0Isa0JBQXBCO09BQWdDLGVBQWhDO09BQXlDLFlBQXpDO09BQStDLGNBQS9DOzs7QUFDTixlQUFEOzs0QkFBYTthQUlULGFBQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0RBRVQsS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFNBQVM7UUFFVixLQUFDLGVBQWdCO1FBQ2pCLEtBQUMsZ0JBQWdCO1FBQ2pCLEtBQUMsWUFBZ0I7UUFDakIsS0FBQyxZQUFnQjtRQUNqQixLQUFDLFlBQWdCO1FBQ2pCLEtBQUMsVUFBaUIsTUFBTTtRQUN4QixLQUFDO1FBRUQsS0FBQztRQUNELEtBQUMsYUFBYTtRQUVkLEtBQUMsVUFBYSxZQUFZLEtBQUMsVUFBVSxLQUFDLFdBQVcsZUFBSzs7bUJBQU0sTUFBTSxVQUFVLEVBQUUsSUFBSTs7UUFDbEYsS0FBQyxVQUFhLFlBQVksS0FBQyxVQUFVLEtBQUMsV0FBVyxlQUFLOzttQkFBTSxNQUFNLFVBQVUsS0FBQyxJQUFJLEVBQUUsS0FBQzs7UUFDcEYsS0FBQyxVQUFhLFlBQVksS0FBQyxVQUFVLEtBQUMsV0FBVyxlQUFLOzttQkFBTSxNQUFNLFVBQVUsS0FBQyxJQUFJLEtBQUMsSUFBSTs7UUFFdEYsS0FBQyxVQUFhLFNBQVMsS0FBQyxVQUFVLEtBQUM7UUFDbkMsS0FBQyxZQUFhLFNBQVMsS0FBQyxVQUFVLEtBQUM7UUFDbkMsS0FBQyxXQUFhLFNBQVMsS0FBQyxVQUFVLEtBQUM7UUFFbkMsS0FBQyxZQUFh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
//# sourceURL=../../../../kode/ked/view/colmns/colorpicker.kode
