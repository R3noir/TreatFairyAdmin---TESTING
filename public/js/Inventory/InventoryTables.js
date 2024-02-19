$(document).ready(function() {
    $.fn.dataTable.ext.errMode = 'none';
    const table = $('#InventoryTable').DataTable({
        dom: 'lrti',
        columnDefs: [{ targets: 6, orderable: false }],
        serverSide: true,
        ajax: {
            url: '/query/fetchinventory',
            type: 'POST',
            data: function (d) {
                return {
                    start: parseInt(d.start),
                    length: parseInt(d.length),
                    archived: $('#archived-checkbox').is(':checked'),
                    search: $('#customSearch').val()
                };
            },
            dataSrc: function (data) {
                return $('#archived-checkbox').is(':checked') ? 
                    data.data.filter(item => item.archived) : 
                    data.data.filter(item => !item.archived);
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
            { data: 'item_id' },
            { data: 'item_name' },
            { data: 'earliest_expiry' },
            { data: 'quantity' },
            { 
                data: 'wholesale_price',
                render: function(data, type, row) {
                    if (type === 'display') {
                        return parseFloat(data).toFixed(2);
                    }
                    return data;
                }
            },
            { 
                data: 'retail_price',
                render: function(data, type, row) {
                    if (type === 'display') {
                        return parseFloat(data).toFixed(2);
                    }
                    return data;
                }
            },
            { 
                data: 'last_update_at',
                render: function(data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        return new Date(data).toLocaleString();
                    }
                    return data;
                }
            },
            { 
                data: null,
                render: function() {
                    return $('#archived-checkbox').is(':checked') ? 
                        '<button class="btn view-button table-icon"><span class="material-symbols-outlined">open_in_new</span></button><button class="btn unarchive-button table-icon"><span class="material-symbols-outlined">unarchive</span></button>' 
                        :
                        '<button class="btn edit-button table-icon"><span class="material-symbols-outlined">edit</span></button><button class="btn archive-button table-icon"><span class="material-symbols-outlined">archive</span></button>';
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

    $('#archived-checkbox').on('change', function() {
        $('#customSearch').val('');
        table.ajax.reload();
    });
});