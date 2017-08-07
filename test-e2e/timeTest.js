module.exports = {
    beforeEach: function (browser) {
        browser
            .url('http://localhost:8081/time')
            .waitForElementVisible('body', 1000);
    },
    'It is always burrito time': function (browser) {
        browser.assert.title('Burrito Time: Is it time?');
        browser.assert.containsText('p', 'The answer is yes');
    },
    'Time page contains link to order': function (browser) {
        browser.assert.elementPresent('a.btn-primary');
        browser.assert.containsText('.btn', 'Order Now');
    },
    after: function (browser) {
        browser.end()
    }
};