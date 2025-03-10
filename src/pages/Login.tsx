
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ThreeBear from '@/components/ThreeBear';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  // Track password typing with a timeout
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsTypingPassword(true);
    
    // Reset the typing state after a short delay
    setTimeout(() => {
      setIsTypingPassword(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login attempted with username: ${username}`);
    // In a real app, you would handle authentication here
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          
          {/* 3D Bear Container */}
          <div className="w-full h-64 mb-4 relative">
            <ThreeBear isEyesClosed={isPasswordFocused && (isTypingPassword || password.length > 0)} />
            <div className="absolute top-2 left-0 right-0 text-center">
              <p className="text-xs text-gray-500 italic">
                Move your mouse to make the bear follow it!
              </p>
            </div>
          </div>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required
                />
                <p className="text-xs text-gray-500 italic">
                  {isPasswordFocused && (password.length > 0 || isTypingPassword) 
                    ? "Shh! Bear is protecting your password!" 
                    : "Type your password and watch the bear"}
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                Sign In
              </button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
            <Link to="/" className="text-sm text-blue-600 hover:underline">
              Back to Home
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
