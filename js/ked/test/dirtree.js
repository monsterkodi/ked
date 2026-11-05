var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var after, count, d, file, makeCol, names, newFile, oldFile, open, root, sub, waitForRoot, _139_42_

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep
let post = kxk.post

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import dircol from "../view/colmns/dircol.js"


makeCol = async function ()
{
    var d, e, fakeDel, fakeGet, fakeSet, h, store

    store = {}
    fakeGet = function (key, def)
    {
        var found, k, parts, prefix, rest, result, v, _12_31_, _23_33_, _27_19_

        if (!((key != null ? key.split : undefined) != null))
        {
            return def
        }
        prefix = key + '▸'
        result = {}
        found = false
        for (k in store)
        {
            v = store[k]
            if (!k.startsWith(prefix))
            {
                continue
            }
            rest = k.slice(prefix.length)
            parts = rest.split('▸')
            if (parts.length === 1)
            {
                result[parts[0]] = v
            }
            else
            {
                result[parts[0]] = ((_23_33_=result[parts[0]]) != null ? _23_33_ : {})
                result[parts[0]][parts.slice(1).join('▸')] = v
            }
            found = true
        }
        if (found)
        {
            return result
        }
        return ((_27_19_=store[key]) != null ? _27_19_ : def)
    }
    fakeSet = function (key, value)
    {
        return store[key] = value
    }
    fakeDel = function (key)
    {
        return delete store[key]
    }
    global.ked_session = {get:fakeGet,set:fakeSet,del:fakeDel}
    h = new harness({cols:100,rows:30})
    e = new editor(h.screen,'test_editor',[])
    d = new dircol(h.screen,e,[])
    d.layout(0,0,100,30)
    await waitForRoot(d,process.cwd())
    return d
}

