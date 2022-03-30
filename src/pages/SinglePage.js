import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react/cjs/react.development';

import useMarvelService from '../services/MarvelService';
import AppBanner from '../components/appBanner/AppBanner';
import Spinner from '../components/spinner/Spinner';
import ErrorMeassage from '../components/errorMessage/ErrorMeassage';

import './singlePage.scss'

const SinglePage = ({Component, dataType}) => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const { loading, error, getComic, getCharacter, clearError } = useMarvelService();

    useEffect(() => {
        updateData();
    }, [id]);

    const updateData = () => {
        clearError();

        switch (dataType) {
            case 'comic':
                getComic(id).then(onDataLoaded);
                break;
            case 'character':
                getCharacter(id).then(onDataLoaded);
        }
    }

    const onDataLoaded = (data) => {
        setData(data);
    }

    const errorMessage = error ? <ErrorMeassage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !data) ? <Component data={data} /> : null;

    return (
        <>
            <AppBanner />
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

export default SinglePage;