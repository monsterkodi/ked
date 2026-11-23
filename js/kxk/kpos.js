var _k_ = {isFunc: function (o) {return typeof o === 'function'}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var clamp, Pos


clamp = function (r1, r2, v)
{
    var s1, s2

    if (!Number.isFinite(v))
    {
        v = r1
    }
    ;[s1,s2] = [Math.min(r1,r2),Math.max(r1,r2)]
    if (v < s1)
    {
        v = s1
    }
    if (v > s2)
    {
        v = s2
    }
    if (!Number.isFinite(v))
    {
        v = r1
    }
    return v
}

Pos = (function ()
{
    function Pos (x, y)
    {
        this.x = x
        this.y = y
    
        var br, event, _14_13_, _14_22_, _22_18_, _26_22_

        if (((this.x != null ? this.x.clientX : undefined) != null))
        {
            event = this.x
            if (isNaN(window.scrollX))
            {
                this.x = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft
                this.y = event.clientY + document.documentElement.scrollTop + document.body.scrollTop
            }
            else
            {
                this.x = event.clientX + window.scrollX + 1
                this.y = event.clientY + window.scrollY + 1
            }
        }
        else if (_k_.isFunc((this.x != null ? this.x.getBoundingClientRect : undefined)))
        {
            br = this.x.getBoundingClientRect()
            this.x = br.left
            this.y = br.top
        }
        else if (!(this.y != null) && Pos.isPos(this.x))
        {
            this.y = this.x.y
            this.x = this.x.x
        }
        if (isNaN(this.x))
        {
            this.x = 0
        }
        if (isNaN(this.y))
        {
            this.y = 0
        }
    }

    Pos.prototype["copy"] = function (o)
    {
        this.x = o.x
        this.y = o.y
        return this
    }

    Pos.prototype["clone"] = function ()
    {
        return new Pos(this.x,this.y)
    }

    Pos.prototype["reset"] = function ()
    {
        return this.x = this.y = 0
    }

    Pos.prototype["plus"] = function (val)
    {
        var newPos

        newPos = this.clone()
        if ((val != null))
        {
            if (!isNaN(val.x))
            {
                newPos.x += val.x
            }
            if (!isNaN(val.y))
            {
                newPos.y += val.y
            }
        }
        return newPos
    }

    Pos.prototype["minus"] = function (val)
    {
        var newPos

        newPos = this.clone()
        if ((val != null))
        {
            if (!isNaN(val.x))
            {
                newPos.x -= val.x
            }
            if (!isNaN(val.y))
            {
                newPos.y -= val.y
            }
        }
        return newPos
    }

    Pos.prototype["times"] = function (val)
    {
        return this.clone().scale(val)
    }

    Pos.prototype["clamped"] = function (lower, upper)
    {
        return this.clone().clamp(lower,upper)
    }

    Pos.prototype["rounded"] = function (v = 1.0)
    {
        return new Pos(Math.round(this.x / v) * v,Math.round(this.y / v) * v)
    }

    Pos.prototype["to"] = function (other)
    {
        return other.minus(this)
    }

    Pos.prototype["mid"] = function (other)
    {
        return this.plus(other).scale(0.5)
    }

    Pos.prototype["interpolate"] = function (other, f)
    {
        return this.plus(this.to(other).scale(f))
    }

    Pos.prototype["min"] = function (val)
    {
        var newPos

        newPos = this.clone()
        if (!(val != null))
        {
            return newPos
        }
        if (!isNaN(val.x) && this.x > val.x)
        {
            newPos.x = val.x
        }
        if (!isNaN(val.y) && this.y > val.y)
        {
            newPos.y = val.y
        }
        return newPos
    }

    Pos.prototype["max"] = function (val)
    {
        var newPos

        newPos = this.clone()
        if (!(val != null))
        {
            return newPos
        }
        if (!isNaN(val.x) && this.x < val.x)
        {
            newPos.x = val.x
        }
        if (!isNaN(val.y) && this.y < val.y)
        {
            newPos.y = val.y
        }
        return newPos
    }

    Pos.prototype["normal"] = function ()
    {
        return this.clone().normalize()
    }

    Pos.prototype["neg"] = function ()
    {
        return this.clone().negate()
    }

    Pos.prototype["length"] = function ()
    {
        return Math.sqrt(this.square())
    }

    Pos.prototype["dot"] = function (o)
    {
        return this.x * o.x + this.y * o.y
    }

    Pos.prototype["cross"] = function (o)
    {
        return this.x * o.y - this.y * o.x
    }

    Pos.prototype["square"] = function ()
    {
        return (this.x * this.x) + (this.y * this.y)
    }

    Pos.prototype["distSquare"] = function (o)
    {
        return this.minus(o).square()
    }

    Pos.prototype["dist"] = function (o)
    {
        return Math.sqrt(this.distSquare(o))
    }

    Pos.prototype["equals"] = function (o)
    {
        return this.x === (o != null ? o.x : undefined) && this.y === (o != null ? o.y : undefined)
    }

    Pos.prototype["deg2rad"] = function (d)
    {
        return Math.PI * d / 180.0
    }

    Pos.prototype["rad2deg"] = function (r)
    {
        return r * 180.0 / Math.PI
    }

    Pos.prototype["isClose"] = function (o, dist = 0.1)
    {
        return Math.abs(this.x - o.x) + Math.abs(this.y - o.y) < dist
    }

    Pos.prototype["isZero"] = function (e = 0.000001)
    {
        return Math.abs(this.x) < e && Math.abs(this.y) < e
    }

    Pos.prototype["angle"] = function (o = new Pos(0,1))
    {
        return this.rad2deg(Math.acos(this.normal().dot(o.normal())))
    }

    Pos.prototype["perp"] = function ()
    {
        return new Pos(-this.y,this.x)
    }

    Pos.prototype["rotation"] = function (o)
    {
        var d, s

        d = o.dot(this.perp())
        if (Math.abs(d) < 0.0001)
        {
            if (this.dot(o) > 0)
            {
                return 0
            }
            return 180
        }
        s = d > 0 && -1 || 1
        return s * this.angle(o)
    }

    Pos.prototype["check"] = function ()
    {
        var newPos

        newPos = this.clone()
        if (isNaN(newPos.x))
        {
            newPos.x = 0
        }
        if (isNaN(newPos.y))
        {
            newPos.y = 0
        }
        return newPos
    }

    Pos.prototype["_str"] = function ()
    {
        var s

        s = (this.x ? `<x:${this.x} ` : "<NaN ")
        return s += (this.y ? `y:${this.y}>` : "NaN>")
    }

    Pos["isPos"] = function (o)
    {
        var _111_29_, _111_38_

        return (o != null) && (o.x != null) && (o.y != null) && Number.isFinite(o.x) && Number.isFinite(o.y)
    }

    Pos.prototype["fade"] = function (o, val)
    {
        this.x = this.x * (1 - val) + o.x * val
        this.y = this.y * (1 - val) + o.y * val
        return this
    }

    Pos.prototype["scale"] = function (val)
    {
        this.x *= val
        this.y *= val
        return this
    }

    Pos.prototype["mul"] = function (other)
    {
        this.x *= other.x
        this.y *= other.y
        return this
    }

    Pos.prototype["div"] = function (other)
    {
        this.x /= other.x
        this.y /= other.y
        return this
    }

    Pos.prototype["add"] = function (other)
    {
        this.x += other.x
        this.y += other.y
        return this
    }

    Pos.prototype["sub"] = function (other)
    {
        this.x -= other.x
        this.y -= other.y
        return this
    }

    Pos.prototype["clamp"] = function (lower, upper)
    {
        if ((lower != null) && (upper != null))
        {
            this.x = _k_.clamp(lower.x,upper.x,this.x)
            this.y = _k_.clamp(lower.y,upper.y,this.y)
        }
        return this
    }

    Pos.prototype["normalize"] = function ()
    {
        var l

        l = this.length()
        if (l)
        {
            l = 1.0 / l
            this.x *= l
            this.y *= l
        }
        return this
    }

    Pos.prototype["negate"] = function ()
    {
        this.x *= -1
        this.y *= -1
        return this
    }

    Pos.prototype["rotate"] = function (angle)
    {
        var cos, rad, sin, x

        while (angle > 360)
        {
            angle -= 360
        }
        while (angle < -360)
        {
            angle += 360
        }
        if (angle === 0)
        {
            return this
        }
        rad = this.deg2rad(angle)
        cos = Math.cos(rad)
        sin = Math.sin(rad)
        x = this.x
        this.x = cos * this.x - sin * this.y
        this.y = sin * x + cos * this.y
        return this
    }

    return Pos
})()

export default function (x, y)
{
    return new Pos(x,y)
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3Bvcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva3Bvcy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGtCQUFTLElBQUksSUFBSTs7OztTQUVDLE9BQU8sU0FBUzs7UUFBOUIsSUFBSTs7TUFDSCxHQUFJLE9BQU8sS0FBSyxJQUFJLEdBQUcsSUFBSyxLQUFLLElBQUksR0FBRztRQUMvQixJQUFJOztRQUFkLElBQUk7O1FBQ00sSUFBSTs7UUFBZCxJQUFJOztTQUNVLE9BQU8sU0FBUzs7UUFBOUIsSUFBSTs7V0FDSjs7O0FBRUgsT0FBRDs7YUFFSSxLQUFJLEdBQUc7O1FBQUo7UUFBRzs7OztjQUNDLEtBQUMsWUFBRCxLQUFDLEVBQUc7O1lBQ0gsUUFBUSxLQUFDO2dCQUNOLE1BQU0sT0FBTzs7Z0JBQ1osS0FBQyxJQUFJLE1BQU0sVUFBVSxTQUFTLGdCQUFnQixhQUFhLFNBQVMsS0FBSztnQkFDekUsS0FBQyxJQUFJLE1BQU0sVUFBVSxTQUFTLGdCQUFnQixZQUFZLFNBQVMsS0FBSzs7OztnQkFFeEUsS0FBQyxJQUFJLE1BQU0sVUFBVSxPQUFPLFVBQVU7Z0JBQ3RDLEtBQUMsSUFBSSxNQUFNLFVBQVUsT0FBTyxVQUFVOzs7aUJBQ1QsWUFBN0IsS0FBQyxZQUFELEtBQUMsRUFBRzs7WUFDUixLQUFLLEtBQUMsRUFBRTtZQUNSLEtBQUMsSUFBSSxHQUFHO1lBQ1IsS0FBQyxJQUFJLEdBQUc7O21CQUNBLEtBQUMsY0FBTyxJQUFJLE1BQU0sS0FBQzs7WUFDM0IsS0FBQyxJQUFJLEtBQUMsRUFBRTtZQUNSLEtBQUMsSUFBSSxLQUFDLEVBQUU7O1lBQ0YsTUFBTSxLQUFDOztZQUFqQixLQUFDLElBQUk7O1lBQ0ssTUFBTSxLQUFDOztZQUFqQixLQUFDLElBQUk7Ozs7bUJBRVQsbUJBQU07O1FBQUssS0FBQyxJQUFJLEVBQUU7UUFBRyxLQUFDLElBQUksRUFBRTtlQUFHOzs7bUJBQy9COzttQkFBYyxJQUFJLEtBQUMsRUFBRSxLQUFDOzs7bUJBRXRC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
//# sourceURL=../../kode/kxk/kpos.kode
