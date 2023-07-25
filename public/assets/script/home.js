
const containerDom = document.querySelector("#search-results>.movies-content");
const swiperContainer = document.querySelector('.swiper-container');
const swiperWrapper = document.querySelector('.swiper-wrapper');

const prevButton = document.querySelector('.swiper-button-prev');
const nextButton = document.querySelector('.swiper-button-next');
const slideWidth = 220; // Larghezza della slide, considerando margini

let currentPosition = 0;
// document.getElementsByClassName


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

const swiperWrapper2 = document.querySelector('#search-results .swiper-wrapper');
const swiperContainer2 = document.querySelector('#search-results .swiper-container');

const prevButton2 = document.querySelector('#search-results .swiper-button-prev');
const nextButton2 = document.querySelector('#search-results .swiper-button-next');

prevButton2.addEventListener('click', () => {
    currentPosition = Math.max(currentPosition - slideWidth, 0);
    updateSwiperPosition2();
});
nextButton2.addEventListener('click', () => {
    let maxPosition = swiperWrapper2.scrollWidth - swiperContainer2.offsetWidth;
    currentPosition = Math.min(currentPosition + slideWidth, maxPosition);
    updateSwiperPosition2();
});

function updateSwiperPosition2() {
    swiperWrapper2.style.transform = `translateX(-${currentPosition}px)`;
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
            try {
                const url = this.getHost() + "s=" + title + "&";
                const response = await axios.post('http://localhost:3000/api/request-local', { title, url })
                console.log(response);
                for (const movie of response.data.data) {
                    if (movie.Poster === "N/A") {
                        continue;
                    }
                    const swiperSlide = document.createElement("div");
                    swiperSlide.classList.add("swiper-slide");

                    const filmImg = document.createElement("img");
                    filmImg.setAttribute("src", movie.poster);

                    filmImg.addEventListener("click", () => {
                        this.getMovieInfo(movie);
                    });

                    swiperSlide.appendChild(filmImg);
                    wrapper.appendChild(swiperSlide);
                }
            } catch (error) {
                console.error('Errore nella richiesta al server:', error);
            }
        },


        searchMovie: async function (title) {
            this.changeSection("search-results");
            const wrapper = document.querySelector("#search-results .swiper-wrapper");
            wrapper.innerHTML = "";
            try {
                const url = this.getHost() + "s=" + title + "&";
                const response = await axios.post('http://localhost:3000/api/request-to-server', { title, url })
                debugger;
                console.log(response);

                for (const movie of response.data.data) {
                    if (movie.Poster === "N/A") {
                        continue;
                    }
                    const swiperSlide = document.createElement("div");
                    swiperSlide.classList.add("swiper-slide");

                    const filmImg = document.createElement("img");
                    filmImg.setAttribute("src", movie.Poster);

                    filmImg.addEventListener("click", () => {
                        this.getMovieInfo(movie);
                    });

                    swiperSlide.appendChild(filmImg);
                    wrapper.appendChild(swiperSlide);
                }
            } catch (error) {
                console.error('Errore nella richiesta al server:', error);
            }
        },


        // testPromiseLastMovies: function () {
        //     return new Promise((resolve, reject) => {
        //         axios.get(this.getHost() + "s=super mario&type=movie")
        //             .then((risposta) => {

        //                 resolve(risposta.data);
        //             })
        //             .catch((err) => {
        //                 reject(err);
        //             })
        //     });
        // },

        // getLastMovies: async function () {
        //     const risposta = await this.testPromiseLastMovies();

        //     const containerDom = document.querySelector("#search-results>.movies-content");
        //     containerDom.innerHTML = "";

        //     for (const movie of risposta.Search) {
        //         console.log(movie)
        //         const domString = `<div class="swiper-slide">
        //       <div class="movie-box">
        //             <img class="movie-box-img" src="${movie.Poster}">
        //             <div class="box-text">
        //                 <h2 class="movie-title">${movie.Title}</h2>
        //                 <span class="movie-type">${movie.Year}</span>
        //                 <a href="#" class="watch-btn play-btn">
        //                     <i class="bx bx-right-arrow"></i>
        //                 </a>
        //             </div>
        //         </div>
        //     </div>`;
        //         containerDom.innerHTML += domString;
        //     }
        // },

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
                Ricerca.searchMovie(event.target.value);
            }
        })
    });
    console.log(searchButtons);

    // Ricerca.getLastMovies();
};