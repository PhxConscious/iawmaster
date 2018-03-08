import React from 'react';
import configUnitCards from '../../config/unitCards';
import configUserProgess from '../../config/userProgress';
import LmsCard from '../Reusable/LmsCard';
import '../../Styles/LmsCardsStyles.css';
import LessonContent from './LessonContent';
import { connect } from 'react-redux';
import { getLmsContent } from '../../redux/actions/lmsContent';
import { getUserProgress, nextQuestion } from '../../redux/actions/userProgress';
import { setCurrentValue } from "../../redux/actions/currentValues"

class Dashboard extends React.Component {
  constructor(props){
    super(props)
    this.state= {
      readyForRender: false,
    }
    this.selectCardOnClick = this.selectCardOnClick.bind(this)
    this.combineUserDataAndTaskData = this.combineUserDataAndTaskData.bind(this);
    this.nextLesson = this.nextLesson.bind(this);
    this.prevLesson = this.prevLesson.bind(this);
    this.getActiveLesson = this.getActiveLesson.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.nextUnit = this.nextUnit.bind(this);
  }



  // this must update when a unit is finished (not just
  // initial rendering) - see if this works
  componentDidMount(){
    this.props.getLmsContent();
    this.props.fetchUserProgress();
  }


  componentWillReceiveProps(nextProps){
    if(this.props.book && this.props.book[0] && this.props.book[0].lessons){
    }

    if(nextProps !== this.props ){

      if(nextProps.book[0] && nextProps.book[0].lessons && nextProps.book[0] !== this.props.book[0]){
      }
      if(nextProps.userProgress.currentUser.user_progress !== this.props.userProgress.currentUser.user_progress){
        this.combineUserDataAndTaskData(nextProps.userProgress.currentUser.user_progress);
      }
    }
  }

  combineUserDataAndTaskData(userData){
    console.log("combineUserDataAndTaskData")
    let { book } = this.props;
    let tasks = Object.keys(userData);

    // taskArr combines server data with local data
    let taskArr = [];

    // find units on react but not in DB. add to tasks arr.
    // now we can update react and it renders automatically
    // we must post this to server later
    book.forEach(card => {
      if(tasks.indexOf(card.id) === -1){
        tasks.push(card.id)
      }
    })

    // match up server data and local data to make one array
    // of task objecs which include a "completed" value (boolean)
    tasks.forEach(task => {
      book.forEach(card => {
        if(card.id === task) {
          let key = card.id;
          taskArr.push({
            userProgress: {
              name: key,
              isCompleted: userData[task].unitCompleted,
              isLocked: userData[task].unitLocked,
              // lessons: userData[task].lessons
            },
            title: card.title,
            description: card.description,
            image: card.image,
            active: false,
            lessons: card.lessons,
            id: card.id
          })
        }
      })
    })


    let activeUnitName = null;
    // sets the initial active unit
    let currentUnit;
    let currentUnitId;
    let activeUnitLessons;
    for(let i = 1; i < taskArr.length; i++){
      if(taskArr[i].userProgress.isCompleted === false && taskArr[i-1].userProgress.isCompleted === true){
        activeUnitName = taskArr[i].title;
        currentUnitId = taskArr[i].id;
        currentUnit = i.toString();
        i = tasks.length;
        // now lets find the active lesson
      } else {
        activeUnitName = taskArr[0].title;
        currentUnitId = taskArr[0].id;
        currentUnit = "0";
      }
    }
    console.log("Setting current unit", currentUnitId, taskArr[currentUnit])
    this.props.setCurrentValues("tasks", taskArr);
    this.props.setCurrentValues("active", activeUnitName);
    this.props.setCurrentValues("currentUnit", currentUnit);
    this.props.setCurrentValues("currentUnitName", activeUnitName);
    this.props.setCurrentValues("currentUnitId", currentUnitId);
    // this.props.setCurrentValues("currentUnitObj", )

    this.setState({
      ...this.state,
      readyForRender: true,
    });
  }


  // updates state.lesson only when necessary
  componentDidUpdate(prevProps, prevState){
    let { currentValues } = this.props;
    if(prevProps.currentValues.tasks !== currentValues.tasks){
      this.getActiveLesson();
    }
  }

