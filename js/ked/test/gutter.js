var toExport = {}
var add, again, b, block, del, diff, diffed, e, entry, from, key, lines, mod, move, moved, press, restored, reverted, rv, setup, text, undone

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

diffed = function (lines, changes)
{
    var e

    e = setup()
    e.state.loadLines(lines)
    e.gutter.onGitDiff({file:'test.txt',changes:changes})
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
    await section("revert click", async function ()
    {
        e = diffed(['aa','B','cc'],[{line:2,old:['b'],new:['B']}])
        e.onMouse({type:'press',cell:[1,1],button:'left',count:1})
        compare(text(e),'aa\nB\ncc')
        compare(e.gutter.entries.length,0)
        press(e,1)
        compare(text(e),'aa\nb\ncc')
        compare(e.gutter.entries.length,1)
        press(e,1)
        compare(text(e),'aa\nB\ncc')
        compare(e.gutter.entries.length,0)
        e = diffed(['aa','cc'],[{line:1,old:['bb']}])
        press(e,0)
        compare(text(e),'aa\nbb\ncc')
        press(e,0)
        compare(text(e),'aa\ncc')
    })
    await section("block click", async function ()
    {
        e = diffed(['aa','B','cc','dd'],[{line:2,old:['b'],new:['B']},{line:2,old:['x']}])
        compare(e.gutter.blocks.length,1)
        press(e,1)
        compare(text(e),'aa\nb\nx\ncc\ndd')
        press(e,1)
        compare(text(e),'aa\nB\ncc\ndd')
    })
    await section("cursor after revert", async function ()
    {
        e = diffed(['aa','B1','B2','cc'],[{line:2,old:['b'],new:['B1','B2']}])
        press(e,2)
        compare(text(e),'aa\nb\ncc')
        compare(e.state.mainCursor(),[0,1])
        press(e,1)
        compare(text(e),'aa\nB1\nB2\ncc')
        compare(e.state.mainCursor(),[0,1])
        e = diffed(['aa','X','cc'],[{line:2,new:['X']}])
        press(e,1)
        compare(text(e),'aa\ncc')
        compare(e.state.mainCursor(),[0,0])
    })
    await section("alt+g", async function ()
    {
        e = diffed(['aa','B','cc'],[{line:2,old:['b'],new:['B']}])
        e.state.setMainCursor(0,1)
        key(e,'alt+g')
        compare(text(e),'aa\nb\ncc')
        compare(e.state.mainCursor(),[0,1])
        compare(e.gutter.entries.length,1)
        key(e,'alt+g')
        compare(text(e),'aa\nB\ncc')
        compare(e.gutter.entries.length,0)
        key(e,'alt+g')
        key(e,'alt+g')
        key(e,'alt+g')
        compare(text(e),'aa\nb\ncc')
        compare(e.state.mainCursor(),[0,1])
        compare(e.gutter.entries.length,1)
    })
    await section("hover", async function ()
    {
        e = diffed(['aa','B','cc'],[{line:2,old:['b'],new:['B']}])
        move(e,1)
        compare(e.gutter.hoverBlock,e.gutter.blocks[0])
        e.onMouse({type:'move',cell:[1,1]})
        compare(e.gutter.hoverBlock,null)
    })
    await section("survives edits", async function ()
    {
        e = diffed(['aa','B','cc'],[{line:2,old:['b'],new:['B']}])
        press(e,1)
        e.state.setLines(['new','aa','b','cc'])
        press(e,2)
        compare(text(e),'new\naa\nB\ncc')
    })
    await section("undo and redo", async function ()
    {
        e = diffed(['aa','B','cc'],[{line:2,old:['b'],new:['B']}])
        press(e,1)
        e.state.undo()
        compare(e.gutter.entries.length,0)
        compare(e.gutter.blocks.length,1)
        press(e,1)
        compare(text(e),'aa\nb\ncc')
        e = diffed(['aa','B','cc'],[{line:2,old:['b'],new:['B']}])
        press(e,1)
        e.state.undo()
        e.state.redo()
        compare(e.gutter.entries.length,1)
        compare(e.gutter.blocks.length,0)
        compare(text(e),'aa\nb\ncc')
        press(e,1)
        compare(text(e),'aa\nB\ncc')
        e = diffed(['aa','X','cc'],[{line:2,new:['X']}])
        press(e,1)
        e.state.undo()
        e.state.redo()
        compare(e.gutter.entries.length,1)
        compare(e.gutter.blocks.length,0)
        compare(text(e),'aa\ncc')
        press(e,0)
        compare(text(e),'aa\nX\ncc')
    })
    await section("new file", async function ()
    {
        e = setup()
        e.state.loadLines(['aa','B'])
        e.gutter.onGitDiff({file:'test.txt',newFile:true,changes:[{line:2,old:['b'],new:['B']}]})
        press(e,1)
        compare(text(e),'aa\nB')
        compare(e.gutter.entries.length,0)
    })
    await section("diff refresh", async function ()
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
    await section("fromDiff", async function ()
    {
        mod = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']}]})
        add = gitblock.fromDiff({changes:[{line:2,new:['X']}]})
        del = gitblock.fromDiff({changes:[{line:2,old:['X']}]})
        compare(mod.length,1)
        compare(add.length,1)
        compare(del.length,1)
        compare(mod[0].start,1)
        compare(mod[0].end,2)
        compare(mod[0].marks,{'1':'mod'})
        compare(add[0].start,1)
        compare(add[0].end,2)
        compare(add[0].marks,{'1':'add'})
        compare(del[0].start,2)
        compare(del[0].end,2)
        compare(del[0].marks,{'1':'del'})
    })
    await section("merging", async function ()
    {
        from = function (changes)
        {
            return gitblock.fromDiff({changes:changes})
        }
        b = from([{line:2,old:['b','x','y'],new:['B']}])
        compare(b.length,1)
        compare(b[0].end,2)
        compare(b[0].marks,{'1':'mod'})
        b = from([{line:2,old:['b'],new:['B']},{line:3,old:['c'],new:['C']}])
        compare(b.length,1)
        compare(b[0].marks,{'1':'mod','2':'mod'})
        b = from([{line:2,old:['b'],new:['B']},{line:4,old:['d'],new:['D']}])
        compare(b.length,2)
        compare(b[0].marks,{'1':'mod'})
        compare(b[1].marks,{'3':'mod'})
        b = from([{line:2,old:['b'],new:['B']},{line:2,old:['x']}])
        compare(b.length,1)
        compare(b[0].end,2)
        b = from([{line:1,old:['b']},{line:2,old:['c']}])
        compare(b.length,1)
        compare(b[0].start,1)
        compare(b[0].end,2)
    })
    await section("revert", async function ()
    {
        rv = function (lines, changes)
        {
            var block, entry, restored, reverted

            block = gitblock.fromDiff({changes:changes})[0]
            entry = gitblock.revert(block,lines)
            reverted = gitblock.applyRevert(entry,lines)
            restored = gitblock.applyRestore(entry,reverted)
            return [reverted,restored]
        }
        var _a_ = rv(['a','B','c'],[{line:2,old:['b'],new:['B']}]); reverted = _a_[0]; restored = _a_[1]

        compare(reverted,['a','b','c'])
        compare(restored,['a','B','c'])
        var _b_ = rv(['a','X','b'],[{line:2,new:['X']}]); reverted = _b_[0]; restored = _b_[1]

        compare(reverted,['a','b'])
        compare(restored,['a','X','b'])
        var _c_ = rv(['a','b'],[{line:1,old:['X']}]); reverted = _c_[0]; restored = _c_[1]

        compare(reverted,['a','X','b'])
        compare(restored,['a','b'])
        var _d_ = rv(['a','X','d'],[{line:1,old:['b']},{line:2,old:['c']}]); reverted = _d_[0]; restored = _d_[1]

        compare(reverted,['a','b','X','c','d'])
        compare(restored,['a','X','d'])
    })
    await section("stale", async function ()
    {
        block = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']}]})[0]
        compare(gitblock.revert(block,['a','Z','c']),undefined)
    })
    await section("firstLine", async function ()
    {
        mod = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']}]})[0]
        add = gitblock.fromDiff({changes:[{line:2,new:['X']}]})[0]
        del = gitblock.fromDiff({changes:[{line:2,old:['X']}]})[0]
        compare(gitblock.firstLine(mod),1)
        compare(gitblock.firstLine(add),1)
        compare(gitblock.firstLine(del),1)
        block = gitblock.fromDiff({changes:[{line:2,new:['X']}]})[0]
        entry = gitblock.revert(block,['a','X','b'])
        compare(gitblock.firstLine(entry),0)
    })
    await section("reanchor", async function ()
    {
        lines = ['a','B','c']
        block = gitblock.fromDiff({changes:[{line:2,old:['b'],new:['B']}]})[0]
        entry = gitblock.revert(block,lines)
        reverted = gitblock.applyRevert(entry,lines)
        moved = gitblock.reanchorEntry(entry,['new'].concat(reverted))
        compare(moved.start,2)
        compare(moved.ops[0].oldStart,2)
    })
    await section("undone block", async function ()
    {
        undone = function (lines, changes)
        {
            var back

            block = gitblock.fromDiff({changes:changes})[0]
            entry = gitblock.revert(block,lines)
            reverted = gitblock.applyRevert(entry,lines)
            back = gitblock.applyRestore(entry,reverted)
            return gitblock.undoneBlock(entry,back)
        }
        again = undone(['a','B','c'],[{line:2,old:['b'],new:['B']}])
        compare(again.start,1)
        compare(again.marks,{'1':'mod'})
        again = undone(['a','b'],[{line:1,old:['X']}])
        compare(again.start,1)
        compare(again.marks,{'0':'del'})
    })
}
toExport["gitblock"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3V0dGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L2d1dHRlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBVSxVQUFBO0lBQU07O09BQ0EsYUFBVDs7T0FDUyxjQUFUO09BQWlCLGVBQWpCOzs7QUFFUDs7OztJQUVJLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPLGVBQWU7SUFDdkMsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO1dBQ2hCOzs7QUFFSixtQkFBVSxPQUFNOzs7O0lBRVosSUFBSTtJQUNKLEVBQUUsTUFBTSxVQUFVO0lBQ2xCLEVBQUUsT0FBTyxXQUNMLEtBQVMsV0FDVCxRQUFTO1dBQ2I7OztBQUVKLGtCQUFTLEdBQUU7O1dBRVAsRUFBRSxTQUNFLEtBQVEsUUFDUixNQUFTLEVBQUUsTUFDWCxPQUFRLE9BQ1IsTUFBUSxFQUNSLElBQVE7OztBQUVoQixpQkFBUSxHQUFFOztXQUVOLEVBQUUsU0FDRSxLQUFNLE9BQ04sTUFBTyxFQUFFLE1BQ1QsSUFBTTs7O0FBRWQsZ0JBQU8sR0FBRTs7OztJQUVMLEVBQUU7SUFFRixTQUNJLEtBQU8sUUFDUCxNQUFPLE1BQ1AsS0FBTztXQUVYLEVBQUUsTUFBTSxNQUFNOzs7QUFFbEIsaUJBQVE7O1dBQU0sS0FBSyxJQUFJLEVBQUUsTUFBTTs7Ozs7O1FBTXZCLElBQUksUUFBUSxLQUFLLElBQUksUUFBUSxLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUs7UUFFbkQsRUFBRSxTQUNFLEtBQVEsUUFDUixNQUFTLEVBQUUsR0FDWCxPQUFRLE9BQ1IsTUFBUTtRQUVKLFFBQVIsS0FBSyxHQUFLO1FBQ2MsUUFBeEIsRUFBRSxPQUFPLFFBQVEsT0FBUztRQUUxQixNQUFNLEVBQUU7UUFFQSxRQUFSLEtBQUssR0FBSztRQUNjLFFBQXhCLEVBQUUsT0FBTyxRQUFRLE9BQVM7UUFFMUIsTUFBTSxFQUFFO1FBRUEsUUFBUixLQUFLLEdBQUs7UUFDYyxRQUF4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
//# sourceURL=../../../kode/ked/test/gutter.kode
