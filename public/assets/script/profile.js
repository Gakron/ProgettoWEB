

window.onload = () => {

    const logo = document.querySelector(".logo");
    logo.addEventListener("click", () => {
        window.location.assign("/public/pages/home.html")
    })


    const profile_name = document.querySelector(".username");
    const username = sessionStorage.getItem("username");
    profile_name.innerHTML = username;

    
    

    async function trovaFilmVisti(username) {
        try {
            const response = await axios.post('http://localhost:3000/api/get-watched', { username })

            const div_film = document.querySelector(".film");
            div_film.innerHTML = "Film visti: " + response.data.tot_film;

            const div_tempo_film = document.querySelector(".tempo-film");
            div_tempo_film.innerHTML = "Totale ore film: " + response.data.tempo_film;

            const div_serie = document.querySelector(".serie");
            div_serie.innerHTML = "Serie viste: " + response.data.tot_serie;

        } catch (error) {
            console.error("Si è verificato un errore durante la richiesta:", error);
        }
    }

    async function commentiUtente(username){
        try {
            const response = await axios.post('http://localhost:3000/api/get-comments-number', { username })
        
            
            const div_commenti = document.querySelector(".comment-count");
            div_commenti.innerHTML = response.data + " commenti";
        } catch (error) {
            console.error("Si è verificato un errore durante la richiesta:", error);
        }
    }

    trovaFilmVisti(username);
    commentiUtente(username);
    


    // const comment_count= document.querySelector(".comment_count");
    // comment_count.innerHTML=num_commenti + " commenti";
}