var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = performance.now(); }, profilend: function (id) { var b = performance.now()-_k_.hrtime[id]; let f=0.001; for (let u of ['s','ms','μs','ns']) { if (u=='ns' || (b*f)>=1) { return console.log(id+' '+Number.parseFloat(b*f).toFixed(1)+' '+u); } f*=1000; }}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var salterMode

import salter from "../../../kxk/salter.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import belt from "../tool/belt.js"

import mode from "../mode.js"


salterMode = (function ()
{
    salterMode["syms"] = []
    function salterMode (state)
    {
        this.state = state
    
        this.name = 'salter'
        if (_k_.empty(salterMode.syms))
        {
            salterMode.syms = Object.keys(salter.font)
        }
        this.start()
    }

    salterMode["checkCursorsSet"] = function (state)
    {
        var cursors, _33_36_

        if (!(state.allowedModes != null ? state.allowedModes.salter : undefined))
        {
            return
        }
        if (state.s.cursors.length !== 1)
        {
            return
        }
        if (state.s.selections.length)
        {
            return
        }
        cursors = belt.findPositionsForSaltInsert(state.s.lines,state.mainCursor())
        if (!_k_.empty(cursors))
        {
            return mode.start(state,'salter')
        }
    }

    salterMode.prototype["start"] = function ()
    {
        var cursors, i, main, mc, pos

        cursors = this.findCursors()
        if (!_k_.empty(cursors))
        {
            mc = this.state.mainCursor()
            this.state.s = this.state.s.set('cursors',cursors)
            var list = _k_.list(cursors)
            for (main = 0; main < list.length; main++)
            {
                pos = list[main]
                if (_k_.eql(pos, mc))
                {
                    break
                }
            }
            this.state.s = this.state.s.set('main',main)
        }
        if (this.state.s.cursors.length === 5 && belt.positionColumns(this.state.s.cursors).length === 1)
        {
            return true
        }
        else
        {
            _k_.profile('salted cursor')
            this.state.begin()
            this.state.moveCursors('eol')
            this.state.singleCursorAtIndentOrStartOfLine()
            for (i = 0; i < 5; i++)
            {
                this.state.insert('# \n')
            }
            this.state.moveCursors('right')
            this.state.moveCursors('right')
            this.state.moveCursors('up')
            for (i = 0; i < 4; i++)
            {
                this.state.expandCursors('up')
            }
            this.state.end()
            return _k_.profilend('salted cursor')
        }
    }

    salterMode.prototype["stop"] = function ()
    {}

    salterMode.prototype["findCursors"] = function ()
    {
        return belt.findPositionsForSaltInsert(this.state.s.lines,this.state.mainCursor())
    }

    salterMode.prototype["isSaltedLine"] = function (y)
    {
        return belt.isSaltedLine(this.state.s.lines[y])
    }

    salterMode.prototype["cursorsSet"] = function ()
    {
        var cursors

        cursors = this.findCursors()
        if (!_k_.empty(cursors))
        {
            if (_k_.eql(this.state.s.cursors, cursors))
            {
                return true
            }
            else
            {
                return this.state.setCursors(cursors)
            }
        }
        else
        {
            return mode.stop(this.state,'salter')
        }
    }

    salterMode.prototype["deleteSelection"] = function ()
    {
        var cursors, idx, lineids

        cursors = this.state.allCursors()
        lineids = belt.lineIndicesForPositions(cursors)
        var list = _k_.list(lineids)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            idx = list[_a_]
            if (!this.state.isFullySelectedLine(idx))
            {
                return
            }
        }
        this.state.moveCursors('bol')
        this.state.delete('eol')
        this.state.setCursors(lineids.map(function (idx)
        {
            return [0,idx]
        }))
        this.state.deselect()
        mode.start(this.state,'salter')
        return true
    }

    salterMode.prototype["handleKey"] = function (key, event)
    {
        var char

        switch (event.combo)
        {
            case 'up':
                if (this.state.s.main > 0)
                {
                    this.state.setMain(this.state.s.main - 1)
                    return
                }
                if (!this.isSaltedLine(this.state.mainCursor()[1] - 1))
                {
                    this.state.s = this.state.s.set('cursors',[this.state.mainCursor()])
                    this.state.s = this.state.s.set('main',0)
                    return 'unhandled'
                }
                break
            case 'down':
                if (this.state.s.main < 4)
                {
                    this.state.setMain(this.state.s.main + 1)
                    return
                }
                if (!this.isSaltedLine(this.state.mainCursor()[1] + 1))
                {
                    this.state.s = this.state.s.set('cursors',[this.state.mainCursor()])
                    this.state.s = this.state.s.set('main',0)
                    return 'unhandled'
                }
                break
        }

        char = (!_k_.empty((event.char)) ? event.char : key)
        if (salter.hasChar(char))
        {
            this.state.insert(salter(char,{char:'█',postfix:'  '}))
            return
        }
        return 'unhandled'
    }

    salterMode.prototype["themeColor"] = function (colorName, defaultColor)
    {
        switch (colorName)
        {
            case 'cursor.multi':
                return color.brighten(theme.syntax['comment triple header'],0.2)

            case 'cursor.main':
                return color.brighten(theme.syntax['comment triple header'],0.6)

        }

        return defaultColor
    }

    return salterMode
})()

