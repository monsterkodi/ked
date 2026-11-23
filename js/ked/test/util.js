var toExport = {}
var before, blank, c, calls, ch, classes, closed, clss, dir, exp, g, h, hole, i, keep, lim, line, lines, loading, log, next, origGetClass, row, s, s2, same, sample, x, y

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


sample = function (opt)
{
    var keep, lines

    lines = []
    keep = console.log
    console.log = function (...args)
    {
        return lines.push(args)
    }
    leak.start(opt)
    if (leak.timer)
    {
        clearInterval(leak.timer)
    }
    leak.timer = null
    console.log = keep
    return lines.length
}
toExport["startup"] = async function ()
{
    await section("loaded", async function ()
    {
        compare((mode.loaded instanceof Promise),true)
        await mode.loaded
        compare(mode.names().includes('novim'),true)
        compare(mode.pending.length,0)
        loading = config.load()
        compare((config.loaded instanceof Promise),true)
        await loading
        await config.loaded
        compare((config.data !== null),true)
        watcher.close()
        s = new session({fresh:true})
        compare((s.loaded instanceof Promise),true)
        await s.loaded
    })
}
toExport["startup"]._section_ = true
toExport["session"] = async function ()
{
    await section("directories", async function ()
    {
        s = new session({fresh:true})
        compare(s.headless,false)
        compare(s.dir,slash.absolute("~/.config/ked/sessions/"))
        compare(s.file,slash.path(s.dir,`${s.name}.noon`))
        s = new session({fresh:true,headless:true})
        compare(s.headless,true)
        compare(s.dir,slash.absolute("~/.config/ked/headless-sessions/"))
        compare(s.file,slash.path(s.dir,`${s.name}.noon`))
        s = new session({fresh:true,headless_colors:true})
        compare(s.headless,true)
        compare(s.dir,slash.absolute("~/.config/ked/headless-sessions/"))
    })
    await section("history", async function ()
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
    await section("write", async function ()
    {
        h = new harness
        compare(h.t.written(),'')
        h.t.write('hello')
        compare(h.t.written(),'hello')
    })
    await section("views", async function ()
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
        h = new harness
        c = new choices(h.screen,'test_choices')
        c.layout(0,0,20,3)
        c.set(['one','two','three'])
        c.select(0)
        compare(c.currentIndex(),0)
        h.key(c,'down')
        compare(c.currentIndex(),1)
        h = new harness
        i = new input(h.screen,'test_input')
        i.layout(0,0,20,1)
        h.focus(i)
        compare(i.hasFocus(),true)
        h.type(i,'xyz')
        compare(i.current(),'xyz')
    })
    await section("marks", async function ()
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
        h = new harness
        h.screen.set(0,0,'a')
        h.screen.set_mark(0,0,'selection')
        compare(h.rowMarked(0),`${screen.SELECT_MARK}a${screen.END_MARK}`)
        h = new harness
        h.screen.set(0,0,'a')
        h.screen.set_mark(0,0,'highlight')
        compare(h.rowMarked(0),`${screen.HILGHT_MARK}a${screen.END_MARK}`)
    })
    await section("colors", async function ()
    {
        h = new harness
        h.screen.set(0,0,'a',[10,20,30],[1,2,3])
        line = h.screen.textColored()[0]
        compare(line.includes('\x1b[48;2;1;2;3m'),true)
        compare(line.includes('\x1b[38;2;10;20;30m'),true)
        compare(line.includes('a'),true)
        compare(line.endsWith('\x1b[0m'),true)
        h = new harness
        h.screen.set(0,0,'a',[10,20,30],[1,2,3])
        h.screen.set_mark(0,0,'main')
        line = h.screen.textColored()[0]
        compare(line.includes(`${screen.MAIN_MARK}a${screen.END_MARK}`),true)
        h = new harness
        h.screen.set(0,0,'a',[10,20,30],[1,2,3])
        h.screen.set_mark(0,0,'selection')
        line = h.screen.textColored()[0]
        compare(line.includes(`${screen.SELECT_MARK}a${screen.END_MARK}`),true)
        h = new harness
        h.screen.set(0,0,'a',[10,20,30],[1,2,3])
        h.screen.set_mark(0,0,'highlight')
        line = h.screen.textColored()[0]
        compare(line.includes(`${screen.HILGHT_MARK}a${screen.END_MARK}`),true)
    })
    await section("greeter", async function ()
    {
        h = new harness
        g = new greet(h.screen)
        g.show()
        g.layout(0,0)
        g.draw()
        compare(h.screen.get_bg(0,23),[0,0,0])
        compare(h.screen.get_bg(79,0),[0,0,0])
    })
}
toExport["harness"]._section_ = true
toExport["logfile"] = async function ()
{
    await section("headless", async function ()
    {
        before = [console.log,console.warn,console.error]
        log = new logfile('test',true)
        compare(log.stream,undefined)
        compare((console.log === before[0]),true)
        compare((console.warn === before[1]),true)
        compare((console.error === before[2]),true)
        log = new logfile('test',true)
        log.write('nothing happens')
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
    await section("headless", async function ()
    {
        compare(sample({headless:true}),0)
        compare(sample({headless_colors:true}),0)
    })
}
toExport["leak"]._section_ = true
toExport["syntax"] = async function ()
{
    await section("argument", async function ()
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
    await section("setSegls", async function ()
    {
        same = function (edited, next)
        {
            var fresh

            fresh = new syntax('test')
            fresh.setExt('kode')
            fresh.setLines(next)
            for (var _e_ = y = 0, _f_ = next.length; (_e_ <= _f_ ? y < next.length : y > next.length); (_e_ <= _f_ ? ++y : --y))
            {
                for (x = 0; x < 8; x++)
                {
                    compare(edited.getClass(x,y),fresh.getClass(x,y))
                }
            }
        }
        s = new syntax('test')
        s.setExt('kode')
        lines = kseg.segls(['a = 1','b = 2','c = 3'])
        s.setSegls(lines)
        keep = s.diss[0]
        next = [lines[0],(kseg,'bee = 22'),(kseg,'c = 333')]
        s.setSegls(next,lines)
        compare(s.diss[0] === keep,true)
        same(s,next)
        s = new syntax('test')
        s.setExt('kode')
        lines = ['a = 1','b = 2']
        s.setLines(lines)
        next = [lines[0],lines[1],(kseg,'c = 3')]
        s.setSegls(next,lines)
        compare(s.diss.length,3)
        same(s,next)
    })
}
toExport["syntax"]._section_ = true
toExport["number inputs"] = async function ()
{
    await section("numbers", async function ()
    {
        h = new harness
        i = new input(h.screen,'test_number_input',{number:true,min:0,max:5})
        i.layout(0,0,20,1)
        i.changeValue(10)
        compare(i.getValue(),'5')
        i.changeValue(-3)
        compare(i.getValue(),'0')
        i.changeValue(3)
        compare(i.getValue(),'3')
        i.onWheel({dir:'down',cell:[1,0]})
        compare(i.getValue(),'2')
        i.changeValue(0)
        i.onWheel({dir:'down',cell:[1,0]})
        compare(i.getValue(),'0')
        h = new harness
        i = new input(h.screen,'test_number_input_string',{number:true,min:0,max:5})
        i.layout(0,0,20,1)
        i.changeValue(3)
        compare(i.getValue(),'3')
        compare(i.int(),3)
    })
    await section("percent", async function ()
    {
        h = new harness
        i = new input(h.screen,'test_number_input_percent',{number:true,min:0,max:999,percent:true})
        i.layout(0,0,20,1)
        i.changeValue('50%')
        compare(i.current(),'50%')
        compare(i.getValue(),'50%')
        compare(i.int(),50)
        i.changeValue('150%')
        compare(i.current(),'100%')
        i.changeValue('200')
        compare(i.current(),'200')
        h = new harness
        i = new input(h.screen,'test_number_input_percent_wheel',{number:true,min:0,max:999,percent:true})
        i.layout(0,0,20,1)
        i.changeValue('50%')
        i.onWheel({dir:'up',cell:[1,0]})
        compare(i.current(),'51%')
        h = new harness
        i = new input(h.screen,'test_number_input_percent_typing',{number:true,min:0,max:999,percent:true})
        i.layout(0,0,20,1)
        h.focus(i)
        h.type(i,'50%')
        compare(i.current(),'50%')
    })
}
toExport["number inputs"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC91dGlsLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNjLFdBQVA7T0FBWSxjQUFaO09BQW9CLGFBQXBCO09BQTJCLGNBQTNCO09BQW1DLGFBQW5DO09BQTBDLGNBQTFDOztPQUVjLFlBQVQ7T0FBZSxhQUFmOztPQUNTLGNBQVI7T0FBZ0IsWUFBaEI7O09BQ1EsYUFBUjs7T0FDSCxVQUFBO0lBQVc7O09BQ0EsVUFBWDtPQUFlLFlBQWY7T0FBcUIsY0FBckI7O09BQ1csV0FBZDs7O0FBRVAsbUJBQVU7Ozs7SUFDTjtJQUNBLE9BQU8sUUFBUTtJQUNmLFFBQVEsZ0JBQU87O2VBQVksTUFBTSxLQUFLOztJQUN0QyxLQUFLLE1BQU07UUFDaUIsS0FBSzs7UUFBakMsY0FBYyxLQUFLOztJQUNuQixLQUFLLFFBQVE7SUFDYixRQUFRLE1BQU07V0FDZCxNQUFNOzs7Ozs7aUJBT0QsS0FBSyxrQkFBa0IsU0FBVztjQUVqQyxLQUFLO2dCQUVQLEtBQUssUUFBUSxTQUFTLFNBQVc7Z0JBQ2pDLEtBQUssUUFBUSxPQUFTO1FBRXRCLFVBQVUsT0FBTztpQkFFaEIsT0FBTyxrQkFBa0IsU0FBVztjQUVuQztjQUNBLE9BQU87aUJBRVIsT0FBTyxTQUFRLE1BQVE7UUFFeEIsUUFBUTtRQUVSLFFBQVEsU0FBUSxNQUFNO2lCQUVyQixFQUFFLGtCQUFrQixTQUFXO2NBRTlCLEVBQUU7Ozs7Ozs7O1FBTUosUUFBUSxTQUFRLE1BQU07Z0JBRXRCLEVBQUUsU0FBVztnQkFDYixFQUFFLElBQU0sTUFBTSxTQUFTO2dCQUN2QixFQUFFLEtBQU8sTUFBTSxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBRS9CLFFBQVEsU0FBUSxNQUFNLEtBQUssU0FBUztnQkFFcEMsRUFBRSxTQUFXO2dCQUNiLEVBQUUsSUFBTSxNQUFNLFNBQVM7Z0JBQ3ZCLEVBQUUsS0FBTyxNQUFNLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFFL0IsUUFBUSxT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
//# sourceURL=../../../kode/ked/test/util.kode
