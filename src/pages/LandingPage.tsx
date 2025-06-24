import React from 'react';

const LandingPage: React.FC = () => {
  const features = [
    { name: 'Dashboard', description: 'Key gym metrics at a glance.', icon: '📊' },
    { name: 'Member Management', description: 'Track and manage members effortlessly.', icon: '👥' },
    { name: 'Attendance Tracking', description: 'Monitor class attendance in real-time.', icon: '📅' },
    { name: 'Curriculum Management', description: 'Organize techniques and promotions.', icon: '🥋' },
    { name: 'Financial Management', description: 'Handle finances and transactions seamlessly.', icon: '💰' },
    { name: 'Inventory Management', description: 'Track gym equipment and merchandise.', icon: '📦' },
  ];

  const testimonials = [
    {
      quote: "This app has revolutionized how we manage our gym. Everything is streamlined and easy to use!",
      name: "John Doe",
      title: "Owner, Gracie Barra Academy"
    },
    {
      quote: "The best gym management software I've ever used. My members love the new portal.",
      name: "Jane Smith",
      title: "Manager, 10th Planet Jiu-Jitsu"
    }
  ];

  return (
    <div className="bg-gray-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">RollFlow</h1>
        <nav>
          <a href="/signin" className="text-lg font-semibold hover:text-indigo-400 transition">Sign In</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative text-center py-20 md:py-32 px-6 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">The Black Belt of Gym Management</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">The ultimate tool to streamline your gym's operations, from member management to financial tracking.</p>
          <a href="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105">
            Start Your Free Trial
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">Why RollFlow?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature) => (
              <div key={feature.name} className="bg-gray-700 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h4 className="text-2xl font-bold mb-2">{feature.name}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">Loved by Gym Owners Worldwide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-gray-400">{testimonial.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20 text-center px-6">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Your Gym to the Next Level?</h3>
        <p className="text-lg md:text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">Join hundreds of gyms already streamlining their management with RollFlow.</p>
        <a href="/signup" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-200 transition">
          Get Started Now
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RollFlow. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;