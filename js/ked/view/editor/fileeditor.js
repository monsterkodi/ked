var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isArr: function (o) {return Array.isArray(o)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var fileeditor

import srcmap from "../../../kode/srcmap.js"

import kxk from "../../../kxk.js"
let post = kxk.post
let kstr = kxk.kstr
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

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
        features = ['scroll','gutter','mapscr','complete','filepos','replex','brckts','unype','salter','vimple','uniko']
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
        var clss, currentFile, fun, func, idx, map, src

        console.log(`fileeditor.jumpToWord '${word}'`)
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
                currentFile = ked_session.get('editor▸file')
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
                    console.log(`JS func.file file://${func.file}:${func.line}`)
                    console.log("FUNC",func)
                    map = new srcmap()
                    src = await map.sourcePosition(func.file,func.line)
                    if (!_k_.empty(src))
                    {
                        console.log("JS MAP",src)
                        post.emit('file.open',src.file,src.line,'ind')
                        return true
                    }
                }
                post.emit('file.open',func.file,func.line - 1,'ind')
                return true
            }
        }
        else
        {
            console.log(`fileeditor.jumpToWord(${word}) nothing found to jump to`)
        }
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
        var counter, currentFile, currext, ext, file, _206_50_, _213_50_, _223_50_

        currentFile = ked_session.get('editor▸file')
        currext = slash.ext(currentFile)
        var list = ((_206_50_=fileutil.counterparts[currext]) != null ? _206_50_ : [])
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
        var list1 = ((_213_50_=fileutil.counterparts[currext]) != null ? _213_50_ : [])
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
        var list2 = ((_223_50_=fileutil.counterparts[currext]) != null ? _223_50_ : [])
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
        var col, ret, row, start, word, x, y, _253_69_, _343_31_

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
                            console.log(`jumpToWord ${word}`,event)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZWVkaXRvci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9lZGl0b3IvZmlsZWVkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJTLGNBQVQ7OzJCQUE0QjthQUV4QixZQUFHLFFBQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFTixZQUNJLFNBQ0EsU0FDQSxTQUNBLFdBRUEsVUFDQSxTQUNBLFNBRUEsUUFDQSxTQUNBLFNBQ0E7bURBR0UsT0FBTyxLQUFLO1lBRWYsS0FBQyxNQUFNOztZQUFTLEtBQUMsYUFBYSxPQUFPO1lBQUcsS0FBQyxPQUFPOztRQUVuRCxLQUFLLEdBQUcsbUJBQW1CLEtBQUMsTUFBTTtRQUNsQyxLQUFLLEdBQUcsWUFBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsV0FBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsV0FBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsWUFBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsV0FBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsYUFBbUIsS0FBQztRQUU1QixLQUFLLEdBQUcsaUJBQW1CLEtBQUM7OzswQkFFaEMsNkJBQWdCOzs7O1FBRVosS0FBQyxNQUFNO2VBQ1AsS0FBQyxPQUFPOzs7MEJBRVo7O3VCQUVhLEtBQUM7O1lBQ04sS0FBQyxXQUFXLEtBQUM7MEJBQ04sS0FBQzs7OzswQkFFaEI7O2VBRUksS0FBQyxPQUFPOzs7MEJBUVosd0JBQVc7Ozs7UUFFUCxjQUFjLFlBQVksSUFBSTtZQUMzQixLQUFLLFNBQVE7O21CQUNaLEtBQUMsT0FBTyxVQUFVOzs7OzBCQWUxQix5QkFBWSxLQUFJLEtBQUk7Ozs7UUFFaEIsS0FBSyxLQUFDLE1BQU07UUFFWixPQUFBLGNBQUEsTUFBTyxHQUFHO3NCQUNQOztvQkFDUTs7cUJBQ0g7b0JBQVEsTUFBTSxLQUFLLFVBQVUsS0FBQyxNQUFNLEVBQUUsTUFBTTs7Ozs7dUJBRTNDLG1CQUFTOztZ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/fileeditor.kode
