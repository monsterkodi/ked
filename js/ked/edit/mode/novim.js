var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var novim

import post from "../../../kxk/post.js"
import keyinfo from "../../../kxk/keyinfo.js"
import kseg from "../../../kxk/kseg.js"

import theme from "../../theme/theme.js"

import belt from "../tool/belt.js"
import cmdlinehistory from "../tool/cmdlinehistory.js"

import mode from "../mode.js"


novim = (function ()
{
    novim["operators"] = {'c':'change','d':'delete','y':'yank','>':'indent','<':'deindent','gu':'lowercase','gU':'uppercase','g~':'toggleCaseMotion'}
    novim["commands"] = {'C':function ()
    {
        return {operator:'change',motion:{kind:'eol'}}
    },'D':function ()
    {
        return {operator:'delete',motion:{kind:'eol'}}
    },'s':function (n)
    {
        return {operator:'change',count:n,motion:{kind:'char'}}
    },'S':function (n)
    {
        return {operator:'change',count:n,motion:{kind:'line'}}
    },'x':function (n)
    {
        return {operator:'delete',count:n,motion:{kind:'char'}}
    },'X':function (n)
    {
        return {operator:'delete',count:n,motion:{kind:'charBack'}}
    },'h':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'left'}}
    },'j':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'down'}}
    },'k':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'up'}}
    },'l':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'right'}}
    },'(':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'sentenceBack'}}
    },')':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'sentence'}}
    },'{':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'paragraphBack'}}
    },'}':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'paragraph'}}
    },'+':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'lineFirstDown'}}
    },'-':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'lineFirstUp'}}
    },'_':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'lineFirst'}}
    },'w':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'word'}}
    },'b':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'drow'}}
    },'e':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'wend'}}
    },'W':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'WORD'}}
    },'B':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'DROW'}}
    },'E':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'WEND'}}
    },'$':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'eol'}}
    },'G':function (n)
    {
        return {operator:'move',count:n,motion:{kind:'eof'}}
    },'n':function (n)
    {
        return {operator:'searchNext',count:n,text:novim.lastVind,forward:(novim.lastVind ? novim.lastVindForward : true)}
    },'N':function (n)
    {
        return {operator:'searchPrev',count:n,text:novim.lastVind,forward:(novim.lastVind ? !novim.lastVindForward : false)}
    },'p':function (n)
    {
        return {operator:'put',count:n,after:true}
    },'P':function (n)
    {
        return {operator:'put',count:n,after:false}
    },'u':function (n)
    {
        return {operator:'undo',count:n}
    },'.':function (n)
    {
        return {operator:'repeat',count:n}
    },'Y':function (n)
    {
        return {operator:'yank',motion:{kind:'line',count:n}}
    },'o':function (n)
    {
        return {operator:'openLine',count:n,after:true}
    },'O':function (n)
    {
        return {operator:'openLine',count:n,after:false}
    },'I':function ()
    {
        return {operator:'insertAtIndent'}
    },'~':function (n)
    {
        return {operator:'toggleCase',count:n}
    },'J':function (n)
    {
        return {operator:'joinLinesVim',count:n}
    },'%':function ()
    {
        return {operator:'matchBracket'}
    },'*':function (n)
    {
        return {operator:'searchWord',count:n,forward:true}
    },'#':function (n)
    {
        return {operator:'searchWord',count:n,forward:false}
    },'r':function (n, c)
    {
        return {operator:'replace',count:n,char:(c != null ? c : '')}
    }}
    novim["motions"] = {'0':function ()
    {
        return {kind:'bol'}
    },'$':function ()
    {
        return {kind:'eol'}
    },'>':function (n)
    {
        return {kind:'line',count:n}
    },'<':function (n)
    {
        return {kind:'line',count:n}
    },'c':function (n)
    {
        return {kind:'line',count:n}
    },'d':function (n)
    {
        return {kind:'line',count:n}
    },'y':function (n)
    {
        return {kind:'line',count:n}
    },'w':function (n)
    {
        return {kind:'word',count:n}
    },'e':function (n)
    {
        return {kind:'wend',count:n}
    },'b':function (n)
    {
        return {kind:'drow',count:n}
    },'W':function (n)
    {
        return {kind:'WORD',count:n}
    },'E':function (n)
    {
        return {kind:'WEND',count:n}
    },'B':function (n)
    {
        return {kind:'DROW',count:n}
    },'h':function (n)
    {
        return {kind:'charBack',count:n}
    },'l':function (n)
    {
        return {kind:'char',count:n}
    },'j':function (n)
    {
        return {kind:'lineDown',count:n}
    },'k':function (n)
    {
        return {kind:'lineUp',count:n}
    },'H':function (n)
    {
        return {kind:'windowTop',count:n}
    },'M':function (n)
    {
        return {kind:'windowMiddle',count:n}
    },'L':function (n)
    {
        return {kind:'windowBottom',count:n}
    },'(':function (n)
    {
        return {kind:'sentenceBack',count:n}
    },')':function (n)
    {
        return {kind:'sentence',count:n}
    },'{':function (n)
    {
        return {kind:'paragraphBack',count:n}
    },'}':function (n)
    {
        return {kind:'paragraph',count:n}
    },'+':function (n)
    {
        return {kind:'lineFirstDown',count:n}
    },'-':function (n)
    {
        return {kind:'lineFirstUp',count:n}
    },'_':function (n)
    {
        return {kind:'lineFirst',count:n}
    }}
    novim["textObjects"] = {'w':'word','W':'WORD','"':'"',"'":"'",'(':'(',')':'(','b':'(','[':'[',']':'[','{':'{','}':'{','B':'{'}
    novim["lastVind"] = ''
    novim["lastVindForward"] = true
    function novim (state)
    {
        this.state = state
    
        this.name = 'novim'
        this.lastFind = null
        this.exRange = null
        this.exConfirms = null
        this.exHighlighting = false
        this.searchForward = true
        this.searchText = ''
        this.searchHistory = new cmdlinehistory('search')
        this.exHistory = new cmdlinehistory('ex')
        this.reset()
    }

    novim["clipboardSync"] = null
    novim["isHeadless"] = function ()
    {
        var screen

        screen = global.ked_screen
        if (!screen)
        {
            return true
        }
        if (screen.t && screen.t.headless)
        {
            return true
        }
        return false
    }

    novim["clipboardEnabled"] = function ()
    {
        if (novim.clipboardSync === null)
        {
            return !novim.isHeadless()
        }
        return novim.clipboardSync
    }

    novim["toggleClipboard"] = function ()
    {
        var enabled

        enabled = !novim.clipboardEnabled()
        novim.clipboardSync = enabled
        return enabled
    }

    novim.prototype["reset"] = function ()
    {
        this.count = ''
        this.operator = null
        this.area = null
        this.prefix = null
        this.register = null
        this.registerPending = false
        this.macroPending = null
        this.find = null
        this.replace = null
        this.ex = null
        this.exRange = null
        this.searchHistory.reset()
        this.exHistory.reset()
        return true
    }

    novim.prototype["exitNovim"] = function ()
    {
        this.state.stopMode('novim')
        return true
    }

    novim.prototype["countNumber"] = function ()
    {
        return (_k_.empty(this.count) ? 1 : parseInt(this.count))
    }

    novim.prototype["history"] = function (kind)
    {
        return (kind === 'search' ? this.searchHistory : this.exHistory)
    }

    novim.prototype["historyUp"] = function (kind, text)
    {
        return this.navigateHistory(kind,'prev',text)
    }

    novim.prototype["historyDown"] = function (kind, text)
    {
        return this.navigateHistory(kind,'next',text)
    }

    novim.prototype["navigateHistory"] = function (kind, direction, text)
    {
        var current, history, value

        history = this.history(kind)
        current = (text != null ? text : ((kind === 'search' ? this.searchText : this.ex)))
        value = (direction === 'prev' ? history.prev(current) : history.next(current))
        if (!(value != null))
        {
            return false
        }
        if (kind === 'search')
        {
            this.searchChanged(value)
            post.emit('novim.search.text',{state:this.hostName(),text:value})
        }
        else
        {
            this.exChanged(value)
            post.emit('novim.ex.text',{state:this.hostName(),text:value})
        }
        return true
    }

    novim.prototype["hostName"] = function ()
    {
        var _203_35_

        return (((_203_35_=this.state.sheetPage) != null ? _203_35_ : this.state)).name
    }

    novim.prototype["logPending"] = function ()
    {
        var op, pending

        op = null
        if (this.macroPending === 'record')
        {
            op = 'q'
        }
        if (this.macroPending === 'play')
        {
            op = '@'
        }
        op = (op != null ? op : this.operator)
        op = (op != null ? op : this.find)
        op = (op != null ? op : this.replace)
        pending = {op:op,area:this.area,prefix:this.prefix,count:this.count,register:this.register}
        post.emit('novim.pending',pending)
        return true
    }

    novim.prototype["playLastExCommand"] = function (count)
    {
        var i, line, n, value

        value = this.state.novim.register.read(':')
        if (!value)
        {
            return false
        }
        line = this.state.novim.register.textForValue(value)
        this.state.novim.macroLastRegister = ':'
        n = _k_.max(1,((count != null ? count : 1)))
        for (i = 0; i < n; i++)
        {
            this.runEx(line)
        }
        return true
    }

    novim.prototype["completeTextObject"] = function (target)
    {
        var area, operator

        area = this.area
        operator = novim.operators[this.operator]
        return this.execute({operator:operator,motion:{kind:'textObject',area:area,target:target,count:this.countNumber()}})
    }

    novim.prototype["completeFind"] = function (target)
    {
        var forward, motion, operator, till, _250_46_

        till = _k_.in(this.find,['t','T'])
        forward = _k_.in(this.find,['f','t'])
        this.lastFind = {target:target,till:till,forward:forward}
        motion = {kind:'charFind',target:target,till:till,forward:forward,count:this.countNumber()}
        operator = ((_250_46_=novim.operators[this.operator]) != null ? _250_46_ : 'move')
        return this.execute({operator:operator,motion:motion})
    }

    novim.prototype["completeReplace"] = function (char)
    {
        if (this.state.novim.visual)
        {
            return this.execute({operator:'visualReplace',char:char})
        }
        return this.execute(novim.commands['r'](this.countNumber(),char))
    }

    novim.prototype["handleReplaceKey"] = function (combo, char)
    {
        if (_k_.in(combo,['esc','escape']))
        {
            this.state.finishNovimInsert()
            return true
        }
        if (_k_.in(combo,['delete','backspace']))
        {
            this.state.replaceNovimBackspace()
            return true
        }
        if (combo === 'return')
        {
            return 'unhandled'
        }
        if (combo.includes('alt+') || combo.includes('ctrl+') || combo.includes('cmd+'))
        {
            return 'unhandled'
        }
        if (char.length === 1 && char !== '\n')
        {
            this.state.replaceNovimChar(char)
            return true
        }
        return 'unhandled'
    }

    novim.prototype["repeatFind"] = function (reverse = false)
    {
        var forward, motion, operator, _286_46_

        if (!this.lastFind)
        {
            return
        }
        forward = (reverse ? !this.lastFind.forward : this.lastFind.forward)
        motion = {kind:'charFind',target:this.lastFind.target,till:this.lastFind.till,forward:forward,count:this.countNumber(),repeat:true}
        operator = ((_286_46_=novim.operators[this.operator]) != null ? _286_46_ : 'move')
        return this.execute({operator:operator,motion:motion})
    }

    novim.prototype["execute"] = function (cmd)
    {
        if (this.register)
        {
            cmd.register = this.register
        }
        this.state.executeNovim(cmd)
        this.reset()
        post.emit('novim.execute',cmd)
        if (_k_.in(cmd.operator,['searchNext','searchPrev','searchWord']))
        {
            this.emitSearchPosition()
        }
        return true
    }

    novim.prototype["inSheetText"] = function (fn, quiet = true)
    {
        var _305_36_

        if (!(this.state.rectree != null))
        {
            return fn()
        }
        return this.state.novimInNode(this,fn,quiet)
    }

    novim.prototype["fileEx"] = function (line)
    {
        var parsed

        parsed = belt.parseEx(belt.exTrimLeft(line))
        return parsed.error || _k_.empty((parsed.name)) && !parsed.range || _k_.in(parsed.name,['q','w','wq','x','e','edit'])
    }

    novim.prototype["runEx"] = function (line, record = true)
    {
        var file, name, parsed, result, visualRange, _317_25_

        if ((this.state.rectree != null) && !this.fileEx(line))
        {
            return this.inSheetText(((function ()
            {
                return this.runEx(line,record)
            }).bind(this)),false)
        }
        this.clearExHighlight()
        visualRange = this.exRange
        this.reset()
        line = belt.exTrimLeft(line)
        if (_k_.empty(line))
        {
            return true
        }
        if (record)
        {
            this.exHistory.add(line)
        }
        if (record)
        {
            this.state.novim.register.set(':',{lines:[line],linewise:false})
        }
        if (this.state.novim.visual)
        {
            this.state.stopVisual()
        }
        parsed = belt.parseEx(line)
        if (parsed.error)
        {
            post.emit('novim.error',parsed.error)
            return false
        }
        if (_k_.in(parsed.name,['s','substitute']))
        {
            return this.runSubstitute(parsed,visualRange)
        }
        if (_k_.in(parsed.name,['g','v','global','vglobal']))
        {
            this.state.novim.jumps.keep += 1
            result = this.runGlobal(parsed,visualRange)
            this.state.novim.jumps.keep -= 1
            return result
        }
        if (_k_.in(parsed.name,['normal','norm']))
        {
            return this.runNormal(parsed,visualRange)
        }
        if (_k_.in(parsed.name,['d','delete']))
        {
            return this.deleteExRange(parsed,visualRange)
        }
        if (_k_.in(parsed.name,['e','edit']))
        {
            return this.runEdit(parsed)
        }
        name = parsed.name
        if (parsed.bang)
        {
            name += '!'
        }
        file = parsed.args
        if (_k_.empty(file))
        {
            file = null
        }
        switch (name)
        {
            case 'q':
                if (this.state.isDirty())
                {
                    post.emit('novim.error','unsaved changes')
                    return false
                }
                post.emit('quit')
                break
            case 'q!':
                post.emit('quit')
                break
            case 'w':
            case 'w!':
                post.emit('file.save',file)
                break
            case 'wq':
            case 'wq!':
                post.emit('file.saveAndQuit',file)
                break
            case 'x':
            case 'x!':
                if (this.state.isDirty())
                {
                    post.emit('file.saveAndQuit',file)
                }
                else
                {
                    post.emit('quit')
                }
                break
            default:
                post.emit('novim.error',`not an editor command: ${name}`)
                return false
        }

        return true
    }

    novim.prototype["runSubstitute"] = function (parsed, visualRange)
    {
        var entries, range, searching, searchSpec, spec

        spec = belt.parseSubstitute(parsed.args.trim())
        if (spec.error)
        {
            post.emit('novim.error',spec.error)
            return false
        }
        range = this.resolveExRange(parsed.range,visualRange)
        if (!range)
        {
            post.emit('novim.error','no visual selection')
            return false
        }
        searching = !spec.hasReplacement
        searchSpec = spec
        if (searching)
        {
            searchSpec = {pattern:spec.pattern,flags:{g:true,i:spec.flags.i,c:false}}
        }
        entries = this.state.collectSubstitutions(range[0],range[1],searchSpec)
        if (_k_.empty(entries))
        {
            post.emit('novim.error',`pattern not found: ${spec.pattern}`)
            return false
        }
        this.state.pushJump()
        if (searching)
        {
            return this.state.selectSubstitutions(entries)
        }
        if (spec.flags.c)
        {
            return this.startSubstituteConfirm(range[0],range[1],spec)
        }
        this.state.applySubstitutions(entries,spec)
        return true
    }

    novim.prototype["runGlobal"] = function (parsed, visualRange)
    {
        var before, delta, invert, line, marks, matched, range, re, spec, target, y

        spec = belt.parseGlobal(parsed.args)
        if (spec.error)
        {
            post.emit('novim.error',spec.error)
            return false
        }
        invert = _k_.in(parsed.name,['v','vglobal'])
        if (parsed.bang)
        {
            invert = !invert
        }
        range = this.resolveExRange(parsed.range,visualRange,true)
        try
        {
            re = new RegExp(spec.pattern)
        }
        catch (err)
        {
            post.emit('novim.error',`invalid pattern: ${err.message}`)
            return false
        }
        marks = []
        for (y = range[0]; y <= range[1]; y++)
        {
            if (y < 0 || y >= this.state.s.lines.length)
            {
                continue
            }
            matched = re.test(kseg.str(this.state.s.lines[y]))
            if (matched === invert)
            {
                continue
            }
            marks.push(y)
        }
        delta = 0
        this.state.begin()
        var list = _k_.list(marks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            y = list[_a_]
            target = y + delta
            if (target < 0 || target >= this.state.s.lines.length)
            {
                continue
            }
            before = this.state.s.lines.length
            line = `${target + 1},${target + 1}${spec.command}`
            if (this.runEx(line,false) === false)
            {
                break
            }
            if (this.exConfirms)
            {
                this.finishSubstituteConfirm()
                post.emit('novim.error','confirm not supported in :g')
                break
            }
            delta += this.state.s.lines.length - before
        }
        this.state.end()
        return true
    }

    novim.prototype["runNormal"] = function (parsed, visualRange)
    {
        var chars, host, range, wasActive, y, _480_37_

        chars = parsed.args
        if (_k_.empty(chars))
        {
            return true
        }
        range = this.resolveExRange(parsed.range,visualRange)
        host = ((_480_37_=this.state.sheetPage) != null ? _480_37_ : this.state)
        wasActive = mode.isActive(host,'novim')
        this.state.begin()
        for (y = range[0]; y <= range[1]; y++)
        {
            if (y < 0 || y >= this.state.s.lines.length)
            {
                continue
            }
            this.state.setMainCursor(0,y)
            this.feedNormalKeys(chars)
            if (wasActive && !mode.isActive(host,'novim'))
            {
                this.state.startMode('novim')
            }
        }
        this.state.end()
        if (wasActive && !mode.isActive(host,'novim'))
        {
            this.state.startMode('novim')
        }
        return true
    }

    novim.prototype["feedNormalKeys"] = function (chars)
    {
        var c, event, sr

        var list = _k_.list(chars)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            event = {combo:c,char:c}
            if (this.state.novim.insert)
            {
                sr = this.state.handleKey(c,event)
                if (sr === 'unhandled')
                {
                    this.state.insert(c)
                }
            }
            else
            {
                this.handleKey(c,event)
            }
        }
        if (this.state.novim.insert)
        {
            this.state.finishNovimInsert()
        }
        return true
    }

    novim.prototype["deleteExRange"] = function (parsed, visualRange)
    {
        var lines, range, rng, y1, y2

        range = this.resolveExRange(parsed.range,visualRange)
        ;[y1,y2] = range
        lines = this.state.s.lines
        y2 = _k_.min(y2,lines.length - 1)
        if (y1 > y2 || y1 >= lines.length)
        {
            return true
        }
        rng = [0,y1,kseg.width(lines[y2]),y2]
        this.state.deleteRanges([rng],[[0,y1]])
        return true
    }

    novim.prototype["runEdit"] = function (parsed)
    {
        var file

        file = parsed.args.trim()
        if (!parsed.bang && this.state.isDirty())
        {
            post.emit('novim.error','unsaved changes (add ! to override)')
            return false
        }
        this.state.pushJump()
        post.emit('file.edit',file,parsed.bang)
        return true
    }

    novim.prototype["resolveExRange"] = function (rng, visualRange, all = false)
    {
        var cursorY, lastY, resolve, y1, y2

        lastY = this.state.s.lines.length - 1
        cursorY = this.state.mainCursor()[1]
        if (!rng)
        {
            if (all)
            {
                return [0,lastY]
            }
            return [cursorY,cursorY]
        }
        switch (rng.kind)
        {
            case 'all':
                return [0,lastY]

            case 'visual':
                return visualRange

            default:
                resolve = function (b)
            {
                if (b === 'current')
                {
                    return cursorY
                }
                if (b === 'last')
                {
                    return lastY
                }
                return _k_.clamp(0,lastY,b - 1)
            }
                y1 = resolve(rng.from)
                y2 = resolve(rng.to)
                return (y1 < y2 ? [y1,y2] : [y2,y1])
        }

    }

    novim.prototype["visualLineRange"] = function ()
    {
        var hi, lo, pair, y, ys

        ys = [this.state.mainCursor()[1]]
        var list = _k_.list(this.state.visualPairs())
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pair = list[_a_]
            ys.push(pair[0][1])
            ys.push(pair[1][1])
        }
        lo = ys[0]
        hi = ys[0]
        var list1 = _k_.list(ys)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            y = list1[_b_]
            if (y < lo)
            {
                lo = y
            }
            if (y > hi)
            {
                hi = y
            }
        }
        return [lo,hi]
    }

    novim.prototype["startSubstituteConfirm"] = function (y1, y2, spec)
    {
        var _598_26_

        this.exConfirms = {y1:y1,y2:y2,spec:spec,y:y1,fromX:0,remaining:[],total:0}
        ;(((_598_26_=this.state.sheetPage) != null ? _598_26_ : this.state)).begin()
        return this.advanceSubstituteConfirm()
    }

    novim.prototype["remainingSubstitutions"] = function ()
    {
        var c, line, m, result, start, y

        c = this.exConfirms
        result = []
        if (c.y > c.y2)
        {
            return []
        }
        for (y = c.y; y <= c.y2; y++)
        {
            if (y < 0 || y >= this.state.s.lines.length)
            {
                continue
            }
            line = kseg.str(this.state.s.lines[y])
            start = (y === c.y ? c.fromX : 0)
            var list = _k_.list(belt.lineMatches(line,c.spec,start))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                m = list[_a_]
                result.push({y:y,match:m})
            }
        }
        return result
    }

    novim.prototype["advanceSubstituteConfirm"] = function ()
    {
        var c, entry, r, spans

        c = this.exConfirms
        if (!c)
        {
            return this.finishSubstituteConfirm()
        }
        c.remaining = this.remainingSubstitutions()
        if (_k_.empty(c.remaining))
        {
            return this.finishSubstituteConfirm()
        }
        entry = c.remaining[0]
        spans = []
        var list = _k_.list(c.remaining)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            r = list[_a_]
            spans.push([r.match.x1,r.y,r.match.x2])
        }
        this.state.setHighlights(spans)
        this.state.setSelections([[entry.match.x1,entry.y,entry.match.x2,entry.y]])
        this.state.setCursors([[entry.match.x1,entry.y]])
        post.emit('novim.pending',{op:'replace? [y/n/a/q/l]'})
        return true
    }

    novim.prototype["applyCurrentSubstitution"] = function ()
    {
        var c, entry, match, repl

        c = this.exConfirms
        if (!c || _k_.empty(c.remaining))
        {
            return false
        }
        entry = c.remaining[0]
        match = entry.match
        repl = belt.exExpandReplacement(c.spec.tokens,match.groups)
        this.state.applySubstitutionAt(entry.y,match,c.spec)
        c.total += 1
        c.y = entry.y
        c.fromX = match.index + repl.length
        if (match.length === 0 && repl.length === 0)
        {
            c.fromX = match.index + 1
        }
        if (!c.spec.flags.g)
        {
            c.y = entry.y + 1
            c.fromX = 0
        }
        return true
    }

    novim.prototype["skipCurrentSubstitution"] = function ()
    {
        var c, entry, match

        c = this.exConfirms
        if (!c || _k_.empty(c.remaining))
        {
            return false
        }
        entry = c.remaining[0]
        match = entry.match
        c.y = entry.y
        c.fromX = match.index + _k_.max(1,match.length)
        if (!c.spec.flags.g)
        {
            c.y = entry.y + 1
            c.fromX = 0
        }
        return true
    }

    novim.prototype["acceptSubstituteConfirm"] = function ()
    {
        this.applyCurrentSubstitution()
        return this.advanceSubstituteConfirm()
    }

    novim.prototype["skipSubstituteConfirm"] = function ()
    {
        this.skipCurrentSubstitution()
        return this.advanceSubstituteConfirm()
    }

    novim.prototype["acceptAllSubstitutions"] = function ()
    {
        while (this.exConfirms && !_k_.empty(this.exConfirms.remaining))
        {
            this.applyCurrentSubstitution()
            this.advanceSubstituteConfirm()
        }
        return true
    }

    novim.prototype["handleSubstituteConfirmKey"] = function (combo, char)
    {
        switch (combo)
        {
            case 'esc':
            case 'escape':
            case 'ctrl+c':
                return this.finishSubstituteConfirm()

        }

        switch (char)
        {
            case 'y':
                this.acceptSubstituteConfirm()
                break
            case 'n':
                this.skipSubstituteConfirm()
                break
            case 'q':
                this.finishSubstituteConfirm()
                break
            case 'l':
                this.applyCurrentSubstitution()
                return this.finishSubstituteConfirm()

            case 'a':
                this.acceptAllSubstitutions()
                break
        }

        return true
    }

    novim.prototype["finishSubstituteConfirm"] = function ()
    {
        var c, host, _735_32_

        c = this.exConfirms
        if (!c)
        {
            return false
        }
        this.exConfirms = null
        this.state.setHighlights([])
        this.state.setSelections([])
        host = ((_735_32_=this.state.sheetPage) != null ? _735_32_ : this.state)
        if (!host.novimLater((function ()
            {
                return host.end()
            }).bind(this)))
        {
            host.end()
        }
        post.emit('novim.execute',{operator:'substitute',count:c.total})
        return true
    }

    novim.prototype["sheetSearchOff"] = function ()
    {
        var _745_37_

        return (this.state.rectree != null) && !this.state.sheetSearchPage()
    }

    novim.prototype["searchHighlight"] = function (text)
    {
        var page

        if (page = this.state.sheetSearchPage())
        {
            return page.sheetSearchHighlight(text)
        }
        else if (_k_.empty(text))
        {
            return this.state.setHighlights([])
        }
        else
        {
            return this.state.highlightText(text)
        }
    }

    novim.prototype["startSearch"] = function (forward = true)
    {
        var rng, sel, text, _758_25_, _758_73_, _766_29_, _768_58_

        if ((this.state.rectree != null) && (this.sheetSearchOff() || (this.state.sheetActive() != null)))
        {
            return this.inSheetText((function ()
            {
                return this.startSearch(forward)
            }).bind(this))
        }
        this.searchForward = forward
        novim.lastVindForward = forward
        text = ''
        if (!(this.state.rectree != null))
        {
            text = ((_768_58_=this.state.textOfSelectionOrWordAtCursor()) != null ? _768_58_ : '')
            if (this.state.s.selections.length)
            {
                sel = this.state.s.selections[_k_.clamp(0,this.state.s.selections.length - 1,this.state.s.main)]
                this.state.setMainCursor(sel[0],sel[1])
            }
            else if (rng = belt.rangeOfClosestWordToPos(this.state.s.lines,this.state.mainCursor()))
            {
                this.state.setMainCursor(rng[0],rng[1])
            }
        }
        this.searchText = text
        novim.lastVind = text
        this.state.novim.register.set('/',{lines:[text],linewise:false})
        this.searchHighlight(text)
        post.emit('novim.search.start',{state:this.hostName(),text:text})
        return true
    }

    novim.prototype["searchChanged"] = function (text)
    {
        if (this.sheetSearchOff())
        {
            return this.inSheetText((function ()
            {
                return this.searchChanged(text)
            }).bind(this))
        }
        this.searchText = text
        novim.lastVind = text
        this.state.novim.register.set('/',{lines:[text],linewise:false})
        this.searchHighlight(text)
        return true
    }

    novim.prototype["cancelSearch"] = function ()
    {
        if (this.sheetSearchOff())
        {
            return this.inSheetText((function ()
            {
                return this.cancelSearch()
            }).bind(this))
        }
        this.searchHighlight('')
        this.searchHistory.reset()
        return true
    }

    novim.prototype["emitSearchPosition"] = function ()
    {
        var position, _811_42_

        if ((this.state.sheetSearchPage() != null ? this.state.sheetSearchPage().novimLater((function ()
            {
                return this.emitSearchPosition()
            }).bind(this)) : undefined))
        {
            return true
        }
        position = this.state.searchPosition()
        if (!position || position[1] === 0)
        {
            return false
        }
        post.emit('novim.search.position',{state:this.hostName(),current:position[0],total:position[1]})
        return true
    }

    novim.prototype["commitSearch"] = function ()
    {
        var after, before, page, pos, span, spans, target

        if (this.sheetSearchOff())
        {
            return this.inSheetText((function ()
            {
                return this.commitSearch()
            }).bind(this))
        }
        this.searchHistory.add(this.searchText)
        if (page = this.state.sheetSearchPage())
        {
            page.sheetSearchCommit(this.searchForward)
            this.emitSearchPosition()
            return true
        }
        spans = this.state.s.highlights
        if (_k_.empty(spans))
        {
            return true
        }
        pos = this.state.mainCursor()
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            if (span[0] === pos[0] && span[1] === pos[1])
            {
                this.emitSearchPosition()
                return true
            }
        }
        target = null
        var list1 = _k_.list(spans)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
            after = span[1] > pos[1] || (span[1] === pos[1] && span[0] > pos[0])
            before = span[1] < pos[1] || (span[1] === pos[1] && span[0] < pos[0])
            if (this.searchForward && after)
            {
                target = span
                break
            }
            if (!this.searchForward && before)
            {
                target = span
            }
        }
        target = (target != null ? target : (this.searchForward ? spans[0] : spans.slice(-1)[0]))
        before = this.state.mainCursor()
        if (!(_k_.eql(before, [target[0],target[1]])))
        {
            this.state.pushJump(before)
            this.state.setMainCursor([target[0],target[1]])
        }
        this.emitSearchPosition()
        return true
    }

    novim.prototype["startEx"] = function ()
    {
        var text

        this.reset()
        text = ''
        if (this.state.novim.visual)
        {
            this.exRange = this.visualLineRange()
            text = "'<,'>"
        }
        this.ex = text
        post.emit('novim.ex.start',{state:this.hostName(),text:text})
        return true
    }

    novim.prototype["cancelEx"] = function ()
    {
        this.inSheetText((function ()
        {
            return this.clearExHighlight()
        }).bind(this))
        this.reset()
        return true
    }

    novim.prototype["exChanged"] = function (text)
    {
        this.ex = text
        this.inSheetText((function ()
        {
            return this.updateExHighlight()
        }).bind(this))
        return true
    }

    novim.prototype["updateExHighlight"] = function ()
    {
        var head, parsed, spans

        parsed = belt.parseEx(this.ex)
        head = null
        if (!parsed.error && _k_.in(parsed.name,['s','substitute']))
        {
            head = belt.parseSubstitutePattern(parsed.args)
        }
        if (head && !_k_.empty(head.pattern))
        {
            if (!head.open)
            {
                return false
            }
            spans = belt.patternSpans(this.state.s.lines,head.pattern)
            this.exHighlighting = true
            this.state.setHighlights(spans)
            return true
        }
        return this.clearExHighlight()
    }

    novim.prototype["clearExHighlight"] = function ()
    {
        if (!this.exHighlighting)
        {
            return false
        }
        this.exHighlighting = false
        this.state.setHighlights([])
        return true
    }

    novim.prototype["handleKey"] = function (key, event)
    {
        var build, char, combo, command, count, doubled, kind, pending, prefix, target, _1015_36_, _930_28_

        combo = ((_930_28_=event.combo) != null ? _930_28_ : key)
        char = (!_k_.empty((event.char)) ? event.char : combo)
        if (this.exConfirms)
        {
            this.handleSubstituteConfirmKey(combo,char)
            return true
        }
        if (this.state.novim.insert && this.state.novim.insert.kind === 'replace')
        {
            return this.handleReplaceKey(combo,char)
        }
        if (combo === 'ctrl+v')
        {
            if (!this.operator && !this.area)
            {
                this.state.startVisual('block')
            }
            return this.reset()
        }
        if (_k_.in(combo,['ctrl+o','ctrl+i','tab']) && !this.state.novim.insert && !this.state.novim.visual)
        {
            count = this.countNumber()
            this.reset()
            if (combo === 'ctrl+o')
            {
                this.state.jumpOlder(count)
            }
            else
            {
                this.state.jumpNewer(count)
            }
            return true
        }
        if (combo.includes('alt+') || combo.includes('ctrl+') || combo.includes('cmd+'))
        {
            return 'unhandled'
        }
        if (this.macroPending)
        {
            pending = this.macroPending
            this.macroPending = null
            if (_k_.in(combo,['esc','escape']))
            {
                this.reset()
                return true
            }
            if (pending === 'record')
            {
                this.state.markMacroControlKey()
                if (char.length === 1 && /^[a-zA-Z]$/.test(char))
                {
                    this.state.startMacroRecording(char.toLowerCase(),/^[A-Z]$/.test(char))
                }
                else if (char === ':')
                {
                    post.emit('novim.error','command-line window not implemented')
                }
                else
                {
                    post.emit('novim.error','invalid register')
                }
            }
            else if (pending === 'play')
            {
                count = this.countNumber()
                this.count = ''
                if (char === ':')
                {
                    this.playLastExCommand(count)
                }
                else if (char === '@')
                {
                    if (this.state.novim.macroLastRegister === ':')
                    {
                        this.playLastExCommand(count)
                    }
                    else
                    {
                        this.state.playLastMacro(count)
                    }
                }
                else if (char.length === 1)
                {
                    this.state.playMacro(char,count)
                }
                else
                {
                    post.emit('novim.error','invalid register')
                }
            }
            this.reset()
            return true
        }
        if (char === 'q' && this.state.macroRecording)
        {
            this.state.markMacroControlKey()
            this.state.stopMacroRecording()
            this.reset()
            return true
        }
        if (char === 'q' && !this.state.novim.visual && !this.operator && !this.area && !this.prefix)
        {
            this.state.markMacroControlKey()
            this.macroPending = 'record'
            return this.logPending()
        }
        if (_k_.in(combo,['esc','escape']))
        {
            this.reset()
            if (this.state.novim.visual)
            {
                this.state.stopVisual()
            }
            else if (this.state.hasCursorsHighlightsOrSelections())
            {
                this.state.clearCursorsHighlightsAndSelections()
            }
            else
            {
                this.exitNovim()
            }
            return true
        }
        if (!this.find && !(_k_.in(char,',;nN0123456789@q')) && !(_k_.in(key,keyinfo.modifierNames)))
        {
            this.state.setHighlights([])
            ;(this.state.sheetSearchPage() != null ? this.state.sheetSearchPage().sheetSearchHighlight('') : undefined)
        }
        if (this.find)
        {
            if (char.length === 1)
            {
                this.completeFind(char)
            }
            else if (key !== 'shift')
            {
                this.reset()
            }
            return true
        }
        if (this.replace)
        {
            if (char.length === 1)
            {
                return this.completeReplace(char)
            }
            else if (key !== 'shift')
            {
                return this.reset()
            }
            return true
        }
        else if (char === 'r')
        {
            this.replace = true
            return this.logPending()
        }
        switch (char)
        {
            case 'left':
                char = 'h'
                break
            case 'right':
                char = 'l'
                break
            case 'up':
                char = 'k'
                break
            case 'down':
                char = 'j'
                break
        }

        if (this.registerPending)
        {
            this.registerPending = false
            if (char === '"')
            {
                this.register = null
            }
            else if (char.length === 1 && _k_.in(char,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_+*/:%.=#'))
            {
                this.register = char
            }
            else
            {
                return this.reset()
            }
            return this.logPending()
        }
        if (char.length !== 1)
        {
            return 'unhandled'
        }
        if (this.state.novim.visual && !this.operator && !this.area && !this.prefix)
        {
            switch (char)
            {
                case ':':
                    return this.startEx()

                case 'v':
                    this.state.startVisual('char')
                    return this.reset()

                case 'V':
                    this.state.startVisual('line')
                    return this.reset()

                case 'd':
                case 'x':
                    return this.execute({operator:'visualDelete'})

                case 'y':
                    return this.execute({operator:'visualYank'})

                case 'c':
                case 's':
                    return this.execute({operator:'visualChange'})

                case 'R':
                    return this.execute({operator:'visualChange'})

                case 'u':
                    return this.execute({operator:'visualCase',kind:'lower'})

                case 'U':
                    return this.execute({operator:'visualCase',kind:'upper'})

                case '~':
                    return this.execute({operator:'visualCase',kind:'toggle'})

                case 'o':
                    return this.execute({operator:'visualSwap'})

                case '>':
                    return this.execute({operator:'visualIndent',count:this.countNumber()})

                case '<':
                    return this.execute({operator:'visualDeindent',count:this.countNumber()})

                case 'I':
                    if (this.state.novim.visual === 'block')
                    {
                        return this.execute({operator:'visualBlockPrepend'})
                    }
                    break
                case 'A':
                    if (this.state.novim.visual === 'block')
                    {
                        return this.execute({operator:'visualBlockAppend'})
                    }
                    break
            }

        }
        if ((this.state.novim.visual || this.operator) && !this.area && _k_.in(char,'ia'))
        {
            this.area = (char === 'i' ? 'inner' : 'around')
            return this.logPending()
        }
        if (!this.operator && !this.area && !this.prefix)
        {
            switch (char)
            {
                case 'v':
                    this.state.startVisual('char')
                    return this.reset()

                case 'V':
                    this.state.startVisual('line')
                    return this.reset()

                case ':':
                    if (!this.state.novim.visual)
                    {
                        return this.startEx()
                    }
                    break
            }

        }
        if (this.prefix)
        {
            prefix = this.prefix
            this.prefix = null
            if (prefix === 'g' && _k_.in(char,[';',',']))
            {
                if (this.operator || this.area || this.state.novim.visual)
                {
                    return this.reset()
                }
                count = this.countNumber()
                this.reset()
                if (char === ';')
                {
                    this.state.jumpChangeOlder(count)
                }
                else
                {
                    this.state.jumpChangeNewer(count)
                }
                return true
            }
            if (prefix === 'g' && char === 'g')
            {
                return this.execute({operator:'move',motion:{kind:'bof',count:this.countNumber()}})
            }
            if (prefix === 'g' && char === 'v')
            {
                this.state.startLastVisual()
                return this.reset()
            }
            if (prefix === 'g' && _k_.in(char,'uU~'))
            {
                kind = 'toggle'
                if (char === 'u')
                {
                    kind = 'lower'
                }
                if (char === 'U')
                {
                    kind = 'upper'
                }
                if (this.state.novim.visual)
                {
                    return this.execute({operator:'visualCase',kind:kind})
                }
                this.operator = 'g' + char
                return this.logPending()
            }
            return this.reset()
        }
        else if (this.area)
        {
            if (target = novim.textObjects[char])
            {
                if (this.state.novim.visual)
                {
                    return this.execute({operator:'visualTextObject',motion:{kind:'textObject',area:this.area,target:target,count:this.countNumber()}})
                }
                else
                {
                    return this.completeTextObject(target)
                }
            }
            return this.reset()
        }
        else if (this.operator)
        {
            doubled = this.operator === 'gu' && char === 'u' || this.operator === 'gU' && char === 'U' || this.operator === 'g~' && char === '~'
            if (doubled)
            {
                return this.execute({operator:novim.operators[this.operator],motion:{kind:'line',count:this.countNumber()}})
            }
            if (build = novim.motions[char])
            {
                return this.execute({operator:novim.operators[this.operator],motion:build(this.countNumber())})
            }
            switch (char)
            {
                case ';':
                    return this.repeatFind(false)

                case ',':
                    return this.repeatFind(true)

                case 'f':
                case 't':
                case 'F':
                case 'T':
                    this.find = char
                    return this.logPending()

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.count += char
                    return this.logPending()

            }

            return this.reset()
        }
        else if (novim.operators[char])
        {
            this.operator = char
            return this.logPending()
        }
        else if (command = novim.commands[char])
        {
            return this.execute(command(this.countNumber()))
        }
        switch (char)
        {
            case 'H':
                return this.execute({operator:'move',motion:{kind:'windowTop',count:this.countNumber()}})

            case 'M':
                return this.execute({operator:'move',motion:{kind:'windowMiddle',count:this.countNumber()}})

            case 'L':
                return this.execute({operator:'move',motion:{kind:'windowBottom',count:this.countNumber()}})

            case 'i':
                return this.state.startNovimInsert({kind:'insert'})

            case 'a':
                return this.state.startNovimInsert({kind:'append'})

            case 'A':
                return this.state.startNovimInsert({kind:'appendEol'})

            case 'R':
                if (!this.state.novim.visual)
                {
                    count = this.countNumber()
                    this.reset()
                    return this.state.startNovimReplace(count)
                }
                break
            case ';':
                return this.repeatFind(false)

            case ',':
                return this.repeatFind(true)

            case '"':
                this.registerPending = true
                return this.logPending()

            case 'g':
                this.prefix = 'g'
                return this.logPending()

            case '@':
                this.macroPending = 'play'
                return this.logPending()

            case '/':
            case '?':
                this.reset()
                return this.startSearch(char === '/')

            case 'f':
            case 't':
            case 'F':
            case 'T':
                this.find = char
                return this.logPending()

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                if (char === '0' && _k_.empty(this.count))
                {
                    return this.execute({operator:'move',motion:{kind:'bol'}})
                }
                else
                {
                    this.count += char
                    return this.logPending()
                }
                break
        }

        return 'unhandled'
    }

    novim.prototype["themeColor"] = function (colorName, defaultColor)
    {
        switch (colorName)
        {
            case 'cursor.multi':
                return theme.novim.cursor.multi

            case 'cursor.main':
                return theme.novim.cursor.main

        }

        return defaultColor
    }

    return novim
})()

export default novim;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92aW0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL2VkaXQvbW9kZS9ub3ZpbS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ21CLFdBQU47T0FBVyxjQUFYO09BQW1CLFdBQW5COztPQUNNLFlBQVQ7O09BQ1MsV0FBWjtPQUFpQixxQkFBakI7O09BQ1ksV0FBQTs7O0FBQ2xCLFNBQUQ7O0lBR0ksT0FBQyxlQUNHLElBQUssU0FDTCxJQUFLLFNBQ0wsSUFBSyxPQUNMLElBQUssU0FDTCxJQUFLLFdBQ0wsS0FBTSxZQUNOLEtBQU0sWUFDTixLQUFNO0lBRVYsT0FBQyxjQUNHOztnQkFBZSxTQUFVLFNBQTRCLFFBQVUsS0FBTTtNQUNyRTs7Z0JBQWUsU0FBVSxTQUE0QixRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxTQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxTQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxTQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxTQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FBUTs7Z0JBQU8sU0FBVSxPQUFlLE1BQU8sRUFBTSxRQUFVLEtBQU07TUFDckUsY0FB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
//# sourceURL=../../../../kode/ked/edit/mode/novim.kode
