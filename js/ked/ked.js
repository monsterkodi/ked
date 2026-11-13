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
let watcher = kxk.watcher

import prjcts from "./index/prjcts.js"
import indexer from "./index/indexer.js"

import logfile from "./util/logfile.js"
import session from "./util/session.js"
import help from "./util/help.js"
import frecent from "./util/frecent.js"
import git from "./util/git.js"
import config from "./util/config.js"
import dumpstate from "./util/dumpstate.js"
import filecolors from "./util/filecolors.js"
import leak from "./util/leak.js"
import fileutil from "./util/fileutil.js"

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
import replacer from "./view/menu/replacer.js"
import clippo from "./view/menu/clippo.js"
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
        var watchingClipboard

        this["draw"] = this["draw"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onInputPopup"] = this["onInputPopup"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onViewSize"] = this["onViewSize"].bind(this)
        this["goToNextFunc"] = this["goToNextFunc"].bind(this)
        this["goToPrevFunc"] = this["goToPrevFunc"].bind(this)
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
        this["loadMissingFile"] = this["loadMissingFile"].bind(this)
        this["loadFile"] = this["loadFile"].bind(this)
        this["openArguments"] = this["openArguments"].bind(this)
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
        this["settle"] = this["settle"].bind(this)
        this["runHeadless"] = this["runHeadless"].bind(this)
        this["restart"] = this["restart"].bind(this)
        this.version = '1.0'
        this.args = karg(`
ked [file...]
    options                                       **
    new        start with empty buffer          = false
    fresh      don't load previous session      = false
    timeout    session save timeout in ms       = 1000
    version    log version                      = false
    headless   run without a terminal           = false -H
    headless_colors    headless with terminal colors    = false -C --headless-colors
    `,{preHelp:help.header(),version:this.version})
        process.on('uncaughtException',this.quit)
        this.session = new session(this.args)
        this.logfile = new logfile(this.session.name,(this.args.headless || this.args.headless_colors))
        console.log(_k_.w2(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ${_k_.b8(this.session.name)} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
        config.load()
        global.ked_session = this.session
        this.t = new ttio({headless:(this.args.headless || this.args.headless_colors)})
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
        this.replacer = new replacer(this.screen,this.editor)
        watchingClipboard = !(this.args.headless || this.args.headless_colors)
        this.clippo = new clippo(this.screen,this.editor,'clippo',{watch:watchingClipboard})
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
        this.mouseHandlers = [this.input,this.context,this.finder,this.searcher,this.replacer,this.clippo,this.vinder,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.menu,this.macro,this.editor,this.title,this.dircol,this.funcol]
        this.wheelHandlers = [this.finder,this.searcher,this.replacer,this.clippo,this.vinder,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.macro,this.editor,this.dircol,this.funcol]
        this.keyHandlers = [this.input,this.context,this.finder,this.searcher,this.replacer,this.clippo,this.vinder,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.menu,this.macro,this.editor,this.dircol,this.funcol]
        this.t.on('key',this.onKey)
        this.t.on('mouse',this.onMouse)
        this.t.on('resize',this.onResize)
        this.t.on('paste',this.onPaste)
        ked_session.set('ked▸args',this.args)
        if (!_k_.empty(this.args.options))
        {
            this.currentLoad = this.openArguments()
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
        this.starting = this.startup()
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
        if (ked.args.headless || ked.args.headless_colors)
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
        if (this.starting)
        {
            await this.starting
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
            await this.settle()
            this.dump(step[0])
        }
        return this.quit()
    }

    KED.prototype["settle"] = async function ()
    {
        var waited

        if (this.currentLoad)
        {
            await this.currentLoad
        }
        waited = 0
        while (this.loadingFile && waited < 5000)
        {
            await sleep(1)
            waited += 1
        }
        return await sleep(15)
    }

    KED.prototype["dump"] = function (label)
    {
        var line, state

        this.draw()
        state = dumpstate.tags(this.editor.state,this.currentFile)
        line = (!_k_.empty(state) ? `${label} ${state}` : label)
        process.stdout.write(`\n=== ${line}\n`)
        if (this.args.headless_colors)
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
        var file, _219_39_, _219_44_

        if (config.loaded)
        {
            await config.loaded
        }
        await this.session.loaded
        if (((_219_39_=config.data) != null ? (_219_44_=_219_39_.log) != null ? _219_44_.memory : undefined : undefined))
        {
            leak.start(this.args)
        }
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
                return await this.loadFile(file)
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
        var _257_15_, _269_10_

        watcher.close()
        ;(this.clippo != null ? this.clippo.stopWatch() : undefined)
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
        var _289_22_

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
        var kk, _301_53_

        if (event.change === 'rename' && (event.oldPath != null) && slash.samePath(event.oldPath,this.currentFile))
        {
            this.currentFile = event.path
            this.reloadFile()
            return
        }
        if (event.path === this.currentFile)
        {
            switch (event.change)
            {
                case 'delete':
                    this.newFile()
                    break
                case 'modify':
                case 'rename':
                    this.reloadFile()
                    break
            }

        }
        if (KED.building)
        {
            return
        }
        if (this.args.headless || this.args.headless_colors)
        {
            return
        }
        if (event.change === 'modify' && slash.ext(event.path) === 'kode')
        {
            if (event.path.startsWith(slash.path(_k_.dir(),'../../kode/ked')))
            {
                KED.building = true
                console.log("building")
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

    KED.prototype["openArguments"] = async function ()
    {
        var column, file, files, line, loading, paths

        var _a_ = slash.splitFileLine(this.args.options[0]); file = _a_[0]; line = _a_[1]; column = _a_[2]

        loading = null
        if (line)
        {
            loading = this.loadFile(file,line - 1,column - 1)
        }
        else
        {
            loading = this.loadFile(file)
        }
        paths = this.args.options.slice(1).map(function (option)
        {
            return slash.splitFileLine(option)[0]
        })
        files = await fileutil.existingFiles(paths)
        filepos.addFiles(files)
        await loading
        return this.editor.grabFocus()
    }

    KED.prototype["loadFile"] = async function (p, row, col, view)
    {
        var absFile, colors, exists, ext, fileColorData, fileColors, gitDir, mapsc, readingFile, reload, reloadCursor, reloadView, segls, start, text, _479_22_, _479_29_

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
            this.loadMissingFile(absFile)
            return
        }
        this.loadingFile = await nfs.resolveSymlink(this.loadingFile)
        if (_k_.empty(this.loadingFile))
        {
            console.warn(`ked.loadFile - ${absFile} resolved to empty!`)
            return
        }
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 425, 8, 'loadingFile' + " this.loadingFile", this.loadingFile)
        readingFile = this.loadingFile
        text = await nfs.readText(this.loadingFile)
        if (this.loadingFile !== readingFile)
        {
            return
        }
        this.currentFile = this.loadingFile
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 437, 8, 'currentFile' + " this.currentFile", this.currentFile)
        delete this.loadingFile
        this.title.setFile(slash.tilde(this.currentFile))
        if (text === undefined)
        {
            text = '◯ binary ◯'
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
        mapsc = this.editor.mapscr
        ;(mapsc != null ? mapsc.suspend() : undefined)
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
        ;(mapsc != null ? mapsc.resume() : undefined)
        post.emit('file.loaded',this.currentFile)
        if (((_479_22_=config.data) != null ? (_479_29_=_479_22_.novim) != null ? _479_29_.autoStart : undefined : undefined))
        {
            if (!mode.isActive(this.editor.state,'novim'))
            {
                this.editor.state.toggleMode('novim')
            }
        }
        this.showEditor()
        this.redraw()
        this.indexer.index(this.currentFile,{ext:this.editor.state.syntax.ext})
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

    KED.prototype["loadMissingFile"] = function (path)
    {
        var ext

        this.currentFile = path
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 506, 8, 'currentFile' + " this.currentFile", this.currentFile)
        delete this.loadingFile
        this.title.setFile(slash.tilde(this.currentFile))
        ext = config.data.filetypes[slash.file(this.currentFile)]
        ext = (ext != null ? ext : slash.ext(this.currentFile))
        this.editor.state.syntax.setExt(ext)
        this.editor.state.loadLines([''])
        this.editor.setCurrentFile(this.currentFile)
        ked_session.set("editor▸file",this.currentFile)
        filepos.addFiles([this.currentFile])
        post.emit('file.loaded',this.currentFile)
        this.showEditor()
        this.editor.grabFocus()
        this.t.setCursor(0,0)
        this.t.setTitle(slash.file(this.currentFile))
        this.redraw()
        this.saveSessionFile(this.currentFile,'loaded')
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
        this.clippo.remember(text)
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

        var list = _k_.list(this.keyHandlers)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            handler = list[_a_]
            if (handler.hidden())
            {
                continue
            }
            result = handler.onKey(key,event)
            if ((result != null ? result.redraw : undefined) !== false)
            {
                this.redraw()
            }
            if (result)
            {
                return
            }
        }
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

            case 'shift+cmd+r':
            case 'shift+ctrl+r':
                return this.replacer.show()

            case 'shift+cmd+v':
            case 'shift+ctrl+v':
                return this.clippo.show()

            case 'alt+o':
                return this.editor.jumpToCounterpart()

            case 'alt+,':
                return this.goToPrevFunc()

            case 'alt+.':
                return this.goToNextFunc()

            case 'cmd+m':
            case 'cmd+;':
            case 'cmd+space':
                return this.macro.show()

            case 'cmd+.':
            case 'ctrl+.':
                return this.browse.gotoDir(slash.dir(this.currentFile))

            case 'cmd+o':
            case 'ctrl+o':
                return post.emit('browse.dir',process.cwd())

            case 'cmd+i':
                return post.emit('differ.status')

            case "cmd+[":
                return post.emit('dircol.show')

            case "alt+cmd+[":
                return post.emit('dircol.toggle')

            case 'shift+cmd+[':
                return post.emit('dircol.reveal',this.currentFile)

            case "cmd+]":
                return post.emit('funcol.show')

            case "alt+cmd+]":
                return post.emit('funcol.toggle')

            case 'alt+c':
                return post.emit('colorpicker.show')

            case 'alt+u':
                return post.emit('uniko.show')

            case 'alt+shift+c':
            case 'shift+alt+c':
                return this.editor.state.clearColorsAtCursorOrSelection()

        }

    }

    KED.prototype["goToPrevFunc"] = function ()
    {
        if (this.searcher.visible())
        {
            return this.searcher.selectPrevFileHeader()
        }
        if (this.replacer.visible())
        {
            return this.replacer.selectPrevFileHeader()
        }
        return this.editor.singleCursorAtLine(this.funcol.funtree.lineIndexOfPrevFunc())
    }

    KED.prototype["goToNextFunc"] = function ()
    {
        if (this.searcher.visible())
        {
            return this.searcher.selectNextFileHeader()
        }
        if (this.replacer.visible())
        {
            return this.replacer.selectNextFileHeader()
        }
        return this.editor.singleCursorAtLine(this.funcol.funtree.lineIndexOfNextFunc())
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
        var editorDrawn, erases, start

        if (this.quitting)
        {
            return
        }
        start = process.hrtime()
        this.t.syncStart()
        this.title.gutter = this.editor.state.gutterWidth()
        this.screen.init()
        this.arrange()
        editorDrawn = this.menu.greet.hidden() && !this.differ.visible() && !this.editor.hidden()
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
        this.replacer.draw()
        this.clippo.draw()
        this.vinder.draw()
        this.differ.draw()
        this.context.draw()
        this.input.draw()
        erases = this.screen.eraseRects
        this.screen.render()
        this.t.removeImgs()
        if (editorDrawn)
        {
            this.editor.showCursorsOutsideRects(erases)
        }
        this.t.syncEnd()
        return this.title.time = process.hrtime(start)[1]
    }

    return KED
})()

