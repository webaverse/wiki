import '../styles/globals.css'
import '../styles/voucher.css'
import { AccountProvider, AccountContext } from '../src/hooks/web3AccountProvider';

const Providers = ({children}) => {
  return (
    <AccountProvider>
      {children}
    </AccountProvider>
  );
};

function MyApp({ Component, pageProps }) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  ) 
}

export default MyApp
