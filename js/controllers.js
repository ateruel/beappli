angular.module('beAppli.controllers', [])

//This is Controller for Dialog box.
.controller('DialogController', function ($scope, $mdDialog, displayOption) {

    //This variable for display wording of dialog.
    //object schema:
    //displayOption: {
    //        title: "Confirm to remove all data?",
    //        content: "All data will remove from local storage.",
    //        ok: "Confirm",
    //        cancel: "Close"
    //}
    $scope.displayOption = displayOption;

    $scope.cancel = function () {
        $mdDialog.cancel(); //close dialog.
    };

    $scope.ok = function () {
        $mdDialog.hide();//hide dialog.
    };
})
// End Controller for Dialog box.

//Controller for Toast.
.controller('toastController', function ($scope, displayOption) {

    //this variable for display wording of toast.
    //object schema:
    // displayOption: {
    //    title: "Data Saved !"
    //}

    $scope.displayOption = displayOption;
})
// End Controller for Toast.

// APP - RIGHT MENU
.controller('AppCtrl', function($scope, AuthService, BookMarkService, PostService) {
		
	$scope.$on('$ionicView.enter', function(){
		// Refresh user data & avatar
		$scope.user = AuthService.getUser();
	});

})

// CATEGORIES MENU
.controller('PushMenuCtrl', function($scope, Categories, locale) {

	var getItems = function(parents, categories){

		if(parents.length > 0){

			_.each(parents, function(parent){
				parent.name = parent.title;
				parent.link = parent.slug;

				var items = _.filter(categories, function(category){ return category.parent===parent.id; });

				if(items.length > 0){
					parent.menu = {
						title: parent.title,
						id: parent.id,
						items:items
					};
					getItems(parent.menu.items, categories);
				}
			});
		}
		return parents;
	};

	Categories.getCategories()
	.then(function(data){
		var sorted_categories = _.sortBy(data.categories, function(category){ return category.title; });
		var parents = _.filter(sorted_categories, function(category){ return category.parent===0; });
		var result = getItems(parents, sorted_categories);

		$scope.menu = {
			title: locale.getString('app.categories-all'),
			id: '0',
			items: result
		};
	});
})

// BOOKMARKS
.controller('BookMarksCtrl', function($scope, $rootScope, BookMarkService, locale, $window) {

	$scope.bookmarks = BookMarkService.getBookmarks();
	$scope.count = $scope.bookmarks.length;

	// When a new post is bookmarked, we should update bookmarks list
	$rootScope.$on("new-bookmark", function(event, post_id){
		$scope.bookmarks = BookMarkService.getBookmarks();
		$scope.count = $scope.bookmarks.length;
	});

	$scope.remove = function(bookmarkId, $event, localStorage)  {

		$scope.option1 = $window.localStorage.getItem('option1');
	 
		//mdDialog.show use for show alert box for Confirm to remove all data.
		//if ($scope.option1=="true") {
		// For confirm button
		BookMarkService.remove(bookmarkId);
		$scope.bookmarks = BookMarkService.getBookmarks();
		$scope.count = $scope.bookmarks.length;
		//}
		
	};

})

// CONTACT
.controller('ContactCtrl', function($scope) {

	//map
	$scope.position = {
		lat: 43.07493,
		lng: -89.381388
	};

	$scope.$on('mapInitialized', function(event, map) {
		$scope.map = map;
	});
})

// SETTINGS
.controller('SettingCtrl', function($scope, $ionicActionSheet, $window, $ionicModal, $state, AuthService) {
	
    $scope.option1 = $window.localStorage.getItem('option1') === 'true';

    $scope.pushOption1 = function() {
        if ($scope.option1 == true) $scope.option1 = false;
        else $scope.option1 = true;
        $window.localStorage.setItem('option1', $scope.option1);
        //console.log($scope.option1);
    };
        
	$scope.sendLocation = false;
	
	$ionicModal.fromTemplateUrl('views/common/terms.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.terms_modal = modal;
	});

	$ionicModal.fromTemplateUrl('views/common/faqs.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.faqs_modal = modal;
	});

	$ionicModal.fromTemplateUrl('views/common/credits.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.credits_modal = modal;
	});

	$scope.showTerms = function() {
		$scope.terms_modal.show();
	};

	$scope.showFAQS = function() {
		$scope.faqs_modal.show();
	};

	$scope.showCredits = function() {
		$scope.credits_modal.show();
	};

	// Triggered on a the logOut button click
	$scope.showLogOutMenu = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			// buttons: [
			// { text: '<b>Share</b> This' },
			// { text: 'Move' }
			// ],
			destructiveText: 'Se déconnecter',
			titleText: "Voulez-vous réellement vous déconnecter de l'application ?",
			cancelText: 'Annuler',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				//Called when one of the non-destructive buttons is clicked,
				//with the index of the button that was clicked and the button object.
				//Return true to close the action sheet, or false to keep it opened.
				return true;
			},
			destructiveButtonClicked: function(){
				//Called when the destructive button is clicked.
				//Return true to close the action sheet, or false to keep it opened.
				AuthService.logOut();
				$state.go('login');
			}
		});
	};
})

