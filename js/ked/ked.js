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
        var absFile, colors, exists, ext, fileColorData, fileColors, gitDir, readingFile, reload, reloadCursor, reloadView, segls, start, text, _507_22_, _507_29_

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
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 458, 8, 'loadingFile' + " this.loadingFile", this.loadingFile)
        readingFile = this.loadingFile
        text = await nfs.readText(this.loadingFile)
        if (this.loadingFile !== readingFile)
        {
            return
        }
        this.currentFile = this.loadingFile
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 470, 8, 'currentFile' + " this.currentFile", this.currentFile)
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
        if (((_507_22_=config.data) != null ? (_507_29_=_507_22_.novim) != null ? _507_29_.autoStart : undefined : undefined))
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
        var mcw, _760_22_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VkLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tlZC9rZWQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFPLFVBQUE7SUFBYTtJQUFLO0lBQUs7SUFBSztJQUFNO0lBQUs7SUFBSTs7T0FDOUIsYUFBZDtPQUFxQixjQUFyQjs7T0FDYyxjQUFkO09BQXNCLGNBQXRCO09BQThCLFdBQTlCO09BQW1DLGNBQW5DO09BQTJDLGNBQTNDO09BQW1ELFVBQW5EO09BQXVELGFBQXZEO09BQThELGdCQUE5RDtPQUF3RSxpQkFBeEU7O09BQ2MsY0FBQTtPQUFRLGNBQUE7T0FBUSxjQUFBOztPQUNoQixXQUFUOztPQUNTLFdBQWQ7O09BQ2MsY0FBUjs7T0FDUSxXQUFUO09BQWMsWUFBZDs7T0FDUyxZQUFUOztPQUNTLGlCQUFUOztPQUNTLGFBQVI7T0FBZSxXQUFmOztPQUNRLGNBQVI7T0FBZ0IsV0FBaEI7T0FBcUIsWUFBckI7T0FBMkIsYUFBM0I7T0FBa0MsZUFBbEM7T0FBMkMsYUFBM0M7T0FBa0QsYUFBbEQ7O09BQ1EsYUFBVDtPQUFnQixhQUFoQjtPQUF1QixhQUF2QjtPQUE4QixhQUE5QjtPQUFxQyxZQUFyQztPQUEyQyxhQUEzQzs7T0FDUCxvQkFBQTtJQUFnQjtJQUFNOzs7QUFFakIsT0FBVDs7YUFFSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRUksS0FBQyxVQUFVO1FBQ1gsS0FBQyxPQUFPLEtBQUs7Ozs7Ozs7OztPQVdMLFFBQVEsS0FBSyxTQUFTLFFBQVEsS0FBQztRQUV2QyxRQUFRLEdBQUcsb0JBQW9CLEtBQUM7UUFDaEMsS0FBQyxjQUFjLFFBQVEsS0FBQztRQUN4QixLQUFDLGNBQWMsUUFBUSxLQUFDLFFBQVEsTUFBTSxLQUFDLEtBQUssWUFBWSxLQUFDLEtBQUs7UUFFOUQsWUFBSSx5Q0FBcUMsT0FBRyxLQUFDLFFBQVE7UUFFckQsT0FBTztRQUVQLE9BQU8sY0FBYyxLQUFDO1FBRXRCLEtBQUMsUUFBUSxNQUFLLFVBQVUsS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/ked.kode
