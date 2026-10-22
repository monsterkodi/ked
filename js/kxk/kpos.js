var _k_ = {isFunc: function (o) {return typeof o === 'function'}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var clamp, Pos


clamp = function (r1, r2, v)
{
    var s1, s2

    if (!Number.isFinite(v))
    {
        v = r1
    }
    var _a_ = [Math.min(r1,r2),Math.max(r1,r2)]; s1 = _a_[0]; s2 = _a_[1]

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
    
        var br, event, _21_13_, _21_22_, _29_18_, _33_22_

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
        var _118_29_, _118_38_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3Bvcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva3Bvcy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQVFBLGtCQUFTLElBQUksSUFBSTs7OztTQUVDLE9BQU8sU0FBUzs7UUFBOUIsSUFBSTs7ZUFDUSxLQUFLLElBQUksR0FBRyxJQUFLLEtBQUssSUFBSSxHQUFHLE1BQXhDLGFBQUk7O1FBQ0ssSUFBSTs7UUFBZCxJQUFJOztRQUNNLElBQUk7O1FBQWQsSUFBSTs7U0FDVSxPQUFPLFNBQVM7O1FBQTlCLElBQUk7O1dBQ0o7OztBQUVLLE9BQVQ7O2FBRUksS0FBSSxHQUFHOztRQUFKO1FBQUc7Ozs7Y0FDQyxLQUFDLFlBQUQsS0FBQyxFQUFHOztZQUNILFFBQVEsS0FBQztnQkFDTixNQUFNLE9BQU87O2dCQUNaLEtBQUMsSUFBSSxNQUFNLFVBQVUsU0FBUyxnQkFBZ0IsYUFBYSxTQUFTLEtBQUs7Z0JBQ3pFLEtBQUMsSUFBSSxNQUFNLFVBQVUsU0FBUyxnQkFBZ0IsWUFBWSxTQUFTLEtBQUs7Ozs7Z0JBRXhFLEtBQUMsSUFBSSxNQUFNLFVBQVUsT0FBTyxVQUFVO2dCQUN0QyxLQUFDLElBQUksTUFBTSxVQUFVLE9BQU8sVUFBVTs7O2lCQUNULFlBQTdCLEtBQUMsWUFBRCxLQUFDLEVBQUc7O1lBQ1IsS0FBSyxLQUFDLEVBQUU7WUFDUixLQUFDLElBQUksR0FBRztZQUNSLEtBQUMsSUFBSSxHQUFHOzttQkFDQSxLQUFDLGNBQU8sSUFBSSxNQUFNLEtBQUM7O1lBQzNCLEtBQUMsSUFBSSxLQUFDLEVBQUU7WUFDUixLQUFDLElBQUksS0FBQyxFQUFFOztZQUNGLE1BQU0sS0FBQzs7WUFBakIsS0FBQyxJQUFJOztZQUNLLE1BQU0sS0FBQzs7WUFBakIsS0FBQyxJQUFJOzs7O21CQUVULG1CQUFNOztRQUFLLEtBQUMsSUFBSSxFQUFFO1FBQUcsS0FBQyxJQUFJLEVBQUU7ZUFBRzs7O21CQUMvQjs7bUJBQWMsSUFBSSxLQUFDLEVBQUUsS0FBQzs7O21CQUV0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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/kpos.kode
