import React from "react";
import {
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogContent,
  withStyles
} from "@material-ui/core";
import Web3 from "web3";
import { Redirect } from "react-router-dom";
import { getContract } from "../getWeb3Utils.js";

const classes = {
  donatePicture: {
    width: "100%",
    height: 200
  },
  donateCard: {
    width: 300,
    minHeight: 400,
    margin: 20
  },
  donateForm: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    flexDirection: "column"
  },
  donateInput: {
    marginBottom: 10,
    width: "95%"
  }
};

class DonateCard extends React.Component {
  state = {
    valueDonate: "",
    checkYourWallet: false,
    confirmDonate: false,
    modal: false
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  donateNow = async () => {
    try {
      this.setState({ modal: true });
      let contract = await getContract();
      const wei = await Web3.utils.toWei(this.state.valueDonate, "ether");
      contract.methods
        .donateValue(this.props.item.id)
        .send(
          { from: this.props.userAddress, value: wei },
          (err, transactionId) => {
            if (err) {
              this.setState({ modal: false });
              return console.log(err);
            }
            console.log(transactionId);
            this.setState({ confirmDonate: true });
            return;
          }
        );
    } catch (err) {
      this.setState({ modal: false });
      alert("Something Wrong");
    }
  };

  withdrawn = async () => {
    try {
      if (this.props.item.valueBalance === 0) {
        alert("No Balance");
        return;
      }
      this.setState({ modal: true });
      let contract = await getContract();
      contract.methods
        .withdrawnDonate(this.props.item.id)
        .send({ from: this.props.userAddress }, (err, transactionId) => {
          if (err) {
            console.log(err);
            this.setState({ modal: false });
            alert("Something wrong");
            return;
          } else {
            console.log(transactionId);
            this.setState({ confirmDonate: true });
            return;
          }
        });
    } catch (err) {
      console.log(err);
      this.setState({ modal: false });
      alert("Something wrong");
    }
  };

  donateOrwith = () => {
    const { item, classes } = this.props;
    if (item.owner === this.props.userAddress) {
      return (
        <Grid
          container
          style={{ paddingTop: 15 }}
          justify="center"
          direction="column"
        >
          <Typography align="center" style={{ paddingBottom: 5 }}>
            Available Balance: {item.valueBalance} ETH
          </Typography>
          <Button onClick={this.withdrawn} variant="contained">
            WITHDRAW
          </Button>
        </Grid>
      );
    } else {
      return (
        <div className={classes.donateForm}>
          <TextField
            value={this.state.valueDonate}
            className={classes.donateInput}
            type="number"
            label="Amount to donate"
            name="valueDonate"
            onChange={e => this.handleInputChange(e)}
          />

          <Button variant="contained" fullWidth onClick={this.donateNow}>
            Donate Now
          </Button>
        </div>
      );
    }
  };

  render() {
    const { item, classes } = this.props;
    if (this.state.confirmDonate) return <Redirect to="/newhelpconfirm" />;
    if (item.description === "pending") return null;

    return (
      <Grid container className={classes.donateCard} direction="column">
        <Paper elevation={10} style={{ height: "100%", position: "relative" }}>
          <img
            src={item.imgData}
            className={classes.donatePicture}
            alt="Animal"
          />

          <Typography style={{ padding: 10 }}>{item.description}</Typography>

          <Grid container justify="center" alignContent="center">
            <Typography>Value Request: {item.valueRequest} ETH</Typography>
            <Typography>Value Filled: {item.valueFunded} ETH</Typography>

            {this.donateOrwith()}
          </Grid>
        </Paper>

        <Dialog open={this.state.modal}>
          <DialogContent>
            <Typography align="center" style={{ padding: 10 }}>
              Check your Wallet
            </Typography>
          </DialogContent>
        </Dialog>
      </Grid>
    );
  }
}

export default withStyles(classes)(DonateCard);
