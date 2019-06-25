import React from 'react'
import Web3 from 'web3'
import Arweave from 'arweave/web';
import { Grid, Typography, Button, TextField, Dialog, DialogContent } from '@material-ui/core';
import contractABI from './contractABI.json'
import { Redirect } from 'react-router-dom'
import { getContract } from './getWeb3Utils.js';

const arweave = Arweave.init({
    host: 'arweave.net',// Hostname or IP address for a Arweave node
    port: 80,           // Port, defaults to 1984
    protocol: 'https',  // Network protocol http or https, defaults to http
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
});

class NewAnimalHelp extends React.Component{
    state = {
        baseImg:'',
        walletData:'',
        arwAddress:'',
        description:'this is the description',
        txDataId:'',
        donateRequest:'0.1',
        notAuthorize: false,
        noWeb3: false,
        waitingAuth: false,
        ethereumAddress: '',
        loginTrue: false,
        NewHelpConfirm:false,
        modal:false
    }

    componentDidMount(){
        this.loadWallet()
    }

    async loadWallet() {
        this.setState({ notAuthorize: false })
        let accounts
        if (!window.ethereum && !window.web3) {
          return this.setState({ noWeb3: true })
        } else if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          try {
            this.setState({ waitingAuth: true })
            await window.ethereum.enable()
            accounts = await web3.eth.getAccounts()
            return this.setState({ ethereumAddress: accounts[0], waitingAuth: false })
          } catch (err) {
            return this.setState({ notAuthorize: true, waitingAuth: false })
          }
        } else if (window.web3) {
          const web3 = new Web3(window.web3.currentProvider)
          accounts = await web3.eth.getAccounts()
          return this.setState({ ethereumAddress: accounts[0], waitingAuth: false })
        } else {
          return this.setState({ notAuthorize: true, waitingAuth: false })
        }
    }

    getContratData = async() => {
        const wei = await Web3.utils.toWei(this.state.donateRequest, 'ether')
        const hexdata = await Web3.utils.toHex(this.state.txDataId)
        console.log(hexdata)
        return { wei, hexdata }
    }

    sendDataArweave = async() => {
      try{
        this.setState({modal:true})
        const data = JSON.stringify({
          imgData:this.state.baseImg,
          description:this.state.description
        })
     
        let transaction = await arweave.createTransaction({
            data
        }, this.state.walletData);
        await arweave.transactions.sign(transaction, this.state.walletData);
        console.log(transaction.id)
        this.setState({txDataId:transaction.id})
        const response = await arweave.transactions.post(transaction);
        let contract = await getContract()
        const { wei, hexdata } = await this.getContratData()
        const dataResult = {
          imgAndTextData:hexdata,
          valueRequest:wei
        }
        console.log(dataResult)
        contract.methods.newDonate(dataResult).send({from:this.state.ethereumAddress},
            (err, transactionId) =>{
                if(err) console.log(err)
                console.log(transactionId)
                this.setState({NewHelpConfirm:true})
                return
        })
      }catch(err){
        console.log(err)
        this.setState({modal:false})
        alert('Something Wrong')

      }
     
        
    }

    handleImageUpload = async (e) => {
        let baseImg = await this.readAsBase(e.target.files[0])
        this.setState({baseImg})
    }
    
    readAsBase = (fileInput) => {
        const readAsDataURL = (fileInput) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => {
              reader.abort();
              reject(new Error("Error reading file."));
            };
            reader.addEventListener("load", () => {
              resolve(reader.result);
            }, false);
            reader.readAsDataURL(fileInput);
          });
        };      
        return readAsDataURL(fileInput);
    }
    
    handleWalletUpload = async (e) => {
        const walletTxt = await this.readWallet(e.target.files[0])
        const wallet = JSON.parse(walletTxt)
        const address = await arweave.wallets.jwkToAddress(wallet)
        this.setState({walletData:wallet, arwAddress:address})
    }
    
    readWallet = (fileInput) => {
        const readAsDataURL = (fileInput) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => {
              reader.abort();
              reject(new Error("Error reading file."));
            };
            reader.addEventListener("load", () => {
              resolve(reader.result);
            }, false);
            reader.readAsText(fileInput);
          });
        };
        return readAsDataURL(fileInput);
    }

    change = e => {
      this.setState({
        [e.target.name]: e.target.value
      });
    };    

    render(){
      if(this.state.NewHelpConfirm){
        return (
        <Grid container justify="center" alignContent="center">
        <Typography align="center" style={{padding:20}} variant="h5">You new request is sucessfull send, wait the confirmation in Arweave and Ethereum</Typography>
        </Grid>
        )
      }
        return(
            <Grid container justify="center" alignContent='center' direction="column">
            <Grid style={{padding:10}}>
                <Typography>Upload you Arweave Wallet</Typography>
                <input type="file" onChange={this.handleWalletUpload} />
            </Grid>
            <Grid style={{padding:10}}>
                <Typography>Upload the image of animals</Typography>
                <input type="file" onChange={this.handleImageUpload} />
            </Grid>
            <Grid>
                <Typography>Description</Typography>
                <TextField
                multiline
                rows="4"
                margin="normal"
                variant="filled"
                name="description"
                value={this.state.description}
                onChange={e => this.change(e)}

              />
            </Grid>
            <Grid>
                <Typography>Value Request(ETH)</Typography>
                <TextField
                    value={this.state.donateRequest}
                    type="number"         
                    margin="normal"
                    variant="filled"
                    name="donateRequest"
                    onChange={e => this.change(e)}
                  />
            </Grid>
            <Dialog open={this.state.modal}>
        <DialogContent>
            <Typography align="center" style={{padding:10}}>{this.state.tx ? 'Loading' : 'Check your Wallet'}</Typography>
        </DialogContent>
        </Dialog>
            <Button variant="contained" onClick={this.sendDataArweave}>Deploy</Button>
            </Grid>
        )
    }

}

export default NewAnimalHelp