/**
 * Listen to DOM changes
 *
 * @param {Function} callback
 * @returns {Observer}
 * @constructor
 */
var Observer = function(callback){

    return {

        /**
         * @type {MutationObserver}
         */
        observer: undefined,

        /**
         * @type {Function}
         */
        _resizeListener: null,

        /**
         * @type {Object}
         */
        _mutationObserverConfig: {
            attributes: true,
            attributeOldValue: true,
            childList: true,
            subtree: true,
            characterData: true
        },

        /**
         * @private
         */
        _init: function(){
            this._resizeListener = utils.requestAnimationFrame.bind(window, this._onResize.bind(this));
            this.observer = new MutationObserver(this._onMutations.bind(this));
            this.connect();
            return this;
        },

        _onResize: function(event){
            var data = new ObserverData({
                event: event
            });
            callback(data);
        },


        /**
         * @param {MutationRecord} mutations
         * @private
         */
        _onMutations: function(mutations){
            var data = new ObserverData({
                mutations: mutations
            });
            callback(data);
        },

        connect: function(){
            this.observer.observe(document.documentElement, this._mutationObserverConfig);
            window.addEventListener('resize', this._resizeListener);
        },

        disconnect: function(){
            this.observer.disconnect();
            window.removeEventListener('resize', this._resizeListener);
        }

    }._init();
};