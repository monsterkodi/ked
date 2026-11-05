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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvZWRpdC9tb2RlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQU07SUFBSztJQUFNO0lBQUs7O09BQ2hCLFlBQVQ7OztBQUVOLFFBQUQ7Ozs7O0lBWUksTUFBQztJQUNELE1BQUM7SUFDRCxNQUFDO0lBQ0QsTUFBQyxXQUFTO0lBRVYsTUFBQzs7ZUFBVSxPQUFPLEtBQUssS0FBSzs7O0lBRTVCLE1BQUM7Ozs7UUFFRyxhQUFRLElBQUksS0FBSyxNQUFNLEtBQU0sVUFBSTs2QkFFckI7OztZQUFSO1lBQ0EsT0FBTyxLQUFLO2dCQUNBLE1BQU0sSUFBSSxVQUFTOztnQkFBL0I7Ozs7Z0JBR0ksV0FBYyxPQUFPLE1BQU0sU0FBUyxLQUFNO2dCQUMxQyxxQkFBZ0IsT0FBTzs7bUJBQ3JCOztnQkFDRiwyQkFBbUIsa0JBQWtCO2dCQUNyQzs7WUFFSixhQUFjLE1BQU0sS0FBSztZQUN6QixjQUFjLGFBQWE7WUFDM0IsS0FBSyxNQUFNLGNBQWM7O1FBRTdCLEtBQUssS0FBSzswQkFFRSxLQUFLOztZQUNiLEtBQUssbUJBQW1CLEtBQUssUUFBUTs7OztJQUU3QyxNQUFDLGlDQUFvQjs7OztzQkFFUixLQUFLOzttQkFDUixLQUFLLFFBQVEsS0FBSzs7NEJBRVosS0FBSzs7O1lBQWI7Z0JBQ0csT0FBTyxNQUFNLFNBQVUsS0FBSyxNQUFNLE1BQU07O2dCQUN2QyxLQUFLLE1BQU0sT0FBTyxNQUFNOzs7OztJQUVwQyxNQUFDLG9CQUFPLE9BQU07Ozs7WUFFTCxLQUFDLFNBQVMsTUFBTTs7OztRQUVyQixLQUFDLE9BQU8sTUFBTSxrQkFBZCxLQUFDLE9BQU8sTUFBTTtRQUNkLEtBQUMsT0FBTyxNQUFNLE1BQU0sU0FBUyxLQUFLLE1BQU0sTUFBTTtlQUU5QyxLQUFLLEtBQUssYUFBYSxNQUFNOzs7SUFFakMsTUFBQyxtQkFBTSxPQUFNOzs7O1FBRVQsSUFBSSxLQUFDLElBQUksTUFBTTtRQUVmLEtBQUMsT0FBTyxNQUFNLE1BQU0sT0FBTyxLQUFDLE9BQU8sTUFBTSxNQUFNLFFBQVEsR0FBRztZQUVwQyxXQUFWLEVBQUU7O1lBQWQsRUFBRTs7ZUFFRixLQUFLLEtBQUssWUFBWSxNQUFNOzs7SUFFaEMsTUFBQyxxQkFBUSxPQUFNOztZQUVSLEtBQUMsU0FBUyxNQUFNOzttQkFDZixLQUFDLEtBQUssTUFBTTs7OzttQkFFWixLQUFDLE1BQU0sTUFBTTs7OztJQUVyQixNQUFDLHVCQUFVLE9BQU07OzBCQUFjLEtBQUMsSUFBSSxNQUFNOzs7SUFFMUMsTUFBQyxrQkFBSyxPQUFNOzs7OzRCQUVDLEtBQUMsT0FBTyxNQUFNOzs7WUFBbkI7Z0JBQ08sRUFBRSxTQUFROzt1QkFBZjs7Ozs7SUFFVixNQUFDLHFCQUFRLE9BQU07Ozs7NEJBRUYsS0FBQyxPQUFPLE1BQU07OztZQUFuQjtnQkFDZSxXQUFaLEVBQUU7O2dCQUNELE9BQU8sRUFBRSxPQUFPOzs7ZUFDeEI7OztJQUVKLE1BQUMseUJBQVk7Ozs7NEJBRUEsS0FBQyxPQUFPLE1BQU07OztZQUFuQjtnQkFDbUIsV0FBaEIsRUFBRTs7Z0JBQ0QsRUFBRTs7Ozs7SUFFZCxNQUFDLDhCQUFpQjs7Ozs0QkFFTCxLQUFDLE9BQU8sTUFBTTs7O1lBQW5CO2dCQUN3QixXQUFyQixFQUFFOztvQkFDUyxFQUFFOzsyQkFBVjs7OztlQUNWOzs7SUFFSixNQUFDLHdCQUFXLE9BQU0sS0FBSTs7Ozs0QkFFVCxLQUFDLE9BQU8sTUFBTTs7O1lBQW5CO2dCQUNrQixXQUFmLEVBQUU7O29CQUNJLEVBQUUsVUFBVSxJQUFJLFdBQVU7Ozs7OztlQUN2Qzs7O0lBRUosTUFBQyx5QkFBWSxPQUFNOzs7OzRCQUVOLEtBQUMsT0FBTyxNQUFNOzs7WUFBbkI7Z0JBQ21CLFdBQWhCLEVBQUU7O2dCQUNELEVBQUUsV0FBVzs7O2FBRWQsS0FBQyxTQUFTLE1BQU07O29CQUNuQixLQUFLLE1BQU0sb0JBQVgsS0FBSyxNQUFNLFVBQVcsZ0JBQWdCOzs7O0lBRTlDLE1BQUMseUJBQVksT0FBTSxXQUFVOzs7OzRCQUVoQixLQUFDLE9BQU8sTUFBTTs7O1lBQW5CO2dCQUNtQixXQUFoQixFQUFFOzt1QkFDQyxFQUFFLFdBQVcsVUFBVTs7O2VBRWpDOzs7SUFFSixNQUFDLDJCQUFjLE9BQU07Ozs7NEJBRVIsS0FBQyxPQUFPLE1BQU07OztZQUFuQjtnQkFDcUIsV0FBbEIsRUFBRTs7Z0JBQ0QsUUFBUSxFQUFFLGFBQWE7OztlQUMvQjs7O0lBRUosTUFBQyx1QkFBVTs7Ozs0QkFFRSxLQUFDLE9BQU8sTUFBTTs7O1lBQW5CO2dCQUNpQixXQUFkLEVBQUU7O2dCQUNELEVBQUU7Ozs7O0lBRWQsTUFBQyx5QkFBWSxPQUFNLE1BQUssS0FBSSxLQUFJOzs7OzRCQUVuQixLQUFDLE9BQU8sTUFBTTs7O1lBQW5CO2dCQUNtQixXQUFoQixFQUFFOztnQkFDRCxFQUFFLFdBQVcsS0FBSyxJQUFJLElBQUk7Ozs7O1dBbEp6Qzs7O0FBb0pELEtBQUssU0FBUyxLQUFLO2VBRVoifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode.kode
