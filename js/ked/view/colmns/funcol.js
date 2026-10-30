var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var funcol

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let kseg = kxk.kseg
let kutil = kxk.kutil

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import belt from "../../edit/tool/belt.js"

import view from "../base/view.js"
import knob from "../base/knob.js"

import funtree from "./funtree.js"
import colorpicker from "./colorpicker.js"
import uniko from "./uniko.js"


funcol = (function ()
{
    _k_.extend(funcol, view)
    function funcol (screen, editor, features)
    {
        this.editor = editor
    
        this["onKey"] = this["onKey"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onFuncolToggle"] = this["onFuncolToggle"].bind(this)
        this["onFuncolResize"] = this["onFuncolResize"].bind(this)
        this["onContext"] = this["onContext"].bind(this)
        this["replaceColor"] = this["replaceColor"].bind(this)
        this["colorAtCursor"] = this["colorAtCursor"].bind(this)
        this["colorForSelection"] = this["colorForSelection"].bind(this)
        this["onColorPickerSubmit"] = this["onColorPickerSubmit"].bind(this)
        this["onUnikoShow"] = this["onUnikoShow"].bind(this)
        this["onColorPickerShow"] = this["onColorPickerShow"].bind(this)
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        funcol.__super__.constructor.call(this,screen,'funcol',features)
        this.isVisible = false
        this.active = false
        this.colorReplace = null
        this.colorDecorate = null
        this.pointerType = 'pointer'
        this.knob = new knob(screen,`${this.name}_knob`)
        this.funtree = new funtree(this.editor,`${this.name}_funtree`,['scrllr'])
        this.colorpicker = new colorpicker(screen,`${this.name}_colorpicker`)
        this.uniko = new uniko(screen,this.editor,`${this.name}_uniko`)
        this.knob.frameSide = 'left'
        this.funtree.setColor('bg',theme.funtree.bg)
        this.funtree.setColor('empty',this.funtree.color.bg)
        this.funtree.setColor('cursor_main',this.funtree.color.bg)
        this.funtree.setColor('cursor_empty',this.funtree.color.bg)
        this.funtree.scroll.setColor('bg',this.funtree.color.bg)
        this.knob.setColor('bg',this.funtree.color.bg)
        post.on('funcol.resize',this.onFuncolResize)
        post.on('funcol.toggle',this.onFuncolToggle)
        post.on('session.merge',this.onSessionMerge)
        post.on('funcol.focus',(function ()
        {
            return this.funtree.grabFocus()
        }).bind(this))
        post.on('colorpicker.show',this.onColorPickerShow)
        post.on('colorpicker.submit',this.onColorPickerSubmit)
        post.on('uniko.show',this.onUnikoShow)
    }

    funcol.prototype["onSessionMerge"] = function (recent)
    {
        if (_k_.empty(recent.funcol))
        {
            return
        }
        if (recent.funcol.active)
        {
            this.active = true
            this.show()
        }
        return ked_session.set('funcol',recent.funcol)
    }

    funcol.prototype["onColorPickerShow"] = function (hex)
    {
        var found, _87_64_

        this.active = true
        if (this.hidden())
        {
            this.show()
        }
        this.colorReplace = null
        this.colorDecorate = null
        if (_k_.empty(hex))
        {
            if (found = this.colorAtCursor())
            {
                hex = found.text
                this.colorReplace = found
            }
            else if (!_k_.empty(this.editor.state.s.selections))
            {
                this.colorDecorate = {ranges:_k_.clone(this.editor.state.s.selections)}
                this.colorpicker.showSelection(this.colorForSelection('fg'),this.colorForSelection('bg'))
                ked_session.set('funcol▸active',this.active)
                post.emit('redraw')
                return
            }
        }
        this.colorpicker.show(hex)
        if ((this.colorReplace != null))
        {
            this.colorReplace.from = this.colorpicker.hex()
        }
        ked_session.set('funcol▸active',this.active)
        return post.emit('redraw')
    }

    funcol.prototype["onUnikoShow"] = function ()
    {
        this.active = true
        if (this.hidden())
        {
            this.show()
        }
        this.uniko.show()
        ked_session.set('funcol▸active',this.active)
        return post.emit('redraw')
    }

    funcol.prototype["onColorPickerSubmit"] = function (hex)
    {
        var bg, fg, ranges, voided, _104_24_, _110_30_

        if ((this.colorReplace != null))
        {
            if (hex === this.colorReplace.from)
            {
                this.colorReplace = null
                return
            }
            return this.replaceColor(hex)
        }
        else if ((this.colorDecorate != null))
        {
            ranges = this.colorDecorate.ranges
            this.colorDecorate = null
            fg = this.colorpicker.foregroundHex()
            bg = null
            if (this.colorpicker.backgroundChanged())
            {
                bg = this.colorpicker.backgroundHex()
            }
            voided = []
            if (this.colorpicker.colorVoided(0))
            {
                voided.push('fg')
            }
            if (this.colorpicker.colorVoided(1))
            {
                voided.push('bg')
            }
            this.editor.state.setColorsForRanges(ranges,fg,bg,voided)
            return post.emit('redraw')
        }
    }

    funcol.prototype["colorForSelection"] = function (layer)
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

    funcol.prototype["colorAtCursor"] = function ()
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

    funcol.prototype["replaceColor"] = function (hex)
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

    funcol.prototype["layout"] = function (x, y, w, h)
    {
        var ph, uh

        ph = (this.colorpicker.visible() ? _k_.min(this.colorpicker.height,h - 1) : 0)
        if (ph < 1)
        {
            ph = 0
        }
        uh = (this.uniko.visible() ? _k_.min(this.uniko.height,h - ph - 1) : 0)
        if (uh < 1)
        {
            uh = 0
        }
        this.funtree.layout(x,y,w,h - ph - uh)
        if (uh)
        {
            this.uniko.layout(x,y + h - ph - uh,w,uh)
        }
        if (ph)
        {
            this.colorpicker.layout(x,y + h - ph,w,ph)
        }
        this.knob.layout(x,y,1,h)
        return funcol.__super__.layout.call(this,x,y,w,h)
    }

    funcol.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        this.cells.fill_rect(0,1,-1,-1,' ',null,theme.funtree.bg)
        this.cells.fill_rect(0,0,-1,0,' ',null,theme.gutter.bg)
        this.funtree.draw()
        if (this.uniko.visible())
        {
            this.uniko.draw()
        }
        if (this.colorpicker.visible())
        {
            this.colorpicker.draw()
        }
        this.knob.draw()
        return funcol.__super__.draw.call(this)
    }

    funcol.prototype["onContext"] = function (event)
    {
        if (!this.hover)
        {
            return
        }
        console.log(`funcol.onContext: ${this.hover}`,event)
    }

    funcol.prototype["onFuncolResize"] = function ()
    {
        return this.knob.doDrag = true
    }

    funcol.prototype["onFuncolToggle"] = function ()
    {
        var cols

        if (!(this.visible() && this.collapsed()))
        {
            this.toggle()
        }
        this.active = this.visible()
        ked_session.set('funcol▸active',this.active)
        cols = _k_.max(16,parseInt(this.cells.screen.cols / 6))
        return post.emit('view.size',this.name,'left',((this.hidden() ? -this.cells.cols : cols - this.cells.cols)))
    }

    funcol.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        ret = funcol.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.knob.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        if (this.uniko.visible())
        {
            ret = this.uniko.onMouse(event)
            if ((ret != null ? ret.redraw : undefined))
            {
                return ret
            }
        }
        if (this.colorpicker.visible())
        {
            ret = this.colorpicker.onMouse(event)
            if ((ret != null ? ret.redraw : undefined))
            {
                return ret
            }
        }
        ret = this.funtree.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
    }

    funcol.prototype["onWheel"] = function (event)
    {
        var ret

        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        if (this.uniko.visible())
        {
            if (ret = this.uniko.onWheel(event))
            {
                return ret
            }
        }
        if (this.colorpicker.visible())
        {
            if (ret = this.colorpicker.onWheel(event))
            {
                return ret
            }
        }
        return this.funtree.onWheel(event)
    }

    funcol.prototype["onKey"] = function (key, event)
    {
        var ret

        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
        }
        if (this.uniko.visible())
        {
            if (ret = this.uniko.onKey(key,event))
            {
                return ret
            }
        }
        if (this.colorpicker.visible() && this.colorpicker.hasFocus())
        {
            return this.colorpicker.onKey(key,event)
        }
        if (!this.funtree.hasFocus())
        {
            return
        }
        return this.funtree.onKey(key,event)
    }

    return funcol
})()

