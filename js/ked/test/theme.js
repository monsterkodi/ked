var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var lines, missingPunct

import kulur from "../../kolor/kulur.js"

import theme from "../theme/theme.js"


missingPunct = function (lines, ext)
{
    var chunk, line, missing

    missing = []
    var list = _k_.list(kulur.dissect(lines,ext))
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        line = list[_a_]
        var list1 = _k_.list(line)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            chunk = list1[_b_]
            if (chunk.clss.startsWith('punct') && !theme.syntax[chunk.clss])
            {
                if (!(_k_.in(chunk.clss,missing)))
                {
                    missing.push(chunk.clss)
                }
            }
        }
    }
    return missing
}
toExport["theme"] = async function ()
{
    await section("md punct", async function ()
    {
        lines = ["A `code` span, `f(a, b)` and **bold**.","- **bold, item** and `code; item` and **`bold code`**","```sh","out=$(mktemp -d)","```"]
        compare(missingPunct(lines,'md'),[])
    })
}
toExport["theme"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdGhlbWUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBa0IsWUFBUjs7T0FDUSxZQUFYOzs7QUFFUCx5QkFBZSxPQUFNOzs7O0lBQ2pCO3dCQUNZLE1BQU0sUUFBUSxNQUFPOzs7UUFBN0I7NkJBQ2E7OztZQUFUO2dCQUNHLE1BQU0sS0FBSyxXQUFXLGFBQWlCLE1BQU0sT0FBTyxNQUFNOzs2QkFDOUIsTUFBTSxLQUFZOztvQkFBN0MsUUFBUSxLQUFLLE1BQU07Ozs7O1dBQy9COzs7Ozs7UUFNSSxTQUNJLHlDQUNBLHdEQUNBLFFBQ0EsbUJBQ0E7UUFFc0IsUUFBMUIsYUFBYSxNQUFPIn0=
//# sourceURL=../../../kode/ked/test/theme.kode
