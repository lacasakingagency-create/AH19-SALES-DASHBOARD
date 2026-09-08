import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import { AuthUser } from '../types';

export interface RegisterParams {
  fullName: string;
  email: string;
  password: string;
  companyName?: string;
  phone?: string;
}

export interface RegisterResult {
  success: boolean;
  user?: AuthUser;
  needsEmailConfirmation?: boolean;
  error?: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface ResetPasswordResult {
  success: boolean;
  error?: string;
  message?: string;
}

// Key for persistent local preview fallback store
const LOCAL_USERS_KEY = 'ah19_auth_local_users';
const LOCAL_PROFILES_KEY = 'ah19_auth_local_profiles';
const LOCAL_COMPANIES_KEY = 'ah19_auth_local_companies';
const LOCAL_SESSION_KEY = 'ah19_auth_session_data';

// Helper for local mock database in dev/preview without Supabase credentials
function getLocalStore(key: string, defaultVal: any = []) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalStore(key: string, val: any) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

/**
 * Register a new user using Supabase Auth, then create/associate profiles and companies
 */
export async function registerWithSupabase(params: RegisterParams): Promise<RegisterResult> {
  const { fullName, email, password, companyName, phone } = params;
  const client = getSupabaseClient();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = fullName.trim();
  const orgName = companyName?.trim() || `${trimmedName} Commerce`;

  // 1. If Supabase is configured with valid URL & Key
  if (isSupabaseConfigured() && client) {
    try {
      // Step 1: Create user via Supabase Auth
      const { data: authData, error: authError } = await client.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            name: trimmedName,
            company_name: orgName,
            phone: phone?.trim() || '',
          },
        },
      });

      if (authError) {
        return {
          success: false,
          error: authError.message || 'Erro ao criar conta no Supabase Auth.',
        };
      }

      const supabaseUser = authData.user;
      if (!supabaseUser) {
        return {
          success: false,
          error: 'Usuário não retornado pelo Supabase.',
        };
      }

      // Step 2: Check if email confirmation is required by project settings
      const isConfirmed = Boolean(
        authData.session ||
        supabaseUser.confirmed_at ||
        supabaseUser.email_confirmed_at
      );

      // Step 3: Create or find company in `companies` table
      let companyId = `comp_${Date.now()}`;
      try {
        const { data: existingCompany } = await client
          .from('companies')
          .select('id, name')
          .ilike('name', orgName)
          .maybeSingle();

        if (existingCompany?.id) {
          companyId = existingCompany.id;
        } else {
          const { data: newCompany, error: compErr } = await client
            .from('companies')
            .insert({ name: orgName })
            .select('id, name')
            .single();

          if (!compErr && newCompany?.id) {
            companyId = newCompany.id;
          }
        }
      } catch (err) {
        console.warn('Note: companies table insert attempt:', err);
      }

      // Step 4: Upsert record into `profiles` table (NEVER storing password)
      const profilePayload: Record<string, any> = {
        id: supabaseUser.id,
        user_id: supabaseUser.id,
        full_name: trimmedName,
        email: trimmedEmail,
        role: 'Owner',
        company_id: companyId,
      };

      if (phone?.trim()) {
        profilePayload.phone = phone.trim();
      }

      try {
        await client.from('profiles').upsert(profilePayload);
      } catch (err) {
        console.warn('Note: profiles table upsert attempt:', err);
      }

      // If email confirmation is enabled in Supabase and no session was issued
      if (!isConfirmed && !authData.session) {
        return {
          success: true,
          needsEmailConfirmation: true,
        };
      }

      const authUser: AuthUser = {
        id: supabaseUser.id,
        name: trimmedName,
        email: trimmedEmail,
        role: 'Owner',
        company: orgName,
        company_id: companyId,
        avatar:
          supabaseUser.user_metadata?.avatar_url ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        phone: phone?.trim() || '',
      };

      setLocalStore(LOCAL_SESSION_KEY, authUser);
      return {
        success: true,
        user: authUser,
        needsEmailConfirmation: false,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Erro inesperado durante o cadastro.',
      };
    }
  }

  // 2. Safe graceful fallback mode (preview environment before API keys are plugged in)
  // Replicates identical user, profile, company lifecycle
  const localUsers = getLocalStore(LOCAL_USERS_KEY, []);
  if (localUsers.some((u: any) => u.email === trimmedEmail)) {
    return {
      success: false,
      error: 'Este e-mail já está cadastrado. Por favor faça login.',
    };
  }

  const userId = `usr_${Date.now()}`;
  const companyId = `comp_${Date.now()}`;

  const newCompany = {
    id: companyId,
    name: orgName,
    created_at: new Date().toISOString(),
  };

  const newProfile = {
    id: userId,
    user_id: userId,
    full_name: trimmedName,
    email: trimmedEmail,
    role: 'Owner',
    company_id: companyId,
    phone: phone?.trim() || '',
    created_at: new Date().toISOString(),
  };

  const newLocalUser = {
    id: userId,
    email: trimmedEmail,
    passwordHash: btoa(password), // simple preview hash representation
    created_at: new Date().toISOString(),
  };

  setLocalStore(LOCAL_USERS_KEY, [...localUsers, newLocalUser]);
  setLocalStore(LOCAL_COMPANIES_KEY, [...getLocalStore(LOCAL_COMPANIES_KEY, []), newCompany]);
  setLocalStore(LOCAL_PROFILES_KEY, [...getLocalStore(LOCAL_PROFILES_KEY, []), newProfile]);

  const authUser: AuthUser = {
    id: userId,
    name: trimmedName,
    email: trimmedEmail,
    role: 'Owner',
    company: orgName,
    company_id: companyId,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    phone: phone?.trim() || '',
  };

  setLocalStore(LOCAL_SESSION_KEY, authUser);

  return {
    success: true,
    user: authUser,
    needsEmailConfirmation: false,
  };
}

