var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var harness

import kxk from "../../kxk.js"
let post = kxk.post

import screen from "../view/screen/screen.js"
import ttio from "../view/screen/ttio.js"


harness = (function ()
{
    function harness (opt)
    {
        var _11_25_, _12_25_

        this["written"] = this["written"].bind(this)
        this["at"] = this["at"].bind(this)
        this["rowMarked"] = this["rowMarked"].bind(this)
        this["textMarked"] = this["textMarked"].bind(this)
        this["row"] = this["row"].bind(this)
        this["text"] = this["text"].bind(this)
        this["focus"] = this["focus"].bind(this)
        this["type"] = this["type"].bind(this)
        this["key"] = this["key"].bind(this)
        this["event"] = this["event"].bind(this)
        opt = (opt != null ? opt : {})
        this.rows = ((_11_25_=opt.rows) != null ? _11_25_ : 24)
        this.cols = ((_12_25_=opt.cols) != null ? _12_25_ : 80)
        this.t = new ttio({headless:true,input:false,cols:this.cols,rows:this.rows})
        this.screen = new screen(this.t)
    }

    harness.prototype["event"] = function (combo, char)
    {
        return {key:combo,type:'press',combo:combo,char:(char != null ? char : '')}
    }

    harness.prototype["key"] = function (view, combo, char)
    {
        var event

        event = this.event(combo,char)
        return view.onKey(combo,event)
    }

    harness.prototype["type"] = function (view, text)
    {
        var ch

        var list = _k_.list(text.split(''))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            ch = list[_a_]
            this.key(view,ch,ch)
        }
    }

    harness.prototype["focus"] = function (view)
    {
        return post.emit('focus',view.name)
    }

    harness.prototype["text"] = function ()
    {
        return this.screen.text()
    }

    harness.prototype["row"] = function (y)
    {
        return this.screen.text()[y]
    }

    harness.prototype["textMarked"] = function ()
    {
        return this.screen.textMarked()
    }

    harness.prototype["rowMarked"] = function (y)
    {
        return this.screen.textMarked()[y]
    }

    harness.prototype["at"] = function (x, y)
    {
        return this.screen.get_char(x,y)
    }

    harness.prototype["written"] = function ()
    {
        return this.t.written()
    }

    return harness
})()

export default harness;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFybmVzcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9oYXJuZXNzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQVk7O09BQ0QsYUFBUjtPQUFlLFdBQWY7OztBQUNaLFdBQUQ7O2FBR0ksU0FBRzs7Ozs7Ozs7Ozs7Ozs7UUFFQyxPQUFBLGNBQUE7UUFFQSxLQUFDLGlCQUFPLElBQUksMEJBQU87UUFDbkIsS0FBQyxpQkFBTyxJQUFJLDBCQUFPO1FBRW5CLEtBQUMsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNLE1BQU0sS0FBSyxLQUFDLEtBQUssS0FBSyxLQUFDO1FBRXpELEtBQUMsYUFBYSxPQUFPLEtBQUM7Ozt1QkFFMUIsb0JBQU8sT0FBTTs7Z0JBRVQsSUFBUSxNQUNSLEtBQVEsUUFDUixNQUFRLE1BQ1IsTUFBUSxlQUFBLE9BQU87Ozt1QkFFbkIsa0JBQUssTUFBSyxPQUFNOzs7O1FBRVosUUFBUSxLQUFDLE1BQU0sTUFBTTtlQUNyQixLQUFLLE1BQU0sTUFBTTs7O3VCQUVyQixtQkFBTSxNQUFLOzs7OzRCQUVHLEtBQUssTUFBTTs7O1lBQWpCO1lBQ0EsS0FBQyxJQUFJLEtBQUssR0FBRzs7Ozt1QkFFckIsb0JBQU87O2VBRUgsS0FBSyxLQUFLLFFBQVEsS0FBSzs7O3VCQUUzQjs7ZUFBUyxLQUFDLE9BQU87Ozt1QkFFakIsa0JBQUs7O2VBQUssS0FBQyxPQUFPLE9BQU87Ozt1QkFFekI7O2VBQWUsS0FBQyxPQUFPOzs7dUJBRXZCLHdCQUFXOztlQUFLLEtBQUMsT0FBTyxhQUFhOzs7dUJBRXJDLGlCQUFJLEdBQUU7O2VBQUssS0FBQyxPQUFPLFNBQVMsRUFBRTs7O3VCQUU5Qjs7ZUFBWSxLQUFDLEVBQUU7OztXQTdDbEI7OztlQStDTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/harness.kode
