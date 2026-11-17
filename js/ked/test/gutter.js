var toExport = {}
var add, again, back, block, blocks, del, diff, e, entry, key, lines, mod, move, moved, press, reverted, setup, text, withNew

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import editor from "../edit/editor.js"

import harness from "../util/harness.js"
import gitblock from "../util/gitblock.js"


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

key = function (e, combo)
{
    var event

    e.grabFocus()
    event = {type:'press',combo:combo,char:''}
    return e.onKey(combo,event)
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
    await section("a click puts the cursor on the first line of the resulting block", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B1','B2','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,old:['b'],new:['B1','B2']}]})
        press(e,2)
        compare(text(e),'aa\nb\ncc')
        compare(e.state.mainCursor(),[0,1])
        press(e,1)
        compare(text(e),'aa\nB1\nB2\ncc')
        compare(e.state.mainCursor(),[0,1])
    })
    await section("a click on a reverted addition puts the cursor above the gap", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','X','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,new:['X']}]})
        press(e,1)
        compare(text(e),'aa\ncc')
        compare(e.state.mainCursor(),[0,0])
    })
    await section("alt+g toggles the block at the main cursor", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,old:['b'],new:['B']}]})
        e.state.setMainCursor(0,1)
        key(e,'alt+g')
        compare(text(e),'aa\nb\ncc')
        compare(e.state.mainCursor(),[0,1])
        compare(e.gutter.entries.length,1)
        key(e,'alt+g')
        compare(text(e),'aa\nB\ncc')
        compare(e.gutter.entries.length,0)
    })
    await section("repeated alt+g keeps toggling the same block", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B','cc'])
        e.gutter.onGitDiff({file:'test.txt',changes:[{line:2,old:['b'],new:['B']}]})
        e.state.setMainCursor(0,1)
        key(e,'alt+g')
        key(e,'alt+g')
        key(e,'alt+g')
        compare(text(e),'aa\nb\ncc')
        compare(e.state.mainCursor(),[0,1])
        compare(e.gutter.entries.length,1)
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
toExport["gitblock"] = async function ()
{
    await section("a modified line becomes one block", async function ()
    {
        blocks = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']}]})
        compare(blocks.length,1)
        compare(blocks[0].start,1)
        compare(blocks[0].end,2)
        compare(blocks[0].marks,{'1':'mod'})
    })
    await section("an added line becomes one block", async function ()
    {
        blocks = gitblock.fromDiff({changes:[{line:2,new:['X']}]})
        compare(blocks.length,1)
        compare(blocks[0].start,1)
        compare(blocks[0].end,2)
        compare(blocks[0].marks,{'1':'add'})
    })
    await section("a deleted line is marked on the line above the gap", async function ()
    {
        blocks = gitblock.fromDiff({changes:[{line:2,old:['X']}]})
        compare(blocks.length,1)
        compare(blocks[0].start,2)
        compare(blocks[0].end,2)
        compare(blocks[0].marks,{'1':'del'})
    })
    await section("modified lines followed by deletions are one block", async function ()
    {
        blocks = gitblock.fromDiff({changes:[{line:2,old:['b','x','y'],new:['B']}]})
        compare(blocks.length,1)
        compare(blocks[0].end,2)
        compare(blocks[0].marks,{'1':'mod'})
    })
    await section("adjacent changes are one block", async function ()
    {
        blocks = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']},{line:3,old:['c'],new:['C']}]})
        compare(blocks.length,1)
        compare(blocks[0].marks,{'1':'mod','2':'mod'})
    })
    await section("one unchanged line separates blocks", async function ()
    {
        blocks = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']},{line:4,old:['d'],new:['D']}]})
        compare(blocks.length,2)
        compare(blocks[0].marks,{'1':'mod'})
        compare(blocks[1].marks,{'3':'mod'})
    })
    await section("a deletion directly after a change joins its block", async function ()
    {
        blocks = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']},{line:2,old:['x']}]})
        compare(blocks.length,1)
        compare(blocks[0].end,2)
    })
    await section("deletions around one unchanged line join their block", async function ()
    {
        blocks = gitblock.fromDiff({changes:[{line:1,old:['b']},{line:2,old:['c']}]})
        compare(blocks.length,1)
        compare(blocks[0].start,1)
        compare(blocks[0].end,2)
    })
    await section("reverting a modification restores the committed line", async function ()
    {
        lines = ['a','B','c']
        block = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']}]})[0]
        entry = gitblock.revert(block,lines)
        compare(gitblock.applyRevert(entry,lines),['a','b','c'])
        compare(gitblock.applyRestore(entry,(gitblock.applyRevert(entry,lines))),['a','B','c'])
    })
    await section("reverting an addition removes its lines and restoring re-adds them", async function ()
    {
        lines = ['a','X','b']
        block = gitblock.fromDiff({changes:[{line:2,new:['X']}]})[0]
        entry = gitblock.revert(block,lines)
        compare(gitblock.applyRevert(entry,lines),['a','b'])
        compare(gitblock.applyRestore(entry,(gitblock.applyRevert(entry,lines))),['a','X','b'])
    })
    await section("reverting a deletion inserts its lines and restoring removes them", async function ()
    {
        lines = ['a','b']
        block = gitblock.fromDiff({changes:[{line:1,old:['X']}]})[0]
        entry = gitblock.revert(block,lines)
        compare(gitblock.applyRevert(entry,lines),['a','X','b'])
        compare(gitblock.applyRestore(entry,(gitblock.applyRevert(entry,lines))),['a','b'])
    })
    await section("reverting a block with a gap keeps the line between the hunks", async function ()
    {
        lines = ['a','X','d']
        blocks = gitblock.fromDiff({changes:[{line:1,old:['b']},{line:2,old:['c']}]})
        entry = gitblock.revert(blocks[0],lines)
        compare(gitblock.applyRevert(entry,lines),['a','b','X','c','d'])
        compare(gitblock.applyRestore(entry,(gitblock.applyRevert(entry,lines))),['a','X','d'])
    })
    await section("a stale block cannot be reverted", async function ()
    {
        block = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']}]})[0]
        compare(gitblock.revert(block,['a','Z','c']),null)
    })
    await section("the first line of a block is its first displayed line", async function ()
    {
        mod = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']}]})[0]
        add = gitblock.fromDiff({changes:[{line:2,new:['X']}]})[0]
        del = gitblock.fromDiff({changes:[{line:2,old:['X']}]})[0]
        compare(gitblock.firstLine(mod),1)
        compare(gitblock.firstLine(add),1)
        compare(gitblock.firstLine(del),1)
    })
    await section("the first line of a reverted addition is the line above the gap", async function ()
    {
        block = gitblock.fromDiff({changes:[{line:2,new:['X']}]})[0]
        entry = gitblock.revert(block,['a','X','b'])
        compare(gitblock.firstLine(entry),0)
    })
    await section("an entry moves with lines inserted above it", async function ()
    {
        lines = ['a','B','c']
        block = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']}]})[0]
        entry = gitblock.revert(block,lines)
        reverted = gitblock.applyRevert(entry,lines)
        withNew = ['new'].concat(reverted)
        moved = gitblock.reanchorEntry(entry,withNew)
        compare(moved.start,2)
        compare(moved.ops[0].oldStart,2)
    })
    await section("a reverted entry becomes a block again when its revert is undone", async function ()
    {
        lines = ['a','B','c']
        block = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']}]})[0]
        entry = gitblock.revert(block,lines)
        reverted = gitblock.applyRevert(entry,lines)
        back = gitblock.applyRestore(entry,reverted)
        again = gitblock.undoneBlock(entry,back)
        compare(again.start,1)
        compare(again.marks,{'1':'mod'})
    })
    await section("a reverted deletion becomes a block again when its revert is undone", async function ()
    {
        lines = ['a','b']
        block = gitblock.fromDiff({changes:[{line:1,old:['X']}]})[0]
        entry = gitblock.revert(block,lines)
        reverted = gitblock.applyRevert(entry,lines)
        back = gitblock.applyRestore(entry,reverted)
        again = gitblock.undoneBlock(entry,back)
        compare(again.start,1)
        compare(again.marks,{'0':'del'})
    })
}
toExport["gitblock"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3V0dGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2d1dHRlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBVSxVQUFBO0lBQU07O09BQ0EsYUFBVDs7T0FDUyxjQUFUO09BQWlCLGVBQWpCOzs7QUFFUDs7OztJQUVJLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPLGVBQWU7SUFDdkMsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1dBQ2hCOzs7QUFFSixrQkFBUyxHQUFFOztXQUVQLEVBQUUsU0FDRSxLQUFRLFFBQ1IsTUFBUyxFQUFFLE1BQ1gsT0FBUSxPQUNSLE1BQVEsRUFDUixJQUFROzs7QUFFaEIsaUJBQVEsR0FBRTs7V0FFTixFQUFFLFNBQ0UsS0FBTSxPQUNOLE1BQU8sRUFBRSxNQUNULElBQU07OztBQUVkLGdCQUFPLEdBQUU7Ozs7SUFFTCxFQUFFO0lBRUYsU0FDSSxLQUFPLFFBQ1AsTUFBTyxNQUNQLEtBQU87V0FFWCxFQUFFLE1BQU0sTUFBTTs7O0FBRWxCLGlCQUFROztXQUFNLEtBQUssSUFBSSxFQUFFLE1BQU07Ozs7OztRQU12QixJQUFJO1FBRUosRUFBRSxNQUFNLFdBQVcsS0FBSyxJQUFJO1FBQzVCLEVBQUUsT0FBTyxXQUNMLEtBQVMsV0FDVCxVQUFXLEtBQUssRUFBRSxLQUFLLEtBQUssS0FBSztRQUVyQyxNQUFNLEVBQUU7Z0JBRVIsS0FBSyxHQUFLO2dCQUNWLEVBQUUsT0FBTyxRQUFRLE9BQVM7UUFFMUIsTUFBTSxFQUFFO2dCQUVSLEtBQUssR0FBSztnQkFDVixFQUFFLE9BQU8sUUFBUSxPQUFTOzs7O1FBSTFCLElBQUk7UUFFSixFQUFFLE1BQU0sV0FBVyxLQUFLLElBQUk7UUFDNUIsRUFBRSxPQUFPLFdBQ0wsS0FBUyxXQUNULFVBQVcsS0FBSyxFQUFFLEtBQUssS0FBSyxLQUFLO1FBRXJDLEVBQUUsU0FDRSxLQUFRLFFBQ1IsTUFBUyxFQUFFLEdBQ1gsT0FBUSxPQUNSLE1BQVE7Z0JBRVosS0FBSyxHQUFLO2dCQUNWLEVBQUUsT0FBTyxRQUFRLE9BQVM7Ozs7UUFJMUIsSUFBSTtRQUVKLEVBQUUsTUFBTSxXQUFXLEtBQUssS0FBSyxLQUFLO1FBQ2xDLEVBQUUsT0FBTyxXQUNMLEtBQVMsV0FDVCxVQUFXLEtBQUssRUFBRSxLQUFLLEtBQUssS0FBSyxLQUFLO1FBRTFDLE1BQU0sRUFBRTtnQkFFUixLQUFLLEdBQUs7Z0JBQ1YsRUFBRSxNQUFNLGNBQWdCLEVBQUU7UUFFMUIsTUFBTSxFQUFFO2dCQUVSLEtBQUssR0FBSztnQkFDVixFQUFFLE1BQU0sY0FBZ0IsRUFBRTs7OztRQUkxQixJQUFJO1FBRUosRUFBRSxNQUFNLFdBQVcsS0FBSyxJQUFJO1FBQzVCLEVBQUUsT0FBTyxXQUNMLEtBQVMsV0FDVCxVQUFXLEtBQUssRUFBRSxLQUFLO1FBRTNCLE1BQU0sRUFBRTtnQkFFUixLQUFLLEdBQUs7Z0JBQ1YsRUFBRSxNQUFNLGNBQWdCLEVBQUU7Ozs7UUFJMUIsSUFBSTtRQUVKLEVBQUUsTUFBTSxXQUFXLEtBQUssSUFBSTtRQUM1QixFQUFFLE9BQU8sV0FDTCxLQUFTLFdBQ1QsVUFBVyxLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUs7UUFFckMsRUFBRSxNQUFNLGNBQWMsRUFBRTtRQUV4QixJQUFJLEVBQUU7Z0JBRU4sS0FBSyxHQUFLO2dCQUNWLEVBQUUsTUFBTSxjQUFnQixFQUFFO2dCQUMxQixFQUFFLE9BQU8sUUFBUSxPQUFTO1FBRTFCLElBQUksRUFBRTtnQkFFTixLQUFLLEdBQUs7Z0JBQ1YsRUFBRSxPQUFPLFFBQVEsT0FBUzs7OztRQUkxQixJQUFJO1FBRUosRUFBRSxNQUFNLFdBQVcsS0FBSyxJQUFJO1FBQzVCLEVBQUUsT0FBTyxXQUNMLEtBQVMsV0FDVCxVQUFXLEtBQUssRUFBRSxLQUFLLEtBQUssS0FBSztRQUVyQyxFQUFFLE1BQU0sY0FBYyxFQUFFO1FBRXhCLElBQUksRUFBRTtRQUNOLElBQUksRUFBRTtRQUNOLElBQUksRUFBRTtnQkFFTixLQUFLLEdBQUs7Z0JBQ1YsRUFBRSxNQUFNLGNBQWdCLEVBQUU7Z0JBQzFCLEVBQUUsT0FBTyxRQUFRLE9BQVM7Ozs7UUFJMUIsSUFBSTtRQUVKLEVBQUUsTUFBTSxXQUFXLEtBQUs7UUFDeEIsRUFBRSxPQUFPLFdBQ0wsS0FBUyxXQUNULFVBQVcsS0FBSyxFQUFFLEtBQUs7UUFFM0IsTUFBTSxFQUFFO2dCQUVSLEtBQUssR0FBSztRQUVWLE1BQU0sRUFBRTtnQkFFUixLQUFLLEdBQUs7Ozs7UUFJVixJQUFJO1FBRUosRUFBRSxNQUFNLFdBQVcsS0FBSyxJQUFJLEtBQUs7UUFDakMsRUFBRSxPQUFPLFdBQ0wsS0FBUyxXQUNULFVBQ0ssS0FBSyxFQUFFLEtBQUssS0FBSyxLQUFLLE9BQ3RCLEtBQUssRUFBRSxLQUFLO2dCQUdyQixFQUFFLE9BQU8sT0FBTyxPQUFTO1FBRXpCLE1BQU0sRUFBRTtnQkFFUixLQUFLLEdBQUs7UUFFVixNQUFNLEVBQUU7Z0JBRVIsS0FBSyxHQUFLOzs7O1FBSVYsSUFBSTtRQUVKLEVBQUUsTUFBTSxXQUFXLEtBQUssSUFBSTtRQUM1QixFQUFFLE9BQU8sV0FDTCxLQUFTLFdBQ1QsVUFBVyxLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUs7UUFFckMsS0FBSyxFQUFFO2dCQUVQLEVBQUUsT0FBTyxXQUFhLEVBQUUsT0FBTyxPQUFPO1FBRXRDLEVBQUUsU0FDRSxLQUFNLE9BQ04sTUFBTyxFQUFFO2dCQUViLEVBQUUsT0FBTyxXQUFhOzs7O1FBSXRCLElBQUk7UUFFSixFQUFFLE1BQU0sV0FBVyxLQUFLLElBQUk7UUFDNUIsRUFBRSxPQUFPLFdBQ0wsS0FBUyxXQUNULFVBQVcsS0FBSyxFQUFFLEtBQUssS0FBSyxLQUFLO1FBRXJDLE1BQU0sRUFBRTtRQUVSLEVBQUUsTUFBTSxVQUFVLE1BQU0sS0FBSyxJQUFJO1FBRWpDLE1BQU0sRUFBRTtnQkFFUixLQUFLLEdBQUs7Ozs7UUFJVixJQUFJO1FBRUosRUFBRSxNQUFNLFdBQVcsS0FBSyxJQUFJO1FBQzVCLEVBQUUsT0FBTyxXQUNMLEtBQVMsV0FDVCxVQUFXLEtBQUssRUFBRSxLQUFLLEtBQUssS0FBSztRQUVyQyxNQUFNLEVBQUU7UUFDUixFQUFFLE1BQU07Z0JBRVIsRUFBRSxPQUFPLFFBQVEsT0FBUztnQkFDMUIsRUFBRSxPQUFPLE9BQU8sT0FBUztRQUV6QixNQUFNLEVBQUU7Z0JBRVIsS0FBSyxHQUFLOzs7O1FBSVYsSUFBSTtRQUVKLEVBQUUsTUFBTSxXQUFXLEtBQUssSUFBSTtRQUM1QixFQUFFLE9BQU8sV0FDTCxLQUFTLFdBQ1QsVUFBVyxLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUs7UUFFckMsTUFBTSxFQUFFO1FBQ1IsRUFBRSxNQUFNO1FBQ1IsRUFBRSxNQUFNO2dCQUVSLEVBQUUsT0FBTyxRQUFRLE9BQVM7Z0JBQzFCLEVBQUUsT0FBTyxPQUFPLE9BQVM7Z0JBQ3pCLEtBQUssR0FBSztRQUVWLE1BQU0sRUFBRTtnQkFFUixLQUFLLEdBQUs7Ozs7UUFJVixJQUFJO1FBRUosRUFBRSxNQUFNLFdBQVcsS0FBSyxJQUFJO1FBQzVCLEVBQUUsT0FBTyxXQUNMLEtBQVMsV0FDVCxVQUFXLEtBQUssRUFBRSxLQUFLO1FBRTNCLE1BQU0sRUFBRTtRQUNSLEVBQUUsTUFBTTtRQUNSLEVBQUUsTUFBTTtnQkFFUixFQUFFLE9BQU8sUUFBUSxPQUFTO2dCQUMxQixFQUFFLE9BQU8sT0FBTyxPQUFTO2dCQUN6QixLQUFLLEdBQUs7UUFFVixNQUFNLEVBQUU7Z0JBRVIsS0FBSyxHQUFLOzs7O1FBSVYsSUFBSTtRQUVKLEVBQUUsTUFBTSxXQUFXLEtBQUs7UUFDeEIsRUFBRSxPQUFPLFdBQ0wsS0FBUyxXQUNULFFBQVMsS0FDVCxVQUFXLEtBQUssRUFBRSxLQUFLLEtBQUssS0FBSztRQUVyQyxNQUFNLEVBQUU7Z0JBRVIsS0FBSyxHQUFLO2dCQUNWLEVBQUUsT0FBTyxRQUFRLE9BQVM7Ozs7UUFJMUIsSUFBSTtRQUVKLEVBQUUsTUFBTSxXQUFXLEtBQUssSUFBSSxLQUFLO1FBQ2pDLFFBQ0ksS0FBUyxXQUNULFVBQVcsS0FBSyxFQUFFLEtBQUssS0FBSyxLQUFLO1FBRXJDLEVBQUUsT0FBTyxVQUFVO1FBQ25CLE1BQU0sRUFBRTtRQUVSLEVBQUUsT0FBTyxVQUFVO2dCQUVuQixFQUFFLE9BQU8sT0FBTyxPQUFTO2dCQUN6QixFQUFFLE9BQU8sUUFBUSxPQUFTO1FBRTFCLE1BQU0sRUFBRTtnQkFFUixFQUFFLE9BQU8sUUFBUSxPQUFTO2dCQUMxQixFQUFFLE9BQU8sT0FBTyxPQUFTO2dCQUN6QixLQUFLLEdBQUs7Ozs7Ozs7O1FBTVYsU0FBUyxTQUFTLFVBQVMsVUFBVSxLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUs7Z0JBRTNELE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE1BQVE7Z0JBQ2xCLE9BQU8sR0FBRyxJQUFNO2dCQUNoQixPQUFPLEdBQUcsT0FBUyxJQUFJOzs7O1FBSXZCLFNBQVMsU0FBUyxVQUFTLFVBQVUsS0FBSyxFQUFFLEtBQUs7Z0JBRWpELE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE1BQVE7Z0JBQ2xCLE9BQU8sR0FBRyxJQUFNO2dCQUNoQixPQUFPLEdBQUcsT0FBUyxJQUFJOzs7O1FBSXZCLFNBQVMsU0FBUyxVQUFTLFVBQVUsS0FBSyxFQUFFLEtBQUs7Z0JBRWpELE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE1BQVE7Z0JBQ2xCLE9BQU8sR0FBRyxJQUFNO2dCQUNoQixPQUFPLEdBQUcsT0FBUyxJQUFJOzs7O1FBSXZCLFNBQVMsU0FBUyxVQUFTLFVBQVUsS0FBSyxFQUFFLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSztnQkFFbkUsT0FBTyxPQUFTO2dCQUNoQixPQUFPLEdBQUcsSUFBTTtnQkFDaEIsT0FBTyxHQUFHLE9BQVMsSUFBSTs7OztRQUl2QixTQUFTLFNBQVMsVUFBUyxVQUN0QixLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUssT0FDdEIsS0FBSyxFQUFFLEtBQUssS0FBSyxLQUFLO2dCQUczQixPQUFPLE9BQVM7Z0JBQ2hCLE9BQU8sR0FBRyxPQUFTLElBQUksTUFBTSxJQUFJOzs7O1FBSWpDLFNBQVMsU0FBUyxVQUFTLFVBQ3RCLEtBQUssRUFBRSxLQUFLLEtBQUssS0FBSyxPQUN0QixLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUs7Z0JBRzNCLE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE9BQVMsSUFBSTtnQkFDdkIsT0FBTyxHQUFHLE9BQVMsSUFBSTs7OztRQUl2QixTQUFTLFNBQVMsVUFBUyxVQUN0QixLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUssT0FDdEIsS0FBSyxFQUFFLEtBQUs7Z0JBR2pCLE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLElBQU07Ozs7UUFJaEIsU0FBUyxTQUFTLFVBQVMsVUFDdEIsS0FBSyxFQUFFLEtBQUssT0FDWixLQUFLLEVBQUUsS0FBSztnQkFHakIsT0FBTyxPQUFTO2dCQUNoQixPQUFPLEdBQUcsTUFBUTtnQkFDbEIsT0FBTyxHQUFHLElBQU07Ozs7UUFJaEIsU0FBUyxJQUFJLElBQUk7UUFDakIsUUFBUSxTQUFTLFVBQVMsVUFBVSxLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUssU0FBUTtRQUNsRSxRQUFRLFNBQVMsT0FBTyxNQUFNO2dCQUU5QixTQUFTLFlBQVksTUFBTSxRQUFTLElBQUksSUFBSTtnQkFDNUMsU0FBUyxhQUFhLE9BQU8sU0FBUyxZQUFZLE1BQU0sVUFBVyxJQUFJLElBQUk7Ozs7UUFJM0UsU0FBUyxJQUFJLElBQUk7UUFDakIsUUFBUSxTQUFTLFVBQVMsVUFBVSxLQUFLLEVBQUUsS0FBSyxTQUFRO1FBQ3hELFFBQVEsU0FBUyxPQUFPLE1BQU07Z0JBRTlCLFNBQVMsWUFBWSxNQUFNLFFBQVMsSUFBSTtnQkFDeEMsU0FBUyxhQUFhLE9BQU8sU0FBUyxZQUFZLE1BQU0sVUFBVyxJQUFJLElBQUk7Ozs7UUFJM0UsU0FBUyxJQUFJO1FBQ2IsUUFBUSxTQUFTLFVBQVMsVUFBVSxLQUFLLEVBQUUsS0FBSyxTQUFRO1FBQ3hELFFBQVEsU0FBUyxPQUFPLE1BQU07Z0JBRTlCLFNBQVMsWUFBWSxNQUFNLFFBQVMsSUFBSSxJQUFJO2dCQUM1QyxTQUFTLGFBQWEsT0FBTyxTQUFTLFlBQVksTUFBTSxVQUFXLElBQUk7Ozs7UUFJdkUsU0FBUyxJQUFJLElBQUk7UUFDakIsU0FBUyxTQUFTLFVBQVMsVUFDdEIsS0FBSyxFQUFFLEtBQUssT0FDWixLQUFLLEVBQUUsS0FBSztRQUVqQixRQUFRLFNBQVMsT0FBTyxPQUFPLEdBQUc7Z0JBRWxDLFNBQVMsWUFBWSxNQUFNLFFBQVMsSUFBSSxJQUFJLElBQUksSUFBSTtnQkFDcEQsU0FBUyxhQUFhLE9BQU8sU0FBUyxZQUFZLE1BQU0sVUFBVyxJQUFJLElBQUk7Ozs7UUFJM0UsUUFBUSxTQUFTLFVBQVMsVUFBVSxLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUssU0FBUTtnQkFFbEUsU0FBUyxPQUFPLE9BQU8sSUFBSSxJQUFJLE1BQU87Ozs7UUFJdEMsTUFBTSxTQUFTLFVBQVMsVUFBVSxLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUssU0FBUTtRQUNoRSxNQUFNLFNBQVMsVUFBUyxVQUFVLEtBQUssRUFBRSxLQUFLLFNBQVE7UUFDdEQsTUFBTSxTQUFTLFVBQVMsVUFBVSxLQUFLLEVBQUUsS0FBSyxTQUFRO2dCQUV0RCxTQUFTLFVBQVUsS0FBTztnQkFDMUIsU0FBUyxVQUFVLEtBQU87Z0JBQzFCLFNBQVMsVUFBVSxLQUFPOzs7O1FBSTFCLFFBQVEsU0FBUyxVQUFTLFVBQVUsS0FBSyxFQUFFLEtBQUssU0FBUTtRQUN4RCxRQUFRLFNBQVMsT0FBTyxPQUFPLElBQUksSUFBSTtnQkFFdkMsU0FBUyxVQUFVLE9BQVM7Ozs7UUFJNUIsU0FBUyxJQUFJLElBQUk7UUFDakIsUUFBUSxTQUFTLFVBQVMsVUFBVSxLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUssU0FBUTtRQUNsRSxRQUFRLFNBQVMsT0FBTyxNQUFNO1FBRTlCLFdBQVcsU0FBUyxZQUFZLE1BQU07UUFDdEMsV0FBWSxPQUFPLE9BQU87UUFDMUIsUUFBUSxTQUFTLGNBQWMsTUFBTTtnQkFFckMsTUFBTSxNQUFRO2dCQUNkLE1BQU0sSUFBSSxHQUFHLFNBQVc7Ozs7UUFJeEIsU0FBUyxJQUFJLElBQUk7UUFDakIsUUFBUSxTQUFTLFVBQVMsVUFBVSxLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUssU0FBUTtRQUNsRSxRQUFRLFNBQVMsT0FBTyxNQUFNO1FBRTlCLFdBQVcsU0FBUyxZQUFZLE1BQU07UUFDdEMsT0FBTyxTQUFTLGFBQWEsTUFBTTtRQUNuQyxRQUFRLFNBQVMsWUFBWSxNQUFNO2dCQUVuQyxNQUFNLE1BQVE7Z0JBQ2QsTUFBTSxPQUFTLElBQUk7Ozs7UUFJbkIsU0FBUyxJQUFJO1FBQ2IsUUFBUSxTQUFTLFVBQVMsVUFBVSxLQUFLLEVBQUUsS0FBSyxTQUFRO1FBQ3hELFFBQVEsU0FBUyxPQUFPLE1BQU07UUFFOUIsV0FBVyxTQUFTLFlBQVksTUFBTTtRQUN0QyxPQUFPLFNBQVMsYUFBYSxNQUFNO1FBQ25DLFFBQVEsU0FBUyxZQUFZLE1BQU07Z0JBRW5DLE1BQU0sTUFBUTtnQkFDZCxNQUFNLE9BQVMsSUFBSSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/gutter.kode
