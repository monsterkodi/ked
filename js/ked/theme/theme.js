var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var convert, ext, full_vibrant, key, setVibrant, value

import kxk from "../../kxk.js"
let post = kxk.post

import color from "./color.js"

import theme from './theme.json' with { type : "json" }

convert = function (dict)
{
    var key, val

    for (key in dict)
    {
        val = dict[key]
        if (_k_.isStr(val))
        {
            dict[key] = color.values(val)
        }
        else
        {
            convert(val)
        }
    }
}
convert(theme)
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
    var c, k, v, val

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3RoZW1lL3RoZW1lLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FRVSxVQUFBO0lBQU07O09BQ1YsWUFBQTs7T0FFQyxNQUFNLEtBQUssZUFBZSxLQUFLLEVBQUUsS0FBSSxFQUFFLE9BQU87O0FBRXJELG9CQUFVOzs7O1NBQ0YsT0FBVzs7UUFBUCxNQUFPO1lBQ0QsVUFBUDs7WUFDQyxLQUFLLE9BQU8sTUFBTSxPQUFPOzs7O1lBRXpCLFFBQVE7Ozs7QUFDcEIsUUFBUTtLQUVKLE9BQWEsTUFBTTs7SUFBZixRQUFTLE1BQU07UUFDaEIsSUFBSSxXQUFXOztRQUNkLE1BQU0sVUFBSTtRQUNWLE1BQU0sT0FBTyxjQUFZLE9BQVMsTUFBTSxPQUFPLE1BQU07UUFDckQsTUFBTSxPQUFPLGVBQWEsT0FBUSxNQUFNLE9BQU8sTUFBTTtRQUNyRCxNQUFNLE9BQU8sZ0JBQWMsT0FBTyxNQUFNLE9BQU8sTUFBTTs7O0FBUTdELHlCQUFxQjs7QUFFckIsdUJBQWEsSUFBRyxLQUFHOzs7O0lBRWYsZUFBVyxFQUFFLEVBQUU7U0FDWCxPQUFXOztRQUFQLE1BQU87WUFDRCxVQUFQOztZQUNDLElBQUksTUFBTSxTQUFTLElBQUksR0FBRztZQUMxQixNQUFNLEtBQUssS0FBSyxFQUFFO1lBQ2xCLE1BQU0sS0FBSyxLQUFLLEVBQUU7WUFDbEIsTUFBTSxLQUFLLEtBQUssRUFBRTs7OztpQkFFZCxLQUFPOztnQkFBTCxJQUFLO2dCQUNQLElBQUksTUFBTSxTQUFTLEVBQUUsR0FBRztnQkFDeEIsTUFBTSxLQUFLLEdBQUcsS0FBSyxFQUFFO2dCQUNyQixNQUFNLEtBQUssR0FBRyxLQUFLLEVBQUU7Z0JBQ3JCLE1BQU0sS0FBSyxHQUFHLEtBQUssRUFBRTs7Ozs7QUFFckMsS0FBSyxHQUFHLGdCQUFnQjtlQUVqQiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/theme/theme.kode
