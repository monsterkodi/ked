var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var replacer

import kxk from "../../../kxk.js"
let post = kxk.post
let nfs = kxk.nfs

import color from "../../theme/color.js"

import kacher from "../../index/kacher.js"

import input from "../base/input.js"

import replacerfile from "./replacerfile.js"
import searcher from "./searcher.js"


replacer = (function ()
{
    _k_.extend(replacer, searcher)
    function replacer (screen, editor, name = 'replacer')
    {
        this.screen = screen
        this.editor = editor
        this.name = name
    
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        this["runReplacement"] = this["runReplacement"].bind(this)
        this["applyReplacement"] = this["applyReplacement"].bind(this)
        this["onReplaceInputAction"] = this["onReplaceInputAction"].bind(this)
        this["toggleLine"] = this["toggleLine"].bind(this)
        this["toggleFile"] = this["toggleFile"].bind(this)
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["moveFocus"] = this["moveFocus"].bind(this)
        this["drawInputFrame"] = this["drawInputFrame"].bind(this)
        this["drawFrame"] = this["drawFrame"].bind(this)
        this["drawChoices"] = this["drawChoices"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        this["setColor"] = this["setColor"].bind(this)
        this["onFileToggled"] = this["onFileToggled"].bind(this)
        this["show"] = this["show"].bind(this)
        replacer.__super__.constructor.call(this,this.screen,this.editor,this.name)
        if (this.name === 'replacer')
        {
            post.on('replacer.show',this.show)
            post.on('file.loaded',this.onFileLoaded)
        }
        this.sfils = []
        this.searchId = 0
        this.excludedPaths = {}
        this.applying = false
        this.replaceInput = new input(this.screen,`${this.name}_replace_input`)
        this.replaceInput.setColor('bg_blur',this.color.bg)
        this.replaceInput.on('action',this.onReplaceInputAction)
    }

    replacer.prototype["show"] = async function (text, files)
    {
        var searching

        this.searchId += 1
        this.sfils = []
        this.excludedPaths = {}
        searching = this.search(text,files)
        if (!_k_.empty(this.input.current()))
        {
            this.replaceInput.grabFocus()
        }
        return await searching
    }

    replacer.prototype["createFileHandler"] = function (screen, name)
    {
        this.screen = screen
    
        return new replacerfile(this.screen,name,this)
    }

    replacer.prototype["isExcluded"] = function (path)
    {
        var _43_45_

        return ((_43_45_=this.excludedPaths[path]) != null ? _43_45_ : false)
    }

    replacer.prototype["onFileToggled"] = function (path)
    {
        var count, end, handler, hidx, idx, items, lines, sfil

        handler = null
        var list = _k_.list(this.sfils)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sfil = list[_a_]
            if (sfil.path === path)
            {
                handler = sfil
                break
            }
        }
        if (!handler)
        {
            return
        }
        this.excludedPaths[path] = handler.excluded
        handler.headerItem.line = handler.marker
        items = this.choices.items
        idx = handler.lineIndex
        count = handler.resultItems.length
        if (handler.excluded)
        {
            end = idx + 1 + count
            items = items.slice(0, idx + 1).concat(items.slice(end))
        }
        else
        {
            items = items.slice(0, idx + 1).concat(handler.resultItems).concat(items.slice(idx + 1))
        }
        this.choices.items = items
        this.choices.fuzzied = items
        lines = items.map(function (item)
        {
            return item.line
        })
        this.choices.state.setLines(lines)
        var list1 = _k_.list(this.sfils)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            sfil = list1[_b_]
            hidx = items.indexOf(sfil.headerItem)
            if (hidx >= 0)
            {
                sfil.lineIndex = hidx
            }
        }
        this.choices.select(handler.lineIndex)
        this.choices.state.highlightText(this.input.current())
        return post.emit('redraw')
    }

    replacer.prototype["setColor"] = function (key, clr)
    {
        replacer.__super__.setColor.call(this,key,clr)
    
        var _89_25_

        if (key === 'bg')
        {
            return (this.replaceInput != null ? this.replaceInput.setColor('bg_blur',this.color.bg) : undefined)
        }
    }

    replacer.prototype["arrange"] = function ()
    {
        replacer.__super__.arrange.call(this)
    
        var h, mid, w, x, y

        var _a_ = this.arrangeRect(); x = _a_[0]; y = _a_[1]; w = _a_[2]; h = _a_[3]

        mid = parseInt(w / 2)
        this.input.layout(x + 2,y + 1,mid - 4,1)
        return this.replaceInput.layout(x + mid + 2,y + 1,w - mid - 4,1)
    }

    replacer.prototype["drawChoices"] = function ()
    {
        this.input.draw()
        this.replaceInput.draw()
        return this.choices.draw()
    }

    replacer.prototype["drawFrame"] = function ()
    {
        var mid, sy

        sy = 0
        if (this.input.visible())
        {
            mid = parseInt(this.cells.cols / 2)
            this.drawInputFrame(this.input,0,mid - 1)
            this.drawInputFrame(this.replaceInput,mid,-1)
            sy = 2
        }
        return this.cells.draw_rounded_border(0,sy,-1,-1,{fg:this.color.bg,zLayer:1001})
    }

    replacer.prototype["drawInputFrame"] = function (input, x1, x2)
    {
        var inner, outer

        if (this.cells.cols < 2)
        {
            return
        }
        outer = (input.hasFocus() ? color.brighten(this.color.bg) : this.color.bg)
        inner = (input.hasFocus() ? input.color.bg_focus : input.color.bg_blur)
        this.cells.draw_rounded_border(x1,0,x2,2,{fg:outer})
        this.cells.draw_vertical_padding(x1 + 1,1,outer,inner)
        return this.cells.draw_vertical_padding(x2 - 1,1,inner,outer)
    }

    replacer.prototype["moveFocus"] = function ()
    {
        if (this.input.hasFocus())
        {
            this.replaceInput.grabFocus()
            return this.replaceInput.selectAll()
        }
        else if (this.replaceInput.hasFocus())
        {
            this.input.grabFocus()
            return this.input.selectAll()
        }
        else
        {
            this.input.grabFocus()
            return this.input.selectAll()
        }
    }

    replacer.prototype["onKey"] = function (key, event)
    {
        var result

        if (this.hidden())
        {
            return
        }
        switch (event.combo)
        {
            case 'tab':
            case 'shift+tab':
                return this.moveFocus()

            case 'esc':
                return this.onEscape()

        }

        if (this.replaceInput.hasFocus())
        {
            if (result = this.replaceInput.onKey(key,event))
            {
                this.autoHide()
                return result
            }
            if (_k_.in(event.combo,['up','down']))
            {
                if (event.combo === 'down')
                {
                    this.choices.grabFocus()
                }
                this.autoHide()
                return true
            }
            return true
        }
        return replacer.__super__.onKey.call(this,key,event)
    }

    replacer.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden())
        {
            return
        }
        ret = this.replaceInput.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return replacer.__super__.onMouse.call(this,event)
    }

    replacer.prototype["onChoicesAction"] = function (action, choice)
    {
        if (action === 'space')
        {
            if ((choice != null ? choice.type : undefined) === 'file')
            {
                return this.toggleFile(choice.path)
            }
            if (_k_.isNum((choice != null ? choice.row : undefined)))
            {
                return this.toggleLine(choice)
            }
        }
        return replacer.__super__.onChoicesAction.call(this,action,choice)
    }

    replacer.prototype["toggleFile"] = function (path)
    {
        var sfil

        var list = _k_.list(this.sfils)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sfil = list[_a_]
            if (sfil.path === path)
            {
                return sfil.toggle()
            }
        }
    }

    replacer.prototype["toggleLine"] = function (item)
    {
        var idx, next, nextItem

        item.excluded = !item.excluded
        if (item.excluded)
        {
            idx = this.choices.items.indexOf(item)
            next = idx + 1
            while (next < this.choices.items.length)
            {
                nextItem = this.choices.items[next]
                if (nextItem.type === 'file')
                {
                    break
                }
                if (_k_.isNum(nextItem.row))
                {
                    this.choices.select(next)
                    break
                }
                next += 1
            }
        }
        return post.emit('redraw')
    }

    replacer.prototype["onReplaceInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                return this.applyReplacement(text)

            case 'up':
            case 'down':
                return this.choices.moveSelection(action)

        }

    }

    replacer.prototype["applyReplacement"] = async function (replacement)
    {
        if (this.applying)
        {
            return
        }
        this.applying = true
        try
        {
            return await this.runReplacement(replacement)
        }
        finally
        {
            return this.applying = false
        }
    }

    replacer.prototype["runReplacement"] = async function (replacement)
    {
        var changed, changedFiles, changedLines, err, errors, item, line, lines, newText, parts, replaced, result, search, sfil, text, _231_33_

        search = ((_231_33_=this.lastSearchText) != null ? _231_33_ : this.input.current())
        if (_k_.empty(search))
        {
            return
        }
        changedFiles = []
        changedLines = 0
        errors = []
        var list = _k_.list(this.sfils)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sfil = list[_a_]
            if (sfil.excluded)
            {
                continue
            }
            text = await kacher.getText(sfil.path)
            if (_k_.empty(text))
            {
                continue
            }
            lines = text.split('\n')
            changed = false
            var list1 = _k_.list(sfil.resultItems)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                item = list1[_b_]
                if (!(_k_.isNum(item.row)))
                {
                    continue
                }
                if (item.excluded)
                {
                    continue
                }
                if (item.row >= lines.length)
                {
                    continue
                }
                line = lines[item.row]
                parts = line.split(search)
                replaced = parts.join(replacement)
                if (replaced === line)
                {
                    continue
                }
                lines[item.row] = replaced
                changed = true
                changedLines += 1
            }
            if (!changed)
            {
                continue
            }
            newText = lines.join('\n')
            result = await nfs.write(sfil.path,newText)
            if ((result != null ? result.error : undefined))
            {
                errors.push(result.error)
                continue
            }
            changedFiles.push(sfil.path)
        }
        var list2 = _k_.list(errors)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            err = list2[_c_]
            console.log(err)
        }
        if (!_k_.empty(errors))
        {
            return
        }
        console.log(`replaced ${changedLines} lines in ${changedFiles.length} files`)
        this.hide()
        return post.emit('focus','editor')
    }

    replacer.prototype["onFileLoaded"] = function (file)
    {
        if (this.hidden())
        {
            return
        }
        console.log(`replacer.onFileLoaded (hide?) ${file}`)
    }

    return replacer
})()

