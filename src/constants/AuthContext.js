import React, {createContext, useEffect, useMemo, useState} from 'react';

const AuthContext = createContext({});

const AuthProvider = ({children}) => {
  const [notificationData, setNotificationData] = useState(null);

  return (
    <AuthContext.Provider value={{notificationData, setNotificationData}}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
