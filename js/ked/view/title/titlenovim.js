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
        this["onExecute"] = this["onExecute"].bind(this)
        this["onPending"] = this["onPending"].bind(this)
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

    titlenovim.prototype["onPending"] = function (pending)
    {
        var t, _29_24_, _31_27_, _32_26_, _33_28_, _34_30_

        this.setColor('bg',theme.novim.pending.bg)
        this.setColor('fg',theme.novim.pending.fg)
        t = ((_29_24_=pending.op) != null ? _29_24_ : '')
        t += ' '
        t += ((_31_27_=pending.count) != null ? _31_27_ : '')
        t += ((_32_26_=pending.area) != null ? _32_26_ : '')
        t += ((_33_28_=pending.prefix) != null ? _33_28_ : '')
        t += ((_34_30_=pending.register) != null ? _34_30_ : '')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVub3ZpbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy90aXRsZS90aXRsZW5vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFUOztPQUNTLFdBQVo7OztBQUVOLGNBQUQ7OzJCQUFZO2FBR1IsWUFBRyxRQUFPOzs7OzttREFFQSxPQUFPO1FBRWIsS0FBQyxTQUFTLEtBQVMsTUFBTSxNQUFNO1FBQy9CLEtBQUMsU0FBUyxLQUFTLE1BQU0sTUFBTTtRQUMvQixLQUFDLFNBQVMsUUFBUyxNQUFNLE1BQU07UUFFL0IsS0FBQyxjQUFjO1FBQ2YsS0FBQyxZQUFjO1FBRWYsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztRQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQzs7OzBCQUU3Qix3QkFBVzs7OztRQUVQLEtBQUMsU0FBUyxLQUFNLE1BQU0sTUFBTSxRQUFRO1FBQ3BDLEtBQUMsU0FBUyxLQUFNLE1BQU0sTUFBTSxRQUFRO1FBQ3BDLGNBQUssUUFBUSx3QkFBSztRQUNsQixLQUFLO1FBQ0wsZUFBSyxRQUFRLDJCQUFRO1FBQ3JCLGVBQUssUUFBUSwwQkFBTztRQUNwQixlQUFLLFFBQVEsNEJBQVM7UUFDdEIsZUFBSyxRQUFRLDhCQUFXO2VBQ3hCLEtBQUMsWUFBWTs7OzBCQUVqQix3QkFBVzs7OztRQUVQLEtBQUMsU0FBUyxLQUFNLE1BQU0sTUFBTSxRQUFRO1FBQ3BDLEtBQUMsU0FBUyxLQUFNLE1BQU0sTUFBTSxRQUFRO1FBQ3BDLElBQUksUUFBUTtZQUNnQixRQUFROztZQUFwQyxLQUFLLE1BQU0sUUFBUTs7WUFDaEIsUUFBUTs7Z0JBQ0osUUFBUSxPQUFPLFNBQVE7O29CQUNjLFFBQVEsT0FBTzs7b0JBQW5ELEtBQUssTUFBTSxRQUFRLE9BQU87O29CQUNVLFFBQVEsT0FBTzs7b0JBQW5ELEtBQUssTUFBTSxRQUFRLE9BQU87Ozs7O2dCQUUxQixLQUFLLE1BQU0sUUFBUSxPQUFPOzs7ZUFDbEMsS0FBQyxZQUFZOzs7MEJBRWpCLHNCQUFTOztRQUVMLEtBQUMsU0FBUyxLQUFLLE1BQU0sTUFBTSxNQUFNO1FBQ2pDLEtBQUMsU0FBUyxLQUFLLE1BQU0sTUFBTSxNQUFNO2VBQ2pDLEtBQUMsWUFBWTs7OzBCQUVqQixtQkFBTSxHQUFFOzs7O1lBRUMsS0FBQzs7Ozs7UUFJTixLQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUU7UUFDZCxLQUFDLHVCQUFtQixJQUFFLEVBQUUsS0FBQztRQUV6QixLQUFLLEtBQUMsTUFBTTtRQUNaLEtBQUssS0FBQyxNQUFNOzRCQUNDLEtBQUM7YUFBUDs7WUFBSDt1QkFDRyxHQUFNOztnQkFDTCxLQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsR0FBRyxHQUFHLEtBQUMsTUFBTTs7OztnQkFFN0IsS0FBQyxNQUFNLElBQUksR0FBRyxFQUFFLEdBQUcsR0FBRzs7Ozs7V0FqRXJDOzs7ZUFtRU0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/titlenovim.kode
