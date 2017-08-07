module.exports = {
    beforeEach: function (browser) {
        browser
            .url('http://localhost:8081')
            .waitForElementVisible('body', 1000);
    },
    'Index default content': function (browser) {
        browser.assert.title('Burrito Time');
    },
    after: function (browser) {
        browser.end()
    }
};