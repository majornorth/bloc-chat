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

blocChat.factory("chatRooms", [
    "$firebaseArray",
    function($firebaseArray) {
        var roomsUrl = 'https://stewart-bloc-chat.firebaseio.com/rooms';
        var roomsRef = new Firebase(roomsUrl);
        var roomsObject = $firebaseArray(roomsRef);

        return {
            rooms: roomsObject
        };
    }
]);

blocChat.controller('Home.controller', ['$scope', 'chatRooms', function($scope, chatRooms) {
    $scope.rooms = chatRooms.rooms;
}]);
