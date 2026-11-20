var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
        this["onArgAction"] = this["onArgAction"].bind(this)
        this["onTypeAction"] = this["onTypeAction"].bind(this)
        this["onInputChange"] = this["onInputChange"].bind(this)
        sheenode.__super__.constructor.call(this,this.editor.screen,this.name)
        this.height = 9
        this.setColor('bg',theme.uniko.bg)
        this.typeArg = new tripleinput(this.screen,`${this.name}_typearg`,['type','arg'])
        this.xwrInput = new tripleinput(this.screen,`${this.name}_xwr`,['x','w','r'],{maxsize:5,number:true,min:0,max:999})
        this.yhbInput = new tripleinput(this.screen,`${this.name}_yhb`,['y','h','b'],{maxsize:5,number:true,min:0,max:999})
        this.scaleInput = new tripleinput(this.screen,`${this.name}_scale`,['scale'],{maxsize:5,number:true,min:1,max:7})
        this.items = [this.typeArg,this.xwrInput,this.yhbInput,this.scaleInput]
        this.focusRing = this.typeArg.inputs.concat(this.xwrInput.inputs).concat(this.yhbInput.inputs).concat(this.scaleInput.inputs)
        this.mouseItems = this.items
        this.wheelItems = [this.xwrInput,this.yhbInput,this.scaleInput]
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
        else if (input.name.endsWith('scale_scale'))
        {
            this.node.scale = input.value
        }
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
    
        var arg, idx, type, _100_52_, _92_46_, _93_46_, _94_46_, _96_46_, _97_46_, _98_46_

        type = layout.typeOf(node)
        arg = layout.argOf(node)
        this.typeArg.inputs[0].set(String((type != null ? type : '')))
        this.typeArg.inputs[1].set(String((arg != null ? arg : '')))
        this.xwrInput.inputs[0].set(String(((_92_46_=node.x) != null ? _92_46_ : '')))
        this.xwrInput.inputs[1].set(String(((_93_46_=node.w) != null ? _93_46_ : '')))
        this.xwrInput.inputs[2].set(String(((_94_46_=node.r) != null ? _94_46_ : '')))
        this.yhbInput.inputs[0].set(String(((_96_46_=node.y) != null ? _96_46_ : '')))
        this.yhbInput.inputs[1].set(String(((_97_46_=node.h) != null ? _97_46_ : '')))
        this.yhbInput.inputs[2].set(String(((_98_46_=node.b) != null ? _98_46_ : '')))
        this.scaleInput.inputs[0].set(String(((_100_52_=node.scale) != null ? _100_52_ : '')))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWVub2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjs7T0FDTSxZQUFUOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7T0FBdUIsa0JBQXZCOztPQUNZLGFBQVQ7OztBQUVULFlBQUQ7O3lCQUFVO2FBR04sVUFBSSxRQUFROztRQUFUO1FBQVE7Ozs7Ozs7Ozs7O2lEQUVELEtBQUMsT0FBTyxPQUFPLEtBQUM7UUFFdEIsS0FBQyxTQUFTO1FBRVYsS0FBQyxTQUFTLEtBQUssTUFBTSxNQUFNO1FBRTNCLEtBQUMsY0FBaUIsWUFBWSxLQUFDLFVBQVUsS0FBQyxnQkFBaUIsT0FBTztRQUNsRSxLQUFDLGVBQWlCLFlBQVksS0FBQyxVQUFVLEtBQUMsWUFBYSxJQUFJLElBQUksTUFBSyxRQUFRLEVBQUUsT0FBTyxLQUFLLElBQUksRUFBRSxJQUFJO1FBQ3BHLEtBQUMsZUFBaUIsWUFBWSxLQUFDLFVBQVUsS0FBQyxZQUFhLElBQUksSUFBSSxNQUFLLFFBQVEsRUFBRSxPQUFPLEtBQUssSUFBSSxFQUFFLElBQUk7UUFDcEcsS0FBQyxpQkFBaUIsWUFBWSxLQUFDLFVBQVUsS0FBQyxjQUFjLFVBQVMsUUFBUSxFQUFFLE9BQU8sS0FBSyxJQUFJLEVBQUUsSUFBSTtRQUVqRyxLQUFDLFNBQWMsS0FBQyxRQUFRLEtBQUMsU0FBUyxLQUFDLFNBQVMsS0FBQztRQUM3QyxLQUFDLFlBQWEsS0FBQyxRQUFRLE9BQU8sT0FBTyxLQUFDLFNBQVMsUUFBUSxPQUFPLEtBQUMsU0FBUyxRQUFRLE9BQU8sS0FBQyxXQUFXO1FBQ25HLEtBQUMsYUFBYSxLQUFDO1FBQ2YsS0FBQyxjQUFjLEtBQUMsU0FBUyxLQUFDLFNBQVMsS0FBQzs0QkFFdkIsS0FBQzs7O1lBQVY7WUFDQSxNQUFNLEdBQUcsY0FBYyxLQUFDOztRQUU1QixLQUFDLFFBQVEsT0FBTyxHQUFHLEdBQUcsU0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheenode.kode
