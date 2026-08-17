import axios from 'axios'

const BASE_URL = `${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wc/v3`

const token = Buffer.from(
  `${process.env.WC_USERNAME}:${process.env.WC_APP_PASSWORD}`
).toString('base64')

const headers = {
  Authorization: `Basic ${token}`,
  'Content-Type': 'application/json',
}

export const wc = {
  getProducts: (params?: Record<string, string>) =>
    axios.get(`${BASE_URL}/products`, { headers, params }).then(r => r.data),

  getProduct: (id: number) =>
    axios.get(`${BASE_URL}/products/${id}`, { headers }).then(r => r.data),

  getProductBySlug: (slug: string) =>
    axios.get(`${BASE_URL}/products`, { headers, params: { slug } }).then(r => r.data[0]),

  createProduct: (data: object) =>
    axios.post(`${BASE_URL}/products`, data, { headers }).then(r => r.data),

  updateProduct: (id: number, data: object) =>
    axios.put(`${BASE_URL}/products/${id}`, data, { headers }).then(r => r.data),

  deleteProduct: (id: number) =>
    axios.delete(`${BASE_URL}/products/${id}`, { headers }).then(r => r.data),

  getCategories: () =>
    axios.get(`${BASE_URL}/products/categories`, { headers, params: { per_page: '50' } }).then(r => r.data),

  createCategory: (data: object) =>
    axios.post(`${BASE_URL}/products/categories`, data, { headers }).then(r => r.data),

  getOrders: (params?: Record<string, string>) =>
    axios.get(`${BASE_URL}/orders`, { headers, params }).then(r => r.data),

  getOrder: (id: number) =>
    axios.get(`${BASE_URL}/orders/${id}`, { headers }).then(r => r.data),

  createOrder: (data: object) =>
    axios.post(`${BASE_URL}/orders`, data, { headers }).then(r => r.data),

  updateOrder: (id: number, data: object) =>
    axios.put(`${BASE_URL}/orders/${id}`, data, { headers }).then(r => r.data),

  getCustomers: (params?: Record<string, string>) =>
    axios.get(`${BASE_URL}/customers`, { headers, params }).then(r => r.data),

  getCustomer: (id: number) =>
    axios.get(`${BASE_URL}/customers/${id}`, { headers }).then(r => r.data),

  createCustomer: (data: object) =>
    axios.post(`${BASE_URL}/customers`, data, { headers }).then(r => r.data),

  updateCustomer: (id: number, data: object) =>
    axios.put(`${BASE_URL}/customers/${id}`, data, { headers }).then(r => r.data),
}