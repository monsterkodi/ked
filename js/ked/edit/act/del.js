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
    deleteRanges:function (rngs, posl)
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
        var _e_ = belt.deleteLineRangesAndAdjustPositions(this.s.lines,rngs,posl); lines = _e_[0]; cursors = _e_[1]
    
        this.deselect()
        this.clearHighlights()
        this.setLines(lines)
        return this.setCursors(cursors)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L2FjdC9kZWwua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBb0JJOzs7O21CQUU2QixNQUFTLE9BQU8sdUJBQWtCLEtBQUMsRUFBRTs7bUJBQTNELEtBQUM7O1FBRUosUUFBUSxLQUFDLEVBQUUsTUFBTTs7bUJBQVc7O1FBRTVCLFVBQVUsS0FBQztZQUVSLFFBQVEsV0FBVSxZQUFNLE1BQVMsT0FBTyxZQUFZLEtBQUssa0JBQWtCLE1BQU0sUUFBUTs7bUJBQ3JGLEtBQUMsY0FBYyxLQUFLLE1BQU0sTUFBTSxRQUFRLEdBQUcsS0FBSyxRQUFRLEdBQUc7O1lBRS9ELFNBQVE7O1lBQ1AsY0FBYztnQ0FDQTs7OztnQkFDVixNQUFNLEtBQUssMkJBQTJCLE1BQU07Z0JBQzVDLHNCQUFrQixZQUFZLElBQUksS0FBRyxJQUFJOzs7NEJBRXZDLFFBQVEsU0FBTyxTQUFHLHVCQUFBLFVBQUE7O1lBRXhCLFNBQVMsUUFBUTtzQkFFVDs7WUFFUixPQUFPLE1BQU07WUFFYixTQUFTO1lBQ1QsS0FBSztvQkFFRTs7cUJBRUg7b0JBQVMsT0FBTyxXQUFLLFVBQUksaUJBQUE7O3FCQUV6Qjt3QkFDTyxNQUFLOzs0QkFDRCxRQUFRLFdBQVU7O2dDQUNYLEtBQUs7Ozs7NEJBQ1gsS0FBSzs0QkFDTCxJQUFJLEtBQUssTUFBTSxNQUFNOzRCQUNyQixTQUFTOzRCQUNULE9BQU8sS0FBSyxLQUFLLE1BQU0sR0FBRzs0QkFDMUIsT0FBTyxLQUFLOzRCQUNaLE9BQU8sS0FBSzs7Ozs7NEJBRWI7O2dDQUNJLE1BQU0sS0FBSyxpQ0FBaUMsTUFBTTs7Z0NBQ2pELEtBQUssSUFBSSxLQUFLLElBQUk7Ozs7Z0NBRWxCLEtBQUs7Ozs7O2dDQUVOLGNBQWM7O2dDQUNiLEtBQUssSUFBSTtvQ0FDQyxPQUFNOztvQ0FBaEIsS0FBSzs7Z0NBQ0wsYUFBUyxZQUFZOzs7O2dDQUVyQixLQUFLOzs7NEJBRVYsS0FBSyxLQUFLLE1BQU07OzRCQUNmLE9BQU8sS0FBSyxhQUFhLEtBQUs7NEJBQzlCLE9BQU8sS0FBSyxLQUFLLFdBQUssR0FBSSxPQUFLLElBQUksV0FBSzs7OztxQkFFcEQ7d0JBQ08sTUFBSyxLQUFLLE1BQU0sTUFBTTs7NEJBQ2xCLFFBQVEsV0FBVTs7Z0NBQ1gsS0FBSyxNQUFNLFNBQU87Ozs7NEJBQ3hCLElBQUksS0FBSyxNQUFNLE1BQU07NEJBQ3JCLFNBQVM7NEJBQ1QsT0FBTyxLQUFLLEtBQUssS0FBSyxNQUFNLElBQUU7NEJBQzlCLE9BQU8sS0FBSzs0QkFDWixPQUFPLEtBQUs7Ozs7OzRCQUViOztnQ0FDSSxNQUFNLEtBQUssa0NBQWtDLE1BQU07O2dDQUNsRCxLQUFLLElBQUksS0FBSyxJQUFJO2dDQUNsQixPQUFPLEtBQUssS0FBSyxXQUFLLFVBQUksaUJBQUEsUUFBRyxXQUFLLElBQUU7Ozs7OzRCQUV4QyxLQUFLOzRCQUNMLE9BQU8sS0FBSyxLQUFLLFdBQUssVUFBSSxpQkFBQSxRQUFHLFdBQUssSUFBRTs7d0JBQ3hDLE9BQU8sTUFBTTs7Ozs7WUFFekIsS0FBSyx3QkFBd0IsUUFBUSxRQUFRO1lBRTdDLE1BQU0sT0FBTyxFQUFFLE9BQU87O1FBRTFCLEtBQUM7UUFDRCxLQUFDLFNBQVc7ZUFDWixLQUFDLFdBQVc7O0lBUWhCOztZQUVVLEtBQUssZ0JBQWdCOzs7O2VBRTNCLEtBQUMsYUFBYSxLQUFDLGdCQUFnQixLQUFDOztJQUVwQzs7OztzQkFFZ0I7Ozs7UUFFWixRQUFBLGVBQUEsT0FBUSxLQUFDO2FBRVcsS0FBQzs7WUFBckIsS0FBQzs7a0JBRWlCLEtBQUssbUNBQW1DLEtBQUMsRUFBRSxNQUFNLEtBQUs7O1FBRXhFLEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQyxTQUFXO2VBQ1osS0FBQyxXQUFXIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/del.kode
