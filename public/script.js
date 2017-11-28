const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    search: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE,
  },
  computed: {
    noMoreItems() {
      return this.items.length === this.results.length
        && this.results.length > 0;
    },
  },
  methods: {
    appendItems() {
      if (this.items.length < this.results.length) {
        const append = this.results.slice(this.items.length,
          this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    onSubmit() {
      if (this.search.length) {
        this.items = [];
        this.loading = true;
        this.$http.get(`/search/${this.search}`)
          .then((res) => {
            this.results = res.data;
            this.lastSearch = this.search;
            this.appendItems();
            this.loading = false;
          });
      }
    },
    addItem(index) {
      this.total += 9.99;
      const item = this.items[index];

      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          this.cart[i].qty++;
          return;
        }
      }

      this.cart.push({
        id: item.id,
        title: item.title,
        qty: 1,
        price: PRICE,
      });
    },
    inc(item) {
      item.qty++;
      this.total += PRICE;
    },
    dec(item) {
      item.qty--;
      this.total -= PRICE;

      if (item.qty <= 0) {
        for (let i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
          }
        }
      }
    },
  },
  filters: {
    currency: function(price) {
      return `$${price.toFixed(2)}`;
    },
  },
  mounted() {
    this.onSubmit();

    const elem = document.getElementById('product-list-bottom');
    const watcher = scrollMonitor.create(elem);
    watcher.enterViewport(() => {
      this.appendItems();
    });
  },
});
