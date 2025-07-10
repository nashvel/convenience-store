import React from 'react';

const Spinner = ({ size = 'h-5 w-5', color = 'text-white' }) => {
    return (
        <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 border-transparent`} style={{ borderTopColor: 'currentColor', borderBottomColor: 'currentColor' }}></div>
    );
};

export default Spinner;
