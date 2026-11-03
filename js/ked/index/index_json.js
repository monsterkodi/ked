var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let kstr = kxk.kstr

class index_json
{
    parseLine (index, line)
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

    parse (text)
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
}

export default index_json;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfanNvbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvaW5kZXgvaW5kZXhfanNvbi5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQUNVLFVBQUE7SUFBTTs7QUFFaEIsTUFBTTs7SUFFRixXQUFXLE9BQU07Ozs7UUFFYixXQUFXO1FBQ1gsVUFBVTtRQUNWLGNBQWM7UUFDZCxJQUFJO2VBRUUsSUFBSSxLQUFLOztZQUVYLEtBQUssS0FBSztnQkFFUDs7b0JBRUk7O29CQUNDLFVBQVU7O3lCQUNOLE9BQU07O29CQUNWLFVBQVU7O3lCQUNOLE9BQU07O29CQUVWLFdBQVc7b0JBRVgsSUFBSSxJQUFFOzJCQUNBLElBQUksS0FBSyxpQkFBVyxLQUFLLElBQU8sSUFBSTs7d0JBQ3RDOzt3QkFFRCxLQUFDLFVBQVMsS0FBTSxLQUFLLE9BQU07O3dCQUMxQixPQUFPLFdBQUssb0JBQWMsaUJBQUE7dUNBQ2I7OzRCQUNULEtBQUMsT0FBTyxNQUFNLE1BQUssS0FBSyxLQUFLLEtBQUs7Ozs7Ozs7b0JBRzNDLE9BQU07O29CQUNMLFdBQVc7b0JBQ1gsY0FBYyxJQUFFOztnQ0FDWixJQUFPLElBQUk7O29CQUNmLEtBQUM7O2dDQUNHLElBQU8sSUFBSTs7b0JBQ2YsS0FBQzs7O1lBRVQ7Ozs7SUFFUixPQUFPOzs7O1FBRUgsUUFBUSxLQUFLLE1BQU07UUFFbkIsS0FBQyxRQUFRO1FBQ1QsS0FBQyxVQUFTLFdBQVcsU0FBUyxNQUFNLE1BQU07NEJBRXhCO2FBQVQ7O1lBQUw7WUFDQSxLQUFDLFVBQVUsTUFBTTs7ZUFFckIsS0FBQzs7OztlQUVGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_json.kode
