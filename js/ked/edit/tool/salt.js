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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL3NhbHQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTs7T0FDQSxhQUFOOzs7QUFFSixRQUFUOzs7OztJQVFJLE1BQUMsMkJBQWM7Ozs7UUFFWCxVQUFVLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLE1BQU07bUJBQzNDLFFBQVEsR0FBTTs7bUJBQ2IsS0FBSyxpQkFBaUIsU0FBUyxVQUFVOzs7O0lBUWpELE1BQUMseUNBQTRCLE9BQU07Ozs7UUFFL0IsSUFBSSxJQUFJO2FBQ0UsS0FBQyxhQUFhLE1BQU07Ozs7UUFFOUIsS0FBSztlQUNDLEtBQUMsYUFBYSxNQUFNLEtBQUc7O1lBQ3pCLE1BQU07Z0JBQ0csSUFBRSxNQUFNOztnQkFBakI7OztRQUVKLEtBQUs7ZUFDQyxLQUFDLGFBQWEsTUFBTSxLQUFHOztZQUN6QixNQUFNO2dCQUNHLEtBQUcsTUFBTTs7Z0JBQWxCOzs7UUFFSjtZQUNHLEtBQUcsTUFBTTs7MkJBQ0osSUFBSyxVQUFJLEtBQUcsc0JBQUgsS0FBRyxTQUFILEtBQUc7O2dCQUNaLEtBQUssTUFBTSxJQUFJLEdBQUc7OztlQUMxQjs7O0lBUUosTUFBQyxxREFBd0MsT0FBTSxNQUFLOzs7O3NCQUV2Qzs7WUFDTCxTQUFTLEtBQUssZUFBSzs7dUJBQU0sS0FBQyx3QkFBd0IsTUFBTTs7O1FBRTVELE9BQU8sS0FBQyxVQUFVLEtBQUMsa0JBQWtCLE1BQU0sUUFBUTtRQUVuRCxnQkFBWSxLQUFDLGdCQUFnQixNQUFNLEtBQUs7UUFFeEMsT0FBTyxPQUFPLE1BQUssUUFBUSxPQUFLLFNBQVE7a0JBRXpCLEtBQUMsc0JBQXNCLE1BQU0sT0FBTyxFQUFFLEtBQUssR0FBRyxPQUE1RCxnQkFBTTs7Z0JBQ04sTUFBTTs7O1dBM0ROOzs7ZUE2REYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/salt.kode
