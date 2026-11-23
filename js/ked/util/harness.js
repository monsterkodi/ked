var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var harness

import kxk from "../../kxk.js"
let post = kxk.post

import screen from "../view/screen/screen.js"
import ttio from "../view/screen/ttio.js"
import vterm from "../view/screen/vterm.js"


harness = (function ()
{
    function harness (opt)
    {
        var _11_25_, _12_25_

        this["placedAt"] = this["placedAt"].bind(this)
        this["placements"] = this["placements"].bind(this)
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

    harness.prototype["placements"] = function ()
    {
        return new vterm(this.cols,this.rows).feed(this.t.written()).placements()
    }

    harness.prototype["placedAt"] = function (x, y)
    {
        return this.placements().some(function (img)
        {
            return img.x === x && img.y === y
        })
    }

    return harness
})()

export default harness;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFybmVzcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9oYXJuZXNzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQVk7O09BQ0QsYUFBUjtPQUFlLFdBQWY7T0FBb0IsWUFBcEI7OztBQUNaLFdBQUQ7O2FBR0ksU0FBRzs7Ozs7Ozs7Ozs7Ozs7OztRQUVDLE9BQUEsY0FBQTtRQUVBLEtBQUMsaUJBQU8sSUFBSSwwQkFBTztRQUNuQixLQUFDLGlCQUFPLElBQUksMEJBQU87UUFFbkIsS0FBQyxRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU0sTUFBTSxLQUFLLEtBQUMsS0FBSyxLQUFLLEtBQUM7UUFFekQsS0FBQyxhQUFhLE9BQU8sS0FBQzs7O3VCQUUxQixvQkFBTyxPQUFNOztnQkFFVCxJQUFRLE1BQ1IsS0FBUSxRQUNSLE1BQVEsTUFDUixNQUFRLGVBQUEsT0FBTzs7O3VCQUVuQixrQkFBSyxNQUFLLE9BQU07Ozs7UUFFWixRQUFRLEtBQUMsTUFBTSxNQUFNO2VBQ3JCLEtBQUssTUFBTSxNQUFNOzs7dUJBRXJCLG1CQUFNLE1BQUs7Ozs7NEJBRUcsS0FBSyxNQUFNOzs7WUFBakI7WUFDQSxLQUFDLElBQUksS0FBSyxHQUFHOzs7O3VCQUVyQixvQkFBTzs7ZUFFSCxLQUFLLEtBQUssUUFBUSxLQUFLOzs7dUJBRTNCOztlQUFTLEtBQUMsT0FBTzs7O3VCQUVqQixrQkFBSzs7ZUFBSyxLQUFDLE9BQU8sT0FBTzs7O3VCQUV6Qjs7ZUFBZSxLQUFDLE9BQU87Ozt1QkFFdkIsd0JBQVc7O2VBQUssS0FBQyxPQUFPLGFBQWE7Ozt1QkFFckMsaUJBQUksR0FBRTs7ZUFBSyxLQUFDLE9BQU8sU0FBUyxFQUFFOzs7dUJBRTlCOztlQUFZLEtBQUMsRUFBRTs7O3VCQUVmOzttQkFBbUIsTUFBTSxLQUFDLEtBQUssS0FBQyxNQUFNLEtBQUssS0FBQyxFQUFFLFdBQVc7Ozt1QkFFekQsdUJBQVUsR0FBRTs7ZUFBSyxLQUFDLGFBQWEsZUFBTTs7bUJBQVEsSUFBSSxNQUFLLEtBQU0sSUFBSSxNQUFLOzs7O1dBakR4RTs7O2VBbURNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/harness.kode
