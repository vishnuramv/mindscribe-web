import React from 'react';
import Icon from '../components/ui/Icon';

interface ComingSoonPageProps {
    title: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title }) => {
    return (
        <div className="p-8 h-full flex flex-col">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            </header>
            <div className="flex-grow bg-white rounded-lg shadow-sm flex flex-col items-center justify-center text-center p-8">
                <div className="bg-primary-light rounded-full p-6 mb-6">
                    <Icon name="calendar" className="h-16 w-16 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Feature in development</h2>
                <p className="text-gray-500 max-w-md">
                    We're currently working on the "{title}" page. It'll be ready for you soon. Thank you for your patience!
                </p>
            </div>
        </div>
    );
};

export default ComingSoonPage;
