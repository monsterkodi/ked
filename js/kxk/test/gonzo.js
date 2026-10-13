var toExport = {}
import gonzo from "../gonzo.js"

toExport["gonzo"] = function ()
{
    section("single", function ()
    {
        compare(gonzo(`A
    B`),[{line:'A',indent:0,blck:[{line:'B',indent:4}]}])
    })
    section("outdent", function ()
    {
        compare(gonzo(`A
    B
C`),[{line:'A',indent:0,blck:[{line:'B',indent:4}]},{line:'C',indent:0}])
    })
    section("double", function ()
    {
        compare(gonzo(`A
   B
     C`),[{line:'A',indent:0,blck:[{line:'B',indent:3,blck:[{line:'C',indent:5}]}]}])
    })
    section("ioio", function ()
    {
        compare(gonzo(`I
  O
i
  o`),[{line:'I',indent:0,blck:[{line:'O',indent:2}]},{line:'i',indent:0,blck:[{line:'o',indent:2}]}])
    })
    section("sublevel", function ()
    {
        compare(gonzo(`header
level1
    sub
    level2
        subsub`),[{line:'header',indent:0},{line:'level1',indent:0,blck:[{line:'sub',indent:4},{line:'level2',indent:4,blck:[{line:'subsub',indent:8}]}]}])
    })
}
toExport["gonzo"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29uem8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva3hrL3Rlc3QvZ29uem8ua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztnQkFjUSxNQUFNO1VBSUUsS0FBTSxJQUNOLE9BQVEsRUFDUixPQUNJLEtBQUssSUFDTCxPQUFROzs7O2dCQU1wQixNQUFNOztNQUtFLEtBQU0sSUFDTixPQUFRLEVBQ1IsT0FDSSxLQUFLLElBQ0wsT0FBUSxNQUdaLEtBQU0sSUFDTixPQUFROzs7O2dCQUtoQixNQUFNOztXQUtFLEtBQU0sSUFDTixPQUFRLEVBQ1IsT0FDSSxLQUFLLElBQ0wsT0FBUSxFQUNSLE9BQ0ksS0FBSyxJQUNMLE9BQU87Ozs7Z0JBT3ZCLE1BQU07OztRQU1FLEtBQU0sSUFDTixPQUFRLEVBQ1IsT0FDSSxLQUFLLElBQ0wsT0FBUSxNQUdaLEtBQU0sSUFDTixPQUFRLEVBQ1IsT0FDSSxLQUFLLElBQ0wsT0FBUTs7OztnQkFNcEIsTUFBTTs7OzttQkFPRSxLQUFNLFNBQ04sT0FBUSxJQUVSLEtBQU0sU0FDTixPQUFRLEVBQ1IsT0FDSSxLQUFNLE1BQ04sT0FBUSxJQUVSLEtBQU0sU0FDTixPQUFRLEVBQ1IsT0FDSSxLQUFNLFNBQ04sT0FBUSJ9
//# sourceURL=file://kode/kxk/test/gonzo.kode
