var toExport = {}
var h, p

import harness from "../util/harness.js"

import palette from "../view/base/palette.js"

toExport["palette"] = async function ()
{
    await section("a cell shows its color", async function ()
    {
        h = new harness({cols:20,rows:2})
        p = new palette(h.screen,'test_palette')
        p.layout(0,0,20,1)
        p.setColors(['#ff0000','#00ff00'])
        p.draw()
        compare(h.screen.get_bg(5,0),[255,0,0])
        compare(h.screen.get_bg(15,0),[0,255,0])
    })
    await section("a wide cell shows its hex value", async function ()
    {
        h = new harness({cols:40,rows:2})
        p = new palette(h.screen,'test_palette')
        p.layout(0,0,40,1)
        p.setColors(['#ff0000','#00ff00'])
        p.draw()
        compare(h.row(0).includes('#ff0000'),true)
        compare(h.row(0).includes('#00ff00'),true)
    })
    await section("a narrow cell shows no hex value", async function ()
    {
        h = new harness({cols:10,rows:2})
        p = new palette(h.screen,'test_palette')
        p.layout(0,0,10,1)
        p.setColors(['#ff0000','#00ff00'])
        p.draw()
        compare(h.row(0).includes('#ff0000'),false)
        compare(h.row(0).includes('#00ff00'),false)
    })
    await section("the focused cell is marked", async function ()
    {
        h = new harness({cols:20,rows:2})
        p = new palette(h.screen,'test_palette')
        p.layout(0,0,20,1)
        p.setColors(['#ff0000','#00ff00'])
        p.setActive(0)
        p.grabFocus()
        p.draw()
        compare(h.row(0).includes('●#ff0000●'),true)
    })
    await section("the palette has rounded edges", async function ()
    {
        h = new harness({cols:20,rows:2})
        p = new palette(h.screen,'test_palette')
        p.layout(0,0,20,1)
        p.setColors(['#ff0000'])
        p.draw()
        compare(h.screen.get_char(0,0),'◖')
        compare(h.screen.get_char(19,0),'◗')
    })
    await section("an empty palette has no cells", async function ()
    {
        h = new harness({cols:20,rows:2})
        p = new palette(h.screen,'test_palette')
        p.layout(0,0,20,1)
        p.setColors([])
        p.draw()
        compare(p.options.length,0)
        compare(h.screen.get_bg(0,0),[])
    })
}
toExport["palette"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFsZXR0ZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9wYWxldHRlLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNtQixjQUFaOztPQUNZLGNBQVA7Ozs7OztRQU1KLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLFFBQVEsRUFBRSxPQUFPO1FBRXpCLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztRQUNoQixFQUFFLFdBQVcsVUFBVTtRQUN2QixFQUFFO2dCQUVGLEVBQUUsT0FBTyxPQUFPLEVBQUUsSUFBTSxJQUFJLEVBQUU7Z0JBQzlCLEVBQUUsT0FBTyxPQUFPLEdBQUcsSUFBTSxFQUFFLElBQUk7Ozs7UUFJL0IsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsUUFBUSxFQUFFLE9BQU87UUFFekIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsV0FBVyxVQUFVO1FBQ3ZCLEVBQUU7Z0JBRUYsRUFBRSxJQUFJLEdBQUcsU0FBUyxXQUFhO2dCQUMvQixFQUFFLElBQUksR0FBRyxTQUFTLFdBQWE7Ozs7UUFJL0IsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsUUFBUSxFQUFFLE9BQU87UUFFekIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsV0FBVyxVQUFVO1FBQ3ZCLEVBQUU7Z0JBRUYsRUFBRSxJQUFJLEdBQUcsU0FBUyxXQUFhO2dCQUMvQixFQUFFLElBQUksR0FBRyxTQUFTLFdBQWE7Ozs7UUFJL0IsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsUUFBUSxFQUFFLE9BQU87UUFFekIsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ2hCLEVBQUUsV0FBVyxVQUFVO1FBQ3ZCLEVBQUUsVUFBVTtRQUNaLEVBQUU7UUFDRixFQUFFO2dCQUVGLEVBQUUsSUFBSSxHQUFHLFNBQVMsYUFBZTs7OztRQUlqQyxRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxRQUFRLEVBQUUsT0FBTztRQUV6QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRSxXQUFXO1FBQ2IsRUFBRTtnQkFFRixFQUFFLE9BQU8sU0FBUyxFQUFFLEdBQUs7Z0JBQ3pCLEVBQUUsT0FBTyxTQUFTLEdBQUcsR0FBSzs7OztRQUkxQixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxRQUFRLEVBQUUsT0FBTztRQUV6QixFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDaEIsRUFBRTtRQUNGLEVBQUU7Z0JBRUYsRUFBRSxRQUFRLE9BQVM7Z0JBQ25CLEVBQUUsT0FBTyxPQUFPLEVBQUUifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/palette.kode
