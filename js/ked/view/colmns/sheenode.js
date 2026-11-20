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
    
        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["show"] = this["show"].bind(this)
        this["onNode"] = this["onNode"].bind(this)
        this["onMouseEnter"] = this["onMouseEnter"].bind(this)
        sheenode.__super__.constructor.call(this,this.editor.screen,this.name)
        this.height = 7
        this.setColor('bg',theme.uniko.bg)
        this.typeArg = new tripleinput(this.screen,`${this.name}_typearg`,['type','arg'])
        this.xwrInput = new tripleinput(this.screen,`${this.name}_xwr`,['x','w','r'],{maxsize:5,number:true})
        this.yhbInput = new tripleinput(this.screen,`${this.name}_yhb`,['y','h','b'],{maxsize:5,number:true})
        this.items = [this.typeArg,this.xwrInput,this.yhbInput]
        this.focusRing = this.typeArg.inputs.concat(this.xwrInput.inputs).concat(this.yhbInput.inputs)
        this.mouseItems = this.items
        this.isVisible = false
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
    
        var _36_48_, _37_47_, _39_46_, _40_46_, _41_46_, _43_46_, _44_46_, _45_46_

        this.typeArg.inputs[0].set(String(((_36_48_=node.type) != null ? _36_48_ : '')))
        this.typeArg.inputs[1].set(String(((_37_47_=node.arg) != null ? _37_47_ : '')))
        this.xwrInput.inputs[0].set(String(((_39_46_=node.x) != null ? _39_46_ : '')))
        this.xwrInput.inputs[1].set(String(((_40_46_=node.w) != null ? _40_46_ : '')))
        this.xwrInput.inputs[2].set(String(((_41_46_=node.r) != null ? _41_46_ : '')))
        this.yhbInput.inputs[0].set(String(((_43_46_=node.y) != null ? _43_46_ : '')))
        this.yhbInput.inputs[1].set(String(((_44_46_=node.h) != null ? _44_46_ : '')))
        return this.yhbInput.inputs[2].set(String(((_45_46_=node.b) != null ? _45_46_ : '')))
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

    return sheenode
})()

export default sheenode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWVub2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjs7T0FDTSxZQUFUOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7T0FBdUIsa0JBQXZCOzs7QUFFTixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUTs7UUFBVDtRQUFROzs7Ozs7OztpREFFRCxLQUFDLE9BQU8sT0FBTyxLQUFDO1FBRXRCLEtBQUMsU0FBUztRQUVWLEtBQUMsU0FBUyxLQUFLLE1BQU0sTUFBTTtRQUUzQixLQUFDLGNBQWUsWUFBWSxLQUFDLFVBQVUsS0FBQyxnQkFBaUIsT0FBTztRQUNoRSxLQUFDLGVBQWUsWUFBWSxLQUFDLFVBQVUsS0FBQyxZQUFhLElBQUksSUFBSSxNQUFLLFFBQVEsRUFBRSxPQUFPO1FBQ25GLEtBQUMsZUFBZSxZQUFZLEtBQUMsVUFBVSxLQUFDLFlBQWEsSUFBSSxJQUFJLE1BQUssUUFBUSxFQUFFLE9BQU87UUFFbkYsS0FBQyxTQUFjLEtBQUMsUUFBUSxLQUFDLFNBQVMsS0FBQztRQUNuQyxLQUFDLFlBQWEsS0FBQyxRQUFRLE9BQU8sT0FBTyxLQUFDLFNBQVMsUUFBUSxPQUFPLEtBQUMsU0FBUztRQUN4RSxLQUFDLGFBQWEsS0FBQztRQUVmLEtBQUMsWUFBWTs7O3dCQUVqQiwyQkFBYzs7WUFFUCxLQUFDOztZQUNBLEtBQUssS0FBSyxrQkFBa0IsS0FBQyxLQUFLOzt5REFFaEM7Ozt3QkFFVixxQkFBUzs7UUFBRDs7OztRQUVKLEtBQUMsUUFBUSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLDBCQUFPO1FBQzFDLEtBQUMsUUFBUSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHlCQUFNO1FBRXpDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJO1FBQ3hDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJO1FBQ3hDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJO1FBRXhDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJO1FBQ3hDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJO2VBQ3hDLEtBQUMsU0FBUyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxLQUFLLHVCQUFJOzs7d0JBRTVDOzs7O2VBSUksS0FBSyxLQUFLOzs7d0JBRWQ7O1lBRVMsS0FBQzs7Ozs7ZUFJTixLQUFLLEtBQUs7Ozt3QkFFZCxxQkFBUSxHQUFFLEdBQUUsR0FBRTs7NENBRUosRUFBRSxFQUFFLEVBQUU7O2VBRVosS0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBQzs7O3dCQUUxQjs7OztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLEtBQUMsTUFBTSxVQUFVLEVBQUUsRUFBRSxHQUFHLEdBQUcsSUFBSSxLQUFLLEtBQUMsTUFBTTs0QkFFL0IsS0FBQzs7O1lBQVQ7WUFDQSxLQUFLOzs7OztXQXBFaEI7OztlQXdFTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheenode.kode
