describe('Core', function(){

    function getQuery(selector){
        return Query.queries.filter(function(query){
            return query.selector == selector;
        }).pop();
    }

    // Test whether the objects get constructed when calling the API methods

    var methods = [
        {methodName: 'find'},
        {methodName: 'added'},
        {methodName: 'removed'},
        {methodName: 'attribute', args: ['data-test']},
        {methodName: 'changed', args: ['clientWidth']}
    ];
    for(var m=0; m<methods.length; m++){
        var method = methods[m];
        var args = method.args || [];
        args = args.concat(function(){});

        it('should construct a query after calling '+method.methodName, function(){
            var query;
            elementObserver('.lime-defined')[method.methodName].apply(args);
            query = getQuery('.lime-defined');
            assert.isDefined(query);
            query = getQuery('.lime-undefined');
            assert.isUndefined(query);
        })

        it('should construct a list of existing elements after calling '+method.methodName, function(){
            Utils.append(
                'body',
                '<div class="orange">orange</div>' +
                '<div class="orange">orange</div>'
            );
            elementObserver('body .orange')[method.methodName].apply(args);
            var query = getQuery('body .orange');
            var elementList = query.elementList;
            assert.isDefined(elementList);
            var elements = elementList._elements;
            assert.equal(elements.length, 2);
            Utils.remove('body', '.orange');
        })

        it('should construct elements that haven\'t yet changed when calling '+method.methodName, function(){
            Utils.append(
                'body',
                '<div class="orange">orange</div>'
            );
            elementObserver('body .orange')[method.methodName].apply(args);
            var query = getQuery('body .orange');
            var elementList = query.elementList;
            var element = elementList._elements[0];
            console.log(element._snapshot, args)
            assert.isNull(element.getChanges())
            Utils.remove('body', '.orange');
        })
    }

})
