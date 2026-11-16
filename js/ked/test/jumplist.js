var toExport = {}
var j, y

import jumplist from "../edit/tool/jumplist.js"

toExport["jumplist"] = async function ()
{
    await section("an empty jump list has no older or newer position", async function ()
    {
        j = new jumplist
        compare(j.older({file:'a',x:0,y:0}),null)
        compare(j.newer(),null)
    })
    await section("ctrl o goes to the position before the last jump", async function ()
    {
        j = new jumplist
        j.record({file:'a',x:1,y:1})
        compare(j.older({file:'a',x:2,y:2}),{file:'a',x:1,y:1})
        compare(j.newer(),{file:'a',x:2,y:2})
    })
    await section("jumps are walked backwards and forwards", async function ()
    {
        j = new jumplist
        j.record({file:'a',x:0,y:1})
        j.record({file:'a',x:0,y:2})
        j.record({file:'a',x:0,y:3})
        compare(j.older({file:'a',x:0,y:4}),{file:'a',x:0,y:3})
        compare(j.older({file:'a',x:0,y:3}),{file:'a',x:0,y:2})
        compare(j.older({file:'a',x:0,y:2}),{file:'a',x:0,y:1})
        compare(j.older({file:'a',x:0,y:1}),null)
        compare(j.newer(),{file:'a',x:0,y:2})
        compare(j.newer(),{file:'a',x:0,y:3})
        compare(j.newer(),{file:'a',x:0,y:4})
        compare(j.newer(),null)
    })
    await section("a jump from a newer position drops the positions after it", async function ()
    {
        j = new jumplist
        j.record({file:'a',x:0,y:1})
        j.record({file:'a',x:0,y:2})
        j.record({file:'a',x:0,y:3})
        compare(j.older({file:'a',x:0,y:4}),{file:'a',x:0,y:3})
        compare(j.older({file:'a',x:0,y:3}),{file:'a',x:0,y:2})
        j.record({file:'a',x:0,y:2})
        compare(j.older({file:'a',x:0,y:5}),{file:'a',x:0,y:2})
        compare(j.newer(),{file:'a',x:0,y:5})
        compare(j.newer(),null)
    })
    await section("positions on the same line are not repeated", async function ()
    {
        j = new jumplist
        j.record({file:'a',x:0,y:1})
        j.record({file:'a',x:3,y:1})
        compare(j.entries.length,1)
        compare(j.entries[0].x,3)
    })
    await section("different files on the same line are kept", async function ()
    {
        j = new jumplist
        j.record({file:'a',x:0,y:1})
        j.record({file:'b',x:0,y:1})
        compare(j.entries.length,2)
    })
    await section("only the newest 100 positions are kept", async function ()
    {
        j = new jumplist
        for (y = 1; y <= 105; y++)
        {
            j.record({file:'a',x:0,y:y})
        }
        compare(j.entries.length,100)
        compare(j.entries[0].y,6)
        compare(j.entries.slice(-1)[0].y,105)
    })
}
toExport["jumplist"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVtcGxpc3QuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvanVtcGxpc3Qua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQW1CLGVBQVA7Ozs7OztRQU1KLFFBQVE7Z0JBRVIsRUFBRSxPQUFPLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFLO2dCQUM3QixFQUFFLFFBQTJCOzs7O1FBSTdCLFFBQVE7UUFFUixFQUFFLFFBQVEsS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFO2dCQUV6QixFQUFFLE9BQU8sS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQU8sS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFO2dCQUM5QyxFQUFFLFNBQTZCLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRTs7OztRQUk5QyxRQUFRO1FBRVIsRUFBRSxRQUFRLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRTtRQUN6QixFQUFFLFFBQVEsS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFO1FBQ3pCLEVBQUUsUUFBUSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBRXpCLEVBQUUsT0FBTyxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBTyxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBQzlDLEVBQUUsT0FBTyxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBTyxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBQzlDLEVBQUUsT0FBTyxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBTyxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBQzlDLEVBQUUsT0FBTyxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBTTtnQkFFOUIsRUFBRSxTQUFXLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRTtnQkFDNUIsRUFBRSxTQUFXLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRTtnQkFDNUIsRUFBRSxTQUFXLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRTtnQkFDNUIsRUFBRSxRQUFVOzs7O1FBSVosUUFBUTtRQUVSLEVBQUUsUUFBUSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUU7UUFDekIsRUFBRSxRQUFRLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRTtRQUN6QixFQUFFLFFBQVEsS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFO2dCQUV6QixFQUFFLE9BQU8sS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQU8sS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFO2dCQUM5QyxFQUFFLE9BQU8sS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQU8sS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFO1FBRTlDLEVBQUUsUUFBUSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBRXpCLEVBQUUsT0FBTyxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBTyxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBQzlDLEVBQUUsU0FBNkIsS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFO2dCQUM5QyxFQUFFLFFBQTRCOzs7O1FBSTlCLFFBQVE7UUFFUixFQUFFLFFBQVEsS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFO1FBQ3pCLEVBQUUsUUFBUSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBRXpCLEVBQUUsUUFBUSxPQUFTO2dCQUNuQixFQUFFLFFBQVEsR0FBRyxFQUFNOzs7O1FBSW5CLFFBQVE7UUFFUixFQUFFLFFBQVEsS0FBSyxJQUFJLEVBQUUsRUFBRSxFQUFFO1FBQ3pCLEVBQUUsUUFBUSxLQUFLLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBRXpCLEVBQUUsUUFBUSxPQUFTOzs7O1FBSW5CLFFBQVE7YUFFSixJQUFLLFFBQUc7O1lBQ1IsRUFBRSxRQUFRLEtBQUssSUFBSSxFQUFFLEVBQUUsRUFBRTs7Z0JBRTdCLEVBQUUsUUFBUSxPQUFTO2dCQUNuQixFQUFFLFFBQVEsR0FBRyxFQUFNO2dCQUNuQixFQUFFLHFCQUFZLEVBQUsifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/jumplist.kode
