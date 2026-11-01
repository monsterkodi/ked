var toExport = {}
var e, h, row, t

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import title from "../view/title/title.js"

toExport["title"] = async function ()
{
    await section("the crumbs show the folder of a file", async function ()
    {
        h = new harness({cols:100,rows:5})
        e = new editor(h.screen,'test_editor',[])
        t = new title(h.screen,e)
        t.setFile('~/s/ked/kode/doesntexist')
        t.layout(0,0,100,1)
        t.draw()
        row = h.row(0)
        compare(row.includes('~'),true)
        compare(row.includes('kode'),true)
        compare(row.includes('doesntexist'),true)
    })
}
toExport["title"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdGl0bGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQW9CLGFBQWI7O09BQ2EsY0FBYjs7T0FDYSxZQUFSOzs7Ozs7UUFNSixRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixRQUFRLE1BQU0sRUFBRSxPQUFPO1FBRXZCLEVBQUUsUUFBUTtRQUNWLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSTtRQUNqQixFQUFFO1FBRUYsTUFBTSxFQUFFLElBQUk7Z0JBRVosSUFBSSxTQUFTLEtBQWdCO2dCQUM3QixJQUFJLFNBQVMsUUFBZ0I7Z0JBQzdCLElBQUksU0FBUyxlQUFnQiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/title.kode
