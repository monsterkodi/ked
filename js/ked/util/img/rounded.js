var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var rounded

import png from "./png.js"


rounded = (function ()
{
    function rounded ()
    {}

    rounded["cache"] = {}
    rounded["shadow"] = [0,0,0,100]
    rounded["img"] = function (w, h)
    {
        var buff, view

        buff = new ArrayBuffer(w * h * 4)
        view = new DataView(buff)
        return {w:w,h:h,buff:buff,view:view}
    }

    rounded["encode"] = function (img, maxColors = 4)
    {
        img.png = Buffer.from(png.encode([img.buff],img.w,img.h,maxColors))
        return img
    }

    rounded["set"] = function (img, x, y, rgba)
    {
        var i

        if (x < 0 || y < 0)
        {
            return
        }
        if (x >= img.w)
        {
            return
        }
        if (y >= img.h)
        {
            return
        }
        for (i = 0; i < rgba.length; i++)
        {
            img.view.setUint8(((x + y * img.w) * 4) + i,rgba[i])
        }
        if (rgba.length === 3)
        {
            return img.view.setUint8(((x + y * img.w) * 4) + 3,255)
        }
    }

    rounded["circle"] = function (img, cx, cy, r, fg)
    {
        var rsq, x, y

        rsq = r * r
        for (x = cx - r; x <= cx + r; x++)
        {
            for (y = cy - r; y <= cy + r; y++)
            {
                if ((cx - x) ** 2 + (cy - y) ** 2 <= rsq)
                {
                    this.set(img,x,y,fg)
                }
            }
        }
    }

    rounded["fill"] = function (img, x, y, w, h, fg)
    {
        var c, r

        for (r = x; r <= x + w; r++)
        {
            for (c = y; c <= y + h; c++)
            {
                this.set(img,r,c,fg)
            }
        }
    }

    rounded["rect"] = function (w, h, r, fg)
    {
        var img, rh, rw, rx, ry

        img = this.img(w,h)
        rx = r
        ry = r
        rw = w - 2 * r
        rh = h - 2 * r
        this.fill(img,rx,ry,rw,rh,fg)
        return this.encode(img)
    }

    rounded["topLeft"] = function (w, h, fg)
    {
        var img, r

        img = this.img(w,h)
        r = _k_.min(w,h)
        this.circle(img,r,r,r,fg)
        this.fill(img,0,r,w,h,fg)
        return this.encode(img)
    }

    rounded["borderTopLeft"] = function (w, h, fg)
    {
        var h2, img, r

        img = this.img(w,h)
        r = parseInt(w / 2)
        h2 = parseInt(h / 2)
        this.circle(img,w,h2 + r,r,fg)
        this.fill(img,r,h2 + r,r,h - h2 - r,fg)
        return this.encode(img)
    }

    rounded["borderTopRight"] = function (w, h, fg)
    {
        var h2, img, r

        img = this.img(w,h)
        r = parseInt(w / 2) - 1
        h2 = parseInt(h / 2)
        this.circle(img,0,h2 + r,r,fg)
        this.fill(img,0,h2 + r,r,h - h2 - r,fg)
        return this.encode(img)
    }

    rounded["borderBottomLeft"] = function (w, h, fg)
    {
        var h2, img, r

        img = this.img(w,h)
        r = parseInt(w / 2)
        h2 = parseInt(h / 2)
        this.circle(img,w,h2 - r,r,fg)
        this.fill(img,r,0,r,h2 - r,fg)
        return this.encode(img)
    }

    rounded["borderBottomRight"] = function (w, h, fg)
    {
        var h2, img, r

        img = this.img(w,h)
        r = parseInt(w / 2) - 1
        h2 = parseInt(h / 2)
        this.circle(img,0,h2,w,this.shadow)
        this.fill(img,0,0,w,h2,this.shadow)
        this.circle(img,0,h2 - r,r,fg)
        this.fill(img,0,0,r,h2 - r,fg)
        return this.encode(img)
    }

    rounded["borderBottomRightNoShadow"] = function (w, h, fg, bg)
    {
        var h2, img, r

        img = this.img(w,h)
        r = parseInt(w / 2) - 1
        h2 = parseInt(h / 2)
        this.circle(img,0,h2 + r,r,bg)
        this.fill(img,0,h2 + r,r,h - r,bg)
        return this.encode(img)
    }

    rounded["borderBottom"] = function (w, h, fg)
    {
        var h2, img

        img = this.img(w,h)
        h2 = parseInt(h / 2)
        this.fill(img,0,0,w,h2,fg)
        this.fill(img,0,h2 + 1,w,h2,this.shadow)
        return this.encode(img)
    }

    rounded["borderLeftBottom"] = function (w, h, fg)
    {
        var h2, img

        img = this.img(w,h)
        h2 = parseInt(h / 2)
        this.circle(img,w,h2 + 1,w,this.shadow)
        this.fill(img,0,0,w,h2,fg)
        return this.encode(img)
    }

    rounded["borderTop"] = function (w, h, fg)
    {
        var h2, img

        img = this.img(w,h)
        h2 = parseInt(h / 2)
        this.fill(img,0,h2,w,h2,fg)
        return this.encode(img)
    }

    rounded["borderLeft"] = function (w, h, fg)
    {
        var img, w2

        img = this.img(w,h)
        w2 = parseInt(w / 2)
        this.fill(img,w2,0,w2,h,fg)
        return this.encode(img)
    }

    rounded["borderRight"] = function (w, h, fg)
    {
        var img, w2

        img = this.img(w,h)
        w2 = parseInt(w / 2) - 1
        this.fill(img,0,0,w2,h,fg)
        this.fill(img,w2 + 1,0,w2,h,this.shadow)
        return this.encode(img)
    }

    rounded["borderRightTop"] = function (w, h, fg)
    {
        var h2, img, w2

        img = this.img(w,h)
        w2 = parseInt(w / 2) - 1
        h2 = parseInt(h / 2)
        this.circle(img,0,h2,w,this.shadow)
        this.fill(img,0,h2,w,h2,this.shadow)
        this.fill(img,0,0,w2,h,fg)
        return this.encode(img)
    }

    rounded["vertical"] = function (w, h, left, right)
    {
        var img, w2

        img = this.img(w,h)
        w2 = parseInt(w / 2)
        this.fill(img,0,0,w2,h,left)
        this.fill(img,w2 + 1,0,w2,h,right)
        return this.encode(img)
    }

    rounded["horizontal"] = function (w, h, top, bottom)
    {
        var h2, img

        img = this.img(w,h)
        h2 = parseInt(h / 2)
        this.fill(img,0,0,h2,h2,top)
        this.fill(img,0,h2,h2,h2,bottom)
        return this.encode(img)
    }

    rounded["cellRect"] = function (side, w, h, fg)
    {
        var img

        img = this.img(w,h)
        switch (side)
        {
            case 'top':
                this.fill(img,0,0,w,0,fg)
                break
            case 'bottom':
                this.fill(img,0,h - 1,w,0,fg)
                break
            case 'left':
                this.fill(img,0,0,0,h,fg)
                break
            case 'right':
                this.fill(img,w - 1,0,0,h,fg)
                break
        }

        img = this.encode(img)
        img.name = 'cellrect'
        return img
    }

    rounded["cursor"] = function (w, h, fg)
    {
        var img, r

        img = this.img(w,h)
        r = parseInt(w / 2)
        this.circle(img,r,r,r,fg)
        this.circle(img,r,h - r - 1,r,fg)
        this.fill(img,0,r,w,h - w,fg)
        return this.encode(img)
    }

    rounded["multi"] = function (w, h, fg)
    {
        var img

        img = this.img(w,h)
        this.fill(img,0,0,w,h,fg)
        return this.encode(img)
    }

    rounded["place"] = function (x, y, name, fg, xe, ye, z, bg, scale = 1)
    {
        var csz, idpl, img, key, xr, yr

        csz = ked_ttio.cellsz
        if (_k_.empty(csz))
        {
            return
        }
        key = name + fg + scale
        img = this.cache[key]
        if (_k_.empty(img))
        {
            img = ((function ()
            {
                switch (name)
                {
                    case 'rounded.border.tl':
                        return this.borderTopLeft(csz[0],csz[1],fg)

                    case 'rounded.border.tr':
                        return this.borderTopRight(csz[0],csz[1],fg)

                    case 'rounded.border.bl':
                        return this.borderBottomLeft(csz[0],csz[1],fg)

                    case 'rounded.border.br':
                        return this.borderBottomRight(csz[0],csz[1],fg)

                    case 'rounded.border.t':
                        return this.borderTop(csz[0],csz[1],fg)

                    case 'rounded.border.r':
                        return this.borderRight(csz[0],csz[1],fg)

                    case 'rounded.border.l':
                        return this.borderLeft(csz[0],csz[1],fg)

                    case 'rounded.border.b':
                        return this.borderBottom(csz[0],csz[1],fg)

                    case 'rounded.border.rt':
                        return this.borderRightTop(csz[0],csz[1],fg)

                    case 'rounded.border.lb':
                        return this.borderLeftBottom(csz[0],csz[1],fg)

                    case 'rounded.vertical':
                        return this.vertical(csz[0],csz[1],fg,bg)

                    case 'rounded.horizontal':
                        return this.horizontal(csz[0],csz[1],fg,bg)

                    case 'rounded.border.br_ns':
                        return this.borderBottomRightNoShadow(csz[0],csz[1],fg,bg)

                    case 'rounded.cursor':
                        return this.cursor(parseInt(csz[0] / 5) * 2 + 1,csz[1] * scale,fg)

                    case 'rounded.multi':
                        return this.multi(parseInt(csz[0] / 10) * 2 + 1,csz[1] * scale,fg)

                }

            }).bind(this))()
            img.name = name.split('.')[1]
            this.cache[key] = img
        }
        idpl = ((function ()
        {
            switch (name)
            {
                case 'rounded.cursor':
                    return ked_ttio.placeImg(img,x - 1,y,parseInt(9 * csz[0] / 10) + 1,null,null,csz[1] * scale,666)

                case 'rounded.multi':
                    return ked_ttio.placeImg(img,x,y,null,null,null,csz[1] * scale,z)

                default:
                    return ked_ttio.placeImg(img,x,y,null,null,null,null,z)
            }

        }).bind(this))()
        if (xe && xe > x)
        {
            for (xr = x + 1; xr <= xe; xr++)
            {
                ked_ttio.placeImg(img,xr,y,null,null,null,null,z)
            }
        }
        if (ye && ye > y)
        {
            for (yr = y + 1; yr <= ye; yr++)
            {
                ked_ttio.placeImg(img,x,yr,null,null,null,null,z)
            }
        }
        return idpl
    }

    return rounded
})()

