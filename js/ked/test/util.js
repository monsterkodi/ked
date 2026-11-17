var toExport = {}
var before, blank, c, calls, ch, classes, closed, clss, dir, exp, fresh, g, h, hole, i, keep, lim, line, lines, loading, log, next, origGetClass, row, s, s2, x, y

import leak from "../util/leak.js"
import logfile from "../util/logfile.js"
import syntax from "../util/syntax.js"
import harness from "../util/harness.js"
import config from "../util/config.js"
import session from "../util/session.js"

import input from "../view/base/input.js"
import crumbs from "../view/base/crumbs.js"

import choices from "../view/menu/choices.js"
import greet from "../view/menu/greet.js"

import screen from "../view/screen/screen.js"

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import nfs from "../../kxk/nfs.js"
import slash from "../../kxk/slash.js"
import watcher from "../../kxk/watcher.js"

import mode from "../edit/mode.js"

toExport["startup"] = async function ()
{
    await section("the modes announce when they are loaded", async function ()
    {
        compare((mode.loaded instanceof Promise),true)
        await mode.loaded
        compare(mode.names().includes('novim'),true)
        compare(mode.pending.length,0)
    })
    await section("the config announces when it is loaded", async function ()
    {
        loading = config.load()
        compare((config.loaded instanceof Promise),true)
        await loading
        await config.loaded
        compare((config.data !== null),true)
        watcher.close()
    })
    await section("the session announces when it is loaded", async function ()
    {
        s = new session({fresh:true})
        compare((s.loaded instanceof Promise),true)
        await s.loaded
    })
}
toExport["startup"]._section_ = true
toExport["session"] = async function ()
{
    await section("a terminal session uses the terminal session directory", async function ()
    {
        s = new session({fresh:true})
        compare(s.headless,false)
        compare(s.dir,slash.absolute("~/.config/ked/sessions/"))
        compare(s.file,slash.path(s.dir,`${s.name}.noon`))
    })
    await section("a headless session uses its own directory", async function ()
    {
        s = new session({fresh:true,headless:true})
        compare(s.headless,true)
        compare(s.dir,slash.absolute("~/.config/ked/headless-sessions/"))
        compare(s.file,slash.path(s.dir,`${s.name}.noon`))
    })
    await section("a colored headless session uses the headless directory", async function ()
    {
        s = new session({fresh:true,headless_colors:true})
        compare(s.headless,true)
        compare(s.dir,slash.absolute("~/.config/ked/headless-sessions/"))
    })
    await section("novim command line history is loaded again", async function ()
    {
        dir = '/tmp/opencode/ked-session-history-test'
        await nfs.remove(dir)
        s = new session({fresh:true})
        s.dir = dir
        s.file = slash.path(dir,'history.noon')
        s.set('novim▸history▸ex',['w','foo'])
        s.set('novim▸history▸search',['bar'])
        await s.save()
        s2 = new session({fresh:true})
        s2.dir = dir
        s2.file = slash.path(dir,'other.noon')
        await s2.loadAndMerge()
        compare(s2.get('novim▸history▸ex'),['w','foo'])
        compare(s2.get('novim▸history▸search'),['bar'])
        s2.clear()
        await nfs.remove(dir)
    })
}
toExport["session"]._section_ = true
toExport["harness"] = async function ()
{
    await section("write and written", async function ()
    {
        h = new harness
        compare(h.t.written(),'')
        h.t.write('hello')
        compare(h.t.written(),'hello')
    })
    await section("crumbs are shown", async function ()
    {
        h = new harness
        c = new crumbs(h.screen,'test_crumbs')
        c.layout(0,0,30,1)
        c.set('/home/kodi/s')
        c.draw()
        row = h.row(0)
        compare(row.includes('kodi'),true)
        compare(row.includes('s'),true)
        compare(h.row(1),'')
    })
    await section("key presses", async function ()
    {
        h = new harness
        c = new choices(h.screen,'test_choices')
        c.layout(0,0,20,3)
        c.set(['one','two','three'])
        c.select(0)
        compare(c.currentIndex(),0)
        h.key(c,'down')
        compare(c.currentIndex(),1)
    })
    await section("view focus", async function ()
    {
        h = new harness
        i = new input(h.screen,'test_input')
        i.layout(0,0,20,1)
        h.focus(i)
        compare(i.hasFocus(),true)
    })
    await section("view typing", async function ()
    {
        h = new harness
        i = new input(h.screen,'test_input')
        i.layout(0,0,20,1)
        h.focus(i)
        h.type(i,'xyz')
        compare(i.current(),'xyz')
    })
    await section("the cursor is marked", async function ()
    {
        h = new harness
        i = new input(h.screen,'test_input')
        i.layout(0,0,20,1)
        i.state.loadLines(['abc'])
        h.focus(i)
        i.state.setMainCursor(1,0)
        i.draw()
        compare(h.row(0),'abc')
        compare(h.rowMarked(0),`a${screen.MAIN_MARK}b${screen.END_MARK}c`)
    })
    await section("selection is marked", async function ()
    {
        h = new harness
        h.screen.set(0,0,'a')
        h.screen.set_mark(0,0,'selection')
        compare(h.rowMarked(0),`${screen.SELECT_MARK}a${screen.END_MARK}`)
    })
    await section("highlight is marked", async function ()
    {
        h = new harness
        h.screen.set(0,0,'a')
        h.screen.set_mark(0,0,'highlight')
        compare(h.rowMarked(0),`${screen.HILGHT_MARK}a${screen.END_MARK}`)
    })
    await section("greeter blacks out the window", async function ()
    {
        h = new harness
        g = new greet(h.screen)
        g.show()
        g.layout(0,0)
        g.draw()
        compare(h.screen.get_bg(0,23),[0,0,0])
        compare(h.screen.get_bg(79,0),[0,0,0])
    })
    await section("colored screen", async function ()
    {
        await section("draws colors", async function ()
        {
            h = new harness
            h.screen.set(0,0,'a',[10,20,30],[1,2,3])
            line = h.screen.textColored()[0]
            compare(line.includes('\x1b[48;2;1;2;3m'),true)
            compare(line.includes('\x1b[38;2;10;20;30m'),true)
            compare(line.includes('a'),true)
            compare(line.endsWith('\x1b[0m'),true)
        })
        await section("marks the cursor", async function ()
        {
            h = new harness
            h.screen.set(0,0,'a',[10,20,30],[1,2,3])
            h.screen.set_mark(0,0,'main')
            line = h.screen.textColored()[0]
            compare(line.includes(`${screen.MAIN_MARK}a${screen.END_MARK}`),true)
        })
        await section("marks the selection", async function ()
        {
            h = new harness
            h.screen.set(0,0,'a',[10,20,30],[1,2,3])
            h.screen.set_mark(0,0,'selection')
            line = h.screen.textColored()[0]
            compare(line.includes(`${screen.SELECT_MARK}a${screen.END_MARK}`),true)
        })
        await section("marks the highlight", async function ()
        {
            h = new harness
            h.screen.set(0,0,'a',[10,20,30],[1,2,3])
            h.screen.set_mark(0,0,'highlight')
            line = h.screen.textColored()[0]
            compare(line.includes(`${screen.HILGHT_MARK}a${screen.END_MARK}`),true)
        })
    })
}
toExport["harness"]._section_ = true
toExport["logfile"] = async function ()
{
    await section("a headless logfile leaves the console alone", async function ()
    {
        before = [console.log,console.warn,console.error]
        log = new logfile('test',true)
        compare(log.stream,undefined)
        compare((console.log === before[0]),true)
        compare((console.warn === before[1]),true)
        compare((console.error === before[2]),true)
    })
    await section("a headless logfile writes nowhere", async function ()
    {
        log = new logfile('test',true)
        log.write('nothing happens')
    })
    await section("a headless logfile still closes", async function ()
    {
        log = new logfile('test',true)
        closed = false
        log.close(function ()
        {
            return closed = true
        })
        compare(closed,true)
    })
}
toExport["logfile"]._section_ = true
toExport["leak"] = async function ()
{
    await section("a headless run samples nothing", async function ()
    {
        lines = []
        keep = console.log
        console.log = function (...args)
        {
            return lines.push(args)
        }
        leak.start({headless:true})
        if (leak.timer)
        {
            clearInterval(leak.timer)
        }
        leak.timer = null
        console.log = keep
        compare(lines.length,0)
    })
    await section("a colored headless run samples nothing", async function ()
    {
        lines = []
        keep = console.log
        console.log = function (...args)
        {
            return lines.push(args)
        }
        leak.start({headless_colors:true})
        if (leak.timer)
        {
            clearInterval(leak.timer)
        }
        leak.timer = null
        console.log = keep
        compare(lines.length,0)
    })
}
toExport["leak"]._section_ = true
toExport["syntax"] = async function ()
{
    await section("getClass argument", async function ()
    {
        s = new syntax('test')
        s.setExt('kode')
        s.setLines(['class Foo'])
        x = 0
        y = 0
        clss = s.getClass(x,y)
        ch = 'F'
        compare(s.getColor(x,y,clss),s.getColor(x,y))
        compare(s.getChar(x,y,ch,clss),s.getChar(x,y,ch))
        origGetClass = s.getClass
        calls = 0
        s.getClass = function (cx, cy)
        {
            calls += 1
            return origGetClass(cx,cy)
        }
        s.getColor(x,y,clss)
        s.getChar(x,y,ch,clss)
        compare(calls,0)
        s.getColor(x,y)
        s.getChar(x,y,ch)
        compare(calls,2)
    })
    await section("getClasses", async function ()
    {
        s = new syntax('test')
        s.setExt('kode')
        lines = ['# header','f = (a) -> a + 1','   indented',"u = '🌈'",'']
        s.setLines(lines)
        lim = 40
        for (var _a_ = y = 0, _b_ = lines.length; (_a_ <= _b_ ? y < lines.length : y > lines.length); (_a_ <= _b_ ? ++y : --y))
        {
            classes = s.getClasses(y)
            for (var _c_ = x = 0, _d_ = lim; (_c_ <= _d_ ? x < lim : x > lim); (_c_ <= _d_ ? ++x : --x))
            {
                clss = classes[x]
                clss = (clss != null ? clss : 'text')
                exp = s.getClass(x,y)
                compare(clss,exp)
            }
        }
        compare(s.getClasses(4).length,0)
        s.diss[0] = [{start:0,length:1,clss:''}]
        blank = s.getClasses(0)[0]
        compare(blank,'')
        hole = s.getClasses(0)[1]
        hole = (hole != null ? hole : 'text')
        compare(hole,'text')
    })
    await section("setSegls reuses the dissection of unchanged lines", async function ()
    {
        s = new syntax('test')
        s.setExt('kode')
        lines = ['a = 1','b = 2','c = 3']
        s.setLines(lines)
        keep = s.diss[0]
        next = [lines[0],(kseg,'bee = 22'),(kseg,'c = 333')]
        s.setSegls(next,lines)
        compare(s.diss[0] === keep,true)
        fresh = new syntax('test')
        fresh.setExt('kode')
        fresh.setLines(next)
        for (var _e_ = y = 0, _f_ = next.length; (_e_ <= _f_ ? y < next.length : y > next.length); (_e_ <= _f_ ? ++y : --y))
        {
            for (x = 0; x < 8; x++)
            {
                compare(s.getClass(x,y),fresh.getClass(x,y))
            }
        }
    })
    await section("setSegls falls back to a full dissection when lines are added", async function ()
    {
        s = new syntax('test')
        s.setExt('kode')
        lines = ['a = 1','b = 2']
        s.setLines(lines)
        next = [lines[0],lines[1],(kseg,'c = 3')]
        s.setSegls(next,lines)
        fresh = new syntax('test')
        fresh.setExt('kode')
        fresh.setLines(next)
        compare(s.diss.length,3)
        for (var _10_ = y = 0, _11_ = next.length; (_10_ <= _11_ ? y < next.length : y > next.length); (_10_ <= _11_ ? ++y : --y))
        {
            for (x = 0; x < 8; x++)
            {
                compare(s.getClass(x,y),fresh.getClass(x,y))
            }
        }
    })
}
toExport["syntax"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC91dGlsLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNjLFdBQVA7T0FBWSxjQUFaO09BQW9CLGFBQXBCO09BQTJCLGNBQTNCO09BQW1DLGFBQW5DO09BQTBDLGNBQTFDOztPQUVjLFlBQVQ7T0FBZSxhQUFmOztPQUNTLGNBQVI7T0FBZ0IsWUFBaEI7O09BQ1EsYUFBUjs7T0FDSCxVQUFBO0lBQVc7O09BQ0EsVUFBWDtPQUFlLFlBQWY7T0FBcUIsY0FBckI7O09BQ1csV0FBZDs7Ozs7O2lCQU9FLEtBQUssa0JBQWtCLFNBQVc7Y0FFakMsS0FBSztnQkFFUCxLQUFLLFFBQVEsU0FBUyxTQUFXO2dCQUNqQyxLQUFLLFFBQVEsT0FBUzs7OztRQUl0QixVQUFVLE9BQU87aUJBRWhCLE9BQU8sa0JBQWtCLFNBQVc7Y0FFbkM7Y0FDQSxPQUFPO2lCQUVSLE9BQU8sU0FBUSxNQUFRO1FBRXhCLFFBQVE7Ozs7UUFJUixRQUFRLFNBQVEsTUFBTTtpQkFFckIsRUFBRSxrQkFBa0IsU0FBVztjQUU5QixFQUFFOzs7Ozs7OztRQU1KLFFBQVEsU0FBUSxNQUFNO2dCQUV0QixFQUFFLFNBQVc7Z0JBQ2IsRUFBRSxJQUFNLE1BQU0sU0FBUztnQkFDdkIsRUFBRSxLQUFPLE1BQU0sS0FBSyxFQUFFLE9BQU8sRUFBRTs7OztRQUkvQixRQUFRLFNBQVEsTUFBTSxLQUFLLFNBQVM7Z0JBRXBDLEVBQUUsU0FBVztnQkFDYixFQUFFLElBQU0sTUFBTSxTQUFTO2dCQUN2QixFQUFFLEtBQU8sTUFBTSxLQUFLLEVBQUUsT0FBTyxFQUFFOzs7O1FBSS9CLFFBQVEsU0FBUSxNQUFNLEtBQUssZ0JBQWdCO2dCQUUzQyxFQUFFLFNBQVc7Z0JBQ2IsRUFBRSxJQUFNLE1BQU0sU0FBUzs7OztRQUl2QixNQUFNO2NBRUosSUFBSSxPQUFPO1FBRWIsUUFBUSxTQUFRLE1BQU07UUFFdEIsRUFBRSxNQUFPO1FBQ1QsRUFBRSxPQUFP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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/util.kode
