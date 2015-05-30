document.write('<div class="exists"></div>');

describe('Find', function(){

    it('should return an array of existing elements', function(done){
        elementObserver('body .exists').find(function(elements){
            assert.equal(elements.length, 1);
            assert.equal(elements[0].getAttribute('class'), 'exists');
            done();
        });
    })

});