var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var sheeditor

import post from "../../../kxk/post.js"

import view from "../base/view.js"

import sheetree from "./sheetree.js"
import sheenode from "./sheenode.js"


sheeditor = (function ()
{
    _k_.extend(sheeditor, view)
    function sheeditor (screen, editor, name, funcol)
    {
        this.screen = screen
        this.editor = editor
        this.name = name
        this.funcol = funcol
    
        this["onKey"] = this["onKey"].bind(this)
        this["moveFocus"] = this["moveFocus"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        this["show"] = this["show"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        sheeditor.__super__.constructor.call(this,this.screen,this.name)
        this.isVisible = false
        this.sheetree = new sheetree(this.editor,`${this.name}_sheetree`,['scrllr'])
        this.sheenode = new sheenode(this.editor,`${this.name}_sheenode`,this.funcol)
        this.mouseItems = [this.sheetree,this.sheenode]
        this.wheelItems = this.mouseItems
        this.sheetree.on('tree.node',this.sheenode.onNode)
        this.sheenode.on('shee.node',this.sheetree.onNode)
        post.on('file.loaded',this.onFileLoaded)
    }

    sheeditor.prototype["onFileLoaded"] = function (path)
    {
        var _27_32_

        if ((this.editor.state.rectree != null))
        {
            this.sheetree.reloadTree()
            return this.show()
        }
        else
        {
            return this.hide()
        }
    }

    sheeditor.prototype["hide"] = function ()
    {
        this.sheetree.hide()
        this.sheenode.hide()
        return sheeditor.__super__.hide.call(this)
    }

    sheeditor.prototype["show"] = function ()
    {
        this.sheetree.show()
        this.sheenode.show()
        return sheeditor.__super__.show.call(this)
    }

    sheeditor.prototype["layout"] = function (x, y, w, h)
    {
        var snh, sth

        if (this.hidden())
        {
            return
        }
        snh = this.sheenode.height
        sth = h - snh
        this.sheetree.layout(x,y,w,sth)
        this.sheenode.layout(x,y + sth,w,snh)
        return sheeditor.__super__.layout.call(this,x,y,w,h)
    }

    sheeditor.prototype["draw"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.sheetree.draw()
        this.sheenode.draw()
        return sheeditor.__super__.draw.call(this)
    }

    sheeditor.prototype["hasFocus"] = function ()
    {
        return this.sheetree.hasFocus() || this.sheenode.hasFocus()
    }

    sheeditor.prototype["grabFocus"] = function ()
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        return this.sheetree.grabFocus()
    }

    sheeditor.prototype["moveFocus"] = function ()
    {
        if (this.sheetree.hasFocus())
        {
            this.sheenode.grabFocus()
            post.emit('redraw')
        }
        else
        {
            this.sheetree.grabFocus()
        }
        return true
    }

    sheeditor.prototype["onKey"] = function (key, event)
    {
        var combo

        if (this.hidden() || this.collapsed())
        {
            return
        }
        combo = event.combo
        switch (combo)
        {
            case 'tab':
            case 'shift+tab':
                return this.moveFocus()

            case 'ctrl+alt+delete':
            case 'ctrl+alt+entf':
                return this.sheetree.deleteCurrent()

        }

        if (this.sheetree.hasFocus())
        {
            switch (combo)
            {
                case 'cmd+z':
                case 'ctrl+z':
                    this.sheetree.keepSelection((function ()
                    {
                        return this.editor.state.undo()
                    }).bind(this))
                    this.editor.redraw()
                    return true

                case 'shift+cmd+z':
                case 'cmd+y':
                case 'ctrl+y':
                    this.sheetree.keepSelection((function ()
                    {
                        return this.editor.state.redo()
                    }).bind(this))
                    this.editor.redraw()
                    return true

                case 'alt+up':
                    return this.sheetree.moveCurrent('up')

                case 'alt+down':
                    return this.sheetree.moveCurrent('down')

                case 'cmd+x':
                case 'ctrl+x':
                    return this.sheetree.cutCurrent()

                case 'cmd+c':
                case 'ctrl+c':
                    return this.sheetree.copyCurrent()

                case 'cmd+v':
                case 'ctrl+v':
                    return this.sheetree.pasteNode()

            }

            return this.sheetree.onKey(key,event)
        }
        if (this.sheenode.hasFocus())
        {
            return this.sheenode.onKey(key,event)
        }
    }

    return sheeditor
})()

export default sheeditor;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZWRpdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zaGVlZGl0b3Iua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNtQixXQUFOOztPQUNNLFdBQVo7O09BQ1ksZUFBQTtPQUFTLGVBQUE7OztBQUUzQixhQUFEOzswQkFBVzthQUVQLFdBQUksUUFBUSxRQUFRLE1BQU07O1FBQXZCO1FBQVE7UUFBUTtRQUFNOzs7Ozs7Ozs7a0RBRWYsS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFlBQVk7UUFFYixLQUFDLGVBQWUsU0FBUyxLQUFDLFVBQVUsS0FBQyxpQkFBaUI7UUFDdEQsS0FBQyxlQUFlLFNBQVMsS0FBQyxVQUFVLEtBQUMsZ0JBQWdCLEtBQUM7UUFFdEQsS0FBQyxjQUFjLEtBQUMsU0FBUyxLQUFDO1FBQzFCLEtBQUMsYUFBYSxLQUFDO1FBRWYsS0FBQyxTQUFTLEdBQUcsWUFBWSxLQUFDLFNBQVM7UUFDbkMsS0FBQyxTQUFTLEdBQUcsWUFBWSxLQUFDLFNBQVM7UUFFbkMsS0FBSyxHQUFHLGNBQWMsS0FBQzs7O3lCQUUzQiwyQkFBYzs7OzthQUVQLEtBQUMsT0FBTyxNQUFNOztZQUNiLEtBQUMsU0FBUzttQkFDVixLQUFDOzs7O21CQUVELEtBQUM7Ozs7eUJBRVQ7O1FBRUksS0FBQyxTQUFTO1FBQ1YsS0FBQyxTQUFTOzs7O3lCQUdkOztRQUVJLEtBQUMsU0FBUztRQUNWLEtBQUMsU0FBUzs7Ozt5QkFHZCxxQkFBUSxHQUFFLEdBQUUsR0FBRTs7OztZQUVMLEtBQUM7Ozs7UUFFTixNQUFNLEtBQUMsU0FBUztRQUNoQixNQUFNLElBQUU7UUFFUixLQUFDLFNBQVMsT0FBTyxFQUFFLEVBQU0sRUFBRTtRQUMzQixLQUFDLFNBQVMsT0FBTyxFQUFFLElBQUUsSUFBSSxFQUFFO29EQUVyQixFQUFFLEVBQUUsRUFBRTs7O3lCQUVoQjs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixLQUFDLFNBQVM7UUFDVixLQUFDLFNBQVM7Ozs7eUJBSWQ7O2VBQWMsS0FBQyxTQUFTLGNBQWMsS0FBQyxTQUFTOzs7eUJBQ2hEOztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O2VBQ25CLEtBQUMsU0FBUzs7O3lCQUVkOztZQUVPLEtBQUMsU0FBUzs7WUFDVCxLQUFDLFNBQVM7WUFDVixLQUFLLEtBQUs7Ozs7WUFFVixLQUFDLFNBQVM7O2VBRWQ7Ozt5QkFFSixvQkFBTyxLQUFJOzs7O1lBRUYsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsUUFBUSxNQUFNO2dCQUVQOztpQkFDSDtpQkFBTTt1QkFBZ0MsS0FBQzs7aUJBQ3ZDO2lCQUFrQjt1QkFBb0IsS0FBQyxTQUFTOzs7O1lBRWpELEtBQUMsU0FBUzs7b0JBRUY7O3FCQUNIO3FCQUFRO29CQUEwQixLQUFDLFNBQVM7OytCQUFpQixLQUFDLE9BQU8sTUFBTTs7b0JBQVUsS0FBQyxPQUFPOzJCQUFhOztxQkFDMUc7cUJBQWM7cUJBQVE7b0JBQVksS0FBQyxTQUFTOzsrQkFBaUIsS0FBQyxPQUFPLE1BQU07O29CQUFVLEtBQUMsT0FBTzsyQkFBYTs7cUJBQzFHOzJCQUFvQyxLQUFDLFNBQVMsWUFBWTs7cUJBQzFEOzJCQUFvQyxLQUFDLFNBQVMsWUFBWTs7cUJBQzFEO3FCQUFROzJCQUE0QixLQUFDLFNBQVM7O3FCQUM5QztxQkFBUTsyQkFBNEIsS0FBQyxTQUFTOztxQkFDOUM7cUJBQVE7MkJBQTRCLEtBQUMsU0FBUzs7OzttQkFFaEQsS0FBQyxTQUFTLE1BQU0sSUFBSTs7WUFDdkIsS0FBQyxTQUFTOzttQkFBZSxLQUFDLFNBQVMsTUFBTSxJQUFJOzs7O1dBbEd2RDs7O2VBb0dNIn0=
//# sourceURL=../../../../kode/ked/view/colmns/sheeditor.kode
