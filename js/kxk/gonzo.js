var _k_ = {last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

var gonzo

import kstr from "./kstr.js"


gonzo = function (str)
{
    var indent, line, lines, lst, stack, top, _49_25_, _55_21_

    lines = str.split('\n')
    stack = [{indent:-1,blck:[]}]
    while (line = lines.shift())
    {
        top = _k_.last(stack)
        indent = 0
        while (line[indent] === ' ')
        {
            indent++
        }
        line = line.slice(indent)
        if (lst = _k_.last(top.blck))
        {
            if (indent > lst.indent)
            {
                lst.blck = ((_49_25_=lst.blck) != null ? _49_25_ : [])
                lst.blck.push({line:line,indent:indent})
                stack.push(lst)
                continue
            }
        }
        if (indent > top.indent)
        {
            top.blck = ((_55_21_=top.blck) != null ? _55_21_ : [])
            top.blck.push({line:line,indent:indent})
            continue
        }
        while (indent <= top.indent && stack.length > 1)
        {
            stack.pop()
            top = _k_.last(stack)
        }
        top.blck.push({line:line,indent:indent})
    }
    return stack[0].blck
}
export default gonzo;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29uem8uanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva3hrL2dvbnpvLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFnQ0E7Ozs7SUFFSSxRQUFRLElBQUksTUFBTTtJQUVsQixVQUFTLE9BQU8sR0FBRztXQUViLE9BQU8sTUFBTTs7UUFFZixlQUFjO1FBQ2QsU0FBUztlQUVILEtBQUssWUFBVzs7WUFBTTs7UUFDNUIsT0FBTyxXQUFLO1lBRVQsZUFBVyxJQUFJOztnQkFDWCxTQUFTLElBQUk7O2dCQUNaLElBQUksaUJBQUosSUFBSTtnQkFDSixJQUFJLEtBQUssTUFBSyxLQUFLLEtBQU0sT0FBTztnQkFDaEMsTUFBTSxLQUFLO2dCQUNYOzs7WUFFTCxTQUFTLElBQUk7O1lBQ1osSUFBSSxpQkFBSixJQUFJO1lBQ0osSUFBSSxLQUFLLE1BQUssS0FBSyxLQUFNLE9BQU87WUFDaEM7O2VBRUUsVUFBVSxJQUFJLFVBQVcsTUFBTSxTQUFTOztZQUMxQyxNQUFNO1lBQ04sZUFBVzs7UUFFZixJQUFJLEtBQUssTUFBSyxLQUFLLEtBQU0sT0FBTzs7V0FFcEMsTUFBTSxHQUFHOztlQUVOIn0=
//# sourceURL=file://kode/kxk/gonzo.kode
