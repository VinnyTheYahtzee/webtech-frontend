import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
  equipment: string;
}

interface WorkoutPlan {
  id?: number;
  name: string;
  exercises: { exercise: Exercise; sets: number; reps: number; rest: number }[];
}

const WorkoutPlan: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [customPlan, setCustomPlan] = useState<WorkoutPlan>({ name: '', exercises: [] });
  const [autoPlan, setAutoPlan] = useState<WorkoutPlan | null>(null);
  const [experience, setExperience] = useState('Beginner');
  const [goal, setGoal] = useState('Muskelaufbau');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found! User may not be logged in.');
      return {};
    }
    return { Authorization: `Token ${token}` };
  };

  const fetchExercises = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKENDURL}/api/exercises/`, {
        headers: getAuthHeaders(),
      });

      // ✅ Ensure the response is an array, else default to []
      if (Array.isArray(response.data)) {
        setExercises(response.data);
      } else {
        console.error("Unexpected API response:", response.data);
        setExercises([]); // Prevents errors if data format is incorrect
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setExercises([]); // Prevents crash on request failure
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleAddExercise = (exercise: Exercise) => {
    setCustomPlan((prevPlan) => ({
      ...prevPlan,
      exercises: [...prevPlan.exercises, { exercise, sets: 3, reps: 10, rest: 60 }],
    }));
  };

  const generatePlan = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/api/workout_plans/generate/`,
        { experience, goal },
        { headers: getAuthHeaders() }
      );
  
      console.log("Generated Plan Response:", response.data); // ✅ Debug response
  
      if (response.data && typeof response.data === 'object') {
        if (!response.data.exercises) {
          console.warn("⚠️ Warning: 'exercises' is missing in response!", response.data);
        }
        setAutoPlan(response.data);
      } else {
        console.error("Invalid response format:", response.data);
        setAutoPlan(null);
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      setAutoPlan(null);
    }
  };
  

  const saveCustomPlan = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKENDURL}/api/workout_plans/`, customPlan, {
        headers: getAuthHeaders(),
      });
      alert('Eigener Plan gespeichert!');
    } catch (error) {
      console.error('Error saving custom plan:', error);
    }
  };

  return (
    <div className="workout-plan-container">
      <h2>Trainingspläne</h2>
      <div className="plan-options">
        <div className="auto-plan">
          <h3>Trainingsplan Generieren</h3>
          <label>
            Trainingserfahrung:
            <select value={experience} onChange={(e) => setExperience(e.target.value)}>
              <option>Beginner</option>
              <option>Fortgeschritten</option>
            </select>
          </label>
          <label>
            Ziel:
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option>Muskelaufbau</option>
              <option>Fettverlust</option>
              <option>Stärke</option>
            </select>
          </label>
          <button onClick={generatePlan}>Plan generieren</button>
          {autoPlan && (
            <div className="plan-display">
              <h4>{autoPlan.name}</h4>
              <ul>
                {autoPlan.exercises.map((ex, index) => (
                  <li key={index}>
                    {ex.exercise.name} - {ex.sets}x{ex.reps}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="custom-plan">
          <h3>Eigenen Plan erstellen</h3>
          <input
            type="text"
            placeholder="Name des Plans"
            value={customPlan.name}
            onChange={(e) => setCustomPlan({ ...customPlan, name: e.target.value })}
          />
          <h4>Verfügbare Übungen</h4>
          <ul>
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <li key={exercise.id}>
                  {exercise.name} ({exercise.muscle_group})
                  <button onClick={() => handleAddExercise(exercise)}>Add</button>
                </li>
              ))
            ) : (
              <p>Keine Übungen verfügbar.</p>
            )}
          </ul>
          <h4>Ausgewählte Übungen</h4>
          <ul>
            {customPlan.exercises.map((ex, index) => (
              <li key={index}>
                {ex.exercise.name} - {ex.sets} sets, {ex.reps} reps
              </li>
            ))}
          </ul>
          <button onClick={saveCustomPlan}>Plan speichern</button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlan;
