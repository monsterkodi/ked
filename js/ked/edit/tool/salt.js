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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL3NhbHQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVdTLFFBQVQ7Ozs7O1VBUUksMkJBQWU7Ozs7UUFFWCxVQUFVLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLE1BQU07bUJBQzNDLFFBQVEsR0FBTTs7bUJBQ2IsS0FBSyxpQkFBaUIsU0FBUyxVQUFVOzs7O1VBUWpELHlDQUE2QixPQUFNOzs7O1FBRS9CLElBQUksSUFBSTthQUNFLEtBQUMsYUFBYSxNQUFNOzs7O1FBRTlCLEtBQUs7ZUFDQyxLQUFDLGFBQWEsTUFBTSxLQUFHOztZQUN6QixNQUFNO2dCQUNHLElBQUUsTUFBTTs7Z0JBQWpCOzs7UUFFSixLQUFLO2VBQ0MsS0FBQyxhQUFhLE1BQU0sS0FBRzs7WUFDekIsTUFBTTtnQkFDRyxLQUFHLE1BQU07O2dCQUFsQjs7O1FBRUo7WUFDRyxLQUFHLE1BQU07OzJCQUNKLElBQUssVUFBSSxLQUFHLHNCQUFILEtBQUcsU0FBSCxLQUFHOztnQkFDWixLQUFLLE1BQU0sSUFBSSxHQUFHOzs7ZUFDMUI7OztVQVFKLHFEQUF5QyxPQUFNLE1BQUs7Ozs7c0JBRXZDOztZQUNMLFNBQVMsS0FBSyxlQUFLOzt1QkFBTSxLQUFDLHdCQUF3QixNQUFNOzs7UUFFNUQsT0FBTyxLQUFDLFVBQVUsS0FBQyxrQkFBa0IsTUFBTSxRQUFRO1FBRW5ELGdCQUFZLEtBQUMsZ0JBQWdCLE1BQU0sS0FBSztRQUV4QyxPQUFPLE9BQU8sTUFBSyxRQUFRLE9BQUssU0FBUTtrQkFFekIsS0FBQyxzQkFBc0IsTUFBTSxPQUFPLEVBQUUsS0FBSyxHQUFHOztnQkFDNUQsTUFBTTs7O1dBM0ROOzs7ZUE2REYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/salt.kode
