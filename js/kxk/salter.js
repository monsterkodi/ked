var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var font, salter

import util from "./util.js"
import noon from "./noon.js"


salter = function (text, opt)
{
    var c, cs, rs, s, zs, _14_16_, _15_16_, _16_16_, _17_16_, _18_16_

    opt = (opt != null ? opt : {})
    opt.char = ((_14_16_=opt.char) != null ? _14_16_ : '█')
    opt.prefix = ((_15_16_=opt.prefix) != null ? _15_16_ : '')
    opt.postfix = ((_16_16_=opt.postfix) != null ? _16_16_ : '')
    opt.prepend = ((_17_16_=opt.prepend) != null ? _17_16_ : '')
    opt.append = ((_18_16_=opt.append) != null ? _18_16_ : '')
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
export default salter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FsdGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9zYWx0ZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFNLFdBQUE7T0FBSyxXQUFBOzs7QUFFWCxtQkFBUyxNQUFLOzs7O0lBRVYsT0FBQSxjQUFBO0lBQ0EsSUFBSSxpQkFBSixJQUFJLDBCQUFXO0lBQ2YsSUFBSSxtQkFBSixJQUFJLDRCQUFXO0lBQ2YsSUFBSSxvQkFBSixJQUFJLDZCQUFXO0lBQ2YsSUFBSSxvQkFBSixJQUFJLDZCQUFXO0lBQ2YsSUFBSSxtQkFBSixJQUFJLDRCQUFXO1FBRVosU0FBUTs7UUFDUCxJQUFJLEtBQUssY0FBYzs7OztRQUV2QixJQUFJOztJQUVSO3dCQUNTOzs7UUFBTDthQUNHLEtBQUs7O1lBQ0osR0FBRyxLQUFLLEtBQUs7OztJQUVyQixLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUs7UUFFdEIsSUFBSSxTQUFROztRQUNYLEtBQUssR0FBRyxjQUFLOzttQkFBTSxFQUFFLGNBQUs7O3VCQUFNLEVBQUUsUUFBUSxPQUFPLElBQUk7Ozs7UUFFdEQsSUFBSSxVQUFVLElBQUk7O1FBQ2pCLEtBQUssR0FBRyxjQUFLOzttQkFBTSxFQUFFLGNBQUs7O3VCQUFNLElBQUksU0FBUyxJQUFJLElBQUk7Ozs7SUFFekQsS0FBSyxHQUFHLGNBQUs7O2VBQU0sSUFBSSxVQUFVLEVBQUUsS0FBSyxRQUFRLElBQUk7O1dBRXBELEdBQUcsS0FBSzs7QUFFWixPQUFPLEtBQUssTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK1lsQixPQUFPLE9BQU87O0FBRWQsT0FBTyxvQkFBVTs7c0JBQVcsS0FBSzs7ZUFFMUIifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/salter.kode
