import React, { useEffect, useState } from 'react';
import axios from 'axios';

// ✅ Define TypeScript interfaces
interface WorkoutPlan {
  id: number;
  name: string;
  exercises: WorkoutExercise[];
}

interface WorkoutExercise {
  id: number;
  exercise_name: string;
  sets: number;
  reps: number;
  rest_time: number;
}

interface DiaryEntry {
  id: number;
  date: string;
  workout_plan: WorkoutPlan;
}

// ✅ Function to fetch diary entries separately
const fetchDiaryEntries = async (setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await axios.get(`${import.meta.env.VITE_BACKENDURL}/api/diary/`, {
      headers: { Authorization: `Token ${token}` },
    });

    // ✅ Ensure response is an array
    if (Array.isArray(response.data)) {
      setEntries(response.data);
    } else {
      console.error('API response is not an array:', response.data);
      setEntries([]); // Fallback to an empty array
    }
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    setEntries([]); // Fallback in case of an error
  }
};

const Diary: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]); // ✅ Ensure initial state is an array
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  useEffect(() => {
    fetchDiaryEntries(setEntries);
  }, []);

  const updateReps = (exerciseId: number, change: number) => {
    if (!selectedEntry) return;

    setSelectedEntry({
      ...selectedEntry,
      workout_plan: {
        ...selectedEntry.workout_plan,
        exercises: selectedEntry.workout_plan.exercises.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, reps: Math.max(1, exercise.reps + change) } : exercise
        ),
      },
    });
  };

  const updateSets = (exerciseId: number, change: number) => {
    if (!selectedEntry) return;

    setSelectedEntry({
      ...selectedEntry,
      workout_plan: {
        ...selectedEntry.workout_plan,
        exercises: selectedEntry.workout_plan.exercises.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, sets: Math.max(1, exercise.sets + change) } : exercise
        ),
      },
    });
  };

  return (
    <div className="diary-container">
      <h2>Trainingstagebuch</h2>

      <div className="calendar">
        <h3>Trainingsverlauf</h3>
        {entries.length > 0 ? ( // ✅ Prevent map() error
          <ul>
            {entries.map((entry) => (
              <li key={entry.id} onClick={() => setSelectedEntry(entry)}>
                {entry.date} - {entry.workout_plan.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>Keine Trainingspläne gefunden.</p>
        )}
      </div>

      {selectedEntry && (
        <div className="entry-details">
          <h3>{selectedEntry.workout_plan.name}</h3>
          <ul>
            {selectedEntry.workout_plan.exercises.map((exercise) => (
              <li key={exercise.id}>
                <strong>{exercise.exercise_name}</strong> <br />
                Sätze: {exercise.sets}
                <button onClick={() => updateSets(exercise.id, 1)}>+</button>
                <button onClick={() => updateSets(exercise.id, -1)}>-</button>
                <br />
                Wiederholungen: {exercise.reps}
                <button onClick={() => updateReps(exercise.id, 1)}>+</button>
                <button onClick={() => updateReps(exercise.id, -1)}>-</button>
                <br />
                Pause: {exercise.rest_time} Sekunden
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Diary;
