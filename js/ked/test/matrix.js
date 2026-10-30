var toExport = {}
var cols, h, m, s, x

import harness from "../util/harness.js"

import matrix from "../view/base/matrix.js"

import kxk from "../../kxk.js"
let post = kxk.post

toExport["matrix"] = async function ()
{
    await section("selection moves through the items in reading order", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        m.setItems(['a','b','c','d','e','f','g','h','i','j','k','l'])
        compare(m.selectedText(),'a')
        compare(m.moveSelection('right'),true)
        compare(m.selectedText(),'b')
        cols = m.columns()
        m.setItems(['a','b','c','d','e','f','g','h','i','j','k','l'])
        compare(m.selectedIndex,0)
        compare(m.moveSelection('down'),true)
        compare(m.selectedIndex,cols)
    })
    await section("left at the first item stays put", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        m.setItems(['a','b','c'])
        compare(m.moveSelection('left'),false)
        compare(m.selectedIndex,0)
    })
    await section("up in the first row stays put", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        m.setItems(['a','b','c'])
        compare(m.moveSelection('up'),false)
        compare(m.selectedIndex,0)
    })
    await section("the selection scrolls into a one row view", async function ()
    {
        h = new harness({cols:10,rows:1})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,1)
        m.setItems(['a','b','c','d','e','f','g','h','i','j','k','l'])
        compare(m.offset,0)
        m.moveSelection('down')
        compare(m.selectedIndex,m.columns())
        compare(m.offset,1)
    })
    await section("a scroll bar appears when the grid overflows", async function ()
    {
        h = new harness({cols:10,rows:2})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,2)
        m.setItems(['a','b','c','d','e','f','g','h','i','j','k','l'])
        compare(m.scrollBarVisible(),true)
        m.setItems(['a','b','c'])
        compare(m.scrollBarVisible(),false)
    })
    await section("the matrix knows whether it has the focus", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        compare(m.hasFocus(),false)
        h.focus(m)
        compare(m.hasFocus(),true)
        post.emit('focus','somewhere_else')
        compare(m.hasFocus(),false)
    })
    await section("a larger scale uses more cell rows per logical row", async function ()
    {
        h = new harness({cols:20,rows:20})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,20,20)
        compare(m.scale,1)
        compare(m.viewportRows(),20)
        m.incScale(1)
        compare(m.scale,2)
        compare(m.viewportRows(),10)
        compare(m.cellAtPos(3,4),[0,2])
        m.incScale(1)
        compare(m.scale,3)
        compare(m.viewportRows(),6)
        compare(m.cellAtPos(3,3),[0,1])
        m.incScale(-1)
        m.incScale(-1)
        compare(m.scale,1)
        compare(m.viewportRows(),20)
    })
    await section("scaled cells and the selection line up at every scale", async function ()
    {
        var list = [2,3]
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            s = list[_a_]
            h = new harness({cols:24,rows:20})
            m = new matrix(h.screen,'test_matrix')
            m.layout(0,0,24,20)
            while (m.scale < s)
            {
                m.incScale(1)
            }
            m.setItems(['a'])
            m.draw()
            x = s
            compare(h.screen.get_char(x - s,0),'')
            compare(h.screen.get_char(x,0),'a')
            compare(h.screen.get_char(x + s,0),'')
            compare(m.skipText(),`\x1b[${s}C`)
        }
    })
}
toExport["matrix"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L21hdHJpeC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FNbUIsY0FBWjs7T0FDWSxhQUFQOztPQUNGLFVBQUE7SUFBUzs7Ozs7O1FBTVgsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsVUFBVSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7Z0JBRXhELEVBQUUsZUFBaUI7Z0JBRW5CLEVBQUUsY0FBYyxTQUFVO2dCQUMxQixFQUFFLGVBQWlCO1FBRW5CLE9BQU8sRUFBRTtRQUVULEVBQUUsVUFBVSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7Z0JBQ3hELEVBQUUsY0FBZ0I7Z0JBRWxCLEVBQUUsY0FBYyxRQUFTO2dCQUN6QixFQUFFLGNBQWdCOzs7O1FBSWxCLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFLFVBQVUsSUFBSSxJQUFJO2dCQUVwQixFQUFFLGNBQWMsUUFBUztnQkFDekIsRUFBRSxjQUFnQjs7OztRQUlsQixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRSxVQUFVLElBQUksSUFBSTtnQkFFcEIsRUFBRSxjQUFjLE1BQU87Z0JBQ3ZCLEVBQUUsY0FBZ0I7Ozs7UUFJbEIsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsVUFBVSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7Z0JBRXhELEVBQUUsT0FBUztRQUVYLEVBQUUsY0FBYztnQkFFaEIsRUFBRSxjQUFnQixFQUFFO2dCQUNwQixFQUFFLE9BQVM7Ozs7UUFJWCxRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRSxVQUFVLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTtnQkFFeEQsRUFBRSxtQkFBcUI7UUFFdkIsRUFBRSxVQUFVLElBQUksSUFBSTtnQkFFcEIsRUFBRSxtQkFBcUI7Ozs7UUFJdkIsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO2dCQUVoQixFQUFFLFdBQWE7UUFFZixFQUFFLE1BQU07Z0JBRVIsRUFBRSxXQUFhO1FBRWYsS0FBSyxLQUFLLFFBQVE7Z0JBRWxCLEVBQUUsV0FBYTs7OztRQUlmLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztnQkFFaEIsRUFBRSxNQUFRO2dCQUNWLEVBQUUsZUFBaUI7UUFFbkIsRUFBRSxTQUFTO2dCQUVYLEVBQUUsTUFBUTtnQkFDVixFQUFFLGVBQWlCO2dCQUNuQixFQUFFLFVBQVUsRUFBRSxJQUFNLEVBQUU7UUFFdEIsRUFBRSxTQUFTO2dCQUVYLEVBQUUsTUFBUTtnQkFDVixFQUFFLGVBQWlCO2dCQUNuQixFQUFFLFVBQVUsRUFBRSxJQUFNLEVBQUU7UUFFdEIsRUFBRSxTQUFTO1FBQ1gsRUFBRSxTQUFTO2dCQUVYLEVBQUUsTUFBUTtnQkFDVixFQUFFLGVBQWlCOzs7O29CQUlULEVBQUU7OztZQUFSO1lBRUEsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1lBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87WUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO21CQUVWLEVBQUUsUUFBUTs7Z0JBQ1osRUFBRSxTQUFTOztZQUVmLEVBQUUsVUFBVTtZQUNaLEVBQUU7WUFFRixJQUFJO29CQUVKLEVBQUUsT0FBTyxTQUFTLElBQUUsRUFBRSxHQUFLO29CQUMzQixFQUFFLE9BQU8sU0FBUyxFQUFJLEdBQUs7b0JBQzNCLEVBQUUsT0FBTyxTQUFTLElBQUUsRUFBRSxHQUFLO29CQUUzQixFQUFFLG1CQUFxQiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/matrix.kode
