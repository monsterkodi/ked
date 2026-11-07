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

import filterchoice from "../menu/filterchoice.js"

SYMBOL = {clss:'■',extends:'□',unbound:'->',bound:'=>',async_unbound:'◯→',async_bound:'●→'}

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
        if (item.divider)
        {
            clr = color.darken(this.color.class,0.4)
        }
        else if (item.clss)
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
    _k_.extend(funtree, filterchoice)
    function funtree (editor, name, features)
    {
        this.editor = editor
        this.name = name
    
        this["jumpTo"] = this["jumpTo"].bind(this)
        this["toggleBases"] = this["toggleBases"].bind(this)
        this["baseDividerName"] = this["baseDividerName"].bind(this)
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
        this["onSessionMerge"] = this["onSessionMerge"].bind(this)
        funtree.__super__.constructor.call(this,this.editor.screen,this.name,features)
        this.state.syntax = new funSyntax(this)
        this.showBases = true
        this.baseItems = []
        this.dividerItem = null
        this.editor.state.on('cursorsSet',this.onCursorsSet)
        post.on('file.loaded',this.clear)
        post.on('session.merge',this.onSessionMerge)
        post.on('file.indexed',this.onFileIndexed)
    }

    funtree.prototype["onSessionMerge"] = function (recent)
    {
        if (_k_.empty(recent.funtree))
        {
            return
        }
        this.showBases = recent.funtree.showBases
        return ked_session.set('funtree',recent.funtree)
    }

    funtree.prototype["onCursorsSet"] = function ()
    {
        return this.selectItemForLineIndex(this.editor.state.mainCursor()[1])
    }

    funtree.prototype["localItems"] = function ()
    {
        return this.items.filter(function (item)
        {
            return !(item.inherited || item.divider)
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
        var clss, clssl, func, funcs, indt, items, name, supr, symbol, _156_22_, _193_37_

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
            clss.file = ((_156_22_=clss.file) != null ? _156_22_ : path)
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
        supr = clssl.slice(-1)[0]
        this.baseItems = this.itemsForBaseClass(supr)
        this.dividerItem = null
        if (!_k_.empty(this.baseItems))
        {
            this.dividerItem = {divider:true,name:this.baseDividerName(this.baseItems),line:(((_193_37_=(supr != null ? supr.line : undefined)) != null ? _193_37_ : 1))}
            items.push(this.dividerItem)
            if (this.showBases)
            {
                items = items.concat(this.baseItems)
            }
        }
        this.set(items,'name')
        post.emit('funtree.loaded')
        this.onCursorsSet()
        return post.emit('redraw')
    }

    funtree.prototype["itemsForBaseClass"] = function (supr)
    {
        var clss, func, funcs, indt, items, name, symbol, _245_26_

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
                func.file = ((_245_26_=func.file) != null ? _245_26_ : clss.file)
                func.inherited = true
                items.push(func)
            }
        }
        return items
    }

    funtree.prototype["baseDividerName"] = function (baseItems)
    {
        var name, numClasses

        name = ' ' + SYMBOL.extends
        if (!this.showBases)
        {
            numClasses = baseItems.filter(function (item)
            {
                return item.clss
            }).length
            name += ' ' + numClasses
        }
        return name
    }

    funtree.prototype["toggleBases"] = function ()
    {
        var items

        if (_k_.empty(this.dividerItem))
        {
            return
        }
        this.showBases = !this.showBases
        ked_session.set('funtree▸showBases',this.showBases)
        this.dividerItem.name = this.baseDividerName(this.baseItems)
        items = this.localItems()
        items.push(this.dividerItem)
        if (this.showBases)
        {
            items = items.concat(this.baseItems)
        }
        this.set(items,'name')
        this.select(items.indexOf(this.dividerItem))
        return post.emit('redraw')
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
                if (choice.divider)
                {
                    this.toggleBases()
                }
                else
                {
                    this.jumpTo(choice)
                    this.grabFocus()
                }
                return

            case 'right':
                if (choice.divider)
                {
                    return
                }
                this.selectNext()
                choice = this.choiceAtRow(this.currentIndex())
                if (choice.divider)
                {
                    return
                }
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
                if (choice.divider)
                {
                    this.toggleBases()
                }
                else
                {
                    this.jumpTo(choice)
                    post.emit('focus','editor')
                }
                return

            case 'return':
                if (choice.divider)
                {
                    this.toggleBases()
                }
                else
                {
                    this.jumpTo(choice)
                    post.emit('focus','editor')
                }
                return

            case 'drag':
                if (choice.divider || choice.inherited)
                {
                    return
                }
                this.jumpTo(choice)
                return

        }

        return funtree.__super__.emitAction.call(this,action,choice,event)
    }

    return funtree
})()

export default funtree;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVudHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZnVudHJlZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFTO0lBQUs7SUFBTTs7T0FDWCxZQUFaO09BQWtCLFlBQWxCO09BQXdCLFlBQXhCOztPQUNZLFdBQVA7O09BQ08sY0FBWDs7T0FDVyxtQkFBZjs7QUFFUCxVQUNJLEtBQWUsSUFDZixRQUFlLElBQ2YsUUFBZSxLQUNmLE1BQWUsS0FDZixjQUFlLEtBQ2YsWUFBZTs7QUFFbEIsYUFBRDs7YUFFSSxXQUFJOztRQUFEOzs7Ozs7Ozs7UUFFQyxLQUFDLFNBQ0csTUFBZ0IsTUFBTSxRQUFRLE1BQzlCLE1BQWdCLE1BQU0sUUFBUSxNQUM5QixNQUFnQixNQUFNLFFBQVEsTUFDOUIsWUFBZ0IsTUFBTSxRQUFRLFlBQzlCLEtBQWdCLE1BQU0sUUFBUSxLQUM5QixXQUFnQixNQUFNLFFBQVEsV0FDOUIsTUFBZ0IsTUFBTSxRQUFRLE1BQzlCLE1BQWdCLE1BQU0sUUFBUSxNQUM5QixNQUFnQixNQUFNLFFBQVEsTUFDOUIsTUFBZ0IsTUFBTSxRQUFRLE1BQzlCLEdBQWdCLE1BQU0sT0FBTyxXQUM3QixHQUFnQixNQUFNLE9BQU8sV0FDN0IsR0FBZ0IsTUFBTSxPQUFPLFdBQzdCLEdBQWdCLE1BQU0sT0FBTyxXQUM3QixHQUFnQixNQUFNLE9BQU87Ozt5QkFFckM7Ozt5QkFFQSx1QkFBVTs7UUFBUyxZQUFJOzs7eUJBQ3ZCLHVCQUFVOzs7eUJBRVYsdUJBQVUsR0FBRTs7ZUFBSzs7O3lCQUNqQix5QkFBWTs7Ozs7eUJBQ1osdUJBQVUsR0FBRTs7OztRQUVSLE9BQU8sS0FBQyxLQUFLLE1BQU07UUFDbkIsT0FBTyxLQUFLO1FBQ1osT0FBTyxLQUFLO1lBQ1QsU0FBUTs7b0JBQVMsRUFBRSxFQUFFOztZQUdwQixLQUFLOztZQUFhLE1BQU0sTUFBTSxPQUFPLEtBQUMsTUFBTSxNQUFNOztpQkFDbEQsS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funtree.kode
