function omikujishow(){
  var omikuji = ["大吉","中吉","小吉"];
    
  var number = Math.random();
  if (number<0.1)
  var message = omikuji[number];
  
  var object = document.getElementById("omikuji");
  object.innerText = message;
}