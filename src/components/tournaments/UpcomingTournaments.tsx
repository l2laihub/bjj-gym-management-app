import React from 'react';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';

const tournaments = [
  {
    id: 1,
    name: 'State Championship 2024',
    date: '2024-04-15',
    location: 'Sports Complex, Downtown',
    registeredMembers: 8,
    registrationDeadline: '2024-04-01',
    level: 'Advanced',
  },
  {
    id: 2,
    name: 'Regional Open Tournament',
    date: '2024-05-02',
    location: 'Community Center',
    registeredMembers: 5,
    registrationDeadline: '2024-04-15',
    level: 'All Levels',
  },
  {
    id: 3,
    name: 'National Pro Championship',
    date: '2024-06-10',
    location: 'Convention Center',
    registeredMembers: 3,
    registrationDeadline: '2024-05-20',
    level: 'Professional',
  },
];

const UpcomingTournaments = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Upcoming Tournaments</h2>
      <div className="space-y-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900">{tournament.name}</h3>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                {tournament.level}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(tournament.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {tournament.location}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {tournament.registeredMembers} members registered
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <div className="text-sm">
                <span className="text-gray-500">Registration closes: </span>
                <span className="font-medium">
                  {new Date(tournament.registrationDeadline).toLocaleDateString()}
                </span>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
                Details
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Register for Tournament
        </button>
      </div>
    </div>
  );
};

export default UpcomingTournaments;