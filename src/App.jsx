import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Destinos from './pages/Destinos'
import DestinoDetalle from './pages/DestinoDetalle'
import VueloDetalle from './pages/VueloDetalle'
import HotelDetalle from './pages/HotelDetalle'
import MiViaje from './pages/MiViaje'
import NoEncontrada from './pages/NoEncontrada'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/destinos" element={<Destinos />} />
        <Route path="/destinos/:idDestino" element={<DestinoDetalle />} />
        <Route path="/vuelos/:idVuelo" element={<VueloDetalle />} />
        <Route path="/hoteles/:idHotel" element={<HotelDetalle />} />
        <Route path="/mi-viaje" element={<MiViaje />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}
