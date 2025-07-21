// scripts/cleanup-and-seed.js (New script to clean up duplicates)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Admin model (with pre-save hook for consistency)
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.model('Admin', adminSchema);

async function cleanupAndCreateAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv);
    console.log('Connected to MongoDB');

    // Clean up existing admin entries
    console.log('Cleaning up existing admin entries...');
    await Admin.deleteMany({ email: 'admin@haulix.delivery' });
    console.log('Cleanup complete');

    // Admin details
    const adminData = {
      email: 'admin@haulix.delivery',
      password: 'Admin123!', // This will be hashed by the pre-save hook
      name: 'Haulix Admin',
      role: 'super_admin',
    };

    // Create admin (password will be automatically hashed by pre-save hook)
    const admin = new Admin(adminData);
    await admin.save();
    
    console.log('Admin created successfully:');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('Please change this password after first login');
   
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the function
cleanupAndCreateAdmin();
