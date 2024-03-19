import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import './CalendarStyles.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarView() {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="Sample">
      <div className="Sample__container">
        <main className="Sample__container__content">
          <Calendar onChange={onChange} value={value} />
        </main>
      </div>
    </div>
  );
}

// https://github.com/wojtekmaj/react-calendar/wiki/Recipes