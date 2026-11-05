var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var funSyntax, funtree, SYMBOL

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let nfs = kxk.nfs

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import belt from "../../edit/tool/belt.js"

import indexer from "../../index/indexer.js"

import choices from "../menu/choices.js"

SYMBOL = {clss:'■',unbound:'->',bound:'=>',async_unbound:'○→',async_bound:'●→'}

funSyntax = (function ()
{
    function funSyntax (tree)
    {
        this.tree = tree
    
        this["getChar"] = this["getChar"].bind(this)
        this["getColor"] = this["getColor"].bind(this)
        this["getClasses"] = this["getClasses"].bind(this)
        this["getClass"] = this["getClass"].bind(this)
        this["setSegls"] = this["setSegls"].bind(this)
        this["setLines"] = this["setLines"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this.color = {class:theme.funtree.class,async:theme.funtree.async,bound:theme.funtree.bound,bound_async:theme.funtree.bound_async,func:theme.funtree.func,func_async:theme.funtree.func_async,test0:theme.funtree.test0,test1:theme.funtree.test1,test2:theme.funtree.test2,test3:theme.funtree.test3,h1:theme.syntax['text h1'],h2:theme.syntax['text h2'],h3:theme.syntax['text h3'],h4:theme.syntax['text h4'],h5:theme.syntax['text h5']}
    }

    funSyntax.prototype["clear"] = function ()
    {}

    funSyntax.prototype["setLines"] = function (lines)
    {
        console.log('setLines')
    }

    funSyntax.prototype["setSegls"] = function (segls)
    {}

    funSyntax.prototype["getClass"] = function (x, y)
    {
        return ''
    }

    funSyntax.prototype["getClasses"] = function (y)
    {
        return []
    }

    funSyntax.prototype["getColor"] = function (x, y)
    {
        var char, clr, item, name

        item = this.tree.items[y]
        name = item.name
        char = name[x]
        if (char === ' ')
        {
            return [0,0,0]
        }
        if (item.clss)
        {
            clr = this.color.class
        }
        else if (item.md)
        {
            clr = this.color[item.md]
        }
        else if (item.test)
        {
            clr = this.color['test' + parseInt(belt.numIndent(item.name) / 2)]
        }
        else if (item.async)
        {
            clr = (item.bound ? this.color.bound_async : this.color.func_async)
        }
        else if (item.bound)
        {
            clr = this.color.bound
        }
        else
        {
            clr = this.color.func
        }
        if (item.static)
        {
            clr = color.brighten(clr,0.2)
        }
        else if (char === '@' && _k_.empty(name[x + 1]))
        {
            clr = this.color.class
        }
        if (char === "#")
        {
            clr = color.darken(clr,0.5)
        }
        else if (char === '▸')
        {
            clr = color.darken(clr,0.5)
        }
        else if (char === '@')
        {
            clr = color.darken(clr,((clr === this.color.class ? 0.75 : 0.5)))
        }
        else if (char === SYMBOL.clss)
        {
            clr = color.darken(clr,0.2)
        }
        else if (_k_.in(char,SYMBOL.bound) && item.bound)
        {
            clr = color.darken(clr,0.5)
        }
        else if (_k_.in(char,SYMBOL.unbound))
        {
            clr = color.darken(clr,0.7)
        }
        return clr
    }

    funSyntax.prototype["getChar"] = function (x, y, char)
    {
        return char
    }

    return funSyntax
})()


funtree = (function ()
{
    _k_.extend(funtree, choices)
    function funtree (editor, name, features)
    {
        this.editor = editor
        this.name = name
    
        this["jumpTo"] = this["jumpTo"].bind(this)
        this["itemsForBaseClass"] = this["itemsForBaseClass"].bind(this)
        this["onFileIndexed"] = this["onFileIndexed"].bind(this)
        this["lineIndexForFunc"] = this["lineIndexForFunc"].bind(this)
        this["lineIndexOfPrevFunc"] = this["lineIndexOfPrevFunc"].bind(this)
        this["lineIndexOfNextFunc"] = this["lineIndexOfNextFunc"].bind(this)
        this["lineIndexOfCurrentFunc"] = this["lineIndexOfCurrentFunc"].bind(this)
        this["nameOfCurrentFunc"] = this["nameOfCurrentFunc"].bind(this)
        this["selectItemForLineIndex"] = this["selectItemForLineIndex"].bind(this)
        this["localItems"] = this["localItems"].bind(this)
        this["onCursorsSet"] = this["onCursorsSet"].bind(this)
        funtree.__super__.constructor.call(this,this.editor.screen,this.name,features)
        this.state.syntax = new funSyntax(this)
        this.editor.state.on('cursorsSet',this.onCursorsSet)
        post.on('file.loaded',this.clear)
        post.on('file.indexed',this.onFileIndexed)
    }

    funtree.prototype["onCursorsSet"] = function ()
    {
        return this.selectItemForLineIndex(this.editor.state.mainCursor()[1])
    }

    funtree.prototype["localItems"] = function ()
    {
        return this.items.filter(function (item)
        {
            return !item.inherited
        })
    }

    funtree.prototype["selectItemForLineIndex"] = function (li)
    {
        var idx, item, items

        items = this.localItems()
        var list = _k_.list(items)
        for (idx = 0; idx < list.length; idx++)
        {
            item = list[idx]
            if (item.line - 1 <= li && (idx >= items.length - 1 || items[idx + 1].line - 1 > li))
            {
                this.state.setSelections([belt.rangeOfLine(this.state.s.lines,idx)])
                this.state.setMainCursor(0,idx)
                return
            }
        }
    }

    funtree.prototype["nameOfCurrentFunc"] = function ()
    {
        return this.current().name
    }

    funtree.prototype["lineIndexOfCurrentFunc"] = function ()
    {
        return this.current().line - 1
    }

    funtree.prototype["lineIndexOfNextFunc"] = function ()
    {
        var item

        item = this.localItems()[this.currentIndex() + 1]
        if (_k_.empty(item))
        {
            return
        }
        return item.line - 1
    }

    funtree.prototype["lineIndexOfPrevFunc"] = function ()
    {
        var item

        item = this.localItems()[this.currentIndex() - 1]
        if (_k_.empty(item))
        {
            return
        }
        return item.line - 1
    }

    funtree.prototype["lineIndexForFunc"] = function (func)
    {
        var item

        var list = _k_.list(this.items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            if (item.name === func.name && item.class === func.class)
            {
                return item.line - 1
            }
        }
        if (func.name === `   -> ${func.class}` && func.line)
        {
            return this.lineIndexForFunc({class:func.class,name:'   -> @'})
        }
        if (func.name === "   -> @" && func.line)
        {
            return this.lineIndexForFunc({class:func.class,name:`   -> ${func.class}`})
        }
        console.log("can't find func:",func)
    }

    funtree.prototype["onFileIndexed"] = function (path, info)
    {
        var clss, clssl, func, funcs, indt, items, name, symbol, _141_22_

        if (path !== this.editor.currentFile)
        {
            return
        }
        if (_k_.empty(info.classes) && _k_.empty(info.funcs))
        {
            return
        }
        clssl = _k_.clone(info.classes)
        funcs = _k_.clone(info.funcs)
        var list = _k_.list(clssl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            clss = list[_a_]
            clss.file = ((_141_22_=clss.file) != null ? _141_22_ : path)
            clss.name = ' ' + SYMBOL.clss + ' ' + clss.name
        }
        var list1 = _k_.list(funcs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            func = list1[_b_]
            if (func.test)
            {
                func.name = ' ' + belt.reindent(4,2,func.name)
            }
            else
            {
                if (func.async)
                {
                    if (func.bound)
                    {
                        symbol = SYMBOL.async_bound
                    }
                    else
                    {
                        symbol = SYMBOL.async_unbound
                    }
                }
                else
                {
                    if (func.bound)
                    {
                        symbol = SYMBOL.bound
                    }
                    else
                    {
                        if (func.md)
                        {
                            symbol = "#"
                        }
                        else
                        {
                            symbol = SYMBOL.unbound
                        }
                    }
                }
                name = func.name
                if (func.static)
                {
                    name = '@' + name
                }
                indt = (func.class ? '   ' : ' ')
                func.name = indt + symbol + ' ' + name
            }
        }
        items = clssl.concat(funcs)
        items.sort(function (a, b)
        {
            return a.line - b.line
        })
        items = items.concat(this.itemsForBaseClass(clssl.slice(-1)[0]))
        this.set(items,'name')
        post.emit('funtree.loaded')
        this.onCursorsSet()
        return post.emit('redraw')
    }

    funtree.prototype["itemsForBaseClass"] = function (supr)
    {
        var clss, func, funcs, indt, items, name, symbol, _219_26_

        if (_k_.empty(supr))
        {
            return []
        }
        if (_k_.empty(supr.base))
        {
            return []
        }
        if (_k_.empty(indexer.singleton))
        {
            return []
        }
        items = []
        var list = _k_.list(indexer.singleton.baseClassesOf(supr.base))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            clss = list[_a_]
            items.push({clss:true,name:' ' + SYMBOL.clss + ' ' + clss.name,line:clss.line,file:clss.file,inherited:true})
            funcs = _k_.clone(indexer.singleton.methodsOfClass(clss.name))
            var list1 = _k_.list(funcs)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                func = list1[_b_]
                if (func.test)
                {
                    func.name = ' ' + belt.reindent(4,2,func.name)
                }
                else
                {
                    if (func.async)
                    {
                        if (func.bound)
                        {
                            symbol = SYMBOL.async_bound
                        }
                        else
                        {
                            symbol = SYMBOL.async_unbound
                        }
                    }
                    else
                    {
                        if (func.bound)
                        {
                            symbol = SYMBOL.bound
                        }
                        else
                        {
                            if (func.md)
                            {
                                symbol = "#"
                            }
                            else
                            {
                                symbol = SYMBOL.unbound
                            }
                        }
                    }
                    name = func.name
                    if (func.static)
                    {
                        name = '@' + name
                    }
                    indt = (func.class ? '   ' : ' ')
                    func.name = indt + symbol + ' ' + name
                }
                func.file = ((_219_26_=func.file) != null ? _219_26_ : clss.file)
                func.inherited = true
                items.push(func)
            }
        }
        return items
    }

    funtree.prototype["jumpTo"] = function (choice)
    {
        if (choice.inherited && !slash.samePath(choice.file,this.editor.currentFile))
        {
            return post.emit('file.open',choice.file,choice.line - 1,'ind','topDelta')
        }
        else
        {
            return post.emit('goto.line',choice.line - 1,'ind','topDelta')
        }
    }

    funtree.prototype["emitAction"] = function (action, choice, event)
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

        return funtree.__super__.emitAction.call(this,action,choice,event)
    }

    return funtree
})()

