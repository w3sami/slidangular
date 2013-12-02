#router
.when('/', {
    templateUrl: 'html/view.html?rev=' + slidangular.rev,
    controller: 'ViewController',
    resolve: 'User'
})

..

slidangular.controller('ViewController', function($scope, User) {

    alert(User.data);
});