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
        this["onNode"] = this["onNode"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["select"] = this["select"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["onEditorResize"] = this["onEditorResize"].bind(this)
        sheetree.__super__.constructor.call(this,this.editor.screen,this.name,features)
        this.editor.state.on('cursorsSet',this.onCursorsSet)
        post.on('editor.resize',this.onEditorResize)
        post.on('sheetree.select',this.select)
        post.on('sheet.edited',this.onSheetEdited)
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
        return this.highlight(row)
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
        var row

        delete this.editor.sheet.cols
        delete this.editor.sheet.rows
        row = this.currentIndex()
        this.reloadTree()
        this.highlight(row)
        return post.emit('cells.rect',this.current().rect.abs)
    }

    sheetree.prototype["reloadTree"] = function ()
    {
        var items, _55_24_

        if ((this.editor.sheet != null ? this.editor.sheet.rectree : undefined))
        {
            layout.titlify(this.editor.cells,this.editor.sheet.rectree)
            items = this.itemsForTree(this.editor.sheet.rectree)
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
        var child, _74_37_, _76_35_

        node.index = items.length
        if ((node.title != null))
        {
            items.push(node)
        }
        var list = ((_76_35_=node.children) != null ? _76_35_ : [])
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
        var item, node, _85_24_, _87_29_

        if ((this.editor.sheet != null ? this.editor.sheet.rectree : undefined))
        {
            if (item = layout.nodeForPos(this.editor.cells,this.editor.sheet.rectree,this.editor.state.mainCursor()))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXRyZWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWV0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFNOztPQUNYLFlBQVo7T0FBa0IsWUFBbEI7T0FBd0IsWUFBeEI7O09BQ1ksV0FBUDs7T0FDTyxjQUFYOztPQUNXLGFBQVo7O09BQ1ksbUJBQWY7OztBQUVOLFlBQUQ7O3lCQUFVO2FBRU4sVUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7OztpREFFRCxLQUFDLE9BQU8sT0FBTyxLQUFDLEtBQUs7UUFFM0IsS0FBQyxPQUFPLE1BQU0sR0FBRyxhQUFhLEtBQUM7UUFFL0IsS0FBSyxHQUFHLGdCQUFrQixLQUFDO1FBQzNCLEtBQUssR0FBRyxrQkFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUcsZUFBa0IsS0FBQzs7O3dCQUUvQjs7OztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLE1BQU0sS0FBQztRQUNQLEtBQUM7ZUFDRCxLQUFDLFVBQVU7Ozt3QkFFZjs7UUFDSSxLQUFLLEtBQUs7Ozs7d0JBR2QscUJBQVE7OzRDQUVFOztlQUNOLEtBQUssS0FBSyxhQUFhLEtBQUMsVUFBVSxLQUFLOzs7d0JBRTNDOztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7Ozs7O3dCQUd2QixxQkFBUTs7OztlQUVHLEtBQUMsT0FBTyxNQUFNO2VBQ2QsS0FBQyxPQUFPLE1BQU07UUFDckIsTUFBTSxLQUFDO1FBQ1AsS0FBQztRQUNELEtBQUMsVUFBVTtlQUVYLEtBQUssS0FBSyxhQUFhLEtBQUMsVUFBVSxLQUFLOzs7d0JBRTNDOzs7O2FBRU8sS0FBQyxPQUFPLGdCQUFSLEtBQUMsT0FBTyxNQUFPOztZQUNkLE9BQU8sUUFBUSxLQUFDLE9BQU8sTUFBTSxLQUFDLE9BQU8sTUFBTTtZQUMzQyxRQUFRLEtBQUMsYUFBYSxLQUFDLE9BQU8sTUFBTTttQkFDcEMsS0FBQyxJQUFJLE1BQU07Ozs7bUJBRVgsS0FBSyxLQUFLOzs7O3dCQUVsQiwyQkFBYzs7OztRQUVWO1FBRUEsS0FBQyxnQkFBZ0IsS0FBSztlQUV0Qjs7O3dCQUVKLDhCQUFpQixNQUFLOzs7O1FBRWxCLEtBQUssUUFBUSxNQUFNO2FBRUEsS0FBSzs7WUFBeEIsTUFBTSxLQUFLOzs2QkFFRSxLQUFLOzs7WUFBZDtZQUNBLEtBQUMsZ0JBQWdCLE1BQU07Ozs7d0JBRS9COztlQUVJLEtBQUM7Ozt3QkFFTDs7OzthQUVPLEtBQUMsT0FBTyxnQkFBUixLQUFDLE9BQU8sTUFBTzs7Z0JBQ1gsT0FBTyxPQUFPLFdBQVcsS0FBQyxPQUFPLE1BQU0sS0FBQyxPQUFPLE1BQU0sUUFBUSxLQUFDLE9BQU8sTUFBTTs7cUJBQ3ZFLEtBQUssbUJBQVcsS0FBSyxLQUFLLFNBQUwsS0FBSyxRQUFRLEtBQUMsUUFBUTs7b0JBQzFDLEtBQUMsVUFBVSxLQUFLO29CQUNoQixPQUFPLEtBQUM7b0JBQ1IsS0FBSyxLQUFLLGFBQWEsS0FBSyxLQUFLOzJCQUNqQyxLQUFDLEtBQUssWUFBWTs7Ozs7O3dCQUVsQyxxQkFBUTs7OztRQUVKLE9BQU8sT0FBTyxLQUFLO1FBQ25CLEtBQUssS0FBSyxZQUFZLEtBQUssRUFBRSxLQUFLO1FBQ2xDLE9BQU8sS0FBQztRQUNSLEtBQUssUUFBUSxLQUFDO2VBQ2QsS0FBQyxLQUFLLFlBQVk7Ozt3QkFFdEI7Ozs7ZUFBd0IsS0FBQyxPQUFPLEtBQUM7Ozt3QkFDakM7Ozs7ZUFBd0IsS0FBQyxPQUFPLEtBQUM7Ozt3QkFFakMseUJBQVksUUFBTyxRQUFPOztzQkFFYjs7WUFDTCxjQUFNLCtDQUErQztZQUNyRCxjQUFNLDhDQUE4Qzs7O2dCQUdqRDs7aUJBRUg7Z0JBRUksS0FBQyxPQUFPO2dCQUNSLEtBQUM7OztpQkFHTDtnQkFFSSxLQUFDO2dCQUNELFNBQVMsS0FBQyxZQUFZLEtBQUM7Z0JBQ3ZCLEtBQUMsT0FBTztnQkFDUixLQUFDOzs7aUJBR0w7Z0JBRUksS0FBQztnQkFDRCxTQUFTLEtBQUMsWUFBWSxLQUFDO2dCQUN2QixLQUFDLE9BQU87Z0JBQ1IsS0FBQzs7O2lCQUdMO2lCQUNBO2dCQUVJLEtBQUMsT0FBTztnQkFDUixLQUFLLEtBQUssUUFBUTs7O2lCQUd0QjtnQkFFSSxLQUFDLE9BQU87Ozs7O3VEQUtWLE9BQU8sT0FBTzs7O1dBNUkzQjs7O2VBOElNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheetree.kode
