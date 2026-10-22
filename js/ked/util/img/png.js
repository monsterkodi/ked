var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var addErr, compress, compressPNG, concatRGBA, copyTile, crcLib, D, dist, dither, encode, estats, filterLine, filterZero, findNearest, framize, getBPP, getKDtree, getNearest, kmeans, M4, N, paeth, planeDst, prepareDiff, quantize, remap, splitPixels, stats, updateFrame, updatePalette, vecDot

import zlib from "zlib"


getBPP = function (out)
{
    var noc

    noc = [1,null,3,1,2,null,4][out.ctype]
    return noc * out.depth
}

filterZero = function (data, out, off, w, h)
{
    var bpl, bpp, di, i, type, x, y

    bpp = getBPP(out)
    bpl = Math.ceil(w * bpp / 8)
    bpp = Math.ceil(bpp / 8)
    type = data[off]
    x = 0
    if (type > 1)
    {
        data[off] = [0,0,1][type - 2]
    }
    if (type === 3)
    {
        for (var _a_ = x = bpp, _b_ = bpl; (_a_ <= _b_ ? x < bpl : x > bpl); (_a_ <= _b_ ? ++x : --x))
        {
            data[x + 1] = (data[x + 1] + (data[x + 1 - bpp] >>> 1)) & 255
        }
    }
    for (var _c_ = y = 0, _d_ = h; (_c_ <= _d_ ? y < h : y > h); (_c_ <= _d_ ? ++y : --y))
    {
        i = off + y * bpl
        di = i + y + 1
        type = data[di - 1]
        x = 0
        if (type === 0)
        {
            while (x < bpl)
            {
                data[i + x] = data[di + x]
                x++
            }
        }
        else if (type === 1)
        {
            while (x < bpp)
            {
                data[i + x] = data[di + x]
                x++
            }
            while (x < bpl)
            {
                data[i + x] = (data[di + x] + data[i + x - bpp])
                x++
            }
        }
        else if (type === 2)
        {
            while (x < bpl)
            {
                data[i + x] = (data[di + x] + data[i + x - bpl])
                x++
            }
        }
        else if (type === 3)
        {
            while (x < bpp)
            {
                data[i + x] = (data[di + x] + (data[i + x - bpl] >>> 1))
                x++
            }
            while (x < bpl)
            {
                data[i + x] = (data[di + x] + ((data[i + x - bpl] + data[i + x - bpp]) >>> 1))
                x++
            }
        }
        else
        {
            while (x < bpp)
            {
                data[i + x] = (data[di + x] + paeth(0,data[i + x - bpl],0))
                x++
            }
            while (x < bpl)
            {
                data[i + x] = (data[di + x] + paeth(data[i + x - bpp],data[i + x - bpl],data[i + x - bpp - bpl]))
                x++
            }
        }
    }
    return data
}

paeth = function (a, b, c)
{
    var p, pa, pb, pc

    p = a + b - c
    pa = (p - a)
    pb = (p - b)
    pc = (p - c)
    if (pa * pa <= pb * pb && pa * pa <= pc * pc)
    {
        return a
    }
    if (pb * pb <= pc * pc)
    {
        return b
    }
    return c
}

copyTile = function (sb, sw, sh, tb, tw, th, xoff, yoff, mode)
{
    var ba, bb, bg, br, fa, fb, fg, fr, h, ifa, ioa, oa, si, ti, w, x, y

    w = _k_.min(sw,tw)
    h = _k_.min(sh,th)
    si = ti = 0
    for (var _e_ = y = 0, _f_ = h; (_e_ <= _f_ ? y < h : y > h); (_e_ <= _f_ ? ++y : --y))
    {
        for (var _10_ = x = 0, _11_ = w; (_10_ <= _11_ ? x < w : x > w); (_10_ <= _11_ ? ++x : --x))
        {
            if (xoff >= 0 && yoff >= 0)
            {
                si = (y * sw + x) << 2
                ti = ((yoff + y) * tw + xoff + x) << 2
            }
            else
            {
                si = ((-yoff + y) * sw - xoff + x) << 2
                ti = (y * tw + x) << 2
            }
            switch (mode)
            {
                case 0:
                    tb[ti] = sb[si]
                    tb[ti + 1] = sb[si + 1]
                    tb[ti + 2] = sb[si + 2]
                    tb[ti + 3] = sb[si + 3]
                    break
                case 1:
                    fa = sb[si + 3] * (1 / 255)
                    fr = sb[si] * fa
                    fg = sb[si + 1] * fa
                    fb = sb[si + 2] * fa
                    ba = tb[ti + 3] * (1 / 255)
                    br = tb[ti] * ba
                    bg = tb[ti + 1] * ba
                    bb = tb[ti + 2] * ba
                    ifa = 1 - fa
                    oa = fa + ba * ifa
                    ioa = ((oa === 0 ? 0 : 1 / oa))
                    tb[ti + 3] = 255 * oa
                    tb[ti + 0] = (fr + br * ifa) * ioa
                    tb[ti + 1] = (fg + bg * ifa) * ioa
                    tb[ti + 2] = (fb + bb * ifa) * ioa
                    break
                case 2:
                    fa = sb[si + 3]
                    fr = sb[si]
                    fg = sb[si + 1]
                    fb = sb[si + 2]
                    ba = tb[ti + 3]
                    br = tb[ti]
                    bg = tb[ti + 1]
                    bb = tb[ti + 2]
                    if (fa === ba && fr === br && fg === bg && fb === bb)
                    {
                        tb[ti] = 0
                        tb[ti + 1] = 0
                        tb[ti + 2] = 0
                        tb[ti + 3] = 0
                    }
                    else
                    {
                        tb[ti] = fr
                        tb[ti + 1] = fg
                        tb[ti + 2] = fb
                        tb[ti + 3] = fa
                    }
                    break
                case 3:
                    fa = sb[si + 3]
                    fr = sb[si]
                    fg = sb[si + 1]
                    fb = sb[si + 2]
                    ba = tb[ti + 3]
                    br = tb[ti]
                    bg = tb[ti + 1]
                    bb = tb[ti + 2]
                    if (fa === ba && fr === br && fg === bg && fb === bb)
                    {
                        continue
                    }
                    if (fa < 220 && ba > 20)
                    {
                        return false
                    }
                    break
            }

        }
    }
    return true
}
crcLib = {table:(function ()
{
    var c, k, n, tab

    tab = new Uint32Array(256)
    for (n = 0; n < 256; n++)
    {
        c = n
        for (k = 0; k < 8; k++)
        {
            if (c & 1)
            {
                c = 0xedb88320 ^ (c >>> 1)
            }
            else
            {
                c = c >>> 1
            }
        }
        tab[n] = c
    }
    return tab
})(),update:function (c, buf, off, len)
{
    var i

    for (var _12_ = i = 0, _13_ = len; (_12_ <= _13_ ? i < len : i > len); (_12_ <= _13_ ? ++i : --i))
    {
        c = crcLib.table[(c ^ buf[off + i]) & 0xff] ^ (c >>> 8)
    }
    return c
},crc:function (b, o, l)
{
    return crcLib.update(0xffffffff,b,o,l) ^ 0xffffffff
}}