waitForRoot = async function (d, root)
{
    var items, n, parent

    parent = slash.dir(root)
    n = 0
    while (n < 100)
    {
        items = d.dirtree.items
        if (!_k_.empty(items) && items[0].path === parent)
        {
            return
        }
        await sleep(10)
        n += 1
    }
}
toExport["dirtree"] = async function ()
{
    await section("create events add entries", async function ()
    {
        root = '/tmp/opencode/ked-dirtree-create'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        d = await makeCol()
        d.setRoot(root)
        await waitForRoot(d,root)
        file = slash.path(root,'a.txt')
        fs.writeFileSync(file,'hello')
        post.emit('file.change',{path:file,change:'create'})
        await sleep(120)
        names = d.dirtree.items.map(function (i)
        {
            return i.path
        })
        fs.rmSync(root,{recursive:true,force:true})
        compare((_k_.in(file,names)),true)
    })
    await section("delete events remove entries even when the root becomes empty", async function ()
    {
        root = '/tmp/opencode/ked-dirtree-delete'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'a.txt')
        fs.writeFileSync(file,'hello')
        d = await makeCol()
        d.setRoot(root)
        await waitForRoot(d,root)
        fs.rmSync(file)
        post.emit('file.change',{path:file,change:'delete'})
        await sleep(120)
        names = d.dirtree.items.map(function (i)
        {
            return i.path
        })
        fs.rmSync(root,{recursive:true,force:true})
        compare((_k_.in(file,names)),false)
    })
    await section("rename events move entries", async function ()
    {
        root = '/tmp/opencode/ked-dirtree-rename'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        oldFile = slash.path(root,'a.txt')
        newFile = slash.path(root,'b.txt')
        fs.writeFileSync(oldFile,'hello')
        d = await makeCol()
        d.setRoot(root)
        await waitForRoot(d,root)
        fs.renameSync(oldFile,newFile)
        post.emit('file.change',{path:newFile,oldPath:oldFile,change:'rename'})
        await sleep(120)
        names = d.dirtree.items.map(function (i)
        {
            return i.path
        })
        fs.rmSync(root,{recursive:true,force:true})
        compare((_k_.in(newFile,names)),true)
        compare((_k_.in(oldFile,names)),false)
    })
    await section("create events update open directories", async function ()
    {
        root = '/tmp/opencode/ked-dirtree-open'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        sub = slash.path(root,'sub')
        fs.mkdirSync(sub)
        fs.writeFileSync(slash.path(sub,'keep.txt'),'hello')
        d = await makeCol()
        d.setRoot(root)
        await waitForRoot(d,root)
        await d.dirtree.openDir(d.dirtree.itemForPath(sub),{redraw:true})
        file = slash.path(sub,'new.txt')
        fs.writeFileSync(file,'hello')
        post.emit('file.change',{path:file,change:'create'})
        await sleep(120)
        names = d.dirtree.items.map(function (i)
        {
            return i.path
        })
        open = (d.dirtree.itemForPath(sub) != null ? d.dirtree.itemForPath(sub).open : undefined)
        fs.rmSync(root,{recursive:true,force:true})
        compare((_k_.in(file,names)),true)
        compare(open,true)
    })
    await section("modify events leave the tree alone", async function ()
    {
        root = '/tmp/opencode/ked-dirtree-modify'
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        file = slash.path(root,'a.txt')
        fs.writeFileSync(file,'hello')
        d = await makeCol()
        d.setRoot(root)
        await waitForRoot(d,root)
        count = d.dirtree.items.length
        fs.writeFileSync(file,'changed')
        post.emit('file.change',{path:file,change:'modify'})
        await sleep(120)
        after = d.dirtree.items.length
        fs.rmSync(root,{recursive:true,force:true})
        compare(after,count)
    })
}
toExport["dirtree"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9kaXJ0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ0ksU0FBQTs7T0FDTSxVQUFBO0lBQU07SUFBTTtJQUFNOztPQUNWLGFBQVg7O09BQ1csY0FBWDs7T0FDYyxhQUFUOzs7QUFFWjs7OztJQUVJO0lBQ0Esb0JBQVcsS0FBSTs7OztlQUNFLGNBQUEsSUFBSzs7bUJBQWhCOztRQUNGLFNBQVMsTUFBTTtRQUNmO1FBQ0EsUUFBUTthQUNKLEtBQU87O1lBQUwsSUFBSztpQkFDUyxFQUFFLFdBQVc7O2dCQUE3Qjs7WUFDQSxPQUFPLFFBQUUsT0FBTztZQUNoQixRQUFRLEtBQUssTUFBTTtnQkFDaEIsTUFBTSxXQUFVOztnQkFDZixPQUFPLE1BQU0sTUFBTTs7OztnQkFFbkIsT0FBTyxNQUFNLGdCQUFiLE9BQU8sTUFBTTtnQkFDYixPQUFPLE1BQU0sSUFBSSxZQUFNLEdBQUssS0FBSyxRQUFROztZQUM3QyxRQUFROztZQUNBOzttQkFBVjs7eUJBQ0YsTUFBTSwwQkFBTzs7SUFDakIsb0JBQVcsS0FBSTs7ZUFBVSxNQUFNLE9BQU87O0lBQ3RDLG9CQUFXOztzQkFBZSxNQUFNOztJQUNoQyxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJO0lBRWpELFFBQVEsU0FBUSxLQUFLLElBQUksS0FBSztJQUM5QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLFFBQVEsT0FBTyxFQUFFLE9BQU87SUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxJQUFJO1VBRWYsWUFBWSxFQUFFLFFBQVE7V0FDeEI7OztBQUVKLDhCQUFlLEdBQUU7Ozs7SUFDYixTQUFTLE1BQU0sSUFBSTtJQUNuQixJQUFJO1dBQ0UsSUFBSTs7UUFDTixRQUFRLEVBQUUsUUFBUTt1QkFDSCxVQUFVLE1BQU0sR0FBRyxTQUFROzs7O2NBQ3hDLE1BQU07UUFDUixLQUFLOzs7Ozs7O1FBTUwsT0FBTztRQUNQLEdB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/dirtree.kode
