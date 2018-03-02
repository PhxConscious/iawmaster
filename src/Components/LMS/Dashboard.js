import React from 'react';
import configUnitCards from '../../config/unitCards';
import configUserProgess from '../../config/userProgress';
import LmsCard from '../Reusable/LmsCard';
import '../../Styles/LmsCardsStyles.css';
import LessonContent from './LessonContent';


class Dashboard extends React.Component {
  constructor(props){
    super(props)
    this.state= {
      active: null,
      tasks: [],
      readyForRender: false,
      currentUnit: '',
      currentLesson: '',
    }
    this.selectCardOnClick = this.selectCardOnClick.bind(this)
    this.combineUserDataAndTaskData = this.combineUserDataAndTaskData.bind(this);

  }

  // this must update when a unit is finished (not just
  // initial rendering) - see if this works
  componentDidMount(){
    this.combineUserDataAndTaskData()
  }

  combineUserDataAndTaskData(){
    // temp data to simulate server
    let tasks = Object.keys(configUserProgess.progress);
    // taskArr combines server data with local data
    let taskArr = [];

    // find units on react but not in DB. add to tasks arr.
    // now we can update react and it renders automatically
    // we must post this to server later
    configUnitCards.forEach(card => {
      if(tasks.indexOf(card.id) == -1){
        tasks.push(card.id)
      }
    })

    // match up server data and local data to make one array
    // of task objecs which include a "completed" value (boolean)
    tasks.forEach(task => {
      configUnitCards.forEach(card => {
        if(card.id === task) {
          console.log("task", configUserProgess.progress[task].lessons)
          let key = card.id;
          taskArr.push({
            userProgress: {
              name: key,
              isCompleted: configUserProgess.progress[task].unitCompleted,
              lessons: configUserProgess.progress[task].lessons
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

    // console.log("taskArr", taskArr)

    let activeTask = null;
    // sets the initial active unit
    for(let i = 0; i < taskArr.length; i++){
      if(taskArr[i].userProgress.isCompleted === false && taskArr[i-1].userProgress.isCompleted === true){
        activeTask = taskArr[i].title;
        i = tasks.length;
      }
    }

    this.setState({
      ...this.state,
      tasks: taskArr,
      readyForRender: true,
      active: activeTask
    })
  }

  // updates state.lesson only when necessary
  componentDidUpdate(prevProps, prevState){
    if(this.state.active !== prevState.active){
          this.getInitialActiveLesson();
    }
  }

  // puts the active/selected lesson in state
  getInitialActiveLesson(){
    this.state.tasks.forEach(task => {
      if(task.title === this.state.active){

        // this block finds the first lesson from userProgress that
        // isn't complete.
        let lessons = task.userProgress.lessons;
        let firstIncompleteLesson = null;
        for(let i = lessons.length -1; i >= 0; i--){
          let lessonKey = Object.keys(lessons[i]);
          if(lessons[i][lessonKey]===false){
            firstIncompleteLesson=lessonKey[0];
          }
        }

        // determines what the inital currentLesson will be
        task.lessons.forEach((lesson, index) => {

          if (lesson.id === firstIncompleteLesson){
            this.setState({
              ...this.state,
              currentLesson: index.toString()
            })
          }
        })

      }
    })
    this.forceUpdate();
  }



  selectCardOnClick(value){
    this.setState({
      ...this.state,
      active: value
    })
  }


  render() {
    console.log("state:", this.state)
    let { active, tasks, readyForRender, currentLesson } = this.state;

    let lmsCards = null;

    if(readyForRender){
      lmsCards = tasks.map((card, i) => {
        return <LmsCard
          title={configUnitCards[i].title}
          description={configUnitCards[i].description}
          image={configUnitCards[i].image}
          onClick={this.selectCardOnClick}
          value={configUnitCards[i].title}
          active={active === configUnitCards[i].title ? true : false}
          completed={card.userProgress.isCompleted}
        />
      })
    }



    // if (currentLesson) {
    //   console.log('lesson', currentLesson, currentLesson[0].title)
    // }

    return(
      <div className="background">
        <div id="spacer"></div>
        <div className="unitCardsContainer">
                {lmsCards}
        </div>

        <div className="lessonContentContainer">
          {currentLesson ? <LessonContent
              currentLesson={currentLesson}
              lesson={configUnitCards}
            /> : 'nope'}
        </div>
      </div>
    )
  }
}

export default Dashboard;
