var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var scaling


scaling = (function ()
{
    function scaling ()
    {}

    scaling["scaleOfLine"] = function (syntax, scales, scaling, li)
    {
        var clss, s, scale

        if (!scaling || _k_.empty(scales) || !syntax)
        {
            return 1
        }
        if (!(_k_.in(syntax.ext,Object.keys(scales))))
        {
            return 1
        }
        for (clss in scales[syntax.ext])
        {
            scale = scales[syntax.ext][clss]
            s = _k_.clamp(1,7,scale)
            if (s > 1 && syntax.hasPureClass(li,clss))
            {
                return s
            }
        }
        return 1
    }

    scaling["rowPrefix"] = function (lines, lineHeight)
    {
        var li, rows

        rows = [0]
        for (var _a_ = li = 0, _b_ = lines.length; (_a_ <= _b_ ? li < lines.length : li > lines.length); (_a_ <= _b_ ? ++li : --li))
        {
            rows.push((rows[li] + lineHeight(li)))
        }
        return rows
    }

    return scaling
})()

export default scaling;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGluZy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9zY2FsaW5nLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUMsV0FBRDs7Ozs7SUFPSSxTQUFDLDBCQUFhLFFBQU8sUUFBTyxTQUFROzs7O2FBRXJCLHFCQUFpQixZQUFjOzttQkFBeEM7O3FCQUNLLE9BQU8sSUFBVyxPQUFPLEtBQUs7O21CQUFuQzs7YUFFRSxRQUFjLE9BQU8sT0FBTzs7WUFBdkIsUUFBUyxPQUFPLE9BQU87WUFDNUIsY0FBVSxFQUFFLEVBQUU7Z0JBQ1gsSUFBSSxLQUFNLE9BQU8sYUFBYSxHQUFHOzt1QkFDOUI7OztlQUNWOzs7SUFFSixTQUFDLHdCQUFXLE9BQU07Ozs7UUFFZCxRQUFRO3VCQUVKLEtBQU0sU0FBSSxNQUFNLDJCQUFOLE1BQU0sY0FBTixNQUFNOztZQUNoQixLQUFLLE1BQU0sS0FBSyxNQUFNLFdBQVc7O2VBRXJDOzs7V0F6QlA7OztlQTJCTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/scaling.kode
