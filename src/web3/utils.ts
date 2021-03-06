import React from 'react';
import BigNumber from 'bignumber.js';
import memoize from 'lodash/memoize';

import { TokenMeta } from 'web3/types';
import { USDCTokenMeta } from 'web3/contracts/usdc';
import { DAITokenMeta } from 'web3/contracts/dai';
import { SUSDTokenMeta } from 'web3/contracts/susd';
import { UNISWAPTokenMeta } from 'web3/contracts/uniswap';
import { BONDTokenMeta } from 'web3/contracts/bond';

export const MAX_UINT_256 = new BigNumber(2).pow(256).minus(1);
export const ZERO_BIG_NUMBER = new BigNumber(0);

export function getWSRpcUrl(chainId: number = Number(process.env.REACT_APP_WEB3_CHAIN_ID)): string {
  const WEB3_RPC_ID = String(process.env.REACT_APP_WEB3_RPC_ID);

  switch (chainId) {
    case 1:
      return `wss://mainnet.infura.io/ws/v3/${WEB3_RPC_ID}`;
    case 4:
      return `wss://rinkeby.infura.io/ws/v3/${WEB3_RPC_ID}`;
    default:
      throw new Error(`Not supported chainId=${chainId}.`);
  }
}

export function getHttpsRpcUrl(chainId: number = Number(process.env.REACT_APP_WEB3_CHAIN_ID)): string {
  const WEB3_RPC_ID = String(process.env.REACT_APP_WEB3_RPC_ID);

  switch (chainId) {
    case 1:
      return `https://mainnet.infura.io/v3/${WEB3_RPC_ID}`;
    case 4:
      return `https://rinkeby.infura.io/v3/${WEB3_RPC_ID}`;
    default:
      throw new Error(`Not supported chainId=${chainId}.`);
  }
}

export function getEtherscanTxUrl(
  txHash: string,
  chainId: number = Number(process.env.REACT_APP_WEB3_CHAIN_ID),
): string {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/tx/${txHash}`;
    case 4:
      return `https://rinkeby.etherscan.io/tx/${txHash}`;
    default:
      throw new Error(`Not supported chainId=${chainId}.`);
  }
}

export function getEtherscanAddressUrl(
  address: string,
  chainId: number = Number(process.env.REACT_APP_WEB3_CHAIN_ID),
): string {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/address/${address}`;
    case 4:
      return `https://rinkeby.etherscan.io/address/${address}`;
    default:
      throw new Error(`Not supported chainId=${chainId}.`);
  }
}

export function getNetworkName(chainId: number | undefined): string {
  switch (chainId) {
    case 1:
      return 'Mainnet';
    case 4:
      return 'Rinkeby';
    default:
      return '-';
  }
}

export function getExponentValue(decimals: number = 0): BigNumber {
  return new BigNumber(10).pow(decimals);
}

export function getHumanValue(value?: BigNumber, decimals: number = 0): BigNumber | undefined {
  return value?.div(getExponentValue(decimals));
}

export function getNonHumanValue(value: BigNumber | number, decimals: number = 0): BigNumber {
  return (new BigNumber(value)).multipliedBy(getExponentValue(decimals));
}

export function formatBigValue(value?: BigNumber, decimals: number = 4, defaultValue: string = '-', minDecimals: number | undefined = undefined): string {
  return value ? new BigNumber(value.toFixed(decimals)).toFormat(minDecimals) : defaultValue;
}

export function formatUSDValue(value?: BigNumber, decimals: number = 2, minDecimals: number = decimals): string {
  if (value === undefined) {
    return '-';
  }

  const val = BigNumber.isBigNumber(value) ? value : new BigNumber(value);
  const formattedValue = formatBigValue(val.abs(), decimals, '-', minDecimals);

  return val.isPositive() ? `$${formattedValue}` : `-$${formattedValue}`;
}

export function formatBONDValue(value?: BigNumber): string {
  return formatBigValue(value, 4);
}

export function shortenAddr(addr: string, first: number = 6, last: number = 4) {
  return [String(addr).slice(0, first), String(addr).slice(-last)].join('...');
}

export function getTokenMeta(tokenAddr: string): TokenMeta | undefined {
  switch (tokenAddr.toLowerCase()) {
    case USDCTokenMeta.address:
      return USDCTokenMeta;
    case DAITokenMeta.address:
      return DAITokenMeta;
    case SUSDTokenMeta.address:
      return SUSDTokenMeta;
    case UNISWAPTokenMeta.address:
      return UNISWAPTokenMeta;
    case BONDTokenMeta.address:
      return BONDTokenMeta;
    default:
      return undefined;
  }
}

export enum PoolTypes {
  STABLE = 'stable',
  UNILP = 'unilp',
  BOND = 'bond',
}

export const getPoolIcons = memoize((poolType: PoolTypes): React.ReactNode[] => {
  switch (poolType) {
    case PoolTypes.STABLE:
      return [
        USDCTokenMeta.icon,
        DAITokenMeta.icon,
        SUSDTokenMeta.icon,
      ];
    case PoolTypes.UNILP:
      return [
        UNISWAPTokenMeta.icon,
      ];
    case PoolTypes.BOND:
      return [
        BONDTokenMeta.icon,
      ];
    default:
      return [];
  }
});

export const getPoolNames = memoize((poolType: PoolTypes): string[] => {
  switch (poolType) {
    case PoolTypes.STABLE:
      return [
        USDCTokenMeta.name,
        DAITokenMeta.name,
        SUSDTokenMeta.name,
      ];
    case PoolTypes.UNILP:
      return [
        UNISWAPTokenMeta.name,
      ];
    case PoolTypes.BOND:
      return [
        BONDTokenMeta.name,
      ];
    default:
      return [];
  }
});
