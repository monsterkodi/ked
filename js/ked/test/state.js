var toExport = {}
var cells, count, cur, keys, mul, parsed, r, s, sel, st, text, txt

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import belt from "../edit/tool/belt.js"

import state from "../edit/state.js"
import mode from "../edit/mode.js"

import register from "../edit/register.js"

import dumpstate from "../util/dumpstate.js"


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
    await section("the widest line follows edits", async function ()
    {
        s.syntax.ext = 'txt'
        s.loadLines(['a','bb'])
        s.rowPrefix()
        compare(s.maxWidthCache,2)
        s.setMainCursor(1,0)
        s.insert('xx')
        s.rowPrefix()
        compare(s.maxWidthCache,3)
        s.setMainCursor(2,1)
        s.insert('yyyyyyyy')
        s.rowPrefix()
        compare(s.maxWidthCache,10)
        txt('axx\nbbyyyyyyyy')
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
    await section("typing at the start of a run joins the run", async function ()
    {
        s.loadLines(['xx BIG yy'])
        s.setSelections([[3,0,6,0]])
        s.stepScales(1)
        s.setSelections([])
        s.setMainCursor(3,0)
        s.insert('X')
        txt('xx XBIG yy')
        compare(s.s.sue,[{x:3,y:0,value:[41,-1,1,2]},{x:7,y:0,value:[99,-1,1,41]}])
    })
    await section("typing at the end of a run joins the run", async function ()
    {
        s.loadLines(['xx BIG yy'])
        s.setSelections([[3,0,6,0]])
        s.stepScales(1)
        s.setSelections([])
        s.setMainCursor(6,0)
        s.insert('X')
        txt('xx BIGX yy')
        compare(s.s.sue,[{x:3,y:0,value:[41,-1,1,2]},{x:7,y:0,value:[99,-1,1,41]}])
    })
    await section("typing before a run stays outside it", async function ()
    {
        s.loadLines(['xx BIG yy'])
        s.setSelections([[3,0,6,0]])
        s.stepScales(1)
        s.setSelections([])
        s.setMainCursor(2,0)
        s.insert('X')
        txt('xxX BIG yy')
        compare(s.s.sue,[{x:4,y:0,value:[41,-1,1,2]},{x:7,y:0,value:[99,-1,1,41]}])
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
    await section("clearing decoration on a multiline selection clears every line", async function ()
    {
        s.loadLines(['aaaa','bbbb','cccc'])
        s.setSue(0,0,[31,4,1,'#f00'])
        s.setSue(0,1,[31,4,1,'#f00'])
        s.setSue(0,2,[31,4,1,'#f00'])
        s.setSelections([[2,0,2,2]])
        s.clearSueAtCursorOrSelection()
        compare(s.s.sue,[{x:0,y:0,value:[31,2,1,'#f00']},{x:2,y:2,value:[31,2,1,'#f00']}])
    })
    await section("clearing decoration on full lines takes whole areas away", async function ()
    {
        s.loadLines(['aaaa','bbbb','cccc'])
        s.setSue(0,0,[31,4,1,'#f00'])
        s.setSue(0,1,[31,4,1,'#f00'])
        s.setSue(0,2,[31,4,1,'#f00'])
        s.setSelections([[0,0,0,2]])
        s.clearSueAtCursorOrSelection()
        compare(s.s.sue,[{x:0,y:2,value:[31,4,1,'#f00']}])
    })
}
toExport["state"]._section_ = true
toExport["dumpstate"] = async function ()
{
    await section("a plain state carries its file", async function ()
    {
        s = new state(cells,'plain')
        compare(dumpstate.tags(s,'/tmp/x'),'[file: /tmp/x]')
    })
    await section("the active modes and a pending ex command are shown", async function ()
    {
        await mode.loaded
        s = new state(cells,'modes')
        s.allowedModes.unype = true
        s.allowedModes.novim = true
        s.startMode('unype')
        s.startMode('novim')
        mode.get(s,'novim').ex = 'q'
        compare(dumpstate.tags(s,'/tmp/x'),'[modes: novim unype] [pending: :q] [file: /tmp/x]')
    })
    await section("a changed buffer is dirty", async function ()
    {
        s = new state(cells,'dirty')
        s.clearHistory()
        s.pushState()
        compare(dumpstate.tags(s,'/tmp/x'),'[dirty] [file: /tmp/x]')
    })
}
toExport["dumpstate"]._section_ = true
toExport["registers"] = async function ()
{
    await section("named and unnamed registers", async function ()
    {
        r = new register
        r.write('"',{lines:['one'],linewise:false},'yank')
        compare(r.read('"').lines,['one'])
        compare(r.read('0').lines,['one'])
        r.write('a',{lines:['aye'],linewise:false},'yank')
        compare(r.read('a').lines,['aye'])
        compare(r.read('"').lines,['aye'])
        compare(r.read('0').lines,['one'])
        r.write('A',{lines:['two'],linewise:true},'yank')
        compare(r.read('a').lines,['aye','two'])
    })
    await section("numbered registers", async function ()
    {
        r = new register
        r.write('a',{lines:['first'],linewise:true},'delete')
        compare(r.read('"').lines,['first'])
        compare(r.read('1').lines,['first'])
        r.write('b',{lines:['second'],linewise:true},'delete')
        compare(r.read('1').lines,['second'])
        compare(r.read('2').lines,['first'])
        r.write('x',{lines:['small'],linewise:false},'delete')
        compare(r.read('-').lines,['small'])
        compare(r.read('1').lines,['second'])
    })
    await section("black hole", async function ()
    {
        r = new register
        r.write('a',{lines:['keep'],linewise:true},'delete')
        r.write('_',{lines:['gone'],linewise:true},'delete')
        compare(r.read('"').lines,['keep'])
        compare(r.read('a').lines,['keep'])
        compare(r.read('1').lines,['keep'])
    })
    await section("macro registers", async function ()
    {
        r = new register
        keys = [{key:'x',combo:'x',char:'x'},{key:'return',combo:'return',char:'\n'}]
        r.setMacro('a',keys)
        compare(r.read('a').keys.length,2)
        compare(register.textForValue(r.read('a')),"x\n")
        r.setMacro('A',[{key:'j',combo:'j',char:'j'}])
        compare(r.read('a').keys.length,3)
        compare(register.textForValue(r.read('a')),"x\nj")
        parsed = register.keysForText("x<Esc>y")
        compare(parsed.length,3)
        compare(parsed[1].key,'esc')
    })
    await section("a silent cursor restore", async function ()
    {
        st = new state({cols:20,rows:6},'silent_state')
        st.loadLines(['abc','def','ghi'])
        count = 0
        st.on('cursorsSet',function ()
        {
            return count += 1
        })
        st.setCursors([[1,1]])
        compare(count,1)
        st.setCursors([[2,2]],{silent:true})
        compare(count,1)
        compare(st.mainCursor(),[2,2])
    })
}
toExport["registers"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc3RhdGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ1UsVUFBQTtJQUFTOztPQUNBLFdBQVA7O09BQ08sWUFBWjtPQUFrQixXQUFsQjs7T0FDSyxlQUFBOztPQUNPLGdCQUFaOzs7QUFFUCxPQUFPLGVBQUs7O0lBQVcsWUFBSSxLQUFLLGNBQUs7O2tCQUFTO09BQUssS0FBSzs7QUFFeEQsU0FBUSxLQUFLLEdBQUcsS0FBSztBQUNyQixRQUFRLE1BQU0sTUFBTTs7QUFFcEIsZ0JBQU07O21CQUFRLEtBQUssSUFBSSxFQUFFLEVBQUUsT0FBUzs7O0FBQ3BDLGdCQUFNLEdBQUU7O21CQUFNLEVBQUUsY0FBZ0IsRUFBRTs7O0FBQ2xDLGdCQUFNOzttQkFBUSxFQUFFLGFBQWU7OztBQUMvQixnQkFBTTs7bUJBQVEsRUFBRSxnQkFBa0I7Ozs7SUFJaEMsT0FBTzs7O0lBTVAsRUFBRSxPQUFPLE1BQU07SUFDZixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBRTlCLElBQUk7OztRQUlFLEVBQUUsY0FBYyxFQUFFO1FBRWxCLElBQUksRUFBRTtRQUVOLEVBQUUsT0FBTztRQUVULElBQUksRUFBRTtRQUNOLElBQUk7OztRQU1KLEVBQUUsT0FBTztRQUVULElBQUksRUFBRTtRQUNOLElBQUk7Ozs7UUFJSixFQUFFLDJCQUEyQjtRQUM3QixJQUFJLEVBQUU7UUFDTixJQUFJOzs7UUFLSixFQUFFLDJCQUEyQjtRQUU3QixJQUFJLEVBQUU7UUFDTixJQUFJOzs7O1FBSUosRUFBRSxjQUFnQjtRQUVsQixLQUFLLEVBQUUsSUFBSSxFQUFFO1FBRWIsRUFBRSxjQUFnQjtRQUVsQixLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUVuQixFQUFFLFlBQVk7UUFFZCxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUVuQixFQUFFLHFCQUFxQjtRQUV2QixLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUks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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/state.kode
