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
toExport["funtree base class items"] = async function ()
{
    ked_sess()
}
toExport["funtree base class items"]._section_ = true
toExport["shows methods of the base class chain"] = async function ()
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
}
toExport["shows methods of the base class chain"]._section_ = true
toExport["jumps to inherited items in their file"] = async function ()
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
}
toExport["jumps to inherited items in their file"]._section_ = true
toExport["a file without classes has no inherited items"] = async function ()
{
    root = '/tmp/opencode/ked-funtree-noclass'
    file = slash.path(root,'funcs.kode')
    fs.rmSync(root,{recursive:true,force:true})
    fs.mkdirSync(root,{recursive:true})
    fs.writeFileSync(file,"alpha: -> 1\n")
    idx = new indexer
    await idx.index(file)
    h = new harness({cols:100,rows:30})
    e = new editor(h.screen,'test_funtree_noclass_editor',[])
    e.currentFile = file
    f = new funtree(e,'test_funtree_noclass',[])
    f.onFileIndexed(file,idx.files[file])
    fs.rmSync(root,{recursive:true,force:true})
    compare(f.items.length,1)
    compare(f.items[0].name,' -> alpha')
}
toExport["a file without classes has no inherited items"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVudHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9mdW50cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNJLFNBQUE7O09BQ00sVUFBQTtJQUFTO0lBQUs7O09BQ0wsYUFBWjs7T0FDWSxjQUFaOztPQUNZLGNBQVo7O09BQ2MsY0FBVDs7O0FBRVo7Ozs7SUFDSTtJQUNBLG9CQUFXLEtBQUk7Ozs7eUJBQVEsTUFBTSwwQkFBTzs7SUFDcEMsb0JBQVcsS0FBSTs7ZUFBVSxNQUFNLE9BQU87O1dBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTs7OztJQUlyQzs7Ozs7SUFJSSxPQUFPO0lBQ1AsV0FBVyxNQUFNLEtBQUssS0FBSztJQUMzQixZQUFZLE1BQU0sS0FBSyxLQUFLO0lBRTVCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO0lBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7SUFDNUIsR0FBRyxjQUFjLFNBQVM7Ozs7O0lBTzFCLEdBQUcsY0FBYyxVQUFVO0lBRTNCLFVBQVU7VUFDUixJQUFJLE1BQU07VUFDVixJQUFJLE1BQU07SUFFWixRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7SUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixFQUFFLGNBQWM7SUFFaEIsUUFBUSxRQUFRLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFVBQVUsSUFBSSxNQUFNO0lBRXBDLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1lBRXBDLEVBQUUsVUFBWTtZQUNkLEVBQUUsTUFBTSxjQUFLOztlQUFNLEVBQUU7UUFBUyxXQUFXLEtBQUssVUFBVSxjQUFjLGFBQWEsVUFBVTtZQUU3RixFQUFFLE1BQU0sR0FBRyxRQUFVO1lBRXJCLEVBQUUsTUFBTSxHQUFHLFVBQVk7WUFDdkIsRUFBRSxNQUFNLEdBQUcsS0FBTztZQUNsQixFQUFFLE1BQU0sR0FBRyxLQUFPO1lBRWxCLEVBQUUsTUFBTSxHQUFHLFVBQVk7WUFDdkIsRUFBRSxNQUFN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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/funtree.kode
