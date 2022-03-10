import './charList.scss';
import MarvelService from '../../services/MarvelService';
import React from 'react';
import { Component } from 'react/cjs/react.development';
import PropTypes from 'prop-types';

import ErrorMeassage from '../errorMessage/ErrorMeassage';
import Spinner from '../spinner/Spinner';

class CharList extends Component {
    state = {  // состояние хранит:
        charList: [],  // список персонажей
        loading: true,  // процесс загрузки
        error: false,  // обработка ошибки
        newItemLoading: false,  // дозагрузка новых персонажей
        offset: 1541, // отступ персонажей
        charEnded: false // проверка, конец ли количества персонажей
    }

    marvelService = new MarvelService(); // экземпляр класса, который нужен для работы с api сервера marvel


    itemRefs = [];  // будущий массив для ссылок

    setRef = (ref) => { // пушим каждого персонажа в массив ссылок
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }


    componentDidMount() {   // при ренедеринге запускается этот метод, который вызывает метод обращения к серверу
        this.onRequest();
    }

    onRequest = (offset) => {  // Метод обращения к серверу
        this.onCharListLoading();  // вызывает метод загрузки, который изменяет новое свойство состояния
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => { // метод загрузки новых элемент ов, 
        this.setState({
            newItemLoading: true   // включить загрузку
        })
    }

    onCharListLoaded = (newCharList) => {  // вызывается послеметода загрузки
        let ended = false; 
        if (newCharList.length < 9) { // условие для проверки, есть ли еще персонажи
            ended = true;
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],  // объеденяет старый список персонажей с новым
            loading: false,
            newItemLoading: false,
            offset : offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {  // метод создания списка персонажей, вынесен отдельно от render()
        const items = arr.map((item, i) => { // через map преобразуем полученный массив в список
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }
            return (
                <li
                    tabIndex={0}
                    ref={this.setRef}
                    className="char__item"
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                        }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { charList, loading, error, newItemLoading, offset, charEnded } = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMeassage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}
// new com
export default CharList;