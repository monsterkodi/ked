var toExport = {}
import linediff from "../linediff.js"

toExport["linediff"] = function ()
{
    compare(linediff('','y'),[{index:0,length:1}])
    compare(linediff('x','y'),[{index:0,length:1}])
    compare(linediff('xy','z'),[{index:0,length:1}])
    compare(linediff('x','yz'),[{index:0,length:2}])
    compare(linediff('ABC',''),[])
    compare(linediff('ABC','A'),[{index:0,length:1}])
    compare(linediff('ABC','AB'),[{index:0,length:2}])
    compare(linediff('ABC','AC'),[{index:0,length:2}])
    compare(linediff('ABC','ABC'),[])
    compare(linediff('ABCD','ABC'),[{index:0,length:3}])
    compare(linediff('ABC','AbC'),[{index:0,length:3}])
    compare(linediff('C D E','CxDyE'),[{index:0,length:5}])
    compare(linediff('C','ABBB'),[{index:0,length:4}])
    compare(linediff('xyz',' x y z '),[{index:1,length:1},{index:3,length:1},{index:5,length:1}])
    compare(linediff('t = w','t  =  w'),[])
    compare(linediff('if diff','continue if not diff'),[{index:0,length:8},{index:12,length:3}])
    compare(linediff("       when 'change' then return false","       when 'change' ➜ return false"),[{index:21,length:1}])
    compare(linediff("       when 'delete' then deletes++","       when 'delete' ➜ deletes++"),[{index:21,length:1}])
    compare(linediff("       when 'insert' then inserts++","       when 'insert' ➜ inserts++"),[{index:21,length:1}])
    compare(linediff('window.terminal.appendMeta','if spacer ➜ window.terminal.appendMeta'),[{index:0,length:2},{index:3,length:6},{index:10,length:1}])
    compare(linediff('  window.terminal.appendMeta','  if spacer ➜ window.terminal.appendMeta'),[{index:2,length:2},{index:5,length:6},{index:12,length:1}])
    compare(linediff("       when 'change' then return false","       'change' ➜ return false"),[{index:16,length:1}])
    compare(linediff("       when 'delete' then deletes++","       'delete' ➜ deletes++"),[{index:16,length:1}])
    compare(linediff("       when 'insert' then inserts++","       'insert' ➜ inserts++"),[{index:16,length:1}])
    compare(linediff("# log 'out:' out","window.terminal.clear()"),[{index:0,length:23}])
    compare(linediff("    # changes = lineDiff oldLine, newLine","    changes = lineDiff oldLine, newLine"),[])
}
toExport["linediff"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZWRpZmYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva3hrL3Rlc3QvbGluZWRpZmYua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7WUFZSSxTQUFTLEdBQVcsT0FBZ0IsTUFBTSxFQUFFLE9BQU87WUFDbkQsU0FBUyxJQUFXLE9BQWdCLE1BQU0sRUFBRSxPQUFPO1lBQ25ELFNBQVMsS0FBVyxPQUFnQixNQUFNLEVBQUUsT0FBTztZQUNuRCxTQUFTLElBQVcsUUFBZ0IsTUFBTSxFQUFFLE9BQU87WUFDbkQsU0FBUyxNQUFXO1lBQ3BCLFNBQVMsTUFBVyxPQUFnQixNQUFNLEVBQUUsT0FBTztZQUNuRCxTQUFTLE1BQVcsUUFBZ0IsTUFBTSxFQUFFLE9BQU87WUFDbkQsU0FBUyxNQUFXLFFBQWdCLE1BQU0sRUFBRSxPQUFPO1lBQ25ELFNBQVMsTUFBVztZQUNwQixTQUFTLE9BQVcsU0FBZ0IsTUFBTSxFQUFFLE9BQU87WUFDbkQsU0FBUyxNQUFXLFNBQWdCLE1BQU0sRUFBRSxPQUFPO1lBQ25ELFNBQVMsUUFBVyxXQUFnQixNQUFNLEVBQUUsT0FBTztZQUNuRCxTQUFTLElBQVcsVUFBZ0IsTUFBTSxFQUFFLE9BQU87WUFDbkQsU0FBUyxNQUFXLGFBQWdCLE1BQU0sRUFBRSxPQUFPLElBQUssTUFBTSxFQUFFLE9BQU8sSUFBSyxNQUFNLEVBQUUsT0FBTztZQUMzRixTQUFTLFFBQVE7WUFDakIsU0FBUyxVQUFVLDBCQUEyQixNQUFNLEVBQUUsT0FBTyxJQUFLLE1BQU0sR0FBRyxPQUFPO1lBQ2xGLFNBQVMseUNBQXlDLHlDQUEwQyxNQUFNLEdBQUcsT0FBTztZQUM1RyxTQUFTLHNDQUF5QyxzQ0FBMEMsTUFBTSxHQUFHLE9BQU87WUFDNUcsU0FBUyxzQ0FBeUMsc0NBQTBDLE1BQU0sR0FBRyxPQUFPO1lBQzVHLFNBQVMsNkJBQTZCLDRDQUE2QyxNQUFNLEVBQUUsT0FBTyxJQUFLLE1BQU0sRUFBRSxPQUFPLElBQUssTUFBTSxHQUFHLE9BQU87WUFDM0ksU0FBUywrQkFBK0IsOENBQStDLE1BQU0sRUFBRSxPQUFPLElBQUssTUFBTSxFQUFFLE9BQU8sSUFBSyxNQUFNLEdBQUcsT0FBTztZQUUvSSxTQUFTLHlDQUF5QyxvQ0FBMEMsTUFBTSxHQUFHLE9BQU87WUFDNUcsU0FBUyxzQ0FBeUMsaUNBQTBDLE1BQU0sR0FBRyxPQUFPO1lBQzVHLFNBQVMsc0NBQXlDLGlDQUEwQyxNQUFNLEdBQUcsT0FBTztZQUU1RyxTQUFTLG1CQUFtQiw2QkFBOEIsTUFBTSxFQUFFLE9BQU87WUFFekUsU0FBUyw0Q0FBNEMifQ==
//# sourceURL=file://kode/kxk/test/linediff.kode
