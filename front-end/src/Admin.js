import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import { Button } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LINK from './link'
// const LINK = 'http://10.130.60.5:8300/'
export default class Admin extends Component{
    constructor(){
        super()
        this.state = {
            UserName : '' ,
            Initial : true,
            CompName: '',
            No_Teams:'',
            No_Judges:'',
            Duration: '',
            Teams: null,
            Judges: null,
            Problems:[],
            dbTeamName: null ,
            dbTeamPassword:null,
            dbTeamScore: null,
            dbJudgeName : null,
            dbJudgePassword: null,
            dbProblemName : null,
            dbInputFile: null,
            dbOutputFile: null

        }
        this.componentWillMount = this.componentWillMount.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this)

    }
    componentWillMount(){
        this.setState({UserName:this.props.UserName})
    }
    componentDidMount(){
          axios.get(LINK + 'checkcomp' , {
              params:{
                  "Name" : this.state.UserName
              }
          })
          .then((d)=>{
              if(d.data !== '404'){
                  this.setState(d.data)
                //   this.setState({Problems:[{Name:"Problem 1"} ,{Name:"Problem 1"} ,{Name:"Problem 1"} , {Name :"Problem 2"}]})
              }
          })
          .catch(err=>{
              console.log(err)
          })
    }
    handleSubmit(event){
        event.preventDefault()
        switch(event.target.name){
            case 'INITIALINFO':
                axios.post(LINK + 'CompInitials' , this.state)
                .then((d)=>{
                    this.setState(d.data)
                })
                .catch(err=>{
                    console.log(err)
                })
                // document.getElementById("INITIALINFO").reset();
                break;
            case 'DBTEAM':
                // console.log('NEW TEAM')
                const Teamdata = {
                    Competition : this.state.CompName,
                    UserName    : this.state.dbTeamName,
                    Password    : this.state.dbTeamPassword,
                    Solved      : [],
                    Score       : this.state.dbTeamScore
                }
                axios.post(LINK + 'NewTeam' , Teamdata)
                let d = this.state.Teams
                d.push({
                    UserName :this.state.dbTeamName,
                    Password: this.state.dbTeamPassword
                })
                this.setState({
                    Teams:d,
                    dbTeamName: null ,
                    dbTeamPassword:null,
                    dbTeamScore: null,

                })
                document.getElementById("DBTEAM").reset();
                break;
            case 'DBJUDGE':
                // console.log('NEW JUDGE')
                const JudgeData = {
                    Competition : this.state.CompName,
                    UserName    : this.state.dbJudgeName,
                    Password    : this.state.dbJudgePassword
                }
                axios.post(LINK + 'NewJudge' , JudgeData)
                d = this.state.Judges
                d.push({
                    UserName :this.state.dbJudgeName,
                    Password: this.state.dbJudgePassword
                })
                this.setState({
                    Judges : d,
                    dbJudgeName: null ,
                    dbJudgePassword:null,
                })
                document.getElementById("DBJUDGE").reset();
                break;
            case 'DBPROB':
                const p = {
                    ProblemName: this.state.dbProblemName
                }
                let formDataInput = new FormData();
                let formDataOutput = new FormData();
                formDataInput.append('Competition', this.state.CompName);
                formDataInput.append('ProblemName', this.state.dbProblemName);
                formDataInput.append('InputFile', this.state.dbInputFile);

                formDataOutput.append('Competition', this.state.CompName);
                formDataOutput.append('ProblemName', this.state.dbProblemName);
                formDataOutput.append('OutputFile', this.state.dbOutputFile);
                
                axios.post(LINK + 'ProbInput' , formDataInput)
                .then(d =>{
                    axios.post(LINK + 'ProbOutput' , formDataOutput)
                    .then(d => {
                        var probs = this.state.Problems
                        probs.push(p)
                        this.setState({Problems : probs})
                    })
                    .catch(e => console.log(e))  
                })
                .catch(e => console.log(e))
                document.getElementById("DBPROB").reset();
                break;
            default:
                break;
        }
    }
    handleChange(e){
        switch(e.target.name){
            case 'NAME':
                this.setState({CompName: e.target.value})
                break;
            case 'noTeams':
                this.setState({No_Teams: e.target.value})
                break;
            case 'noJudges':
                this.setState({No_Judges: e.target.value})
                break;
            case 'Duration':
                this.setState({Duration: e.target.value})
                break;
            case 'dbTeamName':
                this.setState({dbTeamName: e.target.value})
                break;
            case 'dbTeamPassword':
                this.setState({dbTeamPassword: e.target.value})
                break;
            case 'dbTeamScore':
                this.setState({dbTeamScore: e.target.value})
                break;
            case 'dbJudgeName':
                this.setState({dbJudgeName: e.target.value})
                break;
            case 'dbJudgePassword':
                this.setState({dbJudgePassword: e.target.value})
                break;
            case 'dbProblemName':
                this.setState({dbProblemName: e.target.value})
                break;
            case 'dbInputFile':
                this.setState({dbInputFile: e.target.files[0]})
                break;
            case 'dbOutputFile':
                this.setState({dbOutputFile: e.target.files[0]})
                break;
            default:
                break;
        }
    }
    render(){
        return(
            <div>
                { this.state.Initial ?(
                    <div id= "INITIALINFO" className = "DivWithBackground">
                        <Container  className = "AdminForm">
                                <form Name = "INITIALINFO" onSubmit = {this.handleSubmit}>
                                    <input className ="initialForm" Name = "NAME" placeholder ="Competition Name" type = 'text' onChange={this.handleChange} required= "true"></input>
                                    <input className ="initialForm" Name = "noTeams" placeholder ="Number of Teams" type = 'text' onChange={this.handleChange} required= "true" ></input>
                                    <input className ="initialForm" Name = "noJudges" placeholder ="Number of Judges" type = 'text' onChange={this.handleChange} required= "true"></input>
                                    <input type="checkbox" name="vehicle1" value="Bike"></input> Auto Judge In the Start?<br></br>
                                    <input className ="initialForm" Name = "Duration" placeholder ="Duration" type = 'text' onChange={this.handleChange} required= "true"></input>
                                    <input className ="initialFormSubmit" type = 'Submit' value = "Save Competition"></input>
                                </form>
                        </Container>
                    </div>
                ):( 
                    <div>
                        <center><h2> {this.state.CompName} </h2></center>
                        <div>
                            <br></br>
                            <Button className= "DownloadButton" variant="secondary" size="" href="#">
                            Download Passwords
                            </Button>
                            <Button className= "StartButton" variant="secondary" size="" href="#">
                            Start Competition
                            </Button>
                        </div>
                        
                        <div className = "Dashboard-elem">
                        <div className = "SUM">
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <div className = "NAMETAG" ><h3>Add a Judge</h3></div>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <form className = "DBFORM" id= "DBJUDGE" Name ="DBJUDGE" onSubmit = {this.handleSubmit}>
                                        <input className = "dashboard-form" Name = "dbJudgeName" placeholder ="Judge Name" type = 'text' onChange={this.handleChange} required= "true"></input>
                                        <input className = "dashboard-form" Name = "dbJudgePassword" placeholder ="Password" type = 'text' onChange={this.handleChange} required= "true" ></input>
                                        <input className = "dashboard-formSubmit" type = 'Submit' value = "Create"></input>
                                    </form>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                        <div className = "SUM">
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <div className = "NAMETAG" ><h3>Remove a Judge</h3></div>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <div className = "scrollable">
                                        {this.state.Judges.map(j=> <li id={j.UserName} className = "listElem"> {j.UserName } </li>)}
                                    </div>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                           
                        </div>
                        <div className = "Dashboard-elem">
                        <div className = "SUM">
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <div className = "NAMETAG"><h3>Add a Team</h3></div>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <form className = "DBFORM" id= "DBTEAM" Name ="DBTEAM" onSubmit = {this.handleSubmit}>
                                        <input className = "dashboard-form" Name = "dbTeamName" placeholder ="Team Name" type = 'text' onChange={this.handleChange} required= "true"></input>
                                        <input className = "dashboard-form" Name = "dbTeamPassword" placeholder ="Password" type = 'text' onChange={this.handleChange} required= "true" ></input>
                                        <input className = "dashboard-form" Name = "dbTeamScore" placeholder ="Initial Score" type = 'text' onChange={this.handleChange} required= "true"></input>
                                        <input className = "dashboard-formSubmit" type = 'Submit' value = "Create"></input>
                                    </form>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                        <div className = "SUM">
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <div className = "NAMETAG"><h3>Remove a Team</h3></div>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails >
                                <div className = "scrollable">
                                        {this.state.Teams.map(T=> <li id ={T.UserName} className = "listElem"> {T.UserName } </li>)}
                                </div>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                            
                        </div>
                        <div className = "Dashboard-elem">
                            <div className = "SUM">
                                <ExpansionPanel>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <div className = "NAMETAG" ><h3>Add Problem</h3></div>
                                        </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <form id= "DBPROB" Name ="DBPROB" onSubmit = {this.handleSubmit}>
                                            <input className = "dashboard-form" Name = "dbProblemName" placeholder ="Problem Name" type = 'text' onChange={this.handleChange} required= "true"></input>
                                                <h6>Input File</h6>
                                            <input className = "dashboardfile-form" Name = "dbInputFile" type = 'file' onChange={this.handleChange} required= "true" ></input>
                                                <h6>Output File</h6> 
                                            <input className = "dashboardfile-form" Name = "dbOutputFile" type = 'file' onChange={this.handleChange} required= "true" ></input>
                                            <input className = "dashboard-formSubmit" type = 'Submit' value = "Create"></input>
                                        </form>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </div>
                            <div className = "SUM">
                                <ExpansionPanel>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <div className = "NAMETAG" ><h3>Remove Problem</h3></div>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <div className = "scrollable">
                                            {this.state.Problems.map(P => <li id ={P.ProblemName} className = "listElem"> {P.ProblemName } </li>)}
                                        </div>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </div>
                        </div>
                    </div>
                        
                )}
            </div>
        )
    }
}