// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// // Test API connection
// export const testAPI = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/test`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('API test failed:', error);
//     throw new Error('Cannot connect to server. Please make sure the backend is running.');
//   }
// };

// // Test Auth API connection
// export const testAuthAPI = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/auth/test`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Auth API test failed:', error);
//     throw new Error('Cannot connect to authentication service.');
//   }
// };

// // Generic API call function
// const apiCall = async (endpoint, options = {}) => {
//   const token = localStorage.getItem('authToken');
  
//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//     ...options,
//   };

//   if (config.body && typeof config.body === 'object') {
//     config.body = JSON.stringify(config.body);
//   }

//   try {
//     console.log(`🔄 API Call: ${endpoint}`, config);
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
//     let data;
//     const contentType = response.headers.get('content-type');
//     if (contentType && contentType.includes('application/json')) {
//       data = await response.json();
//     } else {
//       data = await response.text();
//     }

//     if (!response.ok) {
//       throw new Error(data.message || `HTTP error! status: ${response.status}`);
//     }

//     console.log(`✅ API Success: ${endpoint}`, data);
//     return data;
//   } catch (error) {
//     console.error(`❌ API Error: ${endpoint}`, error);
    
//     if (error.message.includes('Failed to fetch')) {
//       throw new Error('Cannot connect to server. Please check if the backend is running.');
//     }
    
//     throw error;
//   }
// };

// // Auth API calls
// export const authAPI = {
//   register: async (userData) => {
//     return apiCall('/auth/register', {
//       method: 'POST',
//       body: userData,
//     });
//   },

//   login: async (credentials) => {
//     return apiCall('/auth/login', {
//       method: 'POST',
//       body: credentials,
//     });
//   },

//   getCurrentUser: async () => {
//     return apiCall('/auth/me');
//   },
// };

// // Check if user is authenticated
// export const isAuthenticated = () => {
//   return !!localStorage.getItem('authToken');
// };

// // Logout user
// export const logout = () => {
//   localStorage.removeItem('authToken');
//   localStorage.removeItem('userData');
//   window.location.href = '/login';
// };
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);