addErr = function (er, tg, ti, f)
{
    tg[ti] += (er[0] * f) >> 4
    tg[ti + 1] += (er[1] * f) >> 4
    tg[ti + 2] += (er[2] * f) >> 4
    return tg[ti + 3] += (er[3] * f) >> 4
}

N = function (x)
{
    return _k_.max(0,_k_.min(255,x))
}

D = function (a, b)
{
    var da, db, dg, dr

    dr = a[0] - b[0]
    dg = a[1] - b[1]
    db = a[2] - b[2]
    da = a[3] - b[3]
    return dr * dr + dg * dg + db * db + da * da
}

dither = function (sb, w, h, plte, tb, oind, MTD)
{
    var c, cc, cd, ce, er, err, hd, i, j, M, nc, nd, ne, ni, nplt, pc, rads, S, tb32, x, y

    MTD = (MTD != null ? MTD : 1)
    pc = plte.length
    nplt = []
    rads = []
    for (var _14_ = i = 0, _15_ = pc; (_14_ <= _15_ ? i < pc : i > pc); (_14_ <= _15_ ? ++i : --i))
    {
        c = plte[i]
        nplt.push([((c >>> 0) & 255),((c >>> 8) & 255),((c >>> 16) & 255),((c >>> 24) & 255)])
    }
    for (var _16_ = i = 0, _17_ = pc; (_16_ <= _17_ ? i < pc : i > pc); (_16_ <= _17_ ? ++i : --i))
    {
        ne = 0xffffffff
        ni = 0
        for (var _18_ = j = 0, _19_ = pc; (_18_ <= _19_ ? j < pc : j > pc); (_18_ <= _19_ ? ++j : --j))
        {
            ce = D(nplt[i],nplt[j])
            if (j !== i && ce < ne)
            {
                ne = ce
                ni = j
            }
        }
        hd = Math.sqrt(ne) / 2
        rads[i] = ~ ~ (hd * hd)
    }
    tb32 = new Uint32Array(tb.buffer)
    err = new Int16Array(w * h * 4)
    S = 4
    M = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5]
    for (var _1a_ = i = 0, _1b_ = M.length; (_1a_ <= _1b_ ? i < M.length : i > M.length); (_1a_ <= _1b_ ? ++i : --i))
    {
        M[i] = 255 * (-0.5 + (M[i] + 0.5) / (S * S))
    }
    for (var _1c_ = y = 0, _1d_ = h; (_1c_ <= _1d_ ? y < h : y > h); (_1c_ <= _1d_ ? ++y : --y))
    {
        for (var _1e_ = x = 0, _1f_ = w; (_1e_ <= _1f_ ? x < w : x > w); (_1e_ <= _1f_ ? ++x : --x))
        {
            i = (y * w + x) * 4
            if (MTD !== 2)
            {
                cc = [N(sb[i] + err[i]),N(sb[i + 1] + err[i + 1]),N(sb[i + 2] + err[i + 2]),N(sb[i + 3] + err[i + 3])]
            }
            else
            {
                ce = M[(y & (S - 1)) * S + (x & (S - 1))]
                cc = [N(sb[i] + ce),N(sb[i + 1] + ce),N(sb[i + 2] + ce),N(sb[i + 3] + ce)]
            }
            ni = 0
            nd = 0xffffff
            for (var _20_ = j = 0, _21_ = pc; (_20_ <= _21_ ? j < pc : j > pc); (_20_ <= _21_ ? ++j : --j))
            {
                cd = D(cc,nplt[j])
                if (cd < nd)
                {
                    nd = cd
                    ni = j
                }
            }
            nc = nplt[ni]
            er = [cc[0] - nc[0],cc[1] - nc[1],cc[2] - nc[2],cc[3] - nc[3]]
            if (MTD === 1)
            {
                if (x !== w - 1)
                {
                }
                addErr(er,err,i + 4,7)
                if (y !== h - 1)
                {
                    if (x !== 0)
                    {
                        addErr(er,err,i + 4 * w - 4,3)
                        addErr(er,err,i + 4 * w,5)
                    }
                    if (x !== w - 1)
                    {
                        addErr(er,err,i + 4 * w + 4,1)
                    }
                }
            }
            oind[i >> 2] = ni
            tb32[i >> 2] = plte[ni]
        }
    }
}

