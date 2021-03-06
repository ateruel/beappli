// Ionic Starter App

angular.module('underscore', [])
.factory('_', function() {
	return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('beAppli', [
	'ionic',
	'ngIOS9UIWebViewPatch',
	'beAppli.directives',
	'beAppli.controllers',
	'beAppli.views',
	'beAppli.services',
	'beAppli.config',
	'beAppli.factories',
	'beAppli.filters',
	'angularMoment',
	'underscore',
	'ngCordova',
	'youtube-embed',
	'ngLocalize',
	'ionic.ion.autoListDivider'
])

.run(function($ionicPlatform, AuthService, $rootScope, $state, PushNotificationsService, locale, localStorage) {

	$state.option1 = window.localStorage.getItem('option1') === 'true';
	window.localStorage.setItem('option1', $state.option1);
	
	$ionicPlatform.on("deviceready", function(){
	

		AuthService.userIsLoggedIn().then(function(response)
		{
			if(response === true)
			{
				//update user avatar and go on
				AuthService.updateUserAvatar();

				$state.go('app.home');
			}
			else
			{
				$state.go('walkthrough');
			}
		});

		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			//https://github.com/apache/cordova-plugin-statusbar
			//ATF 04/06/2016 : g�rer dans la config
			StatusBar.overlaysWebView(true);
			//StatusBar.styleDefault();
			StatusBar.styleBlackTranslucent();
		}

		PushNotificationsService.register();
 
 	//ATF 03/06/2016 : i18n
	navigator.globalization.getLocaleName(function(l) {
			console.log(l);
			locale.setLocale(l.value);
		}, function(err) {
			console.log('get local err', err);
		});
	//ATF
	
	});

	$ionicPlatform.on("resume", function(){
		AuthService.userIsLoggedIn().then(function(response)
		{
			if(response === false)
			{
				$state.go('walkthrough');
			}else{
				//update user avatar and go on
				AuthService.updateUserAvatar();
			}
		});

		PushNotificationsService.register();
	});

	// UI Router Authentication Check
	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
		if (toState.data.authenticate)
		{
			AuthService.userIsLoggedIn().then(function(response)
			{
				if(response === false)
				{
					event.preventDefault();
					$state.go('walkthrough');
				}
			});
		}
	});
})

//ATF 03/06/2016 : i18n
//https://github.com/cfjedimaster/Cordova-Examples/blob/master/globalex/www/js/app.js
//D:\Cordova examples\Cordova-Examples-master\globalex\
.value('localeConf', {
		basePath: 'lang',
		defaultLocale: 'fr-FR',
		sharedDictionary: 'common',
		fileExtension: '.json',
		persistSelection: false,
		cookieName: 'COOKIE_LOCALE_LANG',
		observableAttrs: new RegExp('^data-(?!ng-|i18n)'),
		delimiter: '::'
}).value('localeSupported', [
		'fr-FR'
])
//

//ATF 04/06/2016 : config back button
//https://forum.ionicframework.com/t/change-hide-ion-nav-back-button-text/5260/3
.config(function($ionicConfigProvider) {
	$ionicConfigProvider.backButton.text('');
})
//

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

	.state('walkthrough', {
		url: "/",
		templateUrl: "views/auth/walkthrough.html",
		controller: 'WalkthroughCtrl',
		data: {
			authenticate: false
		}
	})

	.state('register', {
		url: "/register",
		templateUrl: "views/auth/register.html",
		controller: 'RegisterCtrl',
		data: {
			authenticate: false
		}
	})

	.state('login', {
		url: "/login",
		templateUrl: "views/auth/login.html",
		controller: 'LoginCtrl',
		data: {
			authenticate: false
		}
	})

	.state('forgot_password', {
		url: "/forgot_password",
		templateUrl: "views/auth/forgot-password.html",
		controller: 'ForgotPasswordCtrl',
		data: {
			authenticate: false
		}
	})

	.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "views/app/side-menu.html",
		controller: 'AppCtrl'
	})

	.state('app.home', {
		url: "/home",
		views: {
			'menuContent': {
				templateUrl: "views/app/home.html",
				controller: 'HomeCtrl'
			}
		},
		data: {
			authenticate: true
		}
	})

	.state('app.bookmarks', {
		url: "/bookmarks",
		views: {
			'menuContent': {
				templateUrl: "views/app/bookmarks.html",
				controller: 'BookMarksCtrl'
			}
		},
		data: {
			authenticate: true
		}
	})

	.state('app.contact', {
		url: "/contact",
		views: {
			'menuContent': {
				templateUrl: "views/app/contact.html",
				controller: 'ContactCtrl'
			}
		},
		data: {
			authenticate: true
		}
	})

	.state('app.post', {
		url: "/post/:postId",
		views: {
			'menuContent': {
				templateUrl: "views/app/wordpress/post.html",
				controller: 'PostCtrl'
			}
		},
		data: {
			authenticate: true
		},
		resolve: {
			post_data: function(PostService, $ionicLoading, $stateParams, locale) {
				$ionicLoading.show({
					template: locale.getString('app.posts-loading')
				});

				var postId = $stateParams.postId;
				return PostService.getPost(postId);
			}
		}
	})

	//ATF
	.state('app.authors', {
	  url: "/authors",
	  views: {
	    'menuContent' :{
	      	templateUrl: "views/app/wordpress/authors.html",
	  		controller: "PostAuthorsCtrl"
			}
		},
		data: {
			authenticate: true
		}
	})
	
	.state('app.author', {
    url: "/author/:authorName/:authorId",
	  views: {
	    'menuContent' :{
				templateUrl: "views/app/wordpress/author.html",
	  		controller: "PostAuthorCtrl"
	    }
	  },
		data: {
			authenticate: true
		}
	})
	
	.state('app.tags', {
	  url: "/tags",
	  views: {
	    'menuContent' :{
	      	templateUrl: "views/app/wordpress/tags.html",
	  		controller: "PostTagsCtrl"
			}
		},
		data: {
			authenticate: true
		}
	})
	
	.state('app.tag', {
    url: "/tag/:tagTitle/:tagId",
	  views: {
	    'menuContent' :{
				templateUrl: "views/app/wordpress/tag.html",
	  		controller: "PostTagCtrl"
	    }
	  },
		data: {
			authenticate: true
		}
	})
					    
	//ATF
	
	.state('app.settings', {
		url: "/settings",
		views: {
			'menuContent': {
				templateUrl: "views/app/settings.html",
				controller: 'SettingCtrl'
			}
		},
		data: {
			authenticate: true
		}
	})

	.state('app.category', {
		url: "/category/:categoryTitle/:categoryId",
		views: {
			'menuContent': {
				templateUrl: "views/app/wordpress/category.html",
				controller: 'PostCategoryCtrl'
			}
		},
		data: {
			authenticate: true
		}
	})

	.state('app.page', {
		url: "/wordpress_page",
		views: {
			'menuContent': {
				templateUrl: "views/app/wordpress/wordpress-page.html",
				controller: 'PageCtrl'
			}
		},
		data: {
			authenticate: true
		},
		resolve: {
			page_data: function(PostService) {
				//You should replace this with your page slug
				var page_slug = 'wordpress-page';
				return PostService.getWordpressPage(page_slug);
			}
		}
	})

;
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/home');
})

;
