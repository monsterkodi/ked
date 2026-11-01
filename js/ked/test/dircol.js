var toExport = {}
var d, e, fakeGet, fakeSet, h, store

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import dircol from "../view/colmns/dircol.js"

toExport["dircol crumbs"] = async function ()
{
    await section("a relative root shows the absolute folder path", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _11_42_

            return ((_11_42_=store[key]) != null ? _11_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
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
        store = {}
        fakeGet = function (key, def)
        {
            var _31_42_

            return ((_31_42_=store[key]) != null ? _31_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
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
        store = {}
        fakeGet = function (key, def)
        {
            var _51_42_

            return ((_51_42_=store[key]) != null ? _51_42_ : def)
        }
        fakeSet = function (key, value)
        {
            return store[key] = value
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
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
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2RpcmNvbC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBVSxVQUFBO0lBQVc7SUFBTTs7T0FDTixhQUFkOztPQUNjLGNBQWQ7O09BQ2MsYUFBVDs7Ozs7O1FBTUo7UUFDQSxvQkFBVyxLQUFJOzs7OzZCQUFRLE1BQU0sMEJBQU87O1FBQ3BDLG9CQUFXLEtBQUk7O21CQUFVLE1BQU0sT0FBTzs7UUFDdEMsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFFBQVEsU0FBUSxLQUFLLElBQUksS0FBSztRQUM5QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxJQUFJO1FBRWpCLEVBQUUsUUFBUTtnQkFFVixFQUFFLE9BQU8sS0FBTyxNQUFNLE1BQU0sTUFBTSxLQUFLLFFBQVEsTUFBTTtnQkFDckQsRUFBRSxPQUFPLE1BQU0sR0FBSztjQUVsQixNQUFNO2VBQ0QsT0FBTzs7OztRQUlkO1FBQ0Esb0JBQVcsS0FBSTs7Ozs2QkFBUSxNQUFNLDBCQUFPOztRQUNwQyxvQkFBVyxLQUFJOzttQkFBVSxNQUFNLE9BQU87O1FBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSTtRQUVqQixFQUFFLFFBQVE7Z0JBRVYsRUFBRSxPQUFPLEtBQU8sTUFBTSxNQUFNLE1BQU0sS0FBSyxRQUFRLE1BQU07Z0JBQ3JELEVBQUUsT0FBTyxNQUFNLEdBQUs7Y0FFbEIsTUFBTTtlQUNELE9BQU87Ozs7UUFJZDtRQUNBLG9CQUFXLEtBQUk7Ozs7NkJBQVEsTUFBTSwwQkFBTzs7UUFDcEMsb0JBQVcsS0FBSTs7bUJBQVUsTUFBTSxPQUFPOztRQUN0QyxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7UUFFckMsUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO1FBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUk7UUFFakIsRUFBRSxRQUFRO2dCQUVWLEVBQUUsT0FBTyxLQUFPO2dCQUNoQixFQUFFLE9BQU8sTUFBTSxHQUFLO2NBRWxCLE1BQU07ZUFDRCxPQUFPIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/dircol.kode
