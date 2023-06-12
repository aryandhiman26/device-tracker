import {useContext} from 'react';
import {AuthContext} from './AuthContext';

//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
