
const containerDom = document.querySelector("#search-results>.movies-content");
const swiperContainer = document.querySelector('.swiper-container');
const swiperWrapper = document.querySelector('.swiper-wrapper');

const prevButton = document.querySelector('.swiper-button-prev');
const nextButton = document.querySelector('.swiper-button-next');

const slideWidth = 225; // Larghezza della slide, considerando margini
let currentPositionFilm = 0;
let currentPositionSerie = 0;

let ultimaRicerca;
let currentMedia; //occhio che salva l'id, non il titolo





window.onload = () => {


    const Ricerca = {
        urlServer: "www.omdbapi.com",
        apiKey: "ebff564e",
        getHost: function () {
            return "https://" + this.urlServer + "/?apikey=" + this.apiKey + "&"
        },


        getPopulars: async function () {
            const wrapper = document.querySelector('#popular #film');
            wrapper.innerHTML = '';
            const wrapper2 = document.querySelector('#popular #serie');
            wrapper2.innerHTML = '';

            try {
                const response = await axios.get('http://localhost:3000/api/populars/film');
                const popularFilms = response.data.data;
                const response2 = await axios.get('http://localhost:3000/api/populars/series');
                const popularSeries = response2.data.data;
                console.log(popularFilms)
                console.log(popularSeries)

                if (popularFilms.length > 0) {
                    this.generateFilmSlidesPopulars(popularFilms);
                } else {
                    // Nessun film trovato con Year=2023
                }
                if (popularSeries.length > 0) {
                    this.generateSeriesSlidesPopulars(popularSeries);
                } else {
                    // Nessun film trovato con Year=2023
                }


            } catch (error) {
                console.error('Errore nella richiesta al server:', error);
            }
        },



        searchMovieLocal: async function (title) {
            this.changeSection("loader");

            const wrapper = document.querySelector("#search-results .swiper-wrapper");
            wrapper.innerHTML = "";
            const header = document.querySelector("#search-results .heading");

            const prevHeadingTitle = header.querySelector(".heading-title");
            if (prevHeadingTitle) {
                prevHeadingTitle.remove();
            }


            // const filmResults = [];
            // const serieResults = [];

            try {
                const url = this.getHost() + "s=" + title + "&";
                const response = await axios.post('http://localhost:3000/api/request-local', { title, url })
                console.log(response);

                if (response.data.message === 'Titolo non trovato nel database') {
                    // Nessun risultato trovato nel database locale
                    this.mostraMessaggioNessunRisultato(title);
                    return;
                }

                const filmResults = [];
                const serieResults = [];

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

                if (filmResults.length > 0)
                    this.generateFilmSlides(filmResults);
                if (serieResults.length > 0)
                    this.generateSerieSlides(serieResults);

                this.changeSection("search-results");

            } catch (error) {
                console.error('Errore nella richiesta al server:', error);
            }
        },

        mostraMessaggioNessunRisultato: function (title) {
            this.changeSection("no-results")

            const noResultsDiv = document.querySelector("#no-results-message");
            noResultsDiv.classList.remove("hidden");

            const messaggio = document.querySelector("#no-results h2");
            messaggio.innerHTML = "Non ho trovato nulla al momento"

            // Aggiungi l'evento di click al pulsante "Cerca approfonditamente"
            const searchAgainButton = document.querySelector("#search-again-button");
            searchAgainButton.classList.remove("hidden");
            searchAgainButton.addEventListener("click", () => {
                // Quando viene cliccato il pulsante "Cerca approfonditamente", esegui normalmente la funzione searchMovie
                this.searchMovie(title);

                // Nascondi il div del messaggio e del pulsante
                noResultsDiv.classList.add("hidden");

            });
        },

        mostraMessaggioNessunRisultatoOnline: function (title) {
            this.changeSection("no-results")
            const noResultsDiv = document.querySelector("#no-results-message");
            noResultsDiv.classList.remove("hidden");

            const messaggio = document.querySelector("#no-results h2");
            messaggio.innerHTML = "Titolo non disponibile"

            const searchAgainButton = document.querySelector("#search-again-button");
            searchAgainButton.classList.add("hidden");


        },


        searchMovie: async function (title) {
            this.changeSection("loader");
            const wrapperfilm = document.querySelector("#search-results #film");
            wrapperfilm.innerHTML = "";
            const wrapperserie = document.querySelector("#search-results #serie");
            wrapperserie.innerHTML = "";

            const header = document.querySelector("#search-results .heading");

            const prevHeadingTitle = header.querySelector(".heading-title");
            if (prevHeadingTitle) {
                prevHeadingTitle.remove();
            }



            const filmResults = [];
            const serieResults = [];
            try {
                const url = this.getHost() + "s=" + title + "&";
                const response = await axios.post('http://localhost:3000/api/request-to-server', { title, url })

                if (response.data.message === 'Titolo non trovato online') {
                    // Nessun risultato trovato nel database locale
                    this.mostraMessaggioNessunRisultatoOnline(title);
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
                if (filmResults.length > 0)
                    this.generateFilmSlides(filmResults);
                if (serieResults.length > 0)
                    this.generateSerieSlides(serieResults);


                this.changeSection("search-results");
            } catch (error) {
                console.error('Errore nella richiesta al server:', error);
            }
        },

        searchMovieBetter: async function (title) {
            this.changeSection("loader");
            const wrapperfilm = document.querySelector("#search-results #film");
            wrapperfilm.innerHTML = "";
            const wrapperserie = document.querySelector("#search-results #serie");
            wrapperserie.innerHTML = "";

            const header = document.querySelector("#search-results .heading");

            const prevHeadingTitle = header.querySelector(".heading-title");
            if (prevHeadingTitle) {
                prevHeadingTitle.remove();
            }



            const filmResults = [];
            const serieResults = [];
            try {
                const url = this.getHost() + "s=" + title + "&";
                const response = await axios.post('http://localhost:3000/api/request-to-server-better', { title, url })

                if (response.data.message === 'Titolo non trovato online') {
                    // Nessun risultato trovato nel database locale
                    this.mostraMessaggioNessunRisultatoOnline(title);
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
                if (filmResults.length > 0)
                    this.generateFilmSlides(filmResults);
                if (serieResults.length > 0)
                    this.generateSerieSlides(serieResults);


                this.changeSection("search-results");
            } catch (error) {
                console.error('Errore nella richiesta al server:', error);
            }
        },

        // Funzione per generare le slide dei film
        generateFilmSlides: async function (filmResults) {

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

            for (let i = filmResults.length - 1; i >= 0; i--) {
                const movie = filmResults[i];
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

            currentPositionFilm = 0;

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
        generateSerieSlides: async function (serieResults) {

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

            for (let i = serieResults.length - 1; i >= 0; i--) {
                const serie = serieResults[i];

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


            currentPositionSerie = 0;

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


        generateFilmSlidesPopulars: function (filmResults) {
            const filmWrapper = document.querySelector("#popular #film");
            filmWrapper.innerHTML = "";
            const swiperTitle = document.querySelector("#popular #swiper-title-film-pop");
            swiperTitle.textContent = "Popular Films";

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

            const swiperWrapperFilm = document.querySelector('#popular #film-swiper');

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
        generateSeriesSlidesPopulars: function (serieResults) {

            const serieWrapper = document.querySelector("#popular #serie");
            serieWrapper.innerHTML = "";
            const swiperTitle = document.querySelector("#popular #swiper-title-serie-pop");
            swiperTitle.textContent = "Popular Series";

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

            const swiperWrapperSerie = document.querySelector('#popular #serie-swiper');

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
            const url = this.getHost();
            const id = movie.imdbID;
            const username = sessionStorage.getItem("username");

            const response = await axios.post('http://localhost:3000/api/request-plot', { id, url, username })

            const titleDom = document.querySelector("#movie-info .movie-info-text h2");
            titleDom.innerHTML = movie.Title;

            const imageDom = document.querySelector("#movie-info .movie-info-img");
            imageDom.setAttribute("src", movie.Poster);

            const plotDom = document.querySelector("#movie-info .trama");
            plotDom.innerHTML = response.data.Plot;

            const yearDom = document.querySelector("#movie-info .anno");
            yearDom.innerHTML = "Release date: " + response.data.Released;

            const genreDom = document.querySelector("#movie-info .generi");
            console.log(movie.Genre);
            genreDom.innerHTML = "Genre: " + response.data.Genre

            console.log(response.data.Seen);
            const bottone=document.querySelector(".visto-button")
            if(response.data.Seen){
                bottone.innerHTML="Seen";
                bottone.disabled = true;
            }
            else{
                bottone.innerHTML="Mark as seen";
            }

            currentMedia = movie.imdbID;
            this.changeSection("movie-info");
        },

        getCurrentDateAndHour: function () {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Mese è zero-based (0 per gennaio, 11 per dicembre), quindi aggiungo 1
            const year = today.getFullYear();
            const hours = String(today.getHours()).padStart(2, '0');
            const minutes = String(today.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}`;
        },

        getCurrentDate: function () {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Mese è zero-based (0 per gennaio, 11 per dicembre), quindi aggiungo 1
            const year = today.getFullYear();

            return `${year}-${month}-${day}`;
        },

        markAsWatched: async function () {
            const id = currentMedia;
            const utente = sessionStorage.username;
            const date = this.getCurrentDate()
            const response = await axios.post('http://localhost:3000/api/mark-as-watched', { id, utente, date });
            if (response.data === "Già visto") {
                alert("This is already marked as seen");
            }
            const watchButton = document.querySelector('.visto-button');
            watchButton.innerHTML = "Seen";
            watchButton.disabled = true;


        },


        sectionOpened: "popular",
        changeSection: function (name) {
            const secOld = document.getElementById(this.sectionOpened);
            secOld.classList.add("hidden");
            this.sectionOpened = name;
            const secNew = document.getElementById(this.sectionOpened);
            secNew.classList.remove("hidden");
        }



    };

    const searchBetterButton = document.querySelector(".cerca-meglio");
    searchBetterButton.addEventListener("click", () => {
        console.log(ultimaRicerca);
        Ricerca.searchMovieBetter(ultimaRicerca);
    })


    const searchInputs = document.querySelectorAll(".search-input");
    const suggestionsDivs = document.querySelectorAll(".suggestions");

    searchInputs.forEach((searchInput, index) => {
        searchInput.addEventListener("click", async () => {
            searchInput.value = "";
        });
    });


    searchInputs.forEach((searchInput, index) => {
        searchInput.addEventListener("input", async () => {
            const searchText = searchInput.value.trim();
            const suggestionsDiv = suggestionsDivs[index];


            if (searchText) {
                try {
                    const response = await axios.post('http://localhost:3000/api/real-time-search', {
                        title: searchText,
                    });
                    const suggestions = response.data.data;

                    showSuggestions(suggestions, suggestionsDiv);
                } catch (error) {
                    console.error('Errore nella richiesta al server:', error);
                }
            } else {
                hideSuggestions(suggestionsDiv);
            }


        });
    });




    // In questo codice, utilizzo un oggetto uniqueSuggestions per verificare 
    // se un titolo è già stato aggiunto ai suggerimenti. Se un titolo non è ancora presente 
    // nell'oggetto, lo aggiungo ai suggerimenti e imposto uniqueSuggestions[suggestion.Title] a true 
    // nell'oggetto per indicare che il titolo è stato già visto.

    function showSuggestions(suggestions, suggestionsDiv) {
        suggestionsDiv.innerHTML = '';

        const uniqueSuggestions = {};

        for (const suggestion of suggestions) {
            if (!uniqueSuggestions[suggestion.Title]) {
                uniqueSuggestions[suggestion.Title] = true;
                const suggestionElement = document.createElement('div');
                suggestionElement.textContent = suggestion.Title;
                suggestionElement.classList.add('suggestion-item');

                suggestionElement.addEventListener('click', () => {
                    searchInputs.forEach((input, index) => {
                        input.value = suggestion.Title;
                        const suggestionsDiv = suggestionsDivs[index];
                        hideSuggestions(suggestionsDiv);
                    });
                    ultimaRicerca = suggestion.Title;
                    Ricerca.searchMovieLocal(suggestion.Title);
                });


                suggestionsDiv.appendChild(suggestionElement);
            }
        }

        suggestionsDiv.style.display = 'block';
    }

    function hideSuggestions(suggestionsDiv) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.style.display = 'none';
    }


    //send the request

    const searchButtons = document.querySelectorAll(".search-input");

    searchButtons.forEach(button => {
        button.addEventListener("keydown", async (event) => {
            if (!event.isComposing && event.key === "Enter") {
                ultimaRicerca = event.target.value;
                Ricerca.searchMovieLocal(event.target.value);
            }

            suggestionsDivs.forEach(div => {
                hideSuggestions(div);
            })


        })
    });


    const profile = document.querySelector(".profile");
    profile.addEventListener("click", () => {
        window.location.assign("/public/pages/profile.html")
    })
    const profile_txt = document.querySelector(".profile-box span");
    profile_txt.addEventListener("click", () => {
        window.location.assign("/public/pages/profile.html")
    })


    const seenButton = document.querySelector(".visto-button");
    seenButton.addEventListener("click", () => {
        Ricerca.markAsWatched();
        seenButton.innerHTML="Seen";
        seenButton.disabled=true;
    })

    const logo = document.querySelector(".logo img")
    logo.addEventListener("click", () => {
        Ricerca.changeSection("popular")
    })

    Ricerca.getPopulars();
};

