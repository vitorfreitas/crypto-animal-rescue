import React from "react";
import NewAnimalHelp from "./components/NewAnimalHelp";
import Home from "./components/Home";
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { HashRouter, Switch, Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  heading: {
    textDecoration: "none",
    color: "#000"
  },
  appBarButton: {
    fontSize: 10,
    marginLeft: "auto"
  }
}));

function App(props) {
  const classes = useStyles(props);
  const [modal, setModalVisibility] = React.useState(false);

  const toggleModal = () => {
    setModalVisibility(!modal);
  };

  return (
    <HashRouter>
      <Switch>
        <Grid container>
          <CssBaseline />

          <AppBar position="static" color="default">
            <Toolbar>
              <Link to="/" className={classes.heading}>
                <Typography variant="h6" color="inherit">
                  Crypto Animal Rescue
                </Typography>
              </Link>

              <Button
                onClick={toggleModal}
                className={classes.appBarButton}
                variant="contained"
              >
                New Animal Help
              </Button>
            </Toolbar>
          </AppBar>

          <Home />

          <NewAnimalHelp open={modal} onClose={toggleModal} />
        </Grid>
      </Switch>
    </HashRouter>
  );
}

export default App;