//EMAIL SENDER
.controller('EmailSenderCtrl', function($scope, $cordovaEmailComposer) {

	$scope.sendFeedback = function(){
		cordova.plugins.email.isAvailable(
			function (isAvailable) {
				// alert('Service is not available') unless isAvailable;
				cordova.plugins.email.open({
					to:			'john@doe.com',
					cc:			'jane@doe.com',
					subject: 'Feedback',
					body:		'This app is awesome'
				});
			}
		);
	};

	$scope.sendContactMail = function(){
		//Plugin documentation here: http://ngcordova.com/docs/plugins/emailComposer/

		$cordovaEmailComposer.isAvailable().then(function() {
			// is available
				$cordovaEmailComposer.open({
					to: 'john@doe.com',
					cc: 'sally@doe.com',
					subject: 'Contact from ionWordpress',
					body: 'How are you? Nice greetings from Uruguay'
				})
				.then(null, function () {
					// user cancelled email
				});
		}, function () {
			// not available
		});
	};

})


// RATE THIS APP
.controller('RateAppCtrl', function($scope) {

	$scope.rateApp = function(){
		if(ionic.Platform.isIOS()){
			AppRate.preferences.storeAppURL.ios = '<my_app_id>';
			AppRate.promptForRating(true);
		}else if(ionic.Platform.isAndroid()){
			AppRate.preferences.storeAppURL.android = 'market://details?id=<package_name>';
			AppRate.promptForRating(true);
		}
	};
})


//ADMOB
.controller('AdmobCtrl', function($scope, $ionicActionSheet, AdMob) {

	$scope.manageAdMob = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			buttons: [
			{ text: 'Show AdMob Banner' },
			{ text: 'Show AdMob Interstitial' }
			],
			destructiveText: 'Remove Ads',
			titleText: 'Choose the ad to show',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			destructiveButtonClicked: function() {
				console.log("removing ads");
				AdMob.removeAds();
				return true;
			},
			buttonClicked: function(index, button) {
				if(button.text == 'Show AdMob Banner')
				{
					console.log("show AdMob banner");
					AdMob.showBanner();
				}
				if(button.text == 'Show AdMob Interstitial')
				{
					console.log("show AdMob interstitial");
					AdMob.showInterstitial();
				}
				return true;
			}
		});
	};
})

//IAD
.controller('iAdCtrl', function($scope, $ionicActionSheet, iAd) {

	$scope.manageiAd = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			buttons: [
			{ text: 'Show iAd Banner' },
			{ text: 'Show iAd Interstitial' }
			],
			destructiveText: 'Remove Ads',
			titleText: 'Choose the ad to show - Interstitial only works in iPad',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			destructiveButtonClicked: function() {
				console.log("removing ads");
				iAd.removeAds();
				return true;
			},
			buttonClicked: function(index, button) {
				if(button.text == 'Show iAd Banner')
				{
					console.log("show iAd banner");
					iAd.showBanner();
				}
				if(button.text == 'Show iAd Interstitial')
				{
					console.log("show iAd interstitial");
					iAd.showInterstitial();
				}
				return true;
			}
		});
	};
})

// WALKTHROUGH
.controller('WalkthroughCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

	$scope.$on('$ionicView.enter', function(){
		//this is to fix ng-repeat slider width:0px;
		$ionicSlideBoxDelegate.$getByHandle('walkthrough-slider').update();
	});
})

//LOGIN
.controller('LoginCtrl', function($scope, $state, $ionicLoading, AuthService, PushNotificationsService, locale) {
	$scope.user = {};

	$scope.doLogin = function(){

		$ionicLoading.show({
			template: locale.getString('app.login-in')
		});

		var user = {
			userName: $scope.user.userName,
			password: $scope.user.password
		};

		AuthService.doLogin(user)
		.then(function(user){
			//success
			$state.go('app.home');

			$ionicLoading.hide();
		},function(err){
			//err
			$scope.error = err;
			$ionicLoading.hide();
		});
	};
})


