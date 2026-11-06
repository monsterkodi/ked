var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isArr: function (o) {return Array.isArray(o)}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var font, salter

import util from "./util.js"
import noon from "./noon.js"


salter = function (text, opt)
{
    var c, cs, rs, s, zs, _10_16_, _11_16_, _12_16_, _8_16_, _9_16_

    opt = (opt != null ? opt : {})
    opt.char = ((_8_16_=opt.char) != null ? _8_16_ : '█')
    opt.prefix = ((_9_16_=opt.prefix) != null ? _9_16_ : '')
    opt.postfix = ((_10_16_=opt.postfix) != null ? _10_16_ : '')
    opt.prepend = ((_11_16_=opt.prepend) != null ? _11_16_ : '')
    opt.append = ((_12_16_=opt.append) != null ? _12_16_ : '')
    if (text !== ' ')
    {
        s = text.toLowerCase().trim()
    }
    else
    {
        s = ' '
    }
    cs = []
    var list = _k_.list(s)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        c = list[_a_]
        if ((font[c] != null))
        {
            cs.push(font[c])
        }
    }
    zs = util.zip.apply(null,cs)
    if (opt.char !== '█')
    {
        zs = zs.map(function (j)
        {
            return j.map(function (k)
            {
                return k.replace(/[0]/g,opt.char)
            })
        })
    }
    if (opt.prefix || opt.postfix)
    {
        zs = zs.map(function (j)
        {
            return j.map(function (k)
            {
                return opt.prefix + k + opt.postfix
            })
        })
    }
    rs = zs.map(function (j)
    {
        return opt.prepend + j.join('  ') + opt.append
    })
    return rs.join('\n')
}
font = noon.parse(`0   
    | ██████ |
    |███  ███|
    |██    ██|
    |███  ███|
    | ██████ |
1   
    |   ███
    | █████
    |██████
    |   ███
    |   ███
2   
    |█████ |
    |   ███|
    |  ███ |
    | ███  |
    |██████|
3   
    |██████ |
    |    ███|
    |  ████ |
    |    ███|
    |██████ |
4   
    |███  ███
    |███  ███
    |████████
    |     ███
    |     ███
5   
    |███████ |
    |███     |
    |███████ |
    |     ███|
    |███████ |
6   
    |  ███   |
    | ███    |
    |███████ |
    |███  ███|
    | ██████ |
7   
    |███████|
    |   ███ |
    |  ███  |
    | ███   |
    |███    |
8   
    | ██████ |
    |███  ███|
    |  ████  |
    |███  ███|
    | ██████ |
9   
    | ██████ |
    |███  ███|
    | ██████ |
    |   ███  |
    |  ███   |
!   
    |███|
    |███|
    |███|
    |   |
    |███|
?   
    |█████ |
    |   ███|
    | ███  |
    |      |
    | ███  |
-   
    |      |
    |      |
    |██████|
    |      |
    |      |
+   
    |      |
    |  ██  |
    |██████|
    |  ██  |
    |      |
_   
    |      |
    |      |
    |      |
    |      |
    |██████|
=   
    |      |
    |██████|
    |      |
    |██████|
    |      |
/   
    |    ███|
    |   ███ |
    |  ███  |
    | ███   |
    |███    |
\   
    |███    |
    | ███   |
    |  ███  |
    |   ███ |
    |    ███|    
>   
    |███    |
    |  ███  |
    |    ███|
    |  ███  |
    |███    |
<   
    |    ███|
    |  ███  |
    |███    |
    |  ███  |
    |    ███|    
^   
    |  ███  |
    | ██ ██ |
    |██   ██|
    |       |
    |       |    
[
    |█████|
    |███  |
    |███  |
    |███  |
    |█████|
]   
    |█████|
    |  ███|
    |  ███|
    |  ███|
    |█████|    
(
    | ████|
    |███  |
    |██   |
    |███  |
    | ████|
)   
    |████ |
    |  ███|
    |   ██|
    |  ███|
    |████ |    
{
    |  ████|
    |  ██  |
    |███   |
    |  ██  |
    |  ████|
}   
    |████  |
    |  ██  |
    |   ███|
    |  ██  |
    |████  |    
"
    |███  ███|
    |███  ███|
    |        |
    |        |
    |        |
'
    |███|
    |███|
    |   |
    |   |
    |   |
|#|  
    | ██  ██ |
    |████████|
    | ██  ██ |
    |████████|
    | ██  ██ |
*  
    | █ ██ █ |
    |████████|
    | ██████ |
    |████████|
    | █ ██ █ |
$  
    | ██████ |
    |██ ██   |
    |███████ |
    |   ██ ██|
    | ██████ |
@  
    | ██████ |
    |████████|
    |███  ███|
    |████████|
    | ██████ |
%
    |██   ██ |
    |██  ██  |
    |   ██   |
    |  ██  ██|
    | ██   ██|
&
    | ████   |
    |██  ██  |
    | ████ ██|
    |██  ███ |
    | █████ █|
:   
    |███|
    |███|
    |   |
    |███|
    |███|
;   
    |███|
    |███|
    |   |
    |███|
    |  █|
.   
    |   |
    |   |
    |   |
    |███|
    |███|
,   
    |   |
    |   |
    |   |
    |███|
    |  █|
| |  
    |    |
    |    |
    |    |
    |    |
    |    |
a   
    | ███████ |
    |███   ███|
    |█████████|
    |███   ███|
    |███   ███|
b   
    |███████  |
    |███   ███|
    |███████  |
    |███   ███|
    |███████  |
c   
    | ███████|
    |███     |
    |███     |
    |███     |
    | ███████|
d   
    |███████  |
    |███   ███|
    |███   ███|
    |███   ███|
    |███████  |
e   
    |████████|
    |███     |
    |███████ |
    |███     |
    |████████|
f   
    |████████|
    |███     |
    |██████  |
    |███     |
    |███     |
g   
    | ███████ |
    |███      |
    |███  ████|
    |███   ███|
    | ███████ |
h   
    |███   ███
    |███   ███
    |█████████
    |███   ███
    |███   ███
i   
    |███
    |███
    |███
    |███
    |███
j   
    |      ███|
    |      ███|
    |      ███|
    |███   ███|
    | ███████ |
k   
    |███   ███|
    |███  ███ |
    |███████  |
    |███  ███ |
    |███   ███|
l   
    |███    |
    |███    |
    |███    |
    |███    |
    |███████|
m   
    |██     ██
    |███   ███
    |█████████
    |███ █ ███
    |███   ███
n   
    |███   ███
    |████  ███
    |███ █ ███
    |███  ████
    |███   ███
o   
    | ███████ |
    |███   ███|
    |███   ███|
    |███   ███|
    | ███████ |
p   
    |████████ |
    |███   ███|
    |████████ |
    |███      |
    |███      |
q   
    | ███████ |
    |███   ███|
    |███ ██ ██|
    |███ ████ |
    | █████ ██|
r   
    |████████ |
    |███   ███|
    |███████  |
    |███   ███|
    |███   ███|
s   
    | ███████|
    |███     |
    |███████ |
    |     ███|
    |███████ |
t   
    |█████████|
    |   ███   |
    |   ███   |
    |   ███   |
    |   ███   |
u   
    |███   ███|
    |███   ███|
    |███   ███|
    |███   ███|
    | ███████ |
v   
    |███   ███|
    |███   ███|
    | ███ ███ |
    |   ███   |
    |    █    |
w   
    |███   ███
    |███ █ ███
    |█████████
    |███   ███
    |██     ██
x   
    |███   ███|
    | ███ ███ |
    |  █████  |
    | ███ ███ |
    |███   ███|
y   
    |███   ███|
    | ███ ███ |
    |  █████  |
    |   ███   |
    |   ███   |
z   
    |███████|
    |   ███ |
    |  ███  |
    | ███   |
    |███████|`)
