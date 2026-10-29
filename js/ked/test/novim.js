var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var afterstring, aobj, array, back, before, bigwords, brackets, capture, cells, clean, copies, cur, dirty, e, enter, esc, findlines, flines, h, history, instring, iobj, key, keys, lead, lobj, m, mrange, msents, multiline, nobj, onKeys, paras, parens, pasted, pkey, plain, pobj, press, qobj, quits, quoted, s, savedCopy, savedPaste, savedTool, saves, segls, sents, single, sobj, stack, stxt, text, titles, txt, wobj, Wobj, words, writes

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let sleep = kxk.sleep
let post = kxk.post

import clip from "../../kxk/clip.js"

import belt from "../edit/tool/belt.js"
import motion from "../edit/tool/motion.js"

import state from "../edit/state.js"
import mode from "../edit/mode.js"
import editor from "../edit/editor.js"

import novim from "../edit/mode/novim.js"
import brckts from "../edit/mode/brckts.js"

import theme from "../theme/theme.js"

import harness from "../util/harness.js"

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
    await section("sentences", async function ()
    {
        sents = kseg.segls("one two. three four. five six.")
        compare(mrange(sents,0,0,{kind:'sentence',count:1}),[0,0,9,0])
        compare(mrange(sents,0,0,{kind:'sentence',count:2}),[0,0,21,0])
        compare(mrange(sents,9,0,{kind:'sentence',count:1}),[9,0,21,0])
        compare(mrange(sents,21,0,{kind:'sentence',count:1}),[21,0,30,0])
        compare(mrange(sents,14,0,{kind:'sentenceBack',count:1}),[9,0,14,0])
        compare(mrange(sents,9,0,{kind:'sentenceBack',count:1}),[0,0,9,0])
        compare(mrange(sents,0,0,{kind:'sentenceBack',count:1}),[0,0,0,0])
        compare(mrange(sents,25,0,{kind:'sentenceBack',count:2}),[9,0,25,0])
        msents = kseg.segls("one two\nthree. four\n\nfive six")
        compare(mrange(msents,0,0,{kind:'sentence',count:1}),[0,0,7,1])
        compare(mrange(msents,0,1,{kind:'sentence',count:1}),[0,1,7,1])
        compare(mrange(msents,0,1,{kind:'sentence',count:2}),[0,1,0,2])
        compare(mrange(msents,0,2,{kind:'sentence',count:1}),[0,2,0,3])
        compare(mrange(msents,0,3,{kind:'sentenceBack',count:1}),[0,2,0,3])
        compare(mrange(msents,0,3,{kind:'sentenceBack',count:2}),[7,1,0,3])
        compare(mrange(kseg.segls('nothing here'),0,0,{kind:'sentence',count:1}),[0,0,12,0])
    })
    await section("paragraphs", async function ()
    {
        paras = kseg.segls("a\n\nb\nc\n\nd")
        compare(mrange(paras,0,0,{kind:'paragraph',count:1}),[0,0,0,1])
        compare(mrange(paras,0,1,{kind:'paragraph',count:1}),[0,1,0,4])
        compare(mrange(paras,0,2,{kind:'paragraph',count:1}),[0,2,0,4])
        compare(mrange(paras,1,2,{kind:'paragraph',count:1}),[1,2,1,3])
        compare(mrange(paras,0,4,{kind:'paragraph',count:1}),[0,4,1,5])
        compare(mrange(paras,0,0,{kind:'paragraph',count:2}),[0,0,0,4])
        compare(mrange(paras,0,5,{kind:'paragraphBack',count:1}),[0,4,0,5])
        compare(mrange(paras,0,2,{kind:'paragraphBack',count:1}),[0,1,0,2])
        compare(mrange(paras,0,1,{kind:'paragraphBack',count:1}),[0,0,0,1])
        compare(mrange(paras,2,3,{kind:'paragraphBack',count:1}),[0,1,1,3])
        compare(mrange(paras,0,0,{kind:'paragraphBack',count:1}),[0,0,0,0])
        compare(mrange(paras,0,5,{kind:'paragraphBack',count:2}),[0,2,0,5])
    })
    await section("line first", async function ()
    {
        flines = kseg.segls("  one\n    two\n three")
        compare(mrange(flines,0,0,{kind:'lineFirstDown',count:1}),[0,0,7,1])
        compare(mrange(flines,0,0,{kind:'lineFirstDown',count:2}),[0,0,6,2])
        compare(mrange(flines,0,2,{kind:'lineFirstUp',count:1}),[0,1,6,2])
        compare(mrange(flines,0,2,{kind:'lineFirstUp',count:5}),[0,0,6,2])
        compare(mrange(flines,0,1,{kind:'lineFirst',count:1}),[0,1,7,1])
        compare(mrange(flines,0,1,{kind:'lineFirst',count:2}),[0,1,6,2])
        compare(mrange(flines,0,0,{kind:'lineFirst',count:5}),[0,0,6,2])
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
toExport["yank flash"] = async function ()
{
    s.loadLines(belt.linesForText("one two three\nfour five"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'yank',motion:{kind:'word',count:1}})
    compare(s.yankFlash,[[0,0,4,0]])
    s.clearYankFlash()
    compare(s.yankFlash,null)
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(0,0)
    s.startVisual('char')
    s.setMainCursor(2,0)
    s.updateVisual()
    s.executeNovim({operator:'visualYank'})
    compare(s.yankFlash,[[0,0,2,0]])
    compare(s.visual,null)
    s.clearYankFlash()
    compare(s.yankFlash,null)
}
toExport["yank flash"]._section_ = true
toExport["yank flash fades"] = async function ()
{
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'yank',motion:{kind:'word',count:1}})
    compare(s.yankFlash,[[0,0,4,0]])
}
toExport["yank flash fades"]._section_ = true
toExport["yank flash is drawn"] = async function ()
{
    h = new harness({rows:4,cols:24})
    e = new editor(h.screen,'test_yank',[])
    e.layout(0,0,24,4)
    e.state.loadLines(belt.linesForText("one two three"))
    e.state.setMainCursor(0,0)
    e.state.executeNovim({operator:'yank',motion:{kind:'word',count:1}})
    e.draw()
    compare(h.screen.get_bg(1,0),theme.novim.yank)
    compare(h.screen.get_bg(4,0),theme.editor.bg)
    e.state.clearYankFlash()
    e.draw()
    compare(h.screen.get_bg(1,0),theme.editor.bg)
}
toExport["yank flash is drawn"]._section_ = true
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
    txt("abc\nabcdef")
    cur(3,1)
    s.novimRegister = {lines:['one','two'],linewise:false}
    s.loadLines(belt.linesForText("ab"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'put',after:true})
    txt("one\ntwo\nab")
    cur(0,2)
    s.novimRegister = null
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'put',after:true})
    txt("abc")
}
toExport["put"]._section_ = true
toExport["put text at the cursor"] = async function ()
{
    s.novimRegister = {lines:['X'],linewise:false}
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'put',after:true})
    txt("Xabc")
    cur(1,0)
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(1,0)
    s.executeNovim({operator:'put',after:true})
    txt("aXbc")
    cur(2,0)
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(1,0)
    s.executeNovim({operator:'put',after:false})
    txt("Xabc")
    cur(1,0)
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(3,0)
    s.executeNovim({operator:'put',after:true})
    txt("abcX")
    cur(4,0)
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setMainCursor(0,0)
    before = s.h.length
    s.executeNovim({operator:'yank',motion:{kind:'line',count:1}})
    s.executeNovim({operator:'put',after:true,count:3})
    compare((s.h.length - before),1)
    s.executeNovim({operator:'undo',count:1})
    txt("abc\ndef")
}
toExport["put text at the cursor"]._section_ = true
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
    txt("aXYZbc")
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
    txt("starab")
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
toExport["change selects by motion"] = async function ()
{
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(5,0)
    s.selectByMotion({kind:'textObject',area:'inner',target:'word',count:1})
    txt("one two three")
    compare(s.s.selections,[[4,0,7,0]])
    cur(5,0)
    s.loadLines(belt.linesForText("one two\nthree four"))
    s.setCursors([[0,0],[0,1]])
    s.selectByMotion({kind:'word',count:1})
    txt("one two\nthree four")
    compare(s.s.selections,[[0,0,4,0],[0,1,6,1]])
    compare(s.allCursors(),[[0,0],[0,1]])
}
toExport["change selects by motion"]._section_ = true
toExport["change only selects"] = async function ()
{
    s.novimRegister = {lines:['keep'],linewise:false}
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(5,0)
    s.executeNovim({operator:'change',motion:{kind:'textObject',area:'inner',target:'word',count:1}})
    txt("one two three")
    compare(s.s.selections,[[4,0,7,0]])
    cur(7,0)
    compare(s.novimRegister.lines,['keep'])
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(5,0)
    s.executeNovim({operator:'change',motion:{kind:'textObject',area:'around',target:'word',count:1}})
    txt("one two three")
    compare(s.s.selections,[[4,0,8,0]])
    cur(8,0)
    s.loadLines(belt.linesForText("one two\nthree four"))
    s.setCursors([[0,0],[0,1]])
    s.executeNovim({operator:'change',motion:{kind:'word',count:1}})
    txt("one two\nthree four")
    compare(s.s.selections,[[0,0,4,0],[0,1,6,1]])
    compare(s.allCursors(),[[4,0],[6,1]])
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(4,0)
    s.executeNovim({operator:'change',motion:{kind:'eol'}})
    txt("one two")
    compare(s.s.selections,[[4,0,7,0]])
    cur(7,0)
    s.loadLines(belt.linesForText("one\ntwo"))
    s.setMainCursor(0,1)
    s.executeNovim({operator:'change',motion:{kind:'line',count:1}})
    txt("one\ntwo")
    compare(s.s.selections,[[0,1,3,1]])
    cur(3,1)
}
toExport["change only selects"]._section_ = true
toExport["typing replaces the change selection"] = async function ()
{
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(5,0)
    s.executeNovim({operator:'change',motion:{kind:'textObject',area:'inner',target:'word',count:1}})
    s.insert('X')
    txt("one X three")
}
toExport["typing replaces the change selection"]._section_ = true
toExport["change does not touch history"] = async function ()
{
    s.loadLines(belt.linesForText("alpha beta"))
    s.setMainCursor(0,0)
    before = s.h.length
    s.executeNovim({operator:'change',motion:{kind:'textObject',area:'inner',target:'word',count:1}})
    txt("alpha beta")
    compare(s.s.selections,[[0,0,5,0]])
    compare((s.h.length - before),0)
}
toExport["change does not touch history"]._section_ = true
toExport["change commands and keys"] = async function ()
{
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(5,0)
    keys('ciw')
    txt("one two three")
    compare(s.s.selections,[[4,0,7,0]])
    cur(7,0)
    compare(m.operator,null)
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(5,0)
    keys('caw')
    txt("one two three")
    compare(s.s.selections,[[4,0,8,0]])
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(4,0)
    keys('C')
    txt("one two")
    compare(s.s.selections,[[4,0,7,0]])
    cur(7,0)
    s.loadLines(belt.linesForText("one\ntwo"))
    s.setMainCursor(0,0)
    keys('S')
    txt("one\ntwo")
    compare(s.s.selections,[[0,0,3,0]])
    cur(3,0)
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    keys('s')
    txt("abcdef")
    compare(s.s.selections,[[0,0,1,0]])
    cur(1,0)
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    keys('2s')
    txt("abcdef")
    compare(s.s.selections,[[0,0,2,0]])
    cur(2,0)
    s.loadLines(belt.linesForText("one\ntwo"))
    s.setMainCursor(0,0)
    keys('cc')
    txt("one\ntwo")
    compare(s.s.selections,[[0,0,3,0]])
    cur(3,0)
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(0,0)
    keys('dw')
    txt("two three")
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(0,0)
    keys('ciw')
    txt("one two three")
    compare(s.s.selections,[[0,0,3,0]])
    s.lastChange = null
    s.novimInsert = null
    keys('.')
    txt("one two three")
    compare(s.s.selections,[[0,0,3,0]])
}
toExport["change commands and keys"]._section_ = true
toExport["change exits novim"] = async function ()
{
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(5,0)
    s.allowedModes.novim = true
    mode.modes.novim = novim
    mode.start(s,'novim')
    compare(mode.isActive(s,'novim'),true)
    s.executeNovim({operator:'change',motion:{kind:'textObject',area:'inner',target:'word',count:1}})
    compare(mode.isActive(s,'novim'),false)
    txt("one two three")
    compare(s.s.selections,[[4,0,7,0]])
    cur(7,0)
    delete s.allowedModes.novim
}
toExport["change exits novim"]._section_ = true
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
toExport["repeat insert"] = async function ()
{
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setMainCursor(0,0)
    keys('i')
    compare(s.novimInsert.kind,'insert')
    s.insert('X')
    s.finishNovimInsert()
    txt("Xabc\ndef")
    s.setMainCursor(0,1)
    s.executeNovim({operator:'repeat',count:1})
    txt("Xabc\nXdef")
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(0,0)
    keys('i')
    s.insert('new ')
    s.finishNovimInsert()
    txt("new one two")
    s.setMainCursor(0,4)
    s.executeNovim({operator:'repeat',count:2})
    txt("new new new one two")
}
toExport["repeat insert"]._section_ = true
toExport["repeat insert with backspace"] = async function ()
{
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setMainCursor(0,0)
    keys('i')
    s.insert('XY')
    s.delete('back',false)
    s.insert('Z')
    s.finishNovimInsert()
    txt("XZabc\ndef")
    s.setMainCursor(0,1)
    s.executeNovim({operator:'repeat',count:1})
    txt("XZabc\nXZdef")
}
toExport["repeat insert with backspace"]._section_ = true
toExport["repeat append"] = async function ()
{
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setMainCursor(0,1)
    keys('A')
    s.insert('Z')
    s.finishNovimInsert()
    txt("abc\ndefZ")
    s.setMainCursor(0,0)
    s.executeNovim({operator:'repeat',count:1})
    txt("abcZ\ndefZ")
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(0,0)
    keys('a')
    s.insert('X')
    s.finishNovimInsert()
    txt("aXbc")
    s.setMainCursor(0,0)
    s.executeNovim({operator:'repeat',count:1})
    txt("aXXbc")
}
toExport["repeat append"]._section_ = true
toExport["repeat open line"] = async function ()
{
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setMainCursor(0,0)
    keys('o')
    s.insert('new')
    s.finishNovimInsert()
    txt("abc\nnew\ndef")
    s.setMainCursor(0,0)
    s.executeNovim({operator:'repeat',count:1})
    txt("abc\nnew\nnew\ndef")
}
toExport["repeat open line"]._section_ = true
toExport["repeat change with text"] = async function ()
{
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(4,0)
    keys('ciw')
    s.insert('X')
    s.finishNovimInsert()
    txt("one X three")
    s.setMainCursor(8,0)
    s.executeNovim({operator:'repeat',count:1})
    txt("one X X")
}
toExport["repeat change with text"]._section_ = true
toExport["repeat change without text"] = async function ()
{
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(0,0)
    keys('ciw')
    s.finishNovimInsert()
    txt("one two")
    s.setMainCursor(0,0)
    s.executeNovim({operator:'repeat',count:1})
    txt(" two")
}
toExport["repeat change without text"]._section_ = true
toExport["repeat put"] = async function ()
{
    s.loadLines(belt.linesForText("one\ntwo"))
    s.setMainCursor(0,0)
    s.novimRegister = {lines:['new'],linewise:true}
    keys('p')
    txt("one\nnew\ntwo")
    s.setMainCursor(0,2)
    s.executeNovim({operator:'repeat',count:1})
    txt("one\nnew\ntwo\nnew")
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(0,0)
    s.novimRegister = {lines:['X'],linewise:false}
    keys('p')
    txt("Xone two")
    s.setMainCursor(4,0)
    s.executeNovim({operator:'repeat',count:1})
    txt("XoneX two")
}
toExport["repeat put"]._section_ = true
toExport["repeat visual delete"] = async function ()
{
    s.loadLines(belt.linesForText("abcdefg"))
    s.setMainCursor(0,0)
    keys('vlld')
    txt("cdefg")
    s.executeNovim({operator:'repeat',count:1})
    txt("efg")
    s.executeNovim({operator:'repeat',count:1})
    txt("g")
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(0,0)
    keys('Vd')
    txt("two\nthree")
    s.executeNovim({operator:'repeat',count:1})
    txt("three")
}
toExport["repeat visual delete"]._section_ = true
toExport["repeat visual change"] = async function ()
{
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    keys('vllc')
    s.insert('XY')
    s.finishNovimInsert()
    txt("XYcdef")
    s.setMainCursor(2,0)
    s.executeNovim({operator:'repeat',count:1})
    txt("XYXYef")
    s.loadLines(belt.linesForText("one\ntwo\nthree\nfour"))
    s.setMainCursor(0,0)
    keys('Vc')
    s.insert('X')
    s.finishNovimInsert()
    txt("Xtwo\nthree\nfour")
    s.setMainCursor(0,1)
    s.executeNovim({operator:'repeat',count:1})
    txt("Xtwo\nXfour")
}
toExport["repeat visual change"]._section_ = true
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
toExport["yank line command"] = async function ()
{
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(1,1)
    key('Y')
    compare(s.novimRegister.lines,['two'])
    compare(s.novimRegister.linewise,true)
    cur(1,1)
    txt("one\ntwo\nthree")
    s.setMainCursor(0,0)
    keys('2Y')
    compare(s.novimRegister.lines,['one','two'])
}
toExport["yank line command"]._section_ = true
toExport["open lines"] = async function ()
{
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setMainCursor(0,1)
    key('o')
    txt("abc\ndef\n")
    cur(0,2)
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setMainCursor(0,1)
    key('O')
    txt("abc\n\ndef")
    cur(0,1)
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(0,0)
    keys('2o')
    txt("abc\n\n")
    cur(0,2)
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(0,0)
    keys('2O')
    txt("\n\nabc")
    cur(0,0)
}
toExport["open lines"]._section_ = true
toExport["insert at first non blank"] = async function ()
{
    s.loadLines(belt.linesForText("    abc"))
    s.setMainCursor(6,0)
    s.allowedModes.novim = true
    mode.modes.novim = novim
    mode.start(s,'novim')
    key('I')
    cur(4,0)
    compare(mode.isActive(s,'novim'),false)
    delete s.allowedModes.novim
}
toExport["insert at first non blank"]._section_ = true
toExport["replace chars"] = async function ()
{
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(1,0)
    key('r')
    compare(m.replace,true)
    key('X')
    txt("aXcdef")
    cur(2,0)
    compare(m.replace,null)
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    keys('3rx')
    txt("xxxdef")
    cur(3,0)
    s.loadLines(belt.linesForText("ab"))
    s.setMainCursor(1,0)
    keys('3rx')
    txt("ab")
    cur(1,0)
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(0,0)
    keys('rX.')
    txt("XXc")
    cur(2,0)
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    key('r')
    m.handleKey('esc',{combo:'esc'})
    txt("abcdef")
    compare(m.replace,null)
}
toExport["replace chars"]._section_ = true
toExport["toggle case"] = async function ()
{
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(0,0)
    key('~')
    txt("Abc")
    cur(1,0)
    s.loadLines(belt.linesForText("aBc"))
    s.setMainCursor(0,0)
    keys('3~')
    txt("AbC")
    cur(2,0)
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(2,0)
    key('~')
    txt("abC")
    cur(2,0)
    s.loadLines(belt.linesForText("abcd"))
    s.setMainCursor(0,0)
    keys('~l.')
    txt("AbCd")
    cur(3,0)
}
toExport["toggle case"]._section_ = true
toExport["join lines"] = async function ()
{
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(0,0)
    key('J')
    txt("one two\nthree")
    cur(3,0)
    s.loadLines(belt.linesForText("one  \n   two\nthree"))
    s.setMainCursor(0,0)
    key('J')
    txt("one two\nthree")
    cur(3,0)
    s.loadLines(belt.linesForText("  one\n    two"))
    s.setMainCursor(0,0)
    key('J')
    txt("  one two")
    cur(5,0)
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(0,0)
    keys('3J')
    txt("one two three")
    cur(3,0)
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(0,1)
    key('J')
    txt("one\ntwo three")
    cur(3,1)
}
toExport["join lines"]._section_ = true
toExport["match bracket"] = async function ()
{
    s.loadLines(belt.linesForText("if (a[b]) { c }"))
    s.setMainCursor(3,0)
    key('%')
    cur(8,0)
    key('%')
    cur(3,0)
    s.setMainCursor(5,0)
    key('%')
    cur(7,0)
    s.setMainCursor(0,0)
    key('%')
    cur(8,0)
    s.loadLines(belt.linesForText("call(\n  x\n)"))
    s.setMainCursor(4,0)
    key('%')
    cur(0,2)
}
toExport["match bracket"]._section_ = true
toExport["sentence motions by keys"] = async function ()
{
    s.loadLines(belt.linesForText("one two. three four. five six."))
    s.setMainCursor(0,0)
    key(')')
    cur(9,0)
    key(')')
    cur(21,0)
    key('(')
    cur(9,0)
    key('(')
    cur(0,0)
    keys('2)')
    cur(21,0)
    s.setMainCursor(20,0)
    key('(')
    cur(9,0)
    s.loadLines(belt.linesForText("one two. three four."))
    s.setMainCursor(0,0)
    keys('d)')
    txt("three four.")
    s.loadLines(belt.linesForText("one two. three four."))
    s.setMainCursor(9,0)
    keys('d(')
    txt("three four.")
    s.loadLines(belt.linesForText("one two. three four."))
    s.setMainCursor(0,0)
    keys('v)')
    compare(s.s.selections,[[0,0,9,0]])
    cur(9,0)
    key('esc')
}
toExport["sentence motions by keys"]._section_ = true
toExport["paragraph motions by keys"] = async function ()
{
    s.loadLines(belt.linesForText("a\n\nb\nc\n\nd"))
    s.setMainCursor(0,0)
    key('}')
    cur(0,1)
    key('}')
    cur(0,4)
    key('{')
    cur(0,2)
    key('{')
    cur(0,1)
    key('{')
    cur(0,0)
    keys('2}')
    cur(0,4)
    s.setMainCursor(0,2)
    keys('d}')
    txt("a\n\nd")
    s.loadLines(belt.linesForText("hello world\nfoo bar\n\nbaz"))
    s.setMainCursor(6,0)
    keys('d}')
    txt("hello \n\nbaz")
    cur(6,0)
    s.loadLines(belt.linesForText("a\n\nb"))
    s.setMainCursor(0,0)
    keys('v}')
    compare(s.s.selections,[[0,0,0,1]])
    cur(0,1)
    key('esc')
}
toExport["paragraph motions by keys"]._section_ = true
toExport["line first motions by keys"] = async function ()
{
    s.loadLines(belt.linesForText("  one\n    two\n three"))
    s.setMainCursor(0,0)
    key('+')
    cur(4,1)
    key('+')
    cur(1,2)
    key('-')
    cur(4,1)
    key('_')
    cur(4,1)
    keys('2_')
    cur(1,2)
    s.setMainCursor(0,0)
    keys('5_')
    cur(1,2)
    s.loadLines(belt.linesForText("one\ntwo\nthree\nfour"))
    s.setMainCursor(0,1)
    keys('d+')
    txt("one\nfour")
    s.loadLines(belt.linesForText("one\ntwo\nthree\nfour"))
    s.setMainCursor(0,2)
    keys('d-')
    txt("one\nfour")
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(3,1)
    keys('d_')
    txt("one\nthree")
    s.loadLines(belt.linesForText("one\ntwo\nthree\nfour"))
    s.setMainCursor(3,0)
    keys('2d_')
    txt("three\nfour")
}
toExport["line first motions by keys"]._section_ = true
toExport["search word under cursor"] = async function ()
{
    s.loadLines(belt.linesForText("foo bar foo\nfoobar foo"))
    s.setMainCursor(0,0)
    key('*')
    cur(8,0)
    compare(novim.lastVind,'foo')
    compare(s.s.highlights,[[0,0,3],[8,0,11],[7,1,10]])
    key('*')
    cur(7,1)
    compare(s.s.highlights,[[0,0,3],[8,0,11],[7,1,10]])
    key('#')
    cur(8,0)
    s.loadLines(belt.linesForText("foo bar foo\nfoobar foo"))
    s.setMainCursor(0,0)
    key('#')
    cur(0,0)
    novim.lastVind = ''
}
toExport["search word under cursor"]._section_ = true
toExport["visual mode"] = async function ()
{
    s.loadLines(belt.linesForText("one two\nthree four"))
    s.setMainCursor(0,0)
    key('v')
    compare(s.visual,'char')
    compare(s.s.selections,[])
    cur(0,0)
    keys('l')
    compare(s.s.selections,[[0,0,1,0]])
    cur(1,0)
    keys('l')
    compare(s.s.selections,[[0,0,2,0]])
    cur(2,0)
    keys('h')
    compare(s.s.selections,[[0,0,1,0]])
    cur(1,0)
    keys('h')
    compare(s.s.selections,[])
    cur(0,0)
    key('V')
    compare(s.visual,'line')
    compare(s.s.selections,[[0,0,7,0]])
    cur(0,0)
    keys('j')
    compare(s.s.selections,[[0,0,10,1]])
    cur(0,1)
    key('esc')
    compare(s.visual,null)
    compare(s.s.selections,[])
    txt("one two\nthree four")
}
toExport["visual mode"]._section_ = true
toExport["visual multicursor"] = async function ()
{
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setCursors([[0,0],[0,2]])
    key('v')
    compare(s.s.selections,[])
    keys('l')
    compare(s.s.selections,[[0,0,1,0],[0,2,1,2]])
    compare(s.allCursors(),[[1,0],[1,2]])
    key('esc')
}
toExport["visual multicursor"]._section_ = true
toExport["visual vertical"] = async function ()
{
    s.loadLines(belt.linesForText("abcd\nefgh"))
    s.setMainCursor(1,0)
    key('v')
    key('j')
    compare(s.s.selections,[[1,0,1,1]])
    cur(1,1)
    key('$')
    compare(s.s.selections,[[1,0,4,1]])
    cur(4,1)
    key('esc')
}
toExport["visual vertical"]._section_ = true
toExport["visual line mode"] = async function ()
{
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(1,1)
    keys('Vj')
    compare(s.visual,'line')
    compare(s.s.selections,[[0,1,5,2]])
    cur(1,2)
    key('V')
    compare(s.visual,null)
    compare(s.s.selections,[])
}
toExport["visual line mode"]._section_ = true
toExport["visual block starts empty"] = async function ()
{
    s.loadLines(belt.linesForText("abcd\nefgh"))
    s.setMainCursor(0,0)
    key('ctrl+v')
    compare(s.visual,'block')
    compare(s.s.selections,[])
    cur(0,0)
    key('j')
    compare(s.visual,'block')
    compare(s.s.selections,[])
    cur(0,1)
    key('l')
    compare(s.s.selections,[[0,0,1,0],[0,1,1,1]])
    cur(1,1)
    key('l')
    compare(s.s.selections,[[0,0,2,0],[0,1,2,1]])
    cur(2,1)
    key('h')
    compare(s.s.selections,[[0,0,1,0],[0,1,1,1]])
    cur(1,1)
    key('h')
    compare(s.s.selections,[])
    cur(0,1)
    key('k')
    compare(s.s.selections,[])
    cur(0,0)
    key('l')
    compare(s.s.selections,[[0,0,1,0]])
    cur(1,0)
    key('j')
    compare(s.s.selections,[[0,0,1,0],[0,1,1,1]])
    cur(1,1)
    key('esc')
    compare(s.visual,null)
    compare(s.s.selections,[])
}
toExport["visual block starts empty"]._section_ = true
toExport["visual block toggles and switches"] = async function ()
{
    s.loadLines(belt.linesForText("abcd\nefgh"))
    s.setMainCursor(0,0)
    key('ctrl+v')
    key('ctrl+v')
    compare(s.visual,null)
    compare(s.s.selections,[])
    key('ctrl+v')
    key('v')
    compare(s.visual,'char')
    compare(s.s.selections,[])
    key('V')
    compare(s.visual,'line')
    compare(s.s.selections,[[0,0,4,0]])
    key('esc')
}
toExport["visual block toggles and switches"]._section_ = true
toExport["visual block delete"] = async function ()
{
    s.loadLines(belt.linesForText("abcd\nefgh"))
    s.setMainCursor(0,0)
    key('ctrl+v')
    keys('lj')
    compare(s.s.selections,[[0,0,1,0],[0,1,1,1]])
    key('d')
    txt("bcd\nfgh")
    compare(s.visual,null)
    compare(s.novimRegister.lines,['a','e'])
    compare(s.novimRegister.linewise,false)
    s.executeNovim({operator:'repeat',count:1})
    txt("cd\ngh")
}
toExport["visual block delete"]._section_ = true
toExport["visual block yank"] = async function ()
{
    s.loadLines(belt.linesForText("abcd\nefgh"))
    s.setMainCursor(0,0)
    key('ctrl+v')
    keys('lj')
    key('y')
    compare(s.novimRegister.lines,['a','e'])
    compare(s.novimRegister.linewise,false)
    compare(s.visual,null)
    compare(s.s.selections,[])
    cur(0,0)
    txt("abcd\nefgh")
}
toExport["visual block yank"]._section_ = true
toExport["visual block change"] = async function ()
{
    s.loadLines(belt.linesForText("abcd\nefgh"))
    s.setMainCursor(0,0)
    key('ctrl+v')
    keys('lj')
    key('c')
    txt("abcd\nefgh")
    compare(s.s.selections,[[0,0,1,0],[0,1,1,1]])
    s.insert('XY')
    txt("XYbcd\nXYfgh")
    compare(s.allCursors(),[[2,0],[2,1]])
    s.finishNovimInsert()
    s.setMainCursor(2,0)
    s.executeNovim({operator:'repeat',count:1})
    txt("XYXYcd\nXYXYgh")
}
toExport["visual block change"]._section_ = true
toExport["visual block prepend and append"] = async function ()
{
    s.loadLines(belt.linesForText("abcd\nefgh"))
    s.setMainCursor(0,0)
    key('ctrl+v')
    keys('lj')
    key('I')
    compare(s.visual,null)
    compare(s.s.selections,[])
    compare(s.allCursors(),[[0,0],[0,1]])
    s.insert('XY')
    s.finishNovimInsert()
    txt("XYabcd\nXYefgh")
    s.loadLines(belt.linesForText("abcd\nefgh"))
    s.setMainCursor(0,0)
    key('ctrl+v')
    keys('lj')
    key('A')
    compare(s.visual,null)
    compare(s.s.selections,[])
    compare(s.allCursors(),[[1,0],[1,1]])
    s.insert('XY')
    txt("aXYbcd\neXYfgh")
    s.loadLines(belt.linesForText("abcd\nefgh\nijkl"))
    s.setMainCursor(0,0)
    key('ctrl+v')
    keys('lj')
    key('I')
    s.insert('X')
    s.finishNovimInsert()
    txt("Xabcd\nXefgh\nijkl")
    s.setMainCursor(0,2)
    s.executeNovim({operator:'repeat',count:1})
    txt("Xabcd\nXefgh\nXijkl")
    key('ctrl+v')
    key('j')
    key('I')
    compare(s.visual,'block')
    compare(s.s.selections,[])
    key('esc')
}
toExport["visual block prepend and append"]._section_ = true
toExport["visual yank"] = async function ()
{
    s.novimRegister = null
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(0,0)
    keys('vlly')
    compare(s.novimRegister.lines,['on'])
    compare(s.novimRegister.linewise,false)
    compare(s.visual,null)
    compare(s.s.selections,[])
    cur(0,0)
    txt("one two")
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(1,1)
    keys('Vy')
    compare(s.novimRegister.lines,['two'])
    compare(s.novimRegister.linewise,true)
}
toExport["visual yank"]._section_ = true
toExport["visual delete"] = async function ()
{
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(0,0)
    keys('vlld')
    txt("e two")
    compare(s.novimRegister.lines,['on'])
    compare(s.visual,null)
    cur(0,0)
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(0,1)
    keys('Vd')
    txt("one\nthree")
    compare(s.novimRegister.lines,['two'])
    compare(s.novimRegister.linewise,true)
    cur(0,1)
}
toExport["visual delete"]._section_ = true
toExport["visual change"] = async function ()
{
    s.loadLines(belt.linesForText("one two"))
    s.setMainCursor(0,0)
    keys('vllc')
    txt("one two")
    compare(s.s.selections,[[0,0,2,0]])
    cur(2,0)
    compare(s.visual,null)
    s.insert('X')
    txt("Xe two")
}
toExport["visual change"]._section_ = true
toExport["visual swap ends"] = async function ()
{
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(1,0)
    keys('vll')
    compare(s.s.selections,[[1,0,3,0]])
    cur(3,0)
    key('o')
    compare(s.s.selections,[[1,0,3,0]])
    cur(1,0)
    key('o')
    cur(3,0)
    key('esc')
}
toExport["visual swap ends"]._section_ = true
toExport["visual counts and find"] = async function ()
{
    s.loadLines(belt.linesForText("a b c d"))
    s.setMainCursor(0,0)
    keys('v2l')
    compare(s.s.selections,[[0,0,2,0]])
    cur(2,0)
    key('esc')
    s.loadLines(belt.linesForText("a b c d"))
    s.setMainCursor(0,0)
    keys('vf ')
    compare(s.s.selections,[[0,0,1,0]])
    cur(1,0)
    key('esc')
}
toExport["visual counts and find"]._section_ = true
toExport["visual bracket"] = async function ()
{
    s.loadLines(belt.linesForText("if (a[b]) c"))
    s.setMainCursor(3,0)
    keys('v%')
    compare(s.s.selections,[[3,0,8,0]])
    cur(8,0)
    key('esc')
}
toExport["visual bracket"]._section_ = true
toExport["visual escape stays in novim"] = async function ()
{
    s.loadLines(belt.linesForText("abc"))
    s.setMainCursor(0,0)
    s.allowedModes.novim = true
    mode.modes.novim = novim
    mode.start(s,'novim')
    key('v')
    key('esc')
    compare(s.visual,null)
    compare(s.s.selections,[])
    compare(mode.isActive(s,'novim'),true)
    mode.stop(s,'novim')
    delete s.allowedModes.novim
}
toExport["visual escape stays in novim"]._section_ = true
toExport["indent lines"] = async function ()
{
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(0,0)
    keys('>>')
    txt("    one\ntwo\nthree")
    cur(4,0)
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(0,0)
    keys('2>>')
    txt("    one\n    two\nthree")
    cur(4,0)
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(0,0)
    keys('>j')
    txt("    one\n    two\nthree")
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(0,0)
    keys('>>j.')
    txt("    one\n    two\nthree")
}
toExport["indent lines"]._section_ = true
toExport["deindent lines"] = async function ()
{
    s.loadLines(belt.linesForText("    one\n        two\n            three"))
    s.setMainCursor(0,0)
    keys('<<')
    txt("one\n        two\n            three")
    cur(0,0)
    s.loadLines(belt.linesForText("    one\n        two\n            three"))
    s.setMainCursor(0,0)
    keys('2<<')
    txt("one\n    two\n            three")
    cur(0,0)
    s.loadLines(belt.linesForText("    one\n        two\n            three"))
    s.setMainCursor(0,0)
    keys('<j')
    txt("one\n    two\n            three")
}
toExport["deindent lines"]._section_ = true
toExport["visual indent"] = async function ()
{
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(1,1)
    keys('Vj>')
    txt("one\n    two\n    three")
    compare(s.visual,'line')
    compare(s.s.selections,[[0,1,9,2]])
    cur(5,2)
    key('>')
    txt("one\n        two\n        three")
    compare(s.visual,'line')
    compare(s.s.selections,[[0,1,13,2]])
    cur(9,2)
    s.loadLines(belt.linesForText("    one\n        two\n            three"))
    s.setMainCursor(1,1)
    keys('Vj<')
    txt("    one\n    two\n        three")
    compare(s.visual,'line')
    compare(s.s.selections,[[0,1,13,2]])
    cur(0,2)
    s.loadLines(belt.linesForText("one\ntwo\nthree"))
    s.setMainCursor(0,1)
    keys('vlj>')
    txt("one\n    two\n    three")
    compare(s.visual,'char')
    compare(s.s.selections,[[4,1,5,2]])
    cur(5,2)
}
toExport["visual indent"]._section_ = true
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
toExport["ex commands"] = async function ()
{
    m = new novim(s)
    key = function (c)
    {
        return m.handleKey(c,{combo:c,char:c})
    }
    keys = function (t)
    {
        var c

        var list = _k_.list(t)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            c = list[_c_]
            key(c)
        }
    }
    enter = function ()
    {
        return m.handleKey('return',{combo:'return',char:'\n'})
    }
    back = function ()
    {
        return m.handleKey('backspace',{combo:'backspace'})
    }
    esc = function ()
    {
        return m.handleKey('esc',{combo:'esc',char:''})
    }
    quits = 0
    saves = []
    writes = []
    titles = []
    capture = true
    clean = function ()
    {
        return s.clearHistory()
    }
    dirty = function ()
    {
        s.clearHistory()
        return s.pushState()
    }
    post.on('quit',function ()
    {
        return quits += 1
    })
    post.on('file.saveAndQuit',function (file)
    {
        return saves.push((file != null ? file : null))
    })
    post.on('file.save',function (file)
    {
        return writes.push((file != null ? file : null))
    })
    post.on('title.novim',function (t)
    {
        if (capture)
        {
            return titles.push(t)
        }
    })
    clean()
    keys(':q')
    compare(m.ex,'q')
    compare(titles.slice(-1)[0],':q')
    enter()
    compare(quits,1)
    compare(writes,[])
    compare(saves,[])
    compare(m.ex,null)
    dirty()
    keys(':q')
    enter()
    compare(quits,1)
    keys(':q!')
    compare(m.ex,'q!')
    compare(titles.slice(-1)[0],':q!')
    enter()
    compare(quits,2)
    compare(writes,[])
    compare(saves,[])
    keys('3:q')
    compare(m.ex,'q')
    compare(titles.slice(-1)[0],':q')
    esc()
    compare(m.ex,null)
    keys(':wqq')
    back()
    compare(m.ex,'wq')
    esc()
    compare(m.ex,null)
    clean()
    keys(':w')
    enter()
    compare(writes,[null])
    compare(saves,[])
    compare(quits,2)
    compare(m.ex,null)
    capture = false
}
toExport["ex commands"]._section_ = true
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
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            c = list[_d_]
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvbm92aW0ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FPVSxVQUFBO0lBQVk7SUFBSztJQUFNOztPQUNYLFdBQVo7O09BQ1ksV0FBVjtPQUFlLGFBQWY7O09BQ1UsWUFBZjtPQUFxQixXQUFyQjtPQUEwQixhQUExQjs7T0FDZSxZQUFUO09BQWUsYUFBZjs7T0FDUyxZQUFmOztPQUNlLGNBQWY7O0FBRVAsU0FBUSxLQUFLLEdBQUcsS0FBSztBQUNyQixRQUFRLE1BQU0sTUFBTTs7QUFFcEIsZ0JBQU07O21CQUFLLEtBQUssSUFBSSxFQUFFLEVBQUUsT0FBUzs7O0FBQ2pDLGdCQUFNLEdBQUU7O21CQUFLLEVBQUUsY0FBZ0IsRUFBRTs7O0FBRWpDLG1CQUFTLE9BQU0sR0FBRSxHQUFFOztXQUFLLE9BQU8sTUFBTSxPQUFPLEVBQUUsR0FBRzs7OztJQUk3QyxRQUFTLEtBQUssTUFBTTs7OztnQkFPaEIsT0FBTyxNQUFPLEVBQUcsR0FBSSxLQUFLLE9BQVksTUFBTSxLQUFPLEVBQUUsRUFBRSxFQUFFO2dCQUN6RCxPQUFPLE1BQU8sRUFBRyxHQUFJLEtBQUssT0FBWSxNQUFNLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ3pELE9BQU8sTUFBTyxFQUFHLEdBQUksS0FBSyxPQUFZLE1BQU0sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFDekQsT0FBTyxNQUFPLEVBQUcsR0FBSSxLQUFLLE9BQVksTUFBTSxLQUFPLEVBQUUsRUFBRSxFQUFFOzs7O2dCQUl6RCxPQUFPLE1BQU8sRUFBRyxHQUFJLEtBQUssT0FBWSxNQUFNLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ3pELE9BQU8sTUFBTyxFQUFHLEdBQUksS0FBSyxPQUFZLE1BQU0sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFDekQsT0FBTyxNQUFPLEVBQUcsR0FBSSxLQUFLLE9BQVksTUFBTSxLQUFPLEVBQUUsRUFBRSxFQUFFO2dCQUN6RCxPQUFP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QUFjLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssYUFBYyxLQUFLLFFBQVMsT0FBTyxPQUFRLE1BQU07SUFDakcsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssYUFBYyxLQUFLLFNBQVUsT0FBTyxPQUFRLE1BQU07SUFDbEcsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssYUFBYyxLQUFLLFFBQVMsT0FBTyxPQUFRLE1BQU07SUFDakcsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssYUFBYyxLQUFLLFFBQVMsT0FBTyxJQUFLLE1BQU07SUFDOUYsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssYUFBYyxLQUFLLFNBQVUsT0FBTyxJQUFLLE1BQU07SUFDL0YsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEdBQUc7SUFFbkIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssYUFBYyxLQUFLLFFBQVMsT0FBTyxJQUFLLE1BQU07SUFDOUYsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEdBQUc7SUFFbkIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssYUFBYyxLQUFLLFNBQVUsT0FBTyxJQUFLLE1BQU07SUFDL0YsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssYUFBYyxLQUFLLFNBQVUsT0FBTyxJQUFLLE1BQU07SUFDL0YsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssV0FBWSxNQUFNO0lBQ2xFLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEVBQUUsY0FBYyxTQUFTLFNBQVUsUUFBUSxLQUFLLE9BQVEsTUFBTTtJQUM5RCxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxXQUFZLE1BQU07SUFDbEUsSUFBSTs7Ozs7SUFJSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEVBQUUsZ0JBQWdCLEtBQUssYUFBYyxLQUFLLFFBQVMsT0FBTyxPQUFRLE1BQU07SUFFeEUsSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO0lBRXZCLEVBQUUsZ0JBQWdCLEtBQUssT0FBUSxNQUFNO0lBRXJDLElBQUk7WUFDSixFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ25DLEVBQUUsZUFBaUIsRUFBRSxJQUFJLEVBQUU7Ozs7O0lBSTNCLEVBQUUsaUJBQWtCLE9BQVEsUUFBUyxTQUFVO0lBRS9DLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssYUFBYyxLQUFLLFFBQVMsT0FBTyxPQUFRLE1BQU07SUFFakcsSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtZQUNOLEVBQUUsY0FBYyxPQUFTO0lBRXpCLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssYUFBYyxLQUFLLFNBQVUsT0FBTyxPQUFRLE1BQU07SUFFbEcsSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO0lBRXZCLEVBQUUsY0FBYyxTQUFTLFNBQVUsUUFBUSxLQUFLLE9BQVEsTUFBTTtJQUU5RCxJQUFJO1lBQ0osRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUNuQyxFQUFFLGVBQWlCLEVBQUUsSUFBSSxFQUFFO0lBRTNCLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUs7SUFFaEQsSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxRQUFRLEtBQUssT0FBUSxNQUFNO0lBRTlELElBQUk7WUFDSixFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRTtJQUN6QixJQUFJLEVBQUU7Ozs7O0lBSU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssUUFBUyxPQUFPLE9BQVEsTUFBTTtJQUNqRyxFQUFFLE9BQU87SUFFVCxJQUFJOzs7OztJQUlKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFDbEIsU0FBUyxFQUFFLEVBQUU7SUFFYixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssUUFBUyxPQUFPLE9BQVEsTUFBTTtJQUVqRyxJQUFJO1lBQ0osRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7YUFDeEIsRUFBRSxFQUFFLFNBQVMsUUFBVTs7Ozs7SUFJeEIsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUNsQixLQUFLO0lBQ0wsSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtZQUNOLEVBQUUsU0FBVztJQUViLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFDbEIsS0FBSztJQUNMLElBQUk7WUFDSixFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRTtJQUV6QixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLEtBQUs7SUFDTCxJQUFJO1lBQ0osRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7SUFDekIsSUFBSSxFQUFFO0lBRU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUNsQixLQUFLO0lBQ0wsSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFDbEIsS0FBSztJQUNMLElBQUk7WUFDSixFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRTtJQUN6QixJQUFJLEVBQUU7SUFFTixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLEtBQUs7SUFDTCxJQUFJO1lBQ0osRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7SUFDekIsSUFBSSxFQUFFO0lBRU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUNsQixLQUFLO0lBQ0wsSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFDbEIsS0FBSztJQUNMLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLEtBQUs7SUFDTCxJQUFJO1lBQ0osRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7SUFFekIsRUFBRSxhQUFhO0lBQ2YsRUFBRSxjQUFjO0lBRWhCLEtBQUs7SUFDTCxJQUFJO1lBQ0osRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7Ozs7O0lBSXpCLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsRUFBRSxhQUFhLFFBQVE7SUFDdkIsS0FBSyxNQUFNLFFBQVE7SUFDbkIsS0FBSyxNQUFNLEVBQUU7WUFFYixLQUFLLFNBQVMsRUFBRSxTQUFVO0lBRTFCLEVBQUUsY0FBYyxTQUFTLFNBQVUsUUFBUSxLQUFLLGFBQWMsS0FBSyxRQUFTLE9BQU8sT0FBUSxNQUFNO1lBRWpHLEtBQUssU0FBUyxFQUFFLFNBQVU7SUFDMUIsSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtXQUVDLEVBQUUsYUFBYTs7Ozs7SUFJdEIsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxPQUFRLE1BQU07SUFDOUQsSUFBSTtJQUVKLEVBQUUsY0FBYyxTQUFTLFNBQVUsTUFBTTtJQUN6QyxJQUFJO0lBRUosRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEVBQUUsY0FBYyxTQUFTLFNBQVUsUUFBUSxLQUFLLE9BQVEsTUFBTTtJQUM5RCxJQUFJO0lBRUosRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEVBQUUsY0FBYyxTQUFTLFNBQVUsUUFBUSxLQUFLLE9BQVEsTUFBTTtJQUM5RCxFQUFFLGNBQWMsU0FBUyxPQUFRLFFBQVEsS0FBSyxRQUFTLE1BQU07SUFDN0QsRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEVBQUUsY0FBYyxTQUFTLFNBQVUsUUFBUSxLQUFLLE9BQVEsTUFBTTtJQUM5RCxFQUFFLGNBQWMsU0FBUyxPQUFRLE1BQU07SUFDdkMsSUFBSTtJQUVKLEVBQUUsY0FBYyxTQUFTLFNBQVUsTUFBTTtJQUN6QyxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssU0FBVSxPQUFPLE9BQVEsTUFBTTtJQUNsRyxJQUFJO0lBRUosRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7SUFFSixFQUFFLGFBQWE7SUFDZixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEVBQUUsY0FBYyxTQUFTLFNBQVUsTUFBTTtJQUN6QyxJQUFJOzs7OztJQUlKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztZQUNMLEVBQUUsWUFBWSxLQUFPO0lBQ3JCLEVBQUUsT0FBTztJQUNULEVBQUU7SUFDRixJQUFJO0lBRUosRUFBRSxjQUFjLEVBQUU7SUFDbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7SUFDTCxFQUFFLE9BQU87SUFDVCxFQUFFO0lBQ0YsSUFBSTtJQUVKLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLEVBQUUsY0FBYyxTQUFTLFNBQVUsTUFBTTtJQUN6QyxJQUFJOzs7OztJQUlKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLEVBQUUsT0FBTztJQUNULEVBQUUsT0FBTyxPQUFPO0lBQ2hCLEVBQUUsT0FBTztJQUNULEVBQUU7SUFDRixJQUFJO0lBRUosRUFBRSxjQUFjLEVBQUU7SUFDbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsRUFBRSxPQUFPO0lBQ1QsRUFBRTtJQUNGLElBQUk7SUFFSixFQUFFLGNBQWMsRUFBRTtJQUNsQixFQUFFLGNBQWMsU0FBUyxTQUFVLE1BQU07SUFDekMsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLEVBQUUsT0FBTztJQUNULEVBQUU7SUFDRixJQUFJO0lBRUosRUFBRSxjQUFjLEVBQUU7SUFDbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsRUFBRSxPQUFPO0lBQ1QsRUFBRTtJQUNGLElBQUk7SUFFSixFQUFFLGNBQWMsRUFBRTtJQUNsQixFQUFFLGNBQWMsU0FBUyxTQUFVLE1BQU07SUFDekMsSUFBSTs7Ozs7SUFJSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7SUFDTCxFQUFFLE9BQU87SUFDVCxFQUFFO0lBQ0YsSUFBSTtJQUVKLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLEVBQUUsY0FBYyxTQUFTLFNBQVUsTUFBTTtJQUN6QyxJQUFJOzs7OztJQUlKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLEVBQUU7SUFDRixJQUFJO0lBRUosRUFBRSxjQUFjLEVBQUU7SUFDbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUNsQixFQUFFLGlCQUFrQixPQUFRLE9BQVEsU0FBVTtJQUU5QyxLQUFLO0lBQ0wsSUFBSTtJQUVKLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLEVBQUUsY0FBYyxTQUFTLFNBQVUsTUFBTTtJQUN6QyxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUNsQixFQUFFLGlCQUFrQixPQUFRLEtBQU0sU0FBVTtJQUU1QyxLQUFLO0lBQ0wsSUFBSTtJQUVKLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLEVBQUUsY0FBYyxTQUFTLFNBQVUsTUFBTTtJQUN6QyxJQUFJOzs7OztJQUlKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLElBQUk7SUFFSixFQUFFLGNBQWMsU0FBUyxTQUFVLE1BQU07SUFDekMsSUFBSTtJQUVKLEVBQUUsY0FBYyxTQUFTLFNBQVUsTUFBTTtJQUN6QyxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtJQUVKLEVBQUUsY0FBYyxTQUFTLFNBQVUsTUFBTTtJQUN6QyxJQUFJOzs7OztJQUlKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLEVBQUUsT0FBTztJQUNULEVBQUU7SUFDRixJQUFJO0lBRUosRUFBRSxjQUFjLEVBQUU7SUFDbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7SUFDTCxFQUFFLE9BQU87SUFDVCxFQUFFO0lBQ0YsSUFBSTtJQUVKLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLEVBQUUsY0FBYyxTQUFTLFNBQVUsTUFBTTtJQUN6QyxJQUFJOzs7OztJQUlKLE9BQU87O0lBS1AsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUU5QixRQUFRLE1BQU07SUFFZCxnQkFBTTs7ZUFBSyxFQUFFLFVBQVUsR0FBRyxNQUFNLEVBQUcsS0FBSzs7SUFDeEMsaUJBQU8sR0FBRSxHQUFFOzs7OzRCQUNFOzs7WUFBTDtZQUNBLElBQUk7O2FBQ0c7O21CQUFYLElBQUksRUFBRTs7O0lBRVYsS0FBSztJQUNMLElBQUk7SUFJSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixFQUFFLFVBQVUsT0FBTyxNQUFNO0lBRXpCLElBQUk7WUFDSixFQUFFLFNBQVc7SUFFYixJQUFJO0lBRUosSUFBSTs7SUFLSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7SUFDTCxJQUFJOztJQUtKLElBQUk7SUFDSixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osRUFBRSxVQUFVLFFBQVEsTUFBTTtJQUMxQixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osRUFBRSxVQUFVLFNBQVMsTUFBTTtJQUMzQixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osRUFBRSxVQUFVLFFBQVEsTUFBTTtJQUMxQixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osRUFBRSxVQUFVLE1BQU0sTUFBTTtJQUN4QixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7SUFDTCxJQUFJO1lBQ0osRUFBRSxTQUFXO0lBRWIsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEdBQUc7SUFFbkIsS0FBSztJQUNMLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7SUFDTCxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUU5QixLQUFLO0lBQ0wsRUFBRSxVQUFVLE9BQU8sTUFBTTtJQUN6QixJQUFJO1lBQ0osRUFBRSxLQUFPO0lBRVQsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osSUFBSTtJQUVKLElBQUk7SUFDSixJQUFJO0lBRUosS0FBSztJQUNMLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7SUFDTCxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtJQUVKLElBQUk7SUFDSixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUNsQixLQUFLLEtBQU8sRUFBRTs7Ozs7SUFJZCxFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7WUFDSixFQUFFLGNBQWMsT0FBUztZQUN6QixFQUFFLGNBQWMsU0FBVztJQUMzQixJQUFJLEVBQUU7SUFDTixJQUFJO0lBRUosRUFBRSxjQUFjLEVBQUU7SUFDbEIsS0FBSztZQUNMLEVBQUUsY0FBYyxPQUFTLE1BQU07Ozs7O0lBSS9CLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLElBQUk7SUFDSixJQUFJLEVBQUU7Ozs7O0lBSU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGFBQWEsUUFBUTtJQUN2QixLQUFLLE1BQU0sUUFBUTtJQUNuQixLQUFLLE1BQU0sRUFBRTtJQUViLElBQUk7SUFDSixJQUFJLEVBQUU7WUFDTixLQUFLLFNBQVMsRUFBRSxTQUFVO1dBRW5CLEVBQUUsYUFBYTs7Ozs7SUFJdEIsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO1lBQ0osRUFBRSxRQUFVO0lBQ1osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJLEVBQUU7WUFDTixFQUFFLFFBQVU7SUFFWixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7SUFDTCxJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixFQUFFLFVBQVUsT0FBTyxNQUFNO0lBQ3pCLElBQUk7WUFDSixFQUFFLFFBQVU7Ozs7O0lBSVosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtJQUNKLElBQUksRUFBRTs7Ozs7SUFJTixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7SUFDTCxJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUksRUFBRTs7Ozs7SUFJTixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sRUFBRSxjQUFjLEVBQUU7SUFDbEIsSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLElBQUk7SUFDSixJQUFJLEVBQUU7Ozs7O0lBSU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sSUFBSTtJQUNKLElBQUksR0FBRztJQUVQLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sS0FBSztJQUNMLElBQUksR0FBRztJQUVQLEVBQUUsY0FBYyxHQUFHO0lBQ25CLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLEtBQUs7SUFDTCxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUNsQixLQUFLO0lBQ0wsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFDbEIsS0FBSztZQUNMLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUNOLElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLEtBQUs7SUFDTCxJQUFJLEVBQUU7SUFFTixFQUFFLGNBQWMsRUFBRTtJQUNsQixLQUFLO0lBQ0wsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFDbEIsS0FBSztJQUNMLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLEtBQUs7WUFDTCxFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRTtJQUN6QixJQUFJLEVBQUU7SUFDTixJQUFJOzs7OztJQUlKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLEtBQUs7SUFDTCxJQUFJLEVBQUU7SUFFTixFQUFFLGNBQWMsRUFBRTtJQUNsQixLQUFLO0lBQ0wsSUFBSSxFQUFFO0lBRU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUNsQixLQUFLO0lBQ0wsSUFBSTtJQUVKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFDbEIsS0FBSztJQUNMLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBQ2xCLEtBQUs7SUFDTCxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUNsQixLQUFLO0lBQ0wsSUFBSTs7Ozs7SUFJSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixJQUFJLEVBQUU7WUFDTixNQUFNLFNBQVc7WUFDakIsRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFO0lBRXhDLElBQUk7SUFDSixJQUFJLEVBQUU7WUFDTixFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFFeEMsSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLE1BQU0sV0FBVzs7Ozs7SUFJakIsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO1lBQ0osRUFBRSxPQUFTO1lBQ1gsRUFBRSxFQUFFO0lBQ0osSUFBSSxFQUFFO0lBRU4sS0FBSztZQUNMLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUVOLEtBQUs7WUFDTCxFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRTtJQUN6QixJQUFJLEVBQUU7SUFFTixLQUFLO1lBQ0wsRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7SUFDekIsSUFBSSxFQUFFO0lBRU4sS0FBSztZQUNMLEVBQUUsRUFBRTtJQUNKLElBQUksRUFBRTtJQUVOLElBQUk7WUFDSixFQUFFLE9BQVM7WUFDWCxFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRTtJQUN6QixJQUFJLEVBQUU7SUFFTixLQUFLO1lBQ0wsRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEdBQUc7SUFDMUIsSUFBSSxFQUFFO0lBRU4sSUFBSTtZQUNKLEVBQUUsT0FBUztZQUNYLEVBQUUsRUFBRTtJQUNKLElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUU7SUFFdkIsSUFBSTtZQUNKLEVBQUUsRUFBRTtJQUVKLEtBQUs7WUFDTCxFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ25DLEVBQUUsZUFBaUIsRUFBRSxJQUFJLEVBQUU7SUFFM0IsSUFBSTs7Ozs7SUFJSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixJQUFJO1lBQ0osRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7SUFDekIsSUFBSSxFQUFFO0lBRU4sSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUVOLElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO1lBQ0wsRUFBRSxPQUFTO1lBQ1gsRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7SUFDekIsSUFBSSxFQUFFO0lBRU4sSUFBSTtZQUNKLEVBQUUsT0FBUztZQUNYLEVBQUUsRUFBRTs7Ozs7SUFJSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7WUFDSixFQUFFLE9BQVM7WUFDWCxFQUFFLEVBQUU7SUFDSixJQUFJLEVBQUU7SUFFTixJQUFJO1lBQ0osRUFBRSxPQUFTO1lBQ1gsRUFBRSxFQUFFO0lBQ0osSUFBSSxFQUFFO0lBRU4sSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7SUFDbkMsSUFBSSxFQUFFO0lBRU4sSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7SUFDbkMsSUFBSSxFQUFFO0lBRU4sSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7SUFDbkMsSUFBSSxFQUFFO0lBRU4sSUFBSTtZQUNKLEVBQUUsRUFBRTtJQUNKLElBQUksRUFBRTtJQUVOLElBQUk7WUFDSixFQUFFLEVBQUU7SUFDSixJQUFJLEVBQUU7SUFFTixJQUFJO1lBQ0osRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7SUFDekIsSUFBSSxFQUFFO0lBRU4sSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7SUFDbkMsSUFBSSxFQUFFO0lBRU4sSUFBSTtZQUNKLEVBQUUsT0FBUztZQUNYLEVBQUUsRUFBRTs7Ozs7SUFJSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixJQUFJO1lBQ0osRUFBRSxPQUFTO1lBQ1gsRUFBRSxFQUFFO0lBRUosSUFBSTtJQUNKLElBQUk7WUFDSixFQUFFLE9BQVM7WUFDWCxFQUFFLEVBQUU7SUFFSixJQUFJO1lBQ0osRUFBRSxPQUFTO1lBQ1gsRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7SUFFekIsSUFBSTs7Ozs7SUFJSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixLQUFLO1lBQ0wsRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtJQUVuQyxJQUFJO0lBQ0osSUFBSTtZQUNKLEVBQUUsT0FBUztZQUNYLEVBQUUsY0FBYyxPQUFTLElBQUk7WUFDN0IsRUFBRSxjQUFjLFNBQVc7SUFFM0IsRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osS0FBSztJQUNMLElBQUk7WUFFSixFQUFFLGNBQWMsT0FBUyxJQUFJO1lBQzdCLEVBQUUsY0FBYyxTQUFXO1lBQzNCLEVBQUUsT0FBUztZQUNYLEVBQUUsRUFBRTtJQUNKLElBQUksRUFBRTtJQUNOLElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osS0FBSztJQUNMLElBQUk7SUFFSixJQUFJO1lBQ0osRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtJQUVuQyxFQUFFLE9BQU87SUFDVCxJQUFJO1lBQ0osRUFBRSxlQUFpQixFQUFFLElBQUksRUFBRTtJQUUzQixFQUFFO0lBRUYsRUFBRSxjQUFjLEVBQUU7SUFDbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osS0FBSztJQUNMLElBQUk7WUFFSixFQUFFLE9BQVM7WUFDWCxFQUFFLEVBQUU7WUFDSixFQUFFLGVBQWlCLEVBQUUsSUFBSSxFQUFFO0lBRTNCLEVBQUUsT0FBTztJQUNULEVBQUU7SUFDRixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osS0FBSztJQUNMLElBQUk7WUFFSixFQUFFLE9BQVM7WUFDWCxFQUFFLEVBQUU7WUFDSixFQUFFLGVBQWlCLEVBQUUsSUFBSSxFQUFFO0lBRTNCLEVBQUUsT0FBTztJQUNULElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixLQUFLO0lBQ0wsSUFBSTtJQUNKLEVBQUUsT0FBTztJQUNULEVBQUU7SUFDRixJQUFJO0lBRUosRUFBRSxjQUFjLEVBQUU7SUFDbEIsRUFBRSxjQUFjLFNBQVMsU0FBVSxNQUFNO0lBQ3pDLElBQUk7SUFFSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7WUFDSixFQUFFLE9BQVM7WUFDWCxFQUFFLEVBQUU7SUFFSixJQUFJOzs7OztJQUlKLEVBQUUsZ0JBQWdCO0lBQ2xCLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztZQUNMLEVBQUUsY0FBYyxPQUFTO1lBQ3pCLEVBQUUsY0FBYyxTQUFXO1lBQzNCLEVBQUUsT0FBUztZQUNYLEVBQUUsRUFBRTtJQUNKLElBQUksRUFBRTtJQUNOLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7WUFDTCxFQUFFLGNBQWMsT0FBUztZQUN6QixFQUFFLGNBQWMsU0FBVzs7Ozs7SUFJM0IsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtZQUNKLEVBQUUsY0FBYyxPQUFTO1lBQ3pCLEVBQUUsT0FBUztJQUNYLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLElBQUk7WUFDSixFQUFFLGNBQWMsT0FBUztZQUN6QixFQUFFLGNBQWMsU0FBVztJQUMzQixJQUFJLEVBQUU7Ozs7O0lBSU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtZQUNOLEVBQUUsT0FBUztJQUVYLEVBQUUsT0FBTztJQUNULElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO1lBQ0wsRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7SUFDekIsSUFBSSxFQUFFO0lBRU4sSUFBSTtZQUNKLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUVOLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixJQUFJOzs7OztJQUlKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztZQUNMLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUVOLElBQUk7SUFFSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7WUFDTCxFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRTtJQUN6QixJQUFJLEVBQUU7SUFFTixJQUFJOzs7OztJQUlKLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztZQUNMLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUVOLElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGFBQWEsUUFBUTtJQUN2QixLQUFLLE1BQU0sUUFBUTtJQUNuQixLQUFLLE1BQU0sRUFBRTtJQUViLElBQUk7SUFDSixJQUFJO1lBRUosRUFBRSxPQUFTO1lBQ1gsRUFBRSxFQUFFO1lBQ0osS0FBSyxTQUFTLEVBQUUsU0FBVTtJQUUxQixLQUFLLEtBQUssRUFBRTtXQUNMLEVBQUUsYUFBYTs7Ozs7SUFJdEIsRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7SUFDTCxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTs7Ozs7SUFJSixFQUFFLFVBQVUsS0FBSyxhQUFhO0lBQzlCLEVBQUUsY0FBYyxFQUFFO0lBRWxCLEtBQUs7SUFDTCxJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLElBQUk7Ozs7O0lBSUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtZQUNKLEVBQUUsT0FBUztZQUNYLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO0lBQ3pCLElBQUksRUFBRTtJQUVOLElBQUk7SUFDSixJQUFJO1lBQ0osRUFBRSxPQUFTO1lBQ1gsRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEdBQUc7SUFDMUIsSUFBSSxFQUFFO0lBRU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixLQUFLO0lBQ0wsSUFBSTtZQUNKLEVBQUUsT0FBUztZQUNYLEVBQUUsRUFBRSxhQUFlLEVBQUUsRUFBRSxHQUFHO0lBQzFCLElBQUksRUFBRTtJQUVOLEVBQUUsVUFBVSxLQUFLLGFBQWE7SUFDOUIsRUFBRSxjQUFjLEVBQUU7SUFFbEIsS0FBSztJQUNMLElBQUk7WUFDSixFQUFFLE9BQVM7WUFDWCxFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRTtJQUN6QixJQUFJLEVBQUU7Ozs7O0lBSU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7SUFFNUMsSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sRUFBRSxjQUFjLEVBQUU7SUFDbEIsSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUksRUFBRTtJQUVOLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO1lBQ0osRUFBRSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO0lBRTdDLElBQUk7WUFDSixFQUFFLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7SUFFN0MsSUFBSTtZQUNKLEVBQUUsRUFBRTtJQUVKLEVBQUUsY0FBYyxFQUFFO0lBRWxCLElBQUk7SUFDSixJQUFJLEVBQUU7SUFFTixJQUFJO0lBQ0osSUFBSSxFQUFFO0lBRU4sRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixJQUFJO0lBQ0osSUFBSTs7Ozs7SUFJSixRQUFRLE1BQU07SUFFZCxnQkFBUTs7ZUFBSyxFQUFFLFVBQVUsR0FBRyxNQUFNLEVBQUcsS0FBSzs7SUFDMUMsaUJBQVE7Ozs7NEJBQ0s7OztZQUFMO1lBQ0EsSUFBSTs7O0lBQ1o7O2VBQVcsRUFBRSxVQUFVLFVBQWEsTUFBTSxTQUFVLEtBQUs7O0lBQ3pEOztlQUFXLEVBQUUsVUFBVSxhQUFhLE1BQU07O0lBQzFDOztlQUFXLEVBQUUsVUFBVSxPQUFhLE1BQU0sTUFBTyxLQUFLOztJQUV0RCxRQUFTO0lBQ1Q7SUFDQTtJQUNBO0lBQ0EsVUFBVTtJQUVWOztlQUFXLEVBQUU7O0lBQ2I7O1FBQ0ksRUFBRTtlQUNGLEVBQUU7O0lBRU4sS0FBSyxHQUFHOztlQUE2QixTQUFTOztJQUM5QyxLQUFLLEdBQUcsNkJBQW9COztlQUFTLE1BQU0sTUFBSyxlQUFBLE9BQU87O0lBQ3ZELEtBQUssR0FBRyxzQkFBb0I7O2VBQVMsT0FBTyxNQUFLLGVBQUEsT0FBTzs7SUFDeEQsS0FBSyxHQUFHLHdCQUFvQjs7WUFBMEI7O21CQUFqQixPQUFPLEtBQUs7OztJQUVqRDtJQUlBLEtBQUs7WUFFTCxFQUFFLEdBQVk7WUFDZCxvQkFBYztJQUVkO1lBRUEsTUFBUztZQUNUO1lBQ0E7WUFDQSxFQUFFLEdBQU87SUFJVDtJQUVBLEtBQUs7SUFDTDtZQUVBLE1BQWE7SUFJYixLQUFLO1lBRUwsRUFBRSxHQUFZO1lBQ2Qsb0JBQWM7SUFFZDtZQUVBLE1BQVM7WUFDVDtZQUNBO0lBSUEsS0FBSztZQUVMLEVBQUUsR0FBVztZQUNiLG9CQUFhO0lBRWI7WUFFQSxFQUFFLEdBQUs7SUFJUCxLQUFLO0lBQ0w7WUFFQSxFQUFFLEdBQUs7SUFFUDtZQUVBLEVBQUUsR0FBSztJQUlQO0lBRUEsS0FBSztJQUNMO1lBRUEsUUFBVTtZQUNWO1lBQ0EsTUFBUztZQUNULEVBQUUsR0FBTztJQUVULFVBQVU7Ozs7O0lBSVYsWUFBWSxNQUFNLE1BQU07SUFFeEIsS0FBSyxNQUFNLFFBQVM7SUFDcEIsS0FBSyxNQUFNLFNBQVM7SUFDcEIsS0FBSyxNQUFNLE1BQU07SUFDakIsS0FBSyxNQUFNLE1BQU07SUFFakIsa0JBQVE7O2VBQUssS0FBSyxVQUFVLE1BQU0sR0FBRyxNQUFNLEVBQUcsS0FBSzs7SUFDbkQsaUJBQVE7O3VCQUFLLEtBQUssSUFBSSxNQUFNLEVBQUUsT0FBUzs7SUFFdkMsbUJBQVUsTUFBSyxHQUFFLEdBQUU7Ozs7UUFDZixNQUFNLFVBQVUsS0FBSyxhQUFhO1FBQ2xDLE1BQU0sY0FBYyxFQUFFO1FBQ3RCLEtBQUssS0FBTSxNQUFNO1FBQ2pCLEtBQUssTUFBTSxNQUFNOzRCQUNSOzs7WUFBTDtZQUNBLE1BQU07OztJQUVkLE9BQU8sdUJBQXVCLEVBQUUsR0FBRyxJQUFJLElBQUk7SUFDM0MsS0FBSztJQUVMLE9BQU8sdUJBQXVCLEdBQUcsR0FBRyxJQUFJLElBQUk7SUFDNUMsS0FBSztJQUVMLE9BQU8sWUFBWSxFQUFFLEdBQUcsSUFBSSxJQUFJO0lBQ2hDLEtBQUs7SUFFTCxPQUFPLFlBQVksRUFBRSxHQUFHLElBQUksSUFBSTtJQUNoQyxLQUFLO0lBRUwsT0FBTyxVQUFVLEVBQUUsR0FBRyxJQUFJLElBQUk7SUFDOUIsS0FBSztJQUVMLE9BQU8sVUFBVSxFQUFFLEdBQUcsSUFBSSxJQUFJO0lBQzlCLEtBQUs7SUFFTCxPQUFPLFVBQVUsRUFBRSxHQUFHLElBQUksSUFBSTtJQUM5QixLQUFLO0lBRUwsS0FBSyxLQUFLLE1BQU07SUFDaEIsS0FBSyxLQUFLLE1BQU07Ozs7O0lBSWhCLFlBQVksTUFBTSxNQUFNO0lBRXhCLEtBQUssTUFBTSxTQUFTO0lBQ3BCLEtBQUssTUFBTSxNQUFNO0lBRWpCLGlCQUFPOztlQUFLLEtBQUssVUFBVSxNQUFNLEdBQUcsTUFBTSxFQUFHLEtBQUs7O0lBRWxELE1BQU0sVUFBVSxLQUFLLGFBQWE7SUFDbEMsTUFBTSxjQUFjLEVBQUU7SUFDdEIsS0FBSztZQUVMLE1BQU0sY0FBZ0IsRUFBRTtZQUN4QixLQUFLLElBQUksTUFBTSxFQUFFLE9BQVM7SUFFMUIsTUFBTSxVQUFVLEtBQUssYUFBYTtJQUNsQyxNQUFNLGNBQWMsRUFBRTtJQUN0QixLQUFLO1lBRUwsTUFBTSxjQUFnQixFQUFFO1lBQ3hCLEtBQUssSUFBSSxNQUFNLEVBQUUsT0FBUztJQUUxQixLQUFLLEtBQUssTUFBTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/novim.kode
