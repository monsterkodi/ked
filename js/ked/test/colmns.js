var toExport = {}
var baseFile, childFile, d, e, emitted, f, file, h, idx, ked_sess, originalEmit, root, supr

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
toExport["dircol crumbs"] = async function ()
{
    await section("a relative root shows the absolute folder path", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        d = new dircol(h.screen,e,[])
        d.layout(0,0,100,30)
        d.setRoot('kode')
        compare(d.crumbs.path,slash.tilde(slash.path(process.cwd(),'kode')))
        compare(d.crumbs.split[0],'~')
        await sleep(10)
        delete global.ked_session
    })
    await section("a dot relative root shows the absolute folder path", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        d = new dircol(h.screen,e,[])
        d.layout(0,0,100,30)
        d.setRoot('./kode')
        compare(d.crumbs.path,slash.tilde(slash.path(process.cwd(),'kode')))
        compare(d.crumbs.split[0],'~')
        await sleep(10)
        delete global.ked_session
    })
    await section("a tilde root stays where it is", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        d = new dircol(h.screen,e,[])
        d.layout(0,0,100,30)
        d.setRoot('~/s/ked')
        compare(d.crumbs.path,'~/s/ked')
        compare(d.crumbs.split[0],'~')
        await sleep(10)
        delete global.ked_session
    })
}
toExport["dircol crumbs"]._section_ = true
toExport["funcol"] = async function ()
{
    await section("a cursor on the hash picks the color", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['x = #ff8000;'])
        e.state.setMainCursor(4,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorpicker.hex(),'#ff8000')
        delete global.ked_session
    })
    await section("a word that is not a color keeps the default and no replace mode", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['x = hello;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorReplace,null)
        delete global.ked_session
    })
    await section("submitting without changes keeps the original color string", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['c = #abc;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        f.colorpicker.submit(f.colorpicker.hex())
        compare(kseg.str(e.state.s.lines[0]),'c = #abc;')
        compare(f.colorReplace,null)
        delete global.ked_session
    })
    await section("an explicit show does not replace anything", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['x = #ff8000;'])
        e.state.setMainCursor(6,0)
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('#123456')
        compare(f.colorReplace,null)
        f.colorpicker.submit('#abcdef')
        compare(kseg.str(e.state.s.lines[0]),'x = #ff8000;')
        delete global.ked_session
    })
    await section("an explicit color picker gets a width in a narrow terminal", async function ()
    {
        ked_sess()
        h = new harness({cols:80,rows:24})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines([''])
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorpicker.visible(),true)
        compare(f.cells.cols,16)
        f.layout(64,1,16,23)
        compare(f.colorpicker.cells.cols,16)
        delete global.ked_session
    })
    await section("the color picker grows when the palette is not empty", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines([''])
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
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
    await section("base class chain", async function ()
    {
        ked_sess()
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
        ked_sess()
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
        ked_sess()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbW5zLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2NvbG1ucy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBSSxTQUFBOztPQUNNLFVBQUE7SUFBVztJQUFLO0lBQUs7SUFBTTs7T0FDaEIsYUFBZDs7T0FDYyxjQUFkOztPQUNjLGNBQWQ7O09BQ2MsYUFBVDtPQUFnQixhQUFoQjtPQUF1QixjQUF2Qjs7O0FBRVo7Ozs7SUFDSTtJQUNBLG9CQUFXLEtBQUk7Ozs7eUJBQVEsTUFBTSwwQkFBTzs7SUFDcEMsb0JBQVcsS0FBSTs7ZUFBVSxNQUFNLE9BQU87O1dBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTs7Ozs7O1FBTWpDO1FBRUEsUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO1FBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUk7UUFFakIsRUFBRSxRQUFRO2dCQUVWLEVBQUUsT0FBTyxLQUFPLE1BQU0sTUFBTSxNQUFNLEtBQUssUUFBUSxNQUFNO2dCQUNyRCxFQUFFLE9BQU8sTUFBTSxHQUFLO2NBRWxCLE1BQU07ZUFDRCxPQUFPOzs7O1FBSWQ7UUFFQSxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSTtRQUVqQixFQUFFLFFBQVE7Z0JBRVYsRUFBRSxPQUFPLEtBQU8sTUFBTSxNQUFNLE1BQU0sS0FBSyxRQUFRLE1BQU07Z0JBQ3JELEVBQUUsT0FBTyxNQUFNLEdBQUs7Y0FFbEIsTUFBTTtlQUNELE9BQU87Ozs7UUFJZDtRQUVBLFFBQVEsU0FBUSxLQUFLLElBQUksS0FBSztRQUM5QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFBRSxP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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/colmns.kode
