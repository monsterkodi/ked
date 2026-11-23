var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var sheetree

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let nfs = kxk.nfs

import clip from "../../../kxk/clip.js"

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
        this["moveCurrent"] = this["moveCurrent"].bind(this)
        this["pasteNode"] = this["pasteNode"].bind(this)
        this["cutCurrent"] = this["cutCurrent"].bind(this)
        this["copyCurrent"] = this["copyCurrent"].bind(this)
        this["rowForRestore"] = this["rowForRestore"].bind(this)
        this["keepSelection"] = this["keepSelection"].bind(this)
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
        var row

        row = this.currentIndex()
        this.editor.state.commitSheet()
        this.highlight(row)
        return this.showRect()
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
        var items, _61_32_

        if ((this.editor.state.rectree != null))
        {
            layout.titlify(this.editor.state.sheetSize(),this.editor.state.rectree)
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
        var child, _78_21_, _84_35_

        if ((node.title != null))
        {
            node.index = items.length
            items.push(node)
        }
        else
        {
            delete node.index
        }
        var list = ((_84_35_=node.children) != null ? _84_35_ : [])
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
        var cell, item, _96_32_, _99_29_

        if (this.jumping)
        {
            return
        }
        if ((this.editor.state.rectree != null))
        {
            cell = this.editor.state.sheetCellForPos(this.editor.state.mainCursor())
            if (item = layout.nodeForPos(this.editor.state.sheetSize(),this.editor.state.rectree,cell))
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
            this.jumping = true
            post.emit('goto.line',pos[1],pos[0])
            this.jumping = false
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

    sheetree.prototype["keepSelection"] = function (fn)
    {
        var old, path

        old = this.current()
        if ((old != null))
        {
            path = layout.pathOf(this.editor.state.rectree,old)
        }
        fn()
        if (_k_.empty(this.fuzzied))
        {
            return
        }
        return this.jumpToRow(this.rowForRestore(old,(path != null ? path : [])))
    }

    sheetree.prototype["rowForRestore"] = function (old, path)
    {
        var best, item, most, props, row, shared, tree, _149_64_

        tree = this.editor.state.rectree
        best = null
        most = -1
        if ((old != null))
        {
            props = layout.ownProps(old)
            var list = _k_.list(this.fuzzied)
            for (row = 0; row < list.length; row++)
            {
                item = list[row]
                if (!(_k_.eql(layout.ownProps(item), props)))
                {
                    continue
                }
                shared = this.sharedPrefix(((_149_64_=layout.pathOf(tree,item)) != null ? _149_64_ : []),path)
                if (shared > most)
                {
                    best = row
                    most = shared
                }
            }
        }
        if ((best != null))
        {
            return best
        }
        path = path.slice()
        while (true)
        {
            row = this.fuzzied.indexOf(layout.nodeAtPath(tree,path))
            if (row >= 0)
            {
                return row
            }
            if (_k_.empty(path))
            {
                break
            }
            path.pop()
        }
        return 0
    }

    sheetree.prototype["sharedPrefix"] = function (a, b)
    {
        var n

        n = 0
        while (n < a.length && n < b.length && a[n] === b[n])
        {
            n += 1
        }
        return n
    }

    sheetree.prototype["copyCurrent"] = function ()
    {
        var node

        if (node = this.current())
        {
            clip.copy(JSON.stringify(layout.plainNode(node)))
        }
        return true
    }

    sheetree.prototype["cutCurrent"] = function ()
    {
        this.copyCurrent()
        return this.deleteCurrent()
    }

    sheetree.prototype["pasteNode"] = function ()
    {
        var data, node, row

        try
        {
            data = JSON.parse(clip.paste())
        }
        catch (err)
        {
            return true
        }
        if (!layout.isNodeData(data))
        {
            return true
        }
        node = this.editor.state.insertSheetNode(data,this.current())
        row = this.fuzzied.indexOf(node)
        if (row >= 0)
        {
            this.jumpToRow(row)
        }
        return true
    }

    sheetree.prototype["moveCurrent"] = function (dir)
    {
        var node, row

        node = this.current()
        if ((node != null) && this.editor.state.shiftSheetNode(node,dir))
        {
            row = this.fuzzied.indexOf(node)
            if (row >= 0)
            {
                this.jumpToRow(row)
            }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXRyZWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWV0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFNOztPQUNYLFdBQVQ7O09BQ1MsWUFBWjtPQUFrQixZQUFsQjtPQUF3QixZQUF4Qjs7T0FDWSxXQUFQOztPQUNPLGNBQVg7O09BQ1csYUFBWjs7T0FDWSxtQkFBZjs7O0FBRU4sWUFBRDs7eUJBQVU7YUFFTixVQUFJLFFBQVEsTUFBSzs7UUFBZDtRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpREFFRCxLQUFDLE9BQU8sT0FBTyxLQUFDLEtBQUs7UUFFM0IsS0FBQyxPQUFPLE1BQU0sR0FBRyxhQUFhLEtBQUM7UUFFL0IsS0FBSyxHQUFHLGdCQUFrQixLQUFDO1FBQzNCLEtBQUssR0FBRyxrQkFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUcsZUFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUcsYUFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUcsYUFBa0IsS0FBQzs7O3dCQUUvQjs7UUFDSSxLQUFLLEtBQUs7Ozs7d0JBR2QscUJBQVE7OzRDQUVFOztlQUNOLEtBQUM7Ozt3QkFFTDs7ZUFBYSxLQUFLLEtBQUs7Ozt3QkFDdkI7O1lBQWdCLEtBQUMsT0FBTyxNQUFNLFdBQVksS0FBQzs7bUJBQVksS0FBSyxLQUFLLGFBQWEsS0FBQyxVQUFVLEtBQUs7Ozs7d0JBRTlGOztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7Ozs7O3dCQUd2QixxQkFBUTs7OztRQUVKLE1BQU0sS0FBQztRQUVQLEtBQUMsT0FBTyxNQUFNO1FBRWQsS0FBQyxVQUFVO2VBQ1gsS0FBQzs7O3dCQUVMOzs7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsTUFBTSxLQUFDO1FBQ1AsS0FBQztRQUNELEtBQUMsVUFBVTtlQUNYLEtBQUM7Ozt3QkFFTDs7OzthQUVPLEtBQUMsT0FBTyxNQUFNOztZQUNiLE9B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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheetree.kode
