/**
 * Listens for observer events and keeps track of elements matching the given selector.
 * Use Query.register to instantiate a new query object with a unique selector.
 *
 * @param {String} selector
 * @param {Observer} observer
 * @returns {Query}
 * @constructor
 */
var Query = function(selector, observer){

    var _super = new EventDispatcher();

    return utils.extend(

        _super,

        {
            //
            // Variables
            //

            _super: _super,

            /**
             * @type {String}
             */
            selector: selector,

            /**
             * @type {ElementList}
             */
            elementList: null,

            /**
             * @type {Array}
             */
            _watchableAttributes: null,

            //
            // Initialize
            //

            _init: function(){

                // Variables

                this.elementList = new ElementList(this.selector);
                this._watchableAttributes = [];

                // Mutation events

                observer.on(EventNames.REMOVED,     [this._syncElements.bind(this), this._onRemoved.bind(this)]);
                observer.on(EventNames.ADDED,       [this._syncElements.bind(this), this._onAdded.bind(this)]);
                observer.on(EventNames.ATTRIBUTES,  [this._onAttributes.bind(this)]);

                return this;
            },

            //
            // Override
            //

            /**
             * Overrides the on method of the super class.
             * Flushes the MutationObserver instance.
             *
             * @param {String} eventName
             * @param {Event} callback
             */
            on: function(eventName, callback){
                observer.observer.takeRecords();
                this._super.on(eventName, callback);
            },

            //
            // Observer event callbacks
            //

            // Mutation events

            /**
             * @private
             */
            _syncElements: function(){
                this.elementList.sync();
            },

            /**
             * @param {ObserverData} data
             * @private
             */
            _onRemoved: function(data){
                var removed = data.getRemovedElements()
                    .filter(this._filterMatchingElements.bind(this));
                removed.length && this.trigger(EventNames.REMOVED, removed);
            },

            /**
             * @param {ObserverData} data
             * @private
             */
            _onAdded: function(data){
                var added = data.getAddedElements()
                    .filter(this.elementList.hasElement.bind(this.elementList))
                    .filter(this._filterMatchingElements.bind(this));
                added.length && this.trigger(EventNames.ADDED, added);
            },

            /**
             * @param {ObserverData} data
             * @private
             */
            _onAttributes: function(data){
                var previousElements = this.elementList._elements;

                // The sync needs to happen before getting the attribute changes.
                this.elementList.sync();

                var elementList = this.elementList;
                var changes = data.getAttributeChanges(this._watchableAttributes)
                    .filter(function(change){
                        return elementList.hasElement(change.target);
                    });
                changes.length && this.trigger(EventNames.ATTRIBUTES, changes);

                // An attribute change may cause a selector to become active.
                // Diff the previous set of elements with the new set of elements to see if the length has changed.
                var currentElements = this.elementList._elements;
                var added = currentElements.filter(function(element){
                    for(var p=0; p<previousElements.length; p++){
                        if(previousElements[p].element == element.element){
                            return false;
                        }
                    }
                    return true;
                });
                added.length && this.trigger(EventNames.ADDED, added);
            },

            //
            // Public
            //

            find: function(){
                return Array.prototype.slice.call( document.querySelectorAll(this.selector) );
            },

            watchAttributes: function(attributes){
                attributes = Array.isArray(attributes) ? attributes : [attributes];
                this._watchableAttributes = utils.concatUnique(this._watchableAttributes, attributes);
            },

            //
            // Helpers
            //

            _filterMatchingElements: function(element){
                return element.matches(this.selector);
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
 */
Query.register = function(selector, observer){
    if(this._selectors.indexOf(selector) === -1){
        this._selectors.push(selector);
        this.queries.push(new Query(selector, observer));
    }
    var query = this.queries.filter(utils.filterByProperty.bind(this, 'selector', selector)).pop();
    return this.queries.filter(utils.filterByProperty.bind(this, 'selector', selector)).pop();
};