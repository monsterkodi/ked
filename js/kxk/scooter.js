var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var build, deg, descience, noTrailingZeros, pow, precise, scooter

import pepe from "./pepe.js"
import kstr from "./kstr.js"

import kode from "../kode/kode.js"


noTrailingZeros = function (str)
{
    while (str.slice(-1)[0] === '0')
    {
        str = str.slice(0, -1)
    }
    if (str.slice(-1)[0] === '.')
    {
        str = str.slice(0, -1)
    }
    return str
}

precise = function (str, precision)
{
    var val

    if (Math.abs(str) < precise)
    {
        return '0'
    }
    val = parseFloat(str)
    if (val < 1)
    {
        str = val.toFixed(precision)
        str = noTrailingZeros(str)
    }
    return str
}

descience = function (str)
{
    var em

    if (_k_.in('e+',str))
    {
        str = BigInt(Number.parseFloat(str)).toString()
    }
    else if (_k_.in('e-',str))
    {
        em = parseInt(str.split('e-')[1])
        str = Number.parseFloat(str).toFixed(em + 2)
        str = noTrailingZeros(str)
    }
    return str
}

pow = function (str)
{
    str = str.replace(/\^/g,'**')
    return str
}

deg = function (str)
{
    var i, pre, splt, val

    splt = str.split('°')
    if (splt.length > 1)
    {
        val = splt[0]
        if (val[0] === '(' && val.slice(-1)[0] === ')')
        {
            str = `rad${val}` + deg(splt.slice(1).join('°'))
        }
        else
        {
            for (var _a_ = i = val.length - 1, _b_ = 0; (_a_ <= _b_ ? i <= 0 : i >= 0); (_a_ <= _b_ ? ++i : --i))
            {
                if (!(_k_.in(val[i],'0.123456789')))
                {
                    pre = val.slice(0, typeof i === 'number' ? i+1 : Infinity)
                    val = val.slice(i + 1)
                    break
                }
            }
            pre = (pre != null ? pre : '')
            str = pre + `rad(${val})` + deg(splt.slice(1).join('°'))
        }
    }
    return str
}

build = function (str)
{
    var dep, pep

    pep = pepe(str)
    if (pep.length > 1 || !(_k_.isStr(pep[0])))
    {
        dep = pepe.depepe(pep,build)
        str = dep
    }
    str = pow(str)
    str = deg(str)
    return str
}

