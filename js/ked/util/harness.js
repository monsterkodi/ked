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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFybmVzcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9oYXJuZXNzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUF3QlEsT0FBQSxjQUFBO1FBRUEsS0FBQyxpQkFBTyxJQUFJLDBCQUFPO1FBQ25CLEtBQUMsaUJBQU8sSUFBSSwwQkFBTztRQUVuQixLQUFDLFFBQVEsTUFBSyxTQUFTLEtBQUssTUFBTSxNQUFNLEtBQUssS0FBQyxLQUFLLEtBQUssS0FBQztRQUV6RCxLQUFDLGFBQWEsT0FBTyxLQUFDOzs7OztnQkFRdEIsSUFBUSxNQUNSLEtBQVEsUUFDUixNQUFRLE1BQ1IsTUFBUSxlQUFBLE9BQU87Ozs7Ozs7UUFNZixRQUFRLEtBQUMsTUFBTSxNQUFNO2VBQ3JCLEtBQUssTUFBTSxNQUFNOzs7Ozs7OzRCQU1QLEtBQUssTUFBTTs7OztZQUNqQixLQUFDLElBQUksS0FBSyxHQUFHOzs7Ozs7ZUFTakIsS0FBSyxLQUFLLFFBQVEsS0FBSzs7Ozs7ZUFJbEIsS0FBQyxPQUFPOzs7OztlQUlQLEtBQUMsT0FBTyxPQUFPOzs7OztlQUlkLEtBQUMsT0FBTyxTQUFTLEVBQUU7Ozs7O2VBSWxCLEtBQUMsRUFBRTs7Ozs7O2VBRVoifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/harness.kode
