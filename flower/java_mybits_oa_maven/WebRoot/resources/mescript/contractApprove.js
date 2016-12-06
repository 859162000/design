/**
 * 合同审批模块的js代码
 * @param $scope
 * @param $http
 */
var app = angular.module("contractApp", []);

app.controller("contractController", function($scope, $http){
		$scope.find = function() {
			$http({
				method : "POST",
				url : "/libertyoa_2015_4_21/main/contract.do",
				params : { 
					"contractId":"HT10006"
				}
			}).success(function(data) {
				console.log("me ge chacha...");
				$scope.contractApprove = {};
				$scope.contractApprove.id = data.data.contractApprove.contract_id;
				$scope.contractApprove.type = data.data.contractApprove.contract_type;
			 	$scope.contractApprove.classz = data.data.contractApprove.contract_class;
			 	$scope.contractApprove.stage = data.data.contractApprove.contract_stage;
			}).error(function() {
				alert("fail...");
			});
		};
		$scope.find();
		
		$scope.commit = function() {
			$http({
				method : "POST",
				url : "/libertyoa_2015_4_21/main/contract.do",
				params : { 
					"contractId":"HT10006"
				}
			});
		};
		$scope.commit();
	}
);