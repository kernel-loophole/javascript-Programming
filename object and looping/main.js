const student_data={
    name:"hiader",
    roll_no:"01920",
    batch:"19",
    season:"sping",
    bio:function ()
    {
        console.log(`${this.name[0]}`);
        console.log(`${this.roll_no}`);
    }

}
const name_=prompt("enter the name");
const rool_=prompt("enter rool number");
let testing_data={
    name:name_,
    roll:rool_,
    bio(){
        console.log(`${this.name}`,`${this.roll}`);
        return this.name
    },
    pattern()
    {
        str_pattern="*"
        for(let z=0;z<10;z++)
        {
            str_pattern='';
            for (let y=0;y<z;y++)
            {
                str_pattern=str_pattern+"*";

            }
            console.log(str_pattern);

        }
    },
    reverse_pattern()
    {
        str_pattern="*"
        for(let z=10;z>0;z--)
        {
            str_pattern='';
            for (let y=0;y<z;y++)
            {
                str_pattern=str_pattern+"*";

            }
            console.log(str_pattern);

        }
    }
}
