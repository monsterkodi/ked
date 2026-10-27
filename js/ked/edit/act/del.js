var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg
let immutable = kxk.immutable

import belt from "../tool/belt.js"

import mode from "../mode.js"

export default {
    delete:function (type, jump)
    {
        var ci, cursor, cursors, dc, line, lines, minBeforeWs, remove, rng, segi, x, y
    
        if (_k_.in(type,['back','next']) && !_k_.empty(this.s.selections))
        {
            return this.deleteSelection()
        }
        if (type === 'back' && !jump)
        {
            this.recordNovimBackspace()
        }
        lines = this.s.lines.map(function (l)
        {
            return l
        })
        cursors = this.allCursors()
        if (cursors.length === 1 && _k_.in(type,['back','next']) && belt.isLinesPosOutside(lines,cursors[0]))
        {
            return this.setMainCursor(kseg.width(lines[cursors[0][1]]),cursors[0][1])
        }
        if (type === 'back')
        {
            minBeforeWs = Infinity
            var list = _k_.list(cursors)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                cursor = list[_a_]
                rng = belt.rangeOfWhitespaceLeftToPos(lines,cursor)
                minBeforeWs = _k_.min(minBeforeWs,rng[2] - rng[0])
            }
        }
        for (var _b_ = ci = cursors.length - 1, _c_ = 0; (_b_ <= _c_ ? ci <= 0 : ci >= 0); (_b_ <= _c_ ? ++ci : --ci))
        {
            cursor = cursors[ci]
            var _d_ = cursor; x = _d_[0]; y = _d_[1]
    
            line = lines[y]
            remove = 1
            dc = 0
            switch (type)
            {
                case 'eol':
                    line = line.slice(0, typeof x === 'number' ? x : -1)
                    break
                case 'back':
                    if (x === 0)
                    {
                        if (cursors.length === 1)
                        {
                            if (y <= 0)
                            {
                                return
                            }
                            y -= 1
                            x = kseg.width(lines[y])
                            remove = 2
                            line = kseg.join(lines[y],line)
                            cursor[0] = x
                            cursor[1] = y
                        }
                    }
                    else
                    {
                        if (jump)
                        {
                            if (rng = belt.rangeOfWordOrWhitespaceLeftToPos(lines,cursor))
                            {
                                dc = rng[2] - rng[0]
                            }
                            else
                            {
                                dc = 1
                            }
                        }
                        else
                        {
                            if (minBeforeWs > 1)
                            {
                                dc = x % 4
                                if (dc === 0)
                                {
                                    dc = 4
                                }
                                dc = _k_.min(minBeforeWs,dc)
                            }
                            else
                            {
                                dc = 1
                            }
                        }
                        if (x <= kseg.width(line))
                        {
                            segi = kseg.indexAtWidth(line,x)
                            line = kseg.join(line.slice(0, segi - dc),line.slice(segi))
                        }
                    }
                    break
                case 'next':
                    if (x === kseg.width(lines[y]))
                    {
                        if (cursors.length === 1)
                        {
                            if (y >= lines.length - 1)
                            {
                                return
                            }
                            x = kseg.width(lines[y])
                            remove = 2
                            line = kseg.join(line,lines[y + 1])
                            cursor[0] = x
                            cursor[1] = y
                        }
                    }
                    else
                    {
                        if (jump)
                        {
                            if (rng = belt.rangeOfWordOrWhitespaceRightToPos(lines,cursor))
                            {
                                dc = rng[2] - rng[0]
                                line = kseg.join(line.slice(0, typeof x === 'number' ? x : -1),line.slice(x + dc))
                            }
                        }
                        else
                        {
                            dc = 1
                            line = kseg.join(line.slice(0, typeof x === 'number' ? x : -1),line.slice(x + dc))
                        }
                        cursor[0] += dc
                    }
                    break
            }
    
            belt.moveCursorsInSameLineBy(cursors,cursor,-dc)
            lines.splice(y,remove,line)
        }
        this.clearHighlights()
        this.setLines(lines)
        return this.setCursors(cursors)
    },
    deleteSelection:function ()
    {
        if (mode.deleteSelection(this))
        {
            return
        }
        return this.deleteRanges(this.allSelections(),this.allCursors())
    },
    deleteRanges:function (rngs, posl, linewise = true)
    {
        var cursors, lines
    
        if (_k_.empty(rngs))
        {
            return
        }
        posl = (posl != null ? posl : this.allCursors())
        if (!this.beginIndex)
        {
            this.pushState()
        }
        var _e_ = belt.deleteLineRangesAndAdjustPositions(this.s.lines,rngs,posl,linewise); lines = _e_[0]; cursors = _e_[1]
    
        this.deselect()
        this.clearHighlights()
        this.setLines(lines)
        return this.setCursors(cursors)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9kZWwua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FRYSxVQUFBO0lBQU07SUFBSztJQUFLOztPQUNWLFdBQVo7O09BQ1ksV0FBQTs7O0lBVWYsaUJBQVEsTUFBSzs7OzttQkFFZ0IsTUFBUyxPQUFPLHVCQUFrQixLQUFDLEVBQUU7O21CQUEzRCxLQUFDOztZQUV1QixTQUFRLFdBQWU7O1lBQWxELEtBQUM7O1FBRUQsUUFBUSxLQUFDLEVBQUUsTUFBTSxjQUFLOzttQkFBTTs7UUFFNUIsVUFBVSxLQUFDO1lBRVIsUUFBUSxXQUFVLFlBQU0sTUFBUyxPQUFPLFlBQVksS0FBSyxrQkFBa0IsTUFBTSxRQUFROzttQkFDckYsS0FBQyxjQUFjLEtBQUssTUFBTSxNQUFNLFFBQVEsR0FBRyxLQUFLLFFBQVEsR0FBRzs7WUFFL0QsU0FBUTs7WUFDUCxjQUFjO2dDQUNBOzs7Z0JBQVY7Z0JBQ0EsTUFBTSxLQUFLLDJCQUEyQixNQUFNO2dCQUM1QyxzQkFBa0IsWUFBWSxJQUFJLEtBQUcsSUFBSTs7O3VCQUU3QyxLQUFNLFFBQVEsU0FBTyxTQUFHLHVCQUFBLFVBQUE7O1lBRXhCLFNBQVMsUUFBUTtzQkFFVCxRQUFQLFlBQUU7O1lBRUgsT0FBTyxNQUFNO1lBRWIsU0FBUztZQUNULEtBQUs7b0JBRUU7O3FCQUVIO29CQUFTLE9BQU8sV0FBSyxVQUFJLGlCQUFBOztxQkFFekI7d0JBQ08sTUFBSzs7NEJBQ0QsUUFBUSxXQUFVOztnQ0FDWCxLQUFLOzs7OzRCQUNYLEtBQUs7NEJBQ0wsSUFBSSxLQUFLLE1BQU0sTUFBTTs0QkFDckIsU0FBUzs0QkFDVCxPQUFPLEtBQUssS0FBSyxNQUFNLEdBQUc7NEJBQzFCLE9BQU8sS0FBSzs0QkFDWixPQUFPLEtBQUs7Ozs7OzRCQUViOztnQ0FDSSxNQUFNLEtBQUssaUNBQWlDLE1BQU07O2dDQUNqRCxLQUFLLElBQUksS0FBSyxJQUFJOzs7O2dDQUVsQixLQUFLOzs7OztnQ0FFTixjQUFjOztnQ0FDYixLQUFLLElBQUk7b0NBQ0MsT0FBTTs7b0NBQWhCLEtBQUs7O2dDQUNMLGFBQVMsWUFBWTs7OztnQ0FFckIsS0FBSzs7OzRCQUVWLEtBQUssS0FBSyxNQUFNOzs0QkFDZixPQUFPLEtBQUssYUFBYSxLQUFLOzRCQUM5QixPQUFPLEtBQUssS0FBSyxXQUFLLEdBQUksT0FBSyxJQUFJLFdBQUs7Ozs7cUJBRXBEO3dCQUNPLE1BQUssS0FBSyxNQUFNLE1BQU07OzRCQUNsQixRQUFRLFdBQVU7O2dDQUNYLEtBQUssTUFBTSxTQUFPOzs7OzRCQUN4QixJQUFJLEtBQUssTUFBTSxNQUFNOzRCQUNyQixTQUFTOzRCQUNULE9BQU8sS0FBSyxLQUFLLEtBQUssTUFBTSxJQUFFOzRCQUM5QixPQUFPLEtBQUs7NEJBQ1osT0FBTyxLQUFLOzs7Ozs0QkFFYjs7Z0NBQ0ksTUFBTSxLQUFLLGtDQUFrQyxNQUFNOztnQ0FDbEQsS0FBSyxJQUFJLEtBQUssSUFBSTtnQ0FDbEIsT0FBTyxLQUFLLEtBQUssV0FBSyxVQUFJLGlCQUFBLFFBQUcsV0FBSyxJQUFFOzs7Ozs0QkFFeEMsS0FBSzs0QkFDTCxPQUFPLEtBQUssS0FBSyxXQUFLLFVBQUksaUJBQUEsUUFBRyxXQUFLLElBQUU7O3dCQUN4QyxPQUFPLE1BQU07Ozs7O1lBRXpCLEtBQUssd0JBQXdCLFFBQVEsUUFBUTtZQUU3QyxNQUFNLE9BQU8sRUFBRSxPQUFPOztRQUUxQixLQUFDO1FBQ0QsS0FBQyxTQUFXO2VBQ1osS0FBQyxXQUFXOztJQVFoQjs7WUFFVSxLQUFLLGdCQUFnQjs7OztlQUUzQixLQUFDLGFBQWEsS0FBQyxnQkFBZ0IsS0FBQzs7SUFFcEMsdUJBQWMsTUFBSyxNQUFLLFdBQVM7Ozs7c0JBRWpCOzs7O1FBRVosUUFBQSxlQUFBLE9BQVEsS0FBQzthQUVXLEtBQUM7O1lBQXJCLEtBQUM7O2tCQUVpQixLQUFLLG1DQUFtQyxLQUFDLEVBQUUsTUFBTSxLQUFLLEtBQUssV0FBNUUsZ0JBQU07O1FBRVAsS0FBQztRQUNELEtBQUM7UUFDRCxLQUFDLFNBQVc7ZUFDWixLQUFDLFdBQVcifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/del.kode
