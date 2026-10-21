var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isFunc: function (o) {return typeof o === 'function'}};_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.b8=_k_.k.F256(_k_.k.b(8));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2))

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
        var ended

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
        this.t.playScript()
        await sleep(100)
        this.draw()
        process.stdout.write(this.screen.text().join('\n') + '\n')
        return this.quit()
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
        var _251_10_

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
        var _283_22_

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
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 388, 8, 'loadingFile' + " this.loadingFile", this.loadingFile)
        readingFile = this.loadingFile
        text = await nfs.readText(this.loadingFile)
        if (this.loadingFile !== readingFile)
        {
            return
        }
        this.currentFile = this.loadingFile
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 400, 8, 'currentFile' + " this.currentFile", this.currentFile)
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
        var mcw, _610_22_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VkLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tlZC9rZWQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQTBCUSxLQUFDLFVBQVU7UUFDWCxLQUFDLE9BQU8sS0FBSzs7Ozs7Ozs7T0FVTCxRQUFRLEtBQUssU0FBUyxRQUFRLEtBQUM7UUFFdkMsUUFBUSxHQUFHLG9CQUFvQixLQUFDO1FBQ2hDLEtBQUMsY0FBYyxRQUFRLEtBQUM7UUFDeEIsS0FBQyxjQUFjLFFBQVEsS0FBQyxRQUFRO1FBQ2hDLE9BQU8sY0FBYyxLQUFDO1FBRXRCLEtBQUMsUUFBUSxHQUFHLFNBQVMsS0FBQztRQUN0QixLQUFDLFFBQVEsTUFBSyxTQUFTLEtBQUMsS0FBSztRQUU3QixLQUFDLGFBQWUsT0FBTyxLQUFDO1FBRXhCLE9BQU8sYUFBYSxLQUFDO1FBQ3JCLEtBQUMsY0FBZTtRQUNoQixLQUFDLFVBQWU7UUFFaEIsS0FBQyxXQUFlLEtBQVcsS0FBQztRQUM1QixLQUFDLFlBQWUsTUFBVyxLQUFDO1FBQzVCLEtBQUMsYUFBZSxPQUFXLEtBQUM7UUFDNUIsS0FBQyxhQUFlLE9BQVcsS0FBQztRQUM1QixLQUFDLGFBQWUsV0FBVyxLQUFDLE9BQU87UUFDbkMsS0FBQyxZQUFlLE1BQVcsS0FBQyxPQUFPLEtBQUM7UUFDcEMsS0FBQyxhQUFlLE9BQVcsS0FBQyxPQUFPLEtBQUMsUUFBUyxTQUFTO1FBQ3RELEtBQUMsYUFBZSxPQUFXLEtBQUMsT0FBTyxLQUFDLFFBQVMsU0FBUztRQUN0RCxLQUFDLGFBQWUsT0FBVyxLQUFDLE9BQU8sS0FBQztRQUNwQyxLQUFDLGVBQWUsU0FBVyxLQUFDLE9BQU8sS0FBQztRQUNwQyxLQUFDLGFBQWUsT0FBVyxLQUFDLE9BQU8sS0FBQztRQUNwQyxLQUFDLFlBQWUsTUFBVyxLQUFDLE9BQU8sS0FBQztRQUNwQyxLQUFDLGNBQWUsUUFBVyxLQUFDO1FBQzVCLEtBQUMsWUFBZSxNQUFXLEtBQUM7UUFFNUIsS0FBQyxNQUFNLEdBQUcsU0FBUyxLQUFDO1FBRXBCLDREQUE0QyxLQUFDLFFBQVE7UUFFckQsS0FBQyxPQUFPLE1BQU0sV0FBVztRQUN6QixLQUFDLE9BQU8sVUFBVSxLQUFDLE9BQU87UUFFMUIsS0FBSyxHQUFHLFNBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGVBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGNBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGNBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLFlBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLFNBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLFdBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGNBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLFlBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLE9BQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGNBQWdCLEtBQUM7UUFDekIsS0FBSyxHQUFHLGFBQWdCLEtBQUM7UUFHekIsS0FBQyxtQkFBa0csS0FBQyxPQUFlLEtBQUMsT0FBTyxLQUFDO1FBQzVILEtBQUMsaUJBQW9CLEtBQUMsTUFBTSxLQUFDLFFBQVEsS0FBQyxPQUFPLEtBQUMsU0FBUyxLQUFDLE9BQU8sS0FBQyxPQUFPLEtBQUMsT0FBTyxLQUFDLE1BQU0sS0FBQyxLQUFLLEtBQUMsTUFBTSxLQUFDLE9BQU8sS0FBQyxNQUFNLEtBQUMsT0FBTyxLQUFDO1FBQzNILEtBQUMsaUJBQW9DLEtBQUMsT0FBTyxLQUFDLFNBQVMsS0FBQyxPQUFPLEtBQUMsT0FBTyxLQUFDLE9BQU8sS0FBQyxNQUFZLEtBQUMsTUFBTSxLQUFDLE9BQWUsS0FBQyxPQUFPLEtBQUM7UUFDNUgsS0FBQyxlQUFvQixLQUFDLE1BQU0sS0FBQyxRQUFRLEtBQUMsT0FBTyxLQUFDLFNBQVMsS0FBQyxPQUFPLEtBQUMsT0FBTyxLQUFDLE9BQU8sS0FBQyxNQUFNLEtBQUMsS0FBSyxLQUFDLE1BQU0sS0FBQyxPQUFlLEtBQUMsT0FBTyxLQUFDO1FBRTVILEtBQUMsRUFBRSxHQUFHLE1BQVMsS0FBQztRQUNoQixLQUFDLEVBQUUsR0FBRyxRQUFTLEtBQUM7UUFDaEIsS0FBQyxFQUFFLEdBQUcsUUFBUyxLQUFDO1FBQ2hCLEtBQUMsRUFBRSxHQUFHLFNBQVMsS0FBQztRQUNoQixLQUFDLEVBQUUsR0FBRyxRQUFTLEtBQUM7UUFFaEIsWUFBSSxXQUFZLFFBQVE7UUFDeEIsWUFBSSxZQUFZLEtBQUM7UUFFakIsWUFBWSxJQUFJLFdBQVcsS0FBQzt1QkFFbkIsS0FBQyxLQUFLOztzQkFDVSxNQUFNLGNBQWMsS0FBQyxLQUFLLFFBQVE7O2dCQUNwRDs7Z0JBQ0EsS0FBSyxLQUFLLFlBQVksS0FBSyxPQUFLLEVBQUUsU0FBTzs7OztnQkFFeEMsS0FBQyxjQUFjLEtBQUMsU0FBUzs7O2lCQUN6QixLQUFDLEtBQUs7O1lBQ1YsS0FBQztZQUNELEtBQUMsS0FBSyxLQUFLOztpQkFDUCxLQUFDLEtBQUs7O1lBQ1YsS0FBQzs7Ozs7O1FBSUwsS0FBQyxPQUFPO1FBQ1IsS0FBQyxNQUFNO1FBQ1AsS0FBQyxPQUFPO2VBQ1IsS0FBQyxPQUFPOzs7OztRQUlSLEtBQUMsT0FBTztRQUNSLEtBQUMsTUFBTTtRQUNQLEtBQUMsT0FBTztlQUNSLEtBQUMsT0FBTzs7Ozs7OztRQVVSLFVBQVU7WUFFYSxJQUFJLEtBQUs7O2tCQUE5QixJQUFJOztlQUVOOzs7Ozs7O1FBY0EsWUFBWTs7bUJBQ1IsS0FBQyxFQUFFLEdBQUcsTUFBTTs7dUJBS1EsS0FBQzs7a0JBQXZCLEtBQUM7O1lBRUEsS0FBQyxFQUFFOztrQkFDQTs7UUFFTixLQUFDLEVBQUU7Y0FNRCxNQUFNO1FBRVIsS0FBQztRQUVELFFBQVEsT0FBTyxNQUFNLEtBQUMsT0FBTyxPQUFPLEtBQUssUUFBUTtlQUVqRCxLQUFDOzs7Ozs7O1lBVUssS0FBQyxLQUFLOzs7O1lBQ04sS0FBQyxLQUFLOzs7O3NCQUVILEtBQUMsMEJBQXNCLEtBQUM7O2dCQUMxQixPQUFPLFlBQVksSUFBSTs7dUJBRXRCLEtBQUMsU0FBUzs7OztnQkFFVixLQUFDO3VCQUNELEtBQUMsS0FBSyxLQUFLOzs7Ozs7Ozs7UUFVbkIsSUFBSSxLQUFDLEVBQUU7UUFDUCxJQUFJLEtBQUMsRUFBRTtRQUVQLE1BQU0sS0FBQyxPQUFPLE1BQU07UUFDcEIsTUFBTSxLQUFDLE9BQU8sTUFBTTtZQUVULEtBQUMsT0FBTyxhQUFnQixLQUFDLE9BQU87O1lBQTNDLE1BQU07O1lBQ0ssS0FBQyxPQUFPLGFBQWdCLEtBQUMsT0FBTzs7WUFBM0MsTUFBTTs7WUFFSCxLQUFDOztvQkFDTyxLQUFDLGNBQWM7O3FCQUNsQixLQUFDLE9BQU87b0JBQU8sTUFBTSxLQUFDLE9BQU8sTUFBTSxPQUFPLEtBQUMsY0FBYzs7cUJBQ3pELEtBQUMsT0FBTztvQkFBTyxNQUFNLEtBQUMsT0FBTyxNQUFNLE9BQU8sS0FBQyxjQUFjOzs7O21CQUN0RCxLQUFDOztZQUVnQyxLQUFDLE9BQU8sYUFBYyxLQUFDLE9BQU87O1lBQTFFLEtBQUMsT0FBTyxPQUFRLEVBQU0sRUFBRyxJQUFXOztZQUNRLEtBQUMsT0FBTyxhQUFjLEtBQUMsT0FBTzs7WUFBMUUsS0FBQyxPQUFPLE9BQVEsSUFBRSxJQUFJLEVBQUcsSUFBVyxJQUFFOztRQUN0QyxLQUFDLE1BQU0sT0FBUSxJQUFNLEVBQUcsSUFBRSxJQUFTO2VBQ25DLEtBQUMsT0FBTyxPQUFRLElBQU0sRUFBRyxJQUFFLE1BQUksSUFBSyxJQUFFOzs7Ozs7O1FBVXRDLGVBQWUsS0FBQztRQUVoQixLQUFDLFdBQVc7Y0FFVixLQUFDLFFBQVE7UUFFWCw0REFBNEMsS0FBQyxRQUFRO2FBR2xEOztnQkFDb0IsSUFBSTs7Z0JBQXZCLGNBQU0sSUFBSTs7WUFDVix3QkFBWTs7VUFFaEIsS0FBQyxZQUFELEtBQUMsRUFBRztlQUVKLEtBQUMsUUFBUTs7aUJBRXVDLGNBQUEsSUFBSzs7Z0JBQWpELFFBQVEsT0FBTyxnQkFBWSxJQUFJOztpQkFDSzs7Z0JBQXBDLFFBQVEsT0FBTyxnQkFBWTs7bUJBQzNCLFFBQVEsT0FBSyxlQUFPLElBQUk7Ozs7Ozs7O2VBVXJCLEtBQUM7UUFFUixLQUFDLE1BQU0sUUFBUTtRQUVmLEtBQUMsT0FBTyxNQUFNLE9BQU8sTUFBTTtRQUMzQixLQUFDLE9BQU8sTUFBTSxXQUFXO1FBUXpCLEtBQUMsRUFBRSxVQUFVLEVBQUU7UUFDZixLQUFDLEVBQUUsU0FBUztVQUVaLEtBQUMsT0FBTyxpQkFBUixLQUFDLE9BQU8sT0FBUTtRQUVoQixLQUFLLEtBQUssY0FBYztRQUV4QixLQUFDO1FBRUQsS0FBQyxPQUFPO2VBRVIsS0FBQzs7Ozs7WUFVRSxNQUFNLFNBQVEsS0FBQzs7b0JBQ1AsTUFBTTs7cUJBQ1Q7MkJBQVcsS0FBQzs7cUJBQ1o7cUJBQ0E7MkJBQVcsS0FBQzs7Ozs7Ozs7O2VBRVIsSUFBSSxLQUFLLEtBQUM7Ozs7O3VCQVViLEtBQUM7O21CQUNOLEtBQUMsU0FBUyxLQUFDOzs7O21CQUVYLEtBQUM7Ozs7OztRQVVMLEtBQUMsY0FBYyxLQUFDLFNBQVMsS0FBSyxJQUFJLElBQUk7ZUFDdEMsS0FBQyxPQUFPOzs7Ozs7O3VCQVVJLEtBQUM7Ozs7WUFFVixNQUFNLFdBQVc7O1lBQ2hCLE9BQU87Ozs7WUFFUCxPQUFPLE1BQU0sU0FBUyxLQUFLLE1BQU0sSUFBSSxLQUFDOztZQUVwQyxNQUFNLFNBQVMsS0FBSyxLQUFDOzs7O3FCQUV6QixLQUFDLFNBQVM7Ozs7Ozs7UUFVWiw0QkFBb0IsS0FBSyxPQUFPLE9BQU8sS0FBQztRQUV4QyxRQUFRLFFBQVE7WUFFYixNQUFNLFdBQVc7O1lBQ2hCLFVBQVUsTUFBTSxTQUFTOzs7O1lBRXpCLFVBQVUsTUFBTSxLQUFLLFFBQVEsTUFBTTs7WUFFakMsTUFBTSxTQUFTLFFBQVEsS0FBQzs7OztRQUU5QixvQ0FBNEI7UUFFNUIsS0FBQyxjQUFjO1FBRWYsZUFBVSxJQUFJLFdBQVcsS0FBQzthQUVuQjs7WUFDSCxtREFBMkMsS0FBQzttQkFDckMsS0FBQzs7O1FBR1osS0FBQyxvQkFBZSxJQUFJLGVBQWUsS0FBQztzQkFFM0IsS0FBQzs7WUFDTiwrQkFBdUI7OzttRkFHWCxLQUFDLGNBQUQsS0FBQztRQUVqQixjQUFjLEtBQUM7UUFFZixhQUFRLElBQUksU0FBUyxLQUFDO1lBRW5CLEtBQUMsZ0JBQWU7Ozs7UUFJbkIsS0FBQyxjQUFjLEtBQUM7bUZBRUEsS0FBQyxjQUFELEtBQUM7ZUFFVixLQUFDO1FBRVIsS0FBQyxNQUFNLFFBQVEsTUFBTSxNQUFNLEtBQUM7WUFFekIsU0FBUTs7WUFDUCxPQUFPOztrQkFFTSxLQUFLLGtCQUFrQjs7dUJBRS9COztZQUNMLEtBQUMsT0FBTyxNQUFNLE9BQU8sVUFBVTs7OztZQUUvQixLQUFDLE9BQU8sTUFBTSxPQUFPLE9BQU8sTUFBTSxJQUFJLEtBQUM7O1FBRTNDLEtBQUMsT0FBTyxNQUFNLFVBQVU7UUFDeEIsS0FBQyxPQUFPLGVBQWUsS0FBQztRQUN4QixZQUFZLElBQUksY0FBYyxLQUFDO1FBRS9CLEtBQUMsTUFBTSxPQUFPLFFBQVEsT0FBTyxPQUFPO1FBRXBDLEtBQUssV0FBVyxLQUFDLE9BQU8sTUFBTSxLQUFDLFlBQVksSUFBSSxJQUFJO1FBRW5ELEtBQUssS0FBSyxjQUFjLEtBQUM7UUFFekIsS0FBQztRQUNELEtBQUM7UUFFRCxLQUFDLFFBQVEsTUFBTSxLQUFDO1FBQ2hCLE9BQU8sTUFBUSxLQUFDO1FBQ2hCLElBQUksS0FBVyxLQUFDO1FBRWhCLFFBQVEsTUFBTyxLQUFDO1FBRWhCLEtBQUMsRUFBRSxTQUFTLE1BQU0sS0FBSyxLQUFDLE1BQU07UUFFOUIsS0FBQyxnQkFBZ0IsS0FBQyxZQUFZO1lBRTNCLGVBQVUsSUFBSSxJQUFJLEtBQUM7O1lBQ2xCLFFBQVEsTUFBTSxNQUFNLEtBQUssT0FBTyxvQkFBbUIsVUFBVTs7ZUFFakU7Ozs7Ozs7UUFVQSxPQUFPLEtBQUssSUFBSSxLQUFDLE9BQU8sTUFBTSxFQUFFO3VCQUV2QixLQUFDOztrQkFDSixJQUFJLE1BQU0sS0FBQyxZQUFZO1lBQ3pCLEtBQUMsT0FBTyxNQUFNO1lBQ2QsS0FBQzttQkFDRCxLQUFDLGdCQUFnQixLQUFDLFlBQVk7Ozs7OztRQUlsQyxRQUFRLFdBQVcsS0FBSztlQUV4QixLQUFDLFFBQVEsSUFBSSxlQUFlLFFBQVEsTUFBTTs7Ozs7UUFFbkMsWUFBSTs7Ozs7UUFVWCxLQUFDLE9BQU8sTUFBTSxPQUFPO2VBQ3JCLEtBQUM7Ozs7Ozs7WUFVRSxNQUFNLFNBQVE7O2dDQUVFLEtBQUM7Ozs7b0JBQ1QsTUFBTSxRQUFRLFFBQVE7O3dCQUNsQixJQUFJLFdBQVU7O3dCQUNiLEtBQUM7Ozs7Ozs7UUFJakIsU0FBUzs2QkFFTSxLQUFDOzs7O2dCQUVULE1BQU0sUUFBUSxRQUFROztnQkFDckIsTUFBTSxVQUFVO29CQUNiLElBQUksV0FBVTs7b0JBQ2IsU0FBUzs7b0JBQ0osTUFBTSxTQUFRLFVBQVUsUUFBUTs7b0JBQXpDOzs7O1lBRUwsTUFBTSxXQUFVLFdBQVksTUFBTSxTQUFRLFdBQVksTUFBTSxVQUFTOztpQ0FFckQsS0FBQzs7OztxQkFDSSxRQUFROztvQkFBeEI7O29CQUNHLE1BQU0sUUFBUSxVQUFVOzt3QkFDcEIsSUFBSSxXQUFVOzt3QkFDYixTQUFTOztvQkFDYjs7OztZQUVDOzttQkFBYixLQUFDOzs7Ozs7WUFJRSxLQUFDLE9BQU8sd0JBQW9CLEtBQUMsT0FBTyxNQUFNOzttQkFDekMsS0FBQyxTQUFTLEtBQUssS0FBQyxPQUFPLE1BQU07Ozs7bUJBRTdCLEtBQUMsT0FBTzs7Ozs7Ozs7WUFJVCxRQUFRLFNBQVMsU0FBUzs7WUFFekIsUUFBUSxRQUFRLFNBQVM7O3VCQUFZLEdBQUc7O1lBQ3hDLFFBQVEsTUFBTTtnQkFDRyxRQUFRLFdBQVU7O2dCQUFuQyxNQUFNOztZQUNOLGVBQVUsS0FBQyxPQUFPLE9BQUs7WUFDdkIsZUFBVSxLQUFDLE9BQU8sT0FBSzttQkFDdkIsS0FBSyxLQUFLLGNBQWEsTUFBTSxNQUFNLEtBQUssSUFBSSxNQUFJOzs7Ozs7OztnQkFZN0M7O2lCQUVIO3VCQUFrQyxLQUFLLEtBQUs7O2lCQUM1Qzt1QkFBa0MsS0FBSyxLQUFLOztpQkFDNUM7dUJBQWtDLEtBQUssS0FBSzs7aUJBQzVDO3VCQUFrQyxLQUFDOztpQkFDbkM7aUJBQVE7aUJBQVM7dUJBQWlCLEtBQUM7O2lCQUNuQztpQkFBUzt1QkFBeUIsS0FBQzs7aUJBQ25DO2lCQUFTO3VCQUF5QixLQUFDOztpQkFDbkM7aUJBQWM7dUJBQW9CLEtBQUM7O2lCQUNuQztpQkFBUTt1QkFBMEIsS0FBQzs7aUJBQ25DO3VCQUFrQyxLQUFDLEtBQUs7O2lCQUN4QztpQkFBUTt1QkFBMEIsS0FBQyxPQUFPLGlCQUFpQixLQUFDOztpQkFDNUQ7aUJBQVE7dUJBQTBCLEtBQUM7O2lCQUNuQztpQkFBYzt1QkFBb0IsS0FBQyxTQUFTOztpQkFDNUM7dUJBQWtDLEtBQUMsT0FBTzs7aUJBQzFDO3VCQUFrQyxLQUFDLE9BQU8sbUJBQW1CLEtBQUMsT0FBTyxRQUFROztpQkFDN0U7dUJBQWtDLEtBQUMsT0FBTyxtQkFBbUIsS0FBQyxPQUFPLFFBQVE7O2lCQUM3RTtpQkFBUTtpQkFBUTt1QkFBa0IsS0FBQyxNQUFNOztpQkFDekM7aUJBQVE7dUJBQTBCLEtBQUMsT0FBTyxRQUFRLE1BQU0sSUFBSSxLQUFDOztpQkFDN0Q7aUJBQVE7dUJBQTBCLEtBQUssS0FBSyxhQUFhLFFBQVE7O2lCQUNqRTt1QkFBa0MsS0FBSyxLQUFLOztpQkFDNUM7dUJBQWtDLEtBQUssS0FBSyxnQkFBZ0IsS0FBQzs7aUJBQzdEO2lCQUFTO3VCQUF5QixLQUFLLEtBQUs7O2lCQUM1QztpQkFBUTt1QkFBMEIsS0FBSyxLQUFLOztpQkFDNUM7dUJBQWtDLEtBQUssS0FBSzs7aUJBQzVDO3VCQUFrQyxLQUFLLEtBQUs7Ozs7NEJBRWpDLEtBQUM7Ozs7Z0JBRUEsUUFBUTs7Z0JBQXBCOztnQkFDUyxTQUFTLFFBQVEsTUFBTSxJQUFJOztnQkFBcEM7OzthQUdTLGlCQUFBLE9BQVEsd0JBQVU7O21CQUEvQixLQUFDOzs7Ozs7UUFVRCxLQUFDLGlCQUFnQixLQUFLLEtBQUssS0FBSyxLQUFLLE1BQU07ZUFDM0MsS0FBQzs7Ozs7OztRQUlELGVBQVUsT0FBSztRQUVmLFFBQVE7WUFFTCxPQUFPOztZQUNOLEtBQUMsT0FBTyxNQUFNLE9BQU87WUFDckIsS0FBQyxPQUFPLE1BQU0sT0FBTztZQUNyQixLQUFDLE9BQU87WUFDUixLQUFDLE9BQU87Ozs7WUFFUixLQUFDLE9BQU87WUFDUixLQUFDLE9BQU87O1FBRVosUUFBUSxTQUFTLEtBQUssS0FBSyxLQUFLO1FBQ2hDLFFBQVEsU0FBUyxLQUFLLEtBQUssS0FBSztRQUNoQyxLQUFDO2dCQUNELEtBQUMsT0FBTyxpQkFBUixLQUFDLE9BQU8sT0FBUTs7Ozs7UUFVaEIsS0FBQyxNQUFNLElBQUksSUFBSTtRQUNmLEtBQUMsTUFBTSxNQUFNLFlBQVk7UUFDekIsS0FBQyxNQUFNLE9BQU8sSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFDaEMsS0FBQyxNQUFNO1FBQ1AsS0FBQyxNQUFNLE9BQU8sSUFBSTtRQUNsQixLQUFDLE1BQU0sS0FBSyxJQUFJO2VBQ2hCLEtBQUM7Ozs7O2dCQUtNOztpQkFDSDsrQkFDTyxLQUFDLE1BQU07O29CQUNOLEtBQUMsTUFBTSxHQUFHLEtBQUMsTUFBTTs7dUJBQ3JCLEtBQUMsTUFBTTs7aUJBQ1g7K0JBQ08sS0FBQyxNQUFNOztvQkFDTixLQUFDLE1BQU0sR0FBRyxLQUFDLE1BQU07O3VCQUNyQixLQUFDLE1BQU07Ozs7Ozs7O1lBVVQsS0FBQzs7OztRQUVQLGVBQWUsS0FBQztlQUNoQixLQUFDLFdBQVcsYUFBYSxLQUFDOzs7Ozs7O1lBSXBCLEtBQUM7Ozs7UUFJUCxRQUFRLFFBQVE7UUFFaEIsS0FBQyxNQUFNLFNBQVMsS0FBQyxPQUFPLE1BQU07UUFFOUIsS0FBQyxPQUFPO1FBRVIsS0FBQztZQUdFLEtBQUMsS0FBSyxNQUFNOztpQkFDVyxLQUFDLE9BQU87O2dCQUE5QixLQUFDLE9BQU87O1lBQ1IsS0FBQyxNQUFNO1lBQ1AsS0FBQyxPQUFPO1lBQ1IsS0FBQyxPQUFPOztRQUVaLEtBQUMsS0FBSztRQUNOLEtBQUMsTUFBTTtRQUNQLEtBQUMsT0FBTztRQUNSLEtBQUMsT0FBTztRQUNSLEtBQUMsTUFBTTtRQUNQLEtBQUMsT0FBTztRQUNSLEtBQUMsU0FBUztRQUNWLEtBQUMsT0FBTztRQUNSLEtBQUMsUUFBUTtRQUNULEtBQUMsTUFBTTtRQUdQLEtBQUMsT0FBTztRQUNSLEtBQUMsRUFBRTtlQUdILEtBQUMsTUFBTSxPQUFPLFFBQVEsT0FBTyxPQUFPOzs7Ozs7ZUFFckMsSUFBSTs7O0lBR1AsSUFBSSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/ked.kode
