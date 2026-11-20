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
    
        var input

        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["onNode"] = this["onNode"].bind(this)
        this["onMouseEnter"] = this["onMouseEnter"].bind(this)
        this["onInputChange"] = this["onInputChange"].bind(this)
        sheenode.__super__.constructor.call(this,this.editor.screen,this.name)
        this.height = 7
        this.setColor('bg',theme.uniko.bg)
        this.typeArg = new tripleinput(this.screen,`${this.name}_typearg`,['type','arg'])
        this.xwrInput = new tripleinput(this.screen,`${this.name}_xwr`,['x','w','r'],{maxsize:5,number:true})
        this.yhbInput = new tripleinput(this.screen,`${this.name}_yhb`,['y','h','b'],{maxsize:5,number:true})
        this.items = [this.typeArg,this.xwrInput,this.yhbInput]
        this.focusRing = this.typeArg.inputs.concat(this.xwrInput.inputs).concat(this.yhbInput.inputs)
        this.mouseItems = this.items
        this.wheelItems = [this.xwrInput,this.yhbInput]
        var list = _k_.list(this.focusRing)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            input = list[_a_]
            input.on('valueChange',this.onInputChange)
        }
        this.isVisible = false
    }

    sheenode.prototype["onInputChange"] = function (input)
    {
        if (input.name.endsWith('xwr_x'))
        {
            this.node.x = input.value
        }
        else if (input.name.endsWith('xwr_w'))
        {
            this.node.w = input.value
            delete this.node.r
            this.xwrInput.inputs[2].set('')
        }
        else if (input.name.endsWith('xwr_r'))
        {
            this.node.r = input.value
            delete this.node.w
            this.xwrInput.inputs[1].set('')
        }
        else if (input.name.endsWith('yhb_y'))
        {
            this.node.y = input.value
        }
        else if (input.name.endsWith('yhb_h'))
        {
            this.node.h = input.value
            delete this.node.b
            this.yhbInput.inputs[2].set('')
        }
        else if (input.name.endsWith('yhb_b'))
        {
            this.node.b = input.value
            delete this.node.h
            this.yhbInput.inputs[1].set('')
        }
        return this.emit('shee.node',this.node)
    }

    sheenode.prototype["onMouseEnter"] = function (event)
    {
        if (this.node)
        {
            post.emit('sheetree.select',this.node.index)
        }
        return sheenode.__super__.onMouseEnter.call(this,event)
    }

    sheenode.prototype["onNode"] = function (node)
    {
        this.node = node
    
        var idx, _52_48_, _53_47_, _55_46_, _56_46_, _57_46_, _59_46_, _60_46_, _61_46_

        this.typeArg.inputs[0].set(String(((_52_48_=node.type) != null ? _52_48_ : '')))
        this.typeArg.inputs[1].set(String(((_53_47_=node.arg) != null ? _53_47_ : '')))
        this.xwrInput.inputs[0].set(String(((_55_46_=node.x) != null ? _55_46_ : '')))
        this.xwrInput.inputs[1].set(String(((_56_46_=node.w) != null ? _56_46_ : '')))
        this.xwrInput.inputs[2].set(String(((_57_46_=node.r) != null ? _57_46_ : '')))
        this.yhbInput.inputs[0].set(String(((_59_46_=node.y) != null ? _59_46_ : '')))
        this.yhbInput.inputs[1].set(String(((_60_46_=node.h) != null ? _60_46_ : '')))
        this.yhbInput.inputs[2].set(String(((_61_46_=node.b) != null ? _61_46_ : '')))
        idx = (this.node.bg && !this.node.fg ? 1 : 0)
        return post.emit('colorpicker.show',[this.node.fg,this.node.bg],{focus:false,select:idx})
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

    return sheenode
})()

