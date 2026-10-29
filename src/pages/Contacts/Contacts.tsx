import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Reveal from '../../components/Reveal/Reveal';
import CityMap from '../../components/CityMap/CityMap';
import styles from './Contacts.module.scss';

interface FormValues {
  name: string;
  phone: string;
  message: string;
  agree: boolean;
}

type TextFieldName = 'name' | 'phone' | 'message';

const CHANNELS = [
  { icon: '📞', title: 'Единый номер', text: '8 800 555-35-35', sub: 'звонок по России бесплатный' },
  { icon: '✉️', title: 'Почта', text: 'hello@paradise-tour.ru', sub: 'ответ в течение 2 часов, мск' },
  { icon: '📍', title: 'Офис', text: 'г. Южногорск, пл. Победы, 14', sub: 'вход со двора, 2-й этаж' },
  { icon: '🕘', title: 'Часы работы', text: 'Ежедневно 09:00–21:00', sub: 'онлайн-заявки — круглосуточно' },
];

/* Телефон: только цифры, пробелы, +, скобки и дефисы; 10–15 цифр */
const PHONE_CHARS = /^[+\d][\d\s()-]*$/;

export default function Contacts() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, getFieldState, formState } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { name: '', phone: '', message: '', agree: false },
  });

  const { errors, isSubmitted } = formState;

  /**
   * Зелёный — поле заполнено и валидно.
   * Красный — ошибка есть и поле уже трогали (blur) или форму пытались отправить,
   * чтобы не пугать красным с первого символа при наборе телефона.
   */
  const fieldClass = (name: TextFieldName) => {
    const state = getFieldState(name, formState);
    if (!state.invalid && state.isDirty) return styles.valid;
    if (state.invalid && (state.isTouched || isSubmitted)) return styles.invalid;
    return undefined;
  };

  const messageClass = (name: TextFieldName) => {
    const state = getFieldState(name, formState);
    return state.invalid && (state.isTouched || isSubmitted) ? styles.msgError : styles.msg;
  };

  const onSubmit: SubmitHandler<FormValues> = () => {
    setSent(true);
    reset();
  };

  return (
    <section className={`section ${styles.page}`}>
      <div className="container">
        <Reveal>
          <span className="kicker ocean-text">📍 Давайте знакомиться</span>
          <h1 className="section-title">
            Контакты <span className="grad-text">Paradise Tour</span> в Южногорске
          </h1>
        </Reveal>

        <div className={styles.layout}>
          {/* Форма */}
          <Reveal variant="left" delay={0.08}>
            <div className={`glass ${styles.formCard}`}>
              {sent ? (
                <div className={styles.sent}>
                  <span aria-hidden>🏆</span>
                  <h3>Сообщение прилетело!</h3>
                  <p>Ответим на вашу почту в течение 2 часов. А пока полистайте туры — вдруг что-то зацепит 💫</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                  <h3 className={styles.formTitle}>✍️ Оставьте сообщение</h3>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="contact-name">Имя</label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Как вас зовут?"
                        autoComplete="name"
                        className={fieldClass('name')}
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby="name-error"
                        {...register('name', {
                          required: 'Введите имя',
                          minLength: { value: 2, message: 'Минимум 2 символа' },
                        })}
                      />
                      <p id="name-error" className={messageClass('name')} aria-live="polite">
                        {errors.name?.message ?? ''}
                      </p>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="contact-phone">Телефон</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        inputMode="tel"
                        placeholder="+7 (___) ___-__-__"
                        autoComplete="tel"
                        className={fieldClass('phone')}
                        aria-invalid={errors.phone ? true : undefined}
                        aria-describedby="phone-error"
                        {...register('phone', {
                          required: 'Введите телефон',
                          validate: (value) => {
                            const trimmed = value.trim();
                            if (!PHONE_CHARS.test(trimmed)) {
                              return 'Только цифры, пробелы, + ( ) -';
                            }
                            const digits = trimmed.replace(/\D/g, '').length;
                            if (digits < 10) return 'Слишком короткий номер';
                            if (digits > 15) return 'Слишком длинный номер';
                            return true;
                          },
                        })}
                      />
                      <p id="phone-error" className={messageClass('phone')} aria-live="polite">
                        {errors.phone?.message ?? ''}
                      </p>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="contact-message">Сообщение</label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      placeholder="Куда и когда хотите поехать, что важно…"
                      className={fieldClass('message')}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby="message-error"
                      {...register('message', {
                        required: 'Введите сообщение',
                        minLength: { value: 10, message: 'Хотя бы 10 символов' },
                      })}
                    />
                    <p id="message-error" className={messageClass('message')} aria-live="polite">
                      {errors.message?.message ?? ''}
                    </p>
                  </div>

                  <div className={styles.agreeWrap}>
                    <label className={styles.agree} htmlFor="contact-agree">
                      <input
                        id="contact-agree"
                        type="checkbox"
                        aria-invalid={errors.agree ? true : undefined}
                        aria-describedby="agree-error"
                        {...register('agree', { required: 'Необходимо согласие' })}
                      />
                      <span>Согласен(на) на обработку персональных данных</span>
                    </label>
                    <p
                      id="agree-error"
                      className={errors.agree ? styles.msgError : styles.msg}
                      aria-live="polite"
                    >
                      {errors.agree?.message ?? ''}
                    </p>
                  </div>

                  <button type="submit" className="btn btn--primary">
                    Отправить
                    <span className="btn-icon" aria-hidden>🚀</span>
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Карта */}
          <Reveal variant="right" delay={0.12}>
            <div className={styles.mapCard}>
              <CityMap />
              <div className={styles.mapVeil} />

              <div className={styles.pinWrap}>
                <svg className={styles.pin} viewBox="0 0 40 56" aria-hidden>
                  <defs>
                    <linearGradient id="pinGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ff9a00" />
                      <stop offset="0.55" stopColor="#ff5a3d" />
                      <stop offset="1" stopColor="#ff3d7f" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 2c-8.8 0-16 7-16 15.6 0 11.4 13.4 24.4 15.2 26.1.5.5 1.2.5 1.6 0C22.6 42 36 29 36 17.6 36 9 28.8 2 20 2z"
                    fill="url(#pinGrad)"
                  />
                  <circle cx="20" cy="17.4" r="5.6" fill="#fff" />
                </svg>
                <span className={styles.pinCity}>Южногорск</span>
              </div>

              <div className={styles.mapBadge}>
                <b> gps: 43.56° с.ш., 39.78° в.д.</b>
                <small>Краснодарский край, 25 км от Сочи · вид на пл. Победы из офиса 2-го этажа</small>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Каналы связи */}
        <div className={styles.channels}>
          {CHANNELS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <div className={styles.channel}>
                <span className={styles.channelIcon} aria-hidden>{c.icon}</span>
                <div>
                  <small>{c.title}</small>
                  <b>{c.text}</b>
                  <p>{c.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
