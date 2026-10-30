var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isArr: function (o) {return Array.isArray(o)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var fileeditor

import srcmap from "../../../kode/srcmap.js"

import kxk from "../../../kxk.js"
let post = kxk.post
let kstr = kxk.kstr
let slash = kxk.slash
let nfs = kxk.nfs

import belt from "../../edit/tool/belt.js"

import editor from "../../edit/editor.js"

import fileutil from "../../util/fileutil.js"

import indexer from "../../index/indexer.js"

import view from "../base/view.js"

import context from "../menu/context.js"

import mapscr from "./mapscr.js"


fileeditor = (function ()
{
    _k_.extend(fileeditor, editor)
    function fileeditor (screen, name)
    {
        var features

        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["jumpToCounterpart"] = this["jumpToCounterpart"].bind(this)
        this["singleCursorAtLine"] = this["singleCursorAtLine"].bind(this)
        this["jumpToWord"] = this["jumpToWord"].bind(this)
        this["onContextChoice"] = this["onContextChoice"].bind(this)
        this["onContext"] = this["onContext"].bind(this)
        this["onGotoFunc"] = this["onGotoFunc"].bind(this)
        this["onGotoEof"] = this["onGotoEof"].bind(this)
        this["onGotoBof"] = this["onGotoBof"].bind(this)
        this["onGotoLine"] = this["onGotoLine"].bind(this)
        this["onGitDiff"] = this["onGitDiff"].bind(this)
        this["onGitCommit"] = this["onGitCommit"].bind(this)
        this["onFuntreeLoaded"] = this["onFuntreeLoaded"].bind(this)
        this["setCurrentFile"] = this["setCurrentFile"].bind(this)
        features = ['scroll','gutter','mapscr','complete','filepos','replex','brckts','unype','novim','salter']
        fileeditor.__super__.constructor.call(this,screen,name,features)
        if (this.feats.mapscr)
        {
            this.mapscr = new mapscr(this)
            this.mapscr.show()
        }
        post.on('editor.highlight',this.state.highlightText)
        post.on('goto.line',this.onGotoLine)
        post.on('goto.bof',this.onGotoBof)
        post.on('goto.eof',this.onGotoEof)
        post.on('goto.func',this.onGotoFunc)
        post.on('git.diff',this.onGitDiff)
        post.on('git.commit',this.onGitCommit)
        post.on('jumpToWord',this.jumpToWord)
        post.on('funtree.loaded',this.onFuntreeLoaded)
    }

    fileeditor.prototype["setCurrentFile"] = function (currentFile)
    {
        this.currentFile = currentFile
    
        this.cells.meta_clear()
        return this.gutter.clearChanges()
    }

    fileeditor.prototype["onFuntreeLoaded"] = function ()
    {
        if (!_k_.empty(this.gotoFuncOnLoad))
        {
            this.onGotoFunc(this.gotoFuncOnLoad)
            return delete this.gotoFuncOnLoad
        }
    }

    fileeditor.prototype["onGitCommit"] = function ()
    {
        return this.gutter.clearChanges()
    }

    fileeditor.prototype["onGitDiff"] = function (diff)
    {
        var currentFile

        currentFile = ked_session.get('editor▸file')
        if (diff.file === currentFile)
        {
            return this.gutter.onGitDiff(diff)
        }
    }

    fileeditor.prototype["onGotoLine"] = function (row, col, view)
    {
        var adjust, mc

        mc = this.state.mainCursor()
        col = (col != null ? col : mc[0])
        if (_k_.isStr(col))
        {
            switch (col)
            {
                case 'ind':
                    col = belt.numIndent(this.state.s.lines[row])
                    break
            }

        }
        if (!_k_.empty(view) && _k_.isArr(view))
        {
            this.state.setView(view)
            return this.state.setCursors([[col,row]])
        }
        else
        {
            adjust = (view != null ? view : 'topBotDeltaGrow')
            return this.state.setCursors([[col,row]],{adjust:adjust})
        }
    }

    fileeditor.prototype["onGotoBof"] = function ()
    {
        return this.state.moveCursors('bof')
    }

    fileeditor.prototype["onGotoEof"] = function ()
    {
        return this.state.moveCursors('eof')
    }

    fileeditor.prototype["onGotoFunc"] = function (func)
    {
        var li

        if (li = this.funtree.lineIndexForFunc(func))
        {
            return this.onGotoLine(li,'ind','topDelta')
        }
    }

    fileeditor.prototype["onContext"] = function (event)
    {
        var word

        word = this.state.textOfSelectionOrWordAtCursor()
        if (!_k_.empty(word))
        {
            word = ` '${word}'`
        }
        return context.show(event.cell,this.onContextChoice,[`search${word}`,`find${word}`,'status'])
    }

    fileeditor.prototype["onContextChoice"] = function (choice)
    {
        if (choice.startsWith('search'))
        {
            return post.emit('searcher.show',kstr.trim(choice.slice(6, -1)," '"))
        }
        else if (choice.startsWith('find'))
        {
            return post.emit('finder.show',kstr.trim(choice.slice(4, -1)," '"))
        }
        else
        {
            switch (choice)
            {
                case 'status':
                    return post.emit('differ.status')

            }

        }
    }

    fileeditor.prototype["jumpToWord"] = async function (word)
    {
        var canJumpTo, clss, currentFile, fun, func, idx, map, src

        console.log(`fileeditor.jumpToWord '${word}'`)
        currentFile = ked_session.get('editor▸file')
        canJumpTo = (function (fileLine)
        {
            if (_k_.empty(fileLine))
            {
                return false
            }
            if (fileLine.file !== currentFile || fileLine.line !== this.state.mainCursor()[1] + 1)
            {
                post.emit('file.open',fileLine.file,fileLine.line - 1,'ind')
                return true
            }
            return false
        }).bind(this)
        if (clss = indexer.singleton.classes[word])
        {
            console.log("clss.file",clss.file)
            post.emit('file.open',clss.file,clss.line - 1)
            return true
        }
        else if (func = indexer.singleton.funcs[word])
        {
            if (_k_.isArr(func))
            {
                func = func.filter(function (f)
                {
                    return slash.ext(f.file) === slash.ext(currentFile)
                })
                var list = _k_.list(func)
                for (idx = 0; idx < list.length; idx++)
                {
                    fun = list[idx]
                    if (fun.file === currentFile)
                    {
                        func = func[(idx + 1) % func.length]
                        break
                    }
                }
                if (_k_.isArr(func))
                {
                    func = func[0]
                }
            }
            if (!_k_.empty(func.file))
            {
                if (slash.ext(func.file) === 'js')
                {
                    map = new srcmap()
                    src = await map.sourcePosition(func.file,func.line,Infinity)
                    if (canJumpTo(src))
                    {
                        return true
                    }
                }
                if (canJumpTo(func))
                {
                    return true
                }
            }
        }
        if (indexer.singleton.words[word])
        {
            post.emit('searcher.show',word,Array.from(indexer.singleton.words[word]))
            return true
        }
        console.log(`fileeditor.jumpToWord('${word}') nothing to jump to`)
        return false
    }

    fileeditor.prototype["singleCursorAtLine"] = function (li)
    {
        if (_k_.empty(li))
        {
            return
        }
        this.state.setCursors([[0,li]],{main:'ind',adjust:'topBotDelta'})
        return post.emit('redraw')
    }

    fileeditor.prototype["jumpToCounterpart"] = async function ()
    {
        var counter, currentFile, currext, ext, file, _215_50_, _222_50_, _232_50_

        currentFile = ked_session.get('editor▸file')
        currext = slash.ext(currentFile)
        var list = ((_215_50_=fileutil.counterparts[currext]) != null ? _215_50_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            ext = list[_a_]
            if (await nfs.fileExists(slash.swapExt(currentFile,ext)))
            {
                this.gotoFuncOnLoad = this.funtree.current()
                post.emit('file.open',slash.swapExt(currentFile,ext))
                return
            }
        }
        var list1 = ((_222_50_=fileutil.counterparts[currext]) != null ? _222_50_ : [])
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            ext = list1[_b_]
            counter = slash.swapExt(currentFile,ext)
            file = fileutil.swapLastDir(counter,currext,ext)
            if (await nfs.fileExists(file))
            {
                this.gotoFuncOnLoad = this.funtree.current()
                post.emit('file.open',file)
                return
            }
        }
        var list2 = ((_232_50_=fileutil.counterparts[currext]) != null ? _232_50_ : [])
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            ext = list2[_c_]
            counter = slash.swapExt(currentFile,ext)
            if (_k_.in(currext,['noon']))
            {
                file = fileutil.swapLastDir(counter,'kode','js')
                if (await nfs.fileExists(file))
                {
                    post.emit('file.open',file)
                    return
                }
            }
            if (_k_.in(currext,['json']))
            {
                file = fileutil.swapLastDir(counter,'js','kode')
                if (await nfs.fileExists(file))
                {
                    post.emit('file.open',file)
                    return
                }
            }
        }
        console.log('cant find counterpart',currentFile)
    }

    fileeditor.prototype["onMouse"] = function (event)
    {
        var col, ret, row, start, word, x, y, _262_69_, _350_31_

        ret = fileeditor.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        if (!(this.dragStart || this.cells.isInsideEvent(event) || ((this.gutter != null ? this.gutter.cells.isInsideEvent(event) : undefined))))
        {
            return this.hover
        }
        var _a_ = this.eventPos(event); col = _a_[0]; row = _a_[1]

        switch (event.type)
        {
            case 'press':
                if (event.count > 1)
                {
                    if (!event.shift && event.button === 'left')
                    {
                        this.state.deselect()
                    }
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    this.state.clearHighlights()
                    if (event.count === 2)
                    {
                        if (event.alt)
                        {
                            this.state.selectChunk(x,y)
                        }
                        else
                        {
                            this.state.selectWord(x,y)
                        }
                    }
                    else
                    {
                        this.state.selectLine(y)
                    }
                    this.state.highlightSelection()
                    this.dragStart = _k_.copy(this.state.s.selections[0])
                    return {redraw:true}
                }
                else
                {
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    if (event.cmd || event.ctrl)
                    {
                        if (word = belt.wordAtPos(this.state.s.lines,[x,y]))
                        {
                            if (this.jumpToWord(word))
                            {
                                return
                            }
                        }
                    }
                    this.dragStart = [x,y,x]
                    if (!event.shift && event.button === 'left')
                    {
                        this.state.deselect()
                    }
                    if (!event.alt)
                    {
                        this.state.clearCursors()
                    }
                    if (event.alt)
                    {
                        this.state.addCursor(x,y)
                    }
                    else
                    {
                        if (event.shift && this.state.s.cursors.length === 1)
                        {
                            this.state.setMainCursorAndSelect(x,y)
                        }
                        else
                        {
                            this.state.setMainCursor(x,y)
                        }
                    }
                    this.grabFocus()
                    return {redraw:true}
                }
                break
            case 'drag':
                if (this.dragStart)
                {
                    x = col + this.state.s.view[0]
                    y = row + this.state.s.view[1]
                    start = [this.dragStart[0],this.dragStart[1]]
                    if (y < this.dragStart[1])
                    {
                        start = [this.dragStart[2],this.dragStart[1]]
                    }
                    if (event.shift)
                    {
                        this.state.addRangeToSelectionWithMainCursorAtEnd(belt.rangeFromStartToEnd(start,[x,y]))
                    }
                    else
                    {
                        this.state.select(start,[x,y])
                    }
                    return {redraw:true}
                }
                break
            case 'release':
                delete this.dragStart
                break
            case 'move':
                if (this.hover)
                {
                    if (!this.hasFocus() && _k_.empty(view.currentPopup))
                    {
                        this.grabFocus()
                    }
                    post.emit('pointer','text')
                }
                else if ((this.gutter != null ? this.gutter.cells.isInsideEvent(event) : undefined))
                {
                    post.emit('pointer','vertical-text')
                }
                break
        }

        return this.hover
    }

    fileeditor.prototype["onWheel"] = function (event)
    {
        var start, steps, x, y

        if (event.cell[1] >= this.cells.y + this.cells.rows)
        {
            return
        }
        if (this.dragStart)
        {
            steps = 1
            if (event.shift)
            {
                steps *= 2
            }
            if (event.ctrl)
            {
                steps *= 2
            }
            if (event.alt)
            {
                steps *= 2
            }
            var _a_ = this.state.mainCursor(); x = _a_[0]; y = _a_[1]

            switch (event.dir)
            {
                case 'up':
                    y -= steps
                    break
                case 'down':
                    y += steps
                    break
                case 'left':
                    x -= 1
                    break
                case 'right':
                    x += 1
                    break
            }

            y = _k_.clamp(0,this.state.s.lines.length - 1,y)
            x = _k_.clamp(0,this.state.s.lines[y].length - 1,x)
            start = [this.dragStart[0],this.dragStart[1]]
            if (y < this.dragStart[1])
            {
                start = [this.dragStart[2],this.dragStart[1]]
            }
            if (this.state.select(start,[x,y]))
            {
                this.redraw()
            }
            return
        }
        return fileeditor.__super__.onWheel.call(this,event)
    }

    return fileeditor
})()

