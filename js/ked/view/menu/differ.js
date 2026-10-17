var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, isArr: function (o) {return Array.isArray(o)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.b7=_k_.k.F256(_k_.k.b(7))

var differ

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let slash = kxk.slash
let nfs = kxk.nfs

import belt from "../../edit/tool/belt.js"

import prjcts from "../../index/prjcts.js"

import git from "../../util/git.js"
import fileutil from "../../util/fileutil.js"

import view from "../base/view.js"

import searcher from "./searcher.js"
import searcherfile from "./searcherfile.js"


differ = (function ()
{
    _k_.extend(differ, searcher)
    function differ (screen, editor)
    {
        this.screen = screen
        this.editor = editor
    
        this["patch"] = this["patch"].bind(this)
        this["history"] = this["history"].bind(this)
        this["commit"] = this["commit"].bind(this)
        this["status"] = this["status"].bind(this)
        this["file"] = this["file"].bind(this)
        this["diff"] = this["diff"].bind(this)
        this["show"] = this["show"].bind(this)
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        differ.__super__.constructor.call(this,this.screen,this.editor,'differ')
        this.symbol = {changed:'●',added:'✔',deleted:'✘',renamed:'➜'}
        this.symbolColors = {'✘':[155,0,0],'✔':[0,200,0],'●':[50,50,50],'➜':[150,150,250]}
        this.choices.gutter.fgcolor = (function (x, y, c)
        {
            if (y === this.choices.currentIndex())
            {
                return [255,255,0]
            }
            else
            {
                return this.symbolColors[c]
            }
        }).bind(this)
        post.on('differ.status',this.status)
        post.on('differ.file',this.file)
        post.on('differ.history',this.history)
    }

    differ.prototype["onFileLoaded"] = function (file)
    {}

    differ.prototype["show"] = function ()
    {
        view.prototype.show.call(this)
        this.input.grabFocus()
        this.choices.clearEmpty()
        this.sfils = []
        return {redraw:true}
    }

    differ.prototype["diff"] = function (diff)
    {
        var add, added, change, ext, file, items, li, modadd, modded, _81_32_, _82_32_

        file = diff.file
        ext = slash.ext(file)
        items = []
        var list = _k_.list(diff.changes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            if (_k_.empty(change.add) && _k_.empty(change.mod))
            {
                continue
            }
            modded = ((_81_32_=change.mod) != null ? _81_32_ : [])
            added = ((_82_32_=change.add) != null ? _82_32_ : [])
            modadd = modded.concat(added)
            if (_k_.empty(modadd.filter(function (m)
                {
                    return !_k_.empty(_k_.trim(m.new))
                })))
            {
                continue
            }
            items.push({line:''})
            var list1 = _k_.list(change.add)
            for (li = 0; li < list1.length; li++)
            {
                add = list1[li]
                if (!_k_.empty(_k_.trim(add.new)))
                {
                    items.push({line:' ' + add.new,path:file,row:change.line + li - 1,col:0})
                }
            }
            var list2 = _k_.list(change.mod)
            for (li = 0; li < list2.length; li++)
            {
                add = list2[li]
                if (!_k_.empty(_k_.trim(add.new)))
                {
                    items.push({line:' ' + add.new,path:file,row:change.line + li - 1,col:0})
                }
            }
        }
        items.push({line:''})
        this.choices.append(items,ext)
        this.input.grabFocus()
        return post.emit('redraw')
    }

    differ.prototype["file"] = async function ()
    {
        var currentFile, diff

        currentFile = ked_session.get('editor▸file')
        diff = await git.diff(currentFile)
        if (!_k_.empty(diff.changes))
        {
            this.show()
            return this.diff(diff)
        }
    }

    differ.prototype["status"] = async function ()
    {
        var currentFile, diff, file, fileHeader, lines, newl, noCounterpart, status, text

        currentFile = ked_session.get('editor▸file')
        status = await git.status(currentFile)
        if (_k_.empty(status))
        {
            return
        }
        if (_k_.empty(status.gitDir))
        {
            return
        }
        if (_k_.empty(status.changed) && _k_.empty(status.deleted) && _k_.empty(status.added))
        {
            console.log("differ.status -- no changes",status)
            return
        }
        this.show()
        this.input.set('▸')
        this.input.state.moveCursors('eol')
        fileHeader = (function (change, file, status)
        {
            var path, sfil, symbol

            symbol = this.symbol[change]
            path = slash.relative(file,status.gitDir)
            sfil = new searcherfile(this.screen,`${this.name}_sfil_${this.sfils.length}`)
            sfil.lineIndex = this.choices.items.length
            sfil.set(path)
            this.sfils.push(sfil)
            return this.choices.append([{line:symbol,type:'file',path:file,row:0,col:0}])
        }).bind(this)
        noCounterpart = function (file)
        {
            var counter, cpt, ext

            cpt = {js:'kode',pug:'html',css:'styl'}
            if (ext = cpt[slash.ext(file)])
            {
                counter = slash.swapExt(file,ext)
                if (status.files[counter])
                {
                    return
                }
                counter = fileutil.swapLastDir(counter,slash.ext(file),ext)
                if (status.files[counter])
                {
                    return
                }
            }
            return true
        }
        var list = _k_.list(status.deleted)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            fileHeader('deleted',file,status)
        }
        var list1 = _k_.list(status.added)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            file = list1[_b_]
            if (noCounterpart(file))
            {
                fileHeader('added',file,status)
                text = await nfs.read(file)
                lines = belt.linesForText(text)
                newl = lines.map(function (l)
                {
                    return {new:l}
                })
                diff = {file:file,changes:[{line:1,add:newl}]}
                this.diff(diff)
            }
        }
        var list2 = _k_.list(status.changed)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            file = list2[_c_]
            if (noCounterpart(file))
            {
                fileHeader('changed',file,status)
                diff = await git.diff(file)
                if (this.hidden())
                {
                    console.log('hidden?')
                }
                if (!_k_.empty(diff))
                {
                    this.diff(diff)
                }
            }
        }
    }

    differ.prototype["commit"] = async function (msg)
    {
        var currentFile, gitDir, out

        currentFile = ked_session.get('editor▸file')
        gitDir = await git.dir(currentFile)
        if (_k_.empty(gitDir))
        {
            return
        }
        this.hide()
        post.emit('focus','editor')
        out = ''
        out += await git.exec("add .",{cwd:gitDir})
        out += await git.exec(`commit -m \"${msg}\"`,{cwd:gitDir})
        console.log(_k_.r4(`differ.commit\n${_k_.b7(out)}`))
        post.emit('git.commit')
        return post.emit('redraw')
    }

    differ.prototype["history"] = async function ()
    {
        var currentFile, f, gitDir, h, history, items, symbol

        history = await git.history()
        if (_k_.empty(history))
        {
            return
        }
        this.show()
        currentFile = ked_session.get('editor▸file')
        gitDir = await git.dir(currentFile)
        items = []
        var list = _k_.list(history)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            h = list[_a_]
            items.push({line:' ● ' + h.msg,commit:h.commit})
            var list1 = _k_.list(h.files)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                f = list1[_b_]
                symbol = ((function ()
                {
                    switch (f.type[0])
                    {
                        case 'D':
                            return this.symbol.deleted

                        case 'A':
                            return this.symbol.added

                        case 'R':
                            return this.symbol.renamed

                        case 'M':
                            return this.symbol.changed

                        default:
                            return '◆'
                    }

                }).bind(this))()
                items.push({line:'      ' + symbol + ' ' + f.path,path:slash.path(gitDir,f.path),commit:h.commit})
            }
        }
        this.choices.append(items)
        return post.emit('redraw')
    }

    differ.prototype["patch"] = async function (rev)
    {
        var c, currentFile, file, gitDir, items, l, p, patch

        patch = await git.patch(rev)
        if (_k_.empty(patch))
        {
            return
        }
        currentFile = ked_session.get('editor▸file')
        gitDir = await git.dir(currentFile)
        items = []
        var list = _k_.list(patch)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            p = list[_a_]
            file = slash.path(gitDir,p.tgtfile.slice(2))
            items.push({line:' ● ' + p.tgtfile.slice(2),path:file})
            if (_k_.isArr(p.changes))
            {
                var list1 = _k_.list(p.changes)
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    c = list1[_b_]
                    var list2 = _k_.list(c.changedlines)
                    for (var _c_ = 0; _c_ < list2.length; _c_++)
                    {
                        l = list2[_c_]
                        items.push({line:l.type + ' ' + l.line,path:file})
                    }
                }
            }
        }
        this.choices.set(items,'line')
        return post.emit('redraw')
    }

    differ.prototype["emitFileOpen"] = function (choice)
    {
        post.emit('file.open',choice.path,choice.row,choice.col)
        return this.hide()
    }

    differ.prototype["apply"] = function (choice)
    {
        if (!_k_.empty(choice))
        {
            if (choice.path)
            {
                return this.emitFileOpen(choice)
            }
            if (choice.commit)
            {
                return this.patch(choice.commit)
            }
        }
        console.log("differ.apply?",choice)
        return differ.__super__.apply.call(this,choice)
    }

    differ.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                if (!_k_.empty(text) && text.startsWith('▸'))
                {
                    this.commit(text.slice(1))
                    return
                }
                break
        }

        return differ.__super__.onInputAction.call(this,action,text)
    }

    return differ
})()

export default differ;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZmVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvZGlmZmVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBaUJ3Qjs7Ozs7Ozs7Ozs7Ozs7K0NBSVYsS0FBQyxPQUFPLEtBQUMsT0FBTztRQUV0QixLQUFDLFVBQ0csUUFBUyxJQUNULE1BQVMsSUFDVCxRQUFTLElBQ1QsUUFBUztRQUViLEtBQUMsZ0JBQ0csS0FBTSxJQUFJLEVBQUUsR0FDWixLQUFNLEVBQUUsSUFBSSxHQUNaLEtBQU0sR0FBRyxHQUFHLElBQ1osS0FBTSxJQUFJLElBQUk7UUFFbEIsS0FBQyxRQUFRLE9BQU87O2dCQUNULE1BQUssS0FBQyxRQUFROzt3QkFDWixJQUFJLElBQUk7Ozs7dUJBRVQsS0FBQyxhQUFhOzs7UUFFdEIsS0FBSyxHQUFHLGdCQUFpQixLQUFDO1FBQzFCLEtBQUssR0FBRyxjQUFpQixLQUFDO1FBQzFCLEtBQUssR0FBRyxpQkFBaUIsS0FBQzs7Ozs7Ozs7UUFZMUIsS0FBSyxVQUFVLEtBQUssS0FBSztRQUV6QixLQUFDLE1BQU07UUFDUCxLQUFDLFFBQVE7UUFDVCxLQUFDO2dCQUNELE9BQU87Ozs7Ozs7UUFVUCxPQUFPLEtBQUs7UUFDWixNQUFPLE1BQU0sSUFBSTtRQUVqQjs0QkFFYyxLQUFLOzs7OzBCQUVOLE9BQU8sa0JBQWMsT0FBTzs7Z0JBQ2pDOztZQUVKLG1CQUFTLE9BQU87WUFDaEIsa0JBQVMsT0FBTztZQUNoQixTQUFTLE9BQU8sT0FBTzswQkFDZCxPQUFPOzsrQ0FBeUIsRUFBRTs7O2dCQUN2Qzs7WUFFSixNQUFNLE1BQUssS0FBSztpQ0FFRixPQUFPOzs7O3dDQUNILElBQUk7O29CQUNkLE1BQU0sTUFDRixLQUFPLE1BQU0sSUFBSSxJQUNqQixLQUFPLEtBQ1AsSUFBTyxPQUFPLE9BQUssS0FBRyxFQUN0QixJQUFPOzs7aUNBRUwsT0FBTzs7Ozt3Q0FDSCxJQUFJOztvQkFD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
//# sourceURL=file://kode/ked/view/menu/differ.kode
