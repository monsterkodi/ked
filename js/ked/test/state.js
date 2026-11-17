var toExport = {}
var cells, cur, mul, s, sel, text, txt

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import belt from "../edit/tool/belt.js"

import state from "../edit/state.js"


global.lf = function (...args)
{
    console.log(args.map(function (a)
    {
        return `${a}`
    }).join(' '))
}
cells = {cols:55,rows:66}
s = new state(cells,'test')

txt = function (t)
{
    return compare(kseg.str(s.s.lines),t)
}

cur = function (x, y)
{
    return compare(s.mainCursor(),[x,y])
}

mul = function (...c)
{
    return compare(s.allCursors(),c)
}

sel = function (...r)
{
    return compare(s.allSelections(),r)
}
toExport["state"] = async function ()
{
    text = `line 1
line 2
line 3`
    s.syntax.ext = 'kode'
    s.loadLines(belt.linesForText(text))
    txt(text)
    await section("editing", async function ()
    {
        s.setMainCursor(1,1)
        cur(1,1)
        s.insert('x')
        cur(2,1)
        txt(`line 1
lxine 2
line 3`)
        s.delete('back')
        cur(1,1)
        txt(text)
    })
    await section("move lines", async function ()
    {
        s.moveSelectionOrCursorLines('up')
        cur(1,0)
        txt(`line 2
line 1
line 3`)
        s.moveSelectionOrCursorLines('down')
        cur(1,1)
        txt(text)
    })
    await section("multiple", async function ()
    {
        s.expandCursors('up')
        mul([1,0],[1,1])
        s.expandCursors('down')
        mul([1,0],[1,1],[1,2])
        s.moveCursors('left')
        mul([0,0],[0,1],[0,2])
        s.moveCursorsAndSelect('right')
        mul([1,0],[1,1],[1,2])
        sel([0,0,1,0],[0,1,1,1],[0,2,1,2])
        s.moveCursors('right',{jump:['ws','word','empty','punct']})
        mul([4,0],[4,1],[4,2])
        sel([0,0,1,0],[0,1,1,1],[0,2,1,2])
        s.selectAllLines()
        mul([4,0],[4,1],[4,2])
        sel([0,0,6,2])
        s.selectAllLines()
        mul([4,0],[4,1],[4,2])
        sel()
        s.moveCursors('right')
        s.moveCursorsAndSelect('left',{jump:['word']})
        s.moveCursorsAndSelect('left',{jump:['word']})
        mul([0,0],[0,1],[0,2])
        sel([0,0,5,0],[0,1,5,1],[0,2,5,2])
        s.insert('\n')
        mul([0,1],[0,3],[0,5])
        sel()
        txt(`
1

2

3`)
    })
    await section("backtrack selection", async function ()
    {
        s.loadLines(belt.linesForText('abcdef'))
        s.setMainCursor(2,0)
        s.moveCursorsAndSelect('right')
        cur(3,0)
        sel([2,0,3,0])
        s.moveCursorsAndSelect('right')
        cur(4,0)
        sel([2,0,4,0])
        s.moveCursorsAndSelect('left')
        cur(3,0)
        sel([2,0,3,0])
        s.moveCursorsAndSelect('left')
        cur(2,0)
        sel()
        s.moveCursorsAndSelect('left')
        cur(1,0)
        sel([1,0,2,0])
    })
    await section("backtrack selection stays sticky after moving", async function ()
    {
        s.loadLines(belt.linesForText('abcdef'))
        s.setMainCursor(2,0)
        s.moveCursorsAndSelect('right')
        s.moveCursorsAndSelect('right')
        s.moveCursors('right')
        cur(5,0)
        sel([2,0,4,0])
        s.moveCursorsAndSelect('right')
        cur(6,0)
        sel([2,0,4,0],[5,0,6,0])
    })
    await section("backtrack selection with multiple cursors", async function ()
    {
        s.loadLines(belt.linesForText("one\ntwo\nthree\nfour"))
        s.setCursors([[0,0],[0,1]])
        s.moveCursorsAndSelect('down')
        mul([0,1],[0,2])
        sel([0,0,0,2])
        s.moveCursorsAndSelect('down')
        mul([0,2],[0,3])
        sel([0,0,0,3])
        s.moveCursorsAndSelect('up')
        mul([0,1],[0,2])
        sel([0,0,0,2])
        s.moveCursorsAndSelect('up')
        mul([0,0],[0,1])
        sel()
    })
    await section("backtrack selection past end of line", async function ()
    {
        s.loadLines(belt.linesForText("abc\ndefgh"))
        s.setMainCursor(5,0)
        s.moveCursorsAndSelect('down')
        cur(5,1)
        sel([3,0,5,1])
        s.moveCursorsAndSelect('up')
        cur(5,0)
        sel()
    })
    await section("unicode", async function ()
    {
        text = `s = "🧑🌾"
line 3`
        s.syntax.ext = 'kode'
        s.loadSegls(belt.seglsForText(text))
        txt(text)
        s.toggleCommentAtSelectionOrCursorLines()
        txt(`# s = "🧑🌾"
line 3`)
        s.toggleCommentAtSelectionOrCursorLines()
        txt(text)
    })
    await section("selection", async function ()
    {
        text = `'a'        ▸ 1
'🔧'       ▸ 2
'字'       ▸ 2
'字的模块' ▸ 8
'👁'        ▸ 1
'🖌'        ▸ 1
'🛠'        ▸ 1
'🧑‍🌾'       ▸ 4
'🔥'       ▸ 2
'💩'       ▸ 2`
        s.syntax.ext = 'kode'
        s.loadSegls(belt.seglsForText(text))
        txt(text)
        s.selectAllLines()
        sel([0,0,14,9])
        s.moveCursorsToEndOfSelections()
        sel([0,0,14,9])
        mul([14,0],[14,1],[14,2],[14,3],[14,4],[14,5],[14,6],[14,7],[14,8],[14,9])
        s.deselect()
        sel()
        mul([14,0],[14,1],[14,2],[14,3],[14,4],[14,5],[14,6],[14,7],[14,8],[14,9])
        s.moveCursors('bol')
        mul([0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9])
        s.selectMoreLines()
        sel([0,0,14,9])
        mul([14,0],[14,1],[14,2],[14,3],[14,4],[14,5],[14,6],[14,7],[14,8],[14,9])
        s.deselect()
        s.delete('back')
        txt(`'a'        ▸ 
'🔧'       ▸ 
'字'       ▸ 
'字的模块' ▸ 
'👁'        ▸ 
'🖌'        ▸ 
'🛠'        ▸ 
'🧑‍🌾'       ▸ 
'🔥'       ▸ 
'💩'       ▸ `)
        s.delete('back')
        s.moveCursors('left')
        s.delete('back')
        txt(`'a'       ▸
'🔧'      ▸
'字'      ▸
'字的模块'▸
'👁'       ▸
'🖌'       ▸
'🛠'       ▸
'🧑‍🌾'      ▸
'🔥'      ▸
'💩'      ▸`)
        s.delete('back',true)
        txt(`'a'▸
'🔧'▸
'字'▸
'字的模块▸
'👁'▸
'🖌'▸
'🛠'▸
'🧑‍🌾'▸
'🔥'▸
'💩'▸`)
    })
    await section("empty", async function ()
    {
        s.syntax.ext = 'kode'
        s.loadLines(belt.linesForText(''))
        txt('')
        cur(0,0)
        s.insert('\n')
        txt('\n')
        cur(0,1)
        compare(s.s.lines,[[],[]])
    })
    await section("delete back", async function ()
    {
        text = `xxxx            1
xxxx         .  2
xxxx    .       3`
        s.syntax.ext = 'kode'
        s.loadLines(belt.linesForText(text))
        s.setMainCursor(16,0)
        s.expandCursors('down')
        s.expandCursors('down')
        s.expandCursors('down')
        mul([16,0],[16,1],[16,2])
        s.delete('back')
        mul([14,0],[14,1],[14,2])
        s.delete('back')
        mul([13,0],[13,1],[13,2])
        s.delete('back')
        mul([12,0],[12,1],[12,2])
        s.delete('back')
        mul([9,0],[9,1],[9,2])
        s.delete('back')
        mul([8,0],[8,1],[8,2])
        s.delete('back')
        mul([4,0],[4,1],[4,2])
    })
    await section("cloneSelectionAndCursorLines", async function ()
    {
        text = `line 1
line 2
line 3`
        s.loadLines(belt.linesForText(text))
        s.cloneSelectionAndCursorLines('down')
        txt(`line 1
line 1
line 2
line 3`)
        mul([0,1])
        s.expandCursors('down')
        mul([0,1],[0,2])
        s.cloneSelectionAndCursorLines('down')
        txt(`line 1
line 1
line 2
line 1
line 2
line 3`)
        mul([0,3],[0,4])
        s.expandCursors('down')
        s.moveCursors('right')
        mul([1,3],[1,4],[1,5])
        s.cloneSelectionAndCursorLines('down')
        txt(`line 1
line 1
line 2
line 1
line 2
line 3
line 1
line 2
line 3`)
    })
    await section("sortSelectionsOrCursorLines sorts cursor lines", async function ()
    {
        text = `line 2
line 3
line 1`
        s.loadLines(belt.linesForText(text))
        s.setCursors([[2,0],[2,1],[2,2]])
        s.sortSelectionsOrCursorLines()
        txt(`line 1
line 2
line 3`)
        sel([0,0,6,2])
        mul([6,0],[6,1],[6,2])
        s.sortSelectionsOrCursorLines()
        txt(`line 3
line 2
line 1`)
        sel([0,0,6,2])
        mul([6,0],[6,1],[6,2])
    })
    await section("sortSelectionsOrCursorLines toggles sort direction", async function ()
    {
        text = `line 3
--
line 1
--
line 2`
        s.loadLines(belt.linesForText(text))
        s.setCursors([[0,0],[0,2],[0,4]])
        s.sortSelectionsOrCursorLines()
        txt(`line 1
--
line 2
--
line 3`)
        sel([0,0,6,0],[0,2,6,2],[0,4,6,4])
        mul([6,0],[6,2],[6,4])
        s.sortSelectionsOrCursorLines()
        txt(`line 3
--
line 2
--
line 1`)
        sel([0,0,6,0],[0,2,6,2],[0,4,6,4])
        mul([6,0],[6,2],[6,4])
        s.sortSelectionsOrCursorLines()
        txt(`line 1
--
line 2
--
line 3`)
        sel([0,0,6,0],[0,2,6,2],[0,4,6,4])
        mul([6,0],[6,2],[6,4])
    })
    await section("sortSelections adjusts range widths and cursors", async function ()
    {
        text = `banana
--
apple
--
cherry`
        s.loadLines(belt.linesForText(text))
        s.setSelections([[0,0,6,0],[0,2,5,2],[0,4,6,4]])
        s.setCursors([[6,0],[5,2],[6,4]])
        s.sortSelectionsOrCursorLines()
        txt(`apple
--
banana
--
cherry`)
        sel([0,0,5,0],[0,2,6,2],[0,4,6,4])
        mul([5,0],[6,2],[6,4])
        s.sortSelectionsOrCursorLines()
        txt(`cherry
--
banana
--
apple`)
        sel([0,0,6,0],[0,2,6,2],[0,4,5,4])
        mul([6,0],[6,2],[5,4])
    })
    await section("sortSelections splits multi line selections", async function ()
    {
        text = `c
b
a`
        s.loadLines(belt.linesForText(text))
        s.setSelections([[0,0,1,2]])
        s.setCursors([[1,2]])
        s.sortSelectionsOrCursorLines()
        txt(`a
b
c`)
        sel([0,0,1,2])
        mul([1,0],[1,1],[1,2])
        s.sortSelectionsOrCursorLines()
        txt(`c
b
a`)
        sel([0,0,1,2])
        mul([1,0],[1,1],[1,2])
    })
    await section("deleteRanges", async function ()
    {
        text = `line 1
line 2
line 3`
        s.loadLines(belt.linesForText(text))
        s.deleteRanges([[0,0,2,0]])
        txt(`ne 1
line 2
line 3`)
        s.deleteRanges([[2,0,2,1]])
        txt(`nene 2
line 3`)
        s.deleteRanges([[6,0,0,1]])
        txt(`nene 2line 3`)
    })
    await section("joinLines", async function ()
    {
        text = `line 1
line 2
line 3`
        s.loadLines(belt.linesForText(text))
        s.joinLines()
        txt(`line 1line 2
line 3`)
    })
    await section("undo keeps the cached lines in sync", async function ()
    {
        s.syntax.ext = 'kode'
        s.loadLines(['aaa','bbb','ccc'])
        s.setMainCursor(1,1)
        s.insert('x')
        s.undo()
        txt('aaa\nbbb\nccc')
        compare(kseg.str(s.segls),'aaa\nbbb\nccc')
        s.redo()
        txt('aaa\nbxbb\nccc')
        compare(kseg.str(s.segls),'aaa\nbxbb\nccc')
    })
    await section("undo invalidates the display row cache", async function ()
    {
        s.syntax.ext = 'md'
        s.applyScales({enabled:true,md:{h1:3}})
        s.loadLines(['# h1','text'])
        compare(s.totalRows(),4)
        s.setLines(['# h1','# h1','text'])
        compare(s.totalRows(),7)
        s.undo()
        compare(s.totalRows(),4)
    })
    await section("replaceLineRanges applies all edits in one undo step", async function ()
    {
        s.loadLines(['a','b','c','d','e'])
        s.replaceLineRanges([[1,1,[(kseg,'B')]],[3,1,[(kseg,'D1'),(kseg,'D2')]]])
        txt('a\nB\nc\nD1\nD2\ne')
        s.undo()
        txt('a\nb\nc\nd\ne')
    })
    await section("replaceLineRanges moves cursors after changed lines", async function ()
    {
        s.loadLines(['a','b','c','d'])
        s.setCursors([[0,0],[2,3]])
        s.replaceLineRanges([[1,1,[(kseg,'B1'),(kseg,'B2')]]])
        compare(s.allCursors(),[[0,0],[1,4]])
    })
    await section("replaceLineRanges moves a cursor inside a removed range to the start", async function ()
    {
        s.loadLines(['a','b','c','d'])
        s.setCursors([[0,2]])
        s.replaceLineRanges([[1,2,[]]])
        compare(s.s.lines.length,2)
        compare(s.mainCursor(),[0,1])
    })
    await section("a line scale lives in the areas", async function ()
    {
        s.loadLines(['one','two','three'])
        s.setLineScale(1,3)
        compare(s.lineHeight(1),3)
        compare(s.s.sue.length,1)
        s.clearLineScale(1)
        compare(s.lineHeight(1),1)
        compare(s.s.sue.length,0)
    })
    await section("clearing a scale that is not there changes nothing", async function ()
    {
        s.loadLines(['one','two','three'])
        s.setLineScale(0,2)
        s.clearLineScale(1)
        compare(s.s.sue.length,1)
        compare(s.lineHeight(0),2)
    })
    await section("scaling steps every line it is given", async function ()
    {
        s.loadLines(['a','b','c'])
        s.stepLineScales([0,2],1)
        compare(s.lineHeight(0),2)
        compare(s.lineHeight(2),2)
        compare(s.lineHeight(1),1)
        compare(s.s.sue.length,2)
        s.clearLineScales([0,2])
        compare(s.s.sue,[])
    })
    await section("a step below one leaves no area behind", async function ()
    {
        s.loadLines(['a','b','c'])
        s.stepLineScales([0,1,2],-1)
        compare(s.lineHeight(0),1)
        compare(s.s.sue,[])
    })
    await section("styling a multi line selection covers every line", async function ()
    {
        s.loadLines(['abcd','efgh','ijkl'])
        s.setSelections([[2,0,2,2]])
        s.toggleSueFlag('u')
        compare(s.s.sue.length,3)
        compare(s.s.sue[0].value,[34,2,1,'u'])
        compare(s.s.sue[1].value,[34,4,1,'u'])
        compare(s.s.sue[2].value,[34,2,1,'u'])
        s.toggleSueFlag('u')
        compare(s.s.sue,[])
    })
    await section("styling with several cursors styles every word", async function ()
    {
        s.loadLines(['one two three'])
        s.setSelections([])
        s.setCursors([[0,0],[8,0]])
        s.toggleSueFlag('s')
        compare(s.s.sue.length,2)
        compare(s.s.sue[0].x,0)
        compare(s.s.sue[0].value,[34,3,1,'s'])
        compare(s.s.sue[1].x,8)
        compare(s.s.sue[1].value,[34,5,1,'s'])
    })
    await section("a partial selection is scaled by a run", async function ()
    {
        s.loadLines(['xx BIG yy'])
        s.setSelections([[3,0,6,0]])
        s.stepScales(1)
        compare(s.s.sue,[{x:3,y:0,value:[41,-1,1,2]},{x:6,y:0,value:[99,-1,1,41]}])
        s.stepScales(1)
        compare(s.s.sue[0].value,[41,-1,1,3])
        s.stepScales(-1)
        s.stepScales(-1)
        compare(s.s.sue,[])
    })
    await section("a whole line selection scales the line", async function ()
    {
        s.loadLines(['abcd'])
        s.setSelections([[0,0,4,0]])
        s.stepScales(1)
        compare(s.s.sue,[{x:0,y:0,value:[40,-1,1,2]}])
    })
    await section("cursors scale their lines", async function ()
    {
        s.loadLines(['a','b'])
        s.setSelections([])
        s.setCursors([[0,0],[0,1]])
        s.stepScales(1)
        compare(s.s.sue.length,2)
        compare(s.s.sue[0].value,[40,-1,1,2])
    })
    await section("clearing takes the runs away too", async function ()
    {
        s.loadLines(['xx BIG yy'])
        s.setSelections([[3,0,6,0]])
        s.stepScales(1)
        s.clearScales()
        compare(s.s.sue,[])
    })
}
toExport["state"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ1UsVUFBQTtJQUFTOztPQUNBLFdBQVA7O09BQ08sWUFBWjs7O0FBRVAsT0FBTyxlQUFLOztJQUFXLFlBQUksS0FBSyxjQUFLOztrQkFBUztPQUFLLEtBQUs7O0FBRXhELFNBQVEsS0FBSyxHQUFHLEtBQUs7QUFDckIsUUFBUSxNQUFNLE1BQU07O0FBRXBCLGdCQUFNOzttQkFBUSxLQUFLLElBQUksRUFBRSxFQUFFLE9BQVM7OztBQUNwQyxnQkFBTSxHQUFFOzttQkFBTSxFQUFFLGNBQWdCLEVBQUU7OztBQUNsQyxnQkFBTTs7bUJBQVEsRUFBRSxhQUFlOzs7QUFDL0IsZ0JBQU07O21CQUFRLEVBQUUsZ0JBQWtCOzs7O0lBSWhDLE9BQU87OztJQU1QLEVBQUUsT0FBTyxNQUFNO0lBQ2YsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUU5QixJQUFJOzs7UUFJRSxFQUFFLGNBQWMsRUFBRTtRQUVsQixJQUFJLEVBQUU7UUFFTixFQUFFLE9BQU87UUFFVCxJQUFJLEVBQUU7UUFDTixJQUFJOzs7UUFNSixFQUFFLE9BQU87UUFFVCxJQUFJLEVBQUU7UUFDTixJQUFJOzs7O1FBSUosRUFBRSwyQkFBMkI7UUFDN0IsSUFBSSxFQUFFO1FBQ04sSUFBSTs7O1FBS0osRUFBRSwyQkFBMkI7UUFFN0IsSUFBSSxFQUFFO1FBQ04sSUFBSTs7OztRQUlKLEVBQUUsY0FBZ0I7UUFFbEIsS0FBSyxFQUFFLElBQUksRUFBRTtRQUViLEVBQUUsY0FBZ0I7UUFFbEIsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFFbkIsRUFBRSxZQUFZO1FBRWQsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFFbkIsRUFBRSxxQkFBcUI7UUFFdkIsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFDbkIsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/state.kode
