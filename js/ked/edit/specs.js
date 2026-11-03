var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var specs, trigger, v, vals


specs = (function ()
{
    function specs ()
    {}

    specs["replex"] = {'~c':'●','~s':'▪','~d':'◆','~C':'○',"~#":'◌',"~.":'∙',"~\"":'¨','~S':'□','~D':'◇','~>':'▸','~<':'◂','~^':'▴','~v':'▾','~o':'✔','~x':'✘','~b':'■','~f':'■','~B':'█','~r':'⮐ ','~t':'➜'}
    specs["trigger"] = {'~':['■','◯','◌','∙','○','◇','□','✔','✘','▸','▾','▴','◂','●','◆','▪','◼','█','⮐ ','➜ ','△','▷','▽','◁','│','─','┬','├','┼','┤','┴','╭','','╰','╮','','╯'],'r':['⮐ '],'t':['➜ ']}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3BlY3Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQyxTQUFEOzs7OztJQUVJLE9BQUMsWUFFRyxLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixNQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLElBQ1IsS0FBUSxJQUNSLEtBQVEsSUFDUixLQUFRLEtBQ1IsS0FBUTtJQUVaLE9BQUMsYUFFRyxLQUFRLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxJQUM5RixJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxLQUV4RCxLQUFPLE1BQ1AsS0FBTztJQUVYLE9BQUM7V0FqQ0o7OztLQW1DRyxXQUFnQixNQUFNOztJQUFkLE9BQVEsTUFBTTt3QkFDYjs7O1FBQUw7UUFDQSxNQUFNLFFBQVEsS0FBSzs7O2VBRXBCIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/specs.kode
