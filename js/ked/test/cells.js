var toExport = {}
var c, exists, s, t, _54_27_

import kxk from "../../kxk.js"
let post = kxk.post

import screen from "../view/screen/screen.js"
import ttio from "../view/screen/ttio.js"
import cells from "../view/screen/cells.js"

toExport["cells"] = async function ()
{
    await section("a headless cell rect keeps its rect", async function ()
    {
        t = new ttio({headless:true,input:false,cols:20,rows:6})
        s = new screen(t)
        c = new cells(s)
        c.layout(2,1,10,4)
        compare(c.draw_cell_rect({x:1,y:1,w:4,h:3}),[])
        compare(c.cellRect,{x:1,y:1,w:4,h:3})
    })
    await section("the corners of a headless cell rect are drawn", async function ()
    {
        t = new ttio({headless:true,input:false,cols:20,rows:6})
        s = new screen(t)
        c = new cells(s)
        c.layout(2,1,10,4)
        c.draw_cell_rect({x:1,y:1,w:4,h:3})
        c.draw_cell_rect_corners()
        compare(s.get_char(3,2),'╭')
        compare(s.get_char(6,4),'╯')
        compare(s.get_char(4,2),' ')
    })
    await section("corners outside the cells are skipped", async function ()
    {
        t = new ttio({headless:true,input:false,cols:20,rows:6})
        s = new screen(t)
        c = new cells(s)
        c.layout(2,1,10,4)
        c.draw_cell_rect({x:-1,y:0,w:3,h:2})
        c.draw_cell_rect_corners()
        compare(s.get_char(3,2),'╯')
        compare(s.get_char(1,1),' ')
    })
    await section("del clears the cell rect", async function ()
    {
        t = new ttio({headless:true,input:false,cols:20,rows:6})
        s = new screen(t)
        c = new cells(s)
        c.layout(2,1,10,4)
        c.draw_cell_rect({x:1,y:1,w:4,h:3})
        c.del_cell_rect([])
        exists = (c.cellRect != null)
        compare(exists,false)
        c.draw_cell_rect_corners()
        compare(s.get_char(3,2),' ')
    })
}
toExport["cells"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY2VsbHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQVUsVUFBQTtJQUFNOztPQUNLLGFBQVI7T0FBZSxXQUFmO09BQW9CLFlBQXBCOzs7Ozs7UUFNTCxRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU0sTUFBTSxLQUFLLEdBQUcsS0FBSztRQUNwRCxRQUFRLE9BQU87UUFDZixRQUFRLE1BQU07UUFDZCxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7Z0JBRWhCLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRWhDLEVBQUUsVUFBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7O1FBSTVCLFFBQVEsTUFBSyxTQUFTLEtBQUssTUFBTSxNQUFNLEtBQUssR0FBRyxLQUFLO1FBQ3BELFFBQVEsT0FBTztRQUNmLFFBQVEsTUFBTTtRQUNkLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUVoQixFQUFFLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2hDLEVBQUU7Z0JBRUYsRUFBRSxTQUFTLEVBQUUsR0FBSztnQkFDbEIsRUFBRSxTQUFTLEVBQUUsR0FBSztnQkFDbEIsRUFBRSxTQUFTLEVBQUUsR0FBSzs7OztRQUlsQixRQUFRLE1BQUssU0FBUyxLQUFLLE1BQU0sTUFBTSxLQUFLLEdBQUcsS0FBSztRQUNwRCxRQUFRLE9BQU87UUFDZixRQUFRLE1BQU07UUFDZCxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFFaEIsRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNqQyxFQUFFO2dCQUVGLEVBQUUsU0FBUyxFQUFFLEdBQUs7Z0JBQ2xCLEVBQUUsU0FBUyxFQUFFLEdBQUs7Ozs7UUFJbEIsUUFBUSxNQUFLLFNBQVMsS0FBSyxNQUFNLE1BQU0sS0FBSyxHQUFHLEtBQUs7UUFDcEQsUUFBUSxPQUFPO1FBQ2YsUUFBUSxNQUFNO1FBQ2QsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBRWhCLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDaEMsRUFBRTtRQUVGLFVBQVMsRUFBRTtnQkFDWCxPQUFTO1FBRVQsRUFBRTtnQkFFRixFQUFFLFNBQVMsRUFBRSxHQUFLIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/cells.kode
