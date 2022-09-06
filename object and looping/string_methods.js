function string_methods()
{
const string = 'This is simple string';
//Looping throw string using .length method
for(let i=0;i<string.length;i++)
{

    // console.log(string[i])
    if (string[i]=='s')
    {
        
        console.log("this is sring ",string[i]);

    }
}
//sub string finding
if(string.includes("is"))
{
    console.log("include");
}
else{
    console.log("not find sub string");
}
if (string.startsWith("This"))
{
    console.log("start with this ");
}
else{
    console.log("not start with this ");
}
}
//Finding index of char in string
function finding_index(string_check,x)
{
    console.log("index is ",string_check.indexOf(x));
    //slicing of index 
    console.log(string_check.slice(1,3));
}
const list = document.getElementById("testing");
const list_massage=['jack','msg','check','item'];
for(check of list_massage)
{
    var new_item=document.createElement('li');
    new_item.textContent=check;
    list.append(new_item);
    
}