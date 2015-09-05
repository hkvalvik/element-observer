/**
 * @returns {ElementList}
 * @constructor
 */
var ElementList = function(selector){

    return utils.extend(

        new EventDispatcher([EventNames.CHANGED]),

        {

            //
            // Variables
            //

            /**
             * @type {String}
             */
            _selector: selector,

            /**
             * @type {Array}
             */
            _elements: null,

            /**
             * @type {Array}
             */
            _watchableProperties: null,

            //
            // Initialize
            //

            _init: function(){
                this._elements = [];
                this._watchableProperties = [];

                // Mutation events

                observer.on(EventNames.REMOVED,     this._onChanged.bind(this));
                observer.on(EventNames.ADDED,       this._onChanged.bind(this));
                observer.on(EventNames.ATTRIBUTES,  this._onChanged.bind(this));

                // Window resize event

                observer.on(EventNames.RESIZED,     this._onChanged.bind(this));

                // Sync

                this.sync();

                return this;
            },

            //
            // Events
            //

            _onChanged: function(data){
                var changes = this._getChanges();
                changes.length && this.trigger(EventNames.CHANGED, changes);
            },

            _getChanges: function(){
                var changes = [];
                for(var e=0; e<this._elements.length; e++){
                    var element = this._elements[e];
                    var elementChanges = element.getChanges();
                    elementChanges && changes.push(elementChanges);
                }
                return changes;
            },

            //
            // Public
            //

            watchProperties: function(properties){
                properties = Array.isArray(properties) ? properties : [properties];
                this._watchableProperties = utils.concatUnique(this._watchableProperties, properties);

                this._getChanges();
            },

            /**
             * Sync elements in the list with elements in the DOM.
             */
            sync: function(){
                var domElements = document.querySelectorAll(this._selector);

                this._elements = [];
                for(var d=0; d<domElements.length; d++){
                    var domElement = domElements[d];
                    var element = Element.register(domElement, this._watchableProperties);
                    this._elements.push(element);
                }

                this.length = this._elements.length;
            },

            hasElement: function(element){
                for(var e=0; e<this._elements.length; e++){
                    var existing = this._elements[e].element;
                    if(existing == element){
                        return true;
                    }
                }
                return false;
            }

        }
    )._init();

};