let mainProducts = document.querySelector(".main-products");
let basketTable = document.querySelector("table");
let productsTotals = document.querySelector(".total");
let basketTableBody = document.querySelector(".table-body");
fetch('https://fakestoreapi.com/products').then(async (res) => {
    let products = await res.json();

    mainProducts.innerHTML = "";
    products.forEach(product => {
        mainProducts.innerHTML += `
            <div class="product">
                <div class="product-img"><img src="${product.image}" alt=""></div>
                <p class="product-name">${product.title.length > 25 ? product.title.substring(0, 25).concat("...") : product.title}</p>
                <span class="product-price">$${product.price}</span>
                <button class="product-btn">Show More</button>
                <i class="add-favori fa-solid fa-heart"></i>
                <i class="add-basket fa-solid fa-cart-shopping" 
                   data-image="${product.image}" 
                   data-price="${product.price}"
                   data-id="${product.id}"></i>
            </div>`;
    });

    document.querySelectorAll('.add-basket').forEach(button => {
        button.addEventListener('click', function () {
            let productImg = this.dataset.image;
            let productPrice = Number(this.dataset.price);
            let productId = this.getAttribute("data-id");
            addBasket(productImg, productPrice, productId, this);
        });
    });
});



function addBasket(productImg, productPrice, productId, element) {
    element.style.color = "yellow";
    let inputValue = 1;
    let productTotal = productPrice * inputValue;
    let row = document.getElementById(productId);
    if (!row) {
        basketTableBody.innerHTML += `
        <tr id = "${productId}"> 
            <td><img src="${productImg}" alt=""></td>
            <td class="input"><input type="number" value="${inputValue}" min="1" max="10" style="width: 50px;" onchange="updateProductTotal(this, ${productPrice})"></td>
            <td>$${productPrice.toFixed(2)}</td>
            <td class="product-total">$${productTotal.toFixed(2)}</td>
            <td><button class="delete-btn" onclick = "DeleteBasketRow(${productId})">X</button></td>
        </tr>`;
    }
    else {
        let input = row.querySelector('input');
        input.value = Number(input.value) + 1;
        updateProductTotal(input, productPrice);
    }

    updateTotalPrice();
}


function DeleteBasketRow(productId) {
    let row = document.getElementById(productId);
    if (row) {
        row.remove();
    }

    updateTotalPrice();
    document.querySelectorAll('.add-basket').forEach(button => {
        let checkId = button.getAttribute("data-id");
        if (checkId == productId) {
            button.style.color = "white";
        }
    });
}


function updateProductTotal(input, productPrice) {
    let quantity = Number(input.value);
    let productTotal = quantity * productPrice;
    let row = input.closest('tr');
    row.querySelector('.product-total').textContent = `$${productTotal.toFixed(2)}`;
    updateTotalPrice();
}

function updateTotalPrice() {
    let total = Array.from(basketTableBody.querySelectorAll('.product-total'))
        .reduce((acc, curr) => acc + Number(curr.textContent.replace('$', '')), 0);
    productsTotals.textContent = `$${total.toFixed(2)}`;
}


function ShowBasket() {
    basketTable.style.display = basketTable.style.display === 'block' ? 'none' : 'block';
}


