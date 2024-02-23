let itemIndex = 0;
let itemsToDelete = [];

function formatTIN(inputElement) {
  let value = inputElement.value.replace(/\D/g, '');
  value = value.slice(0, 12);
  inputElement.value = value.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{3})?/, function(_, p1, p2, p3, p4) {
    let result = '';
    if (p1) result += p1 + '-';
    if (p2) result += p2 + '-';
    if (p3) result += p3 + '-';
    if (p4) result += p4;
    return result.endsWith('-') ? result.slice(0, -1) : result;
  });
}

$(document).ready(function() {
  $('.add-btn').click(function() {
    attachCharCountListener('#invoiceModal #soldTo', '#invoiceModal #soldToCount');
    attachCharCountListener('#invoiceModal #clientTIN', '#invoiceModal #clientTINCount');
    attachCharCountListener('#invoiceModal #issuedBy', '#invoiceModal #issuedByCount');
    attachCharCountListener('#invoiceModal #businessStyle', '#invoiceModal #businessStyleCount');
    attachCharCountListener('#invoiceModal #clientAddress', '#invoiceModal #clientAddressCount');
    $('#addItem').trigger('click');
    $('#invoiceModal').modal('show');
  });
});

$(document).ready(function() {
  $('#addItem').click(function() {
    $('#itemsContainer').append(`
      <div class="row" id="itemRow${itemIndex}">
        <div class="form-group col-6">
          <label for="itemName${itemIndex}">Item Name</label>
          <input type="text" class="form-control" id="itemName${itemIndex}" maxlength="75" required">
          <small id="charCount${itemIndex}">0/75</small>
        </div>
        <div class="form-group col-2">
          <label for="quantity${itemIndex}">Quantity</label>
          <input type="number" class="form-control" id="quantity${itemIndex}" required">
        </div>
        <div class="form-group col-3">
          <label for="unitPrice${itemIndex}">Unit Price</label>
          <input type="number" class="form-control" id="unitPrice${itemIndex}" required">
        </div>
        ${itemIndex > 0 ? '<div class="col-1 d-flex align-items-center"><button class="btn btn-sm btn-danger" id="deleteItem' + itemIndex + '"><span class="material-symbols-outlined" style="font-size:24px">delete</span></button></div>' : ''}
      </div>
    `);
    attachCharCountListener(`#itemName${itemIndex}`, `#charCount${itemIndex}`);
    if (itemIndex > 0) {
      let currentIndex = itemIndex;
      $('#deleteItem' + currentIndex).on('click', function(event) {
        event.preventDefault();
        $('#itemRow' + currentIndex).remove();
      });
    }
    itemIndex++;
  });
});

$(document).ready(function() {
  $('#invoiceModal').on('hidden.bs.modal', function () {
    $('#invoiceForm')[0].reset();
    $('#itemsContainer').empty();
    itemIndex = 0; 
  });
});

$(document).ready(function() {
  $('#clientTIN').on('input', function () {
    formatTIN(this);
  });
});

$(document).on('click', '.edit-button', function() {
  const table = $('#SalesInvoiceTable').DataTable();
  const data = table.row($(this).parents('tr')).data();

  $('#editInvoiceID').val(data.invoice_id);
  $('#editSoldTo').val(data.name);
  $('#editSoldDate').val(new Date(data.sold_date).toISOString().split('T')[0]);
  $('#editClientTIN').val(data.tin);
  formatTIN($('#editClientTIN')[0]);
  $('#editIssuedBy').val(data.issued_by);
  $('#editBusinessStyle').val(data.business_style);
  $('#editAmountPaid').val(data.amount_paid);
  $('#editClientAddress').val(data.address);
  const items = data.items;

  $('#editItemsContainer').empty();
  items.forEach((item, index) => {
    $('#editItemsContainer').append(`
      <form id="editItemForm${index}">
        <div class="row">
          <div class="form-group col-6">
            <label for="editItemName${index}">Item Name</label>
            <input type="text" class="form-control" id="editItemName${index}" value="${item.item}" maxlength="75" required>
            <small id="editCharCount${index}">${item.item.length}/75</small>
          </div>
          <div class="form-group col-2">
            <label for="editQuantity${index}">Quantity</label>
            <input type="number" class="form-control" id="editQuantity${index}" value="${item.quantity}" required>
          </div>
          <div class="form-group col-3">
            <label for="editUnitPrice${index}">Unit Price</label>
            <input type="number" class="form-control" id="editUnitPrice${index}" value="${item.price}" required>
          </div>
          ${index > 0 ? `
            <div class="col-1 d-flex align-items-center">
              <button class="btn btn-sm btn-danger" id="deleteEditItem${index}">
                <span class="material-symbols-outlined" style="font-size:24px">delete</span>
              </button>
            </div>
          ` : ''}
        </div>
      </form>
    `);
    attachCharCountListener(`#editItemName${index}`, `#editCharCount${index}`);
    if (index > 0) {
      $('#deleteEditItem' + index).on('click', function(event) {
        event.preventDefault();
        $('#editInvoiceModal').css('opacity', 0.5);
        $('#deleteItemModal').modal('show');
      });
    }
    
  });

  $('#deleteItemModal').on('hidden.bs.modal', function () {
    $('#editInvoiceModal').css('opacity', 1);
  });

  $('#editInvoiceModal').modal('show');
  $('#editInvoiceModal').on('shown.bs.modal', function() {
    attachCharCountListener('#editSoldTo', '#editSoldToCount');
    attachCharCountListener('#editIssuedBy', '#editIssuedByCount');
    attachCharCountListener('#editBusinessStyle', '#editBusinessStyleCount');
    attachCharCountListener('#editClientAddress', '#editClientAddressCount');
  });

  $(document).on('click', '[id^="deleteEditItem"]', function() {
    const index = $(this).attr('id').replace('deleteEditItem', '');
    const itemData = data.items[index];
    $('#deleteItemForm').data('item-data', { index: index });
    itemsToDelete.push({ ...itemData, invoice_id: data.invoice_id });
  });

});

