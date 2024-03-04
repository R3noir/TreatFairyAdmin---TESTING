let itemsToDelete = [];
let itemIndex = 0;

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
  itemIndex = 0;
  $('#addItem').click(function() {
    $('#itemsContainer').append(`
      <div class="row" id="itemRow${itemIndex}">
        <div class="form-group col-6">
          <label for="itemName${itemIndex}">Item Name</label>
          <input type="text" class="form-control" id="itemName${itemIndex}" maxlength="75" required ">
          <small id="charCount${itemIndex}">0/75</small>
        </div>
        <div class="form-group col-2">
          <label for="quantity${itemIndex}">Quantity</label>
          <input type="number" class="form-control" id="quantity${itemIndex}" required max="32767" ">
          <small class="form-text text-muted">Max: 32767</small>
        </div>
        <div class="form-group col-3">
          <label for="unitPrice${itemIndex}">Unit Price</label>
          <input type="number" class="form-control" id="unitPrice${itemIndex}" required max="100000" ">
          <small class="form-text text-muted">Max: 100,000</small>
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
  $('#created').text('Created by ' + data.created_by)
  $('#updated').text('Last update at ' + data.last_updated_by + ' on ' +  new Date(data.last_update_at).toLocaleString());
  const items = data.items;

  $('#editClientTIN').on('input', function() {
    formatTIN(this);
  });

  $('#editItemsContainer').empty();
  items.forEach((item, index) => {
    $('#editItemsContainer').append(`
      <form id="editItemForm${index}">
        <div class="row">
        <input type="hidden" id="editItemId${index}" value="${item.id}">
          <div class="form-group col-6">
            <label for="editItemName${index}">Item Name</label>
            <input type="text" class="form-control" id="editItemName${index}" value="${item.item}" maxlength="75" required">
            <small id="editCharCount${index}">${item.item.length}/75</small>
          </div>
          <div class="form-group col-2">
            <label for="editQuantity${index}">Quantity</label>
            <input type="number" class="form-control" id="editQuantity${index}" value="${item.quantity}" required max="32767" ">
            <small class="form-text text-muted">Max: 32767</small>
          </div>
          <div class="form-group col-3">
            <label for="editUnitPrice${index}">Unit Price</label>
            <input type="number" class="form-control" id="editUnitPrice${index}" value="${item.price}" required max="100000" ">
            <small class="form-text text-muted">Max: 100,000</small>
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

  $('#editInvoiceModal').modal('show');

  $(document).off('click', '[id^="deleteEditItem"]').on('click', '[id^="deleteEditItem"]', function() {
    const index = $(this).attr('id').replace('deleteEditItem', '');
    const itemData = data.items[index];
    $('#deleteItemForm').data('item-data', { index: index , itemData: itemData});
  });

  $('#editInvoiceForm').off('submit').on('submit', async function(event) {
    event.preventDefault();

    const form = $('#editInvoiceForm');

    const formData = {
      invoice_id: parseInt(form.find('#editInvoiceID').val()),
      name: form.find('#editSoldTo').val(),
      sold_date: form.find('#editSoldDate').val(),
      tin: form.find('#editClientTIN').val().replace(/-/g, ''),
      issued_by: form.find('#editIssuedBy').val(),
      business_style: form.find('#editBusinessStyle').val(),
      address: form.find('#editClientAddress').val(),
      amount_paid: parseFloat(form.find('#editAmountPaid').val()),
      updated_items: [],
      new_items: [],
      delete_items: itemsToDelete
    };
    
    for (let i = 0; i < $('#editItemsContainer').children().length; i++) {
      if($('#editItemId' + i).val() === undefined){
        formData.new_items.push({
          invoice_id: formData.invoice_id,
          item: form.find('#editItemName' + i).val(),
          quantity: parseInt(form.find('#editQuantity' + i).val()),
          price: parseFloat(form.find('#editUnitPrice' + i).val())
        });
      }
      else if($('#editItemId' + i).val() !== undefined){
        const itemId = parseInt($('#editItemId' + i).val());
        const itemName = form.find('#editItemName' + i).val();
        const quantity = parseInt(form.find('#editQuantity' + i).val());
        const price = parseFloat(form.find('#editUnitPrice' + i).val());
      
        const originalItem = data.items.find(item => item.id === itemId);
      
        if (originalItem) {
          let updatedItem = {
            id: itemId,
            invoice_id: formData.invoice_id
          };
        
          if(parseInt(formData.invoice_id) !== originalItem.invoice_id){
            updatedItem.old_invoice_id = originalItem.invoice_id;
          }
      
          if (originalItem.item !== itemName) {
            updatedItem.item = itemName;
          }
      
          if (originalItem.quantity !== quantity || originalItem.price !== price) {
            updatedItem.quantity = quantity;
            updatedItem.price = price;
          }
      
          if (Object.keys(updatedItem).length > 2) {
            formData.updated_items.push(updatedItem);
          }
        }
      }
    }

    let newData = {};
    Object.keys(data).forEach(key => {
      if (key !== 'last_update_at' && key !== 'last_updated_by' && key !== 'total' && key !== 'created_by' && key !== 'items') {
        if (JSON.stringify(formData[key]) !== JSON.stringify(data[key])) {
          newData[key] = formData[key];
          if (key === 'invoice_id') {
            newData['old_invoice_id'] = data[key];
          }
        }
      }
    });

    if((formData.new_items.length > 0 || formData.updated_items.length > 0 || itemsToDelete.length > 0) && newData.amount_paid === undefined ){
      newData['amount_paid'] = formData.amount_paid;
    }

    if(Object.keys(newData).length > 0 & !newData.hasOwnProperty('invoice_id')){
      newData['invoice_id'] = formData.invoice_id;
    }

    let allFilled = true;
    form.find('[required]').each(function() {
      if ($(this).val() === '') {
        allFilled = false;
        return false; // Break the loop
      }
    });

    if (!allFilled) {
      ShowSnackbar({ message: 'Please fill out all fields', color: errorcolor, icon: erroricon });
      return;
    }

    await fetch('update/updateinvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ updatedData: newData, Delete: itemsToDelete, updatedItems: formData.updated_items, newItems: formData.new_items, old_invoice_id: data.invoice_id})
      
    }).then(response => {
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
            itemsToDelete = [];
            $('#editInvoiceModal').modal('hide');
            $('#SalesInvoiceTable').DataTable().ajax.reload();
        }
      })
  });
});

