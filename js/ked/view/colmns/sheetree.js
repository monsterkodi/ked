var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
    
        this["jumpToRow"] = this["jumpToRow"].bind(this)
        this["deleteCurrent"] = this["deleteCurrent"].bind(this)
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
        var node, pos, rect, state

        state = this.editor.state
        rect = choice.rect.abs
        if (!layout.holds(choice,state.sheetCellForPos(state.mainCursor())))
        {
            pos = state.sheetPosForCell([rect.x,rect.y + layout.scaleOf(choice) - 1])
            post.emit('goto.line',pos[1],pos[0])
        }
        node = this.current()
        node.index = this.currentIndex()
        return this.emit('tree.node',node)
    }

    sheetree.prototype["deleteCurrent"] = function ()
    {
        var row

        row = this.currentIndex()
        this.editor.deleteSheetNode(this.current())
        if (!_k_.empty(this.fuzzied))
        {
            this.jumpToRow(_k_.min(row,this.fuzzied.length - 1))
        }
        return true
    }

    sheetree.prototype["jumpToRow"] = function (row)
    {
        this.select(row)
        return this.jumpTo(this.current())
    }

    sheetree.prototype["selectNext"] = function ()
    {
        return this.jumpToRow(this.nextRow())
    }

    sheetree.prototype["selectPrev"] = function ()
    {
        var row

        row = this.prevRow()
        if (_k_.empty(row))
        {
            return sheetree.__super__.selectPrev.call(this)
        }
        return this.jumpToRow(row)
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

            case 'delete':
            case 'entf':
                return this.deleteCurrent()

        }

        return sheetree.__super__.emitAction.call(this,action,choice,event)
    }

    return sheetree
})()

