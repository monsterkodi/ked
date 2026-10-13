var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

import kxk from "../../kxk.js"
let kermit = kxk.kermit

class index_mm
{
    parseLine (index, line)
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

    parse (text)
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
}

export default index_mm;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfbW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2luZGV4L2luZGV4X21tLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O1lBb0JjLEtBQUssV0FBVzs7OztZQUVuQixRQUFRLE9BQU8sVUFBVSxLQUFLLDRCQUM5QixRQUFRLE9BQU8sVUFBVSxLQUFLOztZQUM3QixNQUFNLE9BQU87WUFDYixNQUFNLE9BQU87WUFDYixLQUFDLE9BQU8sUUFBUSxLQUFLOzs7bUJBR3RCLEtBQUssR0FBTTs7WUFDVixnQkFBWSxXQUFLLElBQU0sTUFBTSxZQUFZLEdBQUcsTUFBTTswQkFDekM7O2dCQUNMLFlBQUksV0FBVzs7OzJCQUVWLEtBQUMsT0FBTzs7Z0JBQ2IsT0FBTSxPQUFPLEtBQUssS0FBSyxNQUFNLE1BQU0sS0FBQyxPQUFPLHFCQUFZO29CQUNsQyxLQUFLLE9BQU07O29CQUFoQyxJQUFJLFNBQVM7Ozs7O2dCQUViLE9BQU0sS0FBSyxLQUFNLEtBQUs7O1lBQzFCLEtBQUMsT0FBTyxNQUFNLEtBQUs7Ozs7Ozs7OztRQVd2QixRQUFRLEtBQUssTUFBTTtRQUVuQixLQUFDLFVBQVMsV0FBVyxTQUFTLE1BQU0sTUFBTTs0QkFFaEI7Ozs7WUFDdEIsS0FBQyxVQUFVLFVBQVU7O2VBRXpCLEtBQUM7Ozs7ZUFFRiJ9
//# sourceURL=kode/ked/index/index_mm.kode
