var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var replex

import kxk from "../../../kxk.js"
let kseg = kxk.kseg
let kutil = kxk.kutil

import belt from "../tool/belt.js"

import mode from "../mode.js"
import specs from "../specs.js"


replex = (function ()
{
    replex["autoStart"] = true
    function replex (state)
    {
        this.state = state
    
        this.name = 'replex'
    }

    replex.prototype["postInsert"] = function ()
    {
        var chunk, chunks, end, repl, repls

        chunks = this.state.chunksBeforeCursors()
        repls = []
        var list = _k_.list(chunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            chunk = list[_a_]
            end = chunk.slice(-2)
            if (repl = specs.replex[end])
            {
                repls.push(repl)
            }
        }
        if (repls.length === this.state.s.cursors.length)
        {
            this.state.delete('back')
            this.state.delete('back')
            return this.state.insert(repls.join('\n'))
        }
    }

    return replex
})()

export default replex;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGV4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L21vZGUvcmVwbGV4LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBWWdCOzs7OztRQUlSLEtBQUMsT0FBTzs7Ozs7OztRQVVSLFNBQVMsS0FBQyxNQUFNO1FBQ2hCOzRCQUVhOzs7O1lBQ1QsTUFBTSxZQUFNO2dCQUNULE9BQU8sTUFBTSxPQUFPOztnQkFDbkIsTUFBTSxLQUFLOzs7WUFHaEIsTUFBTSxXQUFVLEtBQUMsTUFBTSxFQUFFLFFBQVE7O1lBQ2hDLEtBQUMsTUFBTSxPQUFPO1lBQ2QsS0FBQyxNQUFNLE9BQU87bUJBQ2QsS0FBQyxNQUFNLE9BQU8sTUFBTSxLQUFLOzs7Ozs7O2VBRTlCIn0=
//# sourceURL=file://kode/ked/edit/mode/replex.kode
