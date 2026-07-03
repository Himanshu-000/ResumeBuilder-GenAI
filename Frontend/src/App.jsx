import { RouterProvider } from "react-router-dom"
import {router} from "./app.routes"
import { AuthProvider } from "./auth/auth.context"
import { InterviewProvider } from "./interview/interview.contex"
function App() {
  

  return (
    <AuthProvider>
      <InterviewProvider>
    <RouterProvider router={router} />
    </InterviewProvider>
    </AuthProvider>
  )
}

export default App
