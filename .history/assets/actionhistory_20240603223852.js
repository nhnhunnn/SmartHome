// let rowsPerPage = 2;// Default rows per page is 5
// let currentPage = 1;
// let totalItems = 0;
// let grouptype = 'all'; // Default type is all
// let searchQuery = '';
// let sortField = 'ID';
// let sortOrder = 'asc';

document.getElementById('attributeActionSelect').addEventListener('change', function () {
    grouptype = this.value;
    currentPage = 1;
    fetchDataTableAction(currentPage, rowsPerPage, grouptype, searchQuery, sortField, sortOrder);
});

document.getElementById('attributeRowsSelect1').addEventListener('change', function () {
    rowsPerPage = this.value;
    currentPage = 1;
    fetchDataTableAction(currentPage, rowsPerPage, grouptype, searchQuery, sortField, sortOrder);
});

function handleSearch() {
    const searchInput = document.getElementById('searchInputAction');
    searchQuery = searchInput.value + '';
    currentPage = 1;
    fetchDataTableAction(currentPage, rowsPerPage, grouptype, searchQuery, sortField, sortOrder);
}

function sortTableAction(field) {
    if (sortField === field) {
        sortOrder = (sortOrder === 'asc') ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortOrder = 'asc';
    }
    fetchDataTableAction(currentPage, rowsPerPage, grouptype, searchQuery, sortField, sortOrder);
}


async function fetchDataTableAction(page, rowsPerPage, type, searchQuery, sortField, sortOrder) {
    try {
        const response = await fetch(`http://localhost:5003/getAction?pageSize=${rowsPerPage}&page=${page}&field=${type}&value=${searchQuery}&sortBy=${sortField}&sortDirection=${sortOrder}`);
        const responseData = await response.json();
        totalItems = responseData.totalCount;
        displayTable(page, responseData.data, type);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayTable(page, data, type) {
    const table = document.getElementById('actionTable');
    const tbody = table.querySelector("tbody");
    const tableHeaders = document.getElementById('tableHeaders1');

    tbody.innerHTML = '';

    if (type === 'all') {
        tableHeaders.innerHTML = `
            <th onclick="sortTableAction('ID')">Id</th>
            <th onclick="sortTableAction('id_device')">Thiết bị</th>
            <th onclick="sortTableAction('status')">Hành động</th>
            <th onclick="sortTableAction('time')">Thời gian</th>
        `;
    } else {
        tableHeaders.innerHTML = `
            <th onclick="sortTableAction('ID')">Id</th>
            <th onclick="sortTableAction('${type}')">${type.charAt(0).toUpperCase() + type.slice(1)}</th>
            <th onclick="sortTableAction('time')">Thời gian</th>
        `;
    }

    data.forEach((item) => {
        const row = document.createElement('tr');
        if (type === 'all') {
            row.innerHTML = `
                <td>${item.ID}</td>
                <td>${item.id_device}</td>
                <td>${item.status}</td>
                <td>${formatISODateAtion(item.time)}</td>
            `;
        } else {
            row.innerHTML = `
                <td>${item.ID}</td>
                <td>${item[type]}</td>
                <td>${formatISODateAtion(item.time)}</td>
            `;
        }
        tbody.appendChild(row);
    });
    updatePaginationAtion(page, totalItems);
}

function updatePagination(currPage, totalItems) {
    const pageCount = Math.ceil(totalItems / rowsPerPage);
    const paginationContainer = document.getElementById("pagination1");
    paginationContainer.innerHTML = "";

    const maxVisiblePages = 5;
    let startPage = Math.max(currPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, pageCount);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
    const createPageLink = (page, text, isDisabled = false) => {
        const pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.innerText = text;
        pageLink.className = (page === currPage) ? "active" : "";
        if (isDisabled) {
            pageLink.className += " disabled";
            pageLink.onclick = (event) => event.preventDefault();
        } else {
            pageLink.onclick = function (event) {
                event.preventDefault();
                currentPage = page;
                fetchDataTableAction(page, rowsPerPage);
            };
        }
        paginationContainer.appendChild(pageLink);
        paginationContainer.appendChild(document.createTextNode(" "));
    };

    if (currPage >= 1) {
        createPageLink(1, "<<", currPage === 1);
        createPageLink(currPage - 1, "<", currPage === 1);
    }
    for (let i = startPage; i <= endPage; i++) {
        createPageLink(i, i);
    }
    if (currPage <= pageCount) {
        createPageLink(currPage + 1, ">", currPage === pageCount);
        createPageLink(pageCount, ">>", currPage === pageCount);
    }
};

setInterval(() => fetchDataTableAction(currentPage, rowsPerPage, grouptype, searchQuery, sortField, sortOrder), 2000);
fetchDataTableAction(currentPage, rowsPerPage, grouptype, searchQuery, sortField, sortOrder);


function formatISODateAtion(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
