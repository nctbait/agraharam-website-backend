import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MatrimonyRegistration() {
  return (
    <>
      <Navbar />
      <main className="px-4 lg:px-40 py-6">
        <form className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Matrimony Registration</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input placeholder="Name" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <select className="form-input h-12 rounded-xl border border-gray-300 px-4">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input placeholder="Gothram" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <select className="form-input h-12 rounded-xl border border-gray-300 px-4">
                <option>Select Vedam</option>
                <option>Rig</option>
                <option>Yajur</option>
                <option>Sama</option>
                <option>Atharva</option>
            </select>
            <select className="form-input h-12 rounded-xl border border-gray-300 px-4">
                <option>Select Marital Status</option>
                <option>Never Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
            </select>
            <input placeholder="Date of Birth" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Time of Birth" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Place of Birth" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <select className="form-input h-12 rounded-xl border border-gray-300 px-4">
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
            <select className="form-input h-12 rounded-xl border border-gray-300 px-4">
                <option value="">Select Paadam</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <select className="form-input h-12 rounded-xl border border-gray-300 px-4">
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
            <input placeholder="Height" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Occupation" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Education" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <select className="form-input h-12 rounded-xl border border-gray-300 px-4">
                <option value="">Select Immigration Status</option>
                <option value="uscitizen">U S Citizen</option>
                <option value="greencard">Green Card</option>
                <option value="h1b">H1 B Visa</option>
                <option value="l1">L1 Visa</option>
            </select>
            <input placeholder="Father's Name" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Mother's Name" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Mother's Maiden Name" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Father's Occupation" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Mother's Occupation" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Contact Phone Number" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Contact Email" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Current Location" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Willing to Relocate after Marriage?" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <input placeholder="Few words about yourself" className="form-input h-12 rounded-xl border border-gray-300 px-4" />
            <select className="form-input h-12 rounded-xl border border-gray-300 px-4">
                <option value="">Display Image Option</option>
                <option value="kalyanam">Kalyanam Group</option>
                <option value="private">Private</option>
            </select>
          </div>

          <div className="flex flex-col items-center gap-4 border-2 border-dashed border-gray-300 px-4 py-10 my-6 rounded-xl">
            <p className="text-lg font-bold">Upload Profile Picture</p>
            <p className="text-sm text-gray-500 text-center">Click to upload or drag and drop</p>
            <button type="button" className="rounded-xl h-10 px-4 bg-gray-100 text-black text-sm font-bold">Upload</button>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="rounded-xl h-10 px-6 bg-[#dce7f3] text-black text-sm font-bold">Submit</button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}