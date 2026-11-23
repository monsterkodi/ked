var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var Ansi, initStyles, STYLES, toHexString

import kstr from "./kstr.js"

STYLES = {f0:'#000',f1:'#F00',f2:'#0D0',f3:'#DD0',f4:'#00F',f5:'#D0D',f6:'#0DD',f7:'#AAA',f8:'#555',f9:'#F55',f10:'#5F5',f11:'#FF5',f12:'#55F',f13:'#F5F',f14:'#5FF',f15:'#FFF',b0:'#000',b1:'#A00',b2:'#0A0',b3:'#A50',b4:'#00A',b5:'#A0A',b6:'#0AA',b7:'#AAA',b8:'#555',b9:'#F55',b10:'#5F5',b11:'#FF5',b12:'#55F',b13:'#F5F',b14:'#5FF',b15:'#FFF'}

toHexString = function (num)
{
    num = num.toString(16)
    while (num.length < 2)
    {
        num = `0${num}`
    }
    return num
}

initStyles = function ()
{
    var b, blue, c, g, gray, green, l, n, r, red, rgb

    for (red = 0; red <= 5; red++)
    {
        for (green = 0; green <= 5; green++)
        {
            for (blue = 0; blue <= 5; blue++)
            {
                c = 16 + (red * 36) + (green * 6) + blue
                r = red > 0 ? red * 40 + 55 : 0
                g = green > 0 ? green * 40 + 55 : 0
                b = blue > 0 ? blue * 40 + 55 : 0
                rgb = (function () { var r_a_ = []; var list = [r,g,b]; for (var _b_ = 0; _b_ < list.length; _b_++)  { n = list[_b_];r_a_.push(toHexString(n))  } return r_a_ }).bind(this)().join('')
                STYLES[`f${c}`] = `#${rgb}`
                STYLES[`b${c}`] = `#${rgb}`
            }
        }
    }
    for (gray = 0; gray <= 23; gray++)
    {
        c = gray + 232
        l = toHexString(gray * 10 + 8)
        STYLES[`f${c}`] = `#${l}${l}${l}`
        STYLES[`b${c}`] = `#${l}${l}${l}`
    }
}

