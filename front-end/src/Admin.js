import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import { Button } from 'react-bootstrap';
import Switch from '@material-ui/core/Switch';
import { Container } from 'react-bootstrap';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LINK from './link'
const FileDownload = require('js-file-download')
export default class Admin extends Component{
    constructor(){
        super()
        this.state = {
            UserName : '' ,
            Initial : true,
            CompName: '',
            No_Teams:'',
            No_Judges:'',
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
            dbOutputFile: null,
            autojudge : false,
            Started : false
        }   
        this.componentWillMount = this.componentWillMount.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.removeTeam = this.removeTeam.bind(this)
        this.removeJudge = this.removeJudge.bind(this)
        this.removeProblem = this.removeProblem.bind(this)
        this.handleToggle = this.handleToggle.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.DownloadPasswords = this.DownloadPasswords.bind(this)
        this.openScoreBoard = this.openScoreBoard.bind(this)
    }
    openScoreBoard(){
        window.open(`http://check-mate.ml/Scoreboard/${this.state.CompName}`)
    }
    handleStart(){
        this.setState({Started:!this.state.Started})
        axios.post(LINK + 'togglecompstatus' , {
            Competition : this.state.CompName,
            Value : !this.state.Started
        })
    }
    DownloadPasswords(){
        axios.get(LINK + 'getPasswords' , {
            params:{
                Competition : this.state.CompName
            }
        })
        .then((response) => {
            FileDownload(response.data, 'Passwords.csv');
       })
       .catch(err=>{
           console.log(err)
       })
    }
    componentWillMount(){
        this.setState({UserName:this.props.UserName})
    }
    componentDidMount(){
          axios.get(LINK + 'checkcomp' , {
              params:{
                  Name : this.state.UserName
              }
          })
          .then((d)=>{
              if(d.data !== '404'){
                  this.setState(d.data)
              }
          })
          .catch(err=>{
              console.log(err)
          })
    }
    removeTeam(event){
        const name = event.target.id
        axios.post( LINK + 'removeTeam' , {
            Competition : this.state.CompName,
            UserName : name
        })
        .then(d =>{
            if(d.data){
                var Teams = this.state.Teams
                var New_Teams = Teams.filter(el => el.UserName !== name)
                this.setState({Teams : New_Teams})
            }
        })
        .catch(err =>{
            console.log(err)
        })
    }
    removeJudge(event){
        const name = event.target.id
        axios.post( LINK + 'removeJudge' , {
            Competition : this.state.CompName,
            UserName : name
        })
        .then(d =>{
            if(d.data){
                var Judges = this.state.Judges
                var New_Judges = Judges.filter(el => el.UserName !== name)
                this.setState({Judges : New_Judges})
            }
        })
        .catch(err =>{
            console.log(err)
        })
        
        // console.log(event.target.id)
    }
    removeProblem(event){
        const name = event.target.id
        axios.post( LINK + 'removeProblem' , {
            Competition : this.state.CompName,
            ProblemName : name
        })
        .then(d =>{
            if(d.data){
                var Problems = this.state.Problems
                var New_Problems = Problems.filter(el => el.ProblemName !== name)
                this.setState({Problems : New_Problems})
            }
        })
        .catch(err =>{
            console.log(err)
        })
        
        // console.log(event.target.id)
    }
    handleToggle(e){
        // console.log(e.target.checked)
        axios.post( LINK + 'ToggleAutoJudge' , {
            Competition : this.state.CompName,
            Value : !this.state.autojudge
        })
        this.setState({autojudge:!this.state.autojudge})
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
            case 'autojudge':
                this.setState({autojudge: !this.state.autojudge})
                break;
            default:
                break;
        }
    }
    render(){
        var message = "Stop"
        if (this.state.Started === false){
            message = "Start"
        }
        return(
            <div>
                { this.state.Initial ?(
                    <div id= "INITIALINFO" className = "DivWithBackground">
                        <Container  className = "AdminForm">
                                <center><h3>Please enter the Initial Information of the Competition</h3></center>
                                <form Name = "INITIALINFO" onSubmit = {this.handleSubmit}>
                                    <input className ="initialForm" Name = "NAME" placeholder ="Competition Name" type = 'text' onChange={this.handleChange} required= "true"></input>
                                    <input className ="initialForm" Name = "noTeams" placeholder ="Number of Teams" type = 'text' onChange={this.handleChange} required= "true" ></input>
                                    <input className ="initialForm" Name = "noJudges" placeholder ="Number of Judges" type = 'text' onChange={this.handleChange} required= "true"></input>
                                    <input type="checkbox" name="autojudge" onChange={this.handleChange}></input> Auto Judge ?<br></br>
                                    <input className ="initialFormSubmit" type = 'Submit' value = "Save Competition"></input>
                                </form>
                        </Container>
                    </div>
                ):( 
                    <div>
                        <center> <div className = "CompDashboard"><h2> Welcome to {this.state.CompName} Dashboard</h2></div></center>
                        <div>
                            <Button className= "ScoreboardButton1" variant="secondary" onClick = {this.openScoreBoard}> Scoreboard</Button>
                            <div className = "AutoJudge">
                            <h3 >AutoJudge
                                <Switch
                                    checked={this.state.autojudge}
                                    onChange={this.handleToggle}
                                    value="checkedB"
                                    color="primary"
                                />
                            </h3> 
                            </div>
                            <br></br>
                            <Button onClick = {this.DownloadPasswords} className= "DownloadButton" variant="secondary" size="" href="#">
                            Download Passwords
                            </Button>
                            <Button className= {message} variant="secondary" size="" onClick = {this.handleStart}>
                            {message} Competition
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
                                        {this.state.Judges.map(j=> <li onClick = {this.removeJudge} id={j.UserName} className = "listElem"> {j.UserName } </li>)}
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
                                        <input className = "dashboardSubmit" type = 'Submit' value = "Create"></input>
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
                                        {this.state.Teams.map(T=> <li onClick = {this.removeTeam} id ={T.UserName} className = "listElem"> {T.UserName } </li>)}
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
                                            {this.state.Problems.map(P => <li onClick = {this.removeProblem} id ={P.ProblemName} className = "listElem"> {P.ProblemName } </li>)}
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