encode = function (bufs, w, h, ps, dels, tabs, forbidPlte)
{
    var anim, b, c, cicc, crc, data, dl, fi, fr, g, i, imgd, ioff, j, leng, nimg, offset, pltAlpha, r, sl, ti, wAs, wr, wUi, wUs, _308_38_

    ps = (ps != null ? ps : 0)
    forbidPlte = (forbidPlte != null ? forbidPlte : false)
    dither = false
    nimg = compress(bufs,w,h,ps,dither)
    compressPNG(nimg,-1)
    tabs = (tabs != null ? tabs : {})
    crc = crcLib.crc
    wUs = function (buff, p, n)
    {
        buff[p] = (n >> 8) & 255
        return buff[p + 1] = n & 255
    }
    wUi = function (buff, p, n)
    {
        buff[p] = (n >> 24) & 255
        buff[p + 1] = (n >> 16) & 255
        buff[p + 2] = (n >> 8) & 255
        return buff[p + 3] = n & 255
    }
    wAs = function (data, p, s)
    {
        var i

        for (var _22_ = i = 0, _23_ = s.length; (_22_ <= _23_ ? i < s.length : i > s.length); (_22_ <= _23_ ? ++i : --i))
        {
            data[p + i] = s.charCodeAt(i)
        }
    }
    offset = 8
    anim = nimg.frames.length > 1
    pltAlpha = false
    leng = 8 + (16 + 5 + 4) + ((anim ? 20 : 0))
    if ((typeof tabs["sRGB"] === "function" ? tabs["sRGB"](leng += 8 + 1 + 4) : undefined))
    {
    }
    if ((typeof tabs["pHYs"] === "function" ? tabs["pHYs"](leng += 8 + 9 + 4) : undefined))
    {
    }
    if ((tabs["iCCP"] != null))
    {
        cicc = zlib.deflateSync(tabs["iCCP"])
        leng += 8 + 11 + 2 + cicc.length + 4
    }
    if (nimg.ctype === 3)
    {
        dl = nimg.plte.length
        for (var _24_ = i = 0, _25_ = dl; (_24_ <= _25_ ? i < dl : i > dl); (_24_ <= _25_ ? ++i : --i))
        {
            if ((nimg.plte[i] >>> 24) !== 255)
            {
                pltAlpha = true
            }
        }
        leng += (8 + dl * 3 + 4) + ((pltAlpha ? (8 + dl * 1 + 4) : 0))
    }
    for (var _26_ = j = 0, _27_ = nimg.frames.length; (_26_ <= _27_ ? j < nimg.frames.length : j > nimg.frames.length); (_26_ <= _27_ ? ++j : --j))
    {
        fr = nimg.frames[j]
        if (anim)
        {
            leng += 38
        }
        leng += fr.cimg.length + 12
        if (j !== 0)
        {
            leng += 4
        }
    }
    leng += 12
    data = new Uint8Array(leng)
    wr = [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]
    for (i = 0; i < 8; i++)
    {
        data[i] = wr[i]
    }
    wUi(data,offset,13)
    offset += 4
    wAs(data,offset,"IHDR")
    offset += 4
    wUi(data,offset,w)
    offset += 4
    wUi(data,offset,h)
    offset += 4
    data[offset] = nimg.depth
    offset++
    data[offset] = nimg.ctype
    offset++
    data[offset] = 0
    offset++
    data[offset] = 0
    offset++
    data[offset] = 0
    offset++
    wUi(data,offset,crc(data,offset - 17,17))
    offset += 4
    if ((tabs["sRGB"] != null))
    {
        wUi(data,offset,1)
        offset += 4
        wAs(data,offset,"sRGB")
        offset += 4
        data[offset] = tabs["sRGB"]
        offset += 1
        wUi(data,offset,crc(data,offset - 5,5))
        offset += 4
    }
    if ((tabs["iCCP"] != null))
    {
        sl = 11 + 2 + cicc.length
        wUi(data,offset,sl)
        offset += 4
        wAs(data,offset,"iCCP")
        offset += 4
        wAs(data,offset,"ICC profile")
        offset += 13
        data.set(cicc,offset)
        offset += cicc.length
        wUi(data,offset,crc(data,offset - (sl + 4),sl + 4))
        offset += 4
    }
    if ((tabs["pHYs"] != null))
    {
        wUi(data,offset,9)
        offset += 4
        wAs(data,offset,"pHYs")
        offset += 4
        wUi(data,offset,tabs["pHYs"][0])
        offset += 4
        wUi(data,offset,tabs["pHYs"][1])
        offset += 4
        data[offset] = tabs["pHYs"][2]
        offset += 1
        wUi(data,offset,crc(data,offset - 13,13))
        offset += 4
    }
    if (anim)
    {
        wUi(data,offset,8)
        offset += 4
        wAs(data,offset,"acTL")
        offset += 4
        wUi(data,offset,nimg.frames.length)
        offset += 4
        wUi(data,offset,(((_308_38_=tabs["loop"]) != null ? _308_38_ : 0)))
        offset += 4
        wUi(data,offset,crc(data,offset - 12,12))
        offset += 4
    }
    if (nimg.ctype === 3)
    {
        dl = nimg.plte.length
        wUi(data,offset,dl * 3)
        offset += 4
        wAs(data,offset,"PLTE")
        offset += 4
        for (var _28_ = i = 0, _29_ = dl; (_28_ <= _29_ ? i < dl : i > dl); (_28_ <= _29_ ? ++i : --i))
        {
            ti = i * 3
            c = nimg.plte[i]
            r = (c) & 255
            g = (c >>> 8) & 255
            b = (c >>> 16) & 255
            data[offset + ti + 0] = r
            data[offset + ti + 1] = g
            data[offset + ti + 2] = b
        }
        offset += dl * 3
        wUi(data,offset,crc(data,offset - dl * 3 - 4,dl * 3 + 4))
        offset += 4
        if (pltAlpha)
        {
            wUi(data,offset,dl)
            offset += 4
            wAs(data,offset,"tRNS")
            offset += 4
            for (var _2a_ = i = 0, _2b_ = dl; (_2a_ <= _2b_ ? i < dl : i > dl); (_2a_ <= _2b_ ? ++i : --i))
            {
                data[offset + i] = (nimg.plte[i] >>> 24) & 255
            }
            offset += dl
            wUi(data,offset,crc(data,offset - dl - 4,dl + 4))
            offset += 4
        }
    }
    fi = 0
    for (var _2c_ = j = 0, _2d_ = nimg.frames.length; (_2c_ <= _2d_ ? j < nimg.frames.length : j > nimg.frames.length); (_2c_ <= _2d_ ? ++j : --j))
    {
        fr = nimg.frames[j]
        if (anim)
        {
            wUi(data,offset,26)
            offset += 4
            wAs(data,offset,"fcTL")
            offset += 4
            wUi(data,offset,fi++)
            offset += 4
            wUi(data,offset,fr.rect.width)
            offset += 4
            wUi(data,offset,fr.rect.height)
            offset += 4
            wUi(data,offset,fr.rect.x)
            offset += 4
            wUi(data,offset,fr.rect.y)
            offset += 4
            wUs(data,offset,dels[j])
            offset += 2
            wUs(data,offset,1000)
            offset += 2
            data[offset] = fr.dispose
            offset += 1
            data[offset] = fr.blend
            offset += 1
            wUi(data,offset,crc(data,offset - 30,30))
            offset += 4
        }
        imgd = fr.cimg
        dl = imgd.length
        wUi(data,offset,dl + ((j === 0 ? 0 : 4)))
        offset += 4
        ioff = offset
        wAs(data,offset,((j === 0 ? "IDAT" : "fdAT")))
        offset += 4
        if (j !== 0)
        {
            wUi(data,offset,fi++)
            offset += 4
        }
        data.set(imgd,offset)
        offset += dl
        wUi(data,offset,crc(data,ioff,offset - ioff))
        offset += 4
    }
    wUi(data,offset,0)
    offset += 4
    wAs(data,offset,"IEND")
    offset += 4
    wUi(data,offset,crc(data,offset - 4,4))
    offset += 4
    return data.buffer
}

compressPNG = function (out, filter, levelZero)
{
    var fdata, frm, i, nh, nw

    for (var _2e_ = i = 0, _2f_ = out.frames.length; (_2e_ <= _2f_ ? i < out.frames.length : i > out.frames.length); (_2e_ <= _2f_ ? ++i : --i))
    {
        frm = out.frames[i]
        nw = frm.rect.width
        nh = frm.rect.height
        fdata = new Uint8Array(nh * frm.bpl + nh)
        frm.cimg = filterZero(frm.img,nh,frm.bpp,frm.bpl,fdata,filter,levelZero)
    }
}

