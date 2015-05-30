/**
 * Tracks changes to an element.
 *
 * @param {Element} element
 * @param {Array} properties - The properties to track
 * @returns {*}
 * @constructor
 */
var Element = function(element, properties){

    return {

        //
        // Variables
        //

        element: element,

        _properties: properties,

        _snapshot: null,

        //
        // Initialize
        //

        _init: function(){
            this._snapshot = this._getSnapshot();
            return this;
        },

        //
        // Public
        //

        getChanges: function(properties){
            this._properties = properties;
            var diff = this._diff();
            this._snapshot = this._getSnapshot();
            return diff;
        },

        //
        // Private
        //

        _diff: function(){
            var diff = {
                target: this.element,
                items: []
            };
            for(var p=0; p<this._properties.length; p++){
                var property = this._properties[p];
                var item = this._getPropertyDiff(property);
                item && diff.items.push(item);
            }
            return diff.items.length ? diff : null;
        },

        _getPropertyDiff: function(property){
            var currentValue = this.element[property];
            var oldValue = this._snapshot[property];
            if(currentValue !== oldValue){
                return {
                    property: property,
                    value: currentValue,
                    oldValue: oldValue
                };
            }
        },

        _getSnapshot: function(){
            var snapshot = {};
            for(var p=0; p<this._properties.length; p++){
                var property = this._properties[p];
                var value = this.element[property];
                snapshot[property] = this.element[property];
            }
            return snapshot;
        }

    }._init();

};