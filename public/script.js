const PRICE = 9.99;
const LOAD_RESULTS_LIMIT = 10;

let vm = new Vue({
  el: '#app',
  data: {
    search: {
      current: 'anime',
      previous: '',
      loading: false
    },
    lastSearch: '',
    total: 0,
    items: [],
    results: [],
    price: PRICE,
    cart: []
  },
  methods: {
    onSearch() {
      if ( this.search.current ) {
        this.items = [];
        this.search.loading = true;

        this.$http.get(`/search/${this.search.current}`)
                  .then((response) => {
                    this.search.previous = this.search.current;
                    this.results = response.data;
                    this.appendItems();
                    this.search.loading = false;
                  });
      }
    },
    appendItems() {
      if ( this.items.length < this.results.length ) {
        let toAppend = this.results.slice(
          this.items.length, this.items.length + LOAD_RESULTS_LIMIT
        );

        this.items = this.items.concat(toAppend)
      }
    },
    addItem(index) {
      this.total += PRICE;
      let item = this.items[index];

      let alreadyInCart = this.cart.find((cartItem) => cartItem.id === item.id);

      if ( alreadyInCart ) {
        for ( let i in this.cart ) {
          if ( this.cart[i].id === item.id ) {
            this.cart[i].quantity++;
          }
        }
      } else {
        this.cart.push({
          id: item.id,
          title: item.title,
          price: PRICE,
          quantity: 1
        });
      }
    },
    incrementQty(item) {
      item.quantity++;
      this.total += PRICE;
    },
    decrementQty(item) {
      item.quantity--;
      this.total -= PRICE;

      if ( item.quantity === 0 ) {
        this.cart.splice(this.cart.indexOf(item), 1);
      }
    }
  },
  computed: {
    allResultsDisplayed() {
      return this.results.length === this.items.length && this.results.length > 0;
    }
  },
  filters: {
    currency(price) {
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted() {
    this.onSearch();

    let vm = this;

    let productListBottom = document.getElementById('product-list-bottom');
    let watcher = scrollMonitor.create(productListBottom);

    watcher.enterViewport(() => {
      vm.appendItems();
    });
  }
});
