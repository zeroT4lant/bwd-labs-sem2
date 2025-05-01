// CreateEventModal.tsx
import { useState } from 'react';
import styles from './CreateEventModal.module.scss';

type EventCategory = 'концерт' | 'лекция' | 'выставка';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (event: { 
    title: string; 
    description: string; 
    date: string; 
    category: EventCategory 
  }) => Promise<void>;
}

const CreateEventModal = ({ onClose, onCreate }: CreateEventModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '' as EventCategory | ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Сбрасываем ошибку при изменении
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Валидация на фронтенде
    if (!formData.category || !['концерт', 'лекция', 'выставка'].includes(formData.category)) {
      setError('Пожалуйста, выберите допустимую категорию');
      setIsSubmitting(false);
      return;
    }

    try {
      await onCreate({
        ...formData,
        category: formData.category as EventCategory
      });
      onClose();
    } catch (err: any) {
      if (err.response?.data?.message === 'Недопустимая категория') {
        setError('Выберите допустимую категорию: концерт, лекция или выставка');
      } else {
        setError('Произошла ошибка при создании мероприятия');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Создать новое мероприятие</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Название</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Дата</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Категория</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={!formData.category ? styles.emptySelect : ''}
              >
                <option value="">Выберите категорию</option>
                <option value="концерт">Концерт</option>
                <option value="лекция">Лекция</option>
                <option value="выставка">Выставка</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Создание...' : 'Создать мероприятие'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;