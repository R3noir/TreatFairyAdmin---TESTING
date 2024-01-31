$(document).ready(function() {
    const table = $('#InventoryTable').DataTable({
        "dom": 'lrti', // This option removes the default search bar and pagination
        "drawCallback": function(settings) {
            const api = this.api();
            const info = api.page.info();
            const currentPage = info.page + 1; // DataTables uses zero-based page numbers
            const length = info.length;
            const total = info.recordsTotal;
            const pageNum = Math.ceil(total / length);

            let paginationHtml = '<span class="paginate_button previous">&laquo;</span>';
            for (let i = 1; i <= pageNum; i++) {
                if (i === currentPage) {
                    paginationHtml += '<span class="paginate_button current">' + i + '</span>';
                } else {
                    paginationHtml += '<span class="paginate_button">' + i + '</span>';
                }
            }
            paginationHtml += '<span class="paginate_button next">&raquo;</span>';

            $('#customPagination').html(paginationHtml);
        }
    });

    $('#customPagination').on('click', '.paginate_button', function() {
        const page = $(this).text();
        let currentPage = table.page.info().page;
        let totalPages = table.page.info().pages;
        if (page === '«') {
            if (currentPage > 0) {
                table.page(currentPage - 1).draw(false);
            }
        } else if (page === '»') {
            if (currentPage < totalPages - 1) {
                table.page(currentPage + 1).draw(false);
            }
        } else {
            table.page(parseInt(page) - 1).draw(false);
        }
    });

    $('#customSearch').keyup(function() {
        table.column(1).search($(this).val()).draw();
    });
});
