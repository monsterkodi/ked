var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var titlenovim

import kxk from "../../../kxk.js"
let slash = kxk.slash
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"
import input from "../base/input.js"


titlenovim = (function ()
{
    _k_.extend(titlenovim, view)
    function titlenovim (screen, name, stateName)
    {
        this["layout"] = this["layout"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onError"] = this["onError"].bind(this)
        this["onExecute"] = this["onExecute"].bind(this)
        this["onPending"] = this["onPending"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onExStart"] = this["onExStart"].bind(this)
        titlenovim.__super__.constructor.call(this,screen,name)
        this.stateName = stateName
        this.input = new input(this.screen,`${name}_input`)
        this.input.on('action',this.onInputAction)
        this.input.hide()
        this.setColor('bg',theme.novim.bg)
        this.setColor('fg',theme.novim.text)
        this.setColor('empty',theme.title.empty)
        this.input.setColor('bg',theme.novim.pending.bg)
        this.input.setColor('bg_blur',theme.novim.pending.bg)
        this.input.setColor('bg_focus',theme.novim.pending.bg)
        this.input.setColor('empty',theme.novim.pending.bg)
        this.pointerType = 'default'
        this.novimText = 'novim'
        post.on('novim.execute',this.onExecute)
        post.on('novim.pending',this.onPending)
        post.on('novim.error',this.onError)
        post.on('novim.ex.start',this.onExStart)
    }

    titlenovim.prototype["onExStart"] = function (start)
    {
        if (start.state !== this.stateName)
        {
            return
        }
        this.input.set(start.text)
        this.input.state.moveCursors('eol')
        this.setColor('bg',theme.novim.pending.bg)
        this.setColor('fg',theme.novim.pending.fg)
        this.input.show()
        this.input.grabFocus()
        this.layoutInput()
        post.emit('redraw')
        return true
    }

    titlenovim.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
            case 'cancel':
                this.input.hide()
                this.novimText = ''
                this.emit('action',action,text)
                break
            case 'change':
                this.emit('action','change',text)
                break
        }

        return true
    }

    titlenovim.prototype["onPending"] = function (pending)
    {
        var t, _71_24_, _73_27_, _74_26_, _75_28_, _76_30_

        this.setColor('bg',theme.novim.pending.bg)
        this.setColor('fg',theme.novim.pending.fg)
        t = ((_71_24_=pending.op) != null ? _71_24_ : '')
        t += ' '
        t += ((_73_27_=pending.count) != null ? _73_27_ : '')
        t += ((_74_26_=pending.area) != null ? _74_26_ : '')
        t += ((_75_28_=pending.prefix) != null ? _75_28_ : '')
        t += ((_76_30_=pending.register) != null ? _76_30_ : '')
        return this.novimText = t
    }

    titlenovim.prototype["onExecute"] = function (execute)
    {
        var t

        this.setColor('bg',theme.novim.execute.bg)
        this.setColor('fg',theme.novim.execute.fg)
        t = execute.operator
        if (execute.count)
        {
            t += ' ' + execute.count
        }
        if (execute.motion)
        {
            if (execute.motion.kind === 'textObject')
            {
                if (execute.motion.area)
                {
                    t += ' ' + execute.motion.area
                }
                if (execute.motion.target)
                {
                    t += ' ' + execute.motion.target
                }
            }
            else
            {
                t += ' ' + execute.motion.kind
            }
        }
        return this.novimText = t
    }

    titlenovim.prototype["onError"] = function (err)
    {
        this.setColor('bg',theme.novim.error.bg)
        this.setColor('fg',theme.novim.error.fg)
        return this.novimText = err
    }

    titlenovim.prototype["onMouse"] = function (event)
    {
        if (!this.input.visible())
        {
            return false
        }
        return this.input.onMouse(event)
    }

    titlenovim.prototype["onKey"] = function (key, event)
    {
        return this.input.onKey(key,event)
    }

    titlenovim.prototype["layout"] = function (x, y, w, h)
    {
        titlenovim.__super__.layout.call(this,x,y,w,h)
    
        return this.layoutInput()
    }

    titlenovim.prototype["layoutInput"] = function ()
    {
        return this.input.layout(this.cells.x + 1,this.cells.y,_k_.max(0,this.cells.cols - 2),1)
    }

    titlenovim.prototype["draw"] = function (x, w)
    {
        if (this.hidden())
        {
            return
        }
        titlenovim.__super__.draw.call(this)
        this.layout(x,0,w,1)
        if (this.input.visible())
        {
            this.layoutInput()
            this.input.draw()
            return this.drawFrame()
        }
        else
        {
            return this.drawText()
        }
    }

    titlenovim.prototype["drawFrame"] = function ()
    {
        var bg, fg

        fg = this.color.fg
        bg = this.color.empty
        this.cells.set(0,0,'',fg,bg)
        return this.cells.set(this.cells.cols - 1,0,'',fg,bg)
    }

    titlenovim.prototype["drawText"] = function ()
    {
        var bg, ch, fg, xo

        this.rounded = `${_k_.rpad(this.cells.cols - 2,this.novimText)}`
        bg = this.color.bg
        fg = this.color.fg
        var list = _k_.list(this.rounded)
        for (xo = 0; xo < list.length; xo++)
        {
            ch = list[xo]
            if (_k_.in(ch,''))
            {
                this.cells.set(xo,0,ch,bg,this.color.empty)
            }
            else
            {
                this.cells.set(xo,0,ch,fg,bg)
            }
        }
    }

    return titlenovim
})()

