var toExport = {}
var idx, result

import index_kode from "../index/index_kode.js"
import index_utils from "../index/index_utils.js"

toExport["index"] = async function ()
{
    await section("class names in line", async function ()
    {
        compare(index_utils.classNameInLine('class Foo'),'Foo')
        compare(index_utils.classNameInLine('function foo'),'foo')
        compare(index_utils.classNameInLine('Foo = class Bar'),'Bar')
        compare(index_utils.classNameInLine('classFoo'),undefined)
        compare(index_utils.classNameInLine('■'),undefined)
        compare(index_utils.classNameInLine('■Class'),'Class')
        compare(index_utils.classNameInLine('■ Class'),'Class')
        compare(index_utils.classNameInLine('Foo = ■Bar'),'Bar')
    })
    await section("shortcut classes are indexed", async function ()
    {
        idx = new index_kode
        result = idx.parse(`■Foo
    method: -> 1
■ Bar
    other: -> 2`)
        compare(result.classes.length,2)
        compare(result.classes[0].name,'Foo')
        compare(result.classes[0].line,0)
        compare(result.classes[1].name,'Bar')
        compare(result.classes[1].line,2)
    })
}
toExport["index"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvaW5kZXgua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQWUsaUJBQVI7T0FBbUIsa0JBQW5COzs7Ozs7Z0JBTUMsWUFBWSxnQkFBZ0IsYUFBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLGdCQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsbUJBQXNCO2dCQUNsRCxZQUFZLGdCQUFnQixZQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsS0FBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLFVBQXNCO2dCQUNsRCxZQUFZLGdCQUFnQixXQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsY0FBc0I7Ozs7UUFJbEQsVUFBVTtRQUNWLFNBQVMsSUFBSSxNQUFNOzs7O2dCQU9uQixPQUFPLFFBQVEsT0FBUztnQkFDeEIsT0FBTyxRQUFRLEdBQUcsS0FBTztnQkFDekIsT0FBTyxRQUFRLEdBQUcsS0FBTztnQkFDekIsT0FBTyxRQUFRLEdBQUcsS0FBTztnQkFDekIsT0FBTyxRQUFRLEdBQUcsS0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/index.kode
