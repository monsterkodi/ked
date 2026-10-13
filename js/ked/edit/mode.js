var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isFunc: function (o) {return typeof o === 'function'}}

var mode, record, uniko, vimple

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let slash = kxk.slash
let post = kxk.post

import nfs from "../../kxk/nfs.js"

import theme from "../theme/theme.js"


mode = (function ()
{
    function mode ()
    {}

    mode["active"] = {}
    mode["modes"] = {}
    mode["pending"] = []
    mode["names"] = function ()
    {
        return Object.keys(mode.modes)
    }

    mode["loadModules"] = async function ()
    {
        var file, item, list, moduleClass, moduleExport, moduleJS, moduleName

        list = await nfs.list(slash.path(_k_.dir(),'mode'))
        var list1 = _k_.list(list)
        for (var _a_ = 0; _a_ < list1.length; _a_++)
        {
            item = list1[_a_]
            file = item.path
            if (slash.ext(file) !== 'js')
            {
                continue
            }
            try
            {
                moduleJS = './' + slash.relative(file,_k_.dir())
                moduleExport = await import(moduleJS)
            }
            catch (err)
            {
                console.error(`import of ${moduleJS} failed`,err)
                continue
            }
            moduleName = slash.name(file)
            moduleClass = moduleExport.default
            mode.modes[moduleName] = moduleClass
        }
        post.emit('modes.loaded')
        while (!_k_.empty(mode.pending))
        {
            mode.autoStartForEditor(mode.pending.shift())
        }
    }

    mode["autoStartForEditor"] = function (editor)
    {
        var name

        if (_k_.empty(mode.modes))
        {
            return mode.pending.push(editor)
        }
        var list = _k_.list(mode.names())
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            name = list[_a_]
            if (editor.feats[name] && mode.modes[name].autoStart)
            {
                mode.start(editor.state,name)
            }
        }
    }

    mode["start"] = function (state, name)
    {
        var _85_28_

        if (this.isActive(state,name))
        {
            return
        }
        this.active[state.name] = ((_85_28_=this.active[state.name]) != null ? _85_28_ : [])
        return this.active[state.name].push(new mode.modes[name](state))
    }

    mode["stop"] = function (state, name)
    {
        var m

        m = this.get(state,name)
        this.active[state.name].splice(this.active[state.name].indexOf(m),1)
        if (_k_.isFunc(m.stop))
        {
            return m.stop()
        }
    }

    mode["toggle"] = function (state, name)
    {
        if (this.isActive(state,name))
        {
            return this.stop(state,name)
        }
        else
        {
            return this.start(state,name)
        }
    }

    mode["isActive"] = function (state, name)
    {
        return !_k_.empty(this.get(state,name))
    }

    mode["get"] = function (state, name)
    {
        var m

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (m.name === name)
            {
                return m
            }
        }
    }

    mode["insert"] = function (state, text)
    {
        var m

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (_k_.isFunc(m.insert))
            {
                text = m.insert(text)
            }
        }
        return text
    }

    mode["postInsert"] = function (state)
    {
        var m

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (_k_.isFunc(m.postInsert))
            {
                m.postInsert()
            }
        }
    }

    mode["deleteSelection"] = function (state)
    {
        var m

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (_k_.isFunc(m.deleteSelection))
            {
                if (m.deleteSelection())
                {
                    return true
                }
            }
        }
        return false
    }

    mode["handleKey"] = function (state, key, event)
    {
        var m

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (_k_.isFunc(m.handleKey))
            {
                if (m.handleKey(key,event) !== 'unhandled')
                {
                    return
                }
            }
        }
        return 'unhandled'
    }

    mode["cursorsSet"] = function (state, editor)
    {
        var m

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (_k_.isFunc(m.cursorsSet))
            {
                m.cursorsSet(editor)
            }
        }
        if (!this.isActive(state,'salter'))
        {
            return (mode.modes['salter'] != null ? mode.modes['salter'].checkCursorsSet(state) : undefined)
        }
    }

    mode["themeColor"] = function (state, colorName, defaultColor)
    {
        var m

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (_k_.isFunc(m.themeColor))
            {
                return m.themeColor(colorName,defaultColor)
            }
        }
        return defaultColor
    }

    mode["preDrawLines"] = function (state, lines)
    {
        var m

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (_k_.isFunc(m.preDrawLines))
            {
                lines = m.preDrawLines(lines)
            }
        }
        return lines
    }

    mode["postDraw"] = function (state)
    {
        var m

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (_k_.isFunc(m.postDraw))
            {
                m.postDraw()
            }
        }
    }

    mode["fileLoaded"] = function (state, file, row, col, view)
    {
        var m

        var list = _k_.list(this.active[state.name])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (_k_.isFunc(m.fileLoaded))
            {
                m.fileLoaded(file,row,col,view)
            }
        }
    }

    return mode
})()


vimple = (function ()
{
    function vimple (state)
    {
        this.state = state
    
        this.name = 'vimple'
    }

    return vimple
})()


uniko = (function ()
{
    function uniko (state)
    {
        this.state = state
    
        this.name = 'uniko'
    }

    return uniko
})()


record = (function ()
{
    function record (state)
    {
        this.state = state
    
        this.name = 'record'
    }

    return record
})()

