import { FC, useEffect, useState } from "react";

interface Note {
  date: string;
  title: string;
}

const Calendar: FC = () => {
  const [weekDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [currentDate] = useState(new Date());
  const [dates, setDates] = useState<(null | number)[]>([]);
  const [notes, setNotes] = useState<Note[]>(
    JSON.parse(localStorage.getItem("notes") || "[]")
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>("");

  useEffect(() => {
    const dCount = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();
    const d: (null | number)[] = [];
    let counter = 1;

    for (let i = 0; i < 42; i++) {
      if (i < (firstDay === 0 ? 6 : firstDay - 1)) {
        d.push(null);
      } else if (counter > dCount) {
        d.push(null);
      } else {
        d.push(counter++);
      }
    }
    setDates(d);
  }, [currentMonth]);

  const handlePrev = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNext = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const openModal = () => {
    setModalOpen(true);
    setSelectedDate(null);
    setNoteTitle("");
  };

  const handleSaveNote = () => {
    if (selectedDate && noteTitle) {
      const updatedNotes = [...notes, { date: selectedDate, title: noteTitle }];
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      setNoteTitle("");
      setModalOpen(false);
    }
  };

  const handleDeleteNote = (date: string, title: string) => {
    const updatedNotes = notes.filter(
      (note) => note.date !== date || note.title !== title
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div className="mt-20 mx-5">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            className="w-20 h-10 border flex items-center justify-center rounded cursor-pointer hover:bg-gray-200"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="w-20 h-10 border flex items-center justify-center rounded cursor-pointer hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex mt-5 border-b">
        {weekDays.map((weekDay, index) => (
          <div
            key={index}
            className="flex-1 w-1/7 text-center font-bold py-2 bg-gray-100 border-x"
          >
            {weekDay}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap mt-2">
        {dates.map((date, index) => (
          <div
            key={index}
            className={`w-1/7 text-center py-2 border-x border-y ${
              currentDate.getFullYear() === currentMonth.getFullYear() &&
              currentDate.getMonth() === currentMonth.getMonth() &&
              currentDate.getDate() === date
                ? "bg-red-400 text-white"
                : ""
            }`}
          >
            {date}
            {notes
              .filter(
                (note) =>
                  note.date ===
                  `${currentMonth.getFullYear()}-${
                    currentMonth.getMonth() + 1
                  }-${date}`
              )
              .slice(0, 3)
              .map((note, i) => (
                <div
                  key={i}
                  className="text-xs bg-gray-200 mt-1 flex items-center justify-center  "
                >
                  {note.title}
                  <button
                    onClick={() => handleDeleteNote(note.date, note.title)}
                    className="ml-2 text-red-500 text-xs"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6l-1 12H6L5 6"></path>
                      <path d="M9 9v6"></path>
                      <path d="M15 9v6"></path>
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

      <button
        onClick={openModal}
        className="mt-5 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Event
      </button>

      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded">
            <h3 className="text-xl font-bold mb-3">Add Note</h3>
            <div>
              <select
                value={selectedDate || ""}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border p-2 w-full mb-3"
              >
                <option value="" disabled>
                  Sanani tanlang
                </option>
                {dates
                  .filter((d) => d)
                  .map((d, i) => (
                    <option
                      key={i}
                      value={`${currentMonth.getFullYear()}-${
                        currentMonth.getMonth() + 1
                      }-${d}`}
                    >
                      {`${currentMonth.getFullYear()}-${
                        currentMonth.getMonth() + 1
                      }-${d}`}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Titleni kiriting"
                className="border p-2 w-full mb-3"
              />
            </div>
            <button
              onClick={handleSaveNote}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="ml-3 bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
