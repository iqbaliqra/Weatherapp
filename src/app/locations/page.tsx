import Sidebar from "@/components/Sidebar";
import NewLocationForm from "@/components/NewLocationForm";

export default function LocationsPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-5 pl-70">
        <NewLocationForm />
      </main>
    </div>
  );
}
