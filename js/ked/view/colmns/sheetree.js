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
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["onEditorResize"] = this["onEditorResize"].bind(this)
        sheetree.__super__.constructor.call(this,this.editor.screen,this.name,features)
        this.editor.state.on('cursorsSet',this.onCursorsSet)
        post.on('editor.resize',this.onEditorResize)
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
    
        post.emit('cells.rect',this.current().rect)
        return this.emit('tree.node',this.current())
    }

    sheetree.prototype["grabFocus"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        return sheetree.__super__.grabFocus.call(this)
    }

    sheetree.prototype["reloadTree"] = function ()
    {
        var items, _45_24_

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
        return post.emit('goto.line',choice.y,choice.x)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXRyZWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWV0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFNOztPQUNYLFlBQVo7T0FBa0IsWUFBbEI7T0FBd0IsWUFBeEI7O09BQ1ksV0FBUDs7T0FDTyxjQUFYOztPQUNXLGFBQVo7O09BQ1ksbUJBQWY7OztBQUVOLFlBQUQ7O3lCQUFVO2FBRU4sVUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7OztpREFFRCxLQUFDLE9BQU8sT0FBTyxLQUFDLEtBQUs7UUFFM0IsS0FBQyxPQUFPLE1BQU0sR0FBRyxhQUFhLEtBQUM7UUFFL0IsS0FBSyxHQUFHLGdCQUFpQixLQUFDOzs7d0JBRTlCOzs7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsTUFBTSxLQUFDO1FBQ1AsS0FBQztlQUNELEtBQUMsT0FBTzs7O3dCQUVaOztRQUNJLEtBQUssS0FBSzs7Ozt3QkFHZCxxQkFBUTs7NENBRUU7O1FBRU4sS0FBSyxLQUFLLGFBQWEsS0FBQyxVQUFVO2VBQ2xDLEtBQUMsS0FBSyxZQUFZLEtBQUM7Ozt3QkFFdkI7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7Ozs7d0JBR3ZCOzs7O2FBRU8sS0FBQyxPQUFPLGdCQUFSLEtBQUMsT0FBTyxNQUFPOztZQUNkLFFBQVEsT0FBTyxRQUFRLEtBQUMsT0FBTyxNQUFNLEtBQUMsT0FBTyxNQUFNO21CQUVuRCxLQUFDLElBQUksTUFBTTs7OzttQkFFWCxLQUFLLEtBQUs7Ozs7d0JBRWxCOztlQUdJLEtBQUMsaUJBQWlCLEtBQUMsT0FBTyxNQUFNOzs7d0JBRXBDLCtCQUFrQjs7OztZQUVYLE9BQU8sS0FBQyxXQUFXOztZQUNsQixZQUFJLGNBQWM7Ozs7d0JBRTFCLHlCQUFZOzs7OzRCQUVRLEtBQUM7YUFBUjs7WUFBTDtnQkFDRzs7dUJBQ0c7Ozs7O3dCQUVkLHFCQUFROztlQUVKLEtBQUssS0FBSyxZQUFZLE9BQU8sRUFBRSxPQUFPOzs7d0JBRTFDLHlCQUFZLFFBQU8sUUFBTzs7c0JBRWI7O1lBQ0wsY0FBTSwrQ0FBK0M7WUFDckQsY0FBTSw4Q0FBOEM7OztnQkFHakQ7O2lCQUVIO2dCQUVJLEtBQUMsT0FBTztnQkFDUixLQUFDOzs7aUJBR0w7Z0JBRUksS0FBQztnQkFDRCxTQUFTLEtBQUMsWUFBWSxLQUFDO2dCQUN2QixLQUFDLE9BQU87Z0JBQ1IsS0FBQzs7O2lCQUdMO2dCQUVJLEtBQUM7Z0JBQ0QsU0FBUyxLQUFDLFlBQVksS0FBQztnQkFDdkIsS0FBQyxPQUFPO2dCQUNSLEtBQUM7OztpQkFHTDtpQkFDQTtnQkFFSSxLQUFDLE9BQU87Z0JBQ1IsS0FBSyxLQUFLLFFBQVE7OztpQkFHdEI7Z0JBRUksS0FBQyxPQUFPOzs7Ozt1REFLVixPQUFPLE9BQU87OztXQTVHM0I7OztlQThHTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheetree.kode
