var toExport = {}
var c, e, h, mk, x, y0, y1

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import theme from "../theme/theme.js"

import clippo from "../view/menu/clippo.js"


mk = function (history, current)
{
    var c, e, h, opt

    h = new harness({cols:80,rows:20})
    e = new editor(h.screen,'editor',[])
    e.cells.layout(0,0,80,20)
    e.state.loadLines(['start'])
    e.state.setMainCursor(0,0)
    opt = {watch:false,readClipboard:(function ()
    {
        return current
    })}
    c = new clippo(h.screen,e,'clippo',opt)
    c.history = history
    return [h,e,c]
}
toExport["clippo"] = async function ()
{
    await section("the current clipboard text is first and selected", async function ()
    {
        var _a_ = mk(['older','oldest'],'current'); h = _a_[0]; e = _a_[1]; c = _a_[2]

        c.show()
        compare(c.history,['current','older','oldest'])
        compare(c.choices.currentIndex(),0)
        compare(c.choices.hasFocus(),true)
        compare(c.choices.state.s.selections,[])
    })
    await section("a repeated clipboard text moves to the top", async function ()
    {
        var _b_ = mk(['old','current'],'current'); h = _b_[0]; e = _b_[1]; c = _b_[2]

        c.show()
        compare(c.history,['current','old'])
    })
    await section("history entries start with a divider line", async function ()
    {
        var _c_ = mk(['one\ntwo','old'],'new'); h = _c_[0]; e = _c_[1]; c = _c_[2]

        c.show()
        compare(c.choices.state.s.lines.map(function (line)
        {
            return kseg.str(line)
        }),['','new','','one','two','','old'])
        compare(c.dividerRows,[0,2,5])
        compare(c.entryStart,[0,2,5])
    })
    await section("history entries use the detected language for highlighting", async function ()
    {
        var _d_ = mk(['const greet = (name) => name',"use ../../kxk ▪ post"],'current'); h = _d_[0]; e = _d_[1]; c = _d_[2]

        c.show()
        compare(c.choices.state.syntax.getClasses(3)[0],'keyword')
    })
    await section("the selected divider is blue with a yellow circle", async function ()
    {
        var _e_ = mk(['new','old'],'new'); h = _e_[0]; e = _e_[1]; c = _e_[2]

        c.show()
        c.draw()
        y0 = c.choices.cells.y - c.choices.state.s.view[1] + c.entryStart[0]
        y1 = c.choices.cells.y - c.choices.state.s.view[1] + c.entryStart[1]
        x = c.choices.cells.x
        compare(h.screen.get_fg(x,y0),theme.cursor.main)
        compare(h.screen.get_fg(x + 2,y0),theme.selection.span)
        compare(h.screen.get_fg(x + 2,y1),theme.finder.frame)
        h.key(c,'down')
        c.draw()
        compare(h.screen.get_fg(x,y0),theme.finder.frame)
        compare(h.screen.get_fg(x + 2,y0),theme.finder.frame)
        compare(h.screen.get_fg(x,y1),theme.cursor.main)
        compare(h.screen.get_fg(x + 2,y1),theme.selection.span)
    })
    await section("down and up move between entries", async function ()
    {
        var _f_ = mk(['new','middle','old'],'new'); h = _f_[0]; e = _f_[1]; c = _f_[2]

        c.show()
        h.key(c,'down')
        compare(c.choices.currentIndex(),c.entryStart[1])
        h.key(c,'up')
        compare(c.choices.currentIndex(),c.entryStart[0])
        h.key(c,'alt+.')
        compare(c.choices.currentIndex(),c.entryStart[1])
        h.key(c,'alt+.')
        compare(c.choices.currentIndex(),c.entryStart[2])
        h.key(c,'alt+,')
        compare(c.choices.currentIndex(),c.entryStart[1])
    })
    await section("tab moves the focus between input and history", async function ()
    {
        var _10_ = mk(['one'],'one'); h = _10_[0]; e = _10_[1]; c = _10_[2]

        c.show()
        compare(c.choices.hasFocus(),true)
        h.key(c,'tab')
        compare(c.input.hasFocus(),true)
        h.key(c,'tab')
        compare(c.choices.hasFocus(),true)
    })
    await section("typing highlights matches and down and up select them", async function ()
    {
        var _11_ = mk(['alpha','beta','alphabet'],'gamma'); h = _11_[0]; e = _11_[1]; c = _11_[2]

        c.show()
        h.key(c,'tab')
        h.type(c,'alpha')
        compare(c.matchEntries,[1,3])
        compare(c.choices.currentIndex(),c.entryStart[1])
        h.key(c,'down')
        compare(c.choices.currentIndex(),c.entryStart[3])
        h.key(c,'up')
        compare(c.choices.currentIndex(),c.entryStart[1])
    })
    await section("return inserts the selected entry and closes", async function ()
    {
        var _12_ = mk(['hello'],'hello'); h = _12_[0]; e = _12_[1]; c = _12_[2]

        c.show()
        h.key(c,'return')
        compare(c.hidden(),true)
        compare(kseg.str(e.state.s.lines),'hellostart')
        compare(e.hasFocus(),true)
    })
    await section("space inserts the selected entry without closing", async function ()
    {
        var _13_ = mk(['hello'],'hello'); h = _13_[0]; e = _13_[1]; c = _13_[2]

        c.show()
        h.key(c,'space')
        compare(c.hidden(),false)
        compare(kseg.str(e.state.s.lines),'hellostart')
    })
    await section("return inserts the entry containing the selected match", async function ()
    {
        var _14_ = mk(['alpha','beta','alphabet'],'gamma'); h = _14_[0]; e = _14_[1]; c = _14_[2]

        c.show()
        h.key(c,'tab')
        h.type(c,'alpha')
        h.key(c,'down')
        h.key(c,'return')
        compare(c.hidden(),true)
        compare(kseg.str(e.state.s.lines),'alphabetstart')
    })
}
toExport["clippo"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcHBvLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2NsaXBwby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBVSxVQUFBO0lBQVM7O09BQ0EsYUFBWjs7T0FDWSxjQUFaOztPQUNZLFlBQVo7O09BQ1ksYUFBTjs7O0FBRWIsZUFBTSxTQUFROzs7O0lBQ1YsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO0lBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87SUFDeEIsRUFBRSxNQUFNLE9BQU8sRUFBRSxFQUFFLEdBQUc7SUFDdEIsRUFBRSxNQUFNLFdBQVc7SUFDbkIsRUFBRSxNQUFNLGNBQWMsRUFBRTtJQUN4QixPQUFNLE1BQU0sTUFBTTs7ZUFBa0I7O0lBQ3BDLFFBQVEsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTO0lBQ25DLEVBQUUsVUFBVTtZQUNYLEVBQUUsRUFBRTs7Ozs7O2tCQU1TLElBQUksUUFBUSxVQUFVLFlBQS9CLFlBQUUsWUFBRTs7UUFFTCxFQUFFO2dCQUVGLEVBQUUsU0FBVyxVQUFVLFFBQVE7Z0JBQy9CLEVBQUUsUUFBUSxlQUFpQjtnQkFDM0IsRUFBRSxRQUFRLFdBQWE7Z0JBQ3ZCLEVBQUUsUUFBUSxNQUFNLEVBQUU7Ozs7a0JBSVIsSUFBSSxNQUFNLFdBQVcsWUFBOUIsWUFBRSxZQUFFOztRQUVMLEVBQUU7Z0JBRUYsRUFBRSxTQUFXLFVBQVU7Ozs7a0JBSWIsSUFBSSxXQUFXLE9BQU8sUUFBL0IsWUFBRSxZQUFFOztRQUVMLEVBQUU7Z0JBRUYsRUFBRSxRQUFRLE1BQU0sRUFBRSxNQUFNLGNBQUs7O21CQUFTLEtBQUssSUFBSTtZQUFVLEdBQUcsTUFBTSxHQUFHLE1BQU0sTUFBTSxHQUFHO2dCQUNwRixFQUFFLGFBQWUsRUFBRSxFQUFFO2dCQUNyQixFQUFFLFlBQWUsRUFBRSxFQUFFOzs7O2tCQUlYLElBQUksK0JBQStCLHdCQUF3QixZQUFwRSxZQUFFLFlBQUU7O1FBRUwsRUFBRTtnQkFFRixFQUFFLFFBQVEsTUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/clippo.kode
