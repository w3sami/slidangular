var slidangular = angular.module("slidangular", ["firebase"]);

var getFb = function(name)
{
    return new Firebase("https://slidangular.firebaseio.com/" + name);

};

$(function()
{



});

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
        .when('/view', {
            templateUrl: 'html/view.html?rev=' + slidangular.rev,
            controller: 'ViewController'
        })
        .when('/code/:type', {
            template: '<div code="{{ type }}"></div>',
            controller: 'CodeController'
        })
        .when('/slide/:name', {
            template:  '<div ng-include="\'html/slide/\' + name + \'.html\'"></div>',
            controller: 'SlideController'
        })
        .when('/bits', {
            templateUrl: 'html/bits.html?rev=' + slidangular.rev,
            controller: 'BitsController'
        });
});

slidangular.controller('SlideController', function($scope, $routeParams) {
console.debug($routeParams.name);
    $scope.name = $routeParams.name;

});

slidangular.controller('CodeController', function($scope, $routeParams) {

    $scope.type = $routeParams.type;

});

slidangular.controller('BitsController', function($scope, angularFire) {

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

slidangular.controller('SlidangularController', function($scope, angularFire) {
});

slidangular.controller('ViewController', function($scope, angularFire, Iframe) {

    var bindFb = function(name)
    {
        angularFire(getFb(name), $scope, name);
    };

    $scope.page = {
        slides: [],
        currentSlide: null
    };

    bindFb('page');

    $scope.render = function(slide)
    {
        if(!slide) return;
        if(!slide.url) slide.url = 'http://talmantalli.fi';
        return Iframe.render(slide.url);
    };
});

slidangular.controller('EditController', function($scope, angularFire, Iframe) {

    var bindFb = function(name)
    {
        var fbRef = getFb(name);
        angularFire(fbRef, $scope, name);

        return fbRef;
    };

    $scope.page = {
        slides: [],
        currentSlide: null
    };

    var fbRef = bindFb('page');
    //var auth = new FirebaseSimpleLogin(fbRef, function(error, user) { });
    //auth.login('github');

    //var copy = JSON.parse(JSON.stringify($scope.page));

    $scope.add = function(e) {
        $scope.page.slides.push({name: $scope.newName, url: $scope.newUrl});
        //$scope.name = "";
    };

    $scope.save = function(e) {
        $scope.page.slides.splice($scope.page.slides.indexOf($scope.page.currentSlide), 1, $scope.page.currentSlide);
        return;
        var slides = $scope.slides,
            index = slides.indexOf($scope.currentSlide),
            slide = slides[index];

        slide.name = $scope.currentSlide.name;
        slide.url = $scope.currentSlide.url;
    };

    $scope.selectSlide = function(slide)
    {
        $scope.page.currentSlide = slide;
    };

    $scope.delete = function(slide)
    {
        $scope.page.slides.splice($scope.page.slides.indexOf(slide), 1);
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

});

slidangular.factory('Iframe', function() {

    return {
        render: function(url) {

            return '<iframe src="' + url + '">';
        }
    };
});

slidangular.directive('code', function($http, $timeout) {
    return function(scope, element, attributes) {
            $http.get(attributes.code.replace(';', '/', 'g')).success(function(html) {
                element.html('<pre class="prettyprint">' + html.replace('<', '&lt;', 'g') + '</pre>');
                window.prettyPrint();
                $timeout(function() { });
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

   /*
            var scope = $rootScope.$new(true),
                deferredModal = $q.defer(),
                rejectDeferred = function() {
                    deferredModal.reject();
                },
                promises = 1, // the template being numero uno
                data = {scope: scope};

            $http.get(
                    options.templateUrl + '?rev=' + apuri.rev // rev better than cache??
                ).success(function(response)
                {
                    var iframeElement =
                    modalElement.html(response);

                    var component = $compile(modalElement)(scope);
                    data.modal =  component;

                    $timeout(function(){

                        component.dialog({
                            autoOpen: false,
                            modal: true,
                            title: options.title
                        });
                        component.dialog("open");

                        promises --;
                        if(promises == 0) {
                            deferredModal.resolve(data);
                        }
                    });

                }).error(rejectDeferred);
       */