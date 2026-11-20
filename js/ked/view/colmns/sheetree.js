var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

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
        this["itemForPos"] = this["itemForPos"].bind(this)
        this["selectItemForPos"] = this["selectItemForPos"].bind(this)
        this["onCursorsSet"] = this["onCursorsSet"].bind(this)
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
        return this.select(row)
    }

    sheetree.prototype["hide"] = function ()
    {
        post.emit('cells.rect')
        return sheetree.__super__.hide.call(this)
    }

    sheetree.prototype["select"] = function (row)
    {
        sheetree.__super__.select.call(this,row)
    
        return post.emit('cells.rect',this.current().rect)
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

        layout.modifyTreeNode(this.editor.sheet.rectree,node)
        delete this.editor.sheet.cols
        delete this.editor.sheet.rows
        row = this.currentIndex()
        this.reloadTree()
        this.highlight(row)
        return post.emit('cells.rect',this.current().rect)
    }

    sheetree.prototype["reloadTree"] = function ()
    {
        var items, _55_24_

        if ((this.editor.sheet != null ? this.editor.sheet.rectree : undefined))
        {
            items = layout.titlify(this.editor.cells,this.editor.sheet.rectree)
            return this.set(items,'title')
        }
        else
        {
            return post.emit('cells.rect')
        }
    }

    sheetree.prototype["onCursorsSet"] = function ()
    {
        return this.selectItemForPos(this.editor.state.mainCursor())
    }

    sheetree.prototype["selectItemForPos"] = function (pos)
    {
        var item

        if (item = this.itemForPos(pos))
        {
            console.log('select item',item)
        }
    }

    sheetree.prototype["itemForPos"] = function (pos)
    {
        var idx, item

        var list = _k_.list(this.items)
        for (idx = 0; idx < list.length; idx++)
        {
            item = list[idx]
            if (false)
            {
                return item
            }
        }
    }

    sheetree.prototype["jumpTo"] = function (choice)
    {
        var node

        post.emit('goto.line',choice.y,choice.x)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXRyZWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWV0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFNOztPQUNYLFlBQVo7T0FBa0IsWUFBbEI7T0FBd0IsWUFBeEI7O09BQ1ksV0FBUDs7T0FDTyxjQUFYOztPQUNXLGFBQVo7O09BQ1ksbUJBQWY7OztBQUVOLFlBQUQ7O3lCQUFVO2FBRU4sVUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7O2lEQUVELEtBQUMsT0FBTyxPQUFPLEtBQUMsS0FBSztRQUUzQixLQUFDLE9BQU8sTUFBTSxHQUFHLGFBQWEsS0FBQztRQUUvQixLQUFLLEdBQUcsZ0JBQWtCLEtBQUM7UUFDM0IsS0FBSyxHQUFHLGtCQUFrQixLQUFDOzs7d0JBRS9COzs7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsTUFBTSxLQUFDO1FBQ1AsS0FBQztlQUNELEtBQUMsT0FBTzs7O3dCQUVaOztRQUNJLEtBQUssS0FBSzs7Ozt3QkFHZCxxQkFBUTs7NENBRUU7O2VBQ04sS0FBSyxLQUFLLGFBQWEsS0FBQyxVQUFVOzs7d0JBRXRDOztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7Ozs7O3dCQUd2QixxQkFBUTs7OztRQUVKLE9BQU8sZUFBZSxLQUFDLE9BQU8sTUFBTSxRQUFRO2VBQ3JDLEtBQUMsT0FBTyxNQUFNO2VBQ2QsS0FBQyxPQUFPLE1BQU07UUFDckIsTUFBTSxLQUFDO1FBQ1AsS0FBQztRQUNELEtBQUMsVUFBVTtlQUVYLEtBQUssS0FBSyxhQUFhLEtBQUMsVUFBVTs7O3dCQUV0Qzs7OzthQUVPLEtBQUMsT0FBTyxnQkFBUixLQUFDLE9BQU8sTUFBTzs7WUFDZCxRQUFRLE9BQU8sUUFBUSxLQUFDLE9BQU8sTUFBTSxLQUFDLE9BQU8sTUFBTTttQkFDbkQsS0FBQyxJQUFJLE1BQU07Ozs7bUJBRVgsS0FBSyxLQUFLOzs7O3dCQUVsQjs7ZUFHSSxLQUFDLGlCQUFpQixLQUFDLE9BQU8sTUFBTTs7O3dCQUVwQywrQkFBa0I7Ozs7WUFFWCxPQUFPLEtBQUMsV0FBVzs7WUFDbEIsWUFBSSxjQUFjOzs7O3dCQUUxQix5QkFBWTs7Ozs0QkFFUSxLQUFDO2FBQVI7O1lBQUw7Z0JBQ0c7O3VCQUNHOzs7Ozt3QkFFZCxxQkFBUTs7OztRQUVKLEtBQUssS0FBSyxZQUFZLE9BQU8sRUFBRSxPQUFPO1FBQ3RDLE9BQU8sS0FBQztRQUNSLEtBQUssUUFBUSxLQUFDO2VBQ2QsS0FBQyxLQUFLLFlBQVk7Ozt3QkFFdEI7Ozs7ZUFBd0IsS0FBQyxPQUFPLEtBQUM7Ozt3QkFDakM7Ozs7ZUFBd0IsS0FBQyxPQUFPLEtBQUM7Ozt3QkFFakMseUJBQVksUUFBTyxRQUFPOztzQkFFYjs7WUFDTCxjQUFNLCtDQUErQztZQUNyRCxjQUFNLDhDQUE4Qzs7O2dCQUdqRDs7aUJBRUg7Z0JBRUksS0FBQyxPQUFPO2dCQUNSLEtBQUM7OztpQkFHTDtnQkFFSSxLQUFDO2dCQUNELFNBQVMsS0FBQyxZQUFZLEtBQUM7Z0JBQ3ZCLEtBQUMsT0FBTztnQkFDUixLQUFDOzs7aUJBR0w7Z0JBRUksS0FBQztnQkFDRCxTQUFTLEtBQUMsWUFBWSxLQUFDO2dCQUN2QixLQUFDLE9BQU87Z0JBQ1IsS0FBQzs7O2lCQUdMO2lCQUNBO2dCQUVJLEtBQUMsT0FBTztnQkFDUixLQUFLLEtBQUssUUFBUTs7O2lCQUd0QjtnQkFFSSxLQUFDLE9BQU87Ozs7O3VEQUtWLE9BQU8sT0FBTzs7O1dBM0gzQjs7O2VBNkhNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheetree.kode
