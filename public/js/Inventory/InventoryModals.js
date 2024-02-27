$(document).on('click', '.add-btn', function() {
    $('#addProductModal').modal('show');
    attachCharCountListener(`#addProductModal #productName`, `#addProductModal #charCount`);
});

$(document).on('click', '.unarchive-button', function() {
    const table = $('#InventoryTable').DataTable();
    const data = table.row($(this).parents('tr')).data();
    $('#unarchiveItemForm').data('item-data', data);
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

    $('#editProductForm').off('submit').on('submit', async function(event) {
        event.preventDefault();
        console.log('submit')
    
        const form = $('#editModal');
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
    
            await fetch('/update/updateinventory', {
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
    const table = $('#InventoryTable').DataTable();
    const data = table.row($(this).parents('tr')).data();
    $('#archiveItemForm').data('item-data', data);
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



$('#archiveItemForm').on('submit', async function(event) {
    event.preventDefault();
    const table = $('#InventoryTable').DataTable();
    const data = $(this).data('item-data');
    await fetch('/update/archive', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item_id: data.item_id
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
        if (data.error) {
            ShowSnackbar({ message: data.error, color: errorcolor, icon: erroricon });
        } else {
            ShowSnackbar({ message: data.message, color: successcolor, icon: successfuicon });
            $('#archiveModal').modal('hide');
            $('#InventoryTable').DataTable().ajax.reload();
        }
    });
});

$('#unarchiveItemForm').on('submit', async function(event) {
    event.preventDefault();

    const table = $('#InventoryTable').DataTable();
    const data = $(this).data('item-data');
    await fetch('/update/unarchive', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item_id: data.item_id
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
        if (data.error) {
            ShowSnackbar({ message: data.error, color: errorcolor, icon: erroricon });
        } else {
            ShowSnackbar({ message: data.message, color: successcolor, icon: successfuicon });
            $('#unarchiveModal').modal('hide');
            $('#InventoryTable').DataTable().ajax.reload();
        }
    });
});