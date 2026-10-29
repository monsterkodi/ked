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
        var clss, clssl, func, funcs, indt, items, name, symbol, _160_22_

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
            clss.file = ((_160_22_=clss.file) != null ? _160_22_ : path)
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
            case 'space':
                post.emit('goto.line',choice.line - 1,'ind','topDelta')
                return

            case 'right':
                this.selectNext()
                choice = this.choiceAtRow(this.currentIndex())
                post.emit('goto.line',choice.line - 1,'ind','topDelta')
                return

            case 'left':
                this.selectPrev()
                choice = this.choiceAtRow(this.currentIndex())
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVudHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZnVudHJlZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BTWEsVUFBQTtJQUFTO0lBQUs7O09BQ0wsVUFBVDs7T0FDUyxZQUFaO09BQWtCLFlBQWxCO09BQXdCLFlBQXhCOztPQUNZLFdBQVA7O09BQ08sY0FBZjs7QUFVUCxVQUNJLEtBQWUsSUFDZixRQUFlLEtBQ2YsTUFBZSxLQUNmLGNBQWUsS0FDZixZQUFlOztBQUVWLGFBQVQ7O2FBRUksV0FBSTs7UUFBRDs7Ozs7Ozs7O1FBRUMsS0FBQyxTQUNHLE1BQWdCLE1BQU0sUUFBUSxNQUM5QixNQUFnQixNQUFNLFFBQVEsTUFDOUIsTUFBZ0IsTUFBTSxRQUFRLE1BQzlCLFlBQWdCLE1BQU0sUUFBUSxZQUM5QixLQUFnQixNQUFNLFFBQVEsS0FDOUIsV0FBZ0IsTUFBTSxRQUFRLFdBQzlCLE1BQWdCLE1BQU0sUUFBUSxNQUM5QixNQUFnQixNQUFNLFFBQVEsTUFDOUIsTUFBZ0IsTUFBTSxRQUFRLE1BQzlCLE1BQWdCLE1BQU0sUUFBUTs7O3lCQUV0Qzs7O3lCQUVBLHVCQUFVOztRQUFTLFlBQUk7Ozt5QkFDdkIsdUJBQVU7Ozt5QkFRVix1QkFBVSxHQUFFOztlQUFLOzs7eUJBQ2pCLHlCQUFZOzs7Ozt5QkFDWix1QkFBVSxHQUFFOzs7O1FBRVIsT0FBTyxLQUFDLEtBQUssTUFBTTtRQUNuQixPQUFPLEtBQUs7UUFDWixPQUFPLEtBQUs7WUFDVCxTQUFROztvQkFBVSxFQUFFLEVBQUU7O1lBR3JCLEtBQUs7O1lBQWEsTUFBTSxLQUFDLE1BQU07O2lCQUMvQixLQUFLOztZQUFhLE1BQU0sS0FBQyxNQUFNLGtCQUFhLEtBQUssVUFBVSxLQUFLLFFBQU07O2lCQUN0RSxLQUFLOztZQUFhLE9BQU0sS0FBSyxRQUFRLEtBQUMsTUFBTSxjQUFjLEtBQUMsTUFBTTs7aUJBQ2pFLEtBQUs7O1lBQWEsTUFBTSxLQUFDLE1BQU07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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/funtree.kode
