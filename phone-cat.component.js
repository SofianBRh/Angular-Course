
angular.module('phonecatApp').component('phoneCat',{
template:'<ul><li ng-repeat="phone in $ctrl.phones"><span>{{phone.name}}</span> <button ng-click="$ctrl.delete($index)">Delete</button></li></ul>'+ '<p>{{$ctrl.phones.length}} items total</p>' + '<button ng-click="$ctrl.addPhone()">Add</button>' ,
controller: function() {
    /**
     * Adds a phone to the list of phones.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    this.addPhone = function() {
      this.phones.push({
        name: 'SOSO',
        snippet: 'Fast just got faster with Nexus S.'
      });
    }
    this.delete = function(index) {
      this.phones.splice(index, 1);
    }
    this.phones = [
      {
        name: 'Nexus S',
        snippet: 'Fast just got faster with Nexus S.'
      }, {
        name: 'Motorola XOOM with Wi-Fi',
        snippet: 'The Next, Next Generation tablet with Wi-Fi.'
      }, {
        name: 'MOTOROLA XOOM',
        snippet: 'The Next, Next Generation tablet.'
      }
    ];
  }
});