export default sheenode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWVub2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjs7T0FDTSxZQUFUOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7T0FBdUIsa0JBQXZCOzs7QUFFTixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUTs7UUFBVDtRQUFROzs7Ozs7Ozs7aURBRUQsS0FBQyxPQUFPLE9BQU8sS0FBQztRQUV0QixLQUFDLFNBQVM7UUFFVixLQUFDLFNBQVMsS0FBSyxNQUFNLE1BQU07UUFFM0IsS0FBQyxjQUFlLFlBQVksS0FBQyxVQUFVLEtBQUMsZ0JBQWlCLE9BQU87UUFDaEUsS0FBQyxlQUFlLFlBQVksS0FBQyxVQUFVLEtBQUMsWUFBYSxJQUFJLElBQUksTUFBSyxRQUFRLEVBQUUsT0FBTztRQUNuRixLQUFDLGVBQWUsWUFBWSxLQUFDLFVBQVUsS0FBQyxZQUFhLElBQUksSUFBSSxNQUFLLFFBQVEsRUFBRSxPQUFPO1FBRW5GLEtBQUMsU0FBYyxLQUFDLFFBQVEsS0FBQyxTQUFTLEtBQUM7UUFDbkMsS0FBQyxZQUFhLEtBQUMsUUFBUSxPQUFPLE9BQU8sS0FBQyxTQUFTLFFBQVEsT0FBTyxLQUFDLFNBQVM7UUFDeEUsS0FBQyxhQUFhLEtBQUM7UUFDZixLQUFDLGNBQWMsS0FBQyxTQUFTLEtBQUM7NEJBRWIsS0FBQzs7O1lBQVY7WUFDQSxNQUFNLEdBQUcsY0FBYyxLQUFDOztRQUU1QixLQUFDLFlBQVk7Ozt3QkFFakIsNEJBQWU7O1lBR1AsTUFBTSxLQUFLLFNBQVM7O1lBQVUsS0FBQyxLQUFLLElBQUksTUFBTTs7aUJBQzlDLE1BQU0sS0FBSyxTQUFTOztZQUFVLEtBQUMsS0FBSyxJQUFJLE1BQU07bUJBQWUsS0FBQyxLQUFLO1lBQUksS0FBQyxTQUFTLE9BQU8sR0FBRyxJQUFJOztpQkFDL0YsTUFBTSxLQUFLLFNBQVM7O1lBQVUsS0FBQyxLQUFLLElBQUksTUFBTTttQkFBZSxLQUFDLEtBQUs7WUFBSSxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUk7O2lCQUMvRixNQUFNLEtBQUssU0FBUzs7WUFBVSxLQUFDLEtBQUssSUFBSSxNQUFNOztpQkFDOUMsTUFBTSxLQUFLLFNBQVM7O1lBQVUsS0FBQyxLQUFLLElBQUksTUFBTTttQkFBZSxLQUFDLEtBQUs7WUFBSSxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUk7O2lCQUMvRixNQUFNLEtBQUssU0FBUzs7WUFBVSxLQUFDLEtBQUssSUFBSSxNQUFNO21CQUFlLEtBQUMsS0FBSztZQUFJLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSTs7ZUFFbkcsS0FBQyxLQUFLLFlBQVksS0FBQzs7O3dCQUV2QiwyQkFBYzs7WUFFUCxLQUFDOztZQUNBLEtBQUssS0FBSyxrQkFBa0IsS0FBQyxLQUFLOzt5REFFaEM7Ozt3QkFFVixxQkFBUzs7UUFBRDs7OztRQUVKLEtBQUMsUUFBUSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLDBCQUFPO1FBQzFDLEtBQUMsUUFBUSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHlCQUFNO1FBRXpDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJO1FBQ3hDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJO1FBQ3hDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJO1FBRXhDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJO1FBQ3hDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJO1FBQ3hDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJO1FBRXhDLE9BQU0sS0FBQyxLQUFLLE9BQVcsS0FBQyxLQUFLLEtBQUssSUFBSTtlQUN0QyxLQUFLLEtBQUssb0JBQW9CLEtBQUMsS0FBSyxHQUFHLEtBQUMsS0FBSyxLQUFJLE1BQU0sTUFBTSxPQUFPOzs7d0JBRXhFLHFCQUFRLEdBQUUsR0FBRSxHQUFFOzs0Q0FFSixFQUFFLEVBQUUsRUFBRTs7ZUFFWixLQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFDOzs7d0JBRTFCOzs7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssS0FBQyxNQUFNOzRCQUUvQixLQUFDOzs7WUFBVDtZQUNBLEtBQUs7Ozs7O1dBekVoQjs7O2VBNkVNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheenode.kode