compress = function (bufs, w, h, ps, dith)
{
    var abuf, alphaAnd, area, bb, bln, bpl, bpp, c, cc, cimg, cimg32, cmap, cmc, cof, ctype, depth, evenCrd, forbidPlte, forbidPrev, frm, frms, gotAlpha, i, ii, ilen, img, img32, ind, inds, inj, j, nbufs, nh, nimg, nw, nx, ny, onlyBlend, plte, qi, qres, ti, x, y

    onlyBlend = false
    evenCrd = false
    forbidPrev = false
    forbidPlte = false
    ctype = 6
    depth = 8
    alphaAnd = 255
    for (var _30_ = j = 0, _31_ = bufs.length; (_30_ <= _31_ ? j < bufs.length : j > bufs.length); (_30_ <= _31_ ? ++j : --j))
    {
        img = new Uint8Array(bufs[j])
        ilen = img.length
        i = 0
        while (i < ilen)
        {
            alphaAnd &= img[i + 3]
            i += 4
        }
    }
    gotAlpha = alphaAnd !== 255
    frms = framize(bufs,w,h,onlyBlend,evenCrd,forbidPrev)
    cmap = {}
    plte = []
    inds = []
    if (ps !== 0)
    {
        nbufs = []
        for (var _32_ = i = 0, _33_ = frms.length; (_32_ <= _33_ ? i < frms.length : i > frms.length); (_32_ <= _33_ ? ++i : --i))
        {
            nbufs.push(frms[i].img.buffer)
        }
        abuf = concatRGBA(nbufs)
        qres = quantize(abuf,ps)
        for (var _34_ = i = 0, _35_ = qres.plte.length; (_34_ <= _35_ ? i < qres.plte.length : i > qres.plte.length); (_34_ <= _35_ ? ++i : --i))
        {
            plte.push(qres.plte[i].est.rgba)
        }
        cof = 0
        for (var _36_ = i = 0, _37_ = frms.length; (_36_ <= _37_ ? i < frms.length : i > frms.length); (_36_ <= _37_ ? ++i : --i))
        {
            frm = frms[i]
            bln = frm.img.length
            ind = new Uint8Array(qres.inds.buffer,cof >> 2,bln >> 2)
            inds.push(ind)
            bb = new Uint8Array(qres.abuf,cof,bln)
            if (dith)
            {
                dither(frm.img,frm.rect.width,frm.rect.height,plte,bb,ind)
            }
            frm.img.set(bb)
            cof += bln
        }
    }
    else
    {
        for (var _38_ = j = 0, _39_ = frms.length; (_38_ <= _39_ ? j < frms.length : j > frms.length); (_38_ <= _39_ ? ++j : --j))
        {
            frm = frms[j]
            img32 = new Uint32Array(frm.img.buffer)
            nw = frm.rect.width
            ilen = img32.length
            ind = new Uint8Array(ilen)
            inds.push(ind)
            for (var _3a_ = i = 0, _3b_ = ilen; (_3a_ <= _3b_ ? i < ilen : i > ilen); (_3a_ <= _3b_ ? ++i : --i))
            {
                c = img32[i]
                if (i !== 0 && c === img32[i - 1])
                {
                    ind[i] = ind[i - 1]
                }
                else if (i > nw && c === img32[i - nw])
                {
                    ind[i] = ind[i - nw]
                }
                else
                {
                    cmc = cmap[c]
                    if (cmc === null)
                    {
                        cmap[c] = cmc = plte.length
                        plte.push(c)
                        if (plte.length >= 300)
                        {
                            break
                        }
                    }
                    ind[i] = cmc
                }
            }
        }
    }
    cc = plte.length
    if (cc <= 256 && forbidPlte === false)
    {
        if (cc <= 2)
        {
            depth = 1
        }
        else if (cc <= 4)
        {
            depth = 2
        }
        else if (cc <= 16)
        {
            depth = 4
        }
        else
        {
            depth = 8
        }
        depth = _k_.max(depth,0)
    }
    for (var _3c_ = j = 0, _3d_ = frms.length; (_3c_ <= _3d_ ? j < frms.length : j > frms.length); (_3c_ <= _3d_ ? ++j : --j))
    {
        frm = frms[j]
        nx = frm.rect.x
        ny = frm.rect.y
        nw = frm.rect.width
        nh = frm.rect.height
        cimg = frm.img
        cimg32 = new Uint32Array(cimg.buffer)
        bpl = 4 * nw
        bpp = 4
        if (cc <= 256 && forbidPlte === false)
        {
            bpl = Math.ceil(depth * nw / 8)
            nimg = new Uint8Array(bpl * nh)
            inj = inds[j]
            for (var _3e_ = y = 0, _3f_ = nh; (_3e_ <= _3f_ ? y < nh : y > nh); (_3e_ <= _3f_ ? ++y : --y))
            {
                i = y * bpl
                ii = y * nw
                if (depth === 8)
                {
                    for (var _40_ = x = 0, _41_ = nw; (_40_ <= _41_ ? x < nw : x > nw); (_40_ <= _41_ ? ++x : --x))
                    {
                        nimg[i + (x)] = (inj[ii + x])
                    }
                }
                else if (depth === 4)
                {
                    for (var _42_ = x = 0, _43_ = nw; (_42_ <= _43_ ? x < nw : x > nw); (_42_ <= _43_ ? ++x : --x))
                    {
                        nimg[i + (x >> 1)] |= (inj[ii + x] << (4 - (x & 1) * 4))
                    }
                }
                else if (depth === 2)
                {
                    for (var _44_ = x = 0, _45_ = nw; (_44_ <= _45_ ? x < nw : x > nw); (_44_ <= _45_ ? ++x : --x))
                    {
                        nimg[i + (x >> 2)] |= (inj[ii + x] << (6 - (x & 3) * 2))
                    }
                }
                else if (depth === 1)
                {
                    for (var _46_ = x = 0, _47_ = nw; (_46_ <= _47_ ? x < nw : x > nw); (_46_ <= _47_ ? ++x : --x))
                    {
                        nimg[i + (x >> 3)] |= (inj[ii + x] << (7 - (x & 7) * 1))
                    }
                }
            }
            cimg = nimg
            ctype = 3
            bpp = 1
        }
        else if (gotAlpha === false && frms.length === 1)
        {
            nimg = new Uint8Array(nw * nh * 3)
            area = nw * nh
            for (var _48_ = i = 0, _49_ = area; (_48_ <= _49_ ? i < area : i > area); (_48_ <= _49_ ? ++i : --i))
            {
                ti = i * 3
                qi = i * 4
                nimg[ti] = cimg[qi]
                nimg[ti + 1] = cimg[qi + 1]
                nimg[ti + 2] = cimg[qi + 2]
            }
            cimg = nimg
            ctype = 2
            bpp = 3
            bpl = 3 * nw
        }
        frm.img = cimg
        frm.bpl = bpl
        frm.bpp = bpp
    }
    return {ctype:ctype,depth:depth,plte:plte,frames:frms}
}

