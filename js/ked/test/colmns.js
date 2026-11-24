var toExport = {}
var baseFile, capture, childFile, cppTree, d, dircolAt, e, f, funcolAt, h, ked_sess, orig, sent, supr, tree

import fs from "fs"

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post
let slash = kxk.slash
let sleep = kxk.sleep
let watcher = kxk.watcher

import editor from "../edit/editor.js"

import harness from "../util/harness.js"
import git from "../util/git.js"

import indexer from "../index/indexer.js"

import dircol from "../view/colmns/dircol.js"
import dirtree from "../view/colmns/dirtree.js"
import funcol from "../view/colmns/funcol.js"
import funtree from "../view/colmns/funtree.js"


ked_sess = function ()
{
    var fakeGet, fakeSet, store

    store = {}
    fakeGet = function (key, def)
    {
        var _10_38_

        return ((_10_38_=store[key]) != null ? _10_38_ : def)
    }
    fakeSet = function (key, value)
    {
        return store[key] = value
    }
    return global.ked_session = {get:fakeGet,set:fakeSet}
}

dircolAt = async function (root)
{
    var d, e, h

    ked_sess()
    h = new harness({cols:100,rows:30})
    e = new editor(h.screen,'test_editor',[])
    d = new dircol(h.screen,e,[])
    d.layout(0,0,100,30)
    d.setRoot(root)
    await sleep(10)
    return d
}

funcolAt = function (lines, col)
{
    var e, f, h

    ked_sess()
    h = new harness({cols:100,rows:30})
    e = new editor(h.screen,'test_editor',[])
    e.state.loadLines(lines)
    e.state.setMainCursor(col,0)
    f = new funcol(h.screen,e,[])
    return [h,e,f]
}

capture = function ()
{
    var orig, sent

    sent = []
    orig = post.emit
    post.emit = function (event, ...args)
    {
        return sent.push([event].concat(args))
    }
    return [sent,orig]
}

tree = async function (name, base, child)
{
    var baseFile, childFile, e, f, h, idx, root

    ked_sess()
    root = `/tmp/opencode/ked-funtree-${name}`
    baseFile = slash.path(root,'base.kode')
    childFile = slash.path(root,'child.kode')
    fs.rmSync(root,{recursive:true,force:true})
    fs.mkdirSync(root,{recursive:true})
    fs.writeFileSync(baseFile,base)
    fs.writeFileSync(childFile,child)
    idx = new indexer
    await idx.index(baseFile)
    await idx.index(childFile)
    h = new harness({cols:100,rows:30})
    e = new editor(h.screen,'test_funtree_editor',[])
    e.currentFile = childFile
    f = new funtree(e,'test_funtree',[])
    f.onFileIndexed(childFile,idx.files[childFile])
    fs.rmSync(root,{recursive:true,force:true})
    return [f,e,baseFile,childFile]
}

