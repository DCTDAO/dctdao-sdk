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
  public readonly symbol?: string
  public readonly name?: string

  /**
   * The only instance of the base class `Currency`.
   */
  //public static readonly BASE_CURRENCY: 
  public static readonly BASE_CURRENCY = {
    [ChainId.MAINNET]: new Currency(18, 'ETH', 'Ether'), 
    [ChainId.MOONBEAM_TEST]: new Currency(18, 'GLMR', 'Glimmer'),
    [ChainId.BINANCE_TEST]: new Currency(8, 'BNB', 'Binance Coin'),
  }

  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.BASE_CURRENCY`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  protected constructor(decimals: number, symbol?: string, name?: string) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8)

    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }
}


const BASE_CURRENCY = Currency.BASE_CURRENCY
export { BASE_CURRENCY }
