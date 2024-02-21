$(document).ready(function() {
    let itemIndex = 0;
    $('#addItem').click(function() {
      $('#itemsContainer').append(`
        <div class="row" id="itemRow${itemIndex}">
          <div class="form-group col-6">
            <label for="itemName${itemIndex}">Item Name</label>
            <input type="text" class="form-control" id="itemName${itemIndex}">
          </div>
          <div class="form-group col-2">
            <label for="quantity${itemIndex}">Quantity</label>
            <input type="number" class="form-control" id="quantity${itemIndex}">
          </div>
          <div class="form-group col-4">
            <label for="unitPrice${itemIndex}">Unit Price</label>
            <input type="number" class="form-control" id="unitPrice${itemIndex}">
          </div>
        </div>
      `);
      itemIndex++;
    });
});

$(document).on('click', '.delete-button', function() {
    const table = $('#SalesInvoiceTable').DataTable();
    const data = table.row($(this).parents('tr')).data();
    $('#deleteInvoiceForm').data('item-data', data);
    $('#deleteModal').modal('show');
});