framize = function (bufs, w, h, alwaysBlend, evenCrd, forbidPrev)
{
    var area, blend, cimg, cimg32, frm, frms, i, it, j, maX, maY, mix, miX, miy, miY, mx, my, nh, nimg, nw, nx, ny, p32, pimg, r, r0, r1, sarea, tarea, tlim, tstp, x, y

    frms = []
    for (var _4a_ = j = 0, _4b_ = bufs.length; (_4a_ <= _4b_ ? j < bufs.length : j > bufs.length); (_4a_ <= _4b_ ? ++j : --j))
    {
        cimg = new Uint8Array(bufs[j])
        cimg32 = new Uint32Array(cimg.buffer)
        nx = ny = 0
        nw = w
        nh = h
        blend = (alwaysBlend ? 1 : 0)
        if (j !== 0)
        {
            tlim = ((forbidPrev || alwaysBlend || j === 1 || frms[j - 2].dispose !== 0) ? 1 : 2)
            tstp = 0
            tarea = 1e9
            for (var _4c_ = it = 0, _4d_ = tlim; (_4c_ <= _4d_ ? it < tlim : it > tlim); (_4c_ <= _4d_ ? ++it : --it))
            {
                pimg = new Uint8Array(bufs[j - 1 - it])
                p32 = new Uint32Array(bufs[j - 1 - it])
                mix = w
                miy = h
                mx = -1
                my = -1
                for (var _4e_ = y = 0, _4f_ = h; (_4e_ <= _4f_ ? y < h : y > h); (_4e_ <= _4f_ ? ++y : --y))
                {
                    for (var _50_ = x = 0, _51_ = w; (_50_ <= _51_ ? x < w : x > w); (_50_ <= _51_ ? ++x : --x))
                    {
                        i = y * w + x
                        if (cimg32[i] !== p32[i])
                        {
                            if (x < mix)
                            {
                                mix = x
                            }
                            if (x > mx)
                            {
                                mx = x
                            }
                            if (y < miy)
                            {
                                miy = y
                            }
                            if (y > my)
                            {
                                my = y
                            }
                        }
                    }
                }
                if (mx === -1)
                {
                    mix = miy = mx = my = 0
                }
                if (evenCrd)
                {
                    if ((mix & 1) === 1)
                    {
                        mix--
                    }
                    if ((miy & 1) === 1)
                    {
                        miy--
                    }
                }
                sarea = (mx - mix + 1) * (my - miy + 1)
                if (sarea < tarea)
                {
                    tarea = sarea
                    tstp = it
                    nx = mix
                    ny = miy
                    nw = mx - mix + 1
                    nh = my - miy + 1
                }
            }
            pimg = new Uint8Array(bufs[j - 1 - tstp])
            if (tstp === 1)
            {
                frms[j - 1].dispose = 2
            }
            nimg = new Uint8Array(nw * nh * 4)
            copyTile(pimg,w,h,nimg,nw,nh,-nx,-ny,0)
            blend = (copyTile(cimg,w,h,nimg,nw,nh,-nx,-ny,3) ? 1 : 0)
            if (blend === 1)
            {
                prepareDiff(cimg,w,h,nimg,{x:nx,y:ny,width:nw,height:nh})
            }
            else
            {
                copyTile(cimg,w,h,nimg,nw,nh,-nx,-ny,0)
            }
        }
        else
        {
            nimg = cimg.slice(0)
        }
        frms.push({rect:{x:nx,y:ny,width:nw,height:nh},img:nimg,blend:blend,dispose:0})
    }
    if (alwaysBlend)
    {
        for (var _52_ = j = 0, _53_ = frms.length; (_52_ <= _53_ ? j < frms.length : j > frms.length); (_52_ <= _53_ ? ++j : --j))
        {
            frm = frms[j]
            if (frm.blend === 1)
            {
                continue
            }
            r0 = frm.rect
            r1 = frms[j - 1].rect
            miX = _k_.min(r0.x,r1.x)
            miY = _k_.min(r0.y,r1.y)
            maX = _k_.max(r0.x + r0.width,r1.x + r1.width)
            maY = _k_.max(r0.y + r0.height,r1.y + r1.height)
            r = {x:miX,y:miY,width:maX - miX,height:maY - miY}
            frms[j - 1].dispose = 1
            if (j - 1 !== 0)
            {
                updateFrame(bufs,w,h,frms,j - 1,r,evenCrd)
                updateFrame(bufs,w,h,frms,j,r,evenCrd)
            }
        }
    }
    area = 0
    if (bufs.length !== 1)
    {
        for (var _54_ = i = 0, _55_ = frms.length; (_54_ <= _55_ ? i < frms.length : i > frms.length); (_54_ <= _55_ ? ++i : --i))
        {
            frm = frms[i]
            area += frm.rect.width * frm.rect.height
        }
    }
    return frms
}

updateFrame = function (bufs, w, h, frms, i, r, evenCrd)
{
    var cc, cimg, cimg32, cx, cy, fr, j, mix, miy, mxx, mxy, nimg, pimg, pimg32, U32, U8, x, y

    U8 = Uint8Array
    U32 = Uint32Array
    pimg = new U8(bufs[i - 1])
    pimg32 = new U32(bufs[i - 1])
    nimg = ((i + 1 < bufs.length) ? new U8(bufs[i + 1]) : null)
    cimg = new U8(bufs[i])
    cimg32 = new U32(cimg.buffer)
    mix = w
    miy = h
    mxx = -1
    mxy = -1
    for (var _56_ = y = 0, _57_ = r.height; (_56_ <= _57_ ? y < r.height : y > r.height); (_56_ <= _57_ ? ++y : --y))
    {
        for (var _58_ = x = 0, _59_ = r.width; (_58_ <= _59_ ? x < r.width : x > r.width); (_58_ <= _59_ ? ++x : --x))
        {
            cx = r.x + x
            cy = r.y + y
            j = cy * w + cx
            cc = cimg32[j]
            if (cc === 0 || (frms[i - 1].dispose === 0 && pimg32[j] === cc && (nimg === null || nimg[j * 4 + 3] !== 0)))
            {
                true
            }
            else
            {
                if (cx < mix)
                {
                    mix = cx
                }
                if (cx > mxx)
                {
                    mxx = cx
                }
                if (cy < miy)
                {
                    miy = cy
                }
                if (cy > mxy)
                {
                    mxy = cy
                }
            }
        }
    }
    if (mxx === -1)
    {
        mix = miy = mxx = mxy = 0
    }
    if (evenCrd)
    {
        if ((mix & 1) === 1)
        {
            mix--
        }
        if ((miy & 1) === 1)
        {
            miy--
        }
    }
    r = {x:mix,y:miy,width:mxx - mix + 1,height:mxy - miy + 1}
    fr = frms[i]
    fr.rect = r
    fr.blend = 1
    fr.img = new Uint8Array(r.width * r.height * 4)
    if (frms[i - 1].dispose === 0)
    {
        copyTile(pimg,w,h,fr.img,r.width,r.height,-r.x,-r.y,0)
        return prepareDiff(cimg,w,h,fr.img,r)
    }
    else
    {
        return copyTile(cimg,w,h,fr.img,r.width,r.height,-r.x,-r.y,0)
    }
}

prepareDiff = function (cimg, w, h, nimg, rec)
{
    return copyTile(cimg,w,h,nimg,rec.width,rec.height,-rec.x,-rec.y,2)
}

filterZero = function (img, h, bpp, bpl, data, filter, levelZero)
{
    var fls, ftry, i, opts, ti, tsize, y

    fls = []
    ftry = [0,1,2,3,4]
    if (filter !== -1)
    {
        ftry = [filter]
    }
    else if (h * bpl > 500000 || bpp === 1)
    {
        ftry = [0]
    }
    if (levelZero)
    {
        opts = {level:0}
    }
    for (var _5a_ = i = 0, _5b_ = ftry.length; (_5a_ <= _5b_ ? i < ftry.length : i > ftry.length); (_5a_ <= _5b_ ? ++i : --i))
    {
        for (var _5c_ = y = 0, _5d_ = h; (_5c_ <= _5d_ ? y < h : y > h); (_5c_ <= _5d_ ? ++y : --y))
        {
            filterLine(data,img,y,bpl,bpp,ftry[i])
        }
        fls.push(zlib.deflateSync(data,opts))
    }
    tsize = 1e9
    for (var _5e_ = i = 0, _5f_ = fls.length; (_5e_ <= _5f_ ? i < fls.length : i > fls.length); (_5e_ <= _5f_ ? ++i : --i))
    {
        if (fls[i].length < tsize)
        {
            ti = i
            tsize = fls[i].length
        }
    }
    return fls[ti]
}

