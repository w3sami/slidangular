slidangular.directive('code', function($http, $timeout) {
    alert('woot');
    return {
        restrict: 'EA',
        link: function(scope, element, attributes) {
            $timeout(function(){
                if(attributes.code) {
                    $http.get(attributes.code.replace(/;/g, '/') + '?rev=' + slidangular.rev).success(function(html) {
                        element.html('<pre class="prettyprint">' +
                            $('<div>').text(html).html() + // html encode the data
                            '</pre>'
                        );
                        window.prettyPrint();
                    });
                } else {
                    // does not work with {{ }}, since they get parsed before
                    element.html('<pre class="prettyprint">' +
                        element.html() +
                        '</pre>'
                    );
                    window.prettyPrint();
                }
            });
        }
    }
});