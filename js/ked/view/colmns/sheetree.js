var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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
        var best, item, most, props, row, shared, tree, _139_64_

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
                shared = this.sharedPrefix(((_139_64_=layout.pathOf(tree,item)) != null ? _139_64_ : []),path)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZXRyZWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvY29sbW5zL3NoZWV0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQVM7SUFBSztJQUFNOztPQUNYLFlBQVo7T0FBa0IsWUFBbEI7T0FBd0IsWUFBeEI7O09BQ1ksV0FBUDs7T0FDTyxjQUFYOztPQUNXLGFBQVo7O09BQ1ksbUJBQWY7OztBQUVOLFlBQUQ7O3lCQUFVO2FBRU4sVUFBSSxRQUFRLE1BQUs7O1FBQWQ7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpREFFRCxLQUFDLE9BQU8sT0FBTyxLQUFDLEtBQUs7UUFFM0IsS0FBQyxPQUFPLE1BQU0sR0FBRyxhQUFhLEtBQUM7UUFFL0IsS0FBSyxHQUFHLGdCQUFrQixLQUFDO1FBQzNCLEtBQUssR0FBRyxrQkFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUcsZUFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUcsYUFBa0IsS0FBQztRQUMzQixLQUFLLEdBQUcsYUFBa0IsS0FBQzs7O3dCQUUvQjs7UUFDSSxLQUFLLEtBQUs7Ozs7d0JBR2QscUJBQVE7OzRDQUVFOztlQUNOLEtBQUM7Ozt3QkFFTDs7ZUFBYSxLQUFLLEtBQUs7Ozt3QkFDdkI7O1lBQWdCLEtBQUMsT0FBTyxNQUFNLFdBQVksS0FBQzs7bUJBQVksS0FBSyxLQUFLLGFBQWEsS0FBQyxVQUFVLEtBQUs7Ozs7d0JBRTlGOztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7Ozs7O3dCQUd2QixxQkFBUTs7ZUFFRyxLQUFDLE9BQU8sTUFBTTtlQUNkLEtBQUMsT0FBTyxNQUFNO2VBQ3JCLEtBQUM7Ozt3QkFFTDs7OztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLE1BQU0sS0FBQztRQUNQLEtBQUM7UUFDRCxLQUFDLFVBQVU7ZUFDWCxLQUFDOzs7d0JBRUw7Ozs7YUFFTyxLQUFDLE9BQU8sTUFBTTs7WUFDYixPQUFPLFFBQVEsS0FBQyxPQUFPLE1BQU0sS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheetree.kode
