"use client";

import React, { useState } from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { BiSolidLock } from "react-icons/bi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { redirect } from "next/navigation";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [seePass, setSeePass] = useState<"text" | "password">("password");
  const [seeConfirmPass, setSeeConfirmPass] = useState<"text" | "password">(
    "password"
  );
  const [error, setError] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmpassword?: string;
  }>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const isValidPassword = (password: string): boolean => {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?#]).{8,}$/.test(
      password
    );
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (/[A-Z]/.test(password)) strength += 0.2;
    if (/[a-z]/.test(password)) strength += 0.2;
    if (/\d/.test(password)) strength += 0.2;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?#]/.test(password)) strength += 0.2;
    if (password.length >= 8) strength += 0.2;
    setPasswordStrength(strength);
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});

    if (!fullName) return setError({ fullName: "Full Name is required" });
    if (!email) return setError({ email: "Email is required" });
    if (!password) return setError({ password: "Password is required" });
    if (!confirmPassword)
      return setError({ confirmpassword: "Confirm your password" });
    if (!isValidPassword(password))
      return setError({
        password:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
      });
    if (password !== confirmPassword)
      return setError({ confirmpassword: "Passwords do not match" });

    try {
      redirect("/auth/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError({ email: "An error occurred. Please try again." });
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-between bg-[var(--accent-secondary)]">
      <section className="w-1/2 h-screen hidden lg:block bg-[url('/Auth/Auth-Hero.jpg')] bg-cover bg-end bg-no-repeat"></section>
      <section className="w-10/12 lg:w-[45%] flex flex-col justify-center gap-10 max-w-lg h-full mx-auto p-10 border-1 border-[var(--button)] rounded-lg bg-[#18062C]">
        <h2 className="text-3xl font-bold text-center text-[var(--neutral)]">
          Create an Account
        </h2>
        <form onSubmit={submitForm} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="flex items-center gap-2 text-[var(--neutral)]">
              <FaUser className="w-4 h-4" /> Full Name
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Enter your Full Name"
                className="w-full p-3 border border-[var(--button)] rounded-md focus:outline-none focus:ring-2 ring-[var(--button)]/50 text-[var(--dark)]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {error.fullName && (
                <div className="absolute hidden group-hover:block bg-[var(--dark)] text-[var(--neutral)] text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                  {error.fullName}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="flex items-center gap-2 text-[var(--neutral)]">
              <FaEnvelope className="w-4 h-4" /> Email Address
            </label>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-full p-3 border border-[var(--button)] rounded-md focus:outline-none focus:ring-2 ring-[var(--button)]/50 text-[var(--dark)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error.email && (
                <div className="absolute hidden group-hover:block bg-[var(--dark)] text-[var(--neutral)] text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                  {error.email}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="flex items-center gap-2 text-[var(--neutral)]">
              <BiSolidLock className="w-5 h-5" /> Password
            </label>
            <div className="relative group">
              <input
                type={seePass}
                placeholder="Create Password"
                className="w-full p-3 border border-[var(--button)] rounded-md focus:outline-none focus:ring-2 ring-[var(--button)]/50 text-[var(--dark)]"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  calculatePasswordStrength(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setSeePass(seePass === "password" ? "text" : "password")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--neutral)]"
              >
                {seePass === "password" ? (
                  <AiFillEye className="w-5 h-5" />
                ) : (
                  <AiFillEyeInvisible className="w-5 h-5" />
                )}
              </button>
              {error.password && (
                <div className="absolute hidden group-hover:block bg-[var(--dark)] text-[var(--neutral)] text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                  {error.password}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="flex items-center gap-2 text-[var(--neutral)]">
              <BiSolidLock className="w-5 h-5" /> Confirm Password
            </label>
            <div className="relative group">
              <input
                type={seeConfirmPass}
                placeholder="Confirm Password"
                className="w-full p-3 border border-[var(--button)] rounded-md focus:outline-none focus:ring-2 ring-[var(--button)]/50 text-[var(--dark)]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() =>
                  setSeeConfirmPass(
                    seeConfirmPass === "password" ? "text" : "password"
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--neutral)]"
              >
                {seeConfirmPass === "password" ? (
                  <AiFillEye className="w-5 h-5" />
                ) : (
                  <AiFillEyeInvisible className="w-5 h-5" />
                )}
              </button>
              {error.confirmpassword && (
                <div className="absolute hidden group-hover:block bg-[var(--dark)] text-[var(--neutral)] text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                  {error.confirmpassword}
                </div>
              )}
            </div>
          </div>

          {password && (
            <div className="flex items-center gap-2 text-sm text-[var(--neutral)]">
              <span
                className={`font-semibold ${
                  passwordStrength < 0.6
                    ? "text-red-500"
                    : passwordStrength < 1
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {passwordStrength < 0.6
                  ? "Weak"
                  : passwordStrength < 1
                  ? "Good"
                  : "Strong"}
              </span>
              <div
                className={`h-1 rounded-full flex-1 ${
                  passwordStrength < 0.6
                    ? "bg-red-500"
                    : passwordStrength < 1
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${passwordStrength * 100}%` }}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[var(--button)] text-white font-semibold p-4 rounded-md text-lg"
          >
            Sign Up
          </button>
        </form>
        <span className="text-center mx-auto text-[var(--neutral)]">
          Already have an Account?{" "}
          <Link href="/auth/login" className="underline text-[var(--neutral)]">
            Login
          </Link>
        </span>
      </section>
    </main>
  );
};

export default SignUp;
