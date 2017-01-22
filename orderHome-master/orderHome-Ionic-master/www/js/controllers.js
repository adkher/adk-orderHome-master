angular.module('orderHome.controllers', [])

.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, AuthFactory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.reservation = {};
    $scope.registration = {};
    $scope.loggedIn = false;
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
    
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        $scope.closeLogin();
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
      
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
   

    

    

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the login modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);
        $scope.loginData.username = $scope.registration.username;
        $scope.loginData.password = $scope.registration.password;

        AuthFactory.register($scope.registration);
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
       
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $localStorage.storeObject('userinfo',$scope.loginData);
    });
    
    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });
            $scope.registerform.show();
        };
        
          var pickoptions = {
              maximumImagesCount: 1,
              width: 100,
              height: 100,
              quality: 50
          };
        
        $scope.pickImage = function() {
          $cordovaImagePicker.getPictures(pickoptions)
              .then(function (results) {
                  for (var i = 0; i < results.length; i++) {
                      console.log('Image URI: ' + results[i]);
                      $scope.registration.imgSrc = results[0];
                  }
              }, function (error) {
                  // error getting photos
              });
        };
 
    });
})
.controller('HomeController', [ '$ionicPopup', '$ionicPopover','$stateParams', '$scope', '$state', '$ionicModal','storeFactory', 'orderFactory', 'infoExchange', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ( $ionicPopup, $ionicPopover,$stateParams, $scope, $state, $ionicModal, storeFactory, orderFactory, infoExchange, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
}])


