import { createStore } from 'vuex'
import ProductService from '@/services/ProductService.js';
import axios from 'axios'

export default createStore({
  state: {
    isLoading: false,
    products: [],
    product: {},
    token: null
  },
  getters: {
    getProductById: state => id => {
      return state.products.find(product => product.id === id);
    },
    loggedIn(state) {
      return !!state.token
    }
  },
  mutations: {
    SET_LOADING_STATUS(state) {
      state.isLoading = !state.isLoading;
    },
    SET_PRODUCTS(state, payload) {
      state.products = payload;
    },
    ADD_PRODUCT(state, product) {
      state.products.push(product)
    },
    SET_PRODUCT(state, payload) {
      state.product = payload;
    },
    REMOVE_PRODUCT(state, id) {
      state.products = state.products.filter(product => product.id != id);
    },
    SET_TOKEN(state, payload) {
      state.token = payload
    }
  },
  actions: {
    checkPreviousLogin({ commit }) {
      const existingToken = localStorage.getItem('auth_token');
      if(existingToken)
        commit('SET_TOKEN', existingToken);
        localStorage.setItem('auth_token', JSON.stringify(existingToken));
        axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
    },
    login ({ commit }, credentials) {
      return axios
        .post('http://www.mocky.io/v2/5b9149823100002a00939952', credentials) // mocky.io allows us to fake a successful authentication from the server
        .then(({ data }) => {
          commit('SET_TOKEN', data.token);
          localStorage.setItem('auth_token', JSON.stringify(data.token));
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        })
    },
    async fetchProducts({commit}) {
      const response = await ProductService.getProducts()
      commit('SET_PRODUCTS', response.data);
    },
    addProduct({commit}, newProduct) {
      return ProductService.insertProduct(newProduct)
        .then(() => {
          commit('ADD_PRODUCT', newProduct);
        })
    },
    fetchProduct({commit,getters}, id) {
      let p = getters.getProductById(id);
      if(p == null) {
        ProductService.getProduct(id)
          .then(response => {
            commit('SET_PRODUCT', response.data);
          })
      } else {
        commit('SET_PRODUCT', p);
      }
    },
    deleteProduct({ commit }, product) {
      return ProductService.deleteProduct(product).then(() => {
        commit("REMOVE_PRODUCT", product.id);
      });
    },
  },
  modules: {
  }
})