Ansi = (function ()
{
    function Ansi ()
    {}

    Ansi["strip"] = function (s)
    {
        var STRIPANSI

        if (!(_k_.isStr(s)))
        {
            return s
        }
        STRIPANSI = /\x1B[[(?);]{0,2}(;?\d)*./g
        return s.replace(STRIPANSI,'')
    }

    Ansi["link"] = function (url, text = url)
    {
        var s

        s = `\x1b]8;;${url}\x1b\\`
        s += `${text}\x1b]8;;\x1b\\`
        return s
    }

    Ansi["html"] = function (s)
    {
        var andi, d, diss, htmlLine, i, l, lines, span, _86_32_

        andi = new Ansi()
        lines = []
        var list = ((_86_32_=(s != null ? s.split('\n') : undefined)) != null ? _86_32_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            l = list[_a_]
            diss = andi.dissect(l)[1]
            htmlLine = ''
            for (i = 0; i < diss.length; i++)
            {
                d = diss[i]
                span = d.styl && `<span style=\"${d.styl}\">${d.match}</span>` || d.match
                if (parseInt(i))
                {
                    if (diss[i - 1].start + diss[i - 1].match.length < d.start)
                    {
                        htmlLine += ' '
                    }
                }
                htmlLine += span
            }
            lines.push(htmlLine)
        }
        return lines.join('\n')
    }

    Ansi["colors"] = function ()
    {
        var b, blue, g, green, h, hex, n, r, red, rgb

        hex = ['#000000','#cd0000','#00cd00','#cdcd00','#0000ee','#cd00cd','#00cdcd','#e5e5e5','#7f7f7f','#ff0000','#00ff00','#ffff00','#5c5cff','#ff00ff','#00ffff','#ffffff']
        for (red = 0; red <= 5; red++)
        {
            for (green = 0; green <= 5; green++)
            {
                for (blue = 0; blue <= 5; blue++)
                {
                    r = (red > 0 ? red * 40 + 55 : 0)
                    g = (green > 0 ? green * 40 + 55 : 0)
                    b = (blue > 0 ? blue * 40 + 55 : 0)
                    rgb = (function () { var r_a_ = []; var list = [r,g,b]; for (var _b_ = 0; _b_ < list.length; _b_++)  { n = list[_b_];r_a_.push(toHexString(n))  } return r_a_ }).bind(this)().join('')
                    hex.push(`#${rgb}`)
                }
            }
        }
        for (g = 0; g < 24; g++)
        {
            h = g * 10 + 8
            hex.push(`#${toHexString(h)}${toHexString(h)}${toHexString(h)}`)
        }
        return hex
    }

    Ansi["bg"] = function (c)
    {
        var b, g, r

        ;[r,g,b] = kstr.hexColor(c)
        return `\x1b[48;2;${r};${g};${b}m`
    }

    Ansi["fg"] = function (c)
    {
        var b, g, r

        ;[r,g,b] = kstr.hexColor(c)
        return `\x1b[38;2;${r};${g};${b}m`
    }

    Ansi["bg256"] = function (c)
    {
        return `\x1b[48;5;${Ansi.idx256(c)}m`
    }

    Ansi["idx256"] = function (c)
    {
        var b, g, r

        ;[r,g,b] = kstr.hexColor(c)
        if ((r === g && g === b))
        {
            return 232 + parseInt((g - 8) / 10)
        }
        r = (r > 0 ? parseInt((r - 55) / 40) : 0)
        g = (g > 0 ? parseInt((g - 55) / 40) : 0)
        b = (b > 0 ? parseInt((b - 55) / 40) : 0)
        return 16 + (r * 36) + (g * 6) + b
    }

    Ansi["log256Colors"] = function ()
    {
        var i, j, s

        s = ''
        for (i = 0; i < 4; i++)
        {
            for (j = 0; j < 4; j++)
            {
                s += `\x1b[48;5;${i * 4 + j}m\x1b[38;5;${i * 4 + j}m ● \x1b[48;5;0m` + Ansi.bg256(Ansi.c256[i * 4 + j]) + Ansi.idx256(Ansi.c256[i * 4 + j]) + ' '
            }
            s += '\x1b[49m\n'
        }
        for (i = 0; i < 36; i++)
        {
            for (j = 0; j < 6; j++)
            {
                s += `\x1b[48;5;${i * 6 + j + 16}m\x1b[38;5;${i * 6 + j + 16}m ● \x1b[48;5;0m` + Ansi.bg256(Ansi.c256[i * 6 + j + 16]) + Ansi.idx256(Ansi.c256[i * 6 + j + 16]) + '  '
            }
            s += '\x1b[49m\n'
        }
        for (i = 0; i < 4; i++)
        {
            for (j = 0; j < 6; j++)
            {
                s += `\x1b[48;5;${i * 6 + j + 16 + 6 * 36}m\x1b[38;5;${i * 6 + j + 16 + 6 * 36}m ● \x1b[48;5;0m` + Ansi.bg256(Ansi.c256[i * 6 + j + 16 + 6 * 36]) + Ansi.idx256(Ansi.c256[i * 6 + j + 16 + 6 * 36]) + '  '
            }
            s += '\x1b[49m\n'
        }
        console.log(s)
    }

    Ansi.prototype["dissect"] = function (input)
    {
        this.input = input
    
        this.diss = []
        this.text = ""
        this.tokenize()
        return [this.text,this.diss]
    }

    Ansi.prototype["tokenize"] = function ()
    {
        var addStyle, addText, ansiCode, ansiHandler, ansiMatch, bg, delStyle, fg, handler, i, invert, length, process, resetStyle, setBG, setFG, st, start, toHighIntensity, tokens

        start = 0
        ansiHandler = 2
        ansiMatch = false
        invert = false
        fg = bg = ''
        st = []
        resetStyle = function ()
        {
            fg = bg = ''
            invert = false
            return st = []
        }
        addStyle = function (style)
        {
            if (!(_k_.in(style,st)))
            {
                return st.push(style)
            }
        }
        delStyle = function (style)
        {
            return st.splice(st.indexOf(style),1)
        }
        setFG = function (cs)
        {
            if (cs.length === 5)
            {
                return fg = `rgb(${cs[2]},${cs[3]},${cs[4]})`
            }
            else
            {
                return fg = STYLES[`f${cs[2]}`]
            }
        }
        setBG = function (cs)
        {
            if (cs.length === 5)
            {
                return bg = `rgb(${cs[2]},${cs[3]},${cs[4]})`
            }
            else
            {
                return bg = STYLES[`b${cs[2]}`]
            }
        }
        addText = (function (t)
        {
            var addMatch, addSpace, i, match, mstrt, space, sstrt

            start = this.text.length
            match = ''
            mstrt = start
            space = ''
            sstrt = start
            addMatch = (function ()
            {
                var style

                if (match.length)
                {
                    style = ''
                    if (invert)
                    {
                        if (bg.length)
                        {
                            style += `color:${bg};`
                        }
                        else
                        {
                            style += 'color:#000;'
                        }
                        if (fg.length)
                        {
                            style += `background-color:${fg};`
                        }
                        else
                        {
                            style += 'background-color:#fff;'
                        }
                    }
                    else
                    {
                        if (fg.length)
                        {
                            style += `color:${fg};`
                        }
                        if (bg.length)
                        {
                            style += `background-color:${bg};`
                        }
                    }
                    if (st.length)
                    {
                        style += st.join(';')
                    }
                    this.diss.push({match:match,start:mstrt,styl:style})
                    return match = ''
                }
            }).bind(this)
            addSpace = (function ()
            {
                if (space.length)
                {
                    this.diss.push({match:space,start:sstrt,styl:`background-color:${bg};`})
                    return space = ''
                }
            }).bind(this)
            for (i = 0; i < t.length; i++)
            {
                if (t[i] !== ' ')
                {
                    if (match === '')
                    {
                        mstrt = start + i
                    }
                    match += t[i]
                    addSpace()
                }
                else
                {
                    if (bg.length)
                    {
                        if (space === '')
                        {
                            sstrt = start + i
                        }
                        space += t[i]
                    }
                    addMatch()
                }
            }
            addMatch()
            addSpace()
            this.text += t
            start = this.text.length
            return ''
        }).bind(this)
        toHighIntensity = function (c)
        {
            var i

            for (i = 0; i <= 7; i++)
            {
                if (c === STYLES[`f${i}`])
                {
                    return STYLES[`f${8 + i}`]
                }
            }
            return c
        }
        ansiCode = function (m, c)
        {
            var code, cs

            ansiMatch = true
            if (c.trim().length === 0)
            {
                c = '0'
            }
            cs = c.trimRight(';').split(';')
            var list = _k_.list(cs)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                code = list[_a_]
                code = parseInt(code,10)
                switch (code)
                {
                    case 0:
                        resetStyle()
                        break
                    case 1:
                        addStyle('font-weight:bold')
                        fg = toHighIntensity(fg)
                        break
                    case 2:
                        addStyle('opacity:0.5')
                        break
                    case 4:
                        addStyle('text-decoration:underline')
                        break
                    case 7:
                        invert = true
                        break
                    case 27:
                        invert = false
                        break
                    case 8:
                        addStyle('display:none')
                        break
                    case 9:
                        addStyle('text-decoration:line-through')
                        break
                    case 39:
                        fg = STYLES["f15"]
                        break
                    case 49:
                        bg = STYLES["b0"]
                        break
                    case 38:
                        setFG(cs)
                        break
                    case 48:
                        setBG(cs)
                        break
                    case 28:
                        delStyle('display:none')
                        break
                    case 22:
                        delStyle('font-weight:bold')
                        delStyle('opacity:0.5')
                        break
                    default:
                        if ((30 <= code && code <= 37))
                    {
                        fg = STYLES[`f${code - 30}`]
                    }
                    else if ((40 <= code && code <= 47))
                    {
                        bg = STYLES[`b${code - 40}`]
                    }
                    else if ((90 <= code && code <= 97))
                    {
                        fg = STYLES[`f${8 + code - 90}`]
                    }
                    else if ((100 <= code && code <= 107))
                    {
                        bg = STYLES[`b${8 + code - 100}`]
                    }
                }

                if (_k_.in(code,[38,48]))
                {
                    break
                }
            }
            return ''
        }
        tokens = [{pattern:/^\x08+/,sub:''},{pattern:/^\x1b\[[012]?K/,sub:''},{pattern:/^\x1b\[((?:\d{1,3};?)+|)m/,sub:ansiCode},{pattern:/^\x1b\[?[\d;]{0,3}/,sub:''},{pattern:/^([^\x1b\x08\n]+)/,sub:addText}]
        process = (function (handler, i)
        {
            if (i > ansiHandler && ansiMatch)
            {
                return
            }
            ansiMatch = false
            return this.input = this.input.replace(handler.pattern,handler.sub)
        }).bind(this)
        while ((length = this.input.length) > 0)
        {
            var list = _k_.list(tokens)
            for (i = 0; i < list.length; i++)
            {
                handler = list[i]
                process(handler,i)
            }
            if (this.input.length === length)
            {
                break
            }
        }
    }

    return Ansi
})()

initStyles()
Ansi.c256 = Ansi.colors()
export default Ansi;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zaS5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvYW5zaS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ00sV0FBQTs7QUFJTixVQUVJLEdBQUssT0FDTCxHQUFLLE9BQ0wsR0FBSyxPQUNMLEdBQUssT0FDTCxHQUFLLE9BQ0wsR0FBSyxPQUNMLEdBQUssT0FDTCxHQUFLLE9BRUwsR0FBSyxPQUNMLEdBQUssT0FDTCxJQUFLLE9BQ0wsSUFBSyxPQUNMLElBQUssT0FDTCxJQUFLLE9BQ0wsSUFBSyxPQUNMLElBQUssT0FFTCxHQUFLLE9BQ0wsR0FBSyxPQUNMLEdBQUssT0FDTCxHQUFLLE9BQ0wsR0FBSyxPQUNMLEdBQUssT0FDTCxHQUFLLE9BQ0wsR0FBSyxPQUVMLEdBQUssT0FDTCxHQUFLLE9BQ0wsSUFBSyxPQUNMLElBQUssT0FDTCxJQUFLLE9BQ0wsSUFBSyxPQUNMLElBQUssT0FDTCxJQUFLOztBQUVULHdCQUFjOztJQUNWLE1BQU0sSUFBSSxTQUFTO1dBQ2IsSUFBSSxTQUFTOztRQUFPLFVBQVU7O1dBQ3BDOzs7QUFFSjs7OztTQUNRLE1BQU8sVUFBRzs7YUFDTixRQUFTLFlBQUc7O2lCQUNSLE9BQVEsV0FBRzs7Z0JBQ1gsSUFBSSxNQUFNLE1BQU0sT0FBTyxRQUFRLEtBQUs7Z0JBQ3BDLElBQU8sTUFBUSxJQUFPLE1BQVEsS0FBSyxLQUFRO2dCQUMzQyxJQUFPLFFBQVEsSUFBTyxRQUFRLEtBQUssS0FBUTtnQkFDM0MsSUFBTyxPQUFRLElBQU8sT0FBUSxLQUFLLEtBQVE7Z0JBQzNDLGdEQUFnQyxFQUFHLEVBQUcsbURBQVosd0JBQW5CLFlBQVksbUNBQXVCLEtBQUs7Z0JBQy9DLFdBQVcsV0FBVztnQkFDdEIsV0FBVyxXQUFXOzs7O1NBRTlCLE9BQVEsV0FBRzs7UUFDWCxJQUFJLE9BQUs7UUFDVCxJQUFJLFlBQVksT0FBSyxLQUFLO1FBQzFCLFdBQVcsV0FBVyxJQUFJLElBQUk7UUFDOUIsV0FBVyxXQUFXLElBQUksSUFBSTs7OztBQUVy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
//# sourceURL=../../kode/kxk/ansi.kode