filterLine = function (data, img, y, bpl, bpp, type)
{
    var di, i, x

    i = y * bpl
    di = i + y
    data[di] = type
    di++
    if (type === 0)
    {
        if (bpl < 500)
        {
            for (var _60_ = x = 0, _61_ = bpl; (_60_ <= _61_ ? x < bpl : x > bpl); (_60_ <= _61_ ? ++x : --x))
            {
                data[di + x] = img[i + x]
            }
        }
        else
        {
            return data.set(new Uint8Array(img.buffer,i,bpl)(di))
        }
    }
    else if (type === 1)
    {
        for (var _62_ = x = 0, _63_ = bpp; (_62_ <= _63_ ? x < bpp : x > bpp); (_62_ <= _63_ ? ++x : --x))
        {
            data[di + x] = img[i + x]
        }
        for (var _64_ = x = bpp, _65_ = bpl; (_64_ <= _65_ ? x < bpl : x > bpl); (_64_ <= _65_ ? ++x : --x))
        {
            data[di + x] = (img[i + x] - img[i + x - bpp] + 256) & 255
        }
    }
    else if (y === 0)
    {
        for (var _66_ = x = 0, _67_ = bpp; (_66_ <= _67_ ? x < bpp : x > bpp); (_66_ <= _67_ ? ++x : --x))
        {
            data[di + x] = img[i + x]
        }
        if (type === 2)
        {
            for (var _68_ = x = bpp, _69_ = bpl; (_68_ <= _69_ ? x < bpl : x > bpl); (_68_ <= _69_ ? ++x : --x))
            {
                data[di + x] = img[i + x]
            }
        }
        if (type === 3)
        {
            for (var _6a_ = x = bpp, _6b_ = bpl; (_6a_ <= _6b_ ? x < bpl : x > bpl); (_6a_ <= _6b_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] - (img[i + x - bpp] >> 1) + 256) & 255
            }
        }
        if (type === 4)
        {
            for (var _6c_ = x = bpp, _6d_ = bpl; (_6c_ <= _6d_ ? x < bpl : x > bpl); (_6c_ <= _6d_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] - paeth(img[i + x - bpp],0,0) + 256) & 255
            }
        }
    }
    else
    {
        if (type === 2)
        {
            for (var _6e_ = x = 0, _6f_ = bpl; (_6e_ <= _6f_ ? x < bpl : x > bpl); (_6e_ <= _6f_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] + 256 - img[i + x - bpl]) & 255
            }
        }
        if (type === 3)
        {
            for (var _70_ = x = 0, _71_ = bpp; (_70_ <= _71_ ? x < bpp : x > bpp); (_70_ <= _71_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] + 256 - (img[i + x - bpl] >> 1)) & 255
            }
            for (var _72_ = x = bpp, _73_ = bpl; (_72_ <= _73_ ? x < bpl : x > bpl); (_72_ <= _73_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] + 256 - ((img[i + x - bpl] + img[i + x - bpp]) >> 1)) & 255
            }
        }
        if (type === 4)
        {
            for (var _74_ = x = 0, _75_ = bpp; (_74_ <= _75_ ? x < bpp : x > bpp); (_74_ <= _75_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] + 256 - paeth(0,img[i + x - bpl],0)) & 255
            }
            for (var _76_ = x = bpp, _77_ = bpl; (_76_ <= _77_ ? x < bpl : x > bpl); (_76_ <= _77_ ? ++x : --x))
            {
                data[di + x] = (img[i + x] + 256 - paeth(img[i + x - bpp],img[i + x - bpl],img[i + x - bpp - bpl])) & 255
            }
        }
    }
}

quantize = function (abuf, ps, doKmeans)
{
    var a, b, ce, cl32, clr8, g, i, inds, K, KD, le, leafs, len, nd, r, root, sb, tb, tb32

    sb = new Uint8Array(abuf)
    tb = sb.slice(0)
    tb32 = new Uint32Array(tb.buffer)
    KD = getKDtree(tb,ps)
    root = KD[0]
    leafs = KD[1]
    K = leafs.length
    cl32 = new Uint32Array(K)
    clr8 = new Uint8Array(cl32.buffer)
    for (var _78_ = i = 0, _79_ = K; (_78_ <= _79_ ? i < K : i > K); (_78_ <= _79_ ? ++i : --i))
    {
        cl32[i] = leafs[i].est.rgba
    }
    len = sb.length
    inds = new Uint8Array(len >> 2)
    if (K <= 60)
    {
        findNearest(sb,inds,clr8)
        remap(inds,tb32,cl32)
    }
    else if (sb.length < 32e6)
    {
        i = 0
        while (i < len)
        {
            r = sb[i] * (1 / 255)
            g = sb[i + 1] * (1 / 255)
            b = sb[i + 2] * (1 / 255)
            a = sb[i + 3] * (1 / 255)
            nd = getNearest(root,r,g,b,a)
            inds[i >> 2] = nd.ind
            tb32[i >> 2] = nd.est.rgba
            i += 4
        }
    }
    else
    {
        i = 0
        while (i < len)
        {
            r = sb[i] * (1 / 255)
            g = sb[i + 1] * (1 / 255)
            b = sb[i + 2] * (1 / 255)
            a = sb[i + 3] * (1 / 255)
            nd = root
            while (nd.left)
            {
                nd = ((planeDst(nd.est,r,g,b,a) <= 0) ? nd.left : nd.right)
            }
            inds[i >> 2] = nd.ind
            tb32[i >> 2] = nd.est.rgba
            i += 4
        }
    }
    if (doKmeans || sb.length * K < 4e7)
    {
        le = 1e9
        for (i = 0; i < 10; i++)
        {
            ce = kmeans(sb,inds,clr8)
            if (ce / le > 0.997)
            {
                break
            }
            le = ce
        }
        for (var _7a_ = i = 0, _7b_ = K; (_7a_ <= _7b_ ? i < K : i > K); (_7a_ <= _7b_ ? ++i : --i))
        {
            leafs[i].est.rgba = cl32[i]
        }
        remap(inds,tb32,cl32)
    }
    return {abuf:tb.buffer,inds:inds,plte:leafs}
}

remap = function (inds, tb32, pl32)
{
    var i

    for (var _7c_ = i = 0, _7d_ = inds.length; (_7c_ <= _7d_ ? i < inds.length : i > inds.length); (_7c_ <= _7d_ ? ++i : --i))
    {
        tb32[i] = pl32[inds[i]]
    }
}

kmeans = function (sb, inds, plte)
{
    updatePalette(sb,inds,plte)
    return findNearest(sb,inds,plte)
}

