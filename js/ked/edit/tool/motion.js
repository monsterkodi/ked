var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var motion

import kxk from "../../../kxk.js"
let kseg = kxk.kseg


motion = (function ()
{
    function motion ()
    {}

    motion["isLinewise"] = function (spec)
    {
        return _k_.in(spec.kind,['line','lineDown','lineUp'])
    }

    motion["mergeRanges"] = function (rngs)
    {
        var merged, overlaps, rng, sameLine, tail, touches

        if (_k_.empty(rngs))
        {
            return []
        }
        rngs.sort(function (a, b)
        {
            if (a[1] === b[1])
            {
                return a[0] - b[0]
            }
            else
            {
                return a[1] - b[1]
            }
        })
        merged = []
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (_k_.empty(merged))
            {
                merged.push(rng)
                continue
            }
            tail = merged.slice(-1)[0]
            sameLine = rng[1] === tail[3]
            overlaps = rng[1] < tail[3] || (sameLine && rng[0] < tail[2])
            touches = sameLine && rng[0] === tail[2]
            if (overlaps || touches)
            {
                if (rng[3] > tail[3] || (rng[3] === tail[3] && rng[2] > tail[2]))
                {
                    tail[2] = rng[2]
                    tail[3] = rng[3]
                }
            }
            else
            {
                merged.push(rng)
            }
        }
        return merged
    }

    motion["range"] = function (lines, pos, spec)
    {
        var count, x, y, _66_34_

        if (_k_.empty(lines))
        {
            return null
        }
        var _a_ = pos; x = _a_[0]; y = _a_[1]

        y = _k_.clamp(0,lines.length - 1,y)
        x = _k_.clamp(0,kseg.width(lines[y]),x)
        count = _k_.max(1,(((_66_34_=spec.count) != null ? _66_34_ : 1)))
        switch (spec.kind)
        {
            case 'char':
                return this.rangeForChars(lines,x,y,count)

            case 'charBack':
                return this.rangeForCharsBack(lines,x,y,count)

            case 'word':
                return this.rangeForWord(lines,x,y,count)

            case 'wordEnd':
                return this.rangeForWordEnd(lines,x,y,count)

            case 'wordBack':
                return this.rangeForWordBack(lines,x,y,count)

            case 'bol':
                return this.rangeForBol(lines,x,y)

            case 'eol':
                return this.rangeForEol(lines,x,y)

            case 'line':
                return this.rangeForLines(lines,y,y + count - 1)

            case 'lineDown':
                return this.rangeForLines(lines,y,y + count)

            case 'lineUp':
                return this.rangeForLines(lines,y - count,y)

        }

    }

    motion["rangeForChars"] = function (lines, x, y, count)
    {
        var width

        width = kseg.width(lines[y])
        x = _k_.min(x,width)
        return [x,y,_k_.min(x + count,width),y]
    }

    motion["rangeForCharsBack"] = function (lines, x, y, count)
    {
        x = _k_.min(x,kseg.width(lines[y]))
        return [_k_.max(0,x - count),y,x,y]
    }

    motion["rangeForBol"] = function (lines, x, y)
    {
        return [0,y,_k_.min(x,kseg.width(lines[y])),y]
    }

    motion["rangeForEol"] = function (lines, x, y)
    {
        var width

        width = kseg.width(lines[y])
        return [_k_.min(x,width),y,width,y]
    }

    motion["rangeForLines"] = function (lines, startLine, endLine)
    {
        startLine = _k_.clamp(0,lines.length - 1,startLine)
        endLine = _k_.clamp(0,lines.length - 1,endLine)
        return [0,startLine,kseg.width(lines[endLine]),endLine]
    }

    motion["rangeForWord"] = function (lines, x, y, count)
    {
        var n, pos

        pos = [x,y]
        for (var _a_ = n = 0, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            pos = this.wordStartAfter(lines,pos,(n === count - 1))
        }
        if (pos[0] === 0 && pos[1] > y)
        {
            pos = [kseg.width(lines[pos[1] - 1]),pos[1] - 1]
        }
        return [x,y,pos[0],pos[1]]
    }

    motion["rangeForWordEnd"] = function (lines, x, y, count)
    {
        var n, pos

        pos = [x,y]
        for (var _a_ = n = 0, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            pos = this.wordEndAfter(lines,pos)
        }
        return [x,y,pos[0],pos[1]]
    }

    motion["rangeForWordBack"] = function (lines, x, y, count)
    {
        var n, pos

        pos = [x,y]
        for (var _a_ = n = 0, _b_ = count; (_a_ <= _b_ ? n < count : n > count); (_a_ <= _b_ ? ++n : --n))
        {
            pos = this.wordStartBefore(lines,pos)
        }
        return [pos[0],pos[1],x,y]
    }

    motion["category"] = function (seg)
    {
        if (_k_.empty(seg))
        {
            return 'empty'
        }
        if (/\s+/.test(seg))
        {
            return 'ws'
        }
        if (/\w+/.test(seg))
        {
            return 'word'
        }
        return 'punct'
    }

    motion["widthAt"] = function (segs, i)
    {
        return kseg.widthAtSegi(segs,i)
    }

    motion["wordStartAfter"] = function (lines, pos, eol = false)
    {
        var cat, i, j, line, segs, x, y, yy

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        segs = lines[y]
        i = kseg.indexAtWidth(segs,x)
        if (i < segs.length)
        {
            cat = this.category(segs[i])
            if (cat !== 'ws')
            {
                while (i < segs.length && this.category(segs[i]) === cat)
                {
                    i += 1
                }
            }
            while (i < segs.length && this.category(segs[i]) === 'ws')
            {
                i += 1
            }
            if (i < segs.length)
            {
                return [this.widthAt(segs,i),y]
            }
        }
        if (eol)
        {
            return [kseg.width(segs),y]
        }
        for (var _b_ = yy = (y + 1), _c_ = lines.length; (_b_ <= _c_ ? yy < lines.length : yy > lines.length); (_b_ <= _c_ ? ++yy : --yy))
        {
            line = lines[yy]
            j = 0
            while (j < line.length && this.category(line[j]) === 'ws')
            {
                j += 1
            }
            if (j < line.length)
            {
                return [this.widthAt(line,j),yy]
            }
        }
        return [kseg.width(segs),y]
    }

    motion["wordEndAfter"] = function (lines, pos)
    {
        var cat, i, j, segs, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        segs = lines[y]
        i = kseg.indexAtWidth(segs,x)
        while (true)
        {
            if (i >= segs.length)
            {
                if (y + 1 >= lines.length)
                {
                    return [kseg.width(segs),y]
                }
                y += 1
                segs = lines[y]
                i = 0
                continue
            }
            cat = this.category(segs[i])
            if (cat === 'ws')
            {
                i += 1
                continue
            }
            j = i
            while (j + 1 < segs.length && this.category(segs[j + 1]) === cat)
            {
                j += 1
            }
            if (j > i)
            {
                return [this.widthAt(segs,j + 1),y]
            }
            i = j + 1
        }
    }

    motion["wordStartBefore"] = function (lines, pos)
    {
        var cat, i, segs, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        segs = lines[y]
        i = kseg.indexAtWidth(segs,x)
        while (true)
        {
            if (i <= 0)
            {
                if (y <= 0)
                {
                    return [0,0]
                }
                y -= 1
                segs = lines[y]
                i = segs.length
                continue
            }
            i -= 1
            cat = this.category(segs[i])
            if (cat === 'ws')
            {
                continue
            }
            while (i > 0 && this.category(segs[i - 1]) === cat)
            {
                i -= 1
            }
            return [this.widthAt(segs,i),y]
        }
    }

    return motion
})()