scooter = function (str, opt)
{
    var b, k, ost, precision, r, val

    if (_k_.isNum(opt))
    {
        opt = {precision:opt}
    }
    else
    {
        opt = (opt != null ? opt : {})
    }
    precision = opt.precision || 0
    ost = str
    str = str.replace(/log\(/g,'Math.log(')
    str = str.replace(/\//g,' / ')
    str = str.replace(/∡/g,'deg')
    str = str.replace(/√/g,'sqrt')
    str = str.replace(/π/g,'PI')
    str = str.replace(/ϕ/g,'PHI')
    str = str.replace(/𝒆/g,'E')
    str = str.replace(/∞/g,'Infinity')
    b = `{PI, E, sqrt, pow, exp, cos, sin, tan, acos, asin, atan} = Math
rad = d -> PI*d/180.0
deg = r -> r*180.0/PI
hex = v -> i = parseInt v; ((i<0) ? '-' : '')+'0x'+Math.abs(i).toString(16)
oct = v -> i = parseInt v; ((i<0) ? '-' : '')+'0o'+Math.abs(i).toString(8)
bin = v -> i = parseInt v; ((i<0) ? '-' : '')+'0b'+Math.abs(i).toString(2)
PHI = (1+sqrt(5))/2
`
    b += '(' + build(str) + ')'
    k = new kode
    r = k.eval(b)
    val = kstr(r)
    val = _k_.trim(val,' \n')
    val = val.replace(/Infinity/g,'∞')
    val = descience(val)
    if (precision)
    {
        val = precise(val,precision)
    }
    return val
}

scooter.near = function (a, b)
{
    return Math.abs(a - b) < 0.000000000000001
}
export default scooter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nvb3Rlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvc2Nvb3Rlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBZ0JBOztXQUVjLHFCQUFXOztRQUFNLE1BQU0sVUFBSTs7UUFDM0IscUJBQVc7O1FBQU0sTUFBTSxVQUFJOztXQUNqQzs7O0FBRVI7Ozs7UUFFYSxLQUFLLElBQUksT0FBTzs7ZUFBdkI7O0lBQ0YsTUFBTSxXQUFXO1FBQ2QsTUFBTTs7UUFFTCxNQUFNLElBQUksUUFBUTtRQUNsQixNQUFNLGdCQUFnQjs7V0FDMUI7OztBQVFKOzs7O2VBRU8sS0FBUTs7UUFDUCxNQUFNLE9BQU8sT0FBTyxXQUFXLE1BQU07O29CQUNqQyxLQUFROztRQUNaLEtBQUssU0FBUyxJQUFJLE1BQU0sTUFBTTtRQUM5QixNQUFNLE9BQU8sV0FBVyxLQUFLLFFBQVEsS0FBRztRQUN4QyxNQUFNLGdCQUFnQjs7V0FDMUI7OztBQVFKOztJQUtJLE1BQU0sSUFBSSxRQUFRLE1BQU87V0FDekI7OztBQVFKOzs7O0lBRUksT0FBTyxJQUFJLE1BQU07UUFDZCxLQUFLLFNBQVM7O1FBQ2IsTUFBTSxLQUFLO1lBQ1IsSUFBSSxPQUFNLE9BQVEscUJBQVc7O1lBQzVCLFlBQVksUUFBUSxJQUFJLFdBQUssR0FBSyxLQUFLOzs7OytCQUU5QixJQUFJLFNBQU8sU0FBRyxzQkFBQSxTQUFBOzs2QkFDaEIsSUFBSSxHQUFVOztvQkFDYixNQUFPLFVBQUksVUFBRyxpQkFBQTtvQkFDZCxNQUFNLFVBQUksSUFBRTtvQkFDWjs7O1lBQ1IsT0FBQSxjQUFBLE1BQU87WUFDUCxNQUFNLGFBQWEsU0FBUyxJQUFJLFdBQUssR0FBSyxLQUFLOzs7V0FDdkQ7OztBQVFKOzs7O0lBRUksTUFBTSxLQUFLO1FBRVIsSUFBSSxTQUFTLGlCQUFTLElBQUk7O1FBQ3pCLE1BQU0sS0FBSyxPQUFPLElBQUs7UUFDdkIsTUFBTTs7SUFFVixNQUFNLElBQUk7SUFDVixNQUFNLElBQUk7V0FDVjs7O0FBUUo7Ozs7a0JBRU87O1FBQ0MsT0FBTSxVQUFVOzs7O1FBRWhCLE9BQUEsY0FBQTs7SUFFSixZQUFZLElBQUksYUFBYTtJQUU3QixNQUFNO0lBQ04sTUFBTSxJQUFJLFFBQVEsU0FBVTtJQUU1QixNQUFNLElBQUksUUFBUSxNQUFRO0lBQzFCLE1BQU0sSUFBSSxRQUFRLEtBQU87SUFDekIsTUFBTSxJQUFJLFFBQVEsS0FBTTtJQUN4QixNQUFNLElBQUksUUFBUSxLQUFNO0lBQ3hCLE1BQU0sSUFBSSxRQUFRLEtBQU07SUFDeEIsTUFBTSxJQUFJLFFBQVEsTUFBTztJQUN6QixNQUFNLElBQUksUUFBUSxLQUFNO0lBRXhCLElBQUk7Ozs7Ozs7O0lBVUosS0FBSyxNQUFNLE1BQU0sT0FBTztJQUV4QixRQUFRO0lBQ1IsSUFBSSxFQUFFLEtBQUs7SUFJWCxNQUFNLEtBQUs7SUFDWCxlQUFXLElBQUs7SUFDaEIsTUFBTSxJQUFJLFFBQVMsWUFBYTtJQUVoQyxNQUFNLFVBQVU7UUFDZ0I7O1FBQWhDLE1BQU0sUUFBUSxJQUFLOztXQUNuQjs7O0FBRUosUUFBUTs7V0FBYyxLQUFLLElBQUksSUFBRSxLQUFLOztlQUUvQiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/scooter.kode
