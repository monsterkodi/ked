var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

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
    
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["showDialog"] = this["showDialog"].bind(this)
        this.autoHideInput = false
        saveas.__super__.constructor.call(this,this.screen,this.name)
    }

    saveas.prototype["inputIsActive"] = function ()
    {
        return true
    }

    saveas.prototype["showDialog"] = async function (dir, file)
    {
        var i

        console.log(`---- saveas.showDialog ${dir} ${file}`)
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

    saveas.prototype["onChoicesAction"] = function (action, choice)
    {
        console.log('--- onChoicesAction',action,choice,this.currentDir)
        switch (action)
        {
            case 'right':
            case 'space':
                if ((choice != null ? choice.path : undefined) && choice.type === 'file')
                {
                    console.log("SETSAVENAME",choice.path)
                    return
                }
                break
            case 'return':
                if ((choice != null ? choice.path : undefined) && choice.type === 'file')
                {
                    console.log("RETURN",choice)
                    return
                }
                break
        }

        return saveas.__super__.onChoicesAction.call(this,action,choice)
    }

    return saveas
})()

export default saveas;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWFzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zYXZlYXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozt1QkFhd0I7Ozs7Ozs7O1FBSWhCLEtBQUMsZ0JBQWdCOytDQUVYLEtBQUMsT0FBTyxLQUFDOzs7OztlQUVEOzs7Ozs7O1FBSWQsc0NBQThCLE9BQU87Y0FFbkMsS0FBQyxRQUFRLElBQUksTUFBTSxLQUFLLElBQUk7UUFFOUIsS0FBQyxNQUFNLElBQUk7UUFDWCxLQUFDLE1BQU0sTUFBTSxZQUFZO3VCQUNoQixNQUFNLElBQUk7OytCQUNOLFNBQUcsTUFBTSxJQUFJLE1BQU0sMkJBQWhCLE1BQU0sSUFBSSxNQUFNLGNBQWhCLE1BQU0sSUFBSSxNQUFNOztnQkFDeEIsS0FBQyxNQUFNLE1BQU0sWUFBWTs7O2VBQ2pDLEtBQUMsTUFBTTs7Ozs7UUFJUCxZQUFJLHNCQUFzQixPQUFPLE9BQU8sS0FBQztnQkFFbEM7O2lCQUVIO2lCQUNBO3FCQUVPLGlCQUFBLE9BQVEscUJBQVMsT0FBTyxTQUFROztvQkFDL0IsWUFBSSxjQUFjLE9BQU87Ozs7aUJBR2pDO3FCQUNPLGlCQUFBLE9BQVEscUJBQVMsT0FBTyxTQUFROztvQkFDL0IsWUFBSSxTQUFTOzs7Ozs7MERBR25CLE9BQU87Ozs7OztlQUVkIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/saveas.kode
