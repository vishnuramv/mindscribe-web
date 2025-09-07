import React from 'react';
import Modal from './Modal';
import Icon from './Icon';
import Button from './Button';
import { ICONS } from '../../constants';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: {
    title: string;
    icon: keyof typeof ICONS;
    message: string;
    note: string;
  } | null;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose, feature }) => {
  if (!isOpen || !feature) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
        {/* We leave the title in Modal blank to have more control over the layout here */}
        <div className="flex flex-col items-center text-center p-6">
            <div className="bg-primary-light rounded-full p-6 mb-6 inline-block animate-fade-in-up">
                <Icon name={feature.icon} className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in-up" style={{animationDelay: '0.1s'}}>Coming Soon!</h2>
            <p className="text-lg text-gray-600 mb-4 max-w-md mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {feature.message}
            </p>
            <p className="text-sm text-gray-500 max-w-md mx-auto animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                {feature.note}
            </p>
            <div className="mt-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <Button onClick={onClose} size="default">Got it</Button>
            </div>
        </div>
    </Modal>
  );
};

export default ComingSoonModal;
