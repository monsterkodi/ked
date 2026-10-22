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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9kZWwua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FRYSxVQUFBO0lBQU07SUFBSztJQUFLOztPQUNWLFdBQVo7O09BQ1ksV0FBQTs7O0lBVWYsaUJBQVEsTUFBSzs7OzttQkFFZ0IsTUFBUyxPQUFPLHVCQUFrQixLQUFDLEVBQUU7O21CQUEzRCxLQUFDOztRQUVKLFFBQVEsS0FBQyxFQUFFLE1BQU0sY0FBSzs7bUJBQU07O1FBRTVCLFVBQVUsS0FBQztZQUVSLFFBQVEsV0FBVSxZQUFNLE1BQVMsT0FBTyxZQUFZLEtBQUssa0JBQWtCLE1BQU0sUUFBUTs7bUJBQ3JGLEtBQUMsY0FBYyxLQUFLLE1BQU0sTUFBTSxRQUFRLEdBQUcsS0FBSyxRQUFRLEdBQUc7O1lBRS9ELFNBQVE7O1lBQ1AsY0FBYztnQ0FDQTs7O2dCQUFWO2dCQUNBLE1BQU0sS0FBSywyQkFBMkIsTUFBTTtnQkFDNUMsc0JBQWtCLFlBQVksSUFBSSxLQUFHLElBQUk7Ozt1QkFFN0MsS0FBTSxRQUFRLFNBQU8sU0FBRyx1QkFBQSxVQUFBOztZQUV4QixTQUFTLFFBQVE7c0JBRVQsUUFBUCxZQUFFOztZQUVILE9BQU8sTUFBTTtZQUViLFNBQVM7WUFDVCxLQUFLO29CQUVFOztxQkFFSDtvQkFBUyxPQUFPLFdBQUssVUFBSSxpQkFBQTs7cUJBRXpCO3dCQUNPLE1BQUs7OzRCQUNELFFBQVEsV0FBVTs7Z0NBQ1gsS0FBSzs7Ozs0QkFDWCxLQUFLOzRCQUNMLElBQUksS0FBSyxNQUFNLE1BQU07NEJBQ3JCLFNBQVM7NEJBQ1QsT0FBTyxLQUFLLEtBQUssTUFBTSxHQUFHOzRCQUMxQixPQUFPLEtBQUs7NEJBQ1osT0FBTyxLQUFLOzs7Ozs0QkFFYjs7Z0NBQ0ksTUFBTSxLQUFLLGlDQUFpQyxNQUFNOztnQ0FDakQsS0FBSyxJQUFJLEtBQUssSUFBSTs7OztnQ0FFbEIsS0FBSzs7Ozs7Z0NBRU4sY0FBYzs7Z0NBQ2IsS0FBSyxJQUFJO29DQUNDLE9BQU07O29DQUFoQixLQUFLOztnQ0FDTCxhQUFTLFlBQVk7Ozs7Z0NBRXJCLEtBQUs7Ozs0QkFFVixLQUFLLEtBQUssTUFBTTs7NEJBQ2YsT0FBTyxLQUFLLGFBQWEsS0FBSzs0QkFDOUIsT0FBTyxLQUFLLEtBQUssV0FBSyxHQUFJLE9BQUssSUFBSSxXQUFLOzs7O3FCQUVwRDt3QkFDTyxNQUFLLEtBQUssTUFBTSxNQUFNOzs0QkFDbEIsUUFBUSxXQUFVOztnQ0FDWCxLQUFLLE1BQU0sU0FBTzs7Ozs0QkFDeEIsSUFBSSxLQUFLLE1BQU0sTUFBTTs0QkFDckIsU0FBUzs0QkFDVCxPQUFPLEtBQUssS0FBSyxLQUFLLE1BQU0sSUFBRTs0QkFDOUIsT0FBTyxLQUFLOzRCQUNaLE9BQU8sS0FBSzs7Ozs7NEJBRWI7O2dDQUNJLE1BQU0sS0FBSyxrQ0FBa0MsTUFBTTs7Z0NBQ2xELEtBQUssSUFBSSxLQUFLLElBQUk7Z0NBQ2xCLE9BQU8sS0FBSyxLQUFLLFdBQUssVUFBSSxpQkFBQSxRQUFHLFdBQUssSUFBRTs7Ozs7NEJBRXhDLEtBQUs7NEJBQ0wsT0FBTyxLQUFLLEtBQUssV0FBSyxVQUFJLGlCQUFBLFFBQUcsV0FBSyxJQUFFOzt3QkFDeEMsT0FBTyxNQUFNOzs7OztZQUV6QixLQUFLLHdCQUF3QixRQUFRLFFBQVE7WUFFN0MsTUFBTSxPQUFPLEVBQUUsT0FBTzs7UUFFMUIsS0FBQztRQUNELEtBQUMsU0FBVztlQUNaLEtBQUMsV0FBVzs7SUFRaEI7O1lBRVUsS0FBSyxnQkFBZ0I7Ozs7ZUFFM0IsS0FBQyxhQUFhLEtBQUMsZ0JBQWdCLEtBQUM7O0lBRXBDLHVCQUFjLE1BQUssTUFBSyxXQUFTOzs7O3NCQUVqQjs7OztRQUVaLFFBQUEsZUFBQSxPQUFRLEtBQUM7YUFFVyxLQUFDOztZQUFyQixLQUFDOztrQkFFaUIsS0FBSyxtQ0FBbUMsS0FBQyxFQUFFLE1BQU0sS0FBSyxLQUFLLFdBQTVFLGdCQUFNOztRQUVQLEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQyxTQUFXO2VBQ1osS0FBQyxXQUFXIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/del.kode
