

function App() {
  return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
  <div className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full flex flex-col gap-5">
    <p className="text-center text-3xl font-bold">This is a Card</p>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a</p>
    <div className="flex justify-center gap-10">
      <button className="bg-green-600 rounded-4xl px-6 py-2 text-white hover:bg-green-800 transition cursor-pointer"> A button </button>
      <button className="bg-blue-600 rounded-4xl px-6 py-2 text-white hover:bg-blue-800 transition cursor-pointer"> A button </button>
    </div>

  </div>
</div>
   
  )
}

export default App