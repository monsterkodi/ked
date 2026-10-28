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
        features = ['scroll','gutter','mapscr','complete','filepos','replex','brckts','unype','novim','salter','uniko']
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
                    map = new srcmap()
                    src = await map.sourcePosition(func.file,func.line,Infinity)
                    if (!_k_.empty(src))
                    {
                        post.emit('file.open',src.file,src.line - 1,'ind')
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
        var counter, currentFile, currext, ext, file, _205_50_, _212_50_, _222_50_

        currentFile = ked_session.get('editor▸file')
        currext = slash.ext(currentFile)
        var list = ((_205_50_=fileutil.counterparts[currext]) != null ? _205_50_ : [])
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
        var list1 = ((_212_50_=fileutil.counterparts[currext]) != null ? _212_50_ : [])
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
        var list2 = ((_222_50_=fileutil.counterparts[currext]) != null ? _222_50_ : [])
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
        var col, ret, row, start, word, x, y, _252_69_, _340_31_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZWVkaXRvci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9lZGl0b3IvZmlsZWVkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUXNCLGFBQVQ7O09BQ0EsVUFBQTtJQUFTO0lBQUs7SUFBSzs7T0FDVixVQUFUOztPQUNTLFdBQVA7O09BQ08sYUFBWjs7T0FDWSxlQUFYOztPQUNXLGNBQVg7O09BQ1csV0FBZjs7T0FDZSxjQUFmOztPQUNlLGFBQUE7OztBQUViLGNBQVQ7OzJCQUE0QjthQUV4QixZQUFHLFFBQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFTixZQUNJLFNBQ0EsU0FDQSxTQUNBLFdBRUEsVUFDQSxTQUNBLFNBRUEsUUFDQSxRQUNBLFNBQ0E7bURBR0UsT0FBTyxLQUFLO1lBRWYsS0FBQyxNQUFNOztZQUFTLEtBQUMsYUFBYSxPQUFPO1lBQUcsS0FBQyxPQUFPOztRQUVuRCxLQUFLLEdBQUcsbUJBQW1CLEtBQUMsTUFBTTtRQUNsQyxLQUFLLEdBQUcsWUFBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsV0FBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsV0FBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsWUFBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsV0FBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsYUFBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsYUFBbUIsS0FBQztRQUU1QixLQUFLLEdBQUcsaUJBQW1CLEtBQUM7OzswQkFFaEMsNkJBQWlCOztRQUFEOztRQUVaLEtBQUMsTUFBTTtlQUNQLEtBQUMsT0FBTzs7OzBCQUVaOzt1QkFFYSxLQUFDOztZQUNOLEtBQUMsV0FBVyxLQUFDOzBCQUNOLEtBQUM7Ozs7MEJBRWhCOztlQUVJLEtBQUMsT0FBTzs7OzBCQVFaLHdCQUFXOzs7O1FBRVAsY0FBYyxZQUFZLElBQUk7WUFDM0IsS0FBSyxTQUFROzttQkFDWixLQUFDLE9BQU8sVUFBVTs7OzswQkFlMUIseUJBQVksS0FBSSxL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/fileeditor.kode
