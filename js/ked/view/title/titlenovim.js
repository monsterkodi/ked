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
        var t, _116_24_, _118_27_, _119_26_, _120_28_, _121_30_

        this.setColor('bg',theme.novim.pending.bg)
        this.setColor('fg',theme.novim.pending.fg)
        t = ((_116_24_=pending.op) != null ? _116_24_ : '')
        t += ' '
        t += ((_118_27_=pending.count) != null ? _118_27_ : '')
        t += ((_119_26_=pending.area) != null ? _119_26_ : '')
        t += ((_120_28_=pending.prefix) != null ? _120_28_ : '')
        t += ((_121_30_=pending.register) != null ? _121_30_ : '')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVub3ZpbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy90aXRsZS90aXRsZW5vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFaO09BQWlCLFlBQWpCOzs7QUFFTixjQUFEOzsyQkFBWTthQUdSLFlBQUcsUUFBTyxNQUFLOzs7Ozs7Ozs7Ozs7O21EQUVMLE9BQU87UUFFYixLQUFDLFlBQVk7UUFDYixLQUFDLFlBQWdCLE1BQU0sS0FBQyxVQUFVO1FBQ2xDLEtBQUMsYUFBZ0IsTUFBTSxLQUFDLFVBQVU7UUFFbEMsS0FBQyxNQUFNLEdBQUksU0FBUyxLQUFDO1FBQ3JCLEtBQUMsT0FBTyxHQUFHLFNBQVMsS0FBQztRQUVyQixLQUFDLE1BQU07UUFDUCxLQUFDLE9BQU87UUFFUixLQUFDLFNBQVMsS0FBUyxNQUFNLE1BQU07UUFDL0IsS0FBQyxTQUFTLEtBQVMsTUFBTSxNQUFNO1FBQy9CLEtBQUMsU0FBUyxRQUFTLE1BQU0sTUFBTTtRQUUvQixLQUFDLE1BQU0sU0FBUyxLQUFXLE1BQU0sTUFBTSxRQUFRO1FBQy9DLEtBQUMsTUFBTSxTQUFTLFVBQVcsTUFBTSxNQUFNLFFBQVE7UUFDL0MsS0FBQyxNQUFNLFNBQVMsV0FBVyxNQUFNLE1BQU0sUUFBUTtRQUMvQyxLQUFDLE1BQU0sU0FBUyxRQUFXLE1BQU0sTUFBTSxRQUFRO1FBRS9DLEtBQUMsT0FBTyxTQUFTLEtBQVcsTUFBTSxNQUFNLFFBQVE7UUFDaEQsS0FBQyxPQUFPLFNBQVMsVUFBVyxNQUFNLE1BQU0sUUFBUTtRQUNoRCxLQUFDLE9BQU8sU0FBUyxXQUFXLE1BQU0sTUFBTSxRQUFRO1FBQ2hELEtBQUMsT0FBTyxTQUFTLFFBQVcsTUFBTSxNQUFNLFFBQVE7UUFFaEQsS0FBQyxjQUFjO1FBQ2YsS0FBQyxZQUFjO1FBRWYsS0FBSyxHQUFHLGdCQUFxQixLQUFDO1FBQzlCLEtBQUss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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/titlenovim.kode
