var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var file, idx, info, result, root, text

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash

import index_kode from "../index/index_kode.js"
import index_noon from "../index/index_noon.js"
import index_json from "../index/index_json.js"
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
    await section("noon top level objects are indexed", async function ()
    {
        idx = new index_noon
        result = idx.parse(`name      ked
scripts
          build     pnpm run build
# comment
version   ^0.1.2`)
        compare(result.funcs.length,3)
        compare(result.funcs[0].name,'name')
        compare(result.funcs[0].line,0)
        compare(result.funcs[1].name,'scripts')
        compare(result.funcs[1].line,1)
        compare(result.funcs[2].name,'version')
        compare(result.funcs[2].line,4)
    })
    await section("json top level objects are indexed", async function ()
    {
        idx = new index_json
        result = idx.parse(`{
    "name": "ked",
    "scripts": {
        "build": "pnpm run build",
        "test":  "node js/test.js"
    },
    "url": "http://example.com",
    "version": "0.1.2"
}`)
        compare(result.funcs.length,4)
        compare(result.funcs[0].name,'name')
        compare(result.funcs[0].line,1)
        compare(result.funcs[1].name,'scripts')
        compare(result.funcs[1].line,2)
        compare(result.funcs[2].name,'url')
        compare(result.funcs[2].line,6)
        compare(result.funcs[3].name,'version')
        compare(result.funcs[3].line,7)
    })
    await section("json objects on one line are indexed", async function ()
    {
        idx = new index_json
        result = idx.parse('{"a": 1, "b": {"c": 2}, "d": [3]}')
        compare(result.funcs.length,3)
        compare(result.funcs[0].name,'a')
        compare(result.funcs[1].name,'b')
        compare(result.funcs[2].name,'d')
        compare(result.funcs[0].line,0)
    })
    await section("strings do not define classes or words", async function ()
    {
        idx = new index_kode
        text = ['■Before','    method: -> 1',"taken = 'class InsideSingle'",'other = "■InsideDouble"','quoted = """','    class InsideTriple','    ■ ShortcutInsideTriple','    """','■After','    other: -> 2'].join('\n')
        result = idx.parse(text)
        compare(result.classes.length,2)
        compare(result.classes[0].name,'Before')
        compare(result.classes[0].line,0)
        compare(result.classes[1].name,'After')
        compare(result.classes[1].line,8)
        compare(result.words.includes('InsideSingle'),false)
        compare(result.words.includes('InsideDouble'),false)
        compare(result.words.includes('InsideTriple'),false)
        compare(result.words.includes('ShortcutInsideTriple'),false)
        compare(result.words.includes('After'),true)
    })
    await section("post handlers keep their string event name", async function ()
    {
        idx = new index_kode
        result = idx.parse("post.on 'quit' -> 1")
        compare(result.funcs.length,1)
        compare(result.funcs[0].name,'quit')
        compare(result.funcs[0].post,true)
    })
    await section("a compare between strings is not a test marker", async function ()
    {
        idx = new index_kode
        text = ['▸ bad','    ke  """','        hello','        """ ▸ """','        world','        """'].join('\n')
        result = idx.parse(text)
        compare(result.funcs.length,1)
        compare(result.funcs[0].name,'▸ bad')
    })
    await section("noon files list top level objects", async function ()
    {
        root = '/tmp/opencode/ked-index-noon'
        file = slash.path(root,'top.noon')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'alpha\n    beta  1\ngamma  2\n')
        idx = new indexer
        await idx.index(file)
        info = idx.files[file]
        fs.rmSync(root,{recursive:true,force:true})
        compare(info.funcs.length,2)
        compare(info.funcs[0].name,'alpha')
        compare(info.funcs[0].line,1)
        compare(info.funcs[1].name,'gamma')
        compare(info.funcs[1].line,3)
    })
    await section("json files list top level objects", async function ()
    {
        root = '/tmp/opencode/ked-index-json'
        file = slash.path(root,'top.json')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'{\n  "alpha": 1,\n  "beta": {"gamma": 2}\n}\n')
        idx = new indexer
        await idx.index(file)
        info = idx.files[file]
        fs.rmSync(root,{recursive:true,force:true})
        compare(info.funcs.length,2)
        compare(info.funcs[0].name,'alpha')
        compare(info.funcs[0].line,2)
        compare(info.funcs[1].name,'beta')
        compare(info.funcs[1].line,3)
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
    await section("classes expose their base and methods", async function ()
    {
        root = '/tmp/opencode/ked-index-base'
        file = slash.path(root,'base.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,`■Root
    gamma: -> 3
■Base□Root
    alpha: -> 1
    beta: => 2
■Child□Base`)
        idx = new indexer
        await idx.index(file)
        fs.rmSync(root,{recursive:true,force:true})
        compare(idx.classInfo('Base').file,file)
        compare(idx.classInfo('Base').line,3)
        compare(idx.classInfo('Base').base,'Root')
        compare(idx.classInfo('Child').base,'Base')
        compare(idx.methodsOfClass('Base').map(function (f)
        {
            return f.name
        }),['alpha','beta'])
        compare(idx.methodsOfClass('Child').length,0)
        compare(idx.methodsOfClass('Nope').length,0)
        compare(idx.baseClassesOf('Child').map(function (c)
        {
            return c.name
        }),['Child','Base','Root'])
    })
}
toExport["index"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvaW5kZXgua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBSSxTQUFBOztPQUNNLFVBQUE7SUFBTTs7T0FDRCxpQkFBUjtPQUFtQixpQkFBbkI7T0FBOEIsaUJBQTlCO09BQXlDLGtCQUF6QztPQUFxRCxjQUFyRDs7Ozs7O2dCQU1DLFlBQVksZ0JBQWdCLGFBQXNCO2dCQUNsRCxZQUFZLGdCQUFnQixnQkFBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLG1CQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsWUFBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLEtBQXNCO2dCQUNsRCxZQUFZLGdCQUFnQixVQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsV0FBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLGNBQXNCOzs7O1FBSWxELFVBQVU7UUFDVixTQUFTLElBQUksTUFBTTs7OztnQkFPbkIsT0FBTyxRQUFRLE9BQVM7Z0JBQ3hCLE9BQU8sUUFBUSxHQUFHLEtBQU87Z0JBQ3pCLE9BQU8sUUFBUSxHQUFHLEtBQU87Z0JBQ3pCLE9BQU8sUUFBUSxHQUFHLEtBQU87Z0JBQ3pCLE9BQU8sUUFBUSxHQUFHLEtBQU87Ozs7UUFJekIsVUFBVTtRQUNWLFNBQVMsSUFBSSxNQUFNOzs7OztnQkFRbkIsT0FBTyxNQUFNLE9BQVM7Z0JBQ3RCLE9BQU8sTUFBTSxHQUFHLEtBQU87Z0JBQ3ZCLE9BQU8sTUFBTSxHQUFHLEtBQU87Z0JBQ3ZCLE9BQU8sTUFBTSxHQUFHLEtBQU87Z0JBQ3ZCLE9BQU8sTUFBTSxHQUFHLEtBQU87Z0JBQ3ZCLE9BQU8sTUFBTSxHQUFHLEtBQU87Z0JBQ3ZCLE9BQU8sTUFBTSxHQUFHLEtBQU87Ozs7UUFJdkIsVUFBVTtRQUNWLFNBQVMsSUFBSSxNQUFNOzs7Ozs7Ozs7Z0JBWW5CLE9BQU8sTUFBTSxPQUFTO2dCQUN0QixPQUFPLE1BQU0sR0FBRyxLQUFPO2dCQUN2QixPQUFPLE1BQU0sR0FBRyxLQUFPO2dC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/index.kode
