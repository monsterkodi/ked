var _k_ = {lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

import belt from "../tool/belt.js"

export default {
    countSelectionsOrCursorLines:function (start = 0, step = 1)
    {
        var cursors, i, len, lines, nums, ranges, text
    
        ranges = this.selectionsOrCursorLineRanges()
        len = `${start + (ranges.length - 1) * step}`.length
        nums = []
        for (var _a_ = i = 0, _b_ = ranges.length; (_a_ <= _b_ ? i < ranges.length : i > ranges.length); (_a_ <= _b_ ? ++i : --i))
        {
            nums.push(_k_.lpad(len,`${start + i * step}`,'0'))
        }
        text = nums.join('\n')
        ;[lines,cursors] = belt.insertTextAtPositions(this.s.lines,text,this.s.cursors)
        this.setLines(lines)
        this.setSelections([])
        return this.setCursors(cursors)
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvYWN0L2NvdW50LmtvZGUiXSwibWFwcGluZ3MiOiI7O09BQ2MsV0FBUDs7O0lBSUgsdUNBQThCLFFBQU0sR0FBRSxPQUFLOzs7O1FBRXZDLFNBQVMsS0FBQztRQUVWLFNBQVMsU0FBUyxPQUFPLFNBQU8sS0FBSyxPQUFPO1FBQzVDO3VCQUNJLElBQUssU0FBSSxPQUFPLDBCQUFQLE9BQU8sYUFBUCxPQUFPOztZQUNoQixLQUFLLGNBQVUsT0FBTyxRQUFRLElBQUksT0FBTzs7UUFFN0MsT0FBTyxLQUFLLEtBQUs7VUFFaEIsTUFBTSxXQUFXLEtBQUssc0JBQXNCLEtBQUMsRUFBRSxNQUFNLEtBQUssS0FBQyxFQUFFO1FBRTlELEtBQUMsU0FBUztRQUNWLEtBQUM7ZUFDRCxLQUFDLFdBQVcifQ==
//# sourceURL=../../../../kode/ked/edit/act/count.kode
