function check_grade_succes(result)
{
    console.log("create function ",result);
}
function check_grade_fail(result)
{
    console.log("fail to create ");
}
//simple way 
function check_result()
{
    console.log("print");
}

check_result(setting,check_grade_fail,check_grade_succes);
//using promise
check_result(setting).then(check_grade_fail,check_grade_succes);

function doSomething()
{
    console.log("current");
}

doSomething().then(function (result) {
    return doSomethingElse(result);
  })
  .then(function (newResult) {
    return doThirdThing(newResult);
  })
  .then(function (finalResult) {
    console.log(`Got the final result: ${finalResult}`);
  })
  .catch(failureCallback);
// var json_data=$.getJSON('data.json');
// console.log(json_data)
var data=fetch("data.json")
  .then(response => response.json())
  .then(json => console.log(json));
console.log(json_data)