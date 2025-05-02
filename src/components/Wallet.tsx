import { FC, useEffect, useState } from 'react';
import {
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';


// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import { useWallet } from '@solana/wallet-adapter-react';

export const Wallet: FC = () => {
    const {wallet} = useWallet()
    const [disconnectDisabled, setDisconnectDisabled] = useState(false)
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.

    // You can also provide a custom RPC endpoint.
    useEffect(()=>{
        if(wallet) setDisconnectDisabled(false)
        else setDisconnectDisabled(true)
    }, [wallet])
  
    return (<>
       
                    <WalletMultiButton  style={{
                        backgroundColor:"green"
                    }}/>
                    <WalletDisconnectButton style={{
                        backgroundColor:!disconnectDisabled?"red":"gray"
                    }}/>
    </>
            
    );
};