var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var file, idx, result, root

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash

import index_kode from "../index/index_kode.js"
import index_utils from "../index/index_utils.js"
import indexer from "../index/indexer.js"

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
    await section("index waits for the file to be read and parsed", async function ()
    {
        root = '/tmp/opencode/ked-index-waits'
        file = slash.path(root,'waits.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'x = 1')
        idx = new indexer
        await idx.index(file)
        fs.rmSync(root,{recursive:true,force:true})
        compare((!_k_.empty(idx.files[file])),true)
    })
}
toExport["index"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvaW5kZXgua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBSSxTQUFBOztPQUNNLFVBQUE7SUFBTTs7T0FDRCxpQkFBUjtPQUFtQixrQkFBbkI7T0FBK0IsY0FBL0I7Ozs7OztnQkFNQyxZQUFZLGdCQUFnQixhQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsZ0JBQXNCO2dCQUNsRCxZQUFZLGdCQUFnQixtQkFBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLFlBQXNCO2dCQUNsRCxZQUFZLGdCQUFnQixLQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsVUFBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLFdBQXNCO2dCQUNsRCxZQUFZLGdCQUFnQixjQUFzQjs7OztRQUlsRCxVQUFVO1FBQ1YsU0FBUyxJQUFJLE1BQU07Ozs7Z0JBT25CLE9BQU8sUUFBUSxPQUFTO2dCQUN4QixPQUFPLFFBQVEsR0FBRyxLQUFPO2dCQUN6QixPQUFPLFFBQVEsR0FBRyxLQUFPO2dCQUN6QixPQUFPLFFBQVEsR0FBRyxLQUFPO2dCQUN6QixPQUFPLFFBQVEsR0FBRyxLQUFPOzs7O1FBSXpCLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFDNUIsR0FBRyxjQUFjLEtBQUs7UUFFdEIsVUFBVTtjQUNSLElBQUksTUFBTTtRQUVaLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzRCQUU3QixJQUFJLE1BQU0sUUFBUyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/index.kode
