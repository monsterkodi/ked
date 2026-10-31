var toExport = {}
var h, r

import harness from "../util/harness.js"

import radio from "../view/base/radio.js"

toExport["radio"] = async function ()
{
    await section("a single option fills the row and shows its label", async function ()
    {
        h = new harness({cols:20,rows:2})
        r = new radio(h.screen,'test_radio')
        r.layout(0,0,20,1)
        r.setOptions([{color:[255,255,255],label:'#ffffff'}])
        r.draw()
        compare(h.row(0).includes('#ffffff'),true)
        compare(h.screen.get_char(0,0),'◖')
        compare(h.screen.get_char(19,0),'◗')
        compare(h.screen.get_bg(10,0),[255,255,255])
    })
    await section("only the active option shows a label", async function ()
    {
        h = new harness({cols:20,rows:2})
        r = new radio(h.screen,'test_radio')
        r.layout(0,0,20,1)
        r.setOptions([{color:[255,255,255],label:'#ffffff'},{color:[0,0,255],label:'#0000ff'}])
        r.draw()
        compare(h.row(0).includes('#ffffff'),true)
        compare(h.row(0).includes('#0000ff'),false)
        compare(h.screen.get_bg(2,0),[255,255,255])
        compare(h.screen.get_bg(17,0),[0,0,255])
        r.setActive(1)
        r.draw()
        compare(h.row(0).includes('#ffffff'),false)
        compare(h.row(0).includes('#0000ff'),true)
    })
    await section("the active label gets focus markers when they fit", async function ()
    {
        h = new harness({cols:20,rows:2})
        r = new radio(h.screen,'test_radio')
        r.layout(0,0,20,1)
        r.setOptions([{color:[255,255,255],label:'#ffffff'},{color:[0,0,255],label:'#0000ff'}])
        r.setActive(1)
        r.setFocused(true)
        r.draw()
        compare(h.row(0).includes('●#0000ff●'),true)
    })
    await section("focusability is controlled by the caller", async function ()
    {
        h = new harness({cols:20,rows:2})
        r = new radio(h.screen,'test_radio')
        compare(r.focusable,false)
        r.setFocusable(true)
        compare(r.focusable,true)
        compare(r.pointerType,'pointer')
        r.setFocusable(false)
        compare(r.pointerType,null)
    })
}
toExport["radio"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvcmFkaW8ua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ21CLGNBQVo7O09BQ1ksWUFBUDs7Ozs7O1FBTUosUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsTUFBTSxFQUFFLE9BQU87UUFFdkIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsYUFBYSxPQUFRLElBQUksSUFBSSxLQUFLLE1BQU87UUFDM0MsRUFBRTtnQkFFRixFQUFFLElBQUksR0FBRyxTQUFTLFdBQWE7Z0JBQy9CLEVBQUUsT0FBTyxTQUFTLEVBQUUsR0FBSztnQkFDekIsRUFBRSxPQUFPLFNBQVMsR0FBRyxHQUFLO2dCQUMxQixFQUFFLE9BQU8sT0FBTyxHQUFHLElBQU0sSUFBSSxJQUFJOzs7O1FBSWpDLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE1BQU0sRUFBRSxPQUFPO1FBRXZCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFLGFBQWEsT0FBUSxJQUFJLElBQUksS0FBSyxNQUFPLFlBQVksT0FBUSxFQUFFLEVBQUUsS0FBSyxNQUFPO1FBRS9FLEVBQUU7Z0JBRUYsRUFBRSxJQUFJLEdBQUcsU0FBUyxXQUFhO2dCQUMvQixFQUFFLElBQUksR0FBRyxTQUFTLFdBQWE7Z0JBQy9CLEVBQUUsT0FBTyxPQUFPLEVBQUUsSUFBTSxJQUFJLElBQUk7Z0JBQ2hDLEVBQUUsT0FBTyxPQUFPLEdBQUcsSUFBTSxFQUFFLEVBQUU7UUFFN0IsRUFBRSxVQUFVO1FBQ1osRUFBRTtnQkFFRixFQUFFLElBQUksR0FBRyxTQUFTLFdBQWE7Z0JBQy9CLEVBQUUsSUFBSSxHQUFHLFNBQVMsV0FBYTs7OztRQUkvQixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxNQUFNLEVBQUUsT0FBTztRQUV2QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRSxhQUFhLE9BQVEsSUFBSSxJQUFJLEtBQUssTUFBTyxZQUFZLE9BQVEsRUFBRSxFQUFFLEtBQUssTUFBTztRQUMvRSxFQUFFLFVBQVU7UUFDWixFQUFFLFdBQVc7UUFDYixFQUFFO2dCQUVGLEVBQUUsSUFBSSxHQUFHLFNBQVMsYUFBZTs7OztRQUlqQyxRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxNQUFNLEVBQUUsT0FBTztnQkFFdkIsRUFBRSxVQUFZO1FBQ2QsRUFBRSxhQUFhO2dCQUNmLEVBQUUsVUFBWTtnQkFDZCxFQUFFLFlBQWM7UUFDaEIsRUFBRSxhQUFhO2dCQUNmLEVBQUUsWUFBYyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/radio.kode
