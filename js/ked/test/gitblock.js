var toExport = {}
var add, again, back, block, blocks, del, entry, lines, mod, moved, reverted, withNew

import gitblock from "../util/gitblock.js"

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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0YmxvY2suanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvZ2l0YmxvY2sua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQWMsZUFBUDs7Ozs7O1FBTUMsU0FBUyxTQUFTLFVBQVMsVUFBVSxLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUs7Z0JBRTNELE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE1BQVE7Z0JBQ2xCLE9BQU8sR0FBRyxJQUFNO2dCQUNoQixPQUFPLEdBQUcsT0FBUyxJQUFJOzs7O1FBSXZCLFNBQVMsU0FBUyxVQUFTLFVBQVUsS0FBSyxFQUFFLEtBQUs7Z0JBRWpELE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE1BQVE7Z0JBQ2xCLE9BQU8sR0FBRyxJQUFNO2dCQUNoQixPQUFPLEdBQUcsT0FBUyxJQUFJOzs7O1FBSXZCLFNBQVMsU0FBUyxVQUFTLFVBQVUsS0FBSyxFQUFFLEtBQUs7Z0JBRWpELE9BQU8sT0FBUztnQkFDaEIsT0FBTyxHQUFHLE1BQVE7Z0JBQ2xCLE9BQU8sR0FBRyxJQUFNO2dCQUNoQixPQUFPLEdBQUcsT0FBUyxJQUFJOzs7O1FBSXZCLFNBQVMsU0FBUyxVQUFTLFVBQVUsS0FBSyxFQUFFLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSztnQkFFbkUsT0FBTyxPQUFTO2dCQUNoQixPQUFPLEdBQUcsSUFBTTtnQkFDaEIsT0FBTyxHQUFHLE9BQVMsSUFBSTs7OztRQUl2QixTQUFTLFNBQVMsVUFBUyxVQUN0QixLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUssT0FDdEIsS0FBSyxFQUFFLEtBQUssS0FBSyxLQUFLO2dCQUczQixPQUFPLE9BQVM7Z0JBQ2hCLE9BQU8sR0FBRyxPQUFTLElBQUksTUFBTSxJQUFJOzs7O1FBSWpDLFNBQVMsU0FBUyxVQUFTLFVBQ3RCLEtBQUssRUFBRSxLQUFLLEtBQUssS0FBSyxPQUN0QixLQUFLLEVBQUUsS0FBSyxLQUFLLEtBQUs7Z0JBRzNCLE9BQU8sT0FBUztnQkFDaEIsT0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/gitblock.kode
