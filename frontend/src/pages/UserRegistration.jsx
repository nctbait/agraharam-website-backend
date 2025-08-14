import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';


export default function UserRegistration() {
  const [statusMessage, setStatusMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    gothram: '',
    vedam: '',
    phone: '',
    email: '',
    password: '',
    maritalStatus: 'Married',
    spouseFirstName: '',
    spouseLastName: '',
    spouseGender: '',
    spouseEmail: '',
    spousePhone: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zip: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'maritalStatus' && value) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.maritalStatus;
        return newErrors;
      });
    }
  };

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.email && form.email === form.spouseEmail) {
      setFieldErrors({
        email: "Primary and spouse emails must be different.",
        spouseEmail: "Spouse email must be different from your email."
      });
      return;
    }
    if (!form.maritalStatus) return setFieldErrors({maritalStatus:"Please select marital status"});
    try {
      await axios.post(`${API_BASE}/api/register`, form);
      setStatusMessage("Registration submitted.");
      setFieldErrors({});
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.field) {
        setFieldErrors({ [err.response.data.field]: err.response.data.message });
      } else {
        setStatusMessage("Something went wrong.");
      }
    }
  };


  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-6">
        <form className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow gap-4" onSubmit={handleSubmit}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">User Registration</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Member Details */}
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <select name="gender" value={form.gender} onChange={handleChange} className="form-input h-12 rounded-xl border border-gray-300 px-4">
              <option value="">Select your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input name="gothram" value={form.gothram} onChange={handleChange} placeholder="Gothram" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <select name="vedam" value={form.vedam} onChange={handleChange} className="form-input h-12 rounded-xl border border-gray-300 px-4">
              <option value="">Select Vedam</option>
              <option value="Rig">Rig</option>
              <option value="Yajur">Yajur</option>
              <option value="Sama">Sama</option>
              <option value="Atharva">Atharva</option>
            </select>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className={`form-input h-12 rounded-xl border px-4 ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`} />
            {fieldErrors.email && <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>}

            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password (min 15 chars)" minLength={15} className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <select
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              className={`form-input h-12 rounded-xl border border-gray-300 px-4"
              ${fieldErrors.maritalStatus ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Divorced">Divorced</option>
              <option value="Separated">Separated</option>
            </select>
            {fieldErrors.maritalStatus && <p className="text-sm text-red-600 mt-1">{fieldErrors.maritalStatus}</p>}
            {/* Spouse Details */}
            {form.maritalStatus === 'Married' && (
              <>
                <input name="spouseFirstName" value={form.spouseFirstName} onChange={handleChange} placeholder="Spouse First Name" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
                <input name="spouseLastName" value={form.spouseLastName} onChange={handleChange} placeholder="Spouse Last Name" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
                <select name="spouseGender" value={form.spouseGender} onChange={handleChange} className="form-input h-12 rounded-xl border border-gray-300 px-4">
                  <option value="">Select your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input type="email" name="spouseEmail" value={form.spouseEmail} onChange={handleChange} placeholder="Spouse Email" className={`form-input h-12 rounded-xl border px-4 ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`} />
                {fieldErrors.spouseEmail && <p className="text-sm text-red-600 mt-1">{fieldErrors.spouseEmail}</p>}
                <input type="tel" name="spousePhone" value={form.spousePhone} onChange={handleChange} placeholder="Spouse Phone Number" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
              </>
            )}
            {/* Home Address */}
            <input name="street" value={form.street} onChange={handleChange} placeholder="Street of Residence" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input name="city" value={form.city} onChange={handleChange} placeholder="City of Residence" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input name="state" value={form.state} onChange={handleChange} placeholder="State of Residence" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input name="country" value={form.country} onChange={handleChange} placeholder="Country of Residence" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input name="zip" value={form.zip} onChange={handleChange} placeholder="Zip Code" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
          </div>

          <div className="flex justify-end mt-6">
            <button type="submit" className="rounded-xl h-10 px-6 bg-blue-600 text-white text-sm font-bold">Submit</button>
          </div>
        </form>

        {statusMessage && (
          <div className="mt-4 text-center text-green-600 font-semibold">
            {statusMessage}
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}
