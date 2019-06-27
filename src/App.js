import React from "react";
import NewAnimalHelp from "./components/NewAnimalHelp";
import Home from "./components/Home";
import { CssBaseline, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  heading: {
    textDecoration: "none",
    color: "#000"
  },
  appBarButton: {
    fontSize: 10,
    marginLeft: "auto"
  },
  newAnimalHelpFab: {
    position: "fixed",
    bottom: 20,
    right: 20
  },
  newAnimalHelpFabIcon: {
    marginRight: 10
  }
}));

function App(props) {
  const classes = useStyles(props);
  const [modal, setModalVisibility] = React.useState(false);

  const toggleModal = () => {
    setModalVisibility(!modal);
  };

  return (
    <div>
      <CssBaseline />

      <Home />

      <Fab
        onClick={toggleModal}
        variant="extended"
        color="primary"
        className={classes.newAnimalHelpFab}
      >
        <AddIcon className={classes.newAnimalHelpFabIcon} />
        New Animal Help
      </Fab>

      <NewAnimalHelp open={modal} onClose={toggleModal} />
    </div>
  );
}

export default App;
