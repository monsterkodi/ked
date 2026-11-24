var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var h, lines, missing, own, s, _55_87_, _56_80_, _57_82_, _63_113_, _63_86_

import kulur from "../../kolor/kulur.js"

import theme from "../theme/theme.js"

import syntax from "../util/syntax.js"


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
            if (filter(chunk.clss) && !syntax.themeColor(chunk.clss))
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
    await section("md unicode", async function ()
    {
        lines = []
        var list1 = ['#','##','###','####','#####']
        for (var _d_ = 0; _d_ < list1.length; _d_++)
        {
            h = list1[_d_]
            lines.push(h + ' a ▸ © ↔ α')
        }
        lines.push('`▸ © ↔ α` *▸ ↔ it* **`▸ ↔`** ▸ ✔')
        compare(missing(lines,'md',function (c)
        {
            return true
        }),[])
    })
    await section("unicode fallback", async function ()
    {
        own = function (c)
        {
            return theme.syntax[c]
        }
        compare(syntax.themeColor('text unicode arrow bold'),((_55_87_=own('text unicode arrow bold')) != null ? _55_87_ : own('text unicode bold')))
        compare(syntax.themeColor('text unicode box'),((_56_80_=own('text unicode box')) != null ? _56_80_ : own('text unicode')))
        compare(syntax.themeColor('text unicode greek'),((_57_82_=own('text unicode greek')) != null ? _57_82_ : own('text unicode')))
        compare(syntax.themeColor('text unicode bold'),own('text unicode bold'))
        compare(syntax.themeColor('text unicode h9'),undefined)
        compare(syntax.themeColor('no such class'),undefined)
        s = new syntax('test')
        compare(s.getColor('text unicode math code'),((_63_86_=own('text unicode math code')) != null ? _63_86_ : ((_63_113_=own('text unicode code')) != null ? _63_113_ : [255,0,0])))
        compare(s.getColor('no such class'),[255,0,0])
    })
}
toExport["theme"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdGhlbWUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBa0IsWUFBUjs7T0FDUSxZQUFYOztPQUNXLGFBQVg7OztBQUVQLG9CQUFVLE9BQU0sS0FBSTs7OztJQUNoQjt3QkFDWSxNQUFNLFFBQVEsTUFBTzs7O1FBQTdCOzZCQUNhOzs7WUFBVDtnQkFDRyxPQUFPLE1BQU0sVUFBYyxPQUFPLFdBQVcsTUFBTTs7NkJBQ3pCLE1BQU0sS0FBWTs7b0JBQTNDLE1BQU0sS0FBSyxNQUFNOzs7OztXQUM3Qjs7Ozs7O1FBTUksU0FDSSx5Q0FDQSx3REFDQSxRQUNBLG1CQUNBO1FBRThDLFFBQWxELFFBQVEsTUFBTyxlQUFPOzttQkFBTSxFQUFFLFdBQVc7Ozs7O1FBSXpDLFNBQ0ksK0JBQ0Esa0NBQ0E7UUFFOEIsUUFBbEMsUUFBUSxNQUFPLGVBQU87O21CQUFNOzs7OztRQUk1QjtvQkFDVSxJQUFJLEtBQUssTUFBTSxPQUFPOzs7WUFBNUI7WUFDQSxNQUFNLEtBQUssSUFBSTs7UUFDbkIsTUFBTSxLQUFLO1FBQ3VCLFFBQWxDLFFBQVEsTUFBTyxlQUFPOzttQkFBTTs7Ozs7UUFJNUI7cUJBQ1UsSUFBSSxLQUFLLE1BQU0sT0FBTzs7O1lBQTVCO1lBQ0EsTUFBTSxLQUFLLElBQUk7O1FBQ25CLE1BQU0sS0FBSztRQUN1QixRQUFsQyxRQUFRLE1BQU8sZUFBTzs7bUJBQU07Ozs7O1FBSTVCLGdCQUFNOzttQkFBSyxNQUFNLE9BQU87O1FBRXNCLFFBQTlDLE9BQU8sV0FBVyxxQ0FBOEIsSUFBSSxnREFBNkIsSUFBSTtRQUN2QyxRQUE5QyxPQUFPLFdBQVcsOEJBQThCLElBQUkseUNBQXNCLElBQUk7UUFDaEMsUUFBOUMsT0FBTyxXQUFXLGdDQUE4QixJQUFJLDJDQUF3QixJQUFJO1FBQ2xDLFFBQTlDLE9BQU8sV0FBVyxxQkFBOEIsSUFBSTtRQUNOLFFBQTlDLE9BQU8sV0FBVyxtQkFBOEI7UUFDRixRQUE5QyxPQUFPLFdBQVcsaUJBQThCO1FBRWhELFFBQVEsT0FBTztRQUMrQixRQUE5QyxFQUFFLFNBQVMsb0NBQXFDLElBQUksMERBQTRCLElBQUksNENBQXdCLElBQUksRUFBRTtRQUNwRSxRQUE5QyxFQUFFLFNBQVMsa0JBQXNDLElBQUksRUFBRSJ9
//# sourceURL=../../../kode/ked/test/theme.kode
