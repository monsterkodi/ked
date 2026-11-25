var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var searcher

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let kstr = kxk.kstr
let slash = kxk.slash

import belt from "../../edit/tool/belt.js"

import prjcts from "../../index/prjcts.js"
import kacher from "../../index/kacher.js"

import config from "../../util/config.js"

import view from "../base/view.js"

import finder from "./finder.js"
import searcherfile from "./searcherfile.js"


searcher = (function ()
{
    _k_.extend(searcher, finder)
    function searcher (screen, editor, name = 'searcher')
    {
        this.screen = screen
        this.editor = editor
        this.name = name
    
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["arrangeRect"] = this["arrangeRect"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        this["search"] = this["search"].bind(this)
        this["show"] = this["show"].bind(this)
        searcher.__super__.constructor.call(this,this.screen,this.editor,this.name)
        if (this.name === 'searcher')
        {
            post.on('searcher.show',this.show)
            post.on('file.loaded',this.onFileLoaded)
        }
        this.sfils = []
        this.searchId = 0
    }

    searcher.prototype["show"] = async function (text, files)
    {
        return await this.search(text,files)
    }

    searcher.prototype["search"] = async function (text, files, focus = true)
    {
        var appended, dir, editorExt, editorFile, ext, file, filet, finalAppend, flushed, front, header, idx, items, lastRow, maxRows, result, results, searchId, segls, sfil, span, spans

        this.choices.state.gutterWidthOverride = null
        this.gutterMaxLine = 0
        text = this.searchText(text)
        this.lastSearchText = text
        if (_k_.empty(text))
        {
            if (focus)
            {
                this.input.grabFocus()
            }
            return finder.prototype.show.call(this)
        }
        editorFile = ked_session.get('editor▸file')
        editorExt = slash.ext(editorFile)
        dir = prjcts.dir(editorFile)
        files = (files != null ? files : prjcts.files(editorFile))
        files = this.filterFiles(files,editorExt)
        files = this.sortFiles(files)
        view.prototype.show.call(this)
        if (focus)
        {
            this.input.grabFocus()
        }
        this.choices.clearEmpty()
        this.sfils = []
        items = []
        appended = 0
        flushed = false
        ext = editorExt
        maxRows = this.maxResultRows()
        this.searchId += 1
        searchId = this.searchId
        var list = _k_.list(files)
        for (idx = 0; idx < list.length; idx++)
        {
            file = list[idx]
            filet = await kacher.getText(file)
            if (searchId !== this.searchId)
            {
                return
            }
            segls = kseg.segls(filet)
            spans = belt.lineSpansForText(segls,text)
            if (_k_.empty(spans))
            {
                continue
            }
            front = belt.frontmostSpans(spans)
            sfil = this.createFileHandler(this.screen,`${this.name}_sfil_${idx}`)
            sfil.path = file
            sfil.lineIndex = appended + items.length + 1
            sfil.lineCount = front.length
            header = {line:sfil.marker,type:'file',path:file,row:0,col:0}
            results = []
            lastRow = 0
            var list1 = _k_.list(front)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                if (lastRow !== span[1] - 1)
                {
                    results.push({line:''})
                }
                results.push({line:' ' + kseg.str(segls[span[1]]),path:file,row:span[1],col:span[2]})
                lastRow = span[1]
            }
            sfil.headerItem = header
            sfil.resultItems = results
            sfil.set(slash.relative(file,dir))
            this.sfils.push(sfil)
            items.push({line:''})
            items.push(header)
            if (!sfil.excluded)
            {
                var list2 = _k_.list(results)
                for (var _c_ = 0; _c_ < list2.length; _c_++)
                {
                    result = list2[_c_]
                    items.push(result)
                }
            }
            if (!flushed && appended + items.length >= maxRows)
            {
                this.choices.append(items,ext)
                appended += items.length
                items = []
                flushed = true
                this.highlightTextAndEmitRedraw(text)
                await new Promise(function (resolve)
                {
                    return setImmediate(resolve)
                })
                if (searchId !== this.searchId)
                {
                    return
                }
            }
            else if (flushed && (idx + 1) % 8 === 0)
            {
                await new Promise(function (resolve)
                {
                    return setImmediate(resolve)
                })
                if (searchId !== this.searchId)
                {
                    return
                }
            }
            if (this.hidden())
            {
                break
            }
        }
        if (searchId !== this.searchId)
        {
            return
        }
        finalAppend = false
        if (items.length)
        {
            this.choices.append(items,ext)
            finalAppend = true
            items = []
        }
        if (this.hidden())
        {
            return
        }
        if (finalAppend || !flushed)
        {
            return this.highlightTextAndEmitRedraw(text)
        }
    }

    searcher.prototype["createFileHandler"] = function (screen, name)
    {
        this.screen = screen
    
        return new searcherfile(this.screen,name)
    }

    searcher.prototype["arrange"] = function ()
    {
        var sfil, y

        this.updateGutterWidth()
        searcher.__super__.arrange.call(this)
        var list = _k_.list(this.sfils)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sfil = list[_a_]
            y = this.choices.cells.y - this.choices.state.s.view[1] + sfil.lineIndex
            sfil.layout(this.choices.cells.x,y,this.choices.cells.cols,1)
        }
    }

    searcher.prototype["arrangeRect"] = function ()
    {
        return [parseInt(this.editor.cells.x - this.editor.gutter.cells.cols - 1),parseInt(this.editor.cells.y),parseInt(this.editor.cells.cols + this.editor.gutter.cells.cols + 1),parseInt(this.editor.cells.rows - 3)]
    }

    searcher.prototype["draw"] = function ()
    {
        var sfil

        if (this.hidden())
        {
            return
        }
        searcher.__super__.draw.call(this)
        var list = _k_.list(this.sfils)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sfil = list[_a_]
            sfil.selected = this.choices.currentIndex() === sfil.lineIndex
            if ((this.choices.state.s.view[1] <= sfil.lineIndex && sfil.lineIndex < this.choices.state.s.view[1] + this.choices.cells.rows))
            {
                sfil.draw()
            }
        }
    }

    searcher.prototype["onMouse"] = function (event)
    {
        var ret, sfil

        if (this.hidden())
        {
            return
        }
        var list = _k_.list(this.sfils)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sfil = list[_a_]
            ret = sfil.onMouse(event)
            if ((ret != null ? ret.redraw : undefined))
            {
                return ret
            }
        }
        return searcher.__super__.onMouse.call(this,event)
    }

    searcher.prototype["onFileLoaded"] = function (file)
    {
        if (this.hidden())
        {
            return
        }
        this.hide()
        if (_k_.empty(this.fileToHighlight))
        {
            return
        }
        if (_k_.empty(this.textToHighlight))
        {
            return
        }
        if (_k_.empty(file))
        {
            return
        }
        post.emit('editor.highlight',this.textToHighlight)
        delete this.fileToHighlight
        return delete this.textToHighlight
    }

    searcher.prototype["maxResultRows"] = function ()
    {
        return _k_.max(1,parseInt(this.editor.cells.rows))
    }

    searcher.prototype["updateGutterWidth"] = function ()
    {
        var hi, idx, item, lo, view

        view = this.choices.state.s.view
        lo = view[1]
        hi = _k_.min(this.choices.items.length,lo + this.maxResultRows())
        for (idx = lo; idx < hi; idx++)
        {
            item = this.choices.items[idx]
            if (_k_.isNum(item.row))
            {
                this.gutterMaxLine = _k_.max(this.gutterMaxLine,item.row + 1)
            }
        }
        return this.choices.state.gutterWidthOverride = _k_.max(4,2 + Math.ceil(Math.log10(this.gutterMaxLine + 1)))
    }

    searcher.prototype["fileHeaderIndex"] = function (dir)
    {
        var current, found, idx, item

        current = this.choices.currentIndex()
        found = null
        var list = _k_.list(this.choices.items)
        for (idx = 0; idx < list.length; idx++)
        {
            item = list[idx]
            if (item.type !== 'file')
            {
                continue
            }
            if (dir > 0)
            {
                if (idx > current)
                {
                    return idx
                }
            }
            else if (idx < current)
            {
                found = idx
            }
        }
        return found
    }

    searcher.prototype["selectFileHeader"] = function (idx)
    {
        var hadInputFocus

        if (!(idx != null))
        {
            return false
        }
        hadInputFocus = this.input.hasFocus()
        this.choices.select(idx)
        if (hadInputFocus)
        {
            this.input.grabFocus()
        }
        this.choices.state.setView([0,idx])
        return true
    }

    searcher.prototype["selectNextFileHeader"] = function ()
    {
        return this.selectFileHeader(this.fileHeaderIndex(1))
    }

    searcher.prototype["selectPrevFileHeader"] = function ()
    {
        return this.selectFileHeader(this.fileHeaderIndex(-1))
    }

    searcher.prototype["emitFileOpen"] = function (choice)
    {
        this.textToHighlight = this.input.current()
        this.fileToHighlight = choice.path
        return post.emit('file.open',choice.path,choice.row,choice.col)
    }

    searcher.prototype["highlightTextAndEmitRedraw"] = function (text)
    {
        this.choices.state.highlightText(text)
        return post.emit('redraw')
    }

    searcher.prototype["sortFiles"] = function (files)
    {
        files.sort(function (a, b)
        {
            var weight

            weight = function (f)
            {
                var ext, exw, stw

                ext = slash.ext(f)
                exw = ((function ()
                {
                    switch (ext)
                    {
                        case 'kode':
                            return 1000

                        case 'noon':
                            return 900

                        case 'md':
                            return 800

                        case 'json':
                            return 20

                        case 'js':
                            return 10

                        default:
                            return 0
                    }

                }).bind(this))()
                if (!(_k_.in('/test/',f)))
                {
                    exw += 1000
                }
                stw = kstr.weight(f)
                exw += stw
                return exw
            }
            return weight(b) - weight(a)
        })
        return files
    }

    searcher.prototype["filterFiles"] = function (files, ext)
    {
        var exclude

        exclude = config.get('searcher.exclude',[])
        return files.filter(function (f)
        {
            var e

            e = slash.ext(f)
            return e === ext || !(_k_.in(e,exclude))
        })
    }

    searcher.prototype["apply"] = function (choice)
    {
        if ((choice != null ? choice.path : undefined))
        {
            return this.emitFileOpen(choice)
        }
        return searcher.__super__.apply.call(this,choice)
    }

    searcher.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                return this.show(text)

            case 'right':
                return

            case 'change':
                return

        }

        return searcher.__super__.onInputAction.call(this,action,text)
    }

    return searcher
})()

