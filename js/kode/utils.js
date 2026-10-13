var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var firstLineCol, lastLineCol


lastLineCol = function (e)
{
    var cols, _17_13_, _18_38_

    if (((e != null ? e.col : undefined) != null))
    {
        return {line:e.line,col:e.col + (e.text != null ? e.text.length : undefined)}
    }
    else if ((e != null) && e instanceof Object)
    {
        cols = Object.values(e).map(lastLineCol)
        if (!_k_.empty(cols))
        {
            return cols.reduce(function (a, b)
            {
                if (a.line > b.line)
                {
                    return a
                }
                else if (a.line === b.line)
                {
                    if (a.col > b.col)
                    {
                        return a
                    }
                    else
                    {
                        return b
                    }
                }
                else
                {
                    return b
                }
            })
        }
    }
    return {line:1,col:0}
}

firstLineCol = function (e)
{
    var cols, _38_13_

    if (((e != null ? e.col : undefined) != null))
    {
        return {line:e.line,col:e.col}
    }
    else if ((e != null) && e instanceof Object)
    {
        cols = Object.values(e).map(firstLineCol)
        if (!_k_.empty(cols))
        {
            return cols.reduce(function (a, b)
            {
                if (a.line < b.line)
                {
                    return a
                }
                else if (a.line === b.line)
                {
                    if (a.col < b.col)
                    {
                        return a
                    }
                    else
                    {
                        return b
                    }
                }
                else
                {
                    return b
                }
            })
        }
    }
    return {line:Infinity,col:Infinity}
}
export default {
    firstLineCol:firstLineCol,
    lastLineCol:lastLineCol
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS91dGlscy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQWNBOzs7O1VBRU8sWUFBQSxFQUFHOztnQkFDQSxLQUFLLEVBQUUsS0FBSyxJQUFJLEVBQUUsT0FBSSxFQUFFLGVBQUYsRUFBRSxLQUFNOztjQUM1QixjQUFPLGFBQUs7O1FBQ2hCLE9BQU8sT0FBTyxPQUFPLEdBQUcsSUFBSTt1QkFDbkI7O21CQUNFLEtBQUs7O29CQUNMLEVBQUUsT0FBTyxFQUFFOzsyQkFBVTs7eUJBQ2hCLEVBQUUsU0FBUSxFQUFFOzt3QkFDYixFQUFFLE1BQU0sRUFBRTs7K0JBQVM7Ozs7K0JBQU87Ozs7OzJCQUM1Qjs7Ozs7WUFDakIsS0FBSyxFQUNMLElBQUs7OztBQVFUOzs7O1VBRU8sWUFBQSxFQUFHOztnQkFDQSxLQUFLLEVBQUUsS0FBSyxJQUFJLEVBQUU7O2NBQ2hCLGNBQU8sYUFBSzs7UUFDaEIsT0FBTyxPQUFPLE9BQU8sR0FBRyxJQUFJO3VCQUNuQjs7bUJBQ0gsS0FBSzs7b0JBQ0EsRUFBRSxPQUFPLEVBQUU7OzJCQUFVOzt5QkFDaEIsRUFBRSxTQUFRLEVBQUU7O3dCQUNiLEVBQUUsTUFBTSxFQUFFOzsrQkFBUzs7OzsrQkFBTzs7Ozs7MkJBQzVCOzs7OztZQUNqQixLQUFLLFNBQ0wsSUFBSzs7O0lBR0wsYUFBYTtJQUNiLFlBQVkifQ==
//# sourceURL=kode/kode/utils.kode
