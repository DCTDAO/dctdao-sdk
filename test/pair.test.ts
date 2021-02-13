import { ChainId, Token, Pair, TokenAmount, WRAPPED, Price } from '../src'

describe('Pair', () => {
  const tka = new Token(ChainId.MOONBEAM_TEST, '0x6bf5b6F9b59DF885bD241304C902C5bF7d816fbd', 18, 'tka', 'tka')
  const tkb = new Token(ChainId.MOONBEAM_TEST, '0x9745800493fC45ad2Dd122Dc267FB5eAd3e3D1f2', 18, 'tkb', 'tkb')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(tka, '100'), new TokenAmount(WRAPPED[ChainId.RINKEBY], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(tka, tkb)).toEqual('0x57721afA24ce2464f18079487342D1807211Dd43')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(tka, '100'), new TokenAmount(tkb, '100')).token0).toEqual(tka)
      expect(new Pair(new TokenAmount(tkb, '100'), new TokenAmount(tka, '100')).token0).toEqual(tka)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(tkb, '100'), new TokenAmount(tka, '100')).token1).toEqual(tkb)
      expect(new Pair(new TokenAmount(tka, '100'), new TokenAmount(tkb, '100')).token1).toEqual(tkb)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(tkb, '100'), new TokenAmount(tka, '101')).reserve0).toEqual(
        new TokenAmount(tka, '101')
      )
      expect(new Pair(new TokenAmount(tka, '101'), new TokenAmount(tkb, '100')).reserve0).toEqual(
        new TokenAmount(tka, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(tkb, '100'), new TokenAmount(tka, '101')).reserve1).toEqual(
        new TokenAmount(tkb, '100')
      )
      expect(new Pair(new TokenAmount(tka, '101'), new TokenAmount(tkb, '100')).reserve1).toEqual(
        new TokenAmount(tkb, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(tkb, '101'), new TokenAmount(tka, '100')).token0Price).toEqual(
        new Price(tka, tkb, '100', '101')
      )
      expect(new Pair(new TokenAmount(tka, '100'), new TokenAmount(tkb, '101')).token0Price).toEqual(
        new Price(tka, tkb, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(tkb, '101'), new TokenAmount(tka, '100')).token1Price).toEqual(
        new Price(tkb, tka, '101', '100')
      )
      expect(new Pair(new TokenAmount(tka, '100'), new TokenAmount(tkb, '101')).token1Price).toEqual(
        new Price(tkb, tka, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(tkb, '101'), new TokenAmount(tka, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(tka)).toEqual(pair.token0Price)
      expect(pair.priceOf(tkb)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WRAPPED[ChainId.MOONBEAM_TEST])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(tkb, '100'), new TokenAmount(tka, '101')).reserveOf(tkb)).toEqual(
        new TokenAmount(tkb, '100')
      )
      expect(new Pair(new TokenAmount(tka, '101'), new TokenAmount(tkb, '100')).reserveOf(tkb)).toEqual(
        new TokenAmount(tkb, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(tka, '101'), new TokenAmount(tkb, '100')).reserveOf(WRAPPED[ChainId.MOONBEAM_TEST])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(tkb, '100'), new TokenAmount(tka, '100')).chainId).toEqual(ChainId.MOONBEAM_TEST)
      expect(new Pair(new TokenAmount(tka, '100'), new TokenAmount(tkb, '100')).chainId).toEqual(ChainId.MOONBEAM_TEST)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(tkb, '100'), new TokenAmount(tka, '100')).involvesToken(tkb)).toEqual(true)
    expect(new Pair(new TokenAmount(tkb, '100'), new TokenAmount(tka, '100')).involvesToken(tka)).toEqual(true)
    expect(
      new Pair(new TokenAmount(tkb, '100'), new TokenAmount(tka, '100')).involvesToken(WRAPPED[ChainId.MOONBEAM_TEST])
    ).toEqual(false)
  })
})
