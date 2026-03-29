import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState(''); // Stan dla nowego zadania

  const fetchTasks = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/tasks`)
      .then(response => setTasks(response.data))
      .catch(err => setError(`Błąd API: ${err.response?.status || err.message}`));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Zadanie 5.4: Funkcja dodająca zadanie z Reacta
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    axios.post(`${import.meta.env.VITE_API_URL}/tasks`, { title: newTaskTitle })
      .then(() => {
        setNewTaskTitle(''); // Wyczyść pole po dodaniu
        fetchTasks(); // Odśwież listę zadań
      })
      .catch(err => setError(`Błąd dodawania: ${err.message}`));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Cloud Task Manager</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Formularz dodawania zadania */}
      <form onSubmit={handleAddTask} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Wpisz nowe zadanie..." 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Dodaj zadanie
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            {task.isCompleted ? "✅ " : "⏳ "} {task.title}
          </li>
        ))}
      </ul>
      {tasks.length === 0 && !error && <p>Brak zadań w bazie. Dodaj swoje pierwsze zadanie!</p>}
    </div>
  );
}