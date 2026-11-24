var toExport = {}
var baseFile, capture, childFile, cppTree, d, dircolAt, e, f, funcolAt, h, ked_sess, newDircol, orig, sent, supr, tree

import fs from "fs"

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post
let slash = kxk.slash
let sleep = kxk.sleep
let watcher = kxk.watcher

import testdir from "../../kxk/testdir.js"

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
        var _11_38_

        return ((_11_38_=store[key]) != null ? _11_38_ : def)
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
    root = testdir(`ked-funtree-${name}`)
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
    root = testdir(`ked-funtree-${name}`)
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
toExport["dircol active"] = async function ()
{
    newDircol = function ()
    {
        var e, h

        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        return new dircol(h.screen,e,[])
    }
    ;[sent,orig] = capture()
    d = newDircol()
    compare(d.active,false)
    d.showIfActive()
    compare(d.hidden(),true)
    d.onShow()
    compare(d.visible(),true)
    compare(d.active,true)
    d = newDircol()
    d.showIfActive()
    d.onToggle()
    compare(d.visible(),true)
    compare(d.active,true)
    compare(ked_session.get('dircol▸active'),true)
    d.hide()
    d.showIfActive()
    compare(d.visible(),true)
    post.emit = orig
    delete global.ked_session
}
toExport["dircol active"]._section_ = true
toExport["funcol"] = async function ()
{
    await section("seeding", async function ()
    {
        ;[h,e,f] = funcolAt(['x = #ff8000;'],4)
        f.showColorpicker()
        compare(f.colorpicker.hex(),'#ff8000')
        ;[h,e,f] = funcolAt(['x = hello;'],6)
        f.showColorpicker()
        compare(f.colorReplace,null)
        ;[h,e,f] = funcolAt(['c = #abc;'],6)
        f.showColorpicker()
        f.colorpicker.submit(f.colorpicker.hex())
        compare(kseg.str(e.state.s.lines[0]),'c = #abc;')
        compare(f.colorReplace,null)
        ;[h,e,f] = funcolAt(['x = #ff8000;'],6)
        f.showColorpicker(['#123456'])
        compare(f.colorReplace,null)
        f.colorpicker.submit('#abcdef')
        compare(kseg.str(e.state.s.lines[0]),'x = #ff8000;')
        delete global.ked_session
    })
    await section("size", async function ()
    {
        ;[h,e,f] = funcolAt([''],0)
        f.showColorpicker()
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
        f.showUniko()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbW5zLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2NvbG1ucy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBSSxTQUFBOztPQUNNLFVBQUE7SUFBVztJQUFLO0lBQUs7SUFBTTtJQUFNOztPQUN0QixjQUFYOztPQUNXLGFBQWQ7O09BQ2MsY0FBZDtPQUFzQixVQUF0Qjs7T0FDYyxjQUFkOztPQUNjLGFBQVQ7T0FBZ0IsY0FBaEI7T0FBd0IsYUFBeEI7T0FBK0IsY0FBL0I7OztBQUVaOzs7O0lBQ0k7SUFDQSxvQkFBVyxLQUFJOzs7O3lCQUFRLE1BQU0sMEJBQU87O0lBQ3BDLG9CQUFXLEtBQUk7O2VBQVUsTUFBTSxPQUFPOztXQUN0QyxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7OztBQUV6QywyQkFBWTs7OztJQUNSO0lBQ0EsUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO0lBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87SUFDeEIsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUk7SUFDakIsRUFBRSxRQUFRO1VBQ1IsTUFBTTtXQUNSOzs7QUFFSixxQkFBWSxPQUFNOzs7O0lBQ2Q7SUFDQSxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7SUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixFQUFFLE1BQU0sVUFBVTtJQUNsQixFQUFFLE1BQU0sY0FBYyxJQUFJO0lBQzFCLFFBQVEsT0FBTyxFQUFFLE9BQU87WUFDdkIsRUFBRSxFQUFFOzs7QUFFVDs7OztJQUNJO0lBQ0EsT0FBTyxLQUFLO0lBQ1osS0FBSyxpQkFBUSxPQUFNOztlQUFZLEtBQUssTUFBTSxPQUFPLE9BQU87O1lBQ3ZELEtBQUs7OztBQUVWLHVCQUFRLE1BQUssTUFBSzs7OztJQUNkO0lBQ0EsT0FBTyx1QkFBdUI7SUFDOUIsV0FBVyxNQUFNLEtBQUssS0FBSztJQUMzQixZQUFZLE1BQU0sS0FBSyxLQUFLO0lBQzVCLEdBQUcs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
//# sourceURL=../../../kode/ked/test/colmns.kode
