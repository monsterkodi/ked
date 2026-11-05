var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var index_noon

import kxk from "../../kxk.js"
let kstr = kxk.kstr


index_noon = (function ()
{
    function index_noon ()
    {}

    index_noon.prototype["parseLine"] = function (index, line)
    {
        var name, words

        if (_k_.empty(line))
        {
            return
        }
        if (_k_.in(line[0],[' ','\t']))
        {
            return
        }
        if (line[0] === '#')
        {
            return
        }
        words = line.split(/\s+/)
        name = words[0]
        if (_k_.empty(name))
        {
            return
        }
        return this.result.funcs.push({name:name,line:index})
    }

    index_noon.prototype["parse"] = function (text)
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

    return index_noon
})()

export default index_noon;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfbm9vbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvaW5kZXgvaW5kZXhfbm9vbi5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNOzs7QUFFZixjQUFEOzs7OzswQkFFSSx3QkFBVyxPQUFNOzs7O3NCQUVGOzs7O21CQUNOLEtBQUssSUFBTyxJQUFJOzs7O1lBQ2hCLEtBQUssT0FBTTs7OztRQUVoQixRQUFRLEtBQUssTUFBTTtRQUNuQixPQUFPLE1BQU07c0JBQ0Y7Ozs7ZUFFWCxLQUFDLE9BQU8sTUFBTSxNQUFLLEtBQUssS0FBSyxLQUFLOzs7MEJBRXRDLG9CQUFPOzs7O1FBRUgsUUFBUSxLQUFLLE1BQU07UUFFbkIsS0FBQyxVQUFTLFdBQVcsU0FBUyxNQUFNLE1BQU07NEJBRXhCO2FBQVQ7O1lBQUw7WUFDQSxLQUFDLFVBQVUsTUFBTTs7ZUFFckIsS0FBQzs7O1dBdkJSOzs7ZUF5Qk0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_noon.kode
