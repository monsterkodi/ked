var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isFunc: function (o) {return typeof o === 'function'}}

var mode

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
    mode["loaded"] = null
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
        this.active[state.name].push(new mode.modes[name](state))
        return post.emit('mode.start',state,name)
    }

    mode["stop"] = function (state, name)
    {
        var m

        m = this.get(state,name)
        this.active[state.name].splice(this.active[state.name].indexOf(m),1)
        if (_k_.isFunc(m.stop))
        {
            m.stop()
        }
        return post.emit('mode.stop',state,name)
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

mode.loaded = mode.loadModules()
export default mode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9tb2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FpQlUsVUFBQTtJQUFNO0lBQUs7SUFBTTtJQUFLOztPQUNoQixZQUFUOzs7QUFFRSxRQUFUOzs7OztJQUVJLE1BQUM7SUFDRCxNQUFDO0lBQ0QsTUFBQztJQUNELE1BQUMsV0FBUztJQUVWLE1BQUM7O2VBQVUsT0FBTyxLQUFLLEtBQUs7OztJQVE1QixNQUFDOzs7O1FBRUcsYUFBUSxJQUFJLEtBQUssTUFBTSxLQUFNLFVBQUk7NkJBRXJCOzs7WUFBUjtZQUNBLE9BQU8sS0FBSztnQkFDQSxNQUFNLElBQUksVUFBUzs7Z0JBQS9COzs7O2dCQUdJLFdBQWMsT0FBTyxNQUFNLFNBQVMsS0FBTTtnQkFDMUMscUJBQWdCLE9BQU87O21CQUNyQjs7Z0JBQ0YsMkJBQW1CLGtCQUFrQjtnQkFDckM7O1lBRUosYUFBYyxNQUFNLEtBQUs7WUFDekIsY0FBYyxhQUFhO1lBQzNCLEtBQUssTUFBTSxjQUFjOztRQUU3QixLQUFLLEtBQUs7MEJBRUUsS0FBSzs7WUFDYixLQUFLLG1CQUFtQixLQUFLLFFBQVE7Ozs7SUFRN0MsTUFBQyxpQ0FBb0I7Ozs7c0JBRVIsS0FBSzs7bUJBQ1AsS0FBSyxRQUFRLEtBQUs7OzRCQUViLEtBQUs7OztZQUFiO2dCQUNHLE9BQU8sTUFBTSxTQUFVLEtBQUssTUFBTSxNQUFNOztnQkFDdkMsS0FBSyxNQUFNLE9BQU8sTUFBTTs7Ozs7SUFRcEMsTUFBQyxvQkFBTyxPQUFNOzs7O1lBRUosS0FBQyxTQUFTLE1BQU07Ozs7UUFFdEIsS0FBQyxPQUFPLE1BQU0sa0JBQWQsS0FBQyxPQUFPLE1BQU07UUFDZCxLQUFDLE9BQU8sTUFBTSxNQUFNLFNBQVMsS0FBSyxNQUFNLE1BQU07ZUFFOUMsS0FBSyxLQUFLLGFBQWEsTUFBTTs7O0lBRWpDLE1BQUMsbUJBQU0sT0FBTTs7OztRQUVULElBQUksS0FBQyxJQUFJLE1BQU07UUFFZixLQUFDLE9BQU8sTUFBTSxNQUFNLE9BQU8sS0FBQyxPQUFPLE1BQU0sTUFBTSxRQUFRLEdBQUc7WUFFcEMsV0FBVixFQUFFOztZQUFkLEVBQUU7O2VBRUYsS0FBSyxLQUFLLFlBQVksTUFBTTs7O0lBRWhDLE1BQUMscUJBQVEsT0FBTTs7WUFFUixLQUFDLFNBQVMsTUFBTTs7bUJBQ2YsS0FBQyxLQUFLLE1BQU07Ozs7bUJBRVosS0FBQyxNQUFNLE1BQU07Ozs7SUFRckIsTUFBQyx1QkFBVSxPQUFNOzswQkFBYyxLQUFDLElBQUksTUFBTTs7O0lBRTFDLE1BQUMsa0JBQUssT0FBTTs7Ozs0QkFFQyxLQUFDLE9BQU8sTUFBTTs7O1lBQW5CO2dCQUNRLEVBQUUsU0FBUTs7dUJBQWY7Ozs7O0lBRVgsTUFBQyxxQkFBUSxPQUFNOzs7OzRCQUVGLEtBQUMsT0FBTyxNQUFNOzs7WUFBbkI7Z0JBQ2UsV0FBWixFQUFFOztnQkFDRCxPQUFPLEVBQUUsT0FBTzs7O2VBQ3hCOzs7SUFFSixNQUFDLHlCQUFZOzs7OzRCQUVBLEtBQUMsT0FBTyxNQUFNOzs7WUFBbkI7Z0JBQ21CLFdBQWhCLEVBQUU7O2dCQUNELEVBQUU7Ozs7O0lBRWQsTUFBQyw4QkFBaUI7Ozs7NEJBRUwsS0FBQyxPQUFPLE1BQU07OztZQUFuQjtnQkFDd0IsV0FBckIsRUFBRTs7b0JBQ1UsRUFBRTs7MkJBQVY7Ozs7ZUFDWDs7O0lBRUosTUFBQyx3QkFBVyxPQUFNLEtBQUk7Ozs7NEJBRVQsS0FBQyxPQUFPLE1BQU07OztZQUFuQjtnQkFDa0IsV0FBZixFQUFFOztvQkFDSyxFQUFFLFVBQVUsSUFBSSxXQUFVOzs7Ozs7ZUFDeEM7OztJQUVKLE1BQUMseUJBQVksT0FBTTs7Ozs0QkFFTixLQUFDLE9BQU8sTUFBTTs7O1lBQW5CO2dCQUNtQixXQUFoQixFQUFFOztnQkFDRCxFQUFFLFdBQVc7OzthQUVkLEtBQUMsU0FBUyxNQUFNOztvQkFDbkIsS0FBSyxNQUFNLG9CQUFYLEtBQUssTUFBTSxVQUFXLGdCQUFnQjs7OztJQUU5QyxNQUFDLHlCQUFZLE9BQU0sV0FBVTs7Ozs0QkFFaEIsS0FBQyxPQUFPLE1BQU07OztZQUFuQjtnQkFDbUIsV0FBaEIsRUFBRTs7dUJBQ0MsRUFBRSxXQUFXLFVBQVU7OztlQUVqQzs7O0lBRUosTUFBQywyQkFBYyxPQUFNOzs7OzRCQUVSLEtBQUMsT0FBTyxNQUFNOzs7WUFBbkI7Z0JBQ3FCLFdBQWxCLEVBQUU7O2dCQUNELFFBQVEsRUFBRSxhQUFhOzs7ZUFDL0I7OztJQUVKLE1BQUMsdUJBQVU7Ozs7NEJBRUUsS0FBQyxPQUFPLE1BQU07OztZQUFuQjtnQkFDaUIsV0FBZCxFQUFFOztnQkFDRCxFQUFFOzs7OztJQUVkLE1BQUMseUJBQVksT0FBTSxNQUFLLEtBQUksS0FBSTs7Ozs0QkFFbkIsS0FBQyxPQUFPLE1BQU07OztZQUFuQjtnQkFDbUIsV0FBaEIsRUFBRTs7Z0JBQ0QsRUFBRSxXQUFXLEtBQUssSUFBSSxJQUFJOzs7OztXQWhLakM7OztBQWtLVCxLQUFLLFNBQVMsS0FBSztlQUVaIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode.kode
