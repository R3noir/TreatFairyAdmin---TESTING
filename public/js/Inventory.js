const snackBarDelayMs = 3500;
const buttonDelayMs = 1000;

const successcolor = '#4CAF50';
const errorcolor = '#F44336';
const successfuicon = 'check_circle';
const erroricon = 'error';
//On page load
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
                ShowSnackbar({ message: errorThrown, color: errorcolor, icon: erroricon })
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

    $('#customSearch').on('keyup', function() {
         setTimeout(function() {
            table.ajax.reload();
        }, 500);
    });

    $('#archived-checkbox').on('change', function() {
        $('#customSearch').val('');
        table.ajax.reload();
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

$(document).on('click', '.add-btn', function() {
    $('#addProductModal').modal('show');
    attachCharCountListener(`#addProductModal #productName`, `#addProductModal #charCount`);
});

$(document).on('click', '.unarchive-button', function() {
    $('#unarchiveModal').modal('show');
});

$(document).on('click', '.edit-button', function() {
    const table = $('#InventoryTable').DataTable();
    const data = table.row($(this).parents('tr')).data();
    const form = $('#editModal')

    form.find('#productName').val(data.item_name);
    form.find('#expirationDate').val(data.earliest_expiry);
    form.find('#quantity').val(data.quantity);
    form.find('#wholesalePrice').val(data.wholesale_price);
    form.find('#retailPrice').val(data.retail_price);
    form.find('#created').text('Created by ' + data.created_by + ' on ' + new Date(data.created_at).toLocaleString() );
    form.find('#updated').text('Updated by ' + data.last_update_by + ' on ' + new Date(data.last_update_at).toLocaleString());

    attachCharCountListener(`#editModal #productName`, `#editModal #charCount`);
    $('#editModal').modal('show');

    $(document).on('click', '#editModal .confirm', function() {
        const fields = {
            item_name: '#productName',
            earliest_expiry: '#expirationDate',
            quantity: '#quantity',
            wholesale_price: '#wholesalePrice',
            retail_price: '#retailPrice'
        };

        let updatedData = {};

        for (let field in fields) {
            let newValue = form.find(fields[field]).val();
            if (typeof data[field] === 'number') {
                newValue = parseFloat(newValue);
            }
            if (data[field] !== newValue) {
                updatedData[field] = newValue;
            }
        }

        if (Object.keys(updatedData).length > 0) {
            if (updatedData.hasOwnProperty('retail_price') && !updatedData.hasOwnProperty('wholesale_price')) {
                updatedData.wholesale_price = parseFloat(form.find('#wholesalePrice').val());
                
            } else if (updatedData.hasOwnProperty('wholesale_price') && !updatedData.hasOwnProperty('retail_price')) {
                updatedData.retail_price = parseFloat(form.find('#retailPrice').val());
            }
            updatedData.item_id = data.item_id;
            fetch('/update/updateinventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            })
            .then(response => {
                if(response.status === 401) {
                    window.location.href = '/Forbidden';
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    ShowSnackbar({ message: data.error, color: errorcolor, icon: erroricon });
                } else {
                    ShowSnackbar({ message: data.message, color: successcolor, icon: successfuicon });
                    $('#editModal').modal('hide');
                    $('#InventoryTable').DataTable().ajax.reload();
                }
            });
        }
    });
});

$(document).on('click', '.view-button', function() {
    const table = $('#InventoryTable').DataTable();
    const data = table.row($(this).parents('tr')).data();
    const form = $('#productInfoModal')

    form.find('#itemId').text('Item ID: ' + data.item_id);
    form.find('#earliestExpiry').text('Earliest Expiry: ' + data.earliest_expiry);
    form.find('#quantity').text('Quantity: ' + data.quantity);
    form.find('#wholesalePrice').text('Wholesale Price: ' + data.wholesale_price);
    form.find('#retailPrice').text('Retail Price: ' + data.retail_price);
    form.find('#created').text('Created by ' + data.created_by + ' on ' + new Date(data.created_at).toLocaleString() );
    form.find('#updated').text('Updated by ' + data.last_update_by + ' on ' +  new Date(data.last_update_at).toLocaleString());
    form.find('#archived').text('Archived by ' + data.archived_by + ' on ' + new Date(data.archived_at).toLocaleString());

    $('#productInfoModal').modal('show');
});

$(document).on('click', '.archive-button', function() {
    $('#archiveModal').modal('show');
});

$('#addProductForm').on('submit', async function(event) {
    // Prevent the form from being submitted normally
    event.preventDefault();
    
    await fetch('/insert/inventory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productName: $('#productName').val(),
            expirationDate: $('#expirationDate').val(),
            quantity: $('#quantity').val(),
            retailPrice: $('#retailPrice').val(),
            wholesalePrice: $('#wholesalePrice').val()
        }),
    })
    .then(response => {
        if(response.status === 401) {
            window.location.href = '/Forbidden';
            return;
        }
        return response.json();
    })
    .then(data => {
        if (data.message_error) {
            ShowSnackbar({ message: data.message_error, color: data.message_error ? errorcolor : successcolor, icon: data.message_error ? erroricon : successfuicon });
        }
        else{
            ShowSnackbar({ message: data.message, color: data.message_error ? errorcolor : successcolor, icon: data.message_error ? erroricon : successfuicon });
            $('#addProductForm').trigger('reset');
            $('#addProductModal').modal('hide');
            $('#InventoryTable').DataTable().ajax.reload(); // Refresh the table
        }

        })
    });