$(document).ready(function() {
    var table = $('#InventoryTable').DataTable({
        "dom": 'lrtip', // This option removes the default search bar
    });

    $('#customSearch').keyup(function() {
        table.column(1).search($(this).val()).draw();
    });
});