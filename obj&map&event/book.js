var count = 0;
let adder = new Map();
adder.set("abc", 124);

function run() {
    var obj = {
        name: "abc",
        age: 12,
        address: "abcc,pakistan"
    };
    var t = document.getElementById("display");
    var c = document.getElementById("count");
    c.innerHTML = count;
    if (count > 10) {
        c.innerHTML = "remove items to add more";
        return;
    }

    count += 1;
    var the_data = ["item1", "item2 ", "item3"];

    if (count === 10) {
        c.innerHTML = "you click too many time ,you can not add now ";
    }
    t.innerHTML += obj.age;
    ///add the vlaue of the obj object to the html file by selecting id
    for (const i in obj) {
        t.innerHTML += i;
    }
    //loop through maps
    for (const [key, value] of adder) {


        t.innerHTML += key + value;
    }
}