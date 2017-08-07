// Simple function to provide data for unit tests

module.exports.getCost = function(costPer, tax, qty) {
    var subTotal = 0;
    var taxTotal = 0;
    var orderTotal = 0;

    if (costPer <= 0 || tax <= 0 || qty < 0) return false;

    subTotal = costPer * qty;
    taxTotal = subTotal * tax;

    orderTotal = subTotal + tax;
    orderTotal = (Math.ceil(orderTotal * 100) / 100);

    if (orderTotal <= 0) return false;

    return orderTotal;
};