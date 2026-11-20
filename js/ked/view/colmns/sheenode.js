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
        this.xwrInput = new tripleinput(this.screen,`${this.name}_xwr`,['x','w','r'],{maxsize:5,number:true,min:0,max:999,percent:true})
        this.yhbInput = new tripleinput(this.screen,`${this.name}_yhb`,['y','h','b'],{maxsize:5,number:true,min:0,max:999,percent:true})
        this.scaleInput = new tripleinput(this.screen,`${this.name}_scale`,['scale'],{maxsize:5,number:true,min:1,max:7})
        this.items = [this.typeArg,this.xwrInput,this.yhbInput,this.scaleInput]
        this.focusRing = this.typeArg.inputs.concat(this.xwrInput.inputs).concat(this.yhbInput.inputs).concat(this.scaleInput.inputs)
        this.mouseItems = this.items
        this.wheelItems = [this.xwrInput,this.yhbInput,this.scaleInput]
        var list = _k_.list(this.wheelItems)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            input = list[_a_]
            input.on('valueChange',this.onInputChange)
        }
        this.typeArg.inputs[0].on('action',this.onTypeAction)
        this.typeArg.inputs[1].on('action',this.onArgAction)
        this.isVisible = false
    }

    sheenode.prototype["onInputChange"] = function (value)
    {
        if (!value.endsWith('%'))
        {
            value = parseInt(value)
        }
        if (input.name.endsWith('xwr_x'))
        {
            this.node.x = value
        }
        else if (input.name.endsWith('xwr_w'))
        {
            this.node.w = value
            delete this.node.r
            this.xwrInput.inputs[2].set('')
        }
        else if (input.name.endsWith('xwr_r'))
        {
            this.node.r = value
            delete this.node.w
            this.xwrInput.inputs[1].set('')
        }
        else if (input.name.endsWith('yhb_y'))
        {
            this.node.y = value
        }
        else if (input.name.endsWith('yhb_h'))
        {
            this.node.h = value
            delete this.node.b
            this.yhbInput.inputs[2].set('')
        }
        else if (input.name.endsWith('yhb_b'))
        {
            this.node.b = value
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
    
        var arg, idx, type, _100_46_, _102_52_, _94_46_, _95_46_, _96_46_, _98_46_, _99_46_

        type = layout.typeOf(node)
        arg = layout.argOf(node)
        this.typeArg.inputs[0].set(String((type != null ? type : '')))
        this.typeArg.inputs[1].set(String((arg != null ? arg : '')))
        this.xwrInput.inputs[0].set(String(((_94_46_=node.x) != null ? _94_46_ : '')))
        this.xwrInput.inputs[1].set(String(((_95_46_=node.w) != null ? _95_46_ : '')))
        this.xwrInput.inputs[2].set(String(((_96_46_=node.r) != null ? _96_46_ : '')))
        this.yhbInput.inputs[0].set(String(((_98_46_=node.y) != null ? _98_46_ : '')))
        this.yhbInput.inputs[1].set(String(((_99_46_=node.h) != null ? _99_46_ : '')))
        this.yhbInput.inputs[2].set(String(((_100_46_=node.b) != null ? _100_46_ : '')))
        this.scaleInput.inputs[0].set(String(((_102_52_=node.scale) != null ? _102_52_ : '')))
        idx = (this.node.bg && !this.node.fg ? 1 : 0)
        return post.emit('colorpicker.show',[this.node.fg,this.node.bg],{focus:false,select:idx,node:this.node})
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZW5vZGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWVub2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsV0FBTjs7T0FDTSxZQUFUOztPQUNTLFdBQVo7T0FBaUIsWUFBakI7T0FBdUIsa0JBQXZCOztPQUNZLGFBQVQ7OztBQUVULFlBQUQ7O3lCQUFVO2FBR04sVUFBSSxRQUFROztRQUFUO1FBQVE7Ozs7Ozs7Ozs7O2lEQUVELEtBQUMsT0FBTyxPQUFPLEtBQUM7UUFFdEIsS0FBQyxTQUFTO1FBRVYsS0FBQyxTQUFTLEtBQUssTUFBTSxNQUFNO1FBRTNCLEtBQUMsY0FBaUIsWUFBWSxLQUFDLFVBQVUsS0FBQyxnQkFBaUIsT0FBTztRQUNsRSxLQUFDLGVBQWlCLFlBQVksS0FBQyxVQUFVLEtBQUMsWUFBYSxJQUFJLElBQUksTUFBSyxRQUFRLEVBQUUsT0FBTyxLQUFLLElBQUksRUFBRSxJQUFJLElBQUksUUFBUTtRQUNoSCxLQUFDLGVBQWlCLFlBQVksS0FBQyxVQUFVLEtBQUMsWUFBYSxJQUFJLElBQUksTUFBSyxRQUFRLEVBQUUsT0FBTyxLQUFLLElBQUksRUFBRSxJQUFJLElBQUksUUFBUTtRQUNoSCxLQUFDLGlCQUFpQixZQUFZLEtBQUMsVUFBVSxLQUFDLGNBQWMsVUFBUyxRQUFRLEVBQUUsT0FBTyxLQUFLLElBQUksRUFBRSxJQUFJO1FBRWpHLEtBQUMsU0FBYyxLQUFDLFFBQVEsS0FBQyxTQUFTLEtBQUMsU0FBUyxLQUFDO1FBQzdDLEtBQUMsWUFBYSxLQUFDLFFBQVEsT0FBTyxPQUFPLEtBQUMsU0FBUyxRQUFRLE9BQU8sS0FBQyxTQUFTLFFBQVEsT0FBTyxLQUFDLFdBQVc7UUFDbkcsS0FBQyxhQUFhLEtBQUM7UUFDZixLQUFDLGNBQWMsS0FBQyxTQUFTLEtBQUMsU0FBUyxLQUFDOzRCQUV2QixLQUFDOzs7WUFBVjtZQUNBLE1BQU0sR0FBRyxjQUFjLEtBQUM7O1FBRTVCLEtBQUMsUUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheenode.kode
