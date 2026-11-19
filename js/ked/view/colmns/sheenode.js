var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var sheenode

import post from "../../../kxk/post.js"

import theme from "../../theme/theme.js"

import view from "../base/view.js"
import input from "../base/input.js"


sheenode = (function ()
{
    _k_.extend(sheenode, view)
    function sheenode (screen, editor, name)
    {
        this.screen = screen
        this.editor = editor
        this.name = name
    
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["focusInput"] = this["focusInput"].bind(this)
        sheenode.__super__.constructor.call(this,this.screen,this.name)
        this.height = 8
        this.setColor('bg',theme.uniko.bg)
        this.input = new input(this.screen,`${this.name}_input`)
        this.input.on('action',this.onInputAction)
        this.isVisible = false
    }

    sheenode.prototype["focusInput"] = function ()
    {
        this.focus = 'input'
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

    sheenode.prototype["onKey"] = function (key, event)
    {
        if (this.hidden())
        {
            return false
        }
        if (this.focus === 'input')
        {
            return this.input.onKey(key,event)
        }
        return false
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
        return sheenode.__super__.onMouse.call(this,event)
    }

    sheenode.prototype["layout"] = function (x, y, w, h)
    {
        sheenode.__super__.layout.call(this,x,y,w,h)
    
        return this.input.layout(x + 1,y + 1,w - 2,1)
    }

    sheenode.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        this.input.draw()
        return sheenode.__super__.draw.call(this)
    }

    return sheenode
})()

export default sheenode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWVub2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjs7T0FDTSxZQUFUOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7OztBQUVOLFlBQUQ7O3lCQUFVO2FBR04sVUFBSSxRQUFRLFFBQVE7O1FBQWpCO1FBQVE7UUFBUTs7Ozs7Ozs7OztpREFFVCxLQUFDLE9BQU8sS0FBQztRQUVmLEtBQUMsU0FBUztRQUVWLEtBQUMsU0FBUyxLQUFLLE1BQU0sTUFBTTtRQUUzQixLQUFDLFlBQWEsTUFBTyxLQUFDLFVBQVUsS0FBQztRQUVqQyxLQUFDLE1BQU0sR0FBRyxTQUFTLEtBQUM7UUFFcEIsS0FBQyxZQUFZOzs7d0JBRWpCOztRQUVJLEtBQUMsUUFBUTtRQUNULEtBQUMsTUFBTTtlQUNQOzs7d0JBRUo7O1FBRUksS0FBQyxNQUFNLElBQUk7O2VBSVgsS0FBSyxLQUFLOzs7d0JBRWQ7O1lBRVMsS0FBQzs7Ozs7UUFJTixLQUFDLE1BQU0sTUFBTTtlQUViLEtBQUssS0FBSzs7O3dCQUVkLG9CQUFPLEtBQUk7O1lBRUksS0FBQzs7bUJBQVY7O1lBRUMsS0FBQyxVQUFTOzttQkFFUCxLQUFDLE1BQU0sTUFBTSxJQUFJOztlQUV2Qjs7O3dCQUVKLDRCQUFlLFFBQU87Ozt3QkFFdEIsc0JBQVM7Ozs7WUFFQSxLQUFDOzs7O1FBQ04sTUFBTSxLQUFDLE1BQU0sUUFBUTthQUFtQixjQUFBLElBQUs7O21CQUFaOztvREFDM0I7Ozt3QkFFVixxQkFBUSxHQUFFLEdBQUUsR0FBRTs7NENBRUosRUFBRSxFQUFFLEVBQUU7O2VBQ1osS0FBQyxNQUFNLE9BQU8sSUFBRSxFQUFFLElBQUUsRUFBRSxJQUFFLEVBQUU7Ozt3QkFFOUI7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssS0FBQyxNQUFNO1FBRTNDLEtBQUMsTUFBTTs7OztXQXRFZDs7O2VBMEVNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheenode.kode
