import React, { Fragment, useEffect, useState } from 'react'
import { GiTrophyCup } from "react-icons/gi";
import Loader from '../Loader';
import Modal from '../Modal';
import axios from 'axios';

const MARVEL_STORAGE_DATE = 'marvelStorageDate'

const QuizOver = React.forwardRef((props, ref) => {
    
    const {levelNames, score, quizLevel, percent, maxQuestions, loadLevelQuestions} = props
    
    const [asked, setAsked] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [caracterInfos, setCaracterInfos] = useState([]);
    const [loading, setLoading] = useState(true);
    const REACT_APP_MARVEL_API_KEY = process.env.REACT_APP_MARVEL_API_KEY;
    const hash = 'b86475918165cb755f45e0fcc809a6af';
    
    useEffect(() => {
        setAsked(ref.current);
        if(localStorage.getItem(MARVEL_STORAGE_DATE)) {
            const date = localStorage.getItem(MARVEL_STORAGE_DATE)
            checkDataAge(date)
        }
    }, [ref])

    const checkDataAge = date => {
        const today = Date.now();
        const timeDifference = today - date;
        const daysDifference = timeDifference / (1000 * 3600 * 24)
        if (daysDifference >= 15) {
            localStorage.clear();
            localStorage.setItem(MARVEL_STORAGE_DATE, Date.now())
        }
    }

    const showModal = id => {
        setOpenModal(true)
        if(localStorage.getItem(id)) {
            setCaracterInfos(JSON.parse(localStorage.getItem(id)))
            setLoading(false);
        } else {
            axios.get(`https://gateway.marvel.com:443/v1/public/characters/${id}?ts=1&apikey=${REACT_APP_MARVEL_API_KEY}&hash=${hash}`)
            .then(response => {
                setCaracterInfos(response.data)
                setLoading(false)
                localStorage.setItem(id, JSON.stringify(response.data))
                if(!localStorage.getItem(MARVEL_STORAGE_DATE)) {
                    localStorage.setItem(MARVEL_STORAGE_DATE, Date.now())
                }
                
            })
            .catch(error => console.log(error))
        }

       
    }

    const hideModal = () => {
        setOpenModal(false)
        setLoading(true)
    }

    const average = maxQuestions / 2;

    if(score < average) {
        //setTimeout(() => loadLevelQuestions(0), 3000)
        setTimeout(() => loadLevelQuestions(quizLevel), 3000)
    }

    const displayDescription = !loading && caracterInfos.data.results[0].description 
        ? caracterInfos.data.results[0].description
        : 'Descpription indisponible';

    const capitalizeString = str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const displayUrls = !loading && caracterInfos.data.results[0].urls && caracterInfos.data.results[0].urls.map( (url, index) => {
        return <a key={index} 
                    href={url.url} 
                    target='_blank' 
                    rel='noopener noreferrer'>
                        {capitalizeString(url.type)}
                </a>
    })


    const resultModal = !loading ? (
        <Fragment>
            <div className="modalHeader">
                    <h2>{caracterInfos?.data?.results[0]?.name}</h2>
                </div>
                <div className="modalBody">
                    <div className="comicImage">
                        <img src={caracterInfos.data.results[0].thumbnail.path+'.'+caracterInfos.data.results[0].thumbnail.extension} 
                            alt={caracterInfos?.data?.results[0]?.name} 
                        />
                        { caracterInfos.attributionText }
                    </div>
                    <div className="comicDetails">
                        <h3>Description</h3>
                        { displayDescription }

                        <h3>Plus d'infos</h3>
                        { displayUrls }
                    </div>
                </div>
                <div className="modalFooter">
                    <button className="modalBtn" onClick={hideModal}>Fermer</button>
                </div>
        </Fragment>
    ) : (
        <Fragment>
            <div className="modalHeader">
                <h2>Réponse de Marvel ...</h2>
                <div className="modalBody">
                <Loader 
                    loadingMsg={'loading...'} 
                    styling={{textAlign: 'center', color: 'red'}} 
                />
                </div>
            </div>
        </Fragment>
    )

    const descision = score >= average ? (
        <Fragment>
            <div className="stepsBtnContainer">
                {
                    quizLevel < levelNames.length ? (
                        <>
                            <p className="successMsg">Bravo, passez au niveau suivant !</p>
                            <button className="btnResult success" 
                                onClick={() => loadLevelQuestions(quizLevel)}>
                                Niveau Suivant
                            </button>
                        </>
                        
                    ) : (
                        <>
                            <p className="successMsg"><GiTrophyCup size='50px'/> Bravo, vous êtes un expert !</p>
                            <button 
                                className="btnResult gameOver"
                                onClick={() => loadLevelQuestions(0)}>
                                Acceuil
                            </button>
                        </>

                    )
                }
            </div>
            <div className="percentage">
                <div className="progressPercent">Réussite: {percent}%</div>
                <div className="progressPercent">Note: {score}/{maxQuestions}</div>
            </div> 
        </Fragment>
    ) : (
        <Fragment>
            <div className="stepsBtnContainer">
                <div className="failureMsg">Vous avez échoué !</div>
            </div>
            <div className="percentage">
                <div className="progressPercent">Réussite: {percent}%</div>
                <div className="progressPercent">Note: {score}/{maxQuestions}</div>
            </div>
        </Fragment>

    )

    const quesrtionAnswers = score >= average ? (
        asked.map(question => {
            return(
                <tr key={question.id}>
                    <td>{question.question}</td>
                    <td>{question.answer}</td>
                    <td><button onClick={() => showModal(question.heroId)} className='btnInfo'>INFOS</button></td>
                </tr>
            )
        })
    ): (
        <tr>
            <td colSpan='3'>
                <Loader 
                    loadingMsg={'Pas de réponses!'} 
                    styling={{textAlign: 'center', color: 'red'}} 
                />
             </td>
        </tr>
       
    )
    
    return (
        <Fragment>
            { descision } 
            <hr />

            <p>Les réponses aux questions posées:</p>
            <div className="answerContainer">
                <table className="answers">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Réponses</th>
                            <th>Infos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quesrtionAnswers}
                    </tbody>
                </table>
            </div>
            <Modal showModal={openModal} hideModal={hideModal}>
               { resultModal }
            </Modal>
            
        </Fragment>
    )
})


export default React.memo(QuizOver);
