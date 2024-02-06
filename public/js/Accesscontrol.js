const snackBarDelayMs = 3500;
const buttonDelayMs = 1000;

const successcolor = '#4CAF50';
const errorcolor = '#F44336';
const successfuicon = 'check_circle';
const erroricon = 'error';
//On page load
$(document).ready(function() {
    $.fn.dataTable.ext.errMode = 'none';
    const table = $('#AdminTable').DataTable({
        dom: 'lrti',
        /*
        ajax: {
            url: '/query/fetchinventory',
            type: 'POST',
            dataSrc: function (data) {
                return $('#archived-checkbox').is(':checked') ? 
                    data.data.filter(item => item.archived) : 
                    data.data.filter(item => !item.archived);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('AJAX error:', textStatus, errorThrown);
                ShowSnackbar({ message: errorThrown, color: errorcolor, icon: erroricon })
            }
        },

        columns: [
            { data: 'itemid' },
            { data: 'itemname' },
            { data: 'earliestexpiry' },
            { data: 'quantity' },
            { data: 'wholesaleprice' },
            { data: 'retailprice' },
            { 
                data: null,
                render: function() {
                    return $('#archived-checkbox').is(':checked') ? 
                        '<button class="btn unarchive-button table-icon"><span class="material-symbols-outlined">unarchive</span></button>' 
                        :
                        '<button class="btn edit-button table-icon"><span class="material-symbols-outlined">edit</span></button><button class="btn archive-button table-icon"><span class="material-symbols-outlined">archive</span></button>';
                }
            }
        ],
                */
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

    $('#customSearch').on('keyup', function() {
        table.column(1).search(this.value).draw(true); // true to go back to the first page
    });
});

function ShowSnackbar(Parameters) {
    $('#snackbar').css('color', Parameters.color);
    $('#snackbar-message').text(Parameters.message);
    $('#snackbar-icon').text(Parameters.icon);
    $('#snackbar').removeClass('hide').addClass('show');
    setTimeout(function() {
        $('#snackbar').removeClass('show').addClass('hide');
    }, snackBarDelayMs);
}

function attachCharCountListener(inputSelector, countSelector) {
    const maxLength = $(inputSelector).attr('maxlength');
    const currentLength = $(inputSelector).val().length;
    $(countSelector).text(currentLength + ' / ' + maxLength);
    $(inputSelector).on('input', function() {
        const maxLength = $(this).attr('maxlength');
        const currentLength = $(this).val().length;
        if (currentLength >= maxLength) {

        }
        $(countSelector).text(currentLength + ' / ' + maxLength);
    });
}

async function userID() {
    return fetch('/query/getid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            ShowSnackbar({ message: data.error, color: errorcolor, icon: erroricon });
        } else {
            return data.data[0].userid;
        }
    });
}

