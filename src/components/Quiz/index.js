import React, { Component, Fragment } from 'react'
import Levels from '../levels';
import ProgressBar from '../ProgressBar';
import { QuizMarvel } from '../quizMarvel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuizOver from '../QuizOver';
import { FaChevronRight } from "react-icons/fa";

const initialState = {
  quizLevel: 0,
  maxQuestions: 10,
  storedQuestions: [],
  question: null,
  options: [],
  idQuestion: 0,
  btnDisabled: true,
  userAnswer: null,
  score: 0,
  showMelcomeMsg: false,
  quizzEnd: false,
  percent: null

}

const levelNames = ['debutant', 'confirme', 'expert'];

class Quiz extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.storedDataRef = React.createRef();
    
  }
  

  

  loadQuestions = level => {
    const fetchArrayQuiz = QuizMarvel[0].quizz[level];
    if(fetchArrayQuiz.length >= this.state.maxQuestions) {
      this.storedDataRef.current = fetchArrayQuiz;
      const newArray = fetchArrayQuiz.map(({ answer, ...keepRest}) => keepRest);
      this.setState({
        storedQuestions: newArray
      })
    } else {
      console.log('Pas assez de questions!!!')
    }

  }

  componentDidMount = () => {
    this.loadQuestions(levelNames[this.state.quizLevel]);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      maxQuestions,
      storedQuestions,
      idQuestion,
      score,
      quizzEnd
    
    } = this.state
    if((storedQuestions !== prevState.storedQuestions) && storedQuestions.length) {
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options
      })
    }

    if((this.state.idQuestion !== prevState.idQuestion) && this.state.storedQuestions.length) {
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options,
        userAnswer: null,
        btnDisabled: true
      })
    }

    //quizzEnd = true: Fin du quiz
    if (quizzEnd !== prevState.quizzEnd ) {
      const gradePercent = this.getPercentage(maxQuestions, score);
      this.gameOver(gradePercent);
    }

    if (prevProps.userData.pseudo !== this.props.userData.pseudo && this.props.userData.pseudo) {
      this.showToastcomeMsg(this.props.userData.pseudo);
    }
  }

  submitAnswer = selectedAnswer => {
    this.setState({
      userAnswer: selectedAnswer,
      btnDisabled: false
    })

  }

  answerQuestion = (userAnswer, response) => {
    if(userAnswer === response) {
      this.setState(prevState => ({
        score: prevState.score + 1
      }))

      toast.success('Bravo +1', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        bodyClassName: "toastify-color-welcome"
      });
    } else {
      toast.error('Raté 0', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }


  nextQuestion = () => {
    if (this.state.idQuestion === this.state.maxQuestions - 1) {
      this.setState({
        quizzEnd: true,
      })
    } else {
      this.setState(prevState => ({
        idQuestion: prevState.idQuestion + 1
      }))
    }
    
    const response = this.storedDataRef.current[this.state.idQuestion].answer;
    this.answerQuestion(this.state.userAnswer, response);

  }

  
  
  showToastcomeMsg = pseudo => {
    if(!this.state.showMelcomeMsg) {
      this.setState({
        showWelcomeMsg: true
      })

      toast.warn(`Bienvenue ${pseudo} et bonne chance!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    } 
    

  }

  getPercentage = (maxQuest, ourScore) => (ourScore / maxQuest) * 100;


  gameOver = percent => {
    if(percent >= 50) {
      this.setState({
        quizLevel: this.state.quizLevel + 1,
        percent: percent
      })
    } else {
      this.setState({
        percent: percent
      })
    } 

  }

  loadLevelQuestions = param => {
    this.setState({
      ...initialState,
      quizLevel: param
    })
    this.loadQuestions(levelNames[param])
  }
  
  render() {

    const {
      quizLevel,
      maxQuestions,
      options,
      idQuestion,
      btnDisabled,
      userAnswer,
      score,
      quizzEnd,
      percent
    
    } = this.state

   
    const displayOptions = options.map((option, index) => {
      return (
        <p key={index} 
          className={`answerOptions ${userAnswer === option ? 'selected': null}`}
          onClick={() => this.submitAnswer(option)}>
            <FaChevronRight /> {option}
        </p>
      )
    })

    const diplayButtonNext = (idQuestion < maxQuestions - 1)
    ? "Suivant"
    : "Terminer";

    return quizzEnd ? (
      <QuizOver 
        ref={this.storedDataRef}
        levelNames={levelNames}
        score={score}
        quizLevel={quizLevel}
        percent={percent}
        maxQuestions={maxQuestions}
        loadLevelQuestions={this.loadLevelQuestions}
      />
    ): (
        <Fragment>
          <Levels levelNames={levelNames} quizLevel={quizLevel} />
          <ProgressBar 
            idQuestion={idQuestion}
            maxQuestions={this.state.maxQuestions}
          />
          <h2>{ this.state.question }</h2>
          {displayOptions}
          <button 
            disabled={btnDisabled} 
            className='btnSubmit'
            onClick={this.nextQuestion}>
            { diplayButtonNext }
            </button>
            <ToastContainer />
        </Fragment>
      )
    
  }
}

export default Quiz;