$('#editInvoiceModal').on('hidden.bs.modal', function () {
  itemsToDelete = [];
});

$(document).on('click', '.delete-button', function() {
    const table = $('#SalesInvoiceTable').DataTable();
    const data = table.row($(this).parents('tr')).data();
    $('#deleteInvoiceForm').data('item-data', data);
    $('#deleteModal').modal('show');
});

$('#deleteItemModal').on('hidden.bs.modal', function () {
  $('#editInvoiceModal').css('opacity', 1);
});


$('#editInvoiceModal').on('shown.bs.modal', function() {
  attachCharCountListener('#editSoldTo', '#editSoldToCount');
  attachCharCountListener('#editIssuedBy', '#editIssuedByCount');
  attachCharCountListener('#editBusinessStyle', '#editBusinessStyleCount');
  attachCharCountListener('#editClientAddress', '#editClientAddressCount');
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
    }
  })
});

$('#deleteInvoiceForm').on('submit', async function(event) {
  event.preventDefault(); 
  const data = $('#deleteInvoiceForm').data('item-data');

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

$('#editInvoiceModal').on('click', '#editItem', function() {
  const index = $('#editItemsContainer').children().length;

  $('#editItemsContainer').append(`
    <form id="editItemForm${index}">
      <div class="row">
        <div class="form-group col-6">
          <label for="editItemName${index}">Item Name</label>
          <input type="text" class="form-control" id="editItemName${index}" maxlength="75" required>
          <small id="editCharCount${index}">0/75</small>
        </div>
        <div class="form-group col-2">
          <label for="editQuantity${index}">Quantity</label>
          <input type="number" class="form-control" id="editQuantity${index}" required>
        </div>
        <div class="form-group col-3">
          <label for="editUnitPrice${index}">Unit Price</label>
          <input type="number" class="form-control" id="editUnitPrice${index}" required>
        </div>
        <div class="col-1 d-flex align-items-center">
          <button class="btn btn-sm btn-danger" id="deleteEditItem${index}">
            <span class="material-symbols-outlined" style="font-size:24px">delete</span>
          </button>
        </div>
      </div>
    </form>
  `);

  attachCharCountListener(`#editItemName${index}`, `#editCharCount${index}`);

  $('#deleteEditItem' + index).on('click', function(event) {
    event.preventDefault();
    $(this).closest('form').remove();
  });
});

$('#deleteItemForm').on('submit', async function(event) {
  event.preventDefault();
  const index = $(this).data('item-data').index;
  $('#deleteItemModal').modal('hide');
  $('#editItemForm' + index).remove();
  const itemData = $(this).data('item-data').itemData;
  if(itemData){
    itemsToDelete.push({ ...itemData, invoice_id: itemData.invoice_id });
  }
});

$(document).ready(function() {
  $('#editItemsContainer').on('keydown paste', '[id^="editQuantity"]', function(e) {
      if (e.type === 'paste') {
          let pasteData = e.originalEvent.clipboardData.getData('text');
          if (/[eE+\-.]/g.test(pasteData)) {
              e.preventDefault();
          }
      } else if (["e", "E", "+", "-", "."].includes(e.key)) {
          e.preventDefault();
      }
  });
});

$(document).ready(function() {
  $('#editItemsContainer').on('keydown paste', '[id^="editUnitPrice"]', function(e) {
      if (e.type === 'paste') {
          let pasteData = e.originalEvent.clipboardData.getData('text');
          if (/[eE+\-.]/g.test(pasteData)) {
              e.preventDefault();
          }
      } else if (["e", "E", "+", "-"].includes(e.key)) {
          e.preventDefault();
      }
  });
});

$(document).ready(function() {
  $('#itemsContainer').on('keydown paste', '[id^="quantity"]', function(e) {
      if (e.type === 'paste') {
          let pasteData = e.originalEvent.clipboardData.getData('text');
          if (/[eE+\-.]/g.test(pasteData)) {
              e.preventDefault();
          }
      } else if (["e", "E", "+", "-", "."].includes(e.key)) {
          e.preventDefault();
      }
  });
});

$(document).ready(function() {
  $('#itemsContainer').on('keydown paste', '[id^="unitPrice"]', function(e) {
      if (e.type === 'paste') {
          let pasteData = e.originalEvent.clipboardData.getData('text');
          if (/[eE+\-]/g.test(pasteData)) {
              e.preventDefault();
          }
      } else if (["e", "E", "+", "-"].includes(e.key)) {
          e.preventDefault();
      }
  });
});

$(document).ready(function() {
  $('body').on('keydown paste', '#amountPaid, #editAmountPaid', function(e) {
      if (e.type === 'paste') {
          let pasteData = e.originalEvent.clipboardData.getData('text');
          if (/[eE+\-.]/g.test(pasteData)) {
              e.preventDefault();
          }
      } else if (["e", "E", "+", "-"].includes(e.key)) {
          e.preventDefault();
      }
  });
});

$(document).ready(function() {
  $('body').on('keydown paste', '#invoiceID, #editInvoiceID', function(e) {
      if (e.type === 'paste') {
          let pasteData = e.originalEvent.clipboardData.getData('text');
          if (/[eE+\-.]/g.test(pasteData)) {
              e.preventDefault();
          }
      } else if (["e", "E", "+", "-", "."].includes(e.key)) {
          e.preventDefault();
      }
  });
});