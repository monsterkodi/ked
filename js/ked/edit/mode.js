var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isFunc: function (o) {return typeof o === 'function'}}

var mode, record, uniko, vimple

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let slash = kxk.slash
let post = kxk.post
let nfs = kxk.nfs

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
        var _84_28_

        if (this.isActive(state,name))
        {
            return
        }
        this.active[state.name] = ((_84_28_=this.active[state.name]) != null ? _84_28_ : [])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9tb2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VBMEJlLE9BQU8sS0FBSyxLQUFLOzs7Ozs7O1FBVXhCLGFBQVEsSUFBSSxLQUFLLE1BQU0sZUFBVTs2QkFFckI7Ozs7WUFDUixPQUFPLEtBQUs7Z0JBQ0EsTUFBTSxJQUFJLFVBQVM7O2dCQUEvQjs7OztnQkFHSSxXQUFjLE9BQU8sTUFBTSxTQUFTO2dCQUNwQyxxQkFBZ0IsT0FBTzs7bUJBQ3JCOztnQkFDRiwyQkFBbUIsa0JBQWtCO2dCQUNyQzs7WUFFSixhQUFjLE1BQU0sS0FBSztZQUN6QixjQUFjLGFBQWE7WUFDM0IsS0FBSyxNQUFNLGNBQWM7O1FBRTdCLEtBQUssS0FBSzswQkFFRSxLQUFLOztZQUNiLEtBQUssbUJBQW1CLEtBQUssUUFBUTs7Ozs7Ozs7c0JBVWhDLEtBQUs7O21CQUNQLEtBQUssUUFBUSxLQUFLOzs0QkFFYixLQUFLOzs7O2dCQUNWLE9BQU8sTUFBTSxTQUFVLEtBQUssTUFBTSxNQUFNOztnQkFDdkMsS0FBSyxNQUFNLE9BQU8sTUFBTTs7Ozs7Ozs7O1lBVTFCLEtBQUMsU0FBUyxNQUFNOzs7O1FBRXRCLEtBQUMsT0FBTyxNQUFNLGtCQUFkLEtBQUMsT0FBTyxNQUFNO2VBQ2QsS0FBQyxPQUFPLE1BQU0sTUFBTSxTQUFTLEtBQUssTUFBTSxNQUFNOzs7Ozs7O1FBSTlDLElBQUksS0FBQyxJQUFJLE1BQU07UUFFZixLQUFDLE9BQU8sTUFBTSxNQUFNLE9BQU8sS0FBQyxPQUFPLE1BQU0sTUFBTSxRQUFRLEdBQUc7dUJBRTlDLEVBQUU7O21CQUFkLEVBQUU7Ozs7OztZQUlDLEtBQUMsU0FBUyxNQUFNOzttQkFDZixLQUFDLEtBQUssTUFBTTs7OzttQkFFWixLQUFDLE1BQU0sTUFBTTs7Ozs7OzBCQVFVLEtBQUMsSUFBSSxNQUFNOzs7Ozs7OzRCQUk3QixLQUFDLE9BQU8sTUFBTTs7OztnQkFDWCxFQUFFLFNBQVE7O3VCQUFmOzs7Ozs7Ozs7NEJBSUUsS0FBQyxPQUFPLE1BQU07Ozs7MkJBQ2hCLEVBQUU7O2dCQUNELE9BQU8sRUFBRSxPQUFPOzs7ZUFDeEI7Ozs7Ozs7NEJBSVMsS0FBQyxPQUFPLE1BQU07Ozs7MkJBQ2hCLEVBQUU7O2dCQUNELEVBQUU7Ozs7Ozs7Ozs0QkFJRCxLQUFDLE9BQU8sTUFBTTs7OzsyQkFDaEIsRUFBRTs7b0JBQ1UsRUFBRTs7MkJBQVY7Ozs7ZUFDWDs7Ozs7Ozs0QkFJUyxLQUFDLE9BQU8sTUFBTTs7OzsyQkFDaEIsRUFBRTs7b0JBQ0ssRUFBRSxVQUFVLElBQUksV0FBVTs7Ozs7O2VBQ3hDOzs7Ozs7OzRCQUlTLEtBQUMsT0FBTyxNQUFNOzs7OzJCQUNoQixFQUFFOztnQkFDRCxFQUFFLFdBQVc7OzthQUVkLEtBQUMsU0FBUyxNQUFNOztvQkFDbkIsS0FBSyxNQUFNLG9CQUFYLEtBQUssTUFBTSxVQUFXLGdCQUFnQjs7Ozs7Ozs7NEJBSWpDLEtBQUMsT0FBTyxNQUFNOzs7OzJCQUNoQixFQUFFOzt1QkFDQyxFQUFFLFdBQVcsVUFBVTs7O2VBRWpDOzs7Ozs7OzRCQUlTLEtBQUMsT0FBTyxNQUFNOzs7OzJCQUNoQixFQUFFOztnQkFDRCxRQUFRLEVBQUUsYUFBYTs7O2VBQy9COzs7Ozs7OzRCQUlTLEtBQUMsT0FBTyxNQUFNOzs7OzJCQUNoQixFQUFFOztnQkFDRCxFQUFFOzs7Ozs7Ozs7NEJBSUQsS0FBQyxPQUFPLE1BQU07Ozs7MkJBQ2hCLEVBQUU7O2dCQUNELEVBQUUsV0FBVyxLQUFLLElBQUksSUFBSTs7Ozs7Ozs7Ozs7Ozs7O1FBVXpCLEtBQUMsT0FBTzs7Ozs7Ozs7Ozs7OztRQVVSLEtBQUMsT0FBTzs7Ozs7Ozs7Ozs7OztRQVVSLEtBQUMsT0FBTzs7Ozs7O0FBRXpCLEtBQUs7ZUFFRSJ9
//# sourceURL=file://kode/ked/edit/mode.kode
