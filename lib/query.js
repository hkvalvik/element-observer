/**
 * Use Query.register to instantiate a new query object with a unique selector.
 *
 * @param {String} selector
 * @returns {Query}
 * @constructor
 */
var Query = function(selector){

    return utils.extend(

        new EventDispatcher(),

        {
            //
            // Variables
            //

            selector: selector,

            _elements: undefined,

            _watchableProperties: undefined,

            _watchableAttributes: undefined,

            //
            // Initialize
            //

            _init: function(){
                this._elements = [];
                this._watchableProperties = [];
                this._watchableAttributes = [];
                return this;
            },

            //
            // Public
            //

            find: function(){
                return Array.prototype.slice.call( document.querySelectorAll(this.selector) );
            },

            watchProperties: function(properties){
                properties = Array.isArray(properties) ? properties : [properties];
                this._watchableProperties = utils.concatUnique(this._watchableProperties, properties);
            },

            watchAttributes: function(attributes){
                attributes = Array.isArray(attributes) ? attributes : [attributes];
                this._watchableAttributes = utils.concatUnique(this._watchableAttributes, attributes);
            },

            update: function(data){
                var types = data.types;
                if(data.hasType('removed')){
                    var removed = this._updateRemovedElements();
                    removed.length && this.trigger('removed', removed.map(this._getElement.bind(this)));
                }
                if(this._elements.length && this.hasEventListener('change')){
                    var changes = this._getChanges();
                    changes.length && this.trigger('change', changes);
                }
                if(data.hasType('added')){
                    var added = this._updateAddedElements();
                    added.length && this.trigger('added', added.map(this._getElement.bind(this)));
                }
                if(data.hasType('attributes')){
                    var attributes = this._getAttributeChanges(data.mutations);
                    attributes.length && this.trigger('attribute', attributes);
                }
            },

            //
            // Private
            //

            _getChanges: function(){
                var changes = [];
                for(var e=0; e<this._elements.length; e++){
                    var element = this._elements[e];
                    var elementChanges = element.getChanges(this._watchableProperties);
                    elementChanges && changes.push(elementChanges);
                }
                return changes;
            },

            /**
             * Remove elements from this._elements that no longer exist in the dom
             *
             * @returns {Array}
             * @private
             */
            _updateRemovedElements: function(){
                var removed = this._elements.filter(function(element){
                    return !utils.isInDom(element.element);
                });
                this._elements = this._elements.filter(function(element){
                    return utils.isInDom(element.element);
                });
                return removed;
            },

            /**
             * Get elements that haven't been added earlier to this._elements
             *
             * @returns {Array}
             * @private
             */
            _updateAddedElements: function(){
                var added = Array.prototype.slice.call(
                    document.querySelectorAll(selector)
                );
                var elements = this._elements.map(this._getElement.bind(this));
                added = added.filter(function(check){
                    return elements.indexOf(check) === -1;
                });
                added = added.map(function(element){
                    return new Element(element, this._watchableProperties, this.selector);
                }.bind(this));
                this._elements = this._elements.concat(added);
                return added;
            },

            _getAttributeChanges: function(mutations){
                var changes = [];
                for(var m=0; m<mutations.length; m++){
                    var mutation = mutations[m];
                    if(mutation.type == 'attributes' && this._watchableAttributes.indexOf(mutation.attributeName) !== -1){
                        var elements = this._elements.map(this._getElement.bind(this));
                        if(elements.indexOf(mutation.target) !== -1){
                            changes.push({
                                target: mutation.target,
                                attributeName: mutation.attributeName,
                                oldValue: mutation.oldValue
                            });
                        }
                    }
                }
                return changes;
            },

            _getElement: function(element){
                return element.element;
            }

        }
    )._init()
};

// Static

Query._selectors = [];

Query.queries = [];

/**
 * Registers an query for a selector.
 * If called again with a previously registered selector, the previously registered query will be returned.
 *
 * @param {String} selector
 * @returns {Array}
 * @private
 */
Query.register = function(selector){
    if(this._selectors.indexOf(selector) === -1){
        this._selectors.push(selector);
        this.queries.push(new Query(selector));
    }
    var query = this.queries.filter(utils.filterByProperty.bind(this, 'selector', selector)).pop();
    return this.queries.filter(utils.filterByProperty.bind(this, 'selector', selector)).pop();
};