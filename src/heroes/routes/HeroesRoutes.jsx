import {Navbar} from "../../ui"
import{ MarvelPage} from '../pages/MarvelPage'
import{ DcPage} from '../pages/DcPage'
import { FormularioPage } from "../pages/FormularioPage"
import { Routes,Route,Navigate } from "react-router-dom"
import { SearchPage} from "../pages/SearchPage"
import { HeroPage } from "../pages/HeroPage"
export const HeroesRoutes = () => {
  return (
    <>

    <Navbar/>
    <div className="container">
        <Routes>
                <Route path="marvel" element={<MarvelPage/>}/>
                <Route path="dc" element={<DcPage/>}/>
                <Route path="search" element={<SearchPage/>}/>
                <Route path="formulario" element={<FormularioPage/>}/>
                <Route path="hero/:id" element={<HeroPage/>}/>
                <Route path="/" element={<Navigate to="/marvel"/>}/>
                
        </Routes>

    </div>

    
   
    
    </>
  )
}
