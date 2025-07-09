import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext';
import { X } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigModal = ({ isOpen, onClose }: ConfigModalProps) => {
  const { user } = useUser();
  const navigator = useNavigate();

  return (
    <div
      className={`modal ${isOpen ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-content">
        <header className="modal-header">
          <h2>Configurações</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        <form className="modal-body">
          <label>
            <span>Tema</span>
            <select name="theme">
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </label>
          <label>
            <span>Tamanho da fonte</span>
            <input type="number" name="font-size" min={12} max={36} />
          </label>
          <label>
            <span>Cor de destaque</span>
            <input type="color" name="highlight-color" />
          </label>
          <label>
            <span>Cor de destaque em negrito</span>
            <input type="color" name="bold-highlight-color" />
          </label>
          <button>Salvar</button>
        </form>
      </div>
    </div>
  );
};
