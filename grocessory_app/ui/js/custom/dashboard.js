$(function () {
    // Fetch all orders from the API
    $.get(orderListApiUrl, function (response) {
        if (response) {
            renderOrders(response);

            // Filter Orders on selection change
            $('#filter').change(function () {
                const filterType = $(this).val();
                filterOrders(response, filterType);
            });

            // Default filter to show today's orders on page load
            filterOrders(response, 'daily');
        }
    });

    function renderOrders(orders) {
        let table = '';
        let totalCost = 0;

        $.each(orders, function (index, order) {
            totalCost += parseFloat(order.total);
            table += '<tr>' +
                '<td>' + order.datetime + '</td>' +
                '<td>' + order.order_id + '</td>' +
                '<td>' + order.customer_name + '</td>' +
                '<td>' + order.total.toFixed(2) + ' Rs</td></tr>';
        });

        table += '<tr><td colspan="3" style="text-align: end"><b>Total</b></td><td><b>' + totalCost.toFixed(2) + ' Rs</b></td></tr>';
        $("#orderTableBody").empty().html(table);

        $('#totalOrders').text(orders.length);
    }

    function filterOrders(orders, filterType) {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.datetime);

            if (filterType === 'daily') {
                return orderDate.toDateString() === today.toDateString();
            } else if (filterType === 'weekly') {
                return orderDate >= startOfWeek && orderDate <= today;
            } else if (filterType === 'monthly') {
                return orderDate >= startOfMonth && orderDate <= today;
            }
            return true;
        });

        renderOrders(filteredOrders);
    }
});
