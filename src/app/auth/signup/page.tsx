"use client";

import React, { useState } from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { BiSolidLock } from "react-icons/bi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { redirect } from "next/navigation";
import { registerUser, SignUpPayload } from "@/utils/signup";
import { useRouter } from "next/navigation";
import { FaUserShield } from "react-icons/fa";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const [role, setRole] = useState<"admin" | "author" | "superadmin">("author");
  const [seePass, setSeePass] = useState<"text" | "password">("password");
  const [seeConfirmPass, setSeeConfirmPass] = useState<"text" | "password">(
    "password"
  );
  const [error, setError] = useState<{
    username?: string;
    password?: string;
    confirmpassword?: string;
    role?: string;
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

    const payload: SignUpPayload = { username, password, role };

    try {
      await registerUser(payload);
      router.push("/auth/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Signup error:", err);
        setError({ username: err.message || "An error occurred. Try again." });
      } else {
        console.error("Unknown error:", err);
        setError({ username: "An unknown error occurred. Try again." });
      }
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
          {/* Username */}
          <div className="space-y-2 text-left">
            <label className="flex items-center gap-2 text-[var(--neutral)]">
              <FaUser className="w-4 h-4" /> Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full p-3 border border-[var(--button)] rounded-md focus:outline-none focus:ring-2 ring-[var(--button)]/50 text-[var(--dark)]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {error.username && (
              <div className="text-red-500 text-xs">{error.username}</div>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2 text-left relative">
            <label className="text-[var(--neutral)] flex items-center gap-2">
              <FaUserShield className="w-4 h-4" /> Role
            </label>
            <div className="relative">
              <select
                className="w-full p-3 pl-10 border border-[var(--button)] rounded-md 
                 bg-[#18062C] text-[var(--neutral)] 
                 focus:outline-none focus:ring-2 focus:ring-[var(--button)]/50 
                 appearance-none"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "admin" | "author" | "superadmin")
                }
              >
                <option value="admin">Admin</option>
                <option value="author">Author</option>
                <option value="superadmin">Super Admin</option>
              </select>
              {/* Icon inside the input */}
              <FaUserShield className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral)]" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2 text-left">
            <label className="flex items-center gap-2 text-[var(--neutral)]">
              <BiSolidLock className="w-5 h-5" /> Password
            </label>
            <div className="relative">
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
                <div className="text-red-500 text-xs">{error.password}</div>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2 text-left">
            <label className="flex items-center gap-2 text-[var(--neutral)]">
              <BiSolidLock className="w-5 h-5" /> Confirm Password
            </label>
            <div className="relative">
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
                <div className="text-red-500 text-xs">
                  {error.confirmpassword}
                </div>
              )}
            </div>
          </div>

          {/* Password Strength */}
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
      </section>
    </main>
  );
};

export default SignUp;
