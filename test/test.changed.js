describe('Change', function(){

    //it('should ignore previous changes', function(){
    //    Utils.append(
    //        '[data-element-container]',
    //        '<div class="coral"></div>'
    //    );
    //    document.querySelector('.coral').style.width = '200px';
    //    elementObserver('body .coral').changed(['clientWidth'], function(changes){
    //        throw new Error('Did not expect any elements');
    //    });
    //})

    it('should return changes happening synchronously', function(done){
        Utils.append(
            'body', // Cannot be added to the container, must be visible in order for clientWidth to change
            '<div class="lightgreen">lightgreen</div>'
        );
        var elements = document.querySelectorAll('.lightgreen');
        elementObserver('body .lightgreen').changed(['clientWidth'], function(changes){
            assert.equal(changes.length, 1);
            assert.equal(changes[0].target.getAttribute('class'), 'lightgreen');
            done();
        });

        elements[0].style.width = '200px';
    })

    it('should return changes happening asynchronously', function(done){
        Utils.append(
            'body', // Cannot be added to the container, must be visible in order for clientWidth to change
            '<div class="darkgrey">lightgreen</div>'
        );
        elementObserver('body .darkgrey').changed(['clientWidth'], function(changes){
            assert.equal(changes.length, 1);
            assert.equal(changes[0].target.getAttribute('class'), 'darkgrey');
            done();
        });
        setTimeout(function(){
            var elements = document.querySelectorAll('.darkgrey');
            elements[0].style.width = '200px';
        }, 1)
    })

    it('should use different callbacks for different changes', function(done){
        var count = 0;
        Utils.append(
            'body',
            '<div class="grey grey-1" style="width: 100px"></div>' +
            '<div class="grey grey-2" style="width: 100px"></div>'
        );
        elementObserver('body .grey-1').changed('innerText', function(changes){
            assert.equal(changes.length, 1);
            assert.equal(changes[0].items[0].property, 'innerText');
        });
        elementObserver('body .grey-2').changed('clientWidth', function(changes){
            assert.equal(changes.length, 1);
            assert.equal(changes[0].items[0].property, 'clientWidth');
            done();
        });
        setTimeout(function(){
            document.querySelector('.grey-1').innerText = 'Hello world';
            document.querySelector('.grey-2').style.width = '150px';
        }, 2);
    })

})
