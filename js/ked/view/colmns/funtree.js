var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var funSyntax, funtree, SYMBOL

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"
import icons from "../../theme/icons.js"

import belt from "../../edit/tool/belt.js"

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
        this.color = {class:theme.funtree.class,async:theme.funtree.async,bound:theme.funtree.bound,bound_async:theme.funtree.bound_async,func:theme.funtree.func,func_async:theme.funtree.func_async,test0:theme.funtree.test0,test1:theme.funtree.test1,test2:theme.funtree.test2,test3:theme.funtree.test3}
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
        if (char === '▸')
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
    
        this["onFileIndexed"] = this["onFileIndexed"].bind(this)
        this["lineIndexForFunc"] = this["lineIndexForFunc"].bind(this)
        this["lineIndexOfPrevFunc"] = this["lineIndexOfPrevFunc"].bind(this)
        this["lineIndexOfNextFunc"] = this["lineIndexOfNextFunc"].bind(this)
        this["lineIndexOfCurrentFunc"] = this["lineIndexOfCurrentFunc"].bind(this)
        this["nameOfCurrentFunc"] = this["nameOfCurrentFunc"].bind(this)
        this["selectItemForLineIndex"] = this["selectItemForLineIndex"].bind(this)
        this["onCursorsSet"] = this["onCursorsSet"].bind(this)
        funtree.__super__.constructor.call(this,this.editor.screen,name,features)
        this.state.syntax = new funSyntax(this)
        this.editor.state.on('cursorsSet',this.onCursorsSet)
        post.on('file.loaded',this.clear)
        post.on('file.indexed',this.onFileIndexed)
    }

    funtree.prototype["onCursorsSet"] = function ()
    {
        return this.selectItemForLineIndex(this.editor.state.mainCursor()[1])
    }

    funtree.prototype["selectItemForLineIndex"] = function (li)
    {
        var idx, item

        var list = _k_.list(this.items)
        for (idx = 0; idx < list.length; idx++)
        {
            item = list[idx]
            if (item.line - 1 <= li && (idx >= this.items.length - 1 || this.items[idx + 1].line - 1 > li))
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
        return (this.items[this.currentIndex() + 1] != null ? this.items[this.currentIndex() + 1].line : undefined) - 1
    }

    funtree.prototype["lineIndexOfPrevFunc"] = function ()
    {
        return (this.items[this.currentIndex() - 1] != null ? this.items[this.currentIndex() - 1].line : undefined) - 1
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
        var clss, clssl, func, funcs, indt, items, name, symbol, _159_22_

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
            clss.file = ((_159_22_=clss.file) != null ? _159_22_ : path)
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
                        symbol = SYMBOL.unbound
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
        this.set(items,'name')
        post.emit('funtree.loaded')
        this.onCursorsSet()
        return post.emit('redraw')
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
            case 'right':
                post.emit('goto.line',choice.line - 1,'ind','topDelta')
                return

            case 'click':
            case 'return':
                post.emit('goto.line',choice.line - 1,'ind','topDelta')
                post.emit('focus','editor')
                return

            case 'drag':
                post.emit('goto.line',choice.line - 1,'ind','topDelta')
                return

        }

        return funtree.__super__.emitAction.call(this,action,choice,event)
    }

    return funtree
})()

export default funtree;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVudHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZnVudHJlZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsVUFDSSxLQUFlLElBQ2YsUUFBZSxLQUNmLE1BQWUsS0FDZixjQUFlLEtBQ2YsWUFBZTs7QUFFVixhQUFUOzthQUVJLFdBQUc7Ozs7Ozs7Ozs7O1FBRUMsS0FBQyxTQUNHLE1BQWdCLE1BQU0sUUFBUSxNQUM5QixNQUFnQixNQUFNLFFBQVEsTUFDOUIsTUFBZ0IsTUFBTSxRQUFRLE1BQzlCLFlBQWdCLE1BQU0sUUFBUSxZQUM5QixLQUFnQixNQUFNLFFBQVEsS0FDOUIsV0FBZ0IsTUFBTSxRQUFRLFdBQzlCLE1BQWdCLE1BQU0sUUFBUSxNQUM5QixNQUFnQixNQUFNLFFBQVEsTUFDOUIsTUFBZ0IsTUFBTSxRQUFRLE1BQzlCLE1BQWdCLE1BQU0sUUFBUTs7O3lCQUV0Qzs7O3lCQUVBLHVCQUFVOztRQUFTLFlBQUk7Ozt5QkFDdkIsdUJBQVU7Ozt5QkFRVix1QkFBVSxHQUFFOztlQUFLOzs7eUJBQ2pCLHlCQUFZOzs7Ozt5QkFDWix1QkFBVSxHQUFFOzs7O1FBRVIsT0FBTyxLQUFDLEtBQUssTUFBTTtRQUNuQixPQUFPLEtBQUs7UUFDWixPQUFPLEtBQUs7WUFDVCxTQUFROztvQkFBVSxFQUFFLEVBQUU7O1lBR3JCLEtBQUs7O1lBQWEsTUFBTSxLQUFDLE1BQU07O2lCQUMvQixLQUFLOztZQUFhLE1BQU0sS0FBQyxNQUFNLGtCQUFhLEtBQUssVUFBVSxLQUFLLFFBQU07O2lCQUN0RSxLQUFLOztZQUFhLE9BQU0sS0FBSyxRQUFRLEtBQUMsTUFBTSxjQUFjLEtBQUMsTUFBTTs7aUJBQ2pFLEtBQUs7O1lBQWEsTUFBTSxLQUFDLE1BQU07Ozs7WUFDYixNQUFNLEtBQUMsTUFBTTs7WUFFL0IsS0FBSzs7WUFBYSxNQUFNLE1BQU0sU0FBUyxJQUFJOztpQkFDM0MsU0FBUSxpQkFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funtree.kode
