import { HashRouter, Routes, Route } from 'react-router-dom'

import Landing from '@/pages/Landing'
import Install from '@/pages/Install'
import Setup from '@/pages/Setup'

//Access Level
import Dashboard from '@/pages/access/Dashboard'



function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        {/* The path "/" represents the default starting page */}
        <Route path="/" element={<Landing />} />
        <Route path="/install" element={<Install />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* As you build more pages, you will add them here like this: */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/pc-status" element={<PCStatus />} /> */}
      </Routes>
    </HashRouter>
  )
}

export default App
