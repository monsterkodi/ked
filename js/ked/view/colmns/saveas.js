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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWFzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zYXZlYXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFVBQUE7SUFBTTtJQUFNOztPQUNOLGFBQUE7OztBQUNsQixVQUFEOzt1QkFBUTthQUNKLFFBQUksUUFBUTs7UUFBVDtRQUFROzs7Ozs7Ozs7OztRQUVQLEtBQUMsZ0JBQWdCOytDQUVYLEtBQUMsT0FBTyxLQUFDOzs7c0JBRW5COztlQUFrQjs7O3NCQUVsQjs7O3NCQUVBLDRCQUFlLFFBQU87O2dCQUVYOztpQkFDSDtpQkFDQTt1QkFBYSxLQUFDLFFBQVEsY0FBYzs7Ozs7O3NCQUU1Qyw0QkFBZTs7UUFBUSxvQ0FBNEI7OztzQkFFbkQ7O1lBRU8sS0FBQyxRQUFROzttQkFDUixLQUFDLE1BQU07Ozs7bUJBRVAsS0FBQyxRQUFROzs7O3NCQUVqQiwrQkFBWSxLQUFJOztjQUVWLEtBQUMsUUFBUSxJQUFJLE1BQU0sS0FBSyxJQUFJO2VBQzlCLEtBQUMsUUFBUTs7O3NCQUViLHNCQUFTOzs7O1FBRUwsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU0sTUFBTSxZQUFZO3VCQUNoQixNQUFNLElBQUk7OzJCQUNYLElBQUssU0FBRyxNQUFNLElBQUksTUFBTSwyQkFBaEIsTUFBTSxJQUFJLE1BQU0sY0FBaEIsTUFBTSxJQUFJLE1BQU07O2dCQUN4QixLQUFDLE1BQU0sTUFBTSxZQUFZOzs7ZUFDakMsS0FBQyxNQUFNOzs7c0JBRVg7Ozs7c0JBRWUsS0FBQyxNQUFNOzs7O1FBQ2xCLE9BQU8sTUFBTSxLQUFLLEtBQUMsT0FBTyxLQUFLLEtBQUMsTUFBTTtRQUN0QyxLQUFLLEtBQUssY0FBYztlQUN4QixLQUFDOzs7c0JBRUw7O1FBRUksS0FBSyxLQUFLLFFBQVE7ZUFDbEIsS0FBQzs7O3NCQUVMLDhCQUFpQixRQUFPOztnQkFFYjs7aUJBRUg7aUJBQ0E7aUJBQ0E7aUJBQ0E7cUJBQ08saUJBQUEsT0FBUSxxQkFBUyxPQUFPLFNBQVE7OzJCQUM3QixLQUFDLFFBQVEsTUFBTSxLQUFLLE9BQU87Ozs7OzBEQUVuQyxPQUFPOzs7c0JBRWpCLG9CQUFPLEtBQUk7Ozs7WUFFRixLQUFDOzs7O2dCQUVDLE1BQU07O2lCQUNUO3VCQUFVLEtBQUM7O2lCQUNYO3VCQUFVLEtBQUM7Ozs7WUFFWixLQUFDLE1BQU07O2dCQUVGLFFBQU87O3VCQUFhLEtBQUMsUUFBUTs7cUJBQzdCLFFBQU87O3VCQUFhLEtBQUM7OzhCQUNyQixNQUFNLE1BQWEsS0FBSTs7b0JBQ2hCLFNBQVMsS0FBQyxNQUFNLE1BQU0sSUFBSTs7MkJBQ3ZCOzs7OztZQUVmLE1BQU0saUJBQVMsTUFBTSxNQUFhLElBQUcsS0FBSTs7WUFDeEMsMENBQWtDLE1BQU07OztnREFHdEMsSUFBSTs7O1dBckZqQjs7O2VBdUZNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/saveas.kode