salter.font = font

salter.hasChar = function (c)
{
    return !_k_.empty(font[c])
}

salter.desalt = function (text)
{
    var best, ch, glyphs, gr, line, lines, ok, out, r, remaining, row, rows, separated, w, width, x

    lines = _k_.isArr(text) ? text : text.split('\n')
    if (_k_.empty(lines))
    {
        return ''
    }
    if (lines.length !== 5)
    {
        return ''
    }
    width = 0
    var list = _k_.list(lines)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        line = list[_b_]
        width = _k_.max(width,line.length)
    }
    if (width === 0)
    {
        return ''
    }
    rows = lines.map(function (line)
    {
        return line + ' '.repeat(width - line.length)
    })
    glyphs = Object.keys(font)
    out = ''
    x = 0
    while (x < width)
    {
        remaining = false
        var list1 = _k_.list(rows)
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            row = list1[_c_]
            if (!_k_.empty(_k_.trim(row.slice(x))))
            {
                remaining = true
                break
            }
        }
        if (!remaining)
        {
            break
        }
        best = null
        var list2 = _k_.list(glyphs)
        for (var _d_ = 0; _d_ < list2.length; _d_++)
        {
            ch = list2[_d_]
            gr = font[ch]
            w = gr[0].length
            if (x + w > width)
            {
                continue
            }
            ok = true
            for (r = 0; r < 5; r++)
            {
                if (rows[r].slice(x, x + w) !== gr[r])
                {
                    ok = false
                    break
                }
            }
            if (!ok)
            {
                continue
            }
            if (x + w < width)
            {
                for (r = 0; r < 5; r++)
                {
                    if (rows[r].slice(x + w, x + w + 2) !== '  ')
                    {
                        ok = false
                        break
                    }
                }
            }
            if (ok && (!best || w > best[1]))
            {
                best = [ch,w]
            }
        }
        if (!best)
        {
            break
        }
        out += best[0]
        x += best[1]
        if (x + 2 <= width)
        {
            separated = true
            for (r = 0; r < 5; r++)
            {
                if (rows[r].slice(x, x + 2) !== '  ')
                {
                    separated = false
                    break
                }
            }
            if (separated)
            {
                x += 2
            }
        }
    }
    return out
}
export default salter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FsdGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9zYWx0ZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNNLFdBQUE7T0FBSyxXQUFBOzs7QUFHWCxtQkFBUyxNQUFLOzs7O0lBRVYsT0FBQSxjQUFBO0lBQ0EsSUFBSSxnQkFBSixJQUFJLHlCQUFXO0lBQ2YsSUFBSSxrQkFBSixJQUFJLDJCQUFXO0lBQ2YsSUFBSSxvQkFBSixJQUFJLDZCQUFXO0lBQ2YsSUFBSSxvQkFBSixJQUFJLDZCQUFXO0lBQ2YsSUFBSSxtQkFBSixJQUFJLDRCQUFXO1FBRVosU0FBUTs7UUFDUCxJQUFJLEtBQUssY0FBYzs7OztRQUV2QixJQUFJOztJQUVSO3dCQUNTOzs7UUFBTDthQUNHLEtBQUs7O1lBQ0osR0FBRyxLQUFLLEtBQUs7OztJQUVyQixLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUs7UUFFdEIsSUFBSSxTQUFROztRQUNYLEtBQUssR0FBRyxjQUFLOzttQkFBTSxFQUFFLGNBQUs7O3VCQUFNLEVBQUUsUUFBUSxPQUFPLElBQUk7Ozs7UUFFdEQsSUFBSSxVQUFVLElBQUk7O1FBQ2pCLEtBQUssR0FBRyxjQUFLOzttQkFBTSxFQUFFLGNBQUs7O3VCQUFNLElBQUksU0FBUyxJQUFJLElBQUk7Ozs7SUFFekQsS0FBSyxHQUFHLGNBQUs7O2VBQU0sSUFBSSxVQUFVLEVBQUUsS0FBSyxRQUFRLElBQUk7O1dBRXBELEdBQUcsS0FBSzs7QUFFWixPQUFPLEtBQUssTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK1lsQixPQUFPLE9BQU87O0FBRWQsT0FBTyxvQkFBVTs7c0JBQVcsS0FBSzs7O0FBRWpDLE9BQU8sbUJBQVM7Ozs7SUFFWixRQUFtQixVQUFSLFFBQWlCLE9BQVUsS0FBSyxNQUFNO2tCQUVuQzs7ZUFBWjs7UUFDTSxNQUFNLFdBQVU7O2VBQXRCOztJQUVGLFFBQVE7d0JBQ0k7OztRQUFSO1FBQ0EsZ0JBQVksTUFBTSxLQUFLOztRQUVuQixVQUFTOztlQUFmOztJQUVGLE9BQU8sTUFBTSxjQUFLOztlQUFTLE9BQU8sSUFBSSxPQUFPLFFBQVEsS0FBSzs7SUFFMUQsU0FBUyxPQUFPLEtBQUs7SUFFckIsTUFBTTtJQUNOLElBQUk7V0FFRSxJQUFJOztRQUVOLFlBQVk7NkJBQ0Q7OztZQUFQO29DQUNrQixVQUFJOztnQkFDbEIsWUFBWTtnQkFDWjs7O2FBQ0s7O1lBQWI7O1FBRUEsT0FBTzs2QkFFRzs7O1lBQU47WUFFQSxLQUFLLEtBQUs7WUFDVixJQUFJLEdBQUcsR0FBRztnQkFFRSxJQUFJLElBQUk7O2dCQUFwQjs7WUFFQSxLQUFLO2lCQUNELElBQUssT0FBSTs7b0JBQ04sS0FBSyxTQUFHLEdBQUksSUFBRSxPQUFNLEdBQUc7O29CQUN0QixLQUFLO29CQUNMOzs7aUJBQ1E7O2dCQUFoQjs7Z0JBRUcsSUFBSSxJQUFJOztxQkFDSCxJQUFLLE9BQUk7O3dCQUNOLEtBQUssU0FBRyxJQUFFLEdBQUksSUFBRSxJQUFFLE9BQU07O3dCQUN2QixLQUFLO3dCQUNMOzs7O2dCQUVULFFBQVksUUFBUSxJQUFJLEtBQUs7O2dCQUM1QixRQUFRLEdBQUc7OzthQUVOOztZQUFiOztRQUVBLE9BQU8sS0FBSztRQUNaLEtBQUssS0FBSztZQUVQLElBQUksS0FBSzs7WUFDUixZQUFZO2lCQUNSLElBQUssT0FBSTs7b0JBQ04sS0FBSyxTQUFHLEdBQUksSUFBRSxPQUFNOztvQkFDbkIsWUFBWTtvQkFDWjs7O2dCQUNFOztnQkFBVixLQUFLOzs7O1dBRWI7O2VBRUcifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/salter.kode
