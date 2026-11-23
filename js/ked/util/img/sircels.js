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
        var dx, dy, img, offset, rsq, sr, x, y, _12_64_

        this.pixlArr.set([fg[0] | fg[1] << 8 | fg[2] << 16 | (((_12_64_=fg[3]) != null ? _12_64_ : 255)) << 24])
        img = {w:sd,h:sd}
        sr = Math.floor(sd / 2)
        rsq = sr * sr
        offset = ((sd % 2 === 0) ? 0.5 : 0)
        for (x = -sr; x <= sr; x++)
        {
            for (y = -sr; y <= sr; y++)
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

    sircels["place"] = function (sx, sy, sd, fg, z, name = 'circle')
    {
        var img, key, ox, oy, tx, ty

        if (_k_.empty(this.csz))
        {
            return
        }
        key = name + fg + sd
        img = this.cache[key]
        if (_k_.empty(img))
        {
            img = this.sircImg(sd,fg)
            img.name = name
            this.cache[key] = img
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lyY2Vscy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdXRpbC9pbWcvc2lyY2Vscy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ00sVUFBQTs7O0FBQ0wsV0FBRDs7Ozs7SUFFSSxTQUFDLGdCQUFhLGdCQUFnQixZQUFZO0lBQzFDLFNBQUMsWUFBUztJQUNWLFNBQUM7SUFDRCxTQUFDO0lBRUQsU0FBQyxzQkFBUyxJQUFHOzs7O1FBRVQsS0FBQyxRQUFRLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxJQUFJLEdBQUcsTUFBTSxnQkFBTSxHQUFHLHdCQUFLLFNBQVE7UUFFbEUsT0FBTSxFQUFFLEdBQUcsRUFBRTtRQUViLGdCQUFZLEtBQUc7UUFDZixNQUFNLEtBQUs7UUFFWCxXQUFVLEtBQUssTUFBSyxLQUFLLE1BQU07YUFFM0IsS0FBTSxTQUFJOztpQkFDTixLQUFNLFNBQUk7O2dCQUNWLEtBQUssSUFBSTtnQkFDVCxLQUFLLElBQUk7b0JBQ04sTUFBSSxJQUFJLE1BQUksS0FBSzs7b0JBQ2hCLEtBQUMsUUFBUSxJQUFJLEtBQUMsU0FBUyxJQUFFLE9BQUssSUFBRSxNQUFJOzs7O1FBRWhELElBQUksTUFBTSxPQUFPLEtBQUssSUFBSSxRQUFRLEtBQUMsUUFBUSxRQUFRLElBQUksRUFBRSxJQUFJLEVBQUU7ZUFDL0Q7OztJQUVKLFNBQUMsb0JBQU8sSUFBRyxJQUFHLElBQUcsSUFBRyxHQUFFLE9BQUs7Ozs7c0JBRVosS0FBQzs7OztRQUVaLE1BQU0sT0FBTyxLQUFLO1FBQ2xCLE1BQU0sS0FBQyxNQUFNO3NCQUNKOztZQUNMLE1BQU0sS0FBQyxRQUFRLEdBQUc7WUFDbEIsSUFBSSxPQUFPO1lBQ1gsS0FBQyxNQUFNLE9BQU87O1FBRWxCLGdCQUFXLEtBQUssS0FBQyxJQUFJO1FBQ3JCLGdCQUFXLEtBQUssS0FBQyxJQUFJO1FBRXJCLEtBQUssS0FBSyxLQUFLLEtBQUMsSUFBSTtRQUNwQixLQUFLLEtBQUssS0FBSyxLQUFDLElBQUk7ZUFFcEIsU0FBUyxTQUFTLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7OztJQUU1QyxTQUFDLHVCQUFVLE1BQUssTUFBSyxRQUFPOztRQUV4QixLQUFDLE1BQVU7UUFDWCxLQUFDO2VBQ0QsS0FBQyxjQUFjLGdCQUFnQixZQUFZLEtBQUMsSUFBSSxLQUFHLEtBQUMsSUFBSSxLQUFHOzs7V0FuRGxFOzs7ZUFxRE0ifQ==
//# sourceURL=../../../../kode/ked/util/img/sircels.kode
