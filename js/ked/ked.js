var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, isFunc: function (o) {return typeof o === 'function'}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}};_k_.b8=_k_.k.F256(_k_.k.b(8));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2))

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
let noon = kxk.noon

import prjcts from "./index/prjcts.js"
import indexer from "./index/indexer.js"

import logfile from "./util/logfile.js"
import session from "./util/session.js"
import help from "./util/help.js"
import frecent from "./util/frecent.js"
import git from "./util/git.js"
import config from "./util/config.js"
import dumpstate from "./util/dumpstate.js"
import leak from "./util/leak.js"
import fileutil from "./util/fileutil.js"

import rounded from "./util/img/rounded.js"
import squares from "./util/img/squares.js"
import sircels from "./util/img/sircels.js"

import belt from "./edit/tool/belt.js"

import mode from "./edit/mode.js"
import susan from "./edit/susan.js"

import sue from "./edit/tool/sue.js"

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

import browse from "./view/colmns/browse.js"
import dircol from "./view/colmns/dircol.js"
import funcol from "./view/colmns/funcol.js"
import quicky from "./view/colmns/quicky.js"
import droop from "./view/colmns/droop.js"
import saveas from "./view/colmns/saveas.js"

import layout from "./popo/layout.js"

import child_process from "child_process"
let spawn = child_process.spawn
let exec = child_process.exec


