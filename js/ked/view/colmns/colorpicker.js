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

import layout from "../../popo/layout.js"

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
        this["sheetNodeAtCursor"] = this["sheetNodeAtCursor"].bind(this)
        this["sueColorAtSelection"] = this["sueColorAtSelection"].bind(this)
        this["colorAtSelection"] = this["colorAtSelection"].bind(this)
        this["setSheetColors"] = this["setSheetColors"].bind(this)
        this["show"] = this["show"].bind(this)
        this["renderSheet"] = this["renderSheet"].bind(this)
        this["updateSheet"] = this["updateSheet"].bind(this)
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
        var _75_37_

        return ((_75_37_=this.voided[idx]) != null ? _75_37_ : false)
    }

    colorpicker.prototype["voidActiveColor"] = function ()
    {
        this.voided[this.activeIndex()] = true
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
        this.updateSheet()
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
                opts.push({color:color.values(col),label:((this.voided[idx] ? 'none' : col))})
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
        this.colorStates[this.activeIndex()] = [this.red.int(),this.green.int(),this.blue.int()]
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
        this.updateSheet()
        post.emit('colorpicker.change',this.hex())
        return post.emit('redraw')
    }

    colorpicker.prototype["updateSheet"] = function ()
    {
        var channel, hex, idx, _240_27_

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
        var state, _257_30_

        state = this.editor.state
        if (!(state.rectree != null))
        {
            return
        }
        return state.renderSheet(state.rectree,state.sheetSize(),state.sheetCellForPos(state.mainCursor()),{silent:true})
    }

    colorpicker.prototype["show"] = function (hexl, opt = {focus:true})
    {
        var found, hex, idx, syntax, _266_33_, _267_35_, _270_25_, _277_29_, _290_49_, _291_49_

        this.bgChanged = false
        this.voided = [false,false]
        this.colorStates = []
        this.sheetNode = ((_266_33_=opt.node) != null ? _266_33_ : null)
        this.radio.active = ((_267_35_=opt.select) != null ? _267_35_ : 0)
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
                this.setHex((((_290_49_=this.colorAtSelection('fg')) != null ? _290_49_ : '#ff0000')),0)
                this.setHex((((_291_49_=this.colorAtSelection('bg')) != null ? _291_49_ : '#000000')),1)
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
            return this.radio.active = 1
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

    colorpicker.prototype["sheetNodeAtCursor"] = function ()
    {
        var state, _349_30_

        state = this.editor.state
        if (!(state.rectree != null))
        {
            return
        }
        return layout.nodeForPos(this.editor.cells,state.rectree,state.sheetCellForPos(state.mainCursor()))
    }

    colorpicker.prototype["hexAtCursor"] = function ()
    {
        var line, lines, mc, node, rng, state, text, word, x, y, _357_24_

        state = this.editor.state
        if ((state.rectree != null) && _k_.empty(state.s.selections))
        {
            if (node = this.sheetNodeAtCursor())
            {
                return {node:node,colors:[node.fg,node.bg]}
            }
        }
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
        var bg, fg, hex, ranges, voided, _408_21_, _412_28_, _415_34_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFLO0lBQU07O09BQ2hCLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksWUFBWjs7T0FDWSxXQUFQOztPQUNPLGFBQVo7O09BQ1ksV0FBZjtPQUFvQixrQkFBcEI7T0FBZ0MsZUFBaEM7T0FBeUMsWUFBekM7T0FBK0MsY0FBL0M7OztBQUNOLGVBQUQ7OzRCQUFhO2FBSVQsYUFBSSxRQUFRLFFBQVE7O1FBQWpCO1FBQVE7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0RBRVQsS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFNBQVM7UUFFVixLQUFDLGVBQWdCO1FBQ2pCLEtBQUMsZ0JBQWdCO1FBQ2pCLEtBQUMsWUFBZ0I7UUFDakIsS0FBQyxZQUFnQjtRQUNqQixLQUFDLFlBQWdCO1FBQ2pCLEtBQUMsVUFBaUIsTUFBTTtRQUN4QixLQUFDO1FBRUQsS0FBQztRQUNELEtBQUMsYUFBYTtRQUVkLEtBQUMsVUFBYSxZQUFZLEtBQUMsVUFBVSxLQUFDLFdBQVcsZUFBSzs7bUJBQU0sTUFBTSxVQUFVLEVBQUUsSUFBSTs7UUFDbEYsS0FBQyxVQUFhLFlBQVksS0FBQyxVQUFVLEtBQUMsV0FBVyxlQUFLOzttQkFBTSxNQUFNLFVBQVUsS0FBQyxJQUFJLEVBQUUsS0FBQzs7UUFDcEYsS0FBQyxVQUFhLFlBQVksS0FBQyxVQUFVLEtBQUMsV0FBVyxlQUFLOzttQkFBTSxNQUFNLFVBQVUsS0FBQyxJQUFJLEtBQUMsSUFBSTs7UUFFdEYsS0FBQyxVQUFhLFNBQVMsS0FBQyxVQUFVLEtBQUM7UUFDbkMsS0FBQyxZQUFhLFNBQVMsS0FBQyxVQUFVLEtBQUM7UUFDbkMsS0FBQyxXQUFhLFNBQVMsS0FBQyxVQUFVLEtBQUM7UUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
