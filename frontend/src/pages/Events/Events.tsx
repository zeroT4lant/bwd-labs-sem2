// events.tsx
import { useEffect, useState } from 'react';
import { fetchEvents, createEvent } from '@api/eventService';
import { getUser } from '@api/authService';
import styles from './Events.module.scss';
import EventList from './components/EventList';
import { Link } from 'react-router-dom';
import CreateEventModal from './components/CreateEventModal';
import { User } from '../../types/user';
import { Event } from '../../types/event'

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('все');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      setError('Ошибка при загрузке мероприятий');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: {
    title: string;
    description: string;
    date: string;
    category: string;
  }) => {
    try {
      await createEvent(eventData);
      loadEvents();
    } catch (error) {
      console.error('Ошибка при создании мероприятия:', error);
    }
  };

  // Фильтрация мероприятий по категории
  const filterEvents = (category: string) => {
    setSelectedCategory(category);
    if (category === 'все') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.category === category));
    }
  };

  useEffect(() => {
    loadEvents();
    getUser()
      .then(setUser)
      .catch((error) => console.error('Ошибка при загрузке пользователя:', error));
  }, []);

  return (
    <div className={styles.eventsPage}>
      <div className={styles.backgroundAnimation}></div>
      
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2452/2452565.png"
            alt="Логотип"
            className={styles.logo}
          />
          <h1 className={styles.title}>Мои<span>Мероприятия</span></h1>
        </div>

        {user ? (
          <div className={styles.userSection}>
            <div className={styles.userGreeting}>
              <span className={styles.welcome}>Добро пожаловать,</span>
              <span className={styles.userName}>{user.name}</span>
            </div>
          </div>
        ) : (
          <div className={styles.authSection}>
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.authButton}>
                Войти
              </Link>
              <Link to="/register" className={`${styles.authButton} ${styles.registerButton}`}>
                Регистрация
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className={styles.mainContent}>
        <div className={styles.actionsBar}>
          <h2 className={styles.sectionTitle}>Все мероприятия</h2>
          <div className={styles.filterControls}>
            <select
              value={selectedCategory}
              onChange={(e) => filterEvents(e.target.value)}
              className={styles.categoryFilter}
            >
              <option value="все">Все категории</option>
              <option value="концерт">Концерт</option>
              <option value="лекция">Лекция</option>
              <option value="выставка">Выставка</option>
            </select>
            {user && (
              <button 
                onClick={() => setIsModalOpen(true)} 
                className={styles.createButton}
              >
                + Создать мероприятие
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Загрузка мероприятий...</p>
          </div>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <EventList 
            events={filteredEvents} 
            onEventUpdate={loadEvents} 
            user={user}
          />
        )}
        {isModalOpen && (
          <CreateEventModal
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateEvent}
          />
        )}
      </main>
    </div>
  );
};

export default Events;