export default salterMode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FsdGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L21vZGUvc2FsdGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FNbUIsYUFBTjs7T0FDTSxZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFaOztPQUNZLFdBQUE7OztBQUVWLGNBQVQ7O0lBRUksWUFBQzthQUVELFlBQUk7O1FBQUQ7O1FBRUMsS0FBQyxPQUFPO3NCQUVDLFdBQVc7O1lBQ2hCLFdBQVcsT0FBTyxPQUFPLEtBQUssT0FBTzs7UUFFekMsS0FBQzs7O0lBUUwsWUFBQyw4QkFBaUI7Ozs7Y0FFSixNQUFNLHVCQUFOLE1BQU0sYUFBYzs7OztZQUN4QixNQUFNLEVBQUUsUUFBUSxXQUFVOzs7O1lBQzFCLE1BQU0sRUFBRSxXQUFXOzs7O1FBRXpCLFVBQVUsS0FBSywyQkFBMkIsTUFBTSxFQUFFLE1BQU0sTUFBTTt1QkFDckQ7O21CQUNMLEtBQUssTUFBTSxNQUFNOzs7OzBCQWV6Qjs7OztRQUVJLFVBQVUsS0FBQzt1QkFFRjs7WUFDTCxLQUFLLEtBQUMsTUFBTTtZQUNaLEtBQUMsTUFBTSxJQUFJLEtBQUMsTUFBTSxFQUFFLElBQUksVUFBVTtnQ0FDbEI7aUJBQVI7O2dCQUFKOzRCQUNTLEtBQVE7O29CQUFqQjs7O1lBQ0osS0FBQyxNQUFNLElBQUksS0FBQyxNQUFNLEVBQUUsSUFBSSxPQUFPOztZQUNoQyxLQUFDLE1BQU0sRUFBRSxRQUFRLFdBQVUsS0FBTSxLQUFLLGdCQUFnQixLQUFDLE1BQU0sRUFBRSxTQUFTLFdBQVU7O21CQUNqRjs7OztZQUVBO1lBQ0EsS0FBQyxNQUFNO1lBQ1AsS0FBQyxNQUFNLFlBQVk7WUFDbkIsS0FBQyxNQUFNO2lCQUNILElBQUssT0FBSTs7Z0JBQ1QsS0FBQyxNQUFNLE9BQU87O1lBQ2xCLEtBQUMsTUFBTSxZQUFZO1lBQ25CLEtBQUMsTUFBTSxZQUFZO1lBQ25CLEtBQUMsTUFBTSxZQUFZO2lCQUNmLElBQUssT0FBSTs7Z0JBQ1QsS0FBQyxNQUFNLGNBQWM7O1lBQ3pCLEtBQUMsTUFBTTttQkFDUDs7OzswQkFFUjs7OzBCQUVBOztlQUFtQixLQUFLLDJCQUEyQixLQUFDLE1BQU0sRUFBRSxNQUFNLEtBQUMsTUFBTTs7OzBCQUN6RSwyQkFBYzs7ZUFBSyxLQUFLLGFBQWEsS0FBQyxNQUFNLEVBQUUsTUFBTTs7OzBCQUVwRDs7OztRQUVJLFVBQVUsS0FBQzt1QkFFRjs7d0JBQ0YsS0FBQyxNQUFNLEVBQUUsU0FBWTs7dUJBQ3BCOzs7O3VCQUVBLEtBQUMsTUFBTSxXQUFXOzs7OzttQkFFdEIsS0FBSyxLQUFLLEtBQUMsTUFBTTs7OzswQkFRekI7Ozs7UUFFSSxVQUFVLEtBQUMsTUFBTTtRQUNqQixVQUFVLEtBQUssd0JBQXdCOzRCQUU1Qjs7O1lBQVA7aUJBQ1UsS0FBQyxNQUFNLG9CQUFvQjs7Ozs7UUFFekMsS0FBQyxNQUFNLFlBQVk7UUFDbkIsS0FBQyxNQUFNLE9BQU87UUFDZCxLQUFDLE1BQU0sV0FBVyxRQUFRLGNBQUs7O29CQUFTLEVBQUU7O1FBRTFDLEtBQUMsTUFBTTtRQUNQLEtBQUssTUFBTSxLQUFDLE1BQU07ZUFDbEI7OzswQkFRSix3QkFBVyxLQUFJOzs7O2dCQUVKLE1BQU07O2lCQUVUO29CQUNPLEtBQUMsTUFBTSxFQUFFLE9BQU87O29CQUNmLEtBQUMsTUFBTSxRQUFRLEtBQUMsTUFBTSxFQUFFLE9BQUs7OztxQkFFMUIsS0FBQyxhQUFhLEtBQUMsTUFBTSxhQUFhLEtBQUc7O29CQUN4QyxLQUFDLE1BQU0sSUFBSSxLQUFDLE1BQU0sRUFBRSxJQUFJLFdBQVcsS0FBQyxNQUFNO29CQUMxQyxLQUFDLE1BQU0sSUFBSSxLQUFDLE1BQU0sRUFBRSxJQUFJLE9BQU87MkJBQzVCOzs7aUJBQ1g7b0JBQ08sS0FBQyxNQUFNLEVBQUUsT0FBTzs7b0JBQ2YsS0FBQyxNQUFNLFFBQVEsS0FBQyxNQUFNLEVBQUUsT0FBSzs7O3FCQUUxQixLQUFDLGFBQWEsS0FBQyxNQUFNLGFBQWEsS0FBRzs7b0JBQ3hDLEtBQUMsTUFBTSxJQUFJLEtBQUMsTUFBTSxFQUFFLElBQUksV0FBVyxLQUFDLE1BQU07b0JBQzFDLEtBQUMsTUFBTSxJQUFJLEtBQUMsTUFBTSxFQUFFLElBQUksT0FBTzsyQkFDNUI7Ozs7O1FBRWYsb0JBQWEsTUFBTSxTQUFRLE1BQU0sT0FBTztZQUVyQyxPQUFPLFFBQVE7O1lBQ2QsS0FBQyxNQUFNLE9BQU8sT0FBTyxNQUFLLEtBQUssSUFBSSxRQUFROzs7ZUFHL0M7OzswQkFRSix5QkFBWSxXQUFVOztnQkFFWDs7aUJBQ0g7dUJBQW9CLE1BQU0sU0FBUyxNQUFNLE9BQU8seUJBQXlCOztpQkFDekU7dUJBQW9CLE1BQU0sU0FBUyxNQUFNLE9BQU8seUJBQXlCOzs7O2VBRTdFOzs7V0EzSkM7OztlQTZKRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/salter.kode
