import { ensureProfile } from '@/app/actions/user-actions';

export async function ProfileChecker() {
  await ensureProfile();
  return null;
}
