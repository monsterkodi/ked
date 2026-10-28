var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, isFunc: function (o) {return typeof o === 'function'}};_k_.b8=_k_.k.F256(_k_.k.b(8));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2))

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
import config from "./util/config.js"

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
import vinder from "./view/menu/vinder.js"

import browse from "./view/colmns/browse.js"
import dircol from "./view/colmns/dircol.js"
import funcol from "./view/colmns/funcol.js"
import quicky from "./view/colmns/quicky.js"
import droop from "./view/colmns/droop.js"
import saveas from "./view/colmns/saveas.js"

import child_process from "child_process"
let spawn = child_process.spawn
let exec = child_process.exec


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
        this["onSaveAs"] = this["onSaveAs"].bind(this)
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
        this["configAndSessionLoaded"] = this["configAndSessionLoaded"].bind(this)
        this["onConfigLoaded"] = this["onConfigLoaded"].bind(this)
        this["onSessionLoaded"] = this["onSessionLoaded"].bind(this)
        this["dump"] = this["dump"].bind(this)
        this["runHeadless"] = this["runHeadless"].bind(this)
        this["restart"] = this["restart"].bind(this)
        this.version = '0.9.0'
        this.args = karg(`
ked [file]
    options                                       **
    new        start with empty buffer          = false
    fresh      don't load previous session      = false
    timeout    session save timeout in ms       = 1000
    version    log version                      = false
    headless   run without a terminal           = false -H
    colors     headless with terminal colors    = false -C
    `,{preHelp:help.header(),version:this.version})
        process.on('uncaughtException',this.quit)
        this.session = new session(this.args)
        this.logfile = new logfile(this.session.name)
        console.log(_k_.w2(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ${_k_.b8(this.session.name)} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
        post.on('config.loaded',this.onConfigLoaded)
        config.load()
        global.ked_session = this.session
        this.session.on('loaded',this.onSessionLoaded)
        this.t = new ttio({headless:(this.args.headless || this.args.colors)})
        this.screen = new screen(this.t)
        global.ked_screen = this.screen
        this.indexer = new indexer
        this.git = new git
        this.menu = new menu(this.screen)
        this.macro = new macro(this.screen)
        this.quicky = new quicky(this.screen)
        this.browse = new browse(this.screen)
        this.saveas = new saveas(this.screen)
        this.editor = new fileeditor(this.screen,'editor')
        this.droop = new droop(this.screen,this.editor)
        this.dircol = new dircol(this.screen,this.editor,['scroll','knob'])
        this.funcol = new funcol(this.screen,this.editor,['scroll','knob'])
        this.finder = new finder(this.screen,this.editor)
        this.searcher = new searcher(this.screen,this.editor)
        this.vinder = new vinder(this.screen,this.editor)
        this.differ = new differ(this.screen,this.editor)
        this.title = new title(this.screen,this.editor)
        this.context = new context(this.screen)
        this.input = new input(this.screen,'ked_input')
        this.input.on('action',this.onInputAction)
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
        post.on('file.saveas',this.onSaveAs)
        post.on('quit',this.quit)
        post.on('file.change',this.onFileChange)
        post.on('git.status',this.onGitStatus)
        this.contextHandlers = [this.editor,this.dircol,this.funcol]
        this.mouseHandlers = [this.input,this.context,this.finder,this.searcher,this.vinder,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.menu,this.macro,this.editor,this.title,this.dircol,this.funcol]
        this.wheelHandlers = [this.finder,this.searcher,this.vinder,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.macro,this.editor,this.dircol,this.funcol]
        this.keyHandlers = [this.input,this.context,this.finder,this.searcher,this.vinder,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.menu,this.macro,this.editor,this.dircol,this.funcol]
        this.t.on('key',this.onKey)
        this.t.on('mouse',this.onMouse)
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
        if (ked.args.headless || ked.args.colors)
        {
            await ked.runHeadless()
        }
        return ked
    }

    KED.prototype["restart"] = function ()
    {
        var args, cmd, proc

        cmd = slash.path(_k_.dir(),'../../bin/ked_restart')
        args = [process.pid,process.execPath].concat(process.argv.slice(1))
        proc = spawn(cmd,args,{stdio:"inherit",detached:true,shell:true})
        return proc.unref()
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
        if (this.args.colors)
        {
            return process.stdout.write(this.screen.textColored().join('\n') + '\n')
        }
        else
        {
            return process.stdout.write(this.screen.textMarked().join('\n') + '\n')
        }
    }

    KED.prototype["onSessionLoaded"] = function ()
    {
        this.sessionLoaded = true
        if (this.configLoaded)
        {
            return this.configAndSessionLoaded()
        }
    }

    KED.prototype["onConfigLoaded"] = function ()
    {
        this.configLoaded = true
        if (this.sessionLoaded)
        {
            return this.configAndSessionLoaded()
        }
    }

    KED.prototype["configAndSessionLoaded"] = function ()
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
                console.log(`no current or loading file ... loading last session ${file}`)
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
        var _285_10_

        watcher.close()
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
        ;(this.t != null ? this.t.detach() : undefined)
        return this.logfile.close((function ()
        {
            return process.exit(((msg != null) ? 1 : 0))
        }).bind(this))
    }

    KED.prototype["newFile"] = function ()
    {
        var _317_22_

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
        var kk

        if (event.path === this.currentFile)
        {
            switch (event.change)
            {
                case 'delete':
                    this.newFile()
                    break
                case 'change':
                case 'rename':
                    this.reloadFile()
                    break
            }

        }
        if (KED.building)
        {
            return
        }
        if (this.args.headless)
        {
            return
        }
        if (event.change === 'rename' && slash.ext(event.path) === 'kode')
        {
            if (event.path.startsWith(slash.path(_k_.dir(),'../../kode/ked')))
            {
                KED.building = true
                kk = slash.path(_k_.dir(),'../../kk')
                return exec(`${kk} -k`,{},(function (err, stdout, stderr)
                {
                    if (_k_.empty(err))
                    {
                        return exec(`${kk} -t ked`,{},(function (err, stdout, stderr)
                        {
                            if (_k_.empty(err))
                            {
                                this.restart()
                                return this.quit()
                            }
                            else
                            {
                                console.log(err,stdout,stderr)
                                return KED.building = false
                            }
                        }).bind(this))
                    }
                    else
                    {
                        console.log(err,stdout,stderr)
                        return KED.building = false
                    }
                }).bind(this))
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
        var absFile, colors, exists, ext, gitDir, readingFile, reload, reloadCursor, reloadView, segls, start, text, _496_22_, _496_29_

        start = process.hrtime()
        if (slash.isAbsolute(p))
        {
            absFile = slash.absolute(p)
        }
        else
        {
            absFile = slash.path(process.cwd(),p)
        }
        reload = !_k_.empty(this.currentFile) && !(row != null) && slash.samePath(absFile,this.currentFile)
        if (reload)
        {
            reloadCursor = this.editor.state.mainCursor()
            reloadView = this.editor.state.s.view.asMutable()
        }
        if (slash.samePath(absFile,this.loadingFile))
        {
            return
        }
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
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 452, 8, 'loadingFile' + " this.loadingFile", this.loadingFile)
        readingFile = this.loadingFile
        text = await nfs.readText(this.loadingFile)
        if (this.loadingFile !== readingFile)
        {
            return
        }
        this.currentFile = this.loadingFile
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 464, 8, 'currentFile' + " this.currentFile", this.currentFile)
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
            ext = config.data.filetypes[slash.file(this.currentFile)]
            ext = (ext != null ? ext : slash.ext(this.currentFile))
            this.editor.state.syntax.setExt(ext)
        }
        this.editor.state.loadSegls(segls)
        this.editor.setCurrentFile(this.currentFile)
        ked_session.set("editor▸file",this.currentFile)
        this.title.time = process.hrtime(start)[1]
        if (reload)
        {
            this.editor.state.setView(reloadView)
            this.editor.state.setCursors([reloadCursor],{adjust:false})
        }
        else
        {
            mode.fileLoaded(this.editor.state,this.currentFile,row,col,view)
        }
        post.emit('file.loaded',this.currentFile)
        if (((_496_22_=config.data) != null ? (_496_29_=_496_22_.novim) != null ? _496_29_.autoStart : undefined : undefined))
        {
            if (!mode.isActive(this.editor.state,'novim'))
            {
                this.editor.state.toggleMode('novim')
            }
        }
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
        var dir, file

        dir = process.cwd()
        file = ''
        if (!_k_.empty(this.currentFile))
        {
            dir = slash.dir(this.currentFile)
            file = slash.file(this.currentFile)
        }
        return this.saveas.showDialog(dir,file)
    }

    KED.prototype["onSaveAs"] = async function (path)
    {
        var text

        text = kseg.str(this.editor.state.s.lines)
        await nfs.write(path,text)
        this.editor.state.clearHistory()
        this.currentFile = path
        this.title.setFile(slash.tilde(path))
        this.t.setTitle(slash.file(path))
        ked_session.set('editor▸file',path)
        this.editor.setCurrentFile(path)
        this.editor.state.syntax.setExt(slash.ext(path))
        this.editor.state.syntax.clear()
        this.editor.state.syntax.setSegls(this.editor.state.s.lines)
        this.indexer.index(path)
        prjcts.index(path)
        git.diff(path)
        watcher.watch(path)
        this.saveSessionFile(path,'saved')
        return this.redraw()
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
            case 'ctrl+1':
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

            case 'shift+cmd+p':
            case 'shift+ctrl+p':
                return this.quicky.showRecentFiles(this.currentFile)

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
        var mcw, _724_22_

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
        this.saveas.draw()
        this.droop.draw()
        this.finder.draw()
        this.searcher.draw()
        this.vinder.draw()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VkLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tlZC9rZWQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFPLFVBQUE7SUFBYTtJQUFLO0lBQUs7SUFBSztJQUFNO0lBQUs7SUFBSTs7T0FDOUIsYUFBZDtPQUFxQixjQUFyQjs7T0FDYyxjQUFkO09BQXNCLGNBQXRCO09BQThCLFdBQTlCO09BQW1DLGNBQW5DO09BQTJDLGNBQTNDO09BQW1ELFVBQW5EO09BQXVELGFBQXZEOztPQUNjLGNBQUE7T0FBUSxjQUFBO09BQVEsY0FBQTs7T0FDaEIsV0FBVDs7T0FDUyxXQUFkOztPQUNjLGNBQVI7O09BQ1EsV0FBVDtPQUFjLFlBQWQ7O09BQ1MsWUFBVDs7T0FDUyxpQkFBVDs7T0FDUyxhQUFSO09BQWUsV0FBZjs7T0FDUSxjQUFSO09BQWdCLFdBQWhCO09BQXFCLFlBQXJCO09BQTJCLGFBQTNCO09BQWtDLGVBQWxDO09BQTJDLGFBQTNDO09BQWtELGFBQWxEOztPQUNRLGFBQVQ7T0FBZ0IsYUFBaEI7T0FBdUIsYUFBdkI7T0FBOEIsYUFBOUI7T0FBcUMsWUFBckM7T0FBMkMsYUFBM0M7O09BQ1Asb0JBQUE7SUFBZ0I7SUFBTTs7O0FBRWpCLE9BQVQ7O2FBRUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFSSxLQUFDLFVBQVU7UUFDWCxLQUFDLE9BQU8sS0FBSzs7Ozs7Ozs7O09BV0wsUUFBUSxLQUFLLFNBQVMsUUFBUSxLQUFDO1FBRXZDLFFBQVEsR0FBRyxvQkFBb0IsS0FBQztRQUNoQyxLQUFDLGNBQWMsUUFBUSxLQUFDO1FBQ3hCLEtBQUMsY0FBYyxRQUFRLEtBQUMsUUFBUTtRQUVoQyxZQUFJLHlDQUFxQyxPQUFHLEtBQUMsUUFBUTtRQUVyRCxLQUFLLEdBQUcsZ0JBQWdCLEtBQUM7UUFDekIsT0FBTztRQUVQLE9BQU8sY0FBYyxLQUFDO1FBRXRCLEtBQUMsUUFBUSxHQUFHLFNBQVMsS0FBQztRQUN0QixLQUFDLFFBQVEsTUFBSyxVQUFV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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/ked.kode
