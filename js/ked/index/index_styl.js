var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var index_styl

import kxk from "../../kxk.js"
let kermit = kxk.kermit
let kstr = kxk.kstr


index_styl = (function ()
{
    function index_styl ()
    {}

    index_styl.prototype["parseLine"] = function (index, line)
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

    index_styl.prototype["parse"] = function (text)
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

    return index_styl
})()

export default index_styl;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3R5bC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvaW5kZXgvaW5kZXhfc3R5bC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ1UsVUFBQTtJQUFNO0lBQU87OztBQUV0QixjQUFEOzs7OzswQkFFSSx3QkFBVyxPQUFNOztZQUVSLEtBQUssV0FBVzs7OzttQkFFbEIsS0FBSyxHQUFNOzt5QkFDRixXQUFLLElBQU0sTUFBTSxZQUFZLFdBQVU7O3VCQUMzQyxLQUFDLE9BQU8sUUFBUSxNQUFLLEtBQUssV0FBSyxHQUFLLEtBQUs7Ozs7OzBCQUVyRCxvQkFBTzs7OztRQUVILFFBQVEsS0FBSyxNQUFNO1FBRW5CLEtBQUMsVUFBUyxXQUFXLFNBQVMsTUFBTSxNQUFNOzRCQUV4QjthQUFUOztZQUFMO1lBQ0EsS0FBQyxVQUFVLE1BQU07O2VBRXJCLEtBQUM7OztXQW5CUjs7O2VBcUJNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_styl.kode
