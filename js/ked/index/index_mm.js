var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var index_mm

import kxk from "../../kxk.js"
let kermit = kxk.kermit


index_mm = (function ()
{
    function index_mm ()
    {}

    index_mm.prototype["parseLine"] = function (index, line)
    {
        var fnc, match, name

        if (line.startsWith(' '))
        {
            return
        }
        if (match = kermit.lineMatch(line,'@implementation ●name' || (match = kermit.lineMatch(line,'@interface ●name'))))
        {
            match.type = 'class'
            match.line = index
            this.result.classes.push(match)
            return
        }
        if (_k_.in(line[0],'+-'))
        {
            name = _k_.trim(line.slice(1)).split(/[\:\;\{]/)[0].split(')').slice(-1)[0]
            if (_k_.empty(name))
            {
                console.log('no name?',line)
                return
            }
            if (!_k_.empty(this.result.classes))
            {
                fnc = {method:name,line:index,class:this.result.classes.slice(-1)[0].name}
                if (line[0] === '+')
                {
                    fnc.static = true
                }
            }
            else
            {
                fnc = {name:name,line:index}
            }
            this.result.funcs.push(fnc)
            return
        }
    }

    index_mm.prototype["parse"] = function (text)
    {
        var lineIndex, lines, lineText

        lines = text.split('\n')
        this.result = {classes:[],funcs:[],lines:lines.length}
        var list = _k_.list(lines)
        for (lineIndex = 0; lineIndex < list.length; lineIndex++)
        {
            lineText = list[lineIndex]
            this.parseLine(lineIndex,lineText)
        }
        return this.result
    }

    return index_mm
})()

export default index_mm;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfbW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2luZGV4L2luZGV4X21tLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQU07OztBQUVmLFlBQUQ7Ozs7O3dCQUVJLHdCQUFXLE9BQU07Ozs7WUFFUCxLQUFLLFdBQVc7Ozs7WUFFbkIsUUFBUSxPQUFPLFVBQVUsS0FBSyw0QkFDOUIsUUFBUSxPQUFPLFVBQVUsS0FBSzs7WUFDN0IsTUFBTSxPQUFPO1lBQ2IsTUFBTSxPQUFPO1lBQ2IsS0FBQyxPQUFPLFFBQVEsS0FBSzs7O21CQUd0QixLQUFLLEdBQU07O1lBQ1YsZ0JBQVksV0FBSyxJQUFNLE1BQU0sWUFBWSxHQUFHLE1BQU07MEJBQ3pDOztnQkFDTCxZQUFJLFdBQVc7OzsyQkFFVixLQUFDLE9BQU87O2dCQUNiLE9BQU0sT0FBTyxLQUFLLEtBQUssTUFBTSxNQUFNLEtBQUMsT0FBTyxxQkFBWTtvQkFDbEMsS0FBSyxPQUFNOztvQkFBaEMsSUFBSSxTQUFTOzs7OztnQkFFYixPQUFNLEtBQUssS0FBTSxLQUFLOztZQUMxQixLQUFDLE9BQU8sTUFBTSxLQUFLOzs7Ozt3QkFHM0Isb0JBQU87Ozs7UUFFSCxRQUFRLEtBQUssTUFBTTtRQUVuQixLQUFDLFVBQVMsV0FBVyxTQUFTLE1BQU0sTUFBTTs0QkFFaEI7YUFBYjs7WUFBVDtZQUNBLEtBQUMsVUFBVSxVQUFVOztlQUV6QixLQUFDOzs7V0FuQ1I7OztlQXFDTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/index_mm.kode
