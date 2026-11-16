var toExport = {}
var _k_ = {clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var cells, fakeGet, fakeSet, m, s, store, texts

import kxk from "../../kxk.js"
let post = kxk.post

import state from "../edit/state.js"

import belt from "../edit/tool/belt.js"

import novim from "../edit/mode/novim.js"

cells = {cols:55,rows:66}

fakeGet = function (key, def)
{
    var _8_40_

    return _k_.clone((((_8_40_=store[key]) != null ? _8_40_ : def)))
}

fakeSet = function (key, value)
{
    return store[key] = _k_.clone(value)
}
toExport["novim history"] = async function ()
{
    await section("ex commands go to the ex history", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimhistory_ex')
        m = new novim(s)
        m.runEx('foo')
        compare(ked_session.get('novim▸history▸ex'),['foo'])
        delete global.ked_session
    })
    await section("internal ex runs are not recorded", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimhistory_internal')
        m = new novim(s)
        m.runEx('foo',false)
        compare(ked_session.get('novim▸history▸ex'),undefined)
        delete global.ked_session
    })
    await section("committed searches go to the search history", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimhistory_search')
        s.loadLines(belt.linesForText("foo bar"))
        m = new novim(s)
        m.startSearch()
        m.searchChanged('bar')
        m.commitSearch()
        compare(ked_session.get('novim▸history▸search'),['bar'])
        delete global.ked_session
    })
    await section("up and down navigate the ex history", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimhistory_exnav')
        m = new novim(s)
        texts = []
        post.on('novim.ex.text',function (e)
        {
            return texts.push(e.text)
        })
        m.runEx('foo')
        m.startEx()
        compare(m.historyUp('ex'),true)
        compare(m.ex,'foo')
        compare(texts,['foo'])
        compare(m.historyDown('ex'),true)
        compare(m.ex,'')
        compare(texts,['foo',''])
        compare(m.historyUp('ex'),true)
        compare(m.historyUp('ex'),false)
        compare(m.ex,'foo')
        delete global.ked_session
    })
    await section("up and down navigate the search history", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimhistory_searchnav')
        s.loadLines(belt.linesForText("alpha beta"))
        m = new novim(s)
        texts = []
        post.on('novim.search.text',function (e)
        {
            return texts.push(e.text)
        })
        m.startSearch()
        m.searchChanged('beta')
        m.commitSearch()
        s.setMainCursor(0,0)
        m.startSearch()
        compare(m.historyUp('search'),true)
        compare(m.searchText,'beta')
        compare(texts,['beta'])
        compare(m.historyDown('search'),true)
        compare(m.searchText,'alpha')
        compare(texts,['beta','alpha'])
        delete global.ked_session
    })
    await section("the histories do not share entries", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        s = new state(cells,'novimhistory_separate')
        s.loadLines(belt.linesForText("alpha beta"))
        m = new novim(s)
        m.runEx('foo')
        m.startSearch()
        m.searchChanged('beta')
        m.commitSearch()
        compare(ked_session.get('novim▸history▸ex'),['foo'])
        compare(ked_session.get('novim▸history▸search'),['beta'])
        delete global.ked_session
    })
}
toExport["novim history"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW1oaXN0b3J5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L25vdmltaGlzdG9yeS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztPQUFVLFVBQUE7SUFBUzs7T0FDQSxZQUFaOztPQUNZLFdBQVA7O09BQ08sWUFBTjs7QUFFYixTQUFRLEtBQUssR0FBRyxLQUFLOztBQUVyQixvQkFBVyxLQUFJOzs7OytCQUFjLE1BQU0seUJBQU87OztBQUMxQyxvQkFBVyxLQUFJOztXQUFVLE1BQU0saUJBQWE7Ozs7OztRQU1wQztRQUNBLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLE1BQU0sTUFBTTtRQUNwQixRQUFRLE1BQU07UUFFZCxFQUFFLE1BQU07Z0JBRVIsWUFBWSxJQUFJLHFCQUF1QjtlQUVoQyxPQUFPOzs7O1FBSWQ7UUFDQSxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7UUFFckMsUUFBUSxNQUFNLE1BQU07UUFDcEIsUUFBUSxNQUFNO1FBRWQsRUFBRSxNQUFNLE1BQU87Z0JBRWYsWUFBWSxJQUFJLG9CQUFzQjtlQUUvQixPQUFPOzs7O1FBSWQ7UUFDQSxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7UUFFckMsUUFBUSxNQUFNLE1BQU07UUFDcEIsRUFBRSxVQUFVLEtBQUssYUFBYTtRQUU5QixRQUFRLE1BQU07UUFDZCxFQUFFO1FBQ0YsRUFBRSxjQUFjO1FBQ2hCLEVBQUU7Z0JBRUYsWUFBWSxJQUFJLHlCQUEyQjtlQUVwQyxPQUFPOzs7O1FBSWQ7UUFDQSxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7UUFFckMsUUFBUSxNQUFNLE1BQU07UUFDcEIsUUFBUSxNQUFNO1FBRWQ7UUFDQSxLQUFLLEdBQUcsMEJBQWlCOzttQkFBTSxNQUFNLEtBQUssRUFBRTs7UUFFNUMsRUFBRSxNQUFNO1FBQ1IsRUFBRTtnQkFFRixFQUFFLFVBQVUsTUFBUztnQkFDckIsRUFBRSxHQUFtQjtnQkFDckIsT0FBc0I7Z0JBRXRCLEVBQUUsWUFBWSxNQUFPO2dCQUNyQixFQUFFLEdBQW1CO2dCQUNyQixPQUFzQixNQUFNO2dCQUU1QixFQUFFLFVBQVUsTUFBUztnQkFDckIsRUFBRSxVQUFVLE1BQVM7Z0JBQ3JCLEVBQUUsR0FBbUI7ZUFFZCxPQUFPOzs7O1FBSWQ7UUFDQSxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7UUFFckMsUUFBUSxNQUFNLE1BQU07UUFDcEIsRUFBRSxVQUFVLEtBQUssYUFBYTtRQUU5QixRQUFRLE1BQU07UUFFZDtRQUNBLEtBQUssR0FBRyw4QkFBcUI7O21CQUFNLE1BQU0sS0FBSyxFQUFFOztRQUVoRCxFQUFFO1FBQ0YsRUFBRSxjQUFjO1FBQ2hCLEVBQUU7UUFFRixFQUFFLGNBQWMsRUFBRTtRQUVsQixFQUFFO2dCQUVGLEVBQUUsVUFBVSxVQUFhO2dCQUN6QixFQUFFLFdBQXVCO2dCQUN6QixPQUEwQjtnQkFFMUIsRUFBRSxZQUFZLFVBQVc7Z0JBQ3pCLEVBQUUsV0FBdUI7Z0JBQ3pCLE9BQTBCLE9BQU87ZUFFMUIsT0FBTzs7OztRQUlkO1FBQ0EsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFFBQVEsTUFBTSxNQUFNO1FBQ3BCLEVBQUUsVUFBVSxLQUFLLGFBQWE7UUFFOUIsUUFBUSxNQUFNO1FBRWQsRUFBRSxNQUFNO1FBRVIsRUFBRTtRQUNGLEVBQUUsY0FBYztRQUNoQixFQUFFO2dCQUVGLFlBQVksSUFBSSxxQkFBMkI7Z0JBQzNDLFlBQVksSUFBSSx5QkFBMkI7ZUFFcEMsT0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/novimhistory.kode
