import React from 'react';
import TournamentHeader from '../components/tournaments/TournamentHeader';
import TournamentStats from '../components/tournaments/TournamentStats';
import CompetitorRecords from '../components/tournaments/CompetitorRecords';
import UpcomingTournaments from '../components/tournaments/UpcomingTournaments';

const TournamentRecords = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <TournamentHeader />
        <TournamentStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <CompetitorRecords />
          </div>
          <div>
            <UpcomingTournaments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentRecords;