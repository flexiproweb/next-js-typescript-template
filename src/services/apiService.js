// services/apiService.js
const API_BASE_URL = 'https://dummyjson.com';
const JSONPLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com';

export const searchProducts = async (query) => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=15`);
    const data = await response.json();
    
    return data.products.map(product => ({
      value: product.id.toString(),
      label: product.title,
      category: product.category,
      type: 'product'
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const searchUsers = async (query) => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}&limit=10`);
    const data = await response.json();
    
    return data.users.map(user => ({
      value: user.id.toString(),
      label: `${user.firstName} ${user.lastName}`,
      category: 'Users',
      type: 'user'
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const searchPosts = async (query) => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(`${JSONPLACEHOLDER_URL}/posts`);
    const posts = await response.json();
    
    // Filter posts by title or body containing query
    const filteredPosts = posts
      .filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
    
    return filteredPosts.map(post => ({
      value: post.id.toString(),
      label: post.title,
      category: 'Posts',
      type: 'post'
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

// Combined search function
export const searchAll = async (query) => {
  if (!query.trim()) return [];
  
  try {
    const [products, users, posts] = await Promise.all([
      searchProducts(query),
      searchUsers(query),
      searchPosts(query)
    ]);
    
    return [...products.slice(0, 5), ...users.slice(0, 3), ...posts.slice(0, 5)];
  } catch (error) {
    console.error('Error in combined search:', error);
    return [];
  }
};
