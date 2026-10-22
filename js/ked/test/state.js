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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFZQSxPQUFPLGVBQUs7O0lBQVcsWUFBSSxLQUFLLGNBQUs7O2tCQUFTO09BQUssS0FBSzs7QUFFeEQsU0FBUSxLQUFLLEdBQUcsS0FBSztBQUNyQixRQUFRLE1BQU0sTUFBTTs7QUFFcEIsZ0JBQU07O21CQUFRLEtBQUssSUFBSSxFQUFFLEVBQUUsT0FBUzs7O0FBQ3BDLGdCQUFNLEdBQUU7O21CQUFNLEVBQUUsY0FBZ0IsRUFBRTs7O0FBQ2xDLGdCQUFNOzttQkFBUSxFQUFFLGFBQWU7OztBQUMvQixnQkFBTTs7bUJBQVEsRUFBRSxnQkFBa0I7Ozs7SUFJOUIsT0FBTzs7O0lBTVAsRUFBRSxPQUFPLE1BQU07SUFDZixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBRTlCLElBQUk7OztRQVVBLEVBQUUsY0FBYyxFQUFFO1FBRWxCLElBQUksRUFBRTtRQUVOLEVBQUUsT0FBTztRQUVULElBQUksRUFBRTtRQUNOLElBQUk7OztRQU1KLEVBQUUsT0FBTztRQUVULElBQUksRUFBRTtRQUNOLElBQUk7Ozs7UUFVSixFQUFFLDJCQUEyQjtRQUM3QixJQUFJLEVBQUU7UUFDTixJQUFJOzs7UUFLSixFQUFFLDJCQUEyQjtRQUU3QixJQUFJLEVBQUU7UUFDTixJQUFJOzs7O1FBVUosRUFBRSxjQUFnQjtRQUVsQixLQUFLLEVBQUUsSUFBSSxFQUFFO1FBRWIsRUFBRSxjQUFnQjtRQUVsQixLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUVuQixFQUFFLFlBQVk7UUFFZCxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUVuQixFQUFFLHFCQUFxQjtRQUV2QixLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUNuQixLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/state.kode
