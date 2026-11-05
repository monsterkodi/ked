var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = performance.now(); }, profilend: function (id) { var b = performance.now()-_k_.hrtime[id]; let f=0.001; for (let u of ['s','ms','μs','ns']) { if (u=='ns' || (b*f)>=1) { return console.log(id+' '+Number.parseFloat(b*f).toFixed(1)+' '+u); } f*=1000; }}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.y6=_k_.k.F256(_k_.k.y(6))

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
        var appended, dir, editorExt, editorFile, ext, file, filet, finalAppend, flushed, front, idx, items, maxRows, searchId, segls, sfil, span, spans

        text = this.searchText(text)
        if (_k_.empty(text))
        {
            this.input.grabFocus()
            return searcher.__super__.show.call(this)
        }
        editorFile = ked_session.get('editor▸file')
        editorExt = slash.ext(editorFile)
        dir = prjcts.dir(editorFile)
        files = (files != null ? files : prjcts.files(editorFile))
        files = this.filterFiles(files,[editorExt])
        files = this.sortFiles(files)
        console.log(`searcher - search ${files.length} files in ${dir} for |${text}|`)
        view.prototype.show.call(this)
        this.input.grabFocus()
        this.choices.clearEmpty()
        this.sfils = []
        _k_.profile('searcher')
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
            sfil = new searcherfile(this.screen,`${this.name}_sfil_${idx}`)
            sfil.lineIndex = appended + items.length + 1
            sfil.set(slash.relative(file,dir))
            this.sfils.push(sfil)
            items.push({line:''})
            items.push({line:'●',type:'file',path:file,row:0,col:0})
            var list1 = _k_.list(front)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                span = list1[_b_]
                if (items.slice(-1)[0].row !== span[1] - 1)
                {
                    items.push({line:''})
                }
                items.push({line:' ' + kseg.str(segls[span[1]]),path:file,row:span[1],col:span[2]})
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
        console.log(_k_.y6('▸▸▸ searcher done'))
        if (finalAppend || !flushed)
        {
            this.highlightTextAndEmitRedraw(text)
        }
        return _k_.profilend('searcher')
    }

    searcher.prototype["arrange"] = function ()
    {
        searcher.__super__.arrange.call(this)
    
        var sfil, y

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9zZWFyY2hlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFTO0lBQUs7SUFBSzs7T0FDVixXQUFQOztPQUNPLGFBQVg7T0FBa0IsYUFBbEI7O09BQ1csV0FBZjs7T0FDZSxhQUFBO09BQU8sbUJBQUE7OztBQUM1QixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUSxRQUFPLE9BQUs7O1FBQXJCO1FBQVE7Ozs7Ozs7O2lEQUVELEtBQUMsT0FBTyxLQUFDLE9BQU87WUFFbkIsS0FBQyxTQUFROztZQUNSLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztZQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQzs7UUFFN0IsS0FBQztRQUNELEtBQUMsV0FBVzs7O3dCQUVoQix5QkFBTSxNQUFLOzs7O1FBSVAsT0FBTyxLQUFDLFdBQVc7c0JBSVY7O1lBQ0wsS0FBQyxNQUFNOzs7UUFHWCxhQUFhLFlBQVksSUFBSTtRQUM3QixZQUFhLE1BQU0sSUFBSTtRQUV2QixNQUFTLE9BQU8sSUFBTTtRQUN0QixTQUFBLGdCQUFBLFFBQVMsT0FBTyxNQUFNO1FBRXRCLFFBQVEsS0FBQyxZQUFZLE9BQU87UUFDNUIsUUFBUSxLQUFDLFVBQVU7UUFFbkIsaUNBQXlCLE1BQU0sbUJBQW1CLFlBQVk7UUFFOUQsS0FBSyxVQUFVLEtBQUssS0FBSztRQUV6QixLQUFDLE1BQU07UUFDUCxLQUFDLFFBQVE7UUFDVCxLQUFDO1FBRUQ7UUFFQTtRQUNBLFdBQVc7UUFDWCxVQUFVO1FBQ1YsTUFBTTtRQUNOLFVBQVUsS0FBQztRQUVYLEtBQUMsWUFBWTtRQUNiLFdBQVcsS0FBQzs0QkFFSTthQUFQOztZQUFMO1lBRUEsY0FBUyxPQUFPLFFBQVE7Z0JBRW5CLGFBQVksS0FBQzs7OztZQUVsQixRQUFRLEtBQUssTUFBTTtZQUNuQixRQUFRLEtBQUssaUJBQWlCLE1BQU07MEJBRWxCOztnQkFBbEI7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/searcher.kode