KED = (function ()
{
    function KED ()
    {
        var watchingClipboard

        this["draw"] = this["draw"].bind(this)
        this["sheetCheck"] = this["sheetCheck"].bind(this)
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
        this["textForSave"] = this["textForSave"].bind(this)
        this["saveFile"] = this["saveFile"].bind(this)
        this["loadMissingFile"] = this["loadMissingFile"].bind(this)
        this["loadFile"] = this["loadFile"].bind(this)
        this["openArguments"] = this["openArguments"].bind(this)
        this["onQuicky"] = this["onQuicky"].bind(this)
        this["openFile"] = this["openFile"].bind(this)
        this["editFile"] = this["editFile"].bind(this)
        this["reloadFile"] = this["reloadFile"].bind(this)
        this["onConfigLoaded"] = this["onConfigLoaded"].bind(this)
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
        watchingClipboard = !(this.args.headless || this.args.headless_colors)
        this.menu = new menu(this.screen)
        this.quicky = new quicky(this.screen)
        this.browse = new browse(this.screen)
        this.saveas = new saveas(this.screen)
        this.editor = new fileeditor(this.screen,'editor')
        this.macro = new macro(this.screen,this.editor)
        this.droop = new droop(this.screen,this.editor)
        this.dircol = new dircol(this.screen,this.editor,['scroll','knob'])
        this.funcol = new funcol(this.screen,this.editor,['scroll','knob'])
        this.finder = new finder(this.screen,this.editor)
        this.searcher = new searcher(this.screen,this.editor)
        this.replacer = new replacer(this.screen,this.editor)
        this.clippo = new clippo(this.screen,this.editor,'clippo',{watch:watchingClipboard})
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
        post.on('file.edit',this.editFile)
        post.on('file.saveas',this.onSaveAs)
        post.on('quit',this.quit)
        post.on('file.change',this.onFileChange)
        post.on('git.status',this.onGitStatus)
        post.on('config.loaded',this.onConfigLoaded)
        this.contextHandlers = [this.dircol,this.funcol,this.editor]
        this.mouseHandlers = [this.input,this.context,this.finder,this.searcher,this.replacer,this.clippo,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.menu,this.macro,this.dircol,this.funcol,this.editor,this.title]
        this.wheelHandlers = [this.finder,this.searcher,this.replacer,this.clippo,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.macro,this.dircol,this.funcol,this.editor]
        this.keyHandlers = [this.input,this.context,this.finder,this.searcher,this.replacer,this.clippo,this.differ,this.quicky,this.browse,this.saveas,this.droop,this.menu,this.macro,this.dircol,this.funcol,this.editor,this.title]
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
        var _127_40_, _127_45_

        this.editor.show()
        if (!((_127_40_=config.data) != null ? (_127_45_=_127_40_.zen) != null ? _127_45_.enable : undefined : undefined))
        {
            this.title.show()
        }
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
        this.editor.cells.draw_cell_rect_corners()
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
        var file, _220_39_, _220_44_

        if (config.loaded)
        {
            await config.loaded
        }
        await this.session.loaded
        if (((_220_39_=config.data) != null ? (_220_44_=_220_39_.log) != null ? _220_44_.memory : undefined : undefined))
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
        var dcw, fcw, h, th, w, zen, _240_25_, _240_30_

        w = this.t.cols()
        h = this.t.rows()
        dcw = this.dircol.cells.cols
        fcw = this.funcol.cells.cols
        zen = ((_240_25_=config.data) != null ? (_240_30_=_240_25_.zen) != null ? _240_30_.enable : undefined : undefined)
        if (!zen)
        {
            if (this.dircol.hidden() || !this.dircol.active)
            {
                dcw = 0
            }
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
        th = (this.title.visible() ? 1 : 0)
        if (this.dircol.visible() && this.dircol.active)
        {
            this.dircol.layout(0,0,dcw,h)
        }
        if (this.funcol.visible() && this.funcol.active)
        {
            this.funcol.layout(w - fcw,th,fcw,h - th)
        }
        if (this.title.visible())
        {
            this.title.layout(dcw,0,w - dcw,1)
        }
        return this.editor.layout(dcw,th,w - dcw - fcw,h - th)
    }

    KED.prototype["quit"] = async function (msg)
    {
        var _261_15_, _273_10_

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
        var _293_22_

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
        var _305_53_

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
    }

    KED.prototype["onGitStatus"] = function ()
    {
        return git.diff(this.currentFile)
    }

    KED.prototype["onConfigLoaded"] = function (data)
    {
        var _342_20_

        if ((data != null ? (_342_20_=data.zen) != null ? _342_20_.enable : undefined : undefined))
        {
            this.title.hide()
            return this.dircol.hide()
        }
        else
        {
            this.title.show()
            return this.dircol.show()
        }
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

    KED.prototype["editFile"] = async function (file, force)
    {
        if (_k_.empty(file))
        {
            if (!!_k_.empty(this.currentFile))
            {
                post.emit('novim.error','no file name')
                return false
            }
            await this.reloadFile()
            return true
        }
        await this.loadFile(file)
        return true
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
        var absFile, colors, cols, exists, ext, gitDir, mapsc, readingFile, rectree, reload, reloadCursor, reloadView, rows, segls, start, sueData, text, _511_22_, _511_29_

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
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 447, 8, 'loadingFile' + " this.loadingFile", this.loadingFile)
        readingFile = this.loadingFile
        text = await nfs.readText(this.loadingFile)
        if (this.loadingFile !== readingFile)
        {
            return
        }
        this.currentFile = this.loadingFile
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 459, 8, 'currentFile' + " this.currentFile", this.currentFile)
        delete this.loadingFile
        this.title.setFile(slash.tilde(this.currentFile))
        if (text === undefined)
        {
            text = '◯ binary ◯'
        }
        this.editor.state.clearSheet()
        if (slash.ext(this.currentFile) === 'sheet')
        {
            rectree = noon.parse(text)
            if (!_k_.empty(rectree))
            {
                cols = this.editor.cells.cols
                rows = this.editor.cells.rows
                this.editor.state.setSheetTree(rectree,cols,rows)
                text = layout.sueify({cols:cols,rows:rows},rectree)
            }
        }
        sueData = sue.desue(text)
        text = sueData.text
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
        this.editor.state.loadSue(sueData.sue)
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
        if (((_511_22_=config.data) != null ? (_511_29_=_511_22_.novim) != null ? _511_29_.autoStart : undefined : undefined))
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

        this.editor.state.clearSheet()
        this.currentFile = path
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 538, 8, 'currentFile' + " this.currentFile", this.currentFile)
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
        text = this.textForSave(path,text)
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

    KED.prototype["textForSave"] = function (path, text)
    {
        var areas, _598_73_, _600_36_

        if ((this.editor.state.rectree != null) && slash.ext(path) === 'sheet')
        {
            return layout.sourceOf(this.editor.state.rectree)
        }
        areas = ((_600_36_=this.editor.state.s.sue) != null ? _600_36_ : [])
        areas = areas.concat(sue.areasForColors(this.editor.state.s.colors))
        return sue.ensue(text,areas)
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
        text = this.textForSave(path,text)
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

        switch (key)
        {
            case "cmd+[":
                return post.emit('dircol.show')

            case "cmd+]":
                return post.emit('funcol.show')

            case "alt+cmd+[":
                return post.emit('dircol.toggle')

            case "alt+cmd+]":
                return post.emit('funcol.toggle')

            case 'shift+cmd+[':
                return post.emit('dircol.reveal',this.currentFile)

            case 'alt+q':
            case 'ctrl+q':
            case 'cmd+q':
                return this.quit()

            case 'ctrl+s':
            case 'cmd+s':
                if (!this.funcol.colorpicker.hasFocus())
                {
                    return this.saveFile()
                }
                break
            case 'shift+cmd+s':
            case 'shift+ctrl+s':
                return this.saveAs()

            case 'alt+1':
                return post.emit('filepos.goBackward')

            case 'alt+2':
                return post.emit('filepos.goForward')

            case 'cmd+1':
            case 'ctrl+1':
                return post.emit('filepos.swapPrevious')

            case 'alt+h':
                return this.showFileposHistory()

            case 'ctrl+r':
            case 'cmd+r':
                return this.reloadFile()

            case 'cmd+n':
            case 'ctrl+n':
                return this.newFile()

            case 'alt+m':
                return this.menu.show()

            case 'cmd+p':
            case 'ctrl+p':
                return this.quicky.showProjectFiles(this.currentFile)

            case 'alt+cmd+p':
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

            case 'alt+c':
                return post.emit('colorpicker.show')

            case 'alt+u':
                return post.emit('uniko.show')

        }

        var list = _k_.list(this.keyHandlers)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            handler = list[_a_]
            if (handler.hidden() || handler.collapsed())
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
            case 'alt+,':
                return this.goToPrevFunc()

            case 'alt+.':
                return this.goToNextFunc()

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
        return post.emit('goto.line',this.funcol.funtree.lineIndexOfPrevFunc(),'ind','topDelta')
    }

    KED.prototype["goToNextFunc"] = function ()
    {
        var nextFuncLine

        if (this.searcher.visible())
        {
            return this.searcher.selectNextFileHeader()
        }
        if (this.replacer.visible())
        {
            return this.replacer.selectNextFileHeader()
        }
        if (nextFuncLine = this.funcol.funtree.lineIndexOfNextFunc())
        {
            return post.emit('goto.line',nextFuncLine,'ind','topDelta')
        }
    }

    KED.prototype["onViewSize"] = function (name, side, delta)
    {
        this.viewSizeDelta = {name:name,side:side,delta:delta}
        return this.redraw()
    }

    KED.prototype["onResize"] = function (cols, rows, size, cellsz)
    {
        var mcw, _806_22_

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

    KED.prototype["sheetCheck"] = function ()
    {
        var cols, mc, rows, _841_38_

        if (!(this.editor.state.rectree != null))
        {
            return
        }
        cols = this.editor.cells.cols
        rows = this.editor.cells.rows
        if (cols < 1 || rows < 1)
        {
            return
        }
        if (this.editor.state.rectreeCols === cols && this.editor.state.rectreeRows === rows)
        {
            return
        }
        mc = this.editor.state.mainCursor()
        return this.editor.state.renderSheet(this.editor.state.rectree,{cols:cols,rows:rows},mc,{history:false,silent:true})
    }

    KED.prototype["draw"] = function ()
    {
        var editorDrawn, editorRect, erases, start

        if (this.quitting)
        {
            return
        }
        start = process.hrtime()
        editorRect = this.editor.cells.rect()
        this.t.syncStart()
        this.title.gutter = this.editor.state.gutterWidth()
        this.screen.init()
        this.arrange()
        this.sheetCheck()
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
        this.title.time = process.hrtime(start)[1]
        if (!(_k_.eql(editorRect, this.editor.cells.rect())))
        {
            return post.emit('editor.resize')
        }
    }

    return KED
})()

export default KED.run;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    KED.run()
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VkLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tlZC9rZWQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNPLFVBQUE7SUFBYTtJQUFLO0lBQUs7SUFBSztJQUFNO0lBQUs7SUFBSTtJQUFNO0lBQVE7O09BQzVDLGFBQWQ7T0FBcUIsY0FBckI7O09BQ2MsY0FBZDtPQUFzQixjQUF0QjtPQUE4QixXQUE5QjtPQUFtQyxjQUFuQztPQUEyQyxVQUEzQztPQUErQyxhQUEvQztPQUFzRCxnQkFBdEQ7T0FBZ0UsV0FBaEU7T0FBcUUsZUFBckU7O09BQ2MsY0FBQTtPQUFRLGNBQUE7T0FBUSxjQUFBOztPQUNoQixXQUFUOztPQUNTLFdBQWQ7T0FBbUIsWUFBbkI7O09BQ2MsVUFBVDs7T0FDUyxjQUFSOztPQUNRLFdBQVQ7T0FBYyxZQUFkOztPQUNTLFlBQVQ7O09BQ1MsaUJBQVQ7O09BQ1MsYUFBUjtPQUFlLFdBQWY7O09BQ1EsY0FBUjtPQUFnQixXQUFoQjtPQUFxQixZQUFyQjtPQUEyQixhQUEzQjtPQUFrQyxlQUFsQztPQUEyQyxlQUEzQztPQUFvRCxhQUFwRDtPQUEyRCxhQUEzRDs7T0FDUSxhQUFUO09BQWdCLGFBQWhCO09BQXVCLGFBQXZCO09BQThCLGFBQTlCO09BQXFDLFlBQXJDO09BQTJDLGFBQTNDOztPQUNTLGFBQWQ7O09BQ0Ysb0JBQUE7SUFBZ0I7SUFBTTs7O0FBRXpCLE9BQUQ7O2FBRUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUVJLEtBQUMsVUFBVTtRQUNYLEtBQUMsT0FBTyxLQUFLOzs7Ozs7Ozs7T0FXTCxRQUFRLEtBQUssU0FBUyxRQUFRLEtBQUM7UUFFdkMsUUFBUSxHQUFHLG9CQUFvQixLQUFDO1FBQ2hDLEtBQUMsY0FBYyxRQUFRLEtBQUM7UUFDeEIsS0FBQyxjQUFjLFFBQVEsS0FBQyxRQUFRLE1BQU0sS0FBQyxLQUFLLFlBQVksS0FBQyxLQUFLO1FBRTlELFlBQUkseUNBQXFDLE9BQUcsS0FBQyxR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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/ked.kode
