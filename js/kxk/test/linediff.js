var toExport = {}
import linediff from "../linediff.js"

toExport["linediff"] = async function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZWRpZmYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva3hrL3Rlc3QvbGluZWRpZmYua29kZSJdLCJtYXBwaW5ncyI6IjtPQUNTLGVBQUE7Ozs7SUFJMkIsUUFBaEMsU0FBUyxHQUFXLE9BQWdCLE1BQU0sRUFBRSxPQUFPO0lBQ25CLFFBQWhDLFNBQVMsSUFBVyxPQUFnQixNQUFNLEVBQUUsT0FBTztJQUNuQixRQUFoQyxTQUFTLEtBQVcsT0FBZ0IsTUFBTSxFQUFFLE9BQU87SUFDbkIsUUFBaEMsU0FBUyxJQUFXLFFBQWdCLE1BQU0sRUFBRSxPQUFPO0lBQ25CLFFBQWhDLFNBQVMsTUFBVztJQUNZLFFBQWhDLFNBQVMsTUFBVyxPQUFnQixNQUFNLEVBQUUsT0FBTztJQUNuQixRQUFoQyxTQUFTLE1BQVcsUUFBZ0IsTUFBTSxFQUFFLE9BQU87SUFDbkIsUUFBaEMsU0FBUyxNQUFXLFFBQWdCLE1BQU0sRUFBRSxPQUFPO0lBQ25CLFFBQWhDLFNBQVMsTUFBVztJQUNZLFFBQWhDLFNBQVMsT0FBVyxTQUFnQixNQUFNLEVBQUUsT0FBTztJQUNuQixRQUFoQyxTQUFTLE1BQVcsU0FBZ0IsTUFBTSxFQUFFLE9BQU87SUFDbkIsUUFBaEMsU0FBUyxRQUFXLFdBQWdCLE1BQU0sRUFBRSxPQUFPO0lBQ25CLFFBQWhDLFNBQVMsSUFBVyxVQUFnQixNQUFNLEVBQUUsT0FBTztJQUNuQixRQUFoQyxTQUFTLE1BQVcsYUFBZ0IsTUFBTSxFQUFFLE9BQU8sSUFBSyxNQUFNLEVBQUUsT0FBTyxJQUFLLE1BQU0sRUFBRSxPQUFPO0lBQ2hFLFFBQTNCLFNBQVMsUUFBUTtJQUN5QixRQUExQyxTQUFTLFVBQVUsMEJBQTJCLE1BQU0sRUFBRSxPQUFPLElBQUssTUFBTSxHQUFHLE9BQU87SUFDTSxRQUF4RixTQUFTLHlDQUF5Qyx5Q0FBMEMsTUFBTSxHQUFHLE9BQU87SUFDcEIsUUFBeEYsU0FBUyxzQ0FBeUMsc0NBQTBDLE1BQU0sR0FBRyxPQUFPO0lBQ3BCLFFBQXhGLFNBQVMsc0NBQXlDLHNDQUEwQyxNQUFNLEdBQUcsT0FBTztJQUM3QixRQUEvRSxTQUFTLDZCQUE2Qiw0Q0FBNkMsTUFBTSxFQUFFLE9BQU8sSUFBSyxNQUFNLEVBQUUsT0FBTyxJQUFLLE1BQU0sR0FBRyxPQUFPO0lBQ3hELFFBQW5GLFNBQVMsK0JBQStCLDhDQUErQyxNQUFNLEVBQUUsT0FBTyxJQUFLLE1BQU0sRUFBRSxPQUFPLElBQUssTUFBTSxHQUFHLE9BQU87SUFFdkQsUUFBeEYsU0FBUyx5Q0FBeUMsb0NBQTBDLE1BQU0sR0FBRyxPQUFPO0lBQ3BCLFFBQXhGLFNBQVMsc0NBQXlDLGlDQUEwQyxNQUFNLEdBQUcsT0FBTztJQUNwQixRQUF4RixTQUFTLHNDQUF5QyxpQ0FBMEMsTUFBTSxHQUFHLE9BQU87SUFFdEQsUUFBdEQsU0FBUyxtQkFBbUIsNkJBQThCLE1BQU0sRUFBRSxPQUFPO0lBRXNCLFFBQS9GLFNBQVMsNENBQTRDIn0=
//# sourceURL=../../../kode/kxk/test/linediff.kode
