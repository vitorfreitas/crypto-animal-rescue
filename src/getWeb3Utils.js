import Web3 from'web3'
import contractABI from './contractABI.json'
import Arweave from 'arweave/web';

const getWeb3 = () => {
    return new Promise(async (resolve, reject) => {  
        if(!window.ethereum && !window.web3){
            reject('NO_WEB3')
        } else if (window.ethereum) {
            const web3  = new Web3(window.ethereum);
            try{
              await window.ethereum.enable()
              resolve(web3)
            } catch(err){
              reject('USER_DENY')
            }          
        } else if (window.web3) {
            const web3 = new Web3(window.web3.currentProvider);
            resolve(web3)
        } else {
            reject('ERROR')
        }
})}

const getContract = async () => {
    const web3 = await getWeb3();
    const contract = new web3.eth.Contract(contractABI, "0xd583d58f24c5083577f0b51521bd16414d6180fd")
    return contract
}

const getArweave = () => {
    const arweave = Arweave.init({
        host: 'arweave.net',// Hostname or IP address for a Arweave node
        port: 80,           // Port, defaults to 1984
        protocol: 'https',  // Network protocol http or https, defaults to http
        timeout: 20000,     // Network request timeouts in milliseconds
        logging: false,     // Enable network request logging
    });
    return arweave
}

export{
    getWeb3,
    getArweave,
    getContract
}
