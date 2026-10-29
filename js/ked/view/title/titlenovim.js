var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var titlenovim

import kxk from "../../../kxk.js"
let slash = kxk.slash
let post = kxk.post

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import mode from "../../edit/mode.js"

import view from "../base/view.js"


titlenovim = (function ()
{
    _k_.extend(titlenovim, view)
    function titlenovim (screen, name)
    {
        this["onError"] = this["onError"].bind(this)
        this["onPending"] = this["onPending"].bind(this)
        this["onExecute"] = this["onExecute"].bind(this)
        titlenovim.__super__.constructor.call(this,screen,name)
        this.setColor('bg',theme.novim.bg)
        this.setColor('fg',theme.novim.text)
        this.setColor('empty',theme.title.empty)
        this.pointerType = 'default'
        this.novimText = 'novim'
        post.on('novim.execute',this.onExecute)
        post.on('novim.pending',this.onPending)
        post.on('novim.error',this.onError)
    }

    titlenovim.prototype["onExecute"] = function (execute)
    {
        var t

        console.log("EXECUTE",execute)
        this.setColor('bg',theme.novim.execute.bg)
        this.setColor('fg',theme.novim.execute.fg)
        t = execute.operator
        if (execute.count)
        {
            t += " " + execute.count
        }
        if (execute.motion)
        {
            t += " " + execute.motion.kind
        }
        return this.novimText = t
    }

    titlenovim.prototype["onPending"] = function (pending)
    {
        var t, _47_24_, _48_27_, _49_26_, _50_28_, _51_30_

        console.log("PENDING",pending)
        this.setColor('bg',theme.novim.pending.bg)
        this.setColor('fg',theme.novim.pending.fg)
        t = ((_47_24_=pending.op) != null ? _47_24_ : '')
        t += ((_48_27_=pending.count) != null ? _48_27_ : '')
        t += ((_49_26_=pending.area) != null ? _49_26_ : '')
        t += ((_50_28_=pending.prefix) != null ? _50_28_ : '')
        t += ((_51_30_=pending.register) != null ? _51_30_ : '')
        return this.novimText = t
    }

    titlenovim.prototype["onError"] = function (err)
    {
        console.log("ERROR",err)
        this.setColor('bg',theme.novim.error.bg)
        this.setColor('fg',theme.novim.error.fg)
        return this.novimText = err
    }

    titlenovim.prototype["draw"] = function (x, w)
    {
        var bg, ch, fg, xo

        if (this.hidden())
        {
            return
        }
        titlenovim.__super__.draw.call(this)
        this.layout(x,0,w,1)
        this.rounded = `${_k_.rpad(w - 2,this.novimText)}`
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVub3ZpbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy90aXRsZS90aXRsZW5vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFUOztPQUNTLFdBQVo7OztBQUVFLGNBQVQ7OzJCQUE0QjthQUV4QixZQUFHLFFBQU87Ozs7O21EQUVBLE9BQU87UUFFYixLQUFDLFNBQVMsS0FBUyxNQUFNLE1BQU07UUFDL0IsS0FBQyxTQUFTLEtBQVMsTUFBTSxNQUFNO1FBQy9CLEtBQUMsU0FBUyxRQUFTLE1BQU0sTUFBTTtRQUUvQixLQUFDLGNBQWM7UUFDZixLQUFDLFlBQWM7UUFHZixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxjQUFnQixLQUFDOzs7MEJBRTdCLHdCQUFXOzs7O1FBQ1AsWUFBSSxVQUFVO1FBQ2QsS0FBQyxTQUFTLEtBQU0sTUFBTSxNQUFNLFFBQVE7UUFDcEMsS0FBQyxTQUFTLEtBQU0sTUFBTSxNQUFNLFFBQVE7UUFDcEMsSUFBSSxRQUFRO1lBQ3VCLFFBQVE7O1lBQTNDLEtBQUssTUFBTSxRQUFROztZQUNnQixRQUFROztZQUEzQyxLQUFLLE1BQU0sUUFBUSxPQUFPOztlQUMxQixLQUFDLFlBQVk7OzswQkFFakIsd0JBQVc7Ozs7UUFDUCxZQUFJLFVBQVU7UUFDZCxLQUFDLFNBQVMsS0FBTSxNQUFNLE1BQU0sUUFBUTtRQUNwQyxLQUFDLFNBQVMsS0FBTSxNQUFNLE1BQU0sUUFBUTtRQUNwQyxjQUFLLFFBQVEsd0JBQUs7UUFDbEIsZUFBSyxRQUFRLDJCQUFRO1FBQ3JCLGVBQUssUUFBUSwwQkFBTztRQUNwQixlQUFLLFFBQVEsNEJBQVM7UUFDdEIsZUFBSyxRQUFRLDhCQUFXO2VBQ3hCLEtBQUMsWUFBWTs7OzBCQUVqQixzQkFBUzs7UUFDTCxZQUFJLFFBQVE7UUFDWixLQUFDLFNBQVMsS0FBTSxNQUFNLE1BQU0sTUFBTTtRQUNsQyxLQUFDLFNBQVMsS0FBTSxNQUFNLE1BQU0sTUFBTTtlQUNsQyxLQUFDLFlBQVk7OzswQkFRakIsbUJBQU0sR0FBRTs7OztZQUVDLEtBQUM7Ozs7O1FBSU4sS0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFO1FBQ2QsS0FBQyx1QkFBbUIsSUFBRSxFQUFFLEtBQUM7UUFFekIsS0FBSyxLQUFDLE1BQU07UUFDWixLQUFLLEtBQUMsTUFBTTs0QkFDQyxLQUFDO2FBQVA7O1lBQUg7dUJBQ0csR0FBTTs7Z0JBQ0wsS0FBQyxNQUFNLElBQUksR0FBRyxFQUFFLEdBQUcsR0FBRyxLQUFDLE1BQU07Ozs7Z0JBRTdCLEtBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRSxHQUFHLEdBQUc7Ozs7O1dBakU3Qjs7O2VBbUVGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/titlenovim.kode
