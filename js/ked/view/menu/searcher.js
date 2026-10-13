var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.y6=_k_.k.F256(_k_.k.y(6))

var searcher

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

import belt from "../../edit/tool/belt.js"

import prjcts from "../../index/prjcts.js"

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
    
        this["show"] = this["show"].bind(this)
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        searcher.__super__.constructor.call(this,this.screen,this.editor,name)
        if (this.name === 'searcher')
        {
            post.on('searcher.show',this.show)
            post.on('file.loaded',this.onFileLoaded)
        }
        this.sfils = []
    }

    searcher.prototype["arrangeRect"] = function ()
    {
        return [parseInt(this.editor.cells.x - this.editor.gutter.cells.cols - 1),parseInt(this.editor.cells.y),parseInt(this.editor.cells.cols + this.editor.gutter.cells.cols + 1),parseInt(this.editor.cells.rows - 3)]
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

    searcher.prototype["show"] = async function (text)
    {
        var dir, editorFile, ext, file, files, filet, front, idx, items, segls, sfil, span, spans

        text = this.searchText(text)
        if (_k_.empty(text))
        {
            this.input.grabFocus()
            return searcher.__super__.show.call(this)
        }
        editorFile = ked_session.get('editor▸file')
        dir = prjcts.dir(editorFile)
        files = prjcts.files(editorFile)
        view.prototype.show.call(this)
        this.input.grabFocus()
        this.choices.clearEmpty()
        this.sfils = []
        var list = _k_.list(files)
        for (idx = 0; idx < list.length; idx++)
        {
            file = list[idx]
            filet = await nfs.readText(file)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9zZWFyY2hlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFpQjBCOzs7Ozs7Ozs7O2lEQUlaLEtBQUMsT0FBTyxLQUFDLE9BQU87WUFFbkIsS0FBQyxTQUFROztZQUNSLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztZQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQzs7UUFFN0IsS0FBQzs7Ozs7eUJBV08sS0FBQyxPQUFPLE1BQU0sSUFBRSxLQUFDLE9BQU8sT0FBTyxNQUFNLE9BQUssWUFDMUMsS0FBQyxPQUFPLE1BQU0sWUFDZCxLQUFDLE9BQU8sTUFBTSxPQUFLLEtBQUMsT0FBTyxPQUFPLE1BQU0sT0FBSyxZQUM3QyxLQUFDLE9BQU8sTUFBTSxPQUFLOzs7Ozs7Ozs7NEJBT2YsS0FBQzs7OztZQUNULElBQUksS0FBQyxRQUFRLE1BQU0sSUFBSSxLQUFDLFFBQVEsTUFBTSxFQUFFLEtBQUssS0FBSyxLQUFLO1lBQ3ZELEtBQUssT0FBTyxLQUFDLFFBQVEsTUFBTSxFQUFFLEVBQUUsS0FBQyxRQUFRLE1BQU0sS0FBSzs7Ozs7Ozs7WUFVakQsS0FBQzs7Ozs7NEJBSUssS0FBQzs7OztpQkFDTixLQUFDLFFBQVEsTUFBTSxFQUFFLEtBQUssTUFBTSxLQUFLLGFBQUwsS0FBSyxZQUFZLEtBQUMsUUFBUSxNQUFNLEVBQUUsS0FBSyxLQUFHLEtBQUMsUUFBUSxNQUFNOztnQkFDcEYsS0FBSzs7Ozs7Ozs7O1lBVVAsS0FBQzs7Ozs0QkFFSyxLQUFDOzs7O1lBQ1QsTUFBTSxLQUFLLFFBQVE7aUJBQWlCLGNBQUEsSUFBSzs7dUJBQVo7OztvREFFM0I7Ozs7O1lBVUEsS0FBQzs7OztRQUVQLEtBQUM7c0JBRVcsS0FBQzs7OztzQkFDRCxLQUFDOzs7O3NCQUNEOzs7O1FBRVosS0FBSyxLQUFLLG1CQUFtQixLQUFDO2VBRXZCLEtBQUM7c0JBQ0QsS0FBQzs7Ozs7UUFZUixLQUFDLGtCQUFrQixLQUFDLE1BQU07UUFDMUIsS0FBQyxrQkFBa0IsT0FBTztlQUUxQixLQUFLLEtBQUssWUFBWSxPQUFPLEtBQUssT0FBTyxJQUFJLE9BQU87Ozs7O1FBVXBELEtBQUMsUUFBUSxNQUFNLGNBQWM7ZUFDN0IsS0FBSyxLQUFLOzs7Ozs7O1FBWVYsT0FBTyxLQUFDLFdBQVc7c0JBSVY7O1lBQ0wsS0FBQyxNQUFNOzs7UUFHWCxhQUFhLFlBQVksSUFBSTtRQUU3QixNQUFRLE9BQU8sSUFBTTtRQUNyQixRQUFRLE9BQU8sTUFBTTtRQUlyQixLQUFLLFVBQVUsS0FBSyxLQUFLO1FBRXpCLEtBQUMsTUFBTTtRQUNQLEtBQUMsUUFBUTtRQUNULEtBQUM7NEJBRWU7Ozs7WUFFWixjQUFTLElBQUksU0FBUztZQUV0QixRQUFRLEtBQUssTUFBTTtZQUNuQixRQUFRLEtBQUssaUJBQWlCLE1BQU07Z0JBRWpDLFFBQU8sTUFBTSxTQUFPOztnQkFDbkIsbUJBQU87Z0JBQ1AsS0FBQywyQkFBMkI7OzBCQUVkOztnQkFBbEI7O1lBRUEsUUFBUSxLQUFLLGVBQWU7WUFDNUIsTUFBTSxNQUFNLElBQUk7WUFFaEI7WUFDQSxNQUFNLE1BQUssS0FBSztZQUVoQixXQUFXLGFBQWEsS0FBQyxVQUFVLEtBQUMsYUFBYTtZQUNqRCxLQUFLLFlBQVksS0FBQyxRQUFRLE1BQU0sU0FBTztZQUN2QyxLQUFLLElBQUksTUFBTSxTQUFTLEtBQUs7WUFDN0IsS0FBQyxNQUFNLEtBQUs7WUFFWixNQUFNLE1BQ0YsS0FBTyxJQUNQLEtBQU8sT0FDUCxLQUFPLEtBQ1AsSUFBTyxFQUNQLElBQU87aUNBRUM7Ozs7b0JBQ0wsbUJBQVUsUUFBTyxLQUFLLEtBQUc7O29CQUN4QixNQUFNLE1BQUssS0FBSzs7Z0JBQ3BCLE1BQU0sTUFDRixLQUFPLE1BQU0sS0FBSyxJQUFJLE1BQU0sS0FBSyxLQUNqQyxLQUFPLEtBQ1AsSUFBTyxLQUFLLEdBQ1osSUFBTyxLQUFLOztZQUVwQixLQUFDLFFBQVEsT0FBTyxNQUFNO2dCQUVoQixLQUFDOzs7O2dCQUVKLFFBQU8sTUFBTSxTQUFPOztnQkFDbkIsS0FBQywyQkFBMkI7Ozs7Ozs7YUFVUixpQkFBQSxPQUFROzttQkFBakMsS0FBQyxhQUFhOztrREFFWDs7Ozs7Z0JBWUM7O2lCQUVIO3VCQUFjLEtBQUMsS0FBSzs7aUJBQ3BCOzs7aUJBQ0E7Ozs7OzBEQUVFLE9BQU87Ozs7OztlQUVkIn0=
//# sourceURL=kode/ked/view/menu/searcher.kode