updatePalette = function (sb, inds, plte)
{
    var cnts, i, ind, K, qi, sums

    K = plte.length >>> 2
    sums = new Uint32Array(K * 4)
    cnts = new Uint32Array(K)
    i = 0
    while (i < sb.length)
    {
        ind = inds[i >>> 2]
        qi = ind * 4
        cnts[ind]++
        sums[qi] += sb[i]
        sums[qi + 1] += sb[i + 1]
        sums[qi + 2] += sb[i + 2]
        sums[qi + 3] += sb[i + 3]
        i += 4
    }
    for (var _7e_ = i = 0, _7f_ = plte.length; (_7e_ <= _7f_ ? i < plte.length : i > plte.length); (_7e_ <= _7f_ ? ++i : --i))
    {
        plte[i] = Math.round(sums[i] / cnts[i >>> 2])
    }
}

findNearest = function (sb, inds, plte)
{
    var a, b, da, db, dg, dr, err, g, i, j, K, nd, qi, qj, r, te, terr, ti

    terr = 0
    K = plte.length >>> 2
    nd = []
    for (var _80_ = i = 0, _81_ = K; (_80_ <= _81_ ? i < K : i > K); (_80_ <= _81_ ? ++i : --i))
    {
        qi = i * 4
        r = plte[qi]
        g = plte[qi + 1]
        b = plte[qi + 2]
        a = plte[qi + 3]
        ti = 0
        te = 1e9
        for (var _82_ = j = 0, _83_ = K; (_82_ <= _83_ ? j < K : j > K); (_82_ <= _83_ ? ++j : --j))
        {
            if (i === j)
            {
                continue
            }
            qj = j * 4
            dr = r - plte[qj]
            dg = g - plte[qj + 1]
            db = b - plte[qj + 2]
            da = a - plte[qj + 3]
            err = dr * dr + dg * dg + db * db + da * da
            if (err < te)
            {
                te = err
                ti = j
            }
        }
        nd[i] = Math.sqrt(te) * 0.5
        nd[i] = nd[i] * nd[i]
    }
    i = 0
    while (i < sb.length)
    {
        r = sb[i]
        g = sb[i + 1]
        b = sb[i + 2]
        a = sb[i + 3]
        ti = inds[i >>> 2]
        qi = ti * 4
        dr = r - plte[qi]
        dg = g - plte[qi + 1]
        db = b - plte[qi + 2]
        da = a - plte[qi + 3]
        te = dr * dr + dg * dg + db * db + da * da
        if (te > nd[ti])
        {
            for (var _84_ = j = 0, _85_ = K; (_84_ <= _85_ ? j < K : j > K); (_84_ <= _85_ ? ++j : --j))
            {
                qi = j * 4
                dr = r - plte[qi]
                dg = g - plte[qi + 1]
                db = b - plte[qi + 2]
                da = a - plte[qi + 3]
                err = dr * dr + dg * dg + db * db + da * da
                if (err < te)
                {
                    te = err
                    ti = j
                    if (te < nd[j])
                    {
                        break
                    }
                }
            }
        }
        inds[i >>> 2] = ti
        terr += te
        i += 4
    }
    return terr / (sb.length >>> 2)
}

getKDtree = function (nimg, ps, err)
{
    var i, leafs, ln, maxL, mi, nimg32, node, rn, root, s0, s0wrong

    err = (err != null ? err : 0.0001)
    nimg32 = new Uint32Array(nimg.buffer)
    root = {i0:0,i1:nimg.length,bst:null,est:null,tdst:0,left:null,right:null}
    root.bst = stats(nimg,root.i0,root.i1)
    root.est = estats(root.bst)
    leafs = [root]
    while (leafs.length < ps)
    {
        maxL = 0
        mi = 0
        for (var _86_ = i = 0, _87_ = leafs.length; (_86_ <= _87_ ? i < leafs.length : i > leafs.length); (_86_ <= _87_ ? ++i : --i))
        {
            if (leafs[i].est.L > maxL)
            {
                maxL = leafs[i].est.L
                mi = i
            }
        }
        if (maxL < err)
        {
            break
        }
        node = leafs[mi]
        s0 = splitPixels(nimg,nimg32,node.i0,node.i1,node.est.e,node.est.eMq255)
        s0wrong = node.i0 >= s0 || node.i1 <= s0
        if (s0wrong)
        {
            node.est.L = 0
            continue
        }
        ln = {i0:node.i0,i1:s0,bst:null,est:null,tdst:0,left:null,right:null}
        ln.bst = stats(nimg,ln.i0,ln.i1)
        ln.est = estats(ln.bst)
        rn = {i0:s0,i1:node.i1,bst:null,est:null,tdst:0,left:null,right:null}
        rn.bst = {R:[],m:[],N:node.bst.N - ln.bst.N}
        for (i = 0; i < 16; i++)
        {
            rn.bst.R[i] = node.bst.R[i] - ln.bst.R[i]
        }
        for (i = 0; i < 4; i++)
        {
            rn.bst.m[i] = node.bst.m[i] - ln.bst.m[i]
        }
        rn.est = estats(rn.bst)
        node.left = ln
        node.right = rn
        leafs[mi] = ln
        leafs.push(rn)
    }
    leafs.sort(function (a, b)
    {
        return b.bst.N - a.bst.N
    })
    for (var _88_ = i = 0, _89_ = leafs.length; (_88_ <= _89_ ? i < leafs.length : i > leafs.length); (_88_ <= _89_ ? ++i : --i))
    {
        leafs[i].ind = i
    }
    return [root,leafs]
}

getNearest = function (nd, r, g, b, a)
{
    var ln, node0, node1, pd, rn

    if (nd.left === null)
    {
        nd.tdst = dist(nd.est.q,r,g,b,a)
        return nd
    }
    pd = planeDst(nd.est,r,g,b,a)
    node0 = nd.left
    node1 = nd.right
    if (pd > 0)
    {
        node0 = nd.right
        node1 = nd.left
    }
    ln = getNearest(node0,r,g,b,a)
    if (ln.tdst <= pd * pd)
    {
        return ln
    }
    rn = getNearest(node1,r,g,b,a)
    return ((rn.tdst < ln.tdst) ? rn : ln)
}

planeDst = function (est, r, g, b, a)
{
    var e

    e = est.e
    return e[0] * r + e[1] * g + e[2] * b + e[3] * a - est.eMq
}

dist = function (q, r, g, b, a)
{
    var d0, d1, d2, d3

    d0 = r - q[0]
    d1 = g - q[1]
    d2 = b - q[2]
    d3 = a - q[3]
    return d0 * d0 + d1 * d1 + d2 * d2 + d3 * d3
}

splitPixels = function (nimg, nimg32, i0, i1, e, eMq)
{
    var shfs, t

    i1 -= 4
    shfs = 0
    while (i0 < i1)
    {
        while (vecDot(nimg,i0,e) <= eMq)
        {
            i0 += 4
        }
        while (vecDot(nimg,i1,e) > eMq)
        {
            i1 -= 4
        }
        if (i0 >= i1)
        {
            break
        }
        t = nimg32[i0 >> 2]
        nimg32[i0 >> 2] = nimg32[i1 >> 2]
        nimg32[i1 >> 2] = t
        i0 += 4
        i1 -= 4
    }
    while (vecDot(nimg,i0,e) > eMq)
    {
        i0 -= 4
    }
    return i0 + 4
}

vecDot = function (nimg, i, e)
{
    return nimg[i] * e[0] + nimg[i + 1] * e[1] + nimg[i + 2] * e[2] + nimg[i + 3] * e[3]
}

