const api = axios.create({
    baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev/3',
    timeOUT: 10000,
    headers: { 'Content-Type': 'Application/json' }
});

