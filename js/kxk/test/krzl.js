var toExport = {}
var k

import krzl from "../krzl.js"
import slash from "../slash.js"

toExport["krzl"] = async function ()
{
    await section("strings", async function ()
    {
        k = new krzl(['hello','world'])
        compare(k.filter(),[])
        compare(k.filter(''),[])
        compare(k.filter('✘'),[])
        compare(k.filter('h'),['hello'])
        compare(k.filter('w'),['world'])
        compare(k.filter('l'),['hello','world'])
        compare(k.filter('ll'),['hello'])
        compare(k.filter('o'),['world','hello'])
    })
    await section("extract", async function ()
    {
        k = new krzl([{key:'hello'},{key:'world',evil:666}])
        k.extract = function (i)
        {
            return i.key
        }
        compare(k.filter('✘'),[])
        compare(k.filter('h'),[{key:'hello'}])
        compare(k.filter('w'),[{key:'world',evil:666}])
        compare(k.filter('l'),[{key:'hello'},{key:'world',evil:666}])
        compare(k.filter('ll'),[{key:'hello'}])
        compare(k.filter('o'),[{key:'world',evil:666},{key:'hello'}])
    })
    await section("weight", async function ()
    {
        k = new krzl(['bba','aa','a','aba','acccca','aaa','akkaakka'])
        compare(k.filter('a'),['a','aa','aba','aaa','acccca','akkaakka','bba'])
        compare(k.filter('b'),['bba','aba'])
        compare(k.filter('aa'),['aa','aba','aaa','acccca','akkaakka'])
    })
    await section("custom", async function ()
    {
        k = new krzl(['a.txt','a.a','a','a.noon','a.kode'])
        compare(k.filter('a'),['a','a.a','a.txt','a.noon','a.kode'])
        k.weight = function (i)
        {
            switch (slash.ext(i))
            {
                case 'kode':
                    return 1

                case 'noon':
                    return 0.5

                default:
                    return 0
            }

        }
        compare(k.filter('a'),['a','a.kode','a.noon','a.a','a.txt'])
        k.weight = function (i)
        {
            switch (slash.ext(i))
            {
                case 'kode':
                    return 100

                case 'noon':
                    return 50

                default:
                    return 1
            }

        }
        compare(k.filter('a'),['a','a.kode','a.noon','a.a','a.txt'])
        k.weight = function (i)
        {
            switch (slash.ext(i))
            {
                case 'kode':
                    return 10

                case 'noon':
                    return 0.5

                default:
                    return 0.1
            }

        }
        compare(k.filter('a'),['a','a.kode','a.noon','a.a','a.txt'])
    })
    await section("negative", async function ()
    {
        k = new krzl(['a.txt','a.aaa','a.blork','a.noon','a.kode'])
        k.weight = function (i)
        {
            switch (slash.ext(i))
            {
                case 'noon':
                    return -1

                case 'txt':
                    return -100000

                case 'blork':
                    return -666

                default:
                    return 'dafuk'
            }

        }
        compare(k.filter('a'),['a.txt','a.aaa','a.noon','a.kode','a.blork'])
    })
    await section("case insensitive", async function ()
    {
        k = new krzl(['a','aA','Aa','A','BaBa','bABA'])
        compare(k.filter('a'),['a','A','aA','Aa','BaBa','bABA'])
        compare(k.filter('A'),['a','A','aA','Aa','BaBa','bABA'])
        compare(k.filter('b'),['BaBa','bABA'])
        compare(k.filter('B'),['BaBa','bABA'])
    })
    await section("length insensitive", async function ()
    {
        k = new krzl({values:['a','aA','Aa','A','BaBa','bABA'],sortByLength:false})
        compare(k.filter('a'),['a','aA','Aa','A','BaBa','bABA'])
    })
}
toExport["krzl"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3J6bC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC9rcnpsLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNTLFdBQUE7T0FBSyxZQUFBOzs7Ozs7UUFNTixRQUFRLE1BQVcsUUFBUTtRQUVYLFFBQWhCLEVBQUU7UUFDYyxRQUFoQixFQUFFLE9BQU87UUFDTyxRQUFoQixFQUFFLE9BQU87UUFDTyxRQUFoQixFQUFFLE9BQU8sTUFBVTtRQUNILFFBQWhCLEVBQUUsT0FBTyxNQUFVO1FBQ0gsUUFBaEIsRUFBRSxPQUFPLE1BQVUsUUFBUTtRQUNYLFFBQWhCLEVBQUUsT0FBTyxPQUFVO1FBQ0gsUUFBaEIsRUFBRSxPQUFPLE1BQVUsUUFBUTs7OztRQUkzQixRQUFRLE9BQVksSUFBSSxVQUFXLElBQUksUUFBUSxLQUFLO1FBQ3BELEVBQUUsb0JBQVc7O21CQUFNLEVBQUU7O1FBRUwsUUFBaEIsRUFBRSxPQUFPO1FBQ08sUUFBaEIsRUFBRSxPQUFPLE9BQVUsSUFBSTtRQUNQLFFBQWhCLEVBQUUsT0FBTyxPQUFVLElBQUksUUFBUSxLQUFLO1FBQ3BCLFFBQWhCLEVBQUUsT0FBTyxPQUFXLElBQUksVUFBVSxJQUFJLFFBQVEsS0FBSztRQUNuQyxRQUFoQixFQUFFLE9BQU8sUUFBVSxJQUFJO1FBQ1AsUUFBaEIsRUFBRSxPQUFPLE9BQVcsSUFBSSxRQUFRLEtBQUssTUFBTSxJQUFJOzs7O1FBSS9DLFFBQVEsTUFBVyxNQUFNLEtBQU0sSUFBSSxNQUFNLFNBQVMsTUFBTTtRQUN4QyxRQUFoQixFQUFFLE9BQU8sTUFBVSxJQUFJLEtBQUssTUFBTSxNQUFNLFNBQVMsV0FBVztRQUM1QyxRQUFoQixFQUFFLE9BQU8sTUFBVSxNQUFNO1FBQ1QsUUFBaEIsRUFBRSxPQUFPLE9BQVUsS0FBSyxNQUFNLE1BQU0sU0FBUzs7OztRQUk3QyxRQUFRLE1BQVcsUUFBUSxNQUFNLElBQUksU0FBUztRQUM5QixRQUFoQixFQUFFLE9BQU8sTUFBVSxJQUFJLE1BQU0sUUFBUSxTQUFTO1FBRTlDLEVBQUUsbUJBQVU7O29CQUNELE1BQU0sSUFBSTs7cUJBQ2I7MkJBQVM7O3FCQUNUOzJCQUFTOzs7MkJBQ0E7Ozs7UUFFRCxRQUFoQixFQUFFLE9BQU8sTUFBVSxJQUFJLFNBQVMsU0FBUyxNQUFNO1FBRS9DLEVBQUUsbUJBQVU7O29CQUNELE1BQU0sSUFBSTs7cUJBQ2I7MkJBQVM7O3FCQUNUOzJCQUFTOzs7MkJBQ0E7Ozs7UUFFRCxRQUFoQixFQUFFLE9BQU8sTUFBVSxJQUFJLFNBQVMsU0FBUyxNQUFNO1FBRS9DLEVBQUUsbUJBQVU7O29CQUNELE1BQU0sSUFBSTs7cUJBQ2I7MkJBQVM7O3FCQUNUOzJCQUFTOzs7MkJBQ0E7Ozs7UUFFRCxRQUFoQixFQUFFLE9BQU8sTUFBVSxJQUFJLFNBQVMsU0FBUyxNQUFNOzs7O1FBSS9DLFFBQVEsTUFBVyxRQUFRLFFBQVEsVUFBVSxTQUFTO1FBRXRELEVBQUUsbUJBQVU7O29CQUNELE1BQU0sSUFBSTs7cUJBQ2I7MkJBQVU7O3FCQUNWOzJCQUFVOztxQkFDVjsyQkFBVTs7OzJCQUNBOzs7O1FBRUYsUUFBaEIsRUFBRSxPQUFPLE1BQVUsUUFBUSxRQUFRLFNBQVMsU0FBUzs7OztRQUlyRCxRQUFRLE1BQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxPQUFPO1FBRTVCLFFBQWhCLEVBQUUsT0FBTyxNQUFVLElBQUksSUFBSyxLQUFLLEtBQUssT0FBTztRQUM3QixRQUFoQixFQUFFLE9BQU8sTUFBVSxJQUFJLElBQUssS0FBSyxLQUFLLE9BQU87UUFDN0IsUUFBaEIsRUFBRSxPQUFPLE1BQVUsT0FBTztRQUNWLFFBQWhCLEVBQUUsT0FBTyxNQUFVLE9BQU87Ozs7UUFJMUIsUUFBUSxNQUFLLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxPQUFPLFFBQVEsYUFBYTtRQUNuRCxRQUFoQixFQUFFLE9BQU8sTUFBVSxJQUFJLEtBQUssS0FBSyxJQUFJLE9BQU8ifQ==
//# sourceURL=../../../kode/kxk/test/krzl.kode
