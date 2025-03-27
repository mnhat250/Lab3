// DOM elements
const productTableBody = document.getElementById("productTableBody");
const searchInput = document.getElementById("searchInput");
const addProductBtn = document.getElementById("addProductBtn");
const saveAddBtn = document.getElementById("saveAddBtn");
const addProductModal = new bootstrap.Modal(document.getElementById("addProductModal"));
const viewProductModal = new bootstrap.Modal(document.getElementById("viewProductModal"));
const editProductModal = new bootstrap.Modal(document.getElementById("editProductModal"));
const saveEditBtn = document.getElementById("saveEditBtn");
const deleteConfirmModal = new bootstrap.Modal(document.getElementById("deleteConfirmModal"));
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
let deleteProductId = null; 

document.addEventListener("DOMContentLoaded", function () {
    fetch("data.txt")
        .then(response => response.text())
        .then(text => {
            try {
                productList = JSON.parse(text);
                renderProductTable(productList);
            } catch (error) {
                console.error("Invalid JSON format:", error);
            }
        })
        .catch(error => console.error("Error loading products:", error));

    searchInput.addEventListener("input", handleSearch);
});

function renderProductTable(products) {
    productTableBody.innerHTML = ""; 

    products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td><span class="badge ${getStatusBadgeClass(product.status)}">${product.status}</span></td>
            <td>
                <button class="btn btn-info btn-sm view-btn" data-id="${product.id}"><i class="bi bi-eye"></i> View</button>
                <button class="btn btn-warning btn-sm edit-btn" data-id="${product.id}"><i class="bi bi-pencil"></i> Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${product.id}"><i class="bi bi-trash"></i> Delete</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

function getStatusBadgeClass(status) {
    return status === "In Stock" ? "bg-success" : "bg-danger";
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = productList.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
    );
    renderProductTable(filteredProducts);
}

addProductBtn.addEventListener("click", function () {
    document.getElementById("addProductForm").reset();
    addProductModal.show();
});

saveAddBtn.addEventListener("click", function () {
    const newProduct = {
        id: productList.length + 1, // Tạo ID mới
        name: document.getElementById("addName").value.trim(),
        price: `$${document.getElementById("addPrice").value.trim()}`,
        status: document.getElementById("addStatus").value,
    };

    if (!newProduct.name || isNaN(parseFloat(newProduct.price.replace("$", "")))) {
        alert("Please fill in all required fields!");
        return;
    }

    productList.push(newProduct);
    localStorage.setItem("products", JSON.stringify(productList));

    renderProductTable(productList);
    addProductModal.hide();
});

document.addEventListener("click", function (event) {
    const target = event.target.closest(".view-btn");
    if (target) {
        const productId = target.getAttribute("data-id");
        const product = productList.find((p) => p.id == productId);

        if (product) {
            document.getElementById("viewProductId").textContent = product.id;
            document.getElementById("viewProductName").textContent = product.name;
            document.getElementById("viewProductPrice").textContent = product.price;
            document.getElementById("viewProductStatus").textContent = product.status;

            viewProductModal.show();
        }
    }
});

document.addEventListener("click", function (event) {
    const target = event.target.closest(".edit-btn");
    if (target) {
        const productId = target.getAttribute("data-id");
        const product = productList.find((p) => p.id == productId);

        if (product) {
            document.getElementById("editProductId").value = product.id;
            document.getElementById("editName").value = product.name;
            document.getElementById("editPrice").value = typeof product.price === "number" ? product.price : product.price.replace("$", "");
            document.getElementById("editStatus").value = product.status;

            editProductModal.show();
        }
    }
});

saveEditBtn.addEventListener("click", function () {
    const productId = document.getElementById("editProductId").value;
    const updatedProduct = {
        id: parseInt(productId),
        name: document.getElementById("editName").value.trim(),
        price: `$${document.getElementById("editPrice").value.trim()}`,
        status: document.getElementById("editStatus").value,
    };

    if (!updatedProduct.name || isNaN(parseFloat(updatedProduct.price.replace("$", "")))) {
        alert("Please fill in all required fields!");
        return;
    }

    const index = productList.findIndex((p) => p.id == updatedProduct.id);
    if (index !== -1) {
        productList[index] = updatedProduct;
        localStorage.setItem("products", JSON.stringify(productList));
    }

    renderProductTable(productList);
    editProductModal.hide();
});

document.addEventListener("click", function (event) {
    const target = event.target.closest(".delete-btn");
    if (target) {
        deleteProductId = target.getAttribute("data-id");
        const product = productList.find((p) => p.id == deleteProductId);
        document.getElementById("deleteProductName").textContent = product.name;
        deleteConfirmModal.show();
    }
});

confirmDeleteBtn.addEventListener("click", function () {
    productList = productList.filter((p) => p.id != deleteProductId);
    localStorage.setItem("products", JSON.stringify(productList));
    renderProductTable(productList);
    deleteConfirmModal.hide();
});
