var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
    function sheenode (editor, name, funcol)
    {
        this.editor = editor
        this.name = name
        this.funcol = funcol
    
        var input

        this["draw"] = this["draw"].bind(this)
        this["layout"] = this["layout"].bind(this)
        this["onNode"] = this["onNode"].bind(this)
        this["onMouseEnter"] = this["onMouseEnter"].bind(this)
        this["onArgAction"] = this["onArgAction"].bind(this)
        this["onTypeAction"] = this["onTypeAction"].bind(this)
        this["onHeightChange"] = this["onHeightChange"].bind(this)
        this["onInputChange"] = this["onInputChange"].bind(this)
        sheenode.__super__.constructor.call(this,this.editor.screen,this.name)
        this.height = 7
        this.setColor('bg',theme.uniko.bg)
        this.typeArg = new tripleinput(this.screen,`${this.name}_typearg`,['type','arg'])
        this.xwrInput = new tripleinput(this.screen,`${this.name}_xwr`,['x','w','r'],{number:true,min:0,max:999,percent:true})
        this.yhbInput = new tripleinput(this.screen,`${this.name}_yhb`,['y','h','b'],{number:true,min:0,max:999,percent:true})
        this.yhbInput.inputs[1].opt = Object.assign({},this.yhbInput.inputs[1].opt,{scaled:true})
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
        this.typeArg.inputs[0].on('action',this.onTypeAction)
        this.typeArg.inputs[1].on('action',this.onArgAction)
        this.isVisible = false
    }

    sheenode.prototype["onInputChange"] = function (value, name)
    {
        if (name.endsWith('yhb_h'))
        {
            return this.onHeightChange(value)
        }
        if (!(_k_.isStr(value) && value.endsWith('%')))
        {
            value = parseInt(value)
        }
        if (name.endsWith('xwr_x'))
        {
            this.node.x = value
        }
        else if (name.endsWith('xwr_w'))
        {
            this.node.w = value
            delete this.node.r
            this.xwrInput.inputs[2].set('')
        }
        else if (name.endsWith('xwr_r'))
        {
            this.node.r = value
            delete this.node.w
            this.xwrInput.inputs[1].set('')
        }
        else if (name.endsWith('yhb_y'))
        {
            this.node.y = value
        }
        else if (name.endsWith('yhb_b'))
        {
            this.node.b = value
            delete this.node.h
            this.yhbInput.inputs[1].set('')
        }
        return this.emit('shee.node',this.node)
    }

    sheenode.prototype["onHeightChange"] = function (value)
    {
        var parsed

        parsed = layout.parseHeight(value)
        if (!(parsed != null))
        {
            return
        }
        this.node.h = parsed.h
        if (parsed.scale > 1)
        {
            this.node.scale = parsed.scale
        }
        else
        {
            delete this.node.scale
        }
        delete this.node.b
        this.yhbInput.inputs[2].set('')
        return this.emit('shee.node',this.node)
    }

    sheenode.prototype["onTypeAction"] = function (action, text)
    {
        var old

        if (action !== 'change')
        {
            return
        }
        old = layout.typeOf(this.node)
        if (_k_.empty(text))
        {
            if ((old != null))
            {
                delete this.node[old]
            }
        }
        else if (_k_.in(text,['erase','text','pattern','bg','fg']))
        {
            if ((old != null) && old !== text)
            {
                delete this.node[old]
            }
            this.node[text] = this.typeArg.inputs[1].current()
        }
        else
        {
            return
        }
        return this.emit('shee.node',this.node)
    }

    sheenode.prototype["onArgAction"] = function (action, text)
    {
        var type

        if (action !== 'change')
        {
            return
        }
        type = layout.typeOf(this.node)
        if (!(type != null))
        {
            return
        }
        this.node[type] = text
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
    
        var arg, idx, type, _115_46_, _116_46_, _117_46_, _119_46_, _121_46_, _124_18_

        type = layout.typeOf(node)
        arg = layout.argOf(node)
        this.typeArg.inputs[0].set(String((type != null ? type : '')))
        this.typeArg.inputs[1].set(String((arg != null ? arg : '')))
        this.xwrInput.inputs[0].set(String(((_115_46_=node.x) != null ? _115_46_ : '')))
        this.xwrInput.inputs[1].set(String(((_116_46_=node.w) != null ? _116_46_ : '')))
        this.xwrInput.inputs[2].set(String(((_117_46_=node.r) != null ? _117_46_ : '')))
        this.yhbInput.inputs[0].set(String(((_119_46_=node.y) != null ? _119_46_ : '')))
        this.yhbInput.inputs[1].set(layout.heightText(node))
        this.yhbInput.inputs[2].set(String(((_121_46_=node.b) != null ? _121_46_ : '')))
        idx = (this.node.bg && !this.node.fg ? 1 : 0)
        if ((this.funcol != null ? this.funcol.visible() : undefined) && this.funcol.active && !this.funcol.collapsed())
        {
            return post.emit('colorpicker.show',[this.node.fg,this.node.bg],{focus:false,select:idx,node:this.node})
        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWVub2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjs7T0FDTSxZQUFUOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7T0FBdUIsa0JBQXZCOztPQUNZLGFBQVQ7OztBQUVULFlBQUQ7O3lCQUFVO2FBR04sVUFBSSxRQUFRLE1BQU07O1FBQWY7UUFBUTtRQUFNOzs7Ozs7Ozs7Ozs7aURBRVAsS0FBQyxPQUFPLE9BQU8sS0FBQztRQUV0QixLQUFDLFNBQVM7UUFFVixLQUFDLFNBQVMsS0FBSyxNQUFNLE1BQU07UUFFM0IsS0FBQyxjQUFpQixZQUFZLEtBQUMsVUFBVSxLQUFDLGdCQUFpQixPQUFPO1FBQ2xFLEtBQUMsZUFBaUIsWUFBWSxLQUFDLFVBQVUsS0FBQyxZQUFhLElBQUksSUFBSSxNQUFLLE9BQU8sS0FBSyxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVE7UUFDdEcsS0FBQyxlQUFpQixZQUFZLEtBQUMsVUFBVSxLQUFDLFlBQWEsSUFBSSxJQUFJLE1BQUssT0FBTyxLQUFLLElBQUksRUFBRSxJQUFJLElBQUksUUFBUTtRQUV0RyxLQUFDLFNBQVMsT0FBTyxHQUFHLE1BQU0sT0FBTyxVQUFVLEtBQUMsU0FBUyxPQUFPLEdBQUcsS0FBSyxPQUFPO1FBRTNFLEtBQUMsU0FBYyxLQUFDLFFBQVEsS0FBQyxTQUFTLEtBQUM7UUFDbkMsS0FBQyxZQUFhLEtBQUMsUUFBUSxPQUFPLE9BQU8sS0FBQyxTQUFTLFFBQVEsT0FBTyxLQUFDLFNBQVM7UUFDeEUsS0FBQyxhQUFhLEtBQUM7UUFDZixLQUFDLGNBQWMsS0FBQyxTQUFTLEtBQUM7NEJBRWIsS0FBQzs7O1lBQVY7WUFDQSxNQUFNLEdBQUcsY0FBYyxLQUFDOztRQUU1QixLQUFDLFFBQVEsT0FBTyxHQUFHLEdBQUcsU0FBUyxLQUFDO1FBQ2hDLEtBQUMsUUFBUSxPQUFPLEdBQUcsR0FBRyxTQUFT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
//# sourceURL=../../../../kode/ked/view/colmns/sheenode.kode
