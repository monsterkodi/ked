var scaling


scaling = (function ()
{
    function scaling ()
    {}

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGluZy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9zY2FsaW5nLmtvZGUiXSwibWFwcGluZ3MiOiI7OztBQUFDLFdBQUQ7Ozs7O0lBUUksU0FBQyx3QkFBVyxPQUFNOzs7O1FBRWQsUUFBUTt1QkFFSixLQUFNLFNBQUksTUFBTSwyQkFBTixNQUFNLGNBQU4sTUFBTTs7WUFDaEIsS0FBSyxNQUFNLEtBQUssTUFBTSxXQUFXOztlQUVyQzs7O1dBZlA7OztlQWlCTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/scaling.kode
