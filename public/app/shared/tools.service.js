// public/app/shared/tools.service.js

var tools = angular.module('toolsService', []);

tools.service('toolsService', ['$sce',
	function($sce) {

		this.groupBy = function(arr, property) {
			return arr.reduce(function(memo, x) {
				if (!memo[x[property]]) { memo[x[property]] = []; }
				memo[x[property]].push(x);
				return memo;
			}, {});
		}

		this.toTrusted = function(html) {
			return $sce.trustAsHtml(html);
		}	

	}
]);