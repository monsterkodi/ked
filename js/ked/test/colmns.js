var toExport = {}
var baseFile, capture, childFile, cppTree, d, dircolAt, e, f, funcolAt, h, ked_sess, orig, sent, supr, tree

import fs from "fs"

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let post = kxk.post
let slash = kxk.slash
let sleep = kxk.sleep

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import indexer from "../index/indexer.js"

import dircol from "../view/colmns/dircol.js"
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
        var _a_ = funcolAt(['x = #ff8000;'],4); h = _a_[0]; e = _a_[1]; f = _a_[2]

        f.onColorPickerShow()
        compare(f.colorpicker.hex(),'#ff8000')
        var _b_ = funcolAt(['x = hello;'],6); h = _b_[0]; e = _b_[1]; f = _b_[2]

        f.onColorPickerShow()
        compare(f.colorReplace,null)
        var _c_ = funcolAt(['c = #abc;'],6); h = _c_[0]; e = _c_[1]; f = _c_[2]

        f.onColorPickerShow()
        f.colorpicker.submit(f.colorpicker.hex())
        compare(kseg.str(e.state.s.lines[0]),'c = #abc;')
        compare(f.colorReplace,null)
        var _d_ = funcolAt(['x = #ff8000;'],6); h = _d_[0]; e = _d_[1]; f = _d_[2]

        f.onColorPickerShow(['#123456'])
        compare(f.colorReplace,null)
        f.colorpicker.submit('#abcdef')
        compare(kseg.str(e.state.s.lines[0]),'x = #ff8000;')
        delete global.ked_session
    })
    await section("size", async function ()
    {
        var _e_ = funcolAt([''],0); h = _e_[0]; e = _e_[1]; f = _e_[2]

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
}
toExport["funcol"]._section_ = true
toExport["funtree"] = async function ()
{
    await section("base chain", async function ()
    {
        var _f_ = await tree('base',`■Base□Root
    alpha: -> 1
    beta: => 2
■Root
    gamma: -> 3`,"■Child□Base\n"); f = _f_[0]; e = _f_[1]; baseFile = _f_[2]; childFile = _f_[3]

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
        var _10_ = capture(); sent = _10_[0]; orig = _10_[1]

        f.emitAction('right',f.items[1])
        f.emitAction('drag',f.items[1])
        post.emit = orig
        compare(sent.length,0)
        supr = {clss:true,name:' ■ Child',line:1}
        compare(f.itemsForBaseClass(supr).length,0)
    })
    await section("jump", async function ()
    {
        var _11_ = await tree('jump',`■Base
    alpha: -> 1`,"■Child□Base\n"); f = _11_[0]; e = _11_[1]; baseFile = _11_[2]; childFile = _11_[3]

        var _12_ = capture(); sent = _12_[0]; orig = _12_[1]

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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbW5zLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2NvbG1ucy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBSSxTQUFBOztPQUNNLFVBQUE7SUFBVztJQUFLO0lBQUs7SUFBTTs7T0FDaEIsYUFBZDs7T0FDYyxjQUFkOztPQUNjLGNBQWQ7O09BQ2MsYUFBVDtPQUFnQixhQUFoQjtPQUF1QixjQUF2Qjs7O0FBRVo7Ozs7SUFDSTtJQUNBLG9CQUFXLEtBQUk7Ozs7eUJBQVEsTUFBTSwwQkFBTzs7SUFDcEMsb0JBQVcsS0FBSTs7ZUFBVSxNQUFNLE9BQU87O1dBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTs7O0FBRXpDLDJCQUFZOzs7O0lBQ1I7SUFDQSxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7SUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSTtJQUNqQixFQUFFLFFBQVE7VUFDUixNQUFNO1dBQ1I7OztBQUVKLHFCQUFZLE9BQU07Ozs7SUFDZDtJQUNBLFFBQVEsU0FBUSxLQUFLLElBQUksS0FBSztJQUM5QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLEVBQUUsTUFBTSxVQUFVO0lBQ2xCLEVBQUUsTUFBTSxjQUFjLElBQUk7SUFDMUIsUUFBUSxPQUFPLEVBQUUsT0FBTztZQUN2QixFQUFFLEVBQUU7OztBQUVUOzs7O0lBQ0k7SUFDQSxPQUFPLEtBQUs7SUFDWixLQUFLLGlCQUFRLE9BQU07O2VBQVksS0FBSyxNQUFNLE9BQU8sT0FBTzs7WUFDdkQsS0FBSzs7O0FBRVYsdUJBQVEsTUFBSyxNQUFLOzs7O0lBQ2Q7SUFDQSxvQ0FBb0M7SUFDcEMsV0FBVyxNQUFNLEtBQUssS0FBSztJQUMzQixZQUFZLE1BQU0sS0FBSyxLQUFLO0lBQzVCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO0lBQ3BDLEdBQUcsVUFBVSxNQUFL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colmns.kode