// FORGOT PASSWORD
.controller('ForgotPasswordCtrl', function($scope, $state, $ionicLoading, AuthService, locale) {
	$scope.user = {};

	$scope.recoverPassword = function(){

		$ionicLoading.show({
			template: locale.getString('app.login-reset-in')
		});

		AuthService.doForgotPassword($scope.user.userName)
		.then(function(data){
			if(data.status == "error"){
				$scope.error = data.error;
			}else{
				$scope.message = locale.getString('app.login-reset-send');
			}
			$ionicLoading.hide();
		});
	};
})

// REGISTER
.controller('RegisterCtrl', function($scope, $state, $ionicLoading, AuthService, PushNotificationsService, locale) {
	$scope.user = {};

	$scope.doRegister = function(){

		$ionicLoading.show({
			template: locale.getString('app.login-register-in')
		});

		var user = {
			userName: $scope.user.userName,
			password: $scope.user.password,
			email: $scope.user.email,
			displayName: $scope.user.displayName
		};

		AuthService.doRegister(user)
		.then(function(user){
			//success
			$state.go('app.home');
			$ionicLoading.hide();
		},function(err){
			//err
			$scope.error = err;
			$ionicLoading.hide();
		});
	};
})

// HOME - GET RECENT POSTS
.controller('HomeCtrl', function($scope, $rootScope, $state, $ionicLoading, PostService, locale) {
	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;
	$scope.doRefresh = function() {

		$ionicLoading.show({
			template: locale.getString('app.posts-loading')
		});

		//Always bring me the latest posts => page=1
		PostService.getRecentPosts(1)
		.then(function(data){

			$scope.totalPages = data.pages;
			$scope.posts = PostService.shortenPosts(data.posts);

			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
 		});
	};

	$scope.loadMoreData = function(){
		$scope.page += 1;

		PostService.getRecentPosts($scope.page)
		.then(function(data){
			//We will update this value in every request because new posts can be created
			$scope.totalPages = data.pages;
			var new_posts = PostService.shortenPosts(data.posts);
			$scope.posts = $scope.posts.concat(new_posts);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	$scope.moreDataCanBeLoaded = function(){
		return $scope.totalPages > $scope.page;
	};

	$scope.sharePost = function(link){
		PostService.sharePost(link);
	};

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: locale.getString('app.bookmark-added'), noBackdrop: true, duration: 1000 });
		PostService.bookmarkPost(post);
	};

	$scope.doRefresh();

})

// POST
.controller('PostCtrl', function($scope, post_data, $location, $anchorScroll, $ionicLoading, PostService, AuthService, $ionicScrollDelegate, locale) {
	$scope.post = post_data.post;
	$scope.comments = _.map(post_data.post.comments, function(comment){
		if(comment.author){
			PostService.getUserGravatar(comment.author.id)
			.then(function(avatar){
				comment.user_gravatar = avatar;
			});
			return comment;
		}else{
			return comment;
		}
	});
	$ionicLoading.hide();

	$scope.scrollTo = function(id) {
		 $location.url(id);
		 $anchorScroll();
	}

	$scope.sharePost = function(link){
		window.plugins.socialsharing.share('Check this post here: ', null, null, link);
	};

	$scope.addComment = function(){

		$ionicLoading.show({
			template: locale.getString('app.comment-in-progress')
		});

		PostService.submitComment($scope.post.id, $scope.new_comment)
		.then(function(data){
			if(data.status=="ok"){
				var user = AuthService.getUser();

				var comment = {
					author: {name: user.data.username},
					content:$scope.new_comment,
					date: Date.now(),
					user_gravatar : user.avatar,
					id: data.comment_id
				};
				$scope.comments.push(comment);
				$scope.new_comment = "";
				$scope.new_comment_id = data.comment_id;
				$ionicLoading.hide();
				// Scroll to new post
				$ionicScrollDelegate.scrollBottom(true);
			}
		});
	};
})

