angular.module('movieApp').component('movieCat', {
  template:
    '<div ng-repeat="movie in $ctrl.movies" class="my-4 p-4 bg-gray-100 rounded-md">' +
      '<h2 class="text-xl font-semibold">{{ movie.original_title }}</h2>' +
      '<img ng-src="https://image.tmdb.org/t/p/w500/{{ movie.poster_path }}" alt="{{ movie.original_title }}" class="my-2 rounded">' +
      '<p class="text-gray-700">{{ movie.overview }}</p>' +
      '<div class="flex items-center mt-4">' +
        '<label class="text-gray-600 mr-2">Note:</label>' +
        '<select ng-model="movie.rating" ng-options="i for i in [1,2,3,4,5]" ng-change="$ctrl.saveRating(movie)"></select>' +
        '<span class="ml-2 text-gray-600">Rating actuel: {{ movie.rating }}</span>' +
        '<span class="ml-2 text-gray-600">Moyenne du rating: {{ movie.averageRating | number:1 }}</span>' +
      '</div>' +
    '</div>',
  controller: function($http) {
    const apiKey = '158a78c30db2054d22fa4dc6c45f92f4';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR&page=1`;

    this.movies = [];

    this.saveRating = function(movie) {
      localStorage.setItem(`movie_${movie.id}_rating`, movie.rating);
      this.calculateAverageRating(movie);
    };

    this.loadRating = function(movieId) {
      return JSON.parse(localStorage.getItem(`movie_${movieId}_ratings`) || '[]');
    };

    this.calculateAverageRating = function(movie) {
      let totalRating = 0;
      let totalVotes = 0;

      this.movies.forEach(m => {
        if (m.id === movie.id) {
          totalRating += movie.rating;
          totalVotes += movie.rating > 0 ? 1 : 0; 
        } else {
          totalRating += m.rating;
          totalVotes += m.rating > 0 ? 1 : 0;
        }
      });


      movie.averageRating = totalVotes > 0 ? totalRating / totalVotes : 0;
      console.log(totalRating,totalVotes);
    };

    $http.get(url).then(response => {
      this.movies = response.data.results.map(movie => ({
        ...movie,
        rating: this.loadRating(movie.id) || 0,
        averageRating: 0
      }));
      console.log(this.movies[0].original_title);
    });
  }
});
