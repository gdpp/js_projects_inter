// DB Simulation
const db = {
    methods: {
        find: (id) => {
            return db.items.find((item) => item.id === id);
        },
        remove: (items) => {
            items.forEach((item) => {
                const product = db.methods.find(item.id);
                product.qty = product.qty - item.qty;
            });
        },
    },
    items: [
        {
            id: 1,
            title: 'Harry Potter with Floo Powder (Glow)',
            img: 'https://cdn.shopify.com/s/files/1/1052/2158/products/66754_POPMovies_CoS_20th_HarryFlooPowder_GW_GLAM-1-WEB_ed0da9a3-dccd-445c-8be0-0c7b93a26dd1.png?v=1668468673',
            price: 15.99,
            qty: 25,
        },
        {
            id: 2,
            title: 'Ron Weasley Quidditch Costume',
            img: 'https://regalosde.es/6688-thickbox_default/figura-funko-pop-ron-weasley-on-broom-harry-potter.jpg',
            price: 30.99,
            qty: 15,
        },
        {
            id: 3,
            title: 'Hermione Granger with Mirror',
            img: 'https://www.harrypotterpopvinyls.com/wp-content/uploads/2022/08/150-hermione-granger-with-mirror-pop-vinyl-400x0-c-center.png',
            price: 12.99,
            qty: 10,
        },
        {
            id: 4,
            title: 'Luna Lovegood',
            img: 'https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/mg/gm/3pp/asr/e9654359-360b-43af-acf6-64c5ebcf4267.f53da2b89a650bf84acaca7d6bcc62cf.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff',
            price: 30.99,
            qty: 55,
        },
    ],
};

// Cart
const shoppingCart = {
    items: [],
    methods: {
        add: (id, qty) => {
            const cartItem = shoppingCart.methods.get(id);

            if (cartItem) {
                if (shoppingCart.methods.hasInventory(id, qty + cartItem.qty)) {
                    cartItem.qty++;
                } else {
                    alert('Out of Stock');
                }
            } else {
                shoppingCart.items.push({ id, qty });
            }
        },
        remove: (id, qty) => {
            const cartItem = shoppingCart.methods.get(id);

            if (cartItem.qty - 1 > 0) {
                cartItem.qty--;
            } else {
                shoppingCart.items = shoppingCart.items.filter(
                    (item) => item.id !== id
                );
            }
        },
        count: () => {
            return shoppingCart.items.reduce((acc, item) => acc + item.qty, 0);
        },
        get: (id) => {
            const index = shoppingCart.items.findIndex(
                (item) => item.id === id
            );
            return index >= 0 ? shoppingCart.items[index] : null;
        },
        getTotal: () => {
            let total = 0;
            shoppingCart.items.forEach((item) => {
                const found = db.methods.find(item.id);
                total += found.price * item.qty;
            });

            return total;
        },
        hasInventory: (id, qty) => {
            return db.items.find((item) => item.id === id).qty - qty >= 0;
        },
        purchase: () => {
            db.methods.remove(shoppingCart.items);
            shoppingCart.items = [];
        },
    },
};

// App Flow
renderStore();

//Functions
function renderStore() {
    const htmlContent = db.items.map((item) => {
        return `
            <div class="item">
                <img class="img-item" src="${item.img}">
                <div class="item-content">
                    <h3 class="item-title">${item.title}</h3>
                    <div class="item-price">
                        Price: ${numberToCurrency(item.price)}
                    </div>
                    <div class="item-stock">
                        ${item.qty} articles in stock.
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-add" data-id="${item.id}">
                        Add To Cart
                    </button>
                </div>
            </div>
        `;
    });

    document.querySelector('#store-container').innerHTML = htmlContent.join('');

    document.querySelectorAll('.item .item-actions .btn-add').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            const item = db.methods.find(id);

            if (item && item.qty - 1 > 0) {
                shoppingCart.methods.add(id, 1);
                renderShoppingCart();
            } else {
                alert('Out Of Stock');
            }
        });
    });
}

function renderShoppingCart() {
    const htmlContent = shoppingCart.items.map((item) => {
        const dbItem = db.methods.find(item.id);
        return `
            <div class="cart-item">
                <div class="cart-item-header">
                    <img class="cart-img-item" src="${dbItem.img}">
                    <h3 class="cart-item-title">${dbItem.title}</h3>
                </div>
                <div class="cart-item-content">
                    <div class="content-one">
                        <div class="cart-item-price">
                            Price: ${numberToCurrency(dbItem.price)}
                        </div>
                        <div class="cart-subtotal">
                            Subtotal: ${numberToCurrency(
                                item.qty * dbItem.price
                            )}
                        </div>
                    </div>
                    <div class="content-two">
                        <div class="cart-actions">
                            <button class="add-one" data-id="${dbItem.id}">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                            <button class="rest-one" data-id="${dbItem.id}">
                                <i class="fa-solid fa-minus"></i>
                            </button>
                        </div>
                        <div class="cart-item-stock">
                            ${item.qty} articles in cart.
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    const closeButton = `
        <div class="cart-header">
            <button class="close-btn">Close</button>
        </div>
    `;

    const purchaseButton =
        shoppingCart.items.length > 0
            ? `
        <div class="store-actions">
            <button class="purchase-btn">Finish Purchase</button>
        </div>`
            : '';

    const total = shoppingCart.methods.getTotal();

    const totalContainer =
        shoppingCart.items.length > 0
            ? `
        <div class="cart-total">
            Total: ${numberToCurrency(total)}
        </div>
    `
            : '';

    document.querySelector('#shopping-cart-container').innerHTML =
        closeButton + htmlContent.join('') + totalContainer + purchaseButton;

    document.querySelector('#shopping-cart-container').classList.remove('hide');
    document.querySelector('#shopping-cart-container').classList.add('show');

    document.querySelectorAll('.add-one').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            shoppingCart.methods.add(id, 1);
            renderShoppingCart();
        });
    });

    document.querySelectorAll('.rest-one').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            shoppingCart.methods.remove(id, 1);
            renderShoppingCart();
        });
    });

    const btnClose = document.querySelector('.close-btn');

    btnClose.addEventListener('click', () => {
        document
            .querySelector('#shopping-cart-container')
            .classList.remove('show');
        document
            .querySelector('#shopping-cart-container')
            .classList.add('hide');
    });

    const btnPurchase = document.querySelector('.purchase-btn');

    if (btnPurchase) {
        btnPurchase.addEventListener('click', (e) => {
            shoppingCart.methods.purchase();
            renderStore();
            renderShoppingCart();
        });
    }
}

function numberToCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        maximumSignificantDigits: 2,
        style: 'currency',
        currency: 'USD',
    }).format(value);
}
