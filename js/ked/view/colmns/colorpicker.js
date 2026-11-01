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
        this["hexAtCursor"] = this["hexAtCursor"].bind(this)
        this["colorAtSelection"] = this["colorAtSelection"].bind(this)
        this["show"] = this["show"].bind(this)
        this["emitChanged"] = this["emitChanged"].bind(this)
        this["rgbChanged"] = this["rgbChanged"].bind(this)
        this["sliderChanged"] = this["sliderChanged"].bind(this)
        this["setActiveColor"] = this["setActiveColor"].bind(this)
        this["setHex"] = this["setHex"].bind(this)
        this["setColorStateFromHex"] = this["setColorStateFromHex"].bind(this)
        this["syncInputs"] = this["syncInputs"].bind(this)
        this["syncSliders"] = this["syncSliders"].bind(this)
        this["syncRadio"] = this["syncRadio"].bind(this)
        this["syncAll"] = this["syncAll"].bind(this)
        this["backgroundHex"] = this["backgroundHex"].bind(this)
        this["foregroundHex"] = this["foregroundHex"].bind(this)
        this["colorHex"] = this["colorHex"].bind(this)
        this["v"] = this["v"].bind(this)
        this["s"] = this["s"].bind(this)
        this["h"] = this["h"].bind(this)
        this["hsv"] = this["hsv"].bind(this)
        this["hex"] = this["hex"].bind(this)
        this["rgb"] = this["rgb"].bind(this)
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
        var _87_37_

        return ((_87_37_=this.voided[idx]) != null ? _87_37_ : false)
    }

    colorpicker.prototype["voidActiveColor"] = function ()
    {
        this.voided[this.activeIndex()] = true
        this.syncRadio()
        return post.emit('redraw')
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

    colorpicker.prototype["setColorStateFromHex"] = function (idx, hex)
    {
        var rgb

        rgb = color.values(hex)
        if (_k_.empty(rgb))
        {
            return false
        }
        this.colorStates[idx] = rgb
        return true
    }

    colorpicker.prototype["setHex"] = function (hex)
    {
        if (_k_.empty(hex))
        {
            return
        }
        if (!this.setColorStateFromHex(this.activeIndex(),hex))
        {
            return
        }
        this.voided[this.activeIndex()] = false
        if (this.activeIndex() === 1)
        {
            return this.bgChanged = true
        }
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
        var bg, fg, found, _201_45_, _202_45_

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
                fg = ((_201_45_=this.colorAtSelection('fg')) != null ? _201_45_ : '#ff0000')
                bg = ((_202_45_=this.colorAtSelection('bg')) != null ? _202_45_ : '#000000')
                this.setColorStateFromHex(0,fg)
                this.setColorStateFromHex(1,bg)
            }
            else
            {
                this.setHex("#ffffff")
            }
        }
        this.syncAll()
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
        var bg, fg, hex, ranges, voided, _273_24_, _276_30_

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

            case 'delete':
            case 'backspace':
                return this.voidActiveColor()

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
        return false
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
        this.sat.draw()
        this.val.draw()
        this.red.draw()
        this.green.draw()
        this.blue.draw()
        return colorpicker.__super__.draw.call(this)
    }

    return colorpicker
})()

