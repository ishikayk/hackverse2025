import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChevronRight } from '@tabler/icons-react';

const StartNew: React.FC = () => {
  const navigate = useNavigate();

  // State to store form data
  const [topic, setTopic] = useState<string>('');
  const [timeCommitment, setTimeCommitment] = useState<number | ''>('');
  const [studyDays, setStudyDays] = useState<number | ''>('');
  const [studyTime, setStudyTime] = useState<string>('');

  const learningStyleOptions: string[] = [
    'Video tutorials',
    'Written articles',
    'Hands-on projects',
    'Interactive exercises',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data to send to the API
    const formData = {
      topic,
      timeCommitment,
      studyDays,
      studyTime,
    };

    try {
      // Send the data to the API
      const response = await fetch('http://localhost:8080/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      navigate('/roadmap', { state: { responseData: data } });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl w-full my-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Let's Personalize Your Learning Journey
      </h2>
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Topic Input */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            What would you like to learn?
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g., Machine Learning, Web Development"
            required
          />
        </div>

        {/* Skill Level Dropdown */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Your current skill level
          </label>
          <select
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          >
            <option>Intermediate</option>
            <option>Beginner</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Weekly Time Commitment */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Weekly time commitment (hours)
          </label>
          <input
            type="number"
            value={timeCommitment}
            onChange={(e) => setTimeCommitment(Number(e.target.value))}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g., 10"
            required
          />
        </div>

        {/* Study Days */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            How many days can you study per week?
          </label>
          <input
            type="number"
            value={studyDays}
            onChange={(e) => setStudyDays(Number(e.target.value))}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g., 5"
            required
          />
        </div>

        {/* Study Time */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            At what time can you study everyday?
          </label>
          <input
            type="time"
            value={studyTime}
            onChange={(e) => setStudyTime(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Preferred Learning Styles */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Preferred learning style
          </label>
          <div className="space-y-3">
            {learningStyleOptions.map((style) => (
              <label
                key={style}
                className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500 size-4"
                />
                <span className="text-gray-700">{style}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span className="text-lg">Generate My Learning Path</span>
          <IconChevronRight size={24} />
        </button>
      </form>
    </div>
  );
};

export default StartNew;