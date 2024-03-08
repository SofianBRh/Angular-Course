const translationsEn = {
    "Note:": "Note:",
    "Rating actuel:": "Current Rating:",
    "Moyenne du rating:": "Average Rating:",
    "Nombre de votants:": "Number of Voters:",
    "Titre:": "Title:"
  }

  const translationsFr = {
    "Note:": "Note :",
    "Rating actuel:": "Note actuelle :",
    "Moyenne du rating:": "Moyenne des notes :",
    "Nombre de votants:": "Nombre de votants :",
    "Titre:": "Titre :"
  }



angular.module('movieApp', ['pascalprecht.translate'])
  .config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: './locale-',
      suffix: '.json'
    });
    
    $translateProvider.translations('en', translationsEn);
    $translateProvider.translations('fr', translationsFr);
    $translateProvider.preferredLanguage('fr');
  }]);
