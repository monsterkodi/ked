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
        var _27_25_, _28_25_

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
        this.rows = ((_27_25_=opt.rows) != null ? _27_25_ : 24)
        this.cols = ((_28_25_=opt.cols) != null ? _28_25_ : 80)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFybmVzcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9oYXJuZXNzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXdCUSxPQUFBLGNBQUE7UUFFQSxLQUFDLGlCQUFPLElBQUksMEJBQU87UUFDbkIsS0FBQyxpQkFBTyxJQUFJLDBCQUFPO1FBRW5CLEtBQUMsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNLE1BQU0sS0FBSyxLQUFDLEtBQUssS0FBSyxLQUFDO1FBRXpELEtBQUMsYUFBYSxPQUFPLEtBQUM7Ozs7O2dCQVF0QixJQUFRLE1BQ1IsS0FBUSxRQUNSLE1BQVEsTUFDUixNQUFRLGVBQUEsT0FBTzs7Ozs7OztRQU1mLFFBQVEsS0FBQyxNQUFNLE1BQU07ZUFDckIsS0FBSyxNQUFNLE1BQU07Ozs7Ozs7NEJBTVAsS0FBSyxNQUFNOzs7O1lBQ2pCLEtBQUMsSUFBSSxLQUFLLEdBQUc7Ozs7OztlQVNqQixLQUFLLEtBQUssUUFBUSxLQUFLOzs7OztlQUlsQixLQUFDLE9BQU87Ozs7O2VBSVAsS0FBQyxPQUFPLE9BQU87Ozs7O2VBSVYsS0FBQyxPQUFPOzs7OztlQUlQLEtBQUMsT0FBTyxhQUFhOzs7OztlQUkxQixLQUFDLE9BQU8sU0FBUyxFQUFFOzs7OztlQUlsQixLQUFDLEVBQUU7Ozs7OztlQUVaIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/harness.kode
