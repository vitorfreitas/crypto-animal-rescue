import React from 'react';
import './App.css';
import NewAnimalHelp from './NewAnimalHelp';
import Home from './Home';
import { Grid, AppBar, Toolbar, Typography, Button, Dialog, DialogContent } from '@material-ui/core';
import { Route, HashRouter, Switch, Link } from 'react-router-dom'
import ConfirmationNewHelp from './ConfirmationNewHelp';

class App extends React.Component {
  state = {
    modal:false
  }

  handleClose = () => {
    this.setState({modal:false})
  }

  openModal = () => {
    this.setState({modal:true})
  }
  
  render(){
  return (
    <HashRouter>
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
            <Button onClick={this.openModal} style={{fontSize:10}} variant="contained">New Animal Help</Button>
        </Toolbar>
      </AppBar>
    
    <Home/>

    <Dialog open={this.state.modal} onClose={this.handleClose}>
    <DialogContent>
      <NewAnimalHelp/>
    </DialogContent>  
    </Dialog>     

    </Grid>
    </Switch>
    </HashRouter>
  );
  }
}

export default App;
