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
        this["clearDecoration"] = this["clearDecoration"].bind(this)
        this["unscaleLine"] = this["unscaleLine"].bind(this)
        this["scaleLine"] = this["scaleLine"].bind(this)
        this["toggleStyle"] = this["toggleStyle"].bind(this)
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
        var file, _218_39_, _218_44_

        if (config.loaded)
        {
            await config.loaded
        }
        await this.session.loaded
        if (((_218_39_=config.data) != null ? (_218_44_=_218_39_.log) != null ? _218_44_.memory : undefined : undefined))
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
        var dcw, fcw, h, th, w, zen, _238_25_, _238_30_

        w = this.t.cols()
        h = this.t.rows()
        dcw = this.dircol.cells.cols
        fcw = this.funcol.cells.cols
        zen = ((_238_25_=config.data) != null ? (_238_30_=_238_25_.zen) != null ? _238_30_.enable : undefined : undefined)
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
        var _259_15_, _271_10_

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
        var _291_22_

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
        var _303_53_

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
        var _340_20_

        if ((data != null ? (_340_20_=data.zen) != null ? _340_20_.enable : undefined : undefined))
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
        var absFile, colors, exists, ext, gitDir, mapsc, readingFile, rectree, reload, reloadCursor, reloadView, segls, start, sueData, text, _508_22_, _508_29_

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
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 445, 8, 'loadingFile' + " this.loadingFile", this.loadingFile)
        readingFile = this.loadingFile
        text = await nfs.readText(this.loadingFile)
        if (this.loadingFile !== readingFile)
        {
            return
        }
        this.currentFile = this.loadingFile
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 457, 8, 'currentFile' + " this.currentFile", this.currentFile)
        delete this.loadingFile
        this.title.setFile(slash.tilde(this.currentFile))
        if (text === undefined)
        {
            text = '◯ binary ◯'
        }
        delete this.editor.sheet
        if (slash.ext(this.currentFile) === 'sheet')
        {
            rectree = noon.parse(text)
            if (!_k_.empty(rectree))
            {
                this.editor.sheet = {rectree:rectree,source:text}
                text = layout.sueify({cols:this.editor.cells.cols,rows:this.editor.cells.rows},rectree)
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
        if (((_508_22_=config.data) != null ? (_508_29_=_508_22_.novim) != null ? _508_29_.autoStart : undefined : undefined))
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
        _k_.assert("/home/kodi/s/ked/kode/ked/ked.kode", 533, 8, 'currentFile' + " this.currentFile", this.currentFile)
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

    KED.prototype["toggleStyle"] = function (flag)
    {
        this.editor.state.toggleSueFlag(flag)
        return this.redraw()
    }

    KED.prototype["scaleLine"] = function (delta)
    {
        this.editor.state.stepScales(delta)
        return this.redraw()
    }

    KED.prototype["unscaleLine"] = function ()
    {
        this.editor.state.clearScales()
        return this.redraw()
    }

    KED.prototype["clearDecoration"] = function ()
    {
        return this.editor.state.clearSueAtCursorOrSelection()
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
        var areas, _615_47_, _617_36_

        if ((this.editor.sheet != null) && path === this.currentFile)
        {
            return this.editor.sheet.source
        }
        areas = ((_617_36_=this.editor.state.s.sue) != null ? _617_36_ : [])
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

            case 'alt+c':
                return post.emit('colorpicker.show')

            case 'alt+u':
                return post.emit('uniko.show')

        }

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
            case 'shift+alt+c':
                return this.clearDecoration()

            case 'shift+alt+u':
                return this.toggleStyle('u')

            case 'shift+alt+s':
                return this.toggleStyle('s')

            case 'shift+alt+b':
                return this.toggleStyle('b')

            case 'shift+alt+i':
                return this.toggleStyle('i')

            case 'shift+alt+=':
                return this.scaleLine(1)

            case 'shift+alt+-':
                return this.scaleLine(-1)

            case 'shift+alt+0':
                return this.unscaleLine()

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
        var mcw, _832_22_

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
        var cols, data, rows, _867_30_

        if (!(this.editor.sheet != null))
        {
            return
        }
        cols = this.editor.cells.cols
        rows = this.editor.cells.rows
        if (cols < 1 || rows < 1)
        {
            return
        }
        if (this.editor.sheet.cols === cols && this.editor.sheet.rows === rows)
        {
            return
        }
        this.editor.sheet.cols = cols
        this.editor.sheet.rows = rows
        data = sue.desue(layout.sueify({cols:cols,rows:rows},this.editor.sheet.rectree))
        this.editor.state.loadLines(data.text.split('\n'))
        return this.editor.state.loadSue(data.sue)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VkLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tlZC9rZWQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNPLFVBQUE7SUFBYTtJQUFLO0lBQUs7SUFBSztJQUFNO0lBQUs7SUFBSTtJQUFNO0lBQVE7O09BQzVDLGFBQWQ7T0FBcUIsY0FBckI7O09BQ2MsY0FBZDtPQUFzQixjQUF0QjtPQUE4QixXQUE5QjtPQUFtQyxjQUFuQztPQUEyQyxVQUEzQztPQUErQyxhQUEvQztPQUFzRCxnQkFBdEQ7T0FBZ0UsV0FBaEU7T0FBcUUsZUFBckU7O09BQ2MsY0FBQTtPQUFRLGNBQUE7T0FBUSxjQUFBOztPQUNoQixXQUFUOztPQUNTLFdBQWQ7T0FBbUIsWUFBbkI7O09BQ2MsVUFBVDs7T0FDUyxjQUFSOztPQUNRLFdBQVQ7T0FBYyxZQUFkOztPQUNTLFlBQVQ7O09BQ1MsaUJBQVQ7O09BQ1MsYUFBUjtPQUFlLFdBQWY7O09BQ1EsY0FBUjtPQUFnQixXQUFoQjtPQUFxQixZQUFyQjtPQUEyQixhQUEzQjtPQUFrQyxlQUFsQztPQUEyQyxlQUEzQztPQUFvRCxhQUFwRDtPQUEyRCxhQUEzRDs7T0FDUSxhQUFUO09BQWdCLGFBQWhCO09BQXVCLGFBQXZCO09BQThCLGFBQTlCO09BQXFDLFlBQXJDO09BQTJDLGFBQTNDOztPQUNTLGFBQWQ7O09BQ0Ysb0JBQUE7SUFBZ0I7SUFBTTs7O0FBRXpCLE9BQUQ7O2FBRUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFSSxLQUFDLFVBQVU7UUFDWCxLQUFDLE9BQU8sS0FBSzs7Ozs7Ozs7O09BV0wsUUFBUSxLQUFLLFNBQVMsUUFBUSxLQUFDO1FBRXZDLFFBQVEsR0FBRyxvQkFBb0IsS0FBQztRQUNoQyxLQUFDLGNBQWMsUUFBUSxLQUFDO1FBQ3hCLEtBQUMsY0FBYyxRQUFRLEtBQUMsUUFBUSxNQUFNLEtBQUMsS0FBSyxZQUFZLEtBQUMsS0FBSztRQUU5RCxZQUFJLHlDQUFxQyxPQUFHLEtB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/ked.kode
