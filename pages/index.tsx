import { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { GetServerSideProps } from 'next'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

interface Wallet {
    address: string
    bagsHeld: string
}

interface HomeProps {
    wallets: Wallet[]
}

const Home: NextPage<HomeProps> = ({wallets}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Loot Whales</title>
        <meta name="description" content="A table of Loot whales" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐳</text></svg>"></link>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
            🐳 Loot Whales
        </h1>
        <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Address</th>
                        <th>Bags Held</th>
                    </tr>
                </thead>
                <tbody>
                {wallets.map((wallet, index) => {
                    return (<tr key={wallet.address}>
                        <td>{index + 1}</td>
                        <td>{getExplorerAddressLink(wallet.address)}</td>
                        <td>{wallet.bagsHeld}</td>
                    </tr>)
                })}
                </tbody>
            </table>
      </main>
    </div>
  )
}

/** Create a link to Etherscan for the provided address
 * Inspired by the deprecated `getExplorerAddressLink` from usedapp
 * @link https://usedapp.readthedocs.io/en/latest/core.html#getexploreraddresslink-deprecated
 **/
function getExplorerAddressLink(address: string): JSX.Element {
    const ETHERSCAN_BASE_URL = "https://etherscan.io/address/"
    return <a href={`${ETHERSCAN_BASE_URL}/${address}`} >{address}</a>

}

export const getServerSideProps: GetServerSideProps = async () => {
    const subgraph = 'https://api.thegraph.com/subgraphs/name/shahruz/loot'
    const client = new ApolloClient({
        uri: subgraph,
        cache: new InMemoryCache()
    });

    const { data } = await client.query({
        query: gql`
            {
                wallets(first: 25, orderBy: bagsHeld, orderDirection: desc) {
                    address
                    bagsHeld
                }
            }
        `
      });
    console.log(data)

    // HACKHACK remove type assertion
    return { props: { wallets: data.wallets as Wallet[]} }
  }

export default Home
