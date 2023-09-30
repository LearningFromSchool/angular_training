// inside the array will be the dependencies that will be used in the controller
//var minhaApp = angular.module('myApp', []);

$(".formatted-dates").on("change", function() {
    this.setAttribute(
        "data-date",
        moment(this.value, "yyyy.mm.dd")
        .format( this.getAttribute("data-date-format") )
    )
}).trigger("change");


var minhaApp = angular.module(
    'myApp', 
    [
        'ngRoute',
        'datatables'
    ]
);

minhaApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/home', {
            templateUrl: 'views/homepage.html',
        })
        .when('/list_ninjas', {
            templateUrl: 'views/list_ninjas.html',
            controller: 'myCtrl'
        })
        .when('/contact', {
            templateUrl: 'views/contact.html',
        })
        .when('/files_ninja', {
            templateUrl: 'views/files_ninja.html',
        })
        .when('/datatables', {
            templateUrl: 'views/datatables.html',
            controller: 'dataTablesController'
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);

// inside the array will be the dependencies that will be used in the controller
minhaApp.controller('myCtrl', ['$scope' , '$http', '$filter', function($scope, $http, $filter) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
    $scope.message = "Hello World!";

    /*$scope.ninjas = [
        {name: 'Yoshi', belt: 'black', rate: 50, available: true, thumb: 'lib/images/black-ninja.jfif'},
        {name: 'Crystal', belt: 'red', rate: 30 , available: true , thumb: 'lib/images/red-ninja.jpg'},
        {name: 'Ryu', belt: 'green', rate: 10 , available: false, thumb: 'lib/images/green-ninja.png'},
        {name: 'Shaun', belt: 'blue', rate: 20 , available: true , thumb: 'lib/images/blue-ninja.jpeg'}
    ];*/


    $http.get('data/list_ninjas.json').then(function(response) {
        $scope.ninjas = response.data;
    });

    //console.log($scope.ninjas);

    $scope.addNinja = function() {
        $scope.ninjas.push({
            name: $scope.newninja.name,
            belt: $scope.newninja.belt,
            rate: parseInt($scope.newninja.rate),
            available: true
        });
        $scope.newninja.name = "";
        $scope.newninja.belt = "";
        $scope.newninja.rate = "";
    }

    $scope.getFiles = function() {
        $http.get('files-ninja.php?action=list_files').then(function(response) {
            $scope.files = response.data.files;
            console.log($scope.files);
            console.log("xD");
        });
    }

    $scope.deleteFile = function(file) {
        //console.log(file);
        $http.post('files-ninja.php?action=delete_file&file_name=' + file).then(function(response) {
            $scope.getFiles();
        });
    }

    $scope.dateChange = function() {
        $scope.myFormattedDate = $filter('date')($scope.myDate, 'yyyy.MM.dd');
    }

    $scope.myDateGetterSetter = function(newVal) {
        if (arguments.length) {
          // Setter: Format the new value as yyyy.mm.dd
          $scope.myDate = $filter('date')(newVal, 'yyyy.MM.dd');
        } else {
          // Getter: Return the current value
          return $scope.myDate;
        }
    };

    $scope.olaBebe = "asas";

}]);

minhaApp.controller('dataTablesController', ['$scope' , '$http', '$filter', function($scope, $http, $filter) {
    $http.get('data/stock.json').then(function(response) {
        $scope.stock = response.data;


        $scope.dtOptions = {
            //data: $scope.stock,
            "dom":"Qfrtip",
            //"data": $scope.stock,
            "columns": [
                { "data": "checkbox" },
                { "data": "product_id" },
                { "data": "artigo" },
                { "data": "lote" },
                { "data": "molde" },
                { "data": "qty" },
                { "data": "qty_disp" },
                { "data": "unidade" },
                { "data": "estado" },
                { "data": "palete" },
                { "data": "caixa" }
            ],
        };

        //var tableOpt = $('#products').DataTable($scope.dtOptions);

        var tableOpt = null;

        if ($.fn.DataTable.isDataTable('#products')) {
            //$('#products').DataTable().destroy();
            //$('#products').DataTable($scope.dtOptions);
            //tableOpt = $('#products').DataTable($scope.dtOptions);

        }else{
            //$('#products').DataTable($scope.dtOptions);
            tableOpt = $('#products').DataTable($scope.dtOptions);
        }

        $scope.stock.forEach(function(item) {
            tableOpt.row.add({
                "checkbox": "<input type='checkbox' name='checkbox' value='" + item.product_id + "'>",
                "product_id": item.product_id,
                "artigo": item.artigo,
                "lote": item.lote,
                "molde": item.molde,
                "qty": "<input type='text' value='" + item.qty + "'>",
                "qty_disp": item.qty_disp,
                "unidade": item.unidade,
                "estado": item.estado,
                "palete": item.palete,
                "caixa": item.caixa
            }).draw();
        });


        //$scope.dtInstance = {};

        // Get the id of the table dataTables-example and apply the DataTable function to it with the options
        
        /**
         * Check if is already initialized
         */
        /*if ($.fn.DataTable.isDataTable('#products')) {
            $('#products').DataTable().destroy();
            $('#products').DataTable($scope.dtOptions);
        }else{
            $('#products').DataTable($scope.dtOptions);
        }*/

    });
}]);