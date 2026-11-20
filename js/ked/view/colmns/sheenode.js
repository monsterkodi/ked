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

    sheenode.prototype["onNode"] = function (node)
    {
        var _29_48_, _30_47_, _32_46_, _33_46_, _34_46_, _36_46_, _37_46_, _38_46_

        this.typeArg.inputs[0].set(String(((_29_48_=node.type) != null ? _29_48_ : '')))
        this.typeArg.inputs[1].set(String(((_30_47_=node.arg) != null ? _30_47_ : '')))
        this.xwrInput.inputs[0].set(String(((_32_46_=node.x) != null ? _32_46_ : '')))
        this.xwrInput.inputs[1].set(String(((_33_46_=node.w) != null ? _33_46_ : '')))
        this.xwrInput.inputs[2].set(String(((_34_46_=node.r) != null ? _34_46_ : '')))
        this.yhbInput.inputs[0].set(String(((_36_46_=node.y) != null ? _36_46_ : '')))
        this.yhbInput.inputs[1].set(String(((_37_46_=node.h) != null ? _37_46_ : '')))
        return this.yhbInput.inputs[2].set(String(((_38_46_=node.b) != null ? _38_46_ : '')))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWVub2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjs7T0FDTSxZQUFUOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7T0FBdUIsa0JBQXZCOzs7QUFFTixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUTs7UUFBVDtRQUFROzs7Ozs7O2lEQUVELEtBQUMsT0FBTyxPQUFPLEtBQUM7UUFFdEIsS0FBQyxTQUFTO1FBRVYsS0FBQyxTQUFTLEtBQUssTUFBTSxNQUFNO1FBRTNCLEtBQUMsY0FBZSxZQUFZLEtBQUMsVUFBVSxLQUFDLGdCQUFpQixPQUFPO1FBQ2hFLEtBQUMsZUFBZSxZQUFZLEtBQUMsVUFBVSxLQUFDLFlBQWEsSUFBSSxJQUFJLE1BQUssUUFBUSxFQUFFLE9BQU87UUFDbkYsS0FBQyxlQUFlLFlBQVksS0FBQyxVQUFVLEtBQUMsWUFBYSxJQUFJLElBQUksTUFBSyxRQUFRLEVBQUUsT0FBTztRQUVuRixLQUFDLFNBQWMsS0FBQyxRQUFRLEtBQUMsU0FBUyxLQUFDO1FBQ25DLEtBQUMsWUFBYSxLQUFDLFFBQVEsT0FBTyxPQUFPLEtBQUMsU0FBUyxRQUFRLE9BQU8sS0FBQyxTQUFTO1FBQ3hFLEtBQUMsYUFBYSxLQUFDO1FBRWYsS0FBQyxZQUFZOzs7d0JBRWpCLHFCQUFROzs7O1FBRUosS0FBQyxRQUFRLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEtBQUssMEJBQU87UUFDMUMsS0FBQyxRQUFRLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEtBQUsseUJBQU07UUFFekMsS0FBQyxTQUFTLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEtBQUssdUJBQUk7UUFDeEMsS0FBQyxTQUFTLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEtBQUssdUJBQUk7UUFDeEMsS0FBQyxTQUFTLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEtBQUssdUJBQUk7UUFFeEMsS0FBQyxTQUFTLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEtBQUssdUJBQUk7UUFDeEMsS0FBQyxTQUFTLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEtBQUssdUJBQUk7ZUFDeEMsS0FBQyxTQUFTLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEtBQUssdUJBQUk7Ozt3QkFFNUM7Ozs7ZUFJSSxLQUFLLEtBQUs7Ozt3QkFFZDs7WUFFUyxLQUFDOzs7OztlQUlOLEtBQUssS0FBSzs7O3dCQUVkLHFCQUFRLEdBQUUsR0FBRSxHQUFFOzs0Q0FFSixFQUFFLEVBQUUsRUFBRTs7ZUFFWixLQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFDOzs7d0JBRTFCOzs7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsS0FBQyxNQUFNLFVBQVUsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEtBQUssS0FBQyxNQUFNOzRCQUUvQixLQUFDOzs7WUFBVDtZQUNBLEtBQUs7Ozs7O1dBN0RoQjs7O2VBaUVNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheenode.kode
