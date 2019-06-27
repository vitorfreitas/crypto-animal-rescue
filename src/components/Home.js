import React from "react";
import {
  Grid,
  Typography,
  Dialog,
  DialogContent,
  withStyles
} from "@material-ui/core";
import Web3 from "web3";
import DonateCard from "./DonateCard";
import { getWeb3, getContract, getArweave } from "../utils/getWeb3Utils";

const classes = {
  heading: {
    margin: "15px 0 10px",
    fontSize: "2.5rem",
    "@media (max-width: 396px)": {
      fontSize: "1.8rem"
    }
  },
  subheader: {
    padding: "0 40px 15px",
    fontSize: "1.5rem",
    color: "rgba(0,0,0,.75)",
    "@media (max-width: 768px)": {
      fontSize: ".8rem"
    }
  }
};

class Home extends React.Component {
  state = {
    loading: true,
    data: [],
    notAuthorize: false,
    noWeb3: false,
    waitingAuth: false,
    ethereumAddress: "",
    loginTrue: false,
    NewHelpConfirm: false,
    modal: true
  };

  async componentDidMount() {
    try {
      await this.loadWallet();
      await this.getContractInfo();
    } catch (err) {
      console.log(err);
    }
  }

  async loadWallet() {
    this.setState({ notAuthorize: false });
    let accounts;
    let network;
    if (!window.ethereum && !window.web3) {
      return this.setState({ noWeb3: true });
    } else if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        this.setState({ waitingAuth: true });
        await window.ethereum.enable();
        accounts = await web3.eth.getAccounts();
        network = await web3.eth.net.getNetworkType();
        if (network === "rinkeby") {
          return this.setState({
            ethereumAddress: accounts[0],
            waitingAuth: false,
            modal: false
          });
        } else {
          return this.setState({
            ethereumAddress: accounts[0],
            waitingAuth: false,
            modal: true,
            wrongNetwork: true
          });
        }
      } catch (err) {
        console.log(err);
        return this.setState({ notAuthorize: true, waitingAuth: false });
      }
    } else if (window.web3) {
      const web3 = new Web3(window.web3.currentProvider);
      accounts = await web3.eth.getAccounts();
      network = await web3.eth.net.getNetworkType();
      if (network === "rinkeby") {
        return this.setState({
          ethereumAddress: accounts[0],
          waitingAuth: false,
          modal: false
        });
      } else {
        return this.setState({
          ethereumAddress: accounts[0],
          waitingAuth: false,
          modal: true,
          wrongNetwork: true
        });
      }
    } else {
      return this.setState({ notAuthorize: true, waitingAuth: false });
    }
  }

  getContractInfo = async () => {
    try {
      let contract = await getContract();
      let result = await contract.methods.getDonateObjects().call();
      let data = [];
      result.map(item => data.push(this.getData(item)));
      const resultData = await Promise.all(data);
      this.setState({ data: resultData, loading: false });
    } catch (err) {
      console.log(err);
    }
  };

  getData = item => {
    return new Promise(async function(resolve, reject) {
      try {
        let web3 = await getWeb3();
        let arweave = await getArweave();
        let url = web3.utils.hexToUtf8(item.imgAndTextData);
        const transaction = await arweave.transactions.get(url);
        let x = JSON.parse(
          transaction.get("data", { decode: true, string: true })
        );
        let valueRequest = web3.utils.fromWei(item.valueRequest);
        let valueFunded = web3.utils.fromWei(item.valueFunded);
        let valueBalance = web3.utils.fromWei(item.balanceDonate);
        resolve({
          id: item.id,
          owner: item.owner,
          imgData: x.imgData,
          description: x.description,
          valueRequest,
          valueFunded,
          valueBalance
        });
      } catch (err) {
        resolve({
          imgData: "pending",
          description: "pending",
          value: "pending"
        });
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container justify="center" alignContent="center" direction="column">
        <Typography className={classes.heading} align="center">
          Crypto Animal Rescue
        </Typography>

        <Typography align="center" className={classes.subheader}>
          The Crypto Animal Rescue is a dApp for donate for animals cause using
          Arweave storage with Ethereum Smart Contracts, we build this because
          we love animals and the crypto community always can help
        </Typography>
        <Grid
          container
          justify="center"
          alignContent="center"
          alignItems="center"
          direction="row"
        >
          {this.state.loading ? (
            <p>loading</p>
          ) : (
            this.state.data.map((item, i) => (
              <DonateCard
                key={i}
                item={item}
                userAddress={this.state.ethereumAddress}
              />
            ))
          )}
        </Grid>
        <Dialog open={this.state.modal}>
          <DialogContent>
            <Grid container justify="center">
              {this.state.waitingAuth && (
                <Typography>Check your wallet and autorize the dApp</Typography>
              )}
              {this.state.notAuthorize && (
                <Typography>
                  You need autorize the dApp in your Ethereum wallet, refresh to
                  try again :)
                </Typography>
              )}
              {this.state.noWeb3 && (
                <Typography>
                  You need a Ethereum Provider, we recomend you Metamask
                </Typography>
              )}
              {this.state.wrongNetwork && (
                <Typography>Please connect with the Rinkeby Testnet</Typography>
              )}
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    );
  }
}

export default withStyles(classes)(Home);
