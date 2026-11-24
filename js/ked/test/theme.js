var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var h, lines, missing

import kulur from "../../kolor/kulur.js"

import theme from "../theme/theme.js"


missing = function (lines, ext, filter)
{
    var chunk, clsss, line

    clsss = []
    var list = _k_.list(kulur.dissect(lines,ext))
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        line = list[_a_]
        var list1 = _k_.list(line)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            chunk = list1[_b_]
            if (filter(chunk.clss) && !theme.syntax[chunk.clss])
            {
                if (!(_k_.in(chunk.clss,clsss)))
                {
                    clsss.push(chunk.clss)
                }
            }
        }
    }
    return clsss
}
toExport["theme"] = async function ()
{
    await section("md punct", async function ()
    {
        lines = ["A `code` span, `f(a, b)` and **bold**.","- **bold, item** and `code; item` and **`bold code`**","```sh","out=$(mktemp -d)","```"]
        compare(missing(lines,'md',function (c)
        {
            return c.startsWith('punct')
        }),[])
    })
    await section("md files and urls", async function ()
    {
        lines = ['<img src="./img/kode.svg" />','see https://sub.example.com/a/b','<a href="https://example.com/x">']
        compare(missing(lines,'md',function (c)
        {
            return true
        }),[])
    })
    await section("md headings", async function ()
    {
        lines = []
        var list = ['#','##','###','####','#####']
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            h = list[_c_]
            lines.push(h + ' a, (b) `c-d` e')
        }
        lines.push('**a → b**')
        compare(missing(lines,'md',function (c)
        {
            return true
        }),[])
    })
}
toExport["theme"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdGhlbWUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBa0IsWUFBUjs7T0FDUSxZQUFYOzs7QUFFUCxvQkFBVSxPQUFNLEtBQUk7Ozs7SUFDaEI7d0JBQ1ksTUFBTSxRQUFRLE1BQU87OztRQUE3Qjs2QkFDYTs7O1lBQVQ7Z0JBQ0csT0FBTyxNQUFNLFVBQWMsTUFBTSxPQUFPLE1BQU07OzZCQUNwQixNQUFNLEtBQVk7O29CQUEzQyxNQUFNLEtBQUssTUFBTTs7Ozs7V0FDN0I7Ozs7OztRQU1JLFNBQ0kseUNBQ0Esd0RBQ0EsUUFDQSxtQkFDQTtRQUU4QyxRQUFsRCxRQUFRLE1BQU8sZUFBTzs7bUJBQU0sRUFBRSxXQUFXOzs7OztRQUl6QyxTQUNJLCtCQUNBLGtDQUNBO1FBRThCLFFBQWxDLFFBQVEsTUFBTyxlQUFPOzttQkFBTTs7Ozs7UUFJNUI7b0JBQ1UsSUFBSSxLQUFLLE1BQU0sT0FBTzs7O1lBQTVCO1lBQ0EsTUFBTSxLQUFLLElBQUk7O1FBQ25CLE1BQU0sS0FBSztRQUN1QixRQUFsQyxRQUFRLE1BQU8sZUFBTzs7bUJBQU0ifQ==
//# sourceURL=../../../kode/ked/test/theme.kode
