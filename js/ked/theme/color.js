var _k_ = {isArr: function (o) {return Array.isArray(o)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var color, key, val

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let randRange = kxk.randRange

import belt from "../edit/tool/belt.js"


color = (function ()
{
    function color ()
    {}

    color["readabilityCache"] = {}
    color["ansi256"] = ['#000000','#800000','#008000','#808000','#000080','#800080','#008080','#c0c0c0','#808080','#ff0000','#00ff00','#ffff00','#0000ff','#ff00ff','#00ffff','#ffffff','#000000','#00005f','#000087','#0000af','#0000d7','#0000ff','#005f00','#005f5f','#005f87','#005faf','#005fd7','#005fff','#008700','#00875f','#008787','#0087af','#0087d7','#0087ff','#00af00','#00af5f','#00af87','#00afaf','#00afd7','#00afff','#00d700','#00d75f','#00d787','#00d7af','#00d7d7','#00d7ff','#00ff00','#00ff5f','#00ff87','#00ffaf','#00ffd7','#00ffff','#5f0000','#5f005f','#5f0087','#5f00af','#5f00d7','#5f00ff','#5f5f00','#5f5f5f','#5f5f87','#5f5faf','#5f5fd7','#5f5fff','#5f8700','#5f875f','#5f8787','#5f87af','#5f87d7','#5f87ff','#5faf00','#5faf5f','#5faf87','#5fafaf','#5fafd7','#5fafff','#5fd700','#5fd75f','#5fd787','#5fd7af','#5fd7d7','#5fd7ff','#5fff00','#5fff5f','#5fff87','#5fffaf','#5fffd7','#5fffff','#870000','#87005f','#870087','#8700af','#8700d7','#8700ff','#875f00','#875f5f','#875f87','#875faf','#875fd7','#875fff','#878700','#87875f','#878787','#8787af','#8787d7','#8787ff','#87af00','#87af5f','#87af87','#87afaf','#87afd7','#87afff','#87d700','#87d75f','#87d787','#87d7af','#87d7d7','#87d7ff','#87ff00','#87ff5f','#87ff87','#87ffaf','#87ffd7','#87ffff','#af0000','#af005f','#af0087','#af00af','#af00d7','#af00ff','#af5f00','#af5f5f','#af5f87','#af5faf','#af5fd7','#af5fff','#af8700','#af875f','#af8787','#af87af','#af87d7','#af87ff','#afaf00','#afaf5f','#afaf87','#afafaf','#afafd7','#afafff','#afd700','#afd75f','#afd787','#afd7af','#afd7d7','#afd7ff','#afff00','#afff5f','#afff87','#afffaf','#afffd7','#afffff','#d70000','#d7005f','#d70087','#d700af','#d700d7','#d700ff','#d75f00','#d75f5f','#d75f87','#d75faf','#d75fd7','#d75fff','#d78700','#d7875f','#d78787','#d787af','#d787d7','#d787ff','#d7af00','#d7af5f','#d7af87','#d7afaf','#d7afd7','#d7afff','#d7d700','#d7d75f','#d7d787','#d7d7af','#d7d7d7','#d7d7ff','#d7ff00','#d7ff5f','#d7ff87','#d7ffaf','#d7ffd7','#d7ffff','#ff0000','#ff005f','#ff0087','#ff00af','#ff00d7','#ff00ff','#ff5f00','#ff5f5f','#ff5f87','#ff5faf','#ff5fd7','#ff5fff','#ff8700','#ff875f','#ff8787','#ff87af','#ff87d7','#ff87ff','#ffaf00','#ffaf5f','#ffaf87','#ffafaf','#ffafd7','#ffafff','#ffd700','#ffd75f','#ffd787','#ffd7af','#ffd7d7','#ffd7ff','#ffff00','#ffff5f','#ffff87','#ffffaf','#ffffd7','#ffffff','#080808','#121212','#1c1c1c','#262626','#303030','#3a3a3a','#444444','#4e4e4e','#585858','#606060','#666666','#767676','#808080','#8a8a8a','#949494','#9e9e9e','#a8a8a8','#b2b2b2','#bcbcbc','#c6c6c6','#d0d0d0','#dadada','#e4e4e4','#eeeeee']
    color["hex"] = function (c)
    {
        return (_k_.isArr(c) ? kstr.hexColor(c) : c)
    }

    color["values"] = function (c)
    {
        return (_k_.isStr(c) ? kstr.hexColor(c) : c)
    }

    color["darken"] = function (c, f = 0.5)
    {
        if (_k_.empty(c))
        {
            return [0,0,0]
        }
        return c.map(function (v)
        {
            return _k_.clamp(0,255,parseInt(f * v))
        })
    }

    color["brighten"] = function (c, f = 0.5)
    {
        if (_k_.empty(c))
        {
            return [255,255,255]
        }
        return c.map(function (v)
        {
            return _k_.clamp(0,255,parseInt((1 + f) * v))
        })
    }

    color["vibrant"] = function (c, f = 0.5)
    {
        var w

        if (_k_.empty(c))
        {
            return [128,128,128]
        }
        w = (c[0] + c[1] + c[2]) / 3
        if (c[0] * c[1] * c[2] === 0)
        {
            w *= 2
        }
        return [_k_.min(255,parseInt(c[0] * f + w * (1 - f))),_k_.min(255,parseInt(c[1] * f + w * (1 - f))),_k_.min(255,parseInt(c[2] * f + w * (1 - f)))]
    }

    color["saturate"] = function (c, s = 1.0, l = 1.0)
    {
        var hsl

        hsl = this.rgbToHsl(c)
        hsl[1] *= s
        hsl[2] *= l
        return this.hslToRgb(hsl)
    }

    color["rgbToHsl"] = function (c)
    {
        var b, delta, g, h, l, r, s, vmax, vmin

        var _a_ = c; r = _a_[0]; g = _a_[1]; b = _a_[2]

        r /= 255
        g /= 255
        b /= 255
        vmax = _k_.max(r,g,b)
        vmin = _k_.min(r,g,b)
        delta = vmax - vmin
        h = 0
        s = 0
        l = (vmax + vmin) / 2
        if (delta !== 0)
        {
            s = l > 0.5 ? delta / (2 - vmax - vmin) : delta / (vmax + vmin)
            switch (vmax)
            {
                case r:
                    h = (g - b) / delta + (g < b ? 6 : 0)
                    break
                case g:
                    h = (b - r) / delta + 2
                    break
                case b:
                    h = (r - g) / delta + 4
                    break
            }

            h /= 6
        }
        return [h * 360,s * 100,l * 100]
    }

    color["hslToRgb"] = function (c)
    {
        var b, g, h, hue2rgb, l, p, q, r, s

        var _a_ = c; h = _a_[0]; s = _a_[1]; l = _a_[2]

        h /= 360
        s /= 100
        l /= 100
        r = 0
        g = 0
        b = 0
        if (s === 0)
        {
            r = g = b = l
        }
        else
        {
            hue2rgb = function (p, q, t)
            {
                if (t < 0)
                {
                    t += 1
                }
                if (t > 1)
                {
                    t -= 1
                }
                if (t < 1 / 6)
                {
                    return p + (q - p) * 6 * t
                }
                if (t < 1 / 2)
                {
                    return q
                }
                if (t < 2 / 3)
                {
                    return p + (q - p) * (2 / 3 - t) * 6
                }
                return p
            }
            q = l < 0.5 ? l * (1 + s) : l + s - l * s
            p = 2 * l - q
            r = hue2rgb(p,q,h + 1 / 3)
            g = hue2rgb(p,q,h)
            b = hue2rgb(p,q,h - 1 / 3)
        }
        return [Math.round(r * 255),Math.round(g * 255),Math.round(b * 255)]
    }

    color["rgbToHsv"] = function (c)
    {
        var b, d, g, h, r, s, vmax, vmin

        var _a_ = c; r = _a_[0]; g = _a_[1]; b = _a_[2]

        r /= 255
        g /= 255
        b /= 255
        vmax = _k_.max(r,g,b)
        vmin = _k_.min(r,g,b)
        d = vmax - vmin
        h = 0
        if (d !== 0)
        {
            if (vmax === r)
            {
                h = 60 * (((g - b) / d) % 6)
            }
            else if (vmax === g)
            {
                h = 60 * ((b - r) / d + 2)
            }
            else
            {
                h = 60 * ((r - g) / d + 4)
            }
        }
        if (h < 0)
        {
            h += 360
        }
        s = (vmax === 0 ? 0 : d / vmax)
        return [Math.round(h),Math.round(s * 100),Math.round(vmax * 100)]
    }

    color["hsvToRgb"] = function (c)
    {
        var f, h, i, p, q, rgb, s, t, v

        var _a_ = c; h = _a_[0]; s = _a_[1]; v = _a_[2]

        h /= 60
        s /= 100
        v /= 100
        i = Math.floor(h)
        f = h - i
        p = v * (1 - s)
        q = v * (1 - s * f)
        t = v * (1 - s * (1 - f))
        rgb = ((function ()
        {
            switch (i % 6)
            {
                case 0:
                    return [v,t,p]

                case 1:
                    return [q,v,p]

                case 2:
                    return [p,v,t]

                case 3:
                    return [p,q,v]

                case 4:
                    return [t,p,v]

                case 5:
                    return [v,p,q]

                default:
                    return [v,t,p]
            }

        }).bind(this))()
        return [Math.round(rgb[0] * 255),Math.round(rgb[1] * 255),Math.round(rgb[2] * 255)]
    }

    color["bg_rgb"] = function (c)
    {
        if (_k_.empty(c))
        {
            return '\x1b[49m'
        }
        return `\x1b[48;2;${c[0]};${c[1]};${c[2]}m`
    }

    color["fg_rgb"] = function (c)
    {
        if (_k_.empty(c))
        {
            return '\x1b[39m'
        }
        return `\x1b[38;2;${c[0]};${c[1]};${c[2]}m`
    }

    color["ul_rgb"] = function (c)
    {
        if (_k_.empty(c))
        {
            return '\x1b[59m'
        }
        return `\x1b[58;2;${c[0]};${c[1]};${c[2]}m`
    }

    color["randomBackgroundColors"] = function (lines, bg, fg)
    {
        var char, clr, idx, line, resl, rl

        resl = []
        var list = _k_.list(lines)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            line = list[_a_]
            rl = ''
            rl += color.fg_rgb(fg)
            var list1 = _k_.list(line)
            for (idx = 0; idx < list1.length; idx++)
            {
                char = list1[idx]
                clr = ''
                if (char === ' ')
                {
                    if (idx && line[idx - 1] !== ' ')
                    {
                        clr = '\x1b[49m'
                    }
                }
                else
                {
                    clr = color.bg_rgb(this.darken(bg,0.75 + Math.random() * 0.25))
                }
                rl += clr + char
            }
            resl.push(rl + '\x1b[49m')
        }
        return resl
    }

    color["linesForCells"] = function (cells)
    {
        var cell, idx, line, lines, row

        lines = []
        var list = _k_.list(cells)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            row = list[_a_]
            line = ''
            var list1 = _k_.list(row)
            for (idx = 0; idx < list1.length; idx++)
            {
                cell = list1[idx]
                line += color.bg_rgb(cell.bg)
                line += color.fg_rgb(cell.fg)
                line += cell.char
            }
            lines.push(line + '\x1b[49m')
        }
        return lines
    }

    color["glowEffect"] = function (cells, strength = 0.5)
    {
        var cell, df, dx, dy, nbc, nbcs, row, scl, sum, vi, x, y

        var list = _k_.list(cells)
        for (y = 0; y < list.length; y++)
        {
            row = list[y]
            var list1 = _k_.list(row)
            for (x = 0; x < list1.length; x++)
            {
                cell = list1[x]
                nbcs = belt.cellNeighborsAtPos(cells,x,y,6,3)
                if (_k_.empty(nbcs))
                {
                    continue
                }
                sum = [0,0,0]
                var list2 = _k_.list(nbcs)
                for (var _c_ = 0; _c_ < list2.length; _c_++)
                {
                    nbc = list2[_c_]
                    dx = nbc.pos[0] - x
                    dy = nbc.pos[1] - y
                    df = 1 - _k_.max(0,Math.sqrt(dx * dx + dy * dy) / 6)
                    for (vi = 0; vi <= 2; vi++)
                    {
                        sum[vi] += nbc.cell.fg[vi] * df
                    }
                }
                scl = strength * 0.014
                scl = scl * randRange(0.98,1.02)
                sum = sum.map(function (v)
                {
                    return _k_.clamp(0,255,parseInt(scl * v))
                })
                cell.bg = sum
            }
        }
        return cells
    }

    color["variateCellsColor"] = function (cells, type, amount)
    {
        var cell, clr, f

        var list = _k_.list(cells)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cell = list[_a_]
            clr = cell.cell[type]
            f = 1 + randRange(-amount / 2,amount / 2)
            clr = clr.map(function (v)
            {
                return parseInt(_k_.clamp(0,255,v * f))
            })
            cell.cell[type] = clr
        }
    }

    color["dimCellsColor"] = function (cells, type, amount)
    {
        var cell, clr

        var list = _k_.list(cells)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cell = list[_a_]
            clr = cell.cell[type]
            clr = clr.map(function (v)
            {
                return parseInt(_k_.clamp(0,255,v * amount))
            })
            cell.cell[type] = clr
        }
    }

    color["luminance"] = function (c)
    {
        var b, g, r

        var _a_ = c; r = _a_[0]; g = _a_[1]; b = _a_[2]

        r = r / 255
        g = g / 255
        b = b / 255
        r = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4
        g = g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4
        b = b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    color["adjustForBackground"] = function (fg, bg)
    {
        var clr, _301_35_

        color.readabilityCache[bg] = ((_301_35_=color.readabilityCache[bg]) != null ? _301_35_ : {})
        if (clr = color.readabilityCache[bg][fg])
        {
            return clr
        }
        return color.readabilityCache[bg][fg] = this.ensureReadability(fg,bg)
    }

    color["ensureReadability"] = function (fg, bg)
    {
        var bgLuminance, cnt, contrast, contrastRatio, fgLuminance, h, l, s, step

        if (_k_.empty(fg) || !(_k_.isNum(fg[0])))
        {
            return fg
        }
        if (_k_.empty(bg) || !(_k_.isNum(bg[0])))
        {
            return fg
        }
        contrastRatio = function (l1, l2)
        {
            return (_k_.max(l1,l2) + 0.05) / (_k_.min(l1,l2) + 0.05)
        }
        fgLuminance = this.luminance(fg)
        bgLuminance = this.luminance(bg)
        contrast = contrastRatio(fgLuminance,bgLuminance)
        var _a_ = this.rgbToHsl(fg); h = _a_[0]; s = _a_[1]; l = _a_[2]

        step = (bgLuminance > 0.5 ? -5 : 5)
        cnt = 0
        while (cnt < 50)
        {
            cnt++
            fg = this.hslToRgb([h,s,l])
            fgLuminance = this.luminance(fg)
            contrast = contrastRatio(fgLuminance,bgLuminance)
            if (contrast >= 4.5)
            {
                return fg
            }
            l += step
            if (l < 0 || l > 100)
            {
                step = -step
            }
        }
        return fg
    }

    return color
})()

for (key in color.ansi256)
{
    val = color.ansi256[key]
    color.ansi256[key] = color.values(val)
}
export default color;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3RoZW1lL2NvbG9yLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDVSxVQUFBO0lBQVM7SUFBSzs7T0FDTCxXQUFQOzs7QUFFWCxTQUFEOzs7OztJQUVJLE9BQUM7SUFFRCxPQUFDLGFBQ0csVUFBVSxVQUFVLFVBQVUsVUFDOUIsVUFBVSxVQUFVLFVBQVUsVUFDOUIsVUFBVSxVQUFVLFVBQVUsVUFDOUIsVUFBVSxVQUFVLFVBQVUsVUFDOUIsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQ2xELFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUNsRCxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFDbEQsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQ2xELFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUNsRCxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFDbEQsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQ2xELFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUNsRCxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFDbEQsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQ2xELFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUNsRCxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFDbEQsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQ2xELFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUNsRCxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFDbEQsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQ2xELFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUNsRCxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFDbEQsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQ2xELFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUNsRCxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFD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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/theme/color.kode
