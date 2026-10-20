var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

import kxk from "../../kxk.js"
let kermit = kxk.kermit
let kstr = kxk.kstr

class index_styl
{
    parseLine (index, line)
    {
        if (line.startsWith(' '))
        {
            return
        }
        if (_k_.in(line[0],"@#."))
        {
            if (_k_.trim(line.slice(1)).split(/[\s\.\:]/).length === 1)
            {
                return this.result.classes.push({name:line.slice(1),line:index})
            }
        }
    }

    parse (text)
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
}

export default index_styl;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3R5bC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvaW5kZXgvaW5kZXhfc3R5bC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1lBb0JjLEtBQUssV0FBVzs7OzttQkFFbkIsS0FBSyxHQUFNOzt5QkFDRixXQUFLLElBQU0sTUFBTSxZQUFZLFdBQVU7O3VCQUMzQyxLQUFDLE9BQU8sUUFBUSxNQUFLLEtBQUssV0FBSyxHQUFLLEtBQUs7Ozs7Ozs7OztRQVVqRCxRQUFRLEtBQUssTUFBTTtRQUVuQixLQUFDLFVBQVMsV0FBVyxTQUFTLE1BQU0sTUFBTTs0QkFFeEI7Ozs7WUFDZCxLQUFDLFVBQVUsTUFBTTs7ZUFFckIsS0FBQzs7OztlQUVGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_styl.kode
