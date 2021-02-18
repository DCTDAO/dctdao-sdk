import { ChainId, Token, Pair, TokenAmount, WGLMR, Price } from '../src'

describe('Pair', () => {
  const DCA = new Token(ChainId.MOONBEAM_TEST, '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24', 18, 'DCA', 'DCA Token')
  const DCB = new Token(ChainId.MOONBEAM_TEST, '0xCfEB869F69431e42cdB54A4F4f105C19C080A601', 18, 'DCB', 'DCB Token')
  
  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(DCA, '100'), new TokenAmount(WGLMR[ChainId.MAINNET], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })
  
  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(DCA, DCB)).toEqual('0xEe10377A195FC858a8812f0048654D187F62F241')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(DCA, '100'), new TokenAmount(DCB, '100')).token0).toEqual(DCA)
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).token0).toEqual(DCA)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(DCA, '100'), new TokenAmount(DCB, '100')).token1).toEqual(DCB)
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).token1).toEqual(DCB)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '101')).reserve0).toEqual(
        new TokenAmount(DCA, '101')
      )
      expect(new Pair(new TokenAmount(DCA, '101'), new TokenAmount(DCB, '100')).reserve0).toEqual(
        new TokenAmount(DCA, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '101')).reserve1).toEqual(
        new TokenAmount(DCB, '100')
      )
      expect(new Pair(new TokenAmount(DCA, '101'), new TokenAmount(DCB, '100')).reserve1).toEqual(
        new TokenAmount(DCB, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(DCB, '101'), new TokenAmount(DCA, '100')).token0Price).toEqual(
        new Price(DCA, DCB, '100', '101')
      )
      expect(new Pair(new TokenAmount(DCA, '100'), new TokenAmount(DCB, '101')).token0Price).toEqual(
        new Price(DCA, DCB, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(DCB, '101'), new TokenAmount(DCA, '100')).token1Price).toEqual(
        new Price(DCB, DCA, '101', '100')
      )
      expect(new Pair(new TokenAmount(DCA, '100'), new TokenAmount(DCB, '101')).token1Price).toEqual(
        new Price(DCB, DCA, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(DCB, '101'), new TokenAmount(DCA, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DCA)).toEqual(pair.token0Price)
      expect(pair.priceOf(DCB)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WGLMR[ChainId.MOONBEAM_TEST])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '101')).reserveOf(DCB)).toEqual(
        new TokenAmount(DCB, '100')
      )
      expect(new Pair(new TokenAmount(DCA, '101'), new TokenAmount(DCB, '100')).reserveOf(DCB)).toEqual(
        new TokenAmount(DCB, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(DCA, '101'), new TokenAmount(DCB, '100')).reserveOf(WGLMR[ChainId.MOONBEAM_TEST])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).chainId).toEqual(ChainId.MOONBEAM_TEST)
      expect(new Pair(new TokenAmount(DCA, '100'), new TokenAmount(DCB, '100')).chainId).toEqual(ChainId.MOONBEAM_TEST)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).involvesToken(DCB)).toEqual(true)
    expect(new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).involvesToken(DCA)).toEqual(true)
    expect(
      new Pair(new TokenAmount(DCB, '100'), new TokenAmount(DCA, '100')).involvesToken(WGLMR[ChainId.MOONBEAM_TEST])
    ).toEqual(false)
  })

})