  getActiveLesson(){
    console.log("getActiveLesson")
    let { currentValues } = this.props;
    let userProg = this.props.userProgress.currentUser.user_progress;

    // find first incomplete lesson within active unit
    currentValues.tasks.forEach(task => {
      let firstIncompleteLesson = null;
      let firstIncompleteQuestion = null;
      let i; // lesson index
      let j; // question index
      let finalIndexI;
      let finalIndexJ;

      if(task.title === currentValues.active){

        let lessonsProgress = userProg[task.id].lessons;

        for(i = task.lessons.length - 1; i >=0; i--){
          let lessonId = task.lessons[i].id;
          if(!lessonsProgress[lessonId].lessonCompleted) {
            firstIncompleteLesson = task.lessons[i];
            finalIndexI = i.toString();
          }

          let questions = task.lessons[i].questions;

          // find first incomplete question
          for(j = questions.length-1; j >=0; j--){
            if(!lessonsProgress[firstIncompleteLesson.id].questions[questions[j].id]){
              console.log("inside questions filtering", questions[j].id)
              firstIncompleteQuestion = questions[j]
              finalIndexJ = j.toString()
            }
          }
        }

        console.log("getActiveLesson unit/lesson/question", task.id, firstIncompleteLesson.id, firstIncompleteQuestion.id)
        this.props.setCurrentValues("active", task.title);
        this.props.setCurrentValues("currentUnitName", task.title);
        this.props.setCurrentValues("currentUnitId", task.id);
        this.props.setCurrentValues("currentUnitObj", task);
        this.props.setCurrentValues("currentLesson", finalIndexI);
        this.props.setCurrentValues("currentLessonObj", firstIncompleteLesson);
        this.props.setCurrentValues("currentLessonName", firstIncompleteLesson.title);
        this.props.setCurrentValues("currentQuestion", finalIndexJ);
        this.props.setCurrentValues("currentQuestionName", firstIncompleteQuestion.title);
        this.props.setCurrentValues("currentQuestionId", firstIncompleteQuestion.id);
        this.props.setCurrentValues("currentQuestionObj", firstIncompleteQuestion);
      }
    })
  }

  // sets current unit
  selectCardOnClick(value){
    let { tasks } = this.props.currentValues;
    let index;
    tasks.forEach((task, i) => {

      if(task.title === value && !task.userProgress.isLocked){
        index = i.toString();
        this.props.setCurrentValues("active", value);
        this.props.setCurrentValues("currentUnit", index);
        this.props.setCurrentValues("currentUnitObj", task);
      }
    })
  }

  nextUnit(){

    let { currentUnit, currentUnitId, currentUnitObj, currentLesson, currentLessonObj, currentQuestion, currentQuestionObj, currentQuestionId } = this.props.currentValues;

    let { userProgress, book } = this.props;

    let targetUnit = (parseInt(currentUnit, 10) + 1);

    // the whole task obj in redux
    let taskObjRedux = userProgress.currentUser.user_progress;

    // the current task object in redux
    let curUnit =  taskObjRedux[currentUnitObj.id];

    // the current lesson from redux
    let curLesson = curUnit.lessons[currentLessonObj.id];

    // @TODO mark the current unit as completed
    taskObjRedux[currentUnitObj.id]["unitCompleted"] = true;

    // @TODO mark the next unit as unlocked
    // check to see if there is a next unit
    // console.log("checking length", targetUnit, book.length)
    let nextUnitId = currentUnit; // jic there's no next unit
    if(book.length > targetUnit){
      nextUnitId = book[targetUnit].id;

      taskObjRedux[nextUnitId]["unitLocked"] = false;
      // console.log(nextUnitId, taskObjRedux, 'taskObjRedux')

    // @TODO mark the current lesson as complete


    // @TODO post this progress to the server
    // @TODO set new current unit, lesson, question in redux
    // may have to cycle through and find next incomplete
    }
  }






