"use strict";

angular.module('luriflix.directives', [])
.directive('gallery', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {

				var	defaults	= {},
					options		= angular.extend({}, defaults, scope.$eval(attrs.gallery));

				$('.popup').magnificPopup({
					delegate: options.selector,
					gallery: {
						enabled: true,
						navigateByImgClick: true,
						preload: [0, 1]
					},
					image: {
						tError: 'Error: Unable to Load Image',
						titleSrc: function (item) {
							return item.el.attr('title');
						}
					},
					tLoading: 'Loading...',
					type: 'image'
				});
			}
		};
	})
.directive('player', function () {
		return {
			restrict : 'AE',
			link: function (scope, element, attrs) {
				attrs.$observe('files', function(value) {
			        var videoTemplate = '<video id="my-video" class="video-js vjs-default-skin white-popup" controls data-setup="{}"><source src="' 
			        + value + '" type="video/mp4">'
			        + '<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that'
			        + '<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p></video>';
			    	element.magnificPopup({
				  		items: {
				      		src: videoTemplate,
				      		type: 'inline'
				  		},
				  		closeBtnInside: true
					});
			    });
			}
		};
	})
.directive('back', function factory($window) {
      return {
        restrict   : 'A',
        replace    : true,
        transclude : true,
        link: function (scope, element, attrs) {
        	element.on('click', function() {
	        	$window.history.back();
	     	});
        }
      };
    })
.directive("myNavscroll", function($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            if (!scope.scrollPosition) {
                scope.scrollPosition = 0
            }

            if (this.pageYOffset > scope.scrollPosition) {
                scope.boolChangeClass = true;
            } else {
                scope.boolChangeClass = false;
            }
            scope.$apply();
        });
    };
});