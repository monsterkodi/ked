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
        this["onMacroStop"] = this["onMacroStop"].bind(this)
        this["onMacroStart"] = this["onMacroStart"].bind(this)
        this["onSearchPosition"] = this["onSearchPosition"].bind(this)
        this["onExecute"] = this["onExecute"].bind(this)
        this["onPending"] = this["onPending"].bind(this)
        this["onVinderAction"] = this["onVinderAction"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onSearchStart"] = this["onSearchStart"].bind(this)
        this["onExStart"] = this["onExStart"].bind(this)
        titlenovim.__super__.constructor.call(this,screen,name)
        this.stateName = stateName
        this.input = new input(this.screen,`${name}_input`)
        this.vinder = new input(this.screen,`${name}_vinder`)
        this.input.on('action',this.onInputAction)
        this.vinder.on('action',this.onVinderAction)
        this.input.hide()
        this.vinder.hide()
        this.setColor('bg',theme.novim.bg)
        this.setColor('fg',theme.novim.text)
        this.setColor('empty',theme.title.empty)
        this.input.setColor('bg',theme.novim.pending.bg)
        this.input.setColor('bg_blur',theme.novim.pending.bg)
        this.input.setColor('bg_focus',theme.novim.pending.bg)
        this.input.setColor('empty',theme.novim.pending.bg)
        this.vinder.setColor('bg',theme.novim.pending.bg)
        this.vinder.setColor('bg_blur',theme.novim.pending.bg)
        this.vinder.setColor('bg_focus',theme.novim.pending.bg)
        this.vinder.setColor('empty',theme.novim.pending.bg)
        this.pointerType = 'default'
        this.novimText = 'novim'
        post.on('novim.execute',this.onExecute)
        post.on('novim.pending',this.onPending)
        post.on('novim.error',this.onError)
        post.on('novim.ex.start',this.onExStart)
        post.on('novim.search.start',this.onSearchStart)
        post.on('novim.search.position',this.onSearchPosition)
        post.on('novim.macro.start',this.onMacroStart)
        post.on('novim.macro.stop',this.onMacroStop)
    }

    titlenovim.prototype["onExStart"] = function (start)
    {
        if (start.state !== this.stateName)
        {
            return
        }
        if (this.vinder.visible())
        {
            this.vinder.hide()
        }
        this.input.set(start.text)
        this.input.state.moveCursors('eol')
        this.setColor('bg',theme.novim.pending.bg)
        this.setColor('fg',theme.novim.pending.fg)
        this.input.show()
        this.input.grabFocus()
        this.layoutInput(this.input)
        post.emit('redraw')
        return true
    }

    titlenovim.prototype["onSearchStart"] = function (start)
    {
        if (start.state !== this.stateName)
        {
            return
        }
        if (this.input.visible())
        {
            this.input.hide()
        }
        this.vinder.set(start.text)
        this.vinder.selectAll()
        this.vinder.state.moveCursors('eol')
        this.setColor('bg',theme.novim.pending.bg)
        this.setColor('fg',theme.novim.pending.fg)
        this.vinder.show()
        this.vinder.grabFocus()
        this.layoutInput(this.vinder)
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

    titlenovim.prototype["onVinderAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
            case 'cancel':
                this.vinder.hide()
                this.novimText = ''
                this.emit('vinder',action,text)
                break
            case 'change':
                this.emit('vinder','change',text)
                break
        }

        return true
    }

    titlenovim.prototype["onPending"] = function (pending)
    {
        var t, _118_24_, _120_27_, _121_26_, _122_28_, _123_30_

        this.setColor('bg',theme.novim.pending.bg)
        this.setColor('fg',theme.novim.pending.fg)
        t = ((_118_24_=pending.op) != null ? _118_24_ : '')
        t += ' '
        t += ((_120_27_=pending.count) != null ? _120_27_ : '')
        t += ((_121_26_=pending.area) != null ? _121_26_ : '')
        t += ((_122_28_=pending.prefix) != null ? _122_28_ : '')
        t += ((_123_30_=pending.register) != null ? _123_30_ : '')
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

    titlenovim.prototype["onSearchPosition"] = function (position)
    {
        if (position.state !== this.stateName)
        {
            return
        }
        this.setColor('bg',theme.novim.execute.bg)
        this.setColor('fg',theme.novim.execute.fg)
        return this.novimText = `${position.current}/${position.total}`
    }

    titlenovim.prototype["onMacroStart"] = function (macro)
    {
        if (macro.state !== this.stateName)
        {
            return
        }
        this.setColor('bg',theme.novim.execute.bg)
        this.setColor('fg',theme.novim.execute.fg)
        return this.novimText = `recording @${macro.register}`
    }

    titlenovim.prototype["onMacroStop"] = function (macro)
    {
        if (macro.state !== this.stateName)
        {
            return
        }
        if (!this.novimText.startsWith('recording @'))
        {
            return
        }
        return this.novimText = ''
    }

    titlenovim.prototype["onError"] = function (err)
    {
        this.setColor('bg',theme.novim.error.bg)
        this.setColor('fg',theme.novim.error.fg)
        return this.novimText = err
    }

    titlenovim.prototype["onMouse"] = function (event)
    {
        if (this.vinder.visible())
        {
            return this.vinder.onMouse(event)
        }
        if (!this.input.visible())
        {
            return false
        }
        return this.input.onMouse(event)
    }

    titlenovim.prototype["onKey"] = function (key, event)
    {
        if (this.vinder.visible())
        {
            return this.vinder.onKey(key,event)
        }
        return this.input.onKey(key,event)
    }

    titlenovim.prototype["layout"] = function (x, y, w, h)
    {
        titlenovim.__super__.layout.call(this,x,y,w,h)
    
        this.layoutInput(this.input)
        return this.layoutInput(this.vinder)
    }

    titlenovim.prototype["layoutInput"] = function (input)
    {
        return input.layout(this.cells.x + 1,this.cells.y,_k_.max(0,this.cells.cols - 2),1)
    }

    titlenovim.prototype["draw"] = function (x, w)
    {
        if (this.hidden())
        {
            return
        }
        titlenovim.__super__.draw.call(this)
        this.layout(x,0,w,1)
        if (this.vinder.visible())
        {
            this.layoutInput(this.vinder)
            this.vinder.draw()
            return this.drawFrame()
        }
        else if (this.input.visible())
        {
            this.layoutInput(this.input)
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

        fg = this.color.bg
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVub3ZpbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy90aXRsZS90aXRsZW5vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFaO09BQWlCLFlBQWpCOzs7QUFFTixjQUFEOzsyQkFBWTthQUdSLFlBQUcsUUFBTyxNQUFLOzs7Ozs7Ozs7Ozs7Ozs7bURBRUwsT0FBTztRQUViLEtBQUMsWUFBWTtRQUNiLEtBQUMsWUFBZ0IsTUFBTSxLQUFDLFVBQVU7UUFDbEMsS0FBQyxhQUFnQixNQUFNLEtBQUMsVUFBVTtRQUVsQyxLQUFDLE1BQU0sR0FBSSxTQUFTLEtBQUM7UUFDckIsS0FBQyxPQUFPLEdBQUcsU0FBUyxLQUFDO1FBRXJCLEtBQUMsTUFBTTtRQUNQLEtBQUMsT0FBTztRQUVSLEtBQUMsU0FBUyxLQUFTLE1BQU0sTUFBTTtRQUMvQixLQUFDLFNBQVMsS0FBUyxNQUFNLE1BQU07UUFDL0IsS0FBQyxTQUFTLFFBQVMsTUFBTSxNQUFNO1FBRS9CLEtBQUMsTUFBTSxTQUFTLEtBQVcsTUFBTSxNQUFNLFFBQVE7UUFDL0MsS0FBQyxNQUFNLFNBQVMsVUFBVyxNQUFNLE1BQU0sUUFBUTtRQUMvQyxLQUFDLE1BQU0sU0FBUyxXQUFXLE1BQU0sTUFBTSxRQUFRO1FBQy9DLEtBQUMsTUFBTSxTQUFTLFFBQVcsTUFBTSxNQUFNLFFBQVE7UUFFL0MsS0FBQyxPQUFPLFNBQVMsS0FBVyxNQUFNLE1BQU0sUUFBUTtRQUNoRCxLQUFDLE9BQU8sU0FBUyxVQUFXLE1BQU0sTUFBTSxRQUFRO1FBQ2hELEtBQUMsT0FBTyxTQUFTLFdBQVcsTUFBTSxNQUFNLFFBQVE7UUFDaEQsS0FBQyxPQUFPLFNBQVMsUUFBVyxNQUFNLE1BQU0sUUFBUTtRQUVoRCxLQUFDLGNBQWM7UUFDZixLQUFDLFlBQWM7UUFFZixLQUFLLEdBQUcsZ0JBQXFCLEtBQUM7UUFDOUIsS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/titlenovim.kode
