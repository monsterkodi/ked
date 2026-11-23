var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, isFunc: function (o) {return typeof o === 'function'}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}};_k_.b8=_k_.k.F256(_k_.k.b(8));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2))

var KED

import kxk from "../kxk.js"
let keyinfo = kxk.keyinfo
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post
let kseg = kxk.kseg
let karg = kxk.karg
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
import vterm from "./view/screen/vterm.js"

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
        var headless, watchingClipboard

        this["draw"] = this["draw"].bind(this)
        this["redraw"] = this["redraw"].bind(this)
        this["onInputAction"] = this["onInputAction"].bind(this)
        this["onInputPopup"] = this["onInputPopup"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onViewSize"] = this["onViewSize"].bind(this)
        this["goToNextFunc"] = this["goToNextFunc"].bind(this)
        this["goToPrevFunc"] = this["goToPrevFunc"].bind(this)
        this["fakeKey"] = this["fakeKey"].bind(this)
        this["onPaste"] = this["onPaste"].bind(this)
        this["onKey"] = this["onKey"].bind(this)
        this["showFileposHistory"] = this["showFileposHistory"].bind(this)
        this["showFinderOrSearcher"] = this["showFinderOrSearcher"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
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
        this["writeFrame"] = this["writeFrame"].bind(this)
        this["liveFrame"] = this["liveFrame"].bind(this)
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
    live       headless with keys typed live    = false -L
`,{preHelp:help.header(),version:this.version})
        if (this.args.live && !this.args.headless)
        {
            this.args.headless_colors = true
        }
        process.on('uncaughtException',this.quit)
        this.session = new session(this.args)
        headless = this.args.headless || this.args.headless_colors
        this.logfile = new logfile(this.session.name,headless,headless)
        if (!headless)
        {
            console.log(_k_.w2(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ${_k_.b8(this.session.name)} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
        }
        config.load()
        global.ked_session = this.session
        this.t = new ttio({headless:(this.args.headless || this.args.headless_colors),textSizing:true,live:this.args.live,reserve:dumpstate.ROWS})
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
        post.on('focus',(function (name)
        {
            return this.focusName = name
        }).bind(this))
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
        var _131_40_, _131_45_

        this.editor.show()
        if (!((_131_40_=config.data) != null ? (_131_45_=_131_40_.zen) != null ? _131_45_.enable : undefined : undefined))
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
        if (this.t.live)
        {
            this.liveLabels = ['start']
            this.t.on('key',(function (combo)
            {
                this.liveLabels.push(combo)
                return this.redraw()
            }).bind(this))
            this.t.on('resize',(function ()
            {
                return this.liveLabels.push('resize')
            }).bind(this))
            this.draw()
            return
        }
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
        this.draw()
        return this.writeFrame(label)
    }

    KED.prototype["liveFrame"] = function ()
    {
        var label

        label = (!_k_.empty((this.liveLabels)) ? this.liveLabels.join(' ') : 'redraw')
        this.liveLabels = []
        return this.writeFrame(label)
    }

    KED.prototype["writeFrame"] = function (label)
    {
        var below, frame, i, info, rows, section, selected, text, _229_15_, _237_80_, _257_73_

        frame = this.t.out.join('')
        this.t.out = []
        this.vterm = ((_229_15_=this.vterm) != null ? _229_15_ : new vterm(this.t.cols(),this.t.rows()))
        this.vterm.resize(this.t.cols(),this.t.rows())
        if (this.t.live)
        {
            this.vterm.feedPlacements(frame)
        }
        else
        {
            this.vterm.feed(frame)
        }
        if ((this.editor.state.rectree != null))
        {
            selected = this.funcol.sheeditor.sheetree.current()
        }
        rows = (this.t.live ? dumpstate.ROWS : null)
        info = {label:label,state:this.editor.state,cells:this.editor.cells,file:this.currentFile,images:this.vterm.placements(),names:this.t.imgNames,focus:this.focusName,selected:selected,logs:this.logfile.take()}
        section = dumpstate.section(info,rows)
        if (this.t.live)
        {
            below = ''
            for (var _a_ = i = 0, _b_ = dumpstate.ROWS; (_a_ <= _b_ ? i < dumpstate.ROWS : i > dumpstate.ROWS); (_a_ <= _b_ ? ++i : --i))
            {
                below += `\x1b[${this.t.rows() + 1 + i};1H\x1b[2K` + (((_257_73_=section[i]) != null ? _257_73_ : ''))
            }
            process.stdout.write(frame + '\x1b[0m' + below)
            return
        }
        text = (this.args.headless_colors ? this.vterm.colored() : this.vterm.text())
        return process.stdout.write('\n' + text.join('\n') + '\n' + section.join('\n') + '\n')
    }

    KED.prototype["startup"] = async function ()
    {
        var file, _270_39_, _270_44_

        if (config.loaded)
        {
            await config.loaded
        }
        await this.session.loaded
        if (((_270_39_=config.data) != null ? (_270_44_=_270_39_.log) != null ? _270_44_.memory : undefined : undefined))
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
        var dcw, fcw, h, th, w, zen, _290_25_, _290_30_

        w = this.t.cols()
        h = this.t.rows()
        dcw = this.dircol.cells.cols
        fcw = this.funcol.cells.cols
        zen = ((_290_25_=config.data) != null ? (_290_30_=_290_25_.zen) != null ? _290_30_.enable : undefined : undefined)
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
        var _311_15_, _323_10_

        watcher.close()
        ;(this.clippo != null ? this.clippo.stopWatch() : undefined)
        clearImmediate(this.redrawId)
        this.quitting = true
        await this.session.save()
        if (!this.logfile.headless)
        {
            console.log(_k_.w2(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ${_k_.b8(this.session.name)} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`))
        }
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
        var _343_22_

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
        var _355_53_

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
        var _392_20_

        if ((data != null ? (_392_20_=data.zen) != null ? _392_20_.enable : undefined : undefined))
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

        ;[file,line,column] = slash.splitFileLine(this.args.options[0])
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
        var absFile, colors, exists, ext, gitDir, mapsc, readingFile, rectree, reload, reloadCursor, reloadView, segls, start, sueData, text, _559_22_, _559_29_

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
        _k_.assert("kode/ked/ked.kode", 497, 8, 'loadingFile' + " this.loadingFile", this.loadingFile)
        readingFile = this.loadingFile
        text = await nfs.readText(this.loadingFile)
        if (this.loadingFile !== readingFile)
        {
            return
        }
        this.currentFile = this.loadingFile
        _k_.assert("kode/ked/ked.kode", 509, 8, 'currentFile' + " this.currentFile", this.currentFile)
        delete this.loadingFile
        this.title.setFile(slash.tilde(this.currentFile))
        if (text === undefined)
        {
            text = '◯ binary ◯'
        }
        this.editor.state.clearSheet()
        if (slash.ext(this.currentFile) === 'sheet')
        {
            rectree = layout.pageOf(noon.parse(text))
            if (!_k_.empty(rectree))
            {
                this.editor.state.setSheetTree(rectree)
                text = layout.sueify(this.editor.state.sheetSize(),rectree)
            }
        }
        sueData = sue.desue(text)
        text = sueData.text
        ;[colors,segls] = belt.colorSeglsForText(text)
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
        if (((_559_22_=config.data) != null ? (_559_29_=_559_22_.novim) != null ? _559_29_.autoStart : undefined : undefined))
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
        _k_.assert("kode/ked/ked.kode", 586, 8, 'currentFile' + " this.currentFile", this.currentFile)
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
        var areas, _646_73_, _648_36_

        if ((this.editor.state.rectree != null) && slash.ext(path) === 'sheet')
        {
            return layout.sourceOf(this.editor.state.rectree)
        }
        areas = ((_648_36_=this.editor.state.s.sue) != null ? _648_36_ : [])
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

    KED.prototype["onPaste"] = function (text)
    {
        return this.fakeKey('cmd+v')
    }

    KED.prototype["fakeKey"] = function (combo)
    {
        return this.onKey(combo,keyinfo.forCombo(combo))
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
        var mcw, _852_22_

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
        var editorDrawn, editorRect, erases, start, _935_47_

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
        if (this.t.live && (this.liveLabels != null))
        {
            this.liveFrame()
        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2VkLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tlZC9rZWQua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNPLFVBQUE7SUFBYTtJQUFRO0lBQUs7SUFBTTtJQUFLO0lBQUs7SUFBSztJQUFJO0lBQU07SUFBUTs7T0FDcEQsYUFBZDtPQUFxQixjQUFyQjs7T0FDYyxjQUFkO09BQXNCLGNBQXRCO09BQThCLFdBQTlCO09BQW1DLGNBQW5DO09BQTJDLFVBQTNDO09BQStDLGFBQS9DO09BQXNELGdCQUF0RDtPQUFnRSxXQUFoRTtPQUFxRSxlQUFyRTs7T0FDYyxjQUFBO09BQVEsY0FBQTtPQUFRLGNBQUE7O09BQ2hCLFdBQVQ7O09BQ1MsV0FBZDtPQUFtQixZQUFuQjs7T0FDYyxVQUFUOztPQUNTLGNBQVI7O09BQ1EsV0FBVDtPQUFjLFlBQWQ7O09BQ1MsWUFBVDs7T0FDUyxpQkFBVDs7T0FDUyxhQUFSO09BQWUsV0FBZjtPQUFvQixZQUFwQjs7T0FDUSxjQUFSO09BQWdCLFdBQWhCO09BQXFCLFlBQXJCO09BQTJCLGFBQTNCO09BQWtDLGVBQWxDO09BQTJDLGVBQTNDO09BQW9ELGFBQXBEO09BQTJELGFBQTNEOztPQUNRLGFBQVQ7T0FBZ0IsYUFBaEI7T0FBdUIsYUFBdkI7T0FBOEIsYUFBOUI7T0FBcUMsWUFBckM7T0FBMkMsYUFBM0M7O09BQ1MsYUFBZDs7T0FDRixvQkFBQTtJQUFnQjtJQUFNOzs7QUFFekIsT0FBRDs7YUFFSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFSSxLQUFDLFVBQVU7UUFDWCxLQUFDLE9BQU8sS0FBSzs7Ozs7Ozs7OztHQVlMLFFBQVEsS0FBSyxTQUFTLFFBQVEsS0FBQztZQUVQLEtBQUMsS0FBSyxTQUFhLEtBQUMsS0FBSzs7WUFBekQsS0FBQyxLQUFLLGtCQUFrQjs7UUFFeEIsUUFBUSxHQUFHLG9CQUFvQixLQUFDO1FBQ2hDLEtBQUMsY0FBYyxRQUFRLEtBQUM7UUFDeEIsV0FBVyxLQUFD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
//# sourceURL=../../kode/ked/ked.kode
