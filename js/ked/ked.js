var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, isFunc: function (o) {return typeof o === 'function'}};_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.b8=_k_.k.F256(_k_.k.b(8));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2))

var KED

import kxk from "../kxk.js"
let karg = kxk.karg
let kstr = kxk.kstr
let kseg = kxk.kseg
let slash = kxk.slash
let post = kxk.post
let nfs = kxk.nfs
let sleep = kxk.sleep

import prjcts from "./index/prjcts.js"
import indexer from "./index/indexer.js"

import logfile from "./util/logfile.js"
import session from "./util/session.js"
import help from "./util/help.js"
import frecent from "./util/frecent.js"
import watcher from "./util/watcher.js"
import git from "./util/git.js"

import rounded from "./util/img/rounded.js"
import squares from "./util/img/squares.js"
import sircels from "./util/img/sircels.js"

import belt from "./edit/tool/belt.js"

import mode from "./edit/mode.js"

import filepos from "./edit/mode/filepos.js"

import view from "./view/base/view.js"
import input from "./view/base/input.js"

import title from "./view/title/title.js"

import fileeditor from "./view/editor/fileeditor.js"

import screen from "./view/screen/screen.js"
import ttio from "./view/screen/ttio.js"

import context from "./view/menu/context.js"
import menu from "./view/menu/menu.js"
import macro from "./view/menu/macro.js"
import finder from "./view/menu/finder.js"
import searcher from "./view/menu/searcher.js"
import differ from "./view/menu/differ.js"

import browse from "./view/colmns/browse.js"
import dircol from "./view/colmns/dircol.js"
import funcol from "./view/colmns/funcol.js"
import quicky from "./view/colmns/quicky.js"
import droop from "./view/colmns/droop.js"


