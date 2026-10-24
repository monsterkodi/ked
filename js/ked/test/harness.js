var toExport = {}
var c, g, h, i, line, row

import harness from "../util/harness.js"

import input from "../view/base/input.js"
import crumbs from "../view/base/crumbs.js"

import choices from "../view/menu/choices.js"
import greet from "../view/menu/greet.js"

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
    await section("the cursor is marked", async function ()
    {
        h = new harness
        i = new input(h.screen,'test_input')
        i.layout(0,0,20,1)
        i.state.loadLines(['abc'])
        h.focus(i)
        i.state.setMainCursor(1,0)
        i.draw()
        compare(h.row(0),'abc')
        compare(h.rowMarked(0),'a\x1b[7;4:3mb\x1b[0mc')
    })
    await section("the greeter blacks out the window", async function ()
    {
        h = new harness
        g = new greet(h.screen)
        g.show()
        g.layout(0,0)
        g.draw()
        compare(h.screen.get_bg(0,23),[0,0,0])
        compare(h.screen.get_bg(79,0),[0,0,0])
    })
    await section("the colored screen has the colors of the cells", async function ()
    {
        h = new harness
        h.screen.set(0,0,'a',[10,20,30],[1,2,3])
        line = h.screen.textColored()[0]
        compare(line.includes('\x1b[48;2;1;2;3m'),true)
        compare(line.includes('\x1b[38;2;10;20;30m'),true)
        compare(line.includes('a'),true)
        compare(line.endsWith('\x1b[0m'),true)
    })
    await section("the colored screen marks the cursor", async function ()
    {
        h = new harness
        h.screen.set(0,0,'a',[10,20,30],[1,2,3])
        h.screen.set_mark(0,0,'main')
        line = h.screen.textColored()[0]
        compare(line.includes('\x1b[7;4:3ma\x1b[0m'),true)
    })
}
toExport["harness"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFybmVzcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9oYXJuZXNzLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQVFtQixjQUFaOztPQUNZLFlBQVA7T0FBYSxhQUFiOztPQUNPLGNBQU47T0FBYyxZQUFkOzs7Ozs7UUFTTCxRQUFRO2dCQUVSLEVBQUUsRUFBRSxVQUFZO1FBRWhCLEVBQUUsRUFBRSxNQUFNO2dCQUVWLEVBQUUsRUFBRSxVQUFZOzs7O1FBSWhCLFFBQVE7UUFFUixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFLElBQUk7UUFDTixFQUFFO1FBRUYsTUFBTSxFQUFFLElBQUk7Z0JBRVosSUFBSSxTQUFTLFFBQVM7Z0JBQ3RCLElBQUksU0FBUyxLQUFNO2dCQUVuQixFQUFFLElBQUksR0FBSTs7OztRQU1WLFFBQVE7UUFFUixRQUFRLFFBQVEsRUFBRSxPQUFPO1FBQ3pCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFLEtBQUssTUFBTSxNQUFNO1FBQ25CLEVBQUUsT0FBTztnQkFFVCxFQUFFLGVBQWlCO1FBRW5CLEVBQUUsSUFBSSxFQUFFO2dCQUVSLEVBQUUsZUFBaUI7Ozs7UUFNbkIsUUFBUTtRQUVSLFFBQVEsTUFBTSxFQUFFLE9BQU87UUFDdkIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBRWhCLEVBQUUsTUFBTTtnQkFFUixFQUFFLFdBQWE7Ozs7UUFNZixRQUFRO1FBRVIsUUFBUSxNQUFNLEVBQUUsT0FBTztRQUN2QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFFaEIsRUFBRSxNQUFNO1FBRVIsRUFBRSxLQUFLLEVBQUU7Z0JBRVQsRUFBRSxVQUFZOzs7O1FBT2QsUUFBUTtRQUVSLFFBQVEsTUFBTSxFQUFFLE9BQU87UUFDdkIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsTUFBTSxXQUFXO1FBRW5CLEVBQUUsTUFBTTtRQUNSLEVBQUUsTUFBTSxjQUFjLEVBQUU7UUFDeEIsRUFBRTtnQkFJRixFQUFFLElBQUksR0FBSTtnQkFDVixFQUFFLFVBQVUsR0FBSTs7OztRQU9oQixRQUFRO1FBRVIsUUFBUSxNQUFNLEVBQUU7UUFDaEIsRUFBRTtRQUNGLEVBQUUsT0FBTyxFQUFFO1FBQ1gsRUFBRTtnQkFJRixFQUFFLE9BQU8sT0FBTyxFQUFHLEtBQU0sRUFBRSxFQUFFO2dCQUM3QixFQUFFLE9BQU8sT0FBTyxHQUFHLElBQU0sRUFBRSxFQUFFOzs7O1FBTTdCLFFBQVE7UUFFUixFQUFFLE9BQU8sSUFBSSxFQUFFLEVBQUUsS0FBSyxHQUFHLEdBQUcsS0FBSyxFQUFFLEVBQUU7UUFFckMsT0FBTyxFQUFFLE9BQU8sY0FBYztnQkFFOUIsS0FBSyxTQUFTLG9CQUF5QjtnQkFDdkMsS0FBSyxTQUFTLHVCQUF5QjtnQkFDdkMsS0FBSyxTQUFTLEtBQXlCO2dCQUN2QyxLQUFLLFNBQVMsV0FBeUI7Ozs7UUFNdkMsUUFBUTtRQUVSLEVBQUUsT0FBTyxJQUFJLEVBQUUsRUFBRSxLQUFLLEdBQUcsR0FBRyxLQUFLLEVBQUUsRUFBRTtRQUNyQyxFQUFFLE9BQU8sU0FBUyxFQUFFLEVBQUU7UUFFdEIsT0FBTyxFQUFFLE9BQU8sY0FBYztnQkFFOUIsS0FBSyxTQUFTLHVCQUF3QiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/harness.kode
