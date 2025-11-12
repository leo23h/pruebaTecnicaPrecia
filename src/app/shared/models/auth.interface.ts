export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AccessUser {
    accessToken: string;
    refreshToken: string;
}

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    maidenName?: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    age?: number;
    gender?: string;
    image?: string;

}
