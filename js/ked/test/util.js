var toExport = {}
var before, blank, c, calls, ch, classes, closed, clss, dir, exp, g, h, hole, i, keep, lim, line, lines, loading, log, origGetClass, row, s, s2, x, y

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
}
toExport["syntax"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC91dGlsLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNjLFdBQVA7T0FBWSxjQUFaO09BQW9CLGFBQXBCO09BQTJCLGNBQTNCO09BQW1DLGFBQW5DO09BQTBDLGNBQTFDOztPQUVjLFlBQVQ7T0FBZSxhQUFmOztPQUNTLGNBQVI7T0FBZ0IsWUFBaEI7O09BQ1EsYUFBUjs7T0FDUSxVQUFYO09BQWUsWUFBZjtPQUFxQixjQUFyQjs7T0FDVyxXQUFkOzs7Ozs7aUJBT0UsS0FBSyxrQkFBa0IsU0FBVztjQUVqQyxLQUFLO2dCQUVQLEtBQUssUUFBUSxTQUFTLFNBQVc7Z0JBQ2pDLEtBQUssUUFBUSxPQUFTOzs7O1FBSXRCLFVBQVUsT0FBTztpQkFFaEIsT0FBTyxrQkFBa0IsU0FBVztjQUVuQztjQUNBLE9BQU87aUJBRVIsT0FBTyxTQUFRLE1BQVE7UUFFeEIsUUFBUTs7OztRQUlSLFFBQVEsU0FBUSxNQUFNO2lCQUVyQixFQUFFLGtCQUFrQixTQUFXO2NBRTlCLEVBQUU7Ozs7Ozs7O1FBTUosUUFBUSxTQUFRLE1BQU07Z0JBRXRCLEVBQUUsU0FBVztnQkFDYixFQUFFLElBQU0sTUFBTSxTQUFTO2dCQUN2QixFQUFFLEtBQU8sTUFBTSxLQUFLLEVBQUUsT0FBTyxFQUFFOzs7O1FBSS9CLFFBQVEsU0FBUSxNQUFNLEtBQUssU0FBUztnQkFFcEMsRUFBRSxTQUFXO2dCQUNiLEVBQUUsSUFBTSxNQUFNLFNBQVM7Z0JBQ3ZCLEVBQUUsS0FBTyxNQUFNLEtBQUssRUFBRSxPQUFPLEVBQUU7Ozs7UUFJL0IsUUFBUSxTQUFRLE1BQU0sS0FBSyxnQkFBZ0I7Z0JBRTNDLEVBQUUsU0FBVztnQkFDYixFQUFFLElBQU0sTUFBTSxTQUFTOzs7O1FBSXZCLE1BQU07Y0FFSixJQUFJLE9BQU87UUFFYixRQUFRLFNBQVEsTUFBTTtRQUV0QixFQUFFLE1BQU87UUFDVCxFQUFFLE9BQU8sTUFBTSxLQUFLLElBQUk7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/util.kode
