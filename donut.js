//get id from url whre ?id=
var url = window.location.href;
var id = url.substring(url.lastIndexOf('=') + 1);

//create element p
var p = document.createElement("p");
p.innerHTML = "ID: " + id;
document.body.appendChild(p);