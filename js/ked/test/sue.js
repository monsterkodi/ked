var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var areas, back, box, c, cp, cut, lines, ok, ranges, rects, sym, symbols, text, trunc, value

import sue from "../edit/tool/sue.js"


sym = function (ascii)
{
    return Array.from(ascii).map(function (c)
    {
        return String.fromCodePoint(0xE0000 + c.codePointAt(0))
    }).join('')
}
toExport["sue"] = async function ()
{
    await section("a payload is magic, four decimal length digits and a json body", async function ()
    {
        compare(sue.sueAscii(sue.sueEncode({a:1})),'!0007{"a":1}')
    })
    await section("the length reads as the number of body symbols", async function ()
    {
        compare(sue.sueAscii(sue.sueEncode('x')),'!0003"x"')
    })
    await section("sueAscii leaves ordinary text alone", async function ()
    {
        compare(sue.sueAscii('plain text'),'plain text')
    })
    await section("encode and decode round trip a nested value", async function ()
    {
        value = {a:[1,2,[3,4]],b:{c:'x'}}
        compare(sue.sueDecode(sue.sueEncode(value)),value)
    })
    await section("values keep their keys and their types", async function ()
    {
        value = {s:2,fg:16711680,t:['a','b'],n:null}
        back = sue.sueDecode(sue.sueEncode(value))
        compare(back.s,2)
        compare(back.fg,16711680)
        compare(back.t,['a','b'])
        compare(back.n,null)
    })
    await section("the symbols stay inside the alphabet", async function ()
    {
        value = {t:'a b🐈'}
        symbols = sue.sueEncode(value)
        ok = true
        var list = _k_.list(Array.from(symbols))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            cp = c.codePointAt(0)
            if (cp < 0xE0021 || cp > 0xE007E)
            {
                ok = false
            }
        }
        compare(ok,true)
        compare(sue.sueDecode(symbols),value)
    })
    await section("decode rejects a broken or a truncated payload", async function ()
    {
        compare(sue.sueDecode(''),undefined)
        compare(sue.sueDecode(sym('!')),undefined)
        compare(sue.sueDecode(sym('!0001x')),undefined)
        trunc = sym('!0007{"a":')
        compare(sue.sueDecode(trunc),undefined)
    })
    await section("text without payloads is left alone", async function ()
    {
        back = sue.desue('hello world')
        compare(back.text,'hello world')
        compare(back.sue,[])
    })
    await section("a payload is stripped and anchored where the text follows", async function ()
    {
        text = 'ab' + sue.sueEncode({s:2}) + 'cd'
        back = sue.desue(text)
        compare(back.text,'abcd')
        compare(back.sue.length,1)
        compare(back.sue[0].x,2)
        compare(back.sue[0].y,0)
        compare(back.sue[0].value,{s:2})
    })
    await section("a payload at the start of a line anchors at zero", async function ()
    {
        text = sue.sueEncode(1) + 'abc'
        back = sue.desue(text)
        compare(back.text,'abc')
        compare(back.sue[0].x,0)
    })
    await section("a payload at the end of a line anchors at the line length", async function ()
    {
        text = 'abc' + sue.sueEncode(1)
        back = sue.desue(text)
        compare(back.text,'abc')
        compare(back.sue[0].x,3)
    })
    await section("payloads on several lines carry their line", async function ()
    {
        text = 'a' + sue.sueEncode(1) + '\nb' + sue.sueEncode(2)
        back = sue.desue(text)
        compare(back.text,'a\nb')
        compare(back.sue.length,2)
        compare(back.sue[0].y,0)
        compare(back.sue[0].x,1)
        compare(back.sue[1].y,1)
        compare(back.sue[1].x,1)
    })
    await section("adjacent payloads keep their order and share an anchor", async function ()
    {
        text = 'a' + sue.sueEncode(1) + sue.sueEncode(2) + 'b'
        back = sue.desue(text)
        compare(back.text,'ab')
        compare(back.sue.length,2)
        compare(back.sue[0].x,1)
        compare(back.sue[1].x,1)
        compare(back.sue[0].value,1)
        compare(back.sue[1].value,2)
    })
    await section("a payload between graphemes does not split them", async function ()
    {
        text = 'café' + sue.sueEncode(1) + '漢字'
        back = sue.desue(text)
        compare(back.text,'café漢字')
        compare(back.sue[0].x,4)
    })
    await section("a broken payload is dropped and its symbols are removed", async function ()
    {
        text = 'a' + sym('!0001x') + 'b'
        back = sue.desue(text)
        compare(back.text,'ab')
        compare(back.sue,[])
    })
    await section("no payloads means no change", async function ()
    {
        compare(sue.ensue('abc',[]),'abc')
    })
    await section("desue and ensue round trip", async function ()
    {
        text = 'ab' + sue.sueEncode({s:2}) + 'cd'
        back = sue.desue(text)
        compare(sue.ensue(back.text,back.sue),text)
    })
    await section("two payloads at the same anchor keep their order", async function ()
    {
        rects = [{x:1,y:0,value:1},{x:1,y:0,value:2}]
        compare(sue.ensue('ab',rects),'a' + sue.sueEncode(1) + sue.sueEncode(2) + 'b')
    })
    await section("a payload at the end of a line", async function ()
    {
        rects = [{x:2,y:0,value:1}]
        compare(sue.ensue('ab',rects),'ab' + sue.sueEncode(1))
    })
    await section("a payload on a later line", async function ()
    {
        rects = [{x:1,y:1,value:1}]
        compare(sue.ensue('a\nb',rects),'a\nb' + sue.sueEncode(1))
    })
    await section("non ascii text keeps its graphemes", async function ()
    {
        text = 'café' + sue.sueEncode(1) + '漢字'
        back = sue.desue(text)
        compare(sue.ensue(back.text,back.sue),text)
    })
    await section("several lines with several payloads round trip", async function ()
    {
        text = sue.sueEncode(1) + 'one' + sue.sueEncode(2) + '\ntwo' + sue.sueEncode(3) + '\n' + sue.sueEncode(4)
        back = sue.desue(text)
        compare(back.text,'one\ntwo\n')
        compare(back.sue.length,4)
        compare(sue.ensue(back.text,back.sue),text)
    })
    await section("an empty text with a payload at zero", async function ()
    {
        rects = [{x:0,y:0,value:1}]
        compare(sue.ensue('',rects),sue.sueEncode(1))
    })
    await section("a value is code, width, height and data", async function ()
    {
        compare(sue.sueDecode(sue.sueEncode([31,8,1,'#f00'])),[31,8,1,'#f00'])
    })
    await section("a box reads its geometry from the value", async function ()
    {
        lines = [['a','b','c','d','e']]
        compare(sue.boxForAreaAndLines({x:1,y:0,value:[31,2,1,'#f00']},lines),{x:1,y:0,w:2,h:1,values:['#f00'],open:false})
    })
    await section("a negative width reaches to the end of the line", async function ()
    {
        lines = [['a','b','c','d','e']]
        box = sue.boxForAreaAndLines({x:1,y:0,value:[31,-1,1,'#f00']},lines)
        compare(box.w,4)
        compare(box.h,1)
        compare(box.open,true)
    })
    await section("a mark has no box", async function ()
    {
        lines = [['a','b','c','d','e']]
        compare(sue.boxForAreaAndLines({x:1,y:0,value:[41,-1,1,3]},lines),undefined)
    })
    await section("a value without geometry has no box", async function ()
    {
        lines = [['a','b','c','d','e']]
        compare(sue.boxForAreaAndLines({x:1,y:0,value:[31,['#f00',8,1]]},lines),undefined)
    })
    await section("a range cuts an area in two", async function ()
    {
        lines = [['a','b','c','d','e','f','g','h']]
        areas = [{x:0,y:0,value:[31,8,1,'#f00']}]
        ranges = [[3,0,6,0]]
        cut = sue.rangesCutFromAreasInLines(ranges,areas,lines)
        compare(cut.length,2)
        compare(cut[0],{x:0,y:0,value:[31,3,1,'#f00']})
        compare(cut[1],{x:6,y:0,value:[31,2,1,'#f00']})
    })
    await section("a range removes an area it covers", async function ()
    {
        lines = [['a','b','c']]
        areas = [{x:0,y:0,value:[31,3,1,'#f00']}]
        ranges = [[0,0,3,0]]
        compare(sue.rangesCutFromAreasInLines(ranges,areas,lines),[])
    })
    await section("a cut keeps the end of line of an open area", async function ()
    {
        lines = [['a','b','c','d','e','f']]
        areas = [{x:2,y:0,value:[32,-1,1,'#00f']}]
        ranges = [[0,0,4,0]]
        cut = sue.rangesCutFromAreasInLines(ranges,areas,lines)
        compare(cut,[{x:4,y:0,value:[32,-1,1,'#00f']}])
    })
    await section("a mark is never cut", async function ()
    {
        lines = [['a','b','c','d','e','f','g','h','i','j']]
        areas = [{x:0,y:0,value:[41,-1,1,7]}]
        ranges = [[0,0,10,0]]
        compare(sue.rangesCutFromAreasInLines(ranges,areas,lines),areas)
    })
    await section("a scale run needs its markers", async function ()
    {
        lines = [['a','b','c','d','e','f']]
        areas = [{x:1,y:0,value:[41,-1,1,3]},{x:4,y:0,value:[99,-1,1,41]}]
        compare(sue.runsForLine(areas,lines,0),[[1,4,3]])
    })
    await section("a run without a close reaches the end of the line", async function ()
    {
        lines = [['a','b','c','d','e','f']]
        areas = [{x:1,y:0,value:[41,-1,1,2]}]
        compare(sue.runsForLine(areas,lines,0),[[1,6,2]])
    })
    await section("a close without an open is ignored", async function ()
    {
        lines = [['a','b','c']]
        areas = [{x:2,y:0,value:[99,-1,1,41]}]
        compare(sue.runsForLine(areas,lines,0),[])
    })
    await section("an open inside an open is ignored", async function ()
    {
        lines = [['a','b','c','d','e']]
        areas = [{x:1,y:0,value:[41,-1,1,2]},{x:2,y:0,value:[41,-1,1,3]},{x:4,y:0,value:[99,-1,1,41]}]
        compare(sue.runsForLine(areas,lines,0),[[1,4,2]])
    })
    await section("cell positions follow the runs", async function ()
    {
        lines = [['a','a',' ','b','b']]
        compare(sue.cellPositionsForLine(lines,0,[]),[0,1,2,3,4,5])
        compare(sue.cellPositionsForLine(lines,0,[[0,2,3]]),[0,3,6,7,8,9])
        compare(sue.cellPositionsForLine(lines,0,[[2,4,2]]),[0,1,2,4,6,7])
    })
    await section("cell positions count the width of wide graphemes", async function ()
    {
        lines = [['漢','a','b']]
        compare(sue.cellPositionsForLine(lines,0,[]),[0,2,3,4])
    })
    await section("style values keep the flags and the underline colour apart", async function ()
    {
        compare(sue.styleOfValues(['u']),['u',null])
        compare(sue.styleOfValues(['#ff0','u']),['u','#ff0'])
    })
    await section("stacked style areas join their flags and keep the underline colour", async function ()
    {
        lines = [['a','b','c','d']]
        areas = [{x:0,y:0,value:[34,2,1,'b']},{x:2,y:0,value:[34,2,1,'#ff0','u']},{x:0,y:0,value:[34,4,1,'s']}]
        compare(sue.styleFlagsAt(areas,lines,0,0),['bs',null])
        compare(sue.styleFlagsAt(areas,lines,3,0),['us','#ff0'])
    })
    await section("toggling a flag keeps the underline colour", async function ()
    {
        lines = [['a','b','c']]
        areas = [{x:0,y:0,value:[34,3,1,'#ff0','u']}]
        ranges = [[0,0,3,0]]
        compare(sue.rangesWithToggledFlag(ranges,areas,lines,'b'),[{x:0,y:0,value:[34,3,1,'#ff0','ub']}])
    })
}
toExport["sue"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L3N1ZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztPQUFtQixVQUFQOzs7QUFFWixnQkFBTzs7V0FBVSxNQUFNLEtBQUssT0FBTyxjQUFLOztlQUFNLE9BQU8sY0FBYyxVQUFVLEVBQUUsWUFBWTtPQUFLLEtBQUs7Ozs7OztRQU16RCxRQUFwQyxJQUFJLFNBQVMsSUFBSSxXQUFXLEVBQUcsS0FBTzs7OztRQUlMLFFBQWpDLElBQUksU0FBUyxJQUFJLFVBQVUsTUFBUTs7OztRQUlULFFBQTFCLElBQUksU0FBUyxjQUFlOzs7O1FBSTVCLFNBQVMsR0FBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEdBQUksRUFBRztRQUVLLFFBQXBDLElBQUksVUFBVSxJQUFJLFVBQVUsUUFBVTs7OztRQUl0QyxTQUFTLEVBQUcsRUFBRSxHQUFJLFNBQVMsR0FBSSxJQUFJLEtBQUssRUFBRztRQUUzQyxPQUFPLElBQUksVUFBVSxJQUFJLFVBQVU7UUFFNUIsUUFBUCxLQUFLLEVBQUk7UUFDRCxRQUFSLEtBQUssR0FBSztRQUNILFFBQVAsS0FBSyxHQUFLLElBQUk7UUFDUCxRQUFQLEtBQUssRUFBSTs7OztRQUlULFNBQVMsRUFBRztRQUVaLFVBQVUsSUFBSSxVQUFVO1FBRXhCLEtBQUs7NEJBRUksTUFBTSxLQUFLOzs7WUFBaEI7WUFDQSxLQUFLLEVBQUUsWUFBWTtnQkFDaEIsS0FBSyxXQUFXLEtBQUs7O2dCQUNwQixLQUFLOzs7UUFFVixRQUFILEdBQUs7UUFDa0IsUUFBdkIsSUFBSSxVQUFVLFNBQVc7Ozs7UUFJSSxRQUE3QixJQUFJLFVBQVUsSUFBaUI7UUFDRixRQUE3QixJQUFJLFVBQVUsSUFBSSxNQUFhO1FBQ0YsUUFBN0IsSUFBSSxVQUFVLElBQUksV0FBYTtRQUUvQixRQUFRLElBQUk7UUFDUSxRQUFwQixJQUFJLFVBQVUsT0FBUTs7OztRQUl0QixPQUFPLElBQUksTUFBTTtRQUVQLFFBQVYsS0FBSyxL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
//# sourceURL=../../../kode/ked/test/sue.kode
