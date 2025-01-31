import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
  equipment: string;
}

interface WorkoutExercise {
  id?: number;
  exercise: Exercise;
  sets: number;
  reps: number;
  rest: number;
}

interface WorkoutPlan {
  id?: number;
  name: string;
  goal: string;
  experience_level: string;
  created_at?: string;
  exercises: WorkoutExercise[];
}

// Define interfaces for API responses
interface APIExercise {
  id: number;
  name: string;
  muscle_group: string;
  equipment: string;
}

interface APIWorkoutExercise {
  id: number;
  exercise: APIExercise;
  sets: number;
  reps: number;
  rest?: number;
}

interface APIWorkoutPlanResponse {
  id: number;
  name: string;
  goal: string;
  experience_level: string;
  created_at: string;
  exercises: APIWorkoutExercise[];
}

const WorkoutPlanComponent: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [customPlan, setCustomPlan] = useState<WorkoutPlan>({
    name: '',
    goal: 'Muskelaufbau', // Set default goal
    experience_level: 'Beginner', // Set default experience_level
    exercises: [],
  });
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
      const response = await axios.get<Exercise[]>(
        `${import.meta.env.VITE_BACKENDURL}/api/exercises/`,
        {
          headers: getAuthHeaders(),
        }
      );

      // ✅ Ensure the response is an array, else default to []
      if (Array.isArray(response.data)) {
        setExercises(response.data);
      } else {
        console.error('Unexpected API response:', response.data);
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
      exercises: [
        ...prevPlan.exercises,
        { exercise, sets: 3, reps: 10, rest: 60 },
      ],
    }));
  };

  const handleRemoveExercise = (index: number) => {
    setCustomPlan((prevPlan) => ({
      ...prevPlan,
      exercises: prevPlan.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleExerciseChange = (index: number, field: 'sets' | 'reps' | 'rest', value: number) => {
    setCustomPlan((prevPlan) => {
      const updatedExercises = [...prevPlan.exercises];
      updatedExercises[index] = { ...updatedExercises[index], [field]: value };
      return { ...prevPlan, exercises: updatedExercises };
    });
  };

  const generatePlan = async () => {
    try {
      const response = await axios.post<APIWorkoutPlanResponse>(
        `${import.meta.env.VITE_BACKENDURL}/api/workout_plans/generate/`,
        { experience_level: experience, goal },
        { headers: getAuthHeaders() }
      );

      console.log('Generated Plan Response:', response.data); // ✅ Debug response

      if (response.data && typeof response.data === 'object') {
        // Directly use the serialized data as it matches the WorkoutPlan interface
        const transformedPlan: WorkoutPlan = {
          id: response.data.id,
          name: response.data.name,
          goal: response.data.goal,
          experience_level: response.data.experience_level,
          created_at: response.data.created_at,
          exercises: response.data.exercises.map((ex: APIWorkoutExercise) => ({
            id: ex.id,
            exercise: ex.exercise, // Directly assign the exercise object
            sets: ex.sets,
            reps: ex.reps,
            rest: ex.rest || 60, // Default rest if not provided
          })),
        };

        if (!transformedPlan.exercises.length) {
          console.warn("⚠️ Warning: 'exercises' is missing or empty in response!", response.data);
        }

        setAutoPlan(transformedPlan);
      } else {
        console.error('Invalid response format:', response.data);
        setAutoPlan(null);
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      setAutoPlan(null);
    }
  };

  const saveCustomPlan = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKENDURL}/api/workout_plans/`, customPlan, {
        headers: getAuthHeaders(),
      });
      alert('Eigener Plan gespeichert!');
      // Optionally, reset the custom plan
      setCustomPlan({
        name: '',
        goal: 'Muskelaufbau',
        experience_level: 'Beginner',
        exercises: [],
      });
    } catch (error) {
      console.error('Error saving custom plan:', error);
      alert('Fehler beim Speichern des Plans.');
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
              <option value="Beginner">Beginner</option>
              <option value="Fortgeschritten">Fortgeschritten</option>
            </select>
          </label>
          <label>
            Ziel:
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="Muskelaufbau">Muskelaufbau</option>
              <option value="Fettverlust">Fettverlust</option>
              <option value="Stärke">Stärke</option>
            </select>
          </label>
          <button onClick={generatePlan}>Plan generieren</button>
          {autoPlan && (
            <div className="plan-display">
              <h4>{autoPlan.name}</h4>
              <ul>
                {autoPlan.exercises.map((ex) => (
                  <li key={ex.id}>
                    {ex.exercise.name} - {ex.sets}x{ex.reps} (Rest: {ex.rest}s)
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
            onChange={(e) =>
              setCustomPlan({ ...customPlan, name: e.target.value })
            }
          />
          <label>
            Trainingserfahrung:
            <select
              value={customPlan.experience_level}
              onChange={(e) =>
                setCustomPlan({ ...customPlan, experience_level: e.target.value })
              }
            >
              <option value="Beginner">Beginner</option>
              <option value="Fortgeschritten">Fortgeschritten</option>
            </select>
          </label>
          <label>
            Ziel:
            <select
              value={customPlan.goal}
              onChange={(e) =>
                setCustomPlan({ ...customPlan, goal: e.target.value })
              }
            >
              <option value="Muskelaufbau">Muskelaufbau</option>
              <option value="Fettverlust">Fettverlust</option>
              <option value="Stärke">Stärke</option>
            </select>
          </label>
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
              <li key={ex.id || index}>
                {ex.exercise.name} - 
                <input
                  type="number"
                  value={ex.sets}
                  onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                  min="1"
                /> Sets,
                <input
                  type="number"
                  value={ex.reps}
                  onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                  min="1"
                /> Reps,
                <input
                  type="number"
                  value={ex.rest}
                  onChange={(e) => handleExerciseChange(index, 'rest', parseInt(e.target.value))}
                  min="0"
                /> Rest (s)
                <button onClick={() => handleRemoveExercise(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={saveCustomPlan}>Plan speichern</button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanComponent;
