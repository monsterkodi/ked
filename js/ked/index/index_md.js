var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var index_md

import kxk from "../../kxk.js"
let kstr = kxk.kstr


index_md = (function ()
{
    function index_md ()
    {}

    index_md.prototype["parseLine"] = function (index, line)
    {
        var m

        if (_k_.empty(line))
        {
            return
        }
        if (line[0] === '#')
        {
            m = line.match(/^(\#+)(.+)/)
            if (((m != null ? m[0] : undefined) != null))
            {
                return this.result.funcs.push({name:m[2],line:index,md:`h${m[1].length}`})
            }
        }
    }

    index_md.prototype["parse"] = function (text)
    {
        var index, line, lines

        lines = kstr.lines(text)
        this.result = {classes:[],funcs:[],lines:lines.length}
        var list = _k_.list(lines)
        for (index = 0; index < list.length; index++)
        {
            line = list[index]
            this.parseLine(index,line)
        }
        return this.result
    }

    return index_md
})()

export default index_md;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfbWQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2luZGV4L2luZGV4X21kLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQU07OztBQUNmLFlBQUQ7Ozs7O3dCQUNJLHdCQUFXLE9BQU07Ozs7c0JBRUY7Ozs7WUFFUixLQUFLLE9BQU07O1lBQ1YsSUFBSSxLQUFLLE1BQU07a0JBQ1osWUFBQSxFQUFHOzt1QkFDRixLQUFDLE9BQU8sTUFBTSxNQUFLLEtBQUssRUFBRSxHQUFHLEtBQUssTUFBTSxPQUFPLEVBQUUsR0FBRzs7Ozs7d0JBRWhFLG9CQUFPOzs7O1FBRUgsUUFBUSxLQUFLLE1BQU07UUFFbkIsS0FBQyxVQUFTLFdBQVcsU0FBUyxNQUFNLE1BQU07NEJBRXhCO2FBQVQ7O1lBQUw7WUFDQSxLQUFDLFVBQVUsTUFBTTs7ZUFFckIsS0FBQzs7O1dBbkJSOzs7ZUFxQk0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_md.kode
