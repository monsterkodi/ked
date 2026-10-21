var toExport = {}
var c, h, i, row

import harness from "../util/harness.js"

import input from "../view/base/input.js"
import crumbs from "../view/base/crumbs.js"

import choices from "../view/menu/choices.js"

toExport["harness"] = async function ()
{
    await section("the terminal is left alone", async function ()
    {
        h = new harness
        compare(h.t.written(),'')
        h.t.write('hello')
        compare(h.t.written(),'hello')
    })
    await section("the screen is text", async function ()
    {
        h = new harness
        c = new crumbs(h.screen,'test_crumbs')
        c.layout(0,0,30,1)
        c.set('/home/kodi/s')
        c.draw()
        row = h.row(0)
        compare(row.includes('kodi'),true)
        compare(row.includes('s'),true)
        compare(h.row(1),'')
    })
    await section("a key goes to the view", async function ()
    {
        h = new harness
        c = new choices(h.screen,'test_choices')
        c.layout(0,0,20,3)
        c.set(['one','two','three'])
        c.select(0)
        compare(c.currentIndex(),0)
        h.key(c,'down')
        compare(c.currentIndex(),1)
    })
    await section("the focus goes to a view", async function ()
    {
        h = new harness
        i = new input(h.screen,'test_input')
        i.layout(0,0,20,1)
        h.focus(i)
        compare(i.hasFocus(),true)
    })
    await section("a text goes into a view", async function ()
    {
        h = new harness
        i = new input(h.screen,'test_input')
        i.layout(0,0,20,1)
        h.focus(i)
        h.type(i,'xyz')
        compare(i.current(),'xyz')
    })
}
toExport["harness"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFybmVzcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9oYXJuZXNzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O1FBbUJRLFFBQVE7Z0JBRVIsRUFBRSxFQUFFLFVBQVk7UUFFaEIsRUFBRSxFQUFFLE1BQU07Z0JBRVYsRUFBRSxFQUFFLFVBQVk7Ozs7UUFNaEIsUUFBUTtRQUVSLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsSUFBSTtRQUNOLEVBQUU7UUFFRixNQUFNLEVBQUUsSUFBSTtnQkFFWixJQUFJLFNBQVMsUUFBUztnQkFDdEIsSUFBSSxTQUFTLEtBQU07Z0JBRW5CLEVBQUUsSUFBSSxHQUFJOzs7O1FBTVYsUUFBUTtRQUVSLFFBQVEsUUFBUSxFQUFFLE9BQU87UUFDekIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsS0FBSyxNQUFNLE1BQU07UUFDbkIsRUFBRSxPQUFPO2dCQUVULEVBQUUsZUFBaUI7UUFFbkIsRUFBRSxJQUFJLEVBQUU7Z0JBRVIsRUFBRSxlQUFpQjs7OztRQU1uQixRQUFRO1FBRVIsUUFBUSxNQUFNLEVBQUUsT0FBTztRQUN2QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFFaEIsRUFBRSxNQUFNO2dCQUVSLEVBQUUsV0FBYTs7OztRQU1mLFFBQVE7UUFFUixRQUFRLE1BQU0sRUFBRSxPQUFPO1FBQ3ZCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUVoQixFQUFFLE1BQU07UUFFUixFQUFFLEtBQUssRUFBRTtnQkFFVCxFQUFFLFVBQVkifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/harness.kode
