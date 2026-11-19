var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        sheetree.__super__.constructor.call(this,this.editor.screen,this.name,features)
        this.editor.state.on('cursorsSet',this.onCursorsSet)
        post.on('file.loaded',this.onFileLoaded)
        post.on('session.merge',this.onSessionMerge)
    }

    sheetree.prototype["onFileLoaded"] = function (path)
    {
        var tree, _22_24_

        if ((this.editor.sheet != null ? this.editor.sheet.rectree : undefined))
        {
            tree = layout.regionize(this.editor.cells,this.editor.sheet.rectree)
            return this.set(layout.titlify(tree),'title')
        }
    }

    sheetree.prototype["onSessionMerge"] = function (recent)
    {
        if (_k_.empty(recent.sheetree))
        {
            return
        }
        return ked_session.set('sheetree',recent.sheetree)
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
        console.log('JUMP',choice)
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

            case 'hover':
                console.log('HOVER',choice)
                post.emit('cells.rect',choice)
                break
        }

        return sheetree.__super__.emitAction.call(this,action,choice,event)
    }

    return sheetree
})()

export default sheetree;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXRyZWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWV0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFNOztPQUNYLFlBQVo7T0FBa0IsWUFBbEI7T0FBd0IsWUFBeEI7O09BQ1ksV0FBUDs7T0FDTyxjQUFYOztPQUNXLGFBQVo7O09BQ1ksbUJBQWY7OztBQUVOLFlBQUQ7O3lCQUFVO2FBRU4sVUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7aURBRUQsS0FBQyxPQUFPLE9BQU8sS0FBQyxLQUFLO1FBRTNCLEtBQUMsT0FBTyxNQUFNLEdBQUcsYUFBYSxLQUFDO1FBRS9CLEtBQUssR0FBRyxjQUFpQixLQUFDO1FBQzFCLEtBQUssR0FBRyxnQkFBaUIsS0FBQzs7O3dCQUU5QiwyQkFBYzs7OzthQUVQLEtBQUMsT0FBTyxnQkFBUixLQUFDLE9BQU8sTUFBTzs7WUFDZCxPQUFPLE9BQU8sVUFBVSxLQUFDLE9BQU8sTUFBTSxLQUFDLE9BQU8sTUFBTTttQkFDcEQsS0FBQyxJQUFJLE9BQU8sUUFBUSxNQUFNOzs7O3dCQUVsQyw2QkFBZ0I7O3NCQUVELE9BQU87Ozs7ZUFFbEIsWUFBWSxJQUFJLFdBQVcsT0FBTzs7O3dCQUV0Qzs7ZUFFSSxLQUFDLGlCQUFpQixLQUFDLE9BQU8sTUFBTTs7O3dCQUVwQywrQkFBa0I7Ozs7WUFFWCxPQUFPLEtBQUMsV0FBVzs7WUFDbEIsWUFBSSxjQUFjOzs7O3dCQUUxQix5QkFBWTs7Ozs0QkFFUSxLQUFDO2FBQVI7O1lBQUw7Z0JBQ0c7O3VCQUNHOzs7Ozt3QkFFZCxxQkFBUTs7UUFFSixZQUFJLE9BQU87Ozt3QkFFZix5QkFBWSxRQUFPLFFBQU87O3NCQUViOztZQUNMLGNBQU0sK0NBQStDO1lBQ3JELGNBQU0sOENBQThDOzs7Z0JBR2pEOztpQkFFSDtnQkFFSSxLQUFDLE9BQU87Z0JBQ1IsS0FBQzs7O2lCQUdMO2dCQUVJLEtBQUM7Z0JBQ0QsU0FBUyxLQUFDLFlBQVksS0FBQztnQkFDdkIsS0FBQyxPQUFPO2dCQUNSLEtBQUM7OztpQkFHTDtnQkFFSSxLQUFDO2dCQUNELFNBQVMsS0FBQyxZQUFZLEtBQUM7Z0JBQ3ZCLEtBQUMsT0FBTztnQkFDUixLQUFDOzs7aUJBR0w7aUJBQ0E7Z0JBRUksS0FBQyxPQUFPO2dCQUNSLEtBQUssS0FBSyxRQUFROzs7aUJBR3RCO2dCQUVJLEtBQUMsT0FBTzs7O2lCQUdaO2dCQUVJLFlBQUksUUFBUTtnQkFDWixLQUFLLEtBQUssYUFBYTs7Ozt1REFJekIsT0FBTyxPQUFPOzs7V0E1RjNCOzs7ZUE4Rk0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheetree.kode
