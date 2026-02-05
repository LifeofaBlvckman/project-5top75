import React, { useState } from 'react';

export default function MvpPage() {
  const [tripDescription, setTripDescription] = useState('');
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTripDetails(null);

    try {
      const response = await fetch('/api/mvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tripDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process trip description.');
      }

      const data = await response.json();
      setTripDetails(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Trip Log AI</h1>
        <p className="text-center text-gray-600 mb-8">
          Quickly log work trip details by describing your trip in plain text.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="tripDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your trip:
            </label>
            <textarea
              id="tripDescription"
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-y min-h-[100px]"
              rows="4"
              value={tripDescription}
              onChange={(e) => setTripDescription(e.target.value)}
              placeholder="e.g., Drove from home to client A for a meeting from 9 AM to 10:30 AM, then to client B until 1 PM. Earned $150. Parking fee was $10."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading || !tripDescription.trim()}
          >
            {loading ? 'Processing...' : 'Log Trip'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {tripDetails && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Extracted Trip Details:</h2>
            <dl className="space-y-2 text-gray-700">
              <div>
                <dt className="font-medium inline-block w-32">Trip Name:</dt>
                <dd className="inline-block">{tripDetails.tripName || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium inline-block w-32">Start Time:</dt>
                <dd className="inline-block">{tripDetails.startTime || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium inline-block w-32">End Time:</dt>
                <dd className="inline-block">{tripDetails.endTime || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium inline-block w-32">Duration:</dt>
                <dd className="inline-block">
                  {tripDetails.durationMinutes !== null && tripDetails.durationMinutes !== undefined
                    ? `${tripDetails.durationMinutes} minutes`
                    : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="font-medium inline-block w-32">Earnings:</dt>
                <dd className="inline-block">
                  {tripDetails.earningsAmount !== null && tripDetails.earningsAmount !== undefined
                    ? `${tripDetails.earningsCurrency || ''} ${tripDetails.earningsAmount.toFixed(2)}`
                    : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="font-medium inline-block w-32">Notes:</dt>
                <dd className="inline-block">{tripDetails.notes || 'No additional notes.'}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