  nextLesson(){

    let { currentUnit, currentUnitId, currentUnitObj, currentLesson, currentLessonObj, currentQuestion, currentQuestionObj, currentQuestionId } = this.props.currentValues;

    let { userProgress, book } = this.props;

    let targetLesson = (parseInt(currentLesson, 10) + 1).toString();


    // the whole task obj in redux
    let taskObjRedux = userProgress.currentUser.user_progress;

    // the current task object in redux
    let curUnit =  taskObjRedux[currentUnitObj.id];

    // the current lesson from redux
    let curLesson = curUnit.lessons[currentLessonObj.id];


    // @TODO mark current lesson isCompleted
    taskObjRedux[currentUnitObj.id].lessons[currentLessonObj.id]["lessonCompleted"]=true;
    taskObjRedux[currentUnitObj.id].lessons[currentLessonObj.id]["lessonLocked"]=false;

    // @TODO mark next lesson as isUnlocked
    let nextLessonObj = currentLessonObj; // default value - should update if not last lesson in unit
    // must check to see if we're at last lesson already
    if(book[currentUnit].lessons.length === parseInt(currentLesson)+1){
      console.warn("YOURE AT THE END OF THE UNIT ALREADY")
    } else {
      // find next lesson id in book
      nextLessonObj = book[currentUnit].lessons[parseInt(currentLesson)+1]

      // set that to incomplete and unlocked in taskObjRedux
      taskObjRedux[currentUnitObj.id].lessons[nextLessonObj.id]["lessonCompleted"]=false;

      taskObjRedux[currentUnitObj.id].lessons[nextLessonObj.id]["lessonLocked"]=false;
    }

    // @TODO POST to userProgress on server
    let dto = {};
    dto["userProgress"] = taskObjRedux;
    this.props.putNextQuestion(1, dto)

    // @TODO find the first incomplete question and set that to currentQuestion

    // @TODO advance to next lesson and set as currentLesson & currentLessonObj in redux
    this.props.setCurrentValues("currentLesson", targetLesson);
    this.props.setCurrentValues("currentLessonObj", configUnitCards[currentUnit].lessons[currentLesson]);

    // @TODO if current lesson the last lesson in unit, make the nextLesson button disabled and congratulate user on finishing.



  }

  prevLesson(){
    let currentLesson = this.state.currentLesson;
    let targetLesson = (parseInt(currentLesson, 10) - 1).toString();

    //@TODO update currentLessonObj based on targetLesson
    this.props.setCurrentValues("currentLesson", targetLesson);
    this.props.setCurrentValues("currentLessonObj", configUnitCards[this.state.currentUnit].lessons[this.state.currentLesson]);

    // this.setState({
    //   ...this.state,
    //   currentLesson: targetLesson,
    //   currentLessonObj: configUnitCards[this.state.currentUnit].lessons[this.state.currentLesson]
    // })
  }

  nextQuestion(){
    let { currentUnit, currentUnitId, currentUnitObj, currentLesson, currentLessonObj, currentQuestion, currentQuestionObj, currentQuestionId} = this.props.currentValues;
    let { userProgress, book } = this.props;


    let targetQuestion = parseInt(currentQuestion, 10).toString()

    // the whole task obj in redux
    let taskObjRedux = userProgress.currentUser.user_progress;

    // the current task object in redux
    let curUnit =  taskObjRedux[currentUnitObj.id];

    // the current lesson from redux
    let curLesson = curUnit.lessons[currentLessonObj.id];

    // the current questions from redux
    let curQuest = curLesson.questions

    console.log('curQuest before', curQuest)
    // 1. put new true questionId value in questions obj
    curQuest[currentQuestionObj.id] = true;
    console.log('curQuest after', curQuest)

    // 2. put questions obj in taskObjRedux
    // console.log('questionID', targetQuestion, curQuest, currentQuestionObj)
    taskObjRedux[currentUnitObj.id].lessons[currentLessonObj.id]["questions"] = curQuest;

  //   console.log("before setting values", currentLessonObj.questions.length - 1, parseInt(currentQuestion)+1)
  //   if(currentLessonObj.questions.length - 1 > parseInt(currentQuestion)+1){
  //     console.log("inside first redux set",currentLessonObj.questions.length - 1, parseInt(currentQuestion)+1, book[currentUnit].lessons[currentLesson].questions[targetQuestion])
  //     this.props.setCurrentValues("currentQuestion", targetQuestion);
  //     this.props.setCurrentValues("currentQuestionObj", book[currentUnit].lessons[currentLesson].questions[targetQuestion]);
  //   // handle if this is the last question of lesson && another lesson exists
  //   console.log("is last lesson before?", book[currentUnit].lessons.length, parseInt(currentLesson)+1)
  // } else if (book[currentUnit].lessons.length > parseInt(currentLesson)+1) {
  //     console.log("is last lesson after?", book[currentUnit].lessons.length,  parseInt(currentLesson)+1)
  //     console.log("inside second redux set",currentLessonObj.questions.length - 1, parseInt(currentQuestion)+1, currentQuestion, book[currentUnit].lessons[currentLesson].questions[targetQuestion])
  //     this.props.setCurrentValues("currentQuestion", "0");
  //     this.props.setCurrentValues("currentQuestionObj", book[currentUnit].lessons[parseInt(currentLesson)+1].questions["0"]);
  //   }


    // 5. dispatch updated obj - format object for server
    let dto = {};
    dto["userProgress"] = taskObjRedux;
    this.props.putNextQuestion(1, dto)
  }