export default fileeditor;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZWVkaXRvci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9lZGl0b3IvZmlsZWVkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUXNCLGFBQVQ7O09BQ0EsVUFBQTtJQUFTO0lBQUs7SUFBSztJQUFNOztPQUNoQixXQUFQOztPQUNPLGFBQVo7O09BQ1ksZUFBWDs7T0FDVyxjQUFYOztPQUNXLFdBQWY7O09BQ2UsY0FBZjs7T0FDZSxhQUFBOzs7QUFFYixjQUFUOzsyQkFBNEI7YUFFeEIsWUFBRyxRQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRU4sWUFDSSxTQUNBLFNBQ0EsU0FDQSxXQUVBLFVBQ0EsU0FDQSxTQUVBLFFBQ0EsUUFDQTttREFHRSxPQUFPLEtBQUs7WUFFZixLQUFDLE1BQU07O1lBQVMsS0FBQyxhQUFhLE9BQU87WUFBRyxLQUFDLE9BQU87O1FBRW5ELEtBQUssR0FBRyxtQkFBbUIsS0FBQyxNQUFNO1FBQ2xDLEtBQUssR0FBRyxZQUFtQixLQUFDO1FBQzVCLEtBQUssR0FBRyxXQUFtQixLQUFDO1FBQzVCLEtBQUssR0FBRyxXQUFtQixLQUFDO1FBQzVCLEtBQUssR0FBRyxZQUFtQixLQUFDO1FBQzVCLEtBQUssR0FBRyxXQUFtQixLQUFDO1FBQzVCLEtBQUssR0FBRyxhQUFtQixLQUFDO1FBQzVCLEtBQUssR0FBRyxhQUFtQixLQUFDO1FBRTVCLEtBQUssR0FBRyxpQkFBbUIsS0FBQzs7OzBCQUVoQyw2QkFBaUI7O1FBQUQ7O1FBRVosS0FBQyxNQUFNO2VBQ1AsS0FBQyxPQUFPOzs7MEJBRVo7O3VCQUVhLEtBQUM7O1lBQ04sS0FBQyxXQUFXLEtBQUM7MEJBQ04sS0FBQzs7OzswQkFFaEI7O2VBRUksS0FBQyxPQUFPOzs7MEJBUVosd0JBQVc7Ozs7UUFFUCxjQUFjLFlBQVksSUFBSTtZQUMzQixLQUFLLFNBQVE7O21CQUNaLEtBQUMsT0FBTyxVQUFVOzs7OzBCQWUxQix5QkFBWSxLQUFJLEtBQUk7Ozs7UUFFaEIsS0FBSyxLQUFDLE1BQU07UUFFWixPQUFBLGNBQUEsTUFBTyxHQUFHO1lBQ0EsVUFBUDs7b0JBQ1E7O3FCQUNIO29CQUFRLE1BQU0sS0FBSyxVQUFVLEtBQUMsTUFBTSxFQUFFLE1BQU07Ozs7O3VCQUUzQyxTQUFpQixVQUFSOztZQUNkLEtBQUMsTUFBTSxRQUFRO21CQUNmLEtBQUMsTUFBTSxhQUFhLElBQUk7Ozs7WUFFeEIsVUFBUyxlQUFBLE9BQU87bUJBQ2hCLEtBQUMsTUFBTSxhQUFhLElBQUksT0FBTSxPQUFPOzs7OzBCQUU3Qzs7ZUFBYyxLQUFDLE1BQU0sWUFBWTs7OzBCQUNqQzs7ZUFBYyxLQUFDLE1BQU0sWUFBWTs7OzBCQUVqQyx5QkFBWTs7OztZQUVMLEtBQUssS0FBQyxRQUFRLGlCQUFpQjs7bUJBQzlCLEtBQUMsV0FBVyxHQUFHLE1BQU07Ozs7MEJBUTdCLHdCQUFXOzs7O1FBRVAsT0FBTyxLQUFDLE1BQU07dUJBQ0w7O1lBQU8sWUFBWTs7ZUFDNUIsUUFBUSxLQUFLLE1BQU0sS0FBSyxLQUFDLDBCQUNaLGNBQ0YsT0FDUDs7OzBCQUdSLDhCQUFpQjs7WUFFVixPQUFPLFdBQVc7O21CQUNqQixLQUFLLEtBQUssZ0JBQWdCLEtBQUssS0FBSyxhQUFPLE9BQU87O2lCQUM5QyxPQUFPLFdBQVc7O21CQUN0QixLQUFLLEtBQUssY0FBYyxLQUFLLEtBQUssYUFBTyxPQUFPOzs7O29CQUV6Qzs7cUJBQ0g7MkJBQVcsS0FBSyxLQUFLOzs7Ozs7OzBCQVFqQywrQkFBWTs7OztRQUVSLHNDQUE4QjtRQUU5QixjQUFjLFlBQVksSUFBSTtRQUU5Qix1QkFBWTs7MEJBQ1M7O3VCQUFmOztnQkFDQyxTQUFTLFNBQVEsZUFBZSxTQUFTLFNBQVEsS0FBQyxNQUFNLGFBQWEsS0FBRzs7Z0JBQ3ZFLEtBQUssS0FBSyxZQUFZLFNBQVMsS0FBSyxTQUFTLE9BQUssRUFBRTt1QkFDbEQ7O21CQUNOOztZQUVELE9BQU8sUUFBUSxVQUFVLFFBQVE7O1lBQ2hDLFlBQUksWUFBWSxLQUFLO1lBQ3JCLEtBQUssS0FBSyxZQUFZLEtBQUssS0FBSyxLQUFLLE9BQUs7bUJBQ3hDOztpQkFFRSxPQUFPLFFBQVEsVUFBVSxNQUFNOztnQkFFeEIsVUFBUjs7Z0JBRUMsT0FBTyxLQUFLLGlCQUFROzsyQkFBTSxNQUFNLElBQUksRUFBRSxVQUFTLE1BQU0sSUFBSTs7b0NBRTFDO3FCQUFQOztvQkFBSjt3QkFDRyxJQUFJLFNBQVE7O3dCQUNYLE9BQU8sTUFBTSxNQUFJLEtBQUssS0FBSzt3QkFDM0I7OztvQkFDRyxVQUFSOztvQkFDQyxPQUFPLEtBQUs7OzsyQkFFWCxLQUFLOztvQkFDUCxNQUFNLElBQUksS0FBSyxVQUFTOztvQkFDdkIsVUFBVTtvQkFDVixZQUFPLElBQUksZUFBZSxLQUFLLEtBQUssS0FBSyxLQUFLO3dCQUMzQyxVQUFVOzsrQkFDUDs7O29CQUNQLFVBQVU7OzJCQUNQOzs7O1lBRVgsUUFBUSxVQUFVLE1BQU07O1lBQ3ZCLEtBQUssS0FBSyxnQkFBZ0IsS0FBSyxNQUFNLEtBQUssUUFBUSxVQUFVLE1BQU07bUJBQ2hFOztRQUVOLHNDQUE4QjtlQUM5Qjs7OzBCQUVKLGlDQUFvQjs7c0JBRUo7Ozs7UUFFWixLQUFDLE1BQU0sYUFBYSxFQUFFLE1BQUssS0FBSyxNQUFNLE9BQU87ZUFFN0MsS0FBSyxLQUFLOzs7MEJBUWQ7Ozs7UUFFSSxjQUFjLFlBQVksSUFBSTtRQUM5QixVQUFVLE1BQU0sSUFBSTs4QkFFVCxTQUFTLGFBQWE7OztZQUE3QjtzQkFFSyxJQUFJLFdBQVcsTUFBTSxRQUFRLFlBQWE7O2dCQUMzQyxLQUFDLGlCQUFpQixLQUFDLFFBQVE7Z0JBQzNCLEtBQUssS0FBSyxZQUFZLE1BQU0sUUFBUSxZQUFhOzs7OytCQUc5QyxTQUFTLGFBQWE7OztZQUE3QjtZQUVBLFVBQVUsTUFBTSxRQUFRLFlBQVk7WUFDcEMsT0FBTyxTQUFTLFlBQVksUUFBUSxRQUFRO3NCQUV2QyxJQUFJLFdBQVc7O2dCQUNoQixLQUFDLGlCQUFpQixLQUFDLFFBQVE7Z0JBQzNCLEtBQUssS0FBSyxZQUFZOzs7OytCQUduQixTQUFTLGFBQWE7OztZQUE3QjtZQUVBLFVBQVUsTUFBTSxRQUFRLFlBQWE7dUJBRWxDLFNBQVk7O2dCQUVYLE9BQU8sU0FBUyxZQUFZLFFBQVEsT0FBTzswQkFDdEMsSUFBSSxXQUFXOztvQkFDaEIsS0FBSyxLQUFLLFlBQVk7Ozs7dUJBRzNCLFNBQVk7O2dCQUVYLE9BQU8sU0FBUyxZQUFZLFFBQVEsS0FBSzswQkFDcEMsSUFBSSxXQUFXOztvQkFDaEIsS0FBSyxLQUFLLFlBQVk7Ozs7O1FBR2xDLFlBQUksd0JBQXdCOzs7MEJBUWhDLHNCQUFTOzs7O1FBRUwsNkNBQVk7YUFBa0IsY0FBQSxJQUFLOzttQkFBWjs7Y0FFZixLQUFDLGFBQWEsS0FBQyxNQUFNLGNBQWMsWUFBVyxLQUFDLGlCQUFELEtBQUMsT0FBUSxNQUFNLGNBQWM7O21CQUM1RSxLQUFDOztrQkFFSSxLQUFDLFNBQVMsUUFBckIsY0FBSTs7Z0JBRUUsTUFBTTs7aUJBRVQ7b0JBRU8sTUFBTSxRQUFROzt5QkFFWSxNQUFNLFNBQVUsTUFBTSxXQUFROzt3QkFBdkQsS0FBQyxNQUFNOztvQkFFUCxJQUFJLE1BQU0sS0FBQyxNQUFNLEVBQUUsS0FBSztvQkFDeEIsSUFBSSxNQUFNLEtBQUMsTUFBTSxFQUFFLEtBQUs7b0JBRXhCLEtBQUMsTUFBTTt3QkFFSixNQUFNLFVBQVM7OzRCQUNYLE1BQU07OzRCQUNMLEtBQUMsTUFBTSxZQUFZLEVBQUU7Ozs7NEJBRXJCLEtBQUMsTUFBTSxXQUFXLEVBQUU7Ozs7O3dCQUV4QixLQUFDLE1BQU0sV0FBVzs7b0JBRXRCLEtBQUMsTUFBTTtvQkFFUCxLQUFDLHFCQUFpQixLQUFDLE1BQU0sRUFBRSxXQUFXOzRCQUVuQyxPQUFPOzs7O29CQUlWLElBQUksTUFBTSxLQUFDLE1BQU0sRUFBRSxLQUFLO29CQUN4QixJQUFJLE1BQU0sS0FBQyxNQUFNLEVBQUUsS0FBSzt3QkFFckIsTUFBTSxPQUFPLE1BQU07OzRCQUNmLE9BQU8sS0FBSyxVQUFVLEtBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRTs7Z0NBQ2xDLEtBQUMsV0FBVzs7Ozs7O29CQUV6QixLQUFDLGFBQWEsRUFBRSxFQUFFO3lCQUVXLE1BQU0sU0FBVSxNQUFNLFdBQVE7O3dCQUEzRCxLQUFDLE1BQU07O3lCQUNzQixNQUFNOzt3QkFBbkMsS0FBQyxNQUFNOzt3QkFFSixNQUFNOzt3QkFDTCxLQUFDLE1BQU0sVUFBVSxFQUFFOzs7OzRCQUVoQixNQUFNLFNBQVUsS0FBQyxNQUFNLEVBQUUsUUFBUSxXQUFVOzs0QkFDMUMsS0FBQyxNQUFNLHVCQUF1QixFQUFFOzs7OzRCQUVoQyxLQUFDLE1BQU0sY0FBYyxFQUFFOzs7b0JBRS9CLEtBQUM7NEJBRUUsT0FBTzs7O2lCQUVsQjtvQkFFTyxLQUFDOztvQkFFQSxJQUFJLE1BQU0sS0FBQyxNQUFNLEVBQUUsS0FBSztvQkFDeEIsSUFBSSxNQUFNLEtBQUMsTUFBTSxFQUFFLEtBQUs7b0JBRXhCLFNBQVMsS0FBQyxVQUFVLEdBQUcsS0FBQyxVQUFVO3dCQUUvQixJQUFJLEtBQUMsVUFBVTs7d0JBQ2QsU0FBUyxLQUFDLFVBQVUsR0FBRyxLQUFDLFVBQVU7O3dCQUVuQyxNQUFNOzt3QkFBUSxLQUFDLE1BQU0sdUNBQXVDLEtBQUssb0JBQW9CLE9BQU8sRUFBRTs7Ozt3QkFDaEYsS0FBQyxNQUFNLE9BQU8sT0FBTyxFQUFFOzs0QkFFckMsT0FBTzs7O2lCQUVsQjt1QkFFVyxLQUFDOztpQkFFWjtvQkFFTyxLQUFDOzt5QkFFTyxLQUFDLHdCQUFxQixLQUFLOzt3QkFDOUIsS0FBQzs7b0JBRUwsS0FBSyxLQUFLLFVBQVU7OzBCQUVoQixLQUFDLGlCQUFELEtBQUMsT0FBUSxNQUFNLGNBQWM7O29CQUVqQyxLQUFLLEtBQUssVUFBVTs7Ozs7ZUFDaEMsS0FBQzs7OzBCQVFMLHNCQUFTOzs7O1lBRUMsTUFBTSxLQUFLLE1BQU0sS0FBQyxNQUFNLElBQUksS0FBQyxNQUFNOzs7O1lBRXRDLEtBQUM7O1lBRUEsUUFBUztnQkFDSyxNQUFNOztnQkFBcEIsU0FBUzs7Z0JBQ0ssTUFBTTs7Z0JBQXBCLFNBQVM7O2dCQUNLLE1BQU07O2dCQUFwQixTQUFTOztzQkFFRCxLQUFDLE1BQU0sY0FBZCxZQUFFOztvQkFFSSxNQUFNOztxQkFDVDtvQkFBVSxLQUFLOztxQkFDZjtvQkFBVSxLQUFLOztxQkFDZjtvQkFBVSxLQUFLOztxQkFDZjtvQkFBVSxLQUFLOzs7O1lBRW5CLGNBQVUsRUFBRSxLQUFDLE1BQU0sRUFBRSxNQUFNLFNBQU8sRUFBRTtZQUNwQyxjQUFVLEVBQUUsS0FBQyxNQUFNLEVBQUUsTUFBTSxHQUFHLFNBQU8sRUFBRTtZQUV2QyxTQUFTLEtBQUMsVUFBVSxHQUFHLEtBQUMsVUFBVTtnQkFFL0IsSUFBSSxLQUFDLFVBQVU7O2dCQUNkLFNBQVMsS0FBQyxVQUFVLEdBQUcsS0FBQyxVQUFVOztnQkFFbkMsS0FBQyxNQUFNLE9BQU8sT0FBTyxFQUFFOztnQkFDdEIsS0FBQzs7OztzREFHSDs7O1dBclhMOzs7ZUF1WEYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/fileeditor.kode
