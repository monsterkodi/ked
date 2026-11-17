var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var file, files, first, gone, idx, info, names, result, root, second, text, waitFor, walk

import fs from "fs"

import kxk from "../../kxk.js"
let nfs = kxk.nfs
let slash = kxk.slash
let sleep = kxk.sleep
let post = kxk.post

import index_kode from "../index/index_kode.js"
import index_hpp from "../index/index_hpp.js"
import index_noon from "../index/index_noon.js"
import index_json from "../index/index_json.js"
import index_utils from "../index/index_utils.js"
import indexer from "../index/indexer.js"

import fileutil from "../util/fileutil.js"
import walker from "../util/walker.js"


waitFor = async function (cond)
{
    var n

    n = 0
    while (n < 100)
    {
        if (cond())
        {
            return true
        }
        await sleep(10)
        n += 1
    }
    return false
}
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
    await section("cpp structs and their methods are indexed", async function ()
    {
        idx = new index_hpp
        result = idx.parse(`struct Win
{
    void show (int x);
    int width () const;
};`)
        compare(result.classes.map(function (c)
        {
            return c.name
        }),['Win'])
        compare(result.funcs.map(function (f)
        {
            return f.method
        }),['show','width'])
        compare(result.funcs.map(function (f)
        {
            return f.class
        }),['Win','Win'])
    })
    await section("cpp free functions are indexed without unnamed entries", async function ()
    {
        idx = new index_hpp
        result = idx.parse(`static JsonNode* route_info (const fs::path& path)
{
    struct stat st;
    if (::stat(path.c_str(), &st) != 0)
    {
        return node_null();
    }
}

int main (int argc, char** argv)
{
    return 0;
}`)
        compare(result.classes.length,0)
        compare(result.funcs.map(function (f)
        {
            return (f != null ? f.name : undefined)
        }),['route_info','main'])
    })
    await section("cpp files index without undefined entries", async function ()
    {
        root = '/tmp/opencode/ked-index-cpp'
        file = slash.path(root,'main.cpp')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,`struct Win
{
    void show (int x);
};

static JsonNode* route_info (const fs::path& path)
{
    struct stat st;
    if (::stat(path.c_str(), &st) != 0)
    {
        return node_null();
    }
}`)
        idx = new indexer
        await idx.index(file)
        info = idx.files[file]
        fs.rmSync(root,{recursive:true,force:true})
        compare(info.classes.map(function (c)
        {
            return c.name
        }),['Win'])
        compare(info.funcs.filter(function (f)
        {
            return !(f != null ? f.name : undefined)
        }).length,0)
        compare(info.funcs.map(function (f)
        {
            return f.name
        }),['show','route_info'])
        compare(info.funcs[0].class,'Win')
        compare(info.funcs[0].async,false)
        compare(info.funcs[0].bound,false)
    })
}
toExport["index"]._section_ = true
toExport["walker"] = async function ()
{
    await section("maxDepth zero lists only the root", async function ()
    {
        root = '/tmp/opencode/ked-walker-depth'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(slash.path(root,'one','two'),{recursive:true})
        fs.writeFileSync(slash.path(root,'a.md'),'')
        fs.writeFileSync(slash.path(root,'one','b.md'),'')
        fs.writeFileSync(slash.path(root,'one','two','c.md'),'')
        walk = new walker({root:root,maxDepth:0,ignore:[],includeExt:['md']})
        result = await walk.start()
        fs.rmSync(root,{recursive:true,force:true})
        compare(result.files.includes(slash.path(root,'a.md')),true)
        compare(result.files.includes(slash.path(root,'one','b.md')),false)
        compare(result.files.includes(slash.path(root,'one','two','c.md')),false)
    })
    await section("maxDepth one descends one level", async function ()
    {
        root = '/tmp/opencode/ked-walker-depth'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(slash.path(root,'one','two'),{recursive:true})
        fs.writeFileSync(slash.path(root,'a.md'),'')
        fs.writeFileSync(slash.path(root,'one','b.md'),'')
        fs.writeFileSync(slash.path(root,'one','two','c.md'),'')
        walk = new walker({root:root,maxDepth:1,ignore:[],includeExt:['md']})
        result = await walk.start()
        fs.rmSync(root,{recursive:true,force:true})
        compare(result.files.includes(slash.path(root,'a.md')),true)
        compare(result.files.includes(slash.path(root,'one','b.md')),true)
        compare(result.files.includes(slash.path(root,'one','two','c.md')),false)
    })
}
toExport["walker"]._section_ = true
toExport["fileutil"] = async function ()
{
    await section("existing files are absolute, resolved and unique", async function ()
    {
        first = slash.tmpfile('txt')
        second = slash.tmpfile('txt')
        gone = slash.tmpfile('txt')
        await nfs.write(first,'first')
        await nfs.write(second,'second')
        names = [slash.file(first),slash.file(second),slash.file(gone),slash.file(first)]
        files = await fileutil.existingFiles(names,slash.dir(first))
        compare(files,[first,second])
        await nfs.remove(first)
        await nfs.remove(second)
    })
}
toExport["fileutil"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvaW5kZXgua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBSSxTQUFBOztPQUNNLFVBQUE7SUFBTTtJQUFJO0lBQU07SUFBTTs7T0FDakIsaUJBQVI7T0FBbUIsZ0JBQW5CO09BQTZCLGlCQUE3QjtPQUF3QyxpQkFBeEM7T0FBbUQsa0JBQW5EO09BQStELGNBQS9EOztPQUNRLGVBQVI7T0FBaUIsYUFBakI7OztBQUVQLDBCQUFXOzs7O0lBRVAsSUFBSTtXQUNFLElBQUk7O1lBQ0k7O21CQUFSOztjQUNBLE1BQU07UUFDUixLQUFLOztXQUNUOzs7Ozs7Z0JBTUksWUFBWSxnQkFBZ0IsYUFBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLGdCQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsbUJBQXNCO2dCQUNsRCxZQUFZLGdCQUFnQixZQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsS0FBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLFVBQXNCO2dCQUNsRCxZQUFZLGdCQUFnQixXQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsY0FBc0I7Ozs7UUFJbEQsVUFBVTtRQUNWLFNBQVMsSUFBSSxNQUFNOzs7O2dCQU9uQixPQUFPLFFBQVEsT0FBUztnQkFDeEIsT0FBTyxRQUFRLEdBQUcsS0FBTztnQkFDekIsT0FBTyxRQUFRLEdBQUcsS0FBTztnQkFDekIsT0FBTyxRQUFRLEdBQUcsS0FBTztnQkFDekIsT0FBTyxRQUFRLEdBQUcsS0FBTzs7OztRQUl6QixVQUFVO1FBQ1YsU0FBUyxJQUFJLE1BQU07Ozs7O2dCQVFuQixPQUFPLE1BQU0sT0FBUztnQkFDdEIsT0FBTyxNQUFNLEdBQUcsS0FBTztnQkFDdkIsT0FBTyxNQUFNLEdBQUcsS0FBTztnQkFDdkIsT0FBTyxNQUFNLEdBQUcsS0FBTztnQkFDdkIsT0FBTyxNQUFNLEdBQUcsS0FBTztnQkFDdkIsT0FBTyxNQUFNLEdBQUcsS0FBTztnQkFDdkIsT0FBTyxNQUFNLEdB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/index.kode
