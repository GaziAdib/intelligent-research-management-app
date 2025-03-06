import ModalButton from "./_components/buttons/ModalButton";


const Teams = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Teams</h1>
        <ModalButton />
      </div>

      <div className="text-gray-400 text-center mt-10">No teams created yet.</div>
    </div>
  );
};

export default Teams;