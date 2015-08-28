var blocChat = angular.module("BlocChat", ['firebase', 'ui.router', 'ui.bootstrap']);

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

        function addRoom(room) {
            roomsObject.$add({
                name: room
            });
        }

        return {
            rooms: roomsObject,
            add_room: addRoom
        };
    }
]);

blocChat.controller('Home.controller', ['$scope', 'chatRooms', function($scope, chatRooms) {
    $scope.rooms = chatRooms.rooms;
}]);

blocChat.controller('AddRoomModal.controller', ['$scope', '$modal', function($scope, $modal) {
    $scope.open = function () {
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: '/templates/add-room.html',
          controller: 'ModalInstanceCtrl'
        });
    };
}]);

blocChat.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'chatRooms', function($scope, $modalInstance, chatRooms) {
    $scope.newRoomObject = {
        roomTitle: ''
    };

    $scope.addRoom = function () {
        console.log($scope.newRoomObject.roomTitle);

        var room = $scope.newRoomObject.roomTitle;

        chatRooms.add_room(room);
    };
}]);
