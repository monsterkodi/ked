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
        var t, _37_24_, _39_27_, _40_26_, _41_28_, _42_30_

        this.setColor('bg',theme.novim.pending.bg)
        this.setColor('fg',theme.novim.pending.fg)
        t = ((_37_24_=pending.op) != null ? _37_24_ : '')
        t += ' '
        t += ((_39_27_=pending.count) != null ? _39_27_ : '')
        t += ((_40_26_=pending.area) != null ? _40_26_ : '')
        t += ((_41_28_=pending.prefix) != null ? _41_28_ : '')
        t += ((_42_30_=pending.register) != null ? _42_30_ : '')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVub3ZpbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy90aXRsZS90aXRsZW5vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFUOztPQUNTLFdBQVo7OztBQUVFLGNBQVQ7OzJCQUE0QjthQUV4QixZQUFHLFFBQU87Ozs7O21EQUVBLE9BQU87UUFFYixLQUFDLFNBQVMsS0FBUyxNQUFNLE1BQU07UUFDL0IsS0FBQyxTQUFTLEtBQVMsTUFBTSxNQUFNO1FBQy9CLEtBQUMsU0FBUyxRQUFTLE1BQU0sTUFBTTtRQUUvQixLQUFDLGNBQWM7UUFDZixLQUFDLFlBQWM7UUFFZixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1FBQ3pCLEtBQUssR0FBRyxjQUFnQixLQUFDOzs7MEJBRTdCLHdCQUFXOzs7O1FBRVAsS0FBQyxTQUFTLEtBQU0sTUFBTSxNQUFNLFFBQVE7UUFDcEMsS0FBQyxTQUFTLEtBQU0sTUFBTSxNQUFNLFFBQVE7UUFDcEMsY0FBSyxRQUFRLHdCQUFLO1FBQ2xCLEtBQUs7UUFDTCxlQUFLLFFBQVEsMkJBQVE7UUFDckIsZUFBSyxRQUFRLDBCQUFPO1FBQ3BCLGVBQUssUUFBUSw0QkFBUztRQUN0QixlQUFLLFFBQVEsOEJBQVc7ZUFDeEIsS0FBQyxZQUFZOzs7MEJBRWpCLHdCQUFXOzs7O1FBRVAsS0FBQyxTQUFTLEtBQU0sTUFBTSxNQUFNLFFBQVE7UUFDcEMsS0FBQyxTQUFTLEtBQU0sTUFBTSxNQUFNLFFBQVE7UUFDcEMsSUFBSSxRQUFRO1lBQ2dCLFFBQVE7O1lBQXBDLEtBQUssTUFBTSxRQUFROztZQUNoQixRQUFROztnQkFDSixRQUFRLE9BQU8sU0FBUTs7b0JBQ2MsUUFBUSxPQUFPOztvQkFBbkQsS0FBSyxNQUFNLFFBQVEsT0FBTzs7b0JBQ1UsUUFBUSxPQUFPOztvQkFBbkQsS0FBSyxNQUFNLFFBQVEsT0FBTzs7Ozs7Z0JBRTFCLEtBQUssTUFBTSxRQUFRLE9BQU87OztlQUNsQyxLQUFDLFlBQVk7OzswQkFFakIsc0JBQVM7O1FBRUwsS0FBQyxTQUFTLEtBQUssTUFBTSxNQUFNLE1BQU07UUFDakMsS0FBQyxTQUFTLEtBQUssTUFBTSxNQUFNLE1BQU07ZUFDakMsS0FBQyxZQUFZOzs7MEJBUWpCLG1CQUFNLEdBQUU7Ozs7WUFFQyxLQUFDOzs7OztRQUlOLEtBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRTtRQUNkLEtBQUMsdUJBQW1CLElBQUUsRUFBRSxLQUFDO1FBRXpCLEtBQUssS0FBQyxNQUFNO1FBQ1osS0FBSyxLQUFDLE1BQU07NEJBQ0MsS0FBQzthQUFQOztZQUFIO3VCQUNHLEdBQU07O2dCQUNMLEtBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRSxHQUFHLEdBQUcsS0FBQyxNQUFNOzs7O2dCQUU3QixLQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsR0FBRyxHQUFHOzs7OztXQXRFN0I7OztlQXdFRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/titlenovim.kode
