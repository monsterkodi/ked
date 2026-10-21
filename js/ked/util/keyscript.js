var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var keyscript


keyscript = (function ()
{
    function keyscript ()
    {}

    keyscript["keys"] = {'up':'\x1b[A','down':'\x1b[B','right':'\x1b[C','left':'\x1b[D','home':'\x1b[H','end':'\x1b[F','pageup':'\x1b[5~','pagedown':'\x1b[6~','insert':'\x1b[2~','delete':'\x1b[3~','enter':'\r','return':'\r','tab':'\t','esc':'\x1b[27u','space':' ','backspace':'\x7f','f1':'\x1bOP','f2':'\x1bOQ','f3':'\x1bOR','f4':'\x1bOS'}
    keyscript["csi"] = {'up':'A','down':'B','right':'C','left':'D','home':'H','end':'F'}
    keyscript["kitty"] = {'tab':9,'return':13,'enter':13,'esc':27,'space':32,'backspace':127}
    keyscript["modbits"] = {'shift':1,'alt':2,'ctrl':4,'cmd':8,'super':8,'meta':8}
    keyscript["bytes"] = function (word)
    {
        var ch, chars, combo, known

        if (_k_.empty(word))
        {
            return
        }
        if (word.startsWith('\x1b'))
        {
            return word
        }
        if (known = this.keys[word])
        {
            return known
        }
        if (combo = keyscript.combo(word))
        {
            return combo
        }
        chars = ''
        var list = _k_.list(word.split(''))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            ch = list[_a_]
            chars += ch
        }
        return chars
    }

    keyscript["combo"] = function (word)
    {
        var base, c, code, m, mod, part, parts

        parts = word.split('+')
        if (parts.length < 2)
        {
            return
        }
        mod = 0
        var list = _k_.list(parts.slice(0, -1))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            part = list[_a_]
            m = this.modbits[part]
            if (!m)
            {
                return
            }
            mod += m
        }
        base = parts.slice(-1)[0]
        if (_k_.empty(base))
        {
            return
        }
        if (code = this.kitty[base])
        {
            return `\x1b[${code};${mod + 1}u`
        }
        if (c = this.csi[base])
        {
            return `\x1b[1;${mod + 1}${c}`
        }
        if (base.length !== 1)
        {
            return
        }
        code = base.charCodeAt(0)
        if (!code)
        {
            return
        }
        return `\x1b[${code};${mod + 1}u`
    }

    keyscript["script"] = function (text)
    {
        var out, word

        out = ''
        var list = _k_.list(text.split(/\s+/).filter(function (w)
        {
            return w.length
        }))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            word = list[_a_]
            out += keyscript.bytes(word)
        }
        return out
    }

    keyscript["steps"] = function (text)
    {
        var ch, combo, known, out, word

        out = []
        var list = _k_.list(text.split(/\s+/).filter(function (w)
        {
            return w.length
        }))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            word = list[_a_]
            if (known = this.keys[word])
            {
                out.push([word,known])
                continue
            }
            if (combo = keyscript.combo(word))
            {
                out.push([word,combo])
                continue
            }
            if (word.startsWith('\x1b'))
            {
                out.push([word,word])
                continue
            }
            var list1 = _k_.list(word.split(''))
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                ch = list1[_b_]
                out.push([ch,ch])
            }
        }
        return out
    }

    return keyscript
})()

export default keyscript;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5c2NyaXB0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2tleXNjcmlwdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3lCQXFCUSxLQUFhLFNBQ2IsT0FBYSxTQUNiLFFBQWEsU0FDYixPQUFhLFNBQ2IsT0FBYSxTQUNiLE1BQWEsU0FDYixTQUFhLFVBQ2IsV0FBYSxVQUNiLFNBQWEsVUFDYixTQUFhLFVBQ2IsUUFBYSxLQUNiLFNBQWEsS0FDYixNQUFhLEtBQ2IsTUFBYSxXQUNiLFFBQWEsSUFDYixZQUFhLE9BQ2IsS0FBYSxTQUNiLEtBQWEsU0FDYixLQUFhLFNBQ2IsS0FBYTt3QkFLYixLQUFTLElBQ1QsT0FBUyxJQUNULFFBQVMsSUFDVCxPQUFTLElBQ1QsT0FBUyxJQUNULE1BQVM7MEJBS1QsTUFBYSxFQUNiLFNBQWEsR0FDYixRQUFhLEdBQ2IsTUFBYSxHQUNiLFFBQWEsR0FDYixZQUFhOzRCQUtiLFFBQVMsRUFDVCxNQUFTLEVBQ1QsT0FBUyxFQUNULE1BQVMsRUFDVCxRQUFTLEVBQ1QsT0FBUzs7Ozs7c0JBTUc7Ozs7WUFJVCxLQUFLLFdBQVc7O21CQUNaOztZQUVKLFFBQVEsS0FBQyxLQUFLOzttQkFDVjs7WUFFSixRQUFRLFVBQVUsTUFBTTs7bUJBQ3BCOztRQUlQLFFBQVE7NEJBRUUsS0FBSyxNQUFNOzs7O1lBQ2pCLFNBQVM7O2VBRWI7Ozs7Ozs7UUFNQSxRQUFRLEtBQUssTUFBTTtZQUViLE1BQU0sU0FBUzs7OztRQUVyQixNQUFNOzRCQUVNLFlBQU07Ozs7WUFDZCxJQUFJLEtBQUMsUUFBUTtpQkFDSDs7OztZQUNWLE9BQU87O1FBRVgsT0FBTztzQkFFSzs7OztZQUVULE9BQU8sS0FBQyxNQUFNOzsyQkFDRixRQUFRLE1BQUk7O1lBRXhCLElBQUksS0FBQyxJQUFJOzs2QkFDSyxNQUFJLElBQUk7O1lBRW5CLEtBQUssV0FBVTs7OztRQUVyQixPQUFPLEtBQUssV0FBVzthQUViOzs7O3VCQUVGLFFBQVEsTUFBSTs7Ozs7OztRQU1wQixNQUFNOzRCQUVNLEtBQUssTUFBTSxPQUFPOzttQkFBYyxFQUFFOzs7OztZQUMxQyxPQUFPLFVBQVUsTUFBTTs7ZUFDM0I7Ozs7Ozs7UUFVQTs0QkFFWSxLQUFLLE1BQU0sT0FBTzs7bUJBQWMsRUFBRTs7Ozs7Z0JBRXZDLFFBQVEsS0FBQyxLQUFLOztnQkFDYixJQUFJLE1BQU0sS0FBSztnQkFDZjs7Z0JBRUQsUUFBUSxVQUFVLE1BQU07O2dCQUN2QixJQUFJLE1BQU0sS0FBSztnQkFDZjs7Z0JBRUQsS0FBSyxXQUFXOztnQkFDZixJQUFJLE1BQU0sS0FBSztnQkFDZjs7aUNBRU0sS0FBSyxNQUFNOzs7O2dCQUNqQixJQUFJLE1BQU0sR0FBRzs7O2VBRXJCOzs7Ozs7ZUFFRCJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/keyscript.kode
