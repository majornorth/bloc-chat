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

        function setDefaultRoom(name){
            var roomUrl = 'https://stewart-bloc-chat.firebaseio.com/messages/' + name;
            var roomRef = new Firebase(roomUrl);
            var roomRef = $firebaseArray(roomRef);
            return roomRef;
        }

        function getRoom(name, roomId) {
            CurrentRoom.defaults.name = name;
            var currentRoom = CurrentRoom.defaults.name;
            if (currentRoom != 'citizens') {
                var roomUrl = 'https://stewart-bloc-chat.firebaseio.com/messages/' + currentRoom;
                console.log(roomId);
                var roomRef = new Firebase(roomUrl);
                var roomRef = $firebaseArray(roomRef.orderByChild('roomId').equalTo(roomId));
                console.log(roomRef);
                return roomRef;
            } else {
                var roomUrl = 'https://stewart-bloc-chat.firebaseio.com/messages/' + name;
                var roomRef = new Firebase(roomUrl);
                var roomRef = $firebaseArray(roomRef.orderByChild('roomId'));
                console.log(roomRef);
                return roomRef;
            }
        }

        return {
            rooms: roomsObject,
            add_room: addRoom,
            get_room: getRoom,
            default_room: setDefaultRoom
        };
    }
]);

blocChat.controller('Home.controller', ['$scope', 'chatRooms', function($scope, chatRooms) {
    $scope.rooms = chatRooms.rooms;

    $scope.messages = chatRooms.default_room('villains');
    $scope.roomName = 'villains';

    // $scope.messages.$add({
    //     username: "troll",
    //     content: "this is just a troll nah mean",
    //     sentAt: "9:12 PM",
    //     roomId: "bizniss"
    // });

    $scope.getRoom = function(name, $id) {
        $scope.messages = chatRooms.get_room(name, $id);
        $scope.roomName = name;
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
        var room = $scope.newRoomObject.roomTitle;

        chatRooms.add_room(room);
    };
}]);
