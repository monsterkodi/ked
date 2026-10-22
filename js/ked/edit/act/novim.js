var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import belt from "../tool/belt.js"
import motion from "../tool/motion.js"

export default {
    executeNovim:function (cmd)
    {
        console.log('novim command ▸',cmd)
        switch (cmd.operator)
        {
            case 'delete':
                return this.deleteByMotion(cmd.motion)
    
            default:
                console.log('novim unknown operator ▸',cmd.operator)
        }
    
    },
    deleteByMotion:function (spec)
    {
        var cursor, lines, rng, rngs
    
        lines = this.s.lines
        rngs = []
        var list = _k_.list(this.allCursors())
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cursor = list[_a_]
            rng = motion.range(lines,cursor,spec)
            if (!rng)
            {
                continue
            }
            if (belt.isEmptyRange(rng) && !motion.isLinewise(spec))
            {
                continue
            }
            rngs.push(rng)
        }
        console.log('novim ranges ▸',rngs)
        if (_k_.empty(rngs))
        {
            return
        }
        rngs = motion.mergeRanges(rngs)
        this.begin()
        this.deleteRanges(rngs,this.allCursors(),motion.isLinewise(spec))
        return this.end()
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L25vdmltLmtvZGUiXSwibWFwcGluZ3MiOiI7O09BV2MsV0FBUDtPQUFZLGFBQVo7OztJQUlILHVCQUFjOztRQUVWLFlBQUksa0JBQWtCO2dCQUVmLElBQUk7O2lCQUNQO3VCQUFXLEtBQUMsZUFBZSxJQUFJOzs7Z0JBQ3BCLFlBQUksMkJBQTJCLElBQUk7Ozs7SUFFdEQseUJBQWdCOzs7O1FBRVosUUFBUSxLQUFDLEVBQUU7UUFDWDs0QkFFYyxLQUFDOzs7WUFBWDtZQUVBLE1BQU0sT0FBTyxNQUFNLE1BQU0sT0FBTztpQkFDaEI7O2dCQUFoQjs7Z0JBSVksS0FBSyxhQUFhLFNBQWEsT0FBTyxXQUFXOztnQkFBN0Q7O1lBRUEsS0FBSyxLQUFLOztRQUVkLFlBQUksaUJBQWlCO3NCQUVUOzs7O1FBR1osT0FBTyxPQUFPLFlBQVk7UUFFMUIsS0FBQztRQUVELEtBQUMsYUFBYSxLQUFLLEtBQUMsYUFBYSxPQUFPLFdBQVc7ZUFFbkQsS0FBQyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/novim.kode