export default titlenovim;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVub3ZpbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy90aXRsZS90aXRsZW5vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFaO09BQWlCLFlBQWpCOzs7QUFFTixjQUFEOzsyQkFBWTthQUlSLFlBQUcsUUFBTyxNQUFLOzs7Ozs7Ozs7O21EQUVMLE9BQU87UUFFYixLQUFDLFlBQVk7UUFDYixLQUFDLFlBQWdCLE1BQU0sS0FBQyxVQUFVO1FBRWxDLEtBQUMsTUFBTSxHQUFHLFNBQVMsS0FBQztRQUNwQixLQUFDLE1BQU07UUFFUCxLQUFDLFNBQVMsS0FBUyxNQUFNLE1BQU07UUFDL0IsS0FBQyxTQUFTLEtBQVMsTUFBTSxNQUFNO1FBQy9CLEtBQUMsU0FBUyxRQUFTLE1BQU0sTUFBTTtRQUUvQixLQUFDLE1BQU0sU0FBUyxLQUFXLE1BQU0sTUFBTSxRQUFRO1FBQy9DLEtBQUMsTUFBTSxTQUFTLFVBQVcsTUFBTSxNQUFNLFFBQVE7UUFDL0MsS0FBQyxNQUFNLFNBQVMsV0FBVyxNQUFNLE1BQU0sUUFBUTtRQUMvQyxLQUFDLE1BQU0sU0FBUyxRQUFXLE1BQU0sTUFBTSxRQUFRO1FBRS9DLEtBQUMsY0FBYztRQUNmLEtBQUMsWUFBYztRQUVmLEtBQUssR0FBRyxnQkFBaUIsS0FBQztRQUMxQixLQUFLLEdBQUcsZ0JBQWlCLEtBQUM7UUFDMUIsS0FBSyxHQUFHLGNBQWlCLEtBQUM7UUFDMUIsS0FBSyxHQUFHLGlCQUFpQixLQUFDOzs7MEJBRTlCLHdCQUFXOztZQUVGLE1BQU0sVUFBUyxLQUFDOzs7O1FBRXJCLEtBQUMsTUFBTSxJQUFJLE1BQU07UUFDakIsS0FBQyxNQUFNLE1BQU0sWUFBWTtRQUV6QixLQUFDLFNBQVMsS0FBSyxNQUFNLE1BQU0sUUFBUTtRQUNuQyxLQUFDLFNBQVMsS0FBSyxNQUFNLE1BQU0sUUFBUTtRQUVuQyxLQUFD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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/titlenovim.kode
