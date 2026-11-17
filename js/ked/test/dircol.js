var toExport = {}
var d, e, h, ked_sess

import kxk from "../../kxk.js"
let slash = kxk.slash
let sleep = kxk.sleep

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import dircol from "../view/colmns/dircol.js"


ked_sess = function ()
{
    var fakeGet, fakeSet, store

    store = {}
    fakeGet = function (key, def)
    {
        var _8_38_

        return ((_8_38_=store[key]) != null ? _8_38_ : def)
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
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyY29sLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2RpcmNvbC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBVSxVQUFBO0lBQVc7SUFBTTs7T0FDTixhQUFkOztPQUNjLGNBQWQ7O09BQ2MsYUFBVDs7O0FBRVo7Ozs7SUFDSTtJQUNBLG9CQUFXLEtBQUk7Ozs7d0JBQVEsTUFBTSx5QkFBTzs7SUFDcEMsb0JBQVcsS0FBSTs7ZUFBVSxNQUFNLE9BQU87O1dBQ3RDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTs7Ozs7O1FBTWpDO1FBRUEsUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO1FBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUk7UUFFakIsRUFBRSxRQUFRO2dCQUVWLEVBQUUsT0FBTyxLQUFPLE1BQU0sTUFBTSxNQUFNLEtBQUssUUFBUSxNQUFNO2dCQUNyRCxFQUFFLE9BQU8sTUFBTSxHQUFLO2NBRWxCLE1BQU07ZUFDRCxPQUFPOzs7O1FBSWQ7UUFFQSxRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSTtRQUVqQixFQUFFLFFBQVE7Z0JBRVYsRUFBRSxPQUFPLEtBQU8sTUFBTSxNQUFNLE1BQU0sS0FBSyxRQUFRLE1BQU07Z0JBQ3JELEVBQUUsT0FBTyxNQUFNLEdBQUs7Y0FFbEIsTUFBTTtlQUNELE9BQU87Ozs7UUFJZDtRQUVBLFFBQVEsU0FBUSxLQUFLLElBQUksS0FBSztRQUM5QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxJQUFJO1FBRWpCLEVBQUUsUUFBUTtnQkFFVixFQUFFLE9BQU8sS0FBTztnQkFDaEIsRUFBRSxPQUFPLE1BQU0sR0FBSztjQUVsQixNQUFNO2VBQ0QsT0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/dircol.kode
