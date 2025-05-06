import {
    createContext, useContext, useState, ReactNode,
} from 'react';

interface HeaderSlotContextType {
  headerSlot: ReactNode;
  setHeaderSlot: (node: ReactNode) => void;
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
    return (
        <HeaderSlotContext.Provider value={{ headerSlot, setHeaderSlot }}>
            {children}
        </HeaderSlotContext.Provider>
    );
}
