import axios from 'axios'

const BASE_URL = `${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wc/v3`
const WP_BASE_URL = `${process.env.NEXT_PUBLIC_WC_URL}/wp-json/wp/v2`

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

  getCoupons: (params?: Record<string, string>) =>
    axios.get(`${BASE_URL}/coupons`, { headers, params }).then(r => r.data),

  getProductReviews: (params?: Record<string, string>) =>
    axios.get(`${BASE_URL}/products/reviews`, { headers, params }).then(r => r.data),

  getProductVariations: (productId: number, params?: Record<string, string>) =>
    axios.get(`${BASE_URL}/products/${productId}/variations`, { headers, params }).then(r => r.data),

  createProductReview: (data: object) =>
    axios.post(`${BASE_URL}/products/reviews`, data, { headers }).then(r => r.data),

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

// The "Simple JWT Login" plugin's /register endpoint creates a plain WP user
// with WordPress's default new-user role ("subscriber"), not "customer" — and
// WooCommerce's /wc/v3/customers endpoint only ever returns "customer"-role
// users. Left alone, a self-registered account is invisible to every wc.
// getCustomers() lookup (order name lookup, account details editing).
export const wp = {
  findUserByEmail: (email: string) =>
    axios
      .get(`${WP_BASE_URL}/users`, { headers, params: { search: email, context: 'edit' } })
      .then(r => r.data.find((u: { email?: string }) => u.email?.toLowerCase() === email.toLowerCase()) || null),

  setUserRole: (id: number, role: string) =>
    axios.put(`${WP_BASE_URL}/users/${id}`, { roles: [role] }, { headers }).then(r => r.data),
}