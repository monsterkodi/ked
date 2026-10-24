var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var afterstring, aobj, array, before, bigwords, brackets, cells, copies, cur, findlines, history, instring, iobj, key, keys, lead, lobj, m, mrange, multiline, nobj, onKeys, parens, pasted, pkey, plain, pobj, press, qobj, quoted, s, savedCopy, savedPaste, savedTool, segls, single, sobj, stack, stxt, text, txt, wobj, Wobj, words

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import clip from "../../kxk/clip.js"

import belt from "../edit/tool/belt.js"
import motion from "../edit/tool/motion.js"

import state from "../edit/state.js"
import mode from "../edit/mode.js"

import novim from "../edit/mode/novim.js"
import brckts from "../edit/mode/brckts.js"

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
        compare(mrange(segls,8,0,{kind:'word',count:1}),[8,0,0,1])
        compare(mrange(segls,8,1,{kind:'word',count:1}),[8,1,9,1])
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
    await section("character find", async function ()
    {
        findlines = kseg.segls("a-b\nc-d")
        compare(mrange(findlines,0,0,{kind:'charFind',target:'-',count:1}),[0,0,2,0])
        compare(mrange(findlines,0,0,{kind:'charFind',target:'-',count:2}),[0,0,2,1])
        compare(mrange(findlines,0,0,{kind:'charFind',target:'-',count:1,till:true}),[0,0,1,0])
        compare(mrange(findlines,0,0,{kind:'charFind',target:'-',count:2,till:true}),[0,0,1,1])
        compare(mrange(findlines,3,1,{kind:'charFind',target:'-',count:1,forward:false}),[1,1,3,1])
        compare(mrange(findlines,3,1,{kind:'charFind',target:'-',count:2,forward:false}),[1,0,3,1])
        compare(mrange(findlines,3,1,{kind:'charFind',target:'-',count:1,forward:false,till:true}),[2,1,3,1])
        compare(mrange(kseg.segls("x\n-a\nb-c"),0,0,{kind:'charFind',target:'-',count:1,till:true}),[0,0,1,2])
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
toExport["text object ranges"] = async function ()
{
    words = kseg.segls("one two three four")
    wobj = function (x, area, count)
    {
        return mrange(words,x,0,{kind:'textObject',area:area,target:'word',count:count})
    }
    compare(wobj(5,'inner',1),[4,0,7,0])
    compare(wobj(5,'around',1),[4,0,8,0])
    compare(wobj(0,'inner',1),[0,0,3,0])
    compare(wobj(0,'around',1),[0,0,4,0])
    compare(wobj(14,'around',1),[13,0,18,0])
    compare(wobj(3,'inner',1),[3,0,4,0])
    compare(wobj(3,'around',1),[4,0,8,0])
    compare(wobj(0,'inner',2),[0,0,7,0])
    compare(wobj(0,'around',2),[0,0,8,0])
    compare(wobj(0,'inner',3),[0,0,13,0])
    compare(wobj(0,'around',4),[0,0,18,0])
    compare(mrange(kseg.segls("foo\nbar"),0,0,{kind:'textObject',area:'inner',target:'word',count:2}),[0,0,3,1])
    bigwords = kseg.segls("foo.bar baz, qux")
    Wobj = function (x, area, count)
    {
        return mrange(bigwords,x,0,{kind:'textObject',area:area,target:'WORD',count:count})
    }
    compare(Wobj(0,'inner',1),[0,0,7,0])
    compare(Wobj(0,'around',1),[0,0,8,0])
    compare(Wobj(2,'inner',1),[0,0,7,0])
    compare(Wobj(8,'inner',1),[8,0,12,0])
    compare(Wobj(0,'inner',2),[0,0,12,0])
    compare(Wobj(0,'around',3),[0,0,16,0])
    quoted = kseg.segls('say "hello there" ok')
    qobj = function (x, area)
    {
        return mrange(quoted,x,0,{kind:'textObject',area:area,target:'"',count:1})
    }
    compare(qobj(7,'inner'),[5,0,16,0])
    compare(qobj(7,'around'),[4,0,18,0])
    compare(qobj(0,'inner'),[5,0,16,0])
    compare(mrange(quoted,20,0,{kind:'textObject',area:'inner',target:'"',count:1}),null)
    lead = kseg.segls('x = "abc"')
    lobj = function (x, area)
    {
        return mrange(lead,x,0,{kind:'textObject',area:area,target:'"',count:1})
    }
    compare(lobj(5,'inner'),[5,0,8,0])
    compare(lobj(5,'around'),[3,0,9,0])
    single = kseg.segls("a 'b c' d")
    sobj = function (x)
    {
        return mrange(single,x,0,{kind:'textObject',area:'inner',target:"'",count:1})
    }
    compare(sobj(4),[3,0,6,0])
    parens = kseg.segls('call(one, two) end')
    pobj = function (x, area)
    {
        return mrange(parens,x,0,{kind:'textObject',area:area,target:'(',count:1})
    }
    compare(pobj(8,'inner'),[5,0,13,0])
    compare(pobj(8,'around'),[4,0,14,0])
    compare(mrange(kseg.segls('f(a[1]) x'),4,0,{kind:'textObject',area:'inner',target:'(',count:1}),[2,0,6,0])
    compare(pobj(0,'inner'),[5,0,13,0])
    brackets = kseg.segls('x[one] y{two}')
    compare(mrange(brackets,3,0,{kind:'textObject',area:'inner',target:'[',count:1}),[2,0,5,0])
    compare(mrange(brackets,10,0,{kind:'textObject',area:'inner',target:'{',count:1}),[9,0,12,0])
    array = kseg.segls("if seg not in ['', undefined, ' ', '}', ']', ')']")
    aobj = function (x, area)
    {
        return mrange(array,x,0,{kind:'textObject',area:area,target:'[',count:1})
    }
    compare(aobj(21,'inner'),[15,0,48,0])
    compare(aobj(21,'around'),[14,0,49,0])
    compare(aobj(14,'inner'),[15,0,48,0])
    compare(aobj(41,'inner'),[15,0,48,0])
    compare(aobj(48,'inner'),[15,0,48,0])
    instring = kseg.segls("x = '[' + y]")
    iobj = function (x)
    {
        return mrange(instring,x,0,{kind:'textObject',area:'inner',target:'[',count:1})
    }
    compare(iobj(5),null)
    afterstring = kseg.segls("x = '[' ; a[b]")
    nobj = function (x)
    {
        return mrange(afterstring,x,0,{kind:'textObject',area:'inner',target:'[',count:1})
    }
    compare(nobj(0),[12,0,13,0])
    multiline = kseg.segls(`foo(
  bar
)`)
    compare(mrange(multiline,3,1,{kind:'textObject',area:'inner',target:'(',count:1}),[4,0,0,2])
    compare(mrange(multiline,3,1,{kind:'textObject',area:'around',target:'(',count:1}),[3,0,1,2])
    compare(mrange(kseg.segls('nothing here'),0,0,{kind:'textObject',area:'inner',target:'(',count:1}),null)
}
toExport["text object ranges"]._section_ = true
toExport["cursor to start and end of line"] = async function ()
{
    s.loadLines(belt.linesForText("one two\nfour"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'move',motion:{kind:'eol'}})
    cur(7,0)
    s.setMainCursor(6,0)
    s.executeNovim({operator:'move',motion:{kind:'bol'}})
    cur(0,0)
    s.loadLines(belt.linesForText("\nabc"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'move',motion:{kind:'eol'}})
    cur(0,0)
}
toExport["cursor to start and end of line"]._section_ = true
toExport["yank motions"] = async function ()
{
    s.loadLines(belt.linesForText("one two three\nfour five"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'yank',motion:{kind:'word',count:1}})
    compare(s.novimRegister.lines,['one '])
    compare(s.novimRegister.linewise,false)
    cur(0,0)
    s.setMainCursor(8,0)
    s.executeNovim({operator:'yank',motion:{kind:'drow',count:1}})
    compare(s.novimRegister.lines,['two '])
    cur(4,0)
    s.loadLines(belt.linesForText("alpha\nbeta\ngamma"))
    s.setMainCursor(3,1)
    s.executeNovim({operator:'yank',motion:{kind:'line',count:1}})
    compare(s.novimRegister.lines,['beta'])
    compare(s.novimRegister.linewise,true)
    cur(3,1)
    s.executeNovim({operator:'yank',motion:{kind:'lineDown',count:1}})
    compare(s.novimRegister.lines,['beta','gamma'])
    history = s.h.length
    s.executeNovim({operator:'yank',motion:{kind:'word',count:1}})
    compare(s.h.length,history)
    txt("alpha\nbeta\ngamma")
}
toExport["yank motions"]._section_ = true
toExport["put"] = async function ()
{
    s.loadLines(belt.linesForText("alpha\nbeta"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'yank',motion:{kind:'line',count:1}})
    s.executeNovim({operator:'put',after:true})
    txt("alpha\nalpha\nbeta")
    cur(0,1)
    s.executeNovim({operator:'put',after:false})
    txt("alpha\nalpha\nalpha\nbeta")
    cur(0,1)
    s.loadLines(belt.linesForText("  alpha\nbeta"))
    s.setMainCursor(2,0)
    s.executeNovim({operator:'yank',motion:{kind:'line',count:1}})
    s.setMainCursor(0,1)
    s.executeNovim({operator:'put',after:false})
    txt("  alpha\n  alpha\nbeta")
    cur(2,1)
    s.loadLines(belt.linesForText("x\ny"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'yank',motion:{kind:'line',count:1}})
    s.setMainCursor(0,1)
    s.executeNovim({operator:'put',after:true,count:2})
    txt("x\ny\nx\nx")
    cur(0,3)
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'yank',motion:{kind:'eol'}})
    s.setMainCursor(3,1)
    s.executeNovim({operator:'put',after:true})
    txt("abc\ndefabc")
    cur(6,1)
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'yank',motion:{kind:'eol'}})
    s.setMainCursor(1,1)
    s.executeNovim({operator:'put',after:false})
    txt("abc\ndabcef")
    cur(4,1)
    s.novimRegister = {lines:['one','two'],linewise:false}
    s.loadLines(belt.linesForText("ab"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'put',after:true})
    txt("aone\ntwob")
    cur(3,1)
    s.novimRegister = null
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'put',after:true})
    txt("abc")
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setMainCursor(0,0)
    before = s.h.length
    s.executeNovim({operator:'yank',motion:{kind:'line',count:1}})
    s.executeNovim({operator:'put',after:true,count:3})
    compare((s.h.length - before),1)
    s.executeNovim({operator:'undo',count:1})
    txt("abc\ndef")
}
toExport["put"]._section_ = true
toExport["delete fills the register"] = async function ()
{
    s.loadLines(belt.linesForText("one two\nthree"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'line',count:1}})
    compare(s.novimRegister.lines,['one two'])
    compare(s.novimRegister.linewise,true)
    txt("three")
    s.executeNovim({operator:'put',after:false})
    txt("one two\nthree")
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(1,0)
    s.executeNovim({operator:'delete',motion:{kind:'char',count:1}})
    compare(s.novimRegister.lines,['b'])
    compare(s.novimRegister.linewise,false)
    txt("ac")
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(3,0)
    s.executeNovim({operator:'delete',motion:{kind:'eol'}})
    compare(s.novimRegister.lines,[' two'])
    compare(s.novimRegister.linewise,false)
    txt("one")
    s.loadLines(belt.linesForText("abcd"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'char',count:2}})
    s.executeNovim({operator:'repeat',count:1})
    compare(s.novimRegister.lines,['cd'])
    txt("")
}
toExport["delete fills the register"]._section_ = true
toExport["clipboard registers"] = async function ()
{
    copies = []
    savedCopy = clip.copy
    savedPaste = clip.paste
    savedTool = clip.tool
    pasted = ''
    clip.tool = 'wl'
    clip.copy = function (text)
    {
        return copies.push(text)
    }
    clip.paste = function ()
    {
        return pasted
    }
    novim.clipboardSync = null
    global.ked_screen = {}
    compare(novim.isHeadless(),false)
    compare(novim.clipboardEnabled(),true)
    global.ked_screen = undefined
    compare(novim.isHeadless(),true)
    compare(novim.clipboardEnabled(),false)
    s.loadLines(belt.linesForText("one\ntwo"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'yank',motion:{kind:'line',count:1}})
    compare(copies,[])
    s.executeNovim({operator:'put',after:true})
    txt("one\none\ntwo")
    compare(novim.toggleClipboard(),true)
    compare(novim.clipboardEnabled(),true)
    s.loadLines(belt.linesForText("one\ntwo"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'yank',motion:{kind:'line',count:1}})
    compare(copies,['one\n'])
    pasted = "shared\n"
    s.executeNovim({operator:'put',after:true})
    txt("one\nshared\ntwo")
    pasted = "XYZ"
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(1,0)
    s.executeNovim({operator:'put',after:true})
    txt("abXYZc")
    s.loadLines(belt.linesForText("gone\nkept"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'line',count:1}})
    compare(copies.slice(-1)[0],'gone\n')
    novim.clipboardSync = false
    compare(novim.clipboardEnabled(),false)
    s.loadLines(belt.linesForText("alpha\nbeta"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'yank',motion:{kind:'line',count:1},register:'clipboard'})
    compare(copies.slice(-1)[0],'alpha\n')
    compare(s.novimRegister.linewise,true)
    pasted = "plus\n"
    s.executeNovim({operator:'put',after:true,register:'clipboard'})
    txt("alpha\nplus\nbeta")
    pasted = "star"
    s.loadLines(belt.linesForText("ab"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'put',after:true,register:'clipboard'})
    txt("astarb")
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'char',count:1}})
    compare(s.novimRegister.lines,['a'])
    m = new novim(s)
    key = function (c)
    {
        return m.handleKey(c,{combo:c,char:c})
    }
    keys = function (s, x, y)
    {
        var c

        var list = _k_.list(s)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            key(c)
        }
        if ((x != null))
        {
            return cur(x,y)
        }
    }
    s.loadLines(belt.linesForText("one\ntwo"))
    s.setMainCursor(0,0)
    keys('"+yy')
    compare(copies.slice(-1)[0],'one\n')
    compare(s.novimRegister.lines,['one'])
    keys('"*yy')
    compare(copies.slice(-1)[0],'one\n')
    before = copies.length
    keys('""yy')
    compare(copies.length,before)
    s.loadLines(belt.linesForText("one\ntwo"))
    s.setMainCursor(0,0)
    key('"')
    m.handleKey('esc',{combo:'esc'})
    key('x')
    txt("ne\ntwo")
    clip.tool = 'none'
    clip.text = ''
    s.loadLines(belt.linesForText("fall\nback"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'yank',motion:{kind:'line',count:1},register:'clipboard'})
    compare(clip.text,'fall\n')
    s.loadLines(belt.linesForText("fall\nback"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'put',after:true,register:'clipboard'})
    txt("fall\nfall\nback")
    clip.tool = 'wl'
    novim.clipboardSync = null
    clip.copy = savedCopy
    clip.paste = savedPaste
    clip.tool = savedTool
}
toExport["clipboard registers"]._section_ = true
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
toExport["undo command"] = async function ()
{
    s.loadLines(belt.linesForText("alpha beta\ngamma delta"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'word',count:1}})
    txt("beta\ngamma delta")
    s.executeNovim({operator:'undo',count:1})
    txt("alpha beta\ngamma delta")
    cur(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'line',count:1}})
    s.executeNovim({operator:'delete',motion:{kind:'line',count:1}})
    txt("")
    s.executeNovim({operator:'undo',count:2})
    txt("alpha beta\ngamma delta")
    s.executeNovim({operator:'undo',count:5})
    txt("alpha beta\ngamma delta")
}
toExport["undo command"]._section_ = true
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
toExport["execute text objects"] = async function ()
{
    s.loadLines(belt.linesForText("one two three four"))
    s.setMainCursor(5,0)
    s.executeNovim({operator:'delete',motion:{kind:'textObject',area:'inner',target:'word',count:1}})
    txt("one  three four")
    s.loadLines(belt.linesForText("one two three four"))
    s.setMainCursor(5,0)
    s.executeNovim({operator:'delete',motion:{kind:'textObject',area:'around',target:'word',count:1}})
    txt("one three four")
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(7,0)
    s.executeNovim({operator:'delete',motion:{kind:'textObject',area:'inner',target:'word',count:1}})
    txt("one ")
    s.loadLines(belt.linesForText('say "hello there" ok'))
    s.setMainCursor(7,0)
    s.executeNovim({operator:'delete',motion:{kind:'textObject',area:'inner',target:'"',count:1}})
    txt('say "" ok')
    s.loadLines(belt.linesForText('say "hello there" ok'))
    s.setMainCursor(7,0)
    s.executeNovim({operator:'delete',motion:{kind:'textObject',area:'around',target:'"',count:1}})
    txt('say ok')
    s.loadLines(belt.linesForText("if seg not in ['', undefined, ' ', '}', ']', ')']"))
    s.setMainCursor(21,0)
    s.executeNovim({operator:'delete',motion:{kind:'textObject',area:'inner',target:'[',count:1}})
    txt("if seg not in []")
    s.loadLines(belt.linesForText("if seg not in ['', undefined, ' ', '}', ']', ')']"))
    s.setMainCursor(21,0)
    s.executeNovim({operator:'delete',motion:{kind:'textObject',area:'around',target:'[',count:1}})
    txt("if seg not in ")
    s.loadLines(belt.linesForText("foo(\n  bar\n)"))
    s.setMainCursor(3,1)
    s.executeNovim({operator:'delete',motion:{kind:'textObject',area:'around',target:'(',count:1}})
    txt("foo")
    s.loadLines(belt.linesForText("alpha"))
    s.setMainCursor(3,0)
    s.executeNovim({operator:'delete',motion:{kind:'charBack',count:1}})
    txt("alha")
    s.loadLines(belt.linesForText("alpha"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'char',count:1}})
    txt("lpha")
    s.loadLines(belt.linesForText("alpha"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'charBack',count:1}})
    txt("alpha")
}
toExport["execute text objects"]._section_ = true
toExport["repeat command"] = async function ()
{
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'char',count:1}})
    txt("bcdef")
    s.executeNovim({operator:'repeat',count:1})
    txt("cdef")
    s.executeNovim({operator:'repeat',count:2})
    txt("ef")
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'char',count:2}})
    txt("cdef")
    s.executeNovim({operator:'repeat',count:1})
    txt("ef")
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'char',count:1}})
    s.executeNovim({operator:'move',motion:{kind:'right',count:1}})
    s.executeNovim({operator:'repeat',count:1})
    txt("bdef")
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'char',count:1}})
    s.executeNovim({operator:'undo',count:1})
    txt("abcdef")
    s.executeNovim({operator:'repeat',count:1})
    txt("bcdef")
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'delete',motion:{kind:'textObject',area:'around',target:'word',count:1}})
    txt("two three")
    s.executeNovim({operator:'repeat',count:1})
    txt("three")
    s.lastChange = null
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'repeat',count:1})
    txt("abc")
}
toExport["repeat command"]._section_ = true
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
    keys = function (s, x, y)
    {
        var c

        var list = _k_.list(s)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            c = list[_b_]
            key(c)
        }
        if ((x != null))
        {
            return cur(x,y)
        }
    }
    keys('d2w')
    txt(`gamma delta`)
    s.loadLines(belt.linesForText(text))
    s.setMainCursor(0,0)
    key('d')
    m.handleKey('esc',{combo:'esc'})
    txt(text)
    compare(m.operator,null)
    key('x')
    txt(`lpha beta
gamma delta`)
    s.loadLines(belt.linesForText(text))
    s.setMainCursor(0,0)
    keys('dw')
    txt(`beta
gamma delta`)
    key('u')
    txt(text)
    s.loadLines(belt.linesForText("abc def"))
    s.setMainCursor(4,0)
    key('d')
    m.handleKey('left',{combo:'left'})
    txt("abcdef")
    s.loadLines(belt.linesForText("abc def"))
    s.setMainCursor(4,0)
    key('d')
    m.handleKey('right',{combo:'right'})
    txt("abc ef")
    s.loadLines(belt.linesForText("abc\ndef\nghi"))
    s.setMainCursor(0,1)
    key('d')
    m.handleKey('down',{combo:'down'})
    txt("abc")
    s.loadLines(belt.linesForText("abc\ndef\nghi"))
    s.setMainCursor(0,1)
    key('d')
    m.handleKey('up',{combo:'up'})
    txt("ghi")
    s.loadLines(belt.linesForText("alpha"))
    s.setMainCursor(3,0)
    keys('dh')
    txt("alha")
    s.loadLines(belt.linesForText("alpha"))
    s.setMainCursor(0,0)
    keys('dl')
    txt("lpha")
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(5,0)
    keys('diw')
    txt("one  three")
    compare(m.operator,null)
    s.loadLines(belt.linesForText('say "hello there" ok'))
    s.setMainCursor(7,0)
    keys('da"')
    txt("say ok")
    s.loadLines(belt.linesForText("if seg not in ['', undefined, ' ', '}', ']', ')']"))
    s.setMainCursor(21,0)
    keys('di[')
    txt("if seg not in []")
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(0,0)
    keys('d2iw')
    txt(" three")
    s.loadLines(belt.linesForText("abc"))
    keys('di')
    m.handleKey('esc',{combo:'esc'})
    txt("abc")
    compare(m.area,null)
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    key('x')
    txt("bcdef")
    key('.')
    txt("cdef")
    keys('2.')
    txt("ef")
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    keys('xl.')
    txt("bdef")
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(0,0)
    keys('daw')
    txt("two three")
    key('.')
    txt("three")
    s.loadLines(belt.linesForText("one\n  two\n  three"))
    s.setMainCursor(0,0)
    keys('gg',0,0)
}
toExport["keys"]._section_ = true
toExport["search highlights"] = async function ()
{
    s.loadLines(belt.linesForText("foo\nbar\nfoo\nbar\nfoo"))
    s.setMainCursor(0,0)
    s.setHighlights([[0,0,3,0],[0,2,3,2],[0,4,3,4]])
    key('n')
    cur(0,2)
    key('n')
    cur(0,4)
    key('n')
    cur(0,4)
    s.setMainCursor(0,4)
    key('N')
    cur(0,2)
    key('N')
    cur(0,0)
    s.setMainCursor(0,0)
    key('2')
    key('n')
    cur(0,4)
    s.setMainCursor(0,0)
    key('N')
    cur(0,0)
    s.setMainCursor(0,0)
    key('n')
    compare(s.s.highlights,[[0,0,3,0],[0,2,3,2],[0,4,3,4]])
    key('N')
    compare(s.s.highlights,[[0,0,3,0],[0,2,3,2],[0,4,3,4]])
    key('j')
    compare(s.s.highlights,[])
    s.setMainCursor(0,0)
    key('n')
    cur(0,0)
    key('N')
    cur(0,0)
    s.loadLines(belt.linesForText("foo\nbar"))
    s.setMainCursor(0,0)
    key('/')
    txt("foo\nbar")
}
toExport["search highlights"]._section_ = true
toExport["brckts lets novim handle text keys"] = async function ()
{
    stack = new state(cells,'stack')
    mode.modes.novim = novim
    mode.modes.brckts = brckts
    mode.start(stack,'brckts')
    mode.start(stack,'novim')
    press = function (c)
    {
        return mode.handleKey(stack,c,{combo:c,char:c})
    }
    stxt = function (t)
    {
        return compare(kseg.str(stack.s.lines),t)
    }
    onKeys = function (text, x, y, keys)
    {
        var c

        stack.loadLines(belt.linesForText(text))
        stack.setMainCursor(x,y)
        mode.stop(stack,'novim')
        mode.start(stack,'novim')
        var list = _k_.list(keys)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            c = list[_c_]
            press(c)
        }
    }
    onKeys('say "hello there" ok',4,0,['d','i','"'])
    stxt('say "" ok')
    onKeys('say "hello there" ok',16,0,['d','i','"'])
    stxt('say "" ok')
    onKeys("a 'b c' d",2,0,['d','i',"'"])
    stxt("a '' d")
    onKeys("a 'b c' d",6,0,['d','i',"'"])
    stxt("a '' d")
    onKeys('call(x)',6,0,['d','i',')'])
    stxt('call()')
    onKeys('a [b] c',4,0,['d','a',']'])
    stxt('a  c')
    onKeys('a {b} c',4,0,['d','a','}'])
    stxt('a  c')
    mode.stop(stack,'novim')
    mode.stop(stack,'brckts')
}
toExport["brckts lets novim handle text keys"]._section_ = true
toExport["brckts still types without novim"] = async function ()
{
    plain = new state(cells,'plain')
    mode.modes.brckts = brckts
    mode.start(plain,'brckts')
    pkey = function (c)
    {
        return mode.handleKey(plain,c,{combo:c,char:c})
    }
    plain.loadLines(belt.linesForText('say "hi" ok'))
    plain.setMainCursor(4,0)
    pkey('"')
    compare(plain.mainCursor(),[5,0])
    compare(kseg.str(plain.s.lines),'say "hi" ok')
    plain.loadLines(belt.linesForText('x = '))
    plain.setMainCursor(4,0)
    pkey('"')
    compare(plain.mainCursor(),[5,0])
    compare(kseg.str(plain.s.lines),'x = ""')
    mode.stop(plain,'brckts')
}
toExport["brckts still types without novim"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvbm92aW0ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FPVSxVQUFBO0lBQVk7O09BQ0EsV0FBWjs7T0FDWSxXQUFWO09BQWUsYUFBZjs7T0FDVSxZQUFmO09BQXFCLFdBQXJCOztPQUNlLFlBQVQ7T0FBZSxhQUFmOztBQUViLFNBQVEsS0FBSyxHQUFHLEtBQUs7QUFDckIsUUFBUSxNQUFNLE1BQU07O0FBRXBCLGdCQUFNOzttQkFBSyxLQUFLLElBQUksRUFBRSxFQUFFLE9BQVM7OztBQUNqQyxnQkFBTSxHQUFFOzttQkFBSyxFQUFFLGNBQWdCLEVBQUU7OztBQUVqQyxtQkFBUyxPQUFNLEdBQUUsR0FBRTs7V0FBSyxPQUFPLE1BQU0sT0FBTyxFQUFFLEdBQUc7Ozs7SUFJN0MsUUFBUyxLQUFLLE1BQU07Ozs7Z0JBU2hCLE9BQU8sTUFBTyxFQUFHLEdBQUksS0FBSyxPQUFZLE1BQU0sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFDekQsT0FBTyxNQUFPLEVBQUcsR0FBSSxLQUFLLE9BQVksTUFBTSxLQUFPLEVBQUUsRUFBRSxFQUFFO2dCQUN6RCxPQUFPLE1BQU8sRUFBRyxHQUFJLEtBQUssT0FBWSxNQUFNLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ3pELE9BQU8sTUFBTyxFQUFHLEdBQUksS0FBSyxPQUFZLE1BQU0sS0FBTyxFQUFFLEVBQUUsRUFBRTs7OztnQkFJekQsT0FBTyxNQUFPLEVBQUcsR0FBSSxLQUFLLE9BQVksTUFBTSxLQUFPLEVBQUUsRUFBRSxFQUFFO2dCQUN6RCxPQUFPLE1BQU8sRUFBRyxHQUFJLEtBQUssT0FBWSxNQUFNLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ3pELE9BQU8sTUFBTyxFQUFHLEdBQUksS0FBSyxPQUFZLE1BQU0sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFDekQsT0FBTyxNQUFPLEVBQUcsR0FBSSxLQUFLLFdBQVksTUFBTSxLQUFPLEVBQUUsRUFB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RSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssUUFBUyxPQUFPLE9BQVEsTUFBTTtJQUNqRyxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssU0FBVSxPQUFPLE9BQVEsTUFBTTtJQUNsRyxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssUUFBUyxPQUFPLE9BQVEsTUFBTTtJQUNqRyxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssUUFBUyxPQUFPLElBQUssTUFBTTtJQUM5RixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssU0FBVSxPQUFPLElBQUssTUFBTTtJQUMvRixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsR0FBRztJQUVuQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssUUFBUyxPQUFPLElBQUssTUFBTTtJQUM5RixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsR0FBRztJQUVuQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssU0FBVSxPQUFPLElBQUssTUFBTTtJQUMvRixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/novim.kode
