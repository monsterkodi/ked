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
}
toExport["state"]._section_ = true
toExport["editing"] = async function ()
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
}
toExport["editing"]._section_ = true
toExport["move lines"] = async function ()
{
    s.moveSelectionOrCursorLines('up')
    cur(1,0)
    txt(`line 2
line 1
line 3`)
    s.moveSelectionOrCursorLines('down')
    cur(1,1)
    txt(text)
}
toExport["move lines"]._section_ = true
toExport["multiple"] = async function ()
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
}
toExport["multiple"]._section_ = true
toExport["backtrack selection"] = async function ()
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
}
toExport["backtrack selection"]._section_ = true
toExport["backtrack selection stays sticky after moving"] = async function ()
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
}
toExport["backtrack selection stays sticky after moving"]._section_ = true
toExport["backtrack selection with multiple cursors"] = async function ()
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
}
toExport["backtrack selection with multiple cursors"]._section_ = true
toExport["backtrack selection past end of line"] = async function ()
{
    s.loadLines(belt.linesForText("abc\ndefgh"))
    s.setMainCursor(5,0)
    s.moveCursorsAndSelect('down')
    cur(5,1)
    sel([3,0,5,1])
    s.moveCursorsAndSelect('up')
    cur(5,0)
    sel()
}
toExport["backtrack selection past end of line"]._section_ = true
toExport["unicode"] = async function ()
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
}
toExport["unicode"]._section_ = true
toExport["selection"] = async function ()
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
}
toExport["selection"]._section_ = true
toExport["empty"] = async function ()
{
    s.syntax.ext = 'kode'
    s.loadLines(belt.linesForText(''))
    txt('')
    cur(0,0)
    s.insert('\n')
    txt('\n')
    cur(0,1)
    compare(s.s.lines,[[],[]])
}
toExport["empty"]._section_ = true
toExport["delete back"] = async function ()
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
}
toExport["delete back"]._section_ = true
toExport["cloneSelectionAndCursorLines"] = async function ()
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
}
toExport["cloneSelectionAndCursorLines"]._section_ = true
toExport["deleteRanges"] = async function ()
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
}
toExport["deleteRanges"]._section_ = true
toExport["joinLines"] = async function ()
{
    text = `line 1
line 2
line 3`
    s.loadLines(belt.linesForText(text))
    s.joinLines()
    txt(`line 1line 2
line 3`)
}
toExport["joinLines"]._section_ = true
toExport["undo keeps the cached lines in sync"] = async function ()
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
}
toExport["undo keeps the cached lines in sync"]._section_ = true
toExport["undo invalidates the display row cache"] = async function ()
{
    s.syntax.ext = 'md'
    s.applyScales({enabled:true,md:{h1:3}})
    s.loadLines(['# h1','text'])
    compare(s.totalRows(),4)
    s.setLines(['# h1','# h1','text'])
    compare(s.totalRows(),7)
    s.undo()
    compare(s.totalRows(),4)
}
toExport["undo invalidates the display row cache"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ1UsVUFBQTtJQUFTOztPQUNBLFdBQVA7O09BQ08sWUFBWjs7O0FBRVAsT0FBTyxlQUFLOztJQUFXLFlBQUksS0FBSyxjQUFLOztrQkFBUztPQUFLLEtBQUs7O0FBRXhELFNBQVEsS0FBSyxHQUFHLEtBQUs7QUFDckIsUUFBUSxNQUFNLE1BQU07O0FBRXBCLGdCQUFNOzttQkFBUSxLQUFLLElBQUksRUFBRSxFQUFFLE9BQVM7OztBQUNwQyxnQkFBTSxHQUFFOzttQkFBTSxFQUFFLGNBQWdCLEVBQUU7OztBQUNsQyxnQkFBTTs7bUJBQVEsRUFBRSxhQUFlOzs7QUFDL0IsZ0JBQU07O21CQUFRLEVBQUUsZ0JBQWtCOzs7O0lBSTlCLE9BQU87OztJQU1QLEVBQUUsT0FBTyxNQUFNO0lBQ2YsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUU5QixJQUFJOzs7OztJQUlBLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUksRUFBRTtJQUVOLEVBQUUsT0FBTztJQUVULElBQUksRUFBRTtJQUNOLElBQUk7OztJQU1KLEVBQUUsT0FBTztJQUVULElBQUksRUFBRTtJQUNOLElBQUk7Ozs7O0lBSUosRUFBRSwyQkFBMkI7SUFDN0IsSUFBSSxFQUFFO0lBQ04sSUFBSTs7O0lBS0osRUFBRSwyQkFBMkI7SUFFN0IsSUFBSSxFQUFFO0lBQ04sSUFBSTs7Ozs7SUFJSixFQUFFLGNBQWdCO0lBRWxCLEtBQUssRUFBRSxJQUFJLEVBQUU7SUFFYixFQUFFLGNBQWdCO0lBRWxCLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0lBRW5CLEVBQUUsWUFBWTtJQUVkLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0lBRW5CLEVBQUUscUJBQXFCO0lBRXZCLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0lBQ25CLEtBQUssRUFBRSxFQUFFLEVBQUUs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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/state.kode
