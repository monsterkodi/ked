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
        var _74_37_

        return ((_74_37_=this.voided[idx]) != null ? _74_37_ : false)
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
        var channel, hex, idx, _239_27_

        if (!(this.sheetNode != null))
        {
            return
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
        var cells, state, _252_30_, _254_41_, _254_87_

        state = this.editor.state
        if (!(state.rectree != null))
        {
            return
        }
        cells = {cols:(((_254_41_=state.rectreeCols) != null ? _254_41_ : this.editor.cells.cols)),rows:(((_254_87_=state.rectreeRows) != null ? _254_87_ : this.editor.cells.rows))}
        return state.renderSheet(state.rectree,cells,state.mainCursor(),{silent:true})
    }

    colorpicker.prototype["show"] = function (hexl, opt = {focus:true})
    {
        var found, hex, idx, syntax, _263_33_, _264_35_, _267_25_, _274_29_, _287_49_, _288_49_

        this.bgChanged = false
        this.voided = [false,false]
        this.colorStates = []
        this.sheetNode = ((_263_33_=opt.node) != null ? _263_33_ : null)
        this.radio.active = ((_264_35_=opt.select) != null ? _264_35_ : 0)
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
                this.setHex((((_287_49_=this.colorAtSelection('fg')) != null ? _287_49_ : '#ff0000')),0)
                this.setHex((((_288_49_=this.colorAtSelection('bg')) != null ? _288_49_ : '#000000')),1)
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
        var state, _346_35_

        state = this.editor.state
        if (!(state.rectree != null))
        {
            return null
        }
        return layout.nodeForPos(this.editor.cells,state.rectree,state.mainCursor())
    }

    colorpicker.prototype["hexAtCursor"] = function ()
    {
        var line, lines, mc, node, rng, state, text, word, x, y, _354_24_

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
        var bg, fg, hex, ranges, voided, _401_21_, _405_28_, _408_34_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFLO0lBQU07O09BQ2hCLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksWUFBWjs7T0FDWSxXQUFQOztPQUNPLGFBQVo7O09BQ1ksV0FBZjtPQUFvQixrQkFBcEI7T0FBZ0MsZUFBaEM7T0FBeUMsWUFBekM7T0FBK0MsY0FBL0M7OztBQUNOLGVBQUQ7OzRCQUFhO2FBSVQsYUFBSSxRQUFRLFFBQVE7O1FBQWpCO1FBQVE7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0RBRVQsS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFNBQVM7UUFFVixLQUFDLGVBQWdCO1FBQ2pCLEtBQUMsZ0JBQWdCO1FBQ2pCLEtBQUMsWUFBZ0I7UUFDakIsS0FBQyxZQUFnQjtRQUNqQixLQUFDLFVBQWlCLE1BQU07UUFDeEIsS0FBQztRQUVELEtBQUM7UUFDRCxLQUFDLGFBQWE7UUFFZCxLQUFDLFVBQWEsWUFBWSxLQUFDLFVBQVUsS0FBQyxXQUFXLGVBQUs7O21CQUFNLE1BQU0sVUFBVSxFQUFFLElBQUk7O1FBQ2xGLEtBQUMsVUFBYSxZQUFZLEtBQUMsVUFBVSxLQUFDLFdBQVcsZUFBSzs7bUJBQU0sTUFBTSxVQUFVLEtBQUMsSUFBSSxFQUFFLEtBQUM7O1FBQ3BGLEtBQUMsVUFBYSxZQUFZLEtBQUMsVUFBVSxLQUFDLFdBQVcsZUFBSzs7bUJBQU0sTUFBTSxVQUFVLEtBQUMsSUFBSSxLQUFDLElBQUk7O1FBRXRGLEtBQUMsVUFBYSxTQUFTLEtBQUMsVUFBVSxLQUFDO1FBQ25DLEtBQUMsWUFBYSxTQUFTLEtBQUMsVUFBVSxLQUFDO1FBQ25DLEtBQUMsV0FBYSxTQUFTLEtBQUMsVUFBVSxLQUFDO1FBRW5DLEtBQUMsWUFBYSxNQUFN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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
