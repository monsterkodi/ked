var toExport = {}
var _k_ = {clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var ex, fakeGet, fakeSet, h, h1, h2, search, store, text

import cmdlinehistory from "../edit/tool/cmdlinehistory.js"

toExport["cmdlinehistory"] = async function ()
{
    await section("a new history is empty", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _8_48_

            return _k_.clone((((_8_48_=store[key]) != null ? _8_48_ : def)))
        }
        fakeSet = function (key, value)
        {
            return store[key] = _k_.clone(value)
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        h = new cmdlinehistory('ex')
        compare(h.list(),[])
        compare(h.prev('draft'),null)
        delete global.ked_session
    })
    await section("added entries are stored in the session", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _22_48_

            return _k_.clone((((_22_48_=store[key]) != null ? _22_48_ : def)))
        }
        fakeSet = function (key, value)
        {
            return store[key] = _k_.clone(value)
        }
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
        fakeGet = function (key, def)
        {
            var _39_48_

            return _k_.clone((((_39_48_=store[key]) != null ? _39_48_ : def)))
        }
        fakeSet = function (key, value)
        {
            return store[key] = _k_.clone(value)
        }
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
        fakeGet = function (key, def)
        {
            var _60_48_

            return _k_.clone((((_60_48_=store[key]) != null ? _60_48_ : def)))
        }
        fakeSet = function (key, value)
        {
            return store[key] = _k_.clone(value)
        }
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
        fakeGet = function (key, def)
        {
            var _77_48_

            return _k_.clone((((_77_48_=store[key]) != null ? _77_48_ : def)))
        }
        fakeSet = function (key, value)
        {
            return store[key] = _k_.clone(value)
        }
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
        fakeGet = function (key, def)
        {
            var _94_48_

            return _k_.clone((((_94_48_=store[key]) != null ? _94_48_ : def)))
        }
        fakeSet = function (key, value)
        {
            return store[key] = _k_.clone(value)
        }
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
        fakeGet = function (key, def)
        {
            var _118_48_

            return _k_.clone((((_118_48_=store[key]) != null ? _118_48_ : def)))
        }
        fakeSet = function (key, value)
        {
            return store[key] = _k_.clone(value)
        }
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
        fakeGet = function (key, def)
        {
            var _136_48_

            return _k_.clone((((_136_48_=store[key]) != null ? _136_48_ : def)))
        }
        fakeSet = function (key, value)
        {
            return store[key] = _k_.clone(value)
        }
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kbGluZWhpc3RvcnkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY21kbGluZWhpc3Rvcnkua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FBbUIscUJBQVA7Ozs7OztRQU1KO1FBQ0Esb0JBQVcsS0FBSTs7Ozt1Q0FBYyxNQUFNLHlCQUFPOztRQUMxQyxvQkFBVyxLQUFJOzttQkFBVSxNQUFNLGlCQUFhOztRQUM1QyxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7UUFFckMsUUFBUSxlQUFlO2dCQUV2QixFQUFFO2dCQUNGLEVBQUUsS0FBSyxTQUFXO2VBRVgsT0FBTzs7OztRQUlkO1FBQ0Esb0JBQVcsS0FBSTs7Ozt3Q0FBYyxNQUFNLDBCQUFPOztRQUMxQyxvQkFBVyxLQUFJOzttQkFBVSxNQUFNLGlCQUFhOztRQUM1QyxPQUFPLGVBQWMsSUFBSSxRQUFRLElBQUk7UUFFckMsUUFBUSxlQUFlO1FBRXZCLEVBQUUsSUFBSTtRQUNOLEVBQUUsSUFBSTtnQkFFTixFQUFFLFFBQVUsSUFBSTtnQkFDaEIsWUFBWSxJQUFJLHFCQUF1QixJQUFJO2VBRXBDLE9BQU87Ozs7UUFJZDtRQUNBLG9CQUFXLEtBQUk7Ozs7d0NBQWMsTUFBTSwwQkFBTzs7UUFDMUMsb0JBQVcsS0FBSTs7bUJBQVUsTUFBTSxpQkFBYTs7UUFDNUMsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLGFBQWEsZUFBZTtRQUM1QixTQUFhLGVBQWU7UUFFNUIsT0FBTyxJQUFJO1FBQ1gsR0FBRyxJQUFJO2dCQUVQLE9BQU8sUUFBVTtnQkFDakIsR0FBRyxRQUFjO2dCQUVqQixZQUFZLElBQUkseUJBQTJCO2dCQUMzQyxZQUFZLElBQUkscUJBQTJCO2VBRXBDLE9BQU87Ozs7UUFJZDtRQUNBLG9CQUFXLEtBQUk7Ozs7d0NBQWMsTUFBTSwwQkFBTzs7UUFDMUMsb0JBQVcsS0FBSTs7bUJBQVUsTUFBTSxpQkFBYTs7UUFDNUMsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFFBQVEsZUFBZTtRQUV2QixFQUFFLElBQUk7UUFDTixFQUFFLElBQUk7UUFDTixFQUFFLElBQUk7Z0JBRU4sRUFBRSxRQUFVLElBQUk7ZUFFVCxPQUFPOzs7O1FBSWQ7UUFDQSxvQkFBVyxLQUFJOzs7O3dDQUFjLE1BQU0sMEJBQU87O1FBQzFDLG9CQUFXLEtBQUk7O21CQUFVLE1BQU0saUJBQWE7O1FBQzVDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLGVBQWU7UUFDdkIsRUFBRSxRQUFRO29CQUVHLElBQUksSUFBSSxJQUFJLElBQUk7OztZQUF6QjtZQUNBLEVBQUUsSUFBSTs7Z0JBRVYsRUFBRSxRQUFVLElBQUksSUFBSTtlQUViLE9BQU87Ozs7UUFJZDtRQUNBLG9CQUFXLEtBQUk7Ozs7d0NBQWMsTUFBTSwwQkFBTzs7UUFDMUMsb0JBQVcsS0FBSTs7bUJBQVUsTUFBTSxpQkFBYTs7UUFDNUMsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFFBQVEsZUFBZTtRQUV2QixFQUFFLElBQUk7UUFDTixFQUFFLElBQUk7Z0JBRU4sRUFBRSxLQUFLLFNBQVc7Z0JBQ2xCLEVBQUUsS0FBSyxPQUFXO2dCQUNsQixFQUFFLEtBQUssT0FBVztnQkFFbEIsRUFBRSxLQUFLLE9BQVc7Z0JBQ2xCLEVBQUUsS0FBSyxPQUFXO2dCQUNsQixFQUFFLEtBQUssU0FBVztnQkFFbEIsRUFBRSxLQUFLLFNBQVc7ZUFFWCxPQUFPOzs7O1FBSWQ7UUFDQSxvQkFBVyxLQUFJOzs7O3lDQUFjLE1BQU0sMkJBQU87O1FBQzFDLG9CQUFXLEtBQUk7O21CQUFVLE1BQU0saUJBQWE7O1FBQzVDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLGVBQWU7UUFFdkIsRUFBRSxJQUFJO1FBQ04sRUFBRSxJQUFJO2dCQUNOLEVBQUUsS0FBSyxTQUFXO1FBRWxCLEVBQUUsSUFBSTtnQkFDTixFQUFFLEtBQUssU0FBVztlQUVYLE9BQU87Ozs7UUFJZDtRQUNBLG9CQUFXLEtBQUk7Ozs7eUNBQWMsTUFBTSwyQkFBTzs7UUFDMUMsb0JBQVcsS0FBSTs7bUJBQVUsTUFBTSxpQkFBYTs7UUFDNUMsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFNBQVMsZUFBZTtRQUN4QixHQUFHLElBQUk7UUFFUCxTQUFTLGVBQWU7Z0JBRXhCLEdBQUcsUUFBZTtnQkFDbEIsR0FBRyxLQUFLLElBQVM7ZUFFVixPQUFPOzs7O1FBSWQsT0FBTyxjQUFjO1FBRXJCLFFBQVEsZUFBZTtnQkFFdkIsRUFBRSxJQUFJLE9BQVE7Z0JBQ2QsRUFBRSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/cmdlinehistory.kode
