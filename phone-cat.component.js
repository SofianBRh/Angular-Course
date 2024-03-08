angular.module('movieApp').component('movieCat', {
  template:
    '<div class="grid grid-cols-2 gap-8">' +
    '<div class="float-right mt-2">' +
    '<img src="./englishFlag.png" ng-click="$ctrl.toggleLanguage()" alt="English" ng-show="$ctrl.language === \'fr\'">' +
    '<img src="./frenchFlag.png" ng-click="$ctrl.toggleLanguage()" alt="French" ng-show="$ctrl.language === \'en\'">' +
    '</div>' +
    '<button ng-click="$ctrl.toggleSort()" class="bg-green-500 text-white p-2 rounded">{{ \'Classer par score de Wilson\' | translate }}</button>' +
    '<div ng-repeat="movie in $ctrl.movies | orderBy:$ctrl.sortBy" class="my-4 p-4 bg-gray-100 rounded-md">' +
    '<h2 class="text-xl font-semibold">{{ \'Titre:\' | translate }} {{ movie.translated_title || movie.original_title }}</h2>' +
    '<img ng-src="https://image.tmdb.org/t/p/w500/{{ movie.poster_path }}" alt="{{ movie.original_title }}" class="my-2 w-1/3 rounded">' +
    '<p class="text-gray-700">{{ movie.overview }}</p>' +
    '<div class="flex items-center mt-4">' +
    '<label class="text-gray-600 mr-2">{{ \'Note:\' | translate }}</label>' +
    '<select ng-model="movie.rating" ng-options="i for i in [1,2,3,4,5]" ng-change="$ctrl.saveRating(movie)"></select>' +
    '<span class="ml-2 text-gray-600">{{ \'Rating actuel:\' | translate }} {{ movie.rating }}</span>' +
    '<span class="ml-2 text-gray-600">{{ \'Moyenne du rating:\' | translate }} {{ movie.averageRating | number:1 }}</span>' +
    '<span class="ml-2 text-gray-600">{{ \'Nombre de votants:\' | translate }} {{ movie.votesCount }}</span>' +
    '</div>' +
    '<div class="mt-2">' +
    '<h3 class="text-lg font-semibold">{{ \'Commentaires:\' | translate }}</h3>' +
    '<div ng-repeat="comment in $ctrl.getComments(movie.id) track by $index" class="border p-2 my-2 rounded">' +
    '<p>{{ comment }}</p>' +
    '</div>' +
    '<textarea ng-model="$ctrl.newComment" class="w-full border p-2 my-2 rounded" placeholder="{{ \'Ajouter un commentaire...\' | translate }}"></textarea>' +
    '<button ng-click="$ctrl.addComment(movie.id)" class="bg-blue-500 text-white p-2 rounded">{{ \'Ajouter\' | translate }}</button>' +
    '</div>' +
    '<div class="mt-2">' +
    '<h3 class="text-lg font-semibold">{{ \'Note Moyenne:\' | translate }} {{ movie.vote_average | number:1 }}</h3>' +
    '<h3 class="text-lg font-semibold">{{ \'Nombre de votants:\' | translate }} {{ movie.vote_count | number:0}}</h3>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<table class="my-4 p-4 bg-gray-100 rounded-md">' +
    '<thead>' +
    '<tr>' +
    '<th>{{ \'Classement:\' | translate }}</th>' +
    '<th>{{ \'Titre:\' | translate }}</th>' +
    '<th>{{ \'Moyenne du rating:\' | translate }}</th>' +
    '<th>{{ \'Nombre de votants:\' | translate }}</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' +
    '<tr ng-repeat="movie in $ctrl.movies | orderBy:\'-score\'">' +
    '<td>{{$index + 1}}</td>' +
    '<td>{{ movie.translated_title || movie.original_title }}</td>' +
    '<td>{{ movie.vote_average| number:1 }}</td>' +
    '<td>{{ movie.vote_count }}</td>' +
    '</tr>' +
    '</tbody>' +
    '</table>',
  controller: function ($http, $translate) {
    const apiKey = '158a78c30db2054d22fa4dc6c45f92f4';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR&page=1`;
    this.language = 'fr';
    this.movies = [];
    this.newComment = '';
    this.sortBy = 'score'; // Tri initial par score de Wilson
    this.reverseSort = true;

    // Fonction pour calculer le score de Wilson
    this.calculateWilsonScore = function (movie) {
      const R = movie.vote_average / 10; // Normaliser la note moyenne entre 0 et 1
      const n = movie.vote_count;
      const z = 1.96; // Score de zéro-critique pour un intervalle de confiance de 95%
      const score = (R + (z ** 2 / (2 * n)) - z * Math.sqrt((R * (1 - R) + (z ** 2 / (4 * n))) / n)) / (1 + (z ** 2 / n));
      return score;
    };

    // Fonction pour sauvegarder la note d'un film
    this.saveRating = function (movie) {
      const existingVotes = JSON.parse(localStorage.getItem(`movie_${movie.id}_votes`)) || [];
      existingVotes.push(movie.rating);
      localStorage.setItem(`movie_${movie.id}_votes`, JSON.stringify(existingVotes));
      localStorage.setItem(`movie_${movie.id}_votesCount`, existingVotes.length);
      this.calculateAverageRating(movie);
    };

    // Fonction pour charger la note d'un film
    this.loadRating = function (movieId) {
      const existingVotes = JSON.parse(localStorage.getItem(`movie_${movieId}_votes`)) || [];
      return existingVotes.length > 0 ? existingVotes[existingVotes.length - 1] : 0;
    };

    // Fonction pour calculer la moyenne des notes et le nombre de votants
    this.calculateAverageRating = function (movie) {
      const existingVotes = JSON.parse(localStorage.getItem(`movie_${movie.id}_votes`)) || [];
      const totalRating = existingVotes.reduce((acc, curr) => acc + curr, 0);
      const votesCount = existingVotes.length;
      movie.averageRating = votesCount > 0 ? totalRating / votesCount : 0;
      movie.votesCount = votesCount;
    };

    // Fonction pour récupérer les commentaires
    this.getComments = function (movieId) {
      return JSON.parse(localStorage.getItem(`movie_${movieId}_comments`)) || [];
    };

    // Fonction pour ajouter un commentaire
    this.addComment = function (movieId) {
      const existingComments = this.getComments(movieId);
      existingComments.push(this.newComment);
      localStorage.setItem(`movie_${movieId}_comments`, JSON.stringify(existingComments));
      this.newComment = '';
    };

    // Fonction pour changer de langue
    this.toggleLanguage = function () {
      this.language = (this.language === 'fr') ? 'en' : 'fr';
      $translate.use(this.language);
    };

    // Fonction pour basculer le mode de tri
    this.toggleSort = function () {
      this.reverseSort = !this.reverseSort;
      this.sortBy = (this.sortBy === 'score' && this.reverseSort) ? '-score' : 'score';
    };

    // Récupérer les films depuis l'API et calculer leur score de Wilson
    $http.get(url).then(response => {
      this.movies = response.data.results.map(movie => ({
        ...movie,
        rating: this.loadRating(movie.id) || 0,
        averageRating: 0,
        votesCount: 0,
        score: this.calculateWilsonScore(movie) // Calculer le score de Wilson pour chaque film
      }));
      console.log(this.movies);
    });
  }
});

