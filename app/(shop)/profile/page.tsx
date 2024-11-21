import { auth } from "@/app/auth.config";
import { Title } from "@/app/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {

    const session = await auth()

    if (!session?.user) {
        // redirect('/auth/login?returnTo=/profile')
        redirect('/')
    }


    return (
        <div>
            <Title title="Perfil" />

            <pre>
                {
                    JSON.stringify(session.user, null, 2)
                }
            </pre>
        </div>
    );
}