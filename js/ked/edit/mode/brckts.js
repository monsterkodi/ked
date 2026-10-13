var _k_ = {eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var brckts

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let kutil = kxk.kutil

import belt from "../tool/belt.js"

import mode from "../mode.js"


brckts = (function ()
{
    brckts["autoStart"] = true
    brckts["surround"] = {'#':['#{','}'],'{':['{','}'],'}':['{','}'],'[':['[',']'],']':['[',']'],'(':['(',')'],')':['(',')'],"'":["'","'"],'"':['"','"']}
    function brckts (state)
    {
        this.state = state
    
        this["handleKey"] = this["handleKey"].bind(this)
        this["conditionalSwapStringDelimiters"] = this["conditionalSwapStringDelimiters"].bind(this)
        this["swapStringDelimiters"] = this["swapStringDelimiters"].bind(this)
        this.name = 'brckts'
    }

    brckts.prototype["cursorsSet"] = function ()
    {
        var openClose, spans, strings

        if (this.state.s.selections.length)
        {
            if (_k_.eql(this.allSpans, this.state.s.highlights))
            {
                this.state.setHighlights([])
            }
            return
        }
        if (this.state.s.highlights.length)
        {
            if (_k_.eql(!this.allSpans, this.state.s.highlights.asMutable()))
            {
                return
            }
        }
        var _a_ = belt.spansOfNestedPairsAtPositions(this.state.s.lines,this.state.s.cursors); spans = _a_[0]; openClose = _a_[1]; strings = _a_[2]

        if (_k_.empty(spans))
        {
            this.openCloseSpans = belt.openCloseSpansForPositions(this.state.s.lines,this.state.s.cursors)
            this.stringDelimiterSpans = belt.stringDelimiterSpansForPositions(this.state.s.cursors)
            spans = this.openCloseSpans.concat(this.stringDelimiterSpans)
        }
        else
        {
            this.openCloseSpans = openClose
            this.stringDelimiterSpans = strings
        }
        this.state.setHighlights(spans)
        return this.allSpans = this.state.s.highlights.asMutable()
    }

    brckts.prototype["swapStringDelimiters"] = function ()
    {
        var cursors, selections

        this.state.begin()
        this.state.pushState()
        cursors = this.state.allCursors()
        selections = this.state.allSelections()
        this.state.setSelections(belt.rangesForSpans(this.stringDelimiterSpans))
        this.state.moveCursorsToEndOfSelections()
        if (this.state.textOfSelection().startsWith('"'))
        {
            this.state.insert("'")
        }
        else
        {
            this.state.insert('"')
        }
        this.state.setCursors(cursors)
        this.state.setSelections(selections)
        return this.state.end()
    }

    brckts.prototype["conditionalSwapStringDelimiters"] = function ()
    {
        if (!this.stringDelimiterSpans)
        {
            return
        }
        if (belt.textForSpans(this.state.s.lines,this.stringDelimiterSpans).startsWith("'"))
        {
            return this.swapStringDelimiters()
        }
    }

    brckts.prototype["handleKey"] = function (key, event)
    {
        var delrngs, nsegl, nsegs, pairs, pos, rngs, seg

        switch (key)
        {
            case "alt+cmd+'":
                if (!_k_.empty(this.stringDelimiterSpans))
                {
                    this.swapStringDelimiters()
                    return
                }
                break
            case 'alt+cmd+b':
                if (!_k_.empty(this.stringDelimiterSpans))
                {
                    this.state.setSelections(belt.rangesForSpans(this.stringDelimiterSpans))
                    this.state.moveCursorsToEndOfSelections()
                    return
                }
                if (!_k_.empty(this.openCloseSpans))
                {
                    this.state.setSelections(belt.rangesForSpans(this.openCloseSpans))
                    this.state.moveCursorsToEndOfSelections()
                    return
                }
                break
            case 'delete':
                if (_k_.empty(this.state.s.selections))
                {
                    pairs = kutil.uniq(Object.values(brckts.surround))
                    if (!_k_.empty((rngs = belt.rangesOfPairsSurroundingPositions(this.state.s.lines,pairs,this.state.s.cursors))))
                    {
                        this.state.setSelections(rngs)
                        this.state.deleteSelection()
                        return
                    }
                }
                break
        }

        if (_k_.empty(brckts.surround[event.char]))
        {
            return 'unhandled'
        }
        if (event.char === '#')
        {
            if (!_k_.empty(belt.positionsAndRangesOutsideStrings(this.state.s.lines,this.state.s.selections,this.state.s.cursors)))
            {
                return 'unhandled'
            }
            this.conditionalSwapStringDelimiters()
            this.state.begin()
            if (!_k_.empty(this.state.s.selections))
            {
                this.state.surroundSelection(event.char,brckts.surround[event.char])
            }
            else
            {
                this.state.insert(brckts.surround[event.char][0] + brckts.surround[event.char][1])
                this.state.moveCursors('left')
            }
            this.state.end()
            return
        }
        else
        {
            if (!_k_.empty(this.state.s.selections))
            {
                if (!_k_.empty(this.stringDelimiterSpans))
                {
                    delrngs = belt.normalizeRanges(belt.rangesForSpans(this.stringDelimiterSpans))
                    if (_k_.eql(delrngs, this.state.s.selections))
                    {
                        return 'unhandled'
                    }
                }
                return this.state.surroundSelection(event.char,brckts.surround[event.char])
            }
            nsegl = belt.segsForPositions(this.state.s.lines,this.state.s.cursors)
            nsegs = kutil.uniq(nsegl)
            var list = _k_.list(nsegs)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                seg = list[_a_]
                if (brckts.surround[event.char][1] === event.char)
                {
                    if (seg === event.char)
                    {
                        this.state.moveCursors('right')
                        return
                    }
                }
                if (!(_k_.in(seg,['',undefined,' ','}',']',')'])))
                {
                    return "unhandled"
                }
            }
            var list1 = _k_.list(this.state.s.cursors)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                pos = list1[_b_]
                if (belt.isUnbalancedPosition(this.state.s.lines,pos,event.char))
                {
                    return "unhandled"
                }
            }
            this.state.insert(brckts.surround[event.char][0] + brckts.surround[event.char][1])
            this.state.moveCursors('left')
            return
        }
        return 'unhandled'
    }

    return brckts
})()

