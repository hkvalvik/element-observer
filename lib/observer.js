/**
 * Listen for DOM mutations and events that may cause the visual layout to change.
 *
 * @returns {Observer}
 * @constructor
 */
var Observer = function(){

    return utils.extend(

        new EventDispatcher(EventNames.all),

        {
            //
            // Variables
            //

            /**
             * @type {Window.MutationObserver}
             */
            observer: undefined,

            /**
             * @type {Function}
             */
            _resizeListener: null,

            /**
             * Observer options
             *
             * @type {Object}
             */
            _mutationObserverConfig: {
                attributes: true,
                attributeFilter: ['class', 'style'], // TODO
                attributeOldValue: true,
                childList: true,
                subtree: true,
                characterData: true
            },

            //
            // Initialize
            //

            /**
             * @private
             */
            _init: function(){
                this._resizeListener = this._getEventDispatcher.bind(this, 'resized');
                this.observer = new MutationObserver(this._onMutations.bind(this));
                return this;
            },

            //
            // Events
            //

            /**
             * Dispatches an event handler with window.requestAnimationFrame.
             *
             * @param {String} eventName
             * @param {Event} event
             * @private
             */
            _getEventDispatcher: function(eventName, event){
                utils.requestAnimationFrame.bind(window, this._eventCallback.bind(this, eventName, event))();
            },

            /**
             * The event handler for events such as window.resize.
             *
             * @param {String} eventName
             * @param {Event} event
             * @private
             */
            _eventCallback: function(eventName, event){
                var data = new ObserverData({event: event});

                // Notify listeners that the event has occurred.
                this.trigger(eventName, data);
            },


            /**
             * @param {MutationRecord} mutations
             * @private
             */
            _onMutations: function(mutations){
                var data = new ObserverData({mutations: mutations});

                // Notify listeners that mutations have occurred.
                this.trigger(EventNames.MUTATION, data);

                // Notify listeners of specific mutations.
                for(var t=0; t<data.types.length; t++){
                    var type = data.types[t];
                    this.trigger(type, data);
                }
            },

            //
            // Public
            //

            connect: function(){
                this.observer.observe(document.documentElement, this._mutationObserverConfig);
                window.addEventListener('resize', this._resizeListener);
            },

            disconnect: function(){
                this.observer.disconnect();
                window.removeEventListener('resize', this._resizeListener);
            }

        }
    )._init();
};