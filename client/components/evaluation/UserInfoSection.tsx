'use client';

import React from 'react';
import { Input } from '../ui/Input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface UserInfoData {
  name: string;
  email: string;
  phone: string;
}

interface UserInfoSectionProps {
  register: UseFormRegister<UserInfoData>;
  errors: FieldErrors<UserInfoData>;
}

export default function UserInfoSection({
  register,
  errors,
}: UserInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Personal Information
        </h3>
        <p className="text-sm text-gray-600">
          Please provide your contact information for the evaluation.
        </p>
      </div>

      <div className="space-y-4">
        {/* Name Field */}
        <Input
          label="Full Name"
          className=' text-black'
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          error={errors.name?.message}
          placeholder="John Doe"
          required
        />

        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          className=' text-black'
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
          error={errors.email?.message}
          placeholder="john.doe@example.com"
          required
        />

        {/* Phone Field */}
        <Input
          label="Phone Number"
          className=' text-black'
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="+1 (555) 123-4567"
          helperText="Optional - Include country code"
        />
      </div>
    </div>
  );
}
