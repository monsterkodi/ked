var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var specs, trigger, v, vals


specs = (function ()
{
    function specs ()
    {}

    specs["replex"] = {'~c':'●','~s':'▪','~d':'◆','~C':'○',"~#":'◌',"~.":'∙',"~\"":'¨','~S':'□','~D':'◇','~>':'▸','~<':'◂','~^':'▴','~v':'▾','~o':'✔','~x':'✘','~b':'■','~B':'█','~r':'⮐ ','~t':'➜'}
    specs["trigger"] = {'~':['◌','∙','○','◇','□','✔','✘','▸','▾','▴','◂','●','◆','▪','◼','■','█','⮐  ','➜ ','△','▷','▽','◁','◯','│','─','┬','├','┼','┤','┴','╭','','╰','╮','','╯'],'r':['⮐  '],'t':['➜ ']}
    specs["inserts"] = {}
    return specs
})()

for (trigger in specs.trigger)
{
    vals = specs.trigger[trigger]
    var list = _k_.list(vals)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        v = list[_a_]
        specs.inserts[v] = v
    }
}
export default specs;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3BlY3Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozt1QkFlUSxLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixNQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsS0FDUixLQUFRO3dCQUlSLEtBQVEsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLE1BQU0sS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLElBQy9GLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEtBRXhELEtBQU8sT0FDUCxLQUFPOzs7OztnQkFJSyxNQUFNOztXQUFOLE1BQU07d0JBQ2I7Ozs7UUFDTCxNQUFNLFFBQVEsS0FBSzs7O2VBRXBCIn0=
//# sourceURL=kode/ked/edit/specs.kode
