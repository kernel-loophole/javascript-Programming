# javascript-jquery-
![Optional Text](js.png)
 # simple DOM API  use in javascript.
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

  # Scroll Events
  ```python
   window.addEventListener("scroll", () => {

            var ch = document.querySelector("h2");
            ch.body.style.background = "yellow";

        })
```
