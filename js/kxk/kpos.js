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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3Bvcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva3Bvcy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQVFBOzs7O1NBRWtCLE9BQU8sU0FBUzs7UUFBOUIsSUFBSTs7ZUFDUSxLQUFLLElBQUksR0FBRyxJQUFLLEtBQUssSUFBSSxHQUFHOztRQUMvQixJQUFJOztRQUFkLElBQUk7O1FBQ00sSUFBSTs7UUFBZCxJQUFJOztTQUNVLE9BQU8sU0FBUzs7UUFBOUIsSUFBSTs7V0FDSjs7Ozs7Ozs7Ozs7O2NBS08sS0FBQyxZQUFELEtBQUMsRUFBRzs7WUFDSCxRQUFRLEtBQUM7Z0JBQ04sTUFBTSxPQUFPOztnQkFDWixLQUFDLElBQUksTUFBTSxVQUFVLFNBQVMsZ0JBQWdCLGFBQWEsU0FBUyxLQUFLO2dCQUN6RSxLQUFDLElBQUksTUFBTSxVQUFVLFNBQVMsZ0JBQWdCLFlBQVksU0FBUyxLQUFLOzs7O2dCQUV4RSxLQUFDLElBQUksTUFBTSxVQUFVLE9BQU8sVUFBVTtnQkFDdEMsS0FBQyxJQUFJLE1BQU0sVUFBVSxPQUFPLFVBQVU7Ozs2QkFDdEMsS0FBQyxZQUFELEtBQUMsRUFBRzs7WUFDUixLQUFLLEtBQUMsRUFBRTtZQUNSLEtBQUMsSUFBSSxHQUFHO1lBQ1IsS0FBQyxJQUFJLEdBQUc7O21CQUNBLEtBQUMsY0FBTyxJQUFJLE1BQU0sS0FBQzs7WUFDM0IsS0FBQyxJQUFJLEtBQUMsRUFBRTtZQUNSLEtBQUMsSUFBSSxLQUFDLEVBQUU7O1lBQ0YsTUFBTSxLQUFDOztZQUFqQixLQUFDLElBQUk7O1lBQ0ssTUFBTSxLQUFDOztZQUFqQixLQUFDLElBQUk7Ozs7OztRQUVFLEtBQUMsSUFBSSxFQUFFO1FBQUcsS0FBQyxJQUFJLEVBQUU7ZUFBRzs7Ozs7bUJBQ2pCLElBQUksS0FBQyxFQUFFLEtBQUM7Ozs7O2VBRVosS0FBQyxJQUFJLEtBQUMsSUFBSTs7Ozs7OztRQUdoQixTQUFTLEtBQUM7YUFDUDs7aUJBQzBCLE1BQU0sSUFBSTs7Z0JBQW5DLE9B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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/kpos.kode
