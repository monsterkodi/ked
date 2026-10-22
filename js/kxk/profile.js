var profile


profile = (function ()
{
    function profile ()
    {}

    profile["hrtime"] = {}
    profile["start"] = async function (id)
    {
        return profile.hrtime[id] = performance.now()
    }

    profile["end"] = async function (id, threshold = 0)
    {
        var b, f, t, u, v

        t = performance.now()
        b = t - profile.hrtime[id]
        f = 0.001
        var list = ['s','ms','μs']
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            u = list[_a_]
            if (u === 'μs' || b * f > 1)
            {
                v = b * f
                v < 1 ? f = v.toFixed(2) : f = v.toFixed(0)
                if (b >= threshold)
                {
                    console.log(id + ' ' + f + ' ' + u)
                }
                return b
            }
            f *= 1000
        }
    }

    return profile
})()

export default profile;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvcHJvZmlsZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7QUFRUyxXQUFUOzs7OztJQUVJLFNBQUM7SUFFRCxTQUFDLDBCQUFPOztlQUVKLFFBQVEsT0FBTyxNQUFNLFlBQVk7OztJQUVyQyxTQUFDLHdCQUFLLElBQUcsWUFBVTs7OztRQUVmLElBQUksWUFBWTtRQUVoQixJQUFJLElBQUUsUUFBUSxPQUFPO1FBQ3JCLElBQUU7b0JBQ1EsSUFBSSxLQUFLOzs7WUFBZjtnQkFDRyxNQUFHLFFBQVEsSUFBRSxJQUFFOztnQkFDZCxJQUFJLElBQUU7Z0JBQ0gsSUFBSSxJQUFJLElBQUksRUFBRSxRQUFRLEtBQU8sSUFBSSxFQUFFLFFBQVE7b0JBQzNDLEtBQUs7O29CQUFZLFlBQUksS0FBRyxNQUFJLElBQUUsTUFBSTs7dUJBQzlCOztZQUNYLEtBQUc7Ozs7V0FwQk47OztlQXNCRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/profile.kode
