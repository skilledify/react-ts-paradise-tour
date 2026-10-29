import { useEffect, useState } from 'react';
import { useModal } from '../../context/ModalContext';
import styles from './CallbackModal.module.scss';

export default function CallbackModal() {
  const { isOpen, closeModal, topic } = useModal();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setSent(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeModal]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div
      className={`${styles.backdrop} ${isOpen ? styles.open : ''}`}
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-label={topic}
      aria-hidden={!isOpen}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={closeModal} aria-label="Закрыть">
          ✕
        </button>

        <div className={styles.head}>
          <span className={styles.blob} aria-hidden>🌴</span>
          <h3>{topic}</h3>
          <p>Менеджер свяжется с вами в течение 15 минут — с 9:00 до 21:00 по МСК.</p>
        </div>

        {sent ? (
          <div className={styles.success}>
            <span className={styles.check} aria-hidden>✅</span>
            <h4>Заявка отправлена!</h4>
            <p>
              Вскоре звякнет телефон. А пока — держи промокод{' '}
              <b className="grad-text">PARADISE5</b> на скидку 5% к первому туру.
            </p>
            <button className="btn btn--primary" onClick={closeModal}>
              Хорошо!
              <span className="btn-icon" aria-hidden>🌊</span>
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={submit}>
            <input type="text" placeholder="Ваше имя" required autoComplete="name" />
            <input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              required
              pattern="[\d\s+()-]{10,}"
              autoComplete="tel"
            />
            <textarea rows={3} placeholder="Комментарий — куда и когда хотите?" />
            <label className={styles.agree}>
              <input type="checkbox" required />
              <span>Согласен(на) с обработкой персональных данных</span>
            </label>
            <button type="submit" className="btn btn--primary">
              Отправить заявку
              <span className="btn-icon" aria-hidden>🚀</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