$(document).on('click', '.delete-button', function() {
    const table = $('#SalesInvoiceTable').DataTable();
    const data = table.row($(this).parents('tr')).data();
    $('#deleteInvoiceForm').data('item-data', data);
    $('#deleteModal').modal('show');
});

$('#invoiceForm').on('submit', async function(event) {
  event.preventDefault(); // Prevent the form from submitting via the browser
  const formData = {
    invoiceID: $('#invoiceID').val(),
    soldTo: $('#soldTo').val(),
    soldDate: $('#soldDate').val(),
    clientTIN: $('#clientTIN').val().replace(/-/g, ''),
    issuedBy: $('#issuedBy').val(),
    businessStyle: $('#businessStyle').val(),
    clientAddress: $('#clientAddress').val(),
    amount_paid: $('#amountPaid').val(),
    items: []
  };
  for (let i = 0; i < itemIndex; i++) {
    formData.items.push({
      invoice_item_name: $('#itemName' + i).val(),
      invoice_item_quantity: $('#quantity' + i).val(),
      invoice_item_price: $('#unitPrice' + i).val()
    });
  }
  console.log(formData);

  await fetch('insert/salesinvoice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
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
        $('#invoiceModal').modal('hide');
        $('#invoiceForm').trigger('reset');
        $('#itemsContainer').empty();
        $('#SalesInvoiceTable').DataTable().ajax.reload();
        itemIndex = 0;
    }
  })
});

$('#deleteInvoiceForm').on('submit', async function(event) {
  event.preventDefault(); 
  const data = $('#deleteInvoiceForm').data('item-data');
  console.log(data)

  await fetch('delete/deleteinvoice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ invoice_id: data.invoice_id })
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
        $('#SalesInvoiceTable').DataTable().ajax.reload();
        $('#deleteModal').modal('hide');
    }
  })
});

$('#deleteItemForm').on('submit', async function(event) {
  event.preventDefault();
  const index = $(this).data('item-data').index;
  console.log(index)
  $('#deleteItemModal').modal('hide');
  $('#editItemForm' + index).remove();
});

$('#editInvoiceForm').on('submit', async function(event) {
  event.preventDefault();
  // ... your existing code ...

  // Delete items
  for (let item of itemsToDelete) {
    await fetch('delete/deleteinvoiceitem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ invoice_id: item.invoice_id , item_id: item.id })
    })
    .then(response => {
      if(response.status === 401) {
          window.location.href = '/Forbidden';
          return;
      }
      return response.json();
    }).then(data => {
      if (data.message_error) {
          ShowSnackbar({ message: data.message_error, color: data.message_error ? errorcolor : successcolor, icon: data.message_error ? erroricon : successfuicon });
      }
      else{
          ShowSnackbar({ message: data.message, color: data.message_error ? errorcolor : successcolor, icon: data.message_error ? erroricon : successfuicon });
          $('#SalesInvoiceTable').DataTable().ajax.reload();
          $('#editInvoiceModal').modal('show');
      }
    })
  }

  itemsToDelete = [];
});