mode.loadModules()
export default mode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9tb2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQTJCZSxPQUFPLEtBQUssS0FBSzs7Ozs7OztRQVV4QixhQUFRLElBQUksS0FBSyxNQUFNLGVBQVU7NkJBRXJCOzs7O1lBQ1IsT0FBTyxLQUFLO2dCQUNBLE1BQU0sSUFBSSxVQUFTOztnQkFBL0I7Ozs7Z0JBR0ksV0FBYyxPQUFPLE1BQU0sU0FBUztnQkFDcEMscUJBQWdCLE9BQU87O21CQUNyQjs7Z0JBQ0YsMkJBQW1CLGtCQUFrQjtnQkFDckM7O1lBRUosYUFBYyxNQUFNLEtBQUs7WUFDekIsY0FBYyxhQUFhO1lBQzNCLEtBQUssTUFBTSxjQUFjOztRQUU3QixLQUFLLEtBQUs7MEJBRUUsS0FBSzs7WUFDYixLQUFLLG1CQUFtQixLQUFLLFFBQVE7Ozs7Ozs7O3NCQVVoQyxLQUFLOzttQkFDUCxLQUFLLFFBQVEsS0FBSzs7NEJBRWIsS0FBSzs7OztnQkFDVixPQUFPLE1BQU0sU0FBVSxLQUFLLE1BQU0sTUFBTTs7Z0JBQ3ZDLEtBQUssTUFBTSxPQUFPLE1BQU07Ozs7Ozs7OztZQVUxQixLQUFDLFNBQVMsTUFBTTs7OztRQUV0QixLQUFDLE9BQU8sTUFBTSxrQkFBZCxLQUFDLE9BQU8sTUFBTTtlQUNkLEtBQUMsT0FBTyxNQUFNLE1BQU0sU0FBUyxLQUFLLE1BQU0sTUFBTTs7Ozs7OztRQUk5QyxJQUFJLEtBQUMsSUFBSSxNQUFNO1FBRWYsS0FBQyxPQUFPLE1BQU0sTUFBTSxPQUFPLEtBQUMsT0FBTyxNQUFNLE1BQU0sUUFBUSxHQUFHO3VCQUU5QyxFQUFFOzttQkFBZCxFQUFFOzs7Ozs7WUFJQyxLQUFDLFNBQVMsTUFBTTs7bUJBQ2YsS0FBQyxLQUFLLE1BQU07Ozs7bUJBRVosS0FBQyxNQUFNLE1BQU07Ozs7OzswQkFRVSxLQUFDLElBQUksTUFBTTs7Ozs7Ozs0QkFJN0IsS0FBQyxPQUFPLE1BQU07Ozs7Z0JBQ1gsRUFBRSxTQUFROzt1QkFBZjs7Ozs7Ozs7OzRCQUlFLEtBQUMsT0FBTyxNQUFNOzs7OzJCQUNoQixFQUFFOztnQkFDRCxPQUFPLEVBQUUsT0FBTzs7O2VBQ3hCOzs7Ozs7OzRCQUlTLEtBQUMsT0FBTyxNQUFNOzs7OzJCQUNoQixFQUFFOztnQkFDRCxFQUFFOzs7Ozs7Ozs7NEJBSUQsS0FBQyxPQUFPLE1BQU07Ozs7MkJBQ2hCLEVBQUU7O29CQUNVLEVBQUU7OzJCQUFWOzs7O2VBQ1g7Ozs7Ozs7NEJBSVMsS0FBQyxPQUFPLE1BQU07Ozs7MkJBQ2hCLEVBQUU7O29CQUNLLEVBQUUsVUFBVSxJQUFJLFdBQVU7Ozs7OztlQUN4Qzs7Ozs7Ozs0QkFJUyxLQUFDLE9BQU8sTUFBTTs7OzsyQkFDaEIsRUFBRTs7Z0JBQ0QsRUFBRSxXQUFXOzs7YUFFZCxLQUFDLFNBQVMsTUFBTTs7b0JBQ25CLEtBQUssTUFBTSxvQkFBWCxLQUFLLE1BQU0sVUFBVyxnQkFBZ0I7Ozs7Ozs7OzRCQUlqQyxLQUFDLE9BQU8sTUFBTTs7OzsyQkFDaEIsRUFBRTs7dUJBQ0MsRUFBRSxXQUFXLFVBQVU7OztlQUVqQzs7Ozs7Ozs0QkFJUyxLQUFDLE9BQU8sTUFBTTs7OzsyQkFDaEIsRUFBRTs7Z0JBQ0QsUUFBUSxFQUFFLGFBQWE7OztlQUMvQjs7Ozs7Ozs0QkFJUyxLQUFDLE9BQU8sTUFBTTs7OzsyQkFDaEIsRUFBRTs7Z0JBQ0QsRUFBRTs7Ozs7Ozs7OzRCQUlELEtBQUMsT0FBTyxNQUFNOzs7OzJCQUNoQixFQUFFOztnQkFDRCxFQUFFLFdBQVcsS0FBSyxJQUFJLElBQUk7Ozs7Ozs7Ozs7Ozs7OztRQVV6QixLQUFDLE9BQU87Ozs7Ozs7Ozs7Ozs7UUFVUixLQUFDLE9BQU87Ozs7Ozs7Ozs7Ozs7UUFVUixLQUFDLE9BQU87Ozs7OztBQUV6QixLQUFLO2VBRUUifQ==
//# sourceURL=file://kode/ked/edit/mode.kode
