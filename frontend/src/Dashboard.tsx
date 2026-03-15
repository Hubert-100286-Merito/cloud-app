import { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Zadanie 3.3: Komunikacja z API przy użyciu Axios i zmiennej środowiskowej
    axios.get(`${import.meta.env.VITE_API_URL}/tasks`)
      .then(response => {
        setTasks(response.data);
      })
      .catch(err => {
        // Zadanie 4.4: Obsługa błędów na froncie
        setError(`Błąd API: ${err.response?.status || err.message}`);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Cloud Task Manager</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.isCompleted ? "✅ Gotowe" : "⏳ W trakcie"}
          </li>
        ))}
      </ul>
      {tasks.length === 0 && !error && <p>Brak zadań w bazie.</p>}
    </div>
  );
}