var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var makeCol, waitForRoot

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep
let post = kxk.post

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import icons from "../theme/icons.js"

import dircol from "../view/colmns/dircol.js"


makeCol = async function ()
{
    var d, e, fakeDel, fakeGet, fakeSet, h, store

    store = {}
    fakeGet = function (key, def)
    {
        var found, k, parts, prefix, rest, result, v, _13_31_, _24_33_, _28_19_

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
                result[parts[0]] = ((_24_33_=result[parts[0]]) != null ? _24_33_ : {})
                result[parts[0]][parts.slice(1).join('▸')] = v
            }
            found = true
        }
        if (found)
        {
            return result
        }
        return ((_28_19_=store[key]) != null ? _28_19_ : def)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9kaXJ0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDSSxTQUFBOztPQUNNLFVBQUE7SUFBTTtJQUFNO0lBQU07O09BQ1YsYUFBWDs7T0FDVyxjQUFYOztPQUNXLFlBQVg7O09BQ2MsYUFBVDs7O0FBRVo7Ozs7SUFFSTtJQUNBLG9CQUFXLEtBQUk7Ozs7ZUFDRSxjQUFBLElBQUs7O21CQUFoQjs7UUFDRixTQUFTLE1BQU07UUFDZjtRQUNBLFFBQVE7YUFDSixLQUFPOztZQUFMLElBQUs7aUJBQ1MsRUFBRSxXQUFXOztnQkFBN0I7O1lBQ0EsT0FBTyxRQUFFLE9BQU87WUFDaEIsUUFBUSxLQUFLLE1BQU07Z0JBQ2hCLE1BQU0sV0FBVTs7Z0JBQ2YsT0FBTyxNQUFNLE1BQU07Ozs7Z0JBRW5CLE9BQU8sTUFBTSxnQkFBYixPQUFPLE1BQU07Z0JBQ2IsT0FBTyxNQUFNLElBQUksWUFBTSxHQUFLLEtBQUssUUFBUTs7WUFDN0MsUUFBUTs7WUFDQTs7bUJBQVY7O3lCQUNGLE1BQU0sMEJBQU87O0lBQ2pCLG9CQUFXLEtBQUk7O2VBQVUsTUFBTSxPQUFPOztJQUN0QyxvQkFBVzs7c0JBQWUsTUFBTTs7SUFDaEMsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJLFFBQVEsSUFBSTtJQUVqRCxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7SUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSTtVQUVmLFlBQVksRUFBRSxRQUFRO1dBQ3hCOzs7QUFFSiw4QkFBZSxHQUFFOzs7O0lBQ2IsU0FBUyxNQUFNLElBQUk7SUFDbkIsSUFBSTtXQUNFLElBQUk7O1FBQ04sUUFBUSxFQUFFLFFBQVE7dUJBQ0gsVUFBVSxNQUFNLEdBQUcsU0FBUTs7OztjQUN4QyxNQUFNO1FBQ1IsS0FBSyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/dirtree.kode
