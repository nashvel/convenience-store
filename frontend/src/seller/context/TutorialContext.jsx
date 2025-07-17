import React, { createContext, useState, useContext } from 'react';

const TutorialContext = createContext();

export const useTutorial = () => useContext(TutorialContext);

export const TutorialProvider = ({ children }) => {
    const [runTutorial, setRunTutorial] = useState(false);

    const startTutorial = () => setRunTutorial(true);
    const endTutorial = () => setRunTutorial(false);

    return (
        <TutorialContext.Provider value={{ runTutorial, startTutorial, endTutorial }}>
            {children}
        </TutorialContext.Provider>
    );
};