export default rounded;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91bmRlZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdXRpbC9pbWcvcm91bmRlZC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ00sVUFBQTs7O0FBQ0wsV0FBRDs7Ozs7SUFDSSxTQUFDO0lBQ0QsU0FBQyxZQUFTLEVBQUUsRUFBRSxFQUFFO0lBSWhCLFNBQUMsa0JBQUssR0FBRTs7OztRQUVKLFdBQVcsWUFBWSxJQUFFLElBQUU7UUFDM0IsV0FBVyxTQUFTO2dCQUVwQixFQUFNLEVBQ04sRUFBTSxFQUNOLEtBQU0sS0FDTixLQUFNOzs7SUFFVixTQUFDLHFCQUFRLEtBQUksWUFBVTs7UUFFbkIsSUFBSSxNQUFNLE9BQU8sS0FBSyxJQUFJLFFBQVEsSUFBSSxNQUFNLElBQUksRUFBRSxJQUFJLEVBQUU7ZUFDeEQ7OztJQUlKLFNBQUMsa0JBQUssS0FBSSxHQUFFLEdBQUU7Ozs7WUFFTCxJQUFJLEtBQUssSUFBSTs7OztZQUNiLEtBQUssSUFBSTs7OztZQUNULEtBQUssSUFBSTs7OzthQUVWLElBQUssT0FBSSxLQUFLOztZQUNkLElBQUksS0FBSyxXQUFXLElBQUUsSUFBRSxJQUFJLEtBQUcsS0FBRyxFQUFFLEtBQUs7O1lBQzFDLEtBQUssV0FBVTs7bUJBQ2IsSUFBSSxLQUFLLFdBQVcsSUFBRSxJQUFFLElBQUksS0FBRyxLQUFHLEVBQUU7Ozs7SUFFN0MsU0FBQyxxQkFBUSxLQUFJLElBQUcsSUFBRyxHQUFFOzs7O1FBRWpCLE1BQU0sSUFBSTthQUNOLElBQUssS0FBRyxRQUFHLEtBQUc7O2lCQUNWLElBQUssS0FBRyxRQUFHLEtBQUc7O3FCQUNWLEtBQUcsTUFBSSxLQUFLLEtBQUcsTUFBSSxLQUFLOztvQkFDeEIsS0FBQyxJQUFJLElBQUksRUFBRSxFQUFFOzs7Ozs7SUFFN0IsU0FBQyxtQkFBTSxLQUFJLEdBQUUsR0FBRSxHQUFFLEdBQUU7Ozs7YUFFWCxJQUFLLFFBQUcsSUFBRTs7aUJBQ04sSUFBSyxRQUFHLElBQUU7O2dCQUNW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
//# sourceURL=../../../../kode/ked/util/img/rounded.kode
