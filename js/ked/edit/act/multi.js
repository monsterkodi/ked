var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import belt from "../tool/belt.js"

export default {
    allCursors:function ()
    {
        return this.s.cursors.asMutable()
    },
    expandCursors:function (dir)
    {
        var c, cursors, dy, mc, newCursors
    
        cursors = this.allCursors()
        dy = (dir === 'up' ? -1 : 1)
        newCursors = []
        var list = _k_.list(cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            newCursors.push(c)
            newCursors.push([c[0],c[1] + dy])
        }
        mc = belt.traversePositionsInDirection(newCursors,this.mainCursor(),dir)
        return this.setCursors(newCursors,{main:mc,adjust:'topBotDelta'})
    },
    contractCursors:function (dir)
    {
        var add, c, cursors, nbdn, nbup, newCursors, solo
    
        cursors = this.allCursors()
        newCursors = []
        var list = _k_.list(cursors)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            c = list[_b_]
            nbup = belt.positionsContain(cursors,belt.positionInDirection(c,'down'))
            nbdn = belt.positionsContain(cursors,belt.positionInDirection(c,'up'))
            solo = !(nbup || nbdn)
            add = ((function ()
            {
                switch (dir)
                {
                    case 'up':
                        return nbup || solo
    
                    case 'down':
                        return nbdn || solo
    
                }
    
            }).bind(this))()
            if (add)
            {
                newCursors.push(c)
            }
        }
        return this.setCursors(newCursors)
    },
    addCursor:function (x, y)
    {
        var cursors, pos
    
        pos = belt.pos(x,y)
        cursors = this.allCursors()
        cursors.push(pos)
        return this.setCursors(cursors,{main:-1})
    },
    addCursors:function (cursors)
    {
        return this.setCursors(this.allCursors().concat(cursors))
    },
    delCursorsInRange:function (rng)
    {
        var outside
    
        outside = belt.positionsOutsideRange(this.allCursors(),rng)
        outside.push(belt.endOfRange(rng))
        return this.setCursors(outside,{main:-1})
    },
    moveCursors:function (dir, opt)
    {
        var adjust, c, cursors, ind, line, lines, main, _100_22_, _126_28_, _99_18_
    
        if (_k_.isArr(dir))
        {
            switch (dir[0])
            {
                case 'bos':
                    if (this.moveCursorsToStartOfSelections())
                    {
                        return
                    }
                    dir = dir.slice(1)
                    break
                case 'eos':
                    if (this.moveCursorsToEndOfSelections())
                    {
                        return
                    }
                    dir = dir.slice(1)
                    break
            }
    
            dir = dir[0]
        }
        opt = (opt != null ? opt : {})
        opt.count = ((_99_18_=opt.count) != null ? _99_18_ : 1)
        opt.jumpWords = ((_100_22_=opt.jumpWords) != null ? _100_22_ : false)
        if (this.s.highlights.length)
        {
            this.deselect()
        }
        cursors = this.allCursors()
        lines = this.s.lines
        var list = _k_.list(cursors)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            c = list[_c_]
            line = lines[c[1]]
            switch (dir)
            {
                case 'left':
                case 'right':
                    c[0] += belt.numCharsFromPosToWordOrPunctInDirection(lines,c,dir,opt)
                    break
                case 'up':
                    c[1] -= opt.count
                    break
                case 'down':
                    c[1] += opt.count
                    break
                case 'eol':
                    c[0] = kseg.width(this.s.lines[c[1]])
                    break
                case 'bol':
                    c[0] = 0
                    break
                case 'bof':
                    c[0] = 0
                    c[1] = 0
                    break
                case 'eof':
                    c[1] = this.s.lines.length - 1
                    c[0] = kseg.width(line)
                    break
                case 'ind':
                    c[0] = belt.numIndent(line)
                    break
                case 'ind_eol':
                    ind = belt.numIndent(line)
                    c[0] = (c[0] < ind ? ind : kseg.width(line))
                    break
                case 'ind_bol':
                    ind = belt.numIndent(line)
                    c[0] = (c[0] > ind ? ind : 0)
                    break
            }
    
        }
        main = this.s.main
        adjust = ((_126_28_=opt.adjust) != null ? _126_28_ : 'topBotDelta')
        switch (dir)
        {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                main = belt.indexOfExtremePositionInDirection(cursors,dir,main)
                adjust = 'topBotDeltaGrow'
                break
        }
    
        this.setCursors(cursors,{main:main,adjust:adjust})
        return true
    },
    moveCursorsToStartOfSelections:function ()
    {
        var rngs, selections
    
        selections = this.allSelections()
        if (_k_.empty(selections))
        {
            return
        }
        rngs = belt.splitLineRanges(this.s.lines,selections,false)
        this.setCursors(belt.startPositionsOfRanges(rngs))
        return true
    },
    moveCursorsToEndOfSelections:function ()
    {
        var rngs, selections
    
        selections = this.allSelections()
        if (_k_.empty(selections))
        {
            return
        }
        rngs = belt.splitLineRanges(this.s.lines,selections,false)
        this.setCursors(belt.endPositionsOfRanges(rngs))
        return true
    },
    moveCursorsToEndOfLines:function ()
    {
        var cur, cursors
    
        cursors = this.allCursors()
        var list = _k_.list(cursors)
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            cur = list[_d_]
            cur[0] = belt.lineRangeAtPos(this.s.lines,cur)[2]
        }
        this.setCursors(cursors)
        return true
    },
    isAnyCursorInLine:function (y)
    {
        var c
    
        var list = _k_.list(this.allCursors())
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            c = list[_e_]
            if (c[1] === y)
            {
                return true
            }
        }
    },
    chunksBeforeCursors:function ()
    {
        return this.s.cursors.map((function (c)
        {
            return belt.chunkBeforePos(this.s.lines,c)
        }).bind(this))
    },
    moveCursorsAndSelect:function (dir, opt)
    {
        var cursors, selections
    
        var _f_ = belt.extendLineRangesByMovingPositionsInDirection(this.s.lines,this.s.selections,this.s.cursors,dir,opt); selections = _f_[0]; cursors = _f_[1]
    
        this.setSelections(selections)
        return this.setCursors(cursors,{adjust:'topBotDelta'})
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L211bHRpLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBbUJJOztlQUFlLEtBQUMsRUFBRSxRQUFROztJQVExQjs7OztRQUVJLFVBQVUsS0FBQztRQUVYLE1BQUssUUFBTyxPQUFPLEtBQUs7UUFFeEI7NEJBQ1M7Ozs7WUFDTCxXQUFXLEtBQUs7WUFDaEIsV0FBVyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUc7O1FBRS9CLEtBQUssS0FBSyw2QkFBNkIsV0FBVyxLQUFDLGFBQWE7ZUFDaEUsS0FBQyxXQUFXLFlBQVcsS0FBSyxHQUFHLE9BQU87O0lBRTFDOzs7O1FBRUksVUFBVSxLQUFDO1FBRVg7NEJBQ1M7Ozs7WUFDTCxPQUFPLEtBQUssaUJBQWlCLFFBQVEsS0FBSyxvQkFBb0IsRUFBRTtZQUNoRSxPQUFPLEtBQUssaUJBQWlCLFFBQVEsS0FBSyxvQkFBb0IsRUFBRTtZQUNoRSxTQUFZLFFBQVE7WUFDcEI7O3dCQUFhOzt5QkFDVDsrQkFBUyxRQUFROzt5QkFDakI7K0JBQVMsUUFBUTs7Ozs7Z0JBRUE7O2dCQUFyQixXQUFXLEtBQUs7OztlQUVwQixLQUFDLFdBQVc7O0lBUWhCOzs7O1FBRUksTUFBTSxLQUFLLElBQUksRUFBRTtRQUNqQixVQUFVLEtBQUM7UUFDWCxRQUFRLEtBQUs7ZUFDYixLQUFDLFdBQVcsU0FBUSxLQUFLOztJQUU3Qjs7ZUFFSSxLQUFDLFdBQVcsS0FBQyxhQUFhLE9BQU87O0lBRXJDOzs7O1FBRUksVUFBVSxLQUFLLHNCQUFzQixLQUFDLGFBQWE7UUFDbkQsUUFBUSxLQUFLLEtBQUssV0FBVztlQUM3QixLQUFDLFdBQVcsU0FBUSxLQUFLOztJQVE3Qjs7OztzQkFFTzs7b0JBRVEsSUFBSTs7cUJBQ1A7d0JBQWMsS0FBQzs7OztvQkFBa0MsTUFBTSxVQUFJOztxQkFDM0Q7d0JBQWMsS0FBQzs7OztvQkFBa0MsTUFBTSxVQUFJOzs7O1lBRS9ELE1BQU0sSUFBSTs7UUFFZCxPQUFBLGNBQUE7UUFDQSxJQUFJLGtCQUFKLElBQUksMkJBQVM7UUFDYixJQUFJLHVCQUFKLElBQUksZ0NBQWE7WUFFZCxLQUFDLEVBQUUsV0FBVzs7WUFDYixLQUFDOztRQUVMLFVBQVUsS0FBQztRQUNYLFFBQVUsS0FBQyxFQUFFOzRCQUVKOzs7O1lBRUwsT0FBTyxNQUFNLEVBQUU7b0JBRVI7O3FCQUNIO3FCQUNBO29CQUFjLEVBQUUsTUFBTSxLQUFLLHdDQUF3QyxNQUFNLEVBQUUsSUFBSTs7cUJBQy9FO29CQUFjLEVBQUUsTUFBTSxJQUFJOztxQkFDMUI7b0JBQWMsRUFBRSxNQUFNLElBQUk7O3FCQUMxQjtvQkFBYyxFQUFFLEtBQUssS0FBSyxNQUFNLEtBQUMsRUFBRSxNQUFNLEVBQUU7O3FCQUMzQztvQkFBYyxFQUFFLEtBQUs7O3FCQUNyQjtvQkFBYyxFQUFFLEtBQUs7b0JBQUcsRUFBRSxLQUFLOztxQkFDL0I7b0JBQWMsRUFBRSxLQUFLLEtBQUMsRUFBRSxNQUFNLFNBQU87b0JBQUcsRUFBRSxLQUFLLEtBQUssTUFBTTs7cUJBQzFEO29CQUFjLEVBQUUsS0FBSyxLQUFLLFVBQVU7O3FCQUNwQztvQkFBYyxNQUFPLEtBQUssVUFBVTtvQkFBTyxFQUFFLE1BQUssRUFBRSxLQUFLLE1BQU0sTUFBTSxLQUFLLE1BQU07O3FCQUNoRjtvQkFBYyxNQUFPLEtBQUssVUFBVTtvQkFBTyxFQUFFLE1BQUssRUFBRSxLQUFLLE1BQU0sTUFBTTs7Ozs7UUFFN0UsT0FBUyxLQUFDLEVBQUU7UUFDWixvQkFBUyxJQUFJLDZCQUFTO2dCQUVmOztpQkFDSDtpQkFBSztpQkFBTztpQkFBTztnQkFDZixPQUFPLEtBQUssa0NBQWtDLFFBQVEsSUFBSTtnQkFDMUQsU0FBUzs7OztRQUVqQixLQUFDLFdBQVcsU0FBUSxLQUFLLEtBQUssT0FBTztlQUVyQzs7SUFFSjs7OztRQUVJLGFBQWEsS0FBQztzQkFFRjs7OztRQUVaLE9BQU8sS0FBSyxnQkFBZ0IsS0FBQyxFQUFFLE1BQU0sV0FBVztRQUVoRCxLQUFDLFdBQVcsS0FBSyx1QkFBdUI7ZUFFeEM7O0lBRUo7Ozs7UUFFSSxhQUFhLEtBQUM7c0JBRUY7Ozs7UUFFWixPQUFPLEtBQUssZ0JBQWdCLEtBQUMsRUFBRSxNQUFNLFdBQVc7UUFFaEQsS0FBQyxXQUFXLEtBQUsscUJBQXFCO2VBRXRDOztJQUVKOzs7O1FBRUksVUFBVSxLQUFDOzRCQUVBOzs7O1lBQ1AsSUFBSSxLQUFLLEtBQUssZUFBZSxLQUFDLEVBQUUsTUFBTSxLQUFLOztRQUUvQyxLQUFDLFdBQVc7ZUFFWjs7SUFFSjs7Ozs0QkFFYSxLQUFDOzs7O2dCQUNLLEVBQUUsT0FBTTs7dUJBQWhCOzs7O0lBUVg7O2VBQXdCLEtBQUMsRUFBRSxRQUFROzttQkFBVyxLQUFLLGVBQWUsS0FBQyxFQUFFLE1BQU07OztJQVEzRTs7OztrQkFFMkIsS0FBSyw2Q0FBNkMsS0FBQyxFQUFFLE1BQU0sS0FBQyxFQUFFLFdBQVcsS0FBQyxFQUFFLFFBQVEsSUFBSTs7UUFFL0csS0FBQyxjQUFjO2VBQ2YsS0FBQyxXQUFXLFNBQVEsT0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/multi.kode
