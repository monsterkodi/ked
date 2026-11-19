var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        this["focusPrev"] = this["focusPrev"].bind(this)
        this["focusNext"] = this["focusNext"].bind(this)
        this["focusDelta"] = this["focusDelta"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        sheenode.__super__.constructor.call(this,this.editor.screen,this.name)
        this.height = 8
        this.setColor('bg',theme.uniko.bg)
        this.input = new input(this.screen,`${this.name}_input`)
        this.xwrInput = new tripleinput(this.screen,`${this.name}_xwr`,['x','w','r'])
        this.yhbInput = new tripleinput(this.screen,`${this.name}_yhb`,['y','h','b'])
        this.items = [this.input,this.xwrInput,this.yhbInput]
        this.focusRing = [this.input].concat(this.xwrInput.inputs).concat(this.yhbInput.inputs)
        this.input.drawUnfocusedCursors = false
        this.input.on('action',this.onInputAction)
        this.isVisible = false
    }

    sheenode.prototype["hasFocus"] = function ()
    {
        var item

        var list = _k_.list(this.focusRing)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            if (item.hasFocus())
            {
                return true
            }
        }
        return false
    }

    sheenode.prototype["grabFocus"] = function ()
    {
        return this.focusInput()
    }

    sheenode.prototype["focusDelta"] = function (delta)
    {
        var index, item, num

        var list = _k_.list(this.focusRing)
        for (index = 0; index < list.length; index++)
        {
            item = list[index]
            if (item.hasFocus())
            {
                num = this.focusRing.length
                if ((0 <= index + delta && index + delta < num))
                {
                    if (this.focusRing[index + delta].focusable)
                    {
                        this.focusRing[index + delta].grabFocus()
                        return true
                    }
                }
                return false
            }
        }
        return false
    }

    sheenode.prototype["focusNext"] = function ()
    {
        return this.focusDelta(1)
    }

    sheenode.prototype["focusPrev"] = function ()
    {
        return this.focusDelta(-1)
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
    
        var item, o

        o = 1
        var list = _k_.list(this.items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.layout(x + 1,y + o,w - 2,1)
            o += 2
        }
    }

    sheenode.prototype["draw"] = function ()
    {
        var item

        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.cells.fill_rect(0,0,-1,-1,' ',null,this.color.bg)
        var list = _k_.list(this.items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.draw()
        }
        return sheenode.__super__.draw.call(this)
    }

    sheenode.prototype["onInputAction"] = function (action, text)
    {}

    sheenode.prototype["onMouse"] = function (event)
    {
        var item, ret

        if (this.hidden())
        {
            return
        }
        var list = _k_.list(this.items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            ret = item.onMouse(event)
            if ((ret != null ? ret.redraw : undefined))
            {
                return ret
            }
        }
        return sheenode.__super__.onMouse.call(this,event)
    }

    sheenode.prototype["onKey"] = function (key, event)
    {
        var item

        if (this.hidden())
        {
            return false
        }
        switch (event.combo)
        {
            case 'down':
            case 'tab':
                return this.focusNext()

            case 'up':
            case 'shift+tab':
                return this.focusPrev()

        }

        var list = _k_.list(this)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            if (item.hasFocus())
            {
                return item.onKey(key,event)
            }
        }
        return false
    }

    return sheenode
})()

