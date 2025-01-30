import React, { useState } from 'react';
import './css/CalorieCalculator.css';
import axios from 'axios';

// Types for the formula and activity levels
type Formula = 'Mifflin-St Jeor' | 'Revised Harris-Benedict' | 'Katch-McArdle';
type ActivityLevel = 'Kaum' | 'Leicht' | 'Mittelmäßig' | 'Sehr aktiv' | 'Körperliche Arbeit & Training';
type ProteinGoal = 'Gesund' | 'Sportlich aktiv' | 'Erhalt & Aufbau';
type Ziel = 'Abnehmen' | 'Gewicht halten' | 'Aufbau';

// Activity multipliers for TDEE calculation
const activityMultipliers: Record<ActivityLevel, number> = {
  'Kaum': 1.2,
  'Leicht': 1.375,
  'Mittelmäßig': 1.55,
  'Sehr aktiv': 1.725,
  'Körperliche Arbeit & Training': 1.9,
};

// Protein grams per kilogram based on the goal
const proteinGramsPerKg: Record<ProteinGoal, number> = {
  'Gesund': 1.0,
  'Sportlich aktiv': 1.2,
  'Erhalt & Aufbau': 1.5,
};

// Caloric value per gram for macronutrients
const CALORIES_PER_GRAM = {
  protein: 4.1,
  carbs: 4.1,
  fats: 9.3,
};

const explanationText = (
  <>
    <p>
      Dieser Rechner hilft Ihnen, Ihren täglichen Kalorienbedarf und die Verteilung der Makronährstoffe
      basierend auf Ihren persönlichen Angaben und Aktivitätslevel abzuschätzen. Verwenden Sie die Proteinzieloptionen,
      um Ihren Proteinbedarf entsprechend Ihrem Lebensstil und Ihren Fitnesszielen anzupassen. Sie können die Verteilung
      der Kalorien aus Kohlenhydraten und Fetten nach Belieben anpassen.
    </p>
    <p>
      Da sich bei korrekter Nutzung das Gewicht entweder erhöht oder verringert, ebenso wie die fettfreie Körpermasse,
      wird empfohlen diesen Rechner regelmäßig zu verwenden.
    </p>
    <p>Erklärungen zu den Formeln:</p>
    <ul>
      <li>
        <strong>Mifflin-St Jeor:</strong> Diese Formel ist eine der am häufigsten verwendeten und liefert
        genauere Ergebnisse als ältere Formeln. Sie berücksichtigt Gewicht, Größe, Alter und Geschlecht
        der Person. Die Fehlermarge liegt bei durchschnittlich etwa 5%.
      </li>
      <li>
        <strong>Revised Harris-Benedict:</strong> Diese Formel ist eine aktualisierte Variante der ursprünglichen
        Harris-Benedict-Gleichung. Sie berücksichtigt ebenfalls Gewicht, Größe, Alter und Geschlecht, hat aber
        eine durchschnittliche Fehlermarge von etwa 10%.
      </li>
      <li>
        <strong>Katch-McArdle:</strong> Diese Formel wird für Menschen empfohlen, die ihren Körperfettanteil
        kennen. Sie basiert hauptsächlich auf der fettfreien Körpermasse und gilt als besonders genau für
        sportlich aktive und muskulöse Personen. Die Fehlermarge kann variieren, liegt aber in der Regel
        zwischen 2% und 5%, je nach Genauigkeit der Körperfettmessung.
      </li>
    </ul>
  </>
);

