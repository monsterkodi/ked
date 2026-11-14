var toExport = {}
var diff, e, move, press, setup, text

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import editor from "../edit/editor.js"

import harness from "../util/harness.js"


setup = function ()
{
    var e, h

    h = new harness({cols:40,rows:10})
    e = new editor(h.screen,'test_gutter',['gutter'])
    e.layout(0,0,40,10)
    return e
}

press = function (e, line)
{
    return e.onMouse({type:'press',cell:[1,line],button:'left',count:1,cmd:true})
}

move = function (e, line)
{
    return e.onMouse({type:'move',cell:[1,line],cmd:true})
}

text = function (e)
{
    return kseg.str(e.state.segls)
}
toExport["gutter"] = async function ()
{
    await section("a modifier click reverts and restores a modified line", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,old:['b'],new:['B']}]})
        press(e,1)
        compare(text(e),'aa\nb\ncc')
        compare(e.gutter.entries.length,1)
        press(e,1)
        compare(text(e),'aa\nB\ncc')
        compare(e.gutter.entries.length,0)
    })
    await section("a click without a modifier changes nothing", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,old:['b'],new:['B']}]})
        e.onMouse({type:'press',cell:[1,1],button:'left',count:1})
        compare(text(e),'aa\nB\ncc')
        compare(e.gutter.entries.length,0)
    })
    await section("a click on the line above a deletion reverts the deletion", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:1,old:['bb']}]})
        press(e,0)
        compare(text(e),'aa\nbb\ncc')
        press(e,0)
        compare(text(e),'aa\ncc')
    })
    await section("a click reverts all changes of a visual block at once", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B','cc','dd'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,old:['b'],new:['B']},{line:2,old:['x']}]})
        compare(e.gutter.blocks.length,1)
        press(e,1)
        compare(text(e),'aa\nb\nx\ncc\ndd')
        press(e,1)
        compare(text(e),'aa\nB\ncc\ndd')
    })
    await section("modifier hover marks the block under the mouse", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,old:['b'],new:['B']}]})
        move(e,1)
        compare(e.gutter.hoverBlock,e.gutter.blocks[0])
        e.onMouse({type:'move',cell:[1,1]})
        compare(e.gutter.hoverBlock,null)
    })
    await section("a reverted block survives an edit above it", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,old:['b'],new:['B']}]})
        press(e,1)
        e.state.setLines(['new','aa','b','cc'])
        press(e,2)
        compare(text(e),'new\naa\nB\ncc')
    })
    await section("undoing a revert makes the block clickable again", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,old:['b'],new:['B']}]})
        press(e,1)
        e.state.undo()
        compare(e.gutter.entries.length,0)
        compare(e.gutter.blocks.length,1)
        press(e,1)
        compare(text(e),'aa\nb\ncc')
    })
    await section("redoing a revert shows the reverted block again", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,old:['b'],new:['B']}]})
        press(e,1)
        e.state.undo()
        e.state.redo()
        compare(e.gutter.entries.length,1)
        compare(e.gutter.blocks.length,0)
        compare(text(e),'aa\nb\ncc')
        press(e,1)
        compare(text(e),'aa\nB\ncc')
    })
    await section("redoing a revert of an addition shows the reverted block again", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','X','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,new:['X']}]})
        press(e,1)
        e.state.undo()
        e.state.redo()
        compare(e.gutter.entries.length,1)
        compare(e.gutter.blocks.length,0)
        compare(text(e),'aa\ncc')
        press(e,0)
        compare(text(e),'aa\nX\ncc')
    })
    await section("a new file has no revertable blocks", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B'])
        e.gutter.onGitDiff({file:'test.txt',newFile:true,changes:[{line:2,old:['b'],new:['B']}]})
        press(e,1)
        compare(text(e),'aa\nB')
        compare(e.gutter.entries.length,0)
    })
    await section("a diff refresh keeps a reverted block shadowed", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B','cc','dd'])
        diff = {file:'test.txt',changes:[{line:2,old:['b'],new:['B']}]}
        e.gutter.onGitDiff(diff)
        press(e,1)
        e.gutter.onGitDiff(diff)
        compare(e.gutter.blocks.length,0)
        compare(e.gutter.entries.length,1)
        press(e,1)
        compare(e.gutter.entries.length,0)
        compare(e.gutter.blocks.length,1)
        compare(text(e),'aa\nB\ncc\ndd')
    })
}
toExport["gutter"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3V0dGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2d1dHRlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBVSxVQUFBO0lBQU07O09BQ0EsYUFBVDs7T0FDUyxjQUFUOzs7QUFFUDs7OztJQUVJLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPLGVBQWU7SUFDdkMsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1dBQ2hCOzs7QUFFSixrQkFBUyxHQUFFOztXQUVQLEVBQUUsU0FDRSxLQUFRLFFBQ1IsTUFBUyxFQUFFLE1BQ1gsT0FBUSxPQUNSLE1BQVEsRUFDUixJQUFROzs7QUFFaEIsaUJBQVEsR0FBRTs7V0FFTixFQUFFLFNBQ0UsS0FBTSxPQUNOLE1BQU8sRUFBRSxNQUNULElBQU07OztBQUVkLGlCQUFROztXQUFNLEtBQUssSUFBSSxFQUFFLE1BQU07Ozs7OztRQU12QixJQUFJO1FBRUosRUFBRSxNQUFNLFdBQVcsS0FBSyxJQUFJO1FBQzVCLEVBQUUsT0FBTyxXQUNMLEtBQVMsV0FDVCxVQUFXLEtBQUssRUFBRSxLQUFLLEtBQUssS0FBSztRQUVyQyxNQUFNLEVBQUU7Z0JBRVIsS0FBSyxHQUFLO2dCQUNWLEVBQUUsT0FBTyxRQUFRLE9BQVM7UUFFMUIsTUFBTSxFQUFFO2dCQUVSLEtBQUssR0FBSztnQkFDVixFQUFFLE9BQU8sUUFBUSxPQUFTOzs7O1FBSTFCLElBQUk7UUFFSixFQUFFLE1BQU0sV0FBVyxLQUFLLElBQUk7UUFDNUIsRUFBRSxPQUFPLFdBQ0wsS0FBUyxXQUNULFVBQVcsS0FBSyxFQUFFLEtBQUssS0FBSyxLQUFLO1FBRXJDLEVBQUUsU0FDRSxLQUFRLFFBQ1IsTUFBUyxFQUFFLEdBQ1gsT0FBUSxPQUNSLE1BQVE7Z0JBRVosS0FBSyxHQUFLO2dCQUNWLEVBQUUsT0FBTyxRQUFRLE9BQVM7Ozs7UUFJMUIsSUFBSTtRQUVKLEVBQUUsTUFBTSxXQUFXLEtBQUs7UUFDeEIs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/gutter.kode