export default sheenode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWVub2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjs7T0FDTSxZQUFUOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7T0FBdUIsa0JBQXZCOzs7QUFFTixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUTs7UUFBVDtRQUFROzs7Ozs7Ozs7Ozs7Ozs7aURBRUQsS0FBQyxPQUFPLE9BQU8sS0FBQztRQUV0QixLQUFDLFNBQVM7UUFFVixLQUFDLFNBQVMsS0FBSyxNQUFNLE1BQU07UUFFM0IsS0FBQyxZQUFlLE1BQVksS0FBQyxVQUFVLEtBQUM7UUFDeEMsS0FBQyxlQUFlLFlBQVksS0FBQyxVQUFVLEtBQUMsWUFBYSxJQUFJLElBQUk7UUFDN0QsS0FBQyxlQUFlLFlBQVksS0FBQyxVQUFVLEtBQUMsWUFBYSxJQUFJLElBQUk7UUFFN0QsS0FBQyxTQUFTLEtBQUMsTUFBTSxLQUFDLFNBQVMsS0FBQztRQUM1QixLQUFDLGFBQWEsS0FBQyxPQUFPLE9BQU8sS0FBQyxTQUFTLFFBQVEsT0FBTyxLQUFDLFNBQVM7UUFFaEUsS0FBQyxNQUFNLHVCQUF1QjtRQUU5QixLQUFDLE1BQU0sR0FBRyxTQUFTLEtBQUM7UUFFcEIsS0FBQyxZQUFZOzs7d0JBRWpCOzs7OzRCQUVnQixLQUFDOzs7WUFBVDtnQkFDRyxLQUFLOzt1QkFBZTs7O2VBQzNCOzs7d0JBRUo7O2VBQWMsS0FBQzs7O3dCQUVmLHlCQUFZOzs7OzRCQUVVLEtBQUM7YUFBVjs7WUFBTDtnQkFDRyxLQUFLOztnQkFDSixNQUFNLEtBQUMsVUFBVTtxQkFDZCxLQUFLLFFBQU0sU0FBTixRQUFNLFFBQVE7O3dCQUNmLEtBQUMsVUFBVSxRQUFNLE9BQU87O3dCQUN2QixLQUFDLFVBQVUsUUFBTSxPQUFPOytCQUN0Qjs7O3VCQUNSOzs7ZUFDVjs7O3dCQUVKOztlQUFjLEtBQUMsV0FBVzs7O3dCQUMxQjs7ZUFBYyxLQUFDLFdBQVc7Ozt3QkFFMUI7O1FBRUksS0FBQyxNQUFNO2VBQ1A7Ozt3QkFFSjs7UUFFSSxLQUFDLE1BQU0sSUFBSTs7ZUFJWCxLQUFLLEtBQUs7Ozt3QkFFZDs7WUFFUyxLQUFDOzs7OztRQUlOLEtBQUMsTUFBTSxNQUFNO2VBRWIsS0FBSyxLQUFLOzs7d0JBRWQscUJBQVEsR0FBRSxHQUFFLEdBQUU7OzRDQUVKLEVBQUUsRUFBRSxFQUFFOzs7O1FBRVosSUFBSTs0QkFDUSxLQUFDOzs7WUFBVDtZQUNBLEtBQUssT0FBTyxJQUFFLEVBQUUsSUFBRSxFQUFFLElBQUUsRUFBRTtZQUN4QixLQUFLOzs7O3dCQUViOzs7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssS0FBQyxNQUFNOzRCQUUvQixLQUFDOzs7WUFBVDtZQUNBLEtBQUs7Ozs7O3dCQUliLDRCQUFlLFFBQU87Ozt3QkFFdEIsc0JBQVM7Ozs7WUFFQSxLQUFDOzs7OzRCQUVNLEtBQUM7OztZQUFUO1lBQ0EsTUFBTSxLQUFLLFFBQVE7aUJBQWlCLGNBQUEsSUFBSzs7dUJBQVo7OztvREFFM0I7Ozt3QkFFVixvQkFBTyxLQUFJOzs7O1lBRUksS0FBQzs7bUJBQVY7O2dCQUVLLE1BQU07O2lCQUNUO2lCQUFNO3VCQUFlLEtBQUM7O2lCQUN0QjtpQkFBSTt1QkFBaUIsS0FBQzs7Ozs0QkFFZDs7O1lBQVI7Z0JBQ0csS0FBSzs7dUJBQWUsS0FBSyxNQUFNLElBQUk7OztlQUUxQzs7O1dBaEhQOzs7ZUFrSE0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheenode.kode
