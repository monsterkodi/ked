var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var vinder

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import view from "../base/view.js"
import input from "../base/input.js"


vinder = (function ()
{
    _k_.extend(vinder, view)
    function vinder (screen, editor, name = 'vinder')
    {
        this.screen = screen
        this.editor = editor
        this.name = name
    
        var _33_45_, _34_45_

        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        this.state = this.editor.state
        vinder.__super__.constructor.call(this,this.screen,this.name)
        this.isVisible = false
        this.isPopup = true
        this.isInputPopup = true
        this.input = new input(this.screen,`${this.name}_input`)
        this.input.on('action',this.onInputAction)
        post.on('vinder.show',this.show)
        this.setColor('bg',((_33_45_=theme.vinder.bg) != null ? _33_45_ : theme.finder.bg))
        this.setColor('frame',((_34_45_=theme.vinder.frame) != null ? _34_45_ : theme.finder.frame))
    }

    vinder.prototype["arrange"] = function ()
    {
        var w, x, y

        x = this.editor.cells.x
        w = this.editor.cells.cols
        y = this.editor.cells.y
        this.input.layout(x + 2,y + 1,w - 4,1)
        return this.cells.layout(x,y,w,3)
    }

    vinder.prototype["show"] = function ()
    {
        var text

        text = this.state.textOfSelectionOrWordAtCursor()
        this.input.show()
        if (text !== this.input.current())
        {
            this.input.set(text)
            this.input.selectAll()
            this.input.state.moveCursors('eol')
        }
        post.emit('vinder.text',text)
        this.state.highlightText(text)
        vinder.__super__.show.call(this)
        return this.input.grabFocus()
    }

    vinder.prototype["hide"] = function ()
    {
        return vinder.__super__.hide.call(this)
    }

    vinder.prototype["draw"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        this.arrange()
        this.cells.draw_rounded_border(0,0,-1,-1,{fg:this.color.frame})
        this.cells.draw_vertical_padding(1,1,this.color.frame,theme.vinder.bg)
        this.cells.draw_vertical_padding(this.cells.cols - 2,1,theme.vinder.bg,this.color.frame)
        return this.input.draw()
    }

    vinder.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                post.emit('focus','editor')
                this.hide()
                break
            case 'change':
                if (!_k_.empty(text))
                {
                    this.state.highlightText(text)
                }
                else
                {
                    this.state.setHighlights([])
                }
                post.emit('vinder.text',text)
                break
            case 'cancel':
            case 'escape':
            case 'esc':
                post.emit('focus','editor')
                this.state.setHighlights([])
                this.hide()
                break
        }

        return true
    }

    vinder.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.input.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        if (event.type === 'press' && !this.cells.isInsideEvent(event))
        {
            this.onInputAction('cancel')
            return {redraw:true}
        }
        return {redraw:true}
    }

    vinder.prototype["onKey"] = function (key, event)
    {
        var result

        if (this.hidden())
        {
            return
        }
        if (_k_.in(event.combo,['esc','escape']) || event.combo.startsWith('alt+') || event.combo.startsWith('ctrl+') || event.combo.startsWith('cmd+'))
        {
            if (_k_.in(event.combo,['esc','escape']))
            {
                this.onInputAction('cancel')
                return true
            }
            return 'unhandled'
        }
        if (result = this.input.onKey(key,event))
        {
            return result
        }
        return false
    }

    return vinder
})()

export default vinder;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmluZGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvdmluZGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FVYSxVQUFBO0lBQVM7O09BQ0EsWUFBWjs7T0FDWSxXQUFmO09BQW9CLFlBQXBCOzs7QUFFRSxVQUFUOzt1QkFBd0I7YUFFcEIsUUFBSSxRQUFRLFFBQVE7O1FBQWpCO1FBQVE7UUFBUTs7Ozs7Ozs7OztRQUVmLEtBQUMsUUFBZSxLQUFDLE9BQU87K0NBRWxCLEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxZQUFlO1FBQ2hCLEtBQUMsVUFBZTtRQUNoQixLQUFDLGVBQWU7UUFFaEIsS0FBQyxZQUFZLE1BQU0sS0FBQyxVQUFVLEtBQUM7UUFFL0IsS0FBQyxNQUFNLEdBQUcsU0FBUyxLQUFDO1FBRXBCLEtBQUssR0FBRyxjQUFjLEtBQUM7UUFFdkIsS0FBQyxTQUFTLGVBQVEsTUFBTSxPQUFPLHdCQUFRLE1BQU0sT0FBTztRQUNwRCxLQUFDLFNBQVMsa0JBQVEsTUFBTSxPQUFPLDJCQUFRLE1BQU0sT0FBTzs7O3NCQUV4RDs7OztRQUVJLElBQUksS0FBQyxPQUFPLE1BQU07UUFDbEIsSUFBSSxLQUFDLE9BQU8sTUFBTTtRQUNsQixJQUFJLEtBQUMsT0FBTyxNQUFNO1FBQ2xCLEtBQUMsTUFBTSxPQUFRLElBQUUsRUFBRyxJQUFFLEVBQUcsSUFBRSxFQUFHO2VBQzlCLEtBQUMsTUFBTSxPQUFRLEVBQUssRUFBSyxFQUFLOzs7c0JBRWxDOzs7O1FBRUksT0FBTyxLQUFDLE1BQU07UUFFZCxLQUFDLE1BQU07WUFFSixTQUFRLEtBQUMsTUFBTTs7WUFDZCxLQUFDLE1BQU0sSUFBSTtZQUNYLEtBQUMsTUFBTTtZQUNQLEtBQUMsTUFBTSxNQUFNLFlBQVk7O1FBRTdCLEtBQUssS0FBSyxjQUFjO1FBQ3hCLEtBQUMsTUFBTSxjQUFjOztlQUVyQixLQUFDLE1BQU07OztzQkFFWDs7Ozs7c0JBRUE7O1lBRVMsS0FBQzs7OztRQUVOLEtBQUM7UUFFRCxLQUFDLE1BQU0sb0JBQW9CLEVBQUUsRUFBRSxHQUFHLElBQUcsR0FBRyxLQUFDLE1BQU07UUFFL0MsS0FBQyxNQUFNLHNCQUFzQixFQUFFLEVBQUUsS0FBQyxNQUFNLE1BQU0sTUFBTSxPQUFPO1FBQzNELEtBQUMsTUFBTSxzQkFBc0IsS0FBQyxNQUFNLE9BQUssRUFBRSxFQUFFLE1BQU0sT0FBTyxHQUFHLEtBQUMsTUFBTTtlQUVwRSxLQUFDLE1BQU07OztzQkFFWCw0QkFBZSxRQUFPOztnQkFFWDs7aUJBRUg7Z0JBQ0ksS0FBSyxLQUFLLFFBQVE7Z0JBQ2xCLEtBQUM7O2lCQUVMOytCQUNhOztvQkFDTCxLQUFDLE1BQU0sY0FBYzs7OztvQkFFckIsS0FBQyxNQUFNOztnQkFDWCxLQUFLLEtBQUssY0FBYzs7aUJBRTVCO2lCQUNBO2lCQUNBO2dCQUNJLEtBQUssS0FBSyxRQUFRO2dCQUNsQixLQUFDLE1BQU07Z0JBQ1AsS0FBQzs7OztlQUNUOzs7c0JBRUosc0JBQVM7Ozs7WUFFQyxLQUFDOzs7O1FBRVAsTUFBTSxLQUFDLE1BQU0sUUFBUTthQUFpQixjQUFBLElBQUs7O21CQUFaOztZQUU1QixNQUFNLFNBQVEsWUFBZ0IsS0FBQyxNQUFNLGNBQWM7O1lBQ2xELEtBQUMsY0FBYztvQkFDWixPQUFPOztnQkFFZCxPQUFPOzs7c0JBRVgsb0JBQU8sS0FBSTs7OztZQUVELEtBQUM7Ozs7bUJBRUosTUFBTSxPQUFVLE1BQU0sY0FBYSxNQUFNLE1BQU0sV0FBVyxXQUFXLE1BQU0sTUFBTSxXQUFXLFlBQVksTUFBTSxNQUFNLFdBQVc7O3VCQUUzSCxNQUFNLE9BQVUsTUFBTTs7Z0JBQ3JCLEtBQUMsY0FBYzt1QkFDWjs7bUJBQ0o7O1lBRUosU0FBUyxLQUFDLE1BQU0sTUFBTSxJQUFJOzttQkFDdEI7O2VBRVA7OztXQTdHQzs7O2VBK0dGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/vinder.kode
