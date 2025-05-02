import {  useEffect, useState } from "react"
import { Wallet } from "./components/Wallet"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {  LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import CustomInput from "./components/CustomInput"
function App() {
  const {connection} = useConnection()
  const {wallet, publicKey, sendTransaction, connected} = useWallet()
  const [recvpubkey, setRecvpubkey] = useState("")
  const [sendAmt, setSendAmt] = useState("")
  const [loading, setLoading] = useState(false)
  const [airDropAmt, setAirDropAmt] = useState("")
  
  useEffect(()=>{
    console.log("wallet", wallet)
    console.log("conn", connection)
  }, [wallet, connection])

  useEffect(()=>{
    console.log("Pub ", publicKey)
  }, [publicKey])

  const reqAirdrop = async()=>{
    if(!publicKey || !airDropAmt) return
    setLoading(true)
    connection.requestAirdrop(publicKey, parseFloat(airDropAmt)*LAMPORTS_PER_SOL)
    .then((ad)=>{
    console.log({
      signature:ad
    })
    connection.getTransaction(ad)
    .then((something)=>{
      if(something?.meta?.err){
        alert("Please check amt of airdrop")
        return
      }
      console.log("Transaction response", something)
      alert("Airdropped")
    })
    .catch((er)=>{
      console.log("Fail", er)
    })
    .finally(()=>{
      setLoading(false)
    })
  }
  
  )
    .catch((err)=>{
      alert("Sorry Airdrop not working")
      console.log(err)
    })
    .finally(()=>{
      setLoading(false)
    })
  }


  const viewBalClick =async ()=>{
    if(!publicKey) return
    setLoading(true)
    const bal = await connection.getBalance(publicKey)
    alert("Bal is "+ bal/1e9+" SOL") 
    setLoading(false)
  }

  const sendSomeSOL = async ()=>{
    if(!publicKey) return
    setLoading(true)
   try {
     const transaction = new Transaction().add(
       SystemProgram.transfer(
       {
         fromPubkey: publicKey,
         toPubkey: new PublicKey(recvpubkey),
         lamports:parseFloat(sendAmt) * LAMPORTS_PER_SOL
 
       }
     ))
     console.log("Transaction", transaction)
     const {
       context:{slot: minContextSlot},
     } = await connection.getLatestBlockhashAndContext()
 
     const signature = await sendTransaction(transaction, connection, {
       minContextSlot
     })
     console.log("Signature", signature)
     setRecvpubkey("")
     setSendAmt("")
     alert("Sent some SOL")
   } catch (error) {
    console.log("error", error)
   }
   finally{
    setLoading(false)
   }
  }
  return (
    <div style={{height:"100vh",backgroundColor:"black", }}>
      {/* @ts-expect-error marquee-tag-not-available-in-JSX */}
      <marquee style={{color:"white", marginTop:"5px"}}>Every Transaction happens on Solana Devnet here, so please connect to a DevNet wallet</marquee>
      <div style={{ padding:"20px"}}>

    <div style={{display:"flex", justifyContent:"end", alignItems:"center", gap:"10px",marginBottom:"15px"}}>
      <Wallet/>
      
    </div>
<div style={{display:"flex", flexDirection:"column", gap:"30px"}}>
    <div>
  
    <button disabled={!connected || loading} onClick={viewBalClick}>
        View Balance on Devnet
      </button>
    </div>
    <div>
    <CustomInput value={recvpubkey} onChange={(e)=>{setRecvpubkey(e.target.value)}} placeholder="Enter Receiver Address"/>
    <CustomInput value={sendAmt} onChange={(e)=>{setSendAmt(e.target.value)}} placeholder="Enter SOL"/>
      <button disabled={!connected || loading} onClick={sendSomeSOL}>
      Send Some SOL
      </button>
    </div>
    <div>

    <CustomInput value={airDropAmt} onChange={(e)=>{setAirDropAmt(e.target.value)}} placeholder="Enter SOL to AirDrop"/>
      <button disabled={!connected || loading} onClick={reqAirdrop}>
        Request Airdop
      </button>
    </div>
</div>
</div>

    </div>
  )
}

export default App


