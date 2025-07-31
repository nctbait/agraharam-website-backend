import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/authAxios';

export default function MatrimonyRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    gothram: '',
    vedam: '',
    maritalStatus: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    nakshatram: '',
    paadam: '',
    raasi: '',
    height: '',
    occupation: '',
    education: '',
    immigrationStatus: '',
    fatherName: '',
    motherName: '',
    motherMaidenName: '',
    fatherOccupation: '',
    motherOccupation: '',
    contactPhone: '',
    contactEmail: '',
    currentLocation: '',
    willingToRelocate: '',
    about: '',
    imageDisplayPreference: '',
    profilePictureUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/api/matrimony/register', formData);
      alert('Profile submitted successfully! Await admin approval.');
      setFormData({ /* clear or reset fields */ });
    } catch (error) {
      alert('Error submitting profile. Please try again.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    try {
      const imageUrl = await api.uploadFile('/api/matrimony/upload-image', file);
      setFormData(prev => ({ ...prev, profilePictureUrl: imageUrl }));
    } catch (error) {
      alert('Failed to upload image');
      console.error(error);
    }
  };
  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-6">
        <form className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Matrimony Registration</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name" className="form-input h-12 rounded-xl border border-gray-300 px-4"
            />

            <select name="gender" value={formData.gender} onChange={handleChange}
              className="form-input h-12 rounded-xl border border-gray-300 px-4">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input name="gothram" value={formData.gothram} onChange={handleChange}
              placeholder="Gothram" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <select name="vedam" value={formData.vedam} onChange={handleChange}
              className="form-input h-12 rounded-xl border border-gray-300 px-4">
              <option>Select Vedam</option>
              <option>Rig</option>
              <option>Yajur</option>
              <option>Sama</option>
              <option>Atharva</option>
            </select>
            <div>
              <label>
                <span className="text-[#111418] text-base font-medium">Date of Birth </span>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                  placeholder="Date of Birth" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
                  <span className="text-[#111418] text-base font-medium"> Time of Birth </span>
                  <input type="time" name="timeOfBirth" value={formData.timeOfBirth} onChange={handleChange}
              placeholder="Time of Birth" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
              </label>
            </div>

            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}
              className="form-input h-12 rounded-xl border border-gray-300 px-4">
              <option>Select Marital Status</option>
              <option>Never Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
            </select>

            <input name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange}
              placeholder="Place of Birth" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <select name="nakshatram" value={formData.nakshatram} onChange={handleChange}
              className="form-input h-12 rounded-xl border border-gray-300 px-4">
              <option value="">Select Nakshatram</option>
              <option value="ashwani">Ashwani</option>
              <option value="bharani">Bharani</option>
              <option value="rohini">Rohini</option>
              <option value="mrigasira">Mrigasira</option>
              <option value="ardra">Ardra</option>
              <option value="punarvasu">Punarvasu</option>
              <option value="pushyami">Pushyami</option>
              <option value="ashlesha">Ashlesha</option>
              <option value="makha">Makha</option>
              <option value="pubba">Pubba/Purva Phalguni</option>
              <option value="uttara">Uttara/Uttara Phalguni</option>
              <option value="hasta">Hasta</option>
              <option value="chitha">Chitha</option>
              <option value="swathi">swathi</option>
              <option value="vishaka">Vishaka</option>
              <option value="anuradha">Anuradha</option>
              <option value="jyeshtha">Jyeshtha</option>
              <option value="mula">Mula</option>
              <option value="purvaashadha">Purva Ashadha</option>
              <option value="uttaraashadha">Uttara Ashadha</option>
              <option value="shravana">Shravana</option>
              <option value="dhanishtha">Dhanishtha</option>
              <option value="shatabhisham">Shatabhisham</option>
              <option value="purvabhadrapada">Purva Bhadrapada</option>
              <option value="uttarabhadrapada">Uttara Bhadrapada</option>
              <option value="revathi">Revathi</option>
            </select>

            <select name="paadam" value={formData.paadam} onChange={handleChange}
              className="form-input h-12 rounded-xl border border-gray-300 px-4">
              <option value="">Select Paadam</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            <select name="raasi" value={formData.raasi} onChange={handleChange}
              className="form-input h-12 rounded-xl border border-gray-300 px-4">
              <option value="">Select Raasi</option>
              <option value="mesha">Mesha Raasi</option>
              <option value="vrishabha">Vrishabha Raasi</option>
              <option value="mithuna">Mithuna Raasi</option>
              <option value="karkatka">Karkataka Raasi</option>
              <option value="simha">Simha Raasi</option>
              <option value="kanya">Kanya Raasi</option>
              <option value="tula">Tula Raasi</option>
              <option value="vrishchika">Vrishchika Raasi</option>
              <option value="dhanu">Dhanur Raasi</option>
              <option value="makara">Makara Raasi</option>
              <option value="kumbha">Kumbha Raasi</option>
              <option value="meena">Meena Raasi</option>
            </select>

            <input name="height" value={formData.height} onChange={handleChange}
              placeholder="Height (in cm)" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <input name="occupation" value={formData.occupation} onChange={handleChange}
              placeholder="Occupation" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <input name="education" value={formData.education} onChange={handleChange}
              placeholder="Education" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <select name="immigrationStatus" value={formData.immigrationStatus} onChange={handleChange}
              className="form-input h-12 rounded-xl border border-gray-300 px-4">
              <option value="">Select Immigration Status</option>
              <option value="uscitizen">U S Citizen</option>
              <option value="greencard">Green Card</option>
              <option value="h1b">H1 B Visa</option>
              <option value="l1">L1 Visa</option>
            </select>

            <input name="fatherName" value={formData.fatherName} onChange={handleChange}
              placeholder="Father's Name" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <input name="motherName" value={formData.motherName} onChange={handleChange}
              placeholder="Mother's Name" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <input name="motherMaidenName" value={formData.motherMaidenName} onChange={handleChange}
              placeholder="Mother's Maiden Name" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <input name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange}
              placeholder="Father's Occupation" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <input name="motherOccupation" value={formData.motherOccupation} onChange={handleChange}
              placeholder="Mother's Occupation" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <input name="contactPhone" value={formData.contactPhone} onChange={handleChange}
              placeholder="Contact Phone Number" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <input name="contactEmail" value={formData.contactEmail} onChange={handleChange}
              placeholder="Contact Email" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <input name="currentLocation" value={formData.currentLocation} onChange={handleChange}
              placeholder="Current Location" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <input name="willingToRelocate" value={formData.willingToRelocate} onChange={handleChange}
              placeholder="Willing to Relocate after Marriage?" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <input name="about" value={formData.about} onChange={handleChange}
              placeholder="Few words about yourself" className="form-input h-12 rounded-xl border border-gray-300 px-4" />

            <select name="imageDisplayPreference" value={formData.imageDisplayPreference} onChange={handleChange}
              className="form-input h-12 rounded-xl border border-gray-300 px-4">
              <option value="">Display Image Option</option>
              <option value="kalyanam">Kalyanam Group</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 border border-gray-300 rounded-xl p-4 mb-6">
            <label className="font-semibold text-gray-700">Upload or Paste Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="border border-gray-300 rounded px-3 py-2"
            />

            <input
              type="text"
              name="profilePictureUrl"
              placeholder="Paste image URL here"
              value={formData.profilePictureUrl}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2"
            />

            {formData.profilePictureUrl && (
              <img
                src={formData.profilePictureUrl}
                alt="Profile Preview"
                className="h-24 rounded border self-start mt-2"
              />
            )}
          </div>



          <div className="flex justify-end">
            <button onClick={handleSubmit} className="rounded-xl h-10 px-6 bg-[#dce7f3] text-black text-sm font-bold">Submit</button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}