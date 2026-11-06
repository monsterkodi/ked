var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
        var _37_45_

        return ((_37_45_=this.excludedPaths[path]) != null ? _37_45_ : false)
    }

    replacer.prototype["onFileToggled"] = async function (path)
    {
        var hadChoicesFocus, handler, sfil

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
        hadChoicesFocus = this.choices.hasFocus()
        await this.search(this.input.current(),null,false)
        handler = null
        var list1 = _k_.list(this.sfils)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            sfil = list1[_b_]
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
        if (!hadChoicesFocus)
        {
            return
        }
        this.choices.select(handler.lineIndex)
        this.choices.state.setView([0,handler.lineIndex])
        this.choices.grabFocus()
        return post.emit('redraw')
    }

    replacer.prototype["setColor"] = function (key, clr)
    {
        replacer.__super__.setColor.call(this,key,clr)
    
        var _75_25_

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
        if (action === 'space' && (choice != null ? choice.type : undefined) === 'file')
        {
            return this.toggleFile(choice.path)
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

    replacer.prototype["logReplacement"] = function (replacement)
    {
        var count, files, sfil, total, _188_36_, _193_35_

        files = this.sfils.filter(function (sfil)
        {
            return !sfil.excluded
        })
        total = 0
        var list = _k_.list(files)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sfil = list[_a_]
            total += ((_188_36_=sfil.lineCount) != null ? _188_36_ : 0)
        }
        console.log(`replacer would replace '${this.input.current()}' with '${replacement}' in ${files.length} files, ${total} lines`)
        var list1 = _k_.list(files)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            sfil = list1[_b_]
            count = ((_193_35_=sfil.lineCount) != null ? _193_35_ : 0)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9yZXBsYWNlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNELFlBQVI7O09BQ1EsWUFBWDs7T0FDVyxtQkFBQTtPQUFhLGVBQUE7OztBQUM5QixZQUFEOzt5QkFBVTthQUdOLFVBQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7O2lEQUVULEtBQUMsT0FBTyxLQUFDLE9BQU8sS0FBQztZQUVwQixLQUFDLFNBQVE7O1lBQ1IsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1lBQ3pCLEtBQUssR0FBRyxjQUFnQixLQUFDOztRQUU3QixLQUFDO1FBQ0QsS0FBQyxXQUFXO1FBQ1osS0FBQztRQUVELEtBQUMsbUJBQW1CLE1BQU0sS0FBQyxVQUFVLEtBQUM7UUFDdEMsS0FBQyxhQUFhLFNBQVMsVUFBVSxLQUFDLE1BQU07UUFDeEMsS0FBQyxhQUFhLEdBQUcsU0FBUyxLQUFDOzs7d0JBRS9CLHlCQUFNLE1BQUs7Ozs7UUFFUCxZQUFZLEtBQUMsT0FBTyxLQUFLO3VCQUVjLEtBQUMsTUFBTTs7WUFBOUMsS0FBQyxhQUFhOztxQkFFWjs7O3dCQUVOLGdDQUFvQixRQUFPOztRQUFSOzttQkFFWCxhQUFhLEtBQUMsT0FBTyxLQUFLOzs7d0JBRWxDLHlCQUFZOzs7O3lCQUFRLEtBQUMsY0FBYywyQkFBUTs7O3dCQUUzQyxrQ0FBZTs7OztRQUVYLFVBQVU7NEJBQ0UsS0FBQzs7O1lBQVQ7Z0JBQ0csS0FBSyxTQUFROztnQkFDWixVQUFVO2dCQUNWOzs7YUFFQzs7OztRQUVULEtBQUMsY0FBYyxRQUFRLFFBQVE7UUFFL0Isa0JBQWtCLEtBQUMsUUFBUTtjQUV6QixLQUFDLE9BQU8sS0FBQyxNQUFNLFVBQVUsS0FBSztRQUVoQyxVQUFVOzZCQUNFLEtBQUM7OztZQUFUO2dCQUNHLEtBQUssU0FBUTs7Z0JBQ1osVUFBVTtnQkFD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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/replacer.kode