//ATF 05/06/2016 ! add authors list
//TAGS
.controller('PostAuthorsCtrl', function($scope, $rootScope, $state, $ionicLoading, PostService, locale) {

	$scope.authors = [];
	$scope.authorsCompleted = false;
	// load more content function
	$scope.getAuthors = function(){
		PostService.getAuthors()
		.then(function(data){
			$scope.authors = data.authors;
			$scope.count = $scope.authors.length;
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.tags = [];
		$scope.getAuthors();
		$scope.count = $scope.authors.length;
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.doRefresh();

})
//ATF 05/06/2016 ! add authors list

//ATF 05/06/2016 ! add author page
//TAG
.controller('PostAuthorCtrl', function($scope, $rootScope, $state, $ionicLoading, $stateParams, PostService, locale) {

	$scope.author = {};
	$scope.author.id = $stateParams.authorId;
	$scope.author.name = $stateParams.authorName;

	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;

	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: locale.getString('app.posts-loading')
		});

		PostService.getPostsFromAuthor($scope.author.id, 1)
		.then(function(data){
			$scope.totalPages = data.pages;
			$scope.posts = PostService.shortenPosts(data.posts);

			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.loadMoreData = function(){
		$scope.page += 1;

		PostService.getPostsFromAuthor($scope.author.id, $scope.page)
		.then(function(data){
			//We will update this value in every request because new posts can be created
			$scope.totalPages = data.pages;
			var new_posts = PostService.shortenPosts(data.posts);
			$scope.posts = $scope.posts.concat(new_posts);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	$scope.moreDataCanBeLoaded = function(){
		return $scope.totalPages > $scope.page;
	};

	$scope.sharePost = function(link){
		PostService.sharePost(link);
	};

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: locale.getString('app.bookmark-added'), noBackdrop: true, duration: 1000 });
		PostService.bookmarkPost(post);
	};

	$scope.doRefresh();
})
//ATF 05/06/2016 ! add author page


//ATF 05/06/2016 ! add tags list
//TAGS
.controller('PostTagsCtrl', function($scope, $rootScope, $state, $ionicLoading, PostService, locale) {

 $scope.dividerFunction = function(key) {
    return key;
  };

	$scope.tags = [];
	$scope.tagsCompleted = false;

	// load more content function
	$scope.getTags = function(){
		PostService.getTags()
		.then(function(data){
			$scope.tags = data.tags;
			$scope.count = data.count;
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	// pull to refresh buttons
	$scope.doRefresh = function(){
		$scope.tags = [];
		$scope.getTags();
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.doRefresh();

})
//ATF 05/06/2016 ! add tags list

//ATF 05/06/2016 ! add tag page
//TAG
.controller('PostTagCtrl', function($scope, $rootScope, $state, $ionicLoading, $stateParams, PostService, locale) {

	$scope.tag = {};
	$scope.tag.id = $stateParams.tagId;
	$scope.tag.title = $stateParams.tagTitle;

	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;

	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: locale.getString('app.posts-loading')
		});

		PostService.getPostsFromTag($scope.tag.id, 1)
		.then(function(data){
			$scope.totalPages = data.pages;
			$scope.posts = PostService.shortenPosts(data.posts);

			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.loadMoreData = function(){
		$scope.page += 1;

		PostService.getPostsFromTag($scope.tag.id, $scope.page)
		.then(function(data){
			//We will update this value in every request because new posts can be created
			$scope.totalPages = data.pages;
			var new_posts = PostService.shortenPosts(data.posts);
			$scope.posts = $scope.posts.concat(new_posts);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	$scope.moreDataCanBeLoaded = function(){
		return $scope.totalPages > $scope.page;
	};

	$scope.sharePost = function(link){
		PostService.sharePost(link);
	};

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: locale.getString('app.bookmark-added'), noBackdrop: true, duration: 1000 });
		PostService.bookmarkPost(post);
	};

	$scope.doRefresh();
})
//ATF 05/06/2016 ! add tag page

// CATEGORY
.controller('PostCategoryCtrl', function($scope, $rootScope, $state, $ionicLoading, $stateParams, PostService, locale) {

	$scope.category = {};
	$scope.category.id = $stateParams.categoryId;
	$scope.category.title = $stateParams.categoryTitle;

	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;

	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: locale.getString('app.posts-loading')
		});

		PostService.getPostsFromCategory($scope.category.id, 1)
		.then(function(data){
			$scope.totalPages = data.pages;
			$scope.posts = PostService.shortenPosts(data.posts);

			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.loadMoreData = function(){
		$scope.page += 1;

		PostService.getPostsFromCategory($scope.category.id, $scope.page)
		.then(function(data){
			//We will update this value in every request because new posts can be created
			$scope.totalPages = data.pages;
			var new_posts = PostService.shortenPosts(data.posts);
			$scope.posts = $scope.posts.concat(new_posts);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	$scope.moreDataCanBeLoaded = function(){
		return $scope.totalPages > $scope.page;
	};

	$scope.sharePost = function(link){
		PostService.sharePost(link);
	};

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: locale.getString('app.bookmark-added'), noBackdrop: true, duration: 1000 });
		PostService.bookmarkPost(post);
	};

	$scope.doRefresh();
})


// WP PAGE
.controller('PageCtrl', function($scope, page_data) {
	$scope.page = page_data.page;
})

;
