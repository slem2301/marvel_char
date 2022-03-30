import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";
import SingleComicLayout from "../../pages/SingleComicLayout/SingleComicLayout";
import SingleCharacterLayout from "../../pages/SingleCharacterLayout/SingleCharacterLayout";

const Page404 = lazy(() => import('../../pages/404'));
const CharachtersPage = lazy(() => import('../../pages/CharachtersPage'));
const ComicsListPage = lazy(() => import('../../pages/ComicsListPage'));
const SinglePage = lazy(() => import('../../pages/SinglePage'));

const App = () => {
    return (
        <div className="app">
            <AppHeader />
            <main>
                <Suspense fallback={<Spinner />}>
                    <Routes>
                        <Route path='/' element={<CharachtersPage />} />
                        <Route path='/comics' element={<ComicsListPage />} />
                        <Route path='/comics/:id' element={<SinglePage Component={SingleComicLayout} dataType="comic"/>} />
                        <Route path='/characters/:id' element={<SinglePage Component={SingleCharacterLayout} dataType="character" />} />
                        <Route path='*' element={<Page404 />} />
                    </Routes>
                </Suspense>
            </main>
        </div>
    )
}

export default App;