var toExport = {}
var c, cell, exists, s, _24_27_

import kxk from "../../kxk.js"
let post = kxk.post

import screen from "../view/screen/screen.js"
import ttio from "../view/screen/ttio.js"
import cells from "../view/screen/cells.js"


cell = function ()
{
    var c, s, t

    t = new ttio({headless:true,input:false,cols:20,rows:6})
    s = new screen(t)
    c = new cells(s)
    c.layout(2,1,10,4)
    return [s,c]
}
toExport["cells"] = async function ()
{
    await section("rect", async function ()
    {
        var _a_ = cell(); s = _a_[0]; c = _a_[1]

        compare(c.draw_cell_rect({x:1,y:1,w:4,h:3}),[])
        compare(c.cellRect,{x:1,y:1,w:4,h:3})
        c.del_cell_rect([])
        exists = (c.cellRect != null)
        compare(exists,false)
        c.draw_cell_rect_corners()
        compare(s.get_char(3,2),' ')
    })
    await section("corners", async function ()
    {
        var _b_ = cell(); s = _b_[0]; c = _b_[1]

        c.draw_cell_rect({x:1,y:1,w:4,h:3})
        c.draw_cell_rect_corners()
        compare(s.get_char(3,2),'╭')
        compare(s.get_char(6,4),'╯')
        compare(s.get_char(4,2),' ')
        var _c_ = cell(); s = _c_[0]; c = _c_[1]

        c.draw_cell_rect({x:-1,y:0,w:3,h:2})
        c.draw_cell_rect_corners()
        compare(s.get_char(3,2),'╯')
        compare(s.get_char(1,1),' ')
    })
}
toExport["cells"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvY2VsbHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ1UsVUFBQTtJQUFNOztPQUNLLGFBQVI7T0FBZSxXQUFmO09BQW9CLFlBQXBCOzs7QUFFYjs7OztJQUNJLFFBQVEsTUFBSyxTQUFTLEtBQUssTUFBTSxNQUFNLEtBQUssR0FBRyxLQUFLO0lBQ3BELFFBQVEsT0FBTztJQUNmLFFBQVEsTUFBTTtJQUNkLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztZQUNmLEVBQUU7Ozs7OztrQkFNUyxRQUFQLFlBQUU7O2dCQUVILEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBRWhDLEVBQUUsVUFBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBRTVCLEVBQUU7UUFFRixVQUFTLEVBQUU7Z0JBQ1gsT0FBUztRQUVULEVBQUU7Z0JBRUYsRUFBRSxTQUFTLEVBQUUsR0FBSzs7OztrQkFJVixRQUFQLFlBQUU7O1FBRUgsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNoQyxFQUFFO2dCQUVGLEVBQUUsU0FBUyxFQUFFLEdBQUs7Z0JBQ2xCLEVBQUUsU0FBUyxFQUFFLEdBQUs7Z0JBQ2xCLEVBQUUsU0FBUyxFQUFFLEdBQUs7a0JBRVYsUUFBUCxZQUFFOztRQUVILEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDakMsRUFBRTtnQkFFRixFQUFFLFNBQVMsRUFBRSxHQUFLO2dCQUNsQixFQUFFLFNBQVMsRUFBRSxHQUFLIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/cells.kode
