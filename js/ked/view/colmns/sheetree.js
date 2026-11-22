var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var sheetree

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let nfs = kxk.nfs

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import belt from "../../edit/tool/belt.js"

import indexer from "../../index/indexer.js"

import layout from "../../popo/layout.js"

import filterchoice from "../menu/filterchoice.js"


sheetree = (function ()
{
    _k_.extend(sheetree, filterchoice)
    function sheetree (editor, name, features)
    {
        this.editor = editor
        this.name = name
    
        this["jumpTo"] = this["jumpTo"].bind(this)
        this["onCursorsSet"] = this["onCursorsSet"].bind(this)
        this["onSheetEdited"] = this["onSheetEdited"].bind(this)
        this["addItemsForTree"] = this["addItemsForTree"].bind(this)
        this["itemsForTree"] = this["itemsForTree"].bind(this)
        this["reloadTree"] = this["reloadTree"].bind(this)
        this["onEditorResize"] = this["onEditorResize"].bind(this)
        this["onNode"] = this["onNode"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["showRect"] = this["showRect"].bind(this)
        this["hideRect"] = this["hideRect"].bind(this)
        this["select"] = this["select"].bind(this)
        this["hide"] = this["hide"].bind(this)
        sheetree.__super__.constructor.call(this,this.editor.screen,this.name,features)
        this.editor.state.on('cursorsSet',this.onCursorsSet)
        post.on('editor.resize',this.onEditorResize)
        post.on('sheetree.select',this.select)
        post.on('sheet.edited',this.onSheetEdited)
        post.on('popup.show',this.hideRect)
        post.on('popup.hide',this.showRect)
    }

    sheetree.prototype["hide"] = function ()
    {
        post.emit('cells.rect')
        return sheetree.__super__.hide.call(this)
    }

    sheetree.prototype["select"] = function (row)
    {
        sheetree.__super__.select.call(this,row)
    
        return this.showRect()
    }

    sheetree.prototype["hideRect"] = function ()
    {
        return post.emit('cells.rect')
    }

    sheetree.prototype["showRect"] = function ()
    {
        if (this.editor.state.rectree && this.current())
        {
            return post.emit('cells.rect',this.current().rect.abs)
        }
    }

    sheetree.prototype["grabFocus"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        return sheetree.__super__.grabFocus.call(this)
    }

    sheetree.prototype["onNode"] = function (node)
    {
        delete this.editor.state.rectreeCols
        delete this.editor.state.rectreeRows
        return this.onEditorResize()
    }

    sheetree.prototype["onEditorResize"] = function ()
    {
        var row

        if (this.hidden() || this.collapsed())
        {
            return
        }
        row = this.currentIndex()
        this.reloadTree()
        this.highlight(row)
        return this.showRect()
    }

    sheetree.prototype["reloadTree"] = function ()
    {
        var items, _57_32_

        if ((this.editor.state.rectree != null))
        {
            layout.titlify(this.editor.cells,this.editor.state.rectree)
            items = this.itemsForTree(this.editor.state.rectree)
            return this.set(items,'title')
        }
        else
        {
            return this.hideRect()
        }
    }

    sheetree.prototype["itemsForTree"] = function (node)
    {
        var items

        items = []
        this.addItemsForTree(node,items)
        return items
    }

    sheetree.prototype["addItemsForTree"] = function (node, items)
    {
        var child, _76_37_, _78_35_

        node.index = items.length
        if ((node.title != null))
        {
            items.push(node)
        }
        var list = ((_78_35_=node.children) != null ? _78_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.addItemsForTree(child,items)
        }
    }

    sheetree.prototype["onSheetEdited"] = function ()
    {
        this.reloadTree()
        return this.showRect()
    }

    sheetree.prototype["onCursorsSet"] = function ()
    {
        var cell, item, _88_32_, _91_29_

        if ((this.editor.state.rectree != null))
        {
            cell = this.editor.state.sheetCellForPos(this.editor.state.mainCursor())
            if (item = layout.nodeForPos(this.editor.cells,this.editor.state.rectree,cell))
            {
                if ((item.index != null) && (0 <= item.index && item.index < this.fuzzied.length))
                {
                    this.highlight(item.index)
                    this.showRect()
                    return this.emit('tree.node',this.current())
                }
            }
        }
    }

    sheetree.prototype["jumpTo"] = function (choice)
    {
        var node, pos, rect, scale

        rect = choice.rect.abs
        scale = layout.scaleOf(choice)
        pos = this.editor.state.sheetPosForCell([rect.x,rect.y + scale - 1])
        post.emit('goto.line',pos[1],pos[0])
        node = this.current()
        node.index = this.currentIndex()
        return this.emit('tree.node',node)
    }

    sheetree.prototype["selectNext"] = function ()
    {
        sheetree.__super__.selectNext.call(this)
    
        return this.jumpTo(this.current())
    }

    sheetree.prototype["selectPrev"] = function ()
    {
        sheetree.__super__.selectPrev.call(this)
    
        return this.jumpTo(this.current())
    }

    sheetree.prototype["emitAction"] = function (action, choice, event)
    {
        if (_k_.empty(choice))
        {
            console.error('funtree.emitAction -- empty choice ▸ action:',action)
            console.error('funtree.emitAction -- empty choice ▸ event:',event)
            return
        }
        switch (action)
        {
            case 'space':
                this.jumpTo(choice)
                this.grabFocus()
                return

            case 'right':
                this.selectNext()
                choice = this.choiceAtRow(this.currentIndex())
                this.jumpTo(choice)
                this.grabFocus()
                return

            case 'left':
                this.selectPrev()
                choice = this.choiceAtRow(this.currentIndex())
                this.jumpTo(choice)
                this.grabFocus()
                return

            case 'click':
            case 'return':
                this.jumpTo(choice)
                post.emit('focus','editor')
                return

            case 'drag':
                this.jumpTo(choice)
                return

        }

        return sheetree.__super__.emitAction.call(this,action,choice,event)
    }

    return sheetree
})()

export default sheetree;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXRyZWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWV0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFNOztPQUNYLFlBQVo7T0FBa0IsWUFBbEI7T0FBd0IsWUFBeEI7O09BQ1ksV0FBUDs7T0FDTyxjQUFYOztPQUNXLGFBQVo7O09BQ1ksbUJBQWY7OztBQUVOLFlBQUQ7O3lCQUFVO2FBRU4sVUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7O2lEQUVELEtBQUMsT0FBTyxPQUFPLEtBQUMsS0FBSztRQUUzQixLQUFDLE9BQU8sTUFBTSxHQUFHLGFBQWEsS0FBQztRQUUvQixLQUFLLEdBQUcsZ0JBQWtCLEtBQUM7UUFDM0IsS0FBSyxHQUFHLGtCQUFrQixLQUFDO1FBQzNCLEtBQUssR0FBRyxlQUFrQixLQUFDO1FBQzNCLEtBQUssR0FBRyxhQUFrQixLQUFDO1FBQzNCLEtBQUssR0FBRyxhQUFrQixLQUFDOzs7d0JBRS9COztRQUNJLEtBQUssS0FBSzs7Ozt3QkFHZCxxQkFBUTs7NENBRUU7O2VBQ04sS0FBQzs7O3dCQUVMOztlQUFhLEtBQUssS0FBSzs7O3dCQUN2Qjs7WUFBZ0IsS0FBQyxPQUFPLE1BQU0sV0FBWSxLQUFDOzttQkFBWSxLQUFLLEtBQUssYUFBYSxLQUFDLFVBQVUsS0FBSzs7Ozt3QkFFOUY7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7Ozs7d0JBR3ZCLHFCQUFROztlQUVHLEtBQUMsT0FBTyxNQUFNO2VBQ2QsS0FBQyxPQUFPLE1BQU07ZUFDckIsS0FBQzs7O3dCQUVMOzs7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsTUFBTSxLQUFDO1FBQ1AsS0FBQztRQUNELEtBQUMsVUFBVTtlQUNYLEtBQUM7Ozt3QkFFTDs7OzthQUVPLEtBQUMsT0FBTyxNQUFNOztZQUNiLE9BQU8sUUFBUSxLQUFDLE9BQU8sTUFBTSxLQUFDLE9BQU8sTUFBTTtZQUMzQyxRQUFRLEtBQUMsYUFBYSxLQUFDLE9BQU8sTUFBTTttQkFDcEMsS0FBQyxJQUFJLE1BQU07Ozs7bUJBRVgsS0FBQzs7Ozt3QkFFVCwyQkFBYzs7OztRQUVWO1FBRUEsS0FBQyxnQkFBZ0IsS0FBSztlQUV0Qjs7O3dCQUVKLDhCQUFpQixNQUFLOzs7O1FBRWxCLEtBQUssUUFBUSxNQUFNO2FBRUEsS0FBSzs7WUFBeEIsTUFBTSxLQUFLOzs2QkFFRSxLQUFLOzs7WUFBZDtZQUNBLEtBQUMsZ0JBQWdCLE1BQU07Ozs7d0JBRS9COztRQUVJLEtBQUM7ZUFDRCxLQUFDOzs7d0JBRUw7Ozs7YUFFTyxLQUFDLE9BQU8sTUFBTTs7WUFDYixPQUFPLEtBQUMsT0FBTyxNQUFNLGdCQUFnQixLQUFDLE9BQU8sTUFBTTtnQkFDaEQsT0FBTyxPQUFPLFdBQVcsS0FBQyxPQUFPLE1BQU0sS0FBQyxPQUFPLE1BQU0sUUFBUTs7cUJBQ3pELEtBQUssbUJBQVcsS0FBSyxLQUFLLFNBQUwsS0FBSyxRQUFRLEtBQUMsUUFBUTs7b0JBQzFDLEtBQUMsVUFBVSxLQUFLO29CQUNoQixLQUFDOzJCQUNELEtBQUMsS0FBSyxZQUFZLEtBQUM7Ozs7Ozt3QkFFbkMscUJBQVE7Ozs7UUFFSixPQUFRLE9BQU8sS0FBSztRQUNwQixRQUFRLE9BQU8sUUFBUTtRQUN2QixNQUFRLEtBQUMsT0FBTyxNQUFNLGlCQUFpQixLQUFLLEVBQUUsS0FBSyxJQUFFLFFBQU07UUFDM0QsS0FBSyxLQUFLLFlBQVksSUFBSSxHQUFHLElBQUk7UUFDakMsT0FBTyxLQUFDO1FBQ1IsS0FBSyxRQUFRLEtBQUM7ZUFDZCxLQUFDLEtBQUssWUFBWTs7O3dCQUV0Qjs7OztlQUF3QixLQUFDLE9BQU8sS0FBQzs7O3dCQUNqQzs7OztlQUF3QixLQUFDLE9BQU8sS0FBQzs7O3dCQUVqQyx5QkFBWSxRQUFPLFFBQU87O3NCQUViOztZQUNMLGNBQU0sK0NBQStDO1lBQ3JELGNBQU0sOENBQThDOzs7Z0JBR2pEOztpQkFFSDtnQkFFSSxLQUFDLE9BQU87Z0JBQ1IsS0FBQzs7O2lCQUdMO2dCQUVJLEtBQUM7Z0JBQ0QsU0FBUyxLQUFDLFlBQVksS0FBQztnQkFDdkIsS0FBQyxPQUFPO2dCQUNSLEtBQUM7OztpQkFHTDtnQkFFSSxLQUFDO2dCQUNELFNBQVMsS0FBQyxZQUFZLEtBQUM7Z0JBQ3ZCLEtBQUMsT0FBTztnQkFDUixLQUFDOzs7aUJBR0w7aUJBQ0E7Z0JBRUksS0FBQyxPQUFPO2dCQUNSLEtBQUssS0FBSyxRQUFROzs7aUJBR3RCO2dCQUVJLEtBQUMsT0FBTzs7Ozs7dURBS1YsT0FBTyxPQUFPOzs7V0FqSjNCOzs7ZUFtSk0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheetree.kode
