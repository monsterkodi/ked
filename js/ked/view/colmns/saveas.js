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
            else if (_k_.in(key,'return'))
            {
                return this.doSaveAs()
            }
            else if (!(_k_.in(event.char,'\t\n')))
            {
                if (result = this.input.onKey(key,event))
                {
                    return result
                }
            }
            return
        }
        if (event.char && !(_k_.in(event.char,' \n\t')))
        {
            console.log(`event with char swallowed '${event.char}'`)
            return
        }
        return saveas.__super__.onKey.call(this,key,event)
    }

    return saveas
})()

export default saveas;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWFzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zYXZlYXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozt1QkFXd0I7Ozs7Ozs7Ozs7Ozs7OztRQUloQixLQUFDLGdCQUFnQjsrQ0FFWCxLQUFDLE9BQU8sS0FBQzs7Ozs7ZUFFRDs7Ozs7Ozs7UUFLZCxpQ0FBeUIsVUFBVTtnQkFDNUI7O2lCQUNIO2lCQUNBO3VCQUFjLEtBQUMsUUFBUSxjQUFjOzs7Ozs7OztRQUV0QixvQ0FBNEI7Ozs7O1lBSTVDLEtBQUMsUUFBUTs7bUJBQ1IsS0FBQyxNQUFNOzs7O21CQUVQLEtBQUMsUUFBUTs7Ozs7O2NBSVgsS0FBQyxRQUFRLElBQUksTUFBTSxLQUFLLElBQUk7ZUFDOUIsS0FBQyxRQUFROzs7Ozs7O1FBSVQsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU0sTUFBTSxZQUFZO3VCQUNoQixNQUFNLElBQUk7OytCQUNOLFNBQUcsTUFBTSxJQUFJLE1BQU0sMkJBQWhCLE1BQU0sSUFBSSxNQUFNLGNBQWhCLE1BQU0sSUFBSSxNQUFNOztnQkFDeEIsS0FBQyxNQUFNLE1BQU0sWUFBWTs7O2VBQ2pDLEtBQUMsTUFBTTs7Ozs7OztzQkFJSSxLQUFDLE1BQU07Ozs7UUFDbEIsT0FBTyxNQUFNLEtBQUssS0FBQyxPQUFPLEtBQUssS0FBQyxNQUFNO1FBQ3RDLEtBQUssS0FBSyxjQUFjO2VBQ3hCLEtBQUM7Ozs7O1FBSUQsS0FBSyxLQUFLLFFBQVE7ZUFDbEIsS0FBQzs7Ozs7Z0JBSU07O2lCQUVIO2lCQUNBO2lCQUNBO2lCQUNBO3FCQUNPLGlCQUFBLE9BQVEscUJBQVMsT0FBTyxTQUFROzsyQkFDN0IsS0FBQyxRQUFRLE1BQU0sS0FBSyxPQUFPOzs7OzswREFFbkMsT0FBTzs7Ozs7OztZQUlSLEtBQUM7Ozs7Z0JBRUMsTUFBTTs7aUJBQ1Q7dUJBQVUsS0FBQzs7aUJBQ1g7dUJBQVUsS0FBQzs7OztZQUVaLEtBQUMsTUFBTTs7Z0JBRUYsUUFBTzs7dUJBQWEsS0FBQyxRQUFROzs0QkFDN0IsSUFBTzs7dUJBQWEsS0FBQzs7OEJBQ3JCLE1BQU0sS0FBWTs7b0JBQ1gsU0FBUyxLQUFDLE1BQU0sTUFBTSxJQUFJOzsyQkFDdkI7Ozs7O1lBRWYsTUFBTSxpQkFBUyxNQUFNLEtBQVk7O1lBQ2hDLDBDQUFrQyxNQUFNOzs7Z0RBR3RDLElBQUk7Ozs7OztlQUVYIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/saveas.kode
