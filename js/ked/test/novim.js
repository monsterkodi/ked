var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var across, afterstring, aobj, array, before, brackets, cells, cur, history, instring, iobj, key, lead, lobj, m, mrange, multiline, nobj, onKeys, parens, pkey, plain, pobj, press, qobj, quoted, s, segls, single, sobj, stack, stxt, text, txt, wobj, words

import kxk from "../../kxk.js"
let kseg = kxk.kseg

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
toExport["cursor movement"] = async function ()
{
    s.loadLines(belt.linesForText("one two three\nfour five"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'move',motion:{kind:'right',count:2}})
    cur(2,0)
    s.executeNovim({operator:'move',motion:{kind:'left',count:1}})
    cur(1,0)
    s.executeNovim({operator:'move',motion:{kind:'down',count:1}})
    cur(1,1)
    s.executeNovim({operator:'move',motion:{kind:'up',count:1}})
    cur(1,0)
    s.setMainCursor(13,0)
    s.executeNovim({operator:'move',motion:{kind:'right',count:2}})
    cur(13,0)
    s.setMainCursor(0,0)
    s.executeNovim({operator:'move',motion:{kind:'left',count:3}})
    cur(0,0)
    s.setMainCursor(13,0)
    s.executeNovim({operator:'move',motion:{kind:'down',count:1}})
    cur(9,1)
    s.executeNovim({operator:'move',motion:{kind:'down',count:9}})
    cur(9,1)
    s.executeNovim({operator:'move',motion:{kind:'up',count:9}})
    cur(9,0)
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setCursors([[0,0],[1,1]])
    s.executeNovim({operator:'move',motion:{kind:'right',count:1}})
    compare(s.allCursors(),[[1,0],[2,1]])
    s.loadLines(belt.linesForText("abc\ndef"))
    s.setMainCursor(0,0)
    history = s.h.length
    s.executeNovim({operator:'move',motion:{kind:'right',count:2}})
    compare(s.h.length,history)
    txt("abc\ndef")
}
toExport["cursor movement"]._section_ = true
toExport["cursor to start and end of line"] = async function ()
{
    s.loadLines(belt.linesForText("one two\nfour"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'move',motion:{kind:'eol'}})
    cur(6,0)
    s.setMainCursor(0,0)
    s.executeNovim({operator:'move',motion:{kind:'eol',count:2}})
    cur(3,1)
    s.setMainCursor(6,0)
    s.executeNovim({operator:'move',motion:{kind:'bol'}})
    cur(0,0)
    s.loadLines(belt.linesForText("\nabc"))
    s.setMainCursor(0,0)
    s.executeNovim({operator:'move',motion:{kind:'eol'}})
    cur(0,0)
}
toExport["cursor to start and end of line"]._section_ = true
toExport["cursor to first and last line"] = async function ()
{
    text = "  one\n  two\n  three"
    s.loadLines(belt.linesForText(text))
    s.setMainCursor(3,1)
    s.executeNovim({operator:'move',motion:{kind:'bof'}})
    cur(2,0)
    s.setMainCursor(3,1)
    s.executeNovim({operator:'move',motion:{kind:'eof'}})
    cur(2,2)
    s.setMainCursor(0,0)
    s.executeNovim({operator:'move',motion:{kind:'eof',count:2}})
    cur(2,1)
    s.setMainCursor(0,0)
    s.executeNovim({operator:'move',motion:{kind:'bof',count:3}})
    cur(2,2)
    s.setMainCursor(0,0)
    s.executeNovim({operator:'move',motion:{kind:'eof',count:9}})
    cur(2,2)
    txt(text)
}
toExport["cursor to first and last line"]._section_ = true
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
    s.loadLines(belt.linesForText(text))
    s.setMainCursor(0,0)
    key('l')
    cur(1,0)
    key('2')
    key('l')
    cur(3,0)
    m.handleKey('down',{combo:'down'})
    cur(3,1)
    key('k')
    cur(3,0)
    m.handleKey('up',{combo:'up'})
    cur(3,0)
    m.handleKey('left',{combo:'left'})
    cur(2,0)
    key('2')
    m.handleKey('right',{combo:'right'})
    cur(4,0)
    s.setMainCursor(0,0)
    key('d')
    key('w')
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
    key('d')
    key('h')
    txt("alha")
    s.loadLines(belt.linesForText("alpha"))
    s.setMainCursor(0,0)
    key('d')
    key('l')
    txt("lpha")
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(5,0)
    key('d')
    key('i')
    key('w')
    txt("one  three")
    compare(m.operator,null)
    s.loadLines(belt.linesForText('say "hello there" ok'))
    s.setMainCursor(7,0)
    key('d')
    key('a')
    key('"')
    txt("say ok")
    s.loadLines(belt.linesForText("if seg not in ['', undefined, ' ', '}', ']', ')']"))
    s.setMainCursor(21,0)
    key('d')
    key('i')
    key('[')
    txt("if seg not in []")
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(0,0)
    key('d')
    key('2')
    key('i')
    key('w')
    txt(" three")
    s.loadLines(belt.linesForText("abc"))
    key('d')
    key('i')
    m.handleKey('esc',{combo:'esc'})
    txt("abc")
    compare(m.area,null)
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    key('x')
    txt("bcdef")
    key('.')
    txt("cdef")
    key('2')
    key('.')
    txt("ef")
    s.loadLines(belt.linesForText("abcdef"))
    s.setMainCursor(0,0)
    key('x')
    key('l')
    key('.')
    txt("bdef")
    s.loadLines(belt.linesForText("one two three"))
    s.setMainCursor(0,0)
    key('d')
    key('a')
    key('w')
    txt("two three")
    key('.')
    txt("three")
    s.loadLines(belt.linesForText("one\n  two\n  three"))
    s.setMainCursor(0,0)
    key('G')
    cur(2,2)
    key('g')
    key('g')
    cur(0,0)
    key('2')
    key('G')
    cur(2,1)
    key('3')
    key('g')
    key('g')
    cur(2,2)
    key('0')
    cur(0,2)
    s.setMainCursor(0,0)
    key('1')
    key('0')
    key('G')
    cur(2,2)
    key('$')
    cur(6,2)
    key('g')
    key('l')
    cur(6,2)
    s.setMainCursor(0,0)
    key('g')
    m.handleKey('esc',{combo:'esc'})
    key('G')
    cur(2,2)
}
toExport["keys"]._section_ = true
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
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvbm92aW0ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FPVSxVQUFBO0lBQVk7O09BQ0EsV0FBVjtPQUFlLGFBQWY7O09BQ1UsWUFBZjtPQUFxQixXQUFyQjs7T0FDZSxZQUFUO09BQWUsYUFBZjs7QUFFYixTQUFRLEtBQUssR0FBRyxLQUFLO0FBQ3JCLFFBQVEsTUFBTSxNQUFNOztBQUVwQixnQkFBTTs7bUJBQUssS0FBSyxJQUFJLEVBQUUsRUFBRSxPQUFTOzs7QUFDakMsZ0JBQU0sR0FBRTs7bUJBQUssRUFBRSxjQUFnQixFQUFFOzs7QUFFakMsbUJBQVMsT0FBTSxHQUFFLEdBQUU7O1dBQUssT0FBTyxNQUFNLE9BQU8sRUFBRSxHQUFHOzs7O0lBSTdDLFFBQVMsS0FBSyxNQUFNOzs7O2dCQU9oQixPQUFPLE1BQU8sRUFBRyxHQUFJLEtBQUssT0FBWSxNQUFNLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ3pELE9BQU8sTUFBTyxFQUFHLEdBQUksS0FBSyxPQUFZLE1BQU0sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFJekQsT0FBTyxNQUFPLEVBQUcsR0FBSSxLQUFLLE9BQVksTUFBTSxLQUFPLEVBQUUsRUFBRSxHQUFHO2dCQUcxRCxPQUFPLE1BQU8sRUFBRyxHQUFJLEtBQUssT0FBWSxNQUFNLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBRXpELE9BQU8sTUFBTyxFQUFHLEdBQUksS0FBSyxVQUFZLE1BQU0sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFDekQsT0FBTyxNQUFPLEVBQUcsR0FBSSxLQUFLLFVBQVksTUFBTSxLQUFPLEVBQUUsRUFBRSxHQUFHO2dCQUMxRCxPQUFPLE1BQU8sRUFBRyxHQUFJLEtBQUssV0FBWSxNQUFNLEtBQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ3pELE9BQU8sTUFBTyxFQUFHLEdBQUksS0FBSyxXQUFZLE1BQU0sS0FBTyxFQUFFLEVBQUUsRUFBRTtnQkFHekQs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YUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssUUFBUyxPQUFPLE9BQVEsTUFBTTtJQUNqRyxJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssU0FBVSxPQUFPLE9BQVEsTUFBTTtJQUNsRyxJQUFJO0lBR0osRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssUUFBUyxPQUFPLE9BQVEsTUFBTTtJQUNqRyxJQUFJO0lBR0osRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssUUFBUyxPQUFPLElBQUssTUFBTTtJQUM5RixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssU0FBVSxPQUFPLElBQUssTUFBTTtJQUMvRixJQUFJO0lBR0osRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsR0FBRztJQUVuQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssUUFBUyxPQUFPLElBQUssTUFBTTtJQUM5RixJQUFJO0lBRUosRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsR0FBRztJQUVuQixFQUFFLGNBQWMsU0FBUyxTQUFVLFFBQVEsS0FBSyxhQUFjLEtBQUssU0FBVSxPQUFPLElBQUssTUFBTTtJQUMvRixJQUFJO0lBR0osRUFBRSxVQUFVLEtBQUssYUFBYTtJQUM5QixFQUFFLGNBQWMsRUFBRTtJQUVsQixFQUFFLGNB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/novim.kode
