var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var i, map, scale, top

import glyphs from "../util/img/glyphs.js"

toExport["glyphs"] = async function ()
{
    await section("every map scale decodes", async function ()
    {
        for (scale = 2; scale <= 7; scale++)
        {
            map = glyphs.forScale(scale)
            compare(!_k_.empty(map),true)
            compare(map['a'].length,8 * scale * scale)
            top = 0
            for (var _a_ = i = 0, _b_ = map['a'].length; (_a_ <= _b_ ? i < map['a'].length : i > map['a'].length); (_a_ <= _b_ ? ++i : --i))
            {
                top = _k_.max(top,map['a'][i])
            }
            compare((top > 0),true)
            top = 0
            for (var _c_ = i = 0, _d_ = map[' '].length; (_c_ <= _d_ ? i < map[' '].length : i > map[' '].length); (_c_ <= _d_ ? ++i : --i))
            {
                top = _k_.max(top,map[' '][i])
            }
            compare(top,0)
        }
    })
    await section("uppercase is included", async function ()
    {
        map = glyphs.forScale(4)
        compare(map['A'].length,8 * 4 * 4)
        compare(map['Z'].length,8 * 4 * 4)
    })
    await section("forScale and forSize share their decoded map", async function ()
    {
        compare((glyphs.forScale(5) === glyphs.forSize(10,20)),true)
    })
    await section("unknown scales have no map", async function ()
    {
        compare(glyphs.forScale(1),null)
        compare(glyphs.forScale(8),null)
    })
}
toExport["glyphs"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2x5cGhzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2dseXBocy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztPQU1rQixhQUFBOzs7Ozs7YUFNTixRQUFTLFlBQUc7O1lBRVosTUFBTSxPQUFPLFNBQVM7K0JBRWhCLEtBQU07b0JBQ1osSUFBSSxLQUFLLE9BQVMsSUFBRSxRQUFNO1lBRTFCLE1BQU07MkJBQ0YsSUFBSyxTQUFJLElBQUksS0FBSywwQkFBVCxJQUFJLEtBQUssYUFBVCxJQUFJLEtBQUs7O2dCQUNsQixjQUFVLElBQUksSUFBSSxLQUFLOztxQkFDMUIsTUFBTSxHQUFLO1lBRVosTUFBTTsyQkFDRixJQUFLLFNBQUksSUFBSSxLQUFLLDBCQUFULElBQUksS0FBSyxhQUFULElBQUksS0FBSzs7Z0JBQ2xCLGNBQVUsSUFBSSxJQUFJLEtBQUs7O29CQUMzQixJQUFNOzs7OztRQUlWLE1BQU0sT0FBTyxTQUFTO2dCQUV0QixJQUFJLEtBQUssT0FBUyxJQUFFLElBQUU7Z0JBQ3RCLElBQUksS0FBSyxPQUFTLElBQUUsSUFBRTs7OztpQkFJckIsT0FBTyxTQUFTLE9BQU0sT0FBTyxRQUFRLEdBQUksS0FBTzs7OztnQkFJakQsT0FBTyxTQUFTLEdBQUk7Z0JBQ3BCLE9BQU8sU0FBUyxHQUFJIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/glyphs.kode
