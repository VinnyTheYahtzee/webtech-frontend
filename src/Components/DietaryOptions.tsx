import React, { useState, useEffect } from 'react';

// Types for the dietary filters
type DietType = 'Vegan' | 'Vegetarian' | 'Meat-Based';

// Placeholder for simulating data fetching
const mockFetchDietaryData = (filter: DietType) => {
  return new Promise<{ items: string[] }>((resolve) => {
    setTimeout(() => {
      const data = {
        Vegan: ['Soy Milk', 'Tofu', 'Chickpea Salad'],
        Vegetarian: ['Paneer Butter Masala', 'Cheese Pizza'],
        'Meat-Based': ['Chicken Breast', 'Grilled Steak']
      };
      resolve({ items: data[filter] });
    }, 1000); // Simulate network delay
  });
};

const DietaryOptions: React.FC = () => {
  const [dietaryFilter, setDietaryFilter] = useState<DietType>('Vegan');
  const [dietData, setDietData] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch data from backend once the backend is set up
    setLoading(true);
    mockFetchDietaryData(dietaryFilter)
      .then(response => {
        setDietData(response.items);
        setLoading(false);
      });
  }, [dietaryFilter]);

  return (
    <div className="dietary-options">
      <h2>Diät Optionen</h2>
      <div>
        <label>Diät Typ:</label>
        <select value={dietaryFilter} onChange={e => setDietaryFilter(e.target.value as DietType)}>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarisch</option>
          <option value="Meat-Based">Fleisch-basiert</option>
        </select>
      </div>
      {loading ? (
        <p>Lädt... Bitte warten.</p>
      ) : (
        <ul>
          {dietData.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DietaryOptions;
