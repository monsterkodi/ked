var toExport = {}
var k

import krzl from "../krzl.js"
import slash from "../slash.js"

toExport["krzl"] = function ()
{
    section("strings", function ()
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
    section("extract", function ()
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
    section("weight", function ()
    {
        k = new krzl(['bba','aa','a','aba','acccca','aaa','akkaakka'])
        compare(k.filter('a'),['a','aa','aba','aaa','acccca','akkaakka','bba'])
        compare(k.filter('b'),['bba','aba'])
        compare(k.filter('aa'),['aa','aba','aaa','acccca','akkaakka'])
    })
    section("custom", function ()
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
    section("negative", function ()
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
    section("case insensitive", function ()
    {
        k = new krzl(['a','aA','Aa','A','BaBa','bABA'])
        compare(k.filter('a'),['a','A','aA','Aa','BaBa','bABA'])
        compare(k.filter('A'),['a','A','aA','Aa','BaBa','bABA'])
        compare(k.filter('b'),['BaBa','bABA'])
        compare(k.filter('B'),['BaBa','bABA'])
    })
    section("length insensitive", function ()
    {
        k = new krzl({values:['a','aA','Aa','A','BaBa','bABA'],sortByLength:false})
        compare(k.filter('a'),['a','aA','Aa','A','BaBa','bABA'])
    })
}
toExport["krzl"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3J6bC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC9rcnpsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUFjUSxRQUFRLE1BQVcsUUFBUTtnQkFFM0IsRUFBRTtnQkFDRixFQUFFLE9BQU87Z0JBQ1QsRUFBRSxPQUFPO2dCQUNULEVBQUUsT0FBTyxNQUFVO2dCQUNuQixFQUFFLE9BQU8sTUFBVTtnQkFDbkIsRUFBRSxPQUFPLE1BQVUsUUFBUTtnQkFDM0IsRUFBRSxPQUFPLE9BQVU7Z0JBQ25CLEVBQUUsT0FBTyxNQUFVLFFBQVE7Ozs7UUFJM0IsUUFBUSxPQUFZLElBQUksVUFBVyxJQUFJLFFBQVEsS0FBSztRQUNwRCxFQUFFOzttQkFBaUIsRUFBRTs7Z0JBRXJCLEVBQUUsT0FBTztnQkFDVCxFQUFFLE9BQU8sT0FBVSxJQUFJO2dCQUN2QixFQUFFLE9BQU8sT0FBVSxJQUFJLFFBQVEsS0FBSztnQkFDcEMsRUFBRSxPQUFPLE9BQVcsSUFBSSxVQUFVLElBQUksUUFBUSxLQUFLO2dCQUNuRCxFQUFFLE9BQU8sUUFBVSxJQUFJO2dCQUN2QixFQUFFLE9BQU8sT0FBVyxJQUFJLFFBQVEsS0FBSyxNQUFNLElBQUk7Ozs7UUFJL0MsUUFBUSxNQUFXLE1BQU0sS0FBTSxJQUFJLE1BQU0sU0FBUyxNQUFNO2dCQUN4RCxFQUFFLE9BQU8sTUFBVSxJQUFJLEtBQUssTUFBTSxNQUFNLFNBQVMsV0FBVztnQkFDNUQsRUFBRSxPQUFPLE1BQVUsTUFBTTtnQkFDekIsRUFBRSxPQUFPLE9BQVUsS0FBSyxNQUFNLE1BQU0sU0FBUzs7OztRQUk3QyxRQUFRLE1BQVcsUUFBUSxNQUFNLElBQUksU0FBUztnQkFDOUMsRUFBRSxPQUFPLE1BQVUsSUFBSSxNQUFNLFFBQVEsU0FBUztRQUU5QyxFQUFFOztvQkFDUyxNQUFNLElBQUk7O3FCQUNiOzJCQUFTOztxQkFDVDsyQkFBUzs7OzJCQUNBOzs7O2dCQUVqQixFQUFFLE9BQU8sTUFBVSxJQUFJLFNBQVMsU0FBUyxNQUFNO1FBRS9DLEVBQUU7O29CQUNTLE1BQU0sSUFBSTs7cUJBQ2I7MkJBQVM7O3FCQUNUOzJCQUFTOzs7MkJBQ0E7Ozs7Z0JBRWpCLEVBQUUsT0FBTyxNQUFVLElBQUksU0FBUyxTQUFTLE1BQU07UUFFL0MsRUFBRTs7b0JBQ1MsTUFBTSxJQUFJOztxQkFDYjsyQkFBUzs7cUJBQ1Q7MkJBQVM7OzsyQkFDQTs7OztnQkFFakIsRUFBRSxPQUFPLE1BQVUsSUFBSSxTQUFTLFNBQVMsTUFBTTs7OztRQUkvQyxRQUFRLE1BQVcsUUFBUSxRQUFRLFVBQVUsU0FBUztRQUV0RCxFQUFFOztvQkFDUyxNQUFNLElBQUk7O3FCQUNiOzJCQUFVOztxQkFDVjsyQkFBVTs7cUJBQ1Y7MkJBQVU7OzsyQkFDQTs7OztnQkFFbEIsRUFBRSxPQUFPLE1BQVUsUUFBUSxRQUFRLFNBQVMsU0FBUzs7OztRQUlyRCxRQUFRLE1BQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxPQUFPO2dCQUU1QyxFQUFFLE9BQU8sTUFBVSxJQUFJLElBQUssS0FBSyxLQUFLLE9BQU87Z0JBQzdDLEVBQUUsT0FBTyxNQUFVLElBQUksSUFBSyxLQUFLLEtBQUssT0FBTztnQkFDN0MsRUFBRSxPQUFPLE1BQVUsT0FBTztnQkFDMUIsRUFBRSxPQUFPLE1BQVUsT0FBTzs7OztRQUkxQixRQUFRLE1BQUssUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJLE9BQU8sUUFBUSxhQUFhO2dCQUNuRSxFQUFFLE9BQU8sTUFBVSxJQUFJLEtBQUssS0FBSyxJQUFJLE9BQU8ifQ==
//# sourceURL=file://kode/kxk/test/krzl.kode
