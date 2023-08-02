

window.onload = () => {

    const logo= document.querySelector(".logo");
    logo.addEventListener("click", ()=>{
        window.location.assign("/public/pages/home.html")
    })


    const profile_name=document.querySelector(".username");
    const username=sessionStorage.getItem("username");
    profile_name.innerHTML=username;

}