var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var sircels

import png from "./png.js"


sircels = (function ()
{
    function sircels ()
    {}

    sircels["pixlArr"] = new Uint32Array(new ArrayBuffer(4))
    sircels["sircArr"] = null
    sircels["csz"] = []
    sircels["cache"] = {}
    sircels["sircImg"] = function (sd, fg)
    {
        var dx, dy, img, offset, rsq, sr, x, y, _20_64_

        this.pixlArr.set([fg[0] | fg[1] << 8 | fg[2] << 16 | (((_20_64_=fg[3]) != null ? _20_64_ : 255)) << 24])
        img = {w:sd,h:sd}
        sr = Math.floor(sd / 2)
        rsq = sr * sr
        offset = ((sd % 2 === 0) ? 0.5 : 0)
        for (var _a_ = x = -sr, _b_ = sr; (_a_ <= _b_ ? x <= sr : x >= sr); (_a_ <= _b_ ? ++x : --x))
        {
            for (var _c_ = y = -sr, _d_ = sr; (_c_ <= _d_ ? y <= sr : y >= sr); (_c_ <= _d_ ? ++y : --y))
            {
                dx = x + offset
                dy = y + offset
                if (dx ** 2 + dy ** 2 <= rsq)
                {
                    this.sircArr.set(this.pixlArr,(x + sr) + (y + sr) * sd)
                }
            }
        }
        img.png = Buffer.from(png.encode([this.sircArr.buffer],img.w,img.h,2))
        return img
    }

    sircels["place"] = function (sx, sy, sd, fg, z)
    {
        var img, ox, oy, tx, ty

        if (_k_.empty(this.csz))
        {
            return
        }
        img = this.cache[fg]
        if (_k_.empty(img))
        {
            img = this.sircImg(sd,fg)
            this.cache[fg] = img
        }
        ty = Math.floor(sy / this.csz[1])
        tx = Math.floor(sx / this.csz[0])
        oy = sy - ty * this.csz[1]
        ox = sx - tx * this.csz[0]
        return ked_ttio.placeImg(img,tx,ty,ox,oy,sd,sd,z)
    }

    sircels["onResize"] = function (cols, rows, pixels, cellsz)
    {
        this.csz = cellsz
        this.cache = {}
        return this.sircArr = new Uint32Array(new ArrayBuffer(this.csz[0] * this.csz[0] * 4))
    }

    return sircels
})()

export default sircels;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lyY2Vscy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdXRpbC9pbWcvc2lyY2Vscy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUU0sVUFBQTs7O0FBRUcsV0FBVDs7Ozs7SUFFSSxTQUFDLGdCQUFhLGdCQUFnQixZQUFZO0lBQzFDLFNBQUMsWUFBUztJQUNWLFNBQUM7SUFDRCxTQUFDO0lBRUQsU0FBQyxzQkFBUyxJQUFHOzs7O1FBRVQsS0FBQyxRQUFRLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxJQUFJLEdBQUcsTUFBTSxnQkFBTSxHQUFHLHdCQUFLLFNBQVE7UUFFbEUsT0FBTSxFQUFFLEdBQUcsRUFBRTtRQUViLGdCQUFZLEtBQUc7UUFDZixNQUFNLEtBQUs7UUFFWCxXQUFVLEtBQUssTUFBSyxLQUFLLE1BQU07dUJBRTNCLEtBQU0sVUFBSSx1QkFBQSxVQUFBOzsyQkFDTixLQUFNLFVBQUksdUJBQUEsVUFBQTs7Z0JBQ1YsS0FBSyxJQUFJO2dCQUNULEtBQUssSUFBSTtvQkFDTixNQUFJLElBQUksTUFBSSxLQUFLOztvQkFDaEIsS0FBQyxRQUFRLElBQUksS0FBQyxTQUFTLElBQUUsT0FBSyxJQUFFLE1BQUk7Ozs7UUFFaEQsSUFBSSxNQUFNLE9BQU8sS0FBSyxJQUFJLFFBQVEsS0FBQyxRQUFRLFFBQVEsSUFBSSxFQUFFLElBQUksRUFBRTtlQUMvRDs7O0lBUUosU0FBQyxvQkFBTyxJQUFHLElBQUcsSUFBRyxJQUFHOzs7O3NCQUVKLEtBQUM7Ozs7UUFFYixNQUFNLEtBQUMsTUFBTTtzQkFDSjs7WUFDTCxNQUFNLEtBQUMsUUFBUSxHQUFHO1lBQ2xCLEtBQUMsTUFBTSxNQUFNOztRQUVqQixnQkFBVyxLQUFLLEtBQUMsSUFBSTtRQUNyQixnQkFBVyxLQUFLLEtBQUMsSUFBSTtRQUVyQixLQUFLLEtBQUssS0FBSyxLQUFDLElBQUk7UUFDcEIsS0FBSyxLQUFLLEtBQUssS0FBQyxJQUFJO2VBRXBCLFNBQVMsU0FBUyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHOzs7SUFRNUMsU0FBQyx1QkFBVSxNQUFLLE1BQUssUUFBTzs7UUFFeEIsS0FBQyxNQUFVO1FBQ1gsS0FBQztlQUNELEtBQUMsY0FBYyxnQkFBZ0IsWUFBWSxLQUFDLElBQUksS0FBRyxLQUFDLElBQUksS0FBRzs7O1dBN0QxRDs7O2VBK0RGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/img/sircels.kode
