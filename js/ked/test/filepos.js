var toExport = {}
var _k_ = {clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var cells, fakeGet, fakeSet, file, fp, i, lines, reload, s, store, text

import belt from "../edit/tool/belt.js"

import state from "../edit/state.js"

import filepos from "../edit/mode/filepos.js"

toExport["filepos"] = async function ()
{
    await section("a reload keeps the saved view", async function ()
    {
        store = {}
        fakeGet = function (key, def)
        {
            var _19_48_

            return _k_.clone((((_19_48_=store[key]) != null ? _19_48_ : def)))
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
}
toExport["filepos"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXBvcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9maWxlcG9zLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BUW1CLFdBQVA7O09BQ08sWUFBWjs7T0FDWSxjQUFOOzs7Ozs7UUFNTDtRQUVBLG9CQUFXLEtBQUk7Ozs7d0NBQWMsTUFBTSwwQkFBTzs7UUFDMUMsb0JBQVcsS0FBSTs7bUJBQVUsTUFBTSxpQkFBYTs7UUFDNUMsT0FBTyxlQUFjLElBQUksUUFBUSxJQUFJO1FBRXJDLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFFckIsUUFBUSxNQUFNLE1BQU07UUFFcEI7YUFDSSxJQUFLLE9BQUk7O1lBQ1QsTUFBTSxhQUFhOztRQUV2QixPQUFPLE1BQU0sS0FBSztRQUVsQixFQUFFLFVBQVUsS0FBSyxhQUFhO1FBRTlCLE9BQU87UUFFUCxTQUFTLFFBQVE7UUFFakIsRUFBRSxHQUFHOzttQkFBaUIsR0FBRzs7UUFFekIsWUFBWSxJQUFJLGNBQWM7UUFHOUIsWUFBWSxzQkFBc0IsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUVqRDs7WUFDSSxFQUFFLFVBQVUsS0FBSyxhQUFhO21CQUM5QixHQUFHLFdBQVc7O1FBRWxCO2dCQUNBLEVBQUUsRUFBRSxNQUFRLEVBQUU7Z0JBQ2QsRUFBRSxjQUFnQixFQUFFO1FBRXBCO2dCQUNBLEVBQUUsRUFBRSxNQUFRLEVBQUU7Z0JBRWQsWUFBWSxzQkFBc0IsU0FBVyxFQUFFLEdBQUcsRUFBRTtlQUU3QyxPQUFPIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/filepos.kode
