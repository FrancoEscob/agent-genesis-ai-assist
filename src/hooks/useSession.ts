
import { useState, useEffect } from 'react';
import { agentService, UserSession } from '../services/AgentService';

export const useSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(
    localStorage.getItem('callflow_session_id')
  );
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    if (sessionId) {
      const userSession = agentService.getSession(sessionId);
      setSession(userSession || null);
    }
  }, [sessionId]);

  const createSession = (userData: Omit<UserSession, 'id' | 'createdAt'>) => {
    const newSessionId = agentService.createSession(userData);
    setSessionId(newSessionId);
    localStorage.setItem('callflow_session_id', newSessionId);
    
    const newSession = agentService.getSession(newSessionId);
    setSession(newSession || null);
    
    return newSessionId;
  };

  const clearSession = () => {
    setSessionId(null);
    setSession(null);
    localStorage.removeItem('callflow_session_id');
  };

  return {
    sessionId,
    session,
    createSession,
    clearSession,
    hasSession: !!sessionId
  };
};
