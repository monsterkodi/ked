var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var firstLineCol, lastLineCol, walkFirst, walkLast


walkLast = function (out, e)
{
    var col, line, sub, _17_13_, _20_29_

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
    var col, line, sub, _53_13_

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS91dGlscy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQWNBLHFCQUFZLEtBQUs7Ozs7VUFFVixZQUFBLEVBQUc7O1FBRUYsT0FBTyxFQUFFO1FBQ1QsTUFBTyxFQUFFLE9BQU0sRUFBRSxlQUFGLEVBQUUsS0FBTTthQUVoQixJQUFJLFNBQVMsT0FBTyxJQUFJLFFBQVEsU0FBUSxJQUFJLFFBQVMsTUFBTSxJQUFJOztZQUNsRSxJQUFJLE9BQU87WUFDWCxJQUFJLE1BQU87O1FBRWYsSUFBSSxRQUFROzs7U0FHYixjQUFPLGFBQUs7OzRCQUVBLE9BQU8sT0FBTzs7O1lBQXJCO1lBQ0EsU0FBUyxJQUFLOzs7OztBQUUxQix3QkFBYzs7OztJQUVWLE9BQU0sS0FBSyxVQUFVLElBQUksVUFBVSxNQUFNO0lBRXpDLFNBQVMsSUFBSztTQUVQLElBQUk7O2dCQUNMLEtBQUssRUFBRSxJQUFJOztZQUVmLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSTs7O0FBUTVCLHNCQUFhLEtBQUs7Ozs7VUFFWCxZQUFBLEVBQUc7O1FBRUYsT0FBTyxFQUFFO1FBQ1QsTUFBTyxFQUFFO2FBRUYsSUFBSSxTQUFTLE9BQU8sSUFBSSxRQUFRLFNBQVEsSUFBSSxRQUFTLE1BQU0sSUFBSTs7WUFDbEUsSUFBSSxPQUFPO1lBQ1gsSUFBSSxNQUFPOztRQUVmLElBQUksUUFBUTs7O1NBR2IsY0FBTyxhQUFLOzs0QkFFQSxPQUFPLE9BQU87OztZQUFyQjtZQUNBLFVBQVUsSUFBSzs7Ozs7QUFFM0IseUJBQWU7Ozs7SUFFWCxPQUFNLEtBQUssU0FBUyxJQUFJLFNBQVMsTUFBTTtJQUV2QyxVQUFVLElBQUs7U0FFUixJQUFJOztnQkFDTCxLQUFLLFNBQVMsSUFBSTs7WUFFdEIsS0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJOzs7SUFHeEIsYUFBYTtJQUNiLFlBQVkifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kode/utils.kode
