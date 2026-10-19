var toExport = {}
var near, scoot

import scooter from "../scooter.js"

near = scooter.near

scoot = function (s)
{
    return Number.parseFloat(scooter(s))
}
toExport["scooter"] = async function ()
{
    await section("add", async function ()
    {
        compare(scoot('1+1'),2)
        compare(scoot('0+0'),0)
        compare(scoot('+2'),2)
        compare(scoot('-3'),-3)
    })
    await section("multiply", async function ()
    {
        compare(scoot('9*9'),81)
        compare(scoot('9*-3'),-27)
        compare(scoot('-2*-2'),4)
        compare(scoot('3*3*3'),27)
    })
    await section("divide", async function ()
    {
        compare(scoot('1/2'),0.5)
        compare(scoot('1/-4'),-0.25)
        compare(scoot('-2/-4'),0.5)
        compare(scoot('-2/8'),-0.25)
        compare(scoot('1/1/1/1'),1)
        compare(scoot('20/2/5'),2)
        compare(scooter('1/0'),'∞')
        compare(scoot('1/0'),NaN)
        compare(scoot('0/0'),NaN)
        compare(scoot('1/Infinity'),0)
    })
    await section("pow", async function ()
    {
        compare(scoot('2^2'),4)
        compare(scoot('2^-2'),0.25)
        compare(scoot('2^0.5'),Math.sqrt(2))
        compare(scoot('2^2^2'),16)
        compare(scoot('2^3^4'),Math.pow(2,Math.pow(3,4)))
        compare(scoot('2^(3^4)'),Math.pow(2,Math.pow(3,4)))
        compare(scoot('(2^3)^4'),4096)
        compare(scoot('2^3+1'),9)
        compare(scoot('2^(3+1)'),16)
    })
    await section("constants", async function ()
    {
        compare(scoot('PI'),Math.PI)
        compare(scoot('E'),Math.E)
        compare(scoot('PHI'),(1 + Math.sqrt(5)) / 2)
    })
    await section("trigonometry", async function ()
    {
        compare(scoot('cos(PI)'),-1)
        compare(scoot('sin(PI/2)'),1)
        compare(scoot('cos(sin(PI))'),1)
    })
    await section("logarithm", async function ()
    {
        compare(scoot('log(E)'),1)
        compare(scooter('log(0)'),'-∞')
        compare(scoot('log(-1)'),NaN)
        compare(scoot('log(10)'),Math.log(10))
    })
    await section("deg rad", async function ()
    {
        compare(scoot('rad(180)'),Math.PI)
        compare(scoot('deg(PI)'),180)
        compare(scoot('deg(rad(E))'),Math.E)
        compare(scoot('rad(deg(E))'),Math.E)
    })
    await section("sqrt", async function ()
    {
        compare(scoot('sqrt(9)'),3)
        compare(scoot('sqrt(8+1)'),3)
        compare(scoot('sqrt(E^2)'),Math.E)
        compare(near(scoot('sqrt(E)^2'),Math.E),true)
    })
    await section("unicode", async function ()
    {
        compare(scoot('∡(π)'),180)
        compare(scoot('√(9)'),3)
        compare(scoot('π'),Math.PI)
        compare(scoot('𝒆'),Math.E)
        compare(scooter('∞'),'∞')
        compare(scoot('∞'),NaN)
        compare(scoot('ϕ'),(1 + Math.sqrt(5)) / 2)
        await section("degree", async function ()
        {
            compare(scoot('180°'),Math.PI)
            compare(scoot('(90+90)°'),Math.PI)
            compare(scoot('(2*90)°'),Math.PI)
            compare(scoot('2*90°'),Math.PI)
            compare(scoot('90°+90°'),Math.PI)
            compare(scoot('60°+60°+60°'),Math.PI)
            compare(scoot('360°/2'),Math.PI)
            compare(scoot('(360/2)°'),Math.PI)
            compare(scoot('cos(0°)'),1)
            compare(scoot('cos(180°)'),-1)
            compare(scoot('sin(0°)'),0)
            compare(near(scoot('sin(180°)'),0),true)
        })
    })
    await section("bigint", async function ()
    {
        compare(scooter('2^3^4'),'2417851639229258349412352')
        compare(scooter('3*2^3^4'),'7253554917687775048237056')
        compare(scooter('4*2^3^4'),'9671406556917033397649408')
        compare(scooter('(3*2)^3^4'),String(BigInt(Math.pow(6,Math.pow(3,4)))))
        compare(scooter('(4*2)^3^4'),'14134776518227074636666380005943348126619871175004951664972849610340958208')
    })
    await section("smallfloat", async function ()
    {
        compare(scooter('1/(2^3^4)'),'0.000000000000000000000000414')
    })
    await section("precision", async function ()
    {
        compare(scooter('cos(PI/2)'),'0.0000000000000000612')
        compare(scooter('cos(PI/2)',17),'0.00000000000000006')
        compare(scooter('cos(PI/2)',16),'0.0000000000000001')
        compare(scooter('cos(PI/2)',15),'0')
    })
    await section("misc", async function ()
    {
        compare(near(scoot('log(1/√(𝒆^(16)))'),-8),true)
        compare(near(scoot('log(1/√(𝒆^(6)))'),-3),true)
        compare(scooter('1/0'),'∞')
        compare(scooter('1/(∞)'),'0')
        compare(scooter('𝒆^(0)'),'1')
        compare(scooter('∡(π)'),'180')
        compare(scooter('180°-π'),'0')
        compare(scooter('(1+√(5))/2-ϕ'),'0')
    })
    await section("hex", async function ()
    {
        compare(scooter('hex(10)'),'0xa')
        compare(scooter('hex(4*4)'),'0x10')
        compare(scooter('hex(16^2-1)'),'0xff')
        compare(scooter('0xa'),'10')
        compare(scooter('0x10'),'16')
        compare(scooter('0xff'),'255')
        compare(scooter('hex(16.5)'),'0x10')
        compare(scooter('hex(sqrt(257))'),'0x10')
        compare(scooter('hex(-16.5)'),'-0x10')
        compare(scooter('hex(10-100)'),'-0x5a')
    })
}
toExport["scooter"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nvb3Rlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC9zY29vdGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBVUEsT0FBUSxRQUFROztBQUNoQjs7V0FBYSxPQUFPLFdBQVcsUUFBUTs7Ozs7O2dCQU0vQixNQUFRLE9BQWtCO2dCQUMxQixNQUFRLE9BQWtCO2dCQUMxQixNQUFRLE1BQWtCO2dCQUMxQixNQUFRLE1BQWtCOzs7O2dCQUkxQixNQUFRLE9BQWtCO2dCQUMxQixNQUFRLFFBQWtCO2dCQUMxQixNQUFRLFNBQWtCO2dCQUMxQixNQUFRLFNBQWtCOzs7O2dCQUkxQixNQUFRLE9BQWtCO2dCQUMxQixNQUFRLFFBQWtCO2dCQUMxQixNQUFRLFNBQWtCO2dCQUMxQixNQUFRLFFBQWtCO2dCQUMxQixNQUFRLFdBQWtCO2dCQUMxQixNQUFRLFVBQWtCO2dCQUUxQixRQUFRLE9BQWtCO2dCQUMxQixNQUFRLE9BQWtCO2dCQUMxQixNQUFRLE9BQWtCO2dCQUMxQixNQUFRLGNBQWtCOzs7O2dCQUkxQixNQUFRLE9BQWtCO2dCQUMxQixNQUFRLFFBQWtCO2dCQUUxQixNQUFRLFNBQWtCLEtBQUssS0FBSztnQkFFcEMsTUFBUSxTQUFrQjtnQkFDMUIsTUFBUSxTQUFrQixLQUFLLElBQUksRUFBRyxLQUFLLElBQUksRUFBRztnQkFDbEQsTUFBUSxXQUFrQixLQUFLLElBQUksRUFBRyxLQUFLLElBQUksRUFBRztnQkFDbEQsTUFBUSxXQUFrQjtnQkFFMUIsTUFBUSxTQUFrQjtnQkFDMUIsTUFBUSxXQUFrQjs7OztnQkFJMUIsTUFBUSxNQUFrQixLQUFLO2dCQUMvQixNQUFRLEtBQWtCLEtBQUs7Z0JBQy9CLE1BQVEsUUFBbUIsSUFBSSxLQUFLLEtBQUssTUFBTTs7OztnQkFJL0MsTUFBUSxXQUFrQjtnQkFDMUIsTUFBUSxhQUFrQjtnQkFDMUIsTUFBUSxnQkFBa0I7Ozs7Z0JBSTFCLE1BQVEsVUFBa0I7Z0JBQzFCLFFBQVEsVUFBZ0I7Z0JBQ3hCLE1BQVEsV0FBa0I7Z0JBQzFCLE1BQVEsV0FBa0IsS0FBSyxJQUFJOzs7O2dCQUluQyxNQUFRLFlBQWtCLEtBQUs7Z0JBQy9CLE1BQVEsV0FBa0I7Z0JBQzFCLE1BQVEsZUFBa0IsS0FBSztnQkFDL0IsTUFBUSxlQUFrQixLQUFLOzs7O2dCQUkvQixNQUFRLFdBQWtCO2dCQUMxQixNQUFRLGFBQWtCO2dCQUMxQixNQUFRLGFBQWtCLEtBQUs7Z0JBQy9CLEtBQUssTUFBTSxhQUFjLEtBQUssR0FBSTs7OztnQkFJbEMsTUFBUSxRQUFrQjtnQkFDMUIsTUFBUSxRQUFrQjtnQkFDMUIsTUFBUSxLQUFrQixLQUFLO2dCQUMvQixNQUFRLE1BQWlCLEtBQUs7Z0JBQzlCLFFBQVEsS0FBa0I7Z0JBQzFCLE1BQVEsS0FBa0I7Z0JBQzFCLE1BQVEsTUFBbUIsSUFBSSxLQUFLLEtBQUssTUFBTTs7O29CQUkzQyxNQUFNLFFBQWdCLEtBQUs7b0JBQzNCLE1BQU0sWUFBZ0IsS0FBSztvQkFDM0IsTUFBTSxXQUFnQixLQUFLO29CQUMzQixNQUFNLFNBQWdCLEtBQUs7b0JBQzNCLE1BQU0sV0FBZ0IsS0FBSztvQkFDM0IsTUFBTSxlQUFnQixLQUFLO29CQUMzQixNQUFNLFVBQWdCLEtBQUs7b0JBQzNCLE1BQU0sWUFBZ0IsS0FBSztvQkFDM0IsTUFBTSxXQUFpQjtvQkFDdkIsTUFBTSxhQUFnQjtvQkFDdEIsTUFBTSxXQUFpQjtvQkFDdkIsS0FBSyxNQUFNLGFBQWMsR0FBSTs7Ozs7Z0JBSWpDLFFBQVEsU0FBa0I7Z0JBQzFCLFFBQVEsV0FBa0I7Z0JBQzFCLFFBQVEsV0FBa0I7Z0JBQzFCLFFBQVEsYUFBa0IsT0FBTyxPQUFPLEtBQUssSUFBSSxFQUFHLEtBQUssSUFBSSxFQUFFO2dCQUMvRCxRQUFRLGFBQWtCOzs7O2dCQUkxQixRQUFRLGFBQWtCOzs7O2dCQUkxQixRQUFRLGFBQWtCO2dCQUUxQixRQUFRLFlBQVksSUFBTTtnQkFDMUIsUUFBUSxZQUFZLElBQU07Z0JBQzFCLFFBQVEsWUFBWSxJQUFNOzs7O2dCQUkxQixLQUFLLE1BQU0scUJBQXNCLElBQUs7Z0JBQ3RDLEtBQUssTUFBTSxvQkFBc0IsSUFBSztnQkFFdEMsUUFBUSxPQUFrQjtnQkFDMUIsUUFBUSxTQUFrQjtnQkFDMUIsUUFBUSxVQUFrQjtnQkFDMUIsUUFBUSxRQUFrQjtnQkFDMUIsUUFBUSxVQUFrQjtnQkFDMUIsUUFBUSxnQkFBa0I7Ozs7Z0JBSTFCLFFBQVEsV0FBa0I7Z0JBQzFCLFFBQVEsWUFBa0I7Z0JBQzFCLFFBQVEsZUFBa0I7Z0JBRTFCLFFBQVEsT0FBa0I7Z0JBQzFCLFFBQVEsUUFBa0I7Z0JBQzFCLFFBQVEsUUFBa0I7Z0JBRTFCLFFBQVEsYUFBb0I7Z0JBQzVCLFFBQVEsa0JBQW9CO2dCQUU1QixRQUFRLGNBQW9CO2dCQUM1QixRQUFRLGVBQW9CIn0=
//# sourceURL=file://kode/kxk/test/scooter.kode
