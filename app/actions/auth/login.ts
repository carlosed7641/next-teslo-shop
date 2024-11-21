'use server';
 
import { signIn } from '@/app/auth.config';
 

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {


    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false
    });

    return 'Success';

  } catch {
      return 'CredentialSignin';
  }
}

export const login = async (email: string, password: string) => {

    try {
      await signIn('credentials', { email, password });

      return {
        ok: true
      }
    } catch (error) {
      console.log('error', error);
      return {
        ok: false,
        message: 'Error'
      }
    }
}