var toExport = {}
import gonzo from "../gonzo.js"

toExport["gonzo"] = async function ()
{
    await section("single", async function ()
    {
        compare(gonzo(`A
    B`),[{line:'A',indent:0,blck:[{line:'B',indent:4}]}])
    })
    await section("outdent", async function ()
    {
        compare(gonzo(`A
    B
C`),[{line:'A',indent:0,blck:[{line:'B',indent:4}]},{line:'C',indent:0}])
    })
    await section("double", async function ()
    {
        compare(gonzo(`A
   B
     C`),[{line:'A',indent:0,blck:[{line:'B',indent:3,blck:[{line:'C',indent:5}]}]}])
    })
    await section("ioio", async function ()
    {
        compare(gonzo(`I
  O
i
  o`),[{line:'I',indent:0,blck:[{line:'O',indent:2}]},{line:'i',indent:0,blck:[{line:'o',indent:2}]}])
    })
    await section("sublevel", async function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29uem8uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva3hrL3Rlc3QvZ29uem8ua29kZSJdLCJtYXBwaW5ncyI6IjtPQUNTLFlBQUE7Ozs7OztRQVNPLFFBSFIsTUFBTTtVQUlFLEtBQU0sSUFDTixPQUFRLEVBQ1IsT0FDSSxLQUFLLElBQ0wsT0FBUTs7OztRQVVaLFFBSlIsTUFBTTs7TUFLRSxLQUFNLElBQ04sT0FBUSxFQUNSLE9BQ0ksS0FBSyxJQUNMLE9BQVEsTUFHWixLQUFNLElBQ04sT0FBUTs7OztRQVNSLFFBSlIsTUFBTTs7V0FLRSxLQUFNLElBQ04sT0FBUSxFQUNSLE9BQ0ksS0FBSyxJQUNMLE9BQVEsRUFDUixPQUNJLEtBQUssSUFDTCxPQUFPOzs7O1FBWWYsUUFMUixNQUFNOzs7UUFNRSxLQUFNLElBQ04sT0FBUSxFQUNSLE9BQ0ksS0FBSyxJQUNMLE9BQVEsTUFHWixLQUFNLElBQ04sT0FBUSxFQUNSLE9BQ0ksS0FBSyxJQUNMLE9BQVE7Ozs7UUFZWixRQU5SLE1BQU07Ozs7bUJBT0UsS0FBTSxTQUNOLE9BQVEsSUFFUixLQUFNLFNBQ04sT0FBUSxFQUNSLE9BQ0ksS0FBTSxNQUNOLE9BQVEsSUFFUixLQUFNLFNBQ04sT0FBUSxFQUNSLE9BQ0ksS0FBTSxTQUNOLE9BQVEifQ==
//# sourceURL=../../../kode/kxk/test/gonzo.kode
