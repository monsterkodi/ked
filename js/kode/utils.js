var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var firstLineCol, lastLineCol, walkFirst, walkLast


walkLast = function (out, e)
{
    var col, line, sub, _22_13_, _25_29_

    if (((e != null ? e.col : undefined) != null))
    {
        line = e.line
        col = e.col + (e.text != null ? e.text.length : undefined)
        if (!out.found || line > out.line || line === out.line && col > out.col)
        {
            out.line = line
            out.col = col
        }
        out.found = true
        return
    }
    if ((e != null) && e instanceof Object)
    {
        var list = _k_.list(Object.values(e))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            sub = list[_a_]
            walkLast(out,sub)
        }
    }
}

lastLineCol = function (e)
{
    var out

    out = {line:-Infinity,col:-Infinity,found:false}
    walkLast(out,e)
    if (!out.found)
    {
        return {line:1,col:0}
    }
    return {line:out.line,col:out.col}
}

walkFirst = function (out, e)
{
    var col, line, sub, _58_13_

    if (((e != null ? e.col : undefined) != null))
    {
        line = e.line
        col = e.col
        if (!out.found || line < out.line || line === out.line && col < out.col)
        {
            out.line = line
            out.col = col
        }
        out.found = true
        return
    }
    if ((e != null) && e instanceof Object)
    {
        var list = _k_.list(Object.values(e))
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            sub = list[_b_]
            walkFirst(out,sub)
        }
    }
}

firstLineCol = function (e)
{
    var out

    out = {line:Infinity,col:Infinity,found:false}
    walkFirst(out,e)
    if (!out.found)
    {
        return {line:Infinity,col:Infinity}
    }
    return {line:out.line,col:out.col}
}
export default {
    firstLineCol:firstLineCol,
    lastLineCol:lastLineCol
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS91dGlscy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQW1CQSxxQkFBWSxLQUFLOzs7O1VBRVYsWUFBQSxFQUFHOztRQUVGLE9BQU8sRUFBRTtRQUNULE1BQU8sRUFBRSxPQUFNLEVBQUUsZUFBRixFQUFFLEtBQU07YUFFaEIsSUFBSSxTQUFTLE9BQU8sSUFBSSxRQUFRLFNBQVEsSUFBSSxRQUFTLE1BQU0sSUFBSTs7WUFDbEUsSUFBSSxPQUFPO1lBQ1gsSUFBSSxNQUFPOztRQUVmLElBQUksUUFBUTs7O1NBR2IsY0FBTyxhQUFLOzs0QkFFQSxPQUFPLE9BQU87OztZQUFyQjtZQUNBLFNBQVMsSUFBSzs7Ozs7QUFFMUIsd0JBQWM7Ozs7SUFFVixPQUFNLEtBQUssVUFBVSxJQUFJLFVBQVUsTUFBTTtJQUV6QyxTQUFTLElBQUs7U0FFUCxJQUFJOztnQkFDTCxLQUFLLEVBQUUsSUFBSTs7WUFFZixLQUFLLElBQUksS0FBSyxJQUFJLElBQUk7OztBQVE1QixzQkFBYSxLQUFLOzs7O1VBRVgsWUFBQSxFQUFHOztRQUVGLE9BQU8sRUFBRTtRQUNULE1BQU8sRUFBRTthQUVGLElBQUksU0FBUyxPQUFPLElBQUksUUFBUSxTQUFRLElBQUksUUFBUyxNQUFNLElBQUk7O1lBQ2xFLElBQUksT0FBTztZQUNYLElBQUksTUFBTzs7UUFFZixJQUFJLFFBQVE7OztTQUdiLGNBQU8sYUFBSzs7NEJBRUEsT0FBTyxPQUFPOzs7WUFBckI7WUFDQSxVQUFVLElBQUs7Ozs7O0FBRTNCLHlCQUFlOzs7O0lBRVgsT0FBTSxLQUFLLFNBQVMsSUFBSSxTQUFTLE1BQU07SUFFdkMsVUFBVSxJQUFLO1NBRVIsSUFBSTs7Z0JBQ0wsS0FBSyxTQUFTLElBQUk7O1lBRXRCLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSTs7O0lBR3hCLGFBQWE7SUFDYixZQUFZIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kode/utils.kode
