var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var saveas

import kxk from "../../../kxk.js"
let slash = kxk.slash
let post = kxk.post

import browse from "./browse.js"


saveas = (function ()
{
    _k_.extend(saveas, browse)
    function saveas (screen, name = 'saveas')
    {
        this.screen = screen
        this.name = name
    
        this["onKey"] = this["onKey"].bind(this)
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["closeDialog"] = this["closeDialog"].bind(this)
        this["doSaveAs"] = this["doSaveAs"].bind(this)
        this["setFile"] = this["setFile"].bind(this)
        this["showDialog"] = this["showDialog"].bind(this)
        this["onInputChange"] = this["onInputChange"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["autoHide"] = this["autoHide"].bind(this)
        this.autoHideInput = false
        saveas.__super__.constructor.call(this,this.screen,this.name)
    }

    saveas.prototype["inputIsActive"] = function ()
    {
        return true
    }

    saveas.prototype["autoHide"] = function ()
    {}

    saveas.prototype["onInputAction"] = function (action, text)
    {
        console.log(`+++ onInputAction ${action} ${text}`)
        switch (action)
        {
            case 'up':
            case 'down':
                return this.choices.moveSelection(action)

        }

    }

    saveas.prototype["onInputChange"] = function (text)
    {
        console.log(`swallow input change ${text}`)
    }

    saveas.prototype["moveFocus"] = function ()
    {
        if (this.choices.hasFocus())
        {
            return this.input.grabFocus()
        }
        else
        {
            return this.choices.grabFocus()
        }
    }

    saveas.prototype["showDialog"] = async function (dir, file)
    {
        await this.gotoDir(dir,slash.path(dir,file))
        return this.setFile(file)
    }

    saveas.prototype["setFile"] = function (file)
    {
        var i

        this.input.set(file)
        this.input.state.moveCursors('eol')
        if (!_k_.empty(slash.ext(file)))
        {
            for (var _a_ = i = 0, _b_ = slash.ext(file).length; (_a_ <= _b_ ? i <= slash.ext(file).length : i >= slash.ext(file).length); (_a_ <= _b_ ? ++i : --i))
            {
                this.input.state.moveCursors('left')
            }
        }
        return this.input.grabFocus()
    }

    saveas.prototype["doSaveAs"] = function ()
    {
        var path

        if (_k_.empty(this.input.current()))
        {
            return
        }
        path = slash.path(this.crumbs.path,this.input.current())
        post.emit('file.saveas',path)
        return this.closeDialog()
    }

    saveas.prototype["closeDialog"] = function ()
    {
        post.emit('focus','editor')
        return this.hide()
    }

    saveas.prototype["onChoicesAction"] = function (action, choice)
    {
        switch (action)
        {
            case 'right':
            case 'space':
            case 'click':
            case 'return':
                if ((choice != null ? choice.path : undefined) && choice.type === 'file')
                {
                    return this.setFile(slash.file(choice.path))
                }
                break
        }

        return saveas.__super__.onChoicesAction.call(this,action,choice)
    }

    saveas.prototype["onKey"] = function (key, event)
    {
        var result

        if (this.hidden())
        {
            return
        }
        switch (event.combo)
        {
            case 'tab':
                return this.moveFocus()

            case 'esc':
                return this.closeDialog()

        }

        if (this.input.hasFocus())
        {
            if (key === 'down')
            {
                return this.choices.grabFocus()
            }
            else if (key === 'return')
            {
                return this.doSaveAs()
            }
            else if (!(_k_.in(event.char,['\t','\n'])))
            {
                if (result = this.input.onKey(key,event))
                {
                    return result
                }
            }
            return
        }
        if (event.char && !(_k_.in(event.char,[' ','\n','\t'])))
        {
            console.log(`event with char swallowed '${event.char}'`)
            return
        }
        return saveas.__super__.onKey.call(this,key,event)
    }

    return saveas
})()

export default saveas;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWFzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zYXZlYXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTtJQUFNOztPQUNOLGFBQUE7OztBQUNsQixVQUFEOzt1QkFBUTthQUNKLFFBQUksUUFBUTs7UUFBVDtRQUFROzs7Ozs7Ozs7OztRQUVQLEtBQUMsZ0JBQWdCOytDQUVYLEtBQUMsT0FBTyxLQUFDOzs7c0JBRW5COztlQUFrQjs7O3NCQUVsQjs7O3NCQUVBLDRCQUFlLFFBQU87O1FBQ2xCLGlDQUF5QixVQUFVO2dCQUM1Qjs7aUJBQ0g7aUJBQ0E7dUJBQWMsS0FBQyxRQUFRLGNBQWM7Ozs7OztzQkFFN0MsNEJBQWU7O1FBQVEsb0NBQTRCOzs7c0JBRW5EOztZQUVPLEtBQUMsUUFBUTs7bUJBQ1IsS0FBQyxNQUFNOzs7O21CQUVQLEtBQUMsUUFBUTs7OztzQkFFakIsK0JBQVksS0FBSTs7Y0FFVixLQUFDLFFBQVEsSUFBSSxNQUFNLEtBQUssSUFBSTtlQUM5QixLQUFDLFFBQVE7OztzQkFFYixzQkFBUzs7OztRQUVMLEtBQUMsTUFBTSxJQUFJO1FBQ1gsS0FBQyxNQUFNLE1BQU0sWUFBWTt1QkFDaEIsTUFBTSxJQUFJOzsyQkFDWCxJQUFLLFNBQUcsTUFBTSxJQUFJLE1BQU0sMkJBQWhCLE1BQU0sSUFBSSxNQUFNLGNBQWhCLE1BQU0sSUFBSSxNQUFNOztnQkFDeEIsS0FBQyxNQUFNLE1BQU0sWUFBWTs7O2VBQ2pDLEtBQUMsTUFBTTs7O3NCQUVYOzs7O3NCQUVlLEtBQUMsTUFBTTs7OztRQUNsQixPQUFPLE1BQU0sS0FBSyxLQUFDLE9BQU8sS0FBSyxLQUFDLE1BQU07UUFDdEMsS0FBSyxLQUFLLGNBQWM7ZUFDeEIsS0FBQzs7O3NCQUVMOztRQUVJLEtBQUssS0FBSyxRQUFRO2VBQ2xCLEtBQUM7OztzQkFFTCw4QkFBaUIsUUFBTzs7Z0JBRWI7O2lCQUVIO2lCQUNBO2lCQUNBO2lCQUNBO3FCQUNPLGlCQUFBLE9BQVEscUJBQVMsT0FBTyxTQUFROzsyQkFDN0IsS0FBQyxRQUFRLE1BQU0sS0FBSyxPQUFPOzs7OzswREFFbkMsT0FBTzs7O3NCQUVqQixvQkFBTyxLQUFJOzs7O1lBRUYsS0FBQzs7OztnQkFFQyxNQUFNOztpQkFDVDt1QkFBVSxLQUFDOztpQkFDWDt1QkFBVSxLQUFDOzs7O1lBRVosS0FBQyxNQUFNOztnQkFFRixRQUFPOzt1QkFBYSxLQUFDLFFBQVE7O3FCQUM3QixRQUFPOzt1QkFBYSxLQUFDOzs4QkFDckIsTUFBTSxNQUFhLEtBQUk7O29CQUNoQixTQUFTLEtBQUMsTUFBTSxNQUFNLElBQUk7OzJCQUN2Qjs7Ozs7WUFFZixNQUFNLGlCQUFTLE1BQU0sTUFBYSxJQUFHLEtBQUk7O1lBQ3hDLDBDQUFrQyxNQUFNOzs7Z0RBR3RDLElBQUk7OztXQXJGakI7OztlQXVGTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/saveas.kode
