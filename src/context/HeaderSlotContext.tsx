import {
    createContext, useContext, useState, ReactNode,
    useMemo,
} from 'react';

interface HeaderSlotContextType {
    headerSlot: ReactNode;
    setHeaderSlot: (node: ReactNode) => void;
    titleSlot: ReactNode;
    setTitleSlot: (node: ReactNode) => void;
}

const HeaderSlotContext = createContext<HeaderSlotContextType | undefined>(undefined);

export const useHeaderSlot = () => {
    const context = useContext(HeaderSlotContext);
    if (!context) {
        throw new Error('useHeaderSlot must be used within a HeaderSlotProvider');
    }
    return context;
};

export function HeaderSlotProvider({ children }: { children: ReactNode }) {
    const [headerSlot, setHeaderSlot] = useState<ReactNode>(null);
    const [titleSlot, setTitleSlot] = useState<ReactNode>(null);
    const contextValue = useMemo(() => ({
        headerSlot, setHeaderSlot, titleSlot, setTitleSlot,
    }), [headerSlot, setHeaderSlot, titleSlot, setTitleSlot]);

    return (
        <HeaderSlotContext.Provider value={contextValue}>
            {children}
        </HeaderSlotContext.Provider>
    );
}
