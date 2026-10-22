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
        for (var _a_ = i = 0, _b_ = rgba.length; (_a_ <= _b_ ? i < rgba.length : i > rgba.length); (_a_ <= _b_ ? ++i : --i))
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
        for (var _a_ = x = cx - r, _b_ = cx + r; (_a_ <= _b_ ? x <= cx + r : x >= cx + r); (_a_ <= _b_ ? ++x : --x))
        {
            for (var _c_ = y = cy - r, _d_ = cy + r; (_c_ <= _d_ ? y <= cy + r : y >= cy + r); (_c_ <= _d_ ? ++y : --y))
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

        for (var _a_ = r = x, _b_ = x + w; (_a_ <= _b_ ? r <= x + w : r >= x + w); (_a_ <= _b_ ? ++r : --r))
        {
            for (var _c_ = c = y, _d_ = y + h; (_c_ <= _d_ ? c <= y + h : c >= y + h); (_c_ <= _d_ ? ++c : --c))
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

    rounded["place"] = function (x, y, name, fg, xe, ye, z, bg)
    {
        var csz, img, key, xr, yr

        csz = ked_ttio.cellsz
        if (_k_.empty(csz))
        {
            return
        }
        key = name + fg
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
                        return this.cursor(parseInt(csz[0] / 5) * 2 + 1,csz[1],fg)

                    case 'rounded.multi':
                        return this.multi(parseInt(csz[0] / 10) * 2 + 1,csz[1],fg)

                }

            }).bind(this))()
            this.cache[key] = img
        }
        switch (name)
        {
            case 'rounded.cursor':
                ked_ttio.placeImg(img,x - 1,y,parseInt(9 * csz[0] / 10) + 1,null,null,null,666)
                break
            default:
                ked_ttio.placeImg(img,x,y,null,null,null,null,z)
        }

        if (xe && xe > x)
        {
            for (var _a_ = xr = x + 1, _b_ = xe; (_a_ <= _b_ ? xr <= xe : xr >= xe); (_a_ <= _b_ ? ++xr : --xr))
            {
                ked_ttio.placeImg(img,xr,y,null,null,null,null,z)
            }
        }
        if (ye && ye > y)
        {
            for (var _c_ = yr = y + 1, _d_ = ye; (_c_ <= _d_ ? yr <= ye : yr >= ye); (_c_ <= _d_ ? ++yr : --yr))
            {
                ked_ttio.placeImg(img,x,yr,null,null,null,null,z)
            }
        }
    }

    return rounded
})()

export default rounded;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91bmRlZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdXRpbC9pbWcvcm91bmRlZC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBVVMsV0FBVDs7Ozs7O3lCQUdjLEVBQUUsRUFBRSxFQUFFO2FBUWhCLGtCQUFNLEdBQUU7Ozs7UUFFSixXQUFXLFlBQVksSUFBRSxJQUFFO1FBQzNCLFdBQVcsU0FBUztnQkFFcEIsRUFBTSxFQUNOLEVBQU0sRUFDTixLQUFNLEtBQ04sS0FBTTs7O2FBRVYscUJBQVMsS0FBSTs7UUFFVCxJQUFJLE1BQU0sT0FBTyxLQUFLLElBQUksUUFBUSxJQUFJLE1BQU0sSUFBSSxFQUFFLElBQUksRUFBRTtlQUN4RDs7O2FBUUosa0JBQU0sS0FBSSxHQUFFLEdBQUU7Ozs7WUFFSixJQUFJLEtBQUssSUFBSTs7OztZQUNiLEtBQUssSUFBSTs7OztZQUNULEtBQUssSUFBSTs7Ozt1QkFFWCxJQUFLLFNBQUksS0FBSywwQkFBTCxLQUFLLGFBQUwsS0FBSzs7WUFDZCxJQUFJLEtBQUssV0FBVyxJQUFFLElBQUUsSUFBSSxLQUFHLEtBQUcsRUFBRSxLQUFLOztZQUMxQyxLQUFLLFdBQVU7O21CQUNiLElBQUksS0FBSyxXQUFXLElBQUUsSUFBRSxJQUFJLEtBQUcsS0FBRyxFQUFFOzs7O2FBRTdDLHFCQUFTLEtBQUksSUFBRyxJQUFHLEdBQUU7Ozs7UUFFakIsTUFBTSxJQUFJO3VCQUNOLElBQUssS0FBRyxTQUFHLEtBQUcsc0JBQUgsS0FBRyxTQUFILEtBQUc7OzJCQUNWLElBQUssS0FBRyxTQUFHLEtBQUcsc0JBQUgsS0FBRyxTQUFILEtBQUc7O3FCQUNWLEtBQUcsTUFBSSxLQUFLLEtBQUcsTUFBSSxLQUFLOztvQkFDeEIsS0FBQyxJQUFJLElBQUksRUFBRSxFQUFFOzs7Ozs7YUFFN0IsbUJBQU8sS0FBSSxHQUFFLEdBQUUsR0FBRSxHQUFFOzs7O3VCQUVYLElBQUssU0FBRyxJQUFFLHNCQUFGLElBQUUsU0FBRixJQUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/img/rounded.kode
