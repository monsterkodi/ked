var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = performance.now(); }, profilend: function (id) { var b = performance.now()-_k_.hrtime[id]; let f=0.001; for (let u of ['s','ms','μs','ns']) { if (u=='ns' || (b*f)>=1) { return console.log(id+' '+Number.parseFloat(b*f).toFixed(1)+' '+u); } f*=1000; }}, each_r: function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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
        var cursors, _28_36_

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
        if (mode.isActive(state,'novim'))
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

    salterMode.prototype["desalt"] = function ()
    {
        var lines, selections, texts

        lines = this.state.s.lines
        selections = belt.lineRangesForPositions(lines,this.state.s.cursors)
        texts = (function (o) {
            var r_a_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (rng)
            {
                return belt.textForLineRange(lines,rng)
            })(o[k])
                if (m != null)
                {
                    r_a_[k] = m
                }
            }
            return typeof o == 'string' ? r_a_.join('') : r_a_
        })(selections)
        texts = (function (o) {
            var r_b_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (txt)
            {
                return txt.replace(/\s*\#/,'')
            })(o[k])
                if (m != null)
                {
                    r_b_[k] = m
                }
            }
            return typeof o == 'string' ? r_b_.join('') : r_b_
        })(texts)
        console.log("desalt\n",texts)
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
            case 'shift+cmd+b':
                if (this.isSaltedLine(this.state.mainCursor()[1]))
                {
                    return this.desalt()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FsdGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L21vZGUvc2FsdGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDbUIsYUFBTjs7T0FDTSxZQUFUO09BQWUsWUFBZjs7T0FDUyxXQUFaOztPQUNZLFdBQUE7OztBQUVsQixjQUFEOztJQUVJLFlBQUM7YUFFRCxZQUFJOztRQUFEOztRQUVDLEtBQUMsT0FBTztzQkFFQyxXQUFXOztZQUNoQixXQUFXLE9BQU8sT0FBTyxLQUFLLE9BQU87O1FBRXpDLEtBQUM7OztJQVFMLFlBQUMsOEJBQWlCOzs7O2NBRUosTUFBTSx1QkFBTixNQUFNLGFBQWM7Ozs7WUFDeEIsTUFBTSxFQUFFLFFBQVEsV0FBVTs7OztZQUMxQixNQUFNLEVBQUUsV0FBVzs7OztZQUNuQixLQUFLLFNBQVMsTUFBTTs7OztRQUMxQixVQUFVLEtBQUssMkJBQTJCLE1BQU0sRUFBRSxNQUFNLE1BQU07dUJBQ3JEOzttQkFDTCxLQUFLLE1BQU0sTUFBTTs7OzswQkFRekI7Ozs7UUFFSSxVQUFVLEtBQUM7dUJBRUY7O1lBQ0wsS0FBSyxLQUFDLE1BQU07WUFDWixLQUFDLE1BQU0sSUFBSSxLQUFDLE1BQU0sRUFBRSxJQUFJLFVBQVU7Z0NBQ2xCO2lCQUFSOztnQkFBSjs0QkFDUyxLQUFROztvQkFBakI7OztZQUNKLEtBQUMsTUFBTSxJQUFJLEtBQUMsTUFBTSxFQUFFLElBQUksT0FBTzs7WUFDaEMsS0FBQyxNQUFNLEVBQUUsUUFBUSxXQUFVLEtBQU0sS0FBSyxnQkFBZ0IsS0FBQyxNQUFNLEVBQUUsU0FBUyxXQUFVOzttQkFDakY7Ozs7WUFFQTtZQUNBLEtBQUMsTUFBTTtZQUNQLEtBQUMsTUFBTSxZQUFZO1lBQ25CLEtBQUMsTUFBTTtpQkFDSCxJQUFLLE9BQUk7O2dCQUNULEtBQUMsTUFBTSxPQUFPOztZQUNsQixLQUFDLE1BQU0sWUFBWTtZQUNuQixLQUFDLE1BQU0sWUFBWTtZQUNuQixLQUFDLE1BQU0sWUFBWTtp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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/salter.kode
