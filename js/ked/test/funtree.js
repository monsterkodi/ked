var toExport = {}
var baseFile, childFile, e, emitted, f, file, h, idx, ked_sess, originalEmit, root, supr

import fs from "fs"

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import indexer from "../index/indexer.js"

import funtree from "../view/colmns/funtree.js"


ked_sess = function ()
{
    var fakeGet, fakeSet, store

    store = {}
    fakeGet = function (key, def)
    {
        var _11_38_

        return ((_11_38_=store[key]) != null ? _11_38_ : def)
    }
    fakeSet = function (key, value)
    {
        return store[key] = value
    }
    return global.ked_session = {get:fakeGet,set:fakeSet}
}
ked_sess()
toExport["funtree"] = async function ()
{
    await section("base class chain", async function ()
    {
        root = '/tmp/opencode/ked-funtree-base'
        baseFile = slash.path(root,'base.kode')
        childFile = slash.path(root,'child.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(baseFile,`■Base□Root
    alpha: -> 1
    beta: => 2
■Root
    gamma: -> 3`)
        fs.writeFileSync(childFile,"■Child□Base\n")
        idx = new indexer
        await idx.index(baseFile)
        await idx.index(childFile)
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_funtree_editor',[])
        e.currentFile = childFile
        f = new funtree(e,'test_funtree',[])
        f.onFileIndexed(childFile,idx.files[childFile])
        fs.rmSync(root,{recursive:true,force:true})
        compare(f.showBases,true)
        compare(f.items.map(function (i)
        {
            return i.name
        }),[' ■ Child',' □',' ■ Base','   -> alpha','   => beta',' ■ Root','   -> gamma'])
        compare(f.items[1].divider,true)
        compare(f.items[2].inherited,true)
        compare(f.items[2].file,baseFile)
        compare(f.items[2].line,1)
        compare(f.items[3].inherited,true)
        compare(f.items[3].file,baseFile)
        compare(f.items[3].line,2)
        compare(f.items[3].class,'Base')
        f.selectItemForLineIndex(3)
        compare(f.currentIndex(),0)
        compare(f.lineIndexOfNextFunc(),undefined)
        f.emitAction('space',f.items[1])
        compare(f.showBases,false)
        compare(f.items.map(function (i)
        {
            return i.name
        }),[' ■ Child',' □ 2'])
        f.emitAction('return',f.items[1])
        compare(f.showBases,true)
        compare(f.items.map(function (i)
        {
            return i.name
        }),[' ■ Child',' □',' ■ Base','   -> alpha','   => beta',' ■ Root','   -> gamma'])
        emitted = []
        originalEmit = post.emit
        post.emit = function (event, ...args)
        {
            return emitted.push([event].concat(args))
        }
        f.emitAction('right',f.items[1])
        f.emitAction('drag',f.items[1])
        post.emit = originalEmit
        compare(emitted.length,0)
        supr = {clss:true,name:' ■ Child',line:1}
        compare(f.itemsForBaseClass(supr).length,0)
    })
    await section("jump to inherited items", async function ()
    {
        root = '/tmp/opencode/ked-funtree-jump'
        baseFile = slash.path(root,'base.kode')
        childFile = slash.path(root,'child.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(baseFile,`■Base
    alpha: -> 1`)
        fs.writeFileSync(childFile,"■Child□Base\n")
        idx = new indexer
        await idx.index(baseFile)
        await idx.index(childFile)
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_funtree_jump_editor',[])
        e.currentFile = childFile
        f = new funtree(e,'test_funtree_jump',[])
        f.onFileIndexed(childFile,idx.files[childFile])
        fs.rmSync(root,{recursive:true,force:true})
        emitted = []
        originalEmit = post.emit
        post.emit = function (event, ...args)
        {
            return emitted.push([event].concat(args))
        }
        f.emitAction('return',f.items[0])
        f.emitAction('return',f.items[3])
        post.emit = originalEmit
        compare(emitted[0],['goto.line',0,'ind','topDelta'])
        compare(emitted[1],['focus','editor'])
        compare(emitted[2],['file.open',baseFile,1,'ind','topDelta'])
        compare(emitted[3],['focus','editor'])
    })
    await section("cpp with unnamed index", async function ()
    {
        root = '/tmp/opencode/ked-funtree-cpp'
        file = slash.path(root,'main.cpp')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,`static JsonNode* route_info (const fs::path& path)
{
    struct stat st;
    if (::stat(path.c_str(), &st) != 0)
    {
        return node_null();
    }
}`)
        idx = new indexer
        await idx.index(file)
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_funtree_cpp_editor',[])
        e.currentFile = file
        f = new funtree(e,'test_funtree_cpp',[])
        f.onFileIndexed(file,idx.files[file])
        fs.rmSync(root,{recursive:true,force:true})
        compare(f.items.length,1)
        compare(f.items[0].name,' -> @route_info')
    })
}
toExport["funtree"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVudHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9mdW50cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNJLFNBQUE7O09BQ00sVUFBQTtJQUFTO0lBQUs7O09BQ0wsYUFBWjs7T0FDWSxjQUFaOztPQUNZLGNBQVo7O09BQ2MsY0FBVDs7O0FBRVo7Ozs7SUFDSTtJQUNBLG9CQUFXLEtBQUk7Ozs7eUJBQVEsTUFBTSwwQkFBTzs7SUFDcEMsb0JBQVcsS0FBSTs7ZUFBVSxNQUFNLE9BQU87O1dBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTs7QUFFekM7Ozs7O1FBTVEsT0FBTztRQUNQLFdBQVcsTUFBTSxLQUFLLEtBQUs7UUFDM0IsWUFBWSxNQUFNLEtBQUssS0FBSztRQUU1QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsY0FBYyxTQUFTOzs7OztRQU8xQixHQUFHLGNBQWMsVUFBVTtRQUUzQixVQUFVO2NBQ1IsSUFBSSxNQUFNO2NBQ1YsSUFBSSxNQUFNO1FBRVosUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO1FBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFBRSxjQUFjO1FBRWhCLFFBQVEsUUFBUSxFQUFFO1FBRWxCLEVBQUUsY0FBYyxVQUFVLElBQUksTUFBTTtRQUVwQyxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsRUFBRSxVQUFZO2dCQUNkLEVBQUUsTUFBTSxjQUFLOzttQkFBTSxFQUFFO1lBQVMsV0FBVyxLQUFLLFVBQVUsY0FBYyxhQUFhLFVBQVU7Z0JBRTdGLEVBQUUsTUFBTSxHQUFHLFFBQVU7Z0JBRXJCLEVBQUUsTUFBTSxHQUFHLFVBQVk7Z0JBQ3ZCLEVBQUUsTUFBTSxHQUFHLEtBQU87Z0JBQ2xCLEVBQUUsTUFBTSxHQUFHLEtBQU87Z0JBRWxCLEVBQUUsTUFBTSxHQUFHLFVBQVk7Z0JBQ3ZCLEVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/funtree.kode
