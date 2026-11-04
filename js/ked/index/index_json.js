var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var index_json

import kxk from "../../kxk.js"
let kstr = kxk.kstr


index_json = (function ()
{
    function index_json ()
    {}

    index_json.prototype["parseLine"] = function (index, line)
    {
        var ch, escaped, i, inString, j, name, stringStart

        inString = false
        escaped = false
        stringStart = 0
        i = 0
        while (i < line.length)
        {
            ch = line[i]
            if (inString)
            {
                if (escaped)
                {
                    escaped = false
                }
                else if (ch === '\\')
                {
                    escaped = true
                }
                else if (ch === '"')
                {
                    inString = false
                    j = i + 1
                    while (j < line.length && _k_.in(line[j],[' ','\t']))
                    {
                        j++
                    }
                    if (this.depth === 1 && line[j] === ':')
                    {
                        name = line.slice(stringStart, typeof i === 'number' ? i : -1)
                        if (!_k_.empty(name))
                        {
                            this.result.funcs.push({name:name,line:index})
                        }
                    }
                }
            }
            else
            {
                if (ch === '"')
                {
                    inString = true
                    stringStart = i + 1
                }
                else if (_k_.in(ch,['{','[']))
                {
                    this.depth++
                }
                else if (_k_.in(ch,['}',']']))
                {
                    this.depth--
                }
            }
            i++
        }
    }

    index_json.prototype["parse"] = function (text)
    {
        var index, line, lines

        lines = kstr.lines(text)
        this.depth = 0
        this.result = {classes:[],funcs:[],lines:lines.length}
        var list = _k_.list(lines)
        for (index = 0; index < list.length; index++)
        {
            line = list[index]
            this.parseLine(index,line)
        }
        return this.result
    }

    return index_json
})()

export default index_json;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfanNvbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvaW5kZXgvaW5kZXhfanNvbi5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNOzs7QUFFZixjQUFEOzs7OzswQkFFSSx3QkFBVyxPQUFNOzs7O1FBRWIsV0FBVztRQUNYLFVBQVU7UUFDVixjQUFjO1FBQ2QsSUFBSTtlQUVFLElBQUksS0FBSzs7WUFFWCxLQUFLLEtBQUs7Z0JBRVA7O29CQUVJOztvQkFDQyxVQUFVOzt5QkFDTixPQUFNOztvQkFDVixVQUFVOzt5QkFDTixPQUFNOztvQkFFVixXQUFXO29CQUVYLElBQUksSUFBRTsyQkFDQSxJQUFJLEtBQUssaUJBQVcsS0FBSyxJQUFPLElBQUk7O3dCQUN0Qzs7d0JBRUQsS0FBQyxVQUFTLEtBQU0sS0FBSyxPQUFNOzt3QkFDMUIsT0FBTyxXQUFLLG9CQUFjLGlCQUFBO3VDQUNiOzs0QkFDVCxLQUFDLE9BQU8sTUFBTSxNQUFLLEtBQUssS0FBSyxLQUFLOzs7Ozs7O29CQUczQyxPQUFNOztvQkFDTCxXQUFXO29CQUNYLGNBQWMsSUFBRTs7Z0NBQ1osSUFBTyxJQUFJOztvQkFDZixLQUFDOztnQ0FDRyxJQUFPLElBQUk7O29CQUNmLEtBQUM7OztZQUVUOzs7OzBCQUVSLG9CQUFPOzs7O1FBRUgsUUFBUSxLQUFLLE1BQU07UUFFbkIsS0FBQyxRQUFRO1FBQ1QsS0FBQyxVQUFTLFdBQVcsU0FBUyxNQUFNLE1BQU07NEJBRXhCO2FBQVQ7O1lBQUw7WUFDQSxLQUFDLFVBQVUsTUFBTTs7ZUFFckIsS0FBQzs7O1dBckRSOzs7ZUF1RE0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_json.kode
