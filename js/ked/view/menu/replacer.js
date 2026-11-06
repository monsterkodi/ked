var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var replacer

import kxk from "../../../kxk.js"
let post = kxk.post
let nfs = kxk.nfs

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

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
        this.setColor('included',theme.replacer.included)
        this.setColor('excluded',theme.replacer.excluded)
        this.choices.gutter.fgcolor = (function (x, y, c)
        {
            if (c === '✔')
            {
                return this.color.included
            }
            if (c === '✘')
            {
                return this.color.excluded
            }
        }).bind(this)
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
        var _52_45_

        return ((_52_45_=this.excludedPaths[path]) != null ? _52_45_ : false)
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
    
        var _98_25_

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
        if (_k_.in(action,['space','click']))
        {
            if ((choice != null ? choice.type : undefined) === 'file')
            {
                return this.toggleFile(choice.path)
            }
            if (_k_.isNum((choice != null ? choice.row : undefined)))
            {
                return this.toggleLine(choice)
            }
            if (action === 'click')
            {
                return
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
        var applied, change, changed, changedLines, changes, err, errors, file, item, line, lines, newText, parts, replaced, result, search, sfil, text, _241_33_

        search = ((_241_33_=this.lastSearchText) != null ? _241_33_ : this.input.current())
        if (_k_.empty(search))
        {
            return
        }
        changedLines = 0
        applied = []
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
            changes = []
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
                changes.push({line:item.row,from:line,to:replaced})
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
            applied.push({path:sfil.path,changes:changes})
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
        console.log(`\nreplacing '${search}' with '${replacement}' in ${applied.length} files, ${changedLines} lines`)
        var list3 = _k_.list(applied)
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            file = list3[_d_]
            console.log(`\n● ${file.path}\n`)
            var list4 = _k_.list(file.changes)
            for (var _e_ = 0; _e_ < list4.length; _e_++)
            {
                change = list4[_e_]
                console.log(`${change.line + 1}:`)
                console.log(change.from)
                console.log(change.to)
            }
        }
        console.log(`\nreplaced ${applied.length} files, ${changedLines} lines`)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9yZXBsYWNlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNO0lBQUs7O09BQ04sWUFBUjtPQUFjLFlBQWQ7O09BQ1EsYUFBUDs7T0FDTyxZQUFYOztPQUNXLG1CQUFBO09BQWEsZUFBQTs7O0FBQzlCLFlBQUQ7O3lCQUFVO2FBR04sVUFBSSxRQUFRLFFBQVE7O1FBQWpCO1FBQVE7UUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpREFFVCxLQUFDLE9BQU8sS0FBQyxPQUFPLEtBQUM7WUFFcEIsS0FBQyxTQUFROztZQUNSLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztZQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQzs7UUFFN0IsS0FBQztRQUNELEtBQUMsV0FBVztRQUNaLEtBQUM7UUFDRCxLQUFDLFdBQVc7UUFFWixLQUFDLG1CQUFtQixNQUFNLEtBQUMsVUFBVSxLQUFDO1FBQ3RDLEtBQUMsYUFBYSxTQUFTLFVBQVUsS0FBQyxNQUFNO1FBQ3hDLEtBQUMsYUFBYSxHQUFHLFNBQVMsS0FBQztRQUUzQixLQUFDLFNBQVMsV0FBVyxNQUFNLFNBQVM7UUFDcEMsS0FBQyxTQUFTLFdBQVcsTUFBTSxTQUFTO1FBRXBDLEtBQUMsUUFBUSxPQUFPLHFCQUFXLEdBQUUsR0FBRTs7Z0JBQ3hCLE1BQUs7O3VCQUNGLEtBQUMsTUFBTTs7Z0JBQ1YsTUFBSzs7dUJBQ0YsS0FBQyxNQUFNOzs7Ozt3QkFFckIseUJBQU0sTUFBSzs7OztRQUVQLEtBQUMsWUFBWTtRQUNiLEtBQUM7UUFDRCxLQUFDO1FBRUQsWUFBWSxLQUFDLE9BQU8sS0FBSzt1QkFFYyxLQUFDLE1BQU07O1lBQTlDLEtBQUMsYUFBYTs7cUJBRVo7Ozt3QkFFTixnQ0FBb0IsUUFBTzs7UUFBUjs7bUJBRVgsYUFBYSxLQUFDLE9BQU8sS0FBSzs7O3dCQUVsQyx5QkFBWTs7Ozt5QkFBUSxLQUFDLGNBQWMsMkJB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/replacer.kode
