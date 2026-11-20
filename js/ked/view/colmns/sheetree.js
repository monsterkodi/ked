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
        var items, _56_24_

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

    sheetree.prototype["onSheetEdited"] = function ()
    {
        return this.reloadTree()
    }

    sheetree.prototype["onCursorsSet"] = function ()
    {
        var item, _68_24_, _70_29_

        if ((this.editor.sheet != null ? this.editor.sheet.rectree : undefined))
        {
            if (item = layout.nodeForPos(this.editor.cells,this.editor.sheet.rectree,this.editor.state.mainCursor()))
            {
                if ((item.index != null) && (0 <= item.index && item.index < this.fuzzied.length))
                {
                    console.log(`GOT ITEM ${item.index}/${this.fuzzied.length}`)
                    this.highlight(item.index)
                    return post.emit('cells.rect',this.current().rect)
                }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXRyZWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWV0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFNOztPQUNYLFlBQVo7T0FBa0IsWUFBbEI7T0FBd0IsWUFBeEI7O09BQ1ksV0FBUDs7T0FDTyxjQUFYOztPQUNXLGFBQVo7O09BQ1ksbUJBQWY7OztBQUVOLFlBQUQ7O3lCQUFVO2FBRU4sVUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7aURBRUQsS0FBQyxPQUFPLE9BQU8sS0FBQyxLQUFLO1FBRTNCLEtBQUMsT0FBTyxNQUFNLEdBQUcsYUFBYSxLQUFDO1FBRS9CLEtBQUssR0FBRyxnQkFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUcsa0JBQWtCLEtBQUM7UUFDM0IsS0FBSyxHQUFHLGVBQWtCLEtBQUM7Ozt3QkFFL0I7Ozs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixNQUFNLEtBQUM7UUFDUCxLQUFDO2VBQ0QsS0FBQyxPQUFPOzs7d0JBRVo7O1FBQ0ksS0FBSyxLQUFLOzs7O3dCQUdkLHFCQUFROzs0Q0FFRTs7ZUFDTixLQUFLLEtBQUssYUFBYSxLQUFDLFVBQVU7Ozt3QkFFdEM7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7Ozs7d0JBR3ZCLHFCQUFROzs7O1FBRUosT0FBTyxlQUFlLEtBQUMsT0FBTyxNQUFNLFFBQVE7ZUFDckMsS0FBQyxPQUFPLE1BQU07ZUFDZCxLQUFDLE9BQU8sTUFBTTtRQUNyQixNQUFNLEtBQUM7UUFDUCxLQUFDO1FBQ0QsS0FBQyxVQUFVO2VBRVgsS0FBSyxLQUFLLGFBQWEsS0FBQyxVQUFVOzs7d0JBRXRDOzs7O2FBRU8sS0FBQyxPQUFPLGdCQUFSLEtBQUMsT0FBTyxNQUFPOztZQUNkLFFBQVEsT0FBTyxRQUFRLEtBQUMsT0FBTyxNQUFNLEtBQUMsT0FBTyxNQUFNO21CQUNuRCxLQUFDLElBQUksTUFBTTs7OzttQkFFWCxLQUFLLEtBQUs7Ozs7d0JBRWxCOztlQUVJLEtBQUM7Ozt3QkFFTDs7OzthQUVPLEtBQUMsT0FBTyxnQkFBUixLQUFDLE9BQU8sTUFBTzs7Z0JBQ1gsT0FBTyxPQUFPLFdBQVcsS0FBQyxPQUFPLE1BQU0sS0FBQyxPQUFPLE1BQU0sUUFBUSxLQUFDLE9BQU8sTUFBTTs7cUJBQ3ZFLEtBQUssbUJBQVcsS0FBSyxLQUFLLFNBQUwsS0FBSyxRQUFRLEtBQUMsUUFBUTs7b0JBQzFDLHdCQUFnQixLQUFLLFNBQVMsS0FBQyxRQUFRO29CQUN2QyxLQUFDLFVBQVUsS0FBSzsyQkFDaEIsS0FBSyxLQUFLLGFBQWEsS0FBQyxVQUFVOzs7Ozs7d0JBRWxELHFCQUFROzs7O1FBRUosS0FBSyxLQUFLLFlBQVksT0FBTyxFQUFFLE9BQU87UUFDdEMsT0FBTyxLQUFDO1FBQ1IsS0FBSyxRQUFRLEtBQUM7ZUFDZCxLQUFDLEtBQUssWUFBWTs7O3dCQUV0Qjs7OztlQUF3QixLQUFDLE9BQU8sS0FBQzs7O3dCQUNqQzs7OztlQUF3QixLQUFDLE9BQU8sS0FBQzs7O3dCQUVqQyx5QkFBWSxRQUFPLFFBQU87O3NCQUViOztZQUNMLGNBQU0sK0NBQStDO1lBQ3JELGNBQU0sOENBQThDOzs7Z0JBR2pEOztpQkFFSDtnQkFFSSxLQUFDLE9BQU87Z0JBQ1IsS0FBQzs7O2lCQUdMO2dCQUVJLEtBQUM7Z0JBQ0QsU0FBUyxLQUFDLFlBQVksS0FBQztnQkFDdkIsS0FBQyxPQUFPO2dCQUNSLEtBQUM7OztpQkFHTDtnQkFFSSxLQUFDO2dCQUNELFNBQVMsS0FBQyxZQUFZLEtBQUM7Z0JBQ3ZCLEtBQUMsT0FBTztnQkFDUixLQUFDOzs7aUJBR0w7aUJBQ0E7Z0JBRUksS0FBQyxPQUFPO2dCQUNSLEtBQUssS0FBSyxRQUFROzs7aUJBR3RCO2dCQUVJLEtBQUMsT0FBTzs7Ozs7dURBS1YsT0FBTyxPQUFPOzs7V0F6SDNCOzs7ZUEySE0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheetree.kode
