import Nprogress from 'nprogress';
import Page from '../components/Page';
import '../components/styles/nprogress.css';
import Router from 'next/router';
import { ApolloProvider } from "@apollo/client"
import withData from '../lib/withData';
import { CartStateProvider } from '../lib/cartState'

Router.events.on('routeChangeStart', () => Nprogress.start());
Router.events.on('routeChangeComplete', () => Nprogress.done());
Router.events.on('routeChangeError', () => Nprogress.start());

function MyApp({ Component, pageProps, apollo  }) {
  //console.log(apollo)
  return (
  <ApolloProvider client={apollo}>
    <CartStateProvider>
    <Page>
      <Component {...pageProps} />
    </Page>
    </CartStateProvider>
  </ApolloProvider>
  );
}

MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if(Component.getInitialProps){
    pageProps = await Component.getInitialProps(ctx)

  }
  pageProps.query = ctx.query;
  return {pageProps}
}
export default withData(MyApp);