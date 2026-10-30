var _k_ = {isArr: function (o) {return Array.isArray(o)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var filecolors

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash

import kulur from "../../kolor/kulur.js"

import colorspans from "../edit/tool/colorspans.js"


filecolors = (function ()
{
    function filecolors ()
    {}

    filecolors["commentStyle"] = function (path)
    {
        return kulur.commentStyle(slash.ext(path))
    }

    filecolors["empty"] = function ()
    {
        return {fg:[],bg:[]}
    }

    filecolors["validSpans"] = function (spans, count)
    {
        var color, result, span, x1, x2, y

        result = []
        if (!(_k_.isArr(spans)))
        {
            return result
        }
        var list = _k_.list(spans)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            if (!(_k_.isArr(span)) || span.length !== 4)
            {
                continue
            }
            var _b_ = span; x1 = _b_[0]; y = _b_[1]; x2 = _b_[2]; color = _b_[3]

            if (!(_k_.isNum(x1)) || !(_k_.isNum(y)) || !(_k_.isNum(x2)))
            {
                continue
            }
            if (!(_k_.isStr(color)))
            {
                continue
            }
            if (x1 >= x2 || y < 0 || y >= count)
            {
                continue
            }
            if (!color.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/))
            {
                continue
            }
            result.push([x1,y,x2,color])
        }
        return colorspans.normalize(result)
    }

    filecolors["split"] = function (path, text)
    {
        var body, clean, colors, count, data, end, expected, innerEnd, payload, start, style, trailer, validBg, validFg

        style = this.commentStyle(path)
        if (!(style != null))
        {
            return {text:text,colors:this.empty()}
        }
        end = (text.endsWith('\n') ? text.length - 1 : text.length)
        if (end <= 0)
        {
            return {text:text,colors:this.empty()}
        }
        start = text.lastIndexOf('\n',end - 1)
        start += 1
        trailer = text.slice(start, typeof end === 'number' ? end : -1)
        if (trailer.endsWith('\r'))
        {
            trailer = trailer.slice(0, trailer.length - 1)
        }
        if (_k_.empty(trailer))
        {
            return {text:text,colors:this.empty()}
        }
        if (!trailer.startsWith(style.start))
        {
            return {text:text,colors:this.empty()}
        }
        innerEnd = trailer.length
        if (!_k_.empty(style.end))
        {
            innerEnd -= style.end.length
        }
        if (!_k_.empty(style.end) && !trailer.endsWith(style.end))
        {
            return {text:text,colors:this.empty()}
        }
        body = trailer.slice(style.start.length, typeof innerEnd === 'number' ? innerEnd : -1).trim()
        if (!body.startsWith('ked-colors'))
        {
            return {text:text,colors:this.empty()}
        }
        payload = body.slice('ked-colors'.length).trim()
        clean = (start > 0 ? text.slice(0, start - 1) : '')
        data = null
        try
        {
            data = JSON.parse(payload)
        }
        catch (err)
        {
            data = null
        }
        expected = `${kstr.hash(clean)}:${clean.length}`
        count = clean.split('\n').length
        if ((data != null) && data.v === 1 && data.hash === expected)
        {
            validFg = this.validSpans(data.fg,count)
            validBg = this.validSpans(data.bg,count)
            colors = {fg:validFg,bg:validBg}
        }
        else
        {
            colors = this.empty()
        }
        return {text:clean,colors:colors}
    }

    filecolors["join"] = function (path, text, colors)
    {
        var bg, data, fg, style, trailer, _100_23_, _99_23_

        style = this.commentStyle(path)
        if (!(style != null))
        {
            return text
        }
        colors = (colors != null ? colors : this.empty())
        fg = ((_99_23_=colors.fg) != null ? _99_23_ : [])
        bg = ((_100_23_=colors.bg) != null ? _100_23_ : [])
        if (_k_.empty(fg) && _k_.empty(bg))
        {
            return text
        }
        data = {v:1,hash:`${kstr.hash(text)}:${text.length}`,fg:fg,bg:bg}
        trailer = style.start + ' ked-colors ' + JSON.stringify(data)
        if (!_k_.empty(style.end))
        {
            trailer += ' ' + style.end
        }
        return text + '\n' + trailer + '\n'
    }

    return filecolors
})()

