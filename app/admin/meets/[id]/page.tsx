"use client"

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function MeetAnalyticsPage() {
  const [meet, setMeet] = useState(null);
  const [loading, setLoading] = useState(true);
//   const searchParams = useSearchParams();
 const id =useParams().id
 console.log("id"+id)

  useEffect(() => {
    const fetchMeetDetails = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:5000/api/users/getmeets/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch meet details');
        }
        const data = await response.json();
        console.log(data)
        setMeet(data);
      } catch (error) {
        console.error('Error fetching meet details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center text-2xl mt-10 text-white">Loading...</div>;
  }

  if (!meet) {
    return <div className="text-center text-2xl mt-10 text-white">Meet not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{meet.meet_team_type} Meet Analytics</h1>
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Meet Details</h2>
            <p><strong>Date:</strong> {new Date(meet.meet_date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {meet.meet_time}</p>
            <p><strong>Venue:</strong> {meet.meet_venue}</p>
            <p><strong>Mode:</strong> {meet.meet_mode}</p>
            <p><strong>Status:</strong> {meet.meet_active_status ? 'Active' : 'Inactive'}</p>
            <p className="mt-4"><strong>Description:</strong> {meet.meet_description}</p>
            <div className="mt-4">
              <strong>Essentials:</strong>
              <ul className="list-disc list-inside">
                {meet.meet_essentials.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">QR Code</h2>
            <div className="bg-white p-4 rounded-lg inline-block">
              <Image
                src={meet.meet_qr_code}
                alt="Meet QR Code"
                width={200}
                height={200}
              />
            </div>
            <p className="mt-4 text-sm">Scan this QR code to verify student attendance</p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
          {/* Add your analytics components here */}
          <p>Implement your analytics visualizations and data here.</p>
        </div>
      </div>
    </div>
  );
}
