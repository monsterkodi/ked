var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var makeCol, quiet, waitForRoot

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep
let post = kxk.post

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import icons from "../theme/icons.js"

import prjcts from "../index/prjcts.js"

import dircol from "../view/colmns/dircol.js"


makeCol = async function ()
{
    var d, e, fakeDel, fakeGet, fakeSet, h, store

    store = {}
    fakeGet = function (key, def)
    {
        var found, k, parts, prefix, rest, result, v, _14_31_, _25_33_, _29_19_

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
                result[parts[0]] = ((_25_33_=result[parts[0]]) != null ? _25_33_ : {})
                result[parts[0]][parts.slice(1).join('▸')] = v
            }
            found = true
        }
        if (found)
        {
            return result
        }
        return ((_29_19_=store[key]) != null ? _29_19_ : def)
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

quiet = function (d)
{
    if (d.dirtree.refreshTimer)
    {
        clearTimeout(d.dirtree.refreshTimer)
    }
    return d.dirtree.refresh = function ()
    {}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9kaXJ0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDSSxTQUFBOztPQUNNLFVBQUE7SUFBTTtJQUFNO0lBQU07O09BQ1YsYUFBWDs7T0FDVyxjQUFYOztPQUNXLFlBQVg7O09BQ1csYUFBWDs7T0FDYyxhQUFUOzs7QUFFWjs7OztJQUVJO0lBQ0Esb0JBQVcsS0FBSTs7OztlQUNFLGNBQUEsSUFBSzs7bUJBQWhCOztRQUNGLFNBQVMsTUFBTTtRQUNmO1FBQ0EsUUFBUTthQUNKLEtBQU87O1lBQUwsSUFBSztpQkFDUyxFQUFFLFdBQVc7O2dCQUE3Qjs7WUFDQSxPQUFPLFFBQUUsT0FBTztZQUNoQixRQUFRLEtBQUssTUFBTTtnQkFDaEIsTUFBTSxXQUFVOztnQkFDZixPQUFPLE1BQU0sTUFBTTs7OztnQkFFbkIsT0FBTyxNQUFNLGdCQUFiLE9BQU8sTUFBTTtnQkFDYixPQUFPLE1BQU0sSUFBSSxZQUFNLEdBQUssS0FBSyxRQUFROztZQUM3QyxRQUFROztZQUNBOzttQkFBVjs7eUJBQ0YsTUFBTSwwQkFBTzs7SUFDakIsb0JBQVcsS0FBSTs7ZUFBVSxNQUFNLE9BQU87O0lBQ3RDLG9CQUFXOztzQkFBZSxNQUFNOztJQUNoQyxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJO0lBRWpELFFBQVEsU0FBUSxLQUFLLElBQUksS0FBSztJQUM5QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLFFBQVEsT0FBTyxFQUFFLE9BQU87SUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxJQUFJO1VBRWYsWUFBWSxFQUFFLFFBQVE7V0FDeEI7OztBQUVKLGtCQUFTOztRQUNrQyxFQUFFLFFBQVE7O1FBQWpELGFBQWEsRUFBRSxRQUFROztXQUN2QixFQUFFLFFBQVE7Ozs7QUFFZCw4QkFBZSxHQUFFOzs7O0lBQ2IsU0FBUyxNQUFNLElBQUk7SUFDbkIsSUFBSTtXQUNFLElBQUk7O1FBQ04sUUFBUSxFQUFFLFFBQVE7dUJBQ0gsVUFBVSxNQUFNLEdBQUcsU0FBUTs7OztjQUN4QyxNQUFNO1FBQ1IsS0FBSyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/dirtree.kode
