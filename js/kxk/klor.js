var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var b, B, B256, bg, BG_COLORS, bold, c, C, exports, f, F, F256, fg, FG_COLORS, g, G, i, init, m, M, noop, r, R, reset, s, STRIPANSI, w, W, wrap, y, Y


f = function (r, g, b)
{
    return '\x1b[38;5;' + (16 + 36 * r + 6 * g + b) + 'm'
}

F = function (r, g, b)
{
    return '\x1b[48;5;' + (16 + 36 * r + 6 * g + b) + 'm'
}

r = function (i = 4)
{
    return (i < 6) && f(i,0,0) || f(5,i - 5,i - 5)
}

R = function (i = 4)
{
    return (i < 6) && F(i,0,0) || F(5,i - 5,i - 5)
}

g = function (i = 4)
{
    return (i < 6) && f(0,i,0) || f(i - 5,5,i - 5)
}

G = function (i = 4)
{
    return (i < 6) && F(0,i,0) || F(i - 5,5,i - 5)
}

b = function (i = 4)
{
    return (i < 6) && f(0,0,i) || f(i - 5,i - 5,5)
}

B = function (i = 4)
{
    return (i < 6) && F(0,0,i) || F(i - 5,i - 5,5)
}

y = function (i = 4)
{
    return (i < 6) && f(i,i,0) || f(5,5,i - 5)
}

Y = function (i = 4)
{
    return (i < 6) && F(i,i,0) || F(5,5,i - 5)
}

m = function (i = 4)
{
    return (i < 6) && f(i,0,i) || f(5,i - 5,5)
}

M = function (i = 4)
{
    return (i < 6) && F(i,0,i) || F(5,i - 5,5)
}

c = function (i = 4)
{
    return (i < 6) && f(0,i,i) || f(i - 5,5,5)
}

C = function (i = 4)
{
    return (i < 6) && F(0,i,i) || F(i - 5,5,5)
}

w = function (i = 4)
{
    return '\x1b[38;5;' + (232 + (i - 1) * 3) + 'm'
}

W = function (i = 4)
{
    return '\x1b[48;5;' + (232 + (i - 1) * 3 + 2) + 'm'
}
FG_COLORS = ['r','g','b','c','m','y','w']
BG_COLORS = ['R','M','B','Y','G','C','W']

noop = function (s)
{
    return s
}

wrap = function (open, close, searchRegex, replaceValue)
{
    return function (s)
    {
        return open + (~(s += "").indexOf(close,4) && s.replace(searchRegex,replaceValue) || s) + close
    }
}

init = function (open, close)
{
    return wrap(`\x1b[${open}m`,`\x1b[${close}m`,new RegExp(`\\x1b\\[${close}m`,"g"),`\x1b[${open}m`)
}

F256 = function (open)
{
    return wrap(open,"\x1b[39m",new RegExp("\\x1b\\[39m","g"),open)
}

