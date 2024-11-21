export const revalidate = 0

import { getUsers } from '@/app/actions';
import { Title } from '@/app/components';

import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';

export default async function Users() {


  const { ok, users = [] } = await getUsers();


  if (!ok) {
    redirect('/');
  }

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />
      </div>
    </>
  );
}