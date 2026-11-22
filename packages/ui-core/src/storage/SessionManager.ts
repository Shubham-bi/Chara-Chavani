export interface UserSession {
  token: string;
  userId: number;
  role: string;
  mobileNumber?: string;
  username?: string;
  displayName: string;
  isProfileCompleted: boolean;
  authenticatedAt: number;
}

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

class InMemoryStorageAdapter implements StorageAdapter {
  private store: Map<string, string> = new Map();

  public async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  public async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  public async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }
}

export type SessionStateListener = (session: UserSession | null) => void;

export class SessionManager {
  private static instance: SessionManager;
  private currentSession: UserSession | null = null;
  private storage: StorageAdapter;
  private listeners: Set<SessionStateListener> = new Set();
  private readonly STORAGE_KEY = 'CHARA_CHHAVANI_AUTH_SESSION';

  constructor(storage?: StorageAdapter) {
    this.storage = storage || new InMemoryStorageAdapter();
  }

  public static getInstance(storage?: StorageAdapter): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager(storage);
    }
    return SessionManager.instance;
  }

  public async initialize(): Promise<UserSession | null> {
    try {
      const raw = await this.storage.getItem(this.STORAGE_KEY);
      if (raw) {
        this.currentSession = JSON.parse(raw);
        this.notifyListeners();
        return this.currentSession;
      }
    } catch (e) {
      console.warn('Failed to restore session from storage:', e);
    }
    return null;
  }

  public async setSession(session: UserSession): Promise<void> {
    this.currentSession = session;
    await this.storage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    this.notifyListeners();
  }

  public async updateProfileCompletion(isCompleted: boolean): Promise<void> {
    if (this.currentSession) {
      this.currentSession.isProfileCompleted = isCompleted;
      await this.storage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentSession));
      this.notifyListeners();
    }
  }

  public async logout(): Promise<void> {
    this.currentSession = null;
    await this.storage.removeItem(this.STORAGE_KEY);
    this.notifyListeners();
  }

  public getAuthToken(): string | null {
    return this.currentSession?.token ?? null;
  }

  public getCurrentUser(): UserSession | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  public isAuthenticated(): boolean {
    return !!this.currentSession?.token;
  }

  public subscribe(listener: SessionStateListener): () => void {
    this.listeners.add(listener);
    listener(this.currentSession);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentSession);
    }
  }
}

export const sessionManager = SessionManager.getInstance();
