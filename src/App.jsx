
import { FaCheckCircle, FaListUl, FaCalendar } from "react-icons/fa";
import { Link, } from "react-router-dom";


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-16">
          <div className="flex items-center gap-2 font-semibold">
            <FaCheckCircle className="h-6 w-6 text-blue-600" />
            <span className="text-xl">Taskly</span>
          </div>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link to="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <a href="/signup" className="text-sm font-medium hover:underline">
              Sign up
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-16">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Organize your tasks, simplify your life
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Taskly helps you manage your tasks efficiently. Create lists, set priorities, add due dates, and
                  track your progress.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <a href="/signup">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-11 px-8 w-full min-[400px]:w-auto">
                      Get Started
                    </button>
                  </a>
                  <a href="/login">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-11 px-8 w-full min-[400px]:w-auto">
                      Login
                    </button>
                  </a>
                </div>
              </div>
              <div className="flex justify-center md:justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  <div className="bg-white rounded-lg shadow-lg p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <FaListUl className="h-5 w-5 text-blue-500" />
                        <span>Work Tasks</span>
                      </h3>
                      <span className="text-xs text-gray-500">5 items</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="h-5 w-5 mt-0.5 rounded-full border-2 border-red-500 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="font-medium">Complete project proposal</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
                            <span className="flex items-center gap-1">
                              <FaCalendar className="h-3 w-3" />
                              Today
                            </span>
                            <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                              HIGH
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-5 w-5 mt-0.5 rounded-full border-2 border-yellow-500 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="font-medium">Review client feedback</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
                            <span className="flex items-center gap-1">
                              <FaCalendar className="h-3 w-3" />
                              Tomorrow
                            </span>
                            <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                              MEDIUM
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-5 w-5 mt-0.5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center">
                          <FaCheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium line-through text-gray-500">Schedule team meeting</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                              COMPLETED
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to stay organized and productive
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-blue-50 p-3">
                  <FaListUl className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Multiple Lists</h3>
                <p className="text-center text-gray-500">
                  Create different lists for work, personal, shopping, and more.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-blue-50 p-3">
                  <FaCalendar className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Due Dates</h3>
                <p className="text-center text-gray-500">Set due dates for your tasks and never miss a deadline.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-blue-50 p-3">
                  <FaCheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Track Progress</h3>
                <p className="text-center text-gray-500">Mark tasks as complete and track your productivity.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <div className="flex items-center gap-2 font-semibold">
            <FaCheckCircle className="h-6 w-6 text-blue-600" />
            <span className="text-xl">Taskly</span>
          </div>
          <p className="text-sm text-gray-500">© 2025 Taskly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