export default funcol;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTtJQUFLO0lBQU07SUFBSzs7T0FDaEIsWUFBVDtPQUFlLFlBQWY7O09BQ1ksV0FBUDs7T0FDSSxXQUFaO09BQWlCLFdBQWpCOztPQUNZLGNBQUE7T0FBUSxrQkFBQTtPQUFZLFlBQUE7OztBQUU5QixVQUFUOzt1QkFBd0I7YUFFcEIsUUFBRyxRQUFRLFFBQU87O1FBQVI7Ozs7Ozs7Ozs7Ozs7OzsrQ0FFQSxPQUFPLFNBQVM7UUFFdEIsS0FBQyxZQUFZO1FBQ2IsS0FBQyxTQUFZO1FBQ2IsS0FBQyxlQUFnQjtRQUNqQixLQUFDLGdCQUFnQjtRQUVqQixLQUFDLGNBQWM7UUFFZixLQUFDLFdBQWMsS0FBUSxVQUFXLEtBQUM7UUFDbkMsS0FBQyxjQUFjLFFBQVEsS0FBQyxVQUFVLEtBQUMsZ0JBQWdCO1FBQ25ELEtBQUMsa0JBQWtCLFlBQVksVUFBVSxLQUFDO1FBQzFDLEtBQUMsWUFBa0IsTUFBWSxPQUFPLEtBQUMsVUFBVSxLQUFDO1FBRWxELEtBQUMsS0FBSyxZQUFZO1FBRWxCLEtBQUMsUUFBUSxTQUFTLEtBQWdCLE1BQU0sUUFBUTtRQUNoRCxLQUFDLFFBQVEsU0FBUyxRQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsU0FBUyxjQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsU0FBUyxlQUFnQixLQUFDLFFBQVEsTUFBTTtRQUNqRCxLQUFDLFFBQVEsT0FBTyxTQUFTLEtBQVMsS0FBQyxRQUFRLE1BQU07UUFFakQsS0FBQyxLQUFRLFNBQVMsS0FBZ0IsS0FBQyxRQUFRLE1BQU07UUFFakQsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxH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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funcol.kode
