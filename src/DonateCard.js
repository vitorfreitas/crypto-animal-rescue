import React from 'react'
import {Grid, Typography, Paper, TextField, Button, Dialog, DialogContent} from '@material-ui/core'
import Web3 from 'web3'
import contractABI from './contractABI.json'
import { Redirect } from 'react-router-dom'
import { getWeb3, getContract } from './getWeb3Utils.js';

class DonateCard extends React.Component{
    state = {
        valueDonate:'',
        checkYourWallet:false,
        confirmDonate:false,
        modal:false
    }
    change = e => {
        this.setState({
          [e.target.name]: e.target.value
        });
    };  

    donateNow = async() => {
        try{
            this.setState({modal:true})
            let contract = await getContract()
            const wei = await Web3.utils.toWei(this.state.valueDonate, 'ether')
            contract.methods.donateValue(this.props.item.id).send({from:this.props.userAddress, value:wei},
                (err, transactionId) =>{
                    if(err) {
                        this.setState({modal:false})
                        return console.log(err)
                    }
                    console.log(transactionId)
                    this.setState({confirmDonate:true})
                    return
            })
        }catch(err){
            this.setState({modal:false})
            alert('Something Wrong')
        }
    }

    withdrawn = async () => {
        try{
            if(this.props.item.valueBalance == 0){
                alert('No Balance')
                return
            }
            this.setState({modal:true})
            let contract = await getContract()
            contract.methods.withdrawnDonate(this.props.item.id).send({from:this.props.userAddress},
                (err, transactionId) =>{
                    if(err){
                        console.log(err)
                        this.setState({modal:false})
                        alert('Something wrong')
                        return
                    }else {
                        console.log(transactionId)
                        this.setState({confirmDonate:true})
                        return
                    }
                })
        }catch(err){
            console.log(err)
            this.setState({modal:false})
            alert('Something wrong')
        }
    }

    donateOrwith = () => {
        const {item} = this.props
        if(item.owner === this.props.userAddress){
            return(
            <Grid container style={{paddingTop:15}} justify="center" direction="column">
                <Typography align="center" style={{paddingBottom:5}}>Available Balance: {item.valueBalance} ETH</Typography>
                <Button onClick={this.withdrawn} variant="contained">WITHDRAW</Button>
            </Grid>
            )
        }else{
            return(
            <Grid container style={{paddingTop:15}} justify="center" direction="row">
            <Grid item>
        <TextField
        style={{width:100, heigth:5, padding:0}}
            value={this.state.valueDonate}
            type="number"         
            margin="normal"
            variant="filled"
            name="valueDonate"
            onChange={e => this.change(e)}
        />
        </Grid>
        <Grid item>
        <Button style={{marginTop:25}} variant="contained" onClick={this.donateNow}>Donate Now</Button>
        </Grid>
        </Grid>
            )
        }
    }

    render() {
        if(this.state.confirmDonate) return <Redirect to="/newhelpconfirm"/>
        const {item}  = this.props
        if(item.description == 'pending') return null
        return(
        <Grid container  style={{width:300, height:400,minHeight:400, margin:20}} direction="column">
        <Paper elevation={10} style={{height:'100%',     position: 'relative'}}>
            <img src={item.imgData} style={{width:300, heigth:250}}/>
            <Typography style={{padding:10}}>{item.description}</Typography>
            <Grid container justify="center" alignContent="center" style={{bottom:0, position:'absolute'}}>
                <Typography>Value Request: {item.valueRequest} ETH</Typography>
                <Typography>Value Filled: {item.valueFunded} ETH</Typography>

                {this.donateOrwith()}

            </Grid>
        </Paper>
        <Dialog open={this.state.modal}>
        <DialogContent>
            <Typography align="center" style={{padding:10}}>Check your Wallet</Typography>
        </DialogContent>
        </Dialog>
        </Grid>
    )}
}

export default DonateCard