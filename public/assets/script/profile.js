



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

            const div_film = document.querySelector(".film .count");
            div_film.innerHTML = response.data.tot_film;

            const div_tempo_film = document.querySelector(".tempo-film .count");
            const tempoFilmInMinuti = response.data.tempo_film;
            const tempoFilmInOre = convertiMinutiInOre(tempoFilmInMinuti);
            div_tempo_film.innerHTML = tempoFilmInOre;

            const div_serie = document.querySelector(".serie .count ");
            div_serie.innerHTML = response.data.tot_serie;

        } catch (error) {
            console.error("Si è verificato un errore durante la richiesta:", error);
        }
    }

    async function commentiUtente(username) {
        try {
            const response = await axios.post('http://localhost:3000/api/get-comments-number', { username })


            const div_commenti = document.querySelector(".comment-count");
            div_commenti.innerHTML = response.data + " commenti";
        } catch (error) {
            console.error("Si è verificato un errore durante la richiesta:", error);
        }
    }

    async function generateFilmSlides(username) {
        const filmWrapper = document.querySelector("#film");
        filmWrapper.innerHTML = "";
        const swiperContainer = document.querySelector('#film-swiper');

        const prev = document.createElement("button");
        prev.textContent = "<";
        prev.classList.add("swiper-button-prev")

        const next = document.createElement("button");
        next.textContent = ">";
        next.classList.add("swiper-button-next");

        const response = await axios.post("http://localhost:3000/api/seen-films", { username })
        const risposta = response.data.resultsMedia;
        if(response.data.message==="nessun risultato"){
            filmWrapper.innerHTML="Nessun film visto";
            return;
        }
        for (let i = risposta.length - 1; i >= 0; i--) {
            const movie = risposta[i];

            if (movie.Type === "movie") {
                const swiperSlide = document.createElement("div");
                swiperSlide.classList.add("swiper-slide");

                const filmImg = document.createElement("img");
                filmImg.setAttribute("src", movie.Poster);


                swiperSlide.appendChild(filmImg);
                filmWrapper.appendChild(swiperSlide);

                currentPositionFilm = 0;
                let slideWidth = 150;

                swiperContainer.appendChild(prev);
                swiperContainer.appendChild(next);

                prev.addEventListener('click', () => {
                    currentPositionFilm = Math.max(currentPositionFilm - slideWidth, 0);
                    updateSwiperPositionFilm();
                });

                next.addEventListener('click', () => {
                    let maxPosition = filmWrapper.scrollWidth - swiperContainer.offsetWidth;
                    currentPositionFilm = Math.min(currentPositionFilm + slideWidth, maxPosition);
                    updateSwiperPositionFilm();
                });
                function updateSwiperPositionFilm() {
                    filmWrapper.style.transform = `translateX(-${currentPositionFilm}px)`;
                }
            }
        }
    }



    async function generateSerieSlides(username) {
        const serieWrapper = document.querySelector("#serie");
        serieWrapper.innerHTML = "";
        const swiperContainer = document.querySelector('#serie-swiper');

        const prev = document.createElement("button");
        prev.textContent = "<";
        prev.classList.add("swiper-button-prev")


        const next = document.createElement("button");
        next.textContent = ">";
        next.classList.add("swiper-button-next");

        const response = await axios.post("http://localhost:3000/api/seen-films", { username })
        const risposta = response.data.resultsMedia;

        if(response.data.message==="nessun risultato"){
            serieWrapper.innerHTML="Nessuna serie vista";
            return;
        }

        for (let i = risposta.length - 1; i >= 0; i--) {
            const movie = risposta[i];

            if (movie.Type === "series") {
                const swiperSlide = document.createElement("div");
                swiperSlide.classList.add("swiper-slide");

                const serieImg = document.createElement("img");
                serieImg.setAttribute("src", movie.Poster);



                swiperSlide.appendChild(serieImg);
                serieWrapper.appendChild(swiperSlide);


                currentPositionserie = 0;
                let slideWidth = 150;


                swiperContainer.appendChild(prev);
                swiperContainer.appendChild(next);

                prev.addEventListener('click', () => {
                    currentPositionserie = Math.max(currentPositionserie - slideWidth, 0);
                    updateSwiperPositionserie();
                });

                next.addEventListener('click', () => {
                    let maxPosition = serieWrapper.scrollWidth - swiperContainer.offsetWidth;
                    currentPositionserie = Math.min(currentPositionserie + slideWidth, maxPosition);
                    updateSwiperPositionserie();
                });
                function updateSwiperPositionserie() {
                    serieWrapper.style.transform = `translateX(-${currentPositionserie}px)`;
                }
            }
        }
    }

    


    generateFilmSlides(username);
    generateSerieSlides(username);
    trovaFilmVisti(username);
    commentiUtente(username);
}

function convertiMinutiInOre(minuti) {
    const ore = Math.floor(minuti / 60);
    const minutiRimasti = minuti % 60;
    return `${ore}h ${minutiRimasti}min`;
}

