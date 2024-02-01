
const addproductnameinput = document.getElementById('productName')
const addproductnamecount =   document.getElementById('charCount')
const customPagination = document.getElementById('customPagination');

const snackbar = document.getElementById('snackbar');
const snackbarmessage = document.getElementById('snackbar-message');
const snackbaricon = document.getElementById('snackbar-icon');
const snackBarDelayMs = 3500;
const buttonDelayMs = 1000;
//On page load
document.addEventListener('DOMContentLoaded', function() {
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

            customPagination.innerHTML = paginationHtml;
        },
        columnDefs: [
            { targets: 6, orderable: false } // This option removes the sort icon from the action column
         ]
    });

    customPagination.addEventListener('click', function(e) {
        if (e.target.classList.contains('paginate_button')) {
            const page = e.target.textContent;
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
        }
    });

    document.getElementById('customSearch').addEventListener('keyup', function() {
        table.column(1).search(this.value).draw();
    });
});

document.getElementById('productName').addEventListener('input', function (e) {
    const target = e.target, 
        maxLength = target.getAttribute('maxlength'),
        currentLength = target.value.length;
    
    if (currentLength >= maxLength) {
      console.log("You have reached the maximum number of characters.");
    }
    
    addproductnamecount.innerHTML = currentLength + ' / ' + maxLength;
  });
  

function ShowSnackbar(Parameters){
    snackbar.style.color = Parameters.color;
    snackbarmessage.innerHTML = Parameters.message;
    snackbaricon.innerHTML = Parameters.icon;
    snackbar.className = 'show';
    setTimeout(function()
        { snackbar.className = snackbar.className.replace('show', 'hide'); 

        }, snackBarDelayMs);
}
