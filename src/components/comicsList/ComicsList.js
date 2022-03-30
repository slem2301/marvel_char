import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import ErrorMeassage from '../errorMessage/ErrorMeassage';
import Spinner from '../spinner/Spinner';

const ComicsList = (props) => {
    // хук состояния хранит
    const [comicsList, setComicsList] = useState([]); // список комиксов
    const [newItemLoading, setNewItemLoading] = useState(false); // дозагрузка новых комиксов
    const [offset, setOffset] = useState(0); // отступ комиксов
    const [comicsEnded, setComicsEnded] = useState(false); // проверка, конец ли количества комиксов

    const {loading, error, getAllComics} = useMarvelService();
    

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {  // Метод обращения к серверу
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {  // вызывается послеметода загрузки
        let ended = false;
        if (newComicsList.length < 8) { // условие для проверки, есть ли еще персонажи
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);  // объеденяет старый список персонажей с новым
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {  // метод создания списка персонажей, вынесен отдельно от render()
        const items = arr.map((item, i) => { // через map преобразуем полученный массив в список
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }
            return (
                <li 
                    tabIndex={0}
                    className="comics__item"
                    key={item.id}
                    >
                    <Link to={`/comics/${item.id}`} key={`${item.id}`}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
                
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMeassage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;