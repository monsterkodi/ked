var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var allow, create, dirtree, event, makeCol, outside, parent, root, sub, waitForRoot

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
toExport["context menu"] = async function ()
{
    await section("is safe", async function ()
    {
        root = '/tmp/opencode/ked-dirtree-context'
        parent = {path:'/tmp/opencode',type:'dir',tilde:'  ..'}
        sub = {path:slash.path(root,'sub'),type:'dir'}
        outside = {path:'/opt/elsewhere',type:'dir'}
        allow = [root]
        create = icons.dir_open + ' '
        compare(dircol.isAllowedPath('~/s/x',['~/s']),true)
        compare(dircol.isAllowedPath('~/s/x',['~']),true)
        compare(dircol.isAllowedPath(outside.path,allow),false)
        compare(dircol.isParentItem(parent),true)
        compare(dircol.contextItems(parent,root,allow),[])
        compare(dircol.contextItems(outside,root,allow),[])
        compare(dircol.contextItems({path:'/tmp',type:'dir'},root,['/tmp']),[])
        compare(dircol.contextItems({path:'/',type:'dir'},root,['/']),[create])
        compare(dircol.contextItems({path:root,type:'dir'},root,allow),[create])
        compare(dircol.contextItems(sub,root,allow),['\uF044 ','\uF0C5 ',create,'\uF014 '])
        compare(dircol.contextActionAllowed(parent,root,create,allow),false)
        compare(dircol.contextActionAllowed(outside,root,create,allow),false)
        compare(dircol.contextActionAllowed({path:root,type:'dir'},root,icons.dir_open,allow),true)
        compare(dircol.contextActionAllowed({path:root,type:'dir'},root,'rename',allow),false)
        compare(dircol.contextActionAllowed(sub,root,create,allow),true)
        event = {pos:[3,5]}
        dirtree = {currentRoot:root,cells:{inside:function (x, y)
        {
            return true
        }},eventPos:function (e)
        {
            return e.pos
        },state:{s:{view:[0,0]}},choiceAtRow:function (index)
        {
            return null
        }}
        compare(dircol.itemAtEvent(event,dirtree),null)
        dirtree.choiceAtRow = function (index)
        {
            return sub
        }
        compare(dircol.itemAtEvent(event,dirtree),sub)
    })
}
toExport["context menu"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlydHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9kaXJ0cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ0ksU0FBQTs7T0FDTSxVQUFBO0lBQU07SUFBTTtJQUFNOztPQUNWLGFBQVg7O09BQ1csY0FBWDs7T0FDVyxZQUFYOztPQUNjLGFBQVQ7OztBQUVaOzs7O0lBRUk7SUFDQSxvQkFBVyxLQUFJOzs7O2VBQ0UsY0FBQSxJQUFLOzttQkFBaEI7O1FBQ0YsU0FBUyxNQUFNO1FBQ2Y7UUFDQSxRQUFRO2FBQ0osS0FBTzs7WUFBTCxJQUFLO2lCQUNTLEVBQUUsV0FBVzs7Z0JBQTdCOztZQUNBLE9BQU8sUUFBRSxPQUFPO1lBQ2hCLFFBQVEsS0FBSyxNQUFNO2dCQUNoQixNQUFNLFdBQVU7O2dCQUNmLE9BQU8sTUFBTSxNQUFNOzs7O2dCQUVuQixPQUFPLE1BQU0sZ0JBQWIsT0FBTyxNQUFNO2dCQUNiLE9BQU8sTUFBTSxJQUFJLFlBQU0sR0FBSyxLQUFLLFFBQVE7O1lBQzdDLFFBQVE7O1lBQ0E7O21CQUFWOzt5QkFDRixNQUFNLDBCQUFPOztJQUNqQixvQkFBVyxLQUFJOztlQUFVLE1BQU0sT0FBTzs7SUFDdEMsb0JBQVc7O3NCQUFlLE1BQU07O0lBQ2hDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSSxRQUFRLElBQUk7SUFFakQsUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO0lBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87SUFDeEIsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUk7VUFFZixZQUFZLEVBQUUsUUFBUTtXQUN4Qjs7O0FBRUosOEJBQWUsR0FBRTs7OztJQUNiLFNBQVMsTUFBTSxJQUFJO0lBQ25CLElBQUk7V0FDRSxJQUFJOztRQUNOLFFBQVEsRUFBRSxRQUFRO3VCQUNILFVBQVUsTUFBTSxHQUFHLFNBQVE7Ozs7Y0FDeEMsTUFBTTtRQUNSLEtBQUs7Ozs7Ozs7UUFnSUwsT0FBTztRQUNQLFVBQVUsS0FBSyxnQkFBZ0IsS0FBSyxNQUFNLE1BQU07UUFDaEQsT0FBTyxLQUFLLE1BQU0sS0FBSyxLQUFLLE9BQU8sS0FBSztRQUN4QyxXQUFXLEtBQUssaUJBQWlCLEtBQUs7UUFDdEMsU0FBUztRQUNULFNBQVMsTUFBTSxXQUFXO2dCQUUxQixPQUFPLGNBQWMsU0FBVSxRQUFVO2dCQUN6QyxPQUFPLGNBQWMsU0FBVSxNQUFRO2dCQUN2QyxPQUFPLGNBQWMsUUFBUSxLQUFLLE9BQVM7Z0JBRTNDLE9BQU8sYUFBYSxRQUFVO2dCQUM5QixPQUFPLGFBQWEsT0FBTyxLQUFLO2dCQUNoQyxPQUFPLGFBQWEsUUFBUSxLQUFLO2dCQUNqQyxPQUFPLGNBQWMsS0FBSyxPQUFPLEtBQUssT0FBTyxNQUFNO2dCQUNuRCxPQUFPLGNBQWMsS0FBSyxJQUFJLEtBQUssT0FBTyxNQUFNLE9BQVM7Z0JBQ3pELE9BQU8sY0FBYyxLQUFLLEtBQUssS0FBSyxPQUFPLEtBQUssUUFBVTtnQkFDMUQsT0FBTyxhQUFhLElBQUksS0FBSyxRQUFVLFVBQVUsVUFBVSxPQUFPO2dCQUVsRSxPQUFPLHFCQUFxQixPQUFPLEtBQUssT0FBTyxPQUFTO2dCQUN4RCxPQUFPLHFCQUFxQixRQUFRLEtBQUssT0FBTyxPQUFTO2dCQUN6RCxPQUFPLHNCQUFzQixLQUFLLEtBQUssS0FBSyxPQUFPLEtBQUssTUFBTSxTQUFTLE9BQVM7Z0JBQ2hGLE9BQU8sc0JBQXNCLEtBQUssS0FBSyxLQUFLLE9BQU8sS0FBSyxTQUFTLE9BQVM7Z0JBQzFFLE9BQU8scUJBQXFCLElBQUksS0FBSyxPQUFPLE9BQVM7UUFFckQsU0FBUyxLQUFLLEVBQUU7UUFDaEIsV0FDSSxZQUFhLEtBQ2IsT0FDSSxpQkFBUyxHQUFFOzttQkFBTTtXQUNyQixtQkFBVzs7bUJBQU0sRUFBRTtVQUNuQixPQUFPLEdBQUcsTUFBTSxFQUFFLEtBQ2xCLHNCQUFjOzttQkFBVTs7Z0JBQzVCLE9BQU8sWUFBWSxNQUFNLFNBQVc7UUFDcEMsUUFBUSx3QkFBZTs7bUJBQVU7O2dCQUNqQyxPQUFPLFlBQVksTUFBTSxTQUFXIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/dirtree.kode