export default motion;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW90aW9uLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC9lZGl0L3Rvb2wvbW90aW9uLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FvQmEsVUFBQTtJQUFNOzs7QUFFVixVQUFUOzs7OztJQUVJLFFBQUMseUJBQVk7O3NCQUFRLEtBQUssTUFBUyxPQUFPLFdBQVc7OztJQUlyRCxRQUFDLDBCQUFhOzs7O3NCQUVLOzs7O1FBRWYsS0FBSyxlQUFNLEdBQUU7O2dCQUFTLEVBQUUsT0FBTSxFQUFFOzt1QkFBUSxFQUFFLEtBQUcsRUFBRTs7Ozt1QkFBUSxFQUFFLEtBQUcsRUFBRTs7O1FBRTlEOzRCQUVXOzs7WUFBUDswQkFFUzs7Z0JBQ0wsT0FBTyxLQUFLO2dCQUNaOztZQUVKLE9BQU87WUFFUCxXQUFXLElBQUksT0FBTSxLQUFLO1lBQzFCLFdBQVcsSUFBSSxLQUFLLEtBQUssT0FBTyxZQUFhLElBQUksS0FBSyxLQUFLO1lBQzNELFVBQVcsWUFBYSxJQUFJLE9BQU0sS0FBSztnQkFFcEMsWUFBWTs7b0JBQ1IsSUFBSSxLQUFLLEtBQUssT0FBTyxJQUFJLE9BQU0sS0FBSyxNQUFPLElBQUksS0FBSyxLQUFLOztvQkFDeEQsS0FBSyxLQUFLLElBQUk7b0JBQ2QsS0FBSyxLQUFLLElBQUk7Ozs7O2dCQUVsQixPQUFPLEtBQUs7OztlQUVwQjs7O0lBRUosUUFBQyxvQkFBTyxPQUFNLEtBQUk7Ozs7c0JBRUc7O21CQUFkOztrQkFFSyxLQUFQLFlBQUU7O1FBRUgsY0FBYyxFQUFFLE1BQU0sU0FBTyxFQUFFO1FBQy9CLGNBQWMsRUFBRSxLQUFLLE1BQU0sTUFBTSxJQUFJO1FBQ3JDLGdCQUFZLGFBQUcsS0FBSywyQkFBUTtnQkFFckIsS0FBSzs7aUJBQ1I7dUJBQWEsS0FBQyxjQUFpQixNQUFNLEVBQUUsRUFBRTs7aUJBQ3pDO3VCQUFhLEtBQUMsa0JBQWtCLE1BQU0sRUFBRSxFQUFFOztpQkFDMUM7dUJBQWEsS0FBQyxhQUFpQixNQUFNLEVBQUUsRUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/motion.kode
