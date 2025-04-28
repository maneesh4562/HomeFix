import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Error as MongooseError } from 'mongoose';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, phoneNumber, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'phone number';
      return res.status(400).json({ message: `User with this ${field} already exists` });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role,
      phoneNumber,
      address,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
      token,
    });
  } catch (error: any) {
    if (error instanceof MongooseError.ValidationError) {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    // Create a new object without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req?.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updates = req.body;
    
    // Remove any fields that shouldn't be updated
    const allowedUpdates = ['firstName', 'lastName', 'email', 'phoneNumber', 'address'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as Record<string, any>);

    // Check if there are any valid updates
    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ 
        message: 'No valid fields to update',
        allowedFields: allowedUpdates
      });
    }

    // If email is being updated, check if it's already in use
    if (filteredUpdates.email) {
      const existingUser = await User.findOne({ 
        email: filteredUpdates.email,
        _id: { $ne: req.user.id }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // If phoneNumber is being updated, check if it's already in use
    if (filteredUpdates.phoneNumber) {
      const existingUser = await User.findOne({ 
        phoneNumber: filteredUpdates.phoneNumber,
        _id: { $ne: req.user.id }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Phone number is already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      filteredUpdates,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    if (error instanceof MongooseError.ValidationError) {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors
      });
    }
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
}; 