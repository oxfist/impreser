$(document).ready(function() {
	
	/*============================================
	Page Preloader
	==============================================*/
	
	$(window).load(function(){
		$('#page-loader').fadeOut(500);
	});	
	
	/*============================================
	Parallax Backgrounds
	==============================================*/
	$('.parallax-bg').each(function(){
		var bg = $(this).data('parallax-background');
		$(this).css({'background-image':'url('+bg+')'});
		
	});
	
	if((!Modernizr.touch) && ( $(window).width() > 1024) ){
		$(window).stellar({
			horizontalScrolling: false,
			responsive:true
		});
	}
	/*============================================
	Header
	==============================================*/
	
	var speed = $('.header-slider').data('speed') ? parseInt($('.header-slider').data('speed'),10) : 3000;
	
	$('.header-slider').flexslider({
		animation: "fade",
		directionNav: false,
		controlNav: false,
		slideshowSpeed: speed,
		animationSpeed: 400,
		pauseOnHover:false,
		pauseOnAction:false,
		smoothHeight: false,
		slideshow:false
	});
	
	$(window).load(function(){
		if($('.header-slider').length){
			$('.header-slider').flexslider('play');
		}
	});
	
	/*============================================
	Inner Page Header Animation
	==============================================*/
	$(window).scroll( function() {
		var st = $(this).scrollTop();
		$('.no-touch #inner-page-header .header-content').css({ 'opacity' : (1 - st/350) , 'transform':'translateY('+st/3+'px)'});
	});
	
	/*============================================
	ScrollTo Links
	==============================================*/
	$('a.scrollto').click(function(e){
		$('html,body').scrollTo(this.hash, this.hash, {gap: {y: this.hash=='#contact'? -65 : 0} ,animation:  {easing: 'easeInOutCubic', duration: 1000}});
		e.preventDefault();

		if ($('.navbar-collapse').hasClass('in')){
			$('.navbar-collapse').removeClass('in').addClass('collapse');
		}
	});
	
	$('#main-nav').waypoint('sticky');
	
	
	/*============================================
	Counters
	==============================================*/
	$('.counters').waypoint(function(){
		$('.counter').each(count);
	},{offset:'100%'});
	
	function count(options) {
		var $this = $(this);
		options = $.extend({}, options || {}, $this.data('countToOptions') || {});
		$this.countTo(options);
	}
	
	/*============================================
	Project thumbs - Masonry
	==============================================*/
	$(window).load(function(){

		if($('#projects-container').length){
			$('#projects-container').css({visibility:'visible'});

			$('#projects-container').masonry({
				itemSelector: '.project-item:not(.filtered)',
				isFitWidth: false,
				isResizable: true,
				isAnimated: !Modernizr.csstransitions,
				gutterWidth: 0
			});

			scrollSpyRefresh();
			waypointsRefresh();
			stellarRefresh();
		}
	});
	
	/*============================================
	Filter Projects
	==============================================*/
	$('#filter-works a').click(function(e){
		e.preventDefault();
		
		if($('#project-preview').hasClass('open')){
			closeProject();
		}
		
		$('#filter-works li').removeClass('active');
		$(this).parent('li').addClass('active');

		var category = $(this).attr('data-filter');

		$('.project-item').each(function(){
			if($(this).is(category)){
				$(this).removeClass('filtered');
			}
			else{
				$(this).addClass('filtered');
			}

			$('#projects-container').masonry('reload');
		});

		scrollSpyRefresh();
		waypointsRefresh();
		stellarRefresh();
	});
	
	/*============================================
	Project Preview
	==============================================*/
	$('.project-item').click(function(e){
		e.preventDefault();

		var elem = $(this);
		
		if($('#project-preview').hasClass('open')){
			$('#project-preview').animate({'opacity':0},300);
			
			setTimeout(function(){
				$('#project-slider').flexslider('destroy');
				buildProject(elem);
			},300);
		}else{
			buildProject(elem);
		}
		
		
	});

	function buildProject(elem){
	
		var	title = elem.find('.project-title').text(),
			descr = elem.find('.project-description').html(),
			slidesHtml = '<ul class="slides">',
			elemDataCont = elem.find('.project-description');

		var hasVideo = false;
		if(elem.find('.project-description').data('video')){
			slidesHtml = slidesHtml + '<li>'+elem.find('.project-description').data('video')+'</li>';
			hasVideo = true;
		}
		
		if(elem.find('.project-description').data('images')){
			var	slides = elem.find('.project-description').data('images').split(',');
			
			for (var i = 0; i < slides.length; ++i) {
				slidesHtml = slidesHtml + '<li><img src='+slides[i]+' alt=""></li>';
			}
		}
		
		slidesHtml = slidesHtml + '</ul>';
		
		$('#project-title').text(title);
		$('#project-content').html(descr);
		$('#project-slider').html(slidesHtml);
		
		openProject(hasVideo);
	}
	
	function openProject(hasVideo){
		
		$('#project-preview').addClass('open');
		
		setTimeout(function(){
			$('#project-preview').slideDown();
			
			$('html,body').scrollTo(0,'#filter-works',
				{
					gap:{y:-10},
					animation:{
						duration:400
					}
			});
			
			$('#project-slider').fitVids().flexslider({
				prevText: '<i class="fa fa-angle-left"></i>',
				nextText: '<i class="fa fa-angle-right"></i>',
				animation: 'slide',
				slideshowSpeed: 3000,
				useCSS: true,
				controlNav: true, 
				pauseOnAction: false, 
				pauseOnHover: hasVideo ? false : true,
				smoothHeight: false,
				start: function(){
					if(hasVideo){$('#project-slider').find('li.clone').height(1).empty();$('#project-slider').flexslider("pause");};
					$(window).trigger('resize');
					$('#project-preview').animate({'opacity':1},300);
				}
			});
			
			
			
		},300);
		
	}
	
	function closeProject(){
	
		$('#project-preview').removeClass('open');
		$('#project-preview').animate({'opacity':0},300);
		
		setTimeout(function(){
			$('#project-preview').slideUp();
				
			$('#project-slider').flexslider('destroy');
			$('#project-slider').empty();
			
			scrollSpyRefresh();
			waypointsRefresh();
			stellarRefresh();
			
		},300);
		
	}
	
	$('.close-preview').click(function(){
		closeProject();
	})
		
	/*============================================
	Testimonials Slider
	==============================================*/
	
	$('#testimonials-slider').flexslider({
		prevText: '<i class="fa fa-angle-left"></i>',
		nextText: '<i class="fa fa-angle-right"></i>',
		animation: 'fade',
		slideshowSpeed: 5000,
		animationSpeed: 400,
		useCSS: true,
		directionNav: false, 
		pauseOnAction: false, 
		pauseOnHover: true,
		smoothHeight: false
	});
	
	/*============================================
	Google Map
	==============================================*/
	
	$(window).load(function(){
	
		if($('#gmap').length){
		
		
			var map;
			var mapstyles = [ { "stylers": [ { "saturation": -100 } ] } ];
			
			var infoWindow = new google.maps.InfoWindow;
			
			var pointLatLng = new google.maps.LatLng(mapPoint.lat, mapPoint.lng);

			var isDraggable = $('html').is('.touch') ? false : true; // If document (your website) is wider than
			
			var mapOptions = {
				zoom: mapPoint.zoom,
				center: pointLatLng,
				zoomControl : true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.LARGE,
					position: google.maps.ControlPosition.LEFT_CENTER
				},
				panControl : false,
				streetViewControl : false,
				mapTypeControl: false,
				overviewMapControl: false,
				scrollwheel: false,
				draggable:isDraggable,
				styles: mapstyles
			}
			
			map = new google.maps.Map(document.getElementById("gmap"), mapOptions);
			
			var marker = new google.maps.Marker({
				position: pointLatLng, 
				map: map, 
				title:mapPoint.linkText,
				icon: mapPoint.icon
			});
			
			var mapLink = 'https://www.google.com/maps/preview?ll='+mapPoint.lat+','+mapPoint.lng+'&z=14&q='+mapPoint.mapAddress;
			
			var html = '<div class="infowin">'
					+ mapPoint.infoText
					+ '<a href="'+mapLink+'" target="_blank">'+mapPoint.linkText+'</a>'
					+ '</div>';

			google.maps.event.addListener(marker, 'mouseover', function() {
				infoWindow.setContent(html);
				infoWindow.open(map, marker);
			});

			google.maps.event.addListener(marker, 'click', function() {
				window.open(mapLink,'_blank');
			});
			
			/*Toggle Map*/
			
			$('#toggle-map').click(function(){
		  
				if($('#contact').is('.show-map')){

					$('#contact').css({'height':'auto'});
					$('#contact .container,#gmap-overlay').fadeIn();
					
				}else{
				
					$('#contact').height($('#contact').height());
					$('#contact .container,#gmap-overlay').fadeOut();
				}

				$('#contact').toggleClass('show-map');
				$('.show-map-text,.hide-map-text').toggle();
			})
			
			$("<div id='gmap-overlay'></div>").prependTo($('#gmap'));
		}
		
	});		
	/*============================================
	Tooltips
	==============================================*/
	$("[data-toggle='tooltip']").tooltip();
	
	/*============================================
	Placeholder Detection
	==============================================*/
	if (!Modernizr.input.placeholder) {
		$('html').addClass('no-placeholder');
	}

	/*============================================
	Scrolling Animations
	==============================================*/
	$('.scrollimation').waypoint(function(){
		$(this).addClass('in');
	},{offset:'80%'});

	/*============================================
	Video functions
	==============================================*/
	$('.video-container').fitVids();

	/*============================================
	Blog post slider
	==============================================*/

	$('.post-slider').flexslider({
		prevText: '<i class="fa fa-angle-left"></i>',
		nextText: '<i class="fa fa-angle-right"></i>',
		animation: "slide",
		directionNav: true,
		controlNav: false,
		slideshowSpeed: 4000,
		animationSpeed: 700,
		pauseOnHover:true,
		pauseOnAction:false,
		smoothHeight: false
	});
	
	/*============================================
	Resize Functions
	==============================================*/
	$(window).resize(function(){
	
		if($('#projects-container').length){
			$('#projects-container').masonry('reload');
		}
		
		stellarRefresh();
		scrollSpyRefresh();
		waypointsRefresh();
		fitDropdown();
		
	});
	
	/*============================================
	Refresh scrollSpy function
	==============================================*/
	function scrollSpyRefresh(){
		setTimeout(function(){
			$('body').scrollspy('refresh');
		},1000);
		
	}

	/*============================================
	Refresh waypoints function
	==============================================*/
	function waypointsRefresh(){
		setTimeout(function(){
			$.waypoints('refresh');
		},1000);
	}
	
	/*============================================
	Refresh Parallax Backgrounds
	==============================================*/
	function stellarRefresh(){
		setTimeout(function(){
			$(window).stellar('refresh');
		},1000);
	}
	
	/*============================================
	Fit 2nd level dropdown
	==============================================*/
	function fitDropdown(){
		if($('.dropdown .dropdown').length){
			var od = $('.dropdown .dropdown').offset().left,
				w = $(window).width(),
				wd1 = $('.dropdown-menu .dropdown-menu').parents('.dropdown-menu').width(),
				wd2 = $('.dropdown-menu .dropdown-menu').width();
				
			if(wd2 > w-od-wd1){
				$('.dropdown .dropdown').addClass('left-side');
			}else{
				$('.dropdown .dropdown').removeClass('left-side');
			}
		}
	}
	
	fitDropdown();
	
	$('.dropdown > a').click(function(e){
		if($('html').is('.touch') || ($(window).width()<768)){
			e.preventDefault();
			
			var $dm = $(this).next('.dropdown-menu');
			
			if($dm.is('.dropdown-open')){
				$dm.slideUp();
			}else{
				$dm.slideDown();
			}
			
			$dm.toggleClass('dropdown-open');
		}
	})
	
});	