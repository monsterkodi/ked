var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var lineDiff

import kstr from "./kstr.js"

import util from "./util.js"
let isEqual = util.isEqual


lineDiff = function (oldLine, newLine)
{
    var changes, fillet, i, newFillet, newMatches, oldFillet, oldMatch, oldMatches

    changes = []
    if (oldLine !== newLine)
    {
        oldFillet = kstr.fillet(oldLine)
        newFillet = kstr.fillet(newLine)
        while (fillet = newFillet.shift())
        {
            if (oldFillet.length && oldFillet[0].match === fillet.match)
            {
                oldFillet.shift()
            }
            else
            {
                oldMatches = oldFillet.map(function (f)
                {
                    return f.match
                })
                if (_k_.in(fillet.match,oldMatches))
                {
                    while (oldMatch = oldMatches.shift())
                    {
                        oldFillet.shift()
                        if (oldMatch === fillet.match)
                        {
                            break
                        }
                    }
                    continue
                }
                changes.push({index:fillet.index,length:fillet.length})
                newMatches = newFillet.map(function (f)
                {
                    return f.match
                })
                while (oldFillet.length && !(_k_.in(oldFillet[0].match,newMatches)))
                {
                    oldFillet.shift()
                }
            }
        }
        if (changes.length > 1)
        {
            for (var _a_ = i = changes.length - 1, _b_ = 1; (_a_ <= _b_ ? i <= 1 : i >= 1); (_a_ <= _b_ ? ++i : --i))
            {
                if (changes[i - 1].index + changes[i - 1].length === changes[i].index)
                {
                    changes[i - 1].length += changes[i].length
                    changes.pop()
                }
            }
        }
    }
    return changes
}

lineDiff.isBoring = function (oldLine, newLine)
{
    var change, changes

    changes = lineDiff(oldLine,newLine)
    if (_k_.empty(changes))
    {
        return true
    }
    var list = _k_.list(changes)
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        change = list[_c_]
        if (!_k_.empty(_k_.trim(newLine.slice(change.index,change.index + change.length))))
        {
            return false
        }
    }
    return true
}
export default lineDiff;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZWRpZmYuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva3hrL2xpbmVkaWZmLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFXQSxxQkFBVyxTQUFROzs7O0lBRWY7UUFFRyxZQUFXOztRQUVWLFlBQVksS0FBSyxPQUFPO1FBQ3hCLFlBQVksS0FBSyxPQUFPO2VBRWxCLFNBQVMsVUFBVTs7Z0JBRWxCLFVBQVUsVUFBVyxVQUFVLEdBQUcsVUFBUyxPQUFPOztnQkFDakQsVUFBVTs7OztnQkFFVixhQUFhLFVBQVUsY0FBSzs7MkJBQU0sRUFBRTs7MkJBQ2pDLE9BQU8sTUFBUzs7MkJBQ1QsV0FBVyxXQUFXOzt3QkFDeEIsVUFBVTs0QkFDUCxhQUFZLE9BQU87OzRCQUNsQjs7O29CQUNSOztnQkFDSixRQUFRLE1BQUssTUFBTSxPQUFPLE1BQU8sT0FBTyxPQUFPO2dCQUMvQyxhQUFhLFVBQVUsY0FBSzs7MkJBQU0sRUFBRTs7dUJBQzlCLFVBQVUsbUJBQVcsVUFBVSxHQUFHLE1BQWE7O29CQUNqRCxVQUFVOzs7O1lBRW5CLFFBQVEsU0FBUzs7MkJBQ1osSUFBSyxRQUFRLFNBQU8sU0FBRyxzQkFBQSxTQUFBOztvQkFDcEIsUUFBUSxJQUFFLEdBQUcsUUFBUSxRQUFRLElBQUUsR0FBRyxXQUFVLFFBQVEsR0FBRzs7b0JBQ3RELFFBQVEsSUFBRSxHQUFHLFVBQVUsUUFBUSxHQUFHO29CQUNsQyxRQUFROzs7OztXQUV4Qjs7O0FBUUosU0FBUyxxQkFBVyxTQUFROzs7O0lBRXhCLFVBQVUsU0FBUyxRQUFRO2tCQUNOOztlQUFkOzt3QkFDTzs7O1FBQVY7Z0NBQ2MsUUFBUSxNQUFNLE9BQU8sTUFBTSxPQUFPLFFBQU0sT0FBTzs7bUJBQ2xEOzs7V0FDZjs7ZUFFRyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/linediff.kode
