$(document).ready(function() {
    $.fn.dataTable.ext.errMode = 'none';
    const table = $('#SalesInvoiceTable').DataTable({
        dom: 'lrti',
        columnDefs: [{ targets: 5, orderable: false }],
        serverSide: true,
        ajax: {
            url: '/query/fetchinvoices',
            type: 'POST',
            data: function (d) {
                return {
                    start: parseInt(d.start),
                    length: parseInt(d.length),
                    search: $('#customSearch').val(),
                    sortColumn: d.order[0].column,
                    sortDirection: d.order[0].dir 
                };
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if(jqXHR.status === 401) {
                    window.location.href = '/Forbidden';
                }
                console.log('AJAX error:', textStatus, errorThrown);
                ShowSnackbar({ message: jqXHR.responseJSON.error, color: errorcolor, icon: erroricon })
            }
        },
        columns: [
            { data: 'invoice_id' },
            { data: 'name' },
            { 
                data: 'sold_date',
                render: function(data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        return new Date(data).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric' });
                    }
                    return data;
                }
            },
            {
                data: 'total',
                render: function(data, type, row) {
                    if (type === 'display') {
                        return parseFloat(data).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                    return data;
                }
            },
            { 
                data: 'amount_paid',
                render: function(data, type, row) {
                    if (type === 'display') {
                        return parseFloat(data).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                    return data;
                }
            },
            { 
                data: null,
                render: function() {
                    return '</button><button class="btn edit-button table-icon"><span class="material-symbols-outlined">edit</span></button><button class="btn delete-button table-icon"><span class="material-symbols-outlined">delete</span>';
                }
            }
        ],
        drawCallback: function(settings) {
            const api = this.api();
            const info = api.page.info();
            const currentPage = info.page + 1; // DataTables uses zero-based page numbers
            const totalPages = info.pages;
            let paginationHtml = '';
            paginationHtml += '<span class="paginate_button previous' + (currentPage === 1 ? ' disabled' : '') + '">&laquo;</span>';
            for (let i = 1; i <= totalPages; i++) {
                if (i === currentPage) {
                    paginationHtml += '<span class="paginate_button current">' + i + '</span>';
                } else {
                    paginationHtml += '<span class="paginate_button">' + i + '</span>';
                }
            }
            paginationHtml += '<span class="paginate_button next' + (currentPage === totalPages ? ' disabled' : '') + '">&raquo;</span>';
            $('#customPagination').html(paginationHtml);
        }
    });
    $('#customPagination').on('click', '.paginate_button', function() {
        const page = $(this).text();
        let currentPage = table.page.info().page;
        let totalPages = table.page.info().pages;
        if (page === '«' && currentPage > 0) {
            table.page(currentPage - 1).draw(false);
        } else if (page === '»' && currentPage < totalPages - 1) {
            table.page(currentPage + 1).draw(false);
        } else if (page !== '«' && page !== '»') {
            table.page(parseInt(page) - 1).draw(false);
        }
    });
    $('#customSearch').on('input', function() {
         setTimeout(function() {
            table.ajax.reload();
        }, 500);
    });
});