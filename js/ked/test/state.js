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
}
toExport["state"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BUVUsVUFBQTtJQUFTOztPQUNBLFdBQVA7O09BQ08sWUFBWjs7O0FBRVAsT0FBTyxlQUFLOztJQUFXLFlBQUksS0FBSyxjQUFLOztrQkFBUztPQUFLLEtBQUs7O0FBRXhELFNBQVEsS0FBSyxHQUFHLEtBQUs7QUFDckIsUUFBUSxNQUFNLE1BQU07O0FBRXBCLGdCQUFNOzttQkFBUSxLQUFLLElBQUksRUFBRSxFQUFFLE9BQVM7OztBQUNwQyxnQkFBTSxHQUFFOzttQkFBTSxFQUFFLGNBQWdCLEVBQUU7OztBQUNsQyxnQkFBTTs7bUJBQVEsRUFBRSxhQUFlOzs7QUFDL0IsZ0JBQU07O21CQUFRLEVBQUUsZ0JBQWtCOzs7O0lBSTlCLE9BQU87OztJQU1QLEVBQUUsT0FBTyxNQUFNO0lBQ2YsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUU5QixJQUFJOzs7UUFVQSxFQUFFLGNBQWMsRUFBRTtRQUVsQixJQUFJLEVBQUU7UUFFTixFQUFFLE9BQU87UUFFVCxJQUFJLEVBQUU7UUFDTixJQUFJOzs7UUFNSixFQUFFLE9BQU87UUFFVCxJQUFJLEVBQUU7UUFDTixJQUFJOzs7O1FBVUosRUFBRSwyQkFBMkI7UUFDN0IsSUFBSSxFQUFFO1FBQ04sSUFBSTs7O1FBS0osRUFBRSwyQkFBMkI7UUFFN0IsSUFBSSxFQUFFO1FBQ04sSUFBSTs7OztRQVVKLEVBQUUsY0FBZ0I7UUFFbEIsS0FBSyxFQUFFLElBQUksRUFBRTtRQUViLEVBQUUsY0FBZ0I7UUFFbEIsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFFbkIsRUFBRSxZQUFZO1FBRWQsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFFbkIsRUFBRSxxQkFBcUI7UUFFdkIsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFDbkIsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/state.kode
