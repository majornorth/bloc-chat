var blocChat = angular.module("BlocChat", ['firebase', 'ui.router']);

blocChat.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
    .state('home', {
        url: '/',
        views: {
            'home': {
                controller: 'Home.controller',
                templateUrl: '/templates/home.html'
            }
        }
    });
}]);

blocChat.factory('Room', ['$firebaseArray', function($firebaseArray) {
    var firebaseRef = new Firebase('https://stewart-bloc-chat.firebaseio.com/');
    var rooms = $firebaseArray(firebaseRef.child('rooms'));
    return {
        all: rooms
    }
}]);

blocChat.controller('Home.controller', ['$scope', 'Room', function($scope, Room) {
    $scope.room = Room.all;

    console.log($scope.room);
}]);
