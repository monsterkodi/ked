var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var file, files, first, gone, idx, indexed, info, listed, names, one, parsed, result, root, second, text, zero

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


parsed = function (klass, text)
{
    var idx

    idx = new klass
    return idx.parse(text)
}

indexed = async function (name, content, ext = 'kode')
{
    var file, idx, root

    root = `/tmp/opencode/ked-index-${name}`
    file = slash.path(root,`index.${ext}`)
    fs.rmSync(root,{recursive:true,force:true})
    fs.mkdirSync(root,{recursive:true})
    fs.writeFileSync(file,content)
    idx = new indexer
    await idx.index(file)
    fs.rmSync(root,{recursive:true,force:true})
    return [idx,idx.files[file],file]
}
toExport["index"] = async function ()
{
    await section("class names", async function ()
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
    await section("kode", async function ()
    {
        result = parsed(index_kode,`■Foo
    method: -> 1
■ Bar
    other: -> 2`)
        compare(result.classes.length,2)
        compare(result.classes[0].name,'Foo')
        compare(result.classes[0].line,0)
        compare(result.classes[1].name,'Bar')
        compare(result.classes[1].line,2)
        text = ['■Before','    method: -> 1',"taken = 'class InsideSingle'",'other = "■InsideDouble"','quoted = """','    class InsideTriple','    ■ ShortcutInsideTriple','    """','■After','    other: -> 2'].join('\n')
        result = parsed(index_kode,text)
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
        result = parsed(index_kode,"post.on 'quit' -> 1")
        compare(result.funcs.length,1)
        compare(result.funcs[0].name,'quit')
        compare(result.funcs[0].post,true)
        text = ['▸ bad','    ke  """','        hello','        """ ▸ """','        world','        """'].join('\n')
        result = parsed(index_kode,text)
        compare(result.funcs.length,1)
        compare(result.funcs[0].name,'▸ bad')
    })
    await section("noon", async function ()
    {
        result = parsed(index_noon,`name      ked
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
        var _a_ = await indexed('noon','alpha\n    beta  1\ngamma  2\n','noon'); idx = _a_[0]; info = _a_[1]; file = _a_[2]

        compare(info.funcs.length,2)
        compare(info.funcs[0].name,'alpha')
        compare(info.funcs[0].line,1)
        compare(info.funcs[1].name,'gamma')
        compare(info.funcs[1].line,3)
    })
    await section("json", async function ()
    {
        result = parsed(index_json,`{
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
        result = parsed(index_json,'{"a": 1, "b": {"c": 2}, "d": [3]}')
        compare(result.funcs.length,3)
        compare(result.funcs[0].name,'a')
        compare(result.funcs[1].name,'b')
        compare(result.funcs[2].name,'d')
        compare(result.funcs[0].line,0)
        var _b_ = await indexed('json','{\n  "alpha": 1,\n  "beta": {"gamma": 2}\n}\n','json'); idx = _b_[0]; info = _b_[1]; file = _b_[2]

        compare(info.funcs.length,2)
        compare(info.funcs[0].name,'alpha')
        compare(info.funcs[0].line,2)
        compare(info.funcs[1].name,'beta')
        compare(info.funcs[1].line,3)
    })
    await section("cpp", async function ()
    {
        result = parsed(index_hpp,`struct Win
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
        result = parsed(index_hpp,`static JsonNode* route_info (const fs::path& path)
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
        var _c_ = await indexed('cpp',`struct Win
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
}`,'cpp'); idx = _c_[0]; info = _c_[1]; file = _c_[2]

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
    await section("files", async function ()
    {
        var _d_ = await indexed('waits','x = 1'); idx = _d_[0]; info = _d_[1]; file = _d_[2]

        compare((!_k_.empty(info)),true)
        var _e_ = await indexed('base',`■Root
    gamma: -> 3
■Base□Root
    alpha: -> 1
    beta: => 2
■Child□Base`); idx = _e_[0]; info = _e_[1]; file = _e_[2]

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
toExport["walker"] = async function ()
{
    await section("depth", async function ()
    {
        root = '/tmp/opencode/ked-walker-depth'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(slash.path(root,'one','two'),{recursive:true})
        fs.writeFileSync(slash.path(root,'a.md'),'')
        fs.writeFileSync(slash.path(root,'one','b.md'),'')
        fs.writeFileSync(slash.path(root,'one','two','c.md'),'')
        listed = async function (depth)
        {
            var rels, walk

            walk = new walker({root:root,maxDepth:depth,ignore:[],includeExt:['md']})
            result = await walk.start()
            rels = ['a.md','one/b.md','one/two/c.md']
            return rels.map(function (rel)
            {
                return result.files.includes(slash.path(root,rel))
            })
        }
        zero = await listed(0)
        one = await listed(1)
        fs.rmSync(root,{recursive:true,force:true})
        compare(zero,[true,false,false])
        compare(one,[true,true,false])
    })
}
toExport["walker"]._section_ = true
toExport["fileutil"] = async function ()
{
    await section("existing", async function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvaW5kZXgua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBSSxTQUFBOztPQUNNLFVBQUE7SUFBTTtJQUFJO0lBQU07SUFBTTs7T0FDakIsaUJBQVI7T0FBbUIsZ0JBQW5CO09BQTZCLGlCQUE3QjtPQUF3QyxpQkFBeEM7T0FBbUQsa0JBQW5EO09BQStELGNBQS9EOztPQUNRLGVBQVI7T0FBaUIsYUFBakI7OztBQUVQLG1CQUFVLE9BQU07Ozs7SUFDWixVQUFVO1dBQ1YsSUFBSSxNQUFNOzs7QUFFZCwwQkFBVyxNQUFLLFNBQVEsTUFBSTs7OztJQUN4QixrQ0FBa0M7SUFDbEMsT0FBTyxNQUFNLEtBQUssY0FBYztJQUNoQyxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtJQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO0lBQzVCLEdBQUcsY0FBYyxLQUFLO0lBQ3RCLFVBQVU7VUFDUixJQUFJLE1BQU07SUFDWixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtZQUNuQyxJQUFJLElBQUksTUFBTSxNQUFNOzs7Ozs7UUFNK0IsUUFBaEQsWUFBWSxnQkFBZ0IsYUFBc0I7UUFDRixRQUFoRCxZQUFZLGdCQUFnQixnQkFBc0I7UUFDRixRQUFoRCxZQUFZLGdCQUFnQixtQkFBc0I7UUFDRixRQUFoRCxZQUFZLGdCQUFnQixZQUFzQjtRQUNGLFFBQWhELFlBQVksZ0JBQWdCLEtBQXNCO1FBQ0YsUUFBaEQsWUFBWSxnQkFBZ0IsVUFBc0I7UUFDRixRQUFoRCxZQUFZLGdCQUFnQixXQUFzQjtRQUNGLFFBQWhELFlBQVksZ0JBQWdCLGNBQXNCOzs7O1FBSWxELFNBQVMsT0FBTyxXQUFXOzs7O1FBT0wsUUFBdEIsT0FBTyxRQUFRLE9BQVM7UUFDRCxRQUF2QixPQUFPLFFBQVEsR0FBRyxLQUFPO1FBQ0YsUUFBdkIsT0FBTyxRQUFRLEdBQUcsS0FBTztRQUNGLFFBQXZCLE9BQU8sUUFBUSxH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
//# sourceURL=../../../kode/ked/test/index.kode
