import HDNode from "avalanche/dist/utils/hdnode"  
import { Avalanche, Mnemonic, Buffer } from "avalanche"  
import { EVMAPI, KeyChain } from "avalanche/dist/apis/evm"  
import { ethers } from "ethers"  
  
const ip: string = "api.avax-test.network"  
const port: number = 443  
const protocol: string = "https"  
const networkID: number = 5  
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)  
const cchain: EVMAPI = avalanche.CChain()  
  
const mnemonic: Mnemonic = Mnemonic.getInstance()  
const m: string =  
 "chimney asset heavy ecology accuse window gold weekend annual oil emerge alley retreat rabbit seed advance define off amused board quick wealth peasant disorder"  
const seed: Buffer = mnemonic.mnemonicToSeedSync(m)  
const hdnode: HDNode = new HDNode(seed)  
  
const keyChain: KeyChain = cchain.newKeyChain()  
  
const cAddresses: string[] = []  
  
for (let i: number = 0; i <= 2; i++) {  
 const child: HDNode = hdnode.derive(`m/44'/60'/0'/0/${i}`)  
 keyChain.importKey(child.privateKey)  
 const cchainAddress = ethers.utils.computeAddress(child.privateKey)  
 cAddresses.push(cchainAddress)  
}  
console.log(cAddresses)  
// [  
// '0x2d1d87fF3Ea2ba6E0576bCA4310fC057972F2559',  
// '0x25d83F090D842c1b4645c1EFA46B15093d4CaC7C',  
// '0xa14dFb7d8593c44a47A07298eCEA774557036ff3'  
// ]  