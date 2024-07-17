'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaPaperclip, FaUsers, FaHeart, FaCogs, FaPlane, FaRocket, FaQuestion, FaArrowLeft, FaArrowRight, FaStar, FaBrain } from 'react-icons/fa';

const InductionForm = () => {
  const params = useParams();
  const id = params.id;
  
  const [formData, setFormData] = useState({
    uid: '',
    name: '',
    email: '',
    rollNumber: '',
    branch: '',
    year: '',
    phoneNumber: '',
    answers: [],
    queries: '',
    ppt: '',
    team_preference: '',
    hobbies: '',
    skills: '',
    experience: '',
    expectations: ''
  });
  const [induction, setInduction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const storedId = localStorage.getItem('_id');
    setFormData(prev => ({ ...prev, uid: storedId }));
  
    if (id) {
      fetchInductionDetails();
    }
  }, [id]);
  
  const fetchInductionDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/getinduction/${id}`);
      if (!response.ok) throw new Error('Failed to fetch induction details');
      const data = await response.json();
      setInduction(data);
      setFormData(prev => ({
        ...prev,
        answers: data.questions.map(q => ({ question: q.question, answer: '' }))
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching induction details:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'answer') {
      const newAnswers = [...formData.answers];
      newAnswers[index] = { ...newAnswers[index], answer: value };
      setFormData(prev => ({ ...prev, answers: newAnswers }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the access token from cookies (assuming it's stored under 'accessToken')
      const accessToken = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
      console.log(accessToken)
  
      const response = await fetch(`http://localhost:5000/api/users/register/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` // Include the access token in the Authorization header
        },
        body: JSON.stringify({ ...formData, In_id: id }),
      });
  
      if (!response.ok) throw new Error('Failed to submit form');
  
      // alert('Application submitted successfully!');
      // window.location.href = '/';
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit application. Please try again.');
    }
  };
  

  const nextStage = () => {
    setCurrentStage(prev => Math.min(prev + 1, 2));
  };

  const prevStage = () => {
    setCurrentStage(prev => Math.max(prev - 1, 0));
  };

  const handleNext = (e) => {
    e.preventDefault();
    nextStage();
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    prevStage();
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (!induction) return <div className="text-center text-2xl mt-28 text-gray-200">Induction not found</div>;

  const renderStage = () => {
    switch(currentStage) {
      case 0:
        return (
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center">
              <FaRocket className="mr-2 text-yellow-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="rollNumber"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="year"
                placeholder="Year of Study"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
              <FaBrain className="mr-2 " />
              Aeromodelling Questionnaire
            </h2>
            {formData.answers.map((answer, index) => (
              <div key={index} className="space-y-2 mb-6">
                <label className="block text-gray-300 font-semibold">{answer.question}</label>
                <textarea
                  className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  name="answer"
                  value={answer.answer}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                ></textarea>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 flex items-center">
              <FaCogs className="mr-2 text-purple-500" />
              Additional Information
            </h2>
            <div className="space-y-6">
              <textarea
                name="queries"
                placeholder="Any queries?"
                value={formData.queries}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              ></textarea>
              <input
                type="text"
                name="ppt"
                placeholder="PPT link (if any)"
                value={formData.ppt}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                name="team_preference"
                placeholder="Team Preference"
                value={formData.team_preference}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                name="hobbies"
                placeholder="Hobbies"
                value={formData.hobbies}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              ></textarea>
              <textarea
                name="skills"
                placeholder="Skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              ></textarea>
              <textarea
                name="experience"
                placeholder="Relevant Experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              ></textarea>
              <textarea
                name="expectations"
                placeholder="Expectations from the club"
                value={formData.expectations}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              ></textarea>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="clouds"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
        <FaPlane className="text-6xl text-blue-500 mx-auto mb-4" />
        <h1 className='text-4xl monoton md:text-6xl  text-white mb-2'>Aeromodeling&nbsp;&nbsp; Club</h1>
        <h3 className='text-xl monoton md:text-4xl text-gray-300'>Induction &nbsp;&nbsp; Sessions</h3>
        <h2 className='text-2xl monoton md:text-3xl  text-blue-400 mb-8'>NIT&nbsp;&nbsp; Kurukshetra</h2>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-blue-500">
          <div className="p-8">
            <h1 className="text-4xl  monoton text-blue-400 mb-2 flex items-center">
              {induction.I_name}
            </h1>
            <p className="text-orange-600 text-l mb-8">Soar to New Heights with NIT Kurukshetra!</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {renderStage()}
              
              <div className="flex justify-between">
                {currentStage > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="bg-gray-700 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center"
                  >
                    <FaArrowLeft className="mr-2" />
                    Previous
                  </button>
                )}
                {currentStage < 2 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center ml-auto"
                  >
                    Next
                    <FaArrowRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center ml-auto"
                  >
                    <FaPlane className="mr-2" />
                    Submit Application
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center">
          {[0, 1, 2].map((stage) => (
            <div
              key={stage}
              className={`w-4 h-4 rounded-full mx-2 ${
                currentStage >= stage ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InductionForm;