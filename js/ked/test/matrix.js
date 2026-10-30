var toExport = {}
var cols, h, m

import harness from "../util/harness.js"

import matrix from "../view/base/matrix.js"

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
}
toExport["matrix"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0cml4LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L21hdHJpeC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FNbUIsY0FBWjs7T0FDWSxhQUFQOzs7Ozs7UUFNSixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRSxVQUFVLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTtnQkFFeEQsRUFBRSxlQUFpQjtnQkFFbkIsRUFBRSxjQUFjLFNBQVU7Z0JBQzFCLEVBQUUsZUFBaUI7UUFFbkIsT0FBTyxFQUFFO1FBRVQsRUFBRSxVQUFVLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTtnQkFDeEQsRUFBRSxjQUFnQjtnQkFFbEIsRUFBRSxjQUFjLFFBQVM7Z0JBQ3pCLEVBQUUsY0FBZ0I7Ozs7UUFJbEIsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsVUFBVSxJQUFJLElBQUk7Z0JBRXBCLEVBQUUsY0FBYyxRQUFTO2dCQUN6QixFQUFFLGNBQWdCOzs7O1FBSWxCLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO1FBQ3hCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFLFVBQVUsSUFBSSxJQUFJO2dCQUVwQixFQUFFLGNBQWMsTUFBTztnQkFDdkIsRUFBRSxjQUFnQjs7OztRQUlsQixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRSxVQUFVLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTtnQkFFeEQsRUFBRSxPQUFTO1FBRVgsRUFBRSxjQUFjO2dCQUVoQixFQUFFLGNBQWdCLEVBQUU7Z0JBQ3BCLEVBQUUsT0FBUyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/matrix.kode
