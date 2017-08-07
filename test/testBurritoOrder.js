var order = require('../services/burrito-order');
var assert = require('chai').assert;

describe("burrito-order", function() {
    it("should calculate the cost of the order with tax", function() {
        var costPer = 5;
        var tax = 0.08;
        var qty = 2;

        var expectedResult = 10.08;
        var result = order.getCost(costPer, tax, qty);
        assert.equal(result, expectedResult, 'Order cost should be properly calculated with tax.');
    });

    it("should round to up for fractions of a penny", function() {
        var costPer = 5;
        var tax = 0.08375;
        var qty = 2;

        var expectedResult = 10.09;
        var result = order.getCost(costPer, tax, qty);
        assert.equal(result, expectedResult, 'Order cost should be properly calculated with tax.');
    });

    it("should return false if a sanity check fails", function() {
        var costPer = -5;
        var tax = 0.08375;
        var qty = 1;
        
        var result = order.getCost(costPer, tax, qty);
        assert.isFalse(result, 'Result should be false if a negative value was returned.');
    });
});
