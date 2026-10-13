var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var salt

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import salter from "../../../kxk/salter.js"


salt = (function ()
{
    function salt ()
    {}

    salt["isSaltedLine"] = function (line)
    {
        var trimmed

        trimmed = kseg.trim(kseg.trim(kseg.trim(line),'#'))
        if (_k_.in(trimmed[0],'█0'))
        {
            return kseg.collectGraphemes(trimmed).length <= 3
        }
    }

    salt["findPositionsForSaltInsert"] = function (lines, pos)
    {
        var ey, posl, sy, y

        y = pos[1]
        if (!this.isSaltedLine(lines[y]))
        {
            return
        }
        sy = y
        while (this.isSaltedLine(lines[sy - 1]))
        {
            sy -= 1
            if (y - sy >= 4)
            {
                break
            }
        }
        ey = y
        while (this.isSaltedLine(lines[ey + 1]))
        {
            ey += 1
            if (ey - sy >= 4)
            {
                break
            }
        }
        posl = []
        if (ey - sy >= 4)
        {
            for (var _a_ = y = sy, _b_ = sy + 4; (_a_ <= _b_ ? y <= sy + 4 : y >= sy + 4); (_a_ <= _b_ ? ++y : --y))
            {
                posl.push([pos[0],y])
            }
        }
        return posl
    }

    salt["insertAsciiHeaderForPositionsAndRanges"] = function (lines, posl, ranges)
    {
        var indt, salt, text

        if (_k_.empty(ranges))
        {
            ranges = posl.map((function (p)
            {
                return this.rangeOfClosestWordToPos(lines,p)
            }).bind(this))
        }
        text = this.joinLines(this.textForLineRanges(lines,ranges),' ')
        indt = _k_.lpad(this.lineIndentAtPos(lines,posl[0]))
        salt = salter(text,{prepend:indt + '# '}) + '\n'
        var _a_ = this.insertTextAtPositions(lines,salt,[[0,posl[0][1]]]); lines = _a_[0]; posl = _a_[1]

        return [lines,posl,[]]
    }

    return salt
})()

export default salt;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL3NhbHQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXFCUSxVQUFVLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLE1BQU07bUJBQzNDLFFBQVEsR0FBTTs7bUJBQ2IsS0FBSyxpQkFBaUIsU0FBUyxVQUFVOzs7Ozs7OztRQVU3QyxJQUFJLElBQUk7YUFDRSxLQUFDLGFBQWEsTUFBTTs7OztRQUU5QixLQUFLO2VBQ0MsS0FBQyxhQUFhLE1BQU0sS0FBRzs7WUFDekIsTUFBTTtnQkFDRyxJQUFFLE1BQU07O2dCQUFqQjs7O1FBRUosS0FBSztlQUNDLEtBQUMsYUFBYSxNQUFNLEtBQUc7O1lBQ3pCLE1BQU07Z0JBQ0csS0FBRyxNQUFNOztnQkFBbEI7OztRQUVKO1lBQ0csS0FBRyxNQUFNOzsrQkFDQyxVQUFJLEtBQUcsc0JBQUgsS0FBRyxTQUFILEtBQUc7O2dCQUNaLEtBQUssTUFBTSxJQUFJLEdBQUc7OztlQUMxQjs7Ozs7OztzQkFVUzs7WUFDTCxTQUFTLEtBQUs7O3VCQUFXLEtBQUMsd0JBQXdCLE1BQU07OztRQUU1RCxPQUFPLEtBQUMsVUFBVSxLQUFDLGtCQUFrQixNQUFNLFFBQVE7UUFFbkQsZ0JBQVksS0FBQyxnQkFBZ0IsTUFBTSxLQUFLO1FBRXhDLE9BQU8sT0FBTyxNQUFLLFFBQVEsT0FBSyxTQUFRO2tCQUV6QixLQUFDLHNCQUFzQixNQUFNLE9BQU8sRUFBRSxLQUFLLEdBQUc7O2dCQUM1RCxNQUFNOzs7Ozs7ZUFFUiJ9
//# sourceURL=file://kode/ked/edit/tool/salt.kode