cppTree = async function (name, source)
{
    var e, f, file, h, idx, root

    ked_sess()
    root = `/tmp/opencode/ked-funtree-${name}`
    file = slash.path(root,'main.cpp')
    fs.rmSync(root,{recursive:true,force:true})
    fs.mkdirSync(root,{recursive:true})
    fs.writeFileSync(file,source)
    idx = new indexer
    await idx.index(file)
    h = new harness({cols:100,rows:30})
    e = new editor(h.screen,'test_funtree_cpp_editor',[])
    e.currentFile = file
    f = new funtree(e,'test_funtree_cpp',[])
    f.onFileIndexed(file,idx.files[file])
    fs.rmSync(root,{recursive:true,force:true})
    return f
}
toExport["dircol"] = async function ()
{
    await section("roots", async function ()
    {
        d = await dircolAt('kode')
        compare(d.crumbs.path,slash.tilde(slash.path(process.cwd(),'kode')))
        compare(d.crumbs.split[0],'~')
        d = await dircolAt('./kode')
        compare(d.crumbs.path,slash.tilde(slash.path(process.cwd(),'kode')))
        compare(d.crumbs.split[0],'~')
        d = await dircolAt('~/s/ked')
        compare(d.crumbs.path,'~/s/ked')
        compare(d.crumbs.split[0],'~')
        delete global.ked_session
    })
}
toExport["dircol"]._section_ = true
toExport["funcol"] = async function ()
{
    await section("seeding", async function ()
    {
        ;[h,e,f] = funcolAt(['x = #ff8000;'],4)
        f.onColorPickerShow()
        compare(f.colorpicker.hex(),'#ff8000')
        ;[h,e,f] = funcolAt(['x = hello;'],6)
        f.onColorPickerShow()
        compare(f.colorReplace,null)
        ;[h,e,f] = funcolAt(['c = #abc;'],6)
        f.onColorPickerShow()
        f.colorpicker.submit(f.colorpicker.hex())
        compare(kseg.str(e.state.s.lines[0]),'c = #abc;')
        compare(f.colorReplace,null)
        ;[h,e,f] = funcolAt(['x = #ff8000;'],6)
        f.onColorPickerShow(['#123456'])
        compare(f.colorReplace,null)
        f.colorpicker.submit('#abcdef')
        compare(kseg.str(e.state.s.lines[0]),'x = #ff8000;')
        delete global.ked_session
    })
    await section("size", async function ()
    {
        ;[h,e,f] = funcolAt([''],0)
        f.onColorPickerShow()
        compare(f.colorpicker.visible(),true)
        compare(f.cells.cols,16)
        f.layout(64,1,16,23)
        compare(f.colorpicker.cells.cols,16)
        f.layout(0,0,16,29)
        compare(f.colorpicker.cells.rows,9)
        f.colorpicker.setHex('#ff0000')
        f.colorpicker.addCurrentColor()
        f.layout(0,0,16,29)
        compare(f.colorpicker.cells.rows,11)
        delete global.ked_session
    })
    await section("active", async function ()
    {
        ;[h,e,f] = funcolAt([''],0)
        compare(f.active,false)
        ;[sent,orig] = capture()
        f.setActive(true)
        f.setActive(true)
        f.onUnikoShow()
        compare(f.visible(),true)
        f.onFuncolToggle()
        post.emit = orig
        compare(f.active,false)
        compare(ked_session.get('funcol▸active'),false)
        compare(sent.filter(function (s)
        {
            return s[0] === 'view.active'
        }),[['view.active','funcol',true],['view.active','funcol',false]])
        delete global.ked_session
    })
}
toExport["funcol"]._section_ = true
toExport["funtree"] = async function ()
{
    await section("base chain", async function ()
    {
        ;[f,e,baseFile,childFile] = await tree('base',`■Base□Root
    alpha: -> 1
    beta: => 2
■Root
    gamma: -> 3`,"■Child□Base\n")
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
        ;[sent,orig] = capture()
        f.emitAction('right',f.items[1])
        f.emitAction('drag',f.items[1])
        post.emit = orig
        compare(sent.length,0)
        supr = {clss:true,name:' ■ Child',line:1}
        compare(f.itemsForBaseClass(supr).length,0)
    })
    await section("jump", async function ()
    {
        ;[f,e,baseFile,childFile] = await tree('jump',`■Base
    alpha: -> 1`,"■Child□Base\n")
        ;[sent,orig] = capture()
        f.emitAction('return',f.items[0])
        f.emitAction('return',f.items[3])
        post.emit = orig
        compare(sent[0],['goto.line',0,'ind','topDelta'])
        compare(sent[1],['focus','editor'])
        compare(sent[2],['file.open',baseFile,1,'ind','topDelta'])
        compare(sent[3],['focus','editor'])
    })
    await section("cpp", async function ()
    {
        f = await cppTree('cpp',`static JsonNode* route_info (const fs::path& path)
{
    struct stat st;
    if (::stat(path.c_str(), &st) != 0)
    {
        return node_null();
    }
}`)
        compare(f.items.length,1)
        compare(f.items[0].name,' -> @route_info')
    })
}
toExport["funtree"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbW5zLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2NvbG1ucy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBSSxTQUFBOztPQUNNLFVBQUE7SUFBVztJQUFLO0lBQUs7SUFBTTtJQUFNOztPQUN0QixhQUFkOztPQUNjLGNBQWQ7T0FBc0IsVUFBdEI7O09BQ2MsY0FBZDs7T0FDYyxhQUFUO09BQWdCLGNBQWhCO09BQXdCLGFBQXhCO09BQStCLGNBQS9COzs7QUFFWjs7OztJQUNJO0lBQ0Esb0JBQVcsS0FBSTs7Ozt5QkFBUSxNQUFNLDBCQUFPOztJQUNwQyxvQkFBVyxLQUFJOztlQUFVLE1BQU0sT0FBTzs7V0FDdEMsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJOzs7QUFFekMsMkJBQVk7Ozs7SUFDUjtJQUNBLFFBQVEsU0FBUSxLQUFLLElBQUksS0FBSztJQUM5QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLFFBQVEsT0FBTyxFQUFFLE9BQU87SUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxJQUFJO0lBQ2pCLEVBQUUsUUFBUTtVQUNSLE1BQU07V0FDUjs7O0FBRUoscUJBQVksT0FBTTs7OztJQUNkO0lBQ0EsUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO0lBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87SUFDeEIsRUFBRSxNQUFNLFVBQVU7SUFDbEIsRUFBRSxNQUFNLGNBQWMsSUFBSTtJQUMxQixRQUFRLE9BQU8sRUFBRSxPQUFPO1lBQ3ZCLEVBQUUsRUFBRTs7O0FBRVQ7Ozs7SUFDSTtJQUNBLE9BQU8sS0FBSztJQUNaLEtBQUssaUJBQVEsT0FBTTs7ZUFBWSxLQUFLLE1BQU0sT0FBTyxPQUFPOztZQUN2RCxLQUFLOzs7QUFFVix1QkFBUSxNQUFLLE1BQUs7Ozs7SUFDZDtJQUNBLG9DQUFvQztJQUNwQyxXQUFXLE1BQU0sS0FBSyxLQUFLO0lBQzNCLFlBQVksTUFBTSxLQUFLLEtBQUs7SUFDNUIsR0FBRyxPQUFPLE1BQUssVUFBVSxL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
//# sourceURL=../../../kode/ked/test/colmns.kode