export default KED.run;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    KED.run()
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VkLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tlZC9rZWQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNPLFVBQUE7SUFBYTtJQUFLO0lBQUs7SUFBSztJQUFNO0lBQUs7SUFBSTtJQUFNOztPQUNwQyxhQUFkO09BQXFCLGNBQXJCOztPQUNjLGNBQWQ7T0FBc0IsY0FBdEI7T0FBOEIsV0FBOUI7T0FBbUMsY0FBbkM7T0FBMkMsVUFBM0M7T0FBK0MsYUFBL0M7T0FBc0QsZ0JBQXREO09BQWdFLGlCQUFoRTtPQUEyRSxXQUEzRTtPQUFnRixlQUFoRjs7T0FDYyxjQUFBO09BQVEsY0FBQTtPQUFRLGNBQUE7O09BQ2hCLFdBQVQ7O09BQ1MsV0FBZDs7T0FDYyxjQUFSOztPQUNRLFdBQVQ7T0FBYyxZQUFkOztPQUNTLFlBQVQ7O09BQ1MsaUJBQVQ7O09BQ1MsYUFBUjtPQUFlLFdBQWY7O09BQ1EsY0FBUjtPQUFnQixXQUFoQjtPQUFxQixZQUFyQjtPQUEyQixhQUEzQjtPQUFrQyxlQUFsQztPQUEyQyxlQUEzQztPQUFvRCxhQUFwRDtPQUEyRCxhQUEzRDtPQUFrRSxhQUFsRTs7T0FDUSxhQUFUO09BQWdCLGFBQWhCO09BQXVCLGFBQXZCO09BQThCLGFBQTlCO09BQXFDLFlBQXJDO09BQTJDLGFBQTNDOztPQUNQLG9CQUFBO0lBQWdCO0lBQU07OztBQUV6QixPQUFEOzthQUVJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVJLEtBQUMsVUFBVTtRQUNYLEtBQUMsT0FBTyxLQUFLOzs7Ozs7Ozs7T0FXTCxRQUFRLEtBQUssU0FBUyxRQUFRLEtBQUM7UUFFdkMsUUFBUSxHQUFHLG9CQUFvQixLQUFDO1FBQ2hDLEtBQUMsY0FBYyxRQUFRLEtBQUM7UUFDeEIsS0FBQyxjQUFjLFFBQVEsS0FBQyxRQUFRLE1BQU0sS0FBQyxLQUFLLFlBQVksS0FBQyxLQUFLO1FBRTlELFlBQUkseUNBQXFDLE9BQUcsS0FBQyxRQUFRO1FBRXJELE9BQU87UUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/ked.kode
