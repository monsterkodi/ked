var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var sheenode

import post from "../../../kxk/post.js"

import theme from "../../theme/theme.js"

import view from "../base/view.js"
import input from "../base/input.js"
import tripleinput from "../base/tripleinput.js"

import layout from "../../popo/layout.js"


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
    
        var arg, idx, type, _59_46_, _60_46_, _61_46_, _63_46_, _64_46_, _65_46_

        type = layout.typeOf(node)
        arg = layout.argOf(node)
        this.typeArg.inputs[0].set(String((type != null ? type : '')))
        this.typeArg.inputs[1].set(String((arg != null ? arg : '')))
        this.xwrInput.inputs[0].set(String(((_59_46_=node.x) != null ? _59_46_ : '')))
        this.xwrInput.inputs[1].set(String(((_60_46_=node.w) != null ? _60_46_ : '')))
        this.xwrInput.inputs[2].set(String(((_61_46_=node.r) != null ? _61_46_ : '')))
        this.yhbInput.inputs[0].set(String(((_63_46_=node.y) != null ? _63_46_ : '')))
        this.yhbInput.inputs[1].set(String(((_64_46_=node.h) != null ? _64_46_ : '')))
        this.yhbInput.inputs[2].set(String(((_65_46_=node.b) != null ? _65_46_ : '')))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWVub2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjs7T0FDTSxZQUFUOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7T0FBdUIsa0JBQXZCOztPQUNZLGFBQVQ7OztBQUVULFlBQUQ7O3lCQUFVO2FBR04sVUFBSSxRQUFROztRQUFUO1FBQVE7Ozs7Ozs7OztpREFFRCxLQUFDLE9BQU8sT0FBTyxLQUFDO1FBRXRCLEtBQUMsU0FBUztRQUVWLEtBQUMsU0FBUyxLQUFLLE1BQU0sTUFBTTtRQUUzQixLQUFDLGNBQWUsWUFBWSxLQUFDLFVBQVUsS0FBQyxnQkFBaUIsT0FBTztRQUNoRSxLQUFDLGVBQWUsWUFBWSxLQUFDLFVBQVUsS0FBQyxZQUFhLElBQUksSUFBSSxNQUFLLFFBQVEsRUFBRSxPQUFPO1FBQ25GLEtBQUMsZUFBZSxZQUFZLEtBQUMsVUFBVSxLQUFDLFlBQWEsSUFBSSxJQUFJLE1BQUssUUFBUSxFQUFFLE9BQU87UUFFbkYsS0FBQyxTQUFjLEtBQUMsUUFBUSxLQUFDLFNBQVMsS0FBQztRQUNuQyxLQUFDLFlBQWEsS0FBQyxRQUFRLE9BQU8sT0FBTyxLQUFDLFNBQVMsUUFBUSxPQUFPLEtBQUMsU0FBUztRQUN4RSxLQUFDLGFBQWEsS0FBQztRQUNmLEtBQUMsY0FBYyxLQUFDLFNBQVMsS0FBQzs0QkFFYixLQUFDOzs7WUFBVjtZQUNBLE1BQU0sR0FBRyxjQUFjLEtBQUM7O1FBRTVCLEtBQUMsWUFBWTs7O3dCQUVqQiw0QkFBZTs7WUFHUCxNQUFNLEtBQUssU0FBUzs7WUFBVSxLQUFDLEtBQUssSUFBSSxNQUFNOztpQkFDOUMsTUFBTSxLQUFLLFNBQVM7O1lBQVUsS0FBQyxLQUFLLElBQUksTUFBTTttQkFBZSxLQUFDLEtBQUs7WUFBSSxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUk7O2lCQUMvRixNQUFNLEtBQUssU0FBUzs7WUFBVSxLQUFDLEtBQUssSUFBSSxNQUFNO21CQUFlLEtBQUMsS0FBSztZQUFJLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSTs7aUJBQy9GLE1BQU0sS0FBSyxTQUFTOztZQUFVLEtBQUMsS0FBSyxJQUFJLE1BQU07O2lCQUM5QyxNQUFNLEtBQUssU0FBUzs7WUFBVSxLQUFDLEtBQUssSUFBSSxNQUFNO21CQUFlLEtBQUMsS0FBSztZQUFJLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSTs7aUJBQy9GLE1BQU0sS0FBSyxTQUFTOztZQUFVLEtBQUMsS0FBSyxJQUFJLE1BQU07bUJBQWUsS0FBQyxLQUFLO1lBQUksS0FBQyxTQUFTLE9BQU8sR0FBRyxJQUFJOztlQUVuRyxLQUFDLEtBQUssWUFBWSxLQUFDOzs7d0JBRXZCLDJCQUFjOztZQUVQLEtBQUM7O1lBQ0EsS0FBSyxLQUFLLGtCQUFrQixLQUFDLEtBQUs7O3lEQUVoQzs7O3dCQUVWLHFCQUFTOztRQUFEOzs7O1FBRUosT0FBTyxPQUFPLE9BQU87UUFDckIsTUFBTyxPQUFPLE1BQU07UUFFcEIsS0FBQyxRQUFRLE9BQU8sR0FBRyxJQUFJLFFBQU8sZUFBQSxPQUFPO1FBQ3JDLEtBQUMsUUFBUSxPQUFPLEdBQUcsSUFBSSxRQUFPLGNBQUEsTUFBTTtRQUVwQyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTtRQUN4QyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTtRQUN4QyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTtRQUV4QyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTtRQUN4QyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTtRQUN4QyxLQUFDLFNBQVMsT0FBTyxHQUFHLElBQUksaUJBQU8sS0FBSyx1QkFBSTtRQUV4QyxPQUFNLEtBQUMsS0FBSyxPQUFXLEtBQUMsS0FBSyxLQUFLLElBQUk7ZUFDdEMsS0FBSyxLQUFLLG9CQUFvQixLQUFDLEtBQUssR0FBRyxLQUFDLEtBQUssS0FBSSxNQUFNLE1BQU0sT0FBTzs7O3dCQUV4RSxxQkFBUSxHQUFFLEdBQUUsR0FBRTs7NENBRUosRUFBRSxFQUFFLEVBQUU7O2VBRVosS0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBQzs7O3dCQUUxQjs7OztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLEtBQUMsTUFBTSxVQUFVLEVBQUUsRUFBRSxHQUFHLEdBQUcsSUFBSSxLQUFLLEtBQUMsTUFBTTs0QkFFL0IsS0FBQzs7O1lBQVQ7WUFDQSxLQUFLOzs7OztXQTVFaEI7OztlQWdGTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheenode.kode
