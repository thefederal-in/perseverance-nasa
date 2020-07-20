var cirlceMenuActive = 0;
function expand() {
    if(cirlceMenuActive === 0){
        document.getElementById("menu").style.transform="scale(3)";
        document.getElementById("toggleicon").style.transform="rotate(45deg)";
        document.getElementById("toggleicon").innerHTML="-";
        cirlceMenuActive = 1;
    }else {
        document.getElementById("menu").style.transform="scale(0)";
        document.getElementById("toggleicon").style.transform="rotate(0deg)";
        document.getElementById("toggleicon").innerHTML="+";
        cirlceMenuActive = 0;
    }
}
  