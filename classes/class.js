class man
{
    name;
    id;
    cnic;
    phone;
    constructor(name,id,cnic,phone)
    {
        this.cnic=cnic;
        this.id=id;
        this.phone=phone;
        this.name=name;
    }
    introduce_self()
    {
        console.log(this.name,this.cnic,this.id,this.phone);
    }
}
class amry_man 
{
    status;
    
    print_army_data()
    {
        console.log("army man ",this.status);
    }
}


const man_city=new man('haider',2909,29019209102,03020000);
man.introduce_self();
const Army_man=new amry_man();
Army_man.print_army_data();
///Encapsulation
class student
{
    //private variables
    //private methods 
    #id;
    #roll_number;
    #fee;
    constructor(id,roll_number,fee)
    {
        this.#id=id
        this.#roll_number=roll_number;
        this.#fee=fee
    }
    #print_data()
    {
        console.log(this.#id,this.#roll_number,this.#fee);

    }
    print_student_data()
    {
        this.#print_data();
    }

}
const s1=new student(123,1212,1212);
s1.print_student_data();