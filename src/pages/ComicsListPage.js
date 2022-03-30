import ComicsList from "../components/comicsList/ComicsList";
import AppBanner from '../components/appBanner/AppBanner'
import { useState } from "react/cjs/react.production.min";

const ComicsListPage = () => {
    // const [selectedComic, setComic] = useState(null);

    // const onComicSelected = (id) => {
    //     setComic(id);
    // }
    return (
        <>
            <AppBanner />
            <ComicsList/>
        </>
    )
}

export default ComicsListPage