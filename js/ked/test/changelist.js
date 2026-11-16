var toExport = {}
var c, y

import changelist from "../edit/tool/changelist.js"

toExport["changelist"] = async function ()
{
    await section("an empty change list has no older or newer position", async function ()
    {
        c = new changelist
        compare(c.older(),null)
        compare(c.newer(),null)
    })
    await section("g; starts at the newest change", async function ()
    {
        c = new changelist
        c.record([0,0])
        compare(c.older(),[0,0])
        compare(c.older(),null)
    })
    await section("changes are walked backwards and forwards", async function ()
    {
        c = new changelist
        c.record([0,0])
        c.record([0,1])
        c.record([0,2])
        compare(c.older(),[0,2])
        compare(c.older(),[0,1])
        compare(c.older(),[0,0])
        compare(c.older(),null)
        compare(c.newer(),[0,1])
        compare(c.newer(),[0,2])
        compare(c.newer(),null)
    })
    await section("close changes on the same line keep only the last position", async function ()
    {
        c = new changelist
        c.record([10,0])
        c.record([20,0])
        compare(c.entries.length,1)
        compare(c.entries[0],[20,0])
    })
    await section("changes far apart on the same line are kept", async function ()
    {
        c = new changelist
        c.record([10,0])
        c.record([95,0])
        compare(c.entries.length,2)
    })
    await section("only the newest 100 changes are kept", async function ()
    {
        c = new changelist
        for (y = 1; y <= 105; y++)
        {
            c.record([0,y])
        }
        compare(c.entries.length,100)
        compare(c.entries[0][1],6)
        compare(c.entries.slice(-1)[0][1],105)
    })
    await section("reset forgets the changes", async function ()
    {
        c = new changelist
        c.record([0,0])
        c.reset()
        compare(c.entries.length,0)
        compare(c.older(),null)
    })
}
toExport["changelist"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlbGlzdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9jaGFuZ2VsaXN0LmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUFtQixpQkFBUDs7Ozs7O1FBTUosUUFBUTtnQkFFUixFQUFFLFFBQVU7Z0JBQ1osRUFBRSxRQUFVOzs7O1FBSVosUUFBUTtRQUVSLEVBQUUsUUFBUSxFQUFFO2dCQUVaLEVBQUUsU0FBVyxFQUFFO2dCQUNmLEVBQUUsUUFBVTs7OztRQUlaLFFBQVE7UUFFUixFQUFFLFFBQVEsRUFBRTtRQUNaLEVBQUUsUUFBUSxFQUFFO1FBQ1osRUFBRSxRQUFRLEVBQUU7Z0JBRVosRUFBRSxTQUFXLEVBQUU7Z0JBQ2YsRUFBRSxTQUFXLEVBQUU7Z0JBQ2YsRUFBRSxTQUFXLEVBQUU7Z0JBQ2YsRUFBRSxRQUFVO2dCQUVaLEVBQUUsU0FBVyxFQUFFO2dCQUNmLEVBQUUsU0FBVyxFQUFFO2dCQUNmLEVBQUUsUUFBVTs7OztRQUlaLFFBQVE7UUFFUixFQUFFLFFBQVEsR0FBRztRQUNiLEVBQUUsUUFBUSxHQUFHO2dCQUViLEVBQUUsUUFBUSxPQUFTO2dCQUNuQixFQUFFLFFBQVEsSUFBVSxHQUFHOzs7O1FBSXZCLFFBQVE7UUFFUixFQUFFLFFBQVEsR0FBRztRQUNiLEVBQUUsUUFBUSxHQUFHO2dCQUViLEVBQUUsUUFBUSxPQUFTOzs7O1FBSW5CLFFBQVE7YUFFSixJQUFLLFFBQUc7O1lBQ1IsRUFBRSxRQUFRLEVBQUU7O2dCQUVoQixFQUFFLFFBQVEsT0FBUztnQkFDbkIsRUFBRSxRQUFRLEdBQUcsR0FBTTtnQkFDbkIsRUFBRSxxQkFBWSxHQUFLOzs7O1FBSW5CLFFBQVE7UUFFUixFQUFFLFFBQVEsRUFBRTtRQUVaLEVBQUU7Z0JBRUYsRUFBRSxRQUFRLE9BQVM7Z0JBQ25CLEVBQUUsUUFBaUIifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/changelist.kode