export default brckts;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJja3RzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L21vZGUvYnJja3RzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OzswQkFjZ0I7MEJBR1IsS0FBTSxLQUFLLEtBQ1gsS0FBTSxJQUFJLEtBQ1YsS0FBTSxJQUFJLEtBQ1YsS0FBTSxJQUFJLEtBQ1YsS0FBTSxJQUFJLEtBQ1YsS0FBTSxJQUFJLEtBQ1YsS0FBTSxJQUFJLEtBQ1YsS0FBTSxJQUFJLEtBQ1YsS0FBTSxJQUFJOzs7Ozs7OztRQU9WLEtBQUMsT0FBTzs7Ozs7OztZQVdMLEtBQUMsTUFBTSxFQUFFLFdBQVc7O3dCQUNoQixLQUFDLFVBQWEsS0FBQyxNQUFNLEVBQUU7O2dCQUN0QixLQUFDLE1BQU07Ozs7WUFHWixLQUFDLE1BQU0sRUFBRSxXQUFXOzt5QkFDVCxLQUFDLFVBQWEsS0FBQyxNQUFNLEVBQUUsV0FBVzs7Ozs7a0JBRXBCLEtBQUssOEJBQThCLEtBQUMsTUFBTSxFQUFFLE1BQU0sS0FBQyxNQUFNLEVBQUU7O3NCQUU5RTs7WUFDTCxLQUFDLGlCQUF1QixLQUFLLDJCQUEyQixLQUFDLE1BQU0sRUFBRSxNQUFNLEtBQUMsTUFBTSxFQUFFO1lBQ2hGLEtBQUMsdUJBQXVCLEtBQUssaUNBQTBDLEtBQUMsTUFBTSxFQUFFO1lBQ2hGLFFBQVEsS0FBQyxlQUFlLE9BQU8sS0FBQzs7OztZQUVoQyxLQUFDLGlCQUF1QjtZQUN4QixLQUFDLHVCQUF1Qjs7UUFFNUIsS0FBQyxNQUFNLGNBQWM7ZUFFckIsS0FBQyxXQUFXLEtBQUMsTUFBTSxFQUFFLFdBQVc7Ozs7Ozs7UUFVaEMsS0FBQyxNQUFNO1FBQ1AsS0FBQyxNQUFNO1FBQ1AsVUFBVSxLQUFDLE1BQU07UUFDakIsYUFBYSxLQUFDLE1BQU07UUFDcEIsS0FBQyxNQUFNLGNBQWMsS0FBSyxlQUFlLEtBQUM7UUFDMUMsS0FBQyxNQUFNO1lBQ0osS0FBQyxNQUFNLGtCQUFrQixXQUFXOztZQUNuQyxLQUFDLE1BQU0sT0FBTzs7OztZQUVkLEtBQUMsTUFBTSxPQUFPOztRQUNsQixLQUFDLE1BQU0sV0FBVztRQUNsQixLQUFDLE1BQU0sY0FBYztlQUNyQixLQUFDLE1BQU07Ozs7O2FBSUcsS0FBQzs7OztZQUNSLEtBQUssYUFBYSxLQUFDLE1BQU0sRUFBRSxNQUFNLEtBQUMsc0JBQXNCLFdBQVc7O21CQUNsRSxLQUFDOzs7Ozs7OztnQkFVRTs7aUJBRUg7K0JBQ2EsS0FBQzs7b0JBQ04sS0FBQzs7OztpQkFHVDsrQkFFYSxLQUFDOztvQkFDTixLQUFDLE1BQU0sY0FBYyxLQUFLLGVBQWUsS0FBQztvQkFDMUMsS0FBQyxNQUFNOzs7K0JBR0YsS0FBQzs7b0JBQ04sS0FBQyxNQUFNLGNBQWMsS0FBSyxlQUFlLEtBQUM7b0JBQzFDLEtBQUMsTUFBTTs7OztpQkFHZjs4QkFFYSxLQUFDLE1BQU0sRUFBRTs7b0JBQ2QsUUFBUSxNQUFNLEtBQUssT0FBTyxPQUFPLE9BQU87b0NBQzlCLE9BQU8sS0FBSyxrQ0FBa0MsS0FBQyxNQUFNLEVBQUUsTUFBTSxNQUFNLEtBQUMsTUFBTSxFQUFFOzt3QkFDbEYsS0FBQyxNQUFNLGNBQWM7d0JBQ3JCLEtBQUMsTUFBTTs7Ozs7OztzQkFHQyxPQUFPLFNBQVMsTUFBTTs7bUJBQTNDOztZQUVBLE1BQU0sU0FBUTs7MkJBRVcsS0FBSyxpQ0FBaUMsS0FBQyxNQUFNLEVBQUUsTUFBTSxLQUFDLE1BQU0sRUFBRSxXQUFXLEtBQUMsTUFBTSxFQUFFOzt1QkFBdkc7O1lBRUgsS0FBQztZQUVELEtBQUMsTUFBTTsyQkFFRSxLQUFDLE1BQU0sRUFBRTs7Z0JBQ2QsS0FBQyxNQUFNLGtCQUFrQixNQUFNLEtBQUssT0FBTyxTQUFTLE1BQU07Ozs7Z0JBRTFELEtBQUMsTUFBTSxPQUFPLE9BQU8sU0FBUyxNQUFNLE1BQU0sS0FBRyxPQUFPLFNBQVMsTUFBTSxNQUFNO2dCQUN6RSxLQUFDLE1BQU0sWUFBWTs7WUFFdkIsS0FBQyxNQUFNOzs7OzsyQkFNRSxLQUFDLE1BQU0sRUFBRTs7K0JBRUwsS0FBQzs7b0JBQ04sVUFBVSxLQUFLLGdCQUFnQixLQUFLLGVBQWUsS0FBQztnQ0FDakQsU0FBWSxLQUFDLE1BQU0sRUFBRTs7K0JBQ2pCOzs7dUJBRVIsS0FBQyxNQUFNLGtCQUFrQixNQUFNLEtBQUssT0FBTyxTQUFTLE1BQU07O1lBRWpFLFFBQVEsS0FBSyxpQkFBaUIsS0FBQyxNQUFNLEVBQUUsTUFBTSxLQUFDLE1BQU0sRUFBRTtZQUN0RCxRQUFRLE1BQU0sS0FBSztnQ0FFUjs7OztvQkFFSixPQUFPLFNBQVMsTUFBTSxNQUFNLE9BQU0sTUFBTTs7d0JBQ3BDLFFBQU8sTUFBTTs7d0JBQ1osS0FBQyxNQUFNLFlBQVk7Ozs7NkJBR3hCLEtBQVksR0FBRyxVQUFVLElBQUksSUFBSSxJQUFJOzsyQkFDakM7OztpQ0FFQSxLQUFDLE1BQU0sRUFBRTs7OztvQkFDYixLQUFLLHFCQUFxQixLQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksTUFBTTs7MkJBQy9DOzs7WUFFWCxLQUFDLE1BQU0sT0FBTyxPQUFPLFNBQVMsTUFBTSxNQUFNLEtBQUcsT0FBTyxTQUFTLE1BQU0sTUFBTTtZQUN6RSxLQUFDLE1BQU0sWUFBWTs7O2VBR3ZCOzs7Ozs7ZUFFRCJ9
//# sourceURL=file://kode/ked/edit/mode/brckts.kode
