import { auth } from "./auth";
import HeroSection from "./components/HeroSections";
import LogoutButton from "./ui/LogoutButton";

export default async function Home() {

  const session = await auth()
  console.log(session?.user);


 
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">


        <h1 className="text-center text-4xl my-5 py-5">Modern Research Management App</h1>

        {
          session?.user && <h3 className="text-center text-2xl my-5 py-5">Hi, {session?.user?.username}</h3>
        }

        <div className="container mx-auto my-5 py-6">
          <HeroSection />
        </div>


        <LogoutButton label={'Logout'} color={'red'} />
          
        
       
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      
       <p>Build By @Great Adib ❤️</p>
       
      </footer>
    </div>
  );
}
