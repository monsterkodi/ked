var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        this["onSearchText"] = this["onSearchText"].bind(this)
        this["onExText"] = this["onExText"].bind(this)
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
        post.on('novim.ex.text',this.onExText)
        post.on('novim.search.text',this.onSearchText)
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

    titlenovim.prototype["onExText"] = function (update)
    {
        if (update.state !== this.stateName)
        {
            return
        }
        this.input.set(update.text)
        this.input.state.moveCursors('eol')
        return true
    }

    titlenovim.prototype["onSearchText"] = function (update)
    {
        if (update.state !== this.stateName)
        {
            return
        }
        this.vinder.set(update.text)
        this.vinder.state.moveCursors('eol')
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
        var t, _138_24_, _140_27_, _141_26_, _142_28_, _143_30_

        this.setColor('bg',theme.novim.pending.bg)
        this.setColor('fg',theme.novim.pending.fg)
        t = ((_138_24_=pending.op) != null ? _138_24_ : '')
        t += ' '
        t += ((_140_27_=pending.count) != null ? _140_27_ : '')
        t += ((_141_26_=pending.area) != null ? _141_26_ : '')
        t += ((_142_28_=pending.prefix) != null ? _142_28_ : '')
        t += ((_143_30_=pending.register) != null ? _143_30_ : '')
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
        return this.novimText = `recorded @${macro.register}`
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
        var action, combo, _198_28_

        combo = ((_198_28_=event.combo) != null ? _198_28_ : key)
        if (_k_.in(combo,['up','down']))
        {
            action = (combo === 'up' ? 'historyUp' : 'historyDown')
            if (this.vinder.visible())
            {
                this.emit('vinder',action,this.vinder.current())
                return true
            }
            if (this.input.visible())
            {
                this.emit('action',action,this.input.current())
                return true
            }
        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVub3ZpbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy90aXRsZS90aXRsZW5vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFaO09BQWlCLFlBQWpCOzs7QUFFTixjQUFEOzsyQkFBWTthQUdSLFlBQUcsUUFBTyxNQUFLOzs7Ozs7Ozs7Ozs7Ozs7OzttREFFTCxPQUFPO1FBRWIsS0FBQyxZQUFZO1FBQ2IsS0FBQyxZQUFnQixNQUFNLEtBQUMsVUFBVTtRQUNsQyxLQUFDLGFBQWdCLE1BQU0sS0FBQyxVQUFVO1FBRWxDLEtBQUMsTUFBTSxHQUFJLFNBQVMsS0FBQztRQUNyQixLQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUM7UUFFckIsS0FBQyxNQUFNO1FBQ1AsS0FBQyxPQUFPO1FBRVIsS0FBQyxTQUFTLEtBQVMsTUFBTSxNQUFNO1FBQy9CLEtBQUMsU0FBUyxLQUFTLE1BQU0sTUFBTTtRQUMvQixLQUFDLFNBQVMsUUFBUyxNQUFNLE1BQU07UUFFL0IsS0FBQyxNQUFNLFNBQVMsS0FBVyxNQUFNLE1BQU0sUUFBUTtRQUMvQyxLQUFDLE1BQU0sU0FBUyxVQUFXLE1BQU0sTUFBTSxRQUFRO1FBQy9DLEtBQUMsTUFBTSxTQUFTLFdBQVcsTUFBTSxNQUFNLFFBQVE7UUFDL0MsS0FBQyxNQUFNLFNBQVMsUUFBVyxNQUFNLE1BQU0sUUFBUTtRQUUvQyxLQUFDLE9BQU8sU0FBUyxLQUFXLE1BQU0sTUFBTSxRQUFRO1FBQ2hELEtBQUMsT0FBTyxTQUFTLFVBQVcsTUFBTSxNQUFNLFFBQVE7UUFDaEQsS0FBQyxPQUFPLFNBQVMsV0FBVyxNQUFNLE1BQU0sUUFBUTtRQUNoRCxLQUFDLE9BQU8sU0FBUyxRQUFXLE1BQU0sTUFBTSxRQUFRO1FBRWhELEtBQUMsY0FBYztRQUNmLEtBQUMsWUFBYztRQUVmLEtBQUssR0FBRyxnQkFBd0IsS0FBQztRQUNqQyxL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
//# sourceURL=../../../../kode/ked/view/title/titlenovim.kode
