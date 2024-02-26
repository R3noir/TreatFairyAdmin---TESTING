$(document).ready(function() {
    $.fn.dataTable.ext.errMode = 'none';
    const table = $('#AdminTable').DataTable({
        dom: 'lrti',
        columnDefs: [
            { targets: [0, 1, 2], orderable: false },
            { className: "dt-center", targets: "_all" }
        ],
        serverSide: true,
        ajax: {
            url: '/query/fetchusers',
            type: 'POST',
            data: function (d) {
                return {
                    start: parseInt(d.start),
                    length: parseInt(d.length),
                    search: $('#customSearch').val()
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
            { data: 'user_id' },
            { data: 'name' },
            { data: 'email' },
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