export default filecolors;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZWNvbG9ycy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdXRpbC9maWxlY29sb3JzLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FPVSxVQUFBO0lBQVM7SUFBSzs7T0FDTCxZQUFUOztPQUNTLGlCQUFQOzs7QUFFSCxjQUFUOzs7OztJQUVJLFlBQUMsMkJBQWM7O2VBQVEsTUFBTSxhQUFhLE1BQU0sSUFBSTs7O0lBRXBELFlBQUM7O2dCQUFVLE1BQU87OztJQUVsQixZQUFDLHlCQUFZLE9BQU07Ozs7UUFFZjtjQUUyQixVQUFUOzttQkFBZjs7NEJBRVM7OztZQUFSO2tCQUV5QixVQUFSLFVBQWdCLEtBQUssV0FBVTs7Z0JBQWhEOztzQkFFa0IsTUFBakIsYUFBRyxZQUFFLGFBQUc7O2tCQUVjLFVBQU4sVUFBd0IsVUFBTCxTQUF3QixVQUFOOztnQkFBdEQ7O2tCQUMwQixVQUFUOztnQkFBakI7O2dCQUNZLE1BQU0sTUFBTSxJQUFJLEtBQUssS0FBSzs7Z0JBQXRDOztpQkFDZ0IsTUFBTSxNQUFNOztnQkFBNUI7O1lBRUEsT0FBTyxNQUFNLEdBQUcsRUFBRSxHQUFHOztlQUV6QixXQUFXLFVBQVU7OztJQUV6QixZQUFDLG9CQUFPLE1BQUs7Ozs7UUFFVCxRQUFRLEtBQUMsYUFBYTtjQUVrQjs7b0JBQXBDLEtBQU0sS0FBSyxPQUFRLEtBQUM7O1FBRXhCLE9BQU0sS0FBSyxTQUFTLFFBQVEsS0FBSyxTQUFPLElBQUksS0FBSztZQUNiLE9BQU87O29CQUF2QyxLQUFNLEtBQUssT0FBUSxLQUFDOztRQUV4QixRQUFRLEtBQUssWUFBWSxLQUFLLE1BQUk7UUFDbEMsU0FBUztRQUVULFVBQVUsV0FBSyxjQUFRLG1CQUFBO1lBQ29CLFFBQVEsU0FBUzs7WUFBNUQsVUFBVSxjQUFRLEdBQUksUUFBUSxTQUFPOztzQkFFSzs7b0JBQXRDLEtBQU0sS0FBSyxPQUFRLEtBQUM7O2FBQ2dCLFFBQVEsV0FBVyxNQUFNOztvQkFBN0QsS0FBTSxLQUFLLE9BQVEsS0FBQzs7UUFFeEIsV0FBVyxRQUFRO3VCQUN1QixNQUFNOztZQUFoRCxZQUFZLE1BQU0sSUFBSTs7dUJBRXdCLE1BQU0sU0FBWSxRQUFRLFNBQVMsTUFBTTs7b0JBQW5GLEtBQU0sS0FBSyxPQUFRLEtBQUM7O1FBRXhCLE9BQU8sY0FBUSxNQUFNLE1BQU0sZUFBUyx3QkFBQSxlQUFVO2FBRU4sS0FBSyxXQUFXOztvQkFBcEQsS0FBTSxLQUFLLE9BQVEsS0FBQzs7UUFFeEIsVUFBVSxXQUFLLGFBQWEsUUFBVTtRQUV0QyxTQUFRLFFBQVEsSUFBSSxXQUFLLEdBQUksUUFBTSxLQUFLO1FBRXhDLE9BQU87OztZQUVILE9BQU8sS0FBSyxNQUFNOztlQUNoQjs7WUFDRixPQUFPOztRQUVYLGNBQWMsS0FBSyxLQUFLLFVBQVMsTUFBTTtRQUN2QyxRQUFXLE1BQU0sTUFBTSxNQUFNO2FBRTFCLGlCQUFVLEtBQUssTUFBSyxLQUFNLEtBQUssU0FBUTs7WUFDdEMsVUFBVSxLQUFDLFdBQVcsS0FBSyxHQUFHO1lBQzlCLFVBQVUsS0FBQyxXQUFXLEtBQUssR0FBRztZQUM5QixVQUNJLEdBQUksUUFDSixHQUFJOzs7O1lBRVIsU0FBUyxLQUFDOztnQkFFZCxLQUFNLE1BQ04sT0FBUTs7O0lBRVosWUFBQyxtQkFBTSxNQUFLLE1BQUs7Ozs7UUFFYixRQUFRLEtBQUMsYUFBYTtjQUVQOzttQkFBWjs7UUFFSCxVQUFBLGlCQUFBLFNBQVUsS0FBQztRQUVYLGVBQUssT0FBTztRQUNaLGdCQUFLLE9BQU87c0JBRUssaUJBQWE7O21CQUEzQjs7UUFFSCxRQUNJLEVBQU0sRUFDTixRQUFTLEtBQUssS0FBSyxTQUFRLEtBQUssU0FDaEMsR0FBTSxHQUNOLEdBQU07UUFFVixVQUFVLE1BQU0sUUFBUSxpQkFBaUIsS0FBSyxVQUFVO3VCQUVoQixNQUFNOztZQUE5QyxXQUFXLE1BQU0sTUFBTTs7ZUFFdkIsT0FBTyxPQUFPLFVBQVU7OztXQXRHdkI7OztlQXdHRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/filecolors.kode