B256 = function (open)
{
    return wrap(open,"\x1b[49m",new RegExp("\\x1b\\[49m","g"),open)
}
exports = {}
exports.bold = wrap("\x1b[1m","\x1b[22m",/\x1b\[22m/g,"\x1b[22m\x1b[1m")
exports.dim = wrap("\x1b[2m","\x1b[22m",/\x1b\[22m/g,"\x1b[22m\x1b[2m")
exports.reset = init(0,0)
exports.italic = init(3,23)
exports.underline = init(4,24)
exports.inverse = init(7,27)
exports.hidden = init(8,28)
exports.black = init(30,39)
exports.red = init(31,39)
exports.green = init(32,39)
exports.yellow = init(33,39)
exports.blue = init(34,39)
exports.magenta = init(35,39)
exports.cyan = init(36,39)
exports.white = init(37,39)
exports.gray = init(90,39)
exports.BG_COLORS = BG_COLORS
exports.FG_COLORS = FG_COLORS
exports.BG_NAMES = []
exports.FG_NAMES = []
var list = _k_.list(BG_COLORS)
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    bg = list[_a_]
    exports[bg] = eval(bg)
    for (i = 1; i <= 8; i++)
    {
        exports[bg + i] = B256(exports[bg](i))
        exports.BG_NAMES.push(bg + i)
    }
}
var list1 = _k_.list(FG_COLORS)
for (var _b_ = 0; _b_ < list1.length; _b_++)
{
    fg = list1[_b_]
    exports[fg] = eval(fg)
    for (i = 1; i <= 8; i++)
    {
        exports[fg + i] = F256(exports[fg](i))
        exports.FG_NAMES.push(fg + i)
    }
}

exports.globalize = function (enabled = true)
{
    var exp, glob, n

    if (globalThis.global)
    {
        glob = globalThis.global
    }
    else if (globalThis.window)
    {
        glob = globalThis.window
    }
    else
    {
        return
    }
    if (!enabled)
    {
        exp = function (n)
        {
            return noop
        }
    }
    else
    {
        exp = function (n)
        {
            return exports[n]
        }
    }
    var list2 = _k_.list(FG_COLORS)
    for (var _c_ = 0; _c_ < list2.length; _c_++)
    {
        fg = list2[_c_]
        for (i = 1; i <= 8; i++)
        {
            bg = fg.toUpperCase()
            glob[fg + i] = exp(fg + i)
            glob[bg + i] = exp(bg + i)
        }
        var list3 = ['underline','bold','dim','italic','inverse','reset','strip','black','red','green','yellow','blue','magenta','cyan','white','gray']
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            n = list3[_d_]
            glob[n] = exp(n)
        }
    }
}
STRIPANSI = /\x1B[[(?);]{0,2}(;?\d)*./g

exports.strip = function (s)
{
    return String(s).replace(STRIPANSI,'')
}
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    reset = '\x1b[0m'
    bold = '\x1b[1m'
    var list2 = _k_.list(BG_COLORS)
for (var _e_ = 0; _e_ < list2.length; _e_++)
{
    bg = list2[_e_]
    for (i = 1; i <= 8; i++)
    {
        s = reset
        fg = bg.toLowerCase()
        s += exports[fg + i](`${fg + i} ${bg + i} `)
        var list3 = _k_.list(FG_COLORS)
        for (var _f_ = 0; _f_ < list3.length; _f_++)
        {
            fg = list3[_f_]
            s += exports[bg + i](exports[fg + (9 - i)](' ' + fg + ' '))
        }
        console.log(s + reset)
    }
}
    console.log(" ")
}
exports.map = {'punct':'w3','punct this':'b3','punct comment':'w1','punct comment triple':'w1','punct semver':'r2','punct regexp':'m2','punct regexp start':'m8','punct regexp end':'m8','punct regexp triple':'m2','punct escape regexp':'m1','punct escape regexp triple':'m1','punct string single':'g1','punct string single triple':'g1','punct string double':'g1','punct string double triple':'g1','punct string interpolation start':'g1','punct string interpolation end':'g1','punct number float':'r3','punct method':'r2','punct dictionary':'y1','punct property':'y1','punct range':'b4','punct code':'b1','punct code triple':'b1','punct meta':'g1','punct bold':'y1','punct italic':'m1','punct url':'b1','punct url tld':'b1','punct coffee':'y1','punct dir':'g1','punct obj':'y1','punct js':'m1','punct git':'w1','punct li1':'g1','punct li2':'g1','punct li3':'g1','punct li1 marker':'g4','punct li2 marker':'g3','punct li3 marker':'g2','punct class':'y2','punct method class':'y2','punct keyword':'b6','punct function':'r1','punct function call':'r2','punct function tail':['b6','bold','B1'],'punct function head':['b6','bold','B1'],'punct function bound tail':['r5','bold','R1'],'punct function bound head':['r5','bold','R1'],'punct h1':'y1','punct h2':'r1','punct h3':'b3','punct h4':'b2','punct h5':'b1','punct template':'m1','text':'w8','text h1':'y4','text h2':'r4','text h3':'b8','text h4':'b6','text h5':'b5','text li1':'g4','text li2':'g2','text li3':'g1','text dir':'g4','text file':'g6','text this':'b8','text bold':'y7','text code':'b8','text italic':['m7','italic'],'text regexp':'m6','text regexp triple':'m6','string single':'g3','string double':'g4','string single triple':'g3','string double triple':'g4','nil':'m2','obj':'y5','define':'w3','require':'w3','doctype':'b8','number':'b7','number hex':'c3','number float':'r7','semver':'r5','module':'y6','module this':'y2','meta':'g4','class':'y5','method':'r6','method class':'y7','function':'r4','function call':'r5','function call this':'r2','keyword':'b8','keyword function':'w2','keyword type':'b2','keyword html':'b8','keyword svg':'b8','property':'y6','property color':'m4','property special':'m4','dictionary key':'y8','argument':'c3','url protocol':'b2','url domain':'b8','url tld':'b4','coffee file':'y4','coffee ext':'y1','js file':'m4','js ext':'m2','git file':'w8','git ext':'w2','important':'w4','template':'m3','struct':'c3','comment':'w3','comment triple':'w4','comment header':['g1','G1'],'comment triple header':['g2','G2']}
export default exports;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2xvci5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva2xvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQVFBOztXQUFpQixnQkFBZ0IsS0FBSyxLQUFHLElBQUksSUFBRSxJQUFJLEtBQUs7OztBQUN4RDs7V0FBaUIsZ0JBQWdCLEtBQUssS0FBRyxJQUFJLElBQUUsSUFBSSxLQUFLOzs7QUFFeEQ7O1lBQWMsSUFBSSxNQUFPLEVBQUUsRUFBRyxFQUFHLE1BQU0sRUFBSSxFQUFHLElBQUUsRUFBRyxJQUFFOzs7QUFDckQ7O1lBQWMsSUFBSSxNQUFPLEVBQUUsRUFBRyxFQUFHLE1BQU0sRUFBSSxFQUFHLElBQUUsRUFBRyxJQUFFOzs7QUFDckQ7O1lBQWMsSUFBSSxNQUFPLEVBQUUsRUFBRyxFQUFHLE1BQU0sRUFBRSxJQUFFLEVBQUssRUFBRyxJQUFFOzs7QUFDckQ7O1lBQWMsSUFBSSxNQUFPLEVBQUUsRUFBRyxFQUFHLE1BQU0sRUFBRSxJQUFFLEVBQUssRUFBRyxJQUFFOzs7QUFDckQ7O1lBQWMsSUFBSSxNQUFPLEVBQUUsRUFBRyxFQUFHLE1BQU0sRUFBRSxJQUFFLEVBQUcsSUFBRSxFQUFLOzs7QUFDckQ7O1lBQWMsSUFBSSxNQUFPLEVBQUUsRUFBRyxFQUFHLE1BQU0sRUFBRSxJQUFFLEVBQUcsSUFBRSxFQUFLOzs7QUFDckQ7O1lBQWMsSUFBSSxNQUFPLEVBQUUsRUFBRyxFQUFHLE1BQU0sRUFBSSxFQUFLLEVBQUcsSUFBRTs7O0FBQ3JEOztZQUFjLElBQUksTUFBTyxFQUFFLEVBQUcsRUFBRyxNQUFNLEVBQUksRUFBSyxFQUFHLElBQUU7OztBQUNyRDs7WUFBYyxJQUFJLE1BQU8sRUFBRSxFQUFHLEVBQUcsTUFBTSxFQUFJLEVBQUcsSUFBRSxFQUFLOzs7QUFDckQ7O1lBQWMsSUFBSSxNQUFPLEVBQUUsRUFBRyxFQUFHLE1BQU0sRUFBSSxFQUFHLElBQUUsRUFBSzs7O0FBQ3JEOztZQUFjLElBQUksTUFBTyxFQUFFLEVBQUcsRUFBRyxNQUFN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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/klor.kode
