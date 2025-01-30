import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
  muscle_group_display: string;
  description: string;
  difficulty: string;
}

const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Define known muscle groups for a simple filter UI
  const muscleGroups = [
    { value: '', label: 'Alle' },
    { value: 'chest', label: 'Brust' },
    { value: 'back', label: 'Rücken' },
    { value: 'legs', label: 'Beine' },
    { value: 'shoulders', label: 'Schultern' },
    { value: 'arms', label: 'Arme' },
    { value: 'abs', label: 'Bauch' },
  ];

  /**
   * Wrap the fetch logic in useCallback so that we can 
   * safely include it in the useEffect dependency array.
   */
  const fetchExercises = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Use 'const' to satisfy "prefer-const" ESLint rule
      const url = `${import.meta.env.VITE_BACKENDURL}/api/exercises/`;
      const params: Record<string, string> = {};

      if (selectedMuscle) {
        params.muscle = selectedMuscle;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await axios.get<Exercise[]>(url, { params, headers: {
        Authorization: `Token ${token}`,
      }});
      setExercises(response.data);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    }
  }, [selectedMuscle, searchTerm]);

  /**
   * useEffect calls fetchExercises on mount,
   * and again if fetchExercises changes 
   * (which happens if selectedMuscle or searchTerm changes).
   *
   * If you only want initial load, remove [fetchExercises] 
   * and do an empty array. Then call fetchExercises manually 
   * upon filter changes.
   */
  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  /**
   * Called when the user submits the filter form.
   * This triggers refetch with the latest selectedMuscle & searchTerm.
   */
  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExercises();
  };

  /** 
   * Group exercises by muscle_group_display for a nicer UI grouping.
   */
  const groupByMuscle = exercises.reduce<Record<string, Exercise[]>>((acc, exercise) => {
    const key = exercise.muscle_group_display; // e.g. "Chest", "Back", etc.
    if (!acc[key]) acc[key] = [];
    acc[key].push(exercise);
    return acc;
  }, {});

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Übungen Übersicht</h2>
      <p>Wähle eine Muskelgruppe oder suche nach einem bestimmten Begriff.</p>

      {/* Filter Form */}
      <form onSubmit={handleFilter} style={{ marginBottom: '1rem' }}>
        <select
          value={selectedMuscle}
          onChange={(e) => setSelectedMuscle(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        >
          {muscleGroups.map((group) => (
            <option key={group.value} value={group.value}>
              {group.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '1rem' }}
        />

        <button type="submit">Filter</button>
      </form>

      {/* Display Exercises, grouped by muscle_group_display */}
      {Object.keys(groupByMuscle).length === 0 ? (
        <p>Keine Übungen gefunden.</p>
      ) : (
        Object.entries(groupByMuscle).map(([groupLabel, exs]) => (
          <div key={groupLabel} style={{ marginBottom: '1rem' }}>
            <h3 style={{ borderBottom: '1px solid #ccc' }}>{groupLabel}</h3>
            {exs.map((exercise) => (
              <div key={exercise.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{exercise.name}</strong>{' '}
                — {exercise.difficulty || 'Unbekannt'}
                <p style={{ margin: 0 }}>{exercise.description}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Exercises;