export default sheetree;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXRyZWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWV0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFNOztPQUNYLFlBQVo7T0FBa0IsWUFBbEI7T0FBd0IsWUFBeEI7O09BQ1ksV0FBUDs7T0FDTyxjQUFYOztPQUNXLGFBQVo7O09BQ1ksbUJBQWY7OztBQUVOLFlBQUQ7O3lCQUFVO2FBRU4sVUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7aURBRUQsS0FBQyxPQUFPLE9BQU8sS0FBQyxLQUFLO1FBRTNCLEtBQUMsT0FBTyxNQUFNLEdBQUcsYUFBYSxLQUFDO1FBRS9CLEtBQUssR0FBRyxnQkFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUcsa0JBQWtCLEtBQUM7UUFDM0IsS0FBSyxHQUFHLGVBQWtCLEtBQUM7UUFDM0IsS0FBSyxHQUFHLGFBQWtCLEtBQUM7UUFDM0IsS0FBSyxHQUFHLGFBQWtCLEtBQUM7Ozt3QkFFL0I7O1FBQ0ksS0FBSyxLQUFLOzs7O3dCQUdkLHFCQUFROzs0Q0FFRTs7ZUFDTixLQUFDOzs7d0JBRUw7O2VBQWEsS0FBSyxLQUFLOzs7d0JBQ3ZCOztZQUFnQixLQUFDLE9BQU8sTUFBTSxXQUFZLEtBQUM7O21CQUFZLEtBQUssS0FBSyxhQUFhLEtBQUMsVUFBVSxLQUFLOzs7O3dCQUU5Rjs7WUFFUyxLQUFDLFlBQVksS0FBQzs7Ozs7Ozt3QkFHdkIscUJBQVE7O2VBRUcsS0FBQyxPQUFPLE1BQU07ZUFDZCxLQUFDLE9BQU8sTUFBTTtlQUNyQixLQUFDOzs7d0JBRUw7Ozs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixNQUFNLEtBQUM7UUFDUCxLQUFDO1FBQ0QsS0FBQyxVQUFVO2VBQ1gsS0FBQzs7O3dCQUVMOzs7O2FBRU8sS0FBQyxPQUFPLE1BQU07O1lBQ2IsT0FBTyxRQUFRLEtBQUMsT0FBTyxNQUFNLEtBQUMsT0FBTyxNQUFNO1lBQzNDLFFBQVEsS0FBQyxhQUFhLEtBQUMsT0FBTyxNQUFNO21CQUNwQyxLQUFDLElBQUksTUFBTTs7OzttQkFFWCxLQUFDOzs7O3dCQUVULDJCQUFjOzs7O1FBRVY7UUFFQSxLQUFDLGdCQUFnQixLQUFLO2VBRXRCOzs7d0JBRUosOEJBQWlCLE1BQUs7Ozs7UUFFbEIsS0FBSyxRQUFRLE1BQU07YUFFQSxLQUFLOztZQUF4QixNQUFNLEtBQUs7OzZCQUVFLEtBQUs7OztZQUFkO1lBQ0EsS0FBQyxnQkFBZ0IsTUFBTTs7Ozt3QkFFL0I7O1FBRUksS0FBQztlQUNELEtBQUM7Ozt3QkFFTDs7OzthQUVPLEtBQUMsT0FBTyxNQUFNOztZQUNiLE9BQU8sS0FBQyxPQUFPLE1BQU0sZ0JBQWdCLEtBQUMsT0FBTyxNQUFNO2dCQUNoRCxPQUFPLE9BQU8sV0FBVyxLQUFDLE9BQU8sTUFBTSxLQUFDLE9BQU8sTUFBTSxRQUFROztxQkFDekQsS0FBSyxtQkFBVyxLQUFLLEtBQUssU0FBTCxLQUFLLFFBQVEsS0FBQyxRQUFROztvQkFDMUMsS0FBQyxVQUFVLEtBQUs7b0JBQ2hCLEtBQUM7MkJBQ0QsS0FBQyxLQUFLLFlBQVksS0FBQzs7Ozs7O3dCQUVuQyxxQkFBUTs7OztRQUVKLFFBQVEsS0FBQyxPQUFPO1FBQ2hCLE9BQVEsT0FBTyxLQUFLO2FBRWIsT0FBTyxNQUFNLE9BQVEsTUFBTSxnQkFBZ0IsTUFBTTs7WUFDcEQsTUFBTSxNQUFNLGlCQUFpQixLQUFLLEVBQUUsS0FBSyxJQUFFLE9BQU8sUUFBUSxVQUFRO1lBQ2xFLEtBQUssS0FBSyxZQUFZLElBQUksR0FBRyxJQUFJOztRQUNyQyxPQUFPLEtBQUM7UUFDUixLQUFLLFFBQVEsS0FBQztlQUNkLEtBQUMsS0FBSyxZQUFZOzs7d0JBRXRCOzs7O1FBRUksTUFBTSxLQUFDO1FBRVAsS0FBQyxPQUFPLGdCQUFnQixLQUFDO3VCQUVzQixLQUFDOztZQUFoRCxLQUFDLGtCQUFjLElBQUksS0FBQyxRQUFRLFNBQU87O2VBRW5DOzs7d0JBRUosd0JBQVc7O1FBRVAsS0FBQyxPQUFPO2VBQ1IsS0FBQyxPQUFPLEtBQUM7Ozt3QkFFYjs7ZUFBZSxLQUFDLFVBQVUsS0FBQzs7O3dCQUMzQjs7OztRQUVJLE1BQU0sS0FBQztzQkFFWTs7OztlQUVuQixLQUFDLFVBQVU7Ozt3QkFFZix5QkFBWSxRQUFPLFFBQU87O3NCQUViOztZQUNMLGNBQU0sK0NBQStDO1lBQ3JELGNBQU0sOENBQThDOzs7Z0JBR2pEOztpQkFFSDtnQkFFSSxLQUFDLE9BQU87Z0JBQ1IsS0FBQzs7O2lCQUdMO2dCQUVJLEtBQUM7Z0JBQ0QsU0FBUyxLQUFDLFlBQVksS0FBQztnQkFDdkIsS0FBQyxPQUFPO2dCQUNSLEtBQUM7OztpQkFHTDtnQkFFSSxLQUFDO2dCQUNELFNBQVMsS0FBQyxZQUFZLEtBQUM7Z0JBQ3ZCLEtBQUMsT0FBTztnQkFDUixLQUFDOzs7aUJBR0w7aUJBQ0E7Z0JBRUksS0FBQyxPQUFPO2dCQUNSLEtBQUssS0FBSyxRQUFROzs7aUJBR3RCO2dCQUVJLEtBQUMsT0FBTzs7O2lCQUdaO2lCQUFTO3VCQUVILEtBQUM7Ozs7dURBSUwsT0FBTyxPQUFPOzs7V0E1SzNCOzs7ZUE4S00ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheetree.kode
