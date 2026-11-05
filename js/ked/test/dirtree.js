var toExport = {}
var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var after, count, d, file, makeCol, names, newFile, oldFile, open, root, sub, _131_42_

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
    await sleep(400)
    return d
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
        await sleep(200)
        file = slash.path(root,'a.txt')
        fs.writeFileSync(file,'hello')
        post.emit('file.change',{path:file,change:'create'})
        await sleep(200)
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
        await sleep(200)
        fs.rmSync(file)
        post.emit('file.change',{path:file,change:'delete'})
        await sleep(200)
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
        await sleep(200)
        fs.renameSync(oldFile,newFile)
        post.emit('file.change',{path:newFile,oldPath:oldFile,change:'rename'})
        await sleep(200)
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
        await sleep(200)
        await d.dirtree.openDir(d.dirtree.itemForPath(sub),{redraw:true})
        await sleep(200)
        file = slash.path(sub,'new.txt')
        fs.writeFileSync(file,'hello')
        post.emit('file.change',{path:file,change:'create'})
        await sleep(200)
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
        await sleep(200)
        count = d.dirtree.items.length
        fs.writeFileSync(file,'changed')
        post.emit('file.change',{path:file,change:'modify'})
        await sleep(200)
        after = d.dirtree.items.length
        fs.rmSync(root,{recursive:true,force:true})
        compare(after,count)
    })
}
toExport["dirtree"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9kaXJ0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ0ksU0FBQTs7T0FDTSxVQUFBO0lBQU07SUFBTTtJQUFNOztPQUNWLGFBQVg7O09BQ1csY0FBWDs7T0FDYyxhQUFUOzs7QUFFWjs7OztJQUVJO0lBQ0Esb0JBQVcsS0FBSTs7OztlQUNFLGNBQUEsSUFBSzs7bUJBQWhCOztRQUNGLFNBQVMsTUFBTTtRQUNmO1FBQ0EsUUFBUTthQUNKLEtBQU87O1lBQUwsSUFBSztpQkFDUyxFQUFFLFdBQVc7O2dCQUE3Qjs7WUFDQSxPQUFPLFFBQUUsT0FBTztZQUNoQixRQUFRLEtBQUssTUFBTTtnQkFDaEIsTUFBTSxXQUFVOztnQkFDZixPQUFPLE1BQU0sTUFBTTs7OztnQkFFbkIsT0FBTyxNQUFNLGdCQUFiLE9BQU8sTUFBTTtnQkFDYixPQUFPLE1BQU0sSUFBSSxZQUFNLEdBQUssS0FBSyxRQUFROztZQUM3QyxRQUFROztZQUNBOzttQkFBVjs7eUJBQ0YsTUFBTSwwQkFBTzs7SUFDakIsb0JBQVcsS0FBSTs7ZUFBVSxNQUFNLE9BQU87O0lBQ3RDLG9CQUFXOztzQkFBZSxNQUFNOztJQUNoQyxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJO0lBRWpELFFBQVEsU0FBUSxLQUFLLElBQUksS0FBSztJQUM5QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLFFBQVEsT0FBTyxFQUFFLE9BQU87SUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxJQUFJO1VBRWYsTUFBTTtXQUNSOzs7Ozs7UUFNSSxPQUFPO1FBQ1AsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixVQUFLO1FBQ0wsRUFBRSxRQUFRO2NBQ1IsTUFBTTtRQUVSLE9BQU8sTUFBTSxLQUFLLEtBQUs7UUFDdkIsR0FBRyxjQUFjLEtBQUs7UUFDdEIsS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/dirtree.kode
