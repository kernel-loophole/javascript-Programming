function minus(a, b) {
    //if the value of b is not given to the function it will return the -a vlaue 
    //else return value of a-b
    if (b == undefined) {
        return -a;
    } else {
        return a - b;
    }
}
// simple json json format
let json_format = JSON.stringify({
    name: "hiader",
    phone: no
});
let test_json = JSON.stringify({
    name: false,
    evnts: ["events", "evnts"]
});
class animal {
    constructor(type) {
        this.type = type
    }
    walk(line) {
        console.log(`print'${line}'`);
    }
}
let new_obj = new animal("dog");

// maps in javascript
let ages = new Map();
ages.set("ali", 22);
ages.set("zain", 22);
ages.set("hiader", 22);
let check_the_age = ages.get("abc");
if (check_the_age) {
    console.log("yes");
} else {
    console.log("NO");
}
console.log(ages.get("ali"));