let number1 = document.getElementById("num1").value;
let number2 = document.getElementById("num2").value;

var button = document.querySelector("button");
button.addEventListener("click", () => {
    let number1 = document.getElementById("num1").value;
    let number2 = document.getElementById("num2").value;
    document.getElementById("te").innerHTML = number1 * number2;
})

function sum() {
    document.getElementById("te").innerHTML = number1 + number2;

}

function mul() {
    document.getElementById("te").innerHTML = number1 * number2;

}

function sub() {
    document.getElementById("te").innerHTML = number1 - number2;

}

function div() {
    document.getElementById("te").innerHTML = number1 / number2;

}
var link = document.querySelector("a");
link.addEventListener("click", event => {
    event.preventDefault(); //prevent the Default event of the browser the link is not open 
    //when it will be clicked
});
window.addEventListener("keydown", event => {
    if (event.key = "v") {
        document.body.style.background = "black";
    }
});
window.addEventListener("keyup", event => {
    if (event.key = "v") {
        document.body.style.background = "";
    }
});