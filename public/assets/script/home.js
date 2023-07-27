
const containerDom = document.querySelector("#search-results>.movies-content");
const swiperContainer = document.querySelector('.swiper-container');
const swiperWrapper = document.querySelector('.swiper-wrapper');

const prevButton = document.querySelector('.swiper-button-prev');
const nextButton = document.querySelector('.swiper-button-next');
const slideWidth = 220; // Larghezza della slide, considerando margini

let currentPosition = 0;
let currentPositionFilm = 0;
let currentPositionSerie = 0;


prevButton.addEventListener('click', () => {
    currentPosition = Math.max(currentPosition - slideWidth, 0);
    updateSwiperPosition();
});

nextButton.addEventListener('click', () => {
    let maxPosition = swiperWrapper.scrollWidth - swiperContainer.offsetWidth;
    currentPosition = Math.min(currentPosition + slideWidth, maxPosition);
    updateSwiperPosition();
});


function updateSwiperPosition() {
    swiperWrapper.style.transform = `translateX(-${currentPosition}px)`;
}






window.onload = () => {


    const Ricerca = {
        urlServer: "www.omdbapi.com",
        apiKey: "ebff564e",
        getHost: function () {
            return "https://" + this.urlServer + "/?apikey=" + this.apiKey + "&"
        },


        searchMovieLocal: async function (title) {
            this.changeSection("search-results");
            const wrapper = document.querySelector("#search-results .swiper-wrapper");
            wrapper.innerHTML = "";
            const header = document.querySelector("#search-results .heading");

            const prevHeadingTitle = header.querySelector(".heading-title");
            if (prevHeadingTitle) {
                prevHeadingTitle.remove();
            }

            const h2Element = document.createElement("h2");
            h2Element.classList.add("heading-title");
            h2Element.textContent = `Risultati della ricerca`;
            header.appendChild(h2Element);

            const filmResults = [];
            const serieResults = [];

            try {
                const url = this.getHost() + "s=" + title + "&";
                const response = await axios.post('http://localhost:3000/api/request-local', { title, url })
                console.log(response);

                if (response.data.message === 'Titolo non trovato nel database') {
                    // Nessun risultato trovato nel database locale
                    this.mostraMessaggioNessunRisultato(title);
                    return;
                }
                for (const movie of response.data.data) {
                    if (movie.Poster === "N/A") {
                        continue;
                    }
                    if (movie.Type === "movie") {
                        filmResults.push(movie); // Aggiungo il film all'array dei film
                    } else if (movie.Type === "series") {
                        serieResults.push(movie); // Aggiungo la serie TV all'array delle serie TV
                    }
                }
                if(filmResults.length > 0)
                    this.generateFilmSlides(filmResults);
                if(serieResults.length > 0)
                    this.generateSerieSlides(serieResults);

            } catch (error) {
                console.error('Errore nella richiesta al server:', error);
            }
        },

        mostraMessaggioNessunRisultato: function (title) {
            this.changeSection("no-results")

            const noResultsDiv = document.querySelector("#no-results-message");
            noResultsDiv.classList.remove("hidden");

            // Aggiungi l'evento di click al pulsante "Cerca approfonditamente"
            const searchAgainButton = document.querySelector("#search-again-button");
            searchAgainButton.addEventListener("click", () => {
                // Quando viene cliccato il pulsante "Cerca approfonditamente", esegui normalmente la funzione searchMovie
                this.searchMovie(title);

                // Nascondi il div del messaggio e del pulsante
                noResultsDiv.classList.add("hidden");
            });



        },


        searchMovie: async function (title) {
            this.changeSection("search-results");
            const wrappers = document.querySelectorAll("#search-results .swiper-wrapper");
            wrappers.forEach((elem) =>{
                elem.innerHTML="";
            });

            const header = document.querySelector("#search-results .heading");

            const prevHeadingTitle = header.querySelector(".heading-title");
            if (prevHeadingTitle) {
                prevHeadingTitle.remove();
            }

            const h2Element = document.createElement("h2");
            h2Element.classList.add("heading-title");
            h2Element.textContent = `Risultati della ricerca`;
            header.appendChild(h2Element);

            const filmResults = [];
            const serieResults = [];

            try {
                const url = this.getHost() + "s=" + title + "&";
                const response = await axios.post('http://localhost:3000/api/request-to-server', { title, url })

                const totalResults = response.data.data.length;
                h2Element.textContent = `Risultati della ricerca: ${totalResults} `;
                for (const movie of response.data.data) {
                    if (movie.Poster === "N/A") {
                        continue;
                    }
                    if (movie.Type === "movie") {
                        filmResults.push(movie); // Aggiungo il film all'array dei film
                    } else if (movie.Type === "series") {
                        serieResults.push(movie); // Aggiungo la serie TV all'array delle serie TV
                    }
                }
                if(filmResults.length > 0)
                    this.generateFilmSlides(filmResults);
                if(serieResults.length > 0)
                    this.generateSerieSlides(serieResults);
            } catch (error) {
                console.error('Errore nella richiesta al server:', error);
            }
        },

        // Funzione per generare le slide dei film
        generateFilmSlides: function (filmResults) {
            const filmWrapper = document.querySelector("#search-results #film");
            filmWrapper.innerHTML = "";
            const swiperTitle = document.querySelector("#search-results #swiper-title-film");
            swiperTitle.textContent = "Film results";

            const prev = document.createElement("button");
            prev.textContent = "<";
            prev.classList.add("swiper-button-prev")


            const next = document.createElement("button");
            next.textContent = ">";
            next.classList.add("swiper-button-next");

            for (const movie of filmResults) {
                const swiperSlide = document.createElement("div");
                swiperSlide.classList.add("swiper-slide");

                const filmImg = document.createElement("img");
                filmImg.setAttribute("src", movie.Poster);

                const filmTitle = document.createElement("h3");
                filmTitle.textContent = movie.Title;

                filmImg.addEventListener("click", () => {
                    this.getMovieInfo(movie);
                });

                swiperSlide.appendChild(filmImg);
                swiperSlide.appendChild(filmTitle);
                filmWrapper.appendChild(swiperSlide);
            }

            const swiperWrapperFilm = document.querySelector('#search-results #film-swiper');

            swiperWrapperFilm.appendChild(prev);
            swiperWrapperFilm.appendChild(next);


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
            


        },

        // Funzione per generare le slide delle serie TV
        generateSerieSlides: function (serieResults) {
            const serieWrapper = document.querySelector("#search-results #serie");
            serieWrapper.innerHTML = "";
            const swiperTitle = document.querySelector("#search-results #swiper-title-serie");
            swiperTitle.textContent = "Series results";

            const prev = document.createElement("button");
            prev.textContent = "<";
            prev.classList.add("swiper-button-prev")


            const next = document.createElement("button");
            next.textContent = ">";
            next.classList.add("swiper-button-next");

            for (const serie of serieResults) {
                const swiperSlide = document.createElement("div");
                swiperSlide.classList.add("swiper-slide");

                const serieImg = document.createElement("img");
                serieImg.setAttribute("src", serie.Poster);

                const serieTitle = document.createElement("h3"); // Creazione del tag <h3>
                serieTitle.textContent = serie.Title; // Impostazione del testo con il titolo della serie TV

                serieImg.addEventListener("click", () => {
                    this.getMovieInfo(serie);
                });

                swiperSlide.appendChild(serieImg);
                swiperSlide.appendChild(serieTitle);
                serieWrapper.appendChild(swiperSlide);
            }

            const swiperWrapperSerie = document.querySelector('#search-results #serie-swiper');

            swiperWrapperSerie.appendChild(prev);
            swiperWrapperSerie.appendChild(next);


            prev.addEventListener('click', () => {
                currentPositionSerie = Math.max(currentPositionSerie - slideWidth, 0);
                updateSwiperPositionSerie();
            });

            next.addEventListener('click', () => {
                let maxPosition = serieWrapper.scrollWidth - swiperContainer.offsetWidth;
                currentPositionSerie = Math.min(currentPositionSerie + slideWidth, maxPosition);
                updateSwiperPositionSerie();
            });
            function updateSwiperPositionSerie() {
                serieWrapper.style.transform = `translateX(-${currentPositionSerie}px)`;
            }

        },




        getMovieInfo: async function (movie) {
            this.changeSection("loader");
            const risposta = (await axios.get(this.getHost() + "i=" + movie.imdbID)).data;

            const titleDom = document.querySelector("#movie-info .movie-info-text h2");
            titleDom.innerHTML = risposta.Title;

            const imageDom = document.querySelector("#movie-info .movie-info-img");
            imageDom.setAttribute("src", risposta.Poster);

            const tagsDom = document.querySelector("#movie-info .movie-info-text .tags");
            tagsDom.innerHTML = "";
            const generi = risposta.Genre.split(", ");
            for (const genere of generi) {
                tagsDom.innerHTML += "<span>" + genere + "</span>";
            }

            this.changeSection("movie-info");


        },

        //UI

        sectionOpened: "popular",
        changeSection: function (name) {
            const secOld = document.getElementById(this.sectionOpened);
            secOld.classList.add("hidden");
            this.sectionOpened = name;
            const secNew = document.getElementById(this.sectionOpened);
            secNew.classList.remove("hidden");
        }



    };





    //send the request

    const searchButtons = document.querySelectorAll(".search-input");

    searchButtons.forEach(button => {
        button.addEventListener("keydown", async (event) => {
            if (!event.isComposing && event.key === "Enter") {
                Ricerca.searchMovieLocal(event.target.value);
            }
        })
    });
    console.log(searchButtons);

    // Ricerca.getLastMovies();
};