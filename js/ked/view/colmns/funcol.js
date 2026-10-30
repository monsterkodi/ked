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
        var found, _85_64_

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

    funcol.prototype["onColorPickerSubmit"] = function (hex)
    {
        var bg, fg, ranges, _92_24_, _98_30_

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
            this.editor.state.setColorsForRanges(ranges,fg,bg)
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
        var ph

        ph = (this.colorpicker.visible() ? _k_.min(this.colorpicker.height,h - 1) : 0)
        if (ph < 1)
        {
            ph = 0
        }
        this.funtree.layout(x,y,w,h - ph)
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
        if (this.hidden() || this.collapsed() || !this.active)
        {
            return
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9mdW5jb2wua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTtJQUFLO0lBQU07SUFBSzs7T0FDaEIsWUFBVDtPQUFlLFlBQWY7O09BQ1ksV0FBUDs7T0FDSSxXQUFaO09BQWlCLFdBQWpCOztPQUNZLGNBQUE7T0FBUSxrQkFBQTs7O0FBRWxCLFVBQVQ7O3VCQUF3QjthQUVwQixRQUFHLFFBQVEsUUFBTzs7UUFBUjs7Ozs7Ozs7Ozs7Ozs7K0NBRUEsT0FBTyxTQUFTO1FBRXRCLEtBQUMsWUFBWTtRQUNiLEtBQUMsU0FBWTtRQUNiLEtBQUMsZUFBZ0I7UUFDakIsS0FBQyxnQkFBZ0I7UUFFakIsS0FBQyxjQUFjO1FBRWYsS0FBQyxXQUFjLEtBQVEsVUFBVyxLQUFDO1FBQ25DLEtBQUMsY0FBYyxRQUFRLEtBQUMsVUFBVSxLQUFDLGdCQUFnQjtRQUNuRCxLQUFDLGtCQUFrQixZQUFZLFVBQVUsS0FBQztRQUUxQyxLQUFDLEtBQUssWUFBWTtRQUVsQixLQUFDLFFBQVEsU0FBUyxLQUFnQixNQUFNLFFBQVE7UUFDaEQsS0FBQyxRQUFRLFNBQVMsUUFBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLFNBQVMsY0FBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLFNBQVMsZUFBZ0IsS0FBQyxRQUFRLE1BQU07UUFDakQsS0FBQyxRQUFRLE9BQU8sU0FBUyxLQUFTLEtBQUMsUUFBUSxNQUFNO1FBRWpELEtBQUMsS0FBUSxTQUFTLEtBQWdCLEtBQUMsUUFBUSxNQUFNO1FBRWpELEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRzs7bUJBQW1CLEtBQUMsUUFBUTs7UUFDcEMsS0FBSyxHQUFHLG1CQUFtQixLQUFDO1FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funcol.kode
