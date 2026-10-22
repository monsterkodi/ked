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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3J6bC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC9rcnpsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUFjUSxRQUFRLE1BQVcsUUFBUTtnQkFFM0IsRUFBRTtnQkFDRixFQUFFLE9BQU87Z0JBQ1QsRUFBRSxPQUFPO2dCQUNULEVBQUUsT0FBTyxNQUFVO2dCQUNuQixFQUFFLE9BQU8sTUFBVTtnQkFDbkIsRUFBRSxPQUFPLE1BQVUsUUFBUTtnQkFDM0IsRUFBRSxPQUFPLE9BQVU7Z0JBQ25CLEVBQUUsT0FBTyxNQUFVLFFBQVE7Ozs7UUFJM0IsUUFBUSxPQUFZLElBQUksVUFBVyxJQUFJLFFBQVEsS0FBSztRQUNwRCxFQUFFLG9CQUFXOzttQkFBTSxFQUFFOztnQkFFckIsRUFBRSxPQUFPO2dCQUNULEVBQUUsT0FBTyxPQUFVLElBQUk7Z0JBQ3ZCLEVBQUUsT0FBTyxPQUFVLElBQUksUUFBUSxLQUFLO2dCQUNwQyxFQUFFLE9BQU8sT0FBVyxJQUFJLFVBQVUsSUFBSSxRQUFRLEtBQUs7Z0JBQ25ELEVBQUUsT0FBTyxRQUFVLElBQUk7Z0JBQ3ZCLEVBQUUsT0FBTyxPQUFXLElBQUksUUFBUSxLQUFLLE1BQU0sSUFBSTs7OztRQUkvQyxRQUFRLE1BQVcsTUFBTSxLQUFNLElBQUksTUFBTSxTQUFTLE1BQU07Z0JBQ3hELEVBQUUsT0FBTyxNQUFVLElBQUksS0FBSyxNQUFNLE1BQU0sU0FBUyxXQUFXO2dCQUM1RCxFQUFFLE9BQU8sTUFBVSxNQUFNO2dCQUN6QixFQUFFLE9BQU8sT0FBVSxLQUFLLE1BQU0sTUFBTSxTQUFTOzs7O1FBSTdDLFFBQVEsTUFBVyxRQUFRLE1BQU0sSUFBSSxTQUFTO2dCQUM5QyxFQUFFLE9BQU8sTUFBVSxJQUFJLE1BQU0sUUFBUSxTQUFTO1FBRTlDLEVBQUUsbUJBQVU7O29CQUNELE1BQU0sSUFBSTs7cUJBQ2I7MkJBQVM7O3FCQUNUOzJCQUFTOzs7MkJBQ0E7Ozs7Z0JBRWpCLEVBQUUsT0FBTyxNQUFVLElBQUksU0FBUyxTQUFTLE1BQU07UUFFL0MsRUFBRSxtQkFBVTs7b0JBQ0QsTUFBTSxJQUFJOztxQkFDYjsyQkFBUzs7cUJBQ1Q7MkJBQVM7OzsyQkFDQTs7OztnQkFFakIsRUFBRSxPQUFPLE1BQVUsSUFBSSxTQUFTLFNBQVMsTUFBTTtRQUUvQyxFQUFFLG1CQUFVOztvQkFDRCxNQUFNLElBQUk7O3FCQUNiOzJCQUFTOztxQkFDVDsyQkFBUzs7OzJCQUNBOzs7O2dCQUVqQixFQUFFLE9BQU8sTUFBVSxJQUFJLFNBQVMsU0FBUyxNQUFNOzs7O1FBSS9DLFFBQVEsTUFBVyxRQUFRLFFBQVEsVUFBVSxTQUFTO1FBRXRELEVBQUUsbUJBQVU7O29CQUNELE1BQU0sSUFBSTs7cUJBQ2I7MkJBQVU7O3FCQUNWOzJCQUFVOztxQkFDVjsyQkFBVTs7OzJCQUNBOzs7O2dCQUVsQixFQUFFLE9BQU8sTUFBVSxRQUFRLFFBQVEsU0FBUyxTQUFTOzs7O1FBSXJELFFBQVEsTUFBVyxJQUFJLEtBQUssS0FBSyxJQUFJLE9BQU87Z0JBRTVDLEVBQUUsT0FBTyxNQUFVLElBQUksSUFBSyxLQUFLLEtBQUssT0FBTztnQkFDN0MsRUFBRSxPQUFPLE1BQVUsSUFBSSxJQUFLLEtBQUssS0FBSyxPQUFPO2dCQUM3QyxFQUFFLE9BQU8sTUFBVSxPQUFPO2dCQUMxQixFQUFFLE9BQU8sTUFBVSxPQUFPOzs7O1FBSTFCLFFBQVEsTUFBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksT0FBTyxRQUFRLGFBQWE7Z0JBQ25FLEVBQUUsT0FBTyxNQUFVLElBQUksS0FBSyxLQUFLLElBQUksT0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/test/krzl.kode
