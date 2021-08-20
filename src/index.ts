import { BigNumber, ethers } from 'ethers';

export interface IWeb3Store {
  signer?: any;
  chainId: string;
  network: string;
  accounts: any;
  balance: string;
  defaultNetwork: string;
  isInitialized: boolean;
}

export class Web3Store implements IWeb3Store {
  chainId = '';
  network = '';
  signer: any;
  isInitialized = false;
  accounts = [];
  ethersProvider = this._getProvider();
  balance = "0";
  defaultNetwork = "mainnet";
  ethers: any;

  _getProvider() {
    if (window.ethereum !== undefined) {
      return new ethers.providers.Web3Provider(window.ethereum, 'any');
    } else {
      return ethers.providers.getDefaultProvider(this.defaultNetwork);
    }

  }

  convertEthToWEI = (ethToConvert: string): ethers.BigNumber => {
    return ethers.utils.parseEther(ethToConvert);
  }
  isConnected = (): boolean => {
    return this.accounts.length > 0;
  }
  convertWEIToETH = (weiToConvert: string): string => {
    return ethers.utils.formatUnits(weiToConvert);
  }
  getAddress = (): string => {
    return this.accounts[0];
  }
  initializeWeb3 = async (): Promise<void> => {
    window.ethereum.autoRefreshOnNetworkChange = false;
    await this.refreshNetworkDetails();
  }
  resetUser = (): void => {
    this.accounts = [];
  }
  setDefaultNetwork = (newDefaultNetwork: string): void => {
    this.defaultNetwork = newDefaultNetwork;
  }

  refreshChainId = async (): Promise<void> => {
    try {
      this.chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      this.network = getNetworkName(this.chainId);
    } catch (err) {
      console.error(err);
    }


  }
  refreshNetworkDetails = async (): Promise<void> => {
    await this.refreshAccounts();
    await this.refreshChainId();
  }
  getCurrentBalance = async (): Promise<ethers.BigNumber> => {
    const bal = await this.ethersProvider.getBalance(this.accounts[0]);
    const balToReturn = ethers.utils.formatEther(bal);
    return ethers.BigNumber.from(balToReturn);
  }
  refreshAccounts = async (): Promise<string> => {
    const tempAccounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    this.accounts = tempAccounts;
    return tempAccounts[0];
  }
  isMetaMaskConnected = (): boolean => {
    return this.accounts && this.accounts.length > 0;
  }
}

export const web3Store = new Web3Store()


const getNetworkName = (chainId: string) => {
  switch (chainId) {
    case '1':
      return 'Ethereum - MainNet';
    case '3':
      return 'Ethereum - Ropsten';
    case '42':
      return 'Ethereum - Kovan';
    case '4':
      return 'Ethereum - Rinkeby';
    case '97':
      return 'BSC - Testnet';
    case '56':
      return 'BSC - MainNet';
    default:
      return '';
  }
}