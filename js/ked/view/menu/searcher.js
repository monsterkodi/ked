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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9zZWFyY2hlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFTO0lBQUs7SUFBSzs7T0FDVixXQUFQOztPQUNPLGFBQVg7T0FBa0IsYUFBbEI7O09BQ1csV0FBZjs7T0FDZSxhQUFBO09BQU8sbUJBQUE7OztBQUM1QixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7OztpREFFVCxLQUFDLE9BQU8sS0FBQyxPQUFPLEtBQUM7WUFFcEIsS0FBQyxTQUFROztZQUNSLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztZQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQzs7UUFFN0IsS0FBQztRQUNELEtBQUMsV0FBVzs7O3dCQUVoQix5QkFBTSxNQUFLOztxQkFFTCxLQUFDLE9BQU8sS0FBSzs7O3dCQUVuQiwyQkFBUSxNQUFLLE9BQU0sUUFBTTs7OztRQUVyQixLQUFDLFFBQVEsTUFBTSxzQkFBc0I7UUFDckMsS0FBQyxnQkFBZ0I7UUFJakIsT0FBTyxLQUFDLFdBQVc7UUFFbkIsS0FBQyxpQkFBaUI7c0JBSVQ7O2dCQUNpQjs7Z0JBQXRCLEtBQUMsTUFBTTs7bUJBQ0wsT0FBTyxVQUFVLEtBQUssS0FBSzs7UUFFakMsYUFBYSxZQUFZLElBQUk7UUFDN0IsWUFBYSxNQUFNLElBQUk7UUFFdkIsTUFBUyxPQUFPLElBQU07UUFDdEIsU0FBQSxnQkFBQSxRQUFTLE9BQU8sTUFBTTtRQUV0QixRQUFRLEtBQUMsWUFBWSxPQUFPO1FBQzVCLFFBQVEsS0FBQyxVQUFVO1FBSW5CLEtBQUssVUFBVSxLQUFLLEtBQUs7WUFFSDs7WUFBdEIsS0FBQyxNQUFNOztRQUNQLEtBQUMsUUFBUTtRQUNULEtBQUM7UUFJRDtRQUNBLFdBQVc7UUFDWCxVQUFVO1FBQ1YsTUFBTTtRQUNOLFVBQVUsS0FBQztRQUVYLEtBQUMsWUFBWTtRQUNi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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/searcher.kode
