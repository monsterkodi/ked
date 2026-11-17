var toExport = {}
var _k_ = {clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var cells, ex, fakeGet, fakeSet, h, h1, h2, m, s, search, store, text, texts

import kxk from "../../kxk.js"
let post = kxk.post

import state from "../edit/state.js"

import belt from "../edit/tool/belt.js"
import cmdlinehistory from "../edit/tool/cmdlinehistory.js"

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
toExport["cmdlinehistory"] = async function ()
{
    await section("a new history is empty", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new cmdlinehistory('ex')
        compare(h.list(),[])
        compare(h.prev('draft'),null)
        delete global.ked_session
    })
    await section("added entries are stored in the session", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new cmdlinehistory('ex')
        h.add('w')
        h.add('q')
        compare(h.list(),['w','q'])
        compare(ked_session.get('novim▸history▸ex'),['w','q'])
        delete global.ked_session
    })
    await section("search and ex histories are separate", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        search = new cmdlinehistory('search')
        ex = new cmdlinehistory('ex')
        search.add('foo')
        ex.add('w')
        compare(search.list(),['foo'])
        compare(ex.list(),['w'])
        compare(ked_session.get('novim▸history▸search'),['foo'])
        compare(ked_session.get('novim▸history▸ex'),['w'])
        delete global.ked_session
    })
    await section("an entry is not repeated but moved to the newest position", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new cmdlinehistory('ex')
        h.add('w')
        h.add('q')
        h.add('w')
        compare(h.list(),['q','w'])
        delete global.ked_session
    })
    await section("old entries fall off at the limit", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new cmdlinehistory('ex')
        h.limit = 3
        var list = ['1','2','3','4','5']
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            text = list[_a_]
            h.add(text)
        }
        compare(h.list(),['3','4','5'])
        delete global.ked_session
    })
    await section("navigation goes back and forward through the entries", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new cmdlinehistory('ex')
        h.add('one')
        h.add('two')
        compare(h.prev('draft'),'two')
        compare(h.prev('two'),'one')
        compare(h.prev('one'),null)
        compare(h.next('one'),'two')
        compare(h.next('two'),'draft')
        compare(h.next('draft'),'draft')
        compare(h.prev('draft'),'two')
        delete global.ked_session
    })
    await section("adding an entry resets the navigation position", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new cmdlinehistory('ex')
        h.add('one')
        h.add('two')
        compare(h.prev('draft'),'two')
        h.add('three')
        compare(h.prev('draft'),'three')
        delete global.ked_session
    })
    await section("a new instance sees the stored history", async function ()
    {
        store = {}
        global.ked_session = {get:fakeGet,set:fakeSet}
        h1 = new cmdlinehistory('ex')
        h1.add('one')
        h2 = new cmdlinehistory('ex')
        compare(h2.list(),['one'])
        compare(h2.prev(''),'one')
        delete global.ked_session
    })
    await section("without a session entries are not added", async function ()
    {
        global.ked_session = null
        h = new cmdlinehistory('ex')
        compare(h.add('one'),false)
        compare(h.list(),[])
    })
}
toExport["cmdlinehistory"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW1oaXN0b3J5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L25vdmltaGlzdG9yeS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztPQUFVLFVBQUE7SUFBUzs7T0FDQSxZQUFaOztPQUNZLFdBQVA7T0FBWSxxQkFBWjs7T0FDTyxZQUFOOztBQUViLFNBQVEsS0FBSyxHQUFHLEtBQUs7O0FBRXJCLG9CQUFXLEtBQUk7Ozs7K0JBQWMsTUFBTSx5QkFBTzs7O0FBQzFDLG9CQUFXLEtBQUk7O1dBQVUsTUFBTSxpQkFBYTs7Ozs7O1FBTXBDO1FBQ0EsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFFBQVEsTUFBTSxNQUFNO1FBQ3BCLFFBQVEsTUFBTTtRQUVkLEVBQUUsTUFBTTtnQkFFUixZQUFZLElBQUkscUJBQXVCO2VBRWhDLE9BQU87Ozs7UUFJZDtRQUNBLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLE1BQU0sTUFBTTtRQUNwQixRQUFRLE1BQU07UUFFZCxFQUFFLE1BQU0sTUFBTztnQkFFZixZQUFZLElBQUksb0JBQXNCO2VBRS9CLE9BQU87Ozs7UUFJZDtRQUNBLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLE1BQU0sTUFBTTtRQUNwQixFQUFFLFVBQVUsS0FBSyxhQUFhO1FBRTlCLFFBQVEsTUFBTTtRQUNkLEVBQUU7UUFDRixFQUFFLGNBQWM7UUFDaEIsRUFBRTtnQkFFRixZQUFZLElBQUkseUJBQTJCO2VBRXBDLE9BQU87Ozs7UUFJZDtRQUNBLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLE1BQU0sTUFBTTtRQUNwQixRQUFRLE1BQU07UUFFZDtRQUNBLEtBQUssR0FBRywwQkFBaUI7O21CQUFNLE1BQU0sS0FBSyxFQUFFOztRQUU1QyxFQUFFLE1BQU07UUFDUixFQUFFO2dCQUVGLEVBQUUsVUFBVSxNQUFTO2dCQUNyQixFQUFFLEdBQW1CO2dCQUNyQixPQUFzQjtn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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/novimhistory.kode
