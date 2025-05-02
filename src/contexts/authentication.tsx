import { jwtDecode } from "jwt-decode";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getUserById } from "../api";
import { User } from "../types/User";

export type AuthenticationState =
  | {
      isAuthenticated: true;
      token: string;
      userId: string;
    }
  | {
      isAuthenticated: false;
    };

export type Authentication = {
  state: AuthenticationState;
  authenticate: (token: string) => void;
  signout: () => void;
};

export const AuthenticationContext = createContext<Authentication | undefined>(
  undefined,
);

export const AuthenticationProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<AuthenticationState>({
    isAuthenticated: false,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      // (Optionnel : vérifier expiration ici)
      setState({ isAuthenticated: true, token: storedToken,userId: jwtDecode<{ id: string }>(storedToken).id });
    }
  }, []);

  const authenticate = useCallback(
    async (token: string) => {
      localStorage.setItem('jwt', token);

      const { id: userId } = jwtDecode<{ id: string }>(token);

      try {
        const user = await getUserById(userId);
    
        // Stocker les infos utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify(user));
    
        setState({
          isAuthenticated: true,
          token,
          userId,
        });
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        // On peut garder connecté, ou non, selon le besoin
        setState({
          isAuthenticated: true,
          token,
          userId,
        });
      }

    },
    [setState],
  );

  const signout = useCallback(() => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setState({ isAuthenticated: false });
  }, [setState]);

  const contextValue = useMemo(
    () => ({ state, authenticate, signout }),
    [state, authenticate, signout],
  );

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export function useAuthentication() {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error(
      "useAuthentication must be used within an AuthenticationProvider",
    );
  }
  return context;
}

export function useAuthToken() {
  const { state } = useAuthentication();
  if (!state.isAuthenticated) {
    throw new Error("User is not authenticated");
  }
  return state.token;
}

export function useUserInfo() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

