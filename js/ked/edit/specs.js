var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var specs, trigger, v, vals


specs = (function ()
{
    function specs ()
    {}

    specs["replex"] = {'~c':'●','~C':'◯','~s':'▪','~S':'□','~d':'◆','~D':'◇',"~#":'◌',"~.":'∙',"~\"":'¨','~>':'▸','~<':'◂','~^':'▴','~v':'▾','~o':'✔','~x':'✘','~b':'■','~f':'■','~B':'█','~r':'⮐ ','~t':'➜'}
    specs["trigger"] = {'~':['■','●','◆','□','◯','◇','∙','✔','✘','▸','▾','▴','◂','◌','▪','◼','█','⮐ ','➜ ','△','▷','▽','◁','│','─','┬','├','┼','┤','┴','╭','','╰','╮','','╯'],'r':['⮐ '],'t':['➜ ']}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3BlY3Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQyxTQUFEOzs7OztJQU1JLE9BQUMsWUFFRyxLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLE1BQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLEtBQ1IsS0FBUTtJQUVaLE9BQUMsYUFFRyxLQUFRLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksSUFDMUYsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksS0FFeEQsS0FBTyxNQUNQLEtBQU87SUFFWCxPQUFDO1dBckNKOzs7S0F1Q0csV0FBZ0IsTUFBTTs7SUFBZCxPQUFRLE1BQU07d0JBQ2I7OztRQUFMO1FBQ0EsTUFBTSxRQUFRLEtBQUs7OztlQUVwQiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/specs.kode
