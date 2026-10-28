import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface ModalContextValue {
  isOpen: boolean;
  topic: string;
  openModal: (topic?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('Заказ звонка');

  const openModal = useCallback((t = 'Заказ звонка') => {
    setTopic(t);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  /* Блокируем прокрутку фона, пока модалка открыта */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const value = useMemo(
    () => ({ isOpen, topic, openModal, closeModal }),
    [isOpen, topic, openModal, closeModal]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
