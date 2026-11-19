var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var sheeditor

import post from "../../../kxk/post.js"

import view from "../base/view.js"

import sheetree from "./sheetree.js"
import sheenode from "./sheenode.js"


sheeditor = (function ()
{
    _k_.extend(sheeditor, view)
    function sheeditor (screen, editor, name)
    {
        this.screen = screen
        this.editor = editor
        this.name = name
    
        this["onKey"] = this["onKey"].bind(this)
        this["moveFocus"] = this["moveFocus"].bind(this)
        this["onWheel"] = this["onWheel"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["grabFocus"] = this["grabFocus"].bind(this)
        this["hasFocus"] = this["hasFocus"].bind(this)
        this["show"] = this["show"].bind(this)
        this["hide"] = this["hide"].bind(this)
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        sheeditor.__super__.constructor.call(this,this.screen,this.name)
        this.isVisible = false
        this.focusable = true
        this.sheetree = new sheetree(this.editor,`${this.name}_sheetree`,['scrllr'])
        this.sheenode = new sheenode(this.editor,`${this.name}_sheenode`)
        this.sheetree.on('tree.node',this.sheenode.onNode)
        post.on('file.loaded',this.onFileLoaded)
    }

    sheeditor.prototype["onFileLoaded"] = function (path)
    {
        var _23_24_

        if ((this.editor.sheet != null ? this.editor.sheet.rectree : undefined))
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

    sheeditor.prototype["onMouse"] = function (event)
    {
        var ret

        if (this.hidden() || this.collapsed())
        {
            return
        }
        ret = sheeditor.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.sheetree.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = this.sheenode.onMouse(event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        return false
    }

    sheeditor.prototype["onWheel"] = function (event)
    {
        if (this.hidden() || this.collapsed())
        {
            return
        }
        this.sheetree.onWheel(event)
        return this.sheenode.onWheel(event)
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

        }

        if (this.sheetree.hasFocus())
        {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZWRpdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zaGVlZGl0b3Iua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNtQixXQUFOOztPQUNNLFdBQVo7O09BQ1ksZUFBQTtPQUFTLGVBQUE7OztBQUMzQixhQUFEOzswQkFBVzthQUVQLFdBQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7Ozs7O2tEQUVULEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxZQUFZO1FBQ2IsS0FBQyxZQUFZO1FBRWIsS0FBQyxlQUFlLFNBQVMsS0FBQyxVQUFVLEtBQUMsaUJBQWlCO1FBQ3RELEtBQUMsZUFBZSxTQUFTLEtBQUMsVUFBVSxLQUFDO1FBRXJDLEtBQUMsU0FBUyxHQUFHLFlBQVksS0FBQyxTQUFTO1FBRW5DLEtBQUssR0FBRyxjQUFjLEtBQUM7Ozt5QkFFM0IsMkJBQWM7Ozs7YUFFUCxLQUFDLE9BQU8sZ0JBQVIsS0FBQyxPQUFPLE1BQU87O1lBQ2QsS0FBQyxTQUFTO21CQUNWLEtBQUM7Ozs7bUJBRUQsS0FBQzs7Ozt5QkFFVDs7UUFFSSxLQUFDLFNBQVM7UUFDVixLQUFDLFNBQVM7Ozs7eUJBR2Q7O1FBRUksS0FBQyxTQUFTO1FBQ1YsS0FBQyxTQUFTOzs7O3lCQUdkLHFCQUFRLEdBQUUsR0FBRSxHQUFFOzs7O1lBRUwsS0FBQzs7OztRQUVOLE1BQU0sS0FBQyxTQUFTO1FBQ2hCLE1BQU0sSUFBRTtRQUVSLEtBQUMsU0FBUyxPQUFPLEVBQUUsRUFBTSxFQUFFO1FBQzNCLEtBQUMsU0FBUyxPQUFPLEVBQUUsSUFBRSxJQUFJLEVBQUU7b0RBRXJCLEVBQUUsRUFBRSxFQUFFOzs7eUJBRWhCOztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLEtBQUMsU0FBUztRQUNWLEtBQUMsU0FBUzs7Ozt5QkFJZDs7ZUFBYyxLQUFDLFNBQVMsY0FBYyxLQUFDLFNBQVM7Ozt5QkFDaEQ7O1lBRVMsS0FBQyxZQUFZLEtBQUM7Ozs7ZUFDbkIsS0FBQyxTQUFTOzs7eUJBRWQsc0JBQVM7Ozs7WUFFQSxLQUFDLFlBQVksS0FBQzs7OztRQUVuQiw0Q0FBWTthQUErQixjQUFBLElBQUs7O21CQUFaOztRQUNwQyxNQUFNLEtBQUMsU0FBUyxRQUFRO2FBQW1CLGNBQUEsSUFBSzs7bUJBQVo7O1FBQ3BDLE1BQU0sS0FBQyxTQUFTLFFBQVE7YUFBbUIsY0FBQSxJQUFLOzttQkFBWjs7ZUFFcEM7Ozt5QkFFSixzQkFBUzs7WUFFQSxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixLQUFDLFNBQVMsUUFBUTtlQUNsQixLQUFDLFNBQVMsUUFBUTs7O3lCQUV0Qjs7WUFFTyxLQUFDLFNBQVM7O1lBQ1QsS0FBQyxTQUFTO1lBQ1YsS0FBSyxLQUFLOzs7O1lBRVYsS0FBQyxTQUFTOztlQUVkOzs7eUJBRUosb0JBQU8sS0FBSTs7OztZQUVGLEtBQUMsWUFBWSxLQUFDOzs7O1FBRW5CLFFBQVEsTUFBTTtnQkFFUDs7aUJBQ0g7aUJBQU07dUJBQWdCLEtBQUM7Ozs7WUFFeEIsS0FBQyxTQUFTOzttQkFBZSxLQUFDLFNBQVMsTUFBTSxJQUFJOztZQUM3QyxLQUFDLFNBQVM7O21CQUFlLEtBQUMsU0FBUyxNQUFNLElBQUk7Ozs7V0FwR3ZEOzs7ZUFzR00ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheeditor.kode
