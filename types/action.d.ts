interface SignInWithOAuthParams {
  user: Partial<IUser>;
  provider: string;
  providerAccountId: string;
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}
