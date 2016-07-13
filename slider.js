/**
  Angular Slider
  Customize as your wish......:D
*/
(function(window, angular){
	angular.module('rgSlider',[]).directive('rgSlider', [function(){
		return {
			restrict: 'A',
			replace: true,
			link: function(scope, element, attrs) {
			  var progressParent = element.children()[0],
			      parentBoundary = progressParent.getBoundingClientRect(),
			  	  parentWidth = parentBoundary.width,
			  	  parentHeight = parentBoundary.height,
			  	  ltHandEle = null,
			  	  rtHandEle = null,
			  	  progressEle = null,
			  	  ltHandProps = {},
			  	  currentLeft = null,
			  	  rtHandProps = {},
			  	  min = attrs.min,
			  	  max = attrs.max;
			  
			  angular.forEach(progressParent.children, function(ele) {
			  	ltHandEle = ele.classList.contains('slider-lt-hand') ? ele: ltHandEle;
			  	rtHandEle = ele.classList.contains('slider-rt-hand') ? ele: rtHandEle;
			  	progressEle = ele.classList.contains('slider-progress') ? ele: progressEle;
			  });

			  // will set slider position based on min and max
			  updateSlider();

			  
			  document.addEventListener('mousedown', function(e) {
			  	if (e.target == ltHandEle) {
			  		ltHandProps = {
			  			mousedown: true,
			  			xDiff: Math.abs(ltHandEle.offsetLeft - e.offsetX),
			  			startX: e.clientX
			  		};
			  		window.requestAnimFrame(updateLeftHandle);
			  	} else if(e.target == rtHandEle) {
			  		rtHandProps = {
			  			mousedown: true,
			  			xDiff: Math.abs(rtHandEle.offsetLeft - e.offsetX),
			  			startX: e.clientX
			  		};
			  		window.requestAnimFrame(updateRightHandle);

			  	};
			  });

			  document.addEventListener('mousemove', function(e) {
			  	if (ltHandProps.mousedown /*&& e.target == ltHandEle*/) {
			  		if(ltHandProps.startX < e.clientX) {
			  			currentLeft = (ltHandEle.offsetLeft + 5);
			  		} else {
			  			currentLeft = (ltHandEle.offsetLeft - 5);
			  		}
			  		ltHandProps.startX = e.clientX
			  		currentLeft = currentLeft > parentWidth ? parentWidth: currentLeft;
			  		currentLeft = currentLeft < 0 ? 0 : currentLeft;
			  		ltHandProps.left = currentLeft;

			  	} else if(rtHandProps.mousedown /*&& e.target == rtHandEle*/) {
			  		// console.log(e.offsetX,rtHandProps)
			  		if(rtHandProps.startX < e.clientX) {
			  			currentLeft = (rtHandEle.offsetLeft + 5);
			  		} else {
			  			currentLeft = (rtHandEle.offsetLeft - 5);
			  		}
			  		rtHandProps.startX = e.clientX
			  		currentLeft = currentLeft >= parentWidth ? parentWidth: currentLeft;
			  		currentLeft = currentLeft <= 0 ? 0 : currentLeft;
			  		rtHandProps.left = currentLeft;
			  	};
			  });

			  document.addEventListener('mouseup', function(e) {
			  		ltHandProps.mousedown = false;
			  		rtHandProps.mousedown = false;
			  });

			  
			  function updateLeftHandle() {
			  	if(ltHandProps.mousedown) {
			  		ltHandEle.style.left =  ltHandProps.left + 'px';
			  		scope.min =  Math.floor(ltHandProps.left / parentWidth * 100);
			  		// min never more than max
			  		scope.min = scope.min >= scope.max ? scope.max : scope.min;
			  		updateSlider();
			  		window.requestAnimFrame(updateLeftHandle);
			  		scope.$apply();
			  	}
			  }

			  function updateRightHandle() {
			  	if(rtHandProps.mousedown) {
			  		rtHandEle.style.left =  rtHandProps.left + 'px'; 
			  		scope.max = rtHandProps.left / parentWidth * 100;
			  		// max never less tha min
			  		scope.max = Math.floor(scope.max <= scope.min ? scope.min : scope.max);
			  		updateSlider();
			  		window.requestAnimFrame(updateRightHandle);
			  		scope.$apply();
			  	}
			  }

			  // get pixel based on min/max percentage
			  function getVal(subVal, val) {
                return subVal * val / 100;
			  }

			  // it will set position for lefthandle and right handle
			  // it will set width for progress bar
			  function updateSlider() {
			  	ltHandEle.style.left = getVal(scope.min , parentWidth) + 'px';
			    rtHandEle.style.left = getVal(scope.max , parentWidth) + 'px';
			    progressEle.style.left = getVal(scope.min , parentWidth) + 'px';
			    progressEle.style.width = getVal(scope.max , parentWidth) - getVal(scope.min , parentWidth) + 'px';
			  }
			  window.requestAnimFrame = (function() {
		        return window.requestAnimationFrame ||
		            window.webkitRequestAnimationFrame ||
		            window.mozRequestAnimationFrame ||
		            function(callback) {
		                window.setTimeout(callback, 1000 / 60);
		            };
		     })();
			},
			template: ['<div class="slider-container">',
				'<div class="slider-progress-container">',
					'<div class="slider-lt-hand"></div>',
					'<div class="slider-rt-hand"></div>',
					'<div class="slider-progress"></div>',
				'</div>',
			'</div>'].join('')
		}
	}]);
})(window, window.angular);