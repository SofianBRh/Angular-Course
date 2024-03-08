angular.module('movieApp').component('movieCat', {
  template:
    '<div ng-repeat="movie in $ctrl.movies" class="my-4 p-4 bg-gray-100 rounded-md">' +
      '<h2 class="text-xl font-semibold">{{ movie.original_title }}</h2>' +
      '<img ng-src="https://image.tmdb.org/t/p/w500/{{ movie.poster_path }}" alt="{{ movie.original_title }}" class="my-2 rounded">' +
      '<p class="text-gray-700">{{ movie.overview }}</p>' +
      '<div class="flex items-center mt-4">' +
        '<label class="text-gray-600 mr-2">Note:</label>' +
        '<select ng-model="movie.rating" ng-options="i for i in [1,2,3,4,5]" ng-change="$ctrl.saveRating(movie)"></select>' +
        '<span class="ml-2 text-gray-600">Moyenne du rating: {{ movie.averageRating | number:1 }}</span>' +
        '<span class="ml-2 text-gray-600">Nombre de votants: {{ movie.votesCount }}</span>' +
      '</div>' +
    '</div>',
  controller: function($http) {
    const apiKey = '158a78c30db2054d22fa4dc6c45f92f4';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR&page=1`;

    this.movies = [];

    this.saveRating = function(movie) {
      // Charge les votes existants depuis le localStorage
      const existingVotes = JSON.parse(localStorage.getItem(`movie_${movie.id}_votes`)) || [];

      // Ajoute le nouveau vote à la liste
      existingVotes.push(movie.rating);

      // Enregistre la liste des votes et le nombre de votants dans le localStorage
      localStorage.setItem(`movie_${movie.id}_votes`, JSON.stringify(existingVotes));
      localStorage.setItem(`movie_${movie.id}_votesCount`, existingVotes.length);

      // Recalcul de la moyenne du rating pour le film spécifique
      this.calculateAverageRating(movie);
    };

    this.loadRating = function(movieId) {
      // Charge le dernier vote depuis le localStorage
      const existingVotes = JSON.parse(localStorage.getItem(`movie_${movieId}_votes`)) || [];
      return existingVotes.length > 0 ? existingVotes[existingVotes.length - 1] : 0;
    };

    this.calculateAverageRating = function(movie) {
      // Charge les votes existants depuis le localStorage
      const existingVotes = JSON.parse(localStorage.getItem(`movie_${movie.id}_votes`)) || [];

      // Calcule la somme des votes et le nombre de votants
      const totalRating = existingVotes.reduce((acc, curr) => acc + curr, 0);
      const votesCount = existingVotes.length;

      // Calcule la moyenne du rating pour le film spécifique
      movie.averageRating = votesCount > 0 ? totalRating / votesCount : 0;
      movie.votesCount = votesCount;
    };

    // Récupérer une liste de films populaires depuis l'API TMDb
    $http.get(url).then(response => {
      this.movies = response.data.results.map(movie => ({
        ...movie,
        rating: this.loadRating(movie.id) || 0,
        averageRating: 0, // Ajout de la propriété averageRating
        votesCount: 0 // Ajout de la propriété votesCount
      }));
      console.log(this.movies[0].original_title);
    });
  }
});