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
        post.on('file.loaded',this.onFileLoaded)
    }

    sheeditor.prototype["onFileLoaded"] = function (path)
    {
        var _21_24_

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
        console.log(`LAYOUT ${w} ${h}`)
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

    sheeditor.prototype["onKey"] = function (key, event)
    {
        if (this.hidden() || this.collapsed())
        {
            return
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZWRpdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zaGVlZGl0b3Iua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNtQixXQUFOOztPQUNNLFdBQVo7O09BQ1ksZUFBQTtPQUFTLGVBQUE7OztBQUMzQixhQUFEOzswQkFBVzthQUVQLFdBQUksUUFBUSxRQUFROztRQUFqQjtRQUFRO1FBQVE7Ozs7Ozs7Ozs7a0RBRVQsS0FBQyxPQUFPLEtBQUM7UUFFZixLQUFDLFlBQVk7UUFDYixLQUFDLFlBQVk7UUFFYixLQUFDLGVBQWUsU0FBUyxLQUFDLFVBQVUsS0FBQyxpQkFBaUI7UUFDdEQsS0FBQyxlQUFlLFNBQVMsS0FBQyxVQUFVLEtBQUM7UUFFckMsS0FBSyxHQUFHLGNBQWMsS0FBQzs7O3lCQUUzQiwyQkFBYzs7OzthQUVQLEtBQUMsT0FBTyxnQkFBUixLQUFDLE9BQU8sTUFBTzs7WUFDZCxLQUFDLFNBQVM7bUJBQ1YsS0FBQzs7OzttQkFFRCxLQUFDOzs7O3lCQUVUOztRQUVJLEtBQUMsU0FBUztRQUNWLEtBQUMsU0FBUzs7Ozt5QkFHZDs7UUFFSSxLQUFDLFNBQVM7UUFDVixLQUFDLFNBQVM7Ozs7eUJBR2QscUJBQVEsR0FBRSxHQUFFLEdBQUU7Ozs7WUFJTCxLQUFDOzs7O1FBRU4sc0JBQWMsS0FBSztRQUVuQixNQUFNLEtBQUMsU0FBUztRQUNoQixNQUFNLElBQUU7UUFFUixLQUFDLFNBQVMsT0FBTyxFQUFFLEVBQU0sRUFBRTtRQUMzQixLQUFDLFNBQVMsT0FBTyxFQUFFLElBQUUsSUFBSSxFQUFFO29EQUVyQixFQUFFLEVBQUUsRUFBRTs7O3lCQUVoQjs7WUFFUyxLQUFDLFlBQVksS0FBQzs7OztRQUVuQixLQUFDLFNBQVM7UUFDVixLQUFDLFNBQVM7Ozs7eUJBSWQ7O2VBQWMsS0FBQyxTQUFTLGNBQWMsS0FBQyxTQUFTOzs7eUJBQ2hEOztZQUVTLEtBQUMsWUFBWSxLQUFDOzs7O2VBQ25CLEtBQUMsU0FBUzs7O3lCQUVkLHNCQUFTOzs7O1lBRUEsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsNENBQVk7YUFBK0IsY0FBQSxJQUFLOzttQkFBWjs7UUFDcEMsTUFBTSxLQUFDLFNBQVMsUUFBUTthQUFtQixjQUFBLElBQUs7O21CQUFaOztRQUNwQyxNQUFNLEtBQUMsU0FBUyxRQUFRO2FBQW1CLGNBQUEsSUFBSzs7bUJBQVo7O2VBRXBDOzs7eUJBRUosc0JBQVM7O1lBRUEsS0FBQyxZQUFZLEtBQUM7Ozs7UUFFbkIsS0FBQyxTQUFTLFFBQVE7ZUFDbEIsS0FBQyxTQUFTLFFBQVE7Ozt5QkFFdEIsb0JBQU8sS0FBSTs7WUFFRixLQUFDLFlBQVksS0FBQzs7OztZQUVoQixLQUFDLFNBQVM7O21CQUFlLEtBQUMsU0FBUyxNQUFNLElBQUk7O1lBQzdDLEtBQUMsU0FBUzs7bUJBQWUsS0FBQyxTQUFTLE1BQU0sSUFBSTs7OztXQXZGdkQ7OztlQXlGTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/sheeditor.kode
