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
import saveas from "./view/colmns/saveas.js"


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
        this.saveas = new saveas(this.screen)
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
        post.on('file.saveas',this.onSaveAs)
        post.on('quit',this.quit)
        post.on('file.change',this.onFileChange)
        post.on('git.status',this.onGitStatus)
        this.contextHandlers = [this.editor,this.dircol,this.funcol]
        this.mouseHandlers = [this.input,this.context,this.finder,this.searcher,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.menu,this.macro,this.editor,this.title,this.dircol,this.funcol]
        this.wheelHandlers = [this.finder,this.searcher,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.macro,this.editor,this.dircol,this.funcol]
        this.keyHandlers = [this.input,this.context,this.finder,this.searcher,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.menu,this.macro,this.editor,this.dircol,this.funcol]
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
        return process.stdout.write(this.screen.textMarked().join('\n') + '\n')
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
        var _268_10_

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
        var _300_22_

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
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 405, 8, 'loadingFile' + " this.loadingFile", this.loadingFile)
        readingFile = this.loadingFile
        text = await nfs.readText(this.loadingFile)
        if (this.loadingFile !== readingFile)
        {
            return
        }
        this.currentFile = this.loadingFile
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 417, 8, 'currentFile' + " this.currentFile", this.currentFile)
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
        var dir, name

        dir = process.cwd()
        name = ''
        if (!_k_.empty(this.currentFile))
        {
            dir = slash.dir(this.currentFile)
            name = slash.file(this.currentFile)
        }
        return this.saveas.open(dir,name)
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
        var mcw, _675_22_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VkLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tlZC9rZWQua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQTBCUSxLQUFDLFVBQVU7UUFDWCxLQUFDLE9BQU8sS0FBSzs7Ozs7Ozs7T0FVTCxRQUFRLEtBQUssU0FBUyxRQUFRLEtBQUM7UUFFdkMsUUFBUSxHQUFHLG9CQUFvQixLQUFDO1FBQ2hDLEtBQUMsY0FBYyxRQUFRLEtBQUM7UUFDeEIsS0FBQyxjQUFjLFFBQVEsS0FBQyxRQUFRO1FBQ2hDLE9BQU8sY0FBYyxLQUFDO1FBRXRCLEtBQUMsUUFBUSxHQUFHLFNBQVMsS0FBQztRQUN0QixLQUFDLFFBQVEsTUFBSyxTQUFTLEtBQUMsS0FBSztRQUU3QixLQUFDLGFBQWUsT0FBTyxLQUFDO1FBRXhCLE9BQU8sYUFBYSxLQUFDO1FBQ3JCLEtBQUMsY0FBZTtRQUNoQixLQUFDLFVBQWU7UUFFaEIsS0FBQyxXQUFlLEtBQVcsS0FBQztRQUM1QixLQUFDLFlBQWUsTUFBVyxLQUFDO1FBQzVCLEtBQUMsYUFBZSxPQUFXLEtBQUM7UUFDNUIsS0FBQyxhQUFlLE9BQVcsS0FBQztRQUM1QixLQUFDLGFBQWUsT0FBVyxLQUFDO1FBQzVCLEtBQUMsYUFBZSxXQUFXLEtBQUMsT0FBTztRQUNuQyxLQUFDLFlBQWUsTUFBVyxLQUFDLE9BQU8sS0FBQztRQUNwQyxLQUFDLGFBQWUsT0FBVyxLQUFDLE9BQU8sS0FBQyxRQUFTLFNBQVM7UUFDdEQsS0FBQyxhQUFlLE9BQVcsS0FBQyxPQUFPLEtBQUMsUUFBUyxTQUFTO1FBQ3RELEtBQUMsYUFBZSxPQUFXLEtBQUMsT0FBTyxLQUFDO1FBQ3BDLEtBQUMsZUFBZSxTQUFXLEtBQUMsT0FBTyxLQUFDO1FBQ3BDLEtBQUMsYUFBZSxPQUFXLEtBQUMsT0FBTyxLQUFDO1FBQ3BDLEtB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/ked.kode
