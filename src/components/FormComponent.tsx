"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import InputForm from "./atoms/forms/InputForm";
import {SelectForm} from "./atoms/forms/SelectForm";
import DatepickerForm from "./atoms/forms/DatepickerForm";
import InputFileForm from "./atoms/forms/InputFileForm";
import InputArea from "./atoms/forms/TextAreaForm";
import ButtonForm from "./atoms/forms/ButtonForm";

interface FormData {
  text: string;
  email: string;
  password: string;
  confirmPassword: string;
  textarea: string;
  select: string;
  radio: string;
  checkbox: boolean;
  date: string;
  number: string;
  file: File | null;
  range: string;
  color: string;
  url: string;
  tel: string;
  search: string;
  time: string;
  datetime: string;
  department: string;
}

interface FormErrors {
  [key: string]: string;
}

interface FormStatus {
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

// Intellinum-specific data
const DEPARTMENTS = [
  { value: "", label: "Select Department" },
  { value: "oracle-development", label: "Oracle Development" },
  { value: "supply-chain", label: "Supply Chain Solutions" },
  { value: "logistics", label: "Logistics Management" },
  { value: "consulting", label: "Oracle Consulting" },
  { value: "project-management", label: "Project Management" },
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (3-5 years)" },
  { value: "senior", label: "Senior Level (6-10 years)" },
  { value: "expert", label: "Expert Level (10+ years)" }
];

const OFFICE_LOCATIONS = [
  { value: "", label: "Select Office Location" },
  { value: "dallas", label: "Dallas, Texas" },
  { value: "jakarta", label: "Jakarta, Indonesia" },
  { value: "mumbai", label: "Mumbai, India" },
  { value: "dubai", label: "Dubai, UAE" },
  { value: "singapore", label: "Singapore" },
];

export default function FormComponent() {
  // Initialize ALL fields as empty strings to avoid undefined issues
  const [formData, setFormData] = useState<FormData>({
    text: "",
    email: "",
    password: "",
    confirmPassword: "",
    textarea: "",
    select: "",
    radio: "",
    checkbox: false,
    date: "",
    number: "",
    file: null,
    range: "50",
    color: "#20305F",
    url: "",
    tel: "",
    search: "",
    time: "",
    datetime: "",
    department: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>({
    isSubmitting: false,
    isSubmitted: false,
    submitError: null,
    submitSuccess: false,
  });

  const formRef = useRef<HTMLFormElement>(null);

  // SIMPLE onChange handler - ONLY updates state, nothing else
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else if (type === "file") {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.files?.[0] || null }));
    } else {
      // CRITICAL: Just update the state, no validation or other logic
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear any existing error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const { [name]: removedError, ...rest } = prev;
        return rest;
      });
    }
  };

  // Simple validation function (only called on submit)
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.text.trim()) newErrors.text = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!formData.department) newErrors.department = "Select department";
    if (!formData.radio) newErrors.radio = "Select experience level";
    if (!formData.checkbox) newErrors.checkbox = "Accept terms";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(prev => ({ ...prev, isSubmitting: true, submitError: null }));

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      setStatus(prev => ({ ...prev, isSubmitting: false }));
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Form submitted:", formData);
      setStatus(prev => ({ ...prev, isSubmitting: false, isSubmitted: true, submitSuccess: true }));
      setTimeout(() => resetForm(), 3000);
    } catch (error) {
      setStatus(prev => ({ ...prev, isSubmitting: false, submitError: "Submission failed" }));
    }
  };

  const resetForm = () => {
    setFormData({
      text: "",
      email: "",
      password: "",
      confirmPassword: "",
      textarea: "",
      select: "",
      radio: "",
      checkbox: false,
      date: "",
      number: "",
      file: null,
      range: "50",
      color: "#20305F",
      url: "",
      tel: "",
      search: "",
      time: "",
      datetime: "",
      department: "",
    });
    setErrors({});
    setStatus({ isSubmitting: false, isSubmitted: false, submitError: null, submitSuccess: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 lg:p-12"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-secondary font-bold text-gray-900 dark:text-white">
            Join Intellinum Team
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Apply to join our global Oracle expertise network
          </p>
        </div>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full"></div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {status.submitSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
          >
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-800 dark:text-green-200 font-medium">
                Application submitted successfully! We'll contact you soon.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {status.submitError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-800 dark:text-red-200 font-medium">
                  {status.submitError}
                </p>
              </div>
              <button
                onClick={() => setStatus(prev => ({ ...prev, submitError: null }))}
                className="text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Personal Information
          </h3>
        </div>

        <InputForm
          label="Full Name"
          name="text"
          value={formData.text}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          required
          error={errors.text}
        />

        <InputForm
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="john.doe@example.com"
          required
          error={errors.email}
        />

        <InputForm
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          required
          error={errors.password}
        />

        <InputForm
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
          required
          error={errors.confirmPassword}
        />

        <InputForm
          label="Phone Number"
          type="tel"
          name="tel"
          value={formData.tel}
          onChange={handleInputChange}
          placeholder="+1 (555) 123-4567"
        />

        {/* Using DatepickerForm component */}
        <DatepickerForm
          label="Date of Birth"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          error={errors.date}
        />

        {/* Professional Information Section */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Professional Information
          </h3>
        </div>

        <SelectForm
          label="Preferred Department"
          name="department"
          options={DEPARTMENTS}
          value={formData.department}
          onChange={handleInputChange}
          required
          error={errors.department}
          placeholder="Choose a department..."
        />

        <SelectForm
          label="Preferred Office Location"
          name="select"
          options={OFFICE_LOCATIONS}
          value={formData.select}
          onChange={handleInputChange}
          placeholder="Choose an office..."
        />

        {/* Using InputArea component instead of InputForm with textarea */}
        <InputArea
          label="Professional Summary"
          name="textarea"
          value={formData.textarea}
          onChange={handleInputChange}
          placeholder="Tell us about your Oracle and supply chain experience..."
          rows={5}
          className="md:col-span-2"
          error={errors.textarea}
        />

        {/* Experience Level Radio Buttons */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Experience Level <span className="text-tertiary-500">*</span>
          </label>
          <div className="space-y-3">
            {EXPERIENCE_LEVELS.map((option) => (
              <label key={option.value} className="flex items-center group cursor-pointer">
                <input
                  type="radio"
                  name="radio"
                  value={option.value}
                  checked={formData.radio === option.value}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors cursor-pointer">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          {errors.radio && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
              <ExclamationCircleIcon className="w-4 h-4 mr-1" />
              {errors.radio}
            </p>
          )}
        </div>

        {/* Using InputFileForm component */}
        <InputFileForm
          label="Resume/CV Upload"
          name="file"
          onChange={handleInputChange}
          accept=".pdf,.doc,.docx"
          error={errors.file}
        />

        {/* Salary Range */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Salary Expectation: ${formData.range}K
          </label>
          <input
            type="range"
            name="range"
            min="30"
            max="200"
            value={formData.range}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>$30K</span>
            <span>$200K+</span>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-start">
            <input
              type="checkbox"
              name="checkbox"
              id="terms-checkbox"
              checked={formData.checkbox}
              onChange={handleInputChange}
              className={`h-6 w-6 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded mt-1 cursor-pointer ${
                errors.checkbox ? "border-red-500" : ""
              }`}
            />
            <div className="ml-4">
              <label htmlFor="terms-checkbox" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed">
                I agree to Intellinum's{" "}
                <a href="#" className="text-primary-600 hover:text-primary-500 font-medium underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary-600 hover:text-primary-500 font-medium underline">
                  Privacy Policy
                </a>
                , and consent to be contacted regarding Oracle opportunities.
              </label>
            </div>
          </div>
          {errors.checkbox && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
              <ExclamationCircleIcon className="w-4 h-4 mr-1" />
              {errors.checkbox}
            </p>
          )}
        </div>

        {/* Submit Buttons - Updated to use ButtonForm */}
        <div className="md:col-span-2 pt-6 flex flex-col sm:flex-row gap-4">
          <ButtonForm
            type="submit"
            variant="primary"
            size="lg"
            disabled={status.isSubmitting}
            loading={status.isSubmitting}
            loadingText="Submitting..."
            className="w-full sm:w-auto"
          >
            Submit Application
          </ButtonForm>

          <ButtonForm
            type="button"
            variant="outline"
            size="lg"
            disabled={status.isSubmitting}
            onClick={resetForm}
            className="w-full sm:w-auto"
          >
            Reset Form
          </ButtonForm>
        </div>
      </form>
    </motion.div>
  );
}
