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
        ret = this.uniko.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.colorpicker.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBUztJQUFLO0lBQU07SUFBSzs7T0FDaEIsWUFBWjtPQUFrQixZQUFsQjs7T0FDWSxXQUFQOztPQUNPLFdBQWY7T0FBb0IsV0FBcEI7O09BQ2UsY0FBQTtPQUFRLGtCQUFBO09BQVksWUFBQTs7O0FBRWpDLFVBQVQ7O3VCQUF3QjthQUVwQixRQUFHLFFBQVEsUUFBTzs7UUFBUjs7Ozs7Ozs7Ozs7Ozs7OytDQUVBLE9BQU8sU0FBUztRQUV0QixLQUFDLFlBQWdCO1FBQ2pCLEtBQUMsU0FBZ0I7UUFDakIsS0FBQyxlQUFnQjtRQUNqQixLQUFDLGdCQUFnQjtRQUVqQixLQUFDLGNBQWM7UUFFZixLQUFDLFdBQWtCLEtBQVksVUFBa0IsS0FBQztRQUNsRCxLQUFDLGNBQWtCLFFBQW1CLEtBQUMsVUFBVSxLQUFDLGdCQUFnQjtRQUNsRSxLQUFDLGtCQUFrQixZQUFZLFVBQWtCLEtBQUM7UUFDbEQsS0FBQyxZQUFrQixNQUFZLE9BQU8sS0FBQyxVQUFVLEtBQUM7UUFFbEQsS0FBQyxLQUFLLFlBQVk7UUFFbEIsS0FBQyxRQUFRLFNBQVMsS0FBZ0IsTUFBTSxRQUFRO1FBQ2hELEtBQUMsUUFBUSxTQUFTLFFBQWdCLEtBQUMsUUFBUSxNQUFNO1FBQ2pELEtBQUMsUUFBUSxTQUFTLGNBQWdCLEtBQUMsUUFBUSxNQUFNO1FBQ2pELEtBQUMsUUFBUSxTQUFTLGVBQWdCLEtBQUMsUUFBUSxNQUFNO1FBQ2pELEtBQUMsUUFBUSxPQUFPLFNBQVMsS0FBUyxLQUFDLFFBQVEsTUFBTTtRQUVqRCxLQUFDLEtBQVEsU0FBUyxLQUFnQixLQUFDLFFBQVEsTUFBTTtRQUVqRCxLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztR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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funcol.kode
