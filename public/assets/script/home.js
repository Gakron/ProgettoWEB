
const containerDom = document.querySelector("#search-results>.movies-content");
const swiperContainer = document.querySelector('.swiper-container');
const swiperWrapper = document.querySelector('.swiper-wrapper');
const prevButton = document.querySelector('.swiper-button-prev');
const nextButton = document.querySelector('.swiper-button-next');
const slideWidth = 220; // Larghezza della slide, considerando margini

let currentPosition = 0;

prevButton.addEventListener('click', () => {
  currentPosition = Math.max(currentPosition - slideWidth, 0);
  updateSwiperPosition();
});

nextButton.addEventListener('click', () => {
  const maxPosition = swiperWrapper.scrollWidth - swiperContainer.offsetWidth;
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

        searchMovie: async function (title) {
            this.changeSection("search-results");
            const risposta = (await axios.get(this.getHost() + "s=" + title + "&")).data;

            const swiperContainer = document.querySelector("#search-results .swiper-container");
            swiperContainer.innerHTML="";

            for (const movie of risposta.Search) {
                
                
                const swiperWrapper = document.createElement("div");
                swiperWrapper.classList.add("swiper-wrapper");

                const swiperSlide = document.createElement("img");
                swiperSlide.classList.add("swiper-slide");
                swiperSlide.setAttribute("src", movie.Poster);

                swiperSlide.addEventListener("click", () => {
                    this.getMovieInfo(movie);
                });



                swiperWrapper.appendChild(swiperSlide);


                swiperContainer.appendChild(swiperWrapper);
            }

        },

        testPromiseLastMovies: function () {
            return new Promise((resolve, reject) => {
                axios.get(this.getHost() + "s=super mario&type=movie")
                    .then((risposta) => {

                        resolve(risposta.data);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            });
        },

        getLastMovies : async function(){
            const risposta = await this.testPromiseLastMovies();

            const containerDom = document.querySelector("#search-results>.movies-content");
            containerDom.innerHTML = "";

            for(const movie of risposta.Search){
              console.log(movie)
              const domString = `<div class="swiper-slide">
              <div class="movie-box">
                    <img class="movie-box-img" src="${movie.Poster}">
                    <div class="box-text">
                        <h2 class="movie-title">${movie.Title}</h2>
                        <span class="movie-type">${movie.Year}</span>
                        <a href="#" class="watch-btn play-btn">
                            <i class="bx bx-right-arrow"></i>
                        </a>
                    </div>
                </div>
            </div>`;
            containerDom.innerHTML+=domString;
            }
          },

        getMovieInfo: async function(movie) {
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
        changeSection : function(name) {
            const secOld = document.getElementById(this.sectionOpened);
            secOld.classList.add("hidden");
            this.sectionOpened = name;
            const secNew = document.getElementById(this.sectionOpened);
            secNew.classList.remove("hidden");
        }
};



//send the request
document.querySelector(".search-input").addEventListener("keydown", async (event) => {
    if (!event.isComposing && event.key === "Enter") {
        Ricerca.searchMovie(event.target.value);
    }
});


Ricerca.getLastMovies();
  };