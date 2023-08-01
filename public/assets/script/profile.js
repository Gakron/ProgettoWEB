

window.onload = () => {

    const logo= document.querySelector(".logo");
    logo.addEventListener("click", ()=>{
        window.location.assign("/public/pages/home.html")
    })


    const profile_name=document.querySelector(".profile-name");
    profile_name.innerHTML="";

}