describe('Attribute', function(){

    it('should ignore previous attribute changes, even synchronously', function(done){
        Utils.append(
            '[data-element-container]',
            '<div class="purple"></div>' +
            '<div class="purple"></div>' +
            '<div class="purple"></div>'
        );
        document.querySelector('.purple').setAttribute('data-test', 'hello');
        elementObserver('body .purple').attribute('data-test', function(elements){
            //throw new Error('Did not expect any elements');
            console.error('Did not expect any elements');
        });
        done();
    })

    it('should return synchronous attribute changes', function(done){
        elementObserver('body .indigo').attribute('data-test', function(changes){
            assert.equal(changes.length, 2);
            assert.equal(changes[0].attributeName, 'data-test');
            assert.equal(changes[1].attributeName, 'data-test');
            assert.equal(changes[0].oldValue, null);
            assert.equal(changes[1].oldValue, 'nothing');
            assert.equal(changes[0].target.className, 'indigo indigo-1');
            assert.equal(changes[1].target.className, 'indigo indigo-2');
            done();
        });
        Utils.append(
            '[data-element-container]',
            '<div class="indigo indigo-1"></div>' +
            '<div class="indigo indigo-2" data-test="nothing"></div>' +
            '<div class="indigo indigo-3"></div>'
        );
        document.querySelector('.indigo-1').setAttribute('data-test', 'hello');
        document.querySelector('.indigo-2').setAttribute('data-test', 'world');
    })

    it('should return attribute changes that happens asynchronously', function(done){
        Utils.append(
            '[data-element-container]',
            '<div class="beige beige-1"></div>' +
            '<div class="beige beige-2" data-test="nothing"></div>' +
            '<div class="beige beige-3"></div>'
        );
        elementObserver('body .beige').attribute('data-test', function(changes){
            assert.equal(changes.length, 2);
            assert.equal(changes[0].attributeName, 'data-test');
            assert.equal(changes[1].attributeName, 'data-test');
            assert.equal(changes[0].oldValue, null);
            assert.equal(changes[1].oldValue, 'nothing');
            assert.equal(changes[0].target.className, 'beige beige-1');
            assert.equal(changes[1].target.className, 'beige beige-2');
            done();
        });
        setTimeout(function(){
            document.querySelector('.beige-1').setAttribute('data-test', 'hello');
            document.querySelector('.beige-2').setAttribute('data-test', 'world');
        }, 1);
    })

    it('should use different callbacks for different attribute changes', function(done){
        var count = 0;
        Utils.append(
            '[data-element-container]',
            '<div class="cyan cyan-1"></div>' +
            '<div class="cyan cyan-2" data-test-2="nothing"></div>'
        );
        elementObserver('body .cyan').attribute('data-test-1', function(changes){
            assert.equal(changes.length, 1);
            assert.equal(changes[0].attributeName, 'data-test-1');
            assert.equal(++count, 1);
        });
        elementObserver('body .cyan').attribute('data-test-2', function(changes){
            assert.equal(changes.length, 1);
            assert.equal(changes[0].oldValue, 'nothing');
            assert.equal(changes[0].attributeName, 'data-test-2');
            assert.equal(++count, 2);
            done();
        });
        setTimeout(function(){
            document.querySelector('.cyan-1').setAttribute('data-test-1', 'hello');
            document.querySelector('.cyan-2').setAttribute('data-test-2', 'world');
        }, 1);
    })

})
