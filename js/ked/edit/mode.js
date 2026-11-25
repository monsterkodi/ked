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
        var _61_28_

        if (this.isActive(state,name))
        {
            return
        }
        this.active[state.name] = ((_61_28_=this.active[state.name]) != null ? _61_28_ : [])
        this.active[state.name].push(new mode.modes[name](state))
        return post.emit('mode.start',state,name)
    }

    mode["stop"] = function (state, name)
    {
        var m

        m = this.get(state,name)
        if (!(m != null))
        {
            return
        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9tb2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQU07SUFBSztJQUFNO0lBQUs7O09BQ2hCLFlBQVQ7OztBQUVOLFFBQUQ7Ozs7O0lBWUksTUFBQztJQUNELE1BQUM7SUFDRCxNQUFDO0lBQ0QsTUFBQyxXQUFTO0lBRVYsTUFBQzs7ZUFBVSxPQUFPLEtBQUssS0FBSzs7O0lBRTVCLE1BQUM7Ozs7UUFFRyxhQUFRLElBQUksS0FBSyxNQUFNLEtBQU0sVUFBSTs2QkFFckI7OztZQUFSO1lBQ0EsT0FBTyxLQUFLO2dCQUNBLE1BQU0sSUFBSSxVQUFTOztnQkFBL0I7Ozs7Z0JBR0ksV0FBYyxPQUFPLE1BQU0sU0FBUyxLQUFNO2dCQUMxQyxxQkFBZ0IsT0FBTzs7bUJBQ3JCOztnQkFDRiwyQkFBbUIsa0JBQWtCO2dCQUNyQzs7WUFFSixhQUFjLE1BQU0sS0FBSztZQUN6QixjQUFjLGFBQWE7WUFDM0IsS0FBSyxNQUFNLGNBQWM7O1FBRTdCLEtBQUssS0FBSzswQkFFRSxLQUFLOztZQUNiLEtBQUssbUJBQW1CLEtBQUssUUFBUTs7OztJQUU3QyxNQUFDLGlDQUFvQjs7OztzQkFFUixLQUFLOzttQkFDUixLQUFLLFFBQVEsS0FBSzs7NEJBRVosS0FBSzs7O1lBQWI7Z0JBQ0csT0FBTyxNQUFNLFNBQVUsS0FBSyxNQUFNLE1BQU07O2dCQUN2QyxLQUFLLE1BQU0sT0FBTyxNQUFNOzs7OztJQUVwQyxNQUFDLG9CQUFPLE9BQU07Ozs7WUFFTCxLQUFDLFNBQVMsTUFBTTs7OztRQUVyQixLQUFDLE9BQU8sTUFBTSxrQkFBZCxLQUFDLE9BQU8sTUFBTTtRQUNkLEtBQUMsT0FBTyxNQUFNLE1BQU0sU0FBUyxLQUFLLE1BQU0sTUFBTTtlQUU5QyxLQUFLLEtBQUssYUFBYSxNQUFNOzs7SUFFakMsTUFBQyxtQkFBTSxPQUFNOzs7O1FBRVQsSUFBSSxLQUFDLElBQUksTUFBTTtjQUVOOzs7O1FBRVQsS0FBQyxPQUFPLE1BQU0sTUFBTSxPQUFPLEtBQUMsT0FBTyxNQUFNLE1BQU0sUUFBUSxHQUFHO1lBRXBDLFdBQVYsRUFBRTs7WUFBZCxFQUFFOztlQUVGLEtBQUssS0FBSyxZQUFZLE1BQU07OztJQUVoQyxNQUFDLHFCQUFRLE9BQU07O1lBRVIsS0FBQyxTQUFTLE1BQU07O21CQUNmLEtBQUMsS0FBSyxNQUFNOzs7O21CQUVaLEtBQUMsTUFBTSxNQUFNOzs7O0lBRXJCLE1BQUMsdUJBQVUsT0FBTTs7MEJBQWMsS0FBQyxJQUFJLE1BQU07OztJQUUxQyxNQUFDLGtCQUFLLE9BQU07Ozs7NEJBRUMsS0FBQyxPQUFPLE1BQU07OztZQUFuQjtnQkFDTyxFQUFFLFNBQVE7O3VCQUFmOzs7OztJQUVWLE1BQUMscUJBQVEsT0FBTTs7Ozs0QkFFRixLQUFDLE9BQU8sTUFBTTs7O1lBQW5CO2dCQUNlLFdBQVosRUFBRTs7Z0JBQ0QsT0FBTyxFQUFFLE9BQU87OztlQUN4Qjs7O0lBRUosTUFBQyx5QkFBWTs7Ozs0QkFFQSxLQUFDLE9BQU8sTUFBTTs7O1lBQW5CO2dCQUNtQixXQUFoQixFQUFFOztnQkFDRCxFQUFFOzs7OztJQUVkLE1BQUMsOEJBQWlCOzs7OzRCQUVMLEtBQUMsT0FBTyxNQUFNOzs7WUFBbkI7Z0JBQ3dCLFdBQXJCLEVBQUU7O29CQUNTLEVBQUU7OzJCQUFWOzs7O2VBQ1Y7OztJQUVKLE1BQUMsd0JBQVcsT0FBTSxLQUFJOzs7OzRCQUVULEtBQUMsT0FBTyxNQUFNOzs7WUFBbkI7Z0JBQ2tCLFdBQWYsRUFBRTs7b0JBQ0ksRUFBRSxVQUFVLElBQUksV0FBVTs7Ozs7O2VBQ3ZDOzs7SUFFSixNQUFDLHlCQUFZLE9BQU07Ozs7NEJBRU4sS0FBQyxPQUFPLE1BQU07OztZQUFuQjtnQkFDbUIsV0FBaEIsRUFBRTs7Z0JBQ0QsRUFBRSxXQUFXOzs7YUFFZCxLQUFDLFNBQVMsTUFBTTs7b0JBQ25CLEtBQUssTUFBTSxvQkFBWCxLQUFLLE1BQU0sVUFBVyxnQkFBZ0I7Ozs7SUFFOUMsTUFBQyx5QkFBWSxPQUFNLFdBQVU7Ozs7NEJBRWhCLEtBQUMsT0FBTyxNQUFNOzs7WUFBbkI7Z0JBQ21CLFdBQWhCLEVBQUU7O3VCQUNDLEVBQUUsV0FBVyxVQUFVOzs7ZUFFakM7OztJQUVKLE1BQUMsMkJBQWMsT0FBTTs7Ozs0QkFFUixLQUFDLE9BQU8sTUFBTTs7O1lBQW5CO2dCQUNxQixXQUFsQixFQUFFOztnQkFDRCxRQUFRLEVBQUUsYUFBYTs7O2VBQy9COzs7SUFFSixNQUFDLHVCQUFVOzs7OzRCQUVFLEtBQUMsT0FBTyxNQUFNOzs7WUFBbkI7Z0JBQ2lCLFdBQWQsRUFBRTs7Z0JBQ0QsRUFBRTs7Ozs7SUFFZCxNQUFDLHlCQUFZLE9BQU0sTUFBSyxLQUFJLEtBQUk7Ozs7NEJBRW5CLEtBQUMsT0FBTyxNQUFNOzs7WUFBbkI7Z0JBQ21CLFdBQWhCLEVBQUU7O2dCQUNELEVBQUUsV0FBVyxLQUFLLElBQUksSUFBSTs7Ozs7V0FwSnpDOzs7QUFzSkQsS0FBSyxTQUFTLEtBQUs7ZUFFWiJ9
//# sourceURL=../../../kode/ked/edit/mode.kode
