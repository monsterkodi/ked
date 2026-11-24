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
        if (this.funcol.active)
        {
            return this.funcol.show()
        }
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
        var below, frame, i, info, rows, section, selected, text, _229_15_, _237_80_, _247_31_, _258_73_

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
        info = {label:label,state:this.editor.state,cells:this.editor.cells,file:this.currentFile,images:this.vterm.placements(),names:this.t.imgNames,cellh:(this.t.cellsz != null ? this.t.cellsz[1] : undefined),focus:this.focusName,selected:selected,logs:this.logfile.take()}
        section = dumpstate.section(info,rows)
        if (this.t.live)
        {
            below = ''
            for (i = 0; i < dumpstate.ROWS; i++)
            {
                below += `\x1b[${this.t.rows() + 1 + i};1H\x1b[2K` + (((_258_73_=section[i]) != null ? _258_73_ : ''))
            }
            process.stdout.write(frame + '\x1b[0m' + below)
            return
        }
        text = (this.args.headless_colors ? this.vterm.colored() : this.vterm.text())
        return process.stdout.write('\n' + text.join('\n') + '\n' + section.join('\n') + '\n')
    }

    KED.prototype["startup"] = async function ()
    {
        var file, _271_39_, _271_44_

        if (config.loaded)
        {
            await config.loaded
        }
        await this.session.loaded
        if (((_271_39_=config.data) != null ? (_271_44_=_271_39_.log) != null ? _271_44_.memory : undefined : undefined))
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
        var dcw, fcw, h, th, w

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
        var _312_15_, _324_10_

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
        var _344_22_

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
        var _356_53_

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
        var _393_20_

        if ((data != null ? (_393_20_=data.zen) != null ? _393_20_.enable : undefined : undefined))
        {
            return this.title.hide()
        }
        else
        {
            return this.title.show()
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
        var absFile, colors, exists, ext, gitDir, mapsc, readingFile, rectree, reload, reloadCursor, reloadView, segls, start, sueData, text, _558_22_, _558_29_

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
        _k_.assert("kode/ked/ked.kode", 496, 8, 'loadingFile' + " this.loadingFile", this.loadingFile)
        readingFile = this.loadingFile
        text = await nfs.readText(this.loadingFile)
        if (this.loadingFile !== readingFile)
        {
            return
        }
        this.currentFile = this.loadingFile
        _k_.assert("kode/ked/ked.kode", 508, 8, 'currentFile' + " this.currentFile", this.currentFile)
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
        if (((_558_22_=config.data) != null ? (_558_29_=_558_22_.novim) != null ? _558_29_.autoStart : undefined : undefined))
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
        _k_.assert("kode/ked/ked.kode", 585, 8, 'currentFile' + " this.currentFile", this.currentFile)
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
        var areas, _645_73_, _647_36_

        if ((this.editor.state.rectree != null) && slash.ext(path) === 'sheet')
        {
            return layout.sourceOf(this.editor.state.rectree)
        }
        areas = ((_647_36_=this.editor.state.s.sue) != null ? _647_36_ : [])
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
        var mcw, _851_22_

        mcw = parseInt(cols / 6)
        rounded.cache = {}
        if (mcw >= 16)
        {
            this.dircol.cells.cols = mcw
            this.funcol.cells.cols = mcw
            this.dircol.show()
            if (this.funcol.active)
            {
                this.funcol.show()
            }
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
        var editorDrawn, editorRect, erases, start, _934_47_

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
