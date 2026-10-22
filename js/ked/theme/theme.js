var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var ext, full_vibrant, k, key, setVibrant, v, val, value

import kxk from "../../kxk.js"
let post = kxk.post

import color from "./color.js"

import theme from './theme.json' with { type : "json" }
for (key in theme)
{
    val = theme[key]
    if (_k_.isStr(val))
    {
        theme[key] = color.values(val)
    }
    else
    {
        for (k in val)
        {
            v = val[k]
            val[k] = color.values(v)
        }
    }
}
for (key in theme.syntax)
{
    value = theme.syntax[key]
    if (key.startsWith('file_'))
    {
        ext = key.slice(5)
        theme.syntax['file_ext_' + ext] = color.darken(value,0.4)
        theme.syntax['file_icon_' + ext] = color.darken(value,0.6)
        theme.syntax['file_punct_' + ext] = color.darken(value,0.3)
    }
}
full_vibrant = _k_.clone(theme)

setVibrant = function (vf, lf = 1.0)
{
    var c

    vf = _k_.clamp(0,1,vf)
    for (key in full_vibrant)
    {
        val = full_vibrant[key]
        if (_k_.isArr(val))
        {
            c = color.saturate(val,vf,lf)
            theme[key][0] = c[0]
            theme[key][1] = c[1]
            theme[key][2] = c[2]
        }
        else
        {
            for (k in val)
            {
                v = val[k]
                c = color.saturate(v,vf,lf)
                theme[key][k][0] = c[0]
                theme[key][k][1] = c[1]
                theme[key][k][2] = c[2]
            }
        }
    }
}
post.on('theme.vibrant',setVibrant)
export default theme;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3RoZW1lL3RoZW1lLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRVSxVQUFBO0lBQU07O09BQ1YsWUFBQTs7T0FFQyxNQUFNLEtBQUssZUFBZSxLQUFLLEVBQUUsS0FBSSxFQUFFLE9BQU87S0FFakQsT0FBVzs7SUFBUCxNQUFPO1FBQ0QsVUFBUDs7UUFDQyxNQUFNLE9BQU8sTUFBTSxPQUFPOzs7O2FBRXRCLEtBQU87O1lBQUwsSUFBSztZQUNQLElBQUksS0FBSyxNQUFNLE9BQU87Ozs7S0FFOUIsT0FBYSxNQUFNOztJQUFmLFFBQVMsTUFBTTtRQUNoQixJQUFJLFdBQVc7O1FBQ2QsTUFBTSxVQUFJO1FBQ1YsTUFBTSxPQUFPLGNBQVksT0FBUyxNQUFNLE9BQU8sTUFBTTtRQUNyRCxNQUFNLE9BQU8sZUFBYSxPQUFRLE1BQU0sT0FBTyxNQUFNO1FBQ3JELE1BQU0sT0FBTyxnQkFBYyxPQUFPLE1BQU0sT0FBTyxNQUFNOzs7QUFRN0QseUJBQXFCOztBQUVyQix1QkFBYSxJQUFHLEtBQUc7Ozs7SUFFZixlQUFXLEVBQUUsRUFBRTtTQUNYLE9BQVc7O1FBQVAsTUFBTztZQUNELFVBQVA7O1lBQ0MsSUFBSSxNQUFNLFNBQVMsSUFBSSxHQUFHO1lBQzFCLE1BQU0sS0FBSyxLQUFLLEVBQUU7WUFDbEIsTUFBTSxLQUFLLEtBQUssRUFBRTtZQUNsQixNQUFNLEtBQUssS0FBSyxFQUFFOzs7O2lCQUVkLEtBQU87O2dCQUFMLElBQUs7Z0JBQ1AsSUFBSSxNQUFNLFNBQVMsRUFBRSxHQUFHO2dCQUN4QixNQUFNLEtBQUssR0FBRyxLQUFLLEVBQUU7Z0JBQ3JCLE1BQU0sS0FBSyxHQUFHLEtBQUssRUFBRTtnQkFDckIsTUFBTSxLQUFLLEdBQUcsS0FBSyxFQUFFOzs7OztBQUVyQyxLQUFLLEdBQUcsZ0JBQWdCO2VBRWpCIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/theme/theme.kode
