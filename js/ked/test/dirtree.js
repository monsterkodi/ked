var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var makeCol, waitForRoot

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9kaXJ0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDSSxTQUFBOztPQUNNLFVBQUE7SUFBTTtJQUFNO0lBQU07O09BQ1YsYUFBWDs7T0FDVyxjQUFYOztPQUNjLGFBQVQ7OztBQUVaOzs7O0lBRUk7SUFDQSxvQkFBVyxLQUFJOzs7O2VBQ0UsY0FBQSxJQUFLOzttQkFBaEI7O1FBQ0YsU0FBUyxNQUFNO1FBQ2Y7UUFDQSxRQUFRO2FBQ0osS0FBTzs7WUFBTCxJQUFLO2lCQUNTLEVBQUUsV0FBVzs7Z0JBQTdCOztZQUNBLE9BQU8sUUFBRSxPQUFPO1lBQ2hCLFFBQVEsS0FBSyxNQUFNO2dCQUNoQixNQUFNLFdBQVU7O2dCQUNmLE9BQU8sTUFBTSxNQUFNOzs7O2dCQUVuQixPQUFPLE1BQU0sZ0JBQWIsT0FBTyxNQUFNO2dCQUNiLE9BQU8sTUFBTSxJQUFJLFlBQU0sR0FBSyxLQUFLLFFBQVE7O1lBQzdDLFFBQVE7O1lBQ0E7O21CQUFWOzt5QkFDRixNQUFNLDBCQUFPOztJQUNqQixvQkFBVyxLQUFJOztlQUFVLE1BQU0sT0FBTzs7SUFDdEMsb0JBQVc7O3NCQUFlLE1BQU07O0lBQ2hDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSSxRQUFRLElBQUk7SUFFakQsUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO0lBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87SUFDeEIsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUk7VUFFZixZQUFZLEVBQUUsUUFBUTtXQUN4Qjs7O0FBRUosOEJBQWUsR0FBRTs7OztJQUNiLFNBQVMsTUFBTSxJQUFJO0lBQ25CLElBQUk7V0FDRSxJQUFJOztRQUNOLFFBQVEsRUFBRSxRQUFRO3VCQUNILFVBQVUsTUFBTSxHQUFHLFNBQVE7Ozs7Y0FDeEMsTUFBTTtRQUNSLEtBQUsifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/dirtree.kode
