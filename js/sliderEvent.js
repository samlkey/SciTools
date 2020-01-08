var count = 0;
function toggleSidebar(){
    document.getElementById("sidebar").classList.toggle('active');
    document.getElementById("sidebar").style.transition = "all 1s";
    document.getElementById("circle").style.transition = "all 1s";
    document.querySelector("span").style.transition = "all 1s";
    document.querySelectorAll("span")[1].style.transition = "all 1s";
    count++;
    if(count % 2 == 1)
    {
        document.getElementById("map").style.transition = "all 1s";
        document.getElementById("map").style.marginLeft = "40%";
        document.getElementById('map').style.width = "60%";      
        document.getElementById('circle').style.transform = "rotate(180deg)";
        document.getElementById('circle').style.transformOrigin = "center left";
        document.getElementById('circle').style.backgroundColor = "black";
        document.querySelector("span").style.backgroundColor = "white";
        document.querySelectorAll("span")[1].style.backgroundColor = "white";
    }
    else
    {
        document.getElementById("map").style.marginLeft = "0%";
        document.getElementById('map').style.width = "100%";
        document.getElementById('circle').style.transform = "rotate(360deg)";
        document.getElementById('circle').style.backgroundColor = "white";
        document.querySelector("span").style.backgroundColor = "black";
        document.querySelectorAll("span")[1].style.backgroundColor = "black";
    }
}