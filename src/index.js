import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import listImg from './listImage.json';

function addClassById(id,classTag) {
  console.log(id,"",classTag)
  var element = document.getElementById(id);
  element.classList.add(classTag);
} 
async function removeClassById(id,classTag){
  var element = document.getElementById(id);
  element.classList.remove(classTag);
}

class Square extends React.Component {
   
   render() {
    const card="https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger-l10-website/en-gb/production/en-gb/static/placeholder-1c66220c6149b49352c4cf496f70ad86.jpg";

    return (
      <button id={this.props.square.id} className={`square ${this.props.square.etat===0 ? "pointer " :"" } ${this.props.square.etat===0 ? "square-card" :"" }`} onClick={() => {this.props.updateBoard(this.props.index)}}>
        {this.props.square.etat === 0 ? 
        <img src={card} alt="new" width="125" heigth="125"></img>
         : this.props.square.etat ===2 ? null : <img src={this.props.square.value} alt="new" width="125" heigth="125"></img>}
      </button>
    );
  }
}
  
  class Board extends React.Component {
        constructor(props) {
            super(props);
            const width = this.props.width
            const height = this.props.height
            
            const nbImage=width*height%2 ===0 ? width*height : width*height-1
            
            
            const arrayNbImage=[]
            const tabImage=listImg
            shuffleArray(tabImage)
            
            const arrayNumber=[]
            for(let i = 0; i< nbImage; i++){
              arrayNumber.push(i)
              if( i < nbImage/2){
                arrayNbImage.push(tabImage[i])
              }
              if( i>= nbImage/2){
                arrayNbImage.push(tabImage[i-(nbImage/2)])
              }
            }
            shuffleArray(arrayNbImage)
            
            const testTable=[]
            
            const table = (testTable) => arrayNumber.map(x => testTable.push({id: arrayNumber[x], value: arrayNbImage[x]["url"] , etat: 0, name:arrayNbImage[x]["name"]})) 
            table(testTable)
            
            this.state = {
                table : testTable,
                player : this.props.player,
                currentPlayer : {id:0},
                hard : this.props.hard,
                predict :""
            };
        }
   async updateBoard(i) {
        this.setState(async(prevstate,props) => {
          console.log("je rentre")
            const newState=Object.assign({},prevstate)
            const etatTable = prevstate.table.filter(x => x.etat === 1);
            
            if (etatTable.length<1){
                // first Move
                console.log("first Click")
                if (prevstate.table[i].etat === 2){
                  return newState
                }
                newState.table[i].etat=1;
                console.log("first",newState)
                return newState

            } else if (etatTable.length === 1){
                // second Move
                if (prevstate.table[i].etat === 2){
                  return newState
                }
                if(prevstate.table[i].etat === 1){
                    return newState
                } else {
                  newState.table[i].etat=1;
                  return newState
                }
            } else{
                return this.validateClick(prevstate)
              }
        })
        
    }
    validateClick(prevstate) {
      const newState=Object.assign({},prevstate)
      const etatTable = prevstate.table.filter(x => x.etat === 1);
      const nameChamp=newState.table[0].name
      const predictName=this.state.predict
      const validateName = () => predictName===nameChamp? true: false
      
      if (etatTable[0].value===etatTable[1].value ){
          //win this cards
          
          newState.table[etatTable[0].id].etat= 2
          newState.table[etatTable[1].id].etat= 2
          if(this.state.hard){
            const point= () => validateName()?8:3
            return this.incrementScore(newState,point())
          }
          return this.incrementScore(newState,3)
          
      }else {
          //loose next player
          
          newState.table[etatTable[0].id].etat=0
          newState.table[etatTable[1].id].etat=0
          
          const newStateIncremented= this.incrementScore(newState,-1)
          
          return this.playerTurn(newStateIncremented,1) ;
      }
      
    }

    playerTurn(prevstate){
        // increment by one the id of player 
        const newState=Object.assign({},prevstate)
        const len=newState.player.length;
        
        if (prevstate.currentPlayer.id === prevstate.player[len-1].id ){
            newState.currentPlayer.id = prevstate.player[0].id 
        }else {
            newState.currentPlayer.id = prevstate.currentPlayer.id + 1;  
        }

        return newState
    }
    incrementScore(prevstate,point){
        const newState=Object.assign({},prevstate)
        newState.player[newState.currentPlayer.id].score = newState.player[newState.currentPlayer.id].score + point;

        return newState
    }

    renderSquare(i) {
      return <Square square={this.state.table[i]} table={this.state.table} index={i} idJoueur= {this.state.currentPlayer.id} updateBoard= {() => this.updateBoard(i)} />;
    }
    createLine(i,width,height){
      const renderTable=[]
      const nbCard=width*height%2 === 0 ? width*height : width*height-1
      for(let f=i*height;f<i*height+height;f++)
        {
          if(f===nbCard){
            
          }
          else{
            renderTable.push(this.renderSquare(f))
          }
        }
        return renderTable
    }
    createLines(width,height){
      const renderLines=[]
      for( let i=0;i< width ;i++){
         renderLines.push(<div className="board-row">{this.createLine(i,width,height)}</div>)
        }
      
      return renderLines
    }
    addPrediction(event){
      this.setState({predict: event.target.value})
    }
    resetGame(){
      window.location.reload();
    }
    render() {
      let play=""
      let inputRender=""
      if(calculateEndgame(this.state.table)){
        const result=calculateScore(this.state)
        play= <div className="play">Résultat: 
          {`le joueur ${result}`}
        </div>
      }
      else{
        play= <div className="play">{this.createLines(this.props.width,this.props.height)}</div>
        const hardInput=<form>Ecris correctement le nom du personnage trouvé pour gagner 5 points bonus
          <input name="hardPrediction" id="hardPred" onChange={this.addPrediction.bind(this)} required ></input>
          <input type="submit" ></input></form>;
        const inputTernaire= ()=> this.state.hard?hardInput:""  
        inputRender=inputTernaire()
      }
        const players = this.state.player
        const quiJoue = (id) => this.state.currentPlayer.id === id ? "<-Play" :""
        const playerInfo= (players) => players.map(x => <tr><td> {`${x.name} `}</td> <td>{` score: ${x.score}`}</td><td>{quiJoue(x.id)}</td></tr>);
      return (
        <div>
          <div class="table">
          {playerInfo(players)}
          </div>

          <div >
          {play}
          {inputRender}
          </div>
          <div className="leftBlock">
            <button id="reset" value="Recommencer" onClick={() => this.resetGame()}><img width="20" heigth="20" src="https://img.over-blog-kiwi.com/0/64/48/33/20180321/ob_dbb102_images.png"></img>
            </button>
          </div>
        </div>
      );
    }
  };
  
  class Game extends React.Component {
    constructor() {
      super();
      
      this.state = {
          gameSelect : true,
          width: 2,
          height: 2,
          nbJoueur: 1,
          player:[{id: 0,name:`joueur 1`,score:0}]
      }
      
      
    }
    loadPlayer(prevstate){
      
        const newState=Object.assign({},prevstate)
        if (this.state.nbJoueur === 3){
          newState.player=[{id: 0,name:`joueur 1`,score:0}]
        }
        if (this.state.nbJoueur <3 ){
          newState.player.push({id: this.state.nbJoueur,name:`joueur ${this.state.nbJoueur + 1}`,score:0})
        }
      return newState
    }
    changeWidth(event){
      this.setState({width: parseInt(event.target.value)})
    }
    changeHeight(event){
      
      this.setState({height: parseInt(event.target.value)})
    }
    changePseudo(event,i){
      let change=[]
      change[i]=event.target.value
      console.log(change)
      this.setState(change)
    }
    handleSubmit() {
        this.setState({gameSelect : false});
        
      }
    updateNumberPlayer(){

      this.setState((prevstate) => {
        const newState=Object.assign({},prevstate)
        if(prevstate.nbJoueur === 3){
          newState.nbJoueur=1
        }
        else{
          newState.nbJoueur=newState.nbJoueur + 1
        }
        const statePlayerload=this.loadPlayer(newState)
        return statePlayerload
      })
    }
    renderInput(i) {
      return <input name="name" id={i} onChange={() => {this.changePseudo.bind(this,i)}} required ></input> 
    }
    hardMode(){
      this.setState((prevstate) => {
        const newState=Object.assign({},prevstate)
        if(prevstate.hardcore){
          newState.hardcore= false
        }
        else{
          newState.hardcore=newState.hardcore= true
        }
        return newState
      })
    }
    gameSelect(){
      
      const renderListInput =[]
      for( let i=0;i< this.state.nbJoueur ;i++){
       renderListInput.push(this.renderInput(i))
       }
       
      if(this.state.gameSelect ){
///const table = (testTable) => arrayNumber.map(x => testTable.push({id: arrayNumber[x], value: arrayNbImage[x]["url"] , etat: 0})) 
        
        return <div>
          <div>
          <button className={"button"} id="nbJoueur" onClick={() => this.updateNumberPlayer()}> 
            {this.state.nbJoueur === 1 ? "1 Joueur" : this.state.nbJoueur === 2 ?"2 Joueur": "3 Joueur"}
          </button>
          <button id="hard" value={this.state.hardcore} onClick={() => this.hardMode()}>Hardcore Mode:
            {this.state.hardcore ? "ON " : "OFF"}
          </button></div>
          <form id="selectGame" onSubmit={this.handleSubmit.bind(this)}> Choisis les dimensions du plateau (h x l)
          <input name="select" id="width" type="number"min="2" max="8" value={this.state.width} onChange={this.changeWidth.bind(this)} required ></input>{` x `} 
          <input name="select" id="heigth" type="number"min="2" max="8" value={this.state.height} onChange={this.changeHeight.bind(this)} required ></input>       
          <input type="submit" value="Lancer la partie" ></input></form> 
          
          </div>
      }
      return ""
    }
    render() {
      
      return (
        <div className="game">
          <h2>Bienvenue dans Memory League</h2>
          <div >
            {this.gameSelect()}
          </div>
          <div className="game-board">
            {this.state.gameSelect ? "" :<Board player={this.state.player} width={this.state.width} hard={this.state.hardcore} height={this.state.height}/>}
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateEndgame(squares) {

    const tableVide = squares.filter(x => x.etat === 2);
    if (tableVide.length===squares.length ){
      return true;
    }
    return false;
}
function calculateScore(state){
  let winner=""
  let max=0 
  for ( let i=0;i<state.player.length;i++){
    max=state.player[i].score >max ? state.player[i].score: max
  }
  for ( let i=0;i<state.player.length;i++){
    if(max === state.player[i].score){
      winner= `${state.player[i].name} à gagner la partie avec ${max} points`
      return winner
    }
  }

}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function validateNameChamp(inputName,id){
  
  for (let i=0;i<listImg.length;i++){
    console.log(listImg[i]["id"]," ====",id)
    if(listImg[i]["id"]===id){
      
      if(listImg[i]["name"]==inputName){
        return true
      }
      else{
        return false
      }
    }
    continue
  }
  return false
}