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
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // Stany dla edycji
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // 1. Pobieranie listy zadań
  const fetchTasks = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/Tasks`)
      .then(response => setTasks(response.data))
      .catch(err => setError(`Błąd API: ${err.response?.status || err.message}`));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Dodawanie nowego zadania
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    axios.post(`${import.meta.env.VITE_API_URL}/api/Tasks`, { title: newTaskTitle })
      .then(() => {
        setNewTaskTitle('');
        fetchTasks();
      })
      .catch(err => setError(`Błąd dodawania: ${err.message}`));
  };

  // 3. Usuwanie zadania
  const handleDeleteTask = (id: number) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/Tasks/${id}`)
      .then(() => fetchTasks())
      .catch(err => setError(`Błąd usuwania: ${err.message}`));
  };

  // 4. Przełączanie statusu (Done/To do)
  const handleToggleComplete = (task: Task) => {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    
    axios.put(`${import.meta.env.VITE_API_URL}/api/Tasks/${task.id}`, updatedTask)
      .then(() => fetchTasks())
      .catch(err => setError(`Błąd aktualizacji statusu: ${err.message}`));
  };

  // 5. Zapisywanie edytowanej treści (Title)
  const saveEdit = (task: Task) => {
    if (!editingTitle.trim()) {
      setEditingTaskId(null);
      return;
    }

    const updatedTask = { ...task, title: editingTitle };

    axios.put(`${import.meta.env.VITE_API_URL}/api/Tasks/${task.id}`, updatedTask)
      .then(() => {
        setEditingTaskId(null);
        fetchTasks();
      })
      .catch(err => setError(`Błąd zapisu edycji: ${err.message}`));
  };

  return (
    <div id="center" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Cloud Task Manager</h1>
      
      {error && (
        <p style={{ color: '#ff4d4d', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          {error}
        </p>
      )}
      
      {/* Formularz dodawania */}
      <form onSubmit={handleAddTask} style={{ marginBottom: '24px', display: 'flex', gap: '10px', width: '100%' }}>
        <input 
          type="text" 
          placeholder="Wpisz nowe zadanie..." 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ 
            flex: 1, 
            padding: '12px', 
            borderRadius: '6px', 
            border: '1px solid var(--border)', 
            background: 'var(--code-bg)', 
            color: 'var(--text-h)' 
          }}
        />
        <button type="submit" style={{ padding: '12px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Dodaj
        </button>
      </form>

      {/* Lista zadań */}
      <div style={{ width: '100%', textAlign: 'left' }}>
        {tasks.map(task => (
          <div key={task.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px', 
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              {/* Ikona statusu */}
              <span 
                onClick={() => handleToggleComplete(task)} 
                style={{ cursor: 'pointer', fontSize: '20px' }}
                title={task.isCompleted ? "Oznacz jako niewykonane" : "Zatwierdź zadanie"}
              >
                {task.isCompleted ? "✅" : "⏳"}
              </span>

              {/* Treść zadania / Pole edycji */}
              {editingTaskId === task.id ? (
                <input 
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => saveEdit(task)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(task)}
                  autoFocus
                  style={{ 
                    flex: 1, 
                    padding: '5px', 
                    background: 'var(--code-bg)', 
                    color: 'var(--text-h)', 
                    border: '1px solid var(--accent)' 
                  }}
                />
              ) : (
                <span 
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditingTitle(task.title);
                  }}
                  style={{ 
                    cursor: 'pointer',
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    color: task.isCompleted ? 'var(--text)' : 'var(--text-h)',
                    flex: 1
                  }}
                  title="Kliknij, aby edytować treść"
                >
                  {task.title}
                </span>
              )}
            </div>
            
            {/* Przycisk usuwania */}
            <button 
              onClick={() => handleDeleteTask(task.id)}
              style={{ 
                background: 'rgba(255, 77, 77, 0.1)', 
                color: '#ff4d4d', 
                border: '1px solid #ff4d4d', 
                padding: '5px 10px', 
                borderRadius: '4px', 
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              Usuń
            </button>
          </div>
        ))}
      </div>
      
      {tasks.length === 0 && !error && (
        <p style={{ marginTop: '20px', color: 'var(--text)' }}>Brak zadań w chmurze. Dodaj coś!</p>
      )}
    </div>
  );
}