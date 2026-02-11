import Modal from '../common/Modal';
import Button from '../common/Button';
import { colors } from '../../theme';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 style={{ marginBottom: '12px', fontSize: '1.2rem' }}>Confirm Submission</h3>
      <p style={{ color: colors.textSecondary, marginBottom: '24px', lineHeight: 1.6 }}>
        Please double check your report is factually correct.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onClose}>
          I'll go back and double check
        </Button>
        <Button onClick={onConfirm}>
          Yes, I checked
        </Button>
      </div>
    </Modal>
  );
}
