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
