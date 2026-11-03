var toExport = {}
var c, g, h, i, line, row

import harness from "../util/harness.js"

import input from "../view/base/input.js"
import crumbs from "../view/base/crumbs.js"

import choices from "../view/menu/choices.js"
import greet from "../view/menu/greet.js"

import screen from "../view/screen/screen.js"

toExport["harness"] = async function ()
{
    await section("write and written", async function ()
    {
        h = new harness
        compare(h.t.written(),'')
        h.t.write('hello')
        compare(h.t.written(),'hello')
    })
    await section("crumbs are shown", async function ()
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
    await section("key presses", async function ()
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
    await section("view focus", async function ()
    {
        h = new harness
        i = new input(h.screen,'test_input')
        i.layout(0,0,20,1)
        h.focus(i)
        compare(i.hasFocus(),true)
    })
    await section("view typing", async function ()
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
        compare(h.rowMarked(0),`a${screen.MAIN_MARK}b${screen.END_MARK}c`)
    })
    await section("selection is marked", async function ()
    {
        h = new harness
        h.screen.set(0,0,'a')
        h.screen.set_mark(0,0,'selection')
        compare(h.rowMarked(0),`${screen.SELECT_MARK}a${screen.END_MARK}`)
    })
    await section("highlight is marked", async function ()
    {
        h = new harness
        h.screen.set(0,0,'a')
        h.screen.set_mark(0,0,'highlight')
        compare(h.rowMarked(0),`${screen.HILGHT_MARK}a${screen.END_MARK}`)
    })
    await section("greeter blacks out the window", async function ()
    {
        h = new harness
        g = new greet(h.screen)
        g.show()
        g.layout(0,0)
        g.draw()
        compare(h.screen.get_bg(0,23),[0,0,0])
        compare(h.screen.get_bg(79,0),[0,0,0])
    })
    await section("colored screen", async function ()
    {
        await section("draws colors", async function ()
        {
            h = new harness
            h.screen.set(0,0,'a',[10,20,30],[1,2,3])
            line = h.screen.textColored()[0]
            compare(line.includes('\x1b[48;2;1;2;3m'),true)
            compare(line.includes('\x1b[38;2;10;20;30m'),true)
            compare(line.includes('a'),true)
            compare(line.endsWith('\x1b[0m'),true)
        })
        await section("marks the cursor", async function ()
        {
            h = new harness
            h.screen.set(0,0,'a',[10,20,30],[1,2,3])
            h.screen.set_mark(0,0,'main')
            line = h.screen.textColored()[0]
            compare(line.includes(`${screen.MAIN_MARK}a${screen.END_MARK}`),true)
        })
        await section("marks the selection", async function ()
        {
            h = new harness
            h.screen.set(0,0,'a',[10,20,30],[1,2,3])
            h.screen.set_mark(0,0,'selection')
            line = h.screen.textColored()[0]
            compare(line.includes(`${screen.SELECT_MARK}a${screen.END_MARK}`),true)
        })
        await section("marks the highlight", async function ()
        {
            h = new harness
            h.screen.set(0,0,'a',[10,20,30],[1,2,3])
            h.screen.set_mark(0,0,'highlight')
            line = h.screen.textColored()[0]
            compare(line.includes(`${screen.HILGHT_MARK}a${screen.END_MARK}`),true)
        })
    })
}
toExport["harness"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFybmVzcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9oYXJuZXNzLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNxQixjQUFkOztPQUNjLFlBQVQ7T0FBZSxhQUFmOztPQUNTLGNBQVI7T0FBZ0IsWUFBaEI7O09BQ1EsYUFBUjs7Ozs7O1FBTUwsUUFBUTtnQkFFUixFQUFFLEVBQUUsVUFBWTtRQUVoQixFQUFFLEVBQUUsTUFBTTtnQkFFVixFQUFFLEVBQUUsVUFBWTs7OztRQUloQixRQUFRO1FBRVIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRSxJQUFJO1FBQ04sRUFBRTtRQUVGLE1BQU0sRUFBRSxJQUFJO2dCQUVaLElBQUksU0FBUyxRQUFTO2dCQUN0QixJQUFJLFNBQVMsS0FBTTtnQkFFbkIsRUFBRSxJQUFJLEdBQUk7Ozs7UUFJVixRQUFRO1FBRVIsUUFBUSxRQUFRLEVBQUUsT0FBTztRQUN6QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRSxLQUFLLE1BQU0sTUFBTTtRQUNuQixFQUFFLE9BQU87Z0JBRVQsRUFBRSxlQUFpQjtRQUVuQixFQUFFLElBQUksRUFBRTtnQkFFUixFQUFFLGVBQWlCOzs7O1FBSW5CLFFBQVE7UUFFUixRQUFRLE1BQU0sRUFBRSxPQUFPO1FBQ3ZCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUVoQixFQUFFLE1BQU07Z0JBRVIsRUFBRSxXQUFhOzs7O1FBSWYsUUFBUTtRQUVSLFFBQVEsTUFBTSxFQUFFLE9BQU87UUFDdkIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBRWhCLEVBQUUsTUFBTTtRQUVSLEVBQUUsS0FBSyxFQUFFO2dCQUVULEVBQUUsVUFBWTs7OztRQUlkLFFBQVE7UUFFUixRQUFRLE1BQU0sRUFBRSxPQUFPO1FBQ3ZCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFLE1BQU0sV0FBVztRQUVuQixFQUFFLE1BQU07UUFDUixFQUFFLE1BQU0sY0FBYyxFQUFFO1FBQ3hCLEVBQUU7Z0JBRUYsRUFBRSxJQUFJLEdBQUk7Z0JBQ1YsRUFBRSxVQUFVLE9BQVEsT0FBTyxhQUFhLE9BQU87Ozs7UUFJL0MsUUFBUTtRQUVSLEVBQUUsT0FBTyxJQUFJLEVBQUUsRUFBRTtRQUNqQixFQUFFLE9BQU8sU0FBUyxFQUFFLEVBQUU7Z0JBRXRCLEVBQUUsVUFBVSxNQUFPLE9BQU8sZUFBZSxPQUFPOzs7O1FBSWhELFFBQVE7UUFFUixFQUFFLE9BQU8sSUFBSSxFQUFFLEVBQUU7UUFDakIsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFO2dCQUV0QixFQUFFLFVBQVUsTUFBTyxPQUFPLGVBQWUsT0FBTzs7OztRQUloRCxRQUFRO1FBRVIsUUFBUSxNQUFNLEVBQUU7UUFDaEIsRUFBRTtRQUNGLEVBQUUsT0FBTyxFQUFFO1FBQ1gsRUFBRTtnQkFFRixFQUFFLE9BQU8sT0FBTyxFQUFHLEtBQU0sRUFBRSxFQUFFO2dCQUM3QixFQUFFLE9BQU8sT0FBTyxHQUFHLElBQU0sRUFBRSxFQUFFOzs7Ozs7WUFNekIsUUFBUTtZQUVSLEVBQUUsT0FBTyxJQUFJLEVBQUUsRUFBRSxLQUFLLEdBQUcsR0FBRyxLQUFLLEVBQUUsRUFBRTtZQUVyQyxPQUFPLEVBQUUsT0FBTyxjQUFjO29CQUU5QixLQUFLLFNBQVMsb0JBQXVCO29CQUNyQyxLQUFLLFNBQVMsdUJBQXlCO29CQUN2QyxLQUFLLFNBQVMsS0FBdUI7b0JBQ3JDLEtBQUssU0FBUyxXQUF1Qjs7OztZQUlyQyxRQUFRO1lBRVIsRUFBRSxPQUFPLElBQUksRUFBRSxFQUFFLEtBQUssR0FBRyxHQUFHLEtBQUssRUFBRSxFQUFFO1lBQ3JDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRTtZQUV0QixPQUFPLEVBQUUsT0FBTyxjQUFjO29CQUU5QixLQUFLLFlBQVksT0FBTyxhQUFhLE9BQU8sWUFBYTs7OztZQUl6RCxRQUFRO1lBRVIsRUFBRSxPQUFPLElBQUksRUFBRSxFQUFFLEtBQUssR0FBRyxHQUFHLEtBQUssRUFBRSxFQUFFO1lBQ3JDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRTtZQUV0QixPQUFPLEVBQUUsT0FBTyxjQUFjO29CQUU5QixLQUFLLFlBQVksT0FBTyxlQUFlLE9BQU8sWUFBYTs7OztZQUkzRCxRQUFRO1lBRVIsRUFBRSxPQUFPLElBQUksRUFBRSxFQUFFLEtBQUssR0FBRyxHQUFHLEtBQUssRUFBRSxFQUFFO1lBQ3JDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRTtZQUV0QixPQUFPLEVBQUUsT0FBTyxjQUFjO29CQUU5QixLQUFLLFlBQVksT0FBTyxlQUFlLE9BQU8sWUFBYSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/harness.kode