stats = function (nimg, i0, i1)
{
    var a, b, g, i, m, r, R

    R = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    m = [0,0,0,0]
    N = (i1 - i0) >> 2
    i = i0
    while (i < i1)
    {
        r = nimg[i] * (1 / 255)
        g = nimg[i + 1] * (1 / 255)
        b = nimg[i + 2] * (1 / 255)
        a = nimg[i + 3] * (1 / 255)
        m[0] += r
        m[1] += g
        m[2] += b
        m[3] += a
        R[0] += r * r
        R[1] += r * g
        R[2] += r * b
        R[3] += r * a
        R[5] += g * g
        R[6] += g * b
        R[7] += g * a
        R[10] += b * b
        R[11] += b * a
        R[15] += a * a
        i += 4
    }
    R[4] = R[1]
    R[8] = R[2]
    R[9] = R[6]
    R[12] = R[3]
    R[13] = R[7]
    R[14] = R[11]
    return {R:R,m:m,N:N}
}

estats = function (stats)
{
    var A, b, eMq255, i, iN, m, M, m0, m1, m2, m3, mi, q, R, Rj, tmi

    R = stats.R
    m = stats.m
    N = stats.N
    m0 = m[0]
    m1 = m[1]
    m2 = m[2]
    m3 = m[3]
    iN = ((N === 0 ? 0 : 1 / N))
    Rj = [R[0] - m0 * m0 * iN,R[1] - m0 * m1 * iN,R[2] - m0 * m2 * iN,R[3] - m0 * m3 * iN,R[4] - m1 * m0 * iN,R[5] - m1 * m1 * iN,R[6] - m1 * m2 * iN,R[7] - m1 * m3 * iN,R[8] - m2 * m0 * iN,R[9] - m2 * m1 * iN,R[10] - m2 * m2 * iN,R[11] - m2 * m3 * iN,R[12] - m3 * m0 * iN,R[13] - m3 * m1 * iN,R[14] - m3 * m2 * iN,R[15] - m3 * m3 * iN]
    A = Rj
    M = M4
    b = [Math.random(),Math.random(),Math.random(),Math.random()]
    mi = tmi = 0
    if (N !== 0)
    {
        for (i = 0; i < 16; i++)
        {
            b = M.multVec(A,b)
            tmi = Math.sqrt(M.dot(b,b))
            b = M.sml(1 / tmi,b)
            if (i !== 0 && Math.abs(tmi - mi) < 1e-9)
            {
                break
            }
            mi = tmi
        }
    }
    q = [m0 * iN,m1 * iN,m2 * iN,m3 * iN]
    eMq255 = M.dot(M.sml(255,q),b)
    return {Cov:Rj,q:q,e:b,L:mi,eMq255:eMq255,eMq:M.dot(b,q),rgba:(((Math.round(255 * q[3]) << 24) | (Math.round(255 * q[2]) << 16) | (Math.round(255 * q[1]) << 8) | (Math.round(255 * q[0]) << 0)) >>> 0)}
}
M4 = {multVec:function (m, v)
{
    return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3] * v[3],m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7] * v[3],m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11] * v[3],m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3]]
},dot:function (x, y)
{
    return x[0] * y[0] + x[1] * y[1] + x[2] * y[2] + x[3] * y[3]
},sml:function (a, y)
{
    return [a * y[0],a * y[1],a * y[2],a * y[3]]
}}

concatRGBA = function (bufs)
{
    var a, b, g, i, il, img, j, nimg, noff, r, tlen

    tlen = 0
    for (var _8a_ = i = 0, _8b_ = bufs.length; (_8a_ <= _8b_ ? i < bufs.length : i > bufs.length); (_8a_ <= _8b_ ? ++i : --i))
    {
        tlen += bufs[i].byteLength
    }
    nimg = new Uint8Array(tlen)
    noff = 0
    for (var _8c_ = i = 0, _8d_ = bufs.length; (_8c_ <= _8d_ ? i < bufs.length : i > bufs.length); (_8c_ <= _8d_ ? ++i : --i))
    {
        img = new Uint8Array(bufs[i])
        il = img.length
        j = 0
        while (j < il)
        {
            r = img[j]
            g = img[j + 1]
            b = img[j + 2]
            a = img[j + 3]
            if (a === 0)
            {
                r = g = b = 0
            }
            nimg[noff + j] = r
            nimg[noff + j + 1] = g
            nimg[noff + j + 2] = b
            nimg[noff + j + 3] = a
            j += 4
        }
        noff += il
    }
    return nimg.buffer
}
export default {encode:encode};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG5nLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC91dGlsL2ltZy9wbmcua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQWFBLG1CQUFTOzs7O0lBRUwsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxHQUFHLElBQUk7V0FDaEMsTUFBTSxJQUFJOzs7QUFFZCx1QkFBYSxNQUFLLEtBQUksS0FBSSxHQUFFOzs7O0lBRXhCLE1BQU0sT0FBTztJQUNiLGdCQUFXLElBQUUsTUFBSTtJQUNqQixnQkFBVyxNQUFJO0lBRWYsT0FBTyxLQUFLO0lBQ1osSUFBSTtRQUVELE9BQU87O1FBQUksS0FBSyxRQUFRLEVBQUUsRUFBRSxHQUFHLE9BQUs7O1FBQ3BDLFNBQVE7O3VCQUNILElBQUssV0FBTSx1QkFBQSxVQUFBOztZQUNYLEtBQUssSUFBRSxNQUFNLEtBQUssSUFBRSxNQUFNLEtBQUssSUFBRSxJQUFFLFNBQU8sTUFBSTs7O21CQUVsRCxJQUFLLFNBQUkscUJBQUEsUUFBQTs7UUFDVCxJQUFPLE1BQUksSUFBRTtRQUNiLEtBQU8sSUFBRSxJQUFFO1FBQ1gsT0FBTyxLQUFLLEtBQUc7UUFDZixJQUFPO1lBRUgsU0FBTTs7bUJBQ1EsSUFBRTs7Z0JBQU0sS0FBSyxJQUFFLEtBQU0sS0FBSyxLQUFHO2dCQUFJOzs7aUJBQy9DLFNBQU07O21CQUNRLElBQUU7O2dCQUFNLEtBQUssSUFBRSxLQUFNLEtBQUssS0FBRztnQkFBSTs7bUJBQ2pDLElBQUU7O2dCQUFNLEtBQUssSUFBRSxNQUFNLEtBQUssS0FBRyxLQUFLLEtBQUssSUFBRSxJQUFFO2dCQUFPOzs7aUJBQ2hFLFNBQU07O21CQUNRLElBQUU7O2dCQUFNLEtBQUssSUFBRSxNQUFNLEtBQUssS0FBRyxLQUFLLEtBQUssSUFBRSxJQUFFO2dCQUFPOzs7aUJBQ2hFLFNBQU07O21CQUNRLElBQUU7O2dCQUFNLEtBQUssSUFBRSxNQUFNLEtBQUssS0FBRyxNQUFPLEtBQUssSUFBRSxJQUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/img/png.kode
