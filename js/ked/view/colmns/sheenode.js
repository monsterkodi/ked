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
    
        this["onMouse"] = this["onMouse"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["onNode"] = this["onNode"].bind(this)
        sheenode.__super__.constructor.call(this,this.editor.screen,this.name)
        this.height = 7
        this.setColor('bg',theme.uniko.bg)
        this.typeArg = new tripleinput(this.screen,`${this.name}_typearg`,['type','arg'])
        this.xwrInput = new tripleinput(this.screen,`${this.name}_xwr`,['x','w','r'],{maxsize:5,number:true})
        this.yhbInput = new tripleinput(this.screen,`${this.name}_yhb`,['y','h','b'],{maxsize:5,number:true})
        this.items = [this.typeArg,this.xwrInput,this.yhbInput]
        this.focusRing = this.typeArg.inputs.concat(this.xwrInput.inputs).concat(this.yhbInput.inputs)
        this.isVisible = false
    }

    sheenode.prototype["onNode"] = function (node)
    {
        var _28_48_, _29_47_, _31_46_, _32_46_, _33_46_, _35_46_, _36_46_, _37_46_

        this.typeArg.inputs[0].set(String(((_28_48_=node.type) != null ? _28_48_ : '')))
        this.typeArg.inputs[1].set(String(((_29_47_=node.arg) != null ? _29_47_ : '')))
        this.xwrInput.inputs[0].set(String(((_31_46_=node.x) != null ? _31_46_ : '')))
        this.xwrInput.inputs[1].set(String(((_32_46_=node.w) != null ? _32_46_ : '')))
        this.xwrInput.inputs[2].set(String(((_33_46_=node.r) != null ? _33_46_ : '')))
        this.yhbInput.inputs[0].set(String(((_35_46_=node.y) != null ? _35_46_ : '')))
        this.yhbInput.inputs[1].set(String(((_36_46_=node.h) != null ? _36_46_ : '')))
        return this.yhbInput.inputs[2].set(String(((_37_46_=node.b) != null ? _37_46_ : '')))
    }

    sheenode.prototype["show"] = function ()
    {
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
        return post.emit('redraw')
    }

    sheenode.prototype["layout"] = function (x, y, w, h)
    {
        sheenode.__super__.layout.call(this,x,y,w,h)
    
        return this.layout_vbox(x,y,w,h,this.items)
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

    return sheenode
})()

export default sheenode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWVub2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjs7T0FDTSxZQUFUOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7T0FBdUIsa0JBQXZCOzs7QUFFTixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUTs7UUFBVDtRQUFROzs7Ozs7OztpREFFRCxLQUFDLE9BQU8sT0FBTyxLQUFDO1FBRXRCLEtBQUMsU0FBUztRQUVWLEtBQUMsU0FBUyxLQUFLLE1BQU0sTUFBTTtRQUUzQixLQUFDLGNBQWUsWUFBWSxLQUFDLFVBQVUsS0FBQyxnQkFBaUIsT0FBTztRQUNoRSxLQUFDLGVBQWUsWUFBWSxLQUFDLFVBQVUsS0FBQyxZQUFhLElBQUksSUFBSSxNQUFLLFFBQVEsRUFBRSxPQUFPO1FBQ25GLEtBQUMsZUFBZSxZQUFZLEtBQUMsVUFBVSxLQUFDLFlBQWEsSUFBSSxJQUFJLE1BQUssUUFBUSxFQUFFLE9BQU87UUFFbkYsS0FBQyxTQUFTLEtBQUMsUUFBUSxLQUFDLFNBQVMsS0FBQztRQUM5QixLQUFDLFlBQVksS0FBQyxRQUFRLE9BQU8sT0FBTyxLQUFDLFNBQVMsUUFBUSxPQUFPLEtBQUMsU0FBUztRQUV2RSxLQUFDLFlBQVk7Ozt3QkFFakIscUJBQVE7Ozs7UUFFSixLQUFDLFFBQVEsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSywwQkFBTztRQUMxQyxLQUFDLFFBQVEsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx5QkFBTTtRQUV6QyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTtRQUN4QyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTtRQUN4QyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTtRQUV4QyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTtRQUN4QyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTtlQUN4QyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTs7O3dCQUU1Qzs7OztlQUlJLEtBQUssS0FBSzs7O3dCQUVkOztZQUVTLEtBQUM7Ozs7O2VBSU4sS0FBSyxLQUFLOzs7d0JBRWQscUJBQVEsR0FBRSxHQUFFLEdBQUU7OzRDQUVKLEVBQUUsRUFBRSxFQUFFOztlQUVaLEtBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUM7Ozt3QkFFMUI7Ozs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixLQUFDLE1BQU0sVUFBVSxFQUFFLEVBQUUsR0FBRyxHQUFHLElBQUksS0FBSyxLQUFDLE1BQU07NEJBRS9CLEtBQUM7OztZQUFUO1lBQ0EsS0FBSzs7Ozs7d0JBSWIsc0JBQVM7Ozs7WUFFQSxLQUFDOzs7OzRCQUVNLEtBQUM7OztZQUFUO1lBQ0EsTUFBTSxLQUFLLFFBQVE7aUJBQWlCLGNBQUEsSUFBSzs7dUJBQVo7OztvREFFM0I7OztXQXZFYjs7O2VBeUVNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheenode.kode
