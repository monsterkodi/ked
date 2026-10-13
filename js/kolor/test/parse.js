var toExport = {}
var b, ext, lang, parse

import kolor from "../kolor.js"

ext = 'coffee'

lang = function (l)
{
    return ext = l
}

parse = function (c, e)
{
    return kolor.parse(c.split('\n'),(e != null ? e : ext))
}
toExport["parse"] = function ()
{
    section("comment", function ()
    {
        lang('coffee')
        compare(parse("##"),[{chunks:[{start:0,length:1,match:"#",turd:"##",clss:'punct comment'},{start:1,length:1,match:"#",clss:'comment'}],chars:2,index:0,number:1,ext:'coffee'}])
        compare(parse(",#a"),[{chunks:[{start:0,length:1,match:",",turd:",#",clss:'punct minor'},{start:1,length:1,match:"#",clss:'punct comment'},{start:2,length:1,match:"a",clss:'comment'}],chars:3,index:0,number:1,ext:'coffee'}])
    })
    section("function", function ()
    {
        compare(parse('->'),[{chunks:[{start:0,length:1,match:'-',turd:'->',clss:'punct function tail'},{start:1,length:1,match:'>',clss:'punct function head'}],chars:2,index:0,number:1,ext:'coffee'}])
        compare(parse('=>'),[{chunks:[{start:0,length:1,match:'=',turd:'=>',clss:'punct function bound tail'},{start:1,length:1,match:'>',clss:'punct function bound head'}],chars:2,index:0,number:1,ext:'coffee'}])
        compare(parse('f=->1'),[{chunks:[{start:0,length:1,match:'f',clss:'function'},{start:1,length:1,match:'=',turd:'=->',clss:'punct function'},{start:2,length:1,match:'-',turd:'->',clss:'punct function tail'},{start:3,length:1,match:'>',clss:'punct function head'},{start:4,length:1,match:'1',clss:'number'}],chars:5,index:0,number:1,ext:'coffee'}])
    })
    section("minimal", function ()
    {
        compare(parse('1'),[{chunks:[{start:0,length:1,match:'1',clss:'number'}],chars:1,index:0,number:1,ext:'coffee'}])
        compare(parse('a'),[{chunks:[{start:0,length:1,match:'a',clss:'text'}],chars:1,index:0,number:1,ext:'coffee'}])
        compare(parse('.'),[{chunks:[{start:0,length:1,match:'.',clss:'punct'}],chars:1,index:0,number:1,ext:'coffee'}])
        compare(parse('1.a'),[{chunks:[{start:0,length:1,match:'1',clss:'number'},{start:1,length:1,match:'.',clss:'punct property'},{start:2,length:1,match:'a',clss:'property'}],chars:3,index:0,number:1,ext:'coffee'}])
        compare(parse('++a'),[{chunks:[{start:0,length:1,match:'+',turd:'++',clss:'punct'},{start:1,length:1,match:'+',clss:'punct'},{start:2,length:1,match:'a',clss:'text'}],chars:3,index:0,number:1,ext:'coffee'}])
    })
    section("space", function ()
    {
        b = parse("x")
        compare(b[0].chunks[0].start,0)
        b = parse(" xx")
        compare(b[0].chunks[0].start,1)
        b = parse("    xxx")
        compare(b[0].chunks[0].start,4)
        b = parse("    x 1  , ")
        compare(b[0].chunks[0].start,4)
        compare(b[0].chunks[1].start,6)
        compare(b[0].chunks[2].start,9)
    })
    section("globalize", function ()
    {
        section("enable", function ()
        {
            kolor.klor.globalize()
            compare(global['red'],kolor.klor.red)
            compare(global['red']('txt'),kolor.klor.red('txt'))
        })
        section("disable", function ()
        {
            kolor.klor.globalize(false)
            compare(global['red']('txt'),'txt')
            kolor.klor.globalize()
        })
    })
}
toExport["parse"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva29sb3IvdGVzdC9wYXJzZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQVVBLE1BQU07O0FBQ047O1dBQWlCLE1BQU07OztBQUN2Qjs7V0FBbUIsTUFBTSxNQUFRLEVBQUUsTUFBTSxPQUFPLFlBQUEsSUFBSTs7Ozs7O1FBWTVDLEtBQUs7Z0JBRUwsTUFBTSxRQUNVLFNBQ0ssTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksS0FBSyxLQUFLLEtBQUssa0JBQzFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLEtBQUssWUFDbEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSTtnQkFHaEQsTUFBTSxTQUNVLFNBQ0ssTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksS0FBTSxLQUFLLEtBQUssZ0JBQzNDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLEtBQUssa0JBQ2hDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLEtBQUssWUFDbEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSTs7OztnQkFXaEQsTUFBTSxRQUNVLFNBQ0ssTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksS0FBTSxLQUFLLEtBQUssd0JBQzNDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLEtBQUssd0JBRXJDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7Z0JBRTdDLE1BQU0sUUFDVSxTQUNLLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLEtBQU0sS0FBSyxLQUFLLDhCQUMzQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sSUFBSSxLQUFLLDhCQUVyQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO2dCQUU3QyxNQUFNLFdBQ1UsU0FDSyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sSUFBSSxLQUFLLGFBQ2hDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLEtBQUssTUFBTSxLQUFLLG1CQUMzQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sSUFBSSxLQUFLLEtBQUssS0FBSyx3QkFDMUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksS0FBSyx3QkFDaEMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksS0FBSyxXQUVyQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJOzs7O2dCQVc3QyxNQUFNLE9BQVEsU0FBUyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sSUFBSSxLQUFLLFdBQVksTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSTtnQkFDaEcsTUFBTSxPQUFRLFNBQVMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUksS0FBSyxTQUFZLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7Z0JBQ2hHLE1BQU0sT0FBUSxTQUFTLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxJQUFJLEtBQUssVUFBWSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO2dCQUVoRyxNQUFNLFNBQVcsU0FDRixNQUFNLEVBQUcsT0FBTyxFQUFFLE1BQU0sSUFBSSxLQUFLLFdBQ2pDLE1BQU0sRUFBRyxPQUFPLEVBQUUsTUFBTSxJQUFJLEtBQUssbUJBQ2pDLE1BQU0sRUFBRyxPQUFPLEVBQUUsTUFBTSxJQUFJLEtBQUssYUFDL0IsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSTtnQkFFOUMsTUFBTSxTQUFXLFNBQ0YsTUFBTSxFQUFHLE9BQU8sRUFBRSxNQUFNLElBQUksS0FBSyxLQUFLLEtBQUssVUFDM0MsTUFBTSxFQUFHLE9BQU8sRUFBRSxNQUFNLElBQUksS0FBSyxVQUNqQyxNQUFNLEVBQUcsT0FBTyxFQUFFLE1BQU0sSUFBSSxLQUFLLFNBQy9CLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7Ozs7UUFVOUMsSUFBSSxNQUFNO2dCQUNWLEVBQUUsR0FBRyxPQUFPLEdBQUcsTUFBUTtRQUV2QixJQUFJLE1BQU07Z0JBQ1YsRUFBRSxHQUFHLE9BQU8sR0FBRyxNQUFRO1FBRXZCLElBQUksTUFBTTtnQkFDVixFQUFFLEdBQUcsT0FBTyxHQUFHLE1BQVE7UUFFdkIsSUFBSSxNQUFNO2dCQUNWLEVBQUUsR0FBRyxPQUFPLEdBQUcsTUFBUTtnQkFDdkIsRUFBRSxHQUFHLE9BQU8sR0FBRyxNQUFRO2dCQUN2QixFQUFFLEdBQUcsT0FBTyxHQUFHLE1BQVE7Ozs7OztZQVduQixNQUFNLEtBQUs7b0JBQ1gsT0FBTyxPQUFTLE1BQU0sS0FBSztvQkFDM0IsT0FBTyxPQUFPLE9BQVMsTUFBTSxLQUFLLElBQUk7Ozs7WUFHdEMsTUFBTSxLQUFLLFVBQVU7b0JBQ3JCLE9BQU8sT0FBTyxPQUFTO1lBQ3ZCLE1BQU0sS0FBSyJ9
//# sourceURL=kode/kolor/test/parse.kode
