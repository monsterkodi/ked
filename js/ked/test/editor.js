var toExport = {}
var e, editorFor

import editor from "../edit/editor.js"

import color from "../theme/color.js"
import theme from "../theme/theme.js"

import harness from "../util/harness.js"


editorFor = function (lines)
{
    var e, h

    h = new harness({cols:30,rows:9})
    e = new editor(h.screen,'test_editor_syntax_color',[])
    e.state.syntax.ext = 'kode'
    e.state.loadLines(lines)
    return e
}
toExport["syntaxColorAtMainCursor"] = async function ()
{
    await section("uses the character left of the cursor", async function ()
    {
        e = editorFor(['class Foo'])
        e.state.setMainCursor(5,0)
        compare(e.syntaxColorAtMainCursor(),(color.hex(theme.syntax.keyword)))
    })
    await section("falls back to the character right of the cursor", async function ()
    {
        e = editorFor(['class Foo'])
        e.state.setMainCursor(0,0)
        compare(e.syntaxColorAtMainCursor(),(color.hex(theme.syntax.keyword)))
    })
    await section("returns null outside of the line", async function ()
    {
        e = editorFor(['class Foo'])
        e.state.setMainCursor(20,0)
        compare(e.syntaxColorAtMainCursor(),null)
    })
}
toExport["syntaxColorAtMainCursor"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2VkaXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FDZSxhQUFSOztPQUNRLFlBQVI7T0FBYyxZQUFkOztPQUNRLGNBQVI7OztBQUVQLHNCQUFZOzs7O0lBQ1IsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO0lBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU87SUFDeEIsRUFBRSxNQUFNLE9BQU8sTUFBTTtJQUNyQixFQUFFLE1BQU0sVUFBVTtXQUNsQjs7Ozs7O1FBTUksSUFBSSxXQUFXO1FBQ2YsRUFBRSxNQUFNLGNBQWMsRUFBRTtnQkFFeEIsRUFBRSwyQkFBNkIsTUFBTSxJQUFJLE1BQU0sT0FBTzs7OztRQUl0RCxJQUFJLFdBQVc7UUFDZixFQUFFLE1BQU0sY0FBYyxFQUFFO2dCQUV4QixFQUFFLDJCQUE2QixNQUFNLElBQUksTUFBTSxPQUFPOzs7O1FBSXRELElBQUksV0FBVztRQUNmLEVBQUUsTUFBTSxjQUFjLEdBQUc7Z0JBRXpCLEVBQUUsMEJBQTRCIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/editor.kode
