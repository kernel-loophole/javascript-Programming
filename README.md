
 #  DOM API  use in javascript.
 # Jquery.
 ```javascript
  $(document).ready(function(){
        $('<a href="#top">link </a>').insertAfter('div');
      });
      $("#makered").click(function(){$("#makeitsimple").addClass("makeit"); });
      //
      //
      //#change the content of first and  second ID 
      $(document).ready(function(){
      $("#after").insertBefore('#before').wrap('<ol id="nodes></ol>');
      });
 ```
  # Events
  ```Ruby
  let number1 = document.getElementById("num1").value;
let number2 = document.getElementById("num2").value;

var button = document.querySelector("button");
button.addEventListener("click", () => {
    let number1 = document.getElementById("num1").value;
    let number2 = document.getElementById("num2").value;
    document.getElementById("te").innerHTML = number1 * number2;
})
```

  # Maps and Objects
  ```Ruby
  let adder = new Map();
adder.set("abc", 124);
var obj = {
        name: "abc",
        age: 12,
        address: "abcc,pakistan"
    };
     for (const i in obj) {
        t.innerHTML += i;
    }
    //loop through maps
    for (const [key, value] of adder) {


        t.innerHTML += key + value;
    }
```

  # Scroll Events
  ```javascript
   window.addEventListener("scroll", () => {

            var ch = document.querySelector("h2");
            ch.body.style.background = "yellow";

        })
```

  # classes
  ```javascript
   class animal {
    constructor(type) {
        this.type = type
    }
    walk(line) {
        console.log(`print'${line}'`);
    }
}
let new_obj = new animal("dog");

```
  # Maps
  ```javascript
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
```

  # Functions
  ```javascript
   function minus(a, b) {
    //if the value of b is not given to the function it will return the -a vlaue 
    //else return value of a-b
    if (b == undefined) {
        return -a;
    } else {
        return a - b;
    }
}
```
  # JSON
  ```javascript
   // simple json json format
let json_format = JSON.stringify({
    name: "hiader",
    phone: no
});
let test_json = JSON.stringify({
    name: false,
    evnts: ["events", "evnts"]
});
```