const CalorieCalculator: React.FC = () => {
  const [formula, setFormula] = useState<Formula>('Mifflin-St Jeor');
  const [age, setAge] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [gender, setGender] = useState<'männlich' | 'weiblich'>('männlich');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('Kaum');
  const [bmrCalories, setBmrCalories] = useState<number | null>(null);
  const [tdeeCalories, setTdeeCalories] = useState<number | null>(null);
  const [proteinGoal, setProteinGoal] = useState<ProteinGoal>('Gesund');
  const [carbPercentage, setCarbPercentage] = useState<number>(50);
  const [fatPercentage, setFatPercentage] = useState<number>(50);
  const [ziel, setZiel] = useState<Ziel>('Gewicht halten');

  // 1) Calculate BMR & TDEE
  const calculateCalories = () => {
    let bmr = 0;

    switch (formula) {
      case 'Mifflin-St Jeor':
        bmr = gender === 'männlich'
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161;
        break;
      case 'Revised Harris-Benedict':
        bmr = gender === 'männlich'
          ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
          : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
        break;
      case 'Katch-McArdle':
        if (bodyFat !== null) {
          const leanMass = weight * (1 - bodyFat / 100);
          bmr = 370 + 21.6 * leanMass;
        } else {
          alert("Bitte gib deinen Körperfettanteil ein.");
          return;
        }
        break;
    }

    setBmrCalories(bmr);
    const tdee = bmr * activityMultipliers[activityLevel];
    let adjustedTdee = tdee;

    switch (ziel) {
      case 'Abnehmen':
        adjustedTdee *= 0.9; // 10% reduction
        break;
      case 'Aufbau':
        adjustedTdee *= 1.1; // 10% increase
        break;
      case 'Gewicht halten':
      default:
        adjustedTdee = tdee; // no change
    }

    setTdeeCalories(adjustedTdee);
  };

  // 2) Calculate macros
  const calculateMacros = () => {
    if (tdeeCalories === null) return null;

    const proteinCalories = proteinGramsPerKg[proteinGoal] * weight * CALORIES_PER_GRAM.protein;
    const remainingCalories = tdeeCalories - proteinCalories;

    const carbCalories = remainingCalories * (carbPercentage / 100);
    const fatCalories = remainingCalories * (fatPercentage / 100);

    return {
      proteinGrams: proteinCalories / CALORIES_PER_GRAM.protein,
      proteinCals: proteinCalories,
      carbGrams: carbCalories / CALORIES_PER_GRAM.carbs,
      carbCals: carbCalories,
      fatGrams: fatCalories / CALORIES_PER_GRAM.fats,
      fatCals: fatCalories,
    };
  };

  const macros = calculateMacros();

  // 3) Adjust carb/fat distribution
  const handleCarbPercentageChange = (value: number) => {
    setCarbPercentage(value);
    setFatPercentage(100 - value);
  };

  const handleFatPercentageChange = (value: number) => {
    setFatPercentage(value);
    setCarbPercentage(100 - value);
  };

  // 4) Save data to user profile
  const handleSaveToProfile = async () => {
    if (!tdeeCalories || !macros) {
      alert('Bitte zuerst Kalorien und Makros berechnen.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Kein Token gefunden, bitte einloggen.');
      return;
    }

    // Construct the payload for your "last_*" fields
    const payload = {
      last_calories: tdeeCalories,
      last_protein: macros.proteinGrams,  // or macros.proteinCals if you prefer
      last_carbs: macros.carbGrams,       // or macros.carbCals
      last_fats: macros.fatGrams,         // or macros.fatCals
    };

    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKENDURL}/api/accounts/profile/`,
        payload,
        { headers: { Authorization: `Token ${token}` } }
      );
      alert('Daten erfolgreich gespeichert!');
    } catch (error) {
      console.error('Fehler beim Speichern der Kaloriendaten:', error);
    }
  };

  return (
    <div className="calorie-calculator">
      <h2>Kalorienrechner</h2>
      <div>{explanationText}</div>

      {/* Formula Selection */}
      <div>
        <label>Formel:</label>
        <select value={formula} onChange={(e) => setFormula(e.target.value as Formula)}>
          <option value="Mifflin-St Jeor">Mifflin-St Jeor</option>
          <option value="Revised Harris-Benedict">Revised Harris-Benedict</option>
          <option value="Katch-McArdle">Katch-McArdle</option>
        </select>
      </div>

      {/* Gender */}
      <div>
        <label>Geschlecht:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value as 'männlich' | 'weiblich')}>
          <option value="männlich">männlich</option>
          <option value="weiblich">weiblich</option>
        </select>
      </div>

      {/* Age */}
      <div>
        <label>Alter (in Jahren):</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value))}
        />
      </div>

      {/* Weight */}
      <div>
        <label>Gewicht (in kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
        />
      </div>

      {/* Height */}
      <div>
        <label>Größe (in cm):</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(parseFloat(e.target.value))}
        />
      </div>

      {/* Body fat for Katch-McArdle */}
      {formula === 'Katch-McArdle' && (
        <div>
          <label>Körperfettanteil (in %):</label>
          <input
            type="number"
            value={bodyFat ?? ''}
            onChange={(e) => setBodyFat(parseFloat(e.target.value))}
          />
        </div>
      )}

      {/* Activity Level */}
      <div>
        <label>Aktivitätslevel:</label>
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
        >
          <option value="Kaum">Kaum (leichte bis gar keine Belastung)</option>
          <option value="Leicht">Leicht (Leichte Belastung, sportliche Betätigung an 1 bis 3 Tagen pro Woche)</option>
          <option value="Mittelmäßig">Mittelmäßig (mittelschwere Belastung, sportliche Betätigung an 3 bis 5 Tagen pro Woche)</option>
          <option value="Sehr aktiv">Sehr aktiv (Schwere Belastung, harte sportliche Betätigung an 4 bis 6 Tagen pro Woche)</option>
          <option value="Körperliche Arbeit & Training">
            Körperliche Arbeit & Training (Körperliche anstrengende Arbeit, harte sportliche Belastung an 5 bis 7 Tagen pro Woche)
          </option>
        </select>
      </div>

      {/* Protein Goal */}
      <div>
        <label>Ernährungsziel (Protein):</label>
        <select
          value={proteinGoal}
          onChange={(e) => setProteinGoal(e.target.value as ProteinGoal)}
        >
          <option value="Gesund">Gesund</option>
          <option value="Sportlich aktiv">Sportlich aktiv</option>
          <option value="Erhalt & Aufbau">Erhalt & Aufbau</option>
        </select>
      </div>

      {/* Carb/Fat Distribution */}
      <div>
        <label>Anteil Kohlenhydrate (% der verbleibenden Kalorien):</label>
        <input
          type="number"
          value={carbPercentage}
          onChange={(e) => handleCarbPercentageChange(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label>Anteil Fette (% der verbleibenden Kalorien):</label>
        <input
          type="number"
          value={fatPercentage}
          onChange={(e) => handleFatPercentageChange(parseFloat(e.target.value))}
        />
      </div>

      {/* Goal (Calorie surplus/deficit) */}
      <div>
        <label>Ziel:</label>
        <select
          value={ziel}
          onChange={(e) => setZiel(e.target.value as Ziel)}
        >
          <option value="Abnehmen">Abnehmen</option>
          <option value="Gewicht halten">Gewicht halten</option>
          <option value="Aufbau">Aufbau</option>
        </select>
      </div>

      {/* Calculate BMR/TDEE */}
      <button onClick={calculateCalories}>Berechnen</button>

      {/* Display BMR */}
      {bmrCalories !== null && (
        <div>
          <h3>Metabolismus Grundumsatz (BMR): {bmrCalories.toFixed(2)} kcal</h3>
        </div>
      )}

      {/* Display TDEE */}
      {tdeeCalories !== null && (
        <div>
          <h3>Totaler täglicher Energieverbrauch (TDEE): {tdeeCalories.toFixed(2)} kcal</h3>
        </div>
      )}

      {/* Display Macros & Save Button */}
      {macros && (
        <div>
          <h3>Makro Aufteilung:</h3>
          <p>Eiweiß: {macros.proteinGrams.toFixed(2)} Gramm ({macros.proteinCals.toFixed(2)} kcal)</p>
          <p>Kohlenhydrate: {macros.carbGrams.toFixed(2)} Gramm ({macros.carbCals.toFixed(2)} kcal)</p>
          <p>Fette: {macros.fatGrams.toFixed(2)} Gramm ({macros.fatCals.toFixed(2)} kcal)</p>

          <button onClick={handleSaveToProfile}>Daten speichern</button>
        </div>
      )}
    </div>
  );
};

export default CalorieCalculator;
