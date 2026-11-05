var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, dbg: function (f,l,c,m,...a) { console.log(f + ':' + l + ':' + c + (m ? ' ' + m + '\n' : '\n') + a.map(function (a) { return _k_.noon(a) }).join(' '))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isArr: function (o) {return Array.isArray(o)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, noon: function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}}

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
        this["onConfigLoaded"] = this["onConfigLoaded"].bind(this)
        this["onScreenErased"] = this["onScreenErased"].bind(this)
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
        post.on('config.loaded',this.onConfigLoaded)
        post.on('funtree.loaded',this.onFuntreeLoaded)
        post.on('screen.erased',this.onScreenErased)
    }

    fileeditor.prototype["onScreenErased"] = function (rect)
    {
        var cursor, idx, imgId

        _k_.dbg("/home/kodi/s/ked/kode/ked/view/editor/fileeditor.kode", 47, 8, "rect", rect)
        var list = _k_.list(this.state.s.cursors)
        for (idx = 0; idx < list.length; idx++)
        {
            cursor = list[idx]
            if (imgId = this.cursorIds[idx])
            {
                console.log(`cursor col ${cursor[0]} line ${cursor[1]} inrect ${this.isCursorInRect(cursor,rect)}`)
                if (this.isCursorVisible(cursor) && this.isCursorInRect(cursor,rect))
                {
                    console.log(`hide~~~!!!!!!!!!!!!!!!!? ${imgId}`,cursor)
                }
            }
        }
    }

    fileeditor.prototype["onConfigLoaded"] = function (data)
    {
        return this.state.applyScales((data != null ? data.scale : undefined))
    }

    fileeditor.prototype["setCurrentFile"] = function (currentFile)
    {
        this.currentFile = currentFile
    
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
        var counter, currentFile, currext, ext, file, _190_50_, _197_50_, _207_50_

        currentFile = ked_session.get('editor▸file')
        currext = slash.ext(currentFile)
        var list = ((_190_50_=fileutil.counterparts[currext]) != null ? _190_50_ : [])
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
        var list1 = ((_197_50_=fileutil.counterparts[currext]) != null ? _197_50_ : [])
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
        var list2 = ((_207_50_=fileutil.counterparts[currext]) != null ? _207_50_ : [])
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
        var col, ret, row, start, word, x, y, _231_69_, _316_31_

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
                    var _b_ = this.state.posForCell(col,row); x = _b_[0]; y = _b_[1]

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
                    var _c_ = this.state.posForCell(col,row); x = _c_[0]; y = _c_[1]

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
                    var _d_ = this.state.posForCell(col,row); x = _d_[0]; y = _d_[1]

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZWVkaXRvci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9lZGl0b3IvZmlsZWVkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O09BQ3NCLGFBQVQ7O09BQ0EsVUFBQTtJQUFTO0lBQUs7SUFBSztJQUFNOztPQUNoQixXQUFQOztPQUNPLGFBQVo7O09BQ1ksZUFBWDs7T0FDVyxjQUFYOztPQUNXLFdBQWY7O09BQ2UsY0FBZjs7T0FDZSxhQUFBOzs7QUFDckIsY0FBRDs7MkJBQVk7YUFFUixZQUFHLFFBQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVOLFlBQ0ksU0FDQSxTQUNBLFNBQ0EsV0FFQSxVQUNBLFNBQ0EsU0FFQSxRQUNBLFFBQ0E7bURBR0UsT0FBTyxLQUFLO1lBRWYsS0FBQyxNQUFNOztZQUFTLEtBQUMsYUFBYSxPQUFPO1lBQUcsS0FBQyxPQUFPOztRQUVuRCxLQUFLLEdBQUcsbUJBQW1CLEtBQUMsTUFBTTtRQUNsQyxLQUFLLEdBQUcsWUFBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsV0FBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsV0FBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsWUFBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsV0FBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsYUFBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsYUFBbUIsS0FBQztRQUM1QixLQUFLLEdBQUcsZ0JBQW1CLEtBQUM7UUFDNUIsS0FBSyxHQUFHLGlCQUFtQixLQUFDO1FBQzVCLEtBQUssR0FBRyxnQkFBbUIsS0FBQzs7OzBCQUVoQyw2QkFBZ0I7Ozs7aUZBQ1IsT0FBQTs0QkFHYyxLQUFDLE1BQU0sRUFBRTthQUFoQjs7WUFBUDtnQkFFRyxRQUFRLEtBQUMsVUFBVTs7Z0JBQ2xCLDBCQUFrQixPQUFPLFdBQVcsT0FBTyxhQUFhLEtBQUMsZUFBZSxPQUFPO29CQUM1RSxLQUFDLGdCQUFnQixXQUFZLEtBQUMsZUFBZSxPQUFPOztv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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/editor/fileeditor.kode
