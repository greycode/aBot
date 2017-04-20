console.info("a robot 加载完成 👽");

var a = document.createElement("a"); 
var i = document.querySelector('body div >img'); 
a.href = i.src; 
a.download = i.id + '.jpg'; a.click();