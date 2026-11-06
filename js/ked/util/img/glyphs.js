var glyphs

import fontmap from './fontmap.json' with { type : "json" }

glyphs = (function ()
{
    function glyphs ()
    {}

    glyphs["cache"] = {}
    glyphs["forScale"] = function (scale)
    {
        return this.forSize((scale * 2),(scale * 4))
    }

    glyphs["forSize"] = function (w, h)
    {
        var ch, key, mask, masks, raw, row, rows, x, y

        key = `${w}x${h}`
        if ((this.cache[key] != null))
        {
            return this.cache[key]
        }
        raw = fontmap[key]
        if (!raw)
        {
            return null
        }
        masks = {}
        for (ch in raw.glyphs)
        {
            rows = raw.glyphs[ch]
            mask = new Uint8Array(new ArrayBuffer(w * h))
            for (var _a_ = y = 0, _b_ = h; (_a_ <= _b_ ? y < h : y > h); (_a_ <= _b_ ? ++y : --y))
            {
                row = rows[y]
                for (var _c_ = x = 0, _d_ = w; (_c_ <= _d_ ? x < w : x > w); (_c_ <= _d_ ? ++x : --x))
                {
                    mask[y * w + x] = parseInt(row.substr(2 + x * 2,2),16)
                }
            }
            masks[ch] = mask
        }
        return this.cache[key] = masks
    }

    glyphs["hasScale"] = function (scale)
    {
        return (fontmap[`${scale * 2}x${scale * 4}`] != null)
    }

    return glyphs
})()

export default glyphs;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2x5cGhzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC91dGlsL2ltZy9nbHlwaHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FTTyxRQUFRLEtBQUssaUJBQWlCLEtBQUssRUFBRSxLQUFJLEVBQUUsT0FBTzs7QUFFeEQsVUFBRDs7Ozs7SUFFSSxRQUFDO0lBRUQsUUFBQyx1QkFBVTs7ZUFDUCxLQUFDLFNBQVMsUUFBTSxJQUFLLFFBQU07OztJQUUvQixRQUFDLHNCQUFTLEdBQUU7Ozs7UUFFUixTQUFTLEtBQUs7YUFFWCxLQUFDLE1BQU07O21CQUNKLEtBQUMsTUFBTTs7UUFFYixNQUFNLFFBQVE7YUFDQTs7bUJBQVo7O1FBRUY7YUFFSSxNQUFXLElBQUk7O1lBQVosT0FBUSxJQUFJO1lBRWYsV0FBVyxlQUFlLFlBQVksSUFBRTsyQkFFcEMsSUFBSyxTQUFJLHFCQUFBLFFBQUE7O2dCQUNULE1BQU0sS0FBSzsrQkFDUCxJQUFLLFNBQUkscUJBQUEsUUFBQTs7b0JBQ1QsS0FBSyxJQUFFLElBQUUsS0FBSyxTQUFTLElBQUksT0FBTyxJQUFFLElBQUUsRUFBRyxHQUFJOzs7WUFFckQsTUFBTSxNQUFNOztlQUVoQixLQUFDLE1BQU0sT0FBTzs7O0lBRWxCLFFBQUMsdUJBQVU7O2dCQUVQLFdBQVcsUUFBTSxLQUFLLFFBQU07OztXQWxDbkM7OztlQW9DTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/img/glyphs.kode
