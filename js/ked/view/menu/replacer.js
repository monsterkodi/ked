var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var replacer

import kxk from "../../../kxk.js"
let post = kxk.post

import color from "../../theme/color.js"

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
        this["logReplacement"] = this["logReplacement"].bind(this)
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
        var _41_45_

        return ((_41_45_=this.excludedPaths[path]) != null ? _41_45_ : false)
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
    
        var _87_25_

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
                return this.logReplacement(text)

            case 'up':
            case 'down':
                return this.choices.moveSelection(action)

        }

    }

    replacer.prototype["countReplaceableLines"] = function (sfil)
    {
        var count, item

        count = 0
        var list = _k_.list(sfil.resultItems)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            if (_k_.isNum(item.row) && !item.excluded)
            {
                count += 1
            }
        }
        return count
    }

    replacer.prototype["logReplacement"] = function (replacement)
    {
        var count, files, sfil, total

        files = this.sfils.filter(function (sfil)
        {
            return !sfil.excluded
        })
        total = 0
        var list = _k_.list(files)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sfil = list[_a_]
            total += this.countReplaceableLines(sfil)
        }
        console.log(`replacer would replace '${this.input.current()}' with '${replacement}' in ${files.length} files, ${total} lines`)
        var list1 = _k_.list(files)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            sfil = list1[_b_]
            count = this.countReplaceableLines(sfil)
            console.log(`  ${sfil.path}: ${count} lines`)
        }
    }

    replacer.prototype["onFileLoaded"] = function (file)
    {
        if (this.hidden())
        {
            return
        }
        return this.hide()
    }

    return replacer
})()

export default replacer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9yZXBsYWNlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNELFlBQVI7O09BQ1EsWUFBWDs7T0FDVyxtQkFBQTtPQUFhLGVBQUE7OztBQUM5QixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7OztpREFFVCxLQUFDLE9BQU8sS0FBQyxPQUFPLEtBQUM7WUFFcEIsS0FBQyxTQUFROztZQUNSLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztZQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQzs7UUFFN0IsS0FBQztRQUNELEtBQUMsV0FBVztRQUNaLEtBQUM7UUFFRCxLQUFDLG1CQUFtQixNQUFNLEtBQUMsVUFBVSxLQUFDO1FBQ3RDLEtBQUMsYUFBYSxTQUFTLFVBQVUsS0FBQyxNQUFNO1FBQ3hDLEtBQUMsYUFBYSxHQUFHLFNBQVMsS0FBQzs7O3dCQUUvQix5QkFBTSxNQUFLOzs7O1FBRVAsS0FBQyxZQUFZO1FBQ2IsS0FBQztRQUNELEtBQUM7UUFFRCxZQUFZLEtBQUMsT0FBTyxLQUFLO3VCQUVjLEtBQUMsTUFBTTs7WUFBOUMsS0FBQyxhQUFhOztxQkFFWjs7O3dCQUVOLGdDQUFvQixRQUFPOztRQUFSOzttQkFFWCxhQUFhLEtBQUMsT0FBTyxLQUFLOzs7d0JBRWxDLHlCQUFZOzs7O3lCQUFRLEtBQUMsY0FBYywyQkFBUTs7O3dCQUUzQyw0QkFBZTs7OztRQUVYLFVBQVU7NEJBQ0UsS0FBQzs7O1lBQVQ7Z0JBQ0csS0FBSyxTQUFROztnQkFDWixVQUFVO2dCQUNWOzs7YUFFQzs7OztRQUVULEtBQUMsY0FBYyxRQUFRLFFBQVE7UUFFL0IsUUFBUSxXQUFXLE9BQU8sUUFBUTtRQUVsQyxRQUFRLEtBQUMsUUFBUTtRQUNqQixNQUFRLFFBQVE7UUFDaEIsUUFBUSxRQUFRLFlBQVk7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/replacer.kode
