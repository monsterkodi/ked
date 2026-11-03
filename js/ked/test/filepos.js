var toExport = {}
var _k_ = {clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var cells, fakeGet, fakeSet, file, fp, i, lines, reload, s, store, text

import kxk from "../../kxk.js"
let slash = kxk.slash

import belt from "../edit/tool/belt.js"

import state from "../edit/state.js"

import filepos from "../edit/mode/filepos.js"

import child_process from "child_process"
let spawn = child_process.spawn

toExport["filepos"] = async function ()
{
    await section("a reload keeps the saved view", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _14_48_

            return _k_.clone((((_14_48_=store[key]) != null ? _14_48_ : def)))
        }
        fakeSet = function (key, value)
        {
            return store[key] = _k_.clone(value)
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        cells = {cols:40,rows:20}
        s = new state(cells,'test_filepos')
        lines = []
        for (i = 0; i < 100; i++)
        {
            lines.push(`line ${i}`)
        }
        text = lines.join('\n')
        s.loadSegls(belt.seglsForText(text))
        file = '/tmp/ked-test-filepos'
        fp = new filepos(s)
        s.on('cursorsSet',(function ()
        {
            return fp.cursorsSet()
        }))
        ked_session.set('editor▸file',file)
        ked_session.set(`editor▸filepos▸${file}`,[5,60,0,50])
        reload = function ()
        {
            s.loadSegls(belt.seglsForText(text))
            return fp.fileLoaded(file)
        }
        reload()
        compare(s.s.view,[0,50])
        compare(s.mainCursor(),[5,60])
        reload()
        compare(s.s.view,[0,50])
        compare(ked_session.get(`editor▸filepos▸${file}`),[5,60,0,50])
        delete global.ked_session
    })
    await section("added files go before the current file", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _59_48_

            return _k_.clone((((_59_48_=store[key]) != null ? _59_48_ : def)))
        }
        fakeSet = function (key, value)
        {
            return store[key] = _k_.clone(value)
        }
        global.ked_session = {get:fakeGet,set:fakeSet}
        filepos.fileposl = [['/tmp/current',[1,2,3,4]]]
        filepos.offset = 0
        ked_session.set('editor▸file','/tmp/current')
        ked_session.set('editor▸filepos▸/tmp/next',[5,6,7,8])
        filepos.addFiles(['/tmp/next','/tmp/last'])
        compare(filepos.fileposl,[['/tmp/last',[0,0,0,0]],['/tmp/next',[5,6,7,8]],['/tmp/current',[1,2,3,4]]])
        delete global.ked_session
    })
    await section("file arguments go to the history", async function ()
    {
        compare(true,true)
    })
}
toExport["filepos"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXBvcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9maWxlcG9zLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ1UsVUFBQTtJQUFVOztPQUNBLFdBQVI7O09BQ1EsWUFBYjs7T0FDYSxjQUFQOztPQUNULG9CQUFBO0lBQWdCOzs7Ozs7UUFNWjtRQUVBLG9CQUFXLEtBQUk7Ozs7d0NBQWMsTUFBTSwwQkFBTzs7UUFDMUMsb0JBQVcsS0FBSTs7bUJBQVUsTUFBTSxpQkFBYTs7UUFDNUMsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFFckIsUUFBUSxNQUFNLE1BQU07UUFFcEI7YUFDSSxJQUFLLE9BQUk7O1lBQ1QsTUFBTSxhQUFhOztRQUV2QixPQUFPLE1BQU0sS0FBSztRQUVsQixFQUFFLFVBQVUsS0FBSyxhQUFhO1FBRTlCLE9BQU87UUFFUCxTQUFTLFFBQVE7UUFFakIsRUFBRSxHQUFHOzttQkFBaUIsR0FBRzs7UUFFekIsWUFBWSxJQUFJLGNBQWM7UUFHOUIsWUFBWSxzQkFBc0IsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUVqRDs7WUFDSSxFQUFFLFVBQVUsS0FBSyxhQUFhO21CQUM5QixHQUFHLFdBQVc7O1FBRWxCO2dCQUNBLEVBQUUsRUFBRSxNQUFRLEVBQUU7Z0JBQ2QsRUFBRSxjQUFnQixFQUFFO1FBRXBCO2dCQUNBLEVBQUUsRUFBRSxNQUFRLEVBQUU7Z0JBRWQsWUFBWSxzQkFBc0IsU0FBVyxFQUFFLEdBQUcsRUFBRTtlQUU3QyxPQUFPOzs7O1FBSWQ7UUFDQSxvQkFBVyxLQUFJOzs7O3dDQUFjLE1BQU0sMEJBQU87O1FBQzFDLG9CQUFXLEtBQUk7O21CQUFVLE1BQU0saUJBQWE7O1FBQzVDLE9BQU8sZUFBYyxJQUFJLFFBQVEsSUFBSTtRQUVyQyxRQUFRLGFBQWEsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFO1FBQzNDLFFBQVEsU0FBUztRQUVqQixZQUFZLElBQUksY0FBYztRQUM5QixZQUFZLElBQUksNEJBQTRCLEVBQUUsRUFBRSxFQUFFO1FBRWxELFFBQVEsVUFBVSxZQUFZO2dCQUU5QixRQUFRLFdBQWEsYUFBYSxFQUFFLEVBQUUsRUFBRSxLQUFLLGFBQWEsRUFBRSxFQUFFLEVBQUUsS0FBSyxnQkFBZ0IsRUFBRSxFQUFFLEVBQUU7ZUFFcEYsT0FBTzs7OztnQkFJZCxLQUFPIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/filepos.kode
