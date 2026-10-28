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
        titlenovim.__super__.constructor.call(this,screen,name)
    
        this.setColor('bg',theme.title.novim)
        this.setColor('fg',theme.title.novimText)
        this.setColor('empty',theme.title.empty)
        this.pointerType = 'default'
        this.novimText = "novim"
        post.on('title.novim',(function (novimText)
        {
            this.novimText = novimText
        }).bind(this))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVub3ZpbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy90aXRsZS90aXRsZW5vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVYSxVQUFBO0lBQU07SUFBTTs7T0FDTixZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFUOztPQUNTLFdBQVo7OztBQUVFLGNBQVQ7OzJCQUE0QjthQUV4QixZQUFHLFFBQU87O21EQUVBLE9BQU87O1FBRWIsS0FBQyxTQUFTLEtBQVMsTUFBTSxNQUFNO1FBQy9CLEtBQUMsU0FBUyxLQUFTLE1BQU0sTUFBTTtRQUMvQixLQUFDLFNBQVMsUUFBUyxNQUFNLE1BQU07UUFFL0IsS0FBQyxjQUFjO1FBQ2YsS0FBQyxZQUFjO1FBRWYsS0FBSyxHQUFHLHlCQUFnQjs7WUFBRDs7OzswQkFRM0IsbUJBQU0sR0FBRTs7OztZQUVDLEtBQUM7Ozs7O1FBR04sS0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFO1FBQ2QsS0FBQyx1QkFBbUIsSUFBRSxFQUFFLEtBQUM7UUFJekIsS0FBSyxLQUFDLE1BQU07UUFDWixLQUFLLEtBQUMsTUFBTTs0QkFDQyxLQUFDO2FBQVA7O1lBQUg7dUJBQ0csR0FBTTs7Z0JBQ0wsS0FBQyxNQUFNLElBQUksR0FBRyxFQUFFLEdBQUcsR0FBRyxLQUFDLE1BQU07Ozs7Z0JBRTdCLEtBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRSxHQUFHLEdBQUc7Ozs7O1dBckM3Qjs7O2VBdUNGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/title/titlenovim.kode
