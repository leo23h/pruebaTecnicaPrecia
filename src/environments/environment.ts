export const environment = {
    production: false,
    baseUrl: 'https://dummyjson.com/',
    prefijos: {
        auth: {
           login: 'auth/login',
           getUser: 'auth/me',
           refresh: 'auth/refresh'
        },
        user:{
          add: 'users/add'
        },
        products: {
           add: 'products/add',
           update: 'products/', // + id
           delete: 'products/', // + id
           getAll: 'products',
           getById: 'products/', // + id
           search: 'products/search?q=', // + query
           getCategories: 'products/category-list',
           getProductsByCategory: 'products/category/' // + category
        }
    }
}