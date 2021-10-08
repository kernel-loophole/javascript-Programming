// replace al the match  elemet with link a tag
      //###############################     NOTE ##########################
      //***************************BE CARE FULL **************************
      //$(document).ready(function () {$("div").wrapAll('a')  });



      // make link after every div elements
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
     


// moving  Ball animation 
anime({
  targets: '#ball',
  left: '240px',
  loop:true,
  direction:"alternate",
  backgroundColor: '#FFF',
  borderRadius: ['0%', '50%'],
  easing: 'easeInOutQuad'
});

// window loading module 
      $(window).onload(function(){
        anime({
  targets: '.ball',
  translateX: 270,
  loop:true,
  setTimeout:2000,
  direction:"alternate",
  rotate: anime.stagger([-360, 360]), // rotation will be distributed from -360deg to 360deg evenly between all elements
  easing: 'easeInOutQuad'
});

      });
//animation that only on form element


function myfunction() {
  myVar = setTimeout(loading,2000);
};






        //select all li tags
        $('li').hover(function(){$(this).css('font-weight','bold');});
        //select all the p tags in HTML
        $('p').hover(function(){$(this).css('font-weight','bold');});
      
        var clickthe=0;
         function clickthebutton()//check how many times user click the button
        {
            clickthe++;
            var button=$("#click");
            button.html(clickthe+"times");
            if(clickthe>10){alert("you click to many times");}};
      
        var test=$("#clickme");
        test.click(clickthebutton);
        
        //select the id from HTML and the attribute accordingly
         $(document).click(function(){
           var test=$('#makered');
          var ma=0;
          if(ma===0)
          {
            $("#makeitsimple").addClass("makeit");
          }
        });
         $('#makeform').attr('disabled', true);
        //select element from HTML and ADD the class to heading id
 
        $(document).hover(function(){$('#heading').addClass("abc");},function(){
           $('#heading').removeClass("abc");
       });
       //########### function to change the background  of selected id################
       
       $(document).click(function(){$("form").addClass(("background1"));});
        // aslo write as $(#clickme).click(clickbutton);