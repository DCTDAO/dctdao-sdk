import JSBI from 'jsbi'
import { ChainId } from '../constants'

import { SolidityType } from '../constants'
import { validateSolidityTypeInstance } from '../utils'

/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
export class Currency {
  public readonly decimals: number
  public readonly symbol: string
  public readonly name: string
  public readonly chainId: ChainId

  /**
   * The only instance of the base class `Currency`.
   */
  //public static readonly BASE_CURRENCY: 
  public static readonly BASE_CURRENCY = {
    [ChainId.MAINNET]: new Currency(ChainId.MAINNET, 18, 'ETH', 'Ether'), 
    [ChainId.ROPSTEN]: new Currency(ChainId.ROPSTEN, 18, 'ETH', 'Ether'),
    [ChainId.MOONBEAM_TEST]: new Currency(ChainId.MOONBEAM_TEST, 18, 'GLMR', 'Glimmer'),
    [ChainId.BINANCE_TEST]: new Currency(ChainId.BINANCE_TEST, 18,'BNB', 'Binance Coin'),
    [ChainId.OPERA_TEST]: new Currency(ChainId.OPERA_TEST, 18, 'FTM', 'Fantom'),
    [ChainId.AVAX_TEST]: new Currency(ChainId.AVAX_TEST, 18, 'AVAX','Avalanche'),
    [ChainId.AVAX]: new Currency(ChainId.AVAX, 18, 'AVAX','Avalanche')
  }

  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.BASE_CURRENCY`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   * @param chainId of the currency
   */
  protected constructor(chainId: ChainId, decimals: number, symbol: string, name: string) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8)

    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.chainId = chainId
  }
}


const BASE_CURRENCY = Currency.BASE_CURRENCY
export { BASE_CURRENCY }
