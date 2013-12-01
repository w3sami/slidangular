var slidangular = angular.module("slidangular", ['firebase', 'ui.sortable', 'ngCookies']);

slidangular.factory('FireBase', function(angularFire)
{
    return {
        connect: function($scope, name) {

            $scope.page = {
                slides: [],
                currentSlide: null,
                currentSlideIndex: 0,
                chat: [],
                users: {},
                chatEnabled: true
            };

            var fbRef = new Firebase("https://slidangular.firebaseio.com/" + name);
            return angularFire(fbRef, $scope, name);
        }
    };
});

slidangular.factory('User', function($cookieStore)
{
    return {
        get: function($scope)
        {
            var cookieId = $cookieStore.get('cookieId');
            if(!cookieId) {
                var cookieId = String(Math.random()).replace('.', '') * 1;
                $cookieStore.put('cookieId', cookieId);
            }
            $scope.cookieId = cookieId;
            //console.debug($scope.page.users);
            if($scope.page.users[cookieId]) {
                $scope.currentUser = {name: $scope.page.users[cookieId]};
            }
            $scope.rev = slidangular.rev;
        }
    }
});

//var auth = new FirebaseSimpleLogin(fbRef, function(error, user) { });
//auth.login('github');

slidangular.rev = Math.random();

slidangular.config(function ($routeProvider) {

    $routeProvider
        .when('/index.html', {
            redirectTo: '/edit'
        })
        .when('/edit', {
            templateUrl: 'html/edit.html?rev=' + slidangular.rev,
            controller: 'EditController'
        })
        .when('/', {
            templateUrl: 'html/view.html?rev=' + slidangular.rev,
            controller: 'ViewController'
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
            template: '<img src="{{ url }}" class="vcenter" style="width: {{ width }}%; margin: auto {{ margin }}%" />',
            controller: 'ImageController'
        })
        .when('/bits', {
            templateUrl: 'html/bits.html?rev=' + slidangular.rev,
            controller: 'BitsController'
        });
});
http://slidangular/#/image/http:;;slidangular;w3school;AngularJS-large.png
slidangular.controller('SlideController', function($scope, $routeParams, FireBase) {

    FireBase.connect($scope, 'page');
    $scope.name = $routeParams.name;

});

slidangular.controller('ImageController', function($scope, $routeParams, FireBase) {

    FireBase.connect($scope, 'page');
    $scope.url = $routeParams.url.replace(/;/g, '/'); // + '?rev=' + slidangular.rev;
    $scope.width = $routeParams.width || 100;
    $scope.margin = (100 - $scope.width) / 2;

});

slidangular.controller('CodeController', function($scope, $routeParams) {

    $scope.type = $routeParams.type;

});

slidangular.controller('BitsController', function($scope) {

    $scope.no = 0;

    $scope.lit = function(i)
    {
        if($scope.no & i) return 'lit';
    }

    $scope.add = function(b)
    {
        $scope.no += b;
    }

    $scope.xor = function(b)
    {
        $scope.no ^= b;
    }
});

slidangular.controller('SlidangularController', function($scope) {
});

slidangular.controller('ViewController', function($scope, FireBase, Iframe, $cookieStore, User) {

    FireBase.connect($scope, 'page').then(function(){
        User.get($scope);
    });

    $scope.render = function(slide)
    {
        if(!slide) return;
        if(!slide.url) slide.url = 'http://talmantalli.fi';
        return Iframe.render(slide.url);
    };
});

slidangular.controller('ChatController', function($scope) {

    $scope.message = {content: ''};

    $scope.addMessage = function() {
        $scope.page.chat.push({
            from: $scope.currentUser.name, content: $scope.message.content
        });
        if($scope.page.chat.length > 20) {
            $scope.page.chat.splice(0, 1);
        }
        $scope.page.users[$scope.cookieId] = $scope.currentUser.name;
        $scope.message.content = "";
        $('.chat input')[1].focus();
    };
});
slidangular.controller('EditController', function($scope, Iframe, FireBase, User) {

    FireBase.connect($scope, 'page').then(function(){
        User.get($scope);
    });

    //var copy = JSON.parse(JSON.stringify($scope.page));

    $scope.add = function(e) {
        $scope.page.slides.push({name: $scope.newName, url: $scope.newUrl});
    };

    $scope.save = function(e) {
        $scope.page.slides.splice($scope.page.currentSlideIndex, 1, $scope.page.currentSlide);
    };

    $scope.selectSlide = function(slide)
    {
        $scope.page.currentSlide = slide;
        $scope.page.currentSlideIndex = $scope.page.slides.indexOf(slide);
        $scope.page.currentSlide.index = 0;
    };

    $scope.delete = function()
    {
        $scope.page.slides.splice($scope.page.currentSlideIndex, 1);
        $scope.page.currentSlide = $scope.page.slides[$scope.page.slides.length - 1];
    };

    $scope.clear = function()
    {
        //$scope.slides = [];
    };

    $scope.render = function(slide)
    {
        if(!slide) return;
        if(!slide.url) slide.url = 'http://talmantalli.fi';
        return Iframe.render(slide.url);
    };

    $scope.prev = function()
    {
        if($scope.page.currentSlide.index) $scope.page.currentSlide.index --;
    };

    $scope.next = function()
    {
        if($scope.page.currentSlide.index < $scope.page.currentSlide.pages) $scope.page.currentSlide.index ++;
    };

    $scope.zero = function()
    {
        $scope.page.currentSlide.index = 0;
    };
});

slidangular.factory('Iframe', function() {

    return {
        render: function(url) {

            return '<iframe src="' + url + '?rev=' + slidangular.rev + '">';
        }
    };
});

slidangular.directive('ngBlur', function() {
    return function( scope, element, attributes ) {
        element.bind('blur', function() {
            scope.$apply(attributes.ngBlur);
        });
    };
});

slidangular.directive('code', function($http, $timeout) {
    return function(scope, element, attributes) {
        //if(!attributes.code) return;
        $timeout(function(){
            $http.get(attributes.code.replace(/;/g, '/') + '?rev=' + slidangular.rev).success(function(html) {
                element.html('<pre class="prettyprint">' +
                    $('<div>').text(html).html() + // html encode the data
                    '</pre>'
                );
                window.prettyPrint();
            });
        });

    };
});

slidangular.directive('edit', function($http) {
    return function(scope, element, attributes) {
        $http.get(attributes.code.replace(/;/g, '/') + '?rev=' + slidangular.rev).success(function(html) {
            element.html('<pre class="prettyprint">' +
                $('<div>').text(html).html() + // html encode the data
                '</pre>'
            );
            window.prettyPrint();
        });

    };
});

slidangular.directive('bits', function() {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            values: '=',
            select: '='
        },
        template: '<ul class="button-group">' +
            '<li ng-repeat="value in values">' +
            '<a href="" class="small button secondary" ng-class="class(value)" ng-click="click(value)"></a>' +
            '</li>' +
            '</ul>',
        link: function(scope, element) {
            scope.click = function (selected) {
                if (scope.model == selected.value) {
                    scope.model = '';
                }
                else {
                    scope.model = selected.value;
                }

                if (scope.select) {
                    scope.select(scope.model);
                }

                $(element).find('.button').blur();
            };

            scope.class = function (current) {
                var cssClass = current.icon;

                if (scope.model == current.value) {
                    cssClass += ' selected';
                }

                return cssClass;
            };
        }
    }
});
