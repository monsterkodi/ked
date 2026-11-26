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

    novim.prototype["sheetExAll"] = function (line)
    {
        var parsed, _325_69_

        parsed = belt.parseEx(belt.exTrimLeft(line))
        if (parsed.error)
        {
            return false
        }
        if (_k_.in(parsed.name,['s','substitute']))
        {
            if ((belt.parseSubstitute(parsed.args.trim()).flags != null ? belt.parseSubstitute(parsed.args.trim()).flags.c : undefined))
            {
                return false
            }
        }
        if (parsed.range)
        {
            return parsed.range.kind === 'all'
        }
        return _k_.in(parsed.name,['g','v','global','vglobal'])
    }

    novim.prototype["runExInNodes"] = function (line, record)
    {
        var err, errors, result, sheet

        line = belt.exTrimLeft(line)
        if (record)
        {
            this.exHistory.add(line)
        }
        if (record)
        {
            this.state.novim.register.set(':',{lines:[line],linewise:false})
        }
        this.exSheet = {errors:[],found:false}
        try
        {
            result = this.state.novimInNodes(this,((function ()
            {
                return this.runEx(line,false)
            }).bind(this)))
        }
        finally
        {
            sheet = this.exSheet
            delete this.exSheet
        }
        errors = sheet.errors
        if (sheet.found)
        {
            errors = errors.filter(function (err)
            {
                return !err.startsWith('pattern not found')
            })
        }
        errors = Array.from(new Set(errors))
        var list = _k_.list(errors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            err = list[_a_]
            post.emit('novim.error',err)
        }
        return result && _k_.empty(errors)
    }

    novim.prototype["exError"] = function (msg)
    {
        if (this.exSheet)
        {
            return this.exSheet.errors.push(msg)
        }
        else
        {
            return post.emit('novim.error',msg)
        }
    }

    novim.prototype["runEx"] = function (line, record = true)
    {
        var file, name, parsed, result, visualRange, _366_25_

        if ((this.state.rectree != null) && !this.fileEx(line))
        {
            if (this.sheetExAll(line))
            {
                return this.runExInNodes(line,record)
            }
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
                this.exError(`not an editor command: ${name}`)
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
            this.exError(spec.error)
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
            this.exError(`pattern not found: ${spec.pattern}`)
            return false
        }
        if (this.exSheet)
        {
            this.exSheet.found = true
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
            this.exError(spec.error)
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
            this.exError(`invalid pattern: ${err.message}`)
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
        var chars, host, range, wasActive, y, _532_37_

        chars = parsed.args
        if (_k_.empty(chars))
        {
            return true
        }
        range = this.resolveExRange(parsed.range,visualRange)
        host = ((_532_37_=this.state.sheetPage) != null ? _532_37_ : this.state)
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
        var _650_26_

        this.exConfirms = {y1:y1,y2:y2,spec:spec,y:y1,fromX:0,remaining:[],total:0}
        ;(((_650_26_=this.state.sheetPage) != null ? _650_26_ : this.state)).begin()
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
        var c, host, _787_32_

        c = this.exConfirms
        if (!c)
        {
            return false
        }
        this.exConfirms = null
        this.state.setHighlights([])
        this.state.setSelections([])
        host = ((_787_32_=this.state.sheetPage) != null ? _787_32_ : this.state)
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
        var _797_37_

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
        var rng, sel, text, _810_25_, _810_73_, _818_29_, _820_58_

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
            text = ((_820_58_=this.state.textOfSelectionOrWordAtCursor()) != null ? _820_58_ : '')
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
        var position, _863_42_

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
        var build, char, combo, command, count, doubled, kind, pending, prefix, target, _1067_36_, _982_28_

        combo = ((_982_28_=event.combo) != null ? _982_28_ : key)
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
