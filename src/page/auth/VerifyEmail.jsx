import React from "react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { useVerifyEmailMutation } from "../../redux/service/authSlice";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resendSuccess, setResendSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const [verifyEmail, { isLoading: isVerifyingApi }] = useVerifyEmailMutation();

  const email = location.state?.email || "your-email@example.com";

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;

    setVerificationCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (
      newCode.every((digit) => digit !== "") &&
      newCode.join("").length === 6
    ) {
      handleVerifyCode(newCode.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("");
        const newCode = [...verificationCode];

        digits.forEach((digit, i) => {
          if (i < 6) newCode[i] = digit;
        });

        setVerificationCode(newCode);

        // Focus the next empty input or the last one
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();

        // Auto-submit if complete
        if (digits.length === 6) {
          handleVerifyCode(digits.join(""));
        }
      });
    }
  };

  const handleVerifyCode = async (code = verificationCode.join("")) => {
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    // Don't proceed if already verifying
    if (isVerifyingApi) {
      return;
    }

    setError("");

    try {
      const result = await verifyEmail({
        email: email,
        verificationCode: code,
      }).unwrap();

      // Success - navigate to todo page
      navigate("/login", {
        state: {
          message: "Email verified successfully! Welcome to your dashboard.",
          email: email,
        },
      });
    } catch (error) {
      console.error("Verification error:", error);
      
      // Handle different error cases
      if (error.status === 400) {
        setError("Invalid verification code. Please try again.");
      } else if (error.status === 404) {
        setError("User not found. Please register again.");
      } else if (error.status === 409) {
        setError("Email is already verified.");
        // If already verified, redirect to login
        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "Your email is already verified. Please log in.",
              email: email,
            },
          });
        }, 2000);
        return;
      } else if (error.status === 410) {
        setError("Verification code has expired. Please request a new one.");
      } else {
        setError(error?.data?.message || "Verification failed. Please try again.");
      }

      // Clear the code on error (except for already verified case)
      setVerificationCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50">
      <Link
        to="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 font-semibold"
      >
        <FaCheckCircle className="h-6 w-6 text-blue-600" />
        <span>Taskly</span>
      </Link>

      <div className="w-full max-w-md border rounded-lg shadow-sm bg-white">
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <FaEnvelope className="h-8 w-8 text-blue-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Verify your email</h2>
            <p className="text-gray-500 text-sm">
              We've sent a 6-digit code to
            </p>
            <p className="font-medium text-blue-600">{email}</p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Enter verification code
              </label>
              <div className="flex justify-center gap-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      error ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    disabled={isVerifyingApi}
                  />
                ))}
              </div>
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            <button
              onClick={() => handleVerifyCode()}
              disabled={
                isVerifyingApi || verificationCode.some((digit) => digit === "")
              }
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full"
            >
              {isVerifyingApi ? "Verifying..." : "Verify Email"}
            </button>

            {resendSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  Verification code sent successfully!
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleBackToLogin}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-600 hover:text-gray-900 h-10 px-4 py-2 w-full"
              >
                <FaArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                Didn't receive the code? Check your spam folder or try
                resending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;