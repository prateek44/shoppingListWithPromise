(function()
{
  //'use strict';
  angular.module('shoppingListApp',[])
  .controller('shoppingListAppController',shoppingListAppController)
  .service('shoppingListService',shoppingListService)
  .service('validateService',validateService);
  shoppingListAppController.$inject=['shoppingListService'];

  validateService.$inject=['$q','$timeout'];
  function shoppingListAppController(shoppingListService)
  {
    console.log('shoppingListAppController');
    var list=this;
    list.itemName="";
    list.qtyName="";
    list.addItems=function()
    {
      var currentItem={
        name:list.itemName,
        quantity:list.qtyName
      };

      list.addedList=shoppingListService.addItems(currentItem);



    };


  }
  shoppingListService.$inject=['$q','validateService'];
  function shoppingListService($q,validateService)
  {
    console.log('singleton shoppingListService instantiated');
    var service=this;
    service.itemsList=[];
    service.addItems=function(currentItem)
    {
      console.log('shoppingListService addItems() called ');
      console.log('current item received',currentItem);
      console.log('calling validateService checkItem() to perform background validation');
      var promiseItemName=validateService.checkItemName(currentItem);
      var promiseItemQty=validateService.checkItemQuantity(currentItem);
      console.log('promiseItemName',promiseItemName);
      $q.all([promiseItemName,promiseItemQty]).
      then(function(resolve)
    {
      console.log('item ready to add to cart',currentItem);
      service.itemsList.push(currentItem);
      console.log('item added to add to cart',currentItem);

    }).
    catch(function(error)
  {
    console.log(error.message);
  });
  //     promiseItemName.then(function(resolved)
  //   {
  //     console.log('',currentItem);
  //     console.log();
  //     var promiseItemQty=validateService.checkItemQuantity(currentItem);
  //     promiseItemQty.then(function(resolved)
  //   {
  //     console.log('item ready to add to cart',currentItem);
  //     service.itemsList.push(currentItem);
  //     console.log('item added to add to cart',currentItem);
  //
  //   },function(rejected)
  // {
  //
  // });
  //
  //   },function(rejected)
  // {
  //
  // });
//   promiseItemName.then(function(resolved)
// {
//   return validateService.checkItemQuantity(currentItem);
//
// })
// .then(function()
// {
//   console.log('item ready to add to cart',currentItem);
//   service.itemsList.push(currentItem);
//   console.log('item added to add to cart',currentItem);
//
// })
// .catch(function(error)
// {
//   console.log(error.message);
//
// });

console.log('service.itemsList',service.itemsList);
return service.itemsList;
    };


  }

  function validateService($q,$timeout)
  {
    console.log('validateService called');
    var validateservice=this;

    validateservice.checkItemName=function(currentItem)
    {
      var deferred=$q.defer();
      console.log('checkItemName() of validateService called');
      var currentItemName=currentItem.name;
      var currentItemQty=currentItem.quantity;
      console.log('currentItemName',currentItemName);

      var result={message:""};
      $timeout(function()
    {
      if(currentItemName.toLowerCase().indexOf('cookie')===-1)
      {
        console.log('currentitem with the name available in the store');
        deferred.resolve(result);

      }
      else {
        result.message='cookie out of stock please select some other item';
        console.log('',result.message);
        deferred.reject(result);
      }
    },3000);

    return deferred.promise;
    };

    validateservice.checkItemQuantity=function(currentItem)
    {
      var deferred=$q.defer();
      var currentItemName=currentItem.name;
      var currentItemQty=currentItem.quantity;
      console.log('checkItemQuantity() of validateService called');
      console.log('currentItemQty',currentItemQty);
      var result={message:""};
      $timeout(function()
      {
        if(currentItemQty<7)
        {
          console.log('item available',currentItem);
          deferred.resolve(result);

        }
        else {
          result.message='please select less than 7 items, shortage there in the store';
          console.log('',result.message);
          deferred.reject(result);
        }

      },1000);


      return deferred.promise;



    };
  }


})();
