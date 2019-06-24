import React from 'react';
import './App.css';
import NewAnimalHelp from './NewAnimalHelp';
import Home from './Home';
import { Grid, AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { Route, BrowserRouter, Switch, Link } from 'react-router-dom'
import ConfirmationNewHelp from './ConfirmationNewHelp';

function App() {
  

  return (
    <BrowserRouter>
    <Switch>
    <Grid container>
    <AppBar position="static" color="default">
        <Toolbar>
        <div style={{ flex: 1 }}>
          <Link to="/">
          <Typography variant="h6" color="inherit">
            Crypto Animal Rescue
          </Typography>
          </Link>
          </div>
          <Link to="/newhelp">
            <Button style={{fontSize:10}} variant="contained">New Animal Help</Button>
            </Link>
        </Toolbar>
      </AppBar>
    
    <Route exact path="/" render={()=> <Home/>}/>    
    <Route exact path="/newhelp" render={()=> <NewAnimalHelp/>}/>    
    <Route exact path="/newhelpconfirm" render={()=> <ConfirmationNewHelp/>}/>    

    </Grid>
    </Switch>
    </BrowserRouter>
  );
}

export default App;
