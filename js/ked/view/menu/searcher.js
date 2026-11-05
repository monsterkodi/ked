var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = performance.now(); }, profilend: function (id) { var b = performance.now()-_k_.hrtime[id]; let f=0.001; for (let u of ['s','ms','μs','ns']) { if (u=='ns' || (b*f)>=1) { return console.log(id+' '+Number.parseFloat(b*f).toFixed(1)+' '+u); } f*=1000; }}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.y6=_k_.k.F256(_k_.k.y(6))

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
    }

    searcher.prototype["show"] = async function (text, files)
    {
        var dir, editorExt, editorFile, ext, file, filet, front, idx, items, segls, sfil, span, spans

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
        var list = _k_.list(files)
        for (idx = 0; idx < list.length; idx++)
        {
            file = list[idx]
            filet = await kacher.getText(file)
            segls = kseg.segls(filet)
            spans = belt.lineSpansForText(segls,text)
            if (idx === files.length - 1)
            {
                console.log(_k_.y6('▸▸▸ searcher done'))
                this.highlightTextAndEmitRedraw(text)
            }
            if (_k_.empty(spans))
            {
                continue
            }
            front = belt.frontmostSpans(spans)
            ext = slash.ext(file)
            items = []
            items.push({line:''})
            sfil = new searcherfile(this.screen,`${this.name}_sfil_${idx}`)
            sfil.lineIndex = this.choices.items.length + 1
            sfil.set(slash.relative(file,dir))
            this.sfils.push(sfil)
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
            this.choices.append(items,ext)
            if (this.hidden())
            {
                return
            }
            if (idx === files.length - 1)
            {
                this.highlightTextAndEmitRedraw(text)
            }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9zZWFyY2hlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFTO0lBQUs7SUFBSzs7T0FDVixXQUFQOztPQUNPLGFBQVg7T0FBa0IsYUFBbEI7O09BQ1csV0FBZjs7T0FDZSxhQUFBO09BQU8sbUJBQUE7OztBQUM1QixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUSxRQUFPLE9BQUs7O1FBQXJCO1FBQVE7Ozs7Ozs7O2lEQUVELEtBQUMsT0FBTyxLQUFDLE9BQU87WUFFbkIsS0FBQyxTQUFROztZQUNSLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztZQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQzs7UUFFN0IsS0FBQzs7O3dCQUVMLHlCQUFNLE1BQUs7Ozs7UUFJUCxPQUFPLEtBQUMsV0FBVztzQkFJVjs7WUFDTCxLQUFDLE1BQU07OztRQUdYLGFBQWEsWUFBWSxJQUFJO1FBQzdCLFlBQWEsTUFBTSxJQUFJO1FBRXZCLE1BQVMsT0FBTyxJQUFNO1FBQ3RCLFNBQUEsZ0JBQUEsUUFBUyxPQUFPLE1BQU07UUFFdEIsUUFBUSxLQUFDLFlBQVksT0FBTztRQUM1QixRQUFRLEtBQUMsVUFBVTtRQUVuQixpQ0FBeUIsTUFBTSxtQkFBbUIsWUFBWTtRQUU5RCxLQUFLLFVBQVUsS0FBSyxLQUFLO1FBRXpCLEtBQUMsTUFBTTtRQUNQLEtBQUMsUUFBUTtRQUNULEtBQUM7UUFFRDs0QkFFZ0I7YUFBUDs7WUFBTDtZQUVBLGNBQVMsT0FBTyxRQUFRO1lBRXhCLFFBQVEsS0FBSyxNQUFNO1lBQ25CLFFBQVEsS0FBSyxpQkFBaUIsTUFBTTtnQkFFakMsUUFBTyxNQUFNLFNBQU87O2dCQUNuQixZQUFJLE9BQUc7Z0JBQ1AsS0FBQywyQkFBMkI7OzBCQUVkOztnQkFBbEI7O1lBRUEsUUFBUSxLQUFLLGVBQWU7WUFDNUIsTUFBTSxNQUFNLElBQUk7WUFFaEI7WUFDQSxNQUFN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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/searcher.kode