  prevQuestion(){
    let { currentUnit, currentUnitId, currentUnitObj, currentLesson, currentLessonObj, currentQuestion, currentQuestionObj, currentQuestionId} = this.props.currentValues;
    let { userProgress, book } = this.props;
    let targetQuestion = (parseInt(currentQuestion, 10) - 1).toString();

    this.props.setCurrentValues("currentQuestion", targetQuestion);
    this.props.setCurrentValues("currentQuestionObj", book[currentUnit].lessons[currentLesson].questions[targetQuestion]);

    // the whole task obj in redux
    let taskObjRedux = userProgress.currentUser.user_progress;

    // the current task object in redux
    let curUnit =  taskObjRedux[currentUnitObj.id];

    // the current lesson from redux
    let curLesson = curUnit.lessons[currentLessonObj.id];

    // the current questions from redux
    let curQuest = curLesson.questions

  }

  getLengthOfCurrentLessonArray(){
    let { tasks, currentUnit } = this.props.currentValues;
    if(currentUnit){
      return tasks[currentUnit].lessons.length;
    }
  }

  render() {

    this.getLengthOfCurrentLessonArray()
    let { active, tasks, currentUnit, currentUnitName, currentUnitId, currentLesson,  currentLessonObj, currentQuestion, currentQuestionObj } = this.props.currentValues;



    let { userProgress, book } = this.props;

    let lmsCards = null;

    if(tasks){

      lmsCards = tasks.map((card, i) => {
        return <LmsCard
          title={book[i].title}
          description={book[i].description}
          image={book[i].image}
          onClick={this.selectCardOnClick}
          value={book[i].title}
          active={active === book[i].title ? true : false}
          isCompleted={card.userProgress.isCompleted}
          locked={tasks[i].userProgress.isLocked}
          key={card.id}
        />
      })
    }

    if(this.state.readyForRender){


      return(
        <div className="background">
          <div id="spacer"></div>
          <div className="unitCardsContainer">
                  {lmsCards}
          </div>

          <div className="lessonContentContainer">
            {currentLesson ? <LessonContent
                nextUnit={this.nextUnit}
                nextLesson={this.nextLesson}
                prevLesson={this.prevLesson}
                nextQuestion={this.nextQuestion}
                prevQuestion={this.prevQuestion}
                noOfLessons={this.getLengthOfCurrentLessonArray()}
              /> : 'Select a unit to begin'}
          </div>
        </div>
      )
    }
    return <div>loading...</div>
  }
}

const mapStateToProps = state => ({
  book: state.lmsContent.book,
  userProgress: state.userProgress,
  currentValues: state.currentValues
});

const mapDispatchToProps = dispatch => {
    return {
      getLmsContent : () => {
        dispatch(getLmsContent())
      },
      fetchUserProgress : () => {
        dispatch(getUserProgress(1))
      },
      putNextQuestion : (fb_id, data) => {
        dispatch(nextQuestion(fb_id, data ))
      },
      setCurrentValues: (key, value) => {
        dispatch(setCurrentValue(key, value))
      }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
