var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var dir, file, hadword, idx, info, newDir, newFile, oldDir, oldFile, one, result, root, text, two, waitFor

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep
let post = kxk.post

import index_kode from "../index/index_kode.js"
import index_hpp from "../index/index_hpp.js"
import index_noon from "../index/index_noon.js"
import index_json from "../index/index_json.js"
import index_utils from "../index/index_utils.js"
import indexer from "../index/indexer.js"


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
    await section("deleted files leave the index", async function ()
    {
        root = '/tmp/opencode/ked-index-delete'
        file = slash.path(root,'gone.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'■Gone\n    zebraword: -> 1\n')
        idx = new indexer
        await idx.index(file)
        hadword = (idx.words['zebraword'] != null ? idx.words['zebraword'].has(file) : undefined)
        fs.rmSync(file)
        post.emit('file.change',{path:file,change:'delete'})
        await waitFor(function ()
        {
            return !(idx.files[file] != null)
        })
        fs.rmSync(root,{recursive:true,force:true})
        compare(hadword,true)
        compare(((idx.files[file] != null)),false)
        compare(((idx.funcs['zebraword'] != null)),false)
        compare(((idx.classes['Gone'] != null)),false)
        compare(((idx.words['zebraword'] != null)),false)
    })
    await section("renamed files move their index entries", async function ()
    {
        root = '/tmp/opencode/ked-index-rename'
        oldFile = slash.path(root,'old.kode')
        newFile = slash.path(root,'new.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(oldFile,'■Old\n    zebraword: -> 1\n')
        idx = new indexer
        await idx.index(oldFile)
        fs.renameSync(oldFile,newFile)
        post.emit('file.change',{path:newFile,oldPath:oldFile,change:'rename'})
        await waitFor(function ()
        {
            return (idx.files[newFile] != null) && !(idx.files[oldFile] != null)
        })
        fs.rmSync(root,{recursive:true,force:true})
        compare(((idx.files[oldFile] != null)),false)
        compare(((idx.files[newFile] != null)),true)
        compare(((idx.funcs['zebraword'] != null)),true)
        compare(idx.funcs['zebraword'][0].file,newFile)
        compare(((idx.words['zebraword'] != null ? idx.words['zebraword'].has(newFile) : undefined)),true)
        compare(((idx.words['zebraword'] != null ? idx.words['zebraword'].has(oldFile) : undefined)),false)
    })
    await section("deleted folders remove their indexed files", async function ()
    {
        root = '/tmp/opencode/ked-index-folder-delete'
        dir = slash.path(root,'folder')
        one = slash.path(dir,'one.kode')
        two = slash.path(dir,'two.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(dir,{recursive:true})
        fs.writeFileSync(one,'oneword = 1\n')
        fs.writeFileSync(two,'twoword = 2\n')
        idx = new indexer
        await idx.index(one)
        await idx.index(two)
        fs.rmSync(dir,{recursive:true,force:true})
        post.emit('file.change',{path:dir,change:'delete'})
        await waitFor(function ()
        {
            return !(idx.files[one] != null) && !(idx.files[two] != null)
        })
        fs.rmSync(root,{recursive:true,force:true})
        compare(((idx.files[one] != null)),false)
        compare(((idx.files[two] != null)),false)
    })
    await section("renamed folders move their indexed files", async function ()
    {
        root = '/tmp/opencode/ked-index-folder-rename'
        oldDir = slash.path(root,'old')
        newDir = slash.path(root,'new')
        oldFile = slash.path(oldDir,'one.kode')
        newFile = slash.path(newDir,'one.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(oldDir,{recursive:true})
        fs.writeFileSync(oldFile,'oneword = 1\n')
        idx = new indexer
        await idx.index(oldFile)
        fs.renameSync(oldDir,newDir)
        post.emit('file.change',{path:newDir,oldPath:oldDir,change:'rename'})
        await waitFor(function ()
        {
            return (idx.files[newFile] != null) && !(idx.files[oldFile] != null)
        })
        fs.rmSync(root,{recursive:true,force:true})
        compare(((idx.files[oldFile] != null)),false)
        compare(((idx.files[newFile] != null)),true)
    })
    await section("created files enter the index", async function ()
    {
        root = '/tmp/opencode/ked-index-create'
        file = slash.path(root,'new.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        idx = new indexer
        fs.writeFileSync(file,'newword = 1\n')
        post.emit('file.change',{path:file,change:'create'})
        await waitFor(function ()
        {
            return (idx.files[file] != null)
        })
        fs.rmSync(root,{recursive:true,force:true})
        compare(((idx.files[file] != null)),true)
    })
}
toExport["index"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvaW5kZXgua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBSSxTQUFBOztPQUNNLFVBQUE7SUFBTTtJQUFNO0lBQU07O09BQ2IsaUJBQVI7T0FBbUIsZ0JBQW5CO09BQTZCLGlCQUE3QjtPQUF3QyxpQkFBeEM7T0FBbUQsa0JBQW5EO09BQStELGNBQS9EOzs7QUFFUCwwQkFBVzs7OztJQUVQLElBQUk7V0FDRSxJQUFJOztZQUNJOzttQkFBUjs7Y0FDQSxNQUFNO1FBQ1IsS0FBSzs7V0FDVDs7Ozs7O2dCQU1JLFlBQVksZ0JBQWdCLGFBQXNCO2dCQUNsRCxZQUFZLGdCQUFnQixnQkFBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLG1CQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsWUFBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLEtBQXNCO2dCQUNsRCxZQUFZLGdCQUFnQixVQUFzQjtnQkFDbEQsWUFBWSxnQkFBZ0IsV0FBc0I7Z0JBQ2xELFlBQVksZ0JBQWdCLGNBQXNCOzs7O1FBSWxELFVBQVU7UUFDVixTQUFTLElBQUksTUFBTTs7OztnQkFPbkIsT0FBTyxRQUFRLE9BQVM7Z0JBQ3hCLE9BQU8sUUFBUSxHQUFHLEtBQU87Z0JBQ3pCLE9BQU8sUUFBUSxHQUFHLEtBQU87Z0JBQ3pCLE9BQU8sUUFBUSxHQUFHLEtBQU87Z0JBQ3pCLE9BQU8sUUFBUSxHQUFHLEtBQU87Ozs7UUFJekIsVUFBVTtRQUNWLFNBQVMsSUFBSSxNQUFNOzs7OztnQkFRbkIsT0FBTyxNQUFNLE9BQVM7Z0JBQ3RCLE9BQU8sTUFBTSxHQUFHLEtBQU87Z0JBQ3ZCLE9BQU8sTUFBTSxHQUFHLEtBQU87Z0JBQ3ZCLE9BQU8sTUFBTSxHQUFHLEtBQU87Z0JBQ3ZCLE9BQU8sTUFBTSxHQUFHLEtBQU87Z0JBQ3ZCLE9BQU8sTUFBTSxHQUFHLEtBQU87Z0JBQ3ZCLE9BQU8sTUFBTSxHQUFHLEtBQU87Ozs7UUFJdkIsVUFBVTtRQUNWLFNB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/index.kode