export default searcher;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9zZWFyY2hlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFTO0lBQUs7SUFBSztJQUFLOztPQUNmLFdBQVA7O09BQ08sYUFBWDtPQUFrQixhQUFsQjs7T0FDVyxhQUFYOztPQUNXLFdBQWY7O09BQ2UsYUFBQTtPQUFPLG1CQUFBOzs7QUFFNUIsWUFBRDs7eUJBQVU7YUFJTixVQUFJLFFBQVEsUUFBUTs7UUFBakI7UUFBUTtRQUFROzs7Ozs7Ozs7aURBRVQsS0FBQyxPQUFPLEtBQUMsT0FBTyxLQUFDO1lBRXBCLEtBQUMsU0FBUTs7WUFDUixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7WUFDekIsS0FBSyxHQUFHLGNBQWdCLEtBQUM7O1FBRTdCLEtBQUM7UUFDRCxLQUFDLFdBQVc7Ozt3QkFFaEIseUJBQU0sTUFBSzs7cUJBRUwsS0FBQyxPQUFPLEtBQUs7Ozt3QkFFbkIsMkJBQVEsTUFBSyxPQUFNLFFBQU07Ozs7UUFFckIsS0FBQyxRQUFRLE1BQU0sc0JBQXNCO1FBQ3JDLEtBQUMsZ0JBQWdCO1FBSWpCLE9BQU8sS0FBQyxXQUFXO1FBRW5CLEtBQUMsaUJBQWlCO3NCQUlUOztnQkFDaUI7O2dCQUF0QixLQUFDLE1BQU07O21CQUNMLE9BQU8sVUFBVSxLQUFLLEtBQUs7O1FBRWpDLGFBQWEsWUFBWSxJQUFJO1FBQzdCLFlBQWEsTUFBTSxJQUFJO1FBRXZCLE1BQVMsT0FBTyxJQUFNO1FBQ3RCLFNBQUEsZ0JBQUEsUUFBUyxPQUFPLE1BQU07UUFFdEIsUUFBUSxLQUFDLFlBQVksTUFBTTtRQUMzQixRQUFRLEtBQUMsVUFBVTtRQUluQixLQUFLLFVBQVUsS0FBSyxLQUFLO1lBRUg7O1lBQXRCLEtBQUMsTUFBTTs7UUFDUCxLQUFDLFFBQVE7UUFDVCxLQUFDO1FBSUQ7UUFDQSxXQUFXO1FBQ1gsVUFBVTtRQUNWLE1BQU07UUFDTixVQUFVLEtBQUM7UUFF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
//# sourceURL=../../../../kode/ked/view/menu/searcher.kode
