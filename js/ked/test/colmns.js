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
    await section("a selection color seeds the picker", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['hello world'])
        e.state.setSelections([[0,0,5,0]])
        e.state.setMainCursor(2,0)
        e.state.setColorsForRanges([[0,0,5,0]],'#00ff00',null)
        e.state.colorMethod = 'trailer'
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorpicker.hex(),'#00ff00')
        delete global.ked_session
    })
    await section("a selection keeps its existing background when only the foreground changes", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['hello world'])
        e.state.setSelections([[0,0,5,0]])
        e.state.setMainCursor(2,0)
        e.state.setColorsForRanges([[0,0,5,0]],'#00ff00','#0000ff')
        e.state.colorMethod = 'trailer'
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        compare(f.colorpicker.foregroundHex(),'#00ff00')
        compare(f.colorpicker.backgroundHex(),'#0000ff')
        f.colorpicker.submit('#00ff00')
        compare(e.state.s.colors.fg,[[0,0,5,'#00ff00']])
        compare(e.state.s.colors.bg,[[0,0,5,'#0000ff']])
        delete global.ked_session
    })
    await section("a changed background is applied on submit", async function ()
    {
        ked_sess()
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['hello world'])
        e.state.setSelections([[0,0,5,0]])
        e.state.setMainCursor(2,0)
        e.state.colorMethod = 'trailer'
        f = new funcol(h.screen,e,[])
        f.onColorPickerShow('')
        f.colorpicker.radio.changeActive(1)
        f.colorpicker.setHex('#0000ff')
        compare(f.colorpicker.backgroundChanged(),true)
        f.colorpicker.submit(f.colorpicker.foregroundHex())
        compare(e.state.s.colors.fg,[[0,0,5,'#ff0000']])
        compare(e.state.s.colors.bg,[[0,0,5,'#0000ff']])
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