export default funtree;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVudHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZnVudHJlZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFTO0lBQUs7SUFBTTs7T0FDWCxZQUFaO09BQWtCLFlBQWxCO09BQXdCLFlBQXhCOztPQUNZLFdBQVA7O09BQ08sY0FBWDs7T0FDVyxjQUFmOztBQUVQLFVBQ0ksS0FBZSxJQUNmLFFBQWUsS0FDZixNQUFlLEtBQ2YsY0FBZSxLQUNmLFlBQWU7O0FBRWxCLGFBQUQ7O2FBRUksV0FBSTs7UUFBRDs7Ozs7Ozs7O1FBRUMsS0FBQyxTQUNHLE1BQWdCLE1BQU0sUUFBUSxNQUM5QixNQUFnQixNQUFNLFFBQVEsTUFDOUIsTUFBZ0IsTUFBTSxRQUFRLE1BQzlCLFlBQWdCLE1BQU0sUUFBUSxZQUM5QixLQUFnQixNQUFNLFFBQVEsS0FDOUIsV0FBZ0IsTUFBTSxRQUFRLFdBQzlCLE1BQWdCLE1BQU0sUUFBUSxNQUM5QixNQUFnQixNQUFNLFFBQVEsTUFDOUIsTUFBZ0IsTUFBTSxRQUFRLE1BQzlCLE1BQWdCLE1BQU0sUUFBUSxNQUM5QixHQUFnQixNQUFNLE9BQU8sV0FDN0IsR0FBZ0IsTUFBTSxPQUFPLFdBQzdCLEdBQWdCLE1BQU0sT0FBTyxXQUM3QixHQUFnQixNQUFNLE9BQU8sV0FDN0IsR0FBZ0IsTUFBTSxPQUFPOzs7eUJBRXJDOzs7eUJBRUEsdUJBQVU7O1FBQVMsWUFBSTs7O3lCQUN2Qix1QkFBVTs7O3lCQUVWLHVCQUFVLEdBQUU7O2VBQUs7Ozt5QkFDakIseUJBQVk7Ozs7O3lCQUNaLHVCQUFVLEdBQUU7Ozs7UUFFUixPQUFPLEtBQUMsS0FBSyxNQUFNO1FBQ25CLE9BQU8sS0FBSztRQUNaLE9BQU8sS0FBSztZQUNULFNBQVE7O29CQUFVLEVBQUUsRUFBRTs7WUFHckIsS0FBSzs7WUFBYSxNQUFNLEtBQUMsTUFBTTs7aUJBQy9CLEtBQUs7O1lBQWEsTUFBTSxLQUFDLE1BQU0sS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funtree.kode
