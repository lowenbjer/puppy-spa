import CalendarSelector from './CalendarSelector';
import PuppySearch from './PuppySearch';
import { Puppy } from '../hooks/usePuppyWaitingList';

interface HeaderProps {
  currentDate: string;
  availableDates: string[];
  onSwitchDate: (date: string) => void;
  onSearch: (query: string) => Promise<Puppy[]>;
}

export default function Header({
  currentDate,
  availableDates,
  onSwitchDate,
  onSearch
}: HeaderProps) {
  return (
    <header className="bg-white text-black py-4 px-6 md:px-8 shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center">
            <div className="mr-4">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-black flex items-center">
                <span className="mr-2">🐶</span> Puppy Spa
              </h1>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <CalendarSelector 
              currentDate={currentDate}
              availableDates={availableDates}
              onSelectDate={onSwitchDate}
            />
            <PuppySearch onSearch={onSearch} />
          </div>
        </div>
      </div>
    </header>
  );
} 