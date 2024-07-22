'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

type FormProps = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(false);
  const { register, formState: { errors }, handleSubmit } = useForm<FormProps>();

  const formSubmitted = async (data: FormProps) => {
    try {
      setAlert(false);
      setSubmitting(true);
      const signInData = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (signInData?.error) setAlert(true);
      else router.push('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(formSubmitted)} className="space-y-6">
      {alert && (
        <Alert variant="destructive" className="mb-6">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Email or Password is incorrect</AlertDescription>
        </Alert>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          {...register('email', { required: 'Email is required' })}
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            {...register('password', { required: 'Password is required' })}
            type={visible ? "text" : "password"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <AiFillEyeInvisible className="h-5 w-5 text-gray-400" /> : <AiFillEye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>
      <div>
        <Button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
};