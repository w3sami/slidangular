slidangular.config(function ($routeProvider) {

    $routeProvider
        .when('/edit', {
            templateUrl: 'html/edit.html?rev=' + slidangular.rev,
            controller: 'EditController'
        })
        .when('/', {
            templateUrl: 'html/view.html?rev=' + slidangular.rev,
            controller: 'ViewController',
            resolve: 'User'
        })
        .when('/code/:type', {
            template: '<div code="{{ type }}"></div>',
            controller: 'CodeController'
        })
        .when('/slide/:name', {
            template:  '<div ng-include="\'html/slide/\' + name + \'.html?rev=' + slidangular.rev + '\'"></div>',
            controller: 'SlideController'
        })
        .when('/image/:url/:width', {
            template: '<img src="{{ url }}" class="vcenter w{{ width }}" />',
            controller: 'ImageController'
        })
        .when('/bits', {
            templateUrl: 'html/bits.html?rev=' + slidangular.rev,
            controller: 'BitsController'
        });
});