KED = (function ()
{
    function KED ()
    {
        var column, file, line

        this["draw"] = this["draw"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onInputPopup"] = this["onInputPopup"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onViewSize"] = this["onViewSize"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["showFileposHistory"] = this["showFileposHistory"].bind(this)
        this["showFinderOrSearcher"] = this["showFinderOrSearcher"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["onPaste"] = this["onPaste"].bind(this)
        this["saveAs"] = this["saveAs"].bind(this)
        this["saveSessionFile"] = this["saveSessionFile"].bind(this)
        this["saveFile"] = this["saveFile"].bind(this)
        this["loadFile"] = this["loadFile"].bind(this)
        this["onQuicky"] = this["onQuicky"].bind(this)
        this["openFile"] = this["openFile"].bind(this)
        this["reloadFile"] = this["reloadFile"].bind(this)
        this["onGitStatus"] = this["onGitStatus"].bind(this)
        this["onFileChange"] = this["onFileChange"].bind(this)
        this["newFile"] = this["newFile"].bind(this)
        this["quit"] = this["quit"].bind(this)
        this["arrange"] = this["arrange"].bind(this)
        this["onSessionLoaded"] = this["onSessionLoaded"].bind(this)
        this["dump"] = this["dump"].bind(this)
        this["runHeadless"] = this["runHeadless"].bind(this)
        this.version = '0.9.0'
        this.args = karg(`
ked [file]
    options                                       **
    new        start with empty buffer          = false
    fresh      don't load previous session      = false
    timeout    session save timeout in ms       = 1000
    version    log version                      = false
    headless   run without a terminal           = false -H
    `,{preHelp:help.header(),version:this.version})
        process.on('uncaughtException',this.quit)
        this.session = new session(this.args)
        this.logfile = new logfile(this.session.name)
        global.ked_session = this.session
        this.session.on('loaded',this.onSessionLoaded)
        this.t = new ttio({headless:this.args.headless})
        this.screen = new screen(this.t)
        global.ked_screen = this.screen
        this.indexer = new indexer
        this.git = new git
        this.menu = new menu(this.screen)
        this.macro = new macro(this.screen)
        this.quicky = new quicky(this.screen)
        this.browse = new browse(this.screen)
        this.editor = new fileeditor(this.screen,'editor')
        this.droop = new droop(this.screen,this.editor)
        this.dircol = new dircol(this.screen,this.editor,['scroll','knob'])
        this.funcol = new funcol(this.screen,this.editor,['scroll','knob'])
        this.finder = new finder(this.screen,this.editor)
        this.searcher = new searcher(this.screen,this.editor)
        this.differ = new differ(this.screen,this.editor)
        this.title = new title(this.screen,this.editor)
        this.context = new context(this.screen)
        this.input = new input(this.screen)
        this.input.on('action',this.onInputAction)
        console.log(_k_.w2(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ${_k_.b8(this.session.name)} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
        this.editor.state.hasFocus = true
        this.editor.funtree = this.funcol.funtree
        post.on('redraw',this.redraw)
        post.on('window.focus',this.redraw)
        post.on('window.blur',this.redraw)
        post.on('input.popup',this.onInputPopup)
        post.on('view.size',this.onViewSize)
        post.on('quicky',this.onQuicky)
        post.on('file.new',this.newFile)
        post.on('file.reload',this.reloadFile)
        post.on('file.open',this.openFile)
        post.on('quit',this.quit)
        post.on('file.change',this.onFileChange)
        post.on('git.status',this.onGitStatus)
        this.contextHandlers = [this.editor,this.dircol,this.funcol]
        this.mouseHandlers = [this.input,this.context,this.finder,this.searcher,this.differ,this.quicky,this.browse,this.droop,this.menu,this.macro,this.editor,this.title,this.dircol,this.funcol]
        this.wheelHandlers = [this.finder,this.searcher,this.differ,this.quicky,this.browse,this.droop,this.macro,this.editor,this.dircol,this.funcol]
        this.keyHandlers = [this.input,this.context,this.finder,this.searcher,this.differ,this.quicky,this.browse,this.droop,this.menu,this.macro,this.editor,this.dircol,this.funcol]
        this.t.on('key',this.onKey)
        this.t.on('mouse',this.onMouse)
        this.t.on('wheel',this.onWheel)
        this.t.on('resize',this.onResize)
        this.t.on('paste',this.onPaste)
        console.log('ked cwd:',process.cwd())
        console.log('ked args:',this.args)
        ked_session.set('ked▸args',this.args)
        if (!_k_.empty(this.args.options))
        {
            var _a_ = slash.splitFileLine(this.args.options[0]); file = _a_[0]; line = _a_[1]; column = _a_[2]

            if (line)
            {
                post.emit('file.open',file,line - 1,column - 1)
            }
            else
            {
                this.currentLoad = this.loadFile(file)
            }
        }
        else if (this.args.fresh)
        {
            this.hideEditor()
            this.menu.show(true)
        }
        else if (this.args.new)
        {
            this.newFile()
        }
    }

    KED.prototype["showEditor"] = function ()
    {
        this.editor.show()
        this.title.show()
        this.dircol.show()
        return this.funcol.show()
    }

    KED.prototype["hideEditor"] = function ()
    {
        this.editor.hide()
        this.title.hide()
        this.dircol.hide()
        return this.funcol.hide()
    }

    KED["run"] = async function ()
    {
        var ked

        ked = new KED
        if (ked.args.headless)
        {
            await ked.runHeadless()
        }
        return ked
    }

    KED.prototype["runHeadless"] = async function ()
    {
        var ended, step

        ended = new Promise((function (resolve)
        {
            return this.t.on('end',resolve)
        }).bind(this))
        if (!_k_.empty(this.currentLoad))
        {
            await this.currentLoad
        }
        if (this.t.input)
        {
            await ended
        }
        await sleep(100)
        this.dump('start')
        var list = _k_.list(this.t.steps())
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            step = list[_a_]
            this.t.play(step[1])
            if (!_k_.empty(this.currentLoad))
            {
                await this.currentLoad
            }
            await sleep(50)
            this.dump(step[0])
        }
        return this.quit()
    }

    KED.prototype["dump"] = function (label)
    {
        this.draw()
        process.stdout.write(`\n=== ${label}\n`)
        return process.stdout.write(this.screen.text().join('\n') + '\n')
    }

    KED.prototype["onSessionLoaded"] = function ()
    {
        var file

        if (this.args.fresh)
        {
            return
        }
        if (this.args.new)
        {
            return
        }
        if (_k_.empty(this.currentFile) && _k_.empty(this.loadingFile))
        {
            if (file = ked_session.get("editor▸file"))
            {
                return this.loadFile(file)
            }
            else
            {
                this.hideEditor()
                return this.menu.show(true)
            }
        }
    }

    KED.prototype["arrange"] = function ()
    {
        var dcw, fcw, h, w

        w = this.t.cols()
        h = this.t.rows()
        dcw = this.dircol.cells.cols
        fcw = this.funcol.cells.cols
        if (this.dircol.hidden() || !this.dircol.active)
        {
            dcw = 0
        }
        if (this.funcol.hidden() || !this.funcol.active)
        {
            fcw = 0
        }
        if (this.viewSizeDelta)
        {
            switch (this.viewSizeDelta.name)
            {
                case this.dircol.name:
                    dcw = this.dircol.cells.cols + this.viewSizeDelta.delta
                    break
                case this.funcol.name:
                    fcw = this.funcol.cells.cols + this.viewSizeDelta.delta
                    break
            }

            delete this.viewSizeDelta
        }
        if (this.dircol.visible() && this.dircol.active)
        {
            this.dircol.layout(0,0,dcw,h)
        }
        if (this.funcol.visible() && this.funcol.active)
        {
            this.funcol.layout(w - fcw,1,fcw,h - 1)
        }
        this.title.layout(dcw,0,w - dcw,1)
        return this.editor.layout(dcw,1,w - dcw - fcw,h - 1)
    }

    KED.prototype["quit"] = async function (msg)
    {
        var _266_10_

        clearImmediate(this.redrawId)
        this.quitting = true
        await this.session.save()
        console.log(_k_.w2(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ${_k_.b8(this.session.name)} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`))
        if ((msg != null))
        {
            if (msg.stack)
            {
                console.error(msg.stack)
            }
            console.error(`${_k_.y5(msg)}`)
        }
        ;(this.t != null ? this.t.quit() : undefined)
        return this.logfile.close(function ()
        {
            if ((msg != null ? msg.stack : undefined))
            {
                process.stderr.write(`${_k_.r4(msg.stack)}\n`)
            }
            if ((msg != null))
            {
                process.stderr.write(`${_k_.y5(msg)}`)
            }
            return process.exit(((msg != null) ? 1 : 0))
        })
    }

    KED.prototype["newFile"] = function ()
    {
        var _298_22_

        delete this.currentFile
        this.title.setFile('')
        this.editor.state.syntax.ext = 'txt'
        this.editor.state.loadLines([''])
        this.t.setCursor(0,0)
        this.t.setTitle('kėd')
        ;(this.editor.mapscr != null ? this.editor.mapscr.reload() : undefined)
        post.emit('file.loaded',null)
        this.showEditor()
        this.editor.grabFocus()
        return this.redraw()
    }

    KED.prototype["onFileChange"] = function (event)
    {
        if (event.path === this.currentFile)
        {
            switch (event.change)
            {
                case 'delete':
                    return this.newFile()

                case 'change':
                case 'rename':
                    return this.reloadFile()

            }

        }
    }

    KED.prototype["onGitStatus"] = function ()
    {
        return git.diff(this.currentFile)
    }

    KED.prototype["reloadFile"] = function ()
    {
        if (!_k_.empty(this.currentFile))
        {
            return this.loadFile(this.currentFile)
        }
        else
        {
            return this.newFile()
        }
    }

    KED.prototype["openFile"] = function (path, row, col, view)
    {
        this.currentLoad = this.loadFile(path,row,col,view)
        return this.editor.grabFocus()
    }

    KED.prototype["onQuicky"] = async function (path)
    {
        var file

        if (!_k_.empty(this.loadingFile))
        {
            return
        }
        if (slash.isAbsolute(path))
        {
            file = path
        }
        else
        {
            file = slash.absolute(path,slash.dir(this.currentFile))
        }
        if (slash.samePath(file,this.currentFile))
        {
            return
        }
        return await this.loadFile(file)
    }

    KED.prototype["loadFile"] = async function (p, row, col, view)
    {
        var absFile, colors, exists, gitDir, readingFile, segls, start, text

        console.log(`ked.loadFile ${p} ${row} ${col} ${this.loadingFile}`)
        start = process.hrtime()
        if (slash.isAbsolute(p))
        {
            absFile = slash.absolute(p)
        }
        else
        {
            absFile = slash.path(process.cwd(),p)
        }
        if (slash.samePath(absFile,this.loadingFile))
        {
            return
        }
        console.log(`ked.loadFile absFile ${absFile}`)
        this.loadingFile = absFile
        exists = await nfs.fileExists(this.loadingFile)
        if (!exists)
        {
            console.warn(`ked.loadFile - file doesn't exist! ${this.loadingFile}`)
            delete this.loadingFile
            return
        }
        this.loadingFile = await nfs.resolveSymlink(this.loadingFile)
        if (_k_.empty(this.loadingFile))
        {
            console.warn(`ked.loadFile - ${absFile} resolved to empty!`)
            return
        }
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 403, 8, 'loadingFile' + " this.loadingFile", this.loadingFile)
        readingFile = this.loadingFile
        text = await nfs.readText(this.loadingFile)
        if (this.loadingFile !== readingFile)
        {
            return
        }
        this.currentFile = this.loadingFile
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 415, 8, 'currentFile' + " this.currentFile", this.currentFile)
        delete this.loadingFile
        this.title.setFile(slash.tilde(this.currentFile))
        if (text === undefined)
        {
            text = '○ binary ○'
        }
        var _a_ = belt.colorSeglsForText(text); colors = _a_[0]; segls = _a_[1]

        if (!_k_.empty(colors))
        {
            this.editor.state.syntax.setColors(colors)
        }
        else
        {
            this.editor.state.syntax.setExt(slash.ext(this.currentFile))
        }
        this.editor.state.loadSegls(segls)
        this.editor.setCurrentFile(this.currentFile)
        ked_session.set("editor▸file",this.currentFile)
        this.title.time = process.hrtime(start)[1]
        mode.fileLoaded(this.editor.state,this.currentFile,row,col,view)
        post.emit('file.loaded',this.currentFile)
        this.showEditor()
        this.redraw()
        this.indexer.index(this.currentFile)
        prjcts.index(this.currentFile)
        git.diff(this.currentFile)
        watcher.watch(this.currentFile)
        this.t.setTitle(slash.file(this.title.file))
        this.saveSessionFile(this.currentFile,'loaded')
        if (gitDir = await git.dir(this.currentFile))
        {
            watcher.watch(slash.path(gitDir,'.git/refs/heads'),{recursive:false})
        }
        return this
    }

    KED.prototype["saveFile"] = async function ()
    {
        var text

        text = kseg.str(this.editor.state.s.lines)
        if (!_k_.empty(this.currentFile))
        {
            await nfs.write(this.currentFile,text)
            this.editor.state.clearHistory()
            this.redraw()
            return this.saveSessionFile(this.currentFile,'saved')
        }
    }

    KED.prototype["saveSessionFile"] = function (file, type)
    {
        frecent.fileAction(file,type)
        return this.session.set('files▸recent',frecent.store('file'))
    }

    KED.prototype["saveAs"] = function ()
    {
        console.log('todo: saveAs')
    }

    KED.prototype["onPaste"] = function (text)
    {
        this.editor.state.insert(text)
        return this.redraw()
    }

    KED.prototype["onMouse"] = function (event)
    {
        var handler, redraw, ret

        if (event.type === 'wheel')
        {
            var list = _k_.list(this.wheelHandlers)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                handler = list[_a_]
                if (ret = handler.onWheel(event))
                {
                    if (ret.redraw === true)
                    {
                        this.redraw()
                    }
                    return
                }
            }
            return
        }
        redraw = false
        var list1 = _k_.list(this.mouseHandlers)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            handler = list1[_b_]
            if (ret = handler.onMouse(event))
            {
                event.handled = true
                if (ret.redraw === true)
                {
                    redraw = true
                }
                if (event.type !== 'move' || handler.isPopup)
                {
                    break
                }
            }
        }
        if (event.button === 'right' && event.type === 'press' && event.count === 1)
        {
            var list2 = _k_.list(this.contextHandlers)
            for (var _c_ = 0; _c_ < list2.length; _c_++)
            {
                handler = list2[_c_]
                if (!handler.hover)
                {
                    continue
                }
                if (ret = handler.onContext(event))
                {
                    if (ret.redraw === true)
                    {
                        redraw = true
                    }
                    break
                }
            }
        }
        if (redraw)
        {
            return this.redraw()
        }
    }

    KED.prototype["showFinderOrSearcher"] = function ()
    {
        if (this.finder.visible() && !_k_.empty(this.finder.input.current()))
        {
            return this.searcher.show(this.finder.input.current())
        }
        else
        {
            return this.finder.show()
        }
    }

    KED.prototype["showFileposHistory"] = function ()
    {
        var files, scx, scy

        if (filepos.fileposl.length > 1)
        {
            files = filepos.fileposl.map(function (fp)
            {
                return fp[0]
            })
            files = files.reverse()
            if (filepos.offset === 0)
            {
                files.shift()
            }
            scx = parseInt(this.screen.cols / 2)
            scy = parseInt(this.screen.rows / 2)
            return post.emit('droop.show',{files:files,pos:[scx,scy - 6]})
        }
    }

    KED.prototype["onKey"] = function (key, event)
    {
        var handler, result

        switch (key)
        {
            case 'alt+1':
                return post.emit('filepos.goBackward')

            case 'alt+2':
                return post.emit('filepos.goForward')

            case 'cmd+1':
                return post.emit('filepos.swapPrevious')

            case 'alt+h':
                return this.showFileposHistory()

            case 'alt+q':
            case 'ctrl+q':
            case 'cmd+q':
                return this.quit()

            case 'ctrl+r':
            case 'cmd+r':
                return this.reloadFile()

            case 'ctrl+s':
            case 'cmd+s':
                return this.saveFile()

            case 'shift+cmd+s':
            case 'shift+ctrl+s':
                return this.saveAs()

            case 'cmd+n':
            case 'ctrl+n':
                return this.newFile()

            case 'alt+m':
                return this.menu.show()

            case 'cmd+p':
            case 'ctrl+p':
                return this.quicky.showProjectFiles(this.currentFile)

            case 'cmd+f':
            case 'ctrl+f':
                return this.showFinderOrSearcher()

            case 'shift+cmd+f':
            case 'shift+ctrl+f':
                return this.searcher.show()

            case 'alt+o':
                return this.editor.jumpToCounterpart()

            case 'alt+,':
                return this.editor.singleCursorAtLine(this.funcol.funtree.lineIndexOfPrevFunc())

            case 'alt+.':
                return this.editor.singleCursorAtLine(this.funcol.funtree.lineIndexOfNextFunc())

            case 'cmd+m':
            case 'cmd+;':
            case 'ctrl+;':
                return this.macro.show()

            case 'cmd+.':
            case 'ctrl+.':
                return this.browse.gotoDir(slash.dir(this.currentFile))

            case 'cmd+o':
            case 'ctrl+o':
                return post.emit('browse.dir',process.cwd())

            case 'cmd+i':
                return post.emit('differ.status')

            case 'alt+r':
                return post.emit('dircol.reveal',this.currentFile)

            case 'cmd+\\':
            case 'ctrl+\\':
                return post.emit('dircol.toggle')

            case "cmd+'":
            case "ctrl+'":
                return post.emit('funcol.toggle')

            case "alt+\\":
                return post.emit('dircol.focus')

            case "alt+'":
                return post.emit('funcol.focus')

        }

        var list = _k_.list(this.keyHandlers)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            handler = list[_a_]
            if (handler.hidden())
            {
                continue
            }
            if (result = handler.onKey(key,event))
            {
                break
            }
        }
        if ((result != null ? result.redraw : undefined) !== false)
        {
            return this.redraw()
        }
    }

    KED.prototype["onViewSize"] = function (name, side, delta)
    {
        this.viewSizeDelta = {name:name,side:side,delta:delta}
        return this.redraw()
    }

    KED.prototype["onResize"] = function (cols, rows, size, cellsz)
    {
        var mcw, _625_22_

        mcw = parseInt(cols / 6)
        rounded.cache = {}
        if (mcw >= 16)
        {
            this.dircol.cells.cols = mcw
            this.funcol.cells.cols = mcw
            this.dircol.show()
            this.funcol.show()
        }
        else
        {
            this.dircol.hide()
            this.funcol.hide()
        }
        squares.onResize(cols,rows,size,cellsz)
        sircels.onResize(cols,rows,size,cellsz)
        this.redraw()
        return (this.editor.mapscr != null ? this.editor.mapscr.onResize() : undefined)
    }

    KED.prototype["onInputPopup"] = function (opt)
    {
        this.input.set(opt.text)
        this.input.state.moveCursors('eol')
        this.input.layout(opt.x,opt.y,opt.w,1)
        this.input.grabFocus()
        this.input.orig = opt.text
        this.input.cb = opt.cb
        return this.redraw()
    }

    KED.prototype["onInputAction"] = function (action, event)
    {
        switch (action)
        {
            case 'submit':
                if (_k_.isFunc(this.input.cb))
                {
                    this.input.cb(this.input.current())
                }
                return this.input.hide()

            case 'cancel':
                if (_k_.isFunc(this.input.cb))
                {
                    this.input.cb(this.input.orig)
                }
                return this.input.hide()

        }

    }

    KED.prototype["redraw"] = function ()
    {
        if (this.quitting)
        {
            return
        }
        clearImmediate(this.redrawId)
        return this.redrawId = setImmediate(this.draw)
    }

    KED.prototype["draw"] = function ()
    {
        var start

        if (this.quitting)
        {
            return
        }
        start = process.hrtime()
        this.title.gutter = this.editor.state.gutterWidth()
        this.screen.init()
        this.arrange()
        if (this.menu.greet.hidden())
        {
            if (!this.differ.visible())
            {
                this.editor.draw()
            }
            this.title.draw()
            this.dircol.draw()
            this.funcol.draw()
        }
        this.menu.draw()
        this.macro.draw()
        this.quicky.draw()
        this.browse.draw()
        this.droop.draw()
        this.finder.draw()
        this.searcher.draw()
        this.differ.draw()
        this.context.draw()
        this.input.draw()
        this.screen.render()
        this.t.removeImgs()
        return this.title.time = process.hrtime(start)[1]
    }

    return KED
})()