/**
 * Sign in using Supabase Auth, fetching linked profile and company
 */
export async function loginWithSupabase(email: string, password: string): Promise<LoginResult> {
  const client = getSupabaseClient();
  const trimmedEmail = email.trim().toLowerCase();

  // 1. If Supabase client is configured
  if (isSupabaseConfigured() && client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message === 'Invalid login credentials'
            ? 'E-mail ou senha incorretos.'
            : error.message,
        };
      }

      const supabaseUser = data.user;
      if (!supabaseUser) {
        return {
          success: false,
          error: 'Falha ao recuperar informações da sessão.',
        };
      }

      // Fetch profile linked to user.id
      let profileData: any = null;
      try {
        const { data: profile } = await client
          .from('profiles')
          .select('*, companies(*)')
          .eq('id', supabaseUser.id)
          .maybeSingle();
        profileData = profile;
      } catch (err) {
        console.warn('Profile fetch warning:', err);
      }

      const companyName =
        profileData?.companies?.name ||
        profileData?.company_name ||
        supabaseUser.user_metadata?.company_name ||
        'Life4Billion Holdings';

      const companyId =
        profileData?.company_id ||
        supabaseUser.user_metadata?.company_id ||
        'comp_life4billion';

      const authUser: AuthUser = {
        id: supabaseUser.id,
        name:
          profileData?.full_name ||
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.user_metadata?.name ||
          trimmedEmail.split('@')[0],
        email: trimmedEmail,
        role: profileData?.role || 'Administrator',
        company: companyName,
        company_id: companyId,
        avatar:
          profileData?.avatar_url ||
          supabaseUser.user_metadata?.avatar_url ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        phone: profileData?.phone || supabaseUser.user_metadata?.phone || '',
      };

      setLocalStore(LOCAL_SESSION_KEY, authUser);
      return {
        success: true,
        user: authUser,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Erro ao conectar ao Supabase Auth.',
      };
    }
  }

  // 2. Fallback mode for demo / preview
  const defaultDemoEmail = 'abismar@life4billion.com';
  if (trimmedEmail === defaultDemoEmail || password === 'ah19master') {
    const defaultUser: AuthUser = {
      id: 'usr_abismar_master',
      name: 'Abismar Henrique',
      email: trimmedEmail,
      role: 'Founder & CEO',
      company: 'Life4Billion Holdings Ltd.',
      company_id: 'comp_life4billion',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    };
    setLocalStore(LOCAL_SESSION_KEY, defaultUser);
    return { success: true, user: defaultUser };
  }

  // Check locally registered accounts in preview store
  const localUsers = getLocalStore(LOCAL_USERS_KEY, []);
  const found = localUsers.find((u: any) => u.email === trimmedEmail);

  if (!found || found.passwordHash !== btoa(password)) {
    return {
      success: false,
      error: 'E-mail ou senha incorretos. Utilize as credenciais de teste ou cadastre uma nova conta.',
    };
  }

  const profiles = getLocalStore(LOCAL_PROFILES_KEY, []);
  const profile = profiles.find((p: any) => p.id === found.id) || {};
  const companies = getLocalStore(LOCAL_COMPANIES_KEY, []);
  const company = companies.find((c: any) => c.id === profile.company_id) || {};

  const authUser: AuthUser = {
    id: found.id,
    name: profile.full_name || trimmedEmail.split('@')[0],
    email: trimmedEmail,
    role: profile.role || 'Owner',
    company: company.name || 'Minha Empresa',
    company_id: profile.company_id || `comp_${found.id}`,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    phone: profile.phone || '',
  };

  setLocalStore(LOCAL_SESSION_KEY, authUser);
  return { success: true, user: authUser };
}

