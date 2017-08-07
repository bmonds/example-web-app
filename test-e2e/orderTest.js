module.exports = {
    'Order form': function (browser) {
        browser
            .url('http://localhost:8081/order')
            .waitForElementVisible('body', 1000);
        browser.assert.title('Burrito Time: Order');
        browser.assert.elementPresent('input#qty');
        browser.assert.value('input#qty', '1');
        browser.assert.elementPresent('button.btn-primary')
    },
    'Submit quantity': function (browser) {
        browser.clearValue('input#qty');
        browser.setValue('input#qty', 3);
        browser.click('.btn');
        browser.waitForElementVisible('body', 1000);
        browser.assert.urlEquals('http://localhost:8081/total?qty=3');
        browser.assert.containsText('p', 'The total cost for your burritos is $18.21.');
    },
    after: function (browser) {
        browser.end()
    }
};