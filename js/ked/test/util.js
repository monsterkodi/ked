var toExport = {}
var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r5=_k_.k.F256(_k_.k.r(5))

var before, blank, c, calls, ch, classes, closed, clss, dir, exp, g, h, hole, i, keep, lf, lim, line, lines, loading, log, next, origGetClass, row, s, s2, same, sample, x, y

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
    await section("capture", async function ()
    {
        before = [console.log,console.warn,console.error]
        lf = new logfile('test',true,true)
        console.log('a',{b:1})
        console.error(`${_k_.r5('red')}\nnext`)
        console.log = before[0]
        console.warn = before[1]
        console.error = before[2]
        compare(lf.take(),['a b   1','red','next'])
        compare(lf.take(),[])
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC91dGlsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ2MsV0FBUDtPQUFZLGNBQVo7T0FBb0IsYUFBcEI7T0FBMkIsY0FBM0I7T0FBbUMsYUFBbkM7T0FBMEMsY0FBMUM7O09BRWMsWUFBVDtPQUFlLGFBQWY7O09BQ1MsY0FBUjtPQUFnQixZQUFoQjs7T0FDUSxhQUFSOztPQUNILFVBQUE7SUFBVzs7T0FDQSxVQUFYO09BQWUsWUFBZjtPQUFxQixjQUFyQjs7T0FDVyxXQUFkOzs7QUFFUCxtQkFBVTs7OztJQUNOO0lBQ0EsT0FBTyxRQUFRO0lBQ2YsUUFBUSxnQkFBTzs7ZUFBWSxNQUFNLEtBQUs7O0lBQ3RDLEtBQUssTUFBTTtRQUNpQixLQUFLOztRQUFqQyxjQUFjLEtBQUs7O0lBQ25CLEtBQUssUUFBUTtJQUNiLFFBQVEsTUFBTTtXQUNkLE1BQU07Ozs7OztRQU8rQixTQUFoQyxLQUFLLGtCQUFrQixTQUFXO2NBRWpDLEtBQUs7UUFFd0IsUUFBL0IsS0FBSyxRQUFRLFNBQVMsU0FBVztRQUNiLFFBQXBCLEtBQUssUUFBUSxPQUFTO1FBRXRCLFVBQVUsT0FBTztRQUVrQixTQUFsQyxPQUFPLGtCQUFrQixTQUFXO2NBRW5DO2NBQ0EsT0FBTztRQUVhLFNBQXJCLE9BQU8sU0FBUSxNQUFRO1FBRXhCLFFBQVE7UUFFUixRQUFRLFNBQVEsTUFBTTtRQUVRLFNBQTdCLEVBQUUsa0JBQWtCLFNBQVc7Y0FFOUIsRUFBRTs7Ozs7Ozs7UUFNSixRQUFRLFNBQVEsTUFBTTtRQUVYLFFBQVgsRUFBRSxTQUFXO1FBQ1AsUUFBTixFQUFFLElBQU0sTUFBTSxTQUFTO1FBQ2hCLFFBQVAsRUFBRSxLQUFPLE1BQU0sS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUUvQixRQUFRLFNBQVEsTUFBTSxLQUFLLFNBQVM7UUFFekIsUUFBWCxFQUFFLFNBQVc7UUFDUCxRQUFOLEVBQUUsSUFBTSxNQUFNLFNBQVM7UUFD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
//# sourceURL=../../../kode/ked/test/util.kode