.controller('StoreController', ['$scope', '$state', '$ionicModal','storeFactory', 'infoExchange', 'baseURL',  '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, $state, $ionicModal, storeFactory, infoExchange, baseURL,  $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = 'Grocery';
    $scope.showDetails = false;
    $scope.store = {};
    $scope.newstore = {};
    $scope.selectedStore = {};
    
    
    
    storeFactory.query(
        function (response) {
            $scope.stores = response;
            var size = Object.keys($scope.stores).length;
            console.log('Found total stores : '+ size);
            var theStore;
            for (theStore in $scope.stores) {
               console.log('Store catagory : '+ theStore);
            }
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    
    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "Food";
        } else if (setTab === 3) {
            $scope.filtText = "Other";
        } else {
            $scope.filtText = "Grocery";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.removeStore = function (storeid) {

        var confirmPopup = $ionicPopup.confirm({
            title: '<h3>Confirm Delete</h3>',
            template: '<p>Are you sure you want to delete this item?</p>'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                storeFactory.delete({id: storeid});
         
               $state.go($state.current, {}, {reload: true});
               // $window.location.reload();
            } else {
                console.log('Canceled delete');
            }
        });
        $scope.shouldShowDelete = false;


    }
    
    $ionicModal.fromTemplateUrl('templates/addStore.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.storeForm = modal;
    });
    
    $scope.showAddStoreForm = function () {
        $scope.storeForm.show();
        
    };
    
    $scope.closeStoreForm = function () {
        $scope.storeForm.hide();
    };
    
     $scope.setStoreType = function(type) {
        $scope.newstore.storetype = type;
    };
    
    $scope.setSelectedStore = function(theSelectedStore){
        $scope.selectedStore = theSelectedStore;
        infoExchange.setStore(theSelectedStore);
        console.log('Selected store'+$scope.selectedStore.storename);
    }
    
    
    $scope.addStore = function() {
        console.log('Adding store'+$scope.newstore.storename+' : '+ $scope.newstore.storetype);
        storeFactory.save($scope.newstore);
         $state.go($state.current, {}, {reload: true});
         $scope.closeStoreForm();

        
        $scope.newstore = {};
    }
    
}])
.controller('OrderController', [ '$scope', '$state', '$ionicModal','storeFactory', 'orderFactory', 'infoExchange', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ( $scope, $state, $ionicModal, storeFactory, orderFactory, infoExchange,  baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.order = {};
    $scope.neworder = {};
    $scope.selectedStore = {};
    
  
    
    
    orderFactory.query(
        function (response) {
            $scope.orders = response;
            
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    
    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "Food";
        } else if (setTab === 3) {
            $scope.filtText = "Other";
        } else {
            $scope.filtText = "Grocery";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

        
    $ionicModal.fromTemplateUrl('templates/addOrder.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.orderForm = modal;
    });
    
    $scope.showAddOrderForm = function () {
        $scope.selectedStore = infoExchange.getStore();
        $scope.orderForm.show();
        
    };
    
    $scope.closeOrderForm = function () {
        $scope.orderForm.hide();
    };
    
    
    
    
    
    $scope.addOrder = function() {
        $scope.neworder.fromStore = infoExchange.getStore()._id;
        console.log('Adding order for store '+infoExchange.getStore().storename);
        console.log('store databaseID : '+infoExchange.getStore()._id);
        orderFactory.save($scope.neworder);
         $state.go($state.current, {}, {reload: true});
         $scope.closeOrderForm();

        
        $scope.neworder = {};
    }
    
}])
.controller('OrderDetailController', [ '$ionicPopup', '$ionicPopover','$stateParams', '$scope', '$state', '$ionicModal','storeFactory', 'orderFactory', 'infoExchange', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ( $ionicPopup, $ionicPopover,$stateParams, $scope, $state, $ionicModal, storeFactory, orderFactory, infoExchange,  baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.order = {};
    $scope.neworder = {};
    $scope.selectedStore = {};
    
    
    $scope.order = orderFactory.get({
            id: $stateParams.id
        },
            function (response) {
                $scope.order = response;
                console.log($scope.order);
            },
            function (response) {
            }
        );  
        
    
    
    $ionicPopover.fromTemplateUrl('templates/order-detail-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });


    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
        // Execute action
    });
    
    $ionicModal.fromTemplateUrl('templates/edit-order.html', {
        scope: $scope,
        state: $state
    }).then(function (modal) {
        $scope.editOrderForm = modal;
    });
    
    $scope.showEditOrderForm = function () {
        
     //   $scope.selectedStore = infoExchange.getStore();
        $scope.editOrderForm.show();
        
        
    };
    
    $scope.closeEditOrderForm = function () {
        $scope.editOrderForm.hide();
    };
    
    $scope.editOrder = function(){
        $scope.showEditOrderForm();
        $scope.closePopover();
    }
    
    $scope.cancelOrder = function (orderid) {
        $scope.closePopover();
        var confirmPopup = $ionicPopup.confirm({
            title: '<h3>Confirm Delete</h3>',
            template: '<p>Are you sure you want to cancel this order?</p>'
        });

        confirmPopup.then(function (res) {
            if (res) {
                if($scope.order.orderStatus === 'accepted') {
                    console.log('Ok to delete');
                    console.log(orderid);
                  //  orderFactory.delete({$stateParams.id});
                    orderFactory.delete({id: orderid});
                    $state.go($state.current, {}, {reload: true});
                    
                } else {
                    console.log('Order cannot be canceled');
                }
                
               // $window.location.reload();
            } else {
                console.log('Canceled delete');
            }
        });
        


    }
    
    
    
    $scope.saveOrderChanges = function () {
        console.log($scope.order._id);
        console.log($state.current.toString);
        
        $scope.order.update(function() {
            $state.go('orders'); // on success go back to home i.e. movies state.
        });
      //  orderFactory.update($stateParams.id);
      //   $state.go($state.current, {}, {reload: true});
        $scope.closeEditOrderForm();
    }
    
   
    
   
    
}])
.controller('EditOrderController', [ '$ionicPopup', '$ionicPopover','$stateParams', '$scope', '$state', '$ionicModal','storeFactory', 'orderFactory', 'infoExchange', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ( $ionicPopup, $ionicPopover,$stateParams, $scope, $state, $ionicModal, storeFactory, orderFactory, infoExchange, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.order = {};
    $scope.neworder = {};
    $scope.selectedStore = {};
    
    
    $scope.order = orderFactory.get({
            id: $stateParams.id
        },
            function (response) {
                $scope.order = response;
                console.log($scope.order);
            },
            function (response) {
            }
        );  
        
    
    
    $ionicPopover.fromTemplateUrl('templates/order-detail-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });


    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
        // Execute action
    });
    
    $ionicModal.fromTemplateUrl('templates/edit-order.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.editOrderForm = modal;
    });
    
    $scope.showEditOrderForm = function () {
        
        $scope.selectedStore = infoExchange.getStore();
        $scope.editOrderForm.show();
        
        
    };
    
    $scope.closeEditOrderForm = function () {
        $scope.editOrderForm.hide();
    };
    
    $scope.editOrder = function(){
        $scope.showEditOrderForm();
        $scope.closePopover();
    }
    
    $scope.cancelOrder = function (orderid) {
        $scope.closePopover();
        var confirmPopup = $ionicPopup.confirm({
            title: '<h3>Confirm Delete</h3>',
            template: '<p>Are you sure you want to cancel this order?</p>'
        });

        confirmPopup.then(function (res) {
            if (res) {
                if($scope.order.orderStatus === 'accepted') {
                    console.log('Ok to delete');
                    console.log(orderid);
                  //  orderFactory.delete({$stateParams.id});
                    orderFactory.delete({id: orderid});
                    $state.go($state.current, {}, {reload: true});
                    
                } else {
                    console.log('Order cannot be canceled');
                }
                
               // $window.location.reload();
            } else {
                console.log('Canceled delete');
            }
        });
        


    }
    
    
    
    $scope.saveOrderChanges = function (orderid) {
        orderFactory.update({_id: orderid});
      //  orderFactory.update($stateParams.id);
         $state.go($state.current, {}, {reload: true});
    }
    
    $ionicModal.fromTemplateUrl('templates/addOrder.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.orderForm = modal;
    });
    
   
    
}])

;