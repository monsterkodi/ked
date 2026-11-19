var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var sheenode

import post from "../../../kxk/post.js"

import theme from "../../theme/theme.js"

import view from "../base/view.js"
import input from "../base/input.js"
import tripleinput from "../base/tripleinput.js"


sheenode = (function ()
{
    _k_.extend(sheenode, view)
    function sheenode (editor, name)
    {
        this.editor = editor
        this.name = name
    
        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["focusInput"] = this["focusInput"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        sheenode.__super__.constructor.call(this,this.editor.screen,this.name)
        this.height = 8
        this.setColor('bg',theme.uniko.bg)
        this.input = new input(this.screen,`${this.name}_input`)
        this.xwrInput = new tripleinput(this.screen,`${this.name}_xwr`,['x','w','r'])
        this.yhbInput = new tripleinput(this.screen,`${this.name}_yhb`,['y','h','b'])
        this.input.drawUnfocusedCursors = false
        this.input.on('action',this.onInputAction)
        this.isVisible = false
    }

    sheenode.prototype["hasFocus"] = function ()
    {
        return this.input.hasFocus()
    }

    sheenode.prototype["grabFocus"] = function ()
    {
        return this.focusInput()
    }

    sheenode.prototype["focusInput"] = function ()
    {
        this.input.grabFocus()
        return true
    }

    sheenode.prototype["show"] = function ()
    {
        this.input.set('')
        sheenode.__super__.show.call(this)
        return post.emit('redraw')
    }

    sheenode.prototype["hide"] = function ()
    {
        if (this.hidden())
        {
            return
        }
        sheenode.__super__.hide.call(this)
        this.input.state.deselect()
        return post.emit('redraw')
    }

    sheenode.prototype["layout"] = function (x, y, w, h)
    {
        sheenode.__super__.layout.call(this,x,y,w,h)
    
        this.input.layout(x + 1,y + 1,w - 2,1)
        this.xwrInput.layout(x + 1,y + 3,w - 2,1)
        return this.yhbInput.layout(x + 1,y + 5,w - 2,1)
    }

    sheenode.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        this.input.draw()
        this.xwrInput.draw()
        this.yhbInput.draw()
        return sheenode.__super__.draw.call(this)
    }

    sheenode.prototype["onInputAction"] = function (action, text)
    {}

    sheenode.prototype["onMouse"] = function (event)
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
        ret = this.xwrInput.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.yhbInput.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return sheenode.__super__.onMouse.call(this,event)
    }

    sheenode.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return false
        }
        if (this.input.hasFocus())
        {
            return this.input.onKey(key,event)
        }
        if (this.xwrInput.hasFocus())
        {
            return this.xwrInput.onKey(key,event)
        }
        if (this.yhbInput.hasFocus())
        {
            return this.yhbInput.onKey(key,event)
        }
        return false
    }

    return sheenode
})()

export default sheenode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWVub2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjs7T0FDTSxZQUFUOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7T0FBdUIsa0JBQXZCOzs7QUFFTixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUTs7UUFBVDtRQUFROzs7Ozs7Ozs7Ozs7aURBRUQsS0FBQyxPQUFPLE9BQU8sS0FBQztRQUV0QixLQUFDLFNBQVM7UUFFVixLQUFDLFNBQVMsS0FBSyxNQUFNLE1BQU07UUFFM0IsS0FBQyxZQUFlLE1BQVksS0FBQyxVQUFVLEtBQUM7UUFDeEMsS0FBQyxlQUFlLFlBQVksS0FBQyxVQUFVLEtBQUMsWUFBYSxJQUFJLElBQUk7UUFDN0QsS0FBQyxlQUFlLFlBQVksS0FBQyxVQUFVLEtBQUMsWUFBYSxJQUFJLElBQUk7UUFFN0QsS0FBQyxNQUFNLHVCQUF1QjtRQUU5QixLQUFDLE1BQU0sR0FBRyxTQUFTLEtBQUM7UUFFcEIsS0FBQyxZQUFZOzs7d0JBRWpCOztlQUFhLEtBQUMsTUFBTTs7O3dCQUNwQjs7ZUFBYyxLQUFDOzs7d0JBRWY7O1FBRUksS0FBQyxNQUFNO2VBQ1A7Ozt3QkFFSjs7UUFFSSxLQUFDLE1BQU0sSUFBSTs7ZUFJWCxLQUFLLEtBQUs7Ozt3QkFFZDs7WUFFUyxLQUFDOzs7OztRQUlOLEtBQUMsTUFBTSxNQUFNO2VBRWIsS0FBSyxLQUFLOzs7d0JBRWQscUJBQVEsR0FBRSxHQUFFLEdBQUU7OzRDQUVKLEVBQUUsRUFBRSxFQUFFOztRQUVaLEtBQUMsTUFBTSxPQUFXLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFO1FBQzlCLEtBQUMsU0FBUyxPQUFRLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFO2VBQzlCLEtBQUMsU0FBUyxPQUFRLElBQUUsRUFBRSxJQUFFLEVBQUUsSUFBRSxFQUFFOzs7d0JBRWxDOztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLEtBQUMsTUFBTSxVQUFVLEVBQUUsRUFBRSxHQUFHLEdBQUcsSUFBSSxLQUFLLEtBQUMsTUFBTTtRQUMzQyxLQUFDLE1BQU07UUFDUCxLQUFDLFNBQVM7UUFDVixLQUFDLFNBQVM7Ozs7d0JBSWQsNEJBQWUsUUFBTzs7O3dCQUV0QixzQkFBUzs7OztZQUVBLEtBQUM7Ozs7UUFDTixNQUFNLEtBQUMsTUFBTSxRQUFXO2FBQW1CLGNBQUEsSUFBSzs7bUJBQVo7O1FBQ3BDLE1BQU0sS0FBQyxTQUFTLFFBQVE7YUFBbUIsY0FBQSxJQUFLOzttQkFBWjs7UUFDcEMsTUFBTSxLQUFDLFNBQVMsUUFBUTthQUFtQixjQUFBLElBQUs7O21CQUFaOztvREFDOUI7Ozt3QkFFVixvQkFBTyxLQUFJOztZQUVJLEtBQUM7O21CQUFWOztZQUVDLEtBQUMsTUFBTTs7bUJBQWtCLEtBQUMsTUFBTSxNQUFTLElBQUk7O1lBQzdDLEtBQUMsU0FBUzs7bUJBQWUsS0FBQyxTQUFTLE1BQU0sSUFBSTs7WUFDN0MsS0FBQyxTQUFTOzttQkFBZSxLQUFDLFNBQVMsTUFBTSxJQUFJOztlQUVoRDs7O1dBcEZQOzs7ZUFzRk0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheenode.kode
