var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var back, c, cp, ok, rects, sym, symbols, text, trunc, value

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
        compare(sue.sueDecode(''),null)
        compare(sue.sueDecode(sym('!')),null)
        compare(sue.sueDecode(sym('!0001x')),null)
        trunc = sym('!0007{"a":')
        compare(sue.sueDecode(trunc),null)
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
}
toExport["sue"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L3N1ZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztPQUFtQixVQUFQOzs7QUFFWixnQkFBTzs7V0FBVSxNQUFNLEtBQUssT0FBTyxjQUFLOztlQUFNLE9BQU8sY0FBYyxVQUFVLEVBQUUsWUFBWTtPQUFLLEtBQUs7Ozs7OztnQkFNN0YsSUFBSSxTQUFTLElBQUksV0FBVyxFQUFHLEtBQU87Ozs7Z0JBSXRDLElBQUksU0FBUyxJQUFJLFVBQVUsTUFBUTs7OztnQkFJbkMsSUFBSSxTQUFTLGNBQWU7Ozs7UUFJNUIsU0FBUyxHQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksR0FBSSxFQUFHO2dCQUUvQixJQUFJLFVBQVUsSUFBSSxVQUFVLFFBQVU7Ozs7UUFJdEMsU0FBUyxFQUFHLEVBQUUsR0FBSSxTQUFTLEdBQUksSUFBSSxLQUFLLEVBQUc7UUFFM0MsT0FBTyxJQUFJLFVBQVUsSUFBSSxVQUFVO2dCQUVuQyxLQUFLLEVBQUk7Z0JBQ1QsS0FBSyxHQUFLO2dCQUNWLEtBQUssR0FBSyxJQUFJO2dCQUNkLEtBQUssRUFBSTs7OztRQUlULFNBQVMsRUFBRztRQUVaLFVBQVUsSUFBSSxVQUFVO1FBRXhCLEtBQUs7NEJBRUksTUFBTSxLQUFLOzs7WUFBaEI7WUFDQSxLQUFLLEVBQUUsWUFBWTtnQkFDaEIsS0FBSyxXQUFXLEtBQUs7O2dCQUNwQixLQUFLOzs7Z0JBRWIsR0FBSztnQkFDTCxJQUFJLFVBQVUsU0FBVzs7OztnQkFJekIsSUFBSSxVQUFVLElBQWlCO2dCQUMvQixJQUFJLFVBQVUsSUFBSSxNQUFhO2dCQUMvQixJQUFJLFVBQVUsSUFBSSxXQUFhO1FBRS9CLFFBQVEsSUFBSTtnQkFDWixJQUFJLFVBQVUsT0FBUTs7OztRQUl0QixPQUFPLElBQUksTUFBTTtnQkFFakIsS0FBSyxLQUFPO2dCQUNaLEtBQUs7Ozs7UUFJTCxPQUFPLE9BQU8sSUFBSSxXQUFXLEVBQUcsTUFBTTtRQUV0QyxPQUFP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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/sue.kode
