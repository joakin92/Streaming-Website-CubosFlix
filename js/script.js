let page = 0;
const maxPage = 2;
const moviesPerPage = 6;

async function getMovies() {

    try {
        const response = await api.get('/discover/movie?language=pt-BR&include_adult=false', {});
        roll = response.data.results.reduce((movies, movie, movieId) => {
            const currentPage = Math.floor(movieId / moviesPerPage);
            movies[currentPage] = movies[currentPage] || [];
            movies[currentPage].push(movie);
            return movies;
        }, []);
        displayMovies();
    } catch (error) {
        console.log(error.response);
    }
};

getMovies();

const moviesList = document.querySelector('.movies');

async function displayMovies() {
    moviesList.innerHTML = '';
    for (const movie of roll[page]) {

        const picture = document.createElement('div');
        picture.classList.add('movie');
        picture.style.backgroundImage = `url(${movie.poster_path})`;

        picture.addEventListener('click', async () => {
            const movieData = await getMovie(movie.id);
            showModal(movieData);
        });

        const info = document.createElement('div');
        info.classList.add('movie__info');
        const title = document.createElement('span');
        title.classList.add('movie__title');
        title.textContent = movie.title;
        const rating = document.createElement('span');
        rating.classList.add('movie__rating');
        const star = document.createElement('img');
        star.src = './assets/estrela.svg';
        star.alt = 'Estrela';

        rating.textContent = movie.vote_average;
        rating.style.color = "#ffffff";


        moviesList.appendChild(picture);
        picture.appendChild(info);
        info.append(title, rating);
        rating.appendChild(star);
    }
};

async function getMovie(id) {
    try {
        const response = await api.get(`/movie/${id}?language=pt-BR`);
        return response.data;
    } catch (error) {
        console.log(error.response);
    }
};

const modal = {
    mode: document.querySelector('.hidden'),
    title: document.querySelector('.modal__title'),
    image: document.querySelector('.modal__img'),
    description: document.querySelector('.modal__description'),
    average: document.querySelector('.modal__average'),
    genres: document.querySelector('.modal__genres'),
    close: document.querySelector('.modal__close'),
};

function showModal(movie) {
    modal.title.textContent = movie.title;
    modal.image.src = movie.backdrop_path;
    modal.image.style.backgroundSize = 'cover';
    modal.description.textContent = movie.overview;
    modal.average.textContent = movie.vote_average.toFixed(1);
    modal.genres.innerHTML = movie.genres.map(genre => `<span class="modal__genre">${genre.name}</span>`).join('');
    modal.mode.classList.remove('hidden');
};

modal.close.addEventListener('click', () => {
    modal.genres.innerHTML = '';
    modal.mode.classList.add('hidden');
});

const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');

btnNext.addEventListener('click', () => {
    if (page === maxPage) {
        page = 0;
    } else {
        page++;
    }
    displayMovies();
});

btnPrev.addEventListener('click', () => {
    if (page === 0) {
        page = maxPage;
    } else {
        page--;
    }
    displayMovies();
});

const searchInput = document.querySelector('input');

searchInput.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
        const input = searchInput.value.trim();
        const moviesPerPage = 6;
        try {
            const response = await api.get(`/search/movie?language=pt-BR&include_adult=false&query=${input}`);
            moviesList.innerHTML = '';

            roll = response.data.results.reduce((movies, movie, movieId) => {
                const currentPage = Math.floor(movieId / moviesPerPage);
                movies[currentPage] = movies[currentPage] || [];
                movies[currentPage].push(movie);
                return movies;
            }, []);

            page = 0;

            displayMovies();

        } catch (error) {
            console.log(error.response);
        }
    } if (!searchInput.value && event.key === 'Enter') {
        getMovies();

    } if (event.key === 'Backspace' && !searchInput.value) {
        getMovies();
    }
});

async function highlightArea() {
    try {
        const response = await api.get('movie/436969?language=pt-BR', {});
        const trailer = await api.get('movie/436969/videos?language=pt-BR', {});
        movie = response.data;

        const highlightVideo = document.querySelector(".highlight__video");
        highlightVideo.style.backgroundImage = `url(${movie.backdrop_path})`;
        highlightVideo.style.backgroundSize = "cover";

        const highlightTitle = document.querySelector(".highlight__title");
        highlightTitle.textContent = movie.title;

        const highlightGenres = document.querySelector(".highlight__genres");
        highlightGenres.textContent = movie.genres.map((genres) => genres.name).join(", ");

        const highlightRating = document.querySelector(".highlight__rating");
        highlightRating.textContent = movie.vote_average.toFixed(1);


        const highlightLaunch = document.querySelector(".highlight__launch");
        highlightLaunch.textContent = new Date(movie.release_date).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });

        const highlightDescription = document.querySelector(".highlight__description");
        highlightDescription.textContent = movie.overview;

        const highlightVideoLink = document.querySelector(".highlight__video-link");
        highlightVideoLink.href = `https://www.youtube.com/watch?v=${trailer.data.results[1]}`;

    } catch (error) {
        console.log(error.response);
    }
};

highlightArea()

const btnTheme = document.querySelector('.btn-theme');
const root = document.querySelector(':root');
const logo = document.querySelector('.header__container-logo img')

btnTheme.addEventListener("click", () => {
    if (localStorage.getItem("theme") === "dark") {
        themeLight();
    } else {
        themeDark();
    }
});

function themeLight() {
    searchInput.style.background = "#fff";
    localStorage.setItem("theme", "light");
    root.style.setProperty('--background', '#FFF');
    root.style.setProperty('--input-color', '#979797');
    root.style.setProperty('--text-color', '#1b2028');
    root.style.setProperty('--bg-secondary', '#ededed');
    btnTheme.src = './assets/light-mode.svg';
    btnPrev.src = './assets/arrow-left-dark.svg';
    btnNext.src = './assets/arrow-right-dark.svg';
    logo.src = './assets/logo-dark.png';
    modal.close.src = './assets/close-dark.svg';
};

function themeDark() {
    searchInput.style.background = "#3E434D";
    searchInput.style.border = "1px solid #665F5F";
    localStorage.setItem("theme", "dark");
    root.style.setProperty('--background', '#1B2028');
    root.style.setProperty('--input-color', '#ffffff');
    root.style.setProperty('--text-color', '#ffffff');
    root.style.setProperty('--bg-secondary', '#2D3440');
    btnTheme.src = './assets/dark-mode.svg';
    btnPrev.src = './assets/arrow-left-light.svg';
    btnNext.src = './assets/arrow-right-light.svg';
    logo.src = './assets/logo.svg';
    modal.close.src = './assets/close.svg';
};