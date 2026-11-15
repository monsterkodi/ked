var _k_ = {copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var registers

import clip from "../../kxk/clip.js"


registers = (function ()
{
    function registers ()
    {
        this.values = {}
    }

    registers["cloneValue"] = function (value)
    {
        var cloned, _12_36_, _13_37_

        if (!value)
        {
            return null
        }
        cloned = {lines:_k_.copy((((_12_36_=value.lines) != null ? _12_36_ : []))),linewise:((_13_37_=value.linewise) != null ? _13_37_ : false)}
        if (value.keys)
        {
            cloned.keys = value.keys.map(function (event)
            {
                return {key:event.key,combo:event.combo,char:event.char}
            })
        }
        return cloned
    }

    registers["textForValue"] = function (value)
    {
        var text

        if (!value)
        {
            return ''
        }
        text = value.lines.join('\n')
        if (value.linewise)
        {
            text += '\n'
        }
        return text
    }

    registers["recordForText"] = function (text)
    {
        var lines, linewise

        if (_k_.empty(text))
        {
            return null
        }
        linewise = text.endsWith('\n')
        lines = text.split('\n')
        if (linewise)
        {
            lines.pop()
        }
        return {lines:lines,linewise:linewise}
    }

    registers["eventForSpecial"] = function (name)
    {
        switch (name.toLowerCase())
        {
            case 'esc':
            case 'escape':
                return {key:'esc',combo:'esc',char:'esc'}

            case 'cr':
            case 'return':
                return {key:'return',combo:'return',char:'\n'}

            case 'tab':
                return {key:'tab',combo:'tab',char:'\t'}

            case 'space':
                return {key:'space',combo:'space',char:' '}

            case 'bs':
            case 'backspace':
                return {key:'backspace',combo:'backspace',char:'backspace'}

        }

        return null
    }

    registers["keysForText"] = function (text)
    {
        var ch, close, event, i, keys

        keys = []
        i = 0
        while (i < text.length)
        {
            ch = text[i]
            if (ch === '<')
            {
                close = text.indexOf('>',i + 1)
                if (close > i)
                {
                    event = registers.eventForSpecial(text.slice(i + 1, typeof close === 'number' ? close : -1))
                    if (event)
                    {
                        keys.push(event)
                        i = close + 1
                        continue
                    }
                }
            }
            if (ch === '\n')
            {
                keys.push({key:'return',combo:'return',char:'\n'})
            }
            else
            {
                keys.push({key:ch,combo:ch,char:ch})
            }
            i += 1
        }
        return keys
    }

    registers["textForKeys"] = function (keys)
    {
        var event, key, text, _85_29_

        text = ''
        var list = _k_.list(keys)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            event = list[_a_]
            key = ((_85_29_=event.char) != null ? _85_29_ : event.key)
            if (key === 'return' || key === '\n')
            {
                text += '\n'
            }
            else if (key === 'tab' || key === '\t')
            {
                text += '\t'
            }
            else if (key === 'space')
            {
                text += ' '
            }
            else if (key === 'esc')
            {
                text += '<Esc>'
            }
            else if (key === 'backspace')
            {
                text += '<BS>'
            }
            else if (key.length === 1)
            {
                text += key
            }
            else
            {
                text += '<' + key + '>'
            }
        }
        return text
    }

    registers["target"] = function (name)
    {
        if (name === 'clipboard')
        {
            name = '+'
        }
        if (!name || name === '' || name === '"')
        {
            return {name:'"',append:false}
        }
        if (name.length !== 1)
        {
            return null
        }
        if (/^[A-Z]$/.test(name))
        {
            return {name:name.toLowerCase(),append:true}
        }
        if (/^[a-z0-9\-_+*\/:%.=#]$/.test(name))
        {
            return {name:name,append:false}
        }
        return null
    }

    registers["appendValues"] = function (old, value)
    {
        var last

        if (!old)
        {
            return registers.cloneValue(value)
        }
        old = registers.cloneValue(old)
        value = registers.cloneValue(value)
        if (value.linewise)
        {
            old.lines = old.lines.concat(value.lines)
        }
        else
        {
            last = old.lines.length - 1
            old.lines[last] = old.lines[last] + value.lines[0]
            old.lines = old.lines.concat(value.lines.slice(1))
        }
        old.keys = null
        return old
    }

    registers.prototype["macroTarget"] = function (name)
    {
        var target

        target = registers.target(name)
        if (!target)
        {
            return null
        }
        if (!(_k_.in(target.name,'abcdefghijklmnopqrstuvwxyz')))
        {
            return null
        }
        return target
    }

    registers.prototype["read"] = function (name)
    {
        var target

        target = registers.target(name)
        if (!target)
        {
            return null
        }
        if (target.name === '_')
        {
            return null
        }
        if (_k_.in(target.name,['+','*']))
        {
            return this.readClipboard()
        }
        return registers.cloneValue(this.values[target.name])
    }

    registers.prototype["write"] = function (name, value, operation = 'yank')
    {
        var appended, target

        target = registers.target(name)
        if (!target)
        {
            return null
        }
        if (target.name === '_')
        {
            return null
        }
        value = registers.cloneValue(value)
        if (!value)
        {
            return null
        }
        this.values['"'] = value
        if (operation === 'yank')
        {
            if (target.name === '"')
            {
                this.values['0'] = registers.cloneValue(value)
            }
        }
        else if (_k_.in(operation,['delete','change']))
        {
            this.shiftNumbered(value)
            if (!value.linewise && value.lines.length <= 1)
            {
                this.values['-'] = registers.cloneValue(value)
            }
        }
        if (_k_.in(target.name,['+','*']))
        {
            this.writeClipboard(value)
        }
        else if (target.name === '"')
        {
        }
        else if (target.append)
        {
            appended = registers.appendValues(this.values[target.name],value)
            this.values[target.name] = appended
        }
        else
        {
            this.values[target.name] = registers.cloneValue(value)
        }
        return registers.cloneValue(this.values['"'])
    }

    registers.prototype["set"] = function (name, value)
    {
        var target

        target = registers.target(name)
        if (!target)
        {
            return false
        }
        if (target.name === '_')
        {
            return false
        }
        this.values[target.name] = registers.cloneValue(value)
        return true
    }

    registers.prototype["setMacro"] = function (name, keys)
    {
        var old, target

        target = this.macroTarget(name)
        if (!target)
        {
            return false
        }
        keys = keys.map(function (event)
        {
            return {key:event.key,combo:event.combo,char:event.char}
        })
        if (target.append && this.values[target.name])
        {
            old = this.values[target.name]
            if (old.keys)
            {
                keys = old.keys.concat(keys)
            }
            else
            {
                keys = registers.keysForText(registers.textForValue(old)).concat(keys)
            }
        }
        this.values[target.name] = {lines:registers.textForKeys(keys).split('\n'),linewise:false,keys:keys}
        return true
    }

    registers.prototype["shiftNumbered"] = function (value)
    {
        var i, source

        for (i = 9; i >= 2; i--)
        {
            source = this.values[`${i - 1}`]
            if (source)
            {
                this.values[`${i}`] = registers.cloneValue(source)
            }
            else
            {
                delete this.values[`${i}`]
            }
        }
        return this.values['1'] = registers.cloneValue(value)
    }

    registers.prototype["readClipboard"] = function ()
    {
        var text

        text = (clip.detect() === 'none' ? clip.text : clip.paste())
        return registers.recordForText(text)
    }

    registers.prototype["writeClipboard"] = function (value)
    {
        var text

        text = registers.textForValue(value)
        if (clip.detect() === 'none')
        {
            return clip.text = text
        }
        else
        {
            return clip.copy(text)
        }
    }

    return registers
})()

export default registers;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvcmVnaXN0ZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUFnQixXQUFOOzs7QUFDVCxhQUFEOzthQUVJOztRQUNJLEtBQUM7OztJQUVMLFdBQUMseUJBQVk7Ozs7YUFFSzs7bUJBQVo7O1FBRUYsVUFDSSwwQkFBWSxNQUFNLGlDQUNsQixtQkFBVSxNQUFNLDhCQUFXO1lBRTVCLE1BQU07O1lBQ0wsT0FBTyxPQUFPLE1BQU0sS0FBSyxjQUFLOzt3QkFDeEIsSUFBSyxNQUFNLElBQUssTUFBTyxNQUFNLE1BQU8sS0FBTSxNQUFNOzs7ZUFFMUQ7OztJQUVKLFdBQUMsMkJBQWM7Ozs7YUFFQzs7bUJBQVY7O1FBRUYsT0FBTyxNQUFNLE1BQU0sS0FBSztZQUNSLE1BQU07O1lBQXRCLFFBQVE7O2VBRVI7OztJQUVKLFdBQUMsNEJBQWU7Ozs7c0JBRUk7O21CQUFkOztRQUVGLFdBQVcsS0FBSyxTQUFTO1FBQ3pCLFFBQVcsS0FBSyxNQUFNO1lBRVA7O1lBQWYsTUFBTTs7Z0JBRUosTUFBTyxNQUFPLFNBQVU7OztJQUU5QixXQUFDLDhCQUFpQjs7Z0JBRVAsS0FBSzs7aUJBQ1I7aUJBQU07d0JBQW1CLElBQUssTUFBWSxNQUFPLE1BQVksS0FBTTs7aUJBQ25FO2lCQUFLO3dCQUFvQixJQUFLLFNBQVksTUFBTyxTQUFZLEtBQU07O2lCQUNuRTt3QkFBeUIsSUFBSyxNQUFZLE1BQU8sTUFBWSxLQUFNOztpQkFDbkU7d0JBQXlCLElBQUssUUFBWSxNQUFPLFFBQVksS0FBTTs7aUJBQ25FO2lCQUFLO3dCQUFvQixJQUFLLFlBQVksTUFBTyxZQUFZLEtBQU07Ozs7ZUFFdkU7OztJQUVKLFdBQUMsMEJBQWE7Ozs7UUFFVjtRQUNBLElBQU87ZUFFRCxJQUFJLEtBQUs7O1lBRVgsS0FBSyxLQUFLO2dCQUVQLE9BQU07O2dCQUNMLFFBQVEsS0FBSyxRQUFRLElBQUksSUFBRTtvQkFDeEIsUUFBUTs7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/register.kode
