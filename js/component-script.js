// Side Navigation
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

// Circle Follow Cusror
if (window.matchMedia("(min-width: 768px)").matches) {
    let mousePosX = 0,
        mousePosY = 0,
        mouseCircle = document.getElementById("mouse-circle");

    document.onmousemove = (e) => {
        mousePosX = e.pageX - 30;
        mousePosY = e.pageY - 30;
    };

    let delay = 1,
        revisedMousePosX = 0,
        revisedMousePosY = 0;

    function delayMouseFollow() {
        requestAnimationFrame(delayMouseFollow);

        revisedMousePosX += (mousePosX - revisedMousePosX) / delay;
        revisedMousePosY += (mousePosY - revisedMousePosY) / delay;

        mouseCircle.style.top = revisedMousePosY + "px";
        mouseCircle.style.left = revisedMousePosX + "px";
    }
    delayMouseFollow();
}

// Count To + Scroll To Top
let spanUp = document.querySelector(".up"); 
let achivement = document.querySelector(".our-achivement");
window.onscroll = function(){
    //Scroll To Top
    if(this.scrollY >= 1000){
        spanUp.classList.add("show");
    }else{
        spanUp.classList.remove("show");
    }

    //Count To
    if(window.scrollY >= achivement.offsetTop - 600){
        //Fire Counter Our Achivment
        $(".count").countTo();
    }
};

// Scroll To Top On Click
spanUp.onclick = function(){
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};
