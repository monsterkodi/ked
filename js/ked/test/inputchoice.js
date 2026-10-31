var toExport = {}
var h, ic

import harness from "../util/harness.js"

import inputchoice from "../view/menu/inputchoice.js"

toExport["inputchoice"] = async function ()
{
    await section("down after filtering moves the selection one line", async function ()
    {
        h = new harness
        ic = new inputchoice(h.screen,'test_inputchoice')
        ic.choices.set(['one','two','three','four'])
        ic.show()
        h.focus(ic.input)
        h.type(ic.input,'o')
        compare(ic.choices.currentIndex(),0)
        h.key(ic,'down')
        compare(ic.choices.currentIndex(),1)
    })
}
toExport["inputchoice"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRjaG9pY2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvaW5wdXRjaG9pY2Uua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ21CLGNBQVo7O09BQ1ksa0JBQU47Ozs7OztRQU1MLFFBQVE7UUFFUixTQUFTLFlBQVksRUFBRSxPQUFPO1FBRTlCLEdBQUcsUUFBUSxLQUFLLE1BQU0sTUFBTSxRQUFRO1FBRXBDLEdBQUc7UUFFSCxFQUFFLE1BQU0sR0FBRztRQUNYLEVBQUUsS0FBSyxHQUFHLE1BQU07Z0JBRWhCLEdBQUcsUUFBUSxlQUFpQjtRQUU1QixFQUFFLElBQUksR0FBRztnQkFFVCxHQUFHLFFBQVEsZUFBaUIifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/inputchoice.kode
