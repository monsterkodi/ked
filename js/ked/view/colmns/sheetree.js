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
        this["select"] = this["select"].bind(this)
        this["hide"] = this["hide"].bind(this)
        sheetree.__super__.constructor.call(this,this.editor.screen,this.name,features)
        this.editor.state.on('cursorsSet',this.onCursorsSet)
        post.on('editor.resize',this.onEditorResize)
        post.on('sheetree.select',this.select)
        post.on('sheet.edited',this.onSheetEdited)
    }

    sheetree.prototype["hide"] = function ()
    {
        post.emit('cells.rect')
        return sheetree.__super__.hide.call(this)
    }

    sheetree.prototype["select"] = function (row)
    {
        sheetree.__super__.select.call(this,row)
    
        return post.emit('cells.rect',this.current().rect.abs)
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
        return post.emit('cells.rect',this.current().rect.abs)
    }

    sheetree.prototype["reloadTree"] = function ()
    {
        var items, _52_32_

        if ((this.editor.state.rectree != null))
        {
            layout.titlify(this.editor.cells,this.editor.state.rectree)
            items = this.itemsForTree(this.editor.state.rectree)
            return this.set(items,'title')
        }
        else
        {
            return post.emit('cells.rect')
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
        var child, _71_37_, _73_35_

        node.index = items.length
        if ((node.title != null))
        {
            items.push(node)
        }
        var list = ((_73_35_=node.children) != null ? _73_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.addItemsForTree(child,items)
        }
    }

    sheetree.prototype["onSheetEdited"] = function ()
    {
        return this.reloadTree()
    }

    sheetree.prototype["onCursorsSet"] = function ()
    {
        var item, node, _82_32_, _84_29_

        if ((this.editor.state.rectree != null))
        {
            if (item = layout.nodeForPos(this.editor.cells,this.editor.state.rectree,this.editor.state.mainCursor()))
            {
                if ((item.index != null) && (0 <= item.index && item.index < this.fuzzied.length))
                {
                    this.highlight(item.index)
                    node = this.current()
                    post.emit('cells.rect',node.rect.abs)
                    return this.emit('tree.node',node)
                }
            }
        }
    }

    sheetree.prototype["jumpTo"] = function (choice)
    {
        var node, rect

        rect = choice.rect.abs
        post.emit('goto.line',rect.y,rect.x)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXRyZWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWV0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFNOztPQUNYLFlBQVo7T0FBa0IsWUFBbEI7T0FBd0IsWUFBeEI7O09BQ1ksV0FBUDs7T0FDTyxjQUFYOztPQUNXLGFBQVo7O09BQ1ksbUJBQWY7OztBQUVOLFlBQUQ7O3lCQUFVO2FBRU4sVUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7OztpREFFRCxLQUFDLE9BQU8sT0FBTyxLQUFDLEtBQUs7UUFFM0IsS0FBQyxPQUFPLE1BQU0sR0FBRyxhQUFhLEtBQUM7UUFFL0IsS0FBSyxHQUFHLGdCQUFrQixLQUFDO1FBQzNCLEtBQUssR0FBRyxrQkFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUcsZUFBa0IsS0FBQzs7O3dCQUUvQjs7UUFDSSxLQUFLLEtBQUs7Ozs7d0JBR2QscUJBQVE7OzRDQUVFOztlQUNOLEtBQUssS0FBSyxhQUFhLEtBQUMsVUFBVSxLQUFLOzs7d0JBRTNDOztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7Ozs7O3dCQUd2QixxQkFBUTs7ZUFFRyxLQUFDLE9BQU8sTUFBTTtlQUNkLEtBQUMsT0FBTyxNQUFNO2VBQ3JCLEtBQUM7Ozt3QkFFTDs7OztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLE1BQU0sS0FBQztRQUNQLEtBQUM7UUFDRCxLQUFDLFVBQVU7ZUFDWCxLQUFLLEtBQUssYUFBYSxLQUFDLFVBQVUsS0FBSzs7O3dCQUUzQzs7OzthQUVPLEtBQUMsT0FBTyxNQUFNOztZQUNiLE9BQU8sUUFBUSxLQUFDLE9BQU8sTUFBTSxLQUFDLE9BQU8sTUFBTTtZQUMzQyxRQUFRLEtBQUMsYUFBYSxLQUFDLE9BQU8sTUFBTTttQkFDcEMsS0FBQyxJQUFJLE1BQU07Ozs7bUJBRVgsS0FBSyxLQUFLOzs7O3dCQUVsQiwyQkFBYzs7OztRQUVWO1FBRUEsS0FBQyxnQkFBZ0IsS0FBSztlQUV0Qjs7O3dCQUVKLDhCQUFpQixNQUFLOzs7O1FBRWxCLEtBQUssUUFBUSxNQUFNO2FBRUEsS0FBSzs7WUFBeEIsTUFBTSxLQUFLOzs2QkFFRSxLQUFLOzs7WUFBZDtZQUNBLEtBQUMsZ0JBQWdCLE1BQU07Ozs7d0JBRS9COztlQUVJLEtBQUM7Ozt3QkFFTDs7OzthQUVPLEtBQUMsT0FBTyxNQUFNOztnQkFDVixPQUFPLE9BQU8sV0FBVyxLQUFDLE9BQU8sTUFBTSxLQUFDLE9BQU8sTUFBTSxRQUFRLEtBQUMsT0FBTyxNQUFNOztxQkFDdkUsS0FBSyxtQkFBVyxLQUFLLEtBQUssU0FBTCxLQUFLLFFBQVEsS0FBQyxRQUFROztvQkFDMUMsS0FBQyxVQUFVLEtBQUs7b0JBQ2hCLE9BQU8sS0FBQztvQkFDUixLQUFLLEtBQUssYUFBYSxLQUFLLEtBQUs7MkJBQ2pDLEtBQUMsS0FBSyxZQUFZOzs7Ozs7d0JBRWxDLHFCQUFROzs7O1FBRUosT0FBTyxPQUFPLEtBQUs7UUFDbkIsS0FBSyxLQUFLLFlBQVksS0FBSyxFQUFFLEtBQUs7UUFDbEMsT0FBTyxLQUFDO1FBQ1IsS0FBSyxRQUFRLEtBQUM7ZUFDZCxLQUFDLEtBQUssWUFBWTs7O3dCQUV0Qjs7OztlQUF3QixLQUFDLE9BQU8sS0FBQzs7O3dCQUNqQzs7OztlQUF3QixLQUFDLE9BQU8sS0FBQzs7O3dCQUVqQyx5QkFBWSxRQUFPLFFBQU87O3NCQUViOztZQUNMLGNBQU0sK0NBQStDO1lBQ3JELGNBQU0sOENBQThDOzs7Z0JBR2pEOztpQkFFSDtnQkFFSSxLQUFDLE9BQU87Z0JBQ1IsS0FBQzs7O2lCQUdMO2dCQUVJLEtBQUM7Z0JBQ0QsU0FBUyxLQUFDLFlBQVksS0FBQztnQkFDdkIsS0FBQyxPQUFPO2dCQUNSLEtBQUM7OztpQkFHTDtnQkFFSSxLQUFDO2dCQUNELFNBQVMsS0FBQyxZQUFZLEtBQUM7Z0JBQ3ZCLEtBQUMsT0FBTztnQkFDUixLQUFDOzs7aUJBR0w7aUJBQ0E7Z0JBRUksS0FBQyxPQUFPO2dCQUNSLEtBQUssS0FBSyxRQUFROzs7aUJBR3RCO2dCQUVJLEtBQUMsT0FBTzs7Ozs7dURBS1YsT0FBTyxPQUFPOzs7V0F6STNCOzs7ZUEySU0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheetree.kode
