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
import dumpstate from "./util/dumpstate.js"
import filecolors from "./util/filecolors.js"
import leak from "./util/leak.js"

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
        this["saveAndQuit"] = this["saveAndQuit"].bind(this)
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
        this["startup"] = this["startup"].bind(this)
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
        this.logfile = new logfile(this.session.name,(this.args.headless || this.args.colors))
        leak.start(this.args)
        console.log(_k_.w2(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ${_k_.b8(this.session.name)} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
        config.load()
        global.ked_session = this.session
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
        post.on('file.save',this.saveFile)
        post.on('file.saveAndQuit',this.saveAndQuit)
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
        this.startup()
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
        if (this.currentLoad)
        {
            await this.currentLoad
        }
        if (this.t.input)
        {
            await ended
        }
        if (config.loaded)
        {
            await config.loaded
        }
        await mode.loaded
        this.dump('start')
        var list = _k_.list(this.t.steps())
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            step = list[_a_]
            this.t.play(step[1])
            if (this.currentLoad)
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
        var line, state

        this.draw()
        state = dumpstate.tags(this.editor.state,this.currentFile)
        line = (!_k_.empty(state) ? `${label} ${state}` : label)
        process.stdout.write(`\n=== ${line}\n`)
        if (this.args.colors)
        {
            return process.stdout.write(this.screen.textColored().join('\n') + '\n')
        }
        else
        {
            return process.stdout.write(this.screen.textMarked().join('\n') + '\n')
        }
    }

    KED.prototype["startup"] = async function ()
    {
        var file

        if (config.loaded)
        {
            await config.loaded
        }
        await this.session.loaded
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
        var _286_10_

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
        var _318_22_

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
        if (true)
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
        var absFile, colors, exists, ext, fileColorData, fileColors, gitDir, readingFile, reload, reloadCursor, reloadView, segls, start, text, _508_22_, _508_29_

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
        if (config.loaded)
        {
            await config.loaded
        }
        await mode.loaded
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
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 459, 8, 'loadingFile' + " this.loadingFile", this.loadingFile)
        readingFile = this.loadingFile
        text = await nfs.readText(this.loadingFile)
        if (this.loadingFile !== readingFile)
        {
            return
        }
        this.currentFile = this.loadingFile
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 471, 8, 'currentFile' + " this.currentFile", this.currentFile)
        delete this.loadingFile
        this.title.setFile(slash.tilde(this.currentFile))
        if (text === undefined)
        {
            text = '○ binary ○'
        }
        fileColorData = filecolors.split(this.currentFile,text)
        text = fileColorData.text
        fileColors = fileColorData.colors
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
        this.editor.state.loadColors(fileColors)
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
        if (((_508_22_=config.data) != null ? (_508_29_=_508_22_.novim) != null ? _508_29_.autoStart : undefined : undefined))
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

    KED.prototype["saveFile"] = async function (file)
    {
        var path, result, text

        text = kseg.str(this.editor.state.s.lines)
        path = (file != null ? file : this.currentFile)
        if (_k_.empty(path))
        {
            post.emit('novim.error','no file name')
            return false
        }
        text = filecolors.join(path,text,this.editor.state.s.colors)
        result = await nfs.write(path,text)
        if ((result != null ? result.error : undefined))
        {
            post.emit('novim.error',`can't open file for writing: ${path}`)
            return false
        }
        if (path === this.currentFile)
        {
            this.editor.state.clearHistory()
            this.redraw()
            this.saveSessionFile(this.currentFile,'saved')
        }
        return true
    }

    KED.prototype["saveAndQuit"] = async function (file)
    {
        var saved

        saved = await this.saveFile(file)
        if (!saved)
        {
            return
        }
        return this.quit()
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
        text = filecolors.join(path,text,this.editor.state.s.colors)
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

            case 'alt+c':
                return post.emit('colorpicker.show')

            case 'alt+u':
                return post.emit('uniko.show')

            case 'alt+shift+c':
            case 'shift+alt+c':
                return this.editor.state.clearColorsAtCursorOrSelection()

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
        var mcw, _762_22_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VkLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tlZC9rZWQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFPLFVBQUE7SUFBYTtJQUFLO0lBQUs7SUFBSztJQUFNO0lBQUs7SUFBSTs7T0FDOUIsYUFBZDtPQUFxQixjQUFyQjs7T0FDYyxjQUFkO09BQXNCLGNBQXRCO09BQThCLFdBQTlCO09BQW1DLGNBQW5DO09BQTJDLGNBQTNDO09BQW1ELFVBQW5EO09BQXVELGFBQXZEO09BQThELGdCQUE5RDtPQUF3RSxpQkFBeEU7T0FBbUYsV0FBbkY7O09BQ2MsY0FBQTtPQUFRLGNBQUE7T0FBUSxjQUFBOztPQUNoQixXQUFUOztPQUNTLFdBQWQ7O09BQ2MsY0FBUjs7T0FDUSxXQUFUO09BQWMsWUFBZDs7T0FDUyxZQUFUOztPQUNTLGlCQUFUOztPQUNTLGFBQVI7T0FBZSxXQUFmOztPQUNRLGNBQVI7T0FBZ0IsV0FBaEI7T0FBcUIsWUFBckI7T0FBMkIsYUFBM0I7T0FBa0MsZUFBbEM7T0FBMkMsYUFBM0M7T0FBa0QsYUFBbEQ7O09BQ1EsYUFBVDtPQUFnQixhQUFoQjtPQUF1QixhQUF2QjtPQUE4QixhQUE5QjtPQUFxQyxZQUFyQztPQUEyQyxhQUEzQzs7T0FDUCxvQkFBQTtJQUFnQjtJQUFNOzs7QUFFakIsT0FBVDs7YUFFSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRUksS0FBQyxVQUFVO1FBQ1gsS0FBQyxPQUFPLEtBQUs7Ozs7Ozs7OztPQVdMLFFBQVEsS0FBSyxTQUFTLFFBQVEsS0FBQztRQUV2QyxRQUFRLEdBQUcsb0JBQW9CLEtBQUM7UUFDaEMsS0FBQyxjQUFjLFFBQVEsS0FBQztRQUN4QixLQUFDLGNBQWMsUUFBUSxLQUFDLFFBQVEsTUFBTSxLQUFDLEtBQUssWUFBWSxLQUFDLEtBQUs7UUFDOUQsS0FBSyxNQUFNLEtBQUM7UUFFWixZQUFJLHlDQUFxQyxPQUFHLEtBQUMsUUFBUTtRQUVyRCxPQUFPO1FBRVAsT0FBTyxjQUFjLEtB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/ked.kode
