var toExport = {}
var across, before, cells, cur, key, m, mrange, s, segls, text, txt

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import belt from "../edit/tool/belt.js"
import motion from "../edit/tool/motion.js"

import state from "../edit/state.js"

import novim from "../edit/mode/novim.js"

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

mrange = function (lines, x, y, m)
{
    return motion.range(lines,[x,y],m)
}
toExport["motion ranges"] = async function ()
{
    segls = kseg.segls(`one two three
four five`)
    await section("words", async function ()
    {
        compare(mrange(segls,0,0,{kind:'word',count:1}),[0,0,4,0])
        compare(mrange(segls,4,0,{kind:'word',count:1}),[4,0,8,0])
        compare(mrange(segls,8,0,{kind:'word',count:1}),[8,0,13,0])
        compare(mrange(segls,8,1,{kind:'word',count:1}),[8,1,9,1])
        compare(mrange(segls,0,0,{kind:'wordEnd',count:1}),[0,0,3,0])
        compare(mrange(segls,4,0,{kind:'wordEnd',count:2}),[4,0,13,0])
        compare(mrange(segls,8,0,{kind:'wordBack',count:1}),[4,0,8,0])
        compare(mrange(segls,4,0,{kind:'wordBack',count:1}),[0,0,4,0])
        compare(mrange(segls,0,0,{kind:'wordBack',count:1}),[0,0,0,0])
    })
    await section("words across lines", async function ()
    {
        across = kseg.segls(`foo
  bar
  baz`)
        compare(mrange(across,0,0,{kind:'word',count:1}),[0,0,3,0])
        compare(mrange(across,0,0,{kind:'word',count:2}),[0,0,5,1])
    })
    await section("lines", async function ()
    {
        compare(mrange(segls,3,1,{kind:'line',count:1}),[0,1,9,1])
        compare(mrange(segls,3,0,{kind:'line',count:2}),[0,0,9,1])
        compare(mrange(segls,3,0,{kind:'line',count:9}),[0,0,9,1])
        compare(mrange(segls,3,0,{kind:'lineDown',count:1}),[0,0,9,1])
        compare(mrange(segls,3,0,{kind:'lineDown',count:9}),[0,0,9,1])
        compare(mrange(segls,3,1,{kind:'lineUp',count:1}),[0,0,9,1])
        compare(mrange(segls,3,0,{kind:'lineUp',count:1}),[0,0,13,0])
    })
    await section("chars", async function ()
    {
        compare(mrange(segls,0,0,{kind:'char',count:2}),[0,0,2,0])
        compare(mrange(segls,11,0,{kind:'char',count:5}),[11,0,13,0])
        compare(mrange(segls,3,0,{kind:'charBack',count:2}),[1,0,3,0])
        compare(mrange(segls,3,0,{kind:'charBack',count:9}),[0,0,3,0])
        compare(mrange(segls,11,0,{kind:'bol'}),[0,0,11,0])
        compare(mrange(segls,11,0,{kind:'eol'}),[11,0,13,0])
        compare(mrange(segls,13,0,{kind:'eol'}),[13,0,13,0])
    })
}
toExport["motion ranges"]._section_ = true
toExport["merging ranges"] = async function ()
{
    compare(motion.mergeRanges([[0,0,1,0],[1,0,2,0]]),[[0,0,2,0]])
    compare(motion.mergeRanges([[0,0,3,0],[0,0,3,0]]),[[0,0,3,0]])
    compare(motion.mergeRanges([[0,0,3,0],[1,0,3,0]]),[[0,0,3,0]])
    compare(motion.mergeRanges([[0,0,5,1],[0,1,3,1]]),[[0,0,5,1]])
    compare(motion.mergeRanges([[0,0,3,0],[0,1,3,1]]),[[0,0,3,0],[0,1,3,1]])
    compare(motion.mergeRanges([[0,0,0,0],[0,0,0,0]]),[[0,0,0,0]])
}
toExport["merging ranges"]._section_ = true
toExport["execute command"] = async function ()
{
    text = `alpha beta
gamma delta`
    s.loadLines(belt.linesForText(text))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'word',count:1}})
    txt(`beta
gamma delta`)
    cur(0,0)
    s.setMainCursor(2,1)
    s.executeNovim({operator:'delete',motion:{kind:'eol'}})
    txt(`beta
ga`)
    cur(2,1)
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'line',count:1}})
    txt(`ga`)
    cur(0,0)
    s.loadLines(belt.linesForText(text))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'char',count:3}})
    txt(`ha beta
gamma delta`)
    s.setMainCursor(5,1)
    s.executeNovim({operator:'delete',motion:{kind:'charBack',count:3}})
    txt(`ha beta
ga delta`)
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'eol'}})
    txt(`
ga delta`)
}
toExport["execute command"]._section_ = true
toExport["execute command undo"] = async function ()
{
    text = `alpha beta
gamma delta`
    s.loadLines(belt.linesForText(text))
    before = s.h.length
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'line',count:2}})
    txt(``)
    compare((s.h.length - before),1)
    s.undo()
    txt(text)
}
toExport["execute command undo"]._section_ = true
toExport["execute command with multiple cursors"] = async function ()
{
    text = `alpha beta
gamma delta`
    s.loadLines(belt.linesForText(text))
    s.setCursors([[0,0],[0,1]])
    s.executeNovim({operator:'delete',motion:{kind:'word',count:1}})
    txt(`beta
delta`)
    compare(s.allCursors().length,2)
    s.loadLines(belt.linesForText("abc def"))
    s.setCursors([[0,0],[1,0]])
    s.executeNovim({operator:'delete',motion:{kind:'char',count:2}})
    txt(" def")
    s.loadLines(belt.linesForText("\nalpha\nbeta"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'line',count:1}})
    txt("alpha\nbeta")
}
toExport["execute command with multiple cursors"]._section_ = true
toExport["keys"] = async function ()
{
    text = `alpha beta
gamma delta`
    s.loadLines(belt.linesForText(text))
    m = new novim(s)
    key = function (c)
    {
        return m.handleKey(c,{combo:c,char:c})
    }
    key('d')
    key('2')
    key('w')
    txt(`
gamma delta`)
    s.loadLines(belt.linesForText(text))
    s.setMainCursor(0,0)
    key('d')
    m.handleKey('esc',{combo:'esc'})
    txt(text)
    compare(m.operator,null)
    key('x')
    txt(`lpha beta
gamma delta`)
}
toExport["keys"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvbm92aW0ua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BT1UsVUFBQTtJQUFZOztPQUNBLFdBQVY7T0FBZSxhQUFmOztPQUNVLFlBQWY7O09BQ1ksWUFBTjs7QUFFYixTQUFRLEtBQUssR0FBRyxLQUFLO0FBQ3JCLFFBQVEsTUFBTSxNQUFNOztBQUVwQixnQkFBTTs7bUJBQUssS0FBSyxJQUFJLEVBQUUsRUFBRSxPQUFTOzs7QUFDakMsZ0JBQU0sR0FBRTs7bUJBQUssRUFBRSxjQUFnQixFQUFFOzs7QUFFakMsbUJBQVMsT0FBTSxHQUFFLEdBQUU7O1dBQUssT0FBTyxNQUFNLE9BQU8sRUFBRSxHQUFHOzs7O0lBSTdDLFFBQVMsS0FBSyxNQUFNOzs7O2dCQU9oQixPQUFPLE1BQU8sRUFBRyxHQUFJLEtBQUssT0FBWSxNQUFNLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ3pELE9BQU8sTUFBTyxFQUFHLEdBQUksS0FBSyxPQUFZLE1BQU0sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFJekQsT0FBTyxNQUFPLEVBQUcsR0FBSSxLQUFLLE9BQVksTUFBTSxLQUFPLEVBQUUsRUFBRSxHQUFHO2dCQUcxRCxPQUFPLE1BQU8sRUFBRyxHQUFJLEtBQUssT0FBWSxNQUFNLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBRXpELE9BQU8sTUFBTyxFQUFHLEdBQUksS0FBSyxVQUFZLE1BQU0sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFDekQsT0FBTyxNQUFPLEVBQUcsR0FBSSxLQUFLLFVBQVksTUFBTSxLQUFPLEVBQUUsRUFBRSxHQUFHO2dCQUMxRCxPQUFPLE1BQU8sRUFBRyxHQUFJLEtBQUssV0FBWSxNQUFNLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ3pELE9BQU8sTUFBTyxFQUFHLEdBQUksS0FBSyxXQUFZLE1BQU0sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFHekQsT0FBTyxNQUFPLEVBQUcsR0FBSSxLQUFL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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/novim.kode