export default colorpicker;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL2NvbG9ycGlja2VyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRYSxVQUFBO0lBQVM7SUFBSztJQUFLOztPQUNWLFlBQVo7T0FBa0IsWUFBbEI7O09BQ1ksV0FBUDs7T0FDTyxXQUFmO09BQW9CLGtCQUFwQjtPQUFnQyxlQUFoQztPQUF5QyxZQUF6Qzs7O0FBSUUsZUFBVDs7NEJBQTZCO2FBRXpCLGFBQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29EQUVULEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxTQUFTO1FBRVYsS0FBQyxlQUFnQjtRQUNqQixLQUFDLGdCQUFnQjtRQUNqQixLQUFDLFlBQWdCO1FBQ2pCLEtBQUMsVUFBaUIsTUFBTTtRQUN4QixLQUFDO1FBRUQsS0FBQyxVQUFhLFlBQVksVUFBVSxLQUFDLFdBQVcsZUFBSzs7bUJBQU0sTUFBTSxVQUFVLEVBQUUsSUFBSTs7UUFDakYsS0FBQyxVQUFhLFlBQVksVUFBVSxLQUFDLFdBQVcsZUFBSzs7bUJBQU0sTUFBTSxVQUFVLEtBQUMsSUFBSSxFQUFFLEtBQUM7O1FBQ25GLEtBQUMsVUFBYSxZQUFZLFVBQVUsS0FBQyxXQUFXLGVBQUs7O21CQUFNLE1BQU0sVUFBVSxLQUFDLElBQUksS0FBQyxJQUFJOztRQUVyRixLQUFDLFVBQWEsU0FBUyxVQUFVLEtBQUM7UUFDbEMsS0FBQyxZQUFhLFNBQVMsVUFBVSxLQUFDO1FBQ2xDLEtBQUMsV0FBYSxTQUFTLFVBQVUsS0FBQztRQUVsQyxLQUFDLFlBQWEsTUFBTSxVQUFVLEtBQUM7UUFFL0IsS0FBQyxXQUFhLEtBQUMsSUFBSSxLQUFDLElBQUksS0FBQztRQUN6QixLQUFDLFVBQWEsS0FBQyxJQUFJLEtBQUMsTUFBTSxLQUFDO1FBQzNCLEtBQUMsYUFBYSxLQUFDLE1BQU0sS0FBQyxJQUFJLEtBQUMsSUFBSSxLQUFDLElBQUksS0FBQyxJQUFJLEtBQUMsTUFBTSxLQUFDO1FBRWpELEtBQUMsSUFBSSxZQUFjLE1BQU0sWUFBWTtRQUNyQyxLQUFDLE1BQU0sWUFBWSxNQUFNLFlBQVk7UUFDckMsS0FBQyxLQUFLLFlBQWEsTUFBTSxZQUFZO1FBRXJDLEtBQUMsTUFBTSxTQUFTLEtBQUssTUFBTSxZQUFZO1FBQ3ZDLEtBQUMsTUFBTSxTQUFTLEtBQUssTUFBTSxZQUFZO1FBRXZDLEtBQUMsSUFBSSxHQUFNLGNBQWMsS0FBQztRQUMxQixLQUFDLElBQUksR0FBTSxjQUFjLEtBQUM7UUFDMUIsS0FBQyxJQUFJLEdBQU0sY0FBYyxLQUFDO1FBRTFCLEtBQUMsSUFBSSxHQUFNLGNBQWMsS0FBQztRQUMxQixLQUFDLE1BQU0sR0FBSSxjQUFjLEtBQUM7UUFDMUIsS0FBQyxLQUFLLEdBQUssY0FBYyxLQUFDO1FBRTFCLEtBQUMsTUFBTSxHQUFHLGVBQWUsS0FBQztRQUUxQixLQUFDLFNBQVMsS0FBSyxNQUFNLFlBQVk7UUFDakMsS0FBQyxTQUFTLEtBQUssTUFBTSxZQUFZO1FBRWpDLEtBQUMsWUFBWTs7OzJCQUVqQix5QkFBWTs7Ozs0QkFFVSxLQUFDO2FBQVY7O1lBQUw7Z0JBQ0csS0FBSzs7Z0JBQ0osTUFBTSxLQUFDLFVBQVU7cUJBQ2QsS0FBSyxRQUFNLFNBQU4sUUFBTSxRQUFROzt3QkFDZixLQUFDLFVBQVUsUUFBTSxPQUFPOzt3QkFDdkIsS0FBQyxVQUFVLFFBQU0sT0FBTzsrQkFDdEI7Ozt1QkFDUjs7O2VBQ1Y7OzsyQkFFSjs7ZUFBYyxLQUFDLFdBQVc7OzsyQkFDMUI7O2VBQWMsS0FBQyxXQUFXOzs7MkJBRTFCOztlQUFnQixLQUFDLE1BQU07OzsyQkFFdkI7O2VBQXlCLEtBQUM7OzsyQkFFMUI7O2VBQXNCLEtBQUM7OzsyQkFFdkIsMEJBQWE7Ozs7eUJBQU8sS0FBQyxPQUFPLDBCQUFPOzs7MkJBRW5DOztRQUVJLEtBQUMsT0FBTyxLQUFDLGlCQUFpQjtRQUUxQixLQUFDO2VBRUQsS0FBSyxLQUFLOzs7MkJBRWQ7O2VBQVEsS0FBQyxZQUFZLEtBQUM7OzsyQkFDdEI7O2VBQVEsTUFBTSxJQUFJLEtBQUM7OzsyQkFDbkI7O2VBQVEsTUFBTSxTQUFTLEtBQUM7OzsyQkFDeEI7O2VBQU0sS0FBQyxNQUFNOzs7MkJBQ2I7O2VBQU0sS0FBQyxNQUFNOzs7MkJBQ2I7O2VBQU0sS0FBQyxNQUFNOzs7MkJBRWIsdUJBQVU7O2VBQVEsTUFBTSxJQUFJLEtBQUMsWUFBWTs7OzJCQUN6Qzs7ZUFBa0IsS0FBQyxTQUFTOzs7MkJBQzVCOztlQUFrQixLQUFDLFNBQVM7OzsyQkFFNUI7O1FBRUksS0FBQztRQUNELEtBQUM7ZUFDRCxLQUFDOzs7MkJBRUw7Ozs7UUFFSTt1QkFFSSxNQUFPLFNBQUksS0FBQyxZQUFZLDRCQUFiLEtBQUMsWUFBWSxlQUFiLEtBQUMsWUFBWTs7WUFDeEIsTUFBTSxLQUFDLFNBQVM7aUJBQzREOztnQkFBNUUsS0FBSyxNQUFNLE1BQU8sTUFBTSxPQUFPLEtBQU0sUUFBUSxLQUFDLE9BQU8sS0FBSyxTQUFTOzs7UUFFdkUsS0FBQyxNQUFNLFdBQVc7UUFDbEIsS0FBQyxNQUFNLFVBQVUsS0FBQztlQUNsQixLQUFDLE1BQU0sYUFBYSxLQUFLLFNBQVM7OzsyQkFFdEM7O1FBRUksS0FBQyxJQUFJLFNBQVMsS0FBQztRQUNmLEtBQUMsSUFBSSxTQUFTLEtBQUM7ZUFDZixLQUFDLElBQUksU0FBUyxLQUFDOzs7MkJBRW5COzs7O1FBQ0ksTUFBTSxLQUFDO2FBQ0gsSUFBSyxRQUFHOztZQUNSLEtBQUMsT0FBTyxHQUFHLFNBQVMsSUFBSTs7OzsyQkFFaEMsbUNBQXVCLEtBQUk7Ozs7UUFFdkIsTUFBTSxNQUFNLE9BQU87c0JBQ0Y7O21CQUFmOztRQUNGLEtBQUMsWUFBWSxPQUFPO2VBQ3BCOzs7MkJBRUoscUJBQVE7O3NCQUVPOzs7O2FBQ0YsS0FBQyxxQkFBcUIsS0FBQyxjQUFjOzs7O1FBRTlDLEtBQUMsT0FBTyxLQUFDLGlCQUFpQjtZQUVMLEtBQUMsa0JBQWlCOzttQkFBdkMsS0FBQyxZQUFZOzs7OzJCQUVqQiw2QkFBZ0I7O2VBRVosS0FBQyxNQUFNLHVCQUFtQixFQUFFLFdBQU07OzsyQkFFdEM7O1FBRUksS0FBQyxZQUFZLEtBQUMsaUJBQWlCLE1BQU0sVUFBVSxLQUFDLElBQUksV0FBVyxLQUFDLElBQUksV0FBVyxLQUFDLElBQUk7UUFFcEYsS0FBQztRQUNELEtBQUM7ZUFDRCxLQUFDOzs7MkJBRUw7O1FBRUksS0FBQyxZQUFZLEtBQUMsa0JBQWtCLEtBQUMsSUFBSSxXQUFXLEtBQUMsTUFBTSxXQUFXLEtBQUMsS0FBSztRQUV4RSxLQUFDO1FBQ0QsS0FBQztlQUNELEtBQUM7OzsyQkFFTDs7UUFFSSxLQUFDLE9BQU8sS0FBQyxpQkFBaUI7WUFDTCxLQUFDLGtCQUFpQjs7WUFBdkMsS0FBQyxZQUFZOztRQUViLEtBQUssS0FBSyxxQkFBcUIsS0FBQztlQUNoQyxLQUFLLEtBQUs7OzsyQkFFZCxtQkFBTTs7OztRQUVGLEtBQUMsWUFBZTtRQUNoQixLQUFDLFVBQWdCLE1BQU07UUFDdkIsS0FBQztRQUNELEtBQUMsTUFBTSxTQUFTO2FBRWI7O1lBQ0MsS0FBQyxPQUFPOzs7O2dCQUVMLFFBQVEsS0FBQzs7Z0JBQ1IsTUFBTSxNQUFNO2dCQUNaLEtBQUMsZUFBZTtnQkFDaEIsS0FBQyxPQUFPO2dCQUNSLEtBQUMsYUFBYSxPQUFPLEtBQUM7O2dDQUVSLEtBQUMsT0FBTyxNQUFNLEVBQUU7O2dCQUU5QixLQUFDLGlCQUFnQixrQkFBYSxLQUFDLE9BQU8sTUFBTSxFQUFFO2dCQUU5QyxnQkFBSyxLQUFDLGlCQUFpQiw0QkFBUTtnQkFDL0IsZ0JBQUssS0FBQyxpQkFBaUIsNEJBQVE7Z0JBRS9CLEtBQUMscUJBQXFCLEVBQUU7Z0JBQ3hCLEtBQUMscUJBQXFCLEVBQUU7Ozs7Z0JBR3hCLEtBQUMsT0FBTzs7O1FBRWhCLEtBQUM7O2VBR0QsS0FBQyxJQUFJOzs7MkJBRVQsK0JBQWtCOzs7O1FBRWQsUUFBUSxLQUFDLE9BQU8sTUFBTSxXQUFXLEtBQUMsT0FBTyxNQUFNLGFBQWE7YUFFakQ7O21CQUFUOzs0QkFFUyxLQUFDLE9BQU8sTUFBTSxFQUFFOzs7WUFBdkI7Z0JBQ0csSUFBSSxLQUFDLE9BQU8sTUFBTSxZQUFZLElBQUksR0FBRyxJQUFJLElBQUk7O3VCQUMxQzs7O2VBQ1Y7OzsyQkFFSjs7OztRQUVJLFFBQVEsS0FBQyxPQUFPO1FBQ2hCLEtBQVEsTUFBTTtRQUNkLFFBQVEsTUFBTSxFQUFFO2tCQUNSLElBQVAsWUFBRTs7WUFFRSxJQUFJLEtBQUssS0FBSyxNQUFNOzs7O1FBRXpCLE9BQU8sTUFBTTtzQkFDRjs7OztRQUVYLE9BQU8sTUFBTTtRQUNiLE1BQU8sS0FBSyx3QkFBd0IsTUFBTTtzQkFFakMsbUJBQWM7O2dCQUNoQixJQUFJLEtBQUssVUFBVyxLQUFLLElBQUksV0FBSyxHQUFJLElBQUUsUUFBTzs7Z0JBQzlDLE9BQU8sS0FBSyxVQUFVLE9BQU8sSUFBRSxFQUFFO2dCQUNqQyxNQUFPLEtBQUssd0JBQXdCLE9BQU8sSUFBRSxFQUFFOzs7c0JBRTVDLG1CQUFjOzs7O3NCQUNkLE1BQU0sT0FBTzs7OztRQUV4QixPQUFPO1lBRUosSUFBSSxLQUFLLEtBQU0sS0FBSyxJQUFJLFdBQUssSUFBSSxLQUFHLFVBQUksSUFBSSxrQkFBSixJQUFJLGNBQVE7O1lBQ25ELE9BQU8sTUFBTTtZQUNiLE9BQVEsSUFBSSxLQUFHLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJOztnQkFFdkMsS0FBTSxLQUNOLE1BQU87OzsyQkFFWDs7OztZQUVTLEtBQUM7Ozs7OzRCQUlPLEtBQUM7OztZQUFWO1lBQ0EsTUFBTSxNQUFNOztRQUVoQixLQUFLLEtBQUssUUFBUTtlQUNsQixLQUFLLEtBQUs7OzsyQkFFZDs7OztRQUVJLE1BQU0sS0FBQzthQUNKLEtBQUMseUJBQWtCLFFBQU8sS0FBQyxhQUFhOztZQUN2QyxLQUFDLGFBQWE7O2tCQUVWLEtBQUM7O1lBRUwsU0FBUyxLQUFDLGNBQWM7WUFFeEIsS0FBQyxnQkFBZ0I7WUFFakIsS0FBSyxLQUFDO1lBQ04sS0FBSztnQkFFb0IsS0FBQzs7Z0JBQTFCLEtBQUssS0FBQzs7WUFFTjtnQkFDb0IsS0FBQyxZQUFZOztnQkFBakMsT0FBTyxLQUFLOztnQkFDUSxLQUFDLFlBQVk7O2dCQUFqQyxPQUFPLEtBQUs7O1lBRVosS0FBQyxPQUFPLE1BQU0sbUJBQW1CLE9BQU8sR0FBRyxHQUFHOztlQUVsRCxLQUFDOzs7MkJBRUwsMkJBQWM7Ozs7c0JBRUM7Ozs7c0JBQ0EsS0FBQzs7OztrQkFFQSxLQUFDLGFBQWEsT0FBekIsYUFBRyxZQUFFOztRQUVOLFFBQVEsS0FBQyxPQUFPO1FBQ2hCLFFBQVEsTUFBTSxFQUFFLE1BQU07WUFFakIsSUFBSSxLQUFLLEtBQUssTUFBTTs7OztRQUV6QixPQUFPO1lBQ2EsS0FBQyxhQUFhLEtBQUssT0FBTSxPQUFRLEtBQUssT0FBTTs7WUFBaEUsT0FBTyxXQUFLOztRQUVaLE1BQU0sUUFBUSxNQUFNLEdBQUcsSUFBSSxLQUFHLElBQUksS0FBSztRQUN2QyxNQUFNLFNBQVM7ZUFFZixLQUFDLGVBQWU7OzsyQkFFcEI7O1FBRUksS0FBSyxLQUFLO2VBQ1YsS0FBQzs7OzJCQUVMLHNCQUFTOzs7O1lBRUEsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsTUFBTSxLQUFDLE1BQU0sUUFBUTthQUFxQixjQUFBLElBQUs7O21CQUFaOzs0QkFFckIsS0FBQzs7O1lBQVg7WUFDQSxNQUFNLE9BQU8sUUFBUTtpQkFBaUIsY0FBQSxJQUFLOzt1QkFBWjs7OzZCQUV0QixLQUFDOzs7WUFBVjtZQUNBLE1BQU0sTUFBTSxRQUFRO2lCQUFrQixjQUFBLElBQUs7O3VCQUFaOzs7dURBRTdCOzs7MkJBRVYsc0JBQVM7Ozs7WUFFQSxLQUFDLFlBQVksS0FBQzs7Ozs0QkFFTCxLQUFDOzs7WUFBWDtZQUNBLE1BQU0sT0FBTyxRQUFRO2lCQUFpQixjQUFBLElBQUs7O3VCQUFaOzs7NkJBRXRCLEtBQUM7OztZQUFWO1lBQ0EsTUFBTSxNQUFNLFFBQVE7aUJBQWtCLGNBQUEsSUFBSzs7dUJBQVo7OztZQUVoQyxLQUFDLE1BQU0sY0FBYzs7b0JBQ2xCLE9BQU87Ozs7MkJBRWpCLG9CQUFPLEtBQUk7O1lBRUksS0FBQzs7bUJBQVY7O2dCQUVLLE1BQU07O2lCQUNUO2lCQUFNO3VCQUFjLEtBQUM7O2lCQUNyQjtpQkFBSTt1QkFBZ0IsS0FBQzs7aUJBQ3JCO3VCQUFvQixLQUFDOztpQkFDckI7dUJBQW9CLEtBQUM7O2lCQUNyQjtpQkFDQTt1QkFBb0IsS0FBQzs7OztZQUdmLEtBQUMsSUFBTyxNQUFNLElBQUk7O21CQUExQjs7WUFDUSxLQUFDLE1BQU8sTUFBTSxJQUFJOzttQkFBMUI7O1lBQ1EsS0FBQyxLQUFPLE1BQU0sSUFBSTs7bUJBQTFCOztZQUVRLEtBQUMsSUFBTyxNQUFNLElBQUk7O21CQUExQjs7WUFDUSxLQUFDLElBQU8sTUFBTSxJQUFJOzttQkFBMUI7O1lBQ1EsS0FBQyxJQUFPLE1BQU0sSUFBSTs7bUJBQTFCOztZQUVRLEtBQUMsTUFBTyxNQUFNLElBQUk7O21CQUExQjs7ZUFFRjs7OzJCQUVKLHFCQUFRLEdBQUUsR0FBRSxHQUFFOzsrQ0FFSixFQUFFLEVBQUUsRUFBRTs7OztRQUVaLEtBQUMsTUFBTSxPQUFRLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFO1FBRTNCLEtBQUMsSUFBSSxPQUFVLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFO1FBQzNCLEtBQUMsSUFBSSxPQUFVLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFO1FBQzNCLEtBQUMsSUFBSSxPQUFVLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFO1FBRTNCLGFBQVMsRUFBRSxJQUFFO1FBQ2IsS0FBSztRQUVMLEtBQUMsSUFBSSxPQUFTLElBQUUsRUFBaUIsSUFBRSxFQUFFLEdBQUc7UUFDeEMsS0FBQyxNQUFNLE9BQU8sSUFBRSxjQUFPLEtBQUcsTUFBSSxHQUFHLElBQUUsRUFBRSxHQUFHO2VBQ3hDLEtBQUMsS0FBSyxPQUFRLElBQUUsSUFBRSxLQUFHLEdBQVksSUFBRSxFQUFFLEdBQUc7OzsyQkFFNUM7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssS0FBQyxNQUFNO1FBRTNDLEtBQUMsTUFBTTtRQUVQLEtBQUMsSUFBSTtRQUNMLEtBQUMsSUFBSTtRQUNMLEtBQUMsSUFBSTtRQUVMLEtBQUMsSUFBSTtRQUNMLEtBQUMsTUFBTTtRQUNQLEtBQUMsS0FBSzs7OztXQW5ZTDs7O2VBdVlGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/colorpicker.kode