/**
 * Sign out using Supabase Auth and clear local session
 */
export async function logoutWithSupabase(): Promise<void> {
  const client = getSupabaseClient();
  if (isSupabaseConfigured() && client) {
    try {
      await client.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut warning:', err);
    }
  }

  try {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    localStorage.setItem('ah19_auth_session', 'false');
  } catch {}
}

/**
 * Request password recovery email using Supabase Auth
 */
export async function resetPasswordWithSupabase(email: string): Promise<ResetPasswordResult> {
  const client = getSupabaseClient();
  const trimmedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured() && client) {
    try {
      const redirectUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/login`
          : 'http://localhost:3000/login';

      const { error } = await client.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Link de redefinição enviado com sucesso para o seu e-mail.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Erro ao solicitar recuperação de senha.',
      };
    }
  }

  // Preview / demo simulation
  return {
    success: true,
    message: 'Link de redefinição enviado com sucesso (modo de demonstração).',
  };
}

/**
 * Checks for an existing active Supabase session or cached session
 */
export async function getActiveAuthUser(): Promise<AuthUser | null> {
  const client = getSupabaseClient();

  if (isSupabaseConfigured() && client) {
    try {
      const { data: sessionData } = await client.auth.getSession();
      const session = sessionData.session;

      if (session?.user) {
        const userId = session.user.id;
        let profileData: any = null;

        try {
          const { data } = await client
            .from('profiles')
            .select('*, companies(*)')
            .eq('id', userId)
            .maybeSingle();
          profileData = data;
        } catch {}

        const companyName =
          profileData?.companies?.name ||
          session.user.user_metadata?.company_name ||
          'Life4Billion Holdings';

        const companyId =
          profileData?.company_id ||
          session.user.user_metadata?.company_id ||
          'comp_life4billion';

        return {
          id: userId,
          name:
            profileData?.full_name ||
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split('@')[0] ||
            'Usuário',
          email: session.user.email || '',
          role: profileData?.role || 'Owner',
          company: companyName,
          company_id: companyId,
          avatar:
            profileData?.avatar_url ||
            session.user.user_metadata?.avatar_url ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          phone: profileData?.phone || '',
        };
      }
    } catch (err) {
      console.warn('Session restoration error:', err);
    }
  }

  // Fallback to local session store
  const saved = getLocalStore(LOCAL_SESSION_KEY, null);
  if (saved && saved.email) {
    return saved;
  }

  // If local session flag is true, return default administrator
  const sessionFlag = typeof window !== 'undefined' ? localStorage.getItem('ah19_auth_session') : null;
  if (sessionFlag !== 'false') {
    return {
      id: 'usr_abismar_master',
      name: 'Abismar Henrique',
      email: 'abismar@life4billion.com',
      role: 'Founder & CEO',
      company: 'Life4Billion Holdings Ltd.',
      company_id: 'comp_life4billion',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    };
  }

  return null;
}