export default replacer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9yZXBsYWNlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNO0lBQUs7O09BQ04sWUFBUjs7T0FDUSxhQUFQOztPQUNPLFlBQVg7O09BQ1csbUJBQUE7T0FBYSxlQUFBOzs7QUFDOUIsWUFBRDs7eUJBQVU7YUFHTixVQUFJLFFBQVEsUUFBUTs7UUFBakI7UUFBUTtRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lEQUVULEtBQUMsT0FBTyxLQUFDLE9BQU8sS0FBQztZQUVwQixLQUFDLFNBQVE7O1lBQ1IsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1lBQ3pCLEtBQUssR0FBRyxjQUFnQixLQUFDOztRQUU3QixLQUFDO1FBQ0QsS0FBQyxXQUFXO1FBQ1osS0FBQztRQUNELEtBQUMsV0FBVztRQUVaLEtBQUMsbUJBQW1CLE1BQU0sS0FBQyxVQUFVLEtBQUM7UUFDdEMsS0FBQyxhQUFhLFNBQVMsVUFBVSxLQUFDLE1BQU07UUFDeEMsS0FBQyxhQUFhLEdBQUcsU0FBUyxLQUFDOzs7d0JBRS9CLHlCQUFNLE1BQUs7Ozs7UUFFUCxLQUFDLFlBQVk7UUFDYixLQUFDO1FBQ0QsS0FBQztRQUVELFlBQVksS0FBQyxPQUFPLEtBQUs7dUJBRWMsS0FBQyxNQUFNOztZQUE5QyxLQUFDLGFBQWE7O3FCQUVaOzs7d0JBRU4sZ0NBQW9CLFFBQU87O1FBQVI7O21CQUVYLGFBQWEsS0FBQyxPQUFPLEtBQUs7Ozt3QkFFbEMseUJBQVk7Ozs7eUJBQVEsS0FBQyxjQUFjLDJCQUFROzs7d0JBRTNDLDRCQUFlOzs7O1FBRVgsVUFBVTs0QkFDRSxLQUFDOzs7WUFBVDtnQkFDRyxLQUFLLFNBQVE7O2dCQUNaLFVBQVU7Z0JBQ1Y7OzthQUVDOzs7O1FBRVQsS0FBQyxjQUFjLFFBQVEsUUFBUTtRQUUvQixRQUFRLFdBQVcsT0FBTyxRQUFRO1FBRWxDLFFBQVEsS0FBQyxRQUFRO1FBQ2pC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/replacer.kode