export default KED.run;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    KED.run()
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VkLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tlZC9rZWQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUEwQlEsS0FBQyxVQUFVO1FBQ1gsS0FBQyxPQUFPLEtBQUs7Ozs7Ozs7O09BVUwsUUFBUSxLQUFLLFNBQVMsUUFBUSxLQUFDO1FBRXZDLFFBQVEsR0FBRyxvQkFBb0IsS0FBQztRQUNoQyxLQUFDLGNBQWMsUUFBUSxLQUFDO1FBQ3hCLEtBQUMsY0FBYyxRQUFRLEtBQUMsUUFBUTtRQUNoQyxPQUFPLGNBQWMsS0FBQztRQUV0QixLQUFDLFFBQVEsR0FBRyxTQUFTLEtBQUM7UUFDdEIsS0FBQyxRQUFRLE1BQUssU0FBUyxLQUFDLEtBQUs7UUFFN0IsS0FBQyxhQUFlLE9BQU8sS0FBQztRQUV4QixPQUFPLGFBQWEsS0FBQztRQUNyQixLQUFDLGNBQWU7UUFDaEIsS0FBQyxVQUFlO1FBRWhCLEtBQUMsV0FBZSxLQUFXLEtBQUM7UUFDNUIsS0FBQyxZQUFlLE1BQVcsS0FBQztRQUM1QixLQUFDLGFBQWUsT0FBVyxLQUFDO1FBQzVCLEtBQUMsYUFBZSxPQUFXLEtBQUM7UUFDNUIsS0FBQyxhQUFlLFdBQVcsS0FBQyxPQUFPO1FBQ25DLEtBQUMsWUFBZSxNQUFXLEtBQUMsT0FBTyxLQUFDO1FBQ3BDLEtBQUMsYUFBZSxPQUFXLEtBQUMsT0FBTyxLQUFDLFFBQVMsU0FBUztRQUN0RCxLQUFDLGFBQWUsT0FBVyxLQUFDLE9BQU8sS0FBQyxRQUFTLFNBQVM7UUFDdEQsS0FBQyxhQUFlLE9BQVcsS0FBQyxPQUFPLEtBQUM7UUFDcEMsS0FBQyxlQUFlLFNBQVcsS0FBQyxPQUFPLEtBQUM7UUFDcEMsS0FBQyxhQUFlLE9BQVcsS0FBQyxPQUFPLEtBQUM7UUFDcEMsS0FBQyxZQUFlLE1BQVcsS0FBQyxPQUFPLEtBQUM7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/ked.kode
