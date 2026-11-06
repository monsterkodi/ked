var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var searcher

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let slash = kxk.slash

import belt from "../../edit/tool/belt.js"

import prjcts from "../../index/prjcts.js"
import kacher from "../../index/kacher.js"

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
    
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["draw"] = this["draw"].bind(this)
        this["arrangeRect"] = this["arrangeRect"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        this["search"] = this["search"].bind(this)
        this["show"] = this["show"].bind(this)
        searcher.__super__.constructor.call(this,this.screen,this.editor,name)
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
        files = this.filterFiles(files,[editorExt])
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
        for (var _a_ = idx = lo, _b_ = hi; (_a_ <= _b_ ? idx < hi : idx > hi); (_a_ <= _b_ ? ++idx : --idx))
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
                var ext

                ext = slash.ext(f)
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

            }
            return weight(b) - weight(a)
        })
        return files
    }

    searcher.prototype["filterFiles"] = function (files, exts)
    {
        return files.filter(function (f)
        {
            return _k_.in(slash.ext(f),exts)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9zZWFyY2hlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFTO0lBQUs7SUFBSzs7T0FDVixXQUFQOztPQUNPLGFBQVg7T0FBa0IsYUFBbEI7O09BQ1csV0FBZjs7T0FDZSxhQUFBO09BQU8sbUJBQUE7OztBQUM1QixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUSxRQUFPLE9BQUs7O1FBQXJCO1FBQVE7Ozs7Ozs7OztpREFFRCxLQUFDLE9BQU8sS0FBQyxPQUFPO1lBRW5CLEtBQUMsU0FBUTs7WUFDUixLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7WUFDekIsS0FBSyxHQUFHLGNBQWdCLEtBQUM7O1FBRTdCLEtBQUM7UUFDRCxLQUFDLFdBQVc7Ozt3QkFFaEIseUJBQU0sTUFBSzs7cUJBRUwsS0FBQyxPQUFPLEtBQUs7Ozt3QkFFbkIsMkJBQVEsTUFBSyxPQUFNLFFBQU07Ozs7UUFFckIsS0FBQyxRQUFRLE1BQU0sc0JBQXNCO1FBQ3JDLEtBQUMsZ0JBQWdCO1FBSWpCLE9BQU8sS0FBQyxXQUFXO3NCQUlWOztnQkFDaUI7O2dCQUF0QixLQUFDLE1BQU07O21CQUNMLE9BQU8sVUFBVSxLQUFLLEtBQUs7O1FBRWpDLGFBQWEsWUFBWSxJQUFJO1FBQzdCLFlBQWEsTUFBTSxJQUFJO1FBRXZCLE1BQVMsT0FBTyxJQUFNO1FBQ3RCLFNBQUEsZ0JBQUEsUUFBUyxPQUFPLE1BQU07UUFFdEIsUUFBUSxLQUFDLFlBQVksT0FBTztRQUM1QixRQUFRLEtBQUMsVUFBVTtRQUluQixLQUFLLFVBQVUsS0FBSyxLQUFLO1lBRUg7O1lBQXRCLEtBQUMsTUFBTTs7UUFDUCxLQUFDLFFBQVE7UUFDVCxLQUFDO1FBSUQ7UUFDQSxXQUFXO1FBQ1gsVUFBVTtRQUNWLE1BQU07UUFDTixVQUFVLEtBQUM7UUFFWCxLQUFDLFlBQVk7UUFDYixXQUFXLEtBQUM7NEJBRUk7YUFBUDs7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/searcher.kode
