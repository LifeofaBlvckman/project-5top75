import { LightbulbIcon, ClockIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Natural Language Input',
    description: 'Describe your work trip in plain text, just like you would tell a colleague. Our AI understands your context.',
    icon: LightbulbIcon,
  },
  {
    name: 'Instant Data Extraction',
    description: 'The system instantly identifies and structures essential details: trip name, times, earnings, and notes.',
    icon: ClockIcon,
  },
  {
    name: 'Save Time & Stay Organized',
    description: 'Eliminate tedious manual data entry. Keep accurate, structured records with minimal effort, freeing up your time.',
    icon: ClipboardDocumentListIcon,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          How Trip Log AI Works for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature) => (
            <div key={feature.name} className="text-center bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 text-blue-600">
                <feature.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.name}</h3>
              <p className="text-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}