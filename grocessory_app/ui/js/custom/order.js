$(function () {
    //Json data by api call for order table
    $.get(productListApiUrl, function (response) {
        productPrices = {};
        if(response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function(index, product) {
                options += '<option value="'+ product.product_id +'" data-price="'+ product.price_per_unit +'">'+ product.name +'</option>';
                productPrices[product.product_id] = product.price_per_unit;
            });
            $(".product-box").find("select").empty().html(options);
        }
    });
});

$(document).on("click", "#addMoreButton", function () {
    var row = $(".product-box").html();
    $(".product-box-extra").append(row);
    $(".product-box-extra .remove-row").last().removeClass('hideit');
    $(".product-box-extra .product-price").last().val('0.0');
    $(".product-box-extra .product-qty").last().val('1');
    $(".product-box-extra .product-total").last().val('0.0');
    $(".product-box-extra .product-discount").last().val('0');
});

$(document).on("click", ".remove-row", function (){
    $(this).closest('.row').remove();
    calculateValue();
});

$(document).on("change", ".cart-product", function (){
    var product_id = $(this).val();
    var price = productPrices[product_id] || 0; // Ensure price fallback
    $(this).closest('.row').find('.product-price').val(price); // Correct selector
    calculateValue();
});

$(document).on("change", ".product-qty, .product-discount", function (){
    calculateValue();
});

function calculateValue() {
    var grandTotal = 0;
    $('.product-item').each(function () {
        var price = parseFloat($(this).find('.product-price').val()) || 0;
        var qty = parseInt($(this).find('.product-qty').val()) || 1;
        var discount = parseFloat($(this).find('.product-discount').val()) || 0;

        var total = price * qty;
        var discountAmount = total * (discount / 100);
        var finalTotal = total - discountAmount;

        $(this).find('.product-total').val(finalTotal.toFixed(2));
        grandTotal += finalTotal;
    });
    $('#product_grand_total').val(grandTotal.toFixed(2));
}

$("#saveOrder").on("click", function(){
    var formData = $("form").serializeArray();
    var requestPayload = {
        customer_name: null,
        total: null,
        order_details: []
    };

    for(var i=0; i<formData.length; ++i) {
        var element = formData[i];
        var lastElement = null;

        switch(element.name) {
            case 'customerName':
                requestPayload.customer_name = element.value;
                break;
            case 'product_grand_total':
                requestPayload.grand_total = element.value;
                break;
            case 'product':
                requestPayload.order_details.push({
                    product_id: element.value,
                    quantity: null,
                    total_price: null,
                    discount: null
                });
                break;
            case 'qty':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.quantity = element.value;
                break;
            case 'item_total':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.total_price = element.value;
                break;
            case 'discount':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.discount = element.value;
                break;
        }
    }

    callApi("POST", orderSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    }, function(response) {
        if(response.success) {
            window.location.href = "http://127.0.0.1:5500/ui/index.html"; // Redirect to dashboard
        }
    });
});
