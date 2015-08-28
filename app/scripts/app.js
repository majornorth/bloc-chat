var blocChat = angular.module("BlocChat", ['firebase', 'ui.router', 'ui.bootstrap']);

blocChat.service('CurrentRoom', function() {
    return {
        defaults: { name: 'citizens' }
    }
});

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
    "CurrentRoom",
    function($firebaseArray, CurrentRoom) {
        var roomsUrl = 'https://stewart-bloc-chat.firebaseio.com/rooms';
        var roomsRef = new Firebase(roomsUrl);
        var roomsObject = $firebaseArray(roomsRef);

        function addRoom(room) {
            roomsObject.$add({
                name: room
            });
        }

        function getRoom(name) {
            CurrentRoom.defaults.name = name;
            var currentRoom = CurrentRoom.defaults.name;
            if (currentRoom != 'citizens') {
                var roomUrl = 'https://bloc-list.firebaseio.com/rooms/' + currentRoom;
                console.log(roomUrl);
                var roomRef = new Firebase(roomUrl);
                var roomRef =  $firebaseArray(roomRef);
                return roomRef;
            } else {
                var roomUrl = 'https://bloc-list.firebaseio.com/rooms/' + name;
                console.log(roomUrl);
                var roomRef = new Firebase(roomUrl);
                var roomRef =  $firebaseArray(roomRef);
                return roomRef;
            }
        }

        return {
            rooms: roomsObject,
            add_room: addRoom,
            get_room: getRoom
        };
    }
]);

blocChat.controller('Home.controller', ['$scope', 'chatRooms', function($scope, chatRooms) {
    $scope.rooms = chatRooms.rooms;

    $scope.getRoom = function(name) {
        $scope.currentRoom = chatRooms.get_room(name);
        console.log(name);
    }
}]);

blocChat.controller('AddRoomModal.controller', ['$scope', '$modal', function($scope, $modal) {
    $scope.open = function () {
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: '/templates/add-room.html',
          controller: 'ModalInstance.controller'
        });
    };
}]);

blocChat.controller('ModalInstance.controller', ['$scope', '$modalInstance', 'chatRooms', function($scope, $modalInstance, chatRooms) {
    $scope.newRoomObject = {
        roomTitle: ''
    };

    $scope.addRoom = function () {
        console.log($scope.newRoomObject.roomTitle);

        var room = $scope.newRoomObject.roomTitle;

        chatRooms.add_room(room);
    };
}]);
