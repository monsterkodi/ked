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
        var i

        await this.gotoDir(dir,slash.path(dir,file))
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
            case 'return':
                if ((choice != null ? choice.path : undefined) && choice.type === 'file')
                {
                    this.input.set(slash.file(choice.path))
                    this.input.grabFocus()
                    return
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
            if (_k_.in(key,'return'))
            {
                return this.doSaveAs()
            }
            if (!(_k_.in(event.char,'\t\n')))
            {
                if (result = this.input.onKey(key,event))
                {
                    return result
                }
            }
            return
        }
        else
        {
            if (event.char && !(_k_.in(event.char,' \n\t')))
            {
                console.log(`event with char swallowed '${event.char}'`)
                return
            }
        }
        return saveas.__super__.onKey.call(this,key,event)
    }

    return saveas
})()

export default saveas;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWFzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zYXZlYXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozt1QkFhd0I7Ozs7Ozs7Ozs7Ozs7O1FBSWhCLEtBQUMsZ0JBQWdCOytDQUVYLEtBQUMsT0FBTyxLQUFDOzs7OztlQUVEOzs7Ozs7OztRQUtkLGlDQUF5QixVQUFVO2dCQUM1Qjs7aUJBQ0g7aUJBQ0E7dUJBQWMsS0FBQyxRQUFRLGNBQWM7Ozs7Ozs7O1FBRXRCLG9DQUE0Qjs7Ozs7WUFJNUMsS0FBQyxRQUFROzttQkFDUixLQUFDLE1BQU07Ozs7bUJBRVAsS0FBQyxRQUFROzs7Ozs7OztjQUlYLEtBQUMsUUFBUSxJQUFJLE1BQU0sS0FBSyxJQUFJO1FBRTlCLEtBQUMsTUFBTSxJQUFJO1FBQ1gsS0FBQyxNQUFNLE1BQU0sWUFBWTt1QkFDaEIsTUFBTSxJQUFJOzsrQkFDTixTQUFHLE1BQU0sSUFBSSxNQUFNLDJCQUFoQixNQUFNLElBQUksTUFBTSxjQUFoQixNQUFNLElBQUksTUFBTTs7Z0JBQ3hCLEtBQUMsTUFBTSxNQUFNLFlBQVk7OztlQUNqQyxLQUFDLE1BQU07Ozs7Ozs7c0JBSUksS0FBQyxNQUFNOzs7O1FBQ2xCLE9BQU8sTUFBTSxLQUFLLEtBQUMsT0FBTyxLQUFLLEtBQUMsTUFBTTtRQUN0QyxLQUFLLEtBQUssY0FBYztlQUN4QixLQUFDOzs7OztRQUlELEtBQUssS0FBSyxRQUFRO2VBQ2xCLEtBQUM7Ozs7O2dCQUlNOztpQkFFSDtpQkFDQTtpQkFDQTtxQkFDTyxpQkFBQSxPQUFRLHFCQUFTLE9BQU8sU0FBUTs7b0JBQy9CLEtBQUMsTUFBTSxJQUFJLE1BQU0sS0FBSyxPQUFPO29CQUM3QixLQUFDLE1BQU07Ozs7OzswREFHYixPQUFPOzs7Ozs7O1lBSVIsS0FBQzs7OztnQkFFQyxNQUFNOztpQkFDVDt1QkFDTSxLQUFDOztpQkFDUDt1QkFDTSxLQUFDOzs7O1lBRVIsS0FBQyxNQUFNOztnQkFDSCxRQUFPOzt1QkFDSixLQUFDLFFBQVE7O3VCQUNaLElBQU87O3VCQUNKLEtBQUM7O3lCQUNKLE1BQU0sS0FBWTs7b0JBQ2QsU0FBUyxLQUFDLE1BQU0sTUFBTSxJQUFJOzsyQkFDdkI7Ozs7Ozs7Z0JBR1AsTUFBTSxpQkFBUyxNQUFNLEtBQVk7O2dCQUNoQywwQ0FBa0MsTUFBTTs7OztnREFHMUMsSUFBSTs7Ozs7O2VBRVgifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/saveas.kode
