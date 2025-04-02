import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserStyle {
  style: string;
  colors: string[];
}

interface UserData {
  name: string;
  style: UserStyle;
  lastVisit: Date | null;
  visitCount: number;
}

interface UserContextType {
  userData: UserData | null;
  isFirstVisit: boolean;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
  updateUserStyle: (style: UserStyle) => void;
}

const initialUserData: UserData = {
  name: '',
  style: {
    style: 'casual',
    colors: ['blue', 'black', 'gray']
  },
  lastVisit: null,
  visitCount: 0
};

const UserContext = createContext<UserContextType>({
  userData: null,
  isFirstVisit: true,
  setUserData: () => {},
  clearUserData: () => {},
  updateUserStyle: () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  // Load user data from localStorage on first render
  useEffect(() => {
    const storedUserData = localStorage.getItem('timeClothesUserData');
    
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      // Convert lastVisit string back to Date object if it exists
      if (parsedData.lastVisit) {
        parsedData.lastVisit = new Date(parsedData.lastVisit);
      }
      
      setUserDataState(parsedData);
      setIsFirstVisit(false);
      
      // Update visit count and last visit time
      const updatedData = {
        ...parsedData,
        lastVisit: new Date(),
        visitCount: parsedData.visitCount + 1
      };
      
      localStorage.setItem('timeClothesUserData', JSON.stringify(updatedData));
      setUserDataState(updatedData);
    }
  }, []);
  
  const setUserData = (data: UserData) => {
    const dataToStore = {
      ...data,
      lastVisit: new Date(),
      visitCount: data.visitCount || 1
    };
    
    localStorage.setItem('timeClothesUserData', JSON.stringify(dataToStore));
    setUserDataState(dataToStore);
    setIsFirstVisit(false);
  };
  
  const clearUserData = () => {
    localStorage.removeItem('timeClothesUserData');
    setUserDataState(null);
    setIsFirstVisit(true);
  };
  
  const updateUserStyle = (style: UserStyle) => {
    if (userData) {
      const updatedData = {
        ...userData,
        style
      };
      
      localStorage.setItem('timeClothesUserData', JSON.stringify(updatedData));
      setUserDataState(updatedData);
    }
  };
  
  return (
    <UserContext.Provider value={{ 
      userData, 
      isFirstVisit, 
      setUserData, 
      clearUserData,
      updateUserStyle
    }}>
      {children}
    </UserContext.Provider>
  );
};
