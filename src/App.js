import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import InputCheckbox from './components/InputCheckbox';
import RouletteButton from './components/RouletteButton';
import ResultDisplay from './components/ResultDisplay';

// --- DATA KONFIGURASI ---
const initialInputs = [
  { id: 'TK', label: 'Ada Tugas Kelompok?', isActive: false },
  { id: 'L', label: 'Lapar?', isActive: false },
  { id: 'BK', label: 'Butuh Kopi?', isActive: false },
  { id: 'AK', label: 'Ada Kelas?', isActive: false },
  { id: 'BR', label: 'Butuh Refreshing / Suasana Baru?', isActive: false },
  { id: 'DM', label: 'Deadline Mendesak?', isActive: false },
  { id: 'TMK', label: 'Teman Mengajak Keluar?', isActive: false },
];

const locations = ['Di Kos', 'Rektorat', 'Bento', 'FT', 'KopKen'];

const baseScores = {
  'Di Kos': 10, // Bias tinggi untuk tetap di kos
  'Rektorat': 1,
  'Bento': 1,
  'FT': 1,
  'KopKen': 1,
};

const weights = {
  TK: { 'Di Kos': 3, FT: 5, Rektorat: 1, KopKen: 2, Bento: 0 },
  L:  { 'Di Kos': 2, Bento: 8, FT: 3, KopKen: 2, Rektorat: 1 },
  BK: { 'Di Kos': 1, KopKen: 9, Bento: 2, FT: 2, Rektorat: 1 },
  AK: { 'Di Kos': -5, FT: 10, Rektorat: 7, Bento: 0, KopKen: 0 },
  BR: { 'Di Kos': -3, KopKen: 6, Bento: 4, FT: 2, Rektorat: 1 },
  DM: { 'Di Kos': 7, FT: 3, KopKen: 1, Bento: -2, Rektorat: 0 },
  TMK:{ 'Di Kos': -2, Bento: 5, KopKen: 5, FT: 4, Rektorat: 1},
};
// --- END OF DATA KONFIGURASI ---

function App() {
  const [inputs, setInputs] = useState(initialInputs);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (inputId) => {
    setInputs(
      inputs.map((input) =>
        input.id === inputId ? { ...input, isActive: !input.isActive } : input
      )
    );
  };

  const runRoulette = () => {
    setIsLoading(true);
    setSelectedLocation('');

    // Hitung skor
    let locationScores = { ...baseScores };

    inputs.forEach((input) => {
      if (input.isActive && weights[input.id]) {
        locations.forEach((loc) => {
          locationScores[loc] += weights[input.id][loc] || 0;
        });
      }
    });

    // Pastikan tidak ada skor negatif untuk roulette wheel sederhana
    // Atau, bisa dihandle dengan cara lain jika skor negatif diinginkan punya efek tertentu
    locations.forEach(loc => {
        if (locationScores[loc] < 0) locationScores[loc] = 0;
    });

    const totalScore = locations.reduce((sum, loc) => sum + locationScores[loc], 0);

    if (totalScore === 0) {
        // Jika semua skor 0 (misal semua negatif dan jadi 0), default ke Di Kos atau pilihan acak
        // Di sini, kita bisa default ke lokasi dengan base score tertinggi jika ada
        const defaultLocation = Object.keys(baseScores).reduce((a, b) => baseScores[a] > baseScores[b] ? a : b);
        setTimeout(() => {
            setSelectedLocation(defaultLocation);
            setIsLoading(false);
        }, 700); // Simulate some delay
        return;
    }

    // Buat "wheel" untuk pemilihan acak berbobot
    const wheel = [];
    locations.forEach(loc => {
      const probability = locationScores[loc] / totalScore;
      // Untuk implementasi sederhana, kita bisa mengalikan probabilitas dengan angka besar
      // dan menambahkan lokasi sebanyak itu ke array, lalu pilih random.
      // Atau, buat rentang kumulatif.
      for (let i = 0; i < Math.round(probability * 100); i++) { // *100 untuk presisi sederhana
        wheel.push(loc);
      }
    });

    // Jika wheel kosong karena semua probabilitas sangat kecil dan dibulatkan ke 0
    if (wheel.length === 0) {
        // Pilih secara acak dari lokasi yang skornya positif jika ada, atau default.
        const positiveScoreLocations = locations.filter(loc => locationScores[loc] > 0);
        if (positiveScoreLocations.length > 0) {
            const randomIndex = Math.floor(Math.random() * positiveScoreLocations.length);
            setTimeout(() => {
                setSelectedLocation(positiveScoreLocations[randomIndex]);
                setIsLoading(false);
            }, 700);
            return;
        } else {
            // Fallback jika benar-benar tidak ada pilihan
            const defaultLocation = Object.keys(baseScores).reduce((a, b) => baseScores[a] > baseScores[b] ? a : b);
             setTimeout(() => {
                setSelectedLocation(defaultLocation);
                setIsLoading(false);
            }, 700);
            return;
        }
    }


    // Simulasi putaran roulette
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * wheel.length);
      setSelectedLocation(wheel[randomIndex]);
      setIsLoading(false);
    }, 1000); // Penundaan untuk efek "memutar"
  };

  return (
    <div className="App">
      <Header />
      
      <section className="input-section">
        <h2>Kondisi Decka Saat Ini:</h2>
        {inputs.map((input) => (
          <InputCheckbox
            key={input.id}
            id={input.id}
            label={input.label}
            isActive={input.isActive}
            onChange={handleInputChange}
          />
        ))}
      </section>

      <RouletteButton onClick={runRoulette} isLoading={isLoading} />
      
      {isLoading && <ResultDisplay location="Memutar..." />}
      {!isLoading && selectedLocation && <ResultDisplay location={selectedLocation} />}
      {!isLoading && !selectedLocation && <ResultDisplay location="Pilih kondisi dan putar roulette!" />}

    </div>
  );
